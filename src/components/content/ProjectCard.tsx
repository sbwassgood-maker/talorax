import { Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Tag } from '../ui';
import type { Project } from '../../models';
import { getUserById, fullName } from '../../data/users';

const STATUS_TONE = {
  'In progress': 'warning',
  Completed: 'success',
  'Looking for collaborators': 'primary',
} as const;

export function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const creator = getUserById(project.creatorId);
  return (
    <Card hover className="stack">
      <div
        className="tx-projcard__cover"
        style={{ background: project.coverColor }}
      >
        {project.coverLabel}
      </div>
      <div className="spread" style={{ alignItems: 'flex-start', gap: 8 }}>
        <Link to={`/projects/${project.id}`} className="tx-projcard__title">
          {project.title}
        </Link>
        <Badge tone={STATUS_TONE[project.status]}>{project.status}</Badge>
      </div>
      <div className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
        by {creator ? fullName(creator) : 'Talorax member'}
      </div>
      <p
        className="text-muted"
        style={{
          fontSize: 14,
          margin: '8px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </p>
      <div className="tx-tag-row">
        {project.technologies.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(`/projects/${project.id}`)}
        style={{ marginTop: 4 }}
      >
        View project
      </Button>
    </Card>
  );
}
