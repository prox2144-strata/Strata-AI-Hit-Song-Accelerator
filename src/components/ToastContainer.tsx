import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-2xl transition-all transform animate-slide-up ${
              isError
                ? 'bg-[#12141C] border-red-500/50 text-red-200'
                : isInfo
                ? 'bg-[#12141C] border-[#45A29E] text-[#66FCF1]'
                : 'bg-[#12141C] border-[#66FCF1] text-[#66FCF1] glow-mint'
            }`}
          >
            <div className="flex items-center gap-3">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              ) : isInfo ? (
                <Info className="w-5 h-5 text-[#45A29E] shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-[#66FCF1] shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg ml-2"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
