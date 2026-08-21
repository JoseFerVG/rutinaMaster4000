import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cog, Zap, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import dialogues from '../../data/dialogues.json';
import { soundFx } from '../../utils/audioSynth';

export const CompilatorView: React.FC = () => {
  const { generateRoutine, selectedMuscles, daysPerWeek, experience } = useDoofStore();

  const [progress, setProgress] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const phrases = dialogues.compilingPhrases;

  useEffect(() => {
    soundFx.playJingle();

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            generateRoutine();
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(prev + increment, 100);

        if (Math.random() > 0.6) {
          soundFx.playGearClick();
        }

        return next;
      });
    }, 160);

    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(phraseInterval);
    };
  }, [generateRoutine, phrases.length]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-doof-darkest/95 rounded-3xl border-4 border-doof-purple p-8 md:p-12 shadow-2xl shadow-purple-950/80 text-center relative overflow-hidden"
      >
        {/* Background circuit grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-3 bg-hazard-pattern opacity-60" />

        {/* Top Laboratory HUD Title */}
        <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-mono text-doof-green-acid uppercase tracking-widest font-bold mb-6">
          <Cpu className="w-4 h-4 animate-spin-slow" />
          <span>The Compil-inator 3000 • Procesador Cuántico Malvado</span>
        </div>

        {/* Big Rotating Gears Animation */}
        <div className="relative z-10 my-8 flex items-center justify-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="text-purple-500"
            >
              <Cog className="w-20 h-20 md:w-28 md:h-28" />
            </motion.div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🧪</span>
          </div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="text-doof-green-acid -ml-6 -mt-8"
          >
            <Cog className="w-16 h-16 md:w-20 md:h-20" />
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            className="text-cyan-400 -ml-4 mt-6 hidden sm:block"
          >
            <Cog className="w-12 h-12" />
          </motion.div>
        </div>

        {/* Main Headline */}
        <div className="relative z-10">
          <h2 className="font-comic text-3xl md:text-5xl text-white tracking-wider">
            ¡ENSAMBLANDO TU INADOR DE RUTINA!
          </h2>
          <p className="text-sm font-mono text-purple-300 mt-2">
            Optimizando {selectedMuscles.length} zonas anatómicas • {daysPerWeek} días de frecuencia • Nivel: {experience.toUpperCase()}
          </p>
        </div>

        {/* Progress Bar with glowing acid styling */}
        <div className="relative z-10 mt-8 w-full max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold mb-2">
            <span className="flex items-center gap-1.5 text-doof-green-acid">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Sincronizando palancas biomecánicas...
            </span>
            <span className="text-xl font-tech text-white font-bold">{progress}%</span>
          </div>

          <div className="h-6 w-full bg-slate-900 rounded-full border-2 border-slate-700 p-1 overflow-hidden shadow-inner relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-doof-purple to-doof-green-neon relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Dynamic Changing Heinz Phrases */}
        <div className="relative z-10 mt-8 min-h-[48px] flex items-center justify-center">
          <motion.div
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-5 py-2.5 rounded-2xl bg-doof-panel/90 border border-purple-500/40 text-purple-200 text-sm md:text-base font-tech tracking-wide inline-flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-doof-green-acid flex-shrink-0 animate-spin-slow" />
            <span>«{phrases[currentPhraseIndex]}»</span>
          </motion.div>
        </div>

        {/* Warning Footer Note */}
        <div className="relative z-10 mt-8 flex items-center justify-center gap-2 text-[11px] font-mono text-yellow-400/80">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>No apagues el reactor nuclear durante la forja del Inador</span>
        </div>
      </motion.div>
    </div>
  );
};
