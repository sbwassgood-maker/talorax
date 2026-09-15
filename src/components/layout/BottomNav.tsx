import { NavLink } from 'react-router-dom';
import { useCreateFlow } from '../../services/createFlow';

export function BottomNav() {
  const { open } = useCreateFlow();
  return (
    <nav className="tx-bottomnav" aria-label="Primary mobile">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `tx-bottomnav__item${isActive ? ' tx-bottomnav__item--active' : ''}`
        }
      >
        <span className="tx-bottomnav__icon" aria-hidden="true">
          🏠
        </span>
        Home
      </NavLink>
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          `tx-bottomnav__item${isActive ? ' tx-bottomnav__item--active' : ''}`
        }
      >
        <span className="tx-bottomnav__icon" aria-hidden="true">
          🧭
        </span>
        Discover
      </NavLink>
      <button
        className="tx-bottomnav__item tx-bottomnav__create"
        onClick={open}
        aria-label="Create"
      >
        <span className="tx-bottomnav__icon" aria-hidden="true">
          +
        </span>
        Create
      </button>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          `tx-bottomnav__item${isActive ? ' tx-bottomnav__item--active' : ''}`
        }
      >
        <span className="tx-bottomnav__icon" aria-hidden="true">
          💼
        </span>
        Jobs
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `tx-bottomnav__item${isActive ? ' tx-bottomnav__item--active' : ''}`
        }
      >
        <span className="tx-bottomnav__icon" aria-hidden="true">
          👤
        </span>
        Profile
      </NavLink>
    </nav>
  );
}
