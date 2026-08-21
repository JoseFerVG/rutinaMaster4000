import React from 'react';
import { motion } from 'framer-motion';
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
    sm: 'w-20 h-24',
    md: 'w-32 h-40',
    lg: 'w-48 h-60 md:w-56 md:h-72',
    xl: 'w-64 h-80 md:w-72 md:h-96'
  };

  // Facial expressions & colors based on mood
  const getMoodConfig = () => {
    switch (mood) {
      case 'evil':
        return {
          mouthD: isTalking ? 'M 65,115 Q 85,135 105,115 Q 85,125 65,115' : 'M 65,115 Q 85,135 105,115',
          eyebrowsLeft: 'M 60,68 L 78,74',
          eyebrowsRight: 'M 92,74 L 110,68',
          glow: 'drop-shadow(0 0 16px rgba(139, 47, 201, 0.6))',
          bgColor: '#581c87',
          expressionText: '😈 ¡Plan Malvado!'
        };
      case 'complaining':
        return {
          mouthD: isTalking ? 'M 70,122 Q 85,108 100,122' : 'M 70,122 Q 85,112 100,122',
          eyebrowsLeft: 'M 60,74 L 78,68',
          eyebrowsRight: 'M 92,68 L 110,74',
          glow: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.4))',
          bgColor: '#78350f',
          expressionText: '😒 Queja de Gimmelshtump'
        };
      case 'shocked':
        return {
          mouthD: 'M 75,112 A 10,14 0 1,0 95,112 A 10,14 0 1,0 75,112',
          eyebrowsLeft: 'M 60,62 L 78,65',
          eyebrowsRight: 'M 92,65 L 110,62',
          glow: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.7))',
          bgColor: '#991b1b',
          expressionText: '😱 ¡¿Un Ornitorrinco?!'
        };
      case 'excited':
        return {
          mouthD: 'M 62,112 Q 85,140 108,112 Z',
          eyebrowsLeft: 'M 60,65 L 78,70',
          eyebrowsRight: 'M 92,70 L 110,65',
          glow: 'drop-shadow(0 0 16px rgba(0, 255, 136, 0.6))',
          bgColor: '#065f46',
          expressionText: '⚡ ¡Hipertrofia Total!'
        };
      default:
        return {
          mouthD: isTalking ? 'M 68,115 Q 85,128 102,115' : 'M 70,118 Q 85,124 100,118',
          eyebrowsLeft: 'M 62,70 L 78,72',
          eyebrowsRight: 'M 92,72 L 108,70',
          glow: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.4))',
          bgColor: '#1e293b',
          expressionText: '🧪 Dr. Heinz Doofenshmirtz'
        };
    }
  };

  const config = getMoodConfig();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Mood Badge on Top */}
      <motion.div
        key={mood}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-doof-darkest/90 border border-purple-500/50 text-purple-200 shadow-md flex items-center gap-1.5"
      >
        <span>{config.expressionText}</span>
      </motion.div>

      {/* Animated Character Figure */}
      <motion.div
        animate={{
          y: isTalking ? [0, -3, 0] : [0, -2, 0],
          rotate: mood === 'shocked' ? [-1, 1, -1] : [0, 0.5, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: isTalking ? 0.35 : 2.5,
          ease: 'easeInOut'
        }}
        style={{ filter: config.glow }}
        className={`relative ${sizeMap[size]}`}
      >
        <svg
          viewBox="0 0 170 220"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="labCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fba76a" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* Shoulders & Lab Coat */}
          <g>
            {/* Dark Turtleneck Sweater */}
            <path
              d="M 50,140 L 120,140 L 135,220 L 35,220 Z"
              fill="url(#shirtGrad)"
              stroke="#0f172a"
              strokeWidth="2"
            />

            {/* White Lab Coat Left Lapel */}
            <path
              d="M 20,165 Q 45,145 60,145 L 55,220 L 15,220 Q 15,190 20,165 Z"
              fill="url(#labCoatGrad)"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* White Lab Coat Right Lapel */}
            <path
              d="M 150,165 Q 125,145 110,145 L 115,220 L 155,220 Q 155,190 150,165 Z"
              fill="url(#labCoatGrad)"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Lab Coat Collar */}
            <path
              d="M 45,145 L 20,165 L 55,175 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <path
              d="M 125,145 L 150,165 L 115,175 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
          </g>

          {/* Long Slender Neck */}
          <path
            d="M 72,110 L 72,150 Q 85,155 98,150 L 98,110 Z"
            fill="url(#skinGrad)"
            stroke="#c27845"
            strokeWidth="1.5"
          />

          {/* Head & Pointy Chin */}
          <g>
            {/* Iconic Angular Head */}
            <path
              d="M 45,75 Q 45,40 85,38 Q 125,40 125,75 Q 125,105 105,128 Q 85,148 65,128 Q 45,105 45,75 Z"
              fill="url(#skinGrad)"
              stroke="#c27845"
              strokeWidth="2"
            />

            {/* Messy Brown Hair */}
            <path
              d="M 45,65 Q 40,40 60,30 Q 80,18 95,25 Q 115,15 125,32 Q 135,45 125,65 Q 115,45 100,42 Q 75,38 55,55 Z"
              fill="#5c3822"
              stroke="#382012"
              strokeWidth="2"
            />
            {/* Extra hair tufts */}
            <path d="M 95,20 Q 105,5 112,18 Z" fill="#5c3822" stroke="#382012" strokeWidth="1.5" />
            <path d="M 65,25 Q 60,10 72,20 Z" fill="#5c3822" stroke="#382012" strokeWidth="1.5" />

            {/* Pointy Nose (Signature Doofenshmirtz) */}
            <path
              d="M 85,75 L 130,88 L 86,96 Z"
              fill="url(#skinGrad)"
              stroke="#c27845"
              strokeWidth="2"
            />

            {/* Ears */}
            <ellipse cx="45" cy="85" rx="6" ry="9" fill="#fba76a" stroke="#c27845" strokeWidth="1.5" />
            <ellipse cx="125" cy="85" rx="6" ry="9" fill="#fba76a" stroke="#c27845" strokeWidth="1.5" />

            {/* Eyes */}
            <g>
              {/* Left Eye */}
              <ellipse cx="68" cy="80" rx="9" ry="11" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx={mood === 'shocked' ? '68' : '70'} cy="80" r="4" fill="#1e293b" />
              <circle cx="69" cy="78" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse cx="98" cy="80" rx="9" ry="11" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx={mood === 'shocked' ? '98' : '96'} cy="80" r="4" fill="#1e293b" />
              <circle cx="97" cy="78" r="1.5" fill="#ffffff" />
            </g>

            {/* Expressive Eyebrows */}
            <path d={config.eyebrowsLeft} stroke="#382012" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d={config.eyebrowsRight} stroke="#382012" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Animated Mouth */}
            <path
              d={config.mouthD}
              fill={mood === 'excited' || mood === 'evil' ? '#991b1b' : 'none'}
              stroke="#382012"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {mood === 'evil' && (
              <path d="M 72,118 L 76,124 L 80,118" fill="#ffffff" stroke="#382012" strokeWidth="1" />
            )}

            {/* Cheek wrinkles */}
            <path d="M 56,92 Q 52,100 58,106" stroke="#c27845" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 114,92 Q 118,100 112,106" stroke="#c27845" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Test Tube in Pocket (Evil Detail) */}
          <g transform="translate(30, 160)">
            <rect x="0" y="0" width="8" height="22" rx="4" fill="#00ff88" opacity="0.85" stroke="#10b981" strokeWidth="1" />
            <ellipse cx="4" cy="3" rx="3" ry="1.5" fill="#ffffff" opacity="0.6" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
