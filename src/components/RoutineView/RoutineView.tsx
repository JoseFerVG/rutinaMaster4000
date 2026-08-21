import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  Edit3,
  Zap,
  Info,
  Dumbbell,
  MinusCircle,
  Clock,
  Play
} from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import rawExercises from '../../data/exercises.json';
import { Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import { ExerciseDetailModal } from '../ExerciseModal/ExerciseDetailModal';

const exercisesDb = rawExercises as Exercise[];

export const RoutineView: React.FC = () => {
  const {
    activeRoutine,
    activeDayTab,
    setActiveDayTab,
    replaceTemporary,
    replacePermanent,
    replaceWithFreeWeight,
    toggleOmitExercise,
    toggleSetCompleted,
    updateExerciseNotes,
    resetAll,
    showToast
  } = useRoutineStore();

  const [copied, setCopied] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);

  if (!activeRoutine) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">No hay protocolo activo</h2>
        <p className="text-sm text-zinc-500">Configura tus preferencias para generar un plan de entrenamiento biomecánico.</p>
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          Iniciar Configuración
        </button>
      </div>
    );
  }

  const currentDay = activeRoutine.days.find(d => d.dayNumber === activeDayTab) || activeRoutine.days[0];

  const handleCopyText = () => {
    let text = `=========================================\n`;
    text += `📋 ${activeRoutine.name}\n`;
    text += `${activeRoutine.subtitle}\n`;
    text += `Objetivo: ${activeRoutine.goal.toUpperCase()} | Nivel: ${activeRoutine.experience.toUpperCase()} | Duración: ${activeRoutine.sessionDuration || 60} MIN | Entorno: ${activeRoutine.equipment.toUpperCase()}\n`;
    text += `=========================================\n\n`;

    activeRoutine.days.forEach(day => {
      text += `📅 ${day.title}\n`;
      text += `🎯 ${day.subtitle}\n`;
      text += `-----------------------------------------\n`;
      day.exercises.forEach((exInst, idx) => {
        if (exInst.isOmitted) return;
        const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
        if (exMeta) {
          text += `${idx + 1}. ${exMeta.name}\n`;
          text += `   Series: ${exInst.sets} | Reps: ${exInst.reps} | Descanso: ${exInst.rest} | Intensidad: ${exInst.targetRir || 'RIR 1-2'}\n`;
          text += `   Guía técnica: ${exMeta.coachingCue}\n\n`;
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Protocolo Copiado', 'La rutina completa ha sido copiada a tu portapapeles.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Top Header Card */}
      <section className="bg-white border border-zinc-200/90 rounded-2xl p-6 md:p-8 shadow-card space-y-6 print:border-none print:p-0 print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {activeRoutine.goal.toUpperCase()}
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                Nivel {activeRoutine.experience}
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>{activeRoutine.sessionDuration || 60} min / sesión</span>
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                {activeRoutine.equipment === 'commercial' ? 'Gimnasio Comercial' : 'Gimnasio en Casa'}
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                {activeRoutine.daysPerWeek} Días / Sem
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
              {activeRoutine.name}
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-2xl">
              {activeRoutine.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 print:hidden">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={resetAll}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-white shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
              <span>Nuevo Plan</span>
            </button>
          </div>
        </div>

        {activeRoutine.summaryNote && (
          <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-600 leading-relaxed font-normal">
            {activeRoutine.summaryNote}
          </div>
        )}
      </section>

      {/* Day Selector Tabs */}
      <section className="space-y-4 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {activeRoutine.days.map((day) => {
            const isActive = day.dayNumber === activeDayTab;
            const activeExercisesCount = day.exercises.filter(e => !e.isOmitted).length;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayTab(day.dayNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60">0{day.dayNumber}</span>
                <span>{day.title.split('·')[1]?.trim() || day.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'}`}>
                  {activeExercisesCount} ex
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Day Section */}
      <section className="space-y-4">
        {/* Day Header Info */}
        <div className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-zinc-900">
              {currentDay.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {currentDay.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentDay.focusMuscles.map((muscle) => (
              <span
                key={muscle}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-700"
              >
                {MUSCLE_LABELS_ES[muscle] || muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          {currentDay.exercises.map((exInst, index) => {
            const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
            if (!exMeta) return null;

            const isEditingNotes = editingNotesId === exInst.instanceId;
            const isSecondary = exMeta.tier >= 2 || exMeta.mechanics === 'isolation';

            if (exInst.isOmitted) {
              return (
                <div
                  key={exInst.instanceId}
                  className="bg-zinc-50/80 border border-dashed border-zinc-300/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-zinc-500"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-400">[{String(index + 1).padStart(2, '0')}]</span>
                    <span className="line-through">{exMeta.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-600">
                      Omitido
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleOmitExercise(currentDay.dayNumber, exInst.instanceId)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-700 hover:text-zinc-950 bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
                  >
                    Restaurar ejercicio
                  </button>
                </div>
              );
            }

            return (
              <div
                key={exInst.instanceId}
                className="bg-white border border-zinc-200/90 rounded-xl p-4 md:p-5 shadow-subtle hover:border-zinc-300 transition-all space-y-4"
              >
                {/* Exercise Main Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-50 border border-zinc-200/60 shrink-0 mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setModalExercise(exMeta)}
                          className="text-sm md:text-base font-semibold text-zinc-950 hover:text-zinc-600 text-left transition-colors flex items-center gap-1.5 group"
                        >
                          <span>{exMeta.name}</span>
                          <Play className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-zinc-900" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {exMeta.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalExercise(exMeta)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs flex items-center gap-1 transition-colors print:hidden"
                    >
                      <Play className="w-3 h-3 text-zinc-300" />
                      <span>Ver Técnica & GIF</span>
                    </button>
                    <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {exMeta.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'}
                    </span>
                  </div>
                </div>

                {/* Replacement Banner if Substituted */}
                {(exInst.isTemporarilyReplaced || exInst.isPermanentlyReplaced || exInst.isSecondaryFreeWeightSwapped) && (
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>{exInst.replacementMessage || 'Ejercicio adaptado a tu material.'}</span>
                    </div>
                  </div>
                )}

                {/* Parameters & Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100">
                  <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Series</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.sets} series</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Repeticiones</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.reps}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Descanso</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.rest}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Intensidad</span>
                    <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.targetRir || 'RIR 1-2'}</span>
                  </div>
                </div>

                {/* Technical Biomechanical Cue */}
                {exMeta.coachingCue && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                      <Info className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Indicación Técnica / Biomecánica:</span>
                    </div>
                    <p className="leading-relaxed pl-5">
                      {exMeta.coachingCue}
                    </p>
                  </div>
                )}

                {/* Interactive Series Tracker */}
                <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1">Progreso:</span>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: exInst.sets }).map((_, setIdx) => {
                        const isDone = exInst.completedSets[setIdx];
                        return (
                          <button
                            key={setIdx}
                            type="button"
                            onClick={() => toggleSetCompleted(currentDay.dayNumber, exInst.instanceId, setIdx)}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition-all flex items-center gap-1 ${
                              isDone
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            <span>S{setIdx + 1}</span>
                            {isDone && <Check className="w-3 h-3 text-zinc-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions: Secondary Exercise Alternatives, Substitutions & Notes */}
                  <div className="flex items-center gap-1.5 flex-wrap print:hidden">
                    {/* Dedicated Button: "No tengo ejercicio secundario / Peso Libre" */}
                    {isSecondary && (
                      <button
                        type="button"
                        onClick={() => replaceWithFreeWeight(currentDay.dayNumber, exInst.instanceId)}
                        title="Reemplazar por variante básica con mancuernas o peso libre"
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-800 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 transition-colors flex items-center gap-1"
                      >
                        <Dumbbell className="w-3 h-3 text-zinc-600" />
                        <span>No tengo secundario / Peso Libre</span>
                      </button>
                    )}

                    {/* Button: "Omitir ejercicio secundario" */}
                    {isSecondary && (
                      <button
                        type="button"
                        onClick={() => toggleOmitExercise(currentDay.dayNumber, exInst.instanceId)}
                        title="Quitar este ejercicio de la sesión"
                        className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <MinusCircle className="w-3 h-3" />
                        <span className="hidden md:inline">Omitir</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => replaceTemporary(currentDay.dayNumber, exInst.instanceId)}
                      title="Sustituir por máquina ocupada o alternativa rápida"
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Máquina Ocupada</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => replacePermanent(currentDay.dayNumber, exInst.instanceId)}
                      title="Cambiar este ejercicio permanentemente en el protocolo"
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Cambiar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingNotesId(isEditingNotes ? null : exInst.instanceId)}
                      title="Añadir notas o pesos levantados"
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{exInst.notes ? 'Ver Notas' : 'Anotar Peso'}</span>
                    </button>
                  </div>
                </div>

                {/* Session Notes Input Box */}
                {isEditingNotes && (
                  <div className="pt-2">
                    <textarea
                      value={exInst.notes || ''}
                      onChange={(e) => updateExerciseNotes(currentDay.dayNumber, exInst.instanceId, e.target.value)}
                      placeholder="Registra aquí los pesos, repeticiones y sensaciones (ej. 80kg x 8, 8, 8)..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Exercise Detail Modal with GIF and step instructions */}
      <ExerciseDetailModal
        exercise={modalExercise}
        onClose={() => setModalExercise(null)}
      />
    </div>
  );
};
