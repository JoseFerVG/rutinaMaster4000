import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useRoutineStore();

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-zinc-200/90 shadow-elevated rounded-xl p-4 flex items-start gap-3 print:hidden"
      >
        {renderIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-zinc-950">
            {toast.title}
          </h4>
          <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={dismissToast}
          className="text-zinc-400 hover:text-zinc-700 p-0.5 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
