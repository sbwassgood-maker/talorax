import { Avatar, Badge, Button, Card } from '../ui';
import type { Company } from '../../models';
import { compactNumber } from '../../utils/format';
import { useState } from 'react';

export function CompanyCard({ company }: { company: Company }) {
  const [following, setFollowing] = useState(false);
  return (
    <Card hover className="stack">
      <div className="row" style={{ gap: 12 }}>
        <Avatar name={company.name} size={52} square />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{company.name}</div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {company.industry}
          </div>
          <div style={{ color: 'var(--color-text-faint)', fontSize: 12.5 }}>
            📍 {company.location}
          </div>
        </div>
      </div>
      <p className="text-muted" style={{ fontSize: 14, margin: '10px 0' }}>
        {company.description}
      </p>
      <div className="spread" style={{ marginTop: 'auto' }}>
        <Badge tone="neutral">
          {company.openOpportunityIds.length} open · {compactNumber(company.followerCount)} followers
        </Badge>
        <Button
          variant={following ? 'secondary' : 'subtle'}
          size="sm"
          onClick={() => setFollowing((f) => !f)}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
    </Card>
  );
}
