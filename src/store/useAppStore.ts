import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppSection = 'hypertrophy' | 'cardio' | 'calculators';

interface AppStore {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeSection: 'hypertrophy',
      setActiveSection: (activeSection: AppSection) => set({ activeSection })
    }),
    {
      name: 'kinetic-app-navigation',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
