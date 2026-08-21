import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Dumbbell, Sparkles } from 'lucide-react';
import { Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import rawExercises from '../../data/exercises.json';

const allExercises = rawExercises as Exercise[];

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose
}) => {
  if (!exercise) return null;

  const directEquivalentsList = (exercise.directEquivalents || [])
    .map(id => allExercises.find(e => e.id === id))
    .filter(Boolean) as Exercise[];

  const freeWeightEquivalentsList = (exercise.freeWeightEquivalents || [])
    .map(id => allExercises.find(e => e.id === id))
    .filter(Boolean) as Exercise[];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-2xl border border-zinc-200/90 shadow-elevated z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-zinc-100 bg-[#fcfcfd]">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-900 text-white">
                  Tier {exercise.tier} · {exercise.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 font-medium">
                  {MUSCLE_LABELS_ES[exercise.muscleGroup] || exercise.muscleGroup}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                {exercise.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                {exercise.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body with Scroll */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: GIF from ExerciseGymGifsDB */}
              <div className="space-y-3">
                <div className="aspect-square w-full rounded-xl bg-zinc-50 border border-zinc-200/80 overflow-hidden flex items-center justify-center relative group">
                  {exercise.gifUrl ? (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                      <Dumbbell className="w-8 h-8" />
                      <span className="text-xs font-mono">Sin animación disponible</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 text-[9px] font-mono text-zinc-400 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-zinc-200">
                    Kinetic · Local HD
                  </div>
                </div>

                {/* Muscles Involved Breakdown */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    Mapa Muscular Implicado:
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-900">Motor Primario:</span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white font-medium text-[11px]">
                        {MUSCLE_LABELS_ES[exercise.muscleGroup] || exercise.muscleGroup}
                      </span>
                    </div>
                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/50">
                        <span className="text-zinc-600">Sinergistas:</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {exercise.secondaryMuscles.map(m => (
                            <span key={m} className="px-1.5 py-0.2 rounded bg-zinc-200/80 text-zinc-700 text-[10px] font-medium">
                              {MUSCLE_LABELS_ES[m] || m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Execution Instructions & Coaching Cues */}
              <div className="space-y-4">
                {/* Coaching Biomechanical Cue */}
                {exercise.coachingCue && (
                  <div className="p-4 rounded-xl bg-zinc-950 text-white space-y-1.5 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Indicación Biomecánica Clave:</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {exercise.coachingCue}
                    </p>
                  </div>
                )}

                {/* Step-by-Step Instructions */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Guía Técnica Paso a Paso:</span>
                  </h3>
                  <div className="space-y-2">
                    {(exercise.instructions || [
                      'Adopta la postura inicial asegurando la alineación articular correcta.',
                      'Inicia la fase concéntrica manteniendo la tensión continua en el músculo objetivo.',
                      'Controla la fase excéntrica en 2 a 3 segundos en rango completo.',
                      'Mantén la respiración diafragmática coordinada durante cada repetición.'
                    ]).map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-relaxed bg-zinc-50/70 p-2.5 rounded-lg border border-zinc-100">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 shrink-0 mt-0.5">
                          0{sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct & Free Weight Alternatives */}
                {(directEquivalentsList.length > 0 || freeWeightEquivalentsList.length > 0) && (
                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                      Alternativas Biomecánicas Disponibles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[...directEquivalentsList, ...freeWeightEquivalentsList]
                        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                        .slice(0, 4)
                        .map(alt => (
                          <span
                            key={alt.id}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700"
                          >
                            {alt.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white transition-colors"
            >
              Entendido / Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
