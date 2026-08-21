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
    if (hoveredMuscle === id) return '#f4f4f5'; // Light hover preview
    return '#ffffff'; // Default clean white
  };

  const getStroke = (id: MuscleGroupId) => {
    if (isSelected(id)) return '#09090b';
    if (hoveredMuscle === id) return '#52525b';
    return '#a1a1aa';
  };

  const getDetailStroke = (id: MuscleGroupId) => {
    if (isSelected(id)) return 'rgba(255, 255, 255, 0.35)'; // White subtle striation lines on selected
    return 'rgba(0, 0, 0, 0.12)'; // Light charcoal striation lines on unselected
  };

  const renderFrontView = () => (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
          Vista Anterior (Frontal)
        </span>
      </div>

      <svg
        viewBox="0 0 280 500"
        className="w-48 h-80 sm:w-56 sm:h-96 transition-all select-none drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="subtle-shadow-front" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Global Anatomical Silhouette Backdrop */}
        <g fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2">
          {/* Head & Cranium */}
          <path d="M 140,24 C 158,24 168,40 165,62 C 162,80 150,92 140,94 C 130,92 118,80 115,62 C 112,40 122,24 140,24 Z" />
          {/* Neck & Trapezius slope */}
          <path d="M 126,80 L 112,108 L 168,108 L 154,80 Z" />
          {/* Hands & Forearms Silhouette */}
          <path d="M 44,220 C 38,248 36,278 40,296 C 42,304 48,304 52,296 C 58,278 62,248 64,222 Z" />
          <path d="M 236,220 C 242,248 244,278 240,296 C 238,304 232,304 228,296 C 222,278 218,248 216,222 Z" />
          {/* Feet */}
          <path d="M 80,474 C 74,484 76,494 88,495 C 100,495 106,488 104,474 Z" />
          <path d="M 200,474 C 206,484 204,494 192,495 C 180,495 174,488 176,474 Z" />
        </g>

        {/* ANATOMICAL MUSCLE GROUPS (FRONT) */}
        <g filter="url(#subtle-shadow-front)">
          {/* 1. SHOULDERS / DELTOIDES (ANTERIOR & LATERAL HEADS) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('shoulders')}
            onMouseEnter={() => setHoveredMuscle('shoulders')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Deltoid */}
            <path
              d="M 80,112 C 58,118 46,138 52,168 C 60,178 74,172 78,148 C 82,134 84,122 80,112 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
            {/* Left Deltoid Head Striation */}
            <path d="M 68,122 C 64,142 66,162 70,170" stroke={getDetailStroke('shoulders')} strokeWidth="1" fill="none" />

            {/* Right Deltoid */}
            <path
              d="M 200,112 C 222,118 234,138 228,168 C 220,178 206,172 202,148 C 198,134 196,122 200,112 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
            {/* Right Deltoid Head Striation */}
            <path d="M 212,122 C 216,142 214,162 210,170" stroke={getDetailStroke('shoulders')} strokeWidth="1" fill="none" />
          </g>

          {/* 2. CHEST / PECTORALIS MAJOR (CLAVICULAR & STERNAL HEADS) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('chest')}
            onMouseEnter={() => setHoveredMuscle('chest')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Pectoral */}
            <path
              d="M 138,110 C 108,110 82,120 80,138 C 78,162 104,174 138,172 L 138,110 Z"
              fill={getFill('chest')}
              stroke={getStroke('chest')}
              strokeWidth="1.2"
            />
            {/* Left Pectoral Clavicular Division */}
            <path d="M 88,126 C 108,130 126,132 138,132" stroke={getDetailStroke('chest')} strokeWidth="1" fill="none" />
            <path d="M 94,146 C 112,150 128,152 138,152" stroke={getDetailStroke('chest')} strokeWidth="1" fill="none" />

            {/* Right Pectoral */}
            <path
              d="M 142,110 C 172,110 198,120 200,138 C 202,162 176,174 142,172 L 142,110 Z"
              fill={getFill('chest')}
              stroke={getStroke('chest')}
              strokeWidth="1.2"
            />
            {/* Right Pectoral Clavicular Division */}
            <path d="M 192,126 C 172,130 154,132 142,132" stroke={getDetailStroke('chest')} strokeWidth="1" fill="none" />
            <path d="M 186,146 C 168,150 152,152 142,152" stroke={getDetailStroke('chest')} strokeWidth="1" fill="none" />
          </g>

          {/* 3. BICEPS BRACHII */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('biceps')}
            onMouseEnter={() => setHoveredMuscle('biceps')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Biceps */}
            <path
              d="M 54,168 C 42,192 46,220 60,224 C 70,224 76,202 74,174 C 72,170 62,168 54,168 Z"
              fill={getFill('biceps')}
              stroke={getStroke('biceps')}
              strokeWidth="1.2"
            />
            <path d="M 52,192 C 58,198 68,198 72,192" stroke={getDetailStroke('biceps')} strokeWidth="1" fill="none" />

            {/* Right Biceps */}
            <path
              d="M 226,168 C 238,192 234,220 220,224 C 210,224 204,202 206,174 C 208,170 218,168 226,168 Z"
              fill={getFill('biceps')}
              stroke={getStroke('biceps')}
              strokeWidth="1.2"
            />
            <path d="M 228,192 C 222,198 212,198 208,192" stroke={getDetailStroke('biceps')} strokeWidth="1" fill="none" />
          </g>

          {/* 4. CORE / RECTUS ABDOMINIS & SERRATUS / OBLIQUES */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('core')}
            onMouseEnter={() => setHoveredMuscle('core')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Core Full Base Region */}
            <path
              d="M 94,176 L 140,174 L 186,176 L 182,246 C 172,252 140,256 98,246 Z"
              fill={getFill('core')}
              stroke={getStroke('core')}
              strokeWidth="1.2"
            />
            {/* Linea Alba (Vertical Midline) */}
            <path d="M 140,174 L 140,254" stroke={getDetailStroke('core')} strokeWidth="1.2" fill="none" />
            {/* Horizontal Inscriptiones Tendineae (6-Pack Segments) */}
            <path d="M 112,198 L 168,198" stroke={getDetailStroke('core')} strokeWidth="1" fill="none" />
            <path d="M 114,222 L 166,222" stroke={getDetailStroke('core')} strokeWidth="1" fill="none" />
            {/* External Oblique & Serratus Flank Contours */}
            <path d="M 96,186 C 104,196 104,234 98,246" stroke={getDetailStroke('core')} strokeWidth="1" fill="none" />
            <path d="M 184,186 C 176,196 176,234 182,246" stroke={getDetailStroke('core')} strokeWidth="1" fill="none" />
          </g>

          {/* 5. QUADS / CUÁDRICEPS (RECTUS FEMORIS, VASTUS LATERALIS, VASTUS MEDIALIS) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('quads')}
            onMouseEnter={() => setHoveredMuscle('quads')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Quad Group */}
            <path
              d="M 96,252 C 72,266 66,316 74,372 C 84,382 104,384 108,368 L 128,272 C 112,256 104,252 96,252 Z"
              fill={getFill('quads')}
              stroke={getStroke('quads')}
              strokeWidth="1.2"
            />
            {/* Left Vastus Lateralis Outer Curve */}
            <path d="M 76,282 C 72,322 78,356 86,374" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />
            {/* Left Vastus Medialis (Teardrop) */}
            <path d="M 104,334 C 114,346 112,366 106,372" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />
            {/* Left Patella (Knee Cap) */}
            <circle cx="94" cy="386" r="5" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />

            {/* Right Quad Group */}
            <path
              d="M 184,252 C 208,266 214,316 206,372 C 196,382 176,384 172,368 L 152,272 C 168,256 176,252 184,252 Z"
              fill={getFill('quads')}
              stroke={getStroke('quads')}
              strokeWidth="1.2"
            />
            {/* Right Vastus Lateralis Outer Curve */}
            <path d="M 204,282 C 208,322 202,356 194,374" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />
            {/* Right Vastus Medialis (Teardrop) */}
            <path d="M 176,334 C 166,346 168,366 174,372" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />
            {/* Right Patella (Knee Cap) */}
            <circle cx="186" cy="386" r="5" stroke={getDetailStroke('quads')} strokeWidth="1" fill="none" />
          </g>

          {/* 6. CALVES & TIBIALIS ANTERIOR (FRONT) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('calves')}
            onMouseEnter={() => setHoveredMuscle('calves')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Calf / Shin */}
            <path
              d="M 80,398 C 66,420 70,458 86,474 C 98,474 104,456 100,422 L 96,398 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            <path d="M 86,412 C 80,432 82,456 88,468" stroke={getDetailStroke('calves')} strokeWidth="1" fill="none" />

            {/* Right Calf / Shin */}
            <path
              d="M 200,398 C 214,420 210,458 194,474 C 182,474 176,456 180,422 L 184,398 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            <path d="M 194,412 C 200,432 198,456 192,468" stroke={getDetailStroke('calves')} strokeWidth="1" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );

  const renderBackView = () => (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
          Vista Posterior (Dorsal)
        </span>
      </div>

      <svg
        viewBox="0 0 280 500"
        className="w-48 h-80 sm:w-56 sm:h-96 transition-all select-none drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="subtle-shadow-back" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Global Anatomical Silhouette Backdrop */}
        <g fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2">
          {/* Head & Neck Posterior */}
          <path d="M 140,24 C 158,24 168,40 165,62 C 162,80 150,92 140,94 C 130,92 118,80 115,62 C 112,40 122,24 140,24 Z" />
          {/* Hands & Forearms Silhouette */}
          <path d="M 44,220 C 38,248 36,278 40,296 C 42,304 48,304 52,296 C 58,278 62,248 64,222 Z" />
          <path d="M 236,220 C 242,248 244,278 240,296 C 238,304 232,304 228,296 C 222,278 218,248 216,222 Z" />
          {/* Feet */}
          <path d="M 80,474 C 74,484 76,494 88,495 C 100,495 106,488 104,474 Z" />
          <path d="M 200,474 C 206,484 204,494 192,495 C 180,495 174,488 176,474 Z" />
        </g>

        {/* ANATOMICAL MUSCLE GROUPS (BACK) */}
        <g filter="url(#subtle-shadow-back)">
          {/* 1. UPPER BACK / TRAPEZIUS, RHOMBOIDS & LATISSIMUS DORSI (DORSALES) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('back_upper')}
            onMouseEnter={() => setHoveredMuscle('back_upper')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Upper Back V-Taper Structure */}
            <path
              d="M 140,84 C 162,84 186,102 202,116 C 206,142 186,192 168,206 L 140,214 L 112,206 C 94,192 74,142 78,116 C 94,102 118,84 140,84 Z"
              fill={getFill('back_upper')}
              stroke={getStroke('back_upper')}
              strokeWidth="1.2"
            />
            {/* Trapezius Diamond Neck Attachment */}
            <path d="M 126,86 L 140,126 L 154,86" stroke={getDetailStroke('back_upper')} strokeWidth="1" fill="none" />
            <path d="M 140,126 L 140,178" stroke={getDetailStroke('back_upper')} strokeWidth="1.2" fill="none" />
            {/* Scapular / Infraspinatus Wings */}
            <path d="M 102,126 C 118,142 134,146 140,146 C 146,146 162,142 178,126" stroke={getDetailStroke('back_upper')} strokeWidth="1" fill="none" />
            {/* Latissimus Dorsi Sweeping Fibers */}
            <path d="M 88,146 C 108,168 126,186 140,188 C 154,186 172,168 192,146" stroke={getDetailStroke('back_upper')} strokeWidth="1" fill="none" />
          </g>

          {/* 2. REAR DELTOIDS (POSTERIOR DELTOID) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('shoulders')}
            onMouseEnter={() => setHoveredMuscle('shoulders')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Rear Deltoid */}
            <path
              d="M 78,114 C 60,120 48,136 52,164 C 60,172 70,166 76,144 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
            {/* Right Rear Deltoid */}
            <path
              d="M 202,114 C 220,120 232,136 228,164 C 220,172 210,166 204,144 Z"
              fill={getFill('shoulders')}
              stroke={getStroke('shoulders')}
              strokeWidth="1.2"
            />
          </g>

          {/* 3. TRICEPS (LONG, LATERAL & MEDIAL HEADS) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('triceps')}
            onMouseEnter={() => setHoveredMuscle('triceps')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Triceps Horseshoe */}
            <path
              d="M 52,146 C 40,172 44,206 58,216 C 68,216 76,198 74,170 Z"
              fill={getFill('triceps')}
              stroke={getStroke('triceps')}
              strokeWidth="1.2"
            />
            <path d="M 56,168 C 62,176 66,176 72,168" stroke={getDetailStroke('triceps')} strokeWidth="1" fill="none" />

            {/* Right Triceps Horseshoe */}
            <path
              d="M 228,146 C 240,172 236,206 222,216 C 212,216 204,198 206,170 Z"
              fill={getFill('triceps')}
              stroke={getStroke('triceps')}
              strokeWidth="1.2"
            />
            <path d="M 224,168 C 218,176 214,176 208,168" stroke={getDetailStroke('triceps')} strokeWidth="1" fill="none" />
          </g>

          {/* 4. LOWER BACK / LUMBAR (ERECTOR SPINAE & THORACOLUMBAR FASCIA) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('back_lower')}
            onMouseEnter={() => setHoveredMuscle('back_lower')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            <path
              d="M 114,208 L 166,208 L 160,252 C 140,258 120,258 120,252 Z"
              fill={getFill('back_lower')}
              stroke={getStroke('back_lower')}
              strokeWidth="1.2"
            />
            {/* Spinal Column & Erector Columns */}
            <path d="M 140,208 L 140,256" stroke={getDetailStroke('back_lower')} strokeWidth="1.2" fill="none" />
            <path d="M 128,214 C 130,232 130,246 132,254" stroke={getDetailStroke('back_lower')} strokeWidth="1" fill="none" />
            <path d="M 152,214 C 150,232 150,246 148,254" stroke={getDetailStroke('back_lower')} strokeWidth="1" fill="none" />
          </g>

          {/* 5. GLUTES / GLUTEUS MAXIMUS & MEDIUS */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('glutes')}
            onMouseEnter={() => setHoveredMuscle('glutes')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Glute */}
            <path
              d="M 138,252 C 104,250 84,272 88,308 C 92,330 126,332 138,298 Z"
              fill={getFill('glutes')}
              stroke={getStroke('glutes')}
              strokeWidth="1.2"
            />
            {/* Left Gluteus Medius Upper Ridge */}
            <path d="M 98,266 C 112,274 126,278 138,278" stroke={getDetailStroke('glutes')} strokeWidth="1" fill="none" />

            {/* Right Glute */}
            <path
              d="M 142,252 C 176,250 196,272 192,308 C 188,330 154,332 142,298 Z"
              fill={getFill('glutes')}
              stroke={getStroke('glutes')}
              strokeWidth="1.2"
            />
            {/* Right Gluteus Medius Upper Ridge */}
            <path d="M 182,266 C 168,274 154,278 142,278" stroke={getDetailStroke('glutes')} strokeWidth="1" fill="none" />
          </g>

          {/* 6. HAMSTRINGS / ISQUIOTIBIALES (BICEPS FEMORIS & SEMITENDINOSUS) */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('hamstrings')}
            onMouseEnter={() => setHoveredMuscle('hamstrings')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Hamstrings */}
            <path
              d="M 92,316 C 80,342 84,380 94,394 L 126,394 C 134,380 138,342 134,316 Z"
              fill={getFill('hamstrings')}
              stroke={getStroke('hamstrings')}
              strokeWidth="1.2"
            />
            {/* Left Biceps Femoris vs Semitendinosus Division Line */}
            <path d="M 110,324 L 110,388" stroke={getDetailStroke('hamstrings')} strokeWidth="1" fill="none" />

            {/* Right Hamstrings */}
            <path
              d="M 188,316 C 200,342 196,380 186,394 L 154,394 C 146,380 142,342 146,316 Z"
              fill={getFill('hamstrings')}
              stroke={getStroke('hamstrings')}
              strokeWidth="1.2"
            />
            {/* Right Biceps Femoris vs Semitendinosus Division Line */}
            <path d="M 170,324 L 170,388" stroke={getDetailStroke('hamstrings')} strokeWidth="1" fill="none" />
          </g>

          {/* 7. CALVES / GASTROCNEMIUS (MEDIAL/LATERAL HEADS) & ACHILLES TENDON */}
          <g
            className="cursor-pointer transition-colors"
            onClick={() => onToggleMuscle('calves')}
            onMouseEnter={() => setHoveredMuscle('calves')}
            onMouseLeave={() => setHoveredMuscle(null)}
          >
            {/* Left Gastrocnemius */}
            <path
              d="M 82,398 C 66,420 70,458 86,474 C 98,474 104,456 100,422 L 96,398 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            {/* Left Calf Medial/Lateral Division & Achilles */}
            <path d="M 88,406 C 90,424 92,446 92,472" stroke={getDetailStroke('calves')} strokeWidth="1" fill="none" />

            {/* Right Gastrocnemius */}
            <path
              d="M 198,398 C 214,420 210,458 194,474 C 182,474 176,456 180,422 L 184,398 Z"
              fill={getFill('calves')}
              stroke={getStroke('calves')}
              strokeWidth="1.2"
            />
            {/* Right Calf Medial/Lateral Division & Achilles */}
            <path d="M 192,406 C 190,424 188,446 188,472" stroke={getDetailStroke('calves')} strokeWidth="1" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );

  return (
    <div role="region" aria-label="Mapa Anatómico Interactivo" className="w-full bg-white border border-zinc-200/90 rounded-2xl p-4 sm:p-6 shadow-subtle space-y-4 select-none">
      {/* Top Controls & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900">Mapa Anatómico Biomecánico de Alta Definición</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium">
            {selectedMuscles.length} / 11 seleccionados
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div role="tablist" aria-label="Vistas del mapa corporal" className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200/60">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'both'}
            onClick={() => setActiveTab('both')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              activeTab === 'both'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Ambas Vistas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'front'}
            onClick={() => setActiveTab('front')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              activeTab === 'front'
                ? 'bg-white text-zinc-950 shadow-sm font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Frontal
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'back'}
            onClick={() => setActiveTab('back')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
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
