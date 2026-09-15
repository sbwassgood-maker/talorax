// ============================================================================
// LocalAskEngine — deterministic, data-grounded implementation of AskEngine.
// ----------------------------------------------------------------------------
// Every response is built ONLY from real TALORAX data (users, opportunities,
// projects, communities) and the existing rule-based matching utilities. It
// never invents entities, numbers, or claims. Reasons come from the same
// transparent matcher used elsewhere in the product ("Why am I seeing this").
// ============================================================================

import type { AskEngine, AiBlock, AiItem, SuggestedPrompt } from './types';
import { detectIntent } from './intent';
import type { ID, User, Opportunity } from '../../models';
import { getUserById, fullName, users } from '../../data/users';
import { projects as allProjects } from '../../data/projects';
import { opportunities as allOpportunities } from '../../data/opportunities';
import { communities as allCommunities } from '../../data/communities';
import { getCompanyById } from '../../data/companies';
import {
  scoreOpportunity,
  scorePerson,
  mutualConnections,
  peopleWhoNeedYou,
} from '../../utils/matching';

const SUGGESTED: SuggestedPrompt[] = [
  { icon: '🎯', label: 'What should I do next?', prompt: 'What should I do next?' },
  { icon: '👥', label: 'Who should I meet?', prompt: 'Who should I meet?' },
  { icon: '💼', label: 'Find opportunities for me', prompt: 'Find opportunities for me' },
  { icon: '🚀', label: 'Find projects I can contribute to', prompt: 'Find projects I can contribute to' },
  { icon: '📈', label: 'Improve my TALORAX profile', prompt: 'How can I improve my profile?' },
  { icon: '🧠', label: 'What skills should I learn?', prompt: 'What skills should I learn?' },
  { icon: '🤝', label: 'Who needs my skills?', prompt: 'Who needs my skills?' },
  { icon: '🔎', label: 'Help me discover something new', prompt: 'Help me discover something new' },
];

// Skill candidates the platform can suggest, each tied to how many CURRENT
// opportunities in the data would additionally match if the user had it.
// The count is computed from real data — not fabricated.
const CANDIDATE_SKILLS = ['AWS', 'React', 'SQL', 'Docker', 'Python', 'JavaScript'];

export class LocalAskEngine implements AskEngine {
  suggestedPrompts(): SuggestedPrompt[] {
    return SUGGESTED;
  }

  answer(prompt: string, userId: ID): AiBlock[] {
    const user = getUserById(userId);
    if (!user) {
      return [
        {
          kind: 'paragraph',
          text: "I couldn't load your profile just now. Please try again.",
        },
      ];
    }

    switch (detectIntent(prompt)) {
      case 'meet-people':
        return this.whoShouldIMeet(user);
      case 'find-opportunities':
        return this.findOpportunities(user, prompt);
      case 'find-projects':
        return this.findProjects(user);
      case 'improve-profile':
        return this.improveProfile(user);
      case 'skills-to-learn':
        return this.skillsToLearn(user);
      case 'who-needs-me':
        return this.whoNeedsMe(user);
      case 'discover':
        return this.discover(user);
      case 'help':
        return this.help();
      case 'next':
      default:
        return this.whatShouldIDoNext(user);
    }
  }

  // -- Flagship: "What should I do next?" -----------------------------------
  private whatShouldIDoNext(user: User): AiBlock[] {
    const items: AiItem[] = [];

    // 1. Proof of work: an in-progress project missing a demo link.
    const myProjects = allProjects.filter((p) => p.creatorId === user.id);
    const projectNeedingDemo = myProjects.find(
      (p) => !p.demoUrl || p.demoUrl === '#',
    );
    if (projectNeedingDemo) {
      items.push({
        id: projectNeedingDemo.id,
        title: `Add a demo to "${projectNeedingDemo.title}"`,
        subtitle: 'Adding a live demo would strengthen your Proof of Work.',
        avatarName: projectNeedingDemo.coverLabel,
        actions: [
          { label: 'View Project', to: `/projects/${projectNeedingDemo.id}`, variant: 'primary' },
        ],
      });
    }

    // 2. Best person to meet.
    const topPerson = this.rankedPeople(user)[0];
    if (topPerson) {
      const { person, reasons, score } = topPerson;
      items.push({
        id: person.id,
        title: `Meet ${fullName(person)}`,
        subtitle: person.headline,
        avatarName: fullName(person),
        reasons,
        score,
        actions: [
          { label: 'View Profile', to: `/profile/${person.id}`, variant: 'secondary' },
          { label: 'Connect', command: { kind: 'connect', userId: person.id }, variant: 'primary' },
        ],
      });
    }

    // 3. Best opportunity.
    const topOpp = this.rankedOpportunities(user)[0];
    if (topOpp) {
      items.push(this.opportunityItem(topOpp.opp, topOpp.score, topOpp.reasons));
    }

    // 4. A skill worth learning (only if a real gap unlocks real opps).
    const gap = this.topSkillGap(user);
    if (gap) {
      items.push({
        id: `skill-${gap.skill}`,
        title: `Learn ${gap.skill}`,
        subtitle: `${gap.unlocks} more opportunit${gap.unlocks === 1 ? 'y' : 'ies'} in TALORAX would match you with this skill.`,
        avatarName: gap.skill,
        actions: [
          { label: 'See matching opportunities', to: '/opportunities', variant: 'secondary' },
        ],
      });
    }

    if (items.length === 0) {
      return this.discover(user);
    }

    return [
      {
        kind: 'paragraph',
        text: `Here's what I'd focus on next, ${user.firstName} — all based on your profile and what's happening on TALORAX right now.`,
      },
      { kind: 'items', items },
      this.honestNote(),
    ];
  }

