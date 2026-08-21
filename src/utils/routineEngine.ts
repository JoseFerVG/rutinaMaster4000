import {
  Exercise,
  ExperienceLevel,
  EquipmentPreference,
  MuscleGroupId,
  Routine,
  RoutineDay,
  RoutineExercise,
  TrainingGoal,
  SessionDuration
} from '../types';

export const MUSCLE_LABELS_ES: Record<MuscleGroupId, string> = {
  chest: 'Pectoral',
  back_upper: 'Espalda Alta',
  back_lower: 'Espalda Baja',
  shoulders: 'Hombros / Deltoides',
  quads: 'Cuádriceps',
  glutes: 'Glúteos',
  hamstrings: 'Isquiotibiales',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  core: 'Core / Abdomen',
  calves: 'Gemelos / Pantorrillas'
};

export function generateRoutineName(
  daysCount: number,
  goal: TrainingGoal,
  selectedMuscles: MuscleGroupId[],
  sessionDuration: SessionDuration = 60
): { name: string; subtitle: string; summaryNote: string } {
  let splitName = '';
  if (daysCount === 2) {
    splitName = 'Full Body A/B';
  } else if (daysCount === 3) {
    splitName = 'Push / Pull / Legs';
  } else if (daysCount === 4) {
    splitName = 'Torso / Pierna';
  } else if (daysCount === 5) {
    splitName = 'PPL / Torso / Pierna';
  } else {
    splitName = 'Push / Pull / Legs x 2';
  }

  const goalLabels: Record<TrainingGoal, string> = {
    hipertrofia: 'Hipertrofia & Tensión Mecánica',
    fuerza: 'Fuerza & Sobrecarga Progresiva',
    recomposicion: 'Recomposición Corporal',
    longevidad: 'Salud Articular & Rendimiento'
  };

  const durationLabels: Record<SessionDuration, string> = {
    45: 'Sesiones Express de 45 min',
    60: 'Sesiones Estándar de 60 min',
    90: 'Sesiones Completas de 90 min'
  };

  const name = `Protocolo ${splitName} · ${daysCount} Días`;
  const subtitle = `Arquitectura de entrenamiento optimizada para ${goalLabels[goal] || 'Hipertrofia'} (${durationLabels[sessionDuration]}).`;
  
  let summaryNote = `Estructura de ${daysCount} sesiones semanales (~${sessionDuration} min/sesión) con distribución calculada de volumen, descansos programados y selección biomecánica de ejercicios.`;
  if (selectedMuscles.length > 0 && selectedMuscles.length < 8) {
    const focusNames = selectedMuscles.map(m => MUSCLE_LABELS_ES[m] || m).slice(0, 3).join(', ');
    summaryNote += ` Enfoque prioritario en: ${focusNames}.`;
  }

  return { name, subtitle, summaryNote };
}

