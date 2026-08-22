import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Dumbbell, CheckSquare, Square } from 'lucide-react';
import { MuscleGroupId, Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import rawExercises from '../../data/exercises.json';
import { useRoutineStore } from '../../store/useRoutineStore';

const exercisesDb = rawExercises as Exercise[];

const ALL_MUSCLE_GROUPS: { id: MuscleGroupId; label: string }[] = [
  { id: 'chest', label: 'Pectoral / Pecho' },
  { id: 'back_upper', label: 'Espalda Alta & Dorsal' },
  { id: 'shoulders', label: 'Hombros / Deltoides' },
  { id: 'quads', label: 'Cuádriceps' },
  { id: 'hamstrings', label: 'Isquiosurales' },
  { id: 'glutes', label: 'Glúteos' },
  { id: 'biceps', label: 'Bíceps' },
  { id: 'triceps', label: 'Tríceps' },
  { id: 'core', label: 'Abdomen & Core' },
  { id: 'calves', label: 'Gemelos / Pantorrillas' },
  { id: 'back_lower', label: 'Espalda Baja / Lumbar' }
];

interface AddExercisesModalProps {
  isOpen: boolean;
  dayNumber: number;
  onClose: () => void;
}

export const AddExercisesModal: React.FC<AddExercisesModalProps> = ({
  isOpen,
  dayNumber,
  onClose
}) => {
  const { activeRoutine, addExercisesToDay } = useRoutineStore();

  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroupId>('chest');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [exerciseCount, setExerciseCount] = useState<number>(1);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const currentDay = useMemo(() => {
    return activeRoutine?.days.find(d => d.dayNumber === dayNumber);
  }, [activeRoutine, dayNumber]);

  const currentDayExerciseIds = useMemo(() => {
    return new Set(currentDay?.exercises.map(e => e.exerciseId) || []);
  }, [currentDay]);

  // Candidate exercises for selected muscle not yet in this day
  const availableCandidates = useMemo(() => {
    const list = exercisesDb.filter(ex =>
      (ex.muscleGroup === selectedMuscle || (ex.secondaryMuscles && ex.secondaryMuscles.includes(selectedMuscle))) &&
      !currentDayExerciseIds.has(ex.id)
    );

    list.sort((a, b) => {
      const aDirect = a.muscleGroup === selectedMuscle ? 2 : 1;
      const bDirect = b.muscleGroup === selectedMuscle ? 2 : 1;
      if (aDirect !== bDirect) return bDirect - aDirect;
      return a.tier - b.tier;
    });

    return list;
  }, [selectedMuscle, currentDayExerciseIds]);

  if (!isOpen || !currentDay) return null;

  const toggleManualExercise = (id: string) => {
    if (selectedExerciseIds.includes(id)) {
      setSelectedExerciseIds(selectedExerciseIds.filter(x => x !== id));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, id]);
    }
  };

  const handleConfirm = () => {
    if (mode === 'auto') {
      addExercisesToDay(dayNumber, selectedMuscle, exerciseCount);
    } else {
      if (selectedExerciseIds.length === 0) return;
      addExercisesToDay(dayNumber, selectedMuscle, selectedExerciseIds.length, selectedExerciseIds);
    }
    onClose();
    // Reset state
    setSelectedExerciseIds([]);
    setExerciseCount(1);
  };

  const totalToAdd = mode === 'auto' ? Math.min(exerciseCount, availableCandidates.length) : selectedExerciseIds.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-zinc-200/90 shadow-elevated z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 bg-[#fbfbfa] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-zinc-900" aria-hidden="true" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Ampliación de Volumen · Día 0{dayNumber}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                Añadir Ejercicios a la Sesión
              </h2>
              <p className="text-xs text-zinc-500">
                Selecciona el grupo muscular que deseas reforzar y añade tantos ejercicios como necesites.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
            {/* Step 1: Muscle Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                1. Selecciona el Grupo Muscular Objetivo:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_MUSCLE_GROUPS.map((m) => {
                  const isSelected = selectedMuscle === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMuscle(m.id);
                        setSelectedExerciseIds([]);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                          : 'bg-zinc-50/70 hover:bg-zinc-100/80 text-zinc-700 border-zinc-200/80'
                      }`}
                    >
                      <span className="truncate">{m.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Mode Selector (Auto vs Manual) */}
            <div className="space-y-3 pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                  2. Método de Asignación:
                </label>
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200/60">
                  <button
                    type="button"
                    onClick={() => setMode('auto')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'auto'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Automático
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      mode === 'manual'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Selección Manual
                  </button>
                </div>
              </div>

              {/* Mode Content */}
              {availableCandidates.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Ya tienes incluidos todos los ejercicios disponibles de este grupo muscular en el día de hoy.</span>
                </div>
              ) : mode === 'auto' ? (
                /* Auto Quantity Picker */
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">¿Cuántos ejercicios deseas añadir?</span>
                      <span className="text-[11px] text-zinc-500">
                        Disponibles para {MUSCLE_LABELS_ES[selectedMuscle]}: {availableCandidates.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].filter(num => num <= availableCandidates.length).map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setExerciseCount(num)}
                          className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                            exerciseCount === num
                              ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto Preview List */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200/60">
                    <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                      Ejercicios que se incorporarán:
                    </span>
                    {availableCandidates.slice(0, exerciseCount).map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-zinc-400">0{idx + 1}</span>
                          <span className="font-semibold text-zinc-900">{ex.name}</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                          {ex.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'} · Tier {ex.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Manual Selection List */
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {availableCandidates.map((ex) => {
                    const isChecked = selectedExerciseIds.includes(ex.id);
                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleManualExercise(ex.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                            : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
                          )}
                          <div>
                            <span className="text-xs font-bold block">{ex.name}</span>
                            <span className={`text-[11px] ${isChecked ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {ex.subtitle}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          isChecked ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                        }`}>
                          {ex.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-[#fbfbfa] flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-zinc-500">
              Total a incorporar: <strong className="text-zinc-900">{totalToAdd}</strong> ejercicio(s)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={totalToAdd === 0}
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  totalToAdd > 0
                    ? 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Añadir al Día 0{dayNumber}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
