import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  Copy,
  Check,
  RefreshCw,
  Flame,
  AlertCircle,
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
  Edit3
} from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { HeinzSpeechBubble } from '../UI/HeinzSpeechBubble';
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-comic text-3xl text-red-400">¡NO HAY NINGÚN INADOR ACTIVO!</h2>
        <p className="text-slate-300">Debes pasar por la calibración para forjar un nuevo Inador.</p>
        <HazardButton variant="purple" onClick={() => setStep(0)}>
          Ir a la Bienvenida
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
    text += `Dr. Heinz Doofenshmirtz • Doofenshmirtz Evil Inc.\n`;
    text += `=========================================\n\n`;

    activeRoutine.days.forEach(day => {
      text += `📅 ${day.title}\n`;
      text += `🎯 ${day.subtitle}\n`;
      text += `-----------------------------------------\n`;
      day.exercises.forEach((exInst, idx) => {
        const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
        if (exMeta) {
          text += `${idx + 1}. ${exMeta.name}\n`;
          text += `   ${exMeta.doofSubtitle}\n`;
          text += `   Series: ${exInst.sets} | Reps: ${exInst.reps} | Descanso: ${exInst.rest}\n`;
          text += `   Consejo Doof: "${exMeta.doofTip}"\n\n`;
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('¡Plano Copiado!', 'La rutina completa ha sido transferida a tu portapapeles.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    soundFx.playGearClick();
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Blueprint Schematic Header Box */}
      <div className="relative rounded-3xl bg-gradient-to-br from-doof-darkest via-doof-panel to-slate-900 border-4 border-doof-cyan/50 p-6 md:p-8 shadow-2xl shadow-cyan-950/40 overflow-hidden print:border-none print:shadow-none print:p-2">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                PLANO MALVADO AUTORIZADO
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400 text-purple-300 text-xs font-mono font-bold uppercase">
                {activeRoutine.daysPerWeek} DÍAS • {activeRoutine.experience.toUpperCase()} • {activeRoutine.equipment === 'commercial' ? 'MEGALABORATORIO' : 'SÓTANO'}
              </span>
            </div>

            <h1 className="font-comic text-3xl sm:text-4xl md:text-5xl text-white tracking-wide leading-tight">
              {activeRoutine.name}
            </h1>

            <p className="text-sm md:text-base text-cyan-200/90 font-tech">
              {activeRoutine.subtitle}
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              title="Imprimir / Exportar PDF"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Imprimir Plano</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              title="Copiar texto de rutina"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={() => setStep(1)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-purple-950/80 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              title="Re-calibrar músculos y opciones"
            >
              <Sliders className="w-4 h-4" />
              <span>Re-calibrar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Heinz Speech Reactive Bubble */}
      <div className="print:hidden">
        <HeinzSpeechBubble speech={heinzSpeech} mood={heinzMood} />
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin print:hidden">
        {activeRoutine.days.map(day => {
          const isActive = day.dayNumber === activeDayTab;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayTab(day.dayNumber)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900 via-doof-purple to-purple-800 border-doof-green-neon text-white shadow-lg shadow-purple-950/60 scale-[1.02]'
                  : 'bg-doof-card/80 border-doof-border text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-comic text-lg ${
                  isActive ? 'bg-doof-darkest text-doof-green-acid' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {day.dayNumber}
              </div>
              <div>
                <div className="text-xs font-bold font-tech uppercase tracking-wider text-slate-100">
                  Día {day.dayNumber}
                </div>
                <div className="text-[10px] text-slate-300 truncate max-w-[140px]">
                  {day.title.split(':')[1] || day.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Day Detail Header */}
      <div className="bg-doof-card/90 rounded-2xl p-5 border-2 border-doof-border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-doof-green-acid font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Sesión de Entrenamiento Activa
          </div>
          <h2 className="font-comic text-2xl md:text-3xl text-white tracking-wide mt-0.5">
            {currentDay.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {currentDay.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-doof-panel px-4 py-2.5 rounded-xl border border-doof-border">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Ejercicios</div>
            <div className="text-base font-bold font-tech text-doof-green-acid">{currentDay.exercises.length} Artefactos</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Estímulo</div>
            <div className="text-base font-bold font-tech text-purple-300">Hipertrofia Pura</div>
          </div>
        </div>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {currentDay.exercises.map((exInst, index) => {
          const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
          if (!exMeta) return null;

          const isTipOpen = expandedTip === exInst.instanceId;
          const isEditing = editingNotes === exInst.instanceId;

          return (
            <motion.div
              key={exInst.instanceId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`rounded-2xl border-2 transition-all p-5 shadow-xl ${
                exInst.isTemporarilyReplaced
                  ? 'bg-gradient-to-r from-amber-950/40 via-doof-card to-doof-card border-amber-500/60 shadow-amber-950/20'
                  : exInst.isPermanentlyReplaced
                  ? 'bg-gradient-to-r from-purple-950/40 via-doof-card to-doof-card border-purple-500/60'
                  : 'bg-doof-card/90 border-doof-border hover:border-slate-600'
              }`}
            >
              {/* Replacement Banner if Replaced */}
              {exInst.replacementMessage && (
                <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold">
                      {exInst.isTemporarilyReplaced ? '⚡ SUSTITUCIÓN TEMPORAL ACTIVA:' : '🔒 REEMPLAZO PERMANENTE:'}
                    </span>{' '}
                    <span>{exInst.replacementMessage}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Exercise Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-doof-darkest border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-doof-green-acid">
                      {index + 1}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {exMeta.muscleGroup.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                      {exMeta.mechanics.toUpperCase()} • TIER {exMeta.tier}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                      {exMeta.equipment.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-white font-sans">
                      {exMeta.name}
                    </h3>
                    <p className="font-comic text-base text-doof-green-acid tracking-wide">
                      {exMeta.doofSubtitle}
                    </p>
                  </div>
                </div>

                {/* Sets, Reps, Rest Badges */}
                <div className="flex items-center gap-3 bg-doof-darkest/80 p-3 rounded-xl border border-doof-border flex-shrink-0">
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400 uppercase">
                      <Layers className="w-3 h-3 text-purple-400" /> Series
                    </div>
                    <div className="font-tech font-bold text-lg text-white">{exInst.sets}</div>
                  </div>

                  <div className="w-px h-6 bg-slate-700" />

                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400 uppercase">
                      <Repeat className="w-3 h-3 text-doof-green-acid" /> Reps
                    </div>
                    <div className="font-tech font-bold text-sm text-doof-green-acid">{exInst.reps}</div>
                  </div>

                  <div className="w-px h-6 bg-slate-700" />

                  <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-slate-400 uppercase">
                      <Clock className="w-3 h-3 text-cyan-400" /> Descanso
                    </div>
                    <div className="font-tech font-bold text-sm text-cyan-300">{exInst.rest}</div>
                  </div>
                </div>
              </div>

              {/* Set Checkbox Levers (Interactive Tracker) */}
              <div className="mt-4 pt-4 border-t border-doof-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase">Marcar Series:</span>
                  <div className="flex items-center gap-2">
                    {exInst.completedSets.map((done, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => toggleSetCompleted(currentDay.dayNumber, exInst.instanceId, sIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-tech transition-all flex items-center gap-1 border ${
                          done
                            ? 'bg-doof-green-acid border-emerald-300 text-slate-950 shadow-md shadow-emerald-950/50 scale-105'
                            : 'bg-doof-panel border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        <span>S{sIdx + 1}</span>
                        {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Notes button */}
                  <button
                    onClick={() => setEditingNotes(isEditing ? null : exInst.instanceId)}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{exInst.notes ? 'Editar Notas' : 'Añadir Notas'}</span>
                  </button>

                  {/* Doof Coach Tip Toggle Button */}
                  <button
                    onClick={() => setExpandedTip(isTipOpen ? null : exInst.instanceId)}
                    className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isTipOpen ? 'Ocultar Consejo' : 'Consejo Doof'}</span>
                    {isTipOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Notes Input Field if Open or Notes exist */}
              {(isEditing || exInst.notes) && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Notas de Carga / RPE:</div>
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
                      className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => setEditingNotes(exInst.instanceId)}
                      className="text-xs text-slate-200 cursor-pointer hover:text-purple-300"
                    >
                      {exInst.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Collapsible Doof Advice */}
              <AnimatePresence>
                {isTipOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 leading-relaxed font-sans"
                  >
                    <strong className="text-doof-green-acid font-tech">Consejo del Dr. Doofenshmirtz:</strong> «{exMeta.doofTip}»
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Substitution Action Buttons (Lógica 1 & Lógica 2) */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
                {/* Lógica 1: Sustitución de máquina ocupada */}
                <button
                  onClick={() => replaceTemporary(currentDay.dayNumber, exInst.instanceId)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wide transition-all active:scale-95 shadow-sm"
                  title="Reemplaza inmediatamente por si la máquina está ocupada en el gym"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span>¡Polea/Máquina Ocupada! Sustitución Rápida</span>
                </button>

                {/* Lógica 2: Cambiar permanentemente */}
                <button
                  onClick={() => replacePermanent(currentDay.dayNumber, exInst.instanceId)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-200 text-xs font-bold tracking-wide transition-all active:scale-95"
                  title="Cambia permanentemente en el plano por no disponer de máquina o molestia articular"
                >
                  <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                  <span>No tengo esta máquina / No me gusta este ejercicio</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest Days Note & Protocol */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-doof-card to-doof-card border border-teal-500/40 flex items-start gap-4 shadow-lg">
        <div className="p-2.5 rounded-xl bg-teal-900/60 text-teal-300 flex-shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs md:text-sm text-slate-300 space-y-1">
          <h4 className="font-bold text-teal-300 font-tech uppercase text-sm">
            Protocolo de Días de Descanso
          </h4>
          <p>
            «{dialogues.restDayQuotes[Math.floor(Math.random() * dialogues.restDayQuotes.length)]}»
          </p>
        </div>
      </div>

      {/* Self-Destruct Industrial Danger Section */}
      <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="font-comic text-xl text-white tracking-wide">
            Gestión de Emergencias de Doofenshmirtz Evil Inc.
          </h4>
          <p className="text-xs text-slate-400">
            Si Perry el Ornitorrinco descubre esta rutina, o deseas resetear todos los datos:
          </p>
        </div>

        <button
          onClick={openSelfDestructModal}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-hazard-red hover:brightness-110 text-white font-black text-sm uppercase tracking-widest border-4 border-yellow-400 shadow-2xl shadow-red-950 flex items-center justify-center gap-3 transition-transform active:scale-95 animate-pulse-fast"
        >
          <Flame className="w-5 h-5 text-yellow-300" />
          <span>¡BOTÓN DE AUTODESTRUCCIÓN!</span>
        </button>
      </div>
    </div>
  );
};
