interface AvatarProps {
  name: string;
  size?: number;
  square?: boolean;
  color?: string;
}

// Deterministic color from a name so avatars are stable across renders.
const PALETTE = [
  '#6d28d9',
  '#2563eb',
  '#dc2626',
  '#059669',
  '#d97706',
  '#db2777',
  '#0891b2',
  '#7c3aed',
];

function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 44, square = false, color }: AvatarProps) {
  return (
    <span
      className={`tx-avatar${square ? ' tx-avatar--square' : ''}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: color ?? colorFromName(name),
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
