import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast as ToastType } from '../../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const styles = {
    success: "bg-white border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/10",
    error: "bg-white border-l-4 border-red-500 shadow-lg shadow-red-500/10",
    warning: "bg-white border-l-4 border-amber-500 shadow-lg shadow-amber-500/10",
    info: "bg-white border-l-4 border-blue-500 shadow-lg shadow-blue-500/10"
  };

  const progressColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500"
  };

  return (
    <div
      className={`
        relative w-full max-w-sm overflow-hidden rounded-lg pointer-events-auto
        transform transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'}
        ${styles[toast.type]}
        mb-3 ring-1 ring-black/5
      `}
      role="alert"
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          {icons[toast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wide"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors -mr-1 -mt-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-100/50 w-full">
          <div 
            className={`h-full ${progressColors[toast.type]}`}
            style={{
              width: '100%',
              animation: `toast-progress ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
}