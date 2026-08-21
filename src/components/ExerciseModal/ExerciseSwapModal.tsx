import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Dumbbell, Shield, Sparkles, Star } from 'lucide-react';
import { Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import rawExercises from '../../data/exercises.json';

const allExercises = rawExercises as Exercise[];

interface ExerciseSwapModalProps {
  currentExercise: Exercise | null;
  dayNumber: number;
  instanceId: string;
  isOpen: boolean;
  mode?: 'main' | 'alternative';
  onClose: () => void;
  onSelectReplacement: (dayNumber: number, instanceId: string, newExerciseId: string, mode?: 'main' | 'alternative') => void;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  currentExercise,
  dayNumber,
  instanceId,
  isOpen,
  mode = 'main',
  onClose,
  onSelectReplacement
}) => {
  if (!isOpen || !currentExercise) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');

  const isAltMode = mode === 'alternative';

  // Calculate Top 3 Recommended specifically for currentExercise
  const topRecommended = useMemo(() => {
    if (!currentExercise) return [];

    const scored: { exercise: Exercise; score: number }[] = [];

    allExercises.forEach(ex => {
      if (ex.id === currentExercise.id) return;

      let score = 0;

      // 1. Direct equivalent match
      if (currentExercise.directEquivalents?.includes(ex.id)) {
        score += 60;
      }

      // 2. Free weight equivalent match
      if (currentExercise.freeWeightEquivalents?.includes(ex.id)) {
        score += 40;
      }

      // 3. Same movement pattern
      if (ex.movementPattern === currentExercise.movementPattern) {
        score += 30;
      }

      // 4. Same primary muscle group
      if (ex.muscleGroup === currentExercise.muscleGroup) {
        score += 25;
      }

      // 5. Same mechanics (compound vs isolation)
      if (ex.mechanics === currentExercise.mechanics) {
        score += 15;
      }

      // 6. Same Tier
      if (ex.tier === currentExercise.tier) {
        score += 10;
      }

      if (score > 0) {
        scored.push({ exercise: ex, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.exercise);
  }, [currentExercise]);

  const topRecommendedIds = useMemo(() => new Set(topRecommended.map(e => e.id)), [topRecommended]);

  // Filter remaining exercises by search & category
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
    onSelectReplacement(dayNumber, instanceId, newExId, mode);
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
          className="relative w-full max-w-3xl bg-white rounded-2xl border border-zinc-200/90 shadow-elevated z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 bg-[#fcfcfd] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {isAltMode ? <Shield className="w-3.5 h-3.5 text-zinc-600" /> : <Sparkles className="w-3.5 h-3.5 text-zinc-600" />}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {isAltMode ? 'Configuración de Plan B / Alternativa de Respaldo' : 'Sustitución de Ejercicio Principal'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950">
                {isAltMode ? `Elegir Alternativa para: ${currentExercise.name}` : `Cambiar: ${currentExercise.name}`}
              </h2>
              <p className="text-xs text-zinc-500">
                {isAltMode
                  ? `Selecciona el ejercicio de respaldo en caso de que la máquina principal esté ocupada (${MUSCLE_LABELS_ES[currentExercise.muscleGroup] || currentExercise.muscleGroup}).`
                  : `Selecciona una alternativa por grupo muscular (${MUSCLE_LABELS_ES[currentExercise.muscleGroup] || currentExercise.muscleGroup}) o explora el catálogo completo.`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
            {/* 🌟 TOP 3 RECOMENDADOS BIOMECÁNICAMENTE */}
            {topRecommended.length > 0 && (
              <div className="space-y-3 bg-zinc-50/80 border border-zinc-200/90 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-mono">
                      TOP 3 RECOMENDADOS (Misma Biomecánica & Patrón Motor)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Calculado por vector de fuerza
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topRecommended.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className="bg-white border border-zinc-200/90 rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-zinc-950 transition-all shadow-xs group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-zinc-950 text-white">
                            #{idx + 1} Recomendado
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase">
                            Tier {rec.tier}
                          </span>
                        </div>

                        {/* Thumbnail */}
                        <div className="w-full h-24 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
                          {rec.gifUrl ? (
                            <img src={rec.gifUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Dumbbell className="w-6 h-6 text-zinc-400" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-zinc-900 group-hover:text-zinc-700 leading-tight">
                            {rec.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
                            {rec.subtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfirm(rec.id)}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3 text-zinc-300" />
                        <span>{isAltMode ? 'Asignar como Plan B' : 'Seleccionar'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Catálogo Completo y Filtros */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono">
                  Todas las Alternativas ({candidates.length})
                </span>

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

              {/* Search Bar */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en toda la base por nombre (ej. Press mancuernas, Sentadilla hack...)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 text-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              {/* List of Remaining Candidates */}
              <div className="space-y-2.5 pt-2">
                {candidates.length === 0 ? (
                  <div className="py-8 text-center text-zinc-400 text-xs font-mono">
                    No se encontraron ejercicios adicionales con ese criterio de búsqueda.
                  </div>
                ) : (
                  candidates.map((cand) => {
                    const isTop = topRecommendedIds.has(cand.id);
                    return (
                      <div
                        key={cand.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                          isTop
                            ? 'bg-zinc-50/50 border-zinc-300'
                            : 'bg-white border-zinc-200/90 hover:border-zinc-400 hover:bg-zinc-50/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
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
                              {isTop && (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-900 text-white font-bold">
                                  Top Recomendado
                                </span>
                              )}
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                                Tier {cand.tier} · {cand.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {cand.subtitle}
                            </p>
                            <span className="text-[10px] font-mono text-zinc-400 block pt-1">
                              Músculo: {MUSCLE_LABELS_ES[cand.muscleGroup] || cand.muscleGroup} · {cand.equipment === 'commercial' ? 'Máquina/Polea' : 'Mancuerna/Barra'}
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
                            <span>{isAltMode ? 'Asignar como Plan B' : 'Seleccionar'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
            <span>{candidates.length} alternativas disponibles</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-200/80 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
