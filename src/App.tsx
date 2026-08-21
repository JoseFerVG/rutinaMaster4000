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
  const { step } = useDoofStore();

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
    <div className="min-h-screen bg-zen-darkest text-slate-100 flex flex-col relative antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Subtle Ambient Background Mesh */}
      <div className="fixed inset-0 bg-zen-mesh pointer-events-none z-0" />

      {/* Floating Zen Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 py-4 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimalist Zen Footer */}
      <footer className="w-full border-t border-white/[0.06] bg-zen-darkest/80 py-6 px-4 text-center text-xs text-slate-500 font-sans print:hidden relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>RutinaMaster · Arquitectura Biomecánica & Entrenamiento Zen</span>
          </div>
          <div>
            <span>100% Client-Side · Hipertrofia & Rendimiento</span>
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <Toast />
      <SelfDestructModal />
      <PerryModal />
    </div>
  );
}

export default App;
