import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useDoofStore();

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-500/80 text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        };
      case 'danger':
        return {
          bg: 'bg-gradient-to-r from-red-950 to-slate-900 border-red-500/80 text-red-200',
          icon: <AlertOctagon className="w-5 h-5 text-red-400" />
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-950 to-slate-900 border-amber-500/80 text-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      case 'perry':
        return {
          bg: 'bg-gradient-to-r from-cyan-950 to-slate-900 border-cyan-500/80 text-cyan-200',
          icon: <span className="text-xl">🤠</span>
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-purple-950 to-slate-900 border-purple-500/80 text-purple-200',
          icon: <Info className="w-5 h-5 text-purple-400" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 shadow-2xl shadow-black/80 backdrop-blur-md ${style.bg}`}
        >
          <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold font-tech uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={dismissToast}
            className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
