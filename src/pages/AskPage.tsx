import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ask.css';
import { Avatar, Button, Card, MatchPill } from '../components/ui';
import { useAuth } from '../services/auth';
import { useAppState } from '../services/appState';
import { useCreateFlow } from '../services/createFlow';
import { askEngine } from '../services/ai';
import type { AiAction, AiBlock, AiCommand, AiItem } from '../services/ai';

interface Turn {
  id: string;
  prompt: string;
  blocks: AiBlock[];
}

export function AskPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const threadEnd = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const run = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || thinking) return;
    setInput('');
    setThinking(true);
    // Small deferred compute so the UI shows a thinking state; the engine is
    // synchronous and deterministic (no network) but this keeps it feeling live.
    window.setTimeout(() => {
      const blocks = askEngine.answer(trimmed, user.id);
      setTurns((prev) => [
        ...prev,
        { id: `t-${Date.now()}`, prompt: trimmed, blocks },
      ]);
      setThinking(false);
      window.setTimeout(
        () => threadEnd.current?.scrollIntoView({ behavior: 'smooth' }),
        30,
      );
    }, 280);
  };

  const started = turns.length > 0 || thinking;

  return (
    <div className="container tx-page">
      <div className="tx-ask">
        <div className="tx-ask__hero">
          <span className="tx-ask__badge">✨ Ask TALORAX</span>
          {!started && (
            <>
              <h1>What are you working toward, {user.firstName}?</h1>
              <p>
                Your personal career & networking copilot. Ask in your own words,
                or start with a suggestion.
              </p>
            </>
          )}
        </div>

        {!started && (
          <div className="tx-ask__suggest">
            {askEngine.suggestedPrompts().map((s) => (
              <button
                key={s.label}
                className="tx-ask__chip"
                onClick={() => run(s.prompt)}
              >
                <span className="tx-ask__chip-icon" aria-hidden="true">
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {started && (
          <div className="tx-ask__thread">
            {turns.map((turn) => (
              <div key={turn.id}>
                <div className="tx-ask__msg-user">{turn.prompt}</div>
                <div className="tx-ask__msg-ai">
                  <div className="tx-ask__ai-head">
                    <span aria-hidden="true">✨</span> Ask TALORAX
                  </div>
                  <Card>
                    {turn.blocks.map((block, i) => (
                      <BlockView key={i} block={block} onNavigate={navigate} onRun={run} />
                    ))}
                  </Card>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="tx-ask__msg-ai">
                <div className="tx-ask__ai-head">
                  <span aria-hidden="true">✨</span> Ask TALORAX
                </div>
                <Card>
                  <p className="text-muted">Thinking through your TALORAX data…</p>
                </Card>
              </div>
            )}
            <div ref={threadEnd} />
          </div>
        )}

        <form
          className="tx-ask__composer"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <input
            className="tx-input"
            placeholder="Ask TALORAX anything about your career…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask TALORAX"
          />
          <Button type="submit" disabled={!input.trim() || thinking}>
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
}

/* --------------------------- Block renderer --------------------------- */

function BlockView({
  block,
  onNavigate,
  onRun,
}: {
  block: AiBlock;
  onNavigate: (to: string) => void;
  onRun: (prompt: string) => void;
}) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="tx-ask__para">{block.text}</p>;
    case 'note':
      return <p className="tx-ask__note">{block.text}</p>;
    case 'checklist':
      return (
        <div>
          {block.heading && (
            <div className="tx-ask__block-heading">{block.heading}</div>
          )}
          <div className="tx-ask__checklist">
            {block.checklist?.map((c, i) => (
              <div
                key={i}
                className={`tx-ask__check ${c.done ? 'tx-ask__check--done' : 'tx-ask__check--todo'}`}
              >
                {c.text}
              </div>
            ))}
          </div>
        </div>
      );
    case 'items':
      return (
        <div>
          {block.heading && (
            <div className="tx-ask__block-heading">{block.heading}</div>
          )}
          {block.items?.map((item) => (
            <ItemView key={item.id} item={item} onNavigate={onNavigate} onRun={onRun} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function ItemView({
  item,
  onNavigate,
  onRun,
}: {
  item: AiItem;
  onNavigate: (to: string) => void;
  onRun: (prompt: string) => void;
}) {
  return (
    <div className="tx-ask__item">
      {item.avatarName && <Avatar name={item.avatarName} size={44} />}
      <div className="tx-ask__item-body">
        <div className="spread" style={{ gap: 8, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
            <div className="tx-ask__item-title">{item.title}</div>
            {item.subtitle && (
              <div className="tx-ask__item-sub">{item.subtitle}</div>
            )}
          </div>
          {typeof item.score === 'number' && <MatchPill score={item.score} />}
        </div>

        {item.reasons && item.reasons.length > 0 && (
          <div className="tx-ask__reasons">
            {item.reasons.map((r) => (
              <span key={r} className="tx-ask__reason">
                {r}
              </span>
            ))}
          </div>
        )}

        <div className="tx-ask__item-actions">
          {item.actions.map((action, i) => (
            <ActionButton key={i} action={action} onNavigate={onNavigate} onRun={onRun} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Action dispatcher --------------------------- */

function ActionButton({
  action,
  onNavigate,
  onRun,
}: {
  action: AiAction;
  onNavigate: (to: string) => void;
  onRun: (prompt: string) => void;
}) {
  const {
    requestConnection,
    getConnectionStatus,
    toggleFollow,
    isFollowing,
    toggleSaveOpportunity,
    savedOpportunityIds,
    offerHelp,
    hasOfferedHelp,
  } = useAppState();
  const { open: openCreate } = useCreateFlow();
  const [done, setDone] = useState(false);

  const variant = action.variant ?? 'secondary';

  // Route action → simple navigation.
  if (action.to) {
    return (
      <Button size="sm" variant={variant} onClick={() => onNavigate(action.to!)}>
        {action.label}
      </Button>
    );
  }

  // Command action → wire to real app state so the AI can act on the product.
  const cmd = action.command as AiCommand | undefined;
  if (!cmd) return null;

  // Reflect existing state so labels are honest (e.g. already connected/saved).
  const label = (() => {
    switch (cmd.kind) {
      case 'connect': {
        const s = getConnectionStatus(cmd.userId);
        if (s === 'connected') return '✓ Connected';
        if (s === 'pending' || done) return 'Request sent';
        return action.label;
      }
      case 'follow':
        return isFollowing(cmd.userId) || done ? 'Following' : action.label;
      case 'saveOpportunity':
        return savedOpportunityIds.has(cmd.opportunityId) || done
          ? '🔖 Saved'
          : action.label;
      case 'offerHelp':
        return hasOfferedHelp(cmd.needId) || done ? '✓ Offered to help' : action.label;
      default:
        return action.label;
    }
  })();

  const disabled = (() => {
    switch (cmd.kind) {
      case 'connect':
        return getConnectionStatus(cmd.userId) !== 'none' || done;
      case 'saveOpportunity':
        return savedOpportunityIds.has(cmd.opportunityId) || done;
      case 'offerHelp':
        return hasOfferedHelp(cmd.needId) || done;
      default:
        return false;
    }
  })();

  const onClick = () => {
    switch (cmd.kind) {
      case 'connect':
        requestConnection(cmd.userId);
        break;
      case 'follow':
        toggleFollow(cmd.userId);
        break;
      case 'saveOpportunity':
        toggleSaveOpportunity(cmd.opportunityId);
        break;
      case 'offerHelp':
        offerHelp(cmd.needId);
        break;
      case 'openCreate':
        openCreate();
        break;
      case 'ask':
        onRun(cmd.prompt);
        return;
    }
    setDone(true);
  };

  return (
    <Button size="sm" variant={variant} onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
}
