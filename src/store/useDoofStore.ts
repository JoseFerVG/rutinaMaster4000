import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MuscleGroupId,
  ExperienceLevel,
  EquipmentPreference,
  Routine,
  HeinzMood,
  ToastMessage,
  Exercise
} from '../types';
import rawExercises from '../data/exercises.json';
import dialogues from '../data/dialogues.json';
import {
  buildRoutine,
  findQuickSubstitution,
  findPermanentSubstitution
} from '../utils/routineEngine';
import { soundFx } from '../utils/audioSynth';

const exercisesDb = rawExercises as Exercise[];

interface DoofStore {
  // Wizard & App State
  step: number; // 0 = Welcome, 1 = Body Target, 2 = Logistics, 3 = Compil-inator, 4 = Blueprint
  selectedMuscles: MuscleGroupId[];
  experience: ExperienceLevel;
  daysPerWeek: number;
  equipment: EquipmentPreference;

  // Active Routine
  activeRoutine: Routine | null;
  activeDayTab: number;

  // Heinz Dialogue & Reactive state
  heinzSpeech: string;
  heinzMood: HeinzMood;

  // Global App Controls & Modals
  audioEnabled: boolean;
  toast: ToastMessage | null;
  isSelfDestructModalOpen: boolean;
  isPerryModalOpen: boolean;
  isExploding: boolean;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleMuscle: (muscleId: MuscleGroupId) => void;
  selectPreset: (presetId: string) => void;
  clearMuscles: () => void;
  setDaysPerWeek: (days: number) => void;
  setExperience: (level: ExperienceLevel) => void;
  setEquipment: (eq: EquipmentPreference) => void;
  setHeinzSpeech: (speech: string, mood?: HeinzMood) => void;
  toggleAudio: () => void;

  // Routine Actions
  generateRoutine: () => void;
  replaceTemporary: (dayNumber: number, instanceId: string) => void;
  replacePermanent: (dayNumber: number, instanceId: string) => void;
  toggleSetCompleted: (dayNumber: number, instanceId: string, setIndex: number) => void;
  updateExerciseNotes: (dayNumber: number, instanceId: string, notes: string) => void;
  setActiveDayTab: (dayNum: number) => void;

  // Self-Destruct & Easter Eggs
  openSelfDestructModal: () => void;
  closeSelfDestructModal: () => void;
  selfDestruct: () => void;
  triggerPerryEasterEgg: () => void;
  closePerryModal: () => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: () => void;
}

