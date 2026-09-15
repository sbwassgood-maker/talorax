import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './layout.css';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { CreateModal } from '../create/CreateModal';
import { useCreateFlow } from '../../services/createFlow';

export function Layout() {
  const { isOpen, close } = useCreateFlow();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <TopNav />
      <main className="tx-app-body">
        <Outlet />
      </main>
      <BottomNav />
      {/* Mobile-friendly floating Ask TALORAX action, hidden on the Ask page */}
      {pathname !== '/ask' && (
        <button
          className="tx-ask-fab"
          onClick={() => navigate('/ask')}
          aria-label="Ask TALORAX"
        >
          ✨
        </button>
      )}
      {isOpen && <CreateModal onClose={close} />}
    </>
  );
}
