/**
 * KINETIC BIOMECHANICS · SUITE MATEMÁTICA DE 12 CALCULADORAS CIENTÍFICAS
 * 
 * Funciones puras, fuertemente tipadas y validadas contra la evidencia
 * científica en ciencias del ejercicio, nutrición y fisiología aplicada.
 */

// ============================================================================
// 1. CALCULADORA DE SOBREENTRENAMIENTO (READINESS / ÍNDICE DE HOOPER & ACWR)
// ============================================================================

export interface HooperReadinessInput {
  sleepQuality: number;   // 1 (pésimo) a 10 (excelente)
  muscleSoreness: number; // 1 (sin dolor) a 10 (dolor extremo/inhabilitante)
  stressLevel: number;    // 1 (muy relajado) a 10 (estrés extremo)
  fatigueLevel: number;   // 1 (lleno de energía) a 10 (exhausto)
  acuteLoad?: number;     // Carga aguda sRPE (últimos 7 días en UA)
  chronicLoad?: number;   // Carga crónica sRPE (media 28 días en UA)
}

export interface HooperReadinessResult {
  hooperIndex: number;          // 4 a 40 (menor es mejor)
  readinessScore: number;       // 0 a 100% (mayor es mejor)
  acwrRatio: number | null;     // Acute:Chronic Workload Ratio (Gabbett, 2016)
  acwrRiskZone: 'low_underload' | 'optimal_sweet_spot' | 'high_danger' | null;
  recoveryState: 'Óptimo (Verde)' | 'Fatiga Acumulada (Ámbar)' | 'Riesgo de Sobreentrenamiento (Rojo)';
  actionableAdjustment: string;
  recommendedIntensityMultiplier: number; // Ej. 1.0 (100%), 0.85 (85%), 0.60 (60%)
}

/**
 * Calcula el índice de recuperación Readiness basado en el Índice de Hooper (Hooper et al., 1995)
 * y el ratio de carga aguda:crónica ACWR (Gabbett, 2016).
 */
export function calculateReadiness(input: HooperReadinessInput): HooperReadinessResult {
  const { sleepQuality, muscleSoreness, stressLevel, fatigueLevel, acuteLoad, chronicLoad } = input;

  if (
    sleepQuality < 1 || sleepQuality > 10 ||
    muscleSoreness < 1 || muscleSoreness > 10 ||
    stressLevel < 1 || stressLevel > 10 ||
    fatigueLevel < 1 || fatigueLevel > 10
  ) {
    throw new RangeError('Todas las escalas psicométricas deben estar comprendidas entre 1 y 10.');
  }

  // Índice de Hooper inverso (10 - sleepQuality para unificar escala donde mayor = peor)
  const invertedSleep = 11 - sleepQuality;
  const hooperIndex = invertedSleep + muscleSoreness + stressLevel + fatigueLevel; // 4 (mejor) a 40 (peor)

  // Normalización a escala 0-100% de Readiness
  let readinessScore = Math.round(((40 - hooperIndex) / 36) * 100);

  // Integración ACWR si se proporcionan datos de carga
  let acwrRatio: number | null = null;
  let acwrRiskZone: HooperReadinessResult['acwrRiskZone'] = null;

  if (acuteLoad !== undefined && chronicLoad !== undefined && chronicLoad > 0) {
    acwrRatio = parseFloat((acuteLoad / chronicLoad).toFixed(2));
    if (acwrRatio < 0.8) {
      acwrRiskZone = 'low_underload';
      readinessScore = Math.max(0, readinessScore - 10);
    } else if (acwrRatio >= 0.8 && acwrRatio <= 1.3) {
      acwrRiskZone = 'optimal_sweet_spot';
    } else {
      acwrRiskZone = 'high_danger';
      readinessScore = Math.max(0, readinessScore - 25);
    }
  }

  let recoveryState: HooperReadinessResult['recoveryState'];
  let actionableAdjustment: string;
  let recommendedIntensityMultiplier: number;

  if (readinessScore >= 75) {
    recoveryState = 'Óptimo (Verde)';
    actionableAdjustment = 'Sistema neuromuscular completamente recuperado. Proceder con el 100% de la intensidad planificada (RIR objetivo 0-2).';
    recommendedIntensityMultiplier = 1.0;
  } else if (readinessScore >= 45) {
    recoveryState = 'Fatiga Acumulada (Ámbar)';
    actionableAdjustment = 'Fatiga periférica o central moderada. Mantener el volumen pero recortar 1-2 series efectivas o incrementar el RIR en +1.';
    recommendedIntensityMultiplier = 0.85;
  } else {
    recoveryState = 'Riesgo de Sobreentrenamiento (Rojo)';
    actionableAdjustment = 'Marcadores simpáticos/parasimpáticos deprimidos. Se recomienda sesión regenerativa en Z1, movilidad activa o descanso total.';
    recommendedIntensityMultiplier = 0.60;
  }

  return {
    hooperIndex,
    readinessScore,
    acwrRatio,
    acwrRiskZone,
    recoveryState,
    actionableAdjustment,
    recommendedIntensityMultiplier
  };
}

// ============================================================================
// 2. CALCULADORA DE CICLOS DE SUEÑO
// ============================================================================

export interface SleepCycleInput {
  mode: 'bedtime_for_target_wake' | 'wake_times_from_now';
  targetTime?: string; // Formato "HH:MM" (requerido si mode === 'bedtime_for_target_wake')
  sleepLatencyMinutes?: number; // Por defecto 14 min (estándar polisomnografía)
}

