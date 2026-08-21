import {
  CardioModality,
  CardioGoal,
  CardioExperience,
  CardioRoutine,
  CardioSession,
  HeartRateZone,
  IntensityMetric,
  PeriodizationModel
} from '../types/cardio';

export const CARDIO_MODALITY_LABELS: Record<CardioModality, string> = {
  running: 'Running / Carrera a Pie',
  cycling: 'Ciclismo / Rodillo Indoor',
  rowing: 'Remo Indoor (Ergómetro)',
  swimming: 'Natación',
  hiit_erg: 'HIIT / Assault Bike & SkiErg',
  hybrid_concurrent: 'Cardio Concurrente (Fuerza + Cardio)'
};

export const CARDIO_GOAL_LABELS: Record<CardioGoal, string> = {
  zone2_base: 'Base Aeróbica & Zona 2 (Biogénesis Mitocondrial)',
  vo2max: 'Potencia Aeróbica Máxima & Umbral de Lactato',
  fat_loss_concurrent: 'Pérdida de Grasa (Mínima Interferencia)',
  anaerobic_power: 'Capacidad Anaeróbica & Potencia Glucolítica (SIT/HIIT)',
  race_preparation: 'Preparación para Competición / Rendimiento'
};

export const DEFAULT_ZONES_GUIDE: HeartRateZone[] = [
  {
    zone: 'Z1',
    name: 'Recuperación Activa',
    percentageFcMax: '50% - 60% FCmáx',
    rpeScale: 'RPE 2 - 3 / 10',
    primaryEnergySystem: 'Oxidación de lípidos basal',
    physiologicalAdaptation: 'Aumento del flujo sanguíneo, aclaramiento metabólico y recuperación muscular sin estrés residual.'
  },
  {
    zone: 'Z2',
    name: 'Base Aeróbica / Capilarización',
    percentageFcMax: '60% - 70% FCmáx',
    rpeScale: 'RPE 4 - 5 / 10 (Conversacional)',
    primaryEnergySystem: 'Máxima tasa de oxidación de ácidos grasos (FatMax)',
    physiologicalAdaptation: 'Biogénesis mitocondrial, densidad capilar en fibras tipo I y eficiencia metabólica lipídica de larga duración.'
  },
  {
    zone: 'Z3',
    name: 'Tempo / Aeróbico Medio',
    percentageFcMax: '70% - 80% FCmáx',
    rpeScale: 'RPE 6 - 7 / 10',
    primaryEnergySystem: 'Sustrato mixto (Grasas + Glucógeno)',
    physiologicalAdaptation: 'Resistencia a la fatiga a ritmos moderados-altos. Mayor coste de recuperación que Zona 2.'
  },
  {
    zone: 'Z4',
    name: 'Umbral de Lactato (LT2 / FTP)',
    percentageFcMax: '80% - 90% FCmáx',
    rpeScale: 'RPE 8 / 10 (Respiración forzada)',
    primaryEnergySystem: 'Glucólisis anaeróbica controlada',
    physiologicalAdaptation: 'Aumento del umbral anaeróbico, capacidad de reciclaje del lactato y tolerancia a la acidosis.'
  },
  {
    zone: 'Z5',
    name: 'VO2 Máx & Potencia Anaeróbica',
    percentageFcMax: '90% - 100% FCmáx',
    rpeScale: 'RPE 9 - 10 / 10 (Esfuerzo máximo)',
    primaryEnergySystem: 'Fosfágenos (ATP-PC) y Glucólisis rápida',
    physiologicalAdaptation: 'Volumen sistólico cardíaco máximo, capacidad buffer celular y reclutamiento de fibras musculares rápidas tipo IIx.'
  }
];

export function buildCardioRoutine(
  modality: CardioModality,
  goal: CardioGoal,
  experience: CardioExperience,
  daysPerWeek: number,
  sessionDuration: number = 45,
  intensityMetric: IntensityMetric = 'heart_rate'
): CardioRoutine {
  let periodizationModel: PeriodizationModel = 'polarized';
  if (goal === 'zone2_base') periodizationModel = 'pyramidal';
  if (goal === 'anaerobic_power') periodizationModel = 'hiit_focused';

  const modalityLabel = CARDIO_MODALITY_LABELS[modality] || 'Cardio';
  const goalLabel = CARDIO_GOAL_LABELS[goal] || 'Rendimiento';

  const name = `Protocolo de ${modalityLabel} · ${daysPerWeek} Sesiones`;
  const subtitle = `Plan de periodización ${periodizationModel === 'polarized' ? 'Polarizada 80/20' : 'Específica'} orientada a ${goalLabel}.`;

  const summaryNote = `Estructura de ${daysPerWeek} sesiones semanales (~${sessionDuration} min/sesión) controladas mediante ${intensityMetric === 'heart_rate' ? 'Zonas de Frecuencia Cardíaca' : intensityMetric === 'power_watts' ? 'Potencia en Watios' : 'Escala RPE de Borg'}. Diseñado para maximizar adaptaciones cardiovasculares específicas.`;

  const sessions: CardioSession[] = [];

  // Generate sessions based on modality, days, goal and duration
  for (let i = 1; i <= daysPerWeek; i++) {
    sessions.push(generateSessionForDay(i, daysPerWeek, modality, goal, experience, sessionDuration));
  }

  return {
    id: `cardio_${Date.now()}`,
    name,
    subtitle,
    createdAt: new Date().toISOString(),
    modality,
    goal,
    experience,
    daysPerWeek,
    sessionDuration,
    periodizationModel,
    intensityMetric,
    zonesGuide: DEFAULT_ZONES_GUIDE,
    sessions,
    summaryNote
  };
}

