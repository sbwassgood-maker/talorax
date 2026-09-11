import { useMemo, useState } from 'react';
import './pages.css';
import '../components/content/content.css';
import { Tabs } from '../components/ui';
import { PersonCard } from '../components/content/PersonCard';
import { ProjectCard } from '../components/content/ProjectCard';
import { CompanyCard } from '../components/content/CompanyCard';
import { CommunityCard } from '../components/content/CommunityCard';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { users } from '../data/users';
import { companies } from '../data/companies';
import { communities } from '../data/communities';
import { scorePerson } from '../utils/matching';

const TABS = ['People', 'Companies', 'Projects', 'Communities'] as const;
type Tab = (typeof TABS)[number];

export function DiscoverPage() {
  const { user } = useAuth();
  const { projects } = useAppState();
  const [tab, setTab] = useState<Tab>('People');

  // Recommend people other than the current user, ranked by relevance.
  const recommendedPeople = useMemo(() => {
    if (!user) return [];
    return users
      .filter((u) => u.id !== user.id)
      .map((u) => ({ u, rec: scorePerson(user, u) }))
      .sort((a, b) => b.rec.score - a.rec.score)
      .map((x) => x.u);
  }, [user]);

  return (
    <div className="container tx-page">
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24 }}>Discover</h1>
        <p className="text-muted">
          Find people, companies, projects, and communities to grow with.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div style={{ marginTop: 20 }}>
        {tab === 'People' && (
          <div className="tx-grid">
            {recommendedPeople.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        )}

        {tab === 'Companies' && (
          <div className="tx-grid tx-grid--wide">
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}

        {tab === 'Projects' && (
          <div className="tx-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        {tab === 'Communities' && (
          <div className="tx-grid">
            {communities.map((c) => (
              <CommunityCard key={c.id} community={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