export interface SleepCycleOption {
  cyclesCount: number;
  totalSleepHours: number;
  formattedTime: string;
  qualityTag: 'Excelente (9h)' | 'Óptimo (7.5h)' | 'Mínimo Aceptable (6h)' | 'Insuficiente / Siesta (4.5h)';
  recommended: boolean;
}

export interface SleepCycleResult {
  latencyAppliedMinutes: number;
  options: SleepCycleOption[];
  physiologicalNote: string;
}

/**
 * Calcula ventanas de sueño basadas en ciclos ultradianos NREM-REM de 90 minutos
 * y latencia de inicio de sueño (Dement & Kleitman).
 */
export function calculateSleepCycles(input: SleepCycleInput): SleepCycleResult {
  const latency = input.sleepLatencyMinutes ?? 14;
  const cycleDurationMinutes = 90;
  const options: SleepCycleOption[] = [];

  const formatMinutesToTime = (totalMinutes: number): string => {
    let normalized = totalMinutes % (24 * 60);
    if (normalized < 0) normalized += 24 * 60;
    const hours = Math.floor(normalized / 60);
    const mins = normalized % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  if (input.mode === 'bedtime_for_target_wake') {
    if (!input.targetTime || !/^\d{2}:\d{2}$/.test(input.targetTime)) {
      throw new Error('Debe proporcionar una hora objetivo válida en formato HH:MM (ej. 07:00).');
    }
    const [tHours, tMins] = input.targetTime.split(':').map(Number);
    const targetTotalMinutes = tHours * 60 + tMins;

    // Calcular para 6, 5, 4 y 3 ciclos
    [6, 5, 4, 3].forEach(cycles => {
      const sleepDuration = cycles * cycleDurationMinutes;
      const bedTimeMinutes = targetTotalMinutes - sleepDuration - latency;
      const totalSleepHours = sleepDuration / 60;

      let qualityTag: SleepCycleOption['qualityTag'] = 'Óptimo (7.5h)';
      if (cycles === 6) qualityTag = 'Excelente (9h)';
      if (cycles === 5) qualityTag = 'Óptimo (7.5h)';
      if (cycles === 4) qualityTag = 'Mínimo Aceptable (6h)';
      if (cycles === 3) qualityTag = 'Insuficiente / Siesta (4.5h)';

      options.push({
        cyclesCount: cycles,
        totalSleepHours,
        formattedTime: formatMinutesToTime(bedTimeMinutes),
        qualityTag,
        recommended: cycles === 5 || cycles === 6
      });
    });
  } else {
    // Dormirse ahora mismo
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    [3, 4, 5, 6].forEach(cycles => {
      const sleepDuration = cycles * cycleDurationMinutes;
      const wakeTimeMinutes = currentTotalMinutes + latency + sleepDuration;
      const totalSleepHours = sleepDuration / 60;

      let qualityTag: SleepCycleOption['qualityTag'] = 'Óptimo (7.5h)';
      if (cycles === 6) qualityTag = 'Excelente (9h)';
      if (cycles === 5) qualityTag = 'Óptimo (7.5h)';
      if (cycles === 4) qualityTag = 'Mínimo Aceptable (6h)';
      if (cycles === 3) qualityTag = 'Insuficiente / Siesta (4.5h)';

      options.push({
        cyclesCount: cycles,
        totalSleepHours,
        formattedTime: formatMinutesToTime(wakeTimeMinutes),
        qualityTag,
        recommended: cycles === 5 || cycles === 6
      });
    });
  }

  return {
    latencyAppliedMinutes: latency,
    options,
    physiologicalNote: 'Despertar al final de un ciclo de 90 min previene la inercia del sueño al evitar la interrupción de la fase N3 (sueño delta profundo).'
  };
}

// ============================================================================
// 3. CALCULADORA DE CALORÍAS Y MACRONUTRIENTES
// ============================================================================

export type CalorieGoal = 'definicion_agresiva' | 'definicion_moderada' | 'mantenimiento' | 'volumen_limpio' | 'volumen_agresivo';

export interface MacroNutrientInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  activityFactor: number; // 1.2 (sedentario) a 1.9 (atleta profesional)
  goal: CalorieGoal;
  bodyFatPercentage?: number; // Opcional para ecuación de Katch-McArdle
}

export interface MacroNutrientResult {
  bmrKcal: number;
  formulaUsed: 'Mifflin-St Jeor' | 'Katch-McArdle (LBM)';
  tdeeKcal: number;
  targetKcal: number;
  calorieAdjustmentPercentage: number;
  macros: {
    proteinGrams: number;
    proteinKcal: number;
    proteinGramsPerKg: number;
    fatGrams: number;
    fatKcal: number;
    fatPercentage: number;
    carbGrams: number;
    carbKcal: number;
  };
  clinicalRecommendation: string;
}

/**
 * Prescribe calorías y macronutrientes según consensos de la ISSN (Helms et al., 2014; Morton et al., 2018).
 */
