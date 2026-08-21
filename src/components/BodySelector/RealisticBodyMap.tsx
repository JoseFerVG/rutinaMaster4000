import React from 'react';
import { MuscleGroupId, GenderPreference } from '../../types';

interface RealisticBodyMapProps {
  gender: GenderPreference;
  view: 'front' | 'back';
  selectedMuscles: MuscleGroupId[];
  hoveredMuscle: MuscleGroupId | null;
  onToggleMuscle: (muscle: MuscleGroupId) => void;
  onHoverMuscle: (muscle: MuscleGroupId | null) => void;
}

export const RealisticBodyMap: React.FC<RealisticBodyMapProps> = ({
  gender = 'male',
  view = 'front',
  selectedMuscles,
  onToggleMuscle,
  onHoverMuscle
}) => {
  const isSelected = (id: MuscleGroupId) => selectedMuscles.includes(id);

  const getFill = (id: MuscleGroupId) => {
    if (isSelected(id)) return 'url(#zen-active-grad)';
    return 'url(#zen-idle-grad)';
  };

  const getStroke = (id: MuscleGroupId) => {
    if (isSelected(id)) return '#34d399';
    return 'rgba(255, 255, 255, 0.12)';
  };

  const isFemale = gender === 'female';

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg
        viewBox="0 0 240 420"
        className="w-52 h-[340px] md:w-60 md:h-[390px] filter drop-shadow-xl transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Zen Active Emerald Gradient */}
          <linearGradient id="zen-active-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Zen Idle Dark Titanium Gradient */}
          <linearGradient id="zen-idle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2533" />
            <stop offset="100%" stopColor="#121620" />
          </linearGradient>

          {/* Minimalist Ambient Glow */}
          <filter id="zen-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head and Neck Base */}
        <g fill="#0e121a" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.2">
          {/* Head silhouette */}
          <path d={isFemale
            ? "M 105,25 Q 120,15 135,25 Q 145,45 138,62 Q 120,72 102,62 Q 95,45 105,25 Z"
            : "M 102,22 Q 120,12 138,22 Q 148,45 140,65 Q 120,78 100,65 Q 92,45 102,22 Z"}
          />
          {/* Neck */}
          <path d="M 112,65 L 112,82 L 128,82 L 128,65 Z" />
        </g>

        {/* ========================================================================= */}
        {/* FRONT VIEW (VISTA FRONTAL) */}
        {/* ========================================================================= */}
        {view === 'front' && (
          <g>
            {/* SHOULDERS / DELTOIDES */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('shoulders')}
              onMouseEnter={() => onHoverMuscle('shoulders')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('shoulders') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 78,88 Q 62,100 66,122 Q 82,118 86,98 Z"
                  : "M 70,85 Q 52,100 58,128 Q 78,122 84,98 Z"}
                fill={getFill('shoulders')}
                stroke={getStroke('shoulders')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 162,88 Q 178,100 174,122 Q 158,118 154,98 Z"
                  : "M 170,85 Q 188,100 182,128 Q 162,122 156,98 Z"}
                fill={getFill('shoulders')}
                stroke={getStroke('shoulders')}
                strokeWidth="1.2"
              />
            </g>

            {/* CHEST / PECTORAL */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('chest')}
              onMouseEnter={() => onHoverMuscle('chest')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('chest') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 88,94 Q 120,96 119,114 Q 118,138 88,134 Q 82,112 88,94 Z"
                  : "M 86,90 Q 120,94 119,118 Q 118,142 84,136 Q 80,110 86,90 Z"}
                fill={getFill('chest')}
                stroke={getStroke('chest')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 152,94 Q 120,96 121,114 Q 122,138 152,134 Q 158,112 152,94 Z"
                  : "M 154,90 Q 120,94 121,118 Q 122,142 156,136 Q 160,110 154,90 Z"}
                fill={getFill('chest')}
                stroke={getStroke('chest')}
                strokeWidth="1.2"
              />
            </g>

            {/* BICEPS */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('biceps')}
              onMouseEnter={() => onHoverMuscle('biceps')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('biceps') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 64,124 Q 54,146 62,170 Q 74,162 76,136 Z"
                  : "M 56,130 Q 44,156 56,182 Q 72,174 74,142 Z"}
                fill={getFill('biceps')}
                stroke={getStroke('biceps')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 176,124 Q 186,146 178,170 Q 166,162 164,136 Z"
                  : "M 184,130 Q 196,156 184,182 Q 168,174 166,142 Z"}
                fill={getFill('biceps')}
                stroke={getStroke('biceps')}
                strokeWidth="1.2"
              />
            </g>

            {/* CORE / ABDOMEN */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('core')}
              onMouseEnter={() => onHoverMuscle('core')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('core') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 92,140 Q 120,138 148,140 L 140,195 Q 120,205 100,195 Z"
                  : "M 88,142 Q 120,140 152,142 L 146,204 Q 120,214 94,204 Z"}
                fill={getFill('core')}
                stroke={getStroke('core')}
                strokeWidth="1.2"
              />
              {/* Subtle lines */}
              <line x1="120" y1="144" x2="120" y2="198" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="102" y1="162" x2="138" y2="162" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
              <line x1="104" y1="180" x2="136" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
            </g>

            {/* QUADS / CUÁDRICEPS */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('quads')}
              onMouseEnter={() => onHoverMuscle('quads')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('quads') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 92,210 Q 116,210 115,242 L 112,305 Q 86,298 80,248 Z"
                  : "M 88,216 Q 117,216 116,252 L 112,318 Q 80,310 74,254 Z"}
                fill={getFill('quads')}
                stroke={getStroke('quads')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 148,210 Q 124,210 125,242 L 128,305 Q 154,298 160,248 Z"
                  : "M 152,216 Q 123,216 124,252 L 128,318 Q 160,310 166,254 Z"}
                fill={getFill('quads')}
                stroke={getStroke('quads')}
                strokeWidth="1.2"
              />
            </g>

            {/* CALVES (FRONT) */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('calves')}
              onMouseEnter={() => onHoverMuscle('calves')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('calves') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 86,320 Q 108,320 106,380 L 92,382 Q 80,350 86,320 Z"
                  : "M 82,332 Q 106,332 104,392 L 90,394 Q 74,360 82,332 Z"}
                fill={getFill('calves')}
                stroke={getStroke('calves')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 154,320 Q 132,320 134,380 L 148,382 Q 160,350 154,320 Z"
                  : "M 158,332 Q 134,332 136,392 L 150,394 Q 166,360 158,332 Z"}
                fill={getFill('calves')}
                stroke={getStroke('calves')}
                strokeWidth="1.2"
              />
            </g>
          </g>
        )}

        {/* ========================================================================= */}
        {/* BACK VIEW (VISTA POSTERIOR) */}
        {/* ========================================================================= */}
        {view === 'back' && (
          <g>
            {/* UPPER BACK / LATS */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('back_upper')}
              onMouseEnter={() => onHoverMuscle('back_upper')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('back_upper') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 90,78 Q 120,70 150,78 L 164,136 Q 120,154 76,136 Z"
                  : "M 84,75 Q 120,66 156,75 L 174,142 Q 120,165 66,142 Z"}
                fill={getFill('back_upper')}
                stroke={getStroke('back_upper')}
                strokeWidth="1.2"
              />
            </g>

            {/* TRICEPS */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('triceps')}
              onMouseEnter={() => onHoverMuscle('triceps')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('triceps') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 62,118 Q 50,140 58,165 Q 68,155 72,130 Z"
                  : "M 54,120 Q 40,148 52,176 Q 66,166 70,135 Z"}
                fill={getFill('triceps')}
                stroke={getStroke('triceps')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 178,118 Q 190,140 182,165 Q 172,155 168,130 Z"
                  : "M 186,120 Q 200,148 188,176 Q 174,166 170,135 Z"}
                fill={getFill('triceps')}
                stroke={getStroke('triceps')}
                strokeWidth="1.2"
              />
            </g>

            {/* LOWER BACK / LUMBAR */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('back_lower')}
              onMouseEnter={() => onHoverMuscle('back_lower')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('back_lower') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 94,144 Q 120,150 146,144 L 140,185 Q 120,192 100,185 Z"
                  : "M 90,150 Q 120,156 150,150 L 144,196 Q 120,204 96,196 Z"}
                fill={getFill('back_lower')}
                stroke={getStroke('back_lower')}
                strokeWidth="1.2"
              />
            </g>

            {/* GLUTES */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('glutes')}
              onMouseEnter={() => onHoverMuscle('glutes')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('glutes') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 92,188 Q 119,185 119,204 Q 118,240 82,232 Q 78,206 92,188 Z"
                  : "M 92,198 Q 119,195 119,214 Q 118,248 86,240 Q 82,216 92,198 Z"}
                fill={getFill('glutes')}
                stroke={getStroke('glutes')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 148,188 Q 121,185 121,204 Q 122,240 158,232 Q 162,206 148,188 Z"
                  : "M 148,198 Q 121,195 121,214 Q 122,248 154,240 Q 158,216 148,198 Z"}
                fill={getFill('glutes')}
                stroke={getStroke('glutes')}
                strokeWidth="1.2"
              />
            </g>

            {/* HAMSTRINGS */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('hamstrings')}
              onMouseEnter={() => onHoverMuscle('hamstrings')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('hamstrings') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 86,238 Q 117,242 115,305 L 88,305 Q 80,270 86,238 Z"
                  : "M 88,246 Q 118,250 116,318 L 86,318 Q 78,280 88,246 Z"}
                fill={getFill('hamstrings')}
                stroke={getStroke('hamstrings')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 154,238 Q 123,242 125,305 L 152,305 Q 160,270 154,238 Z"
                  : "M 152,246 Q 122,250 124,318 L 154,318 Q 162,280 152,246 Z"}
                fill={getFill('hamstrings')}
                stroke={getStroke('hamstrings')}
                strokeWidth="1.2"
              />
            </g>

            {/* CALVES (BACK) */}
            <g
              className="cursor-pointer transition-all duration-200"
              onClick={() => onToggleMuscle('calves')}
              onMouseEnter={() => onHoverMuscle('calves')}
              onMouseLeave={() => onHoverMuscle(null)}
              filter={isSelected('calves') ? 'url(#zen-glow)' : undefined}
            >
              <path
                d={isFemale
                  ? "M 86,320 Q 108,320 106,380 L 92,382 Q 80,350 86,320 Z"
                  : "M 82,332 Q 106,332 104,392 L 90,394 Q 74,360 82,332 Z"}
                fill={getFill('calves')}
                stroke={getStroke('calves')}
                strokeWidth="1.2"
              />
              <path
                d={isFemale
                  ? "M 154,320 Q 132,320 134,380 L 148,382 Q 160,350 154,320 Z"
                  : "M 158,332 Q 134,332 136,392 L 150,394 Q 166,360 158,332 Z"}
                fill={getFill('calves')}
                stroke={getStroke('calves')}
                strokeWidth="1.2"
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
