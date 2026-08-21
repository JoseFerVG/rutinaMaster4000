import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';

export const PerryModal: React.FC = () => {
  const { isPerryModalOpen, closePerryModal } = useDoofStore();

  return (
    <AnimatePresence>
      {isPerryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePerryModal}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            className="relative z-10 w-full max-w-sm rounded-3xl zen-glass p-6 md:p-8 shadow-zen-lg border border-white/10 text-center space-y-5"
          >
            <button
              onClick={closePerryModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
              <span>🧘</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-white">
                Frecuencia Zen Activada
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mente en calma, máxima conexión mente-músculo y disciplina en cada repetición.
              </p>
            </div>

            <button
              onClick={closePerryModal}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-all"
            >
              Continuar Entrenamiento
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
