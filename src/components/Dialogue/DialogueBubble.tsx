import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { HeinzMood } from '../../types';

interface DialogueBubbleProps {
  text?: string;
  mood?: HeinzMood;
  title?: string;
  className?: string;
  onFinishedTyping?: () => void;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({
  text = '',
  title = 'Asesor de Entrenamiento',
  className = '',
  onFinishedTyping
}) => {
  const safeText = text || '';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    if (!safeText) {
      setIsTyping(false);
      return;
    }

    const timer = setInterval(() => {
      if (index < safeText.length) {
        setDisplayedText(prev => prev + safeText.charAt(index));
        index++;
        if (index % 12 === 0) {
          soundFx.playGearClick();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
        if (onFinishedTyping) onFinishedTyping();
      }
    }, 12);

    return () => clearInterval(timer);
  }, [safeText, onFinishedTyping]);

  const handleSkipTyping = () => {
    setDisplayedText(safeText);
    setIsTyping(false);
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Sleek Glass Dialogue Card */}
      <motion.div
        key={safeText}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        onClick={isTyping ? handleSkipTyping : undefined}
        className="zen-glass p-6 md:p-7 rounded-3xl border border-white/10 shadow-zen-lg cursor-pointer transition-all hover:border-white/15"
      >
        {/* Header with Title and Audio Button */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-display font-semibold text-sm md:text-base text-white tracking-wide">
              {title}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playJingle();
            }}
            title="Tono Zen"
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>Armonía</span>
          </button>
        </div>

        {/* Typed Dialogue */}
        <p className="text-slate-200 font-sans text-sm sm:text-base md:text-lg leading-relaxed font-normal min-h-[48px]">
          {displayedText}
          {isTyping && <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse" />}
        </p>

        {/* Subtitle / Micro Hint */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-normal">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Sparkles className="w-3 h-3 text-emerald-400/80" />
            {isTyping ? 'Haz clic para mostrar el texto completo' : 'Selecciona tu respuesta a continuación'}
          </span>
          <span className="text-slate-500 font-mono text-[10px]">IA Biomecánica</span>
        </div>
      </motion.div>
    </div>
  );
};