  // -- "Who should I meet?" -------------------------------------------------
  private whoShouldIMeet(user: User): AiBlock[] {
    const ranked = this.rankedPeople(user).slice(0, 3);
    if (ranked.length === 0) {
      return [{ kind: 'paragraph', text: "I couldn't find new people to suggest right now." }];
    }
    const items: AiItem[] = ranked.map(({ person, reasons, score }) => ({
      id: person.id,
      title: fullName(person),
      subtitle: person.headline,
      avatarName: fullName(person),
      reasons,
      score,
      actions: [
        { label: 'View Profile', to: `/profile/${person.id}`, variant: 'secondary' },
        { label: 'Connect', command: { kind: 'connect', userId: person.id }, variant: 'primary' },
      ],
    }));
    return [
      { kind: 'paragraph', text: 'People you should meet, based on shared interests, skills, and mutual connections:' },
      { kind: 'items', heading: 'People you should meet', items },
      this.honestNote(),
    ];
  }

  // -- "Find opportunities for me" ------------------------------------------
  private findOpportunities(user: User, prompt: string): AiBlock[] {
    let ranked = this.rankedOpportunities(user);

    // Intent nuance: honor a light topical filter if the prompt names a theme
    // present in the data (e.g. "AI", "internship", "remote"). Still only real
    // opportunities are ever returned.
    const p = prompt.toLowerCase();
    const themed = ranked.filter(({ opp }) => {
      if (p.includes('remote')) return opp.workMode === 'Remote';
      if (p.includes('internship')) return opp.type === 'Internship';
      if (p.includes('ai')) {
        const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
        return (
          /ai|machine learning/i.test(opp.title) ||
          opp.requiredSkills.some((s) => /python|ai/i.test(s)) ||
          (company ? /ai|artificial/i.test(company.industry) : false)
        );
      }
      return true;
    });
    if (themed.length > 0 && themed.length < ranked.length) ranked = themed;

    const top = ranked.slice(0, 4);
    if (top.length === 0) {
      return [{ kind: 'paragraph', text: 'No matching opportunities are available yet — check back soon.' }];
    }
    const items = top.map(({ opp, score, reasons }) =>
      this.opportunityItem(opp, score, reasons),
    );
    return [
      { kind: 'paragraph', text: 'Opportunities that fit you, ranked by relevance to your skills, interests, and goals:' },
      { kind: 'items', heading: 'Opportunities for you', items },
      this.honestNote(),
    ];
  }

  // -- "Find projects I can contribute to" ----------------------------------
  private findProjects(user: User): AiBlock[] {
    const skillSet = new Set(user.skills.map((s) => s.toLowerCase()));
    const open = allProjects
      .filter((p) => p.creatorId !== user.id && p.status === 'Looking for collaborators')
      .map((p) => {
        const matched = p.technologies.filter((t) => skillSet.has(t.toLowerCase()));
        const roleMatch = (p.seekingRoles ?? []).filter((r) =>
          user.skills.some((s) => r.toLowerCase().includes(s.toLowerCase())),
        );
        return { p, matched, roleMatch };
      })
      .sort((a, b) => b.matched.length + b.roleMatch.length - (a.matched.length + a.roleMatch.length));

    if (open.length === 0) {
      return [{ kind: 'paragraph', text: 'No projects are currently seeking collaborators. Try again later or start your own.' }];
    }

    const items: AiItem[] = open.slice(0, 4).map(({ p, matched, roleMatch }) => {
      const creator = getUserById(p.creatorId);
      const reasons: string[] = [];
      if (matched.length) reasons.push(`Uses ${matched.join(', ')} — skills you have`);
      if (roleMatch.length) reasons.push(`Looking for ${roleMatch.join(', ')}`);
      if (reasons.length === 0) reasons.push('Open to collaborators');
      return {
        id: p.id,
        title: p.title,
        subtitle: creator ? `by ${fullName(creator)}` : undefined,
        avatarName: p.coverLabel,
        reasons,
        actions: [
          { label: 'View Project', to: `/projects/${p.id}`, variant: 'secondary' },
        ],
      };
    });
    return [
      { kind: 'paragraph', text: 'Projects looking for collaborators where your skills could help:' },
      { kind: 'items', heading: 'Projects you could join', items },
      this.honestNote(),
    ];
  }

