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
  variant = 'purple',
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
    if (variant === 'red' || variant === 'hazard') {
      soundFx.playSiren();
    } else {
      soundFx.playLaser();
    }
    if (onClick) onClick(e);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 select-none rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-3',
    xl: 'px-8 py-4 text-lg font-black tracking-widest gap-3'
  };

  const variantStyles = {
    purple: 'bg-gradient-to-r from-purple-700 via-doof-purple to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white border border-purple-400/40 shadow-purple-950/50 hover:shadow-purple-700/40 focus:ring-purple-500',
    green: 'bg-gradient-to-r from-emerald-700 via-doof-green to-teal-500 hover:from-emerald-600 hover:to-teal-400 text-doof-darkest font-extrabold border border-emerald-300 shadow-emerald-950/50 hover:shadow-emerald-500/40 focus:ring-emerald-400',
    red: 'bg-gradient-to-r from-red-700 via-red-600 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white border-2 border-yellow-400 shadow-red-950/80 hover:shadow-red-600/50 focus:ring-red-500 animate-pulse-fast',
    hazard: 'bg-hazard-pattern text-slate-950 font-black border-2 border-yellow-400 shadow-yellow-950/50 hover:brightness-110 focus:ring-yellow-400',
    cyan: 'bg-gradient-to-r from-cyan-700 via-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-extrabold border border-cyan-300 shadow-cyan-950/50 focus:ring-cyan-400',
    outline: 'bg-doof-card/80 hover:bg-doof-panel text-slate-200 border border-doof-border hover:border-slate-400 shadow-slate-950/30 focus:ring-slate-400'
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
