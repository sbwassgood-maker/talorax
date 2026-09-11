import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  pad?: boolean;
  hover?: boolean;
  children: ReactNode;
}

export function Card({
  pad = true,
  hover = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  const classes = [
    'tx-card',
    pad ? 'tx-card--pad' : '',
    hover ? 'tx-card--hover' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
