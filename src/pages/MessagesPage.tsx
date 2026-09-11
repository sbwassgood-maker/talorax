import { useEffect, useRef, useState } from 'react';
import './pages.css';
import { Avatar, Button, EmptyState } from '../components/ui';
import { useAppState } from '../services/appState';
import { useAuth } from '../services/auth';
import { getUserById, fullName, DEMO_USER_ID } from '../data/users';
import { timeAgo } from '../utils/format';

export function MessagesPage() {
  const { conversations, sendMessage } = useAppState();
  const { user } = useAuth();
  const meId = user?.id ?? DEMO_USER_ID;

  const [activeId, setActiveId] = useState<string | null>(
    conversations[0]?.id ?? null,
  );
  const [draft, setDraft] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'window'>('list');
  const bodyRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  // The "other" participant in a 1:1 conversation.
  const other = (participantIds: string[]) =>
    getUserById(participantIds.find((p) => p !== meId) ?? '');

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [active?.messages.length, activeId]);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (active && draft.trim()) {
      sendMessage(active.id, draft);
      setDraft('');
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="container tx-page">
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Messages</h1>
        <EmptyState
          icon="✉️"
          title="No conversations yet"
          message="Connect with people and start a conversation to see it here."
        />
      </div>
    );
  }

  return (
    <div className="container tx-page">
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Messages</h1>
      <div className="tx-messages" data-view={mobileView}>
        {/* Conversation list */}
        <div className="tx-conv-list">
          <div className="tx-conv-list__head">Conversations</div>
          {conversations.map((c) => {
            const partner = other(c.participantIds);
            const last = c.messages[c.messages.length - 1];
            return (
              <button
                key={c.id}
                className={`tx-conv-item${
                  c.id === activeId ? ' tx-conv-item--active' : ''
                }`}
                onClick={() => {
                  setActiveId(c.id);
                  setMobileView('window');
                }}
              >
                <Avatar name={partner ? fullName(partner) : 'User'} size={44} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="tx-conv-item__name">
                    {partner ? fullName(partner) : 'User'}
                  </div>
                  <div className="tx-conv-item__preview">
                    {last ? last.text : 'Say hello 👋'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation window */}
        <div className="tx-conv-window">
          {active ? (
            <>
              <div className="tx-conv-window__head">
                <Button
                  variant="ghost"
                  size="sm"
                  className="tx-conv-back"
                  onClick={() => setMobileView('list')}
                  aria-label="Back to conversations"
                >
                  ←
                </Button>
                {(() => {
                  const partner = other(active.participantIds);
                  return (
                    <>
                      <Avatar
                        name={partner ? fullName(partner) : 'User'}
                        size={40}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {partner ? fullName(partner) : 'User'}
                        </div>
                        <div className="text-muted" style={{ fontSize: 12.5 }}>
                          {partner?.headline}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="tx-conv-window__body" ref={bodyRef}>
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`tx-bubble ${
                      m.senderId === meId ? 'tx-bubble--out' : 'tx-bubble--in'
                    }`}
                    title={timeAgo(m.createdAt)}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form className="tx-conv-window__compose" onSubmit={onSend}>
                <input
                  className="tx-input"
                  placeholder="Write a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="Message"
                />
                <Button type="submit" disabled={!draft.trim()}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <EmptyState
              icon="💬"
              title="Select a conversation"
              message="Choose a conversation from the list to start chatting."
            />
          )}
        </div>
      </div>
    </div>
  );
}