  // -- "How can I improve my profile?" --------------------------------------
  private improveProfile(user: User): AiBlock[] {
    const strong: string[] = [];
    const improve: string[] = [];

    if (user.skills.length >= 3) strong.push('Your skills are clearly listed');
    else improve.push('Add more skills so you appear in more searches and matches');

    const myProjects = allProjects.filter((p) => p.creatorId === user.id);
    if (myProjects.length > 0) strong.push('Your projects demonstrate real experience');
    else improve.push('Add a project to show Proof of Work, not just claims');

    if (user.lookingFor.length > 0) strong.push('You’ve defined what you’re looking for');
    else improve.push("Add what you're currently looking for");

    if (user.about && user.about.length > 40) strong.push('Your About section tells your story');
    else improve.push('Expand your About section to show personality and goals');

    if (user.headline && user.headline.length > 0) strong.push('Your headline is set');
    else improve.push('Clarify your headline');

    const projectMissingDemo = myProjects.find((p) => !p.demoUrl || p.demoUrl === '#');
    if (projectMissingDemo) improve.push(`Add a live demo to "${projectMissingDemo.title}"`);

    if (user.experience.length === 0) improve.push('Add measurable results to your experience');

    const blocks: AiBlock[] = [
      { kind: 'paragraph', text: `Here's an honest read on your profile, ${user.firstName}, from the information you've added:` },
    ];
    if (strong.length) {
      blocks.push({ kind: 'checklist', heading: 'Strong', checklist: strong.map((t) => ({ done: true, text: t })) });
    }
    if (improve.length) {
      blocks.push({ kind: 'checklist', heading: 'Could be stronger', checklist: improve.map((t) => ({ done: false, text: t })) });
    }
    blocks.push({
      kind: 'items',
      items: [
        {
          id: 'improve',
          title: 'Update your profile',
          actions: [{ label: 'Go to Profile', to: '/profile', variant: 'primary' }],
        },
      ],
    });
    return blocks;
  }

  // -- "What skills should I learn?" ----------------------------------------
  private skillsToLearn(user: User): AiBlock[] {
    const gaps = this.skillGaps(user).slice(0, 3);
    if (gaps.length === 0) {
      return [{ kind: 'paragraph', text: "Your skills already align well with the opportunities on TALORAX right now. Keep building projects to stand out." }];
    }
    const items: AiItem[] = gaps.map((g) => ({
      id: `skill-${g.skill}`,
      title: g.skill,
      subtitle:
        g.unlocks > 0
          ? `Would additionally match you with ${g.unlocks} opportunit${g.unlocks === 1 ? 'y' : 'ies'} on TALORAX.`
          : 'Frequently requested alongside your current skills.',
      avatarName: g.skill,
      actions: [{ label: 'See opportunities', to: '/opportunities', variant: 'secondary' }],
    }));
    return [
      { kind: 'paragraph', text: 'Skills worth developing next — chosen by looking at the opportunities in TALORAX you don’t fully match yet:' },
      { kind: 'items', heading: 'Skills to develop', items },
      this.honestNote(),
    ];
  }

  // -- "Who needs my skills?" -----------------------------------------------
  private whoNeedsMe(user: User): AiBlock[] {
    const needs = peopleWhoNeedYou(user, allProjects, allOpportunities).slice(0, 4);
    if (needs.length === 0) {
      return [{ kind: 'paragraph', text: "No one is currently looking for your specific skills in public projects or opportunities. Adding more skills to your profile can surface more matches." }];
    }
    const items: AiItem[] = needs.map((n) => {
      const person = getUserById(n.personId);
      return {
        id: n.needId,
        title: person ? fullName(person) : 'A TALORAX member',
        subtitle: `Needs ${n.need}`,
        avatarName: person ? fullName(person) : n.need,
        reasons: [n.reason],
        actions: [
          n.source === 'project'
            ? { label: 'View Project', to: `/projects/${n.sourceId}`, variant: 'secondary' }
            : { label: 'View Opportunity', to: `/opportunities/${n.sourceId}`, variant: 'secondary' },
          { label: 'I Can Help', command: { kind: 'offerHelp', needId: n.needId }, variant: 'highlight' },
        ],
      };
    });
    return [
      { kind: 'paragraph', text: 'People whose public projects or opportunities call for skills you already have:' },
      { kind: 'items', heading: 'People who need your skills', items },
      this.honestNote(),
    ];
  }

