import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Sparkles } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { soundFx } from '../../utils/audioSynth';

const ZEN_PHRASES = [
  'Alineando curvas de resistencia biomecánica...',
  'Balanceando volumen semanal por grupo muscular...',
  'Calculando ratios de recuperación y fatiga sistémica...',
  'Estructurando orden óptimo de ejercicios compuestos...',
  'Asignando rangos de repeticiones y proximidad al fallo...',
  'Finalizando protocolo personalizado de hipertrofia...'
];

export const CompilatorView: React.FC = () => {
  const { generateRoutine } = useDoofStore();
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    soundFx.playJingle();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            generateRoutine();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    const phraseInterval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % ZEN_PHRASES.length);
    }, 550);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
    };
  }, [generateRoutine]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Central Concentric Loader */}
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute inset-4 rounded-full border border-white/10"
        />

        {/* Ambient Pulsing Glow */}
        <div className="absolute inset-8 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

        {/* Center Progress Box */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Activity className="w-7 h-7 text-emerald-400 mb-1" />
          <span className="font-display font-bold text-3xl text-white tracking-tight">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress Bar & Status Text */}
      <div className="space-y-4 max-w-md mx-auto">
        <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-sans text-slate-300 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{ZEN_PHRASES[phraseIndex]}</span>
        </motion.p>
      </div>
    </div>
  );
};