export function calculateMacros(input: MacroNutrientInput): MacroNutrientResult {
  const { weightKg, heightCm, ageYears, gender, activityFactor, goal, bodyFatPercentage } = input;

  if (weightKg < 30 || weightKg > 300) throw new RangeError('El peso corporal debe estar entre 30 y 300 kg.');
  if (heightCm < 100 || heightCm > 250) throw new RangeError('La altura debe estar entre 100 y 250 cm.');
  if (ageYears < 14 || ageYears > 100) throw new RangeError('La edad debe estar entre 14 y 100 años.');
  if (activityFactor < 1.1 || activityFactor > 2.2) throw new RangeError('El factor de actividad debe estar entre 1.1 y 2.2.');

  let bmrKcal: number;
  let formulaUsed: MacroNutrientResult['formulaUsed'] = 'Mifflin-St Jeor';

  if (bodyFatPercentage !== undefined && bodyFatPercentage > 3 && bodyFatPercentage < 60) {
    const lbmKg = weightKg * (1 - bodyFatPercentage / 100);
    bmrKcal = Math.round(370 + 21.6 * lbmKg);
    formulaUsed = 'Katch-McArdle (LBM)';
  } else {
    if (gender === 'male') {
      bmrKcal = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5);
    } else {
      bmrKcal = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);
    }
  }

  const tdeeKcal = Math.round(bmrKcal * activityFactor);

  const goalMultipliers: Record<CalorieGoal, number> = {
    definicion_agresiva: -0.25,
    definicion_moderada: -0.15,
    mantenimiento: 0.0,
    volumen_limpio: 0.10,
    volumen_agresivo: 0.20
  };

  const adjustment = goalMultipliers[goal];
  const targetKcal = Math.round(tdeeKcal * (1 + adjustment));

  // Prescripción de proteínas (Mayor en déficit para preservar masa magra, Morton 2018)
  let proteinPerKg = 2.0;
  if (goal === 'definicion_agresiva') proteinPerKg = 2.4;
  else if (goal === 'definicion_moderada') proteinPerKg = 2.2;
  else if (goal === 'mantenimiento') proteinPerKg = 2.0;
  else if (goal === 'volumen_limpio') proteinPerKg = 1.8;
  else if (goal === 'volumen_agresivo') proteinPerKg = 1.6;

  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinKcal = proteinGrams * 4;

  // Grasas (25% del total o mínimo 0.7 g/kg para síntesis hormonal lipídica)
  let fatKcal = Math.round(targetKcal * 0.25);
  let fatGrams = Math.round(fatKcal / 9);
  if (fatGrams < weightKg * 0.7) {
    fatGrams = Math.round(weightKg * 0.7);
    fatKcal = fatGrams * 9;
  }

  // Carbohidratos (Resto calórico a 4 kcal/g)
  const remainingKcal = Math.max(0, targetKcal - proteinKcal - fatKcal);
  const carbGrams = Math.round(remainingKcal / 4);
  const carbKcal = carbGrams * 4;

  return {
    bmrKcal,
    formulaUsed,
    tdeeKcal,
    targetKcal,
    calorieAdjustmentPercentage: Math.round(adjustment * 100),
    macros: {
      proteinGrams,
      proteinKcal,
      proteinGramsPerKg: parseFloat(proteinPerKg.toFixed(1)),
      fatGrams,
      fatKcal,
      fatPercentage: Math.round((fatKcal / targetKcal) * 100),
      carbGrams,
      carbKcal
    },
    clinicalRecommendation: `Objetivo calórico establecido en ${targetKcal} kcal/día con ratio macronutricional P:${proteinGrams}g | G:${fatGrams}g | C:${carbGrams}g.`
  };
}

// ============================================================================
// 4. CALCULADORA DE 1RM - PESO MUERTO
// ============================================================================

export interface Deadlift1RMInput {
  weightLiftedKg: number;
  repetitions: number; // Rango óptimo 1-10
}

export interface PercentageBreakdown {
  percentage: number;
  weightKg: number;
  estimatedRepsMax: number;
  primaryTrainingZone: string;
}

export interface Deadlift1RMResult {
  epley1RMKg: number;
  brzycki1RMKg: number;
  weightedEstimated1RMKg: number;
  repsValidityWarning: string | null;
  percentageTable: PercentageBreakdown[];
}

/**
 * Estima el 1RM en Peso Muerto mediante promedio ponderado Epley & Brzycki
 * y genera la tabla de prescripción de intensidades relativas (60%-95%).
 */
export function calculateDeadlift1RM(input: Deadlift1RMInput): Deadlift1RMResult {
  const { weightLiftedKg, repetitions } = input;

  if (weightLiftedKg <= 0 || weightLiftedKg > 600) throw new RangeError('El peso levantado debe ser mayor a 0 y menor a 600 kg.');
  if (repetitions < 1 || repetitions > 30) throw new RangeError('El número de repeticiones debe ser entre 1 y 30.');

  let repsValidityWarning: string | null = null;
  if (repetitions > 10) {
    repsValidityWarning = 'Aviso de Precisión: Las fórmulas de 1RM pierden validez matemática por encima de 10 reps debido a la fatiga metabólica y glucolítica.';
  }

  if (repetitions === 1) {
    const table = generatePercentageTable(weightLiftedKg);
    return {
      epley1RMKg: weightLiftedKg,
      brzycki1RMKg: weightLiftedKg,
      weightedEstimated1RMKg: weightLiftedKg,
      repsValidityWarning: null,
      percentageTable: table
    };
  }

  // Epley (1885): 1RM = w * (1 + r/30)
  const epley = weightLiftedKg * (1 + repetitions / 30);
  // Brzycki (1993): 1RM = w / (1.0278 - 0.0278 * r)
  const brzycki = weightLiftedKg / (1.0278 - 0.0278 * repetitions);

  // Ponderación: 50% Epley + 50% Brzycki
  const weighted = Math.round(((epley + brzycki) / 2) * 10) / 10;

  return {
    epley1RMKg: Math.round(epley * 10) / 10,
    brzycki1RMKg: Math.round(brzycki * 10) / 10,
    weightedEstimated1RMKg: weighted,
    repsValidityWarning,
    percentageTable: generatePercentageTable(weighted)
  };
}

