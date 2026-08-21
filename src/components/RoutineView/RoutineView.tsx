import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  Copy,
  Check,
  Dumbbell,
  Clock,
  Repeat,
  Layers,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Award,
  Info,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { DoofenshmirtzAvatar } from '../Dialogue/DoofenshmirtzAvatar';
import { DialogueBubble } from '../Dialogue/DialogueBubble';
import { HazardButton } from '../UI/HazardButton';
import rawExercises from '../../data/exercises.json';
import { Exercise } from '../../types';
import dialogues from '../../data/dialogues.json';
import { soundFx } from '../../utils/audioSynth';

const exercisesDb = rawExercises as Exercise[];

export const RoutineView: React.FC = () => {
  const {
    activeRoutine,
    activeDayTab,
    setActiveDayTab,
    replaceTemporary,
    replacePermanent,
    toggleSetCompleted,
    updateExerciseNotes,
    openSelfDestructModal,
    setStep,
    heinzSpeech,
    heinzMood,
    showToast
  } = useDoofStore();

  const [copied, setCopied] = useState(false);
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  if (!activeRoutine) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-display font-semibold text-2xl text-slate-200">No hay protocolo activo</h2>
        <p className="text-slate-400 text-sm">Configura tus preferencias para generar un plan de entrenamiento.</p>
        <HazardButton variant="purple" onClick={() => setStep(0)}>
          Iniciar Configuración
        </HazardButton>
      </div>
    );
  }

  const currentDay = activeRoutine.days.find(d => d.dayNumber === activeDayTab) || activeRoutine.days[0];

  const handleCopyText = () => {
    soundFx.playLaser();
    let text = `=========================================\n`;
    text += `⚡ ${activeRoutine.name} ⚡\n`;
    text += `${activeRoutine.subtitle}\n`;
    text += `Protocolo Biomecánico Personalizado\n`;
    text += `=========================================\n\n`;

    activeRoutine.days.forEach(day => {
      text += `📅 ${day.title}\n`;
      text += `🎯 ${day.subtitle}\n`;
      text += `-----------------------------------------\n`;
      day.exercises.forEach((exInst, idx) => {
        const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
        if (exMeta) {
          text += `${idx + 1}. ${exMeta.name}\n`;
          text += `   Series: ${exInst.sets} | Reps: ${exInst.reps} | Descanso: ${exInst.rest}\n`;
          text += `   Consejo: "${exMeta.doofTip}"\n\n`;
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Protocolo Copiado', 'La rutina completa ha sido transferida a tu portapapeles.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    soundFx.playGearClick();
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Routine Hero Header Box */}
      <div className="rounded-3xl zen-glass p-6 md:p-8 shadow-zen-lg overflow-hidden border border-white/10 print:border-none print:shadow-none print:p-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                PROTOCOLO OPTIMIZADO
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-medium">
                {activeRoutine.daysPerWeek} DÍAS/SEM · {activeRoutine.experience.toUpperCase()} · {activeRoutine.equipment === 'commercial' ? 'GIMNASIO' : 'CASA'}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight">
              {activeRoutine.name}
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-normal">
              {activeRoutine.subtitle}
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-medium flex items-center gap-2 transition-all shadow-sm"
              title="Imprimir / Exportar PDF"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-medium flex items-center gap-2 transition-all shadow-sm"
              title="Copiar texto de rutina"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-2 transition-all shadow-sm"
              title="Re-calibrar parámetros"
            >
              <Sliders className="w-4 h-4" />
              <span>Re-calibrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Coach Live Dialogue Strip */}
      <div className="print:hidden rounded-2xl zen-glass p-4 md:p-6 shadow-zen-md grid grid-cols-1 md:grid-cols-12 gap-5 items-center border border-white/10">
        <div className="md:col-span-3 flex flex-col items-center justify-center">
          <DoofenshmirtzAvatar mood={heinzMood} isTalking={true} size="md" />
        </div>
        <div className="md:col-span-9">
          <DialogueBubble
            text={heinzSpeech}
            mood={heinzMood}
            title="Asesor Biomecánico"
          />
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin print:hidden">
        {activeRoutine.days.map(day => {
          const isActive = day.dayNumber === activeDayTab;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayTab(day.dayNumber)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-3 text-left ${
                isActive
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-zen-glow'
                  : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/[0.04] text-slate-400'
                }`}
              >
                {day.dayNumber}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-100">
                  Día {day.dayNumber}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  {day.title.split(':')[1] || day.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Day Detail Header */}
      <div className="p-5 rounded-2xl zen-glass shadow-zen-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10">
        <div>
          <div className="text-xs font-medium text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Sesión Programada
          </div>
          <h2 className="font-display font-semibold text-xl md:text-2xl text-white mt-0.5">
            {currentDay.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            {currentDay.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/[0.06]">
          <div className="text-right">
            <div className="text-[10px] uppercase text-slate-500 font-medium">Ejercicios</div>
            <div className="text-sm font-semibold text-emerald-400">{currentDay.exercises.length} Movimientos</div>
          </div>
          <div className="w-px h-6 bg-white/[0.08]" />
          <div className="text-right">
            <div className="text-[10px] uppercase text-slate-500 font-medium">Estímulo</div>
            <div className="text-sm font-semibold text-slate-200">Hipertrofia</div>
          </div>
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-3.5">
        {currentDay.exercises.map((exInst, index) => {
          const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
          if (!exMeta) return null;

          const isTipOpen = expandedTip === exInst.instanceId;
          const isEditing = editingNotes === exInst.instanceId;

          return (
            <motion.div
              key={exInst.instanceId}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl p-5 border transition-all duration-300 zen-glass shadow-zen-sm ${
                exInst.isTemporarilyReplaced
                  ? 'border-amber-500/30 bg-amber-500/[0.03]'
                  : exInst.isPermanentlyReplaced
                  ? 'border-sky-500/30 bg-sky-500/[0.03]'
                  : 'border-white/10 hover:border-white/15'
              }`}
            >
              {/* Substitution Banner if Replaced */}
              {exInst.replacementMessage && (
                <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold">
                      {exInst.isTemporarilyReplaced ? 'Sustitución rápida activa:' : 'Reemplazo permanente:'}
                    </span>{' '}
                    <span>{exInst.replacementMessage}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Exercise Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-semibold text-emerald-400">
                      {index + 1}
                    </span>
                    <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                      {exMeta.muscleGroup.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                      {exMeta.equipment.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-white">
                      {exMeta.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">
                      {exMeta.doofSubtitle}
                    </p>
                  </div>
                </div>

                {/* Sets, Reps, Rest Badges */}
                <div className="flex items-center gap-3 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06] flex-shrink-0">
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 uppercase font-medium">
                      <Layers className="w-3 h-3 text-slate-400" /> Series
                    </div>
                    <div className="font-semibold text-base text-white">{exInst.sets}</div>
                  </div>

                  <div className="w-px h-5 bg-white/[0.08]" />

                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 uppercase font-medium">
                      <Repeat className="w-3 h-3 text-emerald-400" /> Reps
                    </div>
                    <div className="font-semibold text-sm text-emerald-300">{exInst.reps}</div>
                  </div>

                  <div className="w-px h-5 bg-white/[0.08]" />

                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 uppercase font-medium">
                      <Clock className="w-3 h-3 text-sky-400" /> Descanso
                    </div>
                    <div className="font-semibold text-sm text-slate-300">{exInst.rest}</div>
                  </div>
                </div>
              </div>

              {/* Set Checkbox Tracker */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Series:</span>
                  <div className="flex items-center gap-1.5">
                    {exInst.completedSets.map((done, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => toggleSetCompleted(currentDay.dayNumber, exInst.instanceId, sIdx)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                          done
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
                            : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>S{sIdx + 1}</span>
                        {done && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Notes button */}
                  <button
                    onClick={() => setEditingNotes(isEditing ? null : exInst.instanceId)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{exInst.notes ? 'Editar Notas' : 'Añadir Carga'}</span>
                  </button>

                  {/* Advice toggle */}
                  <button
                    onClick={() => setExpandedTip(isTipOpen ? null : exInst.instanceId)}
                    className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isTipOpen ? 'Ocultar Detalle' : 'Detalle Biomecánico'}</span>
                    {isTipOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Notes Input Field */}
              {(isEditing || exInst.notes) && (
                <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] text-slate-500 uppercase font-medium mb-1">Registro de Peso / RPE:</div>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={exInst.notes || ''}
                      placeholder="Ej. 40kg x 10 reps (RIR 1)"
                      onBlur={(e) => {
                        updateExerciseNotes(currentDay.dayNumber, exInst.instanceId, e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateExerciseNotes(currentDay.dayNumber, exInst.instanceId, (e.target as HTMLInputElement).value);
                          setEditingNotes(null);
                        }
                      }}
                      className="w-full bg-zen-darkest border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingNotes(exInst.instanceId)}
                      className="text-xs text-slate-300 cursor-pointer hover:text-emerald-300"
                    >
                      {exInst.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Collapsible Advice */}
              <AnimatePresence>
                {isTipOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 text-xs text-slate-300 leading-relaxed font-sans"
                  >
                    <strong className="text-emerald-400 font-medium">Clave Técnica:</strong> «{exMeta.doofTip}»
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Substitution Action Controls */}
              <div className="mt-3.5 pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2.5 print:hidden">
                <button
                  onClick={() => replaceTemporary(currentDay.dayNumber, exInst.instanceId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/[0.08] hover:border-amber-500/30 text-slate-300 hover:text-amber-200 text-xs font-medium transition-all"
                  title="Sustituye por ejercicio equivalente si la máquina está ocupada"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Máquina Ocupada · Sustitución Rápida</span>
                </button>

                <button
                  onClick={() => replacePermanent(currentDay.dayNumber, exInst.instanceId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
                  title="Cambia permanentemente en la rutina por molestia o preferencia"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Cambiar permanentemente de variante</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest Days Note */}
      <div className="p-4 rounded-2xl zen-glass border border-white/10 flex items-start gap-3.5 shadow-sm">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-300 space-y-0.5">
          <h4 className="font-semibold text-emerald-400">
            Recuperación & Adaptación
          </h4>
          <p className="text-slate-400">
            «{dialogues.restDayQuotes[Math.floor(Math.random() * dialogues.restDayQuotes.length)]}»
          </p>
        </div>
      </div>

      {/* Reset Section */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="font-display font-semibold text-sm text-slate-300">
            Gestión del Protocolo
          </h4>
          <p className="text-xs text-slate-500">
            Puedes restablecer todos los parámetros para iniciar una nueva calibración desde cero.
          </p>
        </div>

        <button
          onClick={openSelfDestructModal}
          className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 font-medium text-xs border border-white/10 hover:border-rose-500/30 flex items-center gap-2 transition-all"
        >
          <span>Restablecer Todo</span>
        </button>
      </div>
    </div>
  );
};
