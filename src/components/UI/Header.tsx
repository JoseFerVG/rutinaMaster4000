import React from 'react';
import { Volume2, VolumeX, RotateCcw, Activity } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';

export const Header: React.FC = () => {
  const {
    step,
    setStep,
    audioEnabled,
    toggleAudio,
    openSelfDestructModal,
    activeRoutine
  } = useDoofStore();

  const stepLabels = [
    'Inicio',
    'Morfología & Músculos',
    'Calibración',
    'Síntesis',
    'Protocolo'
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-zen-darkest/75 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setStep(0)}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shadow-zen-glow group-hover:scale-105 transition-all">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                RUTINA<span className="text-emerald-400 font-light">MASTER</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                ZEN EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden md:block tracking-wide">
              Arquitectura Biomecánica & Rendimiento Minimalista
            </p>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06] shadow-sm">
          {stepLabels.map((label, idx) => (
            <React.Fragment key={label}>
              <button
                onClick={() => {
                  if (idx <= step || (idx === 4 && activeRoutine)) {
                    setStep(idx);
                  }
                }}
                disabled={idx > step && !(idx === 4 && activeRoutine)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  step === idx
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                    : idx < step
                    ? 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    : 'text-slate-600 cursor-not-allowed opacity-40'
                }`}
              >
                <span>{label}</span>
              </button>
              {idx < stepLabels.length - 1 && (
                <span className="text-white/20 text-xs px-0.5">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Mute / Unmute */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Desactivar Sonido' : 'Activar Sonido'}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm transition-all ${
              audioEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Protocol Trigger Button (if routine active) */}
          {activeRoutine && (
            <button
              onClick={openSelfDestructModal}
              title="Reiniciar Protocolo"
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-slate-300 hover:text-rose-300 font-medium text-xs border border-white/10 hover:border-rose-500/30 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