function generatePercentageTable(oneRepMaxKg: number): PercentageBreakdown[] {
  const percentages = [95, 90, 85, 80, 75, 70, 65, 60];
  const estReps: Record<number, number> = { 95: 2, 90: 3, 85: 5, 80: 8, 75: 10, 70: 12, 65: 15, 60: 20 };

  return percentages.map(pct => {
    let zone = 'Resistencia a la Fuerza';
    if (pct >= 85) zone = 'Fuerza Máxima Neural (Fuerza Pura)';
    else if (pct >= 70) zone = 'Hipertrofia Miofibrilar / Tensión Mecánica';

    return {
      percentage: pct,
      weightKg: Math.round((oneRepMaxKg * (pct / 100)) * 2) / 2, // Redondeo al 0.5 kg más cercano
      estimatedRepsMax: estReps[pct] || 1,
      primaryTrainingZone: zone
    };
  });
}

// ============================================================================
// 5. CALCULADORA DE 1RM - PRESS DE BANCA
// ============================================================================

export interface BenchPress1RMInput {
  weightLiftedKg: number;
  repetitions: number;
}

export interface BenchPress1RMResult {
  epley1RMKg: number;
  brzycki1RMKg: number;
  wathan1RMKg: number;
  consensusEstimated1RMKg: number;
  zonesBreakdown: {
    maxStrengthZone: { minKg: number; maxKg: number; intensityRange: string; setsRepsRecommendation: string };
    hypertrophyZone: { minKg: number; maxKg: number; intensityRange: string; setsRepsRecommendation: string };
    muscularEnduranceZone: { minKg: number; maxKg: number; intensityRange: string; setsRepsRecommendation: string };
  };
}

/**
 * Estima el 1RM en Press de Banca comparando modelos de Epley, Brzycki y Wathan (1994),
 * dividiendo las zonas en Fuerza Máxima (85-100%), Hipertrofia (65-85%) y Resistencia (<65%).
 */
export function calculateBenchPress1RM(input: BenchPress1RMInput): BenchPress1RMResult {
  const { weightLiftedKg, repetitions } = input;

  if (weightLiftedKg <= 0 || weightLiftedKg > 500) throw new RangeError('Peso de press de banca inválido.');
  if (repetitions < 1 || repetitions > 30) throw new RangeError('Repeticiones inválidas.');

  if (repetitions === 1) {
    return formatBenchResult(weightLiftedKg, weightLiftedKg, weightLiftedKg, weightLiftedKg);
  }

  const epley = weightLiftedKg * (1 + repetitions / 30);
  const brzycki = weightLiftedKg / (1.0278 - 0.0278 * repetitions);
  // Wathan (1994): 1RM = (100 * w) / (48.8 + (53.8 * e^(-0.075 * r)))
  const wathan = (100 * weightLiftedKg) / (48.8 + 53.8 * Math.exp(-0.075 * repetitions));

  const consensus = Math.round(((epley + brzycki + wathan) / 3) * 10) / 10;

  return formatBenchResult(
    Math.round(epley * 10) / 10,
    Math.round(brzycki * 10) / 10,
    Math.round(wathan * 10) / 10,
    consensus
  );
}

function formatBenchResult(epley: number, brzycki: number, wathan: number, consensus: number): BenchPress1RMResult {
  return {
    epley1RMKg: epley,
    brzycki1RMKg: brzycki,
    wathan1RMKg: wathan,
    consensusEstimated1RMKg: consensus,
    zonesBreakdown: {
      maxStrengthZone: {
        minKg: Math.round(consensus * 0.85 * 2) / 2,
        maxKg: consensus,
        intensityRange: '85% - 100% 1RM',
        setsRepsRecommendation: '3 - 5 series x 1 - 5 reps | RIR 1-2 | Descanso 3-5 min'
      },
      hypertrophyZone: {
        minKg: Math.round(consensus * 0.65 * 2) / 2,
        maxKg: Math.round(consensus * 0.85 * 2) / 2,
        intensityRange: '65% - 85% 1RM',
        setsRepsRecommendation: '3 - 4 series x 6 - 12 reps | RIR 1-2 | Descanso 2-3 min'
      },
      muscularEnduranceZone: {
        minKg: Math.round(consensus * 0.50 * 2) / 2,
        maxKg: Math.round(consensus * 0.65 * 2) / 2,
        intensityRange: '< 65% 1RM',
        setsRepsRecommendation: '2 - 3 series x 15 - 25 reps | RIR 0-1 | Descanso 60-90 s'
      }
    }
  };
}

// ============================================================================
// 6. CALCULADORA DE CAFEÍNA SEGÚN PESO CORPORAL
// ============================================================================

export interface CaffeineInput {
  weightKg: number;
  toleranceLevel?: 'low_naive' | 'moderate_habitual' | 'high_habituated';
}

export interface CaffeineResult {
  ergogenicPreWorkoutDoseMg: { minMg: number; maxMg: number; targetPerKg: string };
  moderateHabitualDoseMg: { minMg: number; maxMg: number; targetPerKg: string };
  safetyDailyUpperLimitMg: number;
  safetyUpperLimitPerKg: number;
  timingAndAdministrationProtocol: string;
  contraindicationsAndWarnings: string[];
}

/**
 * Calcula dosis ergogénicas y límites toxicológicos de cafeína anhidra (ISSN Consensus, Guest et al., 2021; EFSA).
 */
