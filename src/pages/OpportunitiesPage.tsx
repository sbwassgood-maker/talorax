import { useMemo, useState } from 'react';
import './pages.css';
import '../components/content/content.css';
import { Tag, EmptyState } from '../components/ui';
import { OpportunityCard } from '../components/content/OpportunityCard';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { scoreOpportunity } from '../utils/matching';
import { isActiveOpportunity } from '../models';
import type { OpportunityType } from '../models';

const CATEGORIES: (OpportunityType | 'All')[] = [
  'All',
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Contract',
  'Collaboration',
  'Mentorship',
  'Cofounder',
  'Project',
];

export function OpportunitiesPage() {
  const { user } = useAuth();
  const { opportunities } = useAppState();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  // Rank by match score so the most relevant opportunities surface first.
  // Only live listings appear (Paused/Closed/Expired/Rejected/Draft/Pending are
  // excluded); listings without a status are legacy content treated as active.
  const ranked = useMemo(() => {
    const active = opportunities.filter((o) => isActiveOpportunity(o));
    const list =
      category === 'All' ? active : active.filter((o) => o.type === category);
    if (!user) return list;
    return [...list].sort(
      (a, b) => scoreOpportunity(user, b).score - scoreOpportunity(user, a).score,
    );
  }, [opportunities, category, user]);

  return (
    <div className="container tx-page">
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24 }}>Opportunities</h1>
        <p className="text-muted">
          Roles, projects, and people — matched to who you are and what you're
          looking for.
        </p>
      </div>

      <div className="tx-chip-wrap" style={{ margin: '0 0 20px' }}>
        {CATEGORIES.map((c) => (
          <Tag
            key={c}
            selected={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </Tag>
        ))}
      </div>

      {ranked.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No opportunities here yet"
          message="Try a different category — new opportunities are added all the time."
        />
      ) : (
        <div className="tx-grid tx-grid--wide">
          {ranked.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
