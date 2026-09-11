import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// Lets any nav element (top nav "+ Create", mobile create button) open the
// global Create modal. The modal itself is rendered once in the Layout.
interface CreateFlowValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CreateFlowContext = createContext<CreateFlowValue | null>(null);

export function CreateFlowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );
  return (
    <CreateFlowContext.Provider value={value}>
      {children}
    </CreateFlowContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCreateFlow(): CreateFlowValue {
  const ctx = useContext(CreateFlowContext);
  if (!ctx) throw new Error('useCreateFlow must be used within CreateFlowProvider');
  return ctx;
}