function getSetsRepsRest(
  tier: 1 | 2 | 3,
  experience: ExperienceLevel,
  goal: TrainingGoal,
  sessionDuration: SessionDuration = 60
): { sets: number; reps: string; rest: string; targetRir: string } {
  if (goal === 'fuerza') {
    if (tier === 1) {
      return {
        sets: experience === 'novato' ? 3 : sessionDuration === 45 ? 3 : 4,
        reps: '4 - 6 reps',
        rest: sessionDuration === 45 ? '2.5 min' : '3 - 4 min',
        targetRir: 'RIR 1-2'
      };
    } else if (tier === 2) {
      return {
        sets: 3,
        reps: '6 - 8 reps',
        rest: sessionDuration === 45 ? '90 seg' : '2 - 2.5 min',
        targetRir: 'RIR 2'
      };
    } else {
      return {
        sets: sessionDuration === 45 ? 2 : 3,
        reps: '8 - 10 reps',
        rest: '90 seg',
        targetRir: 'RIR 1-2'
      };
    }
  }

  if (goal === 'longevidad') {
    if (tier === 1) {
      return {
        sets: 3,
        reps: '8 - 10 reps',
        rest: '2 min',
        targetRir: 'RIR 2-3'
      };
    } else if (tier === 2) {
      return {
        sets: 3,
        reps: '10 - 12 reps',
        rest: '90 seg',
        targetRir: 'RIR 2'
      };
    } else {
      return {
        sets: 2,
        reps: '12 - 15 reps',
        rest: '60 seg',
        targetRir: 'RIR 2'
      };
    }
  }

  // Hipertrofia & Recomposición
  if (experience === 'novato') {
    if (tier === 1) return { sets: 3, reps: '6 - 8 reps', rest: '2 min', targetRir: 'RIR 2' };
    if (tier === 2) return { sets: 3, reps: '8 - 10 reps', rest: '90 seg', targetRir: 'RIR 1-2' };
    return { sets: 2, reps: '10 - 12 reps', rest: '60 - 75 seg', targetRir: 'RIR 1' };
  } else if (experience === 'intermedio') {
    if (tier === 1) return { sets: sessionDuration === 45 ? 3 : 4, reps: '6 - 8 reps', rest: '2.5 min', targetRir: 'RIR 1-2' };
    if (tier === 2) return { sets: 3, reps: '8 - 10 reps', rest: '90 - 120 seg', targetRir: 'RIR 1' };
    return { sets: sessionDuration === 45 ? 2 : 3, reps: '10 - 12 reps', rest: '75 seg', targetRir: 'RIR 0-1' };
  } else {
    // Avanzado
    if (tier === 1) return { sets: 4, reps: '5 - 7 reps', rest: '3 min', targetRir: 'RIR 1' };
    if (tier === 2) return { sets: sessionDuration === 45 ? 3 : 4, reps: '8 - 10 reps', rest: '2 min', targetRir: 'RIR 0-1' };
    return { sets: sessionDuration === 45 ? 2 : 3, reps: '10 - 15 reps', rest: '60 - 75 seg', targetRir: 'Fallo técnico / RIR 0' };
  }
}

function isExerciseAllowed(exercise: Exercise, equipment: EquipmentPreference): boolean {
  if (equipment === 'commercial') return true;
  return exercise.equipment === 'home' || exercise.equipment === 'both' || exercise.equipment === 'bodyweight';
}

