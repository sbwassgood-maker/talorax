import { Outlet } from 'react-router-dom';
import './layout.css';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { CreateModal } from '../create/CreateModal';
import { useCreateFlow } from '../../services/createFlow';

export function Layout() {
  const { isOpen, close } = useCreateFlow();
  return (
    <>
      <TopNav />
      <main className="tx-app-body">
        <Outlet />
      </main>
      <BottomNav />
      {isOpen && <CreateModal onClose={close} />}
    </>
  );
}
