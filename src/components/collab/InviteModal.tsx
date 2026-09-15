import { useMemo, useState } from 'react';
import { Modal, Button, Avatar, Tag } from '../ui';
import { useAppState } from '../../services/appState';
import type { Collab, User } from '../../models';
import { users, fullName } from '../../data/users';

/**
 * Invite-to-Collab flow. Suggests REAL people ranked by how well their stated
 * skills / "can help with" match what the collab is looking for, with a
 * transparent reason. Nothing is sent without explicit confirmation.
 */
export function InviteModal({
  collab,
  onClose,
}: {
  collab: Collab;
  onClose: () => void;
}) {
  const { inviteToCollab, hasInvited } = useAppState();
  const [selected, setSelected] = useState<User | null>(null);
  const [message, setMessage] = useState(
    `Hey! I saw your work and think you'd be a great fit for "${collab.title}". Want to collaborate?`,
  );
  const [sentTo, setSentTo] = useState<string[]>([]);

  // Rank candidates by real skill/help overlap with what the collab needs.
  const suggestions = useMemo(() => {
    const need = collab.lookingFor.map((s) => s.toLowerCase());
    const matches = (values: string[]) =>
      values.filter((v) =>
        need.some((n) => n.includes(v.toLowerCase()) || v.toLowerCase().includes(n)),
      );
    return users
      .filter((u) => u.id !== collab.creatorId)
      .map((u) => {
        const hit = new Set([...matches(u.skills), ...matches(u.canHelpWith)]);
        return { user: u, hits: [...hit] };
      })
      .filter((x) => x.hits.length > 0)
      .sort((a, b) => b.hits.length - a.hits.length)
      .slice(0, 5);
  }, [collab]);

  const send = () => {
    if (!selected) return;
    inviteToCollab(collab.id, selected.id);
    setSentTo((prev) => [...prev, selected.id]);
    setSelected(null);
  };

  // Confirmation step for a chosen person.
  if (selected) {
    return (
      <Modal title="Invite to collaborate?" onClose={() => setSelected(null)}>
        <div className="row" style={{ gap: 12, marginBottom: 14 }}>
          <Avatar name={fullName(selected)} size={48} />
          <div>
            <div style={{ fontWeight: 700 }}>{fullName(selected)}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {selected.headline}
            </div>
          </div>
        </div>
        <div className="tx-field">
          <label className="tx-label" htmlFor="invite-role">
            Collab
          </label>
          <div id="invite-role" style={{ fontWeight: 600 }}>
            {collab.title}
          </div>
        </div>
        <div className="tx-field">
          <label className="tx-label" htmlFor="invite-msg">
            Message
          </label>
          <textarea
            id="invite-msg"
            className="tx-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>
        <div className="tx-onboard__actions" style={{ marginTop: 4 }}>
          <Button variant="ghost" onClick={() => setSelected(null)}>
            Cancel
          </Button>
          <Button onClick={send} disabled={!message.trim()}>
            Send Invite
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Invite someone to collaborate" onClose={onClose}>
      <p className="text-muted" style={{ marginTop: -4, marginBottom: 14 }}>
        People whose skills match what this collab needs. Nothing is sent until
        you confirm.
      </p>
      {suggestions.length === 0 ? (
        <p className="text-muted">
          No strong skill matches in your network yet. Try again as more people
          join.
        </p>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          {suggestions.map(({ user: u, hits }) => {
            const invited = hasInvited(collab.id, u.id) || sentTo.includes(u.id);
            return (
              <div key={u.id} className="row" style={{ gap: 12 }}>
                <Avatar name={fullName(u)} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{fullName(u)}</div>
                  <div className="text-muted" style={{ fontSize: 12.5 }}>
                    {u.headline}
                  </div>
                  <div className="tx-tag-row" style={{ margin: '6px 0 0' }}>
                    {hits.slice(0, 3).map((h) => (
                      <Tag key={h}>{h}</Tag>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={invited ? 'secondary' : 'primary'}
                  disabled={invited}
                  onClick={() => setSelected(u)}
                >
                  {invited ? 'Invited' : 'Invite'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