export const useDoofStore = create<DoofStore>()(
  persist(
    (set, get) => ({
      step: 0,
      selectedMuscles: ['chest', 'back_upper', 'quads', 'shoulders'],
      experience: 'intermedio',
      daysPerWeek: 4,
      equipment: 'commercial',

      activeRoutine: null,
      activeDayTab: 1,

      heinzSpeech: dialogues.welcome.monologue,
      heinzMood: 'normal',

      audioEnabled: true,
      toast: null,
      isSelfDestructModalOpen: false,
      isPerryModalOpen: false,
      isExploding: false,

      setStep: (step: number) => {
        soundFx.playGearClick();
        set({ step });
      },

      nextStep: () => {
        const { step } = get();
        if (step < 4) {
          soundFx.playGearClick();
          set({ step: step + 1 });
        }
      },

      prevStep: () => {
        const { step } = get();
        if (step > 0) {
          soundFx.playGearClick();
          set({ step: step - 1 });
        }
      },

      toggleMuscle: (muscleId: MuscleGroupId) => {
        soundFx.playMuscleSelect();
        const { selectedMuscles } = get();
        const exists = selectedMuscles.includes(muscleId);
        let updated: MuscleGroupId[];

        if (exists) {
          updated = selectedMuscles.filter(m => m !== muscleId);
          const deselectQuotes = dialogues.muscleDeselectQuotes;
          const quote = deselectQuotes[Math.floor(Math.random() * deselectQuotes.length)];
          set({ selectedMuscles: updated, heinzSpeech: quote, heinzMood: 'complaining' });
        } else {
          updated = [...selectedMuscles, muscleId];
          const quote = (dialogues.muscleQuotes as Record<string, string>)[muscleId] || '¡Excelente objetivo!';
          set({ selectedMuscles: updated, heinzSpeech: quote, heinzMood: 'evil' });
        }
      },

      selectPreset: (presetId: string) => {
        soundFx.playLaser();
        const preset = dialogues.presets.find(p => p.id === presetId);
        if (preset) {
          set({
            selectedMuscles: preset.muscles as MuscleGroupId[],
            heinzSpeech: `¡Ah, el preset "${preset.name}"! ${preset.description} ¡Preparando la maquinaria!`,
            heinzMood: 'evil'
          });
        }
      },

      clearMuscles: () => {
        soundFx.playGearClick();
        set({
          selectedMuscles: [],
          heinzSpeech: '¿Has deseleccionado todo? ¡No puedes conquistar el Área Limítrofe siendo un holograma incorpóreo!',
          heinzMood: 'shocked'
        });
      },

      setDaysPerWeek: (days: number) => {
        soundFx.playLaser();
        const dayOption = dialogues.wizard.daysQuestion.options.find(o => o.days === days);
        set({
          daysPerWeek: days,
          heinzSpeech: dayOption ? dayOption.doofComment : `¡${days} días! Excelente elección.`,
          heinzMood: 'excited'
        });
      },

      setExperience: (level: ExperienceLevel) => {
        soundFx.playLaser();
        const expOption = dialogues.wizard.experienceQuestion.options.find(o => o.level === level);
        set({
          experience: level,
          heinzSpeech: expOption ? expOption.doofComment : 'Nivel configurado.',
          heinzMood: 'normal'
        });
      },

      setEquipment: (eq: EquipmentPreference) => {
        soundFx.playLaser();
        const eqOption = dialogues.wizard.equipmentQuestion.options.find(o => o.type === eq);
        set({
          equipment: eq,
          heinzSpeech: eqOption ? eqOption.doofComment : 'Entorno seleccionado.',
          heinzMood: 'normal'
        });
      },

      setHeinzSpeech: (speech: string, mood: HeinzMood = 'normal') => {
        set({ heinzSpeech: speech, heinzMood: mood });
      },

      toggleAudio: () => {
        const next = !get().audioEnabled;
        soundFx.enabled = next;
        set({ audioEnabled: next });
      },

      generateRoutine: () => {
        const { selectedMuscles, daysPerWeek, experience, equipment } = get();
        const newRoutine = buildRoutine(selectedMuscles, daysPerWeek, experience, equipment, exercisesDb);
        set({
          activeRoutine: newRoutine,
          activeDayTab: 1,
          step: 4,
          heinzSpeech: newRoutine.heinzBlueprintComment,
          heinzMood: 'evil'
        });
      },

      replaceTemporary: (dayNumber: number, instanceId: string) => {
        soundFx.playGearClick();
        const { activeRoutine, equipment } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const currentDayExerciseIds = day.exercises.map(e => e.exerciseId);
        const { replacement, complaint } = findQuickSubstitution(
          exerciseInstance.exerciseId,
          equipment,
          exercisesDb,
          currentDayExerciseIds
        );

        if (!replacement) {
          get().showToast('¡Error de sustitución!', complaint, 'warning');
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
                replacementMessage: complaint
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          },
          heinzSpeech: complaint,
          heinzMood: 'complaining'
        });

        get().showToast('¡Sustitución Rápida!', `Reemplazado por: ${replacement.name}`, 'info');
      },

      replacePermanent: (dayNumber: number, instanceId: string) => {
        soundFx.playLaser();
        const { activeRoutine, equipment } = get();
        if (!activeRoutine) return;

        const day = activeRoutine.days.find(d => d.dayNumber === dayNumber);
        if (!day) return;

        const exerciseInstance = day.exercises.find(e => e.instanceId === instanceId);
        if (!exerciseInstance) return;

        const currentDayExerciseIds = day.exercises.map(e => e.exerciseId);
        const { replacement, complaint } = findPermanentSubstitution(
          exerciseInstance.exerciseId,
          equipment,
          exercisesDb,
          currentDayExerciseIds
        );

        if (!replacement) {
          get().showToast('¡Error de reemplazo!', complaint, 'warning');
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
                replacementMessage: complaint
              };
            })
          };
        });

        set({
          activeRoutine: {
            ...activeRoutine,
            days: updatedDays
          },
          heinzSpeech: complaint,
          heinzMood: 'complaining'
        });

        get().showToast('¡Reemplazo Permanente!', `Plano actualizado con: ${replacement.name}`, 'success');
      },

      toggleSetCompleted: (dayNumber: number, instanceId: string, setIndex: number) => {
        soundFx.playGearClick();
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

      setActiveDayTab: (dayNum: number) => {
        soundFx.playGearClick();
        set({ activeDayTab: dayNum });
      },

      openSelfDestructModal: () => {
        soundFx.playSiren();
        set({ isSelfDestructModalOpen: true });
      },

      closeSelfDestructModal: () => {
        set({ isSelfDestructModalOpen: false });
      },

      selfDestruct: () => {
        soundFx.playExplosion();
        set({ isExploding: true, isSelfDestructModalOpen: false });

        setTimeout(() => {
          set({
            step: 0,
            activeRoutine: null,
            isExploding: false,
            heinzSpeech: dialogues.selfDestructDialogues.explodedToast,
            heinzMood: 'shocked',
            selectedMuscles: ['chest', 'back_upper', 'quads', 'shoulders']
          });
          get().showToast('¡BOOOOOM!', 'El Inador ha sido completamente autodestruido.', 'danger');
        }, 1200);
      },

      triggerPerryEasterEgg: () => {
        soundFx.playPerrySound();
        set({
          isPerryModalOpen: true,
          heinzSpeech: '¡¿PERRY EL ORNITORRINCO?! ¿Qué haces saboteando mi aplicación de gimnasio?',
          heinzMood: 'shocked'
        });
      },

      closePerryModal: () => {
        set({ isPerryModalOpen: false });
      },

      showToast: (title: string, message: string, type: ToastMessage['type'] = 'info') => {
        const toast: ToastMessage = {
          id: `toast_${Date.now()}`,
          title,
          message,
          type,
          duration: 4000
        };
        set({ toast });
        setTimeout(() => {
          const current = get().toast;
          if (current?.id === toast.id) {
            set({ toast: null });
          }
        }, 4000);
      },

      dismissToast: () => {
        set({ toast: null });
      }
    }),
    {
      name: 'doof-rutinamaster-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        selectedMuscles: state.selectedMuscles,
        experience: state.experience,
        daysPerWeek: state.daysPerWeek,
        equipment: state.equipment,
        activeRoutine: state.activeRoutine,
        step: state.step,
        audioEnabled: state.audioEnabled
      })
    }
  )
);
