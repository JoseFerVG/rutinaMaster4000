import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Trash2, ArrowRight, Shield } from 'lucide-react';
import { MuscleGroupId } from '../../types';
import { useDoofStore } from '../../store/useDoofStore';
import { HeinzSpeechBubble } from '../UI/HeinzSpeechBubble';
import { HazardButton } from '../UI/HazardButton';
import dialogues from '../../data/dialogues.json';

interface MuscleMeta {
  id: MuscleGroupId;
  name: string;
  category: 'torso' | 'brazos' | 'piernas' | 'core';
  view: 'front' | 'back' | 'both';
  iconText: string;
}

const MUSCLE_CATALOG: MuscleMeta[] = [
  { id: 'chest', name: 'Pectoral (Pecho)', category: 'torso', view: 'front', iconText: '🛡️' },
  { id: 'back_upper', name: 'Espalda Alta & Dorsales', category: 'torso', view: 'back', iconText: '🦅' },
  { id: 'back_lower', name: 'Espalda Baja / Lumbar', category: 'torso', view: 'back', iconText: '🦴' },
  { id: 'shoulders', name: 'Hombros (Deltoides)', category: 'torso', view: 'both', iconText: '⚡' },
  { id: 'biceps', name: 'Bíceps', category: 'brazos', view: 'front', iconText: '💪' },
  { id: 'triceps', name: 'Tríceps', category: 'brazos', view: 'back', iconText: '🔨' },
  { id: 'core', name: 'Core & Abdomen', category: 'core', view: 'front', iconText: '🧱' },
  { id: 'quads', name: 'Cuádriceps', category: 'piernas', view: 'front', iconText: '🦵' },
  { id: 'glutes', name: 'Glúteos', category: 'piernas', view: 'back', iconText: '🍑' },
  { id: 'hamstrings', name: 'Isquiotibiales (Femoral)', category: 'piernas', view: 'back', iconText: '🏹' },
  { id: 'calves', name: 'Pantorrillas (Gemelos)', category: 'piernas', view: 'both', iconText: '👟' }
];

