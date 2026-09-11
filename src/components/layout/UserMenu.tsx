import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui';
import { useAuth } from '../../services/auth';
import { fullName } from '../../data/users';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="tx-usermenu" ref={ref}>
      <button
        className="tx-usermenu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        <Avatar name={fullName(user)} size={36} />
      </button>
      {open && (
        <div className="tx-usermenu__dropdown" role="menu">
          <div className="tx-usermenu__header">
            <div style={{ fontWeight: 700 }}>{fullName(user)}</div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {user.headline}
            </div>
          </div>
          <button
            className="tx-usermenu__item"
            role="menuitem"
            onClick={() => go('/profile')}
          >
            👤 View profile
          </button>
          <button
            className="tx-usermenu__item"
            role="menuitem"
            onClick={() => go('/messages')}
          >
            ✉️ Messages
          </button>
          <button
            className="tx-usermenu__item"
            role="menuitem"
            onClick={() => go('/radar')}
          >
            📡 Opportunity Radar
          </button>
          <button
            className="tx-usermenu__item"
            role="menuitem"
            style={{ color: 'var(--color-danger)' }}
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            ⎋ Log out
          </button>
        </div>
      )}
    </div>
  );
}
