import React from 'react';
import { Activity, ChevronRight, Home, RotateCcw } from 'lucide-react';
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
    <header role="banner" className="sticky top-0 z-40 w-full bg-[#fbfbfa]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 transition-all print:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name: Kinetic Biomechanics */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goHome}
            aria-label="Kinetic Biomechanics - Ir al Inicio"
            className="flex items-center gap-2.5 cursor-pointer group select-none text-left focus-visible:ring-2 focus-visible:ring-zinc-900 rounded-lg p-0.5"
          >
            <div className="w-7 h-7 rounded-md bg-zinc-950 flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
              <Activity className="w-3.5 h-3.5 text-zinc-100" aria-hidden="true" />
            </div>
            <div>
              <span className="font-display font-bold text-xs sm:text-sm tracking-widest text-zinc-950 uppercase">
                KINETIC BIOMECHANICS
              </span>
            </div>
          </button>

          {/* Breadcrumb Navigation Trail */}
          <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5 pl-3 border-l border-zinc-200 text-xs font-medium text-zinc-500">
            <button
              type="button"
              onClick={goHome}
              aria-current={currentView === 'home' ? 'page' : undefined}
              className={`hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer rounded px-1.5 py-0.5 ${
                currentView === 'home' ? 'text-zinc-950 font-semibold' : ''
              }`}
            >
              <Home className="w-3 h-3" aria-hidden="true" />
              <span>Inicio</span>
            </button>

            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => goToCategory(activeCategory)}
                  aria-current={currentView === 'category' ? 'page' : undefined}
                  className={`hover:text-zinc-950 transition-colors cursor-pointer rounded px-1.5 py-0.5 ${
                    currentView === 'category' ? 'text-zinc-950 font-semibold' : ''
                  }`}
                >
                  {activeCategory === 'routines' ? 'Rutinas' : 'Calculadoras'}
                </button>
              </>
            )}

            {currentView === 'tool' && activeTool && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-400" aria-hidden="true" />
                <span className="text-zinc-950 font-semibold px-1.5 py-0.5 truncate max-w-[180px] sm:max-w-none" aria-current="page">
                  {activeTool === 'hypertrophy'
                    ? 'Hipertrofia & Fuerza'
                    : activeTool === 'cardio'
                    ? 'Cardio & Resistencia'
                    : 'Calculadora'}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Right side: only reset/new action when inside active tool */}
        <div className="flex items-center gap-2">
          {currentView === 'tool' && hasActivePlan && (
            <button
              type="button"
              onClick={handleResetCurrent}
              aria-label="Reiniciar protocolo actual"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