function generateSessionForDay(
  dayNum: number,
  _totalDays: number,
  modality: CardioModality,
  _goal: CardioGoal,
  experience: CardioExperience,
  duration: number
): CardioSession {
  // Session templates logic based on day and goal
  if (dayNum === 1) {
    // Session 1: Baseline Zone 2 Mitochondrial Builder
    return {
      sessionNumber: 1,
      title: 'Sesión 01 · Base Aeróbica en Zona 2 (FatMax)',
      type: 'Tirada Continua en Zona 2',
      modality,
      totalDurationMinutes: duration,
      primaryZone: 'Z2',
      warmup: {
        name: 'Calentamiento Progresivo',
        duration: '8 - 10 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2-3 / 55-60% FCmáx',
        description: 'Inicio muy suave para elevar la temperatura central y activar la vasodilatación periférica.'
      },
      mainBlock: [
        {
          name: 'Bloque Continuo Z2 Estable',
          duration: `${duration - 16} min`,
          intensityZone: 'Z2',
          targetPaceOrRpe: 'RPE 4-5 / 62-68% FCmáx (Ritmo conversacional)',
          cadenceOrStroke: modality === 'running' ? 'Cadencia 170-180 ppm' : modality === 'cycling' ? 'Cadencia 85-95 rpm' : '22-26 spm',
          description: 'Mantén un ritmo uniforme donde puedas hablar en oraciones completas sin perder el aliento. Enfoque en economía de movimiento.'
        }
      ],
      cooldown: {
        name: 'Vuelta a la Calma',
        duration: '6 - 8 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2 / <60% FCmáx',
        description: 'Disminución gradual de la intensidad para facilitar el retorno venoso y normalización de la frecuencia cardíaca.'
      },
      biomechanicalCue: modality === 'running'
        ? 'Alineación de columna, pisada bajo el centro de gravedad (evita talonar excesivo) y oscilación de brazos compacta a 90º.'
        : modality === 'cycling'
        ? 'Pedaleo redondo fluido, relajación en hombros y cuello, y reparto uniforme de potencia en todo el ciclo de biela.'
        : 'Postura neutra, secuencia piernas-tronco-brazos en la fase de ataque y retorno controlado.',
      nutritionHydrationTip: 'Hidratación constante con electrolitos (sodio). Al ser Zona 2 no requiere ingesta masiva de carbohidratos intra-sesión.'
    };
  }

  if (dayNum === 2) {
    // Session 2: High Intensity / VO2 Max Intervals or HIIT
    const intervalWorkTime = experience === 'avanzado' ? '4 min' : experience === 'intermedio' ? '3 min' : '2 min';
    const intervalRestTime = experience === 'avanzado' ? '3 min activo Z1' : '2.5 min activo Z1';
    const reps = experience === 'avanzado' ? 5 : 4;

    return {
      sessionNumber: 2,
      title: 'Sesión 02 · Intervalos Fraccionados de VO2 Máx (4x4 Protocol)',
      type: 'Intervalos Aeróbicos de Alta Intensidad (HIIT Aeróbico)',
      modality,
      totalDurationMinutes: duration,
      primaryZone: 'Z5',
      warmup: {
        name: 'Calentamiento Dinámico & Activación Progresiva',
        duration: '10 min',
        intensityZone: 'Z2',
        targetPaceOrRpe: 'Z1 a Z3 progresivo',
        description: 'Incluye 2 progresiones de 20 segundos a ritmo de intervalo para preparar el sistema cardiopulmonar.'
      },
      mainBlock: Array.from({ length: reps }).map((_, idx) => ({
        name: `Intervalo ${idx + 1}/${reps} (VO2 Máx) + Recuperación`,
        duration: `${intervalWorkTime} trabajo / ${intervalRestTime} descanso`,
        intensityZone: 'Z5',
        targetPaceOrRpe: '90-95% FCmáx / RPE 9 (Máximo ritmo sostenible)',
        cadenceOrStroke: modality === 'running' ? 'Cadencia alta 180+ ppm' : 'Cadencia 95-105 rpm',
        description: `Mantén la máxima potencia aeróbica durante los ${intervalWorkTime}. En el descanso, continúa en movimiento en Z1 para depurar lactato.`
      })),
      cooldown: {
        name: 'Enfriamiento y Regeneración',
        duration: '8 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2 / <60% FCmáx',
        description: 'Recuperación aeróbica lenta y respiración diafragmática profunda.'
      },
      biomechanicalCue: 'Mantén la forma técnica intacta aun con fatiga. Evita tensionar mandíbula y trapecios durante los esfuerzos máximos.',
      nutritionHydrationTip: 'Consumir 30-45g de carbohidratos de rápida asimilación antes de la sesión para asegurar disponibilidad de glucógeno.'
    };
  }

  if (dayNum === 3) {
    // Session 3: Threshold / Tempo / SweetSpot
    return {
      sessionNumber: 3,
      title: 'Sesión 03 · Tempo & Umbral de Lactato (SweetSpot)',
      type: 'Trabajo Continuo en Umbral Anaeróbico',
      modality,
      totalDurationMinutes: duration,
      primaryZone: 'Z4',
      warmup: {
        name: 'Calentamiento Estructurado',
        duration: '10 min',
        intensityZone: 'Z2',
        targetPaceOrRpe: 'RPE 3-4 / 60-70% FCmáx',
        description: 'Activación progresiva con 3 aceleraciones cortas.'
      },
      mainBlock: [
        {
          name: 'Bloque de Umbral Sostenido (2x10 min o 1x20 min)',
          duration: `${Math.min(25, duration - 18)} min`,
          intensityZone: 'Z4',
          targetPaceOrRpe: '84-88% FCmáx / RPE 8 / Ritmo de 10K',
          cadenceOrStroke: 'Cadencia óptima constante',
          description: 'Ritmo confortablemente duro. Sensación de esfuerzo controlado justo por debajo del punto de acumulación masiva de lactato.'
        }
      ],
      cooldown: {
        name: 'Vuelta a la Calma',
        duration: '8 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2 / <60% FCmáx',
        description: 'Trote o pedaleo muy suave sin resistencia.'
      },
      biomechanicalCue: 'Focaliza la respiración en ritmo 2:2 (dos pasos/revoluciones inhalar, dos exhalar). Tronco estable.',
      nutritionHydrationTip: 'Rehidratar inmediatamente post-entrenamiento con ratio 3:1 de carbohidratos y proteínas.'
    };
  }

  if (dayNum === 4) {
    // Session 4: Long Slow Distance (LSD) or Recovery Z1/Z2
    return {
      sessionNumber: 4,
      title: 'Sesión 04 · Capilarización & Resistencia Larga (LSD)',
      type: 'Tirada Larga Aeróbica Continua',
      modality,
      totalDurationMinutes: duration,
      primaryZone: 'Z2',
      warmup: {
        name: 'Entrada en Calor',
        duration: '8 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2-3 / 55-60% FCmáx',
        description: 'Toma de contacto con el ritmo de crucero.'
      },
      mainBlock: [
        {
          name: 'Crucero Aeróbico Puro',
          duration: `${duration - 15} min`,
          intensityZone: 'Z2',
          targetPaceOrRpe: '60-68% FCmáx / RPE 4',
          description: 'Desarrollo de la eficiencia de transporte de oxígeno por la hemoglobina y ahorro de glucógeno.'
        }
      ],
      cooldown: {
        name: 'Enfriamiento',
        duration: '7 min',
        intensityZone: 'Z1',
        targetPaceOrRpe: 'RPE 2',
        description: 'Estiramientos dinámicos suaves al finalizar.'
      },
      biomechanicalCue: 'Enfócate en la relajación corporal. Cuanto más relajada sea la musculatura accesoria, menor será el gasto de O2.',
      nutritionHydrationTip: 'Beber 150-200ml de agua o isotónico cada 20 minutos de forma pautada.'
    };
  }

  // Fallback for Days 5 & 6 (Recovery / Sprint Intervals SIT)
  return {
    sessionNumber: dayNum,
    title: `Sesión 0${dayNum} · Sprint Interval Training & Potencia Aláctica (SIT)`,
    type: 'Intervalos Anaeróbicos de Máxima Potencia (Sprints 15s - 30s)',
    modality,
    totalDurationMinutes: duration,
    primaryZone: 'Z5',
    warmup: {
      name: 'Calentamiento Completo con Progresiones',
      duration: '12 min',
      intensityZone: 'Z2',
      targetPaceOrRpe: 'Progresivo con drills técnicos',
      description: 'Preparación neuromuscular exhaustiva antes de esfuerzos al 100%.'
    },
    mainBlock: [
      {
        name: 'Repeticiones de Sprint Máximo (6 a 8 x 20s)',
        duration: '15 min totales',
        intensityZone: 'Z5',
        targetPaceOrRpe: 'RPE 10 / Esfuerzo máximo / Recuperación completa 2 min',
        description: 'Sprints al 100% con descansos completos para regenerar fosfocreatina y estimular densidad mitocondrial.'
      }
    ],
    cooldown: {
      name: 'Vuelta a la Calma Regenerativa',
      duration: '8 min',
      intensityZone: 'Z1',
      targetPaceOrRpe: 'RPE 2',
      description: 'Pedaleo o trote ultra suave.'
    },
    biomechanicalCue: 'Máxima aplicación de fuerza contra el suelo o bielas en los primeros 5 segundos de cada sprint.',
    nutritionHydrationTip: 'Consumo de creatina y carbohidratos post-sesión para optimizar la recuperación muscular.'
  };
}