export function calculateCaffeineDosage(input: CaffeineInput): CaffeineResult {
  const { weightKg, toleranceLevel = 'moderate_habitual' } = input;

  if (weightKg < 35 || weightKg > 250) throw new RangeError('El peso corporal debe estar entre 35 y 250 kg.');

  // Ergogénico: 3 a 6 mg/kg
  const ergoMin = Math.round(weightKg * 3);
  const ergoMax = Math.round(weightKg * 6);

  // Dosis habitual moderada: 1.5 a 3 mg/kg
  const habitMin = Math.round(weightKg * 1.5);
  const habitMax = Math.round(weightKg * 3.0);

  // Límite de seguridad EFSA: 400 mg/día o 5.7 mg/kg/día
  const safetyLimit = Math.min(400, Math.round(weightKg * 5.7));

  let recommendedErgoTarget = `${ergoMin} - ${ergoMax} mg (3.0 - 6.0 mg/kg)`;
  if (toleranceLevel === 'low_naive') {
    recommendedErgoTarget = `${ergoMin} mg (Iniciar en rango bajo de 3 mg/kg para evaluar taquicardia/temblores)`;
  }

  return {
    ergogenicPreWorkoutDoseMg: {
      minMg: ergoMin,
      maxMg: ergoMax,
      targetPerKg: recommendedErgoTarget
    },
    moderateHabitualDoseMg: {
      minMg: habitMin,
      maxMg: habitMax,
      targetPerKg: `${habitMin} - ${habitMax} mg (1.5 - 3.0 mg/kg)`
    },
    safetyDailyUpperLimitMg: safetyLimit,
    safetyUpperLimitPerKg: 5.7,
    timingAndAdministrationProtocol: 'Ingerir 45 a 60 minutos antes del inicio de la sesión. El pico plasmático ($T_{\\max}$) ocurre a los 45-60 min con vida media ($T_{1/2}$) de 4 a 6 horas.',
    contraindicationsAndWarnings: [
      'Evitar consumo en las 6-8 horas previas al sueño para no degradar la arquitectura del sueño N3/REM.',
      'No exceder 400 mg en una sola toma ni 5.7 mg/kg al día según directivas de la EFSA.',
      'Consulte a su médico si padece arritmias, hipertensión arterial no controlada o reflujo gastroesofágico.'
    ]
  };
}

// ============================================================================
// 7. CALCULADORA DE GASTO ENERGÉTICO DIARIO (TDEE DESGLOSADO)
// ============================================================================

export interface TDEEInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  stepsPerDay: number; // NEAT estimador
  trainingHoursPerWeek: number; // EAT estimador
  trainingIntensity: 'low' | 'moderate' | 'high_metcon';
}

export interface TDEEResult {
  bmrKcal: number;
  tefKcal: number;
  neatKcal: number;
  eatKcal: number;
  totalTdeeKcal: number;
  componentPercentages: {
    bmrPct: number;
    tefPct: number;
    neatPct: number;
    eatPct: number;
  };
}

/**
 * Calcula el TDEE desglosado en sus 4 componentes fisiológicos:
 * $TDEE = BMR + TEF + NEAT + EAT$
 */
export function calculateDetailedTDEE(input: TDEEInput): TDEEResult {
  const { weightKg, heightCm, ageYears, gender, stepsPerDay, trainingHoursPerWeek, trainingIntensity } = input;

  // 1. BMR (Mifflin-St Jeor)
  const bmrKcal = gender === 'male'
    ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5)
    : Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161);

  // 2. NEAT (Basado en pasos diarios: ~0.04 kcal/paso/kg normalizado)
  const neatKcal = Math.round((stepsPerDay * 0.04 * (weightKg / 70)));

  // 3. EAT (Gasto por ejercicio promediado al día)
  const metValues: Record<TDEEInput['trainingIntensity'], number> = {
    low: 5.0,        // 5 METs (Pesas ligeras / Yoga)
    moderate: 7.0,   // 7 METs (Hipertrofia intensa / Running moderado)
    high_metcon: 9.5 // 9.5 METs (CrossFit / HIIT / Intervalos)
  };
  const met = metValues[trainingIntensity];
  const weeklyTrainingKcal = trainingHoursPerWeek * met * weightKg;
  const eatKcal = Math.round(weeklyTrainingKcal / 7);

  // 4. TEF (Efecto térmico estimado al 10% del gasto total pre-TEF)
  const preTef = bmrKcal + neatKcal + eatKcal;
  const tefKcal = Math.round(preTef * 0.10);

  const totalTdeeKcal = bmrKcal + neatKcal + eatKcal + tefKcal;

  return {
    bmrKcal,
    tefKcal,
    neatKcal,
    eatKcal,
    totalTdeeKcal,
    componentPercentages: {
      bmrPct: Math.round((bmrKcal / totalTdeeKcal) * 100),
      tefPct: Math.round((tefKcal / totalTdeeKcal) * 100),
      neatPct: Math.round((neatKcal / totalTdeeKcal) * 100),
      eatPct: Math.round((eatKcal / totalTdeeKcal) * 100)
    }
  };
}

// ============================================================================
// 8. CALCULADORA DE CONSUMO DE AGUA DIARIO
// ============================================================================

export interface HydrationInput {
  weightKg: number;
  trainingDurationMinutes: number;
  environmentClimate: 'temperate' | 'hot_humid' | 'very_hot_desert';
}

export interface HydrationResult {
  baselineWaterMl: number;
  exerciseAddedWaterMl: number;
  climateAddedWaterMl: number;
  totalDailyWaterLiters: number;
  hourlyIntakeSuggestionMl: number;
  electrolytesRecommendation: string;
}

/**
 * Calcula el requerimiento hídrico diario según consensos del ACSM (Sawka et al., 2007).
 */
