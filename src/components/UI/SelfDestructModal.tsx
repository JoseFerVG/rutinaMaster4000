import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Flame, ShieldAlert, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDoofStore } from '../../store/useDoofStore';
import dialogues from '../../data/dialogues.json';

export const SelfDestructModal: React.FC = () => {
  const { isSelfDestructModalOpen, closeSelfDestructModal, selfDestruct } = useDoofStore();

  if (!isSelfDestructModalOpen) return null;

  const handleExplode = () => {
    // Fire confetti explosion in fire / dark colors
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#dc2626', '#f59e0b', '#7e22ce', '#000000']
    });
    selfDestruct();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className="relative max-w-lg w-full bg-doof-darkest rounded-2xl border-4 border-red-600 shadow-2xl shadow-red-900/60 overflow-hidden"
        >
          {/* Industrial Hazard Caution Stripe Header */}
          <div className="h-6 w-full bg-hazard-red border-b border-red-500/50" />

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-red-500">
                <div className="w-12 h-12 rounded-xl bg-red-950/80 border-2 border-red-500 flex items-center justify-center animate-bounce">
                  <ShieldAlert className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h3 className="font-comic text-2xl md:text-3xl text-red-500 tracking-wider">
                    {dialogues.selfDestructDialogues.title}
                  </h3>
                  <p className="text-xs font-mono uppercase text-yellow-400 font-bold">
                    Directiva de Seguridad 104-Doof
                  </p>
                </div>
              </div>

              <button
                onClick={closeSelfDestructModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Text */}
            <div className="mt-5 p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-slate-200 text-sm leading-relaxed">
              <p className="font-sans">
                {dialogues.selfDestructDialogues.warning}
              </p>
            </div>

            {/* Big Shiny Physical Push Button */}
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={handleExplode}
                className="group relative w-36 h-36 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-900 p-2 shadow-2xl shadow-red-600/80 active:translate-y-2 transition-transform duration-100 flex items-center justify-center border-4 border-yellow-400"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center justify-center p-2 text-center shadow-inner group-hover:from-red-500 group-hover:to-red-700">
                  <Flame className="w-8 h-8 text-yellow-300 animate-pulse" />
                  <span className="font-comic text-lg text-white tracking-widest mt-1 uppercase leading-tight font-black drop-shadow">
                    ¡AUTODESTRUIR!
                  </span>
                </div>
              </button>
              <span className="text-[11px] font-mono text-yellow-400 mt-3 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Presionar solo en caso de emergencia estética
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={closeSelfDestructModal}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700"
              >
                {dialogues.selfDestructDialogues.cancelButton}
              </button>
            </div>
          </div>

          {/* Hazard bottom stripe */}
          <div className="h-4 w-full bg-hazard-pattern opacity-80" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
