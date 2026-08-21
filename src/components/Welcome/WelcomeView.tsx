import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, RefreshCw, Flame, Sparkles, Award } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { HeinzSpeechBubble } from '../UI/HeinzSpeechBubble';
import { HazardButton } from '../UI/HazardButton';
import dialogues from '../../data/dialogues.json';
import { soundFx } from '../../utils/audioSynth';

export const WelcomeView: React.FC = () => {
  const { setStep, heinzSpeech, heinzMood } = useDoofStore();

  const welcomeData = dialogues.welcome;

  const features = [
    {
      icon: <RefreshCw className="w-5 h-5 text-doof-green-acid" />,
      title: 'Sustitución de Máquina Ocupada',
      desc: 'Si alguien pierde el tiempo en el gym, cambia el ejercicio al instante con idéntico patrón biomecánico.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
      title: 'Reemplazo Permanente Anti-Dolor',
      desc: '¿No tienes la máquina o te duele la articulación? Reconfiguración permanente con mancuernas o peso libre.'
    },
    {
      icon: <Flame className="w-5 h-5 text-red-400" />,
      title: 'Botón de Autodestrucción',
      desc: 'El sello oficial de Doofenshmirtz: resetea y desintegra todo con efectos cataclísmicos.'
    },
    {
      icon: <Award className="w-5 h-5 text-cyan-400" />,
      title: 'Sobrecarga de Élite para Vencer a Roger',
      desc: 'Series, repeticiones y descansos científicamente calculados para 2 a 6 días por semana.'
    }
  ];

  const handleStart = () => {
    soundFx.playJingle();
    setStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-doof-panel via-doof-card to-doof-darkest border-2 border-doof-purple p-6 md:p-10 shadow-2xl shadow-purple-950/40 overflow-hidden text-center">
        {/* Background Gradients & Grid */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-doof-green-acid animate-spin-slow" />
            <span>Doofenshmirtz Evil Incorporated • Proyecto Clasificado</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-comic text-4xl sm:text-6xl md:text-7xl text-white tracking-wide leading-none"
          >
            EL GENERADOR-DE-RUTINAS-<span className="text-transparent bg-clip-text bg-gradient-to-r from-doof-green-acid via-emerald-400 to-teal-300">INADOR 3000</span>
          </motion.h1>

          <p className="text-base sm:text-lg text-slate-300 font-tech">
            «Conquistar el Área Limítrofe (y ponerse mamadísimo en el proceso)»
          </p>

          {/* Heinz Speech Monologue */}
          <div className="pt-2 text-left">
            <HeinzSpeechBubble speech={heinzSpeech || welcomeData.monologue} mood={heinzMood} />
          </div>

          {/* Main Call to Action Button */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="pt-4"
          >
            <HazardButton
              variant="green"
              size="xl"
              onClick={handleStart}
              icon={<Zap className="w-6 h-6 text-slate-950 animate-bounce" />}
              className="w-full sm:w-auto shadow-2xl shadow-emerald-950/60"
            >
              {welcomeData.ctaButton}
            </HazardButton>
          </motion.div>

          <p className="text-[11px] font-mono text-slate-400 italic">
            {welcomeData.secondaryNote}
          </p>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-5 rounded-2xl bg-doof-card/80 border border-doof-border hover:border-doof-purple/60 transition-all hover:bg-doof-panel/80 shadow-lg"
          >
            <div className="p-3 rounded-xl bg-doof-darkest border border-slate-700/60 flex-shrink-0">
              {feat.icon}
            </div>
            <div>
              <h3 className="font-bold font-tech text-white text-base uppercase tracking-wide">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