export function calculateWaterRequirement(input: HydrationInput): HydrationResult {
  const { weightKg, trainingDurationMinutes, environmentClimate } = input;

  if (weightKg < 30 || weightKg > 250) throw new RangeError('Peso corporal inválido.');

  // Base: 35 ml / kg
  const baselineWaterMl = Math.round(weightKg * 35);

  // Ejercicio: 500-1000 ml por hora (~12.5 ml / min de entreno)
  const exerciseAddedWaterMl = Math.round((trainingDurationMinutes / 60) * 750);

  // Clima
  let climateAddedWaterMl = 0;
  if (environmentClimate === 'hot_humid') climateAddedWaterMl = 500;
  if (environmentClimate === 'very_hot_desert') climateAddedWaterMl = 900;

  const totalDailyWaterMl = baselineWaterMl + exerciseAddedWaterMl + climateAddedWaterMl;
  const totalDailyWaterLiters = parseFloat((totalDailyWaterMl / 1000).toFixed(2));

  return {
    baselineWaterMl,
    exerciseAddedWaterMl,
    climateAddedWaterMl,
    totalDailyWaterLiters,
    hourlyIntakeSuggestionMl: Math.round(totalDailyWaterMl / 14), // Repartido en 14h de vigilia
    electrolytesRecommendation: trainingDurationMinutes >= 60 || environmentClimate !== 'temperate'
      ? 'Añadir 500-700 mg de Sodio ($Na^+$) por litro de agua intra-entreno para evitar hiponatremia y mantener el volumen plasmático.'
      : 'Hidratación con agua mineral estándar adecuada sin necesidad de suplementos salinos adicionales.'
  };
}

// ============================================================================
// 9. CALCULADORA DE GRASA CORPORAL POR PLIEGUES CUTÁNEOS
// ============================================================================

export interface JacksonPollock3Input {
  model: 'jp3';
  gender: 'male' | 'female';
  ageYears: number;
  // Hombres: Pectoral, Abdomen, Muslo
  chestMm?: number;
  abdomenMm?: number;
  thighMm?: number;
  // Mujeres: Tríceps, Suprailiaco, Muslo
  tricepsMm?: number;
  suprailiacMm?: number;
}

export interface JacksonPollock7Input {
  model: 'jp7';
  gender: 'male' | 'female';
  ageYears: number;
  chestMm: number;
  midaxillaryMm: number;
  tricepsMm: number;
  subscapularMm: number;
  abdomenMm: number;
  suprailiacMm: number;
  thighMm: number;
}

export type SkinfoldInput = JacksonPollock3Input | JacksonPollock7Input;

export interface BodyFatResult {
  sumSkinfoldsMm: number;
  bodyDensity: number;
  bodyFatSiriPercentage: number;
  bodyFatBrozekPercentage: number;
  fatCategory: 'Esencial / Competición' | 'Atlético' | 'Fitness / Saludable' | 'Aceptable' | 'Sobrepeso / Obesidad';
  fatMassKg?: number;
  leanMassKg?: number;
}

/**
 * Calcula el porcentaje graso mediante modelos de Jackson & Pollock (1978/1980) y ecuaciones de Siri / Brozek.
 */
export function calculateBodyFatSkinfolds(input: SkinfoldInput, bodyWeightKg?: number): BodyFatResult {
  const { gender, ageYears } = input;
  let sumMm = 0;
  let bodyDensity = 0;

  if (input.model === 'jp3') {
    if (gender === 'male') {
      const { chestMm = 0, abdomenMm = 0, thighMm = 0 } = input;
      sumMm = chestMm + abdomenMm + thighMm;
      if (sumMm === 0) throw new Error('Debe proporcionar los 3 pliegues masculinos (Pectoral, Abdomen, Muslo).');
      // Jackson & Pollock 3 Pliegues Hombres (1978)
      bodyDensity = 1.10938 - 0.0008267 * sumMm + 0.0000016 * (sumMm ** 2) - 0.0002574 * ageYears;
    } else {
      const { tricepsMm = 0, suprailiacMm = 0, thighMm = 0 } = input;
      sumMm = tricepsMm + suprailiacMm + thighMm;
      if (sumMm === 0) throw new Error('Debe proporcionar los 3 pliegues femeninos (Tríceps, Suprailiaco, Muslo).');
      // Jackson, Pollock & Ward 3 Pliegues Mujeres (1980)
      bodyDensity = 1.0994921 - 0.0009929 * sumMm + 0.0000023 * (sumMm ** 2) - 0.0001392 * ageYears;
    }
  } else {
    // 7 Pliegues
    sumMm = input.chestMm + input.midaxillaryMm + input.tricepsMm + input.subscapularMm + input.abdomenMm + input.suprailiacMm + input.thighMm;
    if (gender === 'male') {
      bodyDensity = 1.112 - 0.00043499 * sumMm + 0.00000055 * (sumMm ** 2) - 0.00028826 * ageYears;
    } else {
      bodyDensity = 1.097 - 0.00046971 * sumMm + 0.00000056 * (sumMm ** 2) - 0.00012828 * ageYears;
    }
  }

  // Ecuación de Siri (1956): %BF = (495 / Density) - 450
  const siri = parseFloat(((495 / bodyDensity) - 450).toFixed(1));
  // Ecuación de Brozek (1963): %BF = (457 / Density) - 414.2
  const brozek = parseFloat(((457 / bodyDensity) - 414.2).toFixed(1));

  const finalFatPct = Math.max(3, Math.min(60, siri));

  let fatCategory: BodyFatResult['fatCategory'] = 'Fitness / Saludable';
  if (gender === 'male') {
    if (finalFatPct < 6) fatCategory = 'Esencial / Competición';
    else if (finalFatPct < 14) fatCategory = 'Atlético';
    else if (finalFatPct < 18) fatCategory = 'Fitness / Saludable';
    else if (finalFatPct < 25) fatCategory = 'Aceptable';
    else fatCategory = 'Sobrepeso / Obesidad';
  } else {
    if (finalFatPct < 14) fatCategory = 'Esencial / Competición';
    else if (finalFatPct < 21) fatCategory = 'Atlético';
    else if (finalFatPct < 25) fatCategory = 'Fitness / Saludable';
    else if (finalFatPct < 32) fatCategory = 'Aceptable';
    else fatCategory = 'Sobrepeso / Obesidad';
  }

  let fatMassKg: number | undefined;
  let leanMassKg: number | undefined;
  if (bodyWeightKg) {
    fatMassKg = parseFloat(((bodyWeightKg * finalFatPct) / 100).toFixed(1));
    leanMassKg = parseFloat((bodyWeightKg - fatMassKg).toFixed(1));
  }

  return {
    sumSkinfoldsMm: sumMm,
    bodyDensity: parseFloat(bodyDensity.toFixed(5)),
    bodyFatSiriPercentage: siri,
    bodyFatBrozekPercentage: brozek,
    fatCategory,
    fatMassKg,
    leanMassKg
  };
}

