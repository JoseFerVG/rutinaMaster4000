import React from 'react';
import { Volume2, VolumeX, Flame, Radio } from 'lucide-react';
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
    '0: Entrada Malvada',
    '1: Holograma Muscular',
    '2: Calibrador',
    '3: Compil-inador',
    '4: Plano del Inador'
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-doof-darkest via-doof-dark to-doof-darkest border-b-2 border-doof-purple shadow-xl px-4 py-2.5 backdrop-blur-md">
      {/* Top flashing laboratory status bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-purple-300 pb-1.5 mb-1.5 border-b border-purple-900/40">
        <div className="flex items-center gap-2">
          <Radio className="w-3 h-3 text-doof-green-neon animate-pulse" />
          <span className="font-bold text-slate-200">DOOFENSHMIRTZ EVIL INC. SERVIDOR CENTRAL</span>
          <span className="hidden sm:inline text-slate-400">• Danville Tri-State Area</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-yellow-400 font-bold uppercase">Estado: Planeando Venganza contra Roger</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Evil Inc Brand */}
        <div
          onClick={() => setStep(0)}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-800 via-doof-purple to-slate-950 border-2 border-purple-400 flex items-center justify-center shadow-lg shadow-purple-950 group-hover:scale-105 transition-transform">
            <span className="text-2xl">🧪</span>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-doof-green-acid border border-white animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-xl md:text-2xl tracking-wide text-white group-hover:text-purple-300 transition-colors drop-shadow">
                RUTINA-MASTER 4000
              </span>
              <span className="text-[10px] uppercase font-mono font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-900 to-doof-purple border border-purple-400 text-purple-100 shadow-sm">
                INADOR 3000
              </span>
            </div>
            <p className="text-[10px] text-doof-green-neon font-mono hidden md:block">
              «Generador de Hipertrofia Biomecánica Anti-Alcaldes»
            </p>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="hidden lg:flex items-center gap-1.5 bg-doof-card/90 px-3.5 py-1.5 rounded-full border-2 border-doof-border shadow-inner">
          {stepLabels.map((label, idx) => (
            <React.Fragment key={label}>
              <button
                onClick={() => {
                  if (idx <= step || (idx === 4 && activeRoutine)) {
                    setStep(idx);
                  }
                }}
                disabled={idx > step && !(idx === 4 && activeRoutine)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-tech transition-all ${
                  step === idx
                    ? 'bg-gradient-to-r from-purple-700 via-doof-purple to-purple-600 text-white shadow-md shadow-purple-900/60 ring-1 ring-purple-400'
                    : idx < step
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 cursor-not-allowed opacity-40'
                }`}
              >
                <span>{label}</span>
              </button>
              {idx < stepLabels.length - 1 && (
                <span className="text-purple-500 text-xs">›</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Perry Easter Egg Fedora Button */}
          <button
            onClick={triggerPerryEasterEgg}
            title="¿Un misterioso ornitorrinco con sombrero?"
            className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-900/60 to-slate-950 border-2 border-amber-500 hover:border-amber-300 text-amber-300 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all shadow-md group"
          >
            <span className="group-hover:rotate-12 transition-transform select-none">🤠</span>
          </button>

          {/* Sound Mute / Unmute */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Desactivar Efectos de Sonido' : 'Activar Efectos de Sonido'}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm transition-all shadow-md ${
              audioEnabled
                ? 'bg-gradient-to-b from-purple-950 to-slate-950 border-purple-500 text-purple-300 hover:text-white hover:border-purple-300'
                : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Self-Destruct Quick Trigger Button (if routine active) */}
          {activeRoutine && (
            <button
              onClick={openSelfDestructModal}
              title="¡Botón de Autodestrucción!"
              className="px-3.5 py-2 rounded-xl bg-hazard-red text-white font-black text-xs uppercase tracking-wider border-2 border-yellow-400 flex items-center gap-1.5 shadow-lg shadow-red-950 animate-pulse active:scale-95 transition-all"
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
