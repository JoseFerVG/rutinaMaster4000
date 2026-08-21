import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, X } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import dialogues from '../../data/dialogues.json';
import { soundFx } from '../../utils/audioSynth';

export const PerryModal: React.FC = () => {
  const { isPerryModalOpen, closePerryModal } = useDoofStore();

  if (!isPerryModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative max-w-md w-full bg-slate-900 rounded-2xl border-2 border-teal-500 shadow-2xl shadow-teal-950/80 overflow-hidden"
        >
          {/* Top Secret O.W.C.A. Bar */}
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-4 py-2 flex items-center justify-between text-white text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-yellow-300" />
              O.W.C.A. TOP SECRET FILE #007
            </span>
            <button onClick={closePerryModal} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 text-center">
            {/* Perry Visual */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-b from-teal-500 to-teal-800 border-4 border-amber-600/80 flex items-center justify-center text-5xl shadow-xl shadow-teal-900/50 relative">
              <span>🦆</span>
              <span className="absolute -top-3 text-3xl">🤠</span>
            </div>

            <h3 className="font-comic text-2xl text-teal-400 mt-4 tracking-wider">
              {dialogues.perryEasterEgg.quote2}
            </h3>

            <p className="text-xs text-amber-300 font-mono mt-1 font-semibold">
              «{dialogues.perryEasterEgg.audio}»
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-teal-500/30 text-xs text-slate-300 leading-relaxed text-left">
              <p className="font-semibold text-teal-300 mb-1">Informe del Agente P:</p>
              <p>
                "El Dr. Doofenshmirtz ha desarrollado una rutina biomecánicamente óptima con sobrecarga progresiva y sinérgias musculares. Recomiendo continuar el entrenamiento para frustrar sus planes con una condición física legendaria."
              </p>
            </div>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => soundFx.playPerrySound()}
                className="px-4 py-2 rounded-xl bg-teal-900/60 border border-teal-500/50 hover:bg-teal-800 text-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Reproducir Sonido de Perry
              </button>
              <button
                onClick={closePerryModal}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Cerrar Informe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
