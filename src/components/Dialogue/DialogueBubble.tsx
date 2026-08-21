import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';
import { HeinzMood } from '../../types';

interface DialogueBubbleProps {
  text: string;
  mood?: HeinzMood;
  title?: string;
  className?: string;
  onFinishedTyping?: () => void;
}

export const DialogueBubble: React.FC<DialogueBubbleProps> = ({
  text,
  mood = 'normal',
  title = 'Dr. Heinz Doofenshmirtz',
  className = '',
  onFinishedTyping
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
        if (index % 6 === 0) {
          soundFx.playGearClick();
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
        if (onFinishedTyping) onFinishedTyping();
      }
    }, 14);

    return () => clearInterval(timer);
  }, [text, onFinishedTyping]);

  const handleSkipTyping = () => {
    setDisplayedText(text);
    setIsTyping(false);
  };

  const getBorderColor = () => {
    switch (mood) {
      case 'evil':
        return 'border-purple-500 shadow-purple-950/60 bg-gradient-to-br from-doof-panel via-doof-card to-slate-950';
      case 'complaining':
        return 'border-amber-500 shadow-amber-950/60 bg-gradient-to-br from-amber-950/40 via-doof-card to-slate-950';
      case 'shocked':
        return 'border-red-500 shadow-red-950/70 bg-gradient-to-br from-red-950/40 via-doof-card to-slate-950';
      case 'excited':
        return 'border-emerald-400 shadow-emerald-950/60 bg-gradient-to-br from-emerald-950/40 via-doof-card to-slate-950';
      default:
        return 'border-cyan-500/80 shadow-cyan-950/50 bg-gradient-to-br from-doof-panel via-doof-card to-slate-950';
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Speech Balloon Body */}
      <motion.div
        key={text}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={isTyping ? handleSkipTyping : undefined}
        className={`relative p-5 md:p-6 rounded-3xl border-4 shadow-2xl backdrop-blur-md cursor-pointer transition-all ${getBorderColor()}`}
      >
        {/* Balloon Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-doof-green-neon animate-ping" />
            <h3 className="font-comic text-lg md:text-xl text-white tracking-wide">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playJingle();
              }}
              title="Reproducir Jingle de Doofenshmirtz Evil Inc."
              className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-400 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-purple-800 transition-colors"
            >
              <Volume2 className="w-3 h-3 text-purple-300" />
              <span>Jingle</span>
            </button>
          </div>
        </div>

        {/* Typed Monologue */}
        <p className="text-slate-100 font-sans text-sm sm:text-base md:text-lg leading-relaxed select-text font-medium">
          <span className="text-doof-green-acid font-tech text-xl mr-1">«</span>
          {displayedText}
          {isTyping && <span className="inline-block w-2 h-4 bg-doof-green-neon ml-1 animate-pulse" />}
          {!isTyping && <span className="text-doof-green-acid font-tech text-xl ml-1">»</span>}
        </p>

        {/* Small prompt hint */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            {isTyping ? 'Haz clic en el bocadillo para mostrar todo el texto' : 'Selecciona tu respuesta abajo 💬'}
          </span>
          <span className="text-slate-500">Transmisión Danville HQ</span>
        </div>

        {/* Comic Balloon Tail pointing towards Heinz (Left/Top) */}
        <div
          className="absolute -bottom-4 left-10 md:left-14 w-6 h-6 rotate-45 border-r-4 border-b-4 bg-doof-card"
          style={{
            borderColor: mood === 'evil' ? '#a855f7' : mood === 'complaining' ? '#f59e0b' : mood === 'shocked' ? '#ef4444' : '#06b6d4'
          }}
        />
      </motion.div>
    </div>
  );
};
