import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type'], options?: { duration?: number; action?: Toast['action'] }) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    message: string, 
    type: Toast['type'], 
    options?: { duration?: number; action?: Toast['action'] }
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = options?.duration ?? (type === 'error' ? 6000 : 4000);
    
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      action: options?.action
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast, 
      clearAllToasts,
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}