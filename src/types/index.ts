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

export type EquipmentPreference = 'commercial' | 'home';

export interface Exercise {
  id: string;
  name: string;
  doofSubtitle: string;
  muscleGroup: MuscleGroupId;
  secondaryMuscles: MuscleGroupId[];
  movementPattern: MovementPattern;
  equipment: EquipmentCategory;
  directEquivalents: string[];
  freeWeightEquivalents: string[];
  doofTip: string;
  difficulty: ExperienceLevel;
  mechanics: 'compound' | 'isolation';
  tier: 1 | 2 | 3; // 1 = main compound, 2 = secondary, 3 = accessory/isolation
}

export interface RoutineExercise {
  instanceId: string;
  exerciseId: string;
  originalExerciseId: string;
  sets: number;
  reps: string;
  rest: string;
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
  experience: ExperienceLevel;
  daysPerWeek: number;
  equipment: EquipmentPreference;
  selectedMuscles: MuscleGroupId[];
  days: RoutineDay[];
  heinzBlueprintComment: string;
}

export type HeinzMood = 'normal' | 'excited' | 'complaining' | 'evil' | 'paranoid' | 'shocked';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success' | 'perry';
  duration?: number;
}
