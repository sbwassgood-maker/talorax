import { useState } from 'react';
import './WhyThis.css';
import { MatchPill } from '../ui';

// "Why am I seeing this?" — a core TALORAX transparency feature.
// Reused across opportunities, people, projects, and companies so every
// recommendation can explain itself honestly. The explanation comes from the
// rule-based matcher (utils/matching); we never imply the system knows more
// than it does.

interface WhyThisProps {
  score: number;
  reasons: string[];
  /** Heading text; defaults to a generic phrasing. */
  heading?: string;
  /**
   * `panel` (default) renders the full highlighted box used on detail pages.
   * `inline` renders a compact, collapsible link+list for use inside cards.
   */
  variant?: 'panel' | 'inline';
}

const NOTE =
  'Matches use simple, transparent rules based on your profile — not an automated AI engine.';

export function WhyThis({
  score,
  reasons,
  heading = "Why you're seeing this",
  variant = 'panel',
}: WhyThisProps) {
  const [open, setOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <div className="tx-why-inline">
        <button
          type="button"
          className="tx-why-inline__toggle"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Why am I seeing this? <span aria-hidden="true">{open ? '▾' : '▸'}</span>
        </button>
        {open && (
          <div className="tx-why-inline__body">
            <ul>
              {reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="tx-why__note">{NOTE}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tx-why">
      <div className="tx-why__head">
        <MatchPill score={score} />
        <strong>{heading}</strong>
      </div>
      <ul>
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <div className="tx-why__note">{NOTE}</div>
    </div>
  );
}
