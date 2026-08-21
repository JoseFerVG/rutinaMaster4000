import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';

export const SelfDestructModal: React.FC = () => {
  const {
    isSelfDestructModalOpen,
    closeSelfDestructModal,
    selfDestruct
  } = useDoofStore();

  return (
    <AnimatePresence>
      {isSelfDestructModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSelfDestructModal}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            className="relative z-10 w-full max-w-md rounded-3xl zen-glass p-6 md:p-8 shadow-zen-lg border border-white/10 text-center space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={closeSelfDestructModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-xl text-white">
                ¿Restablecer Protocolo?
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Esta acción eliminará la rutina activa, el registro de series y reiniciará todos los parámetros de calibración.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={closeSelfDestructModal}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/10 transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={selfDestruct}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-medium border border-rose-400/30 transition-all shadow-sm"
              >
                Confirmar Reinicio
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
