import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MuscleGroupId,
  ExperienceLevel,
  EquipmentPreference,
  TrainingGoal,
  SessionDuration,
  MuscleFocusPreset,
  Routine,
  ToastMessage,
  Exercise
} from '../types';
import rawExercises from '../data/exercises.json';
import {
  buildRoutine,
  findQuickSubstitution,
  findPermanentSubstitution,
  findFreeWeightAlternative
} from '../utils/routineEngine';

const exercisesDb = rawExercises as Exercise[];

interface RoutineStore {
  // Wizard & Flow State
  currentQuestion: number; // 0..5
  step: 'questionnaire' | 'generating' | 'routine';
  
  // User Configuration
  goal: TrainingGoal;
  experience: ExperienceLevel;
  daysPerWeek: number;
  sessionDuration: SessionDuration;
  equipment: EquipmentPreference;
  focusPreset: MuscleFocusPreset;
  selectedMuscles: MuscleGroupId[];

  // Active Generated Routine
  activeRoutine: Routine | null;
  activeDayTab: number;

  // Toast / System Notification
  toast: ToastMessage | null;

  // Question Navigation Actions
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Configuration Setters
  setGoal: (goal: TrainingGoal) => void;
  setExperience: (level: ExperienceLevel) => void;
  setDaysPerWeek: (days: number) => void;
  setSessionDuration: (duration: SessionDuration) => void;
  setEquipment: (eq: EquipmentPreference) => void;
  setFocusPreset: (preset: MuscleFocusPreset) => void;
  toggleMuscle: (muscleId: MuscleGroupId) => void;
  setSelectedMuscles: (muscles: MuscleGroupId[]) => void;

  // Routine Lifecycle Actions
  generateRoutine: () => void;
  resetAll: () => void;

  // Routine Workout Actions
  replaceTemporary: (dayNumber: number, instanceId: string) => void;
  replacePermanent: (dayNumber: number, instanceId: string) => void;
  replaceWithFreeWeight: (dayNumber: number, instanceId: string) => void;
  setSpecificExercise: (dayNumber: number, instanceId: string, newExerciseId: string) => void;
  setSpecificAlternative: (dayNumber: number, instanceId: string, newAlternativeExerciseId: string) => void;
  toggleUseAlternative: (dayNumber: number, instanceId: string) => void;
  toggleOmitExercise: (dayNumber: number, instanceId: string) => void;
  toggleSetCompleted: (dayNumber: number, instanceId: string, setIndex: number) => void;
  updateExerciseNotes: (dayNumber: number, instanceId: string, notes: string) => void;
  setActiveDayTab: (dayNum: number) => void;

  // UI Toast
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: () => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      step: 'questionnaire',

      goal: 'hipertrofia',
      experience: 'intermedio',
      daysPerWeek: 4,
      sessionDuration: 60,
      equipment: 'commercial',
      focusPreset: 'balance',
      selectedMuscles: ['chest', 'back_upper', 'shoulders', 'quads', 'hamstrings', 'glutes', 'biceps', 'triceps', 'core', 'calves'],

      activeRoutine: null,
      activeDayTab: 1,
      toast: null,

      setCurrentQuestion: (index: number) => set({ currentQuestion: index }),

      nextQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion < 5) {
          set({ currentQuestion: currentQuestion + 1 });
        } else {
          get().generateRoutine();
        }
      },

      prevQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion > 0) {
          set({ currentQuestion: currentQuestion - 1 });
        }
      },

      setGoal: (goal: TrainingGoal) => set({ goal }),
      setExperience: (experience: ExperienceLevel) => set({ experience }),
      setDaysPerWeek: (daysPerWeek: number) => set({ daysPerWeek }),
      setSessionDuration: (sessionDuration: SessionDuration) => set({ sessionDuration }),
      setEquipment: (equipment: EquipmentPreference) => set({ equipment }),

      setFocusPreset: (focusPreset: MuscleFocusPreset) => {
        let muscles: MuscleGroupId[] = [];
        if (focusPreset === 'balance') {
          muscles = ['chest', 'back_upper', 'shoulders', 'quads', 'hamstrings', 'glutes', 'biceps', 'triceps', 'core', 'calves'];
        } else if (focusPreset === 'upper') {
          muscles = ['chest', 'back_upper', 'shoulders', 'biceps', 'triceps'];
        } else if (focusPreset === 'lower') {
          muscles = ['quads', 'glutes', 'hamstrings', 'calves'];
        } else if (focusPreset === 'shoulders_back') {
          muscles = ['back_upper', 'shoulders', 'back_lower', 'biceps'];
        } else {
          muscles = get().selectedMuscles.length > 0 ? get().selectedMuscles : ['chest', 'back_upper', 'quads'];
        }
        set({ focusPreset, selectedMuscles: muscles });
      },

      toggleMuscle: (muscleId: MuscleGroupId) => {
        const { selectedMuscles } = get();
        const exists = selectedMuscles.includes(muscleId);
        const updated = exists
          ? selectedMuscles.filter(m => m !== muscleId)
          : [...selectedMuscles, muscleId];
        set({ selectedMuscles: updated, focusPreset: 'custom' });
      },

      setSelectedMuscles: (muscles: MuscleGroupId[]) => set({ selectedMuscles: muscles, focusPreset: 'custom' }),

      generateRoutine: () => {
        set({ step: 'generating' });

        setTimeout(() => {
          const { selectedMuscles, daysPerWeek, experience, equipment, goal, sessionDuration } = get();
          const routine = buildRoutine(
            selectedMuscles,
            daysPerWeek,
            experience,
            equipment,
            goal,
            sessionDuration,
            exercisesDb
          );

          set({
            activeRoutine: routine,
            activeDayTab: 1,
            step: 'routine'
          });
        }, 1100);
      },

      resetAll: () => {
        set({
          step: 'questionnaire',
          currentQuestion: 0,
          activeRoutine: null,
          activeDayTab: 1
        });
      },

      replaceTemporary: (dayNumber: number, instanceId: string) => {
        const { activeRoutine, equipment } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const currentDayExerciseIds = day.exercises.map(e => e.exerciseId);
        const { replacement, feedback } = findQuickSubstitution(
          exerciseInstance.exerciseId,
          equipment,
          exercisesDb,
          currentDayExerciseIds
        );

        if (!replacement) {
          get().showToast('Aviso', feedback, 'warning');
          return;
        }

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                exerciseId: replacement.id,
                isTemporarilyReplaced: true,
                isOmitted: false,
                replacementMessage: feedback
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast('Sustitución Aplicada', `Reemplazado por: ${replacement.name}`, 'info');
      },

      replacePermanent: (dayNumber: number, instanceId: string) => {
        const { activeRoutine, equipment } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const currentDayExerciseIds = day.exercises.map(e => e.exerciseId);
        const { replacement, feedback } = findPermanentSubstitution(
          exerciseInstance.exerciseId,
          equipment,
          exercisesDb,
          currentDayExerciseIds
        );

        if (!replacement) {
          get().showToast('Aviso', feedback, 'warning');
          return;
        }

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                exerciseId: replacement.id,
                originalExerciseId: replacement.id,
                isTemporarilyReplaced: false,
                isPermanentlyReplaced: true,
                isOmitted: false,
                replacementMessage: feedback
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast('Protocolo Actualizado', `Ejercicio modificado a: ${replacement.name}`, 'success');
      },

      replaceWithFreeWeight: (dayNumber: number, instanceId: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const currentDayExerciseIds = day.exercises.map(e => e.exerciseId);
        const { replacement, feedback } = findFreeWeightAlternative(
          exerciseInstance.exerciseId,
          exercisesDb,
          currentDayExerciseIds
        );

        if (!replacement) {
          get().showToast('Sin alternativa libre', feedback, 'warning');
          return;
        }

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                exerciseId: replacement.id,
                isTemporarilyReplaced: true,
                isSecondaryFreeWeightSwapped: true,
                isOmitted: false,
                replacementMessage: feedback
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast('Variante Libre Asignada', `Reemplazado por básico: ${replacement.name}`, 'info');
      },

      setSpecificExercise: (dayNumber: number, instanceId: string, newExerciseId: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const targetExerciseMeta = exercisesDb.find(e => e.id === newExerciseId);
        if (!targetExerciseMeta) return;

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                exerciseId: newExerciseId,
                originalExerciseId: newExerciseId,
                isTemporarilyReplaced: false,
                isPermanentlyReplaced: true,
                isOmitted: false,
                replacementMessage: `Sustituido manualmente por: ${targetExerciseMeta.name}`
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast('Ejercicio Asignado', `Cambiado a: ${targetExerciseMeta.name}`, 'success');
      },

      setSpecificAlternative: (dayNumber: number, instanceId: string, newAlternativeExerciseId: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const targetAltMeta = exercisesDb.find(e => e.id === newAlternativeExerciseId);
        if (!targetAltMeta) return;

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                alternativeExerciseId: newAlternativeExerciseId
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast('Plan B Actualizado', `Alternativa cambiada a: ${targetAltMeta.name}`, 'info');
      },

      toggleUseAlternative: (dayNumber: number, instanceId: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exInst = day.exercises.find(e => e.instanceId === instanceId);
        if (!exInst || !exInst.alternativeExerciseId) return;

        const isCurrentlyUsingAlt = !!exInst.isUsingAlternative;
        const newExerciseId = isCurrentlyUsingAlt ? exInst.originalExerciseId : exInst.alternativeExerciseId;
        const newAltId = isCurrentlyUsingAlt ? exInst.alternativeExerciseId : exInst.originalExerciseId;

        const newMeta = exercisesDb.find(e => e.id === newExerciseId);

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                exerciseId: newExerciseId,
                alternativeExerciseId: newAltId,
                isUsingAlternative: !isCurrentlyUsingAlt,
                replacementMessage: !isCurrentlyUsingAlt
                  ? `Plan B activado: ${newMeta?.name || ''} (por máquina ocupada o preferencia).`
                  : undefined
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast(
          !isCurrentlyUsingAlt ? 'Plan B Activado' : 'Ejercicio Principal Restaurado',
          `Ahora realizando: ${newMeta?.name || ''}`,
          'info'
        );
      },

      toggleOmitExercise: (dayNumber: number, instanceId: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const newOmittedState = !exerciseInstance.isOmitted;

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return {
                ...ex,
                isOmitted: newOmittedState,
                replacementMessage: newOmittedState ? 'Ejercicio omitido de la sesión.' : undefined
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });

        get().showToast(
          newOmittedState ? 'Ejercicio Secundario Omitido' : 'Ejercicio Restaurado',
          newOmittedState ? 'Se ha retirado de los requerimientos de la sesión.' : 'Se ha vuelto a incluir en la sesión.',
          'info'
        );
      },

      toggleSetCompleted: (dayNumber: number, instanceId: string, setIndex: number) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              const newCompleted = [...ex.completedSets];
              newCompleted[setIndex] = !newCompleted[setIndex];
              return { ...ex, completedSets: newCompleted };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });
      },

      updateExerciseNotes: (dayNumber: number, instanceId: string, notes: string) => {
        const { activeRoutine } = get();
        if (!activeRoutine) return;

        const updatedDays = activeRoutine.days.map(d => {
          if (d.dayNumber !== dayNumber) return d;
          return {
            ...d,
            exercises: d.exercises.map(ex => {
              if (ex.instanceId !== instanceId) return ex;
              return { ...ex, notes };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          }
        });
      },

      setActiveDayTab: (dayNum: number) => set({ activeDayTab: dayNum }),

      showToast: (title: string, message: string, type: ToastMessage['type'] = 'info') => {
        const toast: ToastMessage = {
          id: `toast_${Date.now()}`,
          title,
          message,
          type,
          duration: 3500
        };
        set({ toast });
        setTimeout(() => {
          const current = get().toast;
          if (current?.id === toast.id) {
            set({ toast: null });
          }
        }, 3500);
      },

      dismissToast: () => set({ toast: null })
    }),
    {
      name: 'kinetic-routine-storage-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        step: state.step,
        currentQuestion: state.currentQuestion,
        goal: state.goal,
        experience: state.experience,
        daysPerWeek: state.daysPerWeek,
        sessionDuration: state.sessionDuration,
        equipment: state.equipment,
        focusPreset: state.focusPreset,
        selectedMuscles: state.selectedMuscles,
        activeRoutine: state.activeRoutine,
        activeDayTab: state.activeDayTab
      })
    }
  )
);
