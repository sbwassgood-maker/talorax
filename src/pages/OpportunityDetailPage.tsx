import { useNavigate, useParams, Link } from 'react-router-dom';
import './pages.css';
import { Avatar, Badge, Button, Card, MatchPill, Tag } from '../components/ui';
import { useAppState } from '../services/appState';
import { useAuth } from '../services/auth';
import { getCompanyById } from '../data/companies';
import { getUserById, fullName } from '../data/users';
import { scoreOpportunity } from '../utils/matching';
import { NotFoundPage } from './NotFoundPage';

export function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    opportunities,
    savedOpportunityIds,
    interestedOpportunityIds,
    toggleSaveOpportunity,
    markInterested,
  } = useAppState();

  const opp = opportunities.find((o) => o.id === id);
  if (!opp || !user) return <NotFoundPage />;

  const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
  const poster = opp.posterId ? getUserById(opp.posterId) : undefined;
  const orgName = company?.name ?? (poster ? fullName(poster) : 'Talorax member');
  const rec = scoreOpportunity(user, opp);
  const saved = savedOpportunityIds.has(opp.id);
  const interested = interestedOpportunityIds.has(opp.id);

  const team = opp.teamMemberIds
    .map((mid) => getUserById(mid))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="container tx-page">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/opportunities')}
        style={{ marginBottom: 12 }}
      >
        ← All opportunities
      </Button>

      <div className="tx-detail">
        <div>
          <div className="row" style={{ gap: 14 }}>
            <Avatar name={orgName} size={58} square />
            <div>
              <h1>{opp.title}</h1>
              <div className="text-muted" style={{ fontSize: 15 }}>
                {orgName}
              </div>
            </div>
          </div>

          <div className="tx-oppcard__meta" style={{ marginTop: 14 }}>
            <Badge tone="neutral">{opp.type}</Badge>
            <span>📍 {opp.location}</span>
            <span>· {opp.workMode}</span>
            {opp.compensation && <span>· 💰 {opp.compensation}</span>}
          </div>

          <div className="tx-detail__section">
            <h3>About this opportunity</h3>
            <p>{opp.description}</p>
          </div>

          {opp.responsibilities.length > 0 && (
            <div className="tx-detail__section">
              <h3>What you'll do</h3>
              <ul className="tx-list">
                {opp.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="tx-detail__section">
            <h3>What we're looking for</h3>
            <div className="tx-tag-row">
              {opp.requiredSkills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>

          {team.length > 0 && (
            <div className="tx-detail__section">
              <h3>Meet the team</h3>
              {team.map((m) => (
                <Link
                  key={m.id}
                  to={`/profile/${m.id}`}
                  className="tx-team-member"
                >
                  <Avatar name={fullName(m)} size={42} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{fullName(m)}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {m.headline}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="tx-sticky-actions">
          <Card>
            <div className="spread" style={{ marginBottom: 12 }}>
              <MatchPill score={rec.score} />
            </div>
            <Button
              block
              onClick={() => markInterested(opp.id)}
              disabled={interested}
            >
              {interested ? "✓ You're interested" : "I'm Interested"}
            </Button>
            <Button
              block
              variant="secondary"
              style={{ marginTop: 8 }}
              onClick={() => markInterested(opp.id)}
              disabled={interested}
            >
              Apply
            </Button>
            <Button
              block
              variant="ghost"
              style={{ marginTop: 4 }}
              onClick={() => toggleSaveOpportunity(opp.id)}
            >
              {saved ? '🔖 Saved' : '🔖 Save'}
            </Button>
          </Card>

          <div className="tx-why">
            <div className="tx-why__head">
              <MatchPill score={rec.score} />
              <strong>Why you're seeing this</strong>
            </div>
            <ul>
              {rec.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="tx-why__note">
              Matches are calculated with simple, transparent rules based on your
              profile — not an automated AI engine.
            </div>
          </div>

          {company && (
            <Card>
              <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                <Avatar name={company.name} size={40} square />
                <strong>{company.name}</strong>
              </div>
              <p className="text-muted" style={{ fontSize: 13.5 }}>
                {company.description}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
