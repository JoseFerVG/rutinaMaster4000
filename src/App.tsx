import { motion, AnimatePresence } from 'framer-motion';
import { useDoofStore } from './store/useDoofStore';
import { Header } from './components/UI/Header';
import { Toast } from './components/UI/Toast';
import { SelfDestructModal } from './components/UI/SelfDestructModal';
import { PerryModal } from './components/UI/PerryModal';
import { ConversationalStage } from './components/Dialogue/ConversationalStage';
import { CompilatorView } from './components/Compilator/CompilatorView';
import { RoutineView } from './components/RoutineView/RoutineView';

export function App() {
  const { step, isExploding } = useDoofStore();

  const renderStep = () => {
    switch (step) {
      case 0:
      case 1:
      case 2:
        return <ConversationalStage key={`stage-${step}`} />;
      case 3:
        return <CompilatorView key="compilator" />;
      case 4:
        return <RoutineView key="routine" />;
      default:
        return <ConversationalStage key="stage-default" />;
    }
  };

  return (
    <div className={`min-h-screen bg-doof-darkest text-slate-100 flex flex-col relative transition-all duration-300 ${
      isExploding ? 'animate-shake filter invert' : ''
    }`}>
      {/* Top Laboratory Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 py-2 md:py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Laboratory Footer */}
      <footer className="w-full border-t border-doof-border bg-doof-darkest/90 py-4 px-4 text-center text-xs text-slate-500 font-mono print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span>🧪</span>
            <span>Doofenshmirtz Evil Incorporated • Danville Tri-State Area</span>
          </div>
          <div>
            <span>100% Client-Side Interactive Character Dialogue Engine</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <Toast />
      <SelfDestructModal />
      <PerryModal />
    </div>
  );
}

export default App;
