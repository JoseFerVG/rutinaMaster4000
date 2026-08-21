import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Check } from 'lucide-react';
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
  promptText = 'Tu respuesta para Heinz:',
  options,
  className = ''
}) => {
  const getVariantStyles = (variant: DialogueChoiceOption['variant'] = 'green', isSelected: boolean = false) => {
    if (isSelected) {
      return {
        card: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-doof-card border-doof-green-neon text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-400',
        tail: 'border-emerald-400 bg-teal-900',
        badge: 'bg-emerald-500 text-slate-950 font-bold',
        icon: 'text-doof-green-neon'
      };
    }

    switch (variant) {
      case 'purple':
        return {
          card: 'bg-gradient-to-r from-purple-950/70 via-doof-panel to-doof-card border-purple-500/70 text-slate-100 hover:border-purple-300 hover:shadow-purple-950/60',
          tail: 'border-purple-500 bg-doof-panel',
          badge: 'bg-purple-900/80 text-purple-200 border border-purple-400/50',
          icon: 'text-purple-400'
        };
      case 'cyan':
        return {
          card: 'bg-gradient-to-r from-cyan-950/70 via-doof-panel to-doof-card border-cyan-500/70 text-slate-100 hover:border-cyan-300 hover:shadow-cyan-950/60',
          tail: 'border-cyan-500 bg-doof-panel',
          badge: 'bg-cyan-900/80 text-cyan-200 border border-cyan-400/50',
          icon: 'text-cyan-400'
        };
      case 'amber':
        return {
          card: 'bg-gradient-to-r from-amber-950/70 via-doof-panel to-doof-card border-amber-500/70 text-slate-100 hover:border-amber-300 hover:shadow-amber-950/60',
          tail: 'border-amber-500 bg-doof-panel',
          badge: 'bg-amber-900/80 text-amber-200 border border-amber-400/50',
          icon: 'text-amber-400'
        };
      case 'red':
        return {
          card: 'bg-gradient-to-r from-red-950/80 via-doof-panel to-doof-card border-red-500/80 text-slate-100 hover:border-red-400 hover:shadow-red-950/70',
          tail: 'border-red-500 bg-doof-panel',
          badge: 'bg-red-900/80 text-red-200 border border-red-400/50',
          icon: 'text-red-400'
        };
      default:
        return {
          card: 'bg-gradient-to-r from-doof-panel via-doof-card to-slate-900 border-doof-border text-slate-200 hover:border-doof-green-acid hover:text-white hover:shadow-emerald-950/40',
          tail: 'border-doof-border bg-doof-card',
          badge: 'bg-slate-800 text-slate-300 border border-slate-700',
          icon: 'text-doof-green-acid'
        };
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {promptText && (
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-2">
          <MessageSquare className="w-3.5 h-3.5 text-doof-green-neon" />
          <span>{promptText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, idx) => {
          const style = getVariantStyles(opt.variant, opt.isSelected);

          return (
            <motion.button
              key={opt.id || idx}
              whileHover={{ scale: 1.015, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundFx.playLaser();
                opt.onClick();
              }}
              className={`relative p-4 md:p-5 rounded-2xl border-2 text-left transition-all shadow-lg cursor-pointer group flex items-start gap-4 ${style.card}`}
            >
              {/* Icon or Avatar Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-8 h-8 rounded-xl bg-slate-950/60 border border-slate-700/60 flex items-center justify-center text-base shadow-sm ${style.icon}`}>
                  {opt.icon || '💬'}
                </div>
              </div>

              {/* Dialogue Speech Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  {opt.tag && (
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full font-bold ${style.badge}`}>
                      {opt.tag}
                    </span>
                  )}
                  {opt.isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-doof-green-neon font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Seleccionado
                    </span>
                  )}
                </div>

                <div className="font-comic text-base sm:text-lg text-white group-hover:text-doof-green-neon tracking-wide transition-colors">
                  {opt.speechText}
                </div>
              </div>

              {/* Subtle tail accent */}
              <div
                className={`hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-r-2 border-t-2 ${style.tail}`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
