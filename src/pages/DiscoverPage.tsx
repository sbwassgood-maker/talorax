import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';
import '../components/content/content.css';
import '../components/content/collab.css';
import { Tabs, Tag, Button } from '../components/ui';
import { PersonCard } from '../components/content/PersonCard';
import { ProjectCard } from '../components/content/ProjectCard';
import { CompanyCard } from '../components/content/CompanyCard';
import { CommunityCard } from '../components/content/CommunityCard';
import { CollabCard } from '../components/content/CollabCard';
import { OpportunityCard } from '../components/content/OpportunityCard';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { useCreateFlow } from '../services/createFlow';
import { users } from '../data/users';
import { companies } from '../data/companies';
import { communities } from '../data/communities';
import { scorePerson } from '../utils/matching';
import { isJob } from '../models';
import type { CollabCategoryGroup } from '../models';
import { INDUSTRIES } from '../data/industries';

const TABS = [
  'Jobs',
  'Collabs',
  'People',
  'Companies',
  'Projects',
  'Communities',
] as const;
type Tab = (typeof TABS)[number];

const COLLAB_FILTERS: (CollabCategoryGroup | 'All')[] = [
  'All',
  'Creator',
  'Creative',
  'Technology',
  'Business',
  'Learning',
  'Projects',
];

export function DiscoverPage() {
  const { user } = useAuth();
  const { projects, collabs, opportunities } = useAppState();
  const { open: openCreate } = useCreateFlow();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('Jobs');
  const [collabFilter, setCollabFilter] = useState<(typeof COLLAB_FILTERS)[number]>('All');
  const [jobIndustry, setJobIndustry] = useState<string>('All');

  const jobs = useMemo(() => opportunities.filter(isJob), [opportunities]);
  // Industries that actually have jobs, so the chip row isn't cluttered.
  const jobIndustryOptions = useMemo(() => {
    const present = new Set(jobs.map((j) => j.industry).filter(Boolean) as string[]);
    return ['All', ...INDUSTRIES.filter((i) => present.has(i.name)).map((i) => i.name)];
  }, [jobs]);
  const visibleJobs =
    jobIndustry === 'All' ? jobs : jobs.filter((j) => j.industry === jobIndustry);

  // Recommend people other than the current user, ranked by relevance.
  const recommendedPeople = useMemo(() => {
    if (!user) return [];
    return users
      .filter((u) => u.id !== user.id)
      .map((u) => ({ u, rec: scorePerson(user, u) }))
      .sort((a, b) => b.rec.score - a.rec.score)
      .map((x) => x.u);
  }, [user]);

  const visibleCollabs =
    collabFilter === 'All'
      ? collabs
      : collabs.filter((c) => c.categoryGroup === collabFilter);

  return (
    <div className="container tx-page">
      <div className="spread" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Discover</h1>
          <p className="text-muted">
            Jobs, collabs, people, companies, projects, and communities — across
            every industry.
          </p>
        </div>
        <Button variant="highlight" onClick={openCreate}>
          + Create
        </Button>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div style={{ marginTop: 20 }}>
        {tab === 'Jobs' && (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <Button size="sm" onClick={() => navigate('/jobs')}>
                Browse all jobs & filters
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/jobs/find')}
              >
                ✨ Find a Job For Me
              </Button>
              <span className="text-muted" style={{ fontSize: 13 }}>
                {jobs.length} open roles across every industry.
              </span>
            </div>
            <div className="tx-collab-cats">
              {jobIndustryOptions.map((f) => (
                <Tag
                  key={f}
                  selected={jobIndustry === f}
                  onClick={() => setJobIndustry(f)}
                >
                  {f}
                </Tag>
              ))}
            </div>
            <div className="tx-grid tx-grid--wide">
              {visibleJobs.map((j) => (
                <OpportunityCard key={j.id} opp={j} />
              ))}
            </div>
          </>
        )}

        {tab === 'Collabs' && (
          <>
            <div className="row" style={{ gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/collabs/find')}
              >
                ✨ Find Someone For Me
              </Button>
              <span className="text-muted" style={{ fontSize: 13 }}>
                Describe who you need and TALORAX finds real people.
              </span>
            </div>
            <div className="tx-collab-cats">
              {COLLAB_FILTERS.map((f) => (
                <Tag
                  key={f}
                  selected={collabFilter === f}
                  onClick={() => setCollabFilter(f)}
                >
                  {f}
                </Tag>
              ))}
            </div>
            <div className="tx-collab-grid">
              {visibleCollabs.map((c) => (
                <CollabCard key={c.id} collab={c} />
              ))}
            </div>
          </>
        )}

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
