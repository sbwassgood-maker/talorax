import { useParams, Link } from 'react-router-dom';
import './pages.css';
import '../components/content/content.css';
import { Avatar, Button, Card, Tag } from '../components/ui';
import { ConnectButton, FollowButton } from '../components/social/ConnectButton';
import { ProjectCard } from '../components/content/ProjectCard';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { getUserById, fullName } from '../data/users';
import { compactNumber } from '../utils/format';
import { NotFoundPage } from './NotFoundPage';

export function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { projects } = useAppState();

  // No id => own profile. With id, look up the seeded user.
  const isOwn = !id || id === currentUser?.id;
  const profile = isOwn ? currentUser : getUserById(id!);

  if (!profile) return <NotFoundPage />;

  const userProjects = projects.filter((p) => p.creatorId === profile.id);
  const followers = profile.followerIds.length;
  const connections = profile.connectionIds.length;

  return (
    <div className="container tx-page">
      <div className="tx-profile-header">
        <div className="tx-profile-cover" />
        <div className="tx-profile-id">
          <span className="tx-profile-id__avatar">
            <Avatar name={fullName(profile)} size={92} />
          </span>
          <div className="tx-profile-id__main">
            <h1 style={{ fontSize: 24 }}>{fullName(profile)}</h1>
            <div className="text-muted">{profile.headline}</div>
            {profile.location && (
              <div style={{ color: 'var(--color-text-faint)', fontSize: 13 }}>
                📍 {profile.location}
              </div>
            )}
          </div>
          <div className="tx-profile-id__actions">
            {isOwn ? (
              <Button variant="secondary" size="sm">
                Edit profile
              </Button>
            ) : (
              <>
                <ConnectButton userId={profile.id} size="md" />
                <FollowButton userId={profile.id} size="md" />
                <Link to="/messages">
                  <Button variant="secondary" size="md">
                    Message
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="tx-stat-row" style={{ padding: '0 4px 18px' }}>
        <span className="tx-stat">
          <b>{compactNumber(connections)}</b>{' '}
          <span className="text-muted">connections</span>
        </span>
        <span className="tx-stat">
          <b>{compactNumber(followers)}</b>{' '}
          <span className="text-muted">followers</span>
        </span>
        <span className="tx-stat">
          <b>{userProjects.length}</b>{' '}
          <span className="text-muted">projects</span>
        </span>
      </div>

      <div className="tx-profile-grid">
        <div className="stack" style={{ gap: 18 }}>
          {profile.about && (
            <Card>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>About</h3>
              <p>{profile.about}</p>
            </Card>
          )}

          {userProjects.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Projects</h3>
              <div className="tx-grid">
                {userProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {profile.experience.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Experience</h3>
              <div className="stack" style={{ gap: 14 }}>
                {profile.experience.map((e) => (
                  <div key={e.id} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                    <Avatar name={e.organization} size={40} square />
                    <div>
                      <div style={{ fontWeight: 700 }}>{e.title}</div>
                      <div className="text-muted" style={{ fontSize: 13.5 }}>
                        {e.organization} · {e.startYear}–{e.endYear ?? 'Present'}
                      </div>
                      {e.description && (
                        <p style={{ fontSize: 14, marginTop: 4 }}>
                          {e.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {profile.education.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Education</h3>
              <div className="stack" style={{ gap: 14 }}>
                {profile.education.map((e) => (
                  <div key={e.id} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                    <Avatar name={e.school} size={40} square />
                    <div>
                      <div style={{ fontWeight: 700 }}>{e.school}</div>
                      <div className="text-muted" style={{ fontSize: 13.5 }}>
                        {e.degree}, {e.field} · {e.startYear}–{e.endYear ?? 'Present'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Side rail */}
        <div className="stack" style={{ gap: 18 }}>
          {profile.lookingFor.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>I'm looking for</h3>
              <div className="tx-tag-row" style={{ margin: 0 }}>
                {profile.lookingFor.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
              </div>
            </Card>
          )}

          {profile.canHelpWith.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>I can help with</h3>
              <div className="tx-tag-row" style={{ margin: 0 }}>
                {profile.canHelpWith.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Card>
          )}

          {profile.skills.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Skills</h3>
              <div className="tx-tag-row" style={{ margin: 0 }}>
                {profile.skills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Card>
          )}

          {profile.interests.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Interests</h3>
              <div className="tx-tag-row" style={{ margin: 0 }}>
                {profile.interests.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
