import { Link, useNavigate } from 'react-router-dom';
import './collab.css';
import { Avatar, Button, Card, Tag } from '../ui';
import { useAppState } from '../../services/appState';
import type { Collab } from '../../models';
import { getUserById, fullName } from '../../data/users';
import { COLLAB_GROUP_ICON } from '../../data/collabs';
import { timeAgo } from '../../utils/format';

/**
 * A Collab rendered as a social request card (NOT a job listing). Used in the
 * feed and in Collab discovery. Carries the lightweight, non-committal
 * "I'm Interested" action plus Message / Share / open detail.
 */
export function CollabCard({ collab }: { collab: Collab }) {
  const navigate = useNavigate();
  const { hasExpressedInterest, expressInterest, withdrawInterest } =
    useAppState();
  const creator = getUserById(collab.creatorId);
  const interested = hasExpressedInterest(collab.id);
  const icon = COLLAB_GROUP_ICON[collab.categoryGroup];

  return (
    <Card className="tx-collab">
      <div
        className="tx-collab__accent"
        style={{ background: collab.accentColor }}
        aria-hidden="true"
      />
      <div className="tx-collab__ribbon">
        <span className="tx-collab__ribbon-tag">🤝 COLLAB</span>
        <span className="tx-collab__ribbon-cat">
          {icon} {collab.category}
        </span>
      </div>

      <div className="tx-collab__head">
        <Link to={creator ? `/profile/${creator.id}` : '#'}>
          <Avatar name={creator ? fullName(creator) : 'TALORAX'} size={44} />
        </Link>
        <div style={{ minWidth: 0 }}>
          <Link
            to={`/collabs/${collab.id}`}
            className="tx-collab__title"
          >
            {collab.title}
          </Link>
          <div className="tx-collab__meta">
            {creator ? fullName(creator) : 'TALORAX member'} ·{' '}
            {timeAgo(collab.createdAt)}
          </div>
        </div>
      </div>

      <p className="tx-collab__body">{collab.description}</p>

      <div className="tx-collab__section-label">Looking for</div>
      <div className="tx-tag-row">
        {collab.lookingFor.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      <div className="tx-collab__facts">
        {collab.budget && <span>💰 {collab.budget}</span>}
        {collab.timeline && <span>🗓️ {collab.timeline}</span>}
        <span>📍 {collab.location}</span>
        <span>· {collab.workMode}</span>
      </div>

      <div className="tx-collab__actions">
        <Button
          variant={interested ? 'secondary' : 'highlight'}
          size="sm"
          onClick={() =>
            interested ? withdrawInterest(collab.id) : expressInterest(collab.id)
          }
        >
          {interested ? "✓ Interested" : "I'm Interested"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/messages')}
        >
          Message
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/collabs/${collab.id}`)}
        >
          Details
        </Button>
      </div>
    </Card>
  );
}
