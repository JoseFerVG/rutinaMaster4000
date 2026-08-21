import React from 'react';
import { clsx } from 'clsx';
import { soundFx } from '../../utils/audioSynth';

interface HazardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'green' | 'red' | 'hazard' | 'outline' | 'cyan';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const HazardButton: React.FC<HazardButtonProps> = ({
  variant = 'green',
  size = 'md',
  icon,
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundFx.playLaser();
    if (onClick) onClick(e);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 select-none rounded-xl focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm md:text-base gap-2.5 font-semibold',
    xl: 'px-8 py-4 text-base md:text-lg font-semibold tracking-tight gap-3'
  };

  const variantStyles = {
    green: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 border border-emerald-400/40',
    purple: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30',
    red: 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 border border-rose-400/30',
    hazard: 'bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-950/30 border border-amber-400/40',
    cyan: 'bg-sky-500/90 hover:bg-sky-400 text-slate-950 font-semibold shadow-lg shadow-sky-950/30 border border-sky-400/40',
    outline: 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-white/20 shadow-sm backdrop-blur-sm'
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
