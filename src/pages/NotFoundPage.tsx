import { useNavigate } from 'react-router-dom';
import { Button, EmptyState } from '../components/ui';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="container tx-page">
      <EmptyState
        icon="🧭"
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        action={<Button onClick={() => navigate('/home')}>Back to Home</Button>}
      />
    </div>
  );
}
