import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { soundFx } from '../../utils/audioSynth';

export interface DialogueChoiceOption {
  id: string;
  speechText: string;
  tag?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  variant?: 'green' | 'purple' | 'cyan' | 'amber' | 'red';
  onClick: () => void;
}

interface UserChoiceBubblesProps {
  promptText?: string;
  options: DialogueChoiceOption[];
  className?: string;
}

export const UserChoiceBubbles: React.FC<UserChoiceBubblesProps> = ({
  promptText = 'Selecciona una respuesta:',
  options,
  className = ''
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {promptText && (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-1 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{promptText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt, idx) => {
          return (
            <motion.button
              key={opt.id || idx}
              whileHover={{ scale: 1.008, x: 2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                soundFx.playLaser();
                opt.onClick();
              }}
              className={`w-full p-4 md:p-4.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-4 backdrop-blur-md cursor-pointer ${
                opt.isSelected
                  ? 'bg-emerald-500/10 border-emerald-400/40 text-white shadow-zen-glow ring-1 ring-emerald-400/30'
                  : 'bg-white/[0.025] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/[0.16] text-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {opt.icon && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm border ${
                    opt.isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-white/[0.04] text-slate-400 border-white/[0.06]'
                  }`}>
                    {opt.icon}
                  </div>
                )}

                <div className="min-w-0">
                  {opt.tag && (
                    <span className={`inline-block text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md mb-1 border ${
                      opt.isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/[0.04] text-slate-400 border-white/[0.06]'
                    }`}>
                      {opt.tag}
                    </span>
                  )}
                  <div className="font-sans text-sm md:text-base text-slate-100 font-medium leading-snug">
                    {opt.speechText}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                {opt.isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-500 flex items-center justify-center group-hover:text-slate-200 transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
