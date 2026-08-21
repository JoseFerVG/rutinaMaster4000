import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Skull, AlertCircle, Zap, Volume2, Smile } from 'lucide-react';
import { HeinzMood } from '../../types';
import { soundFx } from '../../utils/audioSynth';

interface HeinzSpeechBubbleProps {
  speech: string;
  mood?: HeinzMood;
  className?: string;
  compact?: boolean;
}

export const HeinzSpeechBubble: React.FC<HeinzSpeechBubbleProps> = ({
  speech,
  mood = 'normal',
  className = '',
  compact = false
}) => {
  const getMoodBadge = () => {
    switch (mood) {
      case 'evil':
        return { label: 'Modo: Científico Malvado', color: 'bg-purple-900/80 text-purple-300 border-purple-500/50', icon: <Skull className="w-3.5 h-3.5" /> };
      case 'complaining':
        return { label: 'Queja de Gimmelshtump', color: 'bg-amber-900/80 text-amber-300 border-amber-500/50', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      case 'excited':
        return { label: '¡Plan en Marcha!', color: 'bg-emerald-900/80 text-emerald-300 border-emerald-500/50', icon: <Zap className="w-3.5 h-3.5" /> };
      case 'shocked':
        return { label: '¡Alerta de Ornitorrinco!', color: 'bg-red-900/80 text-red-300 border-red-500/50', icon: <AlertCircle className="w-3.5 h-3.5" /> };
      case 'paranoid':
        return { label: 'Sospecha de la O.W.C.A.', color: 'bg-cyan-900/80 text-cyan-300 border-cyan-500/50', icon: <Sparkles className="w-3.5 h-3.5" /> };
      default:
        return { label: 'Dr. Heinz Doofenshmirtz', color: 'bg-slate-800 text-slate-300 border-slate-600', icon: <Smile className="w-3.5 h-3.5" /> };
    }
  };

  const badge = getMoodBadge();

  return (
    <div className={`relative flex items-start gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-doof-panel via-doof-card to-doof-dark border-2 border-doof-purple/40 shadow-xl shadow-purple-950/20 backdrop-blur-sm ${className}`}>
      {/* Doofenshmirtz Avatar */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-doof-purple bg-gradient-to-b from-purple-900 to-slate-900 flex items-center justify-center shadow-lg shadow-purple-900/40 overflow-hidden group">
          {/* Stylized Dr. Doofenshmirtz representation */}
          <div className="text-3xl select-none transform transition-transform group-hover:scale-110">
            🧪
          </div>
          <div className="absolute inset-0 bg-doof-green/10 pointer-events-none" />
        </div>
        <button
          onClick={() => soundFx.playJingle()}
          title="Tocar jingle de Doofenshmirtz Evil Inc."
          className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-800 flex items-center gap-1 transition-colors"
        >
          <Volume2 className="w-2.5 h-2.5" /> Jingle
        </button>
      </div>

      {/* Speech Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
            {badge.icon}
            {badge.label}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Doofenshmirtz Evil Inc. Broadcast
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-slate-200 font-sans leading-relaxed ${compact ? 'text-sm' : 'text-sm md:text-base'}`}
          >
            <span className="font-semibold text-doof-green-neon mr-1 font-tech">«</span>
            {speech}
            <span className="font-semibold text-doof-green-neon ml-1 font-tech">»</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
