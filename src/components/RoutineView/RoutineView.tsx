import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  RotateCcw,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Calendar,
  Download,
  Dumbbell,
  MinusCircle,
  Clock,
  Play,
  Share2,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import { useRoutineStore } from '../../store/useRoutineStore';
import rawExercises from '../../data/exercises.json';
import { Exercise } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';
import { ExerciseDetailModal } from '../ExerciseModal/ExerciseDetailModal';
import { ExerciseSwapModal } from '../ExerciseModal/ExerciseSwapModal';
import {
  exportRoutineToExcel,
  downloadMarkdownFile,
  downloadICSFile,
  downloadJSONBackup
} from '../../utils/exportEngine';

const exercisesDb = rawExercises as Exercise[];

export const RoutineView: React.FC = () => {
  const {
    activeRoutine,
    activeDayTab,
    setActiveDayTab,
    replaceWithFreeWeight,
    setSpecificExercise,
    setSpecificAlternative,
    toggleUseAlternative,
    toggleOmitExercise,
    resetAll,
    showToast
  } = useRoutineStore();

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'all'>('day');
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    exercise: Exercise | null;
    dayNumber: number;
    instanceId: string;
    mode: 'main' | 'alternative';
  }>({
    isOpen: false,
    exercise: null,
    dayNumber: 1,
    instanceId: '',
    mode: 'main'
  });
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

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
    text += `KINETIC BIOMECHANICS · ${activeRoutine.name}\n`;
    text += `${activeRoutine.subtitle}\n`;
    text += `Objetivo: ${activeRoutine.goal.toUpperCase()} | Nivel: ${activeRoutine.experience.toUpperCase()} | Duración: ${activeRoutine.sessionDuration || 60} MIN | Entorno: ${activeRoutine.equipment.toUpperCase()}\n`;
    text += `=========================================\n\n`;

    activeRoutine.days.forEach(day => {
      text += `[${day.title}]\n`;
      text += `${day.subtitle}\n`;
      text += `-----------------------------------------\n`;
      day.exercises.forEach((exInst, idx) => {
        if (exInst.isOmitted) return;
        const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
        const altMeta = exInst.alternativeExerciseId ? exercisesDb.find(e => e.id === exInst.alternativeExerciseId) : null;
        if (exMeta) {
          text += `${idx + 1}. ${exMeta.name}\n`;
          if (altMeta) {
            text += `   Plan B / Alternativa (si ocupado): ${altMeta.name}\n`;
          }
          text += `   Series: ${exInst.sets} | Reps: ${exInst.reps} | Descanso: ${exInst.rest} | Intensidad: ${exInst.targetRir || 'RIR 1-2'}\n`;
          text += `   Guía técnica: ${exMeta.coachingCue}\n\n`;
        }
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Protocolo Copiado', 'La rutina completa con alternativas ha sido copiada.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportExcel = () => {
    exportRoutineToExcel(activeRoutine, exercisesDb);
    showToast('Excel Descargado', 'Archivo .xlsx generado con la columna de Alternativas (Plan B).', 'success');
  };

  const handleExportMarkdown = () => {
    downloadMarkdownFile(activeRoutine, exercisesDb);
    showToast('Markdown Descargado', 'Archivo .md listo para importar en Notion u Obsidian.', 'success');
  };

  const handleExportCalendar = () => {
    downloadICSFile(activeRoutine, exercisesDb);
    showToast('Calendario Generado', 'Archivo .ics listo para añadir a Google Calendar o Apple Calendar.', 'success');
  };

  const handleExportJSON = () => {
    downloadJSONBackup(activeRoutine);
    showToast('Backup Descargado', 'Copia de seguridad en formato JSON descargada.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const openSwapModal = (dayNumber: number, instanceId: string, exercise: Exercise, mode: 'main' | 'alternative' = 'main') => {
    setSwapModalState({
      isOpen: true,
      exercise,
      dayNumber,
      instanceId,
      mode
    });
  };

  const renderExerciseCard = (exInst: any, dayNumber: number, index: number) => {
    const exMeta = exercisesDb.find(e => e.id === exInst.exerciseId);
    if (!exMeta) return null;

    const altMeta = exInst.alternativeExerciseId ? exercisesDb.find(e => e.id === exInst.alternativeExerciseId) : null;
    const isSecondary = exMeta.tier >= 2 || exMeta.mechanics === 'isolation';

    if (exInst.isOmitted) {
      return (
        <div
          key={exInst.instanceId}
          className="bg-zinc-50/80 border border-dashed border-zinc-300/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-zinc-500 print:hidden"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">[{String(index + 1).padStart(2, '0')}]</span>
            <span className="line-through font-medium">{exMeta.name}</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-600">
              Omitido
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleOmitExercise(dayNumber, exInst.instanceId)}
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
        className="bg-white border border-zinc-200/90 rounded-xl p-4 md:p-5 shadow-subtle hover:border-zinc-300 transition-all space-y-4 print:border-zinc-300 print:shadow-none print:break-inside-avoid print:p-3"
      >
        {/* Main Header */}
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
                  className="text-sm md:text-base font-bold text-zinc-950 hover:text-zinc-600 text-left transition-colors flex items-center gap-1.5 group print:hover:text-zinc-950"
                >
                  <span>{exMeta.name}</span>
                  <Play className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-zinc-900 print:hidden" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {exMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start shrink-0 print:hidden">
            <button
              type="button"
              onClick={() => setModalExercise(exMeta)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs flex items-center gap-1 transition-colors"
            >
              <Play className="w-3 h-3 text-zinc-300" />
              <span>Ver Técnica & GIF</span>
            </button>
            <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              {exMeta.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'} · Tier {exMeta.tier}
            </span>
          </div>
        </div>

        {/* Status Banner if Plan B is Active or Modified */}
        {(exInst.isUsingAlternative || exInst.isTemporarilyReplaced || exInst.isPermanentlyReplaced || exInst.isSecondaryFreeWeightSwapped) && (
          <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 print:hidden ${
            exInst.isUsingAlternative
              ? 'bg-amber-50/90 border-amber-200/80 text-amber-900'
              : 'bg-zinc-50 border-zinc-200/80 text-zinc-700'
          }`}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{exInst.replacementMessage || 'Ejercicio personalizado en tu protocolo.'}</span>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100">
          <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100 print:bg-white print:border-zinc-200">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Series</span>
            <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.sets} series</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100 print:bg-white print:border-zinc-200">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Repeticiones</span>
            <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.reps}</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100 print:bg-white print:border-zinc-200">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Descanso</span>
            <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.rest}</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-50/60 border border-zinc-100 print:bg-white print:border-zinc-200">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Intensidad</span>
            <span className="text-xs md:text-sm font-semibold text-zinc-900">{exInst.targetRir || 'RIR 1-2'}</span>
          </div>
        </div>

        {/* Biomechanical Coaching Cue */}
        {exMeta.coachingCue && (
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-700 space-y-1 print:bg-white print:border-zinc-200">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
              <Info className="w-3.5 h-3.5 text-zinc-500" />
              <span>Indicación Biomecánica & Ejecución:</span>
            </div>
            <p className="leading-relaxed pl-5">
              {exMeta.coachingCue}
            </p>
          </div>
        )}

        {/* Dedicated Plan B / Alternative Exercise Box (Siempre visible por si está ocupado) */}
        <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-white print:border-zinc-300">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-zinc-200/70 flex items-center justify-center text-zinc-700 shrink-0 mt-0.5">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-500">
                  Plan B / Alternativa (si ocupado):
                </span>
                {altMeta ? (
                  <button
                    type="button"
                    onClick={() => setModalExercise(altMeta)}
                    className="text-xs font-bold text-zinc-950 hover:underline flex items-center gap-1"
                  >
                    <span>{altMeta.name}</span>
                    <Play className="w-3 h-3 text-zinc-400 print:hidden" />
                  </button>
                ) : (
                  <span className="text-xs text-zinc-400 italic">No asignado</span>
                )}
                {altMeta && (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-200/70 text-zinc-700">
                    {altMeta.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento'} · {altMeta.equipment === 'commercial' ? 'Máquina/Polea' : 'Libre'}
                  </span>
                )}
              </div>
              {altMeta && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {altMeta.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons for Plan B */}
          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 print:hidden flex-wrap">
            {altMeta && (
              <button
                type="button"
                onClick={() => toggleUseAlternative(dayNumber, exInst.instanceId)}
                title="Activar alternativa si la máquina principal está ocupada hoy"
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border ${
                  exInst.isUsingAlternative
                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                    : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>{exInst.isUsingAlternative ? 'Usando Plan B (Activo)' : 'Usar Plan B'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openSwapModal(dayNumber, exInst.instanceId, altMeta || exMeta, 'alternative')}
              title="No dispongo de esta alternativa / Seleccionar otro Plan B de por si acaso"
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-zinc-400" />
              <span>Cambiar Alternativa</span>
            </button>
          </div>
        </div>

        {/* Customization Actions Bar (Cambiar Ejercicio Principal, Peso Libre, Omitir) */}
        <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <span>Músculo: {MUSCLE_LABELS_ES[exMeta.muscleGroup] || exMeta.muscleGroup}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Direct Exercise Swap Modal Button for Main Exercise */}
            <button
              type="button"
              onClick={() => openSwapModal(dayNumber, exInst.instanceId, exMeta, 'main')}
              title="Seleccionar otro ejercicio principal de la base de datos"
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-zinc-500" />
              <span>Cambiar Principal</span>
            </button>

            {/* Free Weight Alternative */}
            {isSecondary && (
              <button
                type="button"
                onClick={() => replaceWithFreeWeight(dayNumber, exInst.instanceId)}
                title="Reemplazar por variante con mancuernas o peso libre"
                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 transition-colors flex items-center gap-1"
              >
                <Dumbbell className="w-3 h-3 text-zinc-500" />
                <span>No tengo secundario / Peso Libre</span>
              </button>
            )}

            {/* Omit Exercise */}
            {isSecondary && (
              <button
                type="button"
                onClick={() => toggleOmitExercise(dayNumber, exInst.instanceId)}
                title="Retirar este ejercicio de la sesión"
                className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 transition-colors flex items-center gap-1"
              >
                <MinusCircle className="w-3 h-3" />
                <span>Omitir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 print:p-0 print:m-0 print:max-w-none">
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

          {/* Master Export Suite Actions */}
          <div className="flex items-center gap-2 shrink-0 print:hidden flex-wrap">
            {/* Export Excel Button (Primary) */}
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar Excel (.xlsx)</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Imprimir / PDF</span>
            </button>

            {/* More Export Formats Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 shadow-subtle flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500" />
                <span>Más Opciones</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white border border-zinc-200 shadow-elevated rounded-xl p-1.5 z-50 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportMarkdown();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Descargar Markdown (.md)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleExportCalendar();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Añadir a Calendario (.ics)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleCopyText();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                    <span>{copied ? 'Copiado al Portapapeles' : 'Copiar al Portapapeles'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleExportJSON();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 transition-colors border-t border-zinc-100"
                  >
                    <Share2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Backup JSON (.json)</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={resetAll}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-white shadow-subtle flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
              <span>Nuevo</span>
            </button>
          </div>
        </div>

        {activeRoutine.summaryNote && (
          <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-600 leading-relaxed font-normal">
            {activeRoutine.summaryNote}
          </div>
        )}
      </section>

      {/* View Switcher & Day Tabs Bar */}
      <section className="space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Day Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {activeRoutine.days.map((day) => {
              const isActive = viewMode === 'day' && day.dayNumber === activeDayTab;
              const activeExercisesCount = day.exercises.filter(e => !e.isOmitted).length;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setViewMode('day');
                    setActiveDayTab(day.dayNumber);
                  }}
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

          {/* Full Week Overview Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'all' ? 'day' : 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${
              viewMode === 'all'
                ? 'bg-zinc-900 border-zinc-900 text-white font-semibold'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === 'all' ? 'Vista por Días' : 'Ver Semana Completa'}</span>
          </button>
        </div>
      </section>

      {/* Routine Content: Single Day or All Days */}
      {viewMode === 'day' ? (
        <section className="space-y-4 print:hidden">
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
            {currentDay.exercises.map((exInst, index) =>
              renderExerciseCard(exInst, currentDay.dayNumber, index)
            )}
          </div>
        </section>
      ) : (
        /* Full Week Overview Mode (Shows all days sequentially) */
        <section className="space-y-8">
          {activeRoutine.days.map((day) => (
            <div key={day.dayNumber} className="space-y-4">
              <div className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{day.title}</h3>
                  <p className="text-xs text-zinc-500">{day.subtitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {day.focusMuscles.map((muscle) => (
                    <span key={muscle} className="text-[10px] px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-600 font-medium">
                      {MUSCLE_LABELS_ES[muscle] || muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {day.exercises.map((exInst, index) =>
                  renderExerciseCard(exInst, day.dayNumber, index)
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Print View Only (Clean A4 High-Contrast Format) */}
      <div className="hidden print:block space-y-6">
        {activeRoutine.days.map((day) => (
          <div key={day.dayNumber} className="space-y-3 page-break-after-auto">
            <div className="border-b-2 border-zinc-900 pb-1 flex justify-between items-baseline">
              <h2 className="text-base font-bold uppercase">{day.title}</h2>
              <span className="text-xs font-mono">{day.focusMuscles.map(m => MUSCLE_LABELS_ES[m] || m).join(' · ')}</span>
            </div>
            <p className="text-xs text-zinc-600 italic">{day.subtitle}</p>
            <div className="space-y-2">
              {day.exercises.filter(e => !e.isOmitted).map((exInst, idx) =>
                renderExerciseCard(exInst, day.dayNumber, idx)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal (GIF + Full Instructions) */}
      <ExerciseDetailModal
        exercise={modalExercise}
        onClose={() => setModalExercise(null)}
      />

      {/* Exercise Swap Modal (Change Main or Alternative Exercise) */}
      <ExerciseSwapModal
        currentExercise={swapModalState.exercise}
        dayNumber={swapModalState.dayNumber}
        instanceId={swapModalState.instanceId}
        mode={swapModalState.mode}
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState(prev => ({ ...prev, isOpen: false }))}
        onSelectReplacement={(dNum, instId, newExId, mode) => {
          if (mode === 'alternative') {
            setSpecificAlternative(dNum, instId, newExId);
          } else {
            setSpecificExercise(dNum, instId, newExId);
          }
        }}
      />
    </div>
  );
};
