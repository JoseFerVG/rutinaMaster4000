import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  Dumbbell
} from 'lucide-react';
import { useDoofStore } from '../../store/useDoofStore';
import { DoofenshmirtzAvatar } from './DoofenshmirtzAvatar';
import { DialogueBubble } from './DialogueBubble';
import { UserChoiceBubbles, DialogueChoiceOption } from './UserChoiceBubbles';
import { BodySelector } from '../BodySelector/BodySelector';

export const ConversationalStage: React.FC = () => {
  const {
    step,
    setStep,
    selectedMuscles,
    daysPerWeek,
    setDaysPerWeek,
    experience,
    setExperience,
    equipment,
    setEquipment,
    heinzSpeech,
    setHeinzSpeech,
    heinzMood,
    selectPreset
  } = useDoofStore();

  const [stageMode, setStageMode] = useState<'dialogue' | 'hologram'>('dialogue');

  // Step 0: Welcome Conversation Options
  const getWelcomeChoices = (): DialogueChoiceOption[] => [
    {
      id: 'start',
      speechText: '«¡Cuenta conmigo, Heinz! Vamos a construir mi Inador de Entrenamiento.»',
      tag: 'Aceptar Misión',
      variant: 'green',
      icon: <Zap className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('¡Excelente! Primero debemos seleccionar qué zonas musculares vamos a transformar en armas de destrucción masiva.', 'excited');
        setStep(1);
      }
    },
    {
      id: 'why_roger',
      speechText: '«¿Por qué odias tanto a tu hermano Roger?»',
      tag: 'Lore de Gimmelshtump',
      variant: 'amber',
      icon: <HelpCircle className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('¡¿Que por qué?! ¡Roger siempre fue el hijo favorito de mamá! Mientras yo era obligado a estar quieto como un gnomo de jardín en Gimmelshtump bajo la lluvia, ¡a él le daban trofeos de golf y pasteles! ¡Y ahora es el alcalde! ¡Es insoportable!', 'complaining');
      }
    },
    {
      id: 'is_safe',
      speechText: '«¿Esto es seguro o va a explotar como tus otros inventos?»',
      tag: 'Control de Calidad',
      variant: 'cyan',
      icon: <Shield className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('¡Por supuesto que es seguro! He calibrado las curvas de fuerza biomecánicas con precisión matemática... Bueno, a menos que presiones el botón grande y rojo de autodestrucción. ¡Pero nadie sería tan tonto de tocarlo, verdad?', 'normal');
      }
    },
    {
      id: 'home_gym',
      speechText: '«Solo tengo un par de mancuernas y rencor en mi sótano, ¿me sirve?»',
      tag: 'Entorno Casero',
      variant: 'purple',
      icon: <Dumbbell className="w-4 h-4" />,
      onClick: () => {
        setEquipment('home');
        setHeinzSpeech('¡Ja! ¡El rencor es el mejor combustible anabólico! Mi algoritmo reconfigurará todos los ejercicios para peso libre y mancuernas. ¡Vamos al selector muscular!', 'excited');
        setStep(1);
      }
    }
  ];

  // Step 1: Muscle Selection Conversation Options
  const getMuscleChoices = (): DialogueChoiceOption[] => [
    {
      id: 'preset_full',
      speechText: '«¡Cuerpo Completo Malvado! Quiero estimular todo el arsenal anatómico.»',
      tag: 'Preset Full Body',
      variant: 'green',
      isSelected: selectedMuscles.length >= 8,
      onClick: () => selectPreset('full_body')
    },
    {
      id: 'preset_upper',
      speechText: '«¡Torso Destructor de Alcaldes! Enfoque en pecho, espalda gigante y brazos.»',
      tag: 'Preset Torso & Brazos',
      variant: 'purple',
      isSelected: selectedMuscles.includes('chest') && selectedMuscles.includes('back_upper') && selectedMuscles.includes('biceps') && !selectedMuscles.includes('quads'),
      onClick: () => selectPreset('upper_torso')
    },
    {
      id: 'preset_legs',
      speechText: '«¡Piernas de Titán de Gimmelshtump! Cuádriceps, glúteos e isquios de acero.»',
      tag: 'Preset Piernas',
      variant: 'amber',
      isSelected: selectedMuscles.includes('quads') && selectedMuscles.includes('glutes') && !selectedMuscles.includes('chest'),
      onClick: () => selectPreset('titan_legs')
    },
    {
      id: 'toggle_hologram',
      speechText: stageMode === 'hologram' ? '«Ocultar Holograma y ver opciones rápidas»' : '«Abrir el Holograma Corporal 3D para seleccionar músculos uno a uno»',
      tag: 'Proyector Anatómico',
      variant: 'cyan',
      icon: <Sparkles className="w-4 h-4" />,
      onClick: () => {
        setStageMode(stageMode === 'hologram' ? 'dialogue' : 'hologram');
        setHeinzSpeech('¡Activando el proyector holográfico! Haz clic directamente en las zonas que quieras iluminar.', 'normal');
      }
    },
    {
      id: 'confirm_muscles',
      speechText: `«¡Listo con las zonas musculares (${selectedMuscles.length} elegidas)! Pasemos a calibrar los días.»`,
      tag: 'Siguiente Paso',
      variant: 'green',
      icon: <ArrowRight className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('¡Magnífico! Ahora dime cuántos días por semana puedes escapar de tus responsabilidades cívicas antes de que sospechen...', 'evil');
        setStep(2);
      }
    }
  ];

  // Step 2: Logistics & Effort Dialogue Options
  const getLogisticsChoices = (): DialogueChoiceOption[] => [
    {
      id: 'days_2',
      speechText: '«Solo puedo 2 días a la semana (Villano Ocupado / Full Body A-B).»',
      tag: '2 Días / Sem',
      variant: 'purple',
      isSelected: daysPerWeek === 2,
      onClick: () => setDaysPerWeek(2)
    },
    {
      id: 'days_3',
      speechText: '«3 días a la semana (Clásica división Empuje / Tracción / Pierna).»',
      tag: '3 Días / Sem',
      variant: 'cyan',
      isSelected: daysPerWeek === 3,
      onClick: () => setDaysPerWeek(3)
    },
    {
      id: 'days_4',
      speechText: '«4 días a la semana (División Torso / Pierna de máxima potencia).»',
      tag: '4 Días / Sem',
      variant: 'green',
      isSelected: daysPerWeek === 4,
      onClick: () => setDaysPerWeek(4)
    },
    {
      id: 'days_5_6',
      speechText: daysPerWeek === 6 ? '«6 días a la semana (No tengo vida social desde 1982).»' : '«5 días a la semana (Frecuencia intensa y bombeo casi diario).»',
      tag: `${daysPerWeek >= 5 ? daysPerWeek : 5} Días / Sem`,
      variant: 'amber',
      isSelected: daysPerWeek >= 5,
      onClick: () => setDaysPerWeek(daysPerWeek === 5 ? 6 : 5)
    },
    {
      id: 'exp_toggle',
      speechText: `«Mi experiencia levantando peso: ${experience.toUpperCase()} (Haz clic para alternar: Novato ➔ Intermedio ➔ Avanzado).»`,
      tag: `Nivel: ${experience}`,
      variant: 'cyan',
      icon: <Dumbbell className="w-4 h-4" />,
      onClick: () => {
        const nextExp = experience === 'novato' ? 'intermedio' : experience === 'intermedio' ? 'avanzado' : 'novato';
        setExperience(nextExp);
      }
    },
    {
      id: 'eq_toggle',
      speechText: `«Entrenaré en: ${equipment === 'commercial' ? 'El Megalaboratorio Comercial (todas las máquinas)' : 'Mi Sótano Casero (mancuernas y rencor)'}.»`,
      tag: equipment === 'commercial' ? 'Gimnasio Comercial' : 'Gimnasio Casero',
      variant: 'purple',
      icon: <Shield className="w-4 h-4" />,
      onClick: () => {
        setEquipment(equipment === 'commercial' ? 'home' : 'commercial');
      }
    },
    {
      id: 'compile_ready',
      speechText: '«¡Todo calibrado a la perfección! ¡Enciende el Compil-inador de Rutina, Heinz!»',
      tag: '¡Compilar Inador!',
      variant: 'green',
      icon: <Zap className="w-4 h-4" />,
      onClick: () => {
        setStep(3);
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-6">
      {/* Visual Stage Container (Laboratory Setting) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-doof-darkest via-doof-panel to-slate-950 border-4 border-purple-500/60 p-6 md:p-8 shadow-2xl shadow-purple-950/50 overflow-hidden">
        {/* Lab Background Grid & Ambience */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Character & Speech Bubble Interaction Row */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dr. Heinz Doofenshmirtz Animated Avatar */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-doof-card/50 border border-purple-500/30 backdrop-blur-sm shadow-xl">
            <DoofenshmirtzAvatar mood={heinzMood} isTalking={true} size="lg" />
            <div className="mt-3 text-center">
              <span className="font-comic text-xl text-white tracking-wide block">
                Dr. Heinz Doofenshmirtz
              </span>
              <span className="text-[11px] font-mono text-purple-300">
                Director General • Doofenshmirtz Evil Inc.
              </span>
            </div>
          </div>

          {/* Heinz's Main Comic Dialogue Balloon */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <DialogueBubble
              text={heinzSpeech}
              mood={heinzMood}
              title={`Dr. Doofenshmirtz • Fase ${step}`}
            />

            {/* In-Dialogue Hologram (if Step 1 and Hologram Open) */}
            {step === 1 && stageMode === 'hologram' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <BodySelector />
              </motion.div>
            )}

            {/* Interactive User Speech Balloons (Menu de Bocadillos) */}
            <div className="pt-2">
              {step === 0 && (
                <UserChoiceBubbles
                  promptText="Selecciona tu respuesta para Heinz (Bocadillos de Diálogo):"
                  options={getWelcomeChoices()}
                />
              )}

              {step === 1 && (
                <UserChoiceBubbles
                  promptText="Tus respuestas sobre el objetivo muscular:"
                  options={getMuscleChoices()}
                />
              )}

              {step === 2 && (
                <UserChoiceBubbles
                  promptText="Calibra tus parámetros respondiéndole a Heinz:"
                  options={getLogisticsChoices()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back / Navigation Controls */}
      {step > 0 && (
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => {
              if (step === 1) setStep(0);
              else if (step === 2) setStep(1);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold font-mono flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al diálogo anterior
          </button>
        </div>
      )}
    </div>
  );
};
