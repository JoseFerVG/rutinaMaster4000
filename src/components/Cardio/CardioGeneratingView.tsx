import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CardioGeneratingView: React.FC = () => {
  const [stage, setStage] = useState(0);

  const stages = [
    'Calculando zonas metabólicas y umbrales de lactato (Z1-Z5)...',
    'Alineando ratios de trabajo e intervalos fraccionados de VO2 Máx...',
    'Periodizando modelo polarizado 80/20 y descansos activos...',
    'Finalizando protocolo de resistencia & acondicionamiento cardiovascular...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[calc(100vh-140px)]">
      <div className="w-full space-y-6">
        {/* Minimalist Circular Indicator */}
        <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-zinc-200" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border border-zinc-950 border-t-transparent animate-spin" />
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-zinc-950 tracking-tight">
            Sintetizando Plan de Cardio & Resistencia
          </h2>
          <p className="text-xs text-zinc-500 font-mono h-5 transition-opacity duration-200">
            {stages[stage]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
          <motion.div
            className="h-full bg-zinc-900 rounded-full"
            initial={{ width: '15%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};
