import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './pages.css';
import '../components/content/collab.css';
import { Avatar, Badge, Button, Card, Tag } from '../components/ui';
import { useAppState } from '../services/appState';
import { useAuth } from '../services/auth';
import { getUserById, fullName } from '../data/users';
import { COLLAB_GROUP_ICON } from '../data/collabs';
import { InviteModal } from '../components/collab/InviteModal';
import { NotFoundPage } from './NotFoundPage';

export function CollabDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    collabs,
    hasExpressedInterest,
    expressInterest,
    withdrawInterest,
  } = useAppState();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const collab = collabs.find((c) => c.id === id);
  if (!collab || !user) return <NotFoundPage />;

  const creator = getUserById(collab.creatorId);
  const isOwner = creator?.id === user.id;
  const interested = hasExpressedInterest(collab.id);
  const interestedPeople = collab.interestedUserIds
    .map((uid) => getUserById(uid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container tx-page">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 12 }}
      >
        ← Back
      </Button>

      <div className="tx-detail">
        <div>
          <div
            className="tx-detail__banner"
            style={{ background: collab.accentColor }}
          >
            🤝 {collab.accentLabel}
          </div>

          <div className="tx-collab__ribbon" style={{ marginTop: 14 }}>
            <span className="tx-collab__ribbon-tag">🤝 COLLAB</span>
            <span className="tx-collab__ribbon-cat">
              {COLLAB_GROUP_ICON[collab.categoryGroup]} {collab.categoryGroup} ·{' '}
              {collab.category}
            </span>
          </div>

          <h1 style={{ marginTop: 6 }}>{collab.title}</h1>

          {creator && (
            <Link
              to={`/profile/${creator.id}`}
              className="row"
              style={{ gap: 10, marginTop: 12 }}
            >
              <Avatar name={fullName(creator)} size={40} />
              <div>
                <div style={{ fontWeight: 600 }}>{fullName(creator)}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {creator.headline}
                </div>
              </div>
            </Link>
          )}

          <div className="tx-detail__section">
            <h3>About this collab</h3>
            <p>{collab.description}</p>
          </div>

          <div className="tx-detail__section">
            <h3>What they need</h3>
            <div className="tx-tag-row">
              {collab.lookingFor.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>

          <div className="tx-detail__section">
            <h3>Details</h3>
            <div className="tx-collab__facts" style={{ margin: 0 }}>
              {collab.budget && <span>💰 {collab.budget}</span>}
              {collab.timeline && <span>🗓️ {collab.timeline}</span>}
              <span>📍 {collab.location}</span>
              <span>· {collab.workMode}</span>
              <span>
                · 👥 {collab.collaboratorsNeeded} collaborator
                {collab.collaboratorsNeeded > 1 ? 's' : ''} needed
              </span>
            </div>
          </div>

          {collab.projectId && (
            <div className="tx-detail__section">
              <h3>Related project</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/projects/${collab.projectId}`)}
              >
                View Project
              </Button>
            </div>
          )}

          {/* Interest visibility: the creator can review who's interested. */}
          <div className="tx-detail__section">
            <h3>
              Interested{' '}
              <Badge tone="neutral">{interestedPeople.length}</Badge>
            </h3>
            {interestedPeople.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 14 }}>
                No one has expressed interest yet.
                {!isOwner && ' Be the first — it’s non-committal.'}
              </p>
            ) : isOwner ? (
              interestedPeople.map((p) => (
                <Link key={p.id} to={`/profile/${p.id}`} className="tx-team-member">
                  <Avatar name={fullName(p)} size={40} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{fullName(p)}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {p.headline}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted" style={{ fontSize: 14 }}>
                {interestedPeople.length} {interestedPeople.length === 1 ? 'person is' : 'people are'} interested. The creator reviews interested profiles and reaches out.
              </p>
            )}
          </div>
        </div>

        {/* Right rail actions */}
        <div className="tx-sticky-actions">
          <Card>
            {isOwner ? (
              <>
                <Button block onClick={() => setInviteOpen(true)}>
                  Invite someone
                </Button>
                <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
                  This is your collab. Review interested people or invite someone
                  directly.
                </p>
              </>
            ) : (
              <>
                <Button
                  block
                  variant={interested ? 'secondary' : 'highlight'}
                  onClick={() =>
                    interested
                      ? withdrawInterest(collab.id)
                      : expressInterest(collab.id)
                  }
                >
                  {interested ? "✓ You're interested" : "I'm Interested"}
                </Button>
                <Button
                  block
                  variant="secondary"
                  style={{ marginTop: 8 }}
                  onClick={() => navigate('/messages')}
                >
                  Message
                </Button>
                <Button
                  block
                  variant="ghost"
                  style={{ marginTop: 4 }}
                  onClick={() => setShared(true)}
                >
                  {shared ? '✓ Link copied' : '↗ Share'}
                </Button>
              </>
            )}
          </Card>

          <Card>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>Staying safe</h3>
            <p className="text-muted" style={{ fontSize: 13 }}>
              Collabs connect you with people you may not know. Keep contact on
              TALORAX until you're comfortable.
            </p>
            <Button
              variant="ghost"
              size="sm"
              style={{ marginTop: 8 }}
              onClick={() => window.alert('Thanks — our team will review this collab.')}
              title="Report this collab"
            >
              ⚑ Report this collab
            </Button>
          </Card>
        </div>
      </div>

      {inviteOpen && (
        <InviteModal collab={collab} onClose={() => setInviteOpen(false)} />
      )}
    </div>
  );
}
