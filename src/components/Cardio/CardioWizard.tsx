import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useCardioStore } from '../../store/useCardioStore';
import {
  CardioModality,
  CardioGoal,
  CardioExperience
} from '../../types/cardio';

interface OptionItem<T> {
  key: string;
  value: T;
  title: string;
  description: string;
}

export const CardioWizard: React.FC = () => {
  const {
    currentQuestion,
    modality,
    goal,
    experience,
    daysPerWeek,
    sessionDuration,
    setModality,
    setGoal,
    setExperience,
    setDaysPerWeek,
    setSessionDuration,
    nextQuestion,
    prevQuestion
  } = useCardioStore();

  // 1. Modality Options
  const modalityOptions: OptionItem<CardioModality>[] = [
    {
      key: '1',
      value: 'running',
      title: 'Running / Carrera a Pie',
      description: 'Entrenamiento de impacto sobre asfalto, pista o cinta con control de cadencia y zancada.'
    },
    {
      key: '2',
      value: 'cycling',
      title: 'Ciclismo / Rodillo Indoor',
      description: 'Bajo impacto articular con control estricto de potencia en watios, cadencia (RPM) y zonas cardíacas.'
    },
    {
      key: '3',
      value: 'rowing',
      title: 'Remo Indoor (Ergómetro Concept2)',
      description: 'Reclutamiento de cuerpo completo (85% de la masa muscular) y alta demanda cardiovascular.'
    },
    {
      key: '4',
      value: 'swimming',
      title: 'Natación',
      description: 'Resistencia sin gravedad, respiración pautada y desarrollo de capacidad pulmonar y tronco superior.'
    },
    {
      key: '5',
      value: 'hiit_erg',
      title: 'HIIT / Assault Bike & SkiErg',
      description: 'Potencia metabólica anaeróbica, resistencia al lactato y acondicionamiento fraccionado de alta intensidad.'
    },
    {
      key: '6',
      value: 'hybrid_concurrent',
      title: 'Cardio Concurrente Híbrido',
      description: 'Protocolo de mínima interferencia con el entrenamiento de hipertrofia y fuerza máxima.'
    }
  ];

  // 2. Goal Options
  const goalOptions: OptionItem<CardioGoal>[] = [
    {
      key: '1',
      value: 'zone2_base',
      title: 'Base Aeróbica & Zona 2 (FatMax)',
      description: 'Biogénesis mitocondrial, densidad capilar, salud cardiometabólica y eficiencia oxidativa de grasas.'
    },
    {
      key: '2',
      value: 'vo2max',
      title: 'Potencia Aeróbica Máxima & VO2 Máx',
      description: 'Intervalos fraccionados para elevar el techo aeróbico, volumen sistólico y reciclaje de lactato.'
    },
    {
      key: '3',
      value: 'fat_loss_concurrent',
      title: 'Pérdida de Grasa & Mínima Interferencia',
      description: 'Gasto energético elevado preservando el tejido muscular sin fatiga neuromuscular excesiva.'
    },
    {
      key: '4',
      value: 'anaerobic_power',
      title: 'Potencia Glucolítica & Sprints (SIT/HIIT)',
      description: 'Series cortas de esfuerzo máximo para reclutamiento de fibras rápidas y capacidad anaeróbica.'
    },
    {
      key: '5',
      value: 'race_preparation',
      title: 'Rendimiento & Preparación de Prueba',
      description: 'Periodización estructurada para 5K, 10K, Media Maratón o eventos de fondo.'
    }
  ];

  // 3. Experience Options
  const experienceOptions: OptionItem<CardioExperience>[] = [
    {
      key: '1',
      value: 'principiante',
      title: 'Principiante / Base Inicial',
      description: 'Construcción de tolerancia aeróbica inicial y acondicionamiento musculoesquelético gradual.'
    },
    {
      key: '2',
      value: 'intermedio',
      title: 'Intermedio / Regular',
      description: 'Experiencia con entrenamientos estructurados por zonas, tempo e intervalos fraccionados.'
    },
    {
      key: '3',
      value: 'avanzado',
      title: 'Avanzado / Competitivo',
      description: 'Capacidad de sostener altos volúmenes, polarización 80/20 y trabajo en umbral anaeróbico profundo.'
    }
  ];

  // 4. Days Options
  const daysOptions: OptionItem<number>[] = [
    {
      key: '1',
      value: 2,
      title: '2 Sesiones / Semana',
      description: 'Frecuencia complementaria ideal para mantener salud cardiovascular junto a fuerza.'
    },
    {
      key: '2',
      value: 3,
      title: '3 Sesiones / Semana',
      description: 'Frecuencia óptima equilibrada (1 sesión de Z2, 1 de intervalos y 1 de tempo).'
    },
    {
      key: '3',
      value: 4,
      title: '4 Sesiones / Semana',
      description: 'Periodización polarizada con desarrollo marcado de capacidad aeróbica y recuperación.'
    },
    {
      key: '4',
      value: 5,
      title: '5 Sesiones / Semana',
      description: 'Volumen elevado para atletas de resistencia y objetivos competitivos.'
    }
  ];

  // 5. Session Duration Options
  const durationOptions: OptionItem<number>[] = [
    {
      key: '1',
      value: 30,
      title: '30 Minutos (Micro-Sesión / HIIT)',
      description: 'Sesión concentrada de alta densidad y eficiencia de tiempo.'
    },
    {
      key: '2',
      value: 45,
      title: '45 Minutos (Estándar Aeróbico)',
      description: 'Duración óptima para el estímulo mitocondrial en Zona 2 e intervalos 4x4.'
    },
    {
      key: '3',
      value: 60,
      title: '60 Minutos (Volumen Extendido)',
      description: 'Sesión completa para adaptaciones estructurales de capilarización y umbral.'
    },
    {
      key: '4',
      value: 90,
      title: '75 - 90 Minutos (Tirada Larga / LSD)',
      description: 'Desarrollo de resistencia prolongada y ahorro de glucógeno para pruebas de fondo.'
    }
  ];

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        if (currentQuestion > 0) prevQuestion();
        return;
      }

      if (e.key === 'Enter') {
        nextQuestion();
        return;
      }

      const num = parseInt(e.key, 10);
      if (isNaN(num)) return;

      if (currentQuestion === 0) {
        const opt = modalityOptions[num - 1];
        if (opt) {
          setModality(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 1) {
        const opt = goalOptions[num - 1];
        if (opt) {
          setGoal(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 2) {
        const opt = experienceOptions[num - 1];
        if (opt) {
          setExperience(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 3) {
        const opt = daysOptions[num - 1];
        if (opt) {
          setDaysPerWeek(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 4) {
        const opt = durationOptions[num - 1];
        if (opt) {
          setSessionDuration(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, modality, goal, experience, daysPerWeek, sessionDuration]);

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return {
          meta: '01 / 05 · DISCIPLINA & MODALIDAD',
          title: '¿Qué modalidad de cardio o resistencia deseas planificar?',
          subtitle: 'Define el patrón biomecánico, el impacto articular y los parámetros de intensidad específicos.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {modalityOptions.map((opt) => {
                const isSelected = modality === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setModality(opt.value);
                      setTimeout(() => nextQuestion(), 160);
                    }}
                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-subtle'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {opt.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-zinc-200 shrink-0" />}
                      </div>
                      <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        };

      case 1:
        return {
          meta: '02 / 05 · OBJETIVO FISIOLÓGICO',
          title: '¿Cuál es el objetivo fisiológico prioritario de este plan?',
          subtitle: 'Determina la periodización de zonas cardíacas (Z1 a Z5) y los ratios de trabajo e intervalos.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {goalOptions.map((opt) => {
                const isSelected = goal === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setGoal(opt.value);
                      setTimeout(() => nextQuestion(), 160);
                    }}
                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-subtle'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {opt.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-zinc-200 shrink-0" />}
                      </div>
                      <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        };

      case 2:
        return {
          meta: '03 / 05 · NIVEL DE RESISTENCIA',
          title: '¿Cuál es tu nivel de experiencia en entrenamiento cardiovascular?',
          subtitle: 'Ajusta la duración de las repeticiones en intervalos de alta intensidad y los tiempos de descanso activo.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {experienceOptions.map((opt) => {
                const isSelected = experience === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setExperience(opt.value);
                      setTimeout(() => nextQuestion(), 160);
                    }}
                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-subtle'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {opt.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-zinc-200 shrink-0" />}
                      </div>
                      <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        };

      case 3:
        return {
          meta: '04 / 05 · FRECUENCIA SEMANAL',
          title: '¿Cuántas sesiones semanales de cardio vas a realizar?',
          subtitle: 'Distribuye las sesiones de Zona 2, trabajo de umbral e intervalos según el modelo de periodización.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {daysOptions.map((opt) => {
                const isSelected = daysPerWeek === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setDaysPerWeek(opt.value);
                      setTimeout(() => nextQuestion(), 160);
                    }}
                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-subtle'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {opt.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-zinc-200 shrink-0" />}
                      </div>
                      <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        };

      case 4:
      default:
        return {
          meta: '05 / 05 · TIEMPO DISPONIBLE POR SESIÓN',
          title: '¿Cuánto tiempo aproximado tienes para cada sesión?',
          subtitle: 'Calcula la longitud del calentamiento, la densidad de los bloques de trabajo y el enfriamiento.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {durationOptions.map((opt) => {
                const isSelected = sessionDuration === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSessionDuration(opt.value);
                    }}
                    className={`group w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                        : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50/80 shadow-subtle'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded border transition-colors shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-zinc-800 bg-zinc-800 text-zinc-300'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-700'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm md:text-base font-semibold ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                          {opt.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-zinc-200 shrink-0" />}
                      </div>
                      <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        };
    }
  };

  const currentData = renderQuestion();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center min-h-[calc(100vh-140px)] transition-all">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 md:space-y-8"
        >
          {/* Header Tag & Question Title */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
              {currentData.meta}
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-zinc-950 leading-snug">
              {currentData.title}
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-xl">
              {currentData.subtitle}
            </p>
          </div>

          {/* Options Content */}
          <div className="w-full">
            {currentData.content}
          </div>

          {/* Navigation Controls & Keyboard Hints */}
          <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between gap-4">
            <div>
              {currentQuestion > 0 ? (
                <button
                  type="button"
                  onClick={prevQuestion}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <div className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                  Atajo: Teclas numéricas (1, 2, 3...)
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline-block">
                Presiona <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-600">Enter ↵</kbd>
              </span>
              <button
                type="button"
                onClick={nextQuestion}
                className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm transition-all flex items-center gap-2"
              >
                <span>{currentQuestion === 4 ? 'Generar Plan de Cardio' : 'Continuar'}</span>
                {currentQuestion === 4 ? (
                  <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
