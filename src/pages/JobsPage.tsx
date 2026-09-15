import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';
import './jobs.css';
import '../components/content/content.css';
import { Button, Card, EmptyState } from '../components/ui';
import { OpportunityCard } from '../components/content/OpportunityCard';
import { useAppState } from '../services/appState';
import { isJob, JOB_TYPES, isActiveOpportunity } from '../models';
import type { Opportunity, OpportunityType, Seniority, WorkMode } from '../models';
import { getCompanyById } from '../data/companies';
import { INDUSTRIES } from '../data/industries';
import { getActiveMarkets, findMarketForLocation } from '../data/geo';

const WORK_MODES: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];
const SENIORITIES: Seniority[] = ['Entry level', 'Mid level', 'Senior level'];
const SALARY_BANDS: { label: string; min: number }[] = [
  { label: 'Any', min: 0 },
  { label: '$40k+', min: 40000 },
  { label: '$60k+', min: 60000 },
  { label: '$80k+', min: 80000 },
  { label: '$100k+', min: 100000 },
];
const DATE_BANDS: { label: string; days: number }[] = [
  { label: 'Any time', days: 0 },
  { label: 'Past week', days: 7 },
  { label: 'Past month', days: 31 },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function JobsPage() {
  const navigate = useNavigate();
  const { opportunities } = useAppState();

  const [query, setQuery] = useState('');
  const [industries, setIndustries] = useState<string[]>([]);
  const [types, setTypes] = useState<OpportunityType[]>([]);
  const [seniorities, setSeniorities] = useState<Seniority[]>([]);
  const [workModes, setWorkModes] = useState<WorkMode[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [dateDays, setDateDays] = useState(0);
  // Market + neighborhood filters. Empty market = "all markets" (default).
  const [market, setMarket] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // "Now" captured once via a lazy state initializer — stable across renders
  // (keeps the filter memo pure) and plenty fresh for a date-posted filter.
  const [now] = useState(() => Date.now());

  const activeMarkets = useMemo(() => getActiveMarkets(), []);
  const selectedMarket = useMemo(
    () => activeMarkets.find((m) => m.id === market),
    [activeMarkets, market],
  );

  // Only employment jobs that are actually live (Active/legacy + not expired).
  // Paused, Closed, Expired, Rejected, Draft, and Pending are excluded.
  const allJobs = useMemo(
    () => opportunities.filter((o) => isJob(o) && isActiveOpportunity(o, now)),
    [opportunities, now],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allJobs.filter((job) => {
      // Text search: title, skills, company name, industry, location
      if (q) {
        const company = job.companyId ? getCompanyById(job.companyId) : undefined;
        const haystack = [
          job.title,
          job.industry ?? '',
          job.location,
          company?.name ?? '',
          ...job.requiredSkills,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Market filter: match the job's structured city/state OR its free-text
      // location against the selected active market (Miami-first, but generic).
      if (selectedMarket) {
        const inMarket =
          (job.city && job.city.toLowerCase() === selectedMarket.city.toLowerCase()) ||
          findMarketForLocation(job.location)?.id === selectedMarket.id;
        if (!inMarket) return false;
        // Neighborhood sub-filter only applies within a selected market.
        if (neighborhoods.length) {
          const jobHood = job.neighborhood ?? '';
          if (!neighborhoods.some((n) => n.toLowerCase() === jobHood.toLowerCase()))
            return false;
        }
      }
      if (industries.length && !industries.includes(job.industry ?? '')) return false;
      if (types.length && !types.includes(job.type)) return false;
      if (seniorities.length && !seniorities.includes(job.seniority ?? ('' as Seniority)))
        return false;
      if (workModes.length && !workModes.includes(job.workMode)) return false;
      if (salaryMin > 0 && (job.salaryMin ?? 0) < salaryMin) return false;
      if (dateDays > 0) {
        const posted = job.postedAt ?? job.createdAt;
        const age = (now - new Date(posted).getTime()) / 86400000;
        if (age > dateDays) return false;
      }
      return true;
    });
  }, [
    allJobs,
    query,
    industries,
    types,
    seniorities,
    workModes,
    salaryMin,
    dateDays,
    now,
    selectedMarket,
    neighborhoods,
  ]);

  const hasFilters =
    industries.length ||
    types.length ||
    seniorities.length ||
    workModes.length ||
    salaryMin > 0 ||
    dateDays > 0 ||
    market ||
    neighborhoods.length ||
    query.trim();

  const clearAll = () => {
    setQuery('');
    setIndustries([]);
    setTypes([]);
    setSeniorities([]);
    setWorkModes([]);
    setSalaryMin(0);
    setDateDays(0);
    setMarket('');
    setNeighborhoods([]);
  };

  return (
    <div className="container tx-page">
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 24 }}>Jobs</h1>
        <p className="text-muted">
          Find roles across every industry — healthcare, education, trades,
          finance, hospitality, tech, and more. Now live in{' '}
          {activeMarkets.map((m) => m.city).join(', ') || 'select markets'}.
        </p>
      </div>

      {/* AI job discovery banner */}
      <div className="tx-jobs-ai-banner">
        <div>
          <h3>✨ Find a Job For Me</h3>
          <p>Describe what you want in your own words — we search every field.</p>
        </div>
        <Button variant="highlight" onClick={() => navigate('/jobs/find')}>
          Try it
        </Button>
      </div>

      <div className="tx-jobs-layout">
        {/* Filters */}
        <aside>
          <Button
            variant="secondary"
            size="sm"
            className="tx-jobs-filter-toggle"
            onClick={() => setFiltersOpen((o) => !o)}
            style={{ marginBottom: 12 }}
          >
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </Button>
          <Card
            className={`tx-jobs-filters${filtersOpen ? '' : ' tx-jobs-filters--collapsed'}`}
          >
            <div className="spread" style={{ marginBottom: 14 }}>
              <strong>Filters</strong>
              {hasFilters ? (
                <button className="tx-jobs-clear" onClick={clearAll}>
                  Clear all
                </button>
              ) : null}
            </div>

            <FilterGroup label="Market">
              <select
                className="tx-select"
                value={market}
                onChange={(e) => {
                  setMarket(e.target.value);
                  setNeighborhoods([]); // reset neighborhoods when market changes
                }}
                aria-label="Market"
              >
                <option value="">All markets</option>
                {activeMarkets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.city}, {m.stateCode}
                  </option>
                ))}
              </select>
            </FilterGroup>

            {selectedMarket && selectedMarket.neighborhoods.length > 0 && (
              <FilterGroup label={`${selectedMarket.city} neighborhoods`}>
                <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
                  {selectedMarket.neighborhoods.map((n) => (
                    <Check
                      key={n.id}
                      label={n.name}
                      checked={neighborhoods.includes(n.name)}
                      onChange={() => setNeighborhoods((l) => toggle(l, n.name))}
                    />
                  ))}
                </div>
              </FilterGroup>
            )}

            <FilterGroup label="Job type">
              {JOB_TYPES.map((t) => (
                <Check
                  key={t}
                  label={t}
                  checked={types.includes(t)}
                  onChange={() => setTypes((l) => toggle(l, t))}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Experience level">
              {SENIORITIES.map((s) => (
                <Check
                  key={s}
                  label={s}
                  checked={seniorities.includes(s)}
                  onChange={() => setSeniorities((l) => toggle(l, s))}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Work arrangement">
              {WORK_MODES.map((w) => (
                <Check
                  key={w}
                  label={w}
                  checked={workModes.includes(w)}
                  onChange={() => setWorkModes((l) => toggle(l, w))}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Minimum salary">
              <select
                className="tx-select"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                aria-label="Minimum salary"
              >
                {SALARY_BANDS.map((b) => (
                  <option key={b.label} value={b.min}>
                    {b.label}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Date posted">
              <select
                className="tx-select"
                value={dateDays}
                onChange={(e) => setDateDays(Number(e.target.value))}
                aria-label="Date posted"
              >
                {DATE_BANDS.map((b) => (
                  <option key={b.label} value={b.days}>
                    {b.label}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Industry">
              <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 4 }}>
                {INDUSTRIES.filter((i) => i.id !== 'other').map((i) => (
                  <Check
                    key={i.id}
                    label={`${i.icon} ${i.name}`}
                    checked={industries.includes(i.name)}
                    onChange={() => setIndustries((l) => toggle(l, i.name))}
                  />
                ))}
              </div>
            </FilterGroup>
          </Card>
        </aside>

        {/* Results */}
        <div>
          <div className="tx-jobs-searchbar">
            <input
              className="tx-input"
              placeholder="Search by title, skill, company, industry, or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search jobs"
            />
          </div>
          <div className="tx-jobs-count">
            {filtered.length} job{filtered.length === 1 ? '' : 's'}
            {hasFilters ? ' matching your filters' : ' across all industries'}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="🔎"
              title="No jobs match those filters"
              message="Try clearing a filter or broadening your search — new roles are added across every industry."
              action={<Button onClick={clearAll}>Clear filters</Button>}
            />
          ) : (
            <div className="tx-jobs-results">
              {filtered.map((job: Opportunity) => (
                <OpportunityCard key={job.id} opp={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tx-filter-group">
      <div className="tx-filter-group__label">{label}</div>
      <div className="tx-filter-options">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="tx-filter-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}
