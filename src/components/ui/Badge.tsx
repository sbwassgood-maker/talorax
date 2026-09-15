import type { ReactNode } from 'react';

type Tone = 'primary' | 'neutral' | 'success' | 'warning';

export function Badge({
  children,
  tone = 'primary',
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const cls = tone === 'primary' ? 'tx-badge' : `tx-badge tx-badge--${tone}`;
  return <span className={cls}>{children}</span>;
}

export function Tag({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}) {
  const interactive = Boolean(onClick);
  const cls = [
    'tx-tag',
    interactive ? 'tx-tag--interactive' : '',
    selected ? 'tx-tag--selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (interactive) {
    return (
      <button type="button" className={cls} onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
    );
  }
  return <span className={cls}>{children}</span>;
}

export function MatchPill({ score }: { score: number }) {
  return (
    <span className="tx-match" title={`${score}% match`}>
      <span style={{ color: 'var(--brand-cyan)' }} aria-hidden="true">
        ●
      </span>{' '}
      {score}% Match
    </span>
  );
}
