import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  Dumbbell,
  User,
  Sliders
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
    gender,
    setGender,
    selectedMuscles,
    daysPerWeek,
    setDaysPerWeek,
    experience,
    setExperience,
    equipment,
    setEquipment,
    heinzSpeech,
    setHeinzSpeech,
    selectPreset
  } = useDoofStore();

  const [stageMode, setStageMode] = useState<'dialogue' | 'hologram'>('dialogue');
  const [genderSelectedInStep1, setGenderSelectedInStep1] = useState<boolean>(true);

  // Step 0: Welcome Conversation Options
  const getWelcomeChoices = (): DialogueChoiceOption[] => [
    {
      id: 'start',
      speechText: '«Comencemos. Deseo estructurar una rutina de hipertrofia y fuerza biomecánica.»',
      tag: 'Diseñar Rutina',
      variant: 'green',
      icon: <Sparkles className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('Excelente decisión. En primer lugar, definamos tu morfología para calibrar las proporciones y ángulos anatómicos con máxima precisión.', 'normal');
        setGenderSelectedInStep1(false);
        setStep(1);
      }
    },
    {
      id: 'science_first',
      speechText: '«¿En qué principios biomecánicos se basa este generador?»',
      tag: 'Biomecánica & Evidencia',
      variant: 'cyan',
      icon: <Shield className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('El algoritmo prioriza ejercicios según curvas de resistencia, alineación con la orientación de las fibras musculares, volumen efectivo (series cerca del fallo técnico) y tiempo de recuperación óptimo.', 'normal');
      }
    },
    {
      id: 'home_gym',
      speechText: '«Entreno en casa con mancuernas y peso libre. ¿Se puede adaptar?»',
      tag: 'Entrenamiento Casero',
      variant: 'purple',
      icon: <Dumbbell className="w-4 h-4" />,
      onClick: () => {
        setEquipment('home');
        setHeinzSpeech('Por supuesto. El sistema reconfigura automáticamente todas las variantes mecánicas para ejecutarse con mancuernas, barras y banco plano.', 'normal');
        setGenderSelectedInStep1(false);
        setStep(1);
      }
    }
  ];

  // Gender Selection Choices (when first entering Step 1)
  const getGenderChoices = (): DialogueChoiceOption[] => [
    {
      id: 'gender_male',
      speechText: '«Morfología Masculina (Mayor proporción en torso superior y deltoides)»',
      tag: 'Hombre',
      variant: 'purple',
      isSelected: gender === 'male',
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        setGender('male');
        setGenderSelectedInStep1(true);
      }
    },
    {
      id: 'gender_female',
      speechText: '«Morfología Femenina (Mayor capacidad de volumen en tren inferior y glúteos)»',
      tag: 'Mujer',
      variant: 'green',
      isSelected: gender === 'female',
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        setGender('female');
        setGenderSelectedInStep1(true);
      }
    },
    {
      id: 'gender_neutral',
      speechText: '«Morfología Neutra / Balanceada (Distribución simétrica estándar)»',
      tag: 'Neutra',
      variant: 'cyan',
      isSelected: gender === 'neutral',
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        setGender('neutral');
        setGenderSelectedInStep1(true);
      }
    }
  ];

  // Step 1: Muscle Selection Conversation Options
  const getMuscleChoices = (): DialogueChoiceOption[] => [
    {
      id: 'toggle_hologram',
      speechText: stageMode === 'hologram' ? '«Cerrar visualizador anatómico y continuar diálogo»' : '«Abrir visualizador anatómico para seleccionar zonas musculares manualmente»',
      tag: 'Mapa Muscular',
      variant: 'cyan',
      icon: <Sliders className="w-4 h-4" />,
      onClick: () => {
        setStageMode(stageMode === 'hologram' ? 'dialogue' : 'hologram');
        setHeinzSpeech('Visualizador anatómico abierto. Puedes hacer clic en cada músculo para activar su estímulo.', 'normal');
      }
    },
    {
      id: 'preset_full',
      speechText: '«Cuerpo Completo (Full Body equilibrado para todos los grupos)»',
      tag: 'Full Body',
      variant: 'green',
      isSelected: selectedMuscles.length >= 8,
      onClick: () => selectPreset('full_body')
    },
    {
      id: 'preset_upper',
      speechText: '«Torso & Brazos (Énfasis en pectoral, dorsales, deltoides y brazos)»',
      tag: 'Torso & Brazos',
      variant: 'purple',
      isSelected: selectedMuscles.includes('chest') && selectedMuscles.includes('back_upper') && selectedMuscles.includes('biceps') && !selectedMuscles.includes('quads'),
      onClick: () => selectPreset('upper_torso')
    },
    {
      id: 'preset_legs',
      speechText: '«Tren Inferior Completo (Cuádriceps, glúteos, isquiotibiales y gemelos)»',
      tag: 'Piernas',
      variant: 'amber',
      isSelected: selectedMuscles.includes('quads') && selectedMuscles.includes('glutes') && !selectedMuscles.includes('chest'),
      onClick: () => selectPreset('titan_legs')
    },
    {
      id: 'confirm_muscles',
      speechText: `«Confirmar selección (${selectedMuscles.length} grupos activos) y pasar a frecuencia de días.»`,
      tag: 'Siguiente Paso',
      variant: 'green',
      icon: <ArrowRight className="w-4 h-4" />,
      onClick: () => {
        setHeinzSpeech('Perfecto. Ahora definamos la frecuencia semanal y disponibilidad de tiempo.', 'normal');
        setStep(2);
      }
    }
  ];

  // Step 2: Logistics & Effort Dialogue Options
  const getLogisticsChoices = (): DialogueChoiceOption[] => [
    {
      id: 'days_2',
      speechText: '«2 días por semana (Frecuencia A/B de alta eficiencia).»',
      tag: '2 Días / Sem',
      variant: 'purple',
      isSelected: daysPerWeek === 2,
      onClick: () => setDaysPerWeek(2)
    },
    {
      id: 'days_3',
      speechText: '«3 días por semana (Clásica división Empuje / Tracción / Pierna).»',
      tag: '3 Días / Sem',
      variant: 'cyan',
      isSelected: daysPerWeek === 3,
      onClick: () => setDaysPerWeek(3)
    },
    {
      id: 'days_4',
      speechText: '«4 días por semana (División Torso / Pierna de óptima recuperación).»',
      tag: '4 Días / Sem',
      variant: 'green',
      isSelected: daysPerWeek === 4,
      onClick: () => setDaysPerWeek(4)
    },
    {
      id: 'days_5_6',
      speechText: daysPerWeek === 6 ? '«6 días por semana (Frecuencia alta Push/Pull/Legs x2).»' : '«5 días por semana (Frecuencia intermedia con días especializados).»',
      tag: `${daysPerWeek >= 5 ? daysPerWeek : 5} Días / Sem`,
      variant: 'amber',
      isSelected: daysPerWeek >= 5,
      onClick: () => setDaysPerWeek(daysPerWeek === 5 ? 6 : 5)
    },
    {
      id: 'exp_toggle',
      speechText: `«Nivel de experiencia: ${experience.toUpperCase()} (Click para alternar: Novato ➔ Intermedio ➔ Avanzado).»`,
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
      speechText: `«Lugar de entrenamiento: ${equipment === 'commercial' ? 'Gimnasio Comercial Completo (máquinas y poleas)' : 'Gimnasio Casero (mancuernas y peso libre)'}.»`,
      tag: equipment === 'commercial' ? 'Gimnasio Comercial' : 'Gimnasio Casero',
      variant: 'purple',
      icon: <Shield className="w-4 h-4" />,
      onClick: () => {
        setEquipment(equipment === 'commercial' ? 'home' : 'commercial');
      }
    },
    {
      id: 'compile_ready',
      speechText: '«Parámetros listos. Generar mi protocolo de entrenamiento personalizado.»',
      tag: 'Generar Protocolo',
      variant: 'green',
      icon: <Sparkles className="w-4 h-4" />,
      onClick: () => {
        setStep(3);
      }
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Zen Conversational Stage Card */}
      <div className="relative rounded-3xl zen-glass p-6 md:p-10 shadow-zen-lg overflow-hidden border border-white/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* AI Coach Visual Presence */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] shadow-sm">
            <DoofenshmirtzAvatar mood="normal" isTalking={true} size="lg" />
            <div className="mt-4 text-center">
              <span className="font-display font-semibold text-lg text-white block">
                Asesor Biomecánico
              </span>
              <span className="text-xs text-slate-400 font-medium">
                RutinaMaster Engine
              </span>
            </div>
          </div>

          {/* Dialogue & Interactive Options */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
            <DialogueBubble
              text={heinzSpeech}
              title={`Paso ${step + 1} de 4 · ${step === 0 ? 'Bienvenida' : step === 1 ? 'Morfología & Zonas' : 'Calibración'}`}
            />

            {/* In-Dialogue Anatomical Map (if Step 1 and Map Open) */}
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

            {/* Interactive User Choices */}
            <div className="pt-2">
              {step === 0 && (
                <UserChoiceBubbles
                  promptText="Opciones de respuesta:"
                  options={getWelcomeChoices()}
                />
              )}

              {step === 1 && !genderSelectedInStep1 && (
                <UserChoiceBubbles
                  promptText="Selecciona tu morfología biológica:"
                  options={getGenderChoices()}
                />
              )}

              {step === 1 && genderSelectedInStep1 && (
                <UserChoiceBubbles
                  promptText={`Objetivo muscular (Morfología: ${gender === 'male' ? 'Hombre' : gender === 'female' ? 'Mujer' : 'Neutra'}):`}
                  options={getMuscleChoices()}
                />
              )}

              {step === 2 && (
                <UserChoiceBubbles
                  promptText="Calibra tus preferencias de entrenamiento:"
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
              if (step === 1) {
                if (genderSelectedInStep1) {
                  setGenderSelectedInStep1(false);
                } else {
                  setStep(0);
                }
              } else if (step === 2) {
                setStep(1);
              }
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al paso anterior
          </button>
        </div>
      )}
    </div>
  );
};
