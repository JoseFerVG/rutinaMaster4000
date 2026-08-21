import React from 'react';
import { Activity, ChevronRight, Home, RotateCcw, Layers, Calculator } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useCardioStore } from '../../store/useCardioStore';

export const Navbar: React.FC = () => {
  const {
    currentView,
    activeCategory,
    activeTool,
    goHome,
    goToCategory
  } = useAppStore();

  const { activeRoutine, resetAll: resetHypertrophy } = useRoutineStore();
  const { activeCardioRoutine, resetAll: resetCardio } = useCardioStore();

  const handleResetCurrent = () => {
    if (activeTool === 'hypertrophy') {
      resetHypertrophy();
    } else if (activeTool === 'cardio') {
      resetCardio();
    }
  };

  const hasActivePlan =
    (activeTool === 'hypertrophy' && activeRoutine) ||
    (activeTool === 'cardio' && activeCardioRoutine);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcfcfd]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3 transition-all print:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name: Kinetic Biomechanics */}
        <div className="flex items-center gap-3">
          <div
            onClick={goHome}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-7 h-7 rounded-md bg-zinc-950 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Activity className="w-3.5 h-3.5 text-zinc-100" />
            </div>
            <div>
              <span className="font-display font-bold text-xs sm:text-sm tracking-widest text-zinc-950 uppercase">
                KINETIC BIOMECHANICS
              </span>
            </div>
          </div>

          {/* Breadcrumb Navigation Trail */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-zinc-200 text-xs font-medium text-zinc-500">
            <button
              type="button"
              onClick={goHome}
              className={`hover:text-zinc-950 transition-colors flex items-center gap-1 ${
                currentView === 'home' ? 'text-zinc-950 font-semibold' : ''
              }`}
            >
              <Home className="w-3 h-3" />
              <span>Inicio</span>
            </button>

            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => goToCategory(activeCategory)}
                  className={`hover:text-zinc-950 transition-colors ${
                    currentView === 'category' ? 'text-zinc-950 font-semibold' : ''
                  }`}
                >
                  {activeCategory === 'routines' ? 'Rutinas' : 'Calculadoras'}
                </button>
              </>
            )}

            {currentView === 'tool' && activeTool && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="text-zinc-950 font-semibold">
                  {activeTool === 'hypertrophy'
                    ? 'Hipertrofia & Fuerza'
                    : activeTool === 'cardio'
                    ? 'Cardio & Resistencia'
                    : 'Calculadora'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Switcher & Quick Navigation */}
        <div className="flex items-center gap-2">
          {/* Direct Category Jump Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
            <button
              type="button"
              onClick={() => goToCategory('routines')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === 'routines'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rutinas</span>
            </button>

            <button
              type="button"
              onClick={() => goToCategory('calculators')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === 'calculators'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadoras</span>
            </button>
          </div>

          {/* Action: Reset current plan when in tool view */}
          {currentView === 'tool' && hasActivePlan && (
            <button
              onClick={handleResetCurrent}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/60 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
