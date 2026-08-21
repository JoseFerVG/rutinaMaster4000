import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Trash2, Shield, User, UserCheck } from 'lucide-react';
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
  { id: 'core', name: 'Core & Abdomen (6-Pack)', category: 'core', view: 'front', iconText: '🧱' },
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-doof-card/90 border-2 border-doof-purple shadow-xl">
        {/* Gender selector buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 font-bold uppercase mr-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-purple-400" /> Morfología:
          </span>
          <button
            onClick={() => setGender('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech transition-all flex items-center gap-1.5 border ${
              gender === 'male'
                ? 'bg-gradient-to-r from-purple-900 to-doof-purple text-white border-purple-400 shadow-md shadow-purple-950'
                : 'bg-doof-panel text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span>👨 Hombre</span>
            {gender === 'male' && <UserCheck className="w-3.5 h-3.5 text-doof-green-acid" />}
          </button>
          <button
            onClick={() => setGender('female')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-tech transition-all flex items-center gap-1.5 border ${
              gender === 'female'
                ? 'bg-gradient-to-r from-purple-900 to-doof-purple text-white border-purple-400 shadow-md shadow-purple-950'
                : 'bg-doof-panel text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <span>👩 Mujer</span>
            {gender === 'female' && <UserCheck className="w-3.5 h-3.5 text-doof-green-acid" />}
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 font-bold uppercase mr-1">
            Perspectiva:
          </span>
          <div className="flex bg-doof-darkest p-1 rounded-xl border border-doof-border text-xs font-semibold">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'both' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ambas
            </button>
            <button
              onClick={() => setActiveView('front')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'front' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Frente
            </button>
            <button
              onClick={() => setActiveView('back')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeView === 'back' ? 'bg-doof-purple text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Espalda
            </button>
          </div>

          {selectedMuscles.length > 0 && (
            <button
              onClick={clearMuscles}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-slate-400 hover:text-red-300 transition-colors ml-2"
              title="Limpiar Selección"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
        {/* Realistic Anatomical SVG Visualizer */}
        <div className="lg:col-span-7 bg-doof-card/90 rounded-2xl p-6 border-2 border-doof-border shadow-xl flex flex-col items-center justify-between relative overflow-hidden">
          {/* Holographic background rays */}
          <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-full flex items-center justify-between mb-2 z-10">
            <span className="text-xs font-mono text-doof-green-acid font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              HOLOGRAMA ANATÓMICO 3000 ({gender === 'male' ? 'MASCULINO' : 'FEMENINO'})
            </span>
            <span className="text-xs font-mono text-slate-400 font-bold">
              {selectedMuscles.length} Zonas Iluminadas
            </span>
          </div>

          {/* SVG Visualizer */}
          <div className="w-full flex flex-wrap items-center justify-center gap-6 py-2 z-10">
            {/* Front View */}
            {(activeView === 'both' || activeView === 'front') && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Vista Frontal
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

            {/* Back View */}
            {(activeView === 'both' || activeView === 'back') && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">
                  Vista Posterior
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

          <div className="w-full text-center text-xs text-slate-400 font-mono mt-2 z-10">
            {hoveredMuscle ? (
              <span className="text-doof-green-acid font-bold">
                🎯 Apuntando a:{' '}
                {MUSCLE_CATALOG.find(m => m.id === hoveredMuscle)?.name}
              </span>
            ) : (
              '⚡ Haz clic en cualquier músculo anatómico para iluminarlo con energía del Inador'
            )}
          </div>
        </div>

        {/* Muscle Selection Cards Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-doof-card/90 rounded-2xl p-5 border border-doof-border shadow-xl space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center justify-between">
              <span>Músculos del Exoesqueleto</span>
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
        </div>
      </div>
    </div>
  );
};
