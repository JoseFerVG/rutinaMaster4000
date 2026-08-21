export type CardioModality =
  | 'running'
  | 'cycling'
  | 'rowing'
  | 'swimming'
  | 'hiit_erg'
  | 'hybrid_concurrent';

export type CardioGoal =
  | 'zone2_base'          // Base aeróbica mitocondrial y salud cardiovascular
  | 'vo2max'               // Potencia aeróbica máxima y umbral de lactato
  | 'fat_loss_concurrent'  // Cardio concurrente con mínima interferencia de hipertrofia
  | 'anaerobic_power'      // Capacidad glucolítica e intervalos HIIT/SIT
  | 'race_preparation';    // Preparación para prueba de resistencia (5K, 10K, 21K, Fondo)

export type CardioExperience = 'principiante' | 'intermedio' | 'avanzado';

export type IntensityMetric =
  | 'heart_rate'   // % FCmáx / Z1-Z5
  | 'rpe'          // Escala Borg 1-10
  | 'pace'         // Ritmo min/km o min/500m
  | 'power_watts'; // Watios / FTP (ciclismo/ergómetro)

export type PeriodizationModel = 'polarized' | 'pyramidal' | 'threshold' | 'hiit_focused';

export interface HeartRateZone {
  zone: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  name: string;
  percentageFcMax: string;
  rpeScale: string;
  primaryEnergySystem: string;
  physiologicalAdaptation: string;
}

export interface CardioInterval {
  name: string;
  duration: string;
  intensityZone: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  targetPaceOrRpe: string;
  cadenceOrStroke?: string;
  description: string;
}

export interface CardioSession {
  sessionNumber: number;
  title: string;
  type: string; // ej: "Intervalos VO2 Máx 4x4", "Tirada Continua Zona 2", "Tempo Run en Umbral", "SIT 10x30s"
  modality: CardioModality;
  totalDurationMinutes: number;
  primaryZone: 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';
  warmup: CardioInterval;
  mainBlock: CardioInterval[];
  cooldown: CardioInterval;
  biomechanicalCue: string;
  nutritionHydrationTip: string;
  isCompleted?: boolean;
  userLogNotes?: string;
}

export interface CardioRoutine {
  id: string;
  name: string;
  subtitle: string;
  createdAt: string;
  modality: CardioModality;
  goal: CardioGoal;
  experience: CardioExperience;
  daysPerWeek: number;
  sessionDuration: number;
  periodizationModel: PeriodizationModel;
  intensityMetric: IntensityMetric;
  zonesGuide: HeartRateZone[];
  sessions: CardioSession[];
  summaryNote: string;
}
