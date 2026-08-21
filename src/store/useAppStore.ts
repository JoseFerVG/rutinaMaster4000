import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CategoryId = 'routines' | 'calculators';
export type ToolId = 'hypertrophy' | 'cardio' | 'calculator_1rm' | 'calculator_hr';

export type AppView = 'home' | 'category' | 'tool';

interface AppStore {
  currentView: AppView;
  activeCategory: CategoryId | null;
  activeTool: ToolId | null;

  // Navigation actions
  goHome: () => void;
  goToCategory: (category: CategoryId) => void;
  goToTool: (tool: ToolId, category?: CategoryId) => void;
  goBack: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      activeCategory: null,
      activeTool: null,

      goHome: () => {
        set({
          currentView: 'home',
          activeCategory: null,
          activeTool: null
        });
      },

      goToCategory: (category: CategoryId) => {
        set({
          currentView: 'category',
          activeCategory: category,
          activeTool: null
        });
      },

      goToTool: (tool: ToolId, category?: CategoryId) => {
        const cat = category || (tool === 'hypertrophy' || tool === 'cardio' ? 'routines' : 'calculators');
        set({
          currentView: 'tool',
          activeCategory: cat,
          activeTool: tool
        });
      },

      goBack: () => {
        const { currentView, activeCategory } = get();
        if (currentView === 'tool') {
          if (activeCategory) {
            set({ currentView: 'category', activeTool: null });
          } else {
            set({ currentView: 'home', activeCategory: null, activeTool: null });
          }
        } else if (currentView === 'category') {
          set({ currentView: 'home', activeCategory: null, activeTool: null });
        }
      }
    }),
    {
      name: 'kinetic-app-navigation-v2',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
