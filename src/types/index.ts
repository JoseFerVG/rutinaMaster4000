export type MuscleGroupId =
  | 'chest'
  | 'back_upper'
  | 'back_lower'
  | 'shoulders'
  | 'quads'
  | 'glutes'
  | 'hamstrings'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'calves';

export type MovementPattern =
  | 'horizontal_push'
  | 'horizontal_pull'
  | 'vertical_push'
  | 'vertical_pull'
  | 'quad_dominant'
  | 'hip_hinge'
  | 'knee_flexion'
  | 'arm_flexion'
  | 'arm_extension'
  | 'core_stability'
  | 'calf_raise'
  | 'lateral_raise';

export type EquipmentCategory = 'commercial' | 'home' | 'bodyweight' | 'both';

export type ExperienceLevel = 'novato' | 'intermedio' | 'avanzado';

export type TrainingGoal = 'hipertrofia' | 'fuerza' | 'recomposicion' | 'longevidad';

export type EquipmentPreference = 'commercial' | 'home';

export type MuscleFocusPreset = 'balance' | 'upper' | 'lower' | 'shoulders_back' | 'custom';

export interface Exercise {
  id: string;
  name: string;
  subtitle: string;
  muscleGroup: MuscleGroupId;
  secondaryMuscles: MuscleGroupId[];
  movementPattern: MovementPattern;
  equipment: EquipmentCategory;
  directEquivalents: string[];
  freeWeightEquivalents: string[];
  coachingCue: string;
  difficulty: ExperienceLevel;
  mechanics: 'compound' | 'isolation';
  tier: 1 | 2 | 3; // 1 = main compound, 2 = secondary, 3 = isolation / accessory
}

export interface RoutineExercise {
  instanceId: string;
  exerciseId: string;
  originalExerciseId: string;
  sets: number;
  reps: string;
  rest: string;
  targetRir?: string;
  isTemporarilyReplaced: boolean;
  isPermanentlyReplaced?: boolean;
  replacementMessage?: string;
  completedSets: boolean[];
  notes?: string;
}

export interface RoutineDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  focusMuscles: MuscleGroupId[];
  exercises: RoutineExercise[];
  isRestDay: boolean;
  restDescription?: string;
}

export interface Routine {
  id: string;
  name: string;
  subtitle: string;
  createdAt: string;
  goal: TrainingGoal;
  experience: ExperienceLevel;
  daysPerWeek: number;
  equipment: EquipmentPreference;
  selectedMuscles: MuscleGroupId[];
  days: RoutineDay[];
  summaryNote: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
