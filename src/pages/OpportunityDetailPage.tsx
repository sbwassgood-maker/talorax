import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './pages.css';
import { Avatar, Badge, Button, Card, MatchPill, Tag } from '../components/ui';
import { WhyThis } from '../components/social/WhyThis';
import { useAppState } from '../services/appState';
import { useAuth } from '../services/auth';
import { getCompanyById } from '../data/companies';
import { getUserById, fullName } from '../data/users';
import { scoreOpportunity } from '../utils/matching';
import { isActiveOpportunity, isVerifiedOpportunity } from '../models';
import { NotFoundPage } from './NotFoundPage';

// Format a salary range from the structured fields, honestly (no fabrication).
function formatSalaryRange(
  min?: number,
  max?: number,
  period: string = 'year',
): string | null {
  if (!min && !max) return null;
  const suffix =
    period === 'hour' ? '/hr' : period === 'year' ? '/yr' : `/${period}`;
  const fmt = (n: number) =>
    period === 'hour' ? `$${n}` : `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)}–${fmt(max)}${suffix}`;
  return `${fmt((min ?? max) as number)}+${suffix}`;
}

export function OpportunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Stable "now" captured once per mount so render stays pure (no Date.now()
  // called directly in JSX, which the React Compiler flags).
  const [startedAt] = useState(() => Date.now());
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
  const active = isActiveOpportunity(opp);
  const verified = isVerifiedOpportunity(opp);
  const isExpired =
    opp.status === 'Expired' ||
    (opp.expiresAt ? new Date(opp.expiresAt).getTime() < startedAt : false);
  const salaryRange = formatSalaryRange(
    opp.salaryMin,
    opp.salaryMax,
    opp.salaryPeriod ?? 'year',
  );

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
            <span>
              📍 {opp.neighborhood ? `${opp.neighborhood}, ` : ''}
              {opp.location}
            </span>
            <span>· {opp.workMode}</span>
            {(salaryRange || opp.compensation) && (
              <span>· 💰 {salaryRange ?? opp.compensation}</span>
            )}
            {verified && <Badge tone="success">✓ Verified employer</Badge>}
          </div>

          {!active && (
            <div
              className="tx-detail__section"
              style={{
                background: 'var(--tx-surface-2, #f4f4f5)',
                borderRadius: 10,
                padding: '10px 14px',
                marginTop: 12,
              }}
            >
              <strong>
                {opp.status === 'Paused'
                  ? 'This listing is currently paused'
                  : opp.status === 'Closed'
                    ? 'This listing has been closed'
                    : isExpired
                      ? 'This listing has expired'
                      : 'This listing is not currently active'}
              </strong>
              <p className="text-muted" style={{ fontSize: 13.5, margin: '4px 0 0' }}>
                It's no longer accepting new interest. Browse active roles on the
                Jobs page.
              </p>
            </div>
          )}

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
              disabled={interested || !active}
            >
              {interested ? "✓ You're interested" : "I'm Interested"}
            </Button>
            {opp.applicationUrl ? (
              <a
                href={opp.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!active}
                style={{ display: 'block', marginTop: 8 }}
                onClick={(e) => {
                  if (!active) e.preventDefault();
                }}
              >
                <Button block variant="secondary" disabled={!active}>
                  Apply ↗
                </Button>
              </a>
            ) : (
              <Button
                block
                variant="secondary"
                style={{ marginTop: 8 }}
                onClick={() => markInterested(opp.id)}
                disabled={interested || !active}
              >
                Apply
              </Button>
            )}
            <Button
              block
              variant="ghost"
              style={{ marginTop: 4 }}
              onClick={() => toggleSaveOpportunity(opp.id)}
            >
              {saved ? '🔖 Saved' : '🔖 Save'}
            </Button>

            {/* Honest provenance & verification. Source is NOT a trust signal;
                only an explicitly Verified listing is labeled verified. */}
            {(opp.source || opp.verificationStatus) && (
              <div
                className="text-muted"
                style={{ fontSize: 12, marginTop: 12, lineHeight: 1.5 }}
              >
                {opp.source && <div>Source: {opp.source}</div>}
                <div>
                  {verified
                    ? '✓ Verified by TALORAX'
                    : 'Not independently verified'}
                </div>
              </div>
            )}
          </Card>

          <WhyThis score={rec.score} reasons={rec.reasons} />

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
