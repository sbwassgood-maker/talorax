import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './pages.css';
import { Avatar, Button, Card, MatchPill, Tag } from '../components/ui';
import { ConnectButton } from '../components/social/ConnectButton';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { users, fullName } from '../data/users';
import { getCompanyById } from '../data/companies';
import { getUserById } from '../data/users';
import { scoreOpportunity, scorePerson } from '../utils/matching';
import type { SkillGap } from '../models';

// A small, deterministic set of "next skills" mapped to how many opportunities
// they could unlock. Honest MVP heuristic, not a real analytics engine.
function computeSkillGaps(userSkills: string[]): SkillGap[] {
  const candidates: SkillGap[] = [
    { skill: 'AWS', unlocksCount: 8, rationale: 'Cloud roles increasingly ask for it' },
    { skill: 'React', unlocksCount: 6, rationale: 'Opens up front-end opportunities' },
    { skill: 'SQL', unlocksCount: 5, rationale: 'Foundational for data-focused roles' },
    { skill: 'Docker', unlocksCount: 4, rationale: 'Common in modern infrastructure work' },
  ];
  return candidates.filter((c) => !userSkills.includes(c.skill)).slice(0, 3);
}

export function RadarPage() {
  const { user } = useAuth();
  const { opportunities, projects } = useAppState();
  const navigate = useNavigate();

  const topOpps = useMemo(() => {
    if (!user) return [];
    return [...opportunities]
      .map((o) => ({ opp: o, rec: scoreOpportunity(user, o) }))
      .sort((a, b) => b.rec.score - a.rec.score)
      .slice(0, 4);
  }, [opportunities, user]);

  const peopleToMeet = useMemo(() => {
    if (!user) return [];
    return users
      .filter((u) => u.id !== user.id && !user.connectionIds.includes(u.id))
      .map((u) => ({ person: u, rec: scorePerson(user, u) }))
      .sort((a, b) => b.rec.score - a.rec.score)
      .slice(0, 3);
  }, [user]);

  const projectsToJoin = projects
    .filter((p) => p.status === 'Looking for collaborators')
    .slice(0, 3);

  if (!user) return null;
  const skillGaps = computeSkillGaps(user.skills);

  return (
    <div className="container tx-page">
      <div className="tx-radar-hero">
        <div className="row" style={{ gap: 10 }}>
          <span style={{ fontSize: 28 }} aria-hidden="true">
            📡
          </span>
          <h1>Opportunity Radar</h1>
        </div>
        <p style={{ opacity: 0.92, marginTop: 6, maxWidth: 560 }}>
          Talorax is actively scanning for your next step — {user.firstName},
          here's what we found for you today.
        </p>
      </div>

      {/* Opportunities for you */}
      <section className="tx-radar-section">
        <h2 className="tx-section-title">Opportunities for you</h2>
        <p className="tx-section-sub">Ranked by how well they fit your profile.</p>
        <Card>
          {topOpps.map(({ opp, rec }) => {
            const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
            return (
              <div className="tx-radar-row" key={opp.id}>
                <div style={{ minWidth: 0 }}>
                  <Link
                    to={`/opportunities/${opp.id}`}
                    style={{ fontWeight: 700 }}
                  >
                    {opp.title}
                  </Link>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {company?.name ?? 'Talorax member'} · {opp.location}
                  </div>
                </div>
                <div className="row" style={{ gap: 10 }}>
                  <MatchPill score={rec.score} />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/opportunities/${opp.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </Card>
      </section>

      {/* People you should meet */}
      <section className="tx-radar-section">
        <h2 className="tx-section-title">People you should meet</h2>
        <p className="tx-section-sub">
          Because of shared interests and mutual connections.
        </p>
        <Card>
          {peopleToMeet.map(({ person, rec }) => (
            <div className="tx-radar-row" key={person.id}>
              <div className="row" style={{ gap: 12, minWidth: 0 }}>
                <Avatar name={fullName(person)} size={44} />
                <div style={{ minWidth: 0 }}>
                  <Link to={`/profile/${person.id}`} style={{ fontWeight: 700 }}>
                    {fullName(person)}
                  </Link>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {person.headline}
                  </div>
                  <div className="tx-reason-chips">
                    {rec.reasons.slice(0, 3).map((r) => (
                      <Tag key={r}>{r}</Tag>
                    ))}
                  </div>
                </div>
              </div>
              <ConnectButton userId={person.id} />
            </div>
          ))}
        </Card>
      </section>

      {/* Projects you could join */}
      <section className="tx-radar-section">
        <h2 className="tx-section-title">Projects you could join</h2>
        <p className="tx-section-sub">Teams currently looking for collaborators.</p>
        <Card>
          {projectsToJoin.map((p) => {
            const creator = getUserById(p.creatorId);
            return (
              <div className="tx-radar-row" key={p.id}>
                <div style={{ minWidth: 0 }}>
                  <Link to={`/projects/${p.id}`} style={{ fontWeight: 700 }}>
                    {p.title}
                  </Link>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    by {creator ? fullName(creator) : 'Talorax member'} · Looking
                    for: {(p.seekingRoles ?? []).join(', ')}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  View
                </Button>
              </div>
            );
          })}
        </Card>
      </section>

      {/* Skills to develop */}
      <section className="tx-radar-section">
        <h2 className="tx-section-title">Skills to develop</h2>
        <p className="tx-section-sub">
          Growing these could open up more opportunities for you.
        </p>
        <div className="tx-grid">
          {skillGaps.map((g) => (
            <Card key={g.skill} className="tx-skill-gap">
              <span className="tx-skill-gap__ring">{g.skill.slice(0, 2)}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{g.skill}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Learning this could make you eligible for {g.unlocksCount}{' '}
                  additional opportunities.
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


