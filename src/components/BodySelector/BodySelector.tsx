import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, User, UserCheck } from 'lucide-react';
import { MuscleGroupId } from '../../types';
import { useDoofStore } from '../../store/useDoofStore';
import { RealisticBodyMap } from './RealisticBodyMap';
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
    gender,
    setGender,
    selectedMuscles,
    toggleMuscle,
    selectPreset,
    clearMuscles
  } = useDoofStore();

  const [activeView, setActiveView] = useState<'both' | 'front' | 'back'>('both');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroupId | null>(null);

  const isSelected = (id: MuscleGroupId) => selectedMuscles.includes(id);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Gender & View Controller Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl zen-glass shadow-zen-sm">
        {/* Gender selector buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium tracking-wide mr-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" /> Morfología:
          </span>
          <button
            onClick={() => setGender('male')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              gender === 'male'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white'
            }`}
          >
            <span>Hombre</span>
            {gender === 'male' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button
            onClick={() => setGender('female')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
              gender === 'female'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white'
            }`}
          >
            <span>Mujer</span>
            {gender === 'female' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium tracking-wide mr-1">
            Perspectiva:
          </span>
          <div className="flex bg-zen-darkest p-1 rounded-xl border border-white/[0.08] text-xs font-medium">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'both' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ambas
            </button>
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'front' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Frente
            </button>
            <button
              onClick={() => setActiveView('back')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'back' ? 'bg-white/[0.1] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Espalda
            </button>
          </div>

          {selectedMuscles.length > 0 && (
            <button
              onClick={clearMuscles}
              className="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 border border-white/[0.08] hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-colors ml-2"
              title="Limpiar Selección"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="p-4 rounded-2xl zen-glass shadow-zen-sm">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
          <span>Configuraciones sugeridas:</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {dialogues.presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset.id)}
              className="flex flex-col items-start p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-500/30 transition-all text-left group"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                {preset.name}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Realistic Anatomical SVG Visualizer */}
        <div className="lg:col-span-7 p-6 rounded-2xl zen-glass shadow-zen-md flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2 z-10">
            <span className="text-xs font-medium text-emerald-400 tracking-wide">
              Anatomía Biomecánica ({gender === 'male' ? 'Hombre' : 'Mujer'})
            </span>
            <span className="text-xs font-mono text-slate-400">
              {selectedMuscles.length} Seleccionados
            </span>
          </div>

          {/* SVG Visualizer */}
          <div className="w-full flex flex-wrap items-center justify-center gap-6 py-2 z-10">
            {(activeView === 'both' || activeView === 'front') && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase text-slate-500 mb-1 font-medium tracking-wider">
                  Frente
                </span>
                <RealisticBodyMap
                  gender={gender}
                  view="front"
                  selectedMuscles={selectedMuscles}
                  hoveredMuscle={hoveredMuscle}
                  onToggleMuscle={toggleMuscle}
                  onHoverMuscle={setHoveredMuscle}
                />
              </div>
            )}

            {(activeView === 'both' || activeView === 'back') && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase text-slate-500 mb-1 font-medium tracking-wider">
                  Espalda
                </span>
                <RealisticBodyMap
                  gender={gender}
                  view="back"
                  selectedMuscles={selectedMuscles}
                  hoveredMuscle={hoveredMuscle}
                  onToggleMuscle={toggleMuscle}
                  onHoverMuscle={setHoveredMuscle}
                />
              </div>
            )}
          </div>

          <div className="w-full text-center text-xs text-slate-400 font-normal mt-2 z-10">
            {hoveredMuscle ? (
              <span className="text-emerald-400 font-medium">
                {MUSCLE_CATALOG.find(m => m.id === hoveredMuscle)?.name}
              </span>
            ) : (
              'Toca cualquier grupo muscular para activarlo o desactivarlo'
            )}
          </div>
        </div>

        {/* Muscle Selection Cards Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-2xl zen-glass shadow-zen-md space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Grupos Musculares</span>
              <span className="text-[11px] text-emerald-400 font-normal">Click para alternar</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {MUSCLE_CATALOG.map(m => {
                const active = isSelected(m.id);
                return (
                  <motion.button
                    key={m.id}
                    onClick={() => toggleMuscle(m.id)}
                    whileHover={{ scale: 1.008 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-white shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-300 hover:border-white/[0.14] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{m.iconText}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-100">{m.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {m.view === 'front' ? 'Zona Frontal' : m.view === 'back' ? 'Zona Posterior' : 'Plano Completo'}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        active
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm'
                          : 'border-white/10 bg-white/[0.02] text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
