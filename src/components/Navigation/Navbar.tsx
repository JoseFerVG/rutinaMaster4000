import React from 'react';
import { RotateCcw, Activity } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';

export const Navbar: React.FC = () => {
  const {
    step,
    currentQuestion,
    activeRoutine,
    resetAll,
    setCurrentQuestion
  } = useRoutineStore();

  const totalQuestions = 6;
  const questionTitles = ['Objetivo', 'Experiencia', 'Frecuencia', 'Duración', 'Entorno', 'Enfoque'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcfcfd]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 transition-all print:hidden">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <button
          onClick={resetAll}
          className="flex items-center gap-2.5 group text-left select-none focus:outline-none"
        >
          <div className="w-7 h-7 rounded-md bg-zinc-950 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="w-3.5 h-3.5 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-widest text-zinc-950 uppercase">
                KINETIC
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium">
                BIOMECHANICS
              </span>
            </div>
          </div>
        </button>

        {/* Questionnaire Progress Indicator (when in questionnaire mode) */}
        {step === 'questionnaire' && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-zinc-400">
              Paso 0{currentQuestion + 1} / 0{totalQuestions}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => idx <= currentQuestion && setCurrentQuestion(idx)}
                  disabled={idx > currentQuestion}
                  title={`Paso ${idx + 1}: ${questionTitles[idx]}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentQuestion
                      ? 'w-6 bg-zinc-900'
                      : idx < currentQuestion
                      ? 'w-2 bg-zinc-400 hover:bg-zinc-600 cursor-pointer'
                      : 'w-2 bg-zinc-200 cursor-not-allowed'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Global Action: New Routine / Reset */}
        <div className="flex items-center gap-2">
          {activeRoutine && (
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/60 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nuevo Plan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
