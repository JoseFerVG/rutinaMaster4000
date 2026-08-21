import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Heart,
  CheckCircle2,
  Activity,
  Moon,
  Flame,
  Coffee,
  Droplets,
  Scale,
  Pill,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAppStore, ToolId } from '../../store/useAppStore';
import { useRoutineStore } from '../../store/useRoutineStore';
import { useCardioStore } from '../../store/useCardioStore';

export const CategoryHubView: React.FC = () => {
  const { activeCategory, goToTool, goHome } = useAppStore();
  const { activeRoutine } = useRoutineStore();
  const { activeCardioRoutine } = useCardioStore();

  if (activeCategory === 'calculators') {
    const calculatorSections = [
      {
        sectionTitle: 'Recuperación & Fisiología',
        calculators: [
          {
            id: 'calc_readiness' as ToolId,
            name: 'Sobreentrenamiento & Readiness',
            desc: 'Índice de Hooper (1995) combinado con ratio de carga aguda:crónica (ACWR Gabbett).',
            icon: Activity,
            badge: 'Readiness'
          },
          {
            id: 'calc_sleep' as ToolId,
            name: 'Ciclos de Sueño & Ritmo Circadiano',
            desc: 'Ventanas óptimas de despertar basadas en ciclos ultradianos NREM-REM de 90 min y latencia.',
            icon: Moon,
            badge: 'Sueño 90m'
          },
          {
            id: 'calc_heart_rate' as ToolId,
            name: 'FC Máx & Zonas Karvonen',
            desc: 'Frecuencia cardíaca máxima (Tanaka & Gellish) y 5 zonas de intensidad por frecuencia de reserva.',
            icon: Heart,
            badge: 'Z1 - Z5'
          }
        ]
      },
      {
        sectionTitle: 'Biomecánica, Carga & Composición Corporal',
        calculators: [
          {
            id: 'calc_deadlift_1rm' as ToolId,
            name: '1RM - Peso Muerto',
            desc: 'Promedio ponderado Epley & Brzycki con prescripción de porcentajes relativos (60% al 95%).',
            icon: Dumbbell,
            badge: '1RM Ponderado'
          },
          {
            id: 'calc_bench_1rm' as ToolId,
            name: '1RM - Press de Banca',
            desc: 'Comparativa tripartita Epley, Brzycki y Wathan con desglose de zonas de fuerza e hipertrofia.',
            icon: Zap,
            badge: 'Zonas Fuerza'
          },
          {
            id: 'calc_skinfolds' as ToolId,
            name: 'Grasa Corporal por Pliegues Cutáneos',
            desc: 'Modelos Jackson-Pollock 3 y 7 pliegues con conversión por ecuaciones de Siri y Brozek.',
            icon: Scale,
            badge: 'Jackson-Pollock'
          }
        ]
      },
      {
        sectionTitle: 'Nutrición & Balance Energético',
        calculators: [
          {
            id: 'calc_macros' as ToolId,
            name: 'Calorías & Reparto de Macronutrientes',
            desc: 'BMR Mifflin-St Jeor / Katch-McArdle y partición de proteínas, grasas y carbohidratos (ISSN).',
            icon: Flame,
            badge: 'Mifflin / Macros'
          },
          {
            id: 'calc_tdee' as ToolId,
            name: 'Gasto Diario Desglosado (TDEE)',
            desc: 'Desglose fisiológico: TMB + TEF (10%) + NEAT (pasos) + EAT (horas de entrenamiento semanal).',
            icon: Sparkles,
            badge: 'BMR+NEAT+EAT'
          },
          {
            id: 'calc_water' as ToolId,
            name: 'Consumo de Agua & Hidratación',
            desc: 'Base de 35 ml/kg, tasa de sudoración por ejercicio y ajuste por clima y sodio (ACSM).',
            icon: Droplets,
            badge: 'ACSM Hidratación'
          }
        ]
      },
      {
        sectionTitle: 'Suplementación Basada en Evidencia',
        calculators: [
          {
            id: 'calc_caffeine' as ToolId,
            name: 'Dosis de Cafeína según Peso',
            desc: 'Rango ergogénico pre-entreno (3-6 mg/kg) y límite máximo de seguridad toxicológica (EFSA).',
            icon: Coffee,
            badge: 'ISSN / EFSA'
          },
          {
            id: 'calc_creatine' as ToolId,
            name: 'Creatina Monohidrato',
            desc: 'Protocolos de carga rápida (0.3 g/kg) vs mantenimiento continuo (0.07 g/kg) y co-ingesta.',
            icon: Pill,
            badge: 'ISSN Creatina'
          },
          {
            id: 'calc_magnesium' as ToolId,
            name: 'Magnesio & Comparador de Sales',
            desc: 'RDA elemental según sudoración y comparativa de biodisponibilidad: Bisglicinato, Citrato, Malato vs Óxido.',
            icon: ShieldCheck,
            badge: 'Sales Queladas'
          }
        ]
      }
    ];

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10 animate-fadeIn">
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
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-500 font-semibold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
              <span>SUITE DE 12 CALCULADORAS · 100% CIENTÍFICAS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Calculadoras Biomecánicas & Fisiológicas
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
              Modelos cuantitativos para prescripción de cargas efectivas, estimación energética, partición macronutricional y suplementación.
            </p>
          </div>
        </div>

        {/* 4 Categorized Sections with all 12 Calculators */}
        <div className="space-y-8">
          {calculatorSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pl-1">
                {section.sectionTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {section.calculators.map((calc) => {
                  const Icon = calc.icon;
                  return (
                    <div
                      key={calc.id}
                      onClick={() => goToTool(calc.id, 'calculators')}
                      className="group cursor-pointer bg-white border border-zinc-200/90 hover:border-zinc-950 rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-200 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                            {calc.badge}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-zinc-950 group-hover:text-zinc-800 transition-colors">
                            {calc.name}
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            {calc.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900 group-hover:text-zinc-600">
                        <span>Calcular</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
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
