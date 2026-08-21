import React, { useState } from 'react';
import { MuscleGroupId } from '../../types';
import { MUSCLE_LABELS_ES } from '../../utils/routineEngine';

interface InteractiveBodyMapProps {
  selectedMuscles: MuscleGroupId[];
  onToggleMuscle: (muscle: MuscleGroupId) => void;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  selectedMuscles,
  onToggleMuscle
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'front' | 'back'>('both');
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroupId | null>(null);

  const isSelected = (id: MuscleGroupId) => selectedMuscles.includes(id);

  const getFill = (id: MuscleGroupId) => {
    if (isSelected(id)) return '#09090b'; // Solid dark matte black when selected
    if (hoveredMuscle === id) return '#e4e4e7'; // Light hover preview
    return '#ffffff'; // Default clean white
  };

  const getStroke = (id: MuscleGroupId) => {
    if (isSelected(id)) return '#09090b';
    if (hoveredMuscle === id) return '#71717a';
    return '#d4d4d8';
  };

  const renderFrontView = () => (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-medium">
        Vista Anterior (Frontal)
      </span>
      <svg
        viewBox="0 0 240 420"
        className="w-44 h-72 sm:w-48 sm:h-80 transition-all select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* Head and Neck Base Contour */}
        <g fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1">
          <path d="M 102,22 Q 120,12 138,22 Q 148,45 140,65 Q 120,78 100,65 Q 92,45 102,22 Z" />
          <path d="M 112,65 L 112,82 L 128,82 L 128,65 Z" />
        </g>

        {/* Body Base Silhouette Outline */}
        <path
          d="M 68,88 Q 50,105 56,132 L 40,210 Q 36,225 46,228 Q 58,225 64,208 L 74,155 L 74,214 L 72,320 L 78,396 L 94,400 L 112,398 L 114,260 L 126,260 L 128,398 L 146,400 L 162,396 L 168,320 L 166,214 L 166,155 L 176,208 Q 182,225 194,228 Q 204,225 200,210 L 184,132 Q 190,105 172,88 Z"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* FRONT MUSCLE REGIONS */}
        <g filter="url(#subtle-shadow)">
          {/* SHOULDERS / DELTOIDES (FRONT) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('shoulders')}
            onMouseEnter={() => setHoveredMuscle('shoulders')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 70,85 Q 52,100 58,128 Q 78,122 84,98 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
            <path
              d="M 170,85 Q 188,100 182,128 Q 162,122 156,98 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
          </g>

          {/* CHEST / PECTORAL */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('chest')}
            onMouseEnter={() => setHoveredMuscle('chest')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 86,90 Q 120,94 119,118 Q 118,142 84,136 Q 80,110 86,90 Z"
              fill={getFill('chest')}
              stroke={getStroke('chest')}
              strokeWidth="1.2"
            />
            <path
              d="M 154,90 Q 120,94 121,118 Q 122,142 156,136 Q 160,110 154,90 Z"
              fill={getFill('chest')}
              stroke={getStroke('chest')}
              strokeWidth="1.2"
            />
          </g>

          {/* BICEPS (FRONT) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('biceps')}
            onMouseEnter={() => setHoveredMuscle('biceps')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 57,126 Q 44,152 52,176 Q 66,166 70,135 Z"
              fill={getFill('biceps')}
              stroke={getStroke('biceps')}
              strokeWidth="1.2"
            />
            <path
              d="M 183,126 Q 196,152 188,176 Q 174,166 170,135 Z"
              fill={getFill('biceps')}
              stroke={getStroke('biceps')}
              strokeWidth="1.2"
            />
          </g>

          {/* CORE / ABDOMEN */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('core')}
            onMouseEnter={() => setHoveredMuscle('core')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 94,142 L 146,142 L 142,204 Q 120,212 98,204 Z"
              fill={getFill('core')}
              stroke={getStroke('core')}
              strokeWidth="1.2"
            />
          </g>

          {/* QUADS / CUÁDRICEPS */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('quads')}
            onMouseEnter={() => setHoveredMuscle('quads')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 88,216 Q 117,216 116,252 L 112,318 Q 80,310 74,254 Z"
              fill={getFill('quads')}
              stroke={getStroke('quads')}
              strokeWidth="1.2"
            />
            <path
              d="M 152,216 Q 123,216 124,252 L 128,318 Q 160,310 166,254 Z"
              fill={getFill('quads')}
              stroke={getStroke('quads')}
              strokeWidth="1.2"
            />
          </g>

          {/* CALVES / GEMELOS (FRONT) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('calves')}
            onMouseEnter={() => setHoveredMuscle('calves')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 82,332 Q 106,332 104,392 L 90,394 Q 74,360 82,332 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            <path
              d="M 158,332 Q 134,332 136,392 L 150,394 Q 166,360 158,332 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
          </g>
        </g>
      </svg>
    </div>
  );

  const renderBackView = () => (
    <div className="flex flex-col items-center">
      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-medium">
        Vista Posterior (Dorsal)
      </span>
      <svg
        viewBox="0 0 240 420"
        className="w-44 h-72 sm:w-48 sm:h-80 transition-all select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="subtle-shadow-back" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* Head and Neck Base */}
        <g fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1">
          <path d="M 102,22 Q 120,12 138,22 Q 148,45 140,65 Q 120,78 100,65 Q 92,45 102,22 Z" />
          <path d="M 112,65 L 112,82 L 128,82 L 128,65 Z" />
        </g>

        {/* Body Base Silhouette Outline */}
        <path
          d="M 68,88 Q 50,105 56,132 L 40,210 Q 36,225 46,228 Q 58,225 64,208 L 74,155 L 74,214 L 72,320 L 78,396 L 94,400 L 112,398 L 114,260 L 126,260 L 128,398 L 146,400 L 162,396 L 168,320 L 166,214 L 166,155 L 176,208 Q 182,225 194,228 Q 204,225 200,210 L 184,132 Q 190,105 172,88 Z"
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* BACK MUSCLE REGIONS */}
        <g filter="url(#subtle-shadow-back)">
          {/* UPPER BACK / DORSALES & TRAPECIO */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('back_upper')}
            onMouseEnter={() => setHoveredMuscle('back_upper')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 84,75 Q 120,66 156,75 L 174,142 Q 120,165 66,142 Z"
              fill={getFill('back_upper')}
              stroke={getStroke('back_upper')}
              strokeWidth="1.2"
            />
          </g>

          {/* TRICEPS (BACK) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('triceps')}
            onMouseEnter={() => setHoveredMuscle('triceps')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 54,120 Q 40,148 52,176 Q 66,166 70,135 Z"
              fill={getFill('triceps')}
              stroke={getStroke('triceps')}
              strokeWidth="1.2"
            />
            <path
              d="M 186,120 Q 200,148 188,176 Q 174,166 170,135 Z"
              fill={getFill('triceps')}
              stroke={getStroke('triceps')}
              strokeWidth="1.2"
            />
          </g>

          {/* LOWER BACK / LUMBAR */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('back_lower')}
            onMouseEnter={() => setHoveredMuscle('back_lower')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 90,150 Q 120,156 150,150 L 144,196 Q 120,204 96,196 Z"
              fill={getFill('back_lower')}
              stroke={getStroke('back_lower')}
              strokeWidth="1.2"
            />
          </g>

          {/* GLUTES / GLÚTEOS */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('glutes')}
            onMouseEnter={() => setHoveredMuscle('glutes')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 92,198 Q 119,195 119,214 Q 118,248 86,240 Q 82,216 92,198 Z"
              fill={getFill('glutes')}
              stroke={getStroke('glutes')}
              strokeWidth="1.2"
            />
            <path
              d="M 148,198 Q 121,195 121,214 Q 122,248 154,240 Q 158,216 148,198 Z"
              fill={getFill('glutes')}
              stroke={getStroke('glutes')}
              strokeWidth="1.2"
            />
          </g>

          {/* HAMSTRINGS / ISQUIOTIBIALES */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('hamstrings')}
            onMouseEnter={() => setHoveredMuscle('hamstrings')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 88,246 Q 118,250 116,318 L 86,318 Q 78,280 88,246 Z"
              fill={getFill('hamstrings')}
              stroke={getStroke('hamstrings')}
              strokeWidth="1.2"
            />
            <path
              d="M 152,246 Q 122,250 124,318 L 154,318 Q 162,280 152,246 Z"
              fill={getFill('hamstrings')}
              stroke={getStroke('hamstrings')}
              strokeWidth="1.2"
            />
          </g>

          {/* CALVES / GEMELOS & SÓLEO (BACK) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('calves')}
            onMouseEnter={() => setHoveredMuscle('calves')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 82,332 Q 106,332 104,392 L 90,394 Q 74,360 82,332 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            <path
              d="M 158,332 Q 134,332 136,392 L 150,394 Q 166,360 158,332 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
          </g>
        </g>
      </svg>
    </div>
  );

  return (
    <div className="w-full bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-subtle space-y-4 select-none">
      {/* Top Controls & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900">Mapa Anatómico Interactivo</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600">
            {selectedMuscles.length} / 11 seleccionados
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'both'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Ambas Vistas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('front')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'front'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Frontal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('back')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === 'back'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Dorsal
          </button>
        </div>
      </div>

      {/* Real-time Hovered Muscle Feedback Banner */}
      <div className="h-6 flex items-center justify-center text-center">
        {hoveredMuscle ? (
          <span className="text-xs font-mono font-medium text-zinc-900 animate-fadeIn">
            ✦ {MUSCLE_LABELS_ES[hoveredMuscle]} ·{' '}
            <span className="text-zinc-500">{isSelected(hoveredMuscle) ? 'Clic para desmarcar' : 'Clic para seleccionar'}</span>
          </span>
        ) : (
          <span className="text-[11px] text-zinc-400 font-mono">
            Haz clic directamente en cualquier músculo del cuerpo para incluirlo
          </span>
        )}
      </div>

      {/* Body SVGs Display Area */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 py-2">
        {(activeTab === 'both' || activeTab === 'front') && renderFrontView()}
        {(activeTab === 'both' || activeTab === 'back') && renderBackView()}
      </div>
    </div>
  );
};
