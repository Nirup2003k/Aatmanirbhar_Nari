import React from 'react';
import { ShoppingBag, Bell, CheckCircle2, X } from 'lucide-react';

const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isNewOrder = toast.event === 'NEW_ORDER';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isNewOrder
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/40'
                : 'bg-stone-900/90 border-stone-700/60 text-stone-100 shadow-black/50'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {isNewOrder ? (
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400 inline" />
                {toast.title}
              </h4>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">{toast.message}</p>
              <span className="text-[10px] text-stone-400 mt-1.5 block">Just now</span>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
