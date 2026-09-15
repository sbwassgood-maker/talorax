import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ask.css';
import '../components/content/collab.css';
import { Avatar, Button, Card, MatchPill, EmptyState } from '../components/ui';
import { useAuth } from '../services/auth';
import { users, getUserById, fullName } from '../data/users';
import { matchPeopleForCollab } from '../utils/matching';
import type { CollabPersonMatch } from '../utils/matching';

const EXAMPLES = [
  'I need a video editor who can turn YouTube videos into TikTok clips',
  'Looking for a React developer for an AI project',
  'I need a UI/UX designer for my startup',
  'Find me a cybersecurity collaborator who knows Python',
  "I'm looking for a marketing partner",
];

export function FindCollabPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<CollabPersonMatch[]>([]);
  const [searching, setSearching] = useState(false);

  if (!user) return null;

  const run = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || searching) return;
    setInput(trimmed);
    setSearching(true);
    setQuery(trimmed);
    window.setTimeout(() => {
      const matches = matchPeopleForCollab(trimmed, users, {
        excludeUserId: user.id,
      }).slice(0, 6);
      setResults(matches);
      setSearching(false);
    }, 320);
  };

  return (
    <div className="container tx-page">
      <div className="tx-ask">
        <div className="tx-ask__hero">
          <span className="tx-ask__badge">🤝 Find Someone For Me</span>
          <h1>Who do you need, {user.firstName}?</h1>
          <p>
            Describe who you're looking for in your own words — TALORAX finds
            real people whose skills match. No filters required.
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
            placeholder="e.g. I need a video editor for a gaming YouTube channel"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Describe who you need"
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
            <p className="text-muted">Searching TALORAX for people who match…</p>
          </Card>
        )}

        {query && !searching && (
          <div style={{ marginTop: 8 }}>
            {results.length === 0 ? (
              <EmptyState
                icon="🔎"
                title="No strong matches yet"
                message="No one on TALORAX clearly matches that request right now. Try describing the skills you need differently, or post a Collab so people can find you."
                action={
                  <Button variant="highlight" onClick={() => navigate('/discover')}>
                    Browse Collabs
                  </Button>
                }
              />
            ) : (
              <Card>
                <div className="tx-ask__block-heading">
                  TALORAX found {results.length}{' '}
                  {results.length === 1 ? 'person' : 'people'}
                </div>
                {results.map((m) => {
                  const person = getUserById(m.personId);
                  if (!person) return null;
                  return (
                    <div key={m.personId} className="tx-ask__item">
                      <Avatar name={fullName(person)} size={44} />
                      <div className="tx-ask__item-body">
                        <div
                          className="spread"
                          style={{ gap: 8, alignItems: 'flex-start' }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div className="tx-ask__item-title">
                              {fullName(person)}
                            </div>
                            <div className="tx-ask__item-sub">
                              {person.headline}
                            </div>
                          </div>
                          <MatchPill score={m.score} />
                        </div>
                        <div className="tx-ask__reasons">
                          {m.reasons.map((r) => (
                            <span key={r} className="tx-ask__reason">
                              {r}
                            </span>
                          ))}
                        </div>
                        <div className="tx-ask__item-actions">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/profile/${person.id}`)}
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate('/messages')}
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <p className="tx-ask__note">
                  Matches are ranked by the skills and interests people have
                  actually listed on TALORAX — transparent rules, nothing
                  invented.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
