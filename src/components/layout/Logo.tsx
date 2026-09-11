import { Link } from 'react-router-dom';

export function Logo({ to = '/home' }: { to?: string }) {
  return (
    <Link to={to} className="tx-logo" aria-label="Talorax home">
      <span className="tx-logo__mark" aria-hidden="true">
        T
      </span>
      Talorax
    </Link>
  );
}
