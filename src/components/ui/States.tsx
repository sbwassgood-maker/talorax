import type { ReactNode } from 'react';

export function EmptyState({
  icon = '🗂️',
  title,
  message,
  action,
}: {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="tx-empty">
      <div className="tx-empty__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="tx-empty__title">{title}</div>
      {message && <p style={{ maxWidth: 380, margin: '0 auto' }}>{message}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="tx-loading" role="status" aria-live="polite">
      <div className="tx-spinner" />
      <p className="text-muted" style={{ marginTop: 12 }}>
        {label}
      </p>
    </div>
  );
}
