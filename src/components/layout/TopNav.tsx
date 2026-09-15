import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';
import { Button } from '../ui';
import { useCreateFlow } from '../../services/createFlow';

const LINKS = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/discover', label: 'Discover', icon: '🧭' },
  { to: '/opportunities', label: 'Opportunities', icon: '💼' },
  { to: '/messages', label: 'Messages', icon: '✉️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export function TopNav() {
  const { open } = useCreateFlow();
  const navigate = useNavigate();
  return (
    <header className="tx-topnav">
      <div className="container tx-topnav__inner">
        <Logo />
        <nav className="tx-navlinks" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `tx-navlink${isActive ? ' tx-navlink--active' : ''}`
              }
            >
              <span className="tx-navlink__icon" aria-hidden="true">
                {l.icon}
              </span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="tx-topnav__right">
          <button
            className="tx-ask-pill"
            onClick={() => navigate('/ask')}
            aria-label="Ask TALORAX"
          >
            ✨<span className="tx-ask-pill__label">&nbsp;Ask</span>
          </button>
          <Button onClick={open} size="sm" aria-label="Create">
            +<span className="tx-topnav__create-label">&nbsp;Create</span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
