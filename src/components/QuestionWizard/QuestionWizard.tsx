import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Dumbbell, Building2, Home, ArrowLeft, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { HeinzSpeechBubble } from '../UI/HeinzSpeechBubble';
import { HazardButton } from '../UI/HazardButton';
import dialogues from '../../data/dialogues.json';

export const QuestionWizard: React.FC = () => {
  const {
    daysPerWeek,
    setDaysPerWeek,
    experience,
    setExperience,
    equipment,
    setEquipment,
    heinzSpeech,
    heinzMood,
    setStep
  } = useDoofStore();

  const wizardData = dialogues.wizard;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-doof-border pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-doof-green-acid uppercase font-bold tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Fase 2: Calibración de Logística y Esfuerzo
        </div>
        <h2 className="font-comic text-3xl md:text-4xl text-white tracking-wide mt-1">
          Parámetros de Despliegue de Maquinaria
        </h2>
        <p className="text-sm text-slate-300">
          Ajusta la frecuencia, el nivel de carga y el entorno para que el Inador optimice las curvas de fuerza.
        </p>
      </div>

      {/* Heinz Speech */}
      <HeinzSpeechBubble speech={heinzSpeech} mood={heinzMood} />

      {/* Question A: Days Per Week */}
      <div className="bg-doof-card/90 rounded-2xl p-6 border-2 border-doof-border shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-purple-300">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-purple-400 font-bold">Pregunta A • Frecuencia</span>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {wizardData.daysQuestion.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {wizardData.daysQuestion.options.map(opt => {
            const isSelected = daysPerWeek === opt.days;
            return (
              <motion.button
                key={opt.days}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDaysPerWeek(opt.days)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-900/90 to-doof-darkest border-doof-green-acid shadow-lg shadow-purple-950/60 text-white'
                    : 'bg-doof-panel/70 border-doof-border text-slate-300 hover:border-slate-500 hover:bg-doof-panel'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-doof-green-neon animate-ping" />
                )}
                <span className="font-comic text-2xl md:text-3xl text-doof-green-acid">{opt.days}</span>
                <span className="text-xs font-bold uppercase tracking-wider font-tech mt-1">Días / Sem</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Question B: Experience Level */}
      <div className="bg-doof-card/90 rounded-2xl p-6 border-2 border-doof-border shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-cyan-300">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Pregunta B • Experiencia & Volumen</span>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {wizardData.experienceQuestion.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {wizardData.experienceQuestion.options.map(opt => {
            const isSelected = experience === opt.level;
            return (
              <motion.button
                key={opt.level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExperience(opt.level as any)}
                className={`flex flex-col justify-between p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-950/80 to-doof-darkest border-doof-green-acid shadow-lg shadow-cyan-950/60 text-white'
                    : 'bg-doof-panel/70 border-doof-border text-slate-300 hover:border-slate-500 hover:bg-doof-panel'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-comic text-lg text-cyan-300 uppercase tracking-wide">
                      {opt.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-doof-green-neon flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Question C: Equipment Environment */}
      <div className="bg-doof-card/90 rounded-2xl p-6 border-2 border-doof-border shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-emerald-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Pregunta C • Entorno de Maquinaria</span>
            <h3 className="text-base md:text-lg font-bold text-white leading-snug">
              {wizardData.equipmentQuestion.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {wizardData.equipmentQuestion.options.map(opt => {
            const isSelected = equipment === opt.type;
            const isCommercial = opt.type === 'commercial';
            return (
              <motion.button
                key={opt.type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEquipment(opt.type as any)}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-950/80 to-doof-darkest border-doof-green-acid shadow-lg shadow-emerald-950/60 text-white'
                    : 'bg-doof-panel/70 border-doof-border text-slate-300 hover:border-slate-500 hover:bg-doof-panel'
                }`}
              >
                <div className={`p-3 rounded-xl ${isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {isCommercial ? <Building2 className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-comic text-lg text-emerald-300 uppercase tracking-wide">
                      {opt.label}
                    </h4>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-doof-green-neon flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-doof-border">
        <HazardButton
          variant="outline"
          size="md"
          onClick={() => setStep(1)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver al Mapa Corporal
        </HazardButton>

        <HazardButton
          variant="green"
          size="xl"
          onClick={() => setStep(3)}
          icon={<Zap className="w-6 h-6 text-slate-950 animate-bounce" />}
          className="shadow-xl"
        >
          ¡Iniciar Compil-inador de Rutina!
        </HazardButton>
      </div>
    </div>
  );
};
