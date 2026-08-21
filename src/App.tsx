import { motion, AnimatePresence } from 'framer-motion';
import { useRoutineStore } from './store/useRoutineStore';
import { Navbar } from './components/Navigation/Navbar';
import { SingleQuestionFlow } from './components/Wizard/SingleQuestionFlow';
import { GeneratingView } from './components/Compilator/GeneratingView';
import { RoutineView } from './components/RoutineView/RoutineView';
import { Toast } from './components/UI/Toast';

export function App() {
  const { step } = useRoutineStore();

  const renderStep = () => {
    switch (step) {
      case 'questionnaire':
        return <SingleQuestionFlow key="questionnaire" />;
      case 'generating':
        return <GeneratingView key="generating" />;
      case 'routine':
        return <RoutineView key="routine" />;
      default:
        return <SingleQuestionFlow key="default" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-zinc-900 flex flex-col antialiased selection:bg-zinc-900 selection:text-white">
      {/* Minimalist Light Navbar */}
      <Navbar />

      {/* Main Single-Question or Routine Stage */}
      <main className="flex-1 w-full flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Austere Minimalist Footer */}
      <footer className="w-full border-t border-zinc-200/70 bg-white/70 py-4 px-4 sm:px-8 text-center text-xs text-zinc-400 font-mono print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            <span className="text-zinc-600 font-sans text-[11px]">KINETIC · Arquitectura de Entrenamiento & Biomecánica</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Sobrecarga Progresiva · Hipertrofia & Rendimiento
          </div>
        </div>
      </footer>

      {/* Global Notifications */}
      <Toast />
    </div>
  );
}

export default App;
