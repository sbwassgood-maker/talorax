interface AvatarProps {
  name: string;
  size?: number;
  square?: boolean;
  color?: string;
}

// Deterministic color from a name so avatars are stable across renders.
// Leads with the TALORAX brand hues, with enough variety to keep avatars
// visually distinct across the app.
const PALETTE = [
  '#101828', // navy
  '#0aa5e0', // cyan
  '#2563eb', // blue
  '#0a9d68', // green
  '#d9880a', // amber
  '#db2777', // pink
  '#0891b2', // teal
  '#3d2f8c', // indigo
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
