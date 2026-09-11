import { Link } from 'react-router-dom';
import './pages.css';
import { Avatar, Card } from '../components/ui';
import { PostCard } from '../components/content/PostCard';
import { useAppState } from '../services/appState';
import { useAuth } from '../services/auth';
import { useCreateFlow } from '../services/createFlow';
import { greeting } from '../utils/format';
import { fullName } from '../data/users';
import { opportunities } from '../data/opportunities';
import { getCompanyById } from '../data/companies';
import { scoreOpportunity } from '../utils/matching';
import { communities } from '../data/communities';
import { compactNumber } from '../utils/format';

export function HomePage() {
  const { user } = useAuth();
  const { posts } = useAppState();
  const { open } = useCreateFlow();

  if (!user) return null;

  // Top matched opportunities for the sidebar.
  const topOpps = [...opportunities]
    .map((o) => ({ opp: o, rec: scoreOpportunity(user, o) }))
    .sort((a, b) => b.rec.score - a.rec.score)
    .slice(0, 3);

  return (
    <div className="container tx-page">
      <div className="tx-layout-2">
        <div>
          <div style={{ marginBottom: 18 }}>
            <h1 style={{ fontSize: 24 }}>
              {greeting()}, {user.firstName}
            </h1>
            <p className="text-muted">Here's what's happening in your world.</p>
          </div>

          {/* Composer entry */}
          <Card>
            <div className="tx-composer" style={{ marginBottom: 0 }}>
              <Avatar name={fullName(user)} size={44} />
              <button className="tx-composer__fake" onClick={open}>
                Share something, {user.firstName}…
              </button>
            </div>
            <div className="tx-post__actions" style={{ marginTop: 12 }}>
              <button className="tx-action-btn" onClick={open}>
                📝 Post
              </button>
              <button className="tx-action-btn" onClick={open}>
                🚀 Project
              </button>
              <button className="tx-action-btn" onClick={open}>
                🤝 Collaboration
              </button>
            </div>
          </Card>

          <h2 className="tx-section-title" style={{ margin: '22px 0 12px' }}>
            For You
          </h2>

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <aside className="tx-side-hide-mobile">
          <div className="tx-sticky-side stack" style={{ gap: 16 }}>
            <Card>
              <div className="spread" style={{ marginBottom: 10 }}>
                <strong>Opportunities for you</strong>
                <Link
                  to="/opportunities"
                  style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  See all
                </Link>
              </div>
              <div className="stack" style={{ gap: 12 }}>
                {topOpps.map(({ opp, rec }) => {
                  const company = opp.companyId
                    ? getCompanyById(opp.companyId)
                    : undefined;
                  return (
                    <Link
                      key={opp.id}
                      to={`/opportunities/${opp.id}`}
                      className="stack"
                      style={{ gap: 2 }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {opp.title}
                      </span>
                      <span className="text-muted" style={{ fontSize: 12.5 }}>
                        {company?.name ?? 'Talorax member'} · {rec.score}% match
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div className="spread" style={{ marginBottom: 10 }}>
                <strong>Your Radar</strong>
                <Link
                  to="/radar"
                  style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  Open
                </Link>
              </div>
              <p className="text-muted" style={{ fontSize: 13.5 }}>
                📡 Talorax is finding your next step — new opportunities, people
                to meet, and skills to grow.
              </p>
            </Card>

            <Card>
              <strong>Communities</strong>
              <div className="stack" style={{ gap: 10, marginTop: 10 }}>
                {communities.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    to="/discover"
                    className="row"
                    style={{ gap: 10 }}
                  >
                    <span
                      className="tx-avatar tx-avatar--square"
                      style={{ width: 36, height: 36, background: c.coverColor, fontSize: 14 }}
                      aria-hidden="true"
                    >
                      {c.name[0]}
                    </span>
                    <span>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                        {c.name}
                      </div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {compactNumber(c.memberCount)} members
                      </div>
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
