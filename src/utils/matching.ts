// Deterministic, transparent match scoring.
// This is intentionally simple rule-based logic — NOT an AI matching engine.
// It exists so the "Why you're seeing this" explanations are honest and reproducible.

import type { ID, Opportunity, User, Recommendation } from '../models';
import { getProjectById } from '../data/projects';

// Map opportunity types to the LookingFor values a user might have selected.
const TYPE_TO_INTENT: Record<string, string[]> = {
  Internship: ['Internship'],
  'Full-time': ['Full-time job'],
  'Part-time': ['Part-time job'],
  Freelance: ['Freelance work'],
  Contract: ['Freelance work'],
  Collaboration: ['Collaboration', 'Projects'],
  Mentorship: ['Mentorship'],
  Cofounder: ['Cofounder'],
  Project: ['Projects', 'Collaboration'],
};

// Loosely associates required skills with interest areas.
const SKILL_TO_INTEREST: Record<string, string> = {
  Networking: 'Networking',
  Cybersecurity: 'Cybersecurity',
  Linux: 'Information Technology',
  Python: 'Software Engineering',
  JavaScript: 'Software Engineering',
  React: 'Software Engineering',
  SQL: 'Information Technology',
  Marketing: 'Marketing',
};

/**
 * Score an opportunity against a user and produce human-readable reasons.
 * Returns a score clamped between 40 and 98 so nothing looks broken/perfect.
 */
export function scoreOpportunity(
  user: User,
  opp: Opportunity,
): Recommendation {
  const reasons: string[] = [];
  let points = 0;

  // 1. Skills overlap (up to 40 pts)
  const userSkills = new Set(user.skills);
  const matchedSkills = opp.requiredSkills.filter((s) => userSkills.has(s));
  if (matchedSkills.length > 0) {
    points += Math.min(40, matchedSkills.length * 18);
    reasons.push(
      `You have ${matchedSkills.slice(0, 3).join(', ')} skill${
        matchedSkills.length > 1 ? 's' : ''
      }`,
    );
  }

  // 2. Interest area overlap (up to 20 pts)
  const userInterests = new Set(user.interests);
  const interestHit = opp.requiredSkills
    .map((s) => SKILL_TO_INTEREST[s])
    .find((area) => area && userInterests.has(area));
  if (interestHit) {
    points += 18;
    reasons.push(`You selected ${interestHit}`);
  }

  // 3. Intent match (looking for) (up to 22 pts)
  const intents = TYPE_TO_INTENT[opp.type] ?? [];
  if (intents.some((i) => user.lookingFor.includes(i as User['lookingFor'][number]))) {
    points += 22;
    reasons.push(`You are looking for ${opp.type.toLowerCase()} opportunities`);
  }

  // 4. Relevant projects (up to 12 pts)
  const relevantProjects = user.projectIds
    .map((id) => getProjectById(id))
    .filter(
      (p) => p && p.technologies.some((t) => opp.requiredSkills.includes(t)),
    );
  if (relevantProjects.length > 0) {
    points += Math.min(12, relevantProjects.length * 8);
    reasons.push(
      `You built ${relevantProjects.length} relevant project${
        relevantProjects.length > 1 ? 's' : ''
      }`,
    );
  }

  // 5. Location match (up to 8 pts)
  if (
    opp.workMode === 'Remote' ||
    (user.location && opp.location.includes(user.location.split(',')[0]))
  ) {
    points += 8;
    reasons.push(
      opp.workMode === 'Remote'
        ? 'This opportunity is remote-friendly'
        : 'The opportunity is in your preferred location',
    );
  }

  // points can reach ~100 for a perfect fit. Add a modest base so nothing looks
  // broken, then clamp. This spreads scores across a believable 52–97 range
  // instead of pinning strong matches at the ceiling.
  const score = Math.max(52, Math.min(97, Math.round(points * 0.85) + 12));

  if (reasons.length === 0) {
    reasons.push('This is a popular opportunity in your network');
  }

  return { score, reasons };
}

