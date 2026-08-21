import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles, RotateCcw } from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import {
  TrainingGoal,
  ExperienceLevel,
  EquipmentPreference,
  MuscleGroupId
} from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import { InteractiveBodyMap } from '../BodySelector/InteractiveBodyMap';

interface OptionItem<T> {
  key: string;
  value: T;
  title: string;
  description: string;
}

export const SingleQuestionFlow: React.FC = () => {
  const {
    currentQuestion,
    goal,
    experience,
    daysPerWeek,
    equipment,
    selectedMuscles,
    setGoal,
    setExperience,
    setDaysPerWeek,
    setEquipment,
    toggleMuscle,
    setSelectedMuscles,
    nextQuestion,
    prevQuestion
  } = useRoutineStore();

  const [activePreset, setActivePreset] = useState<string>('balance');

  // 1. Goal Options
  const goalOptions: OptionItem<TrainingGoal>[] = [
    {
      key: '1',
      value: 'hipertrofia',
      title: 'Hipertrofia & Desarrollo Muscular',
      description: 'Maximización de la tensión mecánica, volumen adaptativo y estímulo de crecimiento.'
    },
    {
      key: '2',
      value: 'fuerza',
      title: 'Fuerza & Rendimiento Neural',
      description: 'Enfoque en sobrecarga progresiva en levantamientos multiarticulares y potencia.'
    },
    {
      key: '3',
      value: 'recomposicion',
      title: 'Recomposición Corporal',
      description: 'Equilibrio entre preservación de masa muscular magra y eficiencia metabólica.'
    },
    {
      key: '4',
      value: 'longevidad',
      title: 'Salud Articular & Longevidad',
      description: 'Control motor, rango de movimiento completo, estabilidad del core y prevención de lesiones.'
    }
  ];

  // 2. Experience Options
  const experienceOptions: OptionItem<ExperienceLevel>[] = [
    {
      key: '1',
      value: 'novato',
      title: 'Principiante (< 1 año)',
      description: 'Adaptación neuromuscular, consolidación del patrón de movimiento y progresión lineal.'
    },
    {
      key: '2',
      value: 'intermedio',
      title: 'Intermedio (1 a 3 años)',
      description: 'Técnica consolidada, aplicación de sobrecarga progresiva y gestión de fatiga.'
    },
    {
      key: '3',
      value: 'avanzado',
      title: 'Avanzado (> 3 años)',
      description: 'Dominio de autoregulación, cercanía al fallo técnico (RIR 0-1) y alto volumen adaptativo.'
    }
  ];

  // 3. Days Options
  const daysOptions: OptionItem<number>[] = [
    {
      key: '1',
      value: 2,
      title: '2 Días / Semana',
      description: 'División Full Body A / B de máxima eficiencia de tiempo.'
    },
    {
      key: '2',
      value: 3,
      title: '3 Días / Semana',
      description: 'División Push / Pull / Legs o Full Body 3x balanceada.'
    },
    {
      key: '3',
      value: 4,
      title: '4 Días / Semana',
      description: 'División Torso / Pierna · Ratio óptimo de recuperación e hipertrofia.'
    },
    {
      key: '4',
      value: 5,
      title: '5 Días / Semana',
      description: 'División Push / Pull / Legs + Torso / Pierna de alta frecuencia.'
    },
    {
      key: '5',
      value: 6,
      title: '6 Días / Semana',
      description: 'División Push / Pull / Legs x 2 · Volumen elevado para máxima frecuencia.'
    }
  ];

  // 4. Equipment Options
  const equipmentOptions: OptionItem<EquipmentPreference>[] = [
    {
      key: '1',
      value: 'commercial',
      title: 'Gimnasio Comercial Completo',
      description: 'Acceso a barras olímpicas, mancuernas, poleas ajustables y maquinaria de aislamiento guiada.'
    },
    {
      key: '2',
      value: 'home',
      title: 'Gimnasio en Casa / Mancuernas & Peso Libre',
      description: 'Mancuernas ajustables, banco regulable, barra de dominadas y ejercicios en autocarga.'
    }
  ];

  const presets = [
    {
      id: 'balance',
      name: 'Cuerpo Completo (Balance)',
      muscles: ['chest', 'back_upper', 'back_lower', 'shoulders', 'quads', 'glutes', 'hamstrings', 'biceps', 'triceps', 'core', 'calves'] as MuscleGroupId[]
    },
    {
      id: 'upper',
      name: 'Torso Superior',
      muscles: ['chest', 'back_upper', 'shoulders', 'biceps', 'triceps'] as MuscleGroupId[]
    },
    {
      id: 'lower',
      name: 'Tren Inferior & Glúteos',
      muscles: ['quads', 'glutes', 'hamstrings', 'calves'] as MuscleGroupId[]
    },
    {
      id: 'push_pull',
      name: 'Empuje & Tracción',
      muscles: ['chest', 'back_upper', 'shoulders', 'biceps', 'triceps', 'back_lower'] as MuscleGroupId[]
    },
    {
      id: 'posterior_chain',
      name: 'Cadena Posterior & Core',
      muscles: ['back_upper', 'back_lower', 'glutes', 'hamstrings', 'core'] as MuscleGroupId[]
    }
  ];

  const allMuscleGroups: MuscleGroupId[] = [
    'chest',
    'back_upper',
    'back_lower',
    'shoulders',
    'quads',
    'glutes',
    'hamstrings',
    'biceps',
    'triceps',
    'core',
    'calves'
  ];

  const applyPreset = (presetId: string, muscles: MuscleGroupId[]) => {
    setActivePreset(presetId);
    setSelectedMuscles(muscles);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        if (currentQuestion > 0) {
          prevQuestion();
        }
        return;
      }

      if (e.key === 'Enter') {
        nextQuestion();
        return;
      }

      const num = parseInt(e.key, 10);
      if (isNaN(num)) return;

      if (currentQuestion === 0) {
        const opt = goalOptions[num - 1];
        if (opt) {
          setGoal(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 1) {
        const opt = experienceOptions[num - 1];
        if (opt) {
          setExperience(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 2) {
        const opt = daysOptions[num - 1];
        if (opt) {
          setDaysPerWeek(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      } else if (currentQuestion === 3) {
        const opt = equipmentOptions[num - 1];
        if (opt) {
          setEquipment(opt.value);
          setTimeout(() => nextQuestion(), 160);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, goal, experience, daysPerWeek, equipment]);

  // Render question content
  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return {
          meta: '01 / 05 · OBJETIVO',
          title: '¿Cuál es el objetivo principal del protocolo?',
          subtitle: 'Define la curva de intensidad, los tiempos de descanso intra-serie y el enfoque de sobrecarga.',
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

      case 1:
        return {
          meta: '02 / 05 · NIVEL DE EXPERIENCIA',
          title: '¿Cuál es tu nivel de experiencia en levantamiento de pesas?',
          subtitle: 'Calibra el volumen efectivo de series semanales, la proximidad al fallo (RIR) y la tasa de recuperación.',
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

      case 2:
        return {
          meta: '03 / 05 · FRECUENCIA SEMANAL',
          title: '¿Cuántos días por semana dispones para entrenar?',
          subtitle: 'Determina la arquitectura de división (Full Body, Torso/Pierna o Push/Pull/Legs).',
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

      case 3:
        return {
          meta: '04 / 05 · ENTORNO & EQUIPAMIENTO',
          title: '¿Qué equipamiento tienes disponible para entrenar?',
          subtitle: 'Filtra la selección de ejercicios biomecánicamente equivalentes según tus herramientas.',
          content: (
            <div className="grid grid-cols-1 gap-2.5 w-full">
              {equipmentOptions.map((opt) => {
                const isSelected = equipment === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setEquipment(opt.value);
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
          meta: '05 / 05 · ENFOQUE ANATÓMICO & GRUPOS MUSCULARES',
          title: 'Selecciona los grupos musculares objetivo en el cuerpo o elige un preset',
          subtitle: 'Pulsa directamente sobre el cuerpo anatómico para añadir o quitar músculos, o selecciona una distribución rápida.',
          content: (
            <div className="space-y-6 w-full">
              {/* Presets Bar */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                  Opciones Preestablecidas Rápidas:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {presets.map((preset) => {
                    const isPresetActive =
                      activePreset === preset.id &&
                      preset.muscles.length === selectedMuscles.length &&
                      preset.muscles.every((m) => selectedMuscles.includes(m));

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset.id, preset.muscles)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isPresetActive
                            ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => applyPreset('none', [])}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpiar</span>
                  </button>
                </div>
              </div>

              {/* Interactive Anatomical Body Map Component */}
              <InteractiveBodyMap
                selectedMuscles={selectedMuscles}
                onToggleMuscle={(m) => {
                  setActivePreset('custom');
                  toggleMuscle(m);
                }}
              />

              {/* Muscle Chips Filter / Toggle */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block">
                  Selector por Etiquetas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allMuscleGroups.map((muscle) => {
                    const isChecked = selectedMuscles.includes(muscle);
                    return (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => {
                          setActivePreset('custom');
                          toggleMuscle(muscle);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                        }`}
                      >
                        <span>{MUSCLE_LABELS_ES[muscle]}</span>
                        {isChecked && <Check className="w-3 h-3 text-zinc-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        };
    }
  };

  const currentData = renderQuestion();

  return (
    <div className={`w-full ${currentQuestion === 4 ? 'max-w-3xl' : 'max-w-2xl'} mx-auto px-4 py-8 md:py-12 flex flex-col justify-center min-h-[calc(100vh-140px)] transition-all`}>
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
                <span>{currentQuestion === 4 ? 'Generar Protocolo' : 'Continuar'}</span>
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
