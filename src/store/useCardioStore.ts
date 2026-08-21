import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CardioModality,
  CardioGoal,
  CardioExperience,
  CardioRoutine,
  IntensityMetric
} from '../types/cardio';
import { buildCardioRoutine } from '../utils/cardioEngine';

interface CardioStore {
  // Wizard & Flow State
  currentQuestion: number; // 0..4
  step: 'wizard' | 'generating' | 'routine';

  // Configuration
  modality: CardioModality;
  goal: CardioGoal;
  experience: CardioExperience;
  daysPerWeek: number;
  sessionDuration: number;
  intensityMetric: IntensityMetric;

  // Active Routine
  activeCardioRoutine: CardioRoutine | null;
  activeSessionTab: number;

  // Actions
  setCurrentQuestion: (idx: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  setModality: (modality: CardioModality) => void;
  setGoal: (goal: CardioGoal) => void;
  setExperience: (experience: CardioExperience) => void;
  setDaysPerWeek: (days: number) => void;
  setSessionDuration: (duration: number) => void;
  setIntensityMetric: (metric: IntensityMetric) => void;

  generateCardioRoutine: () => void;
  resetAll: () => void;
  setActiveSessionTab: (sessionNum: number) => void;
  toggleSessionCompleted: (sessionNum: number) => void;
  updateSessionNotes: (sessionNum: number, notes: string) => void;
}

export const useCardioStore = create<CardioStore>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      step: 'wizard',

      modality: 'running',
      goal: 'zone2_base',
      experience: 'intermedio',
      daysPerWeek: 3,
      sessionDuration: 45,
      intensityMetric: 'heart_rate',

      activeCardioRoutine: null,
      activeSessionTab: 1,

      setCurrentQuestion: (index: number) => set({ currentQuestion: index }),

      nextQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion < 4) {
          set({ currentQuestion: currentQuestion + 1 });
        } else {
          get().generateCardioRoutine();
        }
      },

      prevQuestion: () => {
        const { currentQuestion } = get();
        if (currentQuestion > 0) {
          set({ currentQuestion: currentQuestion - 1 });
        }
      },

      setModality: (modality: CardioModality) => set({ modality }),
      setGoal: (goal: CardioGoal) => set({ goal }),
      setExperience: (experience: CardioExperience) => set({ experience }),
      setDaysPerWeek: (daysPerWeek: number) => set({ daysPerWeek }),
      setSessionDuration: (sessionDuration: number) => set({ sessionDuration }),
      setIntensityMetric: (intensityMetric: IntensityMetric) => set({ intensityMetric }),

      generateCardioRoutine: () => {
        set({ step: 'generating' });

        setTimeout(() => {
          const { modality, goal, experience, daysPerWeek, sessionDuration, intensityMetric } = get();
          const routine = buildCardioRoutine(
            modality,
            goal,
            experience,
            daysPerWeek,
            sessionDuration,
            intensityMetric
          );

          set({
            activeCardioRoutine: routine,
            activeSessionTab: 1,
            step: 'routine'
          });
        }, 1100);
      },

      resetAll: () => {
        set({
          step: 'wizard',
          currentQuestion: 0,
          activeCardioRoutine: null,
          activeSessionTab: 1
        });
      },

      setActiveSessionTab: (sessionNum: number) => set({ activeSessionTab: sessionNum }),

      toggleSessionCompleted: (sessionNum: number) => {
        const { activeCardioRoutine } = get();
        if (!activeCardioRoutine) return;

        const updatedSessions = activeCardioRoutine.sessions.map(s => {
          if (s.sessionNumber !== sessionNum) return s;
          return { ...s, isCompleted: !s.isCompleted };
        });

        set({
          activeCardioRoutine: {
            ...activeCardioRoutine,
            sessions: updatedSessions
          }
        });
      },

      updateSessionNotes: (sessionNum: number, notes: string) => {
        const { activeCardioRoutine } = get();
        if (!activeCardioRoutine) return;

        const updatedSessions = activeCardioRoutine.sessions.map(s => {
          if (s.sessionNumber !== sessionNum) return s;
          return { ...s, userLogNotes: notes };
        });

        set({
          activeCardioRoutine: {
            ...activeCardioRoutine,
            sessions: updatedSessions
          }
        });
      }
    }),
    {
      name: 'kinetic-cardio-storage-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        step: state.step,
        currentQuestion: state.currentQuestion,
        modality: state.modality,
        goal: state.goal,
        experience: state.experience,
        daysPerWeek: state.daysPerWeek,
        sessionDuration: state.sessionDuration,
        intensityMetric: state.intensityMetric,
        activeCardioRoutine: state.activeCardioRoutine,
        activeSessionTab: state.activeSessionTab
      })
    }
  )
);
