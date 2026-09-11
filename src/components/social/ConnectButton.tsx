import { Button } from '../ui';
import { useAppState } from '../../services/appState';

// "Connect" means: I want to build a professional relationship.
export function ConnectButton({
  userId,
  size = 'sm',
  block = false,
}: {
  userId: string;
  size?: 'sm' | 'md';
  block?: boolean;
}) {
  const { getConnectionStatus, requestConnection } = useAppState();
  const status = getConnectionStatus(userId);

  if (status === 'connected') {
    return (
      <Button variant="secondary" size={size} block={block} disabled>
        ✓ Connected
      </Button>
    );
  }
  if (status === 'pending') {
    return (
      <Button variant="ghost" size={size} block={block} disabled>
        Request sent
      </Button>
    );
  }
  return (
    <Button
      size={size}
      block={block}
      onClick={() => requestConnection(userId)}
    >
      + Connect
    </Button>
  );
}

// "Follow" means: I want to see this person's content.
export function FollowButton({
  userId,
  size = 'sm',
  block = false,
}: {
  userId: string;
  size?: 'sm' | 'md';
  block?: boolean;
}) {
  const { isFollowing, toggleFollow } = useAppState();
  const following = isFollowing(userId);
  return (
    <Button
      variant={following ? 'secondary' : 'subtle'}
      size={size}
      block={block}
      onClick={() => toggleFollow(userId)}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
