import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useRoutineStore } from './store/useRoutineStore';
import { useCardioStore } from './store/useCardioStore';
import { Navbar } from './components/Navigation/Navbar';
import { SingleQuestionFlow } from './components/Wizard/SingleQuestionFlow';
import { GeneratingView } from './components/Compilator/GeneratingView';
import { RoutineView } from './components/RoutineView/RoutineView';
import { CardioWizard } from './components/Cardio/CardioWizard';
import { CardioGeneratingView } from './components/Cardio/CardioGeneratingView';
import { CardioRoutineView } from './components/Cardio/CardioRoutineView';
import { CalculatorsView } from './components/Calculators/CalculatorsView';
import { Toast } from './components/UI/Toast';

export function App() {
  const { activeSection } = useAppStore();
  const { step: hypertrophyStep } = useRoutineStore();
  const { step: cardioStep } = useCardioStore();

  const renderContent = () => {
    if (activeSection === 'calculators') {
      return <CalculatorsView key="calculators-view" />;
    }

    if (activeSection === 'cardio') {
      switch (cardioStep) {
        case 'wizard':
          return <CardioWizard key="cardio-wizard" />;
        case 'generating':
          return <CardioGeneratingView key="cardio-generating" />;
        case 'routine':
          return <CardioRoutineView key="cardio-routine" />;
        default:
          return <CardioWizard key="cardio-default" />;
      }
    }

    // Default: Hypertrophy & Strength module
    switch (hypertrophyStep) {
      case 'questionnaire':
        return <SingleQuestionFlow key="hypertrophy-questionnaire" />;
      case 'generating':
        return <GeneratingView key="hypertrophy-generating" />;
      case 'routine':
        return <RoutineView key="hypertrophy-routine" />;
      default:
        return <SingleQuestionFlow key="hypertrophy-default" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 flex flex-col antialiased selection:bg-zinc-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Stage */}
      <main className="flex-1 w-full flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSection}-${activeSection === 'hypertrophy' ? hypertrophyStep : activeSection === 'cardio' ? cardioStep : 'static'}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-zinc-200/70 bg-white/70 py-4 px-4 sm:px-8 text-center text-xs text-zinc-400 font-mono print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            <span className="text-zinc-600 font-sans text-[11px]">Kinetic Biomechanics · Suite de Entrenamiento & Fisiología</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Hipertrofia · Zonas Cardíacas · Biomecánica Cuantitativa
          </div>
        </div>
      </footer>

      {/* Global Toast */}
      <Toast />
    </div>
  );
}

export default App;