export function buildRoutine(
  selectedMuscles: MuscleGroupId[],
  daysCount: number,
  experience: ExperienceLevel,
  equipment: EquipmentPreference,
  goal: TrainingGoal = 'hipertrofia',
  sessionDuration: SessionDuration = 60,
  exercisesDb: Exercise[]
): Routine {
  const focusMuscles = selectedMuscles.length > 0
    ? selectedMuscles
    : (['chest', 'back_upper', 'shoulders', 'quads', 'hamstrings', 'glutes', 'biceps', 'triceps', 'core'] as MuscleGroupId[]);

  const maxExercisesPerDay = sessionDuration === 45 ? 4 : sessionDuration === 90 ? 7 : 6;

  const availableExercises = exercisesDb.filter(ex => isExerciseAllowed(ex, equipment));
  const { name, subtitle, summaryNote } = generateRoutineName(daysCount, goal, selectedMuscles, sessionDuration);

  const days: RoutineDay[] = [];

  const pickExercisesForMuscles = (
    targetMuscles: MuscleGroupId[],
    maxExercises: number = maxExercisesPerDay
  ): RoutineExercise[] => {
    const picked: RoutineExercise[] = [];
    const usedIds = new Set<string>();

    const sortedTargets = [...targetMuscles].sort((a, b) => {
      const aFocus = focusMuscles.includes(a) ? 1 : 0;
      const bFocus = focusMuscles.includes(b) ? 1 : 0;
      return bFocus - aFocus;
    });

    // 1. Tier 1 Main Compounds
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const tier1 = availableExercises.find(
        ex => ex.muscleGroup === muscle && ex.tier === 1 && !usedIds.has(ex.id)
      );
      if (tier1) {
        usedIds.add(tier1.id);
        const { sets, reps, rest, targetRir } = getSetsRepsRest(tier1.tier, experience, goal, sessionDuration);
        picked.push({
          instanceId: `inst_${tier1.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: tier1.id,
          originalExerciseId: tier1.id,
          sets,
          reps,
          rest,
          targetRir,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    // 2. Tier 2 Secondary Compounds
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const tier2 = availableExercises.find(
        ex => ex.muscleGroup === muscle && ex.tier === 2 && !usedIds.has(ex.id)
      );
      if (tier2) {
        usedIds.add(tier2.id);
        const { sets, reps, rest, targetRir } = getSetsRepsRest(tier2.tier, experience, goal, sessionDuration);
        picked.push({
          instanceId: `inst_${tier2.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: tier2.id,
          originalExerciseId: tier2.id,
          sets,
          reps,
          rest,
          targetRir,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    // 3. Tier 3 Isolation & Accessories (if session duration allows)
    if (sessionDuration >= 60) {
      for (const muscle of sortedTargets) {
        if (picked.length >= maxExercises) break;
        const tier3 = availableExercises.find(
          ex => ex.muscleGroup === muscle && ex.tier === 3 && !usedIds.has(ex.id)
        );
        if (tier3) {
          usedIds.add(tier3.id);
          const { sets, reps, rest, targetRir } = getSetsRepsRest(tier3.tier, experience, goal, sessionDuration);
          picked.push({
            instanceId: `inst_${tier3.id}_${Math.random().toString(36).substring(2, 7)}`,
            exerciseId: tier3.id,
            originalExerciseId: tier3.id,
            sets,
            reps,
            rest,
            targetRir,
            isTemporarilyReplaced: false,
            completedSets: new Array(sets).fill(false)
          });
        }
      }
    }

    // 4. Fill remaining slots if any
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const filler = availableExercises.find(
        ex => (ex.muscleGroup === muscle || ex.secondaryMuscles.includes(muscle)) && !usedIds.has(ex.id)
      );
      if (filler) {
        usedIds.add(filler.id);
        const { sets, reps, rest, targetRir } = getSetsRepsRest(filler.tier, experience, goal, sessionDuration);
        picked.push({
          instanceId: `inst_${filler.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: filler.id,
          originalExerciseId: filler.id,
          sets,
          reps,
          rest,
          targetRir,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    return picked;
  };

  // Day distribution templates
  if (daysCount === 2) {
    days.push({
      dayNumber: 1,
      title: 'Día 1 · Full Body A',
      subtitle: 'Enfoque Pectoral, Cuádriceps, Deltoides y Core',
      focusMuscles: ['chest', 'quads', 'shoulders', 'triceps', 'core'],
      exercises: pickExercisesForMuscles(['chest', 'quads', 'shoulders', 'triceps', 'core']),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2 · Full Body B',
      subtitle: 'Enfoque Dorsales, Isquiotibiales, Glúteos y Bíceps',
      focusMuscles: ['back_upper', 'hamstrings', 'glutes', 'biceps', 'back_lower'],
      exercises: pickExercisesForMuscles(['back_upper', 'hamstrings', 'glutes', 'biceps', 'back_lower']),
      isRestDay: false
    });
  } else if (daysCount === 3) {
    days.push({
      dayNumber: 1,
      title: 'Día 1 · Empuje (Push)',
      subtitle: 'Pectoral, Deltoides anterior/lateral y Tríceps',
      focusMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'shoulders', 'triceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2 · Tracción (Pull)',
      subtitle: 'Dorsal ancho, Espalda alta, Deltoides posterior y Bíceps',
      focusMuscles: ['back_upper', 'back_lower', 'biceps', 'shoulders'],
      exercises: pickExercisesForMuscles(['back_upper', 'back_lower', 'biceps', 'shoulders']),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3 · Pierna & Core (Legs)',
      subtitle: 'Cuádriceps, Isquiotibiales, Glúteos y Estabilidad abdominal',
      focusMuscles: ['quads', 'hamstrings', 'glutes', 'core', 'calves'],
      exercises: pickExercisesForMuscles(['quads', 'hamstrings', 'glutes', 'core', 'calves']),
      isRestDay: false
    });
  } else if (daysCount === 4) {
    days.push({
      dayNumber: 1,
      title: 'Día 1 · Torso Superior A',
      subtitle: 'Fuerza e hipertrofia en press horizontal, tracción vertical y hombros',
      focusMuscles: ['chest', 'back_upper', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'shoulders', 'triceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2 · Tren Inferior A',
      subtitle: 'Dominante de cuádriceps, cadena posterior y estabilidad de core',
      focusMuscles: ['quads', 'hamstrings', 'glutes', 'core'],
      exercises: pickExercisesForMuscles(['quads', 'hamstrings', 'glutes', 'core']),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3 · Torso Superior B',
      subtitle: 'Volumen e hipertrofia en planos inclinados, remos y brazos',
      focusMuscles: ['chest', 'back_upper', 'biceps', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'biceps', 'shoulders', 'triceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 4,
      title: 'Día 4 · Tren Inferior B',
      subtitle: 'Dominante de cadera, flexión de rodilla, glúteos y pantorrillas',
      focusMuscles: ['glutes', 'hamstrings', 'quads', 'calves', 'core'],
      exercises: pickExercisesForMuscles(['glutes', 'hamstrings', 'quads', 'calves', 'core']),
      isRestDay: false
    });
  } else if (daysCount === 5) {
    days.push({
      dayNumber: 1,
      title: 'Día 1 · Empuje Pesado (Push A)',
      subtitle: 'Pectoral pesado, press militar y tríceps',
      focusMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'shoulders', 'triceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2 · Tracción Pesada (Pull A)',
      subtitle: 'Tracciones verticales pesadas, remos y bíceps',
      focusMuscles: ['back_upper', 'back_lower', 'biceps'],
      exercises: pickExercisesForMuscles(['back_upper', 'back_lower', 'biceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3 · Pierna Enfoque Cuádriceps (Legs A)',
      subtitle: 'Sentadilla, prensa y trabajo de pantorrillas',
      focusMuscles: ['quads', 'glutes', 'calves', 'core'],
      exercises: pickExercisesForMuscles(['quads', 'glutes', 'calves', 'core']),
      isRestDay: false
    });
    days.push({
      dayNumber: 4,
      title: 'Día 4 · Torso Hipertrofia (Upper B)',
      subtitle: 'Aislamientos de pectoral, espalda alta y deltoides lateral',
      focusMuscles: ['chest', 'back_upper', 'shoulders', 'biceps', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'shoulders', 'biceps', 'triceps']),
      isRestDay: false
    });
    days.push({
      dayNumber: 5,
      title: 'Día 5 · Cadena Posterior & Brazos (Lower B + Arms)',
      subtitle: 'Isquiotibiales, glúteos y trabajo directo de brazos',
      focusMuscles: ['hamstrings', 'glutes', 'biceps', 'triceps', 'core'],
      exercises: pickExercisesForMuscles(['hamstrings', 'glutes', 'biceps', 'triceps', 'core']),
      isRestDay: false
    });
  } else {
    // 6 Days PPL x 2
    const splits = [
      { num: 1, title: 'Día 1 · Empuje A (Fuerza)', sub: 'Press banca pesado, hombro y tríceps', muscles: ['chest', 'shoulders', 'triceps'] as MuscleGroupId[] },
      { num: 2, title: 'Día 2 · Tracción A (Densidad)', sub: 'Remos pesados, dominadas y bíceps', muscles: ['back_upper', 'back_lower', 'biceps'] as MuscleGroupId[] },
      { num: 3, title: 'Día 3 · Pierna A (Cuádriceps)', sub: 'Sentadilla trasera, prensa y gemelos', muscles: ['quads', 'glutes', 'calves'] as MuscleGroupId[] },
      { num: 4, title: 'Día 4 · Empuje B (Hipertrofia)', sub: 'Press inclinado, cruces y elevaciones laterales', muscles: ['chest', 'shoulders', 'triceps'] as MuscleGroupId[] },
      { num: 5, title: 'Día 5 · Tracción B (Amplitud)', sub: 'Jalones, remos apoyados y brazos', muscles: ['back_upper', 'biceps', 'shoulders'] as MuscleGroupId[] },
      { num: 6, title: 'Día 6 · Pierna B (Isquios & Glúteos)', sub: 'Peso muerto rumano, curls femorales y core', muscles: ['hamstrings', 'glutes', 'core'] as MuscleGroupId[] }
    ];

    splits.forEach(s => {
      days.push({
        dayNumber: s.num,
        title: s.title,
        subtitle: s.sub,
        focusMuscles: s.muscles,
        exercises: pickExercisesForMuscles(s.muscles),
        isRestDay: false
      });
    });
  }

  return {
    id: `routine_${Date.now()}`,
    name,
    subtitle,
    createdAt: new Date().toISOString(),
    goal,
    experience,
    daysPerWeek: daysCount,
    sessionDuration,
    equipment,
    selectedMuscles,
    days,
    summaryNote
  };
}

export function findQuickSubstitution(
  currentExId: string,
  equipment: EquipmentPreference,
  allExercises: Exercise[],
  currentDayExerciseIds: string[]
): { replacement: Exercise | null; feedback: string } {
  const current = allExercises.find(e => e.id === currentExId);
  if (!current) return { replacement: null, feedback: 'Ejercicio no encontrado en la base de datos.' };

  const candidateIds = [...current.directEquivalents, ...current.freeWeightEquivalents];
  const validCandidates = allExercises.filter(ex =>
    candidateIds.includes(ex.id) &&
    ex.id !== currentExId &&
    isExerciseAllowed(ex, equipment) &&
    !currentDayExerciseIds.includes(ex.id)
  );

  if (validCandidates.length === 0) {
    const patternFallback = allExercises.find(ex =>
      ex.movementPattern === current.movementPattern &&
      ex.id !== currentExId &&
      isExerciseAllowed(ex, equipment) &&
      !currentDayExerciseIds.includes(ex.id)
    );
    if (patternFallback) {
      return {
        replacement: patternFallback,
        feedback: `Sustituido por ${patternFallback.name} (mismo patrón biomecánico).`
      };
    }
    return {
      replacement: null,
      feedback: 'No hay más alternativas viables disponibles en este entorno.'
    };
  }

  const picked = validCandidates[Math.floor(Math.random() * validCandidates.length)];
  return {
    replacement: picked,
    feedback: `Sustituido temporalmente por ${picked.name} para esta sesión.`
  };
}

export function findPermanentSubstitution(
  currentExId: string,
  equipment: EquipmentPreference,
  allExercises: Exercise[],
  currentDayExerciseIds: string[]
): { replacement: Exercise | null; feedback: string } {
  const current = allExercises.find(e => e.id === currentExId);
  if (!current) return { replacement: null, feedback: 'Ejercicio no encontrado.' };

  const candidateIds = equipment === 'home'
    ? [...current.freeWeightEquivalents, ...current.directEquivalents]
    : [...current.directEquivalents, ...current.freeWeightEquivalents];

  const validCandidates = allExercises.filter(ex =>
    candidateIds.includes(ex.id) &&
    ex.id !== currentExId &&
    isExerciseAllowed(ex, equipment) &&
    !currentDayExerciseIds.includes(ex.id)
  );

  if (validCandidates.length === 0) {
    const fallback = allExercises.find(ex =>
      ex.muscleGroup === current.muscleGroup &&
      ex.id !== currentExId &&
      isExerciseAllowed(ex, equipment) &&
      !currentDayExerciseIds.includes(ex.id)
    );
    if (fallback) {
      return {
        replacement: fallback,
        feedback: `Protocolo actualizado permanentemente con ${fallback.name}.`
      };
    }
    return {
      replacement: null,
      feedback: 'No se encontró un reemplazo disponible para tu equipamiento.'
    };
  }

  const picked = validCandidates[0];
  return {
    replacement: picked,
    feedback: `Protocolo actualizado: ${current.name} sustituido por ${picked.name}.`
  };
}

export function findFreeWeightAlternative(
  currentExId: string,
  allExercises: Exercise[],
  currentDayExerciseIds: string[]
): { replacement: Exercise | null; feedback: string } {
  const current = allExercises.find(e => e.id === currentExId);
  if (!current) return { replacement: null, feedback: 'Ejercicio no encontrado.' };

  // Look in freeWeightEquivalents first
  const freeWeightCandidates = allExercises.filter(ex =>
    current.freeWeightEquivalents.includes(ex.id) &&
    ex.id !== currentExId &&
    (ex.equipment === 'home' || ex.equipment === 'both' || ex.equipment === 'bodyweight') &&
    !currentDayExerciseIds.includes(ex.id)
  );

  if (freeWeightCandidates.length > 0) {
    const picked = freeWeightCandidates[0];
    return {
      replacement: picked,
      feedback: `Sustituido por básico de peso libre: ${picked.name}.`
    };
  }

  // Fallback to any free weight exercise with same movement pattern
  const patternFallback = allExercises.find(ex =>
    ex.movementPattern === current.movementPattern &&
    ex.id !== currentExId &&
    (ex.equipment === 'home' || ex.equipment === 'both' || ex.equipment === 'bodyweight') &&
    !currentDayExerciseIds.includes(ex.id)
  );

  if (patternFallback) {
    return {
      replacement: patternFallback,
      feedback: `Sustituido por variante libre: ${patternFallback.name}.`
    };
  }

  return {
    replacement: null,
    feedback: 'No se encontró una variante básica de peso libre adicional.'
  };
}
