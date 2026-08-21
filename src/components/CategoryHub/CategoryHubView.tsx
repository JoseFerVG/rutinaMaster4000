import React from 'react';
import { ArrowLeft, ArrowRight, Dumbbell, Heart, Calculator, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useCardioStore } from '../../store/useCardioStore';

export const CategoryHubView: React.FC = () => {
  const { activeCategory, goToTool, goHome } = useAppStore();
  const { activeRoutine } = useRoutineStore();
  const { activeCardioRoutine } = useCardioStore();

  if (activeCategory === 'calculators') {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8 animate-fadeIn">
        {/* Back navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Categorías</span>
          </button>

          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
              CATEGORÍA 02 · CÁLCULO CINEMÁTICO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Calculadoras Biomecánicas & Fisiológicas
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
              Selecciona una herramienta cuantitativa para prescripción de cargas efectivas y estimación de gasto metabólico.
            </p>
          </div>
        </div>

        {/* Tools List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              id: '1rm',
              name: 'Estimador de 1RM & Cargas de Trabajo',
              desc: 'Cálculo de repetición máxima mediante fórmulas Epley, Brzycki y Lander con percentiles de RPE/RIR.',
              status: 'Próximamente'
            },
            {
              id: 'hr_zones',
              name: 'Calculadora de Zonas Cardíacas (Karvonen)',
              desc: 'Determinación de Z1 a Z5 basada en frecuencia cardíaca de reserva y umbral de lactato.',
              status: 'Próximamente'
            },
            {
              id: 'volume_landmarks',
              name: 'Hitos de Volumen Semanal (MEV / MAV / MRV)',
              desc: 'Estimación de volumen de mantenimiento, mínimo efectivo y máximo recuperable por grupo muscular.',
              status: 'Próximamente'
            },
            {
              id: 'tdee',
              name: 'Gasto Energético & Partición de Macronutrientes',
              desc: 'Balance calórico metabólico y ratios de carbohidratos/proteínas para recomposición corporal.',
              status: 'Próximamente'
            }
          ].map((calc) => (
            <div
              key={calc.id}
              className="p-5 rounded-2xl border border-zinc-200/90 bg-white shadow-subtle space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 font-medium">
                  {calc.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">{calc.name}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{calc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Category: 'routines' (Arquitectura de Rutinas & Protocolos)
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8 animate-fadeIn">
      {/* Back navigation & Header */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Categorías Principales</span>
        </button>

        <div className="space-y-1">
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
            CATEGORÍA 01 · GENERADORES DE ENTRENAMIENTO
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Arquitectura de Rutinas & Protocolos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Elige qué tipo de plan deseas diseñar. Puedes personalizar ejercicios principales o secundarios y exportar el resultado a Excel, PDF, Markdown o Calendario.
          </p>
        </div>
      </div>

      {/* Routine Tools Grid (Hipertrofia vs Cardio) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Hipertrofia & Fuerza */}
        <div
          onClick={() => goToTool('hypertrophy', 'routines')}
          className="group cursor-pointer bg-white border border-zinc-200/90 hover:border-zinc-950/70 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                {activeRoutine ? 'Plan Guardado' : 'Herramienta Activa'}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-zinc-950 group-hover:text-zinc-800 transition-colors">
                Protocolos de Hipertrofia & Fuerza
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Diseño de mesociclos para ganancia de masa muscular y fuerza con mapa anatómico interactivo HD, sustitución de ejercicios y exportación avanzada.
              </p>
            </div>

            {/* Highlights List */}
            <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Mapa anatómico vectorial frontal y dorsal con presets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Sustitución de secundarios & alternativas en peso libre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Animaciones GIF de técnica (ExerciseGymGifsDB)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Exportación a Excel (.xlsx), PDF A4, Markdown e iCal (.ics)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-950">
            <span>{activeRoutine ? 'Ver o Modificar Protocolo' : 'Iniciar Creador de Hipertrofia'}</span>
            <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tool 2: Cardio & Resistencia */}
        <div
          onClick={() => goToTool('cardio', 'routines')}
          className="group cursor-pointer bg-white border border-zinc-200/90 hover:border-zinc-950/70 rounded-2xl p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                {activeCardioRoutine ? 'Plan Guardado' : 'Herramienta Activa'}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-zinc-950 group-hover:text-zinc-800 transition-colors">
                Planificador de Cardio & Resistencia
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Periodización fisiológica en zonas cardíacas (Z1-Z5), intervalos fraccionados de VO2 Máx, capacidad oxidativa mitocondrial y cardio concurrente.
              </p>
            </div>

            {/* Highlights List */}
            <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>6 Modalidades: Running, Ciclismo, Remo, Natación, HIIT, Concurrente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Tabla de Zonas Cardíacas Karvonen / Coggan (Z1 a Z5)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Fases de Calentamiento, Intervalos de trabajo y Enfriamiento</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                <span>Exportación a Excel (.xlsx) estructurado e Impresión</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-950">
            <span>{activeCardioRoutine ? 'Ver o Modificar Plan de Cardio' : 'Iniciar Planificador de Cardio'}</span>
            <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
