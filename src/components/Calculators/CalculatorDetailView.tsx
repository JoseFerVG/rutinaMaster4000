import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { useAppStore, ToolId } from '../../store/useAppStore';
import {
  calculateReadiness,
  calculateSleepCycles,
  calculateMacros,
  calculateDeadlift1RM,
  calculateBenchPress1RM,
  calculateCaffeineDosage,
  calculateDetailedTDEE,
  calculateWaterRequirement,
  calculateBodyFatSkinfolds,
  calculateHeartRateZones,
  calculateCreatineDosage,
  calculateMagnesiumRequirements,
  CalorieGoal
} from '../../utils/calculatorsEngine';

interface CalculatorDetailViewProps {
  toolId: ToolId;
}

export const CalculatorDetailView: React.FC<CalculatorDetailViewProps> = ({ toolId }) => {
  const { goToCategory } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Helper for copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. Readiness
  const [readinessSleep, setReadinessSleep] = useState(8);
  const [readinessDOMS, setReadinessDOMS] = useState(3);
  const [readinessStress, setReadinessStress] = useState(3);
  const [readinessFatigue, setReadinessFatigue] = useState(4);

  // 2. Sleep
  const [sleepMode, setSleepMode] = useState<'bedtime_for_target_wake' | 'wake_times_from_now'>('bedtime_for_target_wake');
  const [targetWakeTime, setTargetWakeTime] = useState('07:00');

  // 3. Macros
  const [macroWeight, setMacroWeight] = useState(75);
  const [macroHeight, setMacroHeight] = useState(175);
  const [macroAge, setMacroAge] = useState(26);
  const [macroGender, setMacroGender] = useState<'male' | 'female'>('male');
  const [macroActivity, setMacroActivity] = useState(1.55);
  const [macroGoal, setMacroGoal] = useState<CalorieGoal>('volumen_limpio');

  // 4. Deadlift 1RM
  const [dlWeight, setDlWeight] = useState(140);
  const [dlReps, setDlReps] = useState(5);

  // 5. Bench Press 1RM
  const [bpWeight, setBpWeight] = useState(100);
  const [bpReps, setBpReps] = useState(5);

  // 6. Caffeine
  const [caffeineWeight, setCaffeineWeight] = useState(75);
  const [caffeineTolerance, setCaffeineTolerance] = useState<'low_naive' | 'moderate_habitual' | 'high_habituated'>('moderate_habitual');

  // 7. TDEE
  const [tdeeWeight, setTdeeWeight] = useState(75);
  const [tdeeSteps, setTdeeSteps] = useState(10000);
  const [tdeeHours, setTdeeHours] = useState(5);
  const [tdeeIntensity, setTdeeIntensity] = useState<'low' | 'moderate' | 'high_metcon'>('moderate');

  // 8. Water
  const [waterWeight, setWaterWeight] = useState(75);
  const [waterTrainingMin, setWaterTrainingMin] = useState(60);
  const [waterClimate, setWaterClimate] = useState<'temperate' | 'hot_humid' | 'very_hot_desert'>('temperate');

  // 9. Skinfolds
  const [skinfoldGender, setSkinfoldGender] = useState<'male' | 'female'>('male');
  const [skinfoldAge, setSkinfoldAge] = useState(25);
  const [skinfoldWeight, setSkinfoldWeight] = useState(75);
  const [chestMm, setChestMm] = useState(8);
  const [abdomenMm, setAbdomenMm] = useState(14);
  const [thighMm, setThighMm] = useState(12);
  const [tricepsMm, setTricepsMm] = useState(10);
  const [suprailiacMm, setSuprailiacMm] = useState(12);

  // 10. Heart Rate
  const [hrAge, setHrAge] = useState(28);
  const [hrResting, setHrResting] = useState<number | undefined>(55);

  // 11. Creatine
  const [creatineWeight, setCreatineWeight] = useState(75);
  const [creatineStrategy, setCreatineStrategy] = useState<'fast_loading' | 'direct_maintenance'>('direct_maintenance');

  // 12. Magnesium
  const [magAge, setMagAge] = useState(28);
  const [magGender, setMagGender] = useState<'male' | 'female'>('male');
  const [magAthlete, setMagAthlete] = useState(true);

  // RENDER CALCULATOR CONTENT
  const renderCalculator = () => {
    switch (toolId) {
      // -------------------------------------------------------------
      // 1. READINESS / HOOPER
      // -------------------------------------------------------------
      case 'calc_readiness': {
        const result = calculateReadiness({
          sleepQuality: readinessSleep,
          muscleSoreness: readinessDOMS,
          stressLevel: readinessStress,
          fatigueLevel: readinessFatigue
        });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Escalas Psicométricas Diarias
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Calidad de Sueño (1-10)</span>
                      <span className="font-mono text-zinc-900">{readinessSleep}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      aria-label="Calidad de Sueño de 1 a 10"
                      value={readinessSleep}
                      onChange={(e) => setReadinessSleep(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>1: Pésimo</span>
                      <span>10: Excelente</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Dolor Muscular / DOMS (1-10)</span>
                      <span className="font-mono text-zinc-900">{readinessDOMS}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      aria-label="Dolor Muscular DOMS de 1 a 10"
                      value={readinessDOMS}
                      onChange={(e) => setReadinessDOMS(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400">
                      <span>1: Sin Dolor</span>
                      <span>10: Dolor Extremo</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Estrés General (1-10)</span>
                      <span className="font-mono text-zinc-900">{readinessStress}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      aria-label="Nivel de Estrés de 1 a 10"
                      value={readinessStress}
                      onChange={(e) => setReadinessStress(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Fatiga / Agotamiento (1-10)</span>
                      <span className="font-mono text-zinc-900">{readinessFatigue}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      aria-label="Nivel de Fatiga de 1 a 10"
                      value={readinessFatigue}
                      onChange={(e) => setReadinessFatigue(Number(e.target.value))}
                      className="w-full accent-zinc-900 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-elevated">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      ESTADO DE READINESS
                    </span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700">
                      Hooper: {result.hooperIndex}/40
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-5xl font-mono font-bold tracking-tight">
                      {result.readinessScore}%
                    </div>
                    <div className="text-sm font-semibold text-zinc-200">
                      {result.recoveryState}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1.5 leading-relaxed">
                    <div className="flex items-center gap-1.5 text-zinc-100 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Prescripción para la Sesión:</span>
                    </div>
                    <p>{result.actionableAdjustment}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono">Factor Carga: x{result.recommendedIntensityMultiplier}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`Readiness Score: ${result.readinessScore}% | ${result.recoveryState} | ${result.actionableAdjustment}`)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 2. SLEEP CYCLES
      // -------------------------------------------------------------
      case 'calc_sleep': {
        const result = calculateSleepCycles({
          mode: sleepMode,
          targetTime: targetWakeTime,
          sleepLatencyMinutes: 14
        });

        return (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-5">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                <button
                  type="button"
                  onClick={() => setSleepMode('bedtime_for_target_wake')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    sleepMode === 'bedtime_for_target_wake' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  Quiero despertarme a las...
                </button>
                <button
                  type="button"
                  onClick={() => setSleepMode('wake_times_from_now')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    sleepMode === 'wake_times_from_now' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  Me voy a dormir ahora
                </button>
              </div>

              {sleepMode === 'bedtime_for_target_wake' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
                  <label className="font-semibold text-zinc-900">Hora de despertar deseada:</label>
                  <input
                    type="time"
                    value={targetWakeTime}
                    onChange={(e) => setTargetWakeTime(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 font-mono text-sm font-bold bg-zinc-50"
                  />
                </div>
              )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {result.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    opt.recommended
                      ? 'bg-zinc-950 text-white border-zinc-900 shadow-elevated'
                      : 'bg-white text-zinc-900 border-zinc-200/90 shadow-subtle'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      opt.recommended ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {opt.cyclesCount} Ciclos ({opt.totalSleepHours}h)
                    </span>
                    <div className="text-3xl font-mono font-bold tracking-tight pt-2">
                      {opt.formattedTime}
                    </div>
                  </div>
                  <div className={`text-xs ${opt.recommended ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {opt.qualityTag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 3. CALORIES & MACROS
      // -------------------------------------------------------------
      case 'calc_macros': {
        const result = calculateMacros({
          weightKg: macroWeight,
          heightCm: macroHeight,
          ageYears: macroAge,
          gender: macroGender,
          activityFactor: macroActivity,
          goal: macroGoal
        });

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
              <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                Parámetros Fisiológicos
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={macroWeight}
                    onChange={(e) => setMacroWeight(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={macroHeight}
                    onChange={(e) => setMacroHeight(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={macroAge}
                    onChange={(e) => setMacroAge(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">Sexo Biológico</label>
                  <select
                    value={macroGender}
                    onChange={(e) => setMacroGender(e.target.value as any)}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                  >
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-600 block mb-1">Factor de Actividad</label>
                <select
                  value={macroActivity}
                  onChange={(e) => setMacroActivity(Number(e.target.value))}
                  className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                >
                  <option value={1.2}>Sedentario (1.20)</option>
                  <option value={1.375}>Ligero (1-3 días/sem) (1.375)</option>
                  <option value={1.55}>Moderado (3-5 días/sem) (1.55)</option>
                  <option value={1.725}>Intenso (6-7 días/sem) (1.725)</option>
                  <option value={1.9}>Atleta Profesional / Doble sesión (1.90)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-600 block mb-1">Objetivo Calórico</label>
                <select
                  value={macroGoal}
                  onChange={(e) => setMacroGoal(e.target.value as any)}
                  className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                >
                  <option value="definicion_agresiva">Definición Agresiva (-25%)</option>
                  <option value="definicion_moderada">Definición Moderada (-15%)</option>
                  <option value="mantenimiento">Mantenimiento Normocalórico (0%)</option>
                  <option value="volumen_limpio">Volumen Limpio / Superávit (+10%)</option>
                  <option value="volumen_agresivo">Volumen Agresivo (+20%)</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-elevated">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    PRESCRIPIÓN NUTRICIONAL
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    TDEE: {result.tdeeKcal} kcal
                  </span>
                </div>

                <div>
                  <div className="text-4xl font-mono font-bold tracking-tight">
                    {result.targetKcal} <span className="text-lg font-sans font-normal text-zinc-400">kcal / día</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Proteínas</span>
                    <span className="text-base font-mono font-bold text-white block">{result.macros.proteinGrams}g</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{result.macros.proteinGramsPerKg} g/kg</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Grasas</span>
                    <span className="text-base font-mono font-bold text-white block">{result.macros.fatGrams}g</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{result.macros.fatPercentage}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">Carbos</span>
                    <span className="text-base font-mono font-bold text-white block">{result.macros.carbGrams}g</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{result.macros.carbKcal} kcal</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(`Calorías: ${result.targetKcal} kcal | P: ${result.macros.proteinGrams}g | G: ${result.macros.fatGrams}g | C: ${result.macros.carbGrams}g`)}
                className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Distribución'}</span>
              </button>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 4. DEADLIFT 1RM
      // -------------------------------------------------------------
      case 'calc_deadlift_1rm': {
        const result = calculateDeadlift1RM({ weightLiftedKg: dlWeight, repetitions: dlReps });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Carga & Repeticiones
                </h3>
                <div>
                  <label className="text-zinc-600 block mb-1">Peso Levantado (kg)</label>
                  <input
                    type="number"
                    value={dlWeight}
                    onChange={(e) => setDlWeight(Number(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Repeticiones Efectivas</span>
                    <span className="font-mono text-zinc-900">{dlReps} reps</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dlReps}
                    onChange={(e) => setDlReps(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    1RM ESTIMADO (EPLEY / BRZYCKI)
                  </span>
                  <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                    {result.weightedEstimated1RMKg} <span className="text-xl font-normal text-zinc-400">kg</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    Epley: {result.epley1RMKg} kg | Brzycki: {result.brzycki1RMKg} kg
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(`1RM Peso Muerto: ${result.weightedEstimated1RMKg} kg (con base en ${dlWeight}kg x ${dlReps})`)}
                  className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar 1RM'}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-subtle space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-700">
                Tabla de Porcentajes de Trabajo
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {result.percentageTable.map((p) => (
                  <div key={p.percentage} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="font-mono text-[10px] text-zinc-400 block">{p.percentage}% 1RM</span>
                    <span className="text-base font-mono font-bold text-zinc-900 block">{p.weightKg} kg</span>
                    <span className="text-[10px] text-zinc-500">~{p.estimatedRepsMax} reps</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 5. BENCH PRESS 1RM
      // -------------------------------------------------------------
      case 'calc_bench_1rm': {
        const result = calculateBenchPress1RM({ weightLiftedKg: bpWeight, repetitions: bpReps });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Carga & Repeticiones
                </h3>
                <div>
                  <label className="text-zinc-600 block mb-1">Peso Levantado (kg)</label>
                  <input
                    type="number"
                    value={bpWeight}
                    onChange={(e) => setBpWeight(Number(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 font-semibold">
                    <span>Repeticiones</span>
                    <span className="font-mono text-zinc-900">{bpReps} reps</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={bpReps}
                    onChange={(e) => setBpReps(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    1RM PRESS BANCA (CONSENSO TRIPARTITO)
                  </span>
                  <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                    {result.consensusEstimated1RMKg} <span className="text-xl font-normal text-zinc-400">kg</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Epley: {result.epley1RMKg}kg · Brzycki: {result.brzycki1RMKg}kg · Wathan: {result.wathan1RMKg}kg
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(`1RM Press Banca: ${result.consensusEstimated1RMKg} kg`)}
                  className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar 1RM'}</span>
                </button>
              </div>
            </div>

            {/* Zones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-zinc-200/90 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold">
                  Fuerza Máxima (85-100%)
                </span>
                <div className="text-lg font-mono font-bold text-zinc-900">
                  {result.zonesBreakdown.maxStrengthZone.minKg} - {result.zonesBreakdown.maxStrengthZone.maxKg} kg
                </div>
                <p className="text-[11px] text-zinc-500">{result.zonesBreakdown.maxStrengthZone.setsRepsRecommendation}</p>
              </div>

              <div className="bg-white border border-zinc-200/90 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold">
                  Hipertrofia (65-85%)
                </span>
                <div className="text-lg font-mono font-bold text-zinc-900">
                  {result.zonesBreakdown.hypertrophyZone.minKg} - {result.zonesBreakdown.hypertrophyZone.maxKg} kg
                </div>
                <p className="text-[11px] text-zinc-500">{result.zonesBreakdown.hypertrophyZone.setsRepsRecommendation}</p>
              </div>

              <div className="bg-white border border-zinc-200/90 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold">
                  Resistencia (&lt;65%)
                </span>
                <div className="text-lg font-mono font-bold text-zinc-900">
                  {result.zonesBreakdown.muscularEnduranceZone.minKg} - {result.zonesBreakdown.muscularEnduranceZone.maxKg} kg
                </div>
                <p className="text-[11px] text-zinc-500">{result.zonesBreakdown.muscularEnduranceZone.setsRepsRecommendation}</p>
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 6. CAFFEINE
      // -------------------------------------------------------------
      case 'calc_caffeine': {
        const result = calculateCaffeineDosage({ weightKg: caffeineWeight, toleranceLevel: caffeineTolerance });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Datos del Atleta
                </h3>
                <div>
                  <label className="text-zinc-600 block mb-1">Peso Corporal (kg)</label>
                  <input
                    type="number"
                    value={caffeineWeight}
                    onChange={(e) => setCaffeineWeight(Number(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">Nivel de Tolerancia / Habituación</label>
                  <select
                    value={caffeineTolerance}
                    onChange={(e) => setCaffeineTolerance(e.target.value as any)}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                  >
                    <option value="low_naive">Baja / Sensible (sin hábito)</option>
                    <option value="moderate_habitual">Moderada / Consumidor Habitual</option>
                    <option value="high_habituated">Alta / Alta Tolerancia</option>
                  </select>
                </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    DOSIS ERGOGÉNICA PRE-ENTRENO (ISSN)
                  </span>
                  <div className="text-4xl font-mono font-bold tracking-tight pt-2">
                    {result.ergogenicPreWorkoutDoseMg.minMg} - {result.ergogenicPreWorkoutDoseMg.maxMg} <span className="text-lg font-normal text-zinc-400">mg</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    Límite máximo seguro diario (EFSA): {result.safetyDailyUpperLimitMg} mg
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
                  {result.timingAndAdministrationProtocol}
                </div>
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 7. TDEE
      // -------------------------------------------------------------
      case 'calc_tdee': {
        const result = calculateDetailedTDEE({
          weightKg: tdeeWeight,
          heightCm: 175,
          ageYears: 26,
          gender: 'male',
          stepsPerDay: tdeeSteps,
          trainingHoursPerWeek: tdeeHours,
          trainingIntensity: tdeeIntensity
        });

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
              <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                Variables de Gasto
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    value={tdeeWeight}
                    onChange={(e) => setTdeeWeight(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">Pasos Diarios (NEAT)</label>
                  <input
                    type="number"
                    value={tdeeSteps}
                    onChange={(e) => setTdeeSteps(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1">Horas Entreno / Sem</label>
                  <input
                    type="number"
                    value={tdeeHours}
                    onChange={(e) => setTdeeHours(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">Intensidad Sesión</label>
                  <select
                    value={tdeeIntensity}
                    onChange={(e) => setTdeeIntensity(e.target.value as any)}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                  >
                    <option value="low">Ligera (5 METs)</option>
                    <option value="moderate">Moderada (7 METs)</option>
                    <option value="high_metcon">Alta / CrossFit (9.5 METs)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  GASTO TOTAL ESTIMADO (TDEE)
                </span>
                <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                  {result.totalTdeeKcal} <span className="text-lg font-normal text-zinc-400">kcal / día</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">TMB (Basal)</span>
                  <span className="font-mono font-bold text-white">{result.bmrKcal} kcal ({result.componentPercentages.bmrPct}%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">NEAT (Pasos)</span>
                  <span className="font-mono font-bold text-white">{result.neatKcal} kcal ({result.componentPercentages.neatPct}%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">EAT (Entreno)</span>
                  <span className="font-mono font-bold text-white">{result.eatKcal} kcal ({result.componentPercentages.eatPct}%)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">TEF (Térmico)</span>
                  <span className="font-mono font-bold text-white">{result.tefKcal} kcal ({result.componentPercentages.tefPct}%)</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 8. WATER
      // -------------------------------------------------------------
      case 'calc_water': {
        const result = calculateWaterRequirement({
          weightKg: waterWeight,
          trainingDurationMinutes: waterTrainingMin,
          environmentClimate: waterClimate
        });

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
              <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                Parámetros de Hidratación
              </h3>
              <div>
                <label className="text-zinc-600 block mb-1">Peso Corporal (kg)</label>
                <input
                  type="number"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(Number(e.target.value))}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-zinc-600 block mb-1">Minutos de Ejercicio al Día</label>
                <input
                  type="number"
                  value={waterTrainingMin}
                  onChange={(e) => setWaterTrainingMin(Number(e.target.value))}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-zinc-600 block mb-1">Clima / Temperatura</label>
                <select
                  value={waterClimate}
                  onChange={(e) => setWaterClimate(e.target.value as any)}
                  className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                >
                  <option value="temperate">Templado (Estándar)</option>
                  <option value="hot_humid">Cálido / Húmedo (+500 ml)</option>
                  <option value="very_hot_desert">Muy Caluroso / Verano (+900 ml)</option>
                </select>
              </div>
            </div>

            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  CONSUMO TOTAL DIARIO RECOMENDADO
                </span>
                <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                  {result.totalDailyWaterLiters} <span className="text-xl font-normal text-zinc-400">L / día</span>
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-mono">
                  ~{result.hourlyIntakeSuggestionMl} ml por cada hora de vigilia
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                {result.electrolytesRecommendation}
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 9. SKINFOLDS
      // -------------------------------------------------------------
      case 'calc_skinfolds': {
        const result = calculateBodyFatSkinfolds({
          model: 'jp3',
          gender: skinfoldGender,
          ageYears: skinfoldAge,
          chestMm,
          abdomenMm,
          thighMm,
          tricepsMm,
          suprailiacMm
        }, skinfoldWeight);

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Pliegues Cutáneos (mm)
                </h3>
                <select
                  value={skinfoldGender}
                  onChange={(e) => setSkinfoldGender(e.target.value as any)}
                  className="p-1 border border-zinc-200 rounded font-semibold bg-white"
                >
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>

              {skinfoldGender === 'male' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-zinc-500 block mb-1">Pectoral</label>
                    <input
                      type="number"
                      value={chestMm}
                      onChange={(e) => setChestMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Abdomen</label>
                    <input
                      type="number"
                      value={abdomenMm}
                      onChange={(e) => setAbdomenMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Muslo</label>
                    <input
                      type="number"
                      value={thighMm}
                      onChange={(e) => setThighMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-zinc-500 block mb-1">Tríceps</label>
                    <input
                      type="number"
                      value={tricepsMm}
                      onChange={(e) => setTricepsMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Suprailiaco</label>
                    <input
                      type="number"
                      value={suprailiacMm}
                      onChange={(e) => setSuprailiacMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Muslo</label>
                    <input
                      type="number"
                      value={thighMm}
                      onChange={(e) => setThighMm(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-zinc-500 block mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={skinfoldAge}
                    onChange={(e) => setSkinfoldAge(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Peso Corporal (kg)</label>
                  <input
                    type="number"
                    value={skinfoldWeight}
                    onChange={(e) => setSkinfoldWeight(Number(e.target.value))}
                    className="w-full p-2 border border-zinc-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  PORCENTAJE DE GRASA (SIRI)
                </span>
                <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                  {result.bodyFatSiriPercentage}%
                </div>
                <div className="text-sm font-semibold text-zinc-300 mt-1">
                  Categoría: {result.fatCategory}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Masa Grasa</span>
                  <span className="font-mono font-bold text-white">{result.fatMassKg} kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Masa Magra</span>
                  <span className="font-mono font-bold text-white">{result.leanMassKg} kg</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 10. HEART RATE
      // -------------------------------------------------------------
      case 'calc_heart_rate': {
        const result = calculateHeartRateZones({ ageYears: hrAge, restingHeartRateBpm: hrResting });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Variables Cardiovasculares
                </h3>
                <div>
                  <label className="text-zinc-600 block mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={hrAge}
                    onChange={(e) => setHrAge(Number(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1">FC en Reposo (bpm) [Para Karvonen]</label>
                  <input
                    type="number"
                    value={hrResting || ''}
                    onChange={(e) => setHrResting(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ej. 55"
                    className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                  />
                </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    FC MÁXIMA ESTIMADA
                  </span>
                  <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                    {result.consensusMaxHrBpm} <span className="text-xl font-normal text-zinc-400">BPM</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    Tanaka: {result.maxHrTanakaBpm} bpm · Gellish: {result.maxHrGellishBpm} bpm
                  </p>
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  Método aplicado: {result.methodUsed}
                </div>
              </div>
            </div>

            {/* Zones Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
              {result.zones.map((z) => (
                <div key={z.zone} className="bg-white border border-zinc-200/90 rounded-xl p-3.5 space-y-1">
                  <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-800">
                    {z.zone}
                  </span>
                  <div className="font-mono text-sm font-bold text-zinc-900 pt-1">
                    {z.minBpm} - {z.maxBpm} bpm
                  </div>
                  <p className="text-[10px] text-zinc-500">{z.name}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 11. CREATINE
      // -------------------------------------------------------------
      case 'calc_creatine': {
        const result = calculateCreatineDosage({ weightKg: creatineWeight, strategy: creatineStrategy });

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
              <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                Pauta de Suplementación
              </h3>
              <div>
                <label className="text-zinc-600 block mb-1">Peso Corporal (kg)</label>
                <input
                  type="number"
                  value={creatineWeight}
                  onChange={(e) => setCreatineWeight(Number(e.target.value))}
                  className="w-full p-2.5 border border-zinc-200 rounded-lg font-mono font-bold text-base"
                />
              </div>
              <div>
                <label className="text-zinc-600 block mb-1">Estrategia de Dosificación</label>
                <select
                  value={creatineStrategy}
                  onChange={(e) => setCreatineStrategy(e.target.value as any)}
                  className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                >
                  <option value="direct_maintenance">Mantenimiento Directo (3-5 g/día continuos)</option>
                  <option value="fast_loading">Fase de Carga Rápida (0.3 g/kg x 7 días)</option>
                </select>
              </div>
            </div>

            <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  DOSIS DIARIA PRESCRITA
                </span>
                <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                  {result.dailyDoseGrams} <span className="text-xl font-normal text-zinc-400">g / día</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                {result.timingAndCoingestionStrategy}
              </div>
            </div>
          </div>
        );
      }

      // -------------------------------------------------------------
      // 12. MAGNESIUM
      // -------------------------------------------------------------
      case 'calc_magnesium': {
        const result = calculateMagnesiumRequirements({ ageYears: magAge, gender: magGender, highSweatAthlete: magAthlete });

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 shadow-subtle space-y-4 text-xs">
                <h3 className="font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Requerimientos de Magnesio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-600 block mb-1">Edad</label>
                    <input
                      type="number"
                      value={magAge}
                      onChange={(e) => setMagAge(Number(e.target.value))}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-600 block mb-1">Sexo</label>
                    <select
                      value={magGender}
                      onChange={(e) => setMagGender(e.target.value as any)}
                      className="w-full p-2 border border-zinc-200 rounded-lg font-semibold bg-white"
                    >
                      <option value="male">Hombre</option>
                      <option value="female">Mujer</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="athlete-check"
                    checked={magAthlete}
                    onChange={(e) => setMagAthlete(e.target.checked)}
                    className="rounded accent-zinc-900"
                  />
                  <label htmlFor="athlete-check" className="font-semibold text-zinc-800 cursor-pointer">
                    Atleta / Alta sudoración (+15% RDA)
                  </label>
                </div>
              </div>

              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-elevated">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    MAGNESIO ELEMENTAL OBJETIVO
                  </span>
                  <div className="text-5xl font-mono font-bold tracking-tight pt-2">
                    {result.athleteAdjustedRdaMg} <span className="text-xl font-normal text-zinc-400">mg / día</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {result.dietaryConsiderations}
                </p>
              </div>
            </div>

            {/* Salts comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.saltsComparison.map((s) => (
                <div key={s.saltName} className="bg-white border border-zinc-200/90 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-900">{s.saltName}</h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 font-bold">
                      {s.bioavailabilityRank}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Dosis total necesaria: <strong className="text-zinc-900 font-mono">{s.recommendedTotalSaltDoseMg} mg</strong> ({s.elementalMagnesiumPercentage}% elemental)
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed pt-1 border-t border-zinc-100">
                    {s.clinicalNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return <div>Seleccione una calculadora</div>;
    }
  };

  const getCalculatorMeta = () => {
    switch (toolId) {
      case 'calc_readiness': return { title: 'Calculadora de Sobreentrenamiento & Readiness', sub: 'Índice de Hooper (1995) y ratio de carga aguda:crónica (ACWR Gabbett 2016)' };
      case 'calc_sleep': return { title: 'Calculadora de Ciclos de Sueño', sub: 'Ciclos ultradianos de 90 minutos NREM-REM y latencia de sueño' };
      case 'calc_macros': return { title: 'Calculadora de Calorías & Macronutrientes', sub: 'Mifflin-St Jeor / Katch-McArdle y partición según consensos ISSN' };
      case 'calc_deadlift_1rm': return { title: 'Calculadora de 1RM - Peso Muerto', sub: 'Promedio ponderado Epley & Brzycki con tabla de porcentajes 60%-95%' };
      case 'calc_bench_1rm': return { title: 'Calculadora de 1RM - Press de Banca', sub: 'Modelos de Epley, Brzycki y Wathan con zonas de fuerza e hipertrofia' };
      case 'calc_caffeine': return { title: 'Calculadora de Cafeína según Peso', sub: 'Dosis ergogénica pre-entreno (ISSN) y umbrales de seguridad (EFSA)' };
      case 'calc_tdee': return { title: 'Gasto Energético Diario Desglosado (TDEE)', sub: 'Desglose en BMR + TEF (10%) + NEAT (pasos) + EAT (horas entreno)' };
      case 'calc_water': return { title: 'Calculadora de Consumo de Agua & Hidratación', sub: 'Base 35 ml/kg, sudoración por ejercicio y ajuste por clima (ACSM)' };
      case 'calc_skinfolds': return { title: 'Grasa Corporal por Pliegues Cutáneos', sub: 'Jackson-Pollock 3/7 pliegues con ecuaciones de Siri y Brozek' };
      case 'calc_heart_rate': return { title: 'Frecuencia Cardíaca Máxima & Zonas Karvonen', sub: 'Fórmulas Tanaka / Gellish y 5 zonas de reserva cardíaca (HRR)' };
      case 'calc_creatine': return { title: 'Calculadora de Creatina Monohidrato', sub: 'Protocolo de carga rápida (0.3 g/kg) vs mantenimiento continuo (ISSN)' };
      case 'calc_magnesium': return { title: 'Calculadora de Magnesio & Comparador de Sales', sub: 'Requerimientos por sexo/sudoración y comparativa Bisglicinato vs Citrato vs Óxido' };
      default: return { title: 'Calculadora Biomecánica', sub: 'Herramienta cuantitativa' };
    }
  };

  const meta = getCalculatorMeta();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => goToCategory('calculators')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo de Calculadoras</span>
        </button>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {meta.sub}
          </p>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {renderCalculator()}
    </div>
  );
};
