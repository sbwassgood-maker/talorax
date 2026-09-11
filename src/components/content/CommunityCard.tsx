import { useState } from 'react';
import { Button, Card } from '../ui';
import type { Community } from '../../models';
import { compactNumber } from '../../utils/format';

export function CommunityCard({ community }: { community: Community }) {
  const [joined, setJoined] = useState(false);
  return (
    <Card pad={false} hover className="stack" style={{ overflow: 'hidden' }}>
      <div
        className="tx-community__cover"
        style={{ background: community.coverColor }}
      />
      <div style={{ padding: '0 16px 16px' }}>
        <div
          className="tx-community__badge"
          style={{ background: community.coverColor }}
          aria-hidden="true"
        >
          {community.name[0]}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 10 }}>
          {community.name}
        </div>
        <div className="text-muted" style={{ fontSize: 12.5 }}>
          {compactNumber(community.memberCount)} members
        </div>
        <p className="text-muted" style={{ fontSize: 14, margin: '8px 0 12px' }}>
          {community.description}
        </p>
        <Button
          variant={joined ? 'secondary' : 'subtle'}
          size="sm"
          block
          onClick={() => setJoined((j) => !j)}
        >
          {joined ? '✓ Joined' : 'Join community'}
        </Button>
      </div>
    </Card>
  );
}
