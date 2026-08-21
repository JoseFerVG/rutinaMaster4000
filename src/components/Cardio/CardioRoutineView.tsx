import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  RotateCcw,
  Activity,
  Clock,
  Zap,
  Droplets,
  Edit3
} from 'lucide-react';
import { useCardioStore } from '../../store/useCardioStore';
import { CARDIO_MODALITY_LABELS } from '../../utils/cardioEngine';

export const CardioRoutineView: React.FC = () => {
  const {
    activeCardioRoutine,
    activeSessionTab,
    setActiveSessionTab,
    toggleSessionCompleted,
    updateSessionNotes,
    resetAll
  } = useCardioStore();

  const [copied, setCopied] = useState(false);
  const [showZonesGuide, setShowZonesGuide] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  if (!activeCardioRoutine) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">No hay plan de cardio activo</h2>
        <p className="text-sm text-zinc-500">Configura tus parámetros de resistencia para generar un protocolo cardiovascular.</p>
        <button
          onClick={resetAll}
          className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
        >
          Iniciar Planificador
        </button>
      </div>
    );
  }

  const currentSession =
    activeCardioRoutine.sessions.find(s => s.sessionNumber === activeSessionTab) ||
    activeCardioRoutine.sessions[0];

  const handleCopyText = () => {
    let text = `=========================================\n`;
    text += `🫀 ${activeCardioRoutine.name}\n`;
    text += `${activeCardioRoutine.subtitle}\n`;
    text += `Modalidad: ${CARDIO_MODALITY_LABELS[activeCardioRoutine.modality]} | Nivel: ${activeCardioRoutine.experience.toUpperCase()} | Sesiones: ${activeCardioRoutine.daysPerWeek}/sem\n`;
    text += `=========================================\n\n`;

    activeCardioRoutine.sessions.forEach(sess => {
      text += `📅 ${sess.title} (~${sess.totalDurationMinutes} min)\n`;
      text += `🎯 Zona Primaria: ${sess.primaryZone} | Tipo: ${sess.type}\n`;
      text += `-----------------------------------------\n`;
      text += `1. Calentamiento: ${sess.warmup.duration} (${sess.warmup.targetPaceOrRpe})\n`;
      sess.mainBlock.forEach((block, bIdx) => {
        text += `2.${bIdx + 1} ${block.name}: ${block.duration} | Intensidad: ${block.targetPaceOrRpe} | ${block.description}\n`;
      });
      text += `3. Enfriamiento: ${sess.cooldown.duration} (${sess.cooldown.targetPaceOrRpe})\n`;
      text += `💡 Biomecánica: ${sess.biomechanicalCue}\n`;
      text += `💧 Nutrición/Hidratación: ${sess.nutritionHydrationTip}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getZoneBadgeColor = (zone: string) => {
    switch (zone) {
      case 'Z1': return 'bg-zinc-100 text-zinc-700 border-zinc-200';
      case 'Z2': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Z3': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Z4': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Z5': return 'bg-rose-50 text-rose-800 border-rose-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Top Header Card */}
      <section className="bg-white border border-zinc-200/90 rounded-2xl p-6 md:p-8 shadow-card space-y-6 print:border-none print:p-0 print:shadow-none">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {CARDIO_MODALITY_LABELS[activeCardioRoutine.modality]?.split('/')[0]?.trim()}
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                Nivel {activeCardioRoutine.experience}
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>{activeCardioRoutine.sessionDuration} min / sesión</span>
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 text-zinc-600 border border-zinc-200">
                {activeCardioRoutine.daysPerWeek} Sesiones / Sem
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
              {activeCardioRoutine.name}
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 leading-relaxed max-w-2xl">
              {activeCardioRoutine.subtitle}
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

        {/* Zones Guide Accordion Trigger */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="text-xs text-zinc-600 font-normal">
            {activeCardioRoutine.summaryNote}
          </div>
          <button
            type="button"
            onClick={() => setShowZonesGuide(!showZonesGuide)}
            className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 shrink-0 ml-4 print:hidden"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{showZonesGuide ? 'Ocultar Zonas Cardíacas' : 'Ver Guía de Zonas Fisiológicas'}</span>
          </button>
        </div>

        {/* Interactive Zones Guide Table */}
        {showZonesGuide && (
          <div className="pt-4 border-t border-zinc-100 space-y-3 print:block">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
              Tabla de Zonas Fisiológicas & RPE (Escala Karvonen / Coggan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {activeCardioRoutine.zonesGuide.map((z) => (
                <div key={z.zone} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getZoneBadgeColor(z.zone)}`}>
                      {z.zone}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{z.percentageFcMax}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900">{z.name}</h4>
                  <p className="text-[11px] text-zinc-600 leading-snug">{z.physiologicalAdaptation}</p>
                  <span className="text-[10px] text-zinc-400 font-mono block pt-1">{z.rpeScale}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Session Selector Tabs */}
      <section className="space-y-4 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {activeCardioRoutine.sessions.map((sess) => {
            const isActive = sess.sessionNumber === activeSessionTab;
            return (
              <button
                key={sess.sessionNumber}
                onClick={() => setActiveSessionTab(sess.sessionNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'bg-white border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60">0{sess.sessionNumber}</span>
                <span>{sess.title.split('·')[1]?.trim() || sess.title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getZoneBadgeColor(sess.primaryZone)}`}>
                  {sess.primaryZone}
                </span>
                {sess.isCompleted && <Check className="w-3 h-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Session Detailed Protocol */}
      <section className="space-y-4">
        {/* Session Header Card */}
        <div className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-zinc-900">
                {currentSession.title}
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getZoneBadgeColor(currentSession.primaryZone)}`}>
                {currentSession.primaryZone} Focus
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {currentSession.type} · Duración total estimada: ~{currentSession.totalDurationMinutes} minutos
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleSessionCompleted(currentSession.sessionNumber)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 self-start shrink-0 print:hidden ${
              currentSession.isCompleted
                ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{currentSession.isCompleted ? 'Sesión Completada' : 'Marcar Completada'}</span>
          </button>
        </div>

        {/* Structured Session Blocks (Warmup, Main Block, Cooldown) */}
        <div className="space-y-3">
          {/* Phase 1: Warmup */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 md:p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                  FASE 1 · CALENTAMIENTO
                </span>
                <span className="text-xs font-semibold text-zinc-900">{currentSession.warmup.name}</span>
              </div>
              <span className="font-mono text-xs font-medium text-zinc-600">{currentSession.warmup.duration}</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {currentSession.warmup.description}
            </p>
            <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
              Objetivo: {currentSession.warmup.targetPaceOrRpe} · Zona {currentSession.warmup.intensityZone}
            </div>
          </div>

          {/* Phase 2: Main Work Intervals */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 md:p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                FASE 2 · BLOQUE PRINCIPAL DE TRABAJO
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {currentSession.mainBlock.length} bloque(s)
              </span>
            </div>

            <div className="space-y-3">
              {currentSession.mainBlock.map((interval, iIdx) => (
                <div key={iIdx} className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-zinc-950">{interval.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-700">{interval.duration}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {interval.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getZoneBadgeColor(interval.intensityZone)}`}>
                      Zona {interval.intensityZone}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                      {interval.targetPaceOrRpe}
                    </span>
                    {interval.cadenceOrStroke && (
                      <span className="text-[11px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded border border-zinc-200">
                        {interval.cadenceOrStroke}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Cooldown */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 md:p-5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                  FASE 3 · ENFRIAMIENTO
                </span>
                <span className="text-xs font-semibold text-zinc-900">{currentSession.cooldown.name}</span>
              </div>
              <span className="font-mono text-xs font-medium text-zinc-600">{currentSession.cooldown.duration}</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {currentSession.cooldown.description}
            </p>
          </div>

          {/* Biomechanical & Nutrition Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900">
                <Zap className="w-3.5 h-3.5 text-zinc-600" />
                <span>Instrucción Biomecánica & Eficiencia:</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed pl-5">
                {currentSession.biomechanicalCue}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900">
                <Droplets className="w-3.5 h-3.5 text-zinc-600" />
                <span>Estrategia de Hidratación & Combustible:</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed pl-5">
                {currentSession.nutritionHydrationTip}
              </p>
            </div>
          </div>

          {/* User Session Notes */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setEditingNotes(!editingNotes)}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 flex items-center gap-1 print:hidden"
            >
              <Edit3 className="w-3 h-3" />
              <span>{currentSession.userLogNotes ? 'Editar Notas de Sesión' : 'Anotar Datos (Pace, FC media, Sensaciones)'}</span>
            </button>

            {editingNotes && (
              <div className="pt-2">
                <textarea
                  value={currentSession.userLogNotes || ''}
                  onChange={(e) => updateSessionNotes(currentSession.sessionNumber, e.target.value)}
                  placeholder="Registra datos de tu pulsómetro (FC media, ritmo medio, potencia en Watios, cadencia)..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
