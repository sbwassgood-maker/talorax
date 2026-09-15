import { Link } from 'react-router-dom';
import { Avatar, Card, Tag } from '../ui';
import { ConnectButton, FollowButton } from '../social/ConnectButton';
import { WhyThis } from '../social/WhyThis';
import type { User } from '../../models';
import { fullName } from '../../data/users';
import { mutualConnections, scorePerson } from '../../utils/matching';
import { useAuth } from '../../services/auth';

export function PersonCard({ person }: { person: User }) {
  const { user } = useAuth();
  const mutual = user ? mutualConnections(user, person) : 0;
  const rec = user ? scorePerson(user, person) : null;
  const chips = [...person.skills.slice(0, 2), ...person.interests.slice(0, 1)];

  return (
    <Card className="tx-person" hover>
      <div className="tx-person__top">
        <Link to={`/profile/${person.id}`}>
          <Avatar name={fullName(person)} size={52} />
        </Link>
        <div style={{ minWidth: 0 }}>
          <Link to={`/profile/${person.id}`} className="tx-person__name">
            {fullName(person)}
          </Link>
          <div className="tx-person__headline">{person.headline}</div>
          {person.location && (
            <div className="tx-person__loc">📍 {person.location}</div>
          )}
        </div>
      </div>

      <div className="tx-person__tags">
        {chips.map((c) => (
          <Tag key={c}>{c}</Tag>
        ))}
      </div>

      <div className="tx-person__mutual">
        {mutual > 0
          ? `${mutual} mutual connection${mutual > 1 ? 's' : ''}`
          : 'Suggested for you'}
      </div>

      {rec && (
        <WhyThis score={rec.score} reasons={rec.reasons} variant="inline" />
      )}

      <div className="tx-person__actions">
        <ConnectButton userId={person.id} block />
        <FollowButton userId={person.id} />
      </div>
    </Card>
  );
}