// ============================================================================
// 10. CALCULADORA DE FRECUENCIA CARDÍACA MÁXIMA Y ZONAS
// ============================================================================

export interface HeartRateInput {
  ageYears: number;
  restingHeartRateBpm?: number; // Si se introduce, se calcula Karvonen (HRR)
}

export interface HeartRateZone {
  zone: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  name: string;
  minBpm: number;
  maxBpm: number;
  percentageRange: string;
  physiologicalFocus: string;
}

export interface HeartRateResult {
  maxHrTanakaBpm: number;
  maxHrGellishBpm: number;
  consensusMaxHrBpm: number;
  methodUsed: 'Fórmula de Reserva de Karvonen' | 'Porcentaje Clásico de FC Máx';
  restingHrAppliedBpm: number | null;
  heartRateReserveBpm: number | null;
  zones: HeartRateZone[];
}

/**
 * Calcula la FC Máx mediante Tanaka (2001) y Gellish (2007) y prescribe las 5 zonas de entrenamiento.
 */
export function calculateHeartRateZones(input: HeartRateInput): HeartRateResult {
  const { ageYears, restingHeartRateBpm } = input;

  if (ageYears < 10 || ageYears > 105) throw new RangeError('Edad inválida.');

  // Tanaka et al. (2001): 208 - 0.7 * age
  const tanaka = Math.round(208 - 0.7 * ageYears);
  // Gellish et al. (2007): 207 - 0.7 * age
  const gellish = Math.round(207 - 0.7 * ageYears);

  const consensusMaxHr = Math.round((tanaka + gellish) / 2);

  const zoneDefinitions = [
    { zone: 'Z1' as const, name: 'Recuperación Activa', minPct: 0.50, maxPct: 0.60, focus: 'Regeneración vascular, aclaramiento de lactato' },
    { zone: 'Z2' as const, name: 'Capacidad Aeróbica (FatMax)', minPct: 0.60, maxPct: 0.70, focus: 'Biogénesis mitocondrial, máxima oxidación lipídica' },
    { zone: 'Z3' as const, name: 'Tempo / Aeróbico Intensivo', minPct: 0.70, maxPct: 0.80, focus: 'Economía de carrera, reclutamiento mixto de sustratos' },
    { zone: 'Z4' as const, name: 'Umbral Anaeróbico / Lactato', minPct: 0.80, maxPct: 0.90, focus: 'Tolerancia al lactato, máximo estado estacionario MLSS' },
    { zone: 'Z5' as const, name: 'VO2 Máx / Potencia Aeróbica', minPct: 0.90, maxPct: 1.00, focus: 'Consumo máximo de oxígeno, gasto cardíaco pico' }
  ];

  let methodUsed: HeartRateResult['methodUsed'] = 'Porcentaje Clásico de FC Máx';
  let hrr: number | null = null;

  let zones: HeartRateZone[];

  if (restingHeartRateBpm && restingHeartRateBpm > 30 && restingHeartRateBpm < 120) {
    methodUsed = 'Fórmula de Reserva de Karvonen';
    hrr = consensusMaxHr - restingHeartRateBpm;

    zones = zoneDefinitions.map(zd => ({
      zone: zd.zone,
      name: zd.name,
      minBpm: Math.round(restingHeartRateBpm + hrr! * zd.minPct),
      maxBpm: Math.round(restingHeartRateBpm + hrr! * zd.maxPct),
      percentageRange: `${Math.round(zd.minPct * 100)}% - ${Math.round(zd.maxPct * 100)}% HRR`,
      physiologicalFocus: zd.focus
    }));
  } else {
    zones = zoneDefinitions.map(zd => ({
      zone: zd.zone,
      name: zd.name,
      minBpm: Math.round(consensusMaxHr * zd.minPct),
      maxBpm: Math.round(consensusMaxHr * zd.maxPct),
      percentageRange: `${Math.round(zd.minPct * 100)}% - ${Math.round(zd.maxPct * 100)}% FC Máx`,
      physiologicalFocus: zd.focus
    }));
  }

  return {
    maxHrTanakaBpm: tanaka,
    maxHrGellishBpm: gellish,
    consensusMaxHrBpm: consensusMaxHr,
    methodUsed,
    restingHrAppliedBpm: restingHeartRateBpm ?? null,
    heartRateReserveBpm: hrr,
    zones
  };
}

// ============================================================================
// 11. CALCULADORA DE CREATINA MONOHIDRATO
// ============================================================================

export interface CreatineInput {
  weightKg: number;
  strategy: 'fast_loading' | 'direct_maintenance';
}

export interface CreatineResult {
  dailyDoseGrams: number;
  loadingPhaseProtocol?: {
    totalDailyGrams: number;
    daysCount: number;
    dosesSplitCount: number;
    gramsPerDose: number;
  };
  maintenanceGramsPerDay: number;
  hydrationRequirementBonusMl: number;
  timingAndCoingestionStrategy: string;
}

