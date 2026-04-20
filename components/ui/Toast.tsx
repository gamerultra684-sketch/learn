'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import type { ToastType } from '@/lib/types';

// ── Toast Context ──────────────────────────────────────────────

interface ToastContextValue {
  showToast: (message: string, type?: ToastType['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((message: string, type: ToastType['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = {
    success: <FaCheckCircle />,
    error:   <FaExclamationCircle />,
    info:    <FaInfoCircle />,
  };

  const colors = {
    success: 'bg-emerald-500',
    error:   'bg-red-500',
    info:    'bg-blue-500',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-20 md:bottom-5 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg pointer-events-auto animate-slide-up ${colors[t.type]}`}
          >
            {icons[t.type]}
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2 opacity-70 hover:opacity-100">
              <FaTimes className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
