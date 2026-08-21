import React, { useState } from 'react';
import { RotateCcw, Activity, Dumbbell, Heart, Calculator, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useCardioStore } from '../../store/useCardioStore';

export const Navbar: React.FC = () => {
  const { activeSection, setActiveSection } = useAppStore();
  const { activeRoutine, resetAll: resetHypertrophy } = useRoutineStore();
  const { activeCardioRoutine, resetAll: resetCardio } = useCardioStore();

  const [isRoutineMenuOpen, setIsRoutineMenuOpen] = useState(false);

  const handleSelectSection = (section: 'hypertrophy' | 'cardio' | 'calculators') => {
    setActiveSection(section);
    setIsRoutineMenuOpen(false);
  };

  const handleResetCurrent = () => {
    if (activeSection === 'hypertrophy') {
      resetHypertrophy();
    } else if (activeSection === 'cardio') {
      resetCardio();
    }
  };

  const hasActivePlan =
    (activeSection === 'hypertrophy' && activeRoutine) ||
    (activeSection === 'cardio' && activeCardioRoutine);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcfcfd]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3 transition-all print:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name: Kinetic Biomechanics */}
        <div
          onClick={() => setActiveSection('hypertrophy')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 rounded-md bg-zinc-950 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="w-3.5 h-3.5 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm tracking-widest text-zinc-950 uppercase">
                KINETIC BIOMECHANICS
              </span>
            </div>
          </div>
        </div>

        {/* Top-Level Tools & Modules Switcher */}
        <nav className="flex items-center gap-1 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/70">
          {/* Rutinas Category with Sub-options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoutineMenuOpen(!isRoutineMenuOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSection === 'hypertrophy' || activeSection === 'cardio'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <span>Rutinas</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Dropdown Menu for Rutinas */}
            {isRoutineMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-zinc-200 shadow-elevated rounded-xl p-1.5 z-50 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => handleSelectSection('hypertrophy')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    activeSection === 'hypertrophy'
                      ? 'bg-zinc-950 text-white font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5 shrink-0" />
                  <span>Hipertrofia & Fuerza</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSection('cardio')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    activeSection === 'cardio'
                      ? 'bg-zinc-950 text-white font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>Cardio & Resistencia</span>
                </button>
              </div>
            )}
          </div>

          {/* Calculadoras Module */}
          <button
            type="button"
            onClick={() => handleSelectSection('calculators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSection === 'calculators'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculadoras</span>
          </button>
        </nav>

        {/* Global Action: Reset / New Plan */}
        <div className="flex items-center gap-2">
          {hasActivePlan && (
            <button
              onClick={handleResetCurrent}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/60 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Plan</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
