import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Dumbbell } from 'lucide-react';
import { Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import rawExercises from '../../data/exercises.json';

const allExercises = rawExercises as Exercise[];

interface ExerciseSwapModalProps {
  currentExercise: Exercise | null;
  dayNumber: number;
  instanceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectReplacement: (dayNumber: number, instanceId: string, newExerciseId: string) => void;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  currentExercise,
  dayNumber,
  instanceId,
  isOpen,
  onClose,
  onSelectReplacement
}) => {
  if (!isOpen || !currentExercise) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');

  // Filter exercises by same muscle group or search term
  const candidates = allExercises.filter(ex => {
    if (ex.id === currentExercise.id) return false;

    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMuscle =
      ex.muscleGroup === currentExercise.muscleGroup ||
      (ex.secondaryMuscles && ex.secondaryMuscles.includes(currentExercise.muscleGroup));

    const matchesEquipment =
      filterEquipment === 'all' ||
      (filterEquipment === 'home' && (ex.equipment === 'home' || ex.equipment === 'both' || ex.equipment === 'bodyweight')) ||
      (filterEquipment === 'commercial' && (ex.equipment === 'commercial' || ex.equipment === 'both'));

    if (searchTerm.trim().length > 0) {
      return matchesSearch && matchesEquipment;
    }

    return matchesMuscle && matchesEquipment;
  });

  const handleConfirm = (newExId: string) => {
    onSelectReplacement(dayNumber, instanceId, newExId);
    onClose();
  };

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
          className="relative w-full max-w-3xl bg-white rounded-2xl border border-zinc-200/90 shadow-elevated z-10 overflow-hidden my-8 max-h-[88vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 bg-[#fcfcfd] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                Sustitución Personalizada de Ejercicio
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                Cambiar: {currentExercise.name}
              </h2>
              <p className="text-xs text-zinc-500">
                Selecciona una alternativa compatible por grupo muscular ({MUSCLE_LABELS_ES[currentExercise.muscleGroup] || currentExercise.muscleGroup}) o busca en toda la base biomecánica.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-zinc-100 bg-white flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre (ej. Press mancuernas, Sentadilla, Remo...)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder:text-zinc-400"
              />
            </div>

            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200/70 shrink-0 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setFilterEquipment('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  filterEquipment === 'all' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterEquipment('home')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  filterEquipment === 'home' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                Peso Libre
              </button>
              <button
                type="button"
                onClick={() => setFilterEquipment('commercial')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                  filterEquipment === 'commercial' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                Máquinas / Poleas
              </button>
            </div>
          </div>

          {/* List of Candidates */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-2.5">
            {candidates.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs font-mono">
                No se encontraron ejercicios con ese criterio de búsqueda.
              </div>
            ) : (
              candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-3.5 rounded-xl border border-zinc-200/90 bg-white hover:border-zinc-400 hover:bg-zinc-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail if GIF available */}
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {cand.gifUrl ? (
                        <img src={cand.gifUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-zinc-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-zinc-900">
                          {cand.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                          Tier {cand.tier} · {cand.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {cand.subtitle}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-400 block pt-1">
                        Músculo: {MUSCLE_LABELS_ES[cand.muscleGroup] || cand.muscleGroup}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleConfirm(cand.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-zinc-300" />
                      <span>Seleccionar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
            <span>{candidates.length} alternativas disponibles</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-200/80 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
