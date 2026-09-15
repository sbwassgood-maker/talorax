import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Card, MatchPill, Tag } from '../ui';
import type { Opportunity } from '../../models';
import { getCompanyById } from '../../data/companies';
import { getUserById, fullName } from '../../data/users';
import { industryIcon } from '../../data/industries';
import { scoreOpportunity } from '../../utils/matching';
import { useAuth } from '../../services/auth';

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
  const poster = opp.posterId ? getUserById(opp.posterId) : undefined;
  const orgName = company?.name ?? (poster ? fullName(poster) : 'Talorax member');
  const rec = user ? scoreOpportunity(user, opp) : null;

  return (
    <Card className="tx-oppcard" hover>
      <div className="tx-oppcard__head">
        <Avatar name={orgName} size={46} square />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="tx-oppcard__title">{opp.title}</div>
          <div className="tx-oppcard__org">{orgName}</div>
        </div>
        <Badge tone="neutral">{opp.type}</Badge>
      </div>

      <div className="tx-oppcard__meta">
        {opp.industry && (
          <span>
            {industryIcon(opp.industry)} {opp.industry}
          </span>
        )}
        {opp.seniority && opp.seniority !== 'Not specified' && (
          <span>· {opp.seniority}</span>
        )}
      </div>
      <div className="tx-oppcard__meta">
        <span>📍 {opp.location}</span>
        <span>· {opp.workMode}</span>
        {opp.compensation && <span>· {opp.compensation}</span>}
      </div>

      <p className="tx-oppcard__desc">{opp.shortDescription}</p>

      <div className="tx-tag-row">
        {opp.requiredSkills.slice(0, 4).map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      <div className="tx-oppcard__foot">
        {rec && <MatchPill score={rec.score} />}
        <Button size="sm" onClick={() => navigate(`/opportunities/${opp.id}`)}>
          View Opportunity
        </Button>
      </div>
    </Card>
  );
}
