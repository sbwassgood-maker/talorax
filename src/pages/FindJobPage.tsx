import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ask.css';
import './jobs.css';
import { Button, Card, EmptyState } from '../components/ui';
import { OpportunityCard } from '../components/content/OpportunityCard';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { isJob, isActiveOpportunity } from '../models';
import { matchJobsForQuery } from '../utils/matching';
import { INDUSTRY_NAMES } from '../data/industries';

const EXAMPLES = [
  "I'm looking for a full-time job in Miami. I'm good with people, don't have much experience, and want at least $45,000.",
  'Find me a remote customer service job',
  'I want to work in healthcare but I have no experience',
  'Entry-level jobs in construction or the trades',
  'Part-time jobs paying $20/hr or more near me',
];

export function FindJobPage() {
  const { user } = useAuth();
  const { opportunities } = useAppState();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [reasonsById, setReasonsById] = useState<Record<string, string[]>>({});
  const [searching, setSearching] = useState(false);

  if (!user) return null;

  const run = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || searching) return;
    setInput(trimmed);
    setSearching(true);
    setQuery(trimmed);
    window.setTimeout(() => {
      const jobs = opportunities.filter((o) => isJob(o) && isActiveOpportunity(o));
      const matches = matchJobsForQuery(trimmed, jobs, {
        user,
        industryVocabulary: INDUSTRY_NAMES,
      }).slice(0, 6);
      setResults(matches.map((m) => m.opportunityId));
      setReasonsById(
        Object.fromEntries(matches.map((m) => [m.opportunityId, m.reasons])),
      );
      setSearching(false);
    }, 320);
  };

  const jobById = (id: string) => opportunities.find((o) => o.id === id);

  return (
    <div className="container tx-page">
      <div className="tx-ask">
        <div className="tx-ask__hero">
          <span className="tx-ask__badge">✨ Find a Job For Me</span>
          <h1>What kind of job are you looking for, {user.firstName}?</h1>
          <p>
            Describe it in your own words — location, pay, hours, experience,
            whatever matters to you. We search across every industry, not just
            your current field.
          </p>
        </div>

        <form
          className="tx-ask__composer"
          style={{ position: 'static', padding: '4px 0 16px' }}
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <input
            className="tx-input"
            placeholder="e.g. Full-time job in Miami, good with people, at least $45k"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Describe the job you want"
          />
          <Button type="submit" disabled={!input.trim() || searching}>
            Find
          </Button>
        </form>

        {!query && (
          <div className="tx-ask__suggest">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="tx-ask__chip" onClick={() => run(ex)}>
                <span className="tx-ask__chip-icon" aria-hidden="true">
                  💬
                </span>
                {ex}
              </button>
            ))}
          </div>
        )}

        {searching && (
          <Card style={{ marginTop: 8 }}>
            <p className="text-muted">Searching jobs across every industry…</p>
          </Card>
        )}

        {query && !searching && (
          <div style={{ marginTop: 8 }}>
            {results.length === 0 ? (
              <EmptyState
                icon="🔎"
                title="No close matches yet"
                message="Try describing the location, pay, or type of work differently — or browse all jobs."
                action={
                  <Button variant="highlight" onClick={() => navigate('/jobs')}>
                    Browse all jobs
                  </Button>
                }
              />
            ) : (
              <>
                <div className="tx-ask__block-heading">
                  TALORAX found {results.length} job
                  {results.length === 1 ? '' : 's'} for you
                </div>
                <div className="tx-jobs-results" style={{ display: 'grid', gap: 16 }}>
                  {results.map((id) => {
                    const job = jobById(id);
                    if (!job) return null;
                    return (
                      <div key={id}>
                        <OpportunityCard opp={job} />
                        {reasonsById[id]?.length > 0 && (
                          <div
                            className="tx-ask__reasons"
                            style={{ margin: '6px 2px 0' }}
                          >
                            {reasonsById[id].map((r) => (
                              <span key={r} className="tx-ask__reason">
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="tx-ask__note">
                  Ranked from real TALORAX job listings using transparent rules —
                  we don't limit results to your current profession, and nothing
                  here is invented.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