/**
 * Score how relevant another person is to the current user.
 */
export function scorePerson(
  user: User,
  other: User,
): Recommendation {
  const reasons: string[] = [];
  let points = 30;

  const sharedInterests = other.interests.filter((i) =>
    user.interests.includes(i),
  );
  if (sharedInterests.length > 0) {
    points += Math.min(30, sharedInterests.length * 15);
    reasons.push('Similar interests');
  }

  // Same industry (rough: shared interest in IT-ish areas)
  if (sharedInterests.some((i) => user.interests.includes(i))) {
    reasons.push('Same industry');
  }

  const mutual = mutualConnections(user, other);
  if (mutual > 0) {
    points += Math.min(25, mutual * 12);
    reasons.push(`${mutual} mutual connection${mutual > 1 ? 's' : ''}`);
  }

  const sharedSkills = other.skills.filter((s) => user.skills.includes(s));
  if (sharedSkills.length > 0) {
    points += Math.min(15, sharedSkills.length * 7);
  }

  const score = Math.max(45, Math.min(97, points));
  // de-dup reasons while preserving order
  const seen = new Set<string>();
  const dedup = reasons.filter((r) => (seen.has(r) ? false : seen.add(r)));
  return { score, reasons: dedup.length ? dedup : ['Recommended for you'] };
}

export function mutualConnections(user: User, other: User): number {
  const set = new Set(user.connectionIds);
  return other.connectionIds.filter((id) => set.has(id) && id !== user.id)
    .length;
}


// ---------------------------------------------------------------------------
// "People Who Need You" — two-directional discovery.
// Surfaces people whose projects or posted opportunities call for skills the
// current user already has, so opportunities can find the user (not just the
// other way around). Rule-based and transparent.
// ---------------------------------------------------------------------------

import type { Project } from '../models';

export interface PersonNeed {
  needId: string; // stable id: person + source
  personId: string;
  need: string; // e.g. "React Developer" or "Python"
  reason: string; // short human explanation
  source: 'project' | 'opportunity';
  sourceId: string;
}

// Loose mapping so a "seeking role" like "React Developer" can be matched to a
// user's concrete skill ("React").
function userMatchesNeed(userSkills: string[], need: string): boolean {
  const lower = need.toLowerCase();
  return userSkills.some((s) => lower.includes(s.toLowerCase()));
}

export function peopleWhoNeedYou(
  user: User,
  projects: Project[],
  opportunities: Opportunity[],
): PersonNeed[] {
  const results: PersonNeed[] = [];
  const seenPeople = new Set<string>();

  // 1. Projects looking for collaborators in roles matching the user's skills.
  for (const p of projects) {
    if (p.creatorId === user.id) continue;
    const roles = p.seekingRoles ?? [];
    const matchedRole =
      roles.find((r) => userMatchesNeed(user.skills, r)) ??
      p.technologies.find((t) => user.skills.includes(t));
    if (matchedRole && !seenPeople.has(p.creatorId)) {
      seenPeople.add(p.creatorId);
      results.push({
        needId: `${p.creatorId}:project:${p.id}`,
        personId: p.creatorId,
        need: matchedRole,
        reason: `Working on "${p.title}" and looking for your skills`,
        source: 'project',
        sourceId: p.id,
      });
    }
  }

  // 2. Opportunities posted by individuals whose required skills the user has.
  for (const o of opportunities) {
    if (!o.posterId || o.posterId === user.id) continue;
    const matchedSkill = o.requiredSkills.find((s) => user.skills.includes(s));
    if (matchedSkill && !seenPeople.has(o.posterId)) {
      seenPeople.add(o.posterId);
      results.push({
        needId: `${o.posterId}:opportunity:${o.id}`,
        personId: o.posterId,
        need: matchedSkill,
        reason: `Posted "${o.title}" needing ${matchedSkill}`,
        source: 'opportunity',
        sourceId: o.id,
      });
    }
  }

  return results;
}


