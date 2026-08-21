import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, Heart } from 'lucide-react';
import { HeinzMood } from '../../types';

interface DoofenshmirtzAvatarProps {
  mood: HeinzMood;
  isTalking?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DoofenshmirtzAvatar: React.FC<DoofenshmirtzAvatarProps> = ({
  mood = 'normal',
  isTalking = false,
  className = '',
  size = 'lg'
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36 md:w-44 md:h-44',
    xl: 'w-48 h-48 md:w-56 md:h-56'
  };

  const getMoodBadge = () => {
    switch (mood) {
      case 'evil':
      case 'excited':
        return { label: 'Sobrecarga Activa', icon: <Zap className="w-3 h-3 text-emerald-400" />, color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' };
      case 'complaining':
        return { label: 'Reajuste Biomecánico', icon: <Heart className="w-3 h-3 text-amber-400" />, color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' };
      case 'shocked':
        return { label: 'Atención Requerida', icon: <Sparkles className="w-3 h-3 text-rose-400" />, color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' };
      default:
        return { label: 'Asesor Biomecánico', icon: <Brain className="w-3 h-3 text-teal-400" />, color: 'text-teal-300 border-teal-500/30 bg-teal-500/10' };
    }
  };

  const badge = getMoodBadge();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Mood status pill */}
      <motion.div
        key={mood}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-3 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${badge.color}`}
      >
        {badge.icon}
        <span>{badge.label}</span>
      </motion.div>

      {/* Floating Minimalist Sacred Geometry & Concentric Rings */}
      <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
        {/* Ambient Glow */}
        <motion.div
          animate={{
            scale: isTalking ? [1, 1.15, 1] : [0.95, 1.05, 0.95],
            opacity: isTalking ? [0.3, 0.55, 0.3] : [0.2, 0.35, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-sky-500/20 blur-2xl pointer-events-none"
        />

        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
          className="absolute inset-1 rounded-full border border-dashed border-emerald-500/25"
        />

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          className="absolute inset-3.5 rounded-full border border-white/10"
        />

        {/* Core Glass Sphere */}
        <motion.div
          animate={{
            y: isTalking ? [0, -4, 0] : [0, -2, 0],
            scale: isTalking ? [1, 1.02, 1] : [0.99, 1.01, 0.99]
          }}
          transition={{ repeat: Infinity, duration: isTalking ? 0.6 : 3, ease: 'easeInOut' }}
          className="relative w-full h-full rounded-full p-2 flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-zen-surface via-zen-card to-zen-darkest border border-white/15 p-4 flex flex-col items-center justify-center shadow-zen-md overflow-hidden relative group">
            {/* Subtle inner mesh */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-full" />

            {/* Stylized Minimalist Geometric Head & Focus Orb */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-400/30 flex items-center justify-center shadow-inner">
                <Brain className="w-6 h-6 md:w-8 md:h-8 text-emerald-300 stroke-[1.5]" />
              </div>
              <div className="w-8 h-1 bg-emerald-400/40 rounded-full mt-2 filter blur-[1px]" />
            </div>

            {/* Inner Particle Dot */}
            <motion.div
              animate={{ opacity: isTalking ? [0.4, 1, 0.4] : [0.2, 0.6, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
