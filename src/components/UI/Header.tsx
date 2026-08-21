import React from 'react';
import { Volume2, VolumeX, Flame } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';

export const Header: React.FC = () => {
  const {
    step,
    setStep,
    audioEnabled,
    toggleAudio,
    openSelfDestructModal,
    triggerPerryEasterEgg,
    activeRoutine
  } = useDoofStore();

  const stepLabels = [
    'Bienvenida',
    'Objetivo Corporal',
    'Calibración',
    'Compil-inador',
    'Plano Malvado'
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-doof-darkest/90 border-b border-doof-border backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Evil Inc Brand */}
        <div
          onClick={() => setStep(0)}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800 to-slate-900 border-2 border-doof-purple flex items-center justify-center shadow-md shadow-purple-950 group-hover:scale-105 transition-transform">
            <span className="text-xl">🧪</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-doof-green-acid animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-lg md:text-xl tracking-wide text-white group-hover:text-purple-300 transition-colors">
                RUTINA-MASTER 4000
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-200">
                INADOR EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block">
              Doofenshmirtz Evil Incorporated • Danville Tri-State
            </p>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="hidden lg:flex items-center gap-1.5 bg-doof-dark/80 px-3 py-1.5 rounded-full border border-doof-border">
          {stepLabels.map((label, idx) => (
            <React.Fragment key={label}>
              <button
                onClick={() => {
                  if (idx <= step || (idx === 4 && activeRoutine)) {
                    setStep(idx);
                  }
                }}
                disabled={idx > step && !(idx === 4 && activeRoutine)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  step === idx
                    ? 'bg-gradient-to-r from-purple-700 to-doof-purple text-white shadow-md shadow-purple-900/40'
                    : idx < step
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-900/60 flex items-center justify-center text-[10px] font-mono">
                  {idx}
                </span>
                <span>{label}</span>
              </button>
              {idx < stepLabels.length - 1 && (
                <span className="text-slate-600 text-xs">›</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Perry Easter Egg Fedora Button */}
          <button
            onClick={triggerPerryEasterEgg}
            title="¿Un botón misterioso con sombrero?"
            className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-600/40 hover:border-amber-400 text-amber-400 flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-all shadow-sm group"
          >
            <span className="group-hover:rotate-12 transition-transform select-none">🤠</span>
          </button>

          {/* Sound Mute / Unmute */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Desactivar Efectos de Sonido' : 'Activar Efectos de Sonido'}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-colors ${
              audioEnabled
                ? 'bg-purple-950/50 border-purple-500/40 text-purple-300 hover:bg-purple-900/60'
                : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Self-Destruct Quick Trigger Button (if routine active) */}
          {activeRoutine && (
            <button
              onClick={openSelfDestructModal}
              title="¡Botón de Autodestrucción!"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs uppercase tracking-wider border border-yellow-400 flex items-center gap-1.5 shadow-md shadow-red-950/50 animate-pulse active:scale-95 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Autodestrucción</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
