import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './pages.css';
import { Avatar, Badge, Button, Card, Tag } from '../components/ui';
import { useAppState } from '../services/appState';
import { getUserById, fullName } from '../data/users';
import { NotFoundPage } from './NotFoundPage';

const STATUS_TONE = {
  'In progress': 'warning',
  Completed: 'success',
  'Looking for collaborators': 'primary',
} as const;

export function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useAppState();

  const project = projects.find((p) => p.id === id);
  const [likes, setLikes] = useState(project?.likeCount ?? 0);
  const [liked, setLiked] = useState(false);
  const [collaborating, setCollaborating] = useState(false);

  if (!project) return <NotFoundPage />;

  const creator = getUserById(project.creatorId);
  const collaborators = project.collaboratorIds
    .map((cid) => getUserById(cid))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  // Seed data uses '#' as a placeholder link; treat it as "no link yet".
  const hasLink = (url?: string) => Boolean(url && url !== '#');

  const toggleLike = () => {
    setLiked((l) => {
      setLikes((n) => n + (l ? -1 : 1));
      return !l;
    });
  };

  return (
    <div className="container tx-page">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 12 }}
      >
        ← Back
      </Button>

      <div className="tx-detail">
        <div>
          <div
            className="tx-detail__banner"
            style={{ background: project.coverColor }}
          >
            {project.coverLabel}
          </div>

          <div className="spread" style={{ alignItems: 'flex-start', gap: 12 }}>
            <h1>{project.title}</h1>
            <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
          </div>

          {creator && (
            <Link
              to={`/profile/${creator.id}`}
              className="row"
              style={{ gap: 10, marginTop: 12 }}
            >
              <Avatar name={fullName(creator)} size={40} />
              <div>
                <div style={{ fontWeight: 600 }}>Created by {fullName(creator)}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {creator.headline}
                </div>
              </div>
            </Link>
          )}

          <div className="tx-detail__section">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>

          <div className="tx-detail__section">
            <h3>Technologies</h3>
            <div className="tx-tag-row">
              {project.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>

          {project.seekingRoles && project.seekingRoles.length > 0 && (
            <div className="tx-detail__section">
              <h3>Looking for collaborators</h3>
              <div className="tx-tag-row">
                {project.seekingRoles.map((r) => (
                  <Tag key={r}>{r}</Tag>
                ))}
              </div>
            </div>
          )}

          {collaborators.length > 0 && (
            <div className="tx-detail__section">
              <h3>Collaborators</h3>
              {collaborators.map((c) => (
                <Link key={c.id} to={`/profile/${c.id}`} className="tx-team-member">
                  <Avatar name={fullName(c)} size={40} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{fullName(c)}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {c.headline}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Social action bar — this is a portfolio item AND a social post */}
          <div className="tx-post__actions" style={{ marginTop: 20 }}>
            <button
              className={`tx-action-btn${liked ? ' tx-action-btn--liked' : ''}`}
              onClick={toggleLike}
              aria-pressed={liked}
            >
              {liked ? '❤️' : '🤍'} {likes} Like
            </button>
            <button className="tx-action-btn">💬 {project.commentCount} Comment</button>
            <button
              className={`tx-action-btn${collaborating ? ' tx-action-btn--active' : ''}`}
              onClick={() => setCollaborating((c) => !c)}
              aria-pressed={collaborating}
            >
              🤝 {collaborating ? 'Requested' : 'Collaborate'}
            </button>
          </div>
        </div>

        {/* Right rail */}
        <div className="tx-sticky-actions">
          <Card>
            <div className="stack" style={{ gap: 8 }}>
              <Button
                block
                onClick={() => setCollaborating(true)}
                disabled={collaborating}
              >
                {collaborating ? '✓ Request sent' : '🤝 Collaborate'}
              </Button>
              <Button
                block
                variant="secondary"
                onClick={() =>
                  hasLink(project.githubUrl) &&
                  window.open(project.githubUrl, '_blank', 'noopener')
                }
                disabled={!hasLink(project.githubUrl)}
                title={hasLink(project.githubUrl) ? 'Open repository' : 'No repository linked yet'}
              >
                ⌨ View code
              </Button>
              <Button
                block
                variant="secondary"
                onClick={() =>
                  hasLink(project.demoUrl) &&
                  window.open(project.demoUrl, '_blank', 'noopener')
                }
                disabled={!hasLink(project.demoUrl)}
                title={hasLink(project.demoUrl) ? 'Open live demo' : 'No demo linked yet'}
              >
                ▶ Live demo
              </Button>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>Project status</h3>
            <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
            <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
              {project.status === 'Looking for collaborators'
                ? 'This project is open to new collaborators — reach out!'
                : 'Follow the creator to see updates on this project.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