/**
 * Calcula pautas de suplementación con Creatina Monohidrato según consensos de la ISSN (Kreider et al., 2017).
 */
export function calculateCreatineDosage(input: CreatineInput): CreatineResult {
  const { weightKg, strategy } = input;

  if (weightKg < 30 || weightKg > 250) throw new RangeError('Peso corporal inválido.');

  // Carga rápida: 0.3 g/kg/día por 5-7 días
  const loadingTotalGrams = parseFloat((weightKg * 0.3).toFixed(1));
  const loadingSplitGrams = parseFloat((loadingTotalGrams / 4).toFixed(1));

  // Mantenimiento directo: 0.07 g/kg/día o mínimo estándar de 3 a 5g
  const maintenanceCalculated = parseFloat((weightKg * 0.07).toFixed(1));
  const maintenanceFinal = Math.max(3.0, maintenanceCalculated);

  if (strategy === 'fast_loading') {
    return {
      dailyDoseGrams: loadingTotalGrams,
      loadingPhaseProtocol: {
        totalDailyGrams: loadingTotalGrams,
        daysCount: 7,
        dosesSplitCount: 4,
        gramsPerDose: loadingSplitGrams
      },
      maintenanceGramsPerDay: maintenanceFinal,
      hydrationRequirementBonusMl: 500,
      timingAndCoingestionStrategy: 'Dividir en 4 tomas de ~' + loadingSplitGrams + 'g (desayuno, almuerzo, post-entreno y cena) con 200 ml de agua. La ingesta conjunta con carbohidratos/proteínas maximiza la captación mediada por transportadores CRT dependientes de insulina.'
    };
  }

  return {
    dailyDoseGrams: maintenanceFinal,
    maintenanceGramsPerDay: maintenanceFinal,
    hydrationRequirementBonusMl: 400,
    timingAndCoingestionStrategy: 'Tomar ' + maintenanceFinal + 'g diarios de forma continua. El momento del día es indiferente debido a su efecto por acumulación de saturación muscular fosfocreatínica (preferible post-entreno con comida).'
  };
}

// ============================================================================
// 12. CALCULADORA DE MAGNESIO & COMPARADOR DE SALES
// ============================================================================

export interface MagnesiumInput {
  ageYears: number;
  gender: 'male' | 'female';
  highSweatAthlete?: boolean; // +10-20% por pérdidas en sudor
}

export interface MagnesiumSaltComparison {
  saltName: string;
  elementalMagnesiumPercentage: number;
  bioavailabilityRank: 'Excelente' | 'Alta' | 'Moderada' | 'Pobre';
  recommendedTotalSaltDoseMg: number;
  clinicalNotes: string;
}

export interface MagnesiumResult {
  baselineRdaMg: number;
  athleteAdjustedRdaMg: number;
  dietaryConsiderations: string;
  saltsComparison: MagnesiumSaltComparison[];
}

/**
 * Calcula requerimientos de magnesio elemental y compara biodisponibilidad entre sales queladas e inorgánicas.
 */
export function calculateMagnesiumRequirements(input: MagnesiumInput): MagnesiumResult {
  const { ageYears, gender, highSweatAthlete = false } = input;

  let rda = 400; // Hombres adultos
  if (gender === 'female') {
    rda = ageYears <= 18 ? 360 : ageYears <= 30 ? 310 : 320;
  } else {
    rda = ageYears <= 18 ? 410 : 420;
  }

  const athleteAdjusted = highSweatAthlete ? Math.round(rda * 1.15) : rda;

  const salts: MagnesiumSaltComparison[] = [
    {
      saltName: 'Bisglicinato de Magnesio (Quelado)',
      elementalMagnesiumPercentage: 14.1,
      bioavailabilityRank: 'Excelente',
      recommendedTotalSaltDoseMg: Math.round(athleteAdjusted / 0.141),
      clinicalNotes: 'Unido al aminoácido glicina. Máxima absorción intestinal sin efecto laxante; ideal para sistema nervioso, descanso y recuperación nocturna.'
    },
    {
      saltName: 'Citrato de Magnesio',
      elementalMagnesiumPercentage: 16.0,
      bioavailabilityRank: 'Alta',
      recommendedTotalSaltDoseMg: Math.round(athleteAdjusted / 0.16),
      clinicalNotes: 'Sal orgánica unida a ácido cítrico. Alta solubilidad. Puede tener un leve efecto osmótico laxante en dosis elevadas (>350 mg).'
    },
    {
      saltName: 'Malato de Magnesio',
      elementalMagnesiumPercentage: 15.5,
      bioavailabilityRank: 'Alta',
      recommendedTotalSaltDoseMg: Math.round(athleteAdjusted / 0.155),
      clinicalNotes: 'Unido a ácido málico (intermediario del ciclo de Krebs). Excelente para energía diurna y fatiga muscular.'
    },
    {
      saltName: 'Óxido de Magnesio (Inorgánico)',
      elementalMagnesiumPercentage: 60.3,
      bioavailabilityRank: 'Pobre',
      recommendedTotalSaltDoseMg: Math.round(athleteAdjusted / 0.603),
      clinicalNotes: 'Alto contenido elemental teórico pero absorción biológica muy baja (~4%). Fuerte efecto laxante osmótico.'
    }
  ];

  return {
    baselineRdaMg: rda,
    athleteAdjustedRdaMg: athleteAdjusted,
    dietaryConsiderations: `RDA objetivo: ${athleteAdjusted} mg de magnesio elemental al día. Priorizar sales queladas (Bisglicinato o Malato) para evitar molestias gastrointestinales.`,
    saltsComparison: salts
  };
}