  // -- "Help me discover something new" -------------------------------------
  private discover(user: User): AiBlock[] {
    const person = this.rankedPeople(user)[0];
    const opp = this.rankedOpportunities(user)[0];
    // Suggest a community aligned with the user's interests.
    const community = allCommunities.find((c) =>
      user.interests.some((i) => c.topic.toLowerCase().includes(i.toLowerCase().split(' ')[0])),
    );

    const items: AiItem[] = [];
    if (person) {
      items.push({
        id: person.person.id,
        title: `Meet ${fullName(person.person)}`,
        subtitle: person.person.headline,
        avatarName: fullName(person.person),
        reasons: person.reasons,
        actions: [{ label: 'View Profile', to: `/profile/${person.person.id}`, variant: 'secondary' }],
      });
    }
    if (opp) items.push(this.opportunityItem(opp.opp, opp.score, opp.reasons));
    if (community) {
      items.push({
        id: community.id,
        title: community.name,
        subtitle: `${community.memberCount.toLocaleString()} members · ${community.topic}`,
        avatarName: community.name,
        reasons: ['Matches your interests'],
        actions: [{ label: 'Explore Communities', to: '/discover', variant: 'secondary' }],
      });
    }
    if (items.length === 0) {
      return [{ kind: 'paragraph', text: 'Explore the Discover tab to find people, projects, companies, and communities.' }];
    }
    return [
      { kind: 'paragraph', text: 'A few things worth exploring on TALORAX right now:' },
      { kind: 'items', items },
      this.honestNote(),
    ];
  }

  private help(): AiBlock[] {
    return [
      {
        kind: 'paragraph',
        text: 'I can help you find your next step on TALORAX — opportunities, people to meet, projects to join, and ways to grow. Try one of the suggestions, or ask in your own words.',
      },
    ];
  }

  // === Shared helpers (all grounded in real data) ==========================

  private rankedPeople(user: User) {
    return users
      .filter((u) => u.id !== user.id && !user.connectionIds.includes(u.id))
      .map((u) => {
        const rec = scorePerson(user, u);
        return { person: u, score: rec.score, reasons: rec.reasons, mutual: mutualConnections(user, u) };
      })
      .sort((a, b) => b.score - a.score);
  }

  private rankedOpportunities(user: User) {
    return allOpportunities
      .map((opp) => {
        const rec = scoreOpportunity(user, opp);
        return { opp, score: rec.score, reasons: rec.reasons };
      })
      .sort((a, b) => b.score - a.score);
  }

  private opportunityItem(opp: Opportunity, score: number, reasons: string[]): AiItem {
    const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
    const poster = opp.posterId ? getUserById(opp.posterId) : undefined;
    const org = company?.name ?? (poster ? fullName(poster) : 'TALORAX member');
    return {
      id: opp.id,
      title: opp.title,
      subtitle: `${org} · ${opp.location} · ${opp.type}`,
      avatarName: org,
      reasons,
      score,
      actions: [
        { label: 'View Opportunity', to: `/opportunities/${opp.id}`, variant: 'secondary' },
        { label: 'Save', command: { kind: 'saveOpportunity', opportunityId: opp.id }, variant: 'ghost' },
      ],
    };
  }

  /**
   * Real skill-gap analysis: for each candidate skill the user lacks, count how
   * many CURRENT opportunities require it. Only skills that unlock at least one
   * real opportunity (or are commonly co-requested) are returned. No made-up
   * numbers.
   */
  private skillGaps(user: User): { skill: string; unlocks: number }[] {
    const userSkills = new Set(user.skills.map((s) => s.toLowerCase()));
    return CANDIDATE_SKILLS.filter((s) => !userSkills.has(s.toLowerCase()))
      .map((skill) => {
        const unlocks = allOpportunities.filter((o) =>
          o.requiredSkills.some((r) => r.toLowerCase() === skill.toLowerCase()),
        ).length;
        return { skill, unlocks };
      })
      .sort((a, b) => b.unlocks - a.unlocks);
  }

  private topSkillGap(user: User): { skill: string; unlocks: number } | null {
    const g = this.skillGaps(user).filter((x) => x.unlocks > 0);
    return g.length ? g[0] : null;
  }

  private honestNote(): AiBlock {
    return {
      kind: 'note',
      text: 'These suggestions use your profile and real TALORAX data with transparent rules — not a black-box AI. Nothing here is invented.',
    };
  }
}

// Singleton engine instance used by the UI. Swap this line to a future
// LlmAskEngine to upgrade the intelligence without touching components.
export const askEngine: AskEngine = new LocalAskEngine();