export const BodySelector: React.FC = () => {
  const {
    selectedMuscles,
    toggleMuscle,
    selectPreset,
    clearMuscles,
    heinzSpeech,
    heinzMood,
    setStep
  } = useDoofStore();

  const [activeView, setActiveView] = useState<'both' | 'front' | 'back'>('both');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroupId | null>(null);

  const isSelected = (id: MuscleGroupId) => selectedMuscles.includes(id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Phase Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-doof-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-doof-green-acid uppercase font-bold tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Fase 1: Target Zone Illumination-inator
          </div>
          <h2 className="font-comic text-3xl md:text-4xl text-white tracking-wide mt-1">
            Selector de Grupos Musculares del Mal
          </h2>
          <p className="text-sm text-slate-300">
            Haz clic sobre las zonas anatómicas o los botones para iluminar los músculos prioritarios de tu Inador.
          </p>
        </div>

        {/* Selected count pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-doof-card border border-doof-purple/50 flex items-center gap-2 text-sm font-semibold">
            <span className="w-3 h-3 rounded-full bg-doof-green-neon animate-pulse" />
            <span className="text-slate-200">
              Zonas Iluminadas:{' '}
              <strong className="text-doof-green-acid font-tech text-base">{selectedMuscles.length}</strong>
            </span>
          </div>

          {selectedMuscles.length > 0 && (
            <button
              onClick={clearMuscles}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-300 transition-colors"
              title="Limpiar Selección"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Heinz Speech Reactive Bubble */}
      <HeinzSpeechBubble speech={heinzSpeech} mood={heinzMood} />

      {/* Preset Quick Selectors */}
      <div className="bg-doof-card/70 rounded-2xl p-4 border border-doof-border">
        <div className="text-xs font-mono text-purple-300 font-bold uppercase mb-3 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Configuraciones Pre-diseñadas por Doofenshmirtz:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {dialogues.presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset.id)}
              className="flex flex-col items-start p-3 rounded-xl bg-doof-panel/80 hover:bg-doof-purple/20 border border-doof-border hover:border-doof-purple transition-all text-left group"
            >
              <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300 font-tech">
                {preset.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Visual Silhouette (SVG Map) */}
        <div className="lg:col-span-7 bg-doof-card/90 rounded-2xl p-6 border-2 border-doof-border shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 font-bold">
              MAPA ANATÓMICO INTERACTIVO
            </span>
            <div className="flex gap-1 bg-doof-dark p-1 rounded-lg border border-doof-border text-xs">
              <button
                onClick={() => setActiveView('both')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeView === 'both' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Frente & Espalda
              </button>
              <button
                onClick={() => setActiveView('front')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeView === 'front' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Frente
              </button>
              <button
                onClick={() => setActiveView('back')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  activeView === 'back' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Espalda
              </button>
            </div>
          </div>

          {/* SVG Anatomical Visualizer */}
          <div className="w-full flex flex-wrap items-center justify-center gap-8 py-4">
            {/* Front View Silhouette */}
            {(activeView === 'both' || activeView === 'front') && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-bold">
                  Vista Frontal
                </span>
                <svg
                  viewBox="0 0 200 380"
                  className="w-48 h-80 filter drop-shadow-md select-none"
                >
                  <defs>
                    <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Body Contour Base */}
                  <g fill="#16232e" stroke="#2a455a" strokeWidth="1.5">
                    {/* Head */}
                    <circle cx="100" cy="35" r="20" />
                    {/* Neck */}
                    <path d="M92 53 L92 68 L108 68 L108 53 Z" />
                    {/* Body Outline Reference */}
                    <path d="M65 70 Q100 65 135 70 Q150 110 145 180 Q130 200 135 250 L140 340 L120 340 L110 240 L100 210 L90 240 L80 340 L60 340 L65 250 Q70 200 55 180 Q50 110 65 70 Z" fill="#13202b" opacity="0.5" />
                  </g>

                  {/* Interactive Muscle Regions Front */}
                  {/* Shoulders / Deltoids */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('shoulders')}
                    onMouseEnter={() => setHoveredMuscle('shoulders')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M58 75 Q48 90 52 110 L68 95 Q68 78 72 74 Z"
                      fill={isSelected('shoulders') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('shoulders') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('shoulders') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M142 75 Q152 90 148 110 L132 95 Q132 78 128 74 Z"
                      fill={isSelected('shoulders') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('shoulders') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('shoulders') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Chest / Pectoral */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('chest')}
                    onMouseEnter={() => setHoveredMuscle('chest')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M74 76 Q100 80 100 95 Q100 120 74 116 Q68 95 74 76 Z"
                      fill={isSelected('chest') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('chest') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('chest') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M126 76 Q100 80 100 95 Q100 120 126 116 Q132 95 126 76 Z"
                      fill={isSelected('chest') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('chest') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('chest') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Biceps */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('biceps')}
                    onMouseEnter={() => setHoveredMuscle('biceps')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M50 112 Q44 135 52 155 Q60 145 62 125 Z"
                      fill={isSelected('biceps') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('biceps') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('biceps') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M150 112 Q156 135 148 155 Q140 145 138 125 Z"
                      fill={isSelected('biceps') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('biceps') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('biceps') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Core / Abdomen */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('core')}
                    onMouseEnter={() => setHoveredMuscle('core')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M78 122 Q100 120 122 122 L118 175 Q100 185 82 175 Z"
                      fill={isSelected('core') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('core') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('core') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Quads / Cuádriceps */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('quads')}
                    onMouseEnter={() => setHoveredMuscle('quads')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M72 185 Q95 185 96 210 L94 265 Q70 260 66 220 Z"
                      fill={isSelected('quads') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('quads') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('quads') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M128 185 Q105 185 104 210 L106 265 Q130 260 134 220 Z"
                      fill={isSelected('quads') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('quads') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('quads') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Calves Front */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('calves')}
                    onMouseEnter={() => setHoveredMuscle('calves')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M68 280 Q88 280 86 335 L72 335 Q64 305 68 280 Z"
                      fill={isSelected('calves') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('calves') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('calves') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M132 280 Q112 280 114 335 L128 335 Q136 305 132 280 Z"
                      fill={isSelected('calves') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('calves') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('calves') ? 'url(#glow-green)' : undefined}
                    />
                  </g>
                </svg>
              </div>
            )}

            {/* Back View Silhouette */}
            {(activeView === 'both' || activeView === 'back') && (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono uppercase text-slate-400 mb-2 font-bold">
                  Vista Posterior
                </span>
                <svg
                  viewBox="0 0 200 380"
                  className="w-48 h-80 filter drop-shadow-md select-none"
                >
                  {/* Head Back */}
                  <circle cx="100" cy="35" r="20" fill="#16232e" stroke="#2a455a" strokeWidth="1.5" />

                  {/* Upper Back / Traps / Lats */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('back_upper')}
                    onMouseEnter={() => setHoveredMuscle('back_upper')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M72 65 Q100 58 128 65 L140 120 Q100 135 60 120 Z"
                      fill={isSelected('back_upper') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('back_upper') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('back_upper') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Triceps Back */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('triceps')}
                    onMouseEnter={() => setHoveredMuscle('triceps')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M48 100 Q40 130 48 150 Q56 140 58 115 Z"
                      fill={isSelected('triceps') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('triceps') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('triceps') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M152 100 Q160 130 152 150 Q144 140 142 115 Z"
                      fill={isSelected('triceps') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('triceps') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('triceps') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Lower Back / Lumbar */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('back_lower')}
                    onMouseEnter={() => setHoveredMuscle('back_lower')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M78 126 Q100 130 122 126 L120 162 Q100 168 80 162 Z"
                      fill={isSelected('back_lower') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('back_lower') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('back_lower') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Glutes */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('glutes')}
                    onMouseEnter={() => setHoveredMuscle('glutes')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M74 168 Q98 165 99 180 Q98 210 68 205 Q66 185 74 168 Z"
                      fill={isSelected('glutes') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('glutes') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('glutes') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M126 168 Q102 165 101 180 Q102 210 132 205 Q134 185 126 168 Z"
                      fill={isSelected('glutes') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('glutes') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('glutes') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Hamstrings / Isquiotibiales */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('hamstrings')}
                    onMouseEnter={() => setHoveredMuscle('hamstrings')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M68 210 Q96 210 95 265 L70 265 Q62 235 68 210 Z"
                      fill={isSelected('hamstrings') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('hamstrings') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('hamstrings') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M132 210 Q104 210 105 265 L130 265 Q138 235 132 210 Z"
                      fill={isSelected('hamstrings') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('hamstrings') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('hamstrings') ? 'url(#glow-green)' : undefined}
                    />
                  </g>

                  {/* Calves Back */}
                  <g
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => toggleMuscle('calves')}
                    onMouseEnter={() => setHoveredMuscle('calves')}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  >
                    <path
                      d="M68 280 Q88 280 86 335 L72 335 Q64 305 68 280 Z"
                      fill={isSelected('calves') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('calves') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('calves') ? 'url(#glow-green)' : undefined}
                    />
                    <path
                      d="M132 280 Q112 280 114 335 L128 335 Q136 305 132 280 Z"
                      fill={isSelected('calves') ? '#00ff88' : '#22384a'}
                      stroke={isSelected('calves') ? '#ffffff' : '#3a5973'}
                      strokeWidth="1.5"
                      filter={isSelected('calves') ? 'url(#glow-green)' : undefined}
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>

          <div className="w-full text-center text-xs text-slate-400 font-mono mt-2">
            {hoveredMuscle ? (
              <span className="text-doof-green-acid font-bold">
                🎯 Apuntando a:{' '}
                {MUSCLE_CATALOG.find(m => m.id === hoveredMuscle)?.name}
              </span>
            ) : (
              '⚡ Haz clic en cualquier parte del cuerpo para activarla o desactivarla'
            )}
          </div>
        </div>

        {/* Muscle Selection Cards Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-doof-card/90 rounded-2xl p-5 border border-doof-border shadow-xl space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center justify-between">
              <span>Listado de Zonas de Choque</span>
              <span className="text-xs text-purple-400 font-normal">Click para alternar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {MUSCLE_CATALOG.map(m => {
                const active = isSelected(m.id);
                return (
                  <motion.button
                    key={m.id}
                    onClick={() => toggleMuscle(m.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-gradient-to-r from-emerald-950/70 to-doof-card border-doof-green-acid/80 shadow-md shadow-emerald-950/40 text-white'
                        : 'bg-doof-panel/60 border-doof-border text-slate-300 hover:border-slate-500 hover:bg-doof-panel'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{m.iconText}</span>
                      <div>
                        <div className="text-xs font-bold font-tech uppercase">{m.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {m.view === 'front' ? 'Zona Frontal' : m.view === 'back' ? 'Zona Posterior' : '360 Grados'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        active
                          ? 'bg-doof-green-neon border-white text-slate-950 shadow-sm'
                          : 'border-slate-600 bg-slate-800/60 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Navigation Proceed Button */}
          <div className="pt-2">
            <HazardButton
              variant="green"
              size="lg"
              className="w-full justify-between"
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-5 h-5 order-last" />}
            >
              ¡Proceder a la Calibración de Esfuerzo!
            </HazardButton>
          </div>
        </div>
      </div>
    </div>
  );
};