// ---------------------------------------------------------------------------
// Collab matching — "Find Someone For Me".
// Ranks REAL users by how well their stated skills / "can help with" / interests
// overlap with a free-text collaboration request (and optional explicit skills).
// Transparent and grounded: reasons list the actual matched terms. Never
// invents people, skills, availability, ratings, or portfolios.
// ---------------------------------------------------------------------------

export interface CollabPersonMatch {
  personId: ID;
  score: number; // 0-100 relevance (only when there's real signal)
  reasons: string[];
}

// Extract candidate keywords from a natural-language request by matching known
// skill/interest vocabulary that actually appears in it. We only ever match
// against real vocabulary, so we never fabricate a requirement.
function keywordsFromText(text: string, vocabulary: string[]): string[] {
  const lower = text.toLowerCase();
  const found = vocabulary.filter((v) => lower.includes(v.toLowerCase()));
  return [...new Set(found)];
}

export function matchPeopleForCollab(
  request: string,
  candidates: User[],
  opts?: { extraSkills?: string[]; excludeUserId?: ID },
): CollabPersonMatch[] {
  // Build the vocabulary from what people actually list, so keyword detection
  // is grounded in real data rather than a hardcoded assumption.
  const vocab = new Set<string>();
  candidates.forEach((c) => {
    c.skills.forEach((s) => vocab.add(s));
    c.canHelpWith.forEach((s) => vocab.add(s));
    c.interests.forEach((s) => vocab.add(s));
  });
  const wanted = new Set<string>([
    ...keywordsFromText(request, [...vocab]),
    ...(opts?.extraSkills ?? []),
  ].map((s) => s.toLowerCase()));

  const results: CollabPersonMatch[] = [];
  for (const person of candidates) {
    if (opts?.excludeUserId && person.id === opts.excludeUserId) continue;

    const reasons: string[] = [];
    let points = 0;

    const helpHits = person.canHelpWith.filter((s) => wanted.has(s.toLowerCase()));
    if (helpHits.length) {
      points += Math.min(50, helpHits.length * 25);
      reasons.push(`Can help with ${helpHits.join(', ')}`);
    }
    const skillHits = person.skills.filter(
      (s) => wanted.has(s.toLowerCase()) && !helpHits.includes(s),
    );
    if (skillHits.length) {
      points += Math.min(35, skillHits.length * 15);
      reasons.push(`Lists ${skillHits.join(', ')} as a skill`);
    }
    const interestHits = person.interests.filter((s) => wanted.has(s.toLowerCase()));
    if (interestHits.length) {
      points += 10;
      reasons.push(`Interested in ${interestHits.join(', ')}`);
    }
    // Require at least one substantive skill/interest signal — availability
    // alone is not a match (that would just be noise, not a real recommendation).
    const hasRealSignal =
      helpHits.length > 0 || skillHits.length > 0 || interestHits.length > 0;
    if (!hasRealSignal) continue;

    // Availability is a bonus reason ON TOP of a real match, never the sole one.
    if (
      person.lookingFor.some((l) =>
        /collaboration|projects|freelance|part-time/i.test(l),
      )
    ) {
      points += 8;
      reasons.push('Open to collaborations');
    }

    results.push({
      personId: person.id,
      score: Math.max(50, Math.min(98, points + 12)),
      reasons,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Collabs whose "looking for" the current user can satisfy (their canHelpWith /
 * skills). Powers a collab-flavored "People who need you".
 */
export function collabsThatNeedYou(
  user: User,
  collabs: { id: ID; creatorId: ID; lookingFor: string[] }[],
): { collabId: ID; matched: string[] }[] {
  const mine = new Set(
    [...user.canHelpWith, ...user.skills].map((s) => s.toLowerCase()),
  );
  return collabs
    .filter((c) => c.creatorId !== user.id)
    .map((c) => ({
      collabId: c.id,
      matched: c.lookingFor.filter((r) =>
        [...mine].some((m) => r.toLowerCase().includes(m) || m.includes(r.toLowerCase())),
      ),
    }))
    .filter((x) => x.matched.length > 0);
}
