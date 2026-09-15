import { Link } from 'react-router-dom';
import './content.css';
import { Avatar, Badge, Card } from '../ui';
import { FollowButton } from '../social/ConnectButton';
import { useAppState } from '../../services/appState';
import type { Post } from '../../models';
import { getUserById, fullName } from '../../data/users';
import { getProjectById } from '../../data/projects';
import { getCompanyById } from '../../data/companies';
import { getOpportunityById } from '../../data/opportunities';
import { getCollabById } from '../../data/collabs';
import { timeAgo, compactNumber } from '../../utils/format';

import { communities } from '../../data/communities';

const TYPE_META: Record<
  Post['type'],
  { label: string; tone: 'primary' | 'neutral' | 'success' | 'warning'; icon: string }
> = {
  text: { label: 'Post', tone: 'neutral', icon: '💬' },
  project: { label: 'Project', tone: 'primary', icon: '🚀' },
  company: { label: 'Company', tone: 'warning', icon: '🏢' },
  opportunity: { label: 'Opportunity', tone: 'success', icon: '💼' },
  learning: { label: 'Learning', tone: 'primary', icon: '🎓' },
  collaboration: { label: 'Collaboration', tone: 'success', icon: '🤝' },
  video: { label: 'Video', tone: 'primary', icon: '▶' },
  collab: { label: 'Collab', tone: 'warning', icon: '🤝' },
};

// The social-first idea: content should lead to people, communities, and
// opportunities. Derive a couple of relevant, deterministic "discover next"
// links from the post's topic so browsing naturally opens doors.
function relatedFor(post: Post): { label: string; to: string }[] {
  const links: { label: string; to: string }[] = [];
  const text = `${post.content}`.toLowerCase();
  const topical = communities.find((c) =>
    text.includes(c.topic.toLowerCase().split(' ')[0]),
  );
  if (topical) links.push({ label: `#${topical.name}`, to: '/discover' });
  if (post.type === 'collaboration' || post.type === 'project') {
    links.push({ label: 'People building this', to: '/discover' });
  }
  if (post.type === 'opportunity') {
    links.push({ label: 'Similar opportunities', to: '/opportunities' });
  }
  if (links.length === 0) {
    links.push({ label: 'Discover related people', to: '/discover' });
  }
  return links.slice(0, 2);
}

export function PostCard({ post }: { post: Post }) {
  const {
    likedPostIds,
    savedPostIds,
    toggleLike,
    toggleSavePost,
  } = useAppState();

  const author = getUserById(post.authorId);
  const company = post.companyId ? getCompanyById(post.companyId) : undefined;
  const liked = likedPostIds.has(post.id);
  const saved = savedPostIds.has(post.id);

  const displayName = company ? company.name : author ? fullName(author) : 'Someone';
  const subline = company
    ? company.industry
    : author
      ? author.headline
      : '';

  return (
    <Card className="tx-post">
      <div className="tx-post__head">
        <Link to={author ? `/profile/${author.id}` : '#'}>
          <Avatar name={displayName} size={46} square={Boolean(company)} />
        </Link>
        <div style={{ minWidth: 0 }}>
          <div className="tx-post__author">
            {author && !company ? (
              <Link to={`/profile/${author.id}`}>{displayName}</Link>
            ) : (
              displayName
            )}
          </div>
          <div className="tx-post__meta">
            {subline} · {timeAgo(post.createdAt)}
          </div>
        </div>
        <div className="tx-post__type">
          <Badge tone={TYPE_META[post.type].tone}>
            {TYPE_META[post.type].icon} {TYPE_META[post.type].label}
          </Badge>
        </div>
      </div>

      <p className="tx-post__body">{post.content}</p>

      {post.mediaLabel && (
        <div
          className="tx-post__media"
          style={{ background: post.mediaColor ?? 'var(--color-primary)' }}
        >
          {post.mediaLabel}
        </div>
      )}

      {post.projectId && <ProjectEmbed projectId={post.projectId} />}
      {post.opportunityId && <OpportunityEmbed oppId={post.opportunityId} />}
      {post.collabId && <CollabEmbed collabId={post.collabId} />}

      {/* Social-first: every post opens a door to related discovery */}
      <div className="tx-post__discover">
        <span className="tx-post__discover-label">Discover next</span>
        {relatedFor(post).map((r) => (
          <Link key={r.label} to={r.to} className="tx-post__chip">
            {r.label}
          </Link>
        ))}
      </div>

      <div className="tx-post__meta" style={{ padding: '4px 2px' }}>
        {compactNumber(post.likeCount)} likes · {post.commentCount} comments ·{' '}
        {post.shareCount} shares
      </div>

      <div className="tx-post__actions">
        <button
          className={`tx-action-btn${liked ? ' tx-action-btn--liked' : ''}`}
          onClick={() => toggleLike(post.id)}
          aria-pressed={liked}
        >
          {liked ? '❤️' : '🤍'} Like
        </button>
        <button className="tx-action-btn">💬 Comment</button>
        <button className="tx-action-btn">↗ Share</button>
        <button
          className={`tx-action-btn${saved ? ' tx-action-btn--active' : ''}`}
          onClick={() => toggleSavePost(post.id)}
          aria-pressed={saved}
        >
          {saved ? '🔖 Saved' : '🔖 Save'}
        </button>
        {author && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FollowButton userId={author.id} />
          </div>
        )}
      </div>
    </Card>
  );
}

function ProjectEmbed({ projectId }: { projectId: string }) {
  const project = getProjectById(projectId);
  if (!project) return null;
  return (
    <Link to={`/projects/${project.id}`} className="tx-embed" style={{ display: 'block' }}>
      <div
        className="tx-embed__banner"
        style={{ background: project.coverColor }}
      >
        {project.coverLabel}
      </div>
      <div className="tx-embed__body">
        <div className="tx-embed__label">Project</div>
        <div style={{ fontWeight: 700, margin: '2px 0 4px' }}>
          {project.title}
        </div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          {project.technologies.join(' · ')}
        </div>
      </div>
    </Link>
  );
}

function OpportunityEmbed({ oppId }: { oppId: string }) {
  const opp = getOpportunityById(oppId);
  if (!opp) return null;
  const company = opp.companyId ? getCompanyById(opp.companyId) : undefined;
  return (
    <Link
      to={`/opportunities/${opp.id}`}
      className="tx-embed"
      style={{ display: 'block' }}
    >
      <div className="tx-embed__body">
        <div className="tx-embed__label">Opportunity · {opp.type}</div>
        <div style={{ fontWeight: 700, margin: '2px 0 4px' }}>{opp.title}</div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          {company ? `${company.name} · ` : ''}
          {opp.location} · {opp.workMode}
        </div>
      </div>
    </Link>
  );
}

function CollabEmbed({ collabId }: { collabId: string }) {
  const collab = getCollabById(collabId);
  if (!collab) return null;
  return (
    <Link
      to={`/collabs/${collab.id}`}
      className="tx-embed"
      style={{ display: 'block' }}
    >
      <div
        className="tx-embed__banner"
        style={{ background: collab.accentColor }}
      >
        🤝 {collab.accentLabel}
      </div>
      <div className="tx-embed__body">
        <div className="tx-embed__label">Collab · {collab.category}</div>
        <div style={{ fontWeight: 700, margin: '2px 0 4px' }}>{collab.title}</div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          Looking for: {collab.lookingFor.join(' · ')}
        </div>
      </div>
    </Link>
  );
}
