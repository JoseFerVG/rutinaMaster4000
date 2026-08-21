import {
  Exercise,
  ExperienceLevel,
  EquipmentPreference,
  MuscleGroupId,
  Routine,
  RoutineDay,
  RoutineExercise
} from '../types';

const MUSCLE_NAMES_ES: Record<MuscleGroupId, string> = {
  chest: 'Pectoral',
  back_upper: 'Espalda-Alta',
  back_lower: 'Espalda-Baja',
  shoulders: 'Hombros',
  quads: 'Cuádriceps',
  glutes: 'Glúteos',
  hamstrings: 'Isquios',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  core: 'Abdomen',
  calves: 'Pantorrillas'
};

export function generateInadorName(selectedMuscles: MuscleGroupId[], days: number): { name: string; subtitle: string } {
  if (selectedMuscles.length === 0 || selectedMuscles.length >= 8) {
    const epicNames = [
      'El Hipertrofia-Total-Anti-Roger-Inador 4000',
      'El Conquistador-del-Área-Limítrofe-Inador 3000',
      'El Destructor-Corporal-Supremo-Inador 5000',
      'El Mega-Músculo-de-Gimmelshtump-Inador 9000'
    ];
    const picked = epicNames[Math.floor(Math.random() * epicNames.length)];
    return {
      name: picked,
      subtitle: `Protocolo Malvado Completo de ${days} Días de Furia Biomecánica`
    };
  }

  const primaryMuscle = MUSCLE_NAMES_ES[selectedMuscles[0]] || 'Músculo';
  const secondaryMuscle = selectedMuscles.length > 1 ? MUSCLE_NAMES_ES[selectedMuscles[1]] : null;

  let baseName = '';
  if (secondaryMuscle) {
    baseName = `El ${primaryMuscle}-y-${secondaryMuscle}-Destructor-Inador`;
  } else {
    baseName = `El Mega-${primaryMuscle}-Expulsa-Alcaldes-Inador`;
  }

  const version = (Math.floor(Math.random() * 5) + 3) * 1000;
  return {
    name: `${baseName} ${version}`,
    subtitle: `Arquitectura de Crecimiento Acelerado para Vencer a Roger en ${days} Días`
  };
}

function getSetsRepsRest(tier: 1 | 2 | 3, experience: ExperienceLevel): { sets: number; reps: string; rest: string } {
  if (experience === 'novato') {
    if (tier === 1) return { sets: 3, reps: '8 - 10 reps', rest: '2 min' };
    if (tier === 2) return { sets: 3, reps: '10 - 12 reps', rest: '90 seg' };
    return { sets: 2, reps: '12 - 15 reps', rest: '60 seg' };
  } else if (experience === 'intermedio') {
    if (tier === 1) return { sets: 4, reps: '6 - 8 reps', rest: '2.5 min' };
    if (tier === 2) return { sets: 3, reps: '8 - 10 reps', rest: '90 - 120 seg' };
    return { sets: 3, reps: '10 - 12 reps', rest: '75 seg' };
  } else {
    // Avanzado
    if (tier === 1) return { sets: 4, reps: '5 - 7 reps (RIR 1)', rest: '3 min' };
    if (tier === 2) return { sets: 4, reps: '8 - 10 reps (RIR 0-1)', rest: '2 min' };
    return { sets: 4, reps: '10 - 15 reps (Fallo técnico)', rest: '60 - 75 seg' };
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
  exercisesDb: Exercise[]
): Routine {
  // If no muscles selected, use all muscles
  const focusMuscles = selectedMuscles.length > 0
    ? selectedMuscles
    : (['chest', 'back_upper', 'shoulders', 'quads', 'hamstrings', 'glutes', 'biceps', 'triceps', 'core'] as MuscleGroupId[]);

  const availableExercises = exercisesDb.filter(ex => isExerciseAllowed(ex, equipment));
  const { name, subtitle } = generateInadorName(selectedMuscles, daysCount);

  const days: RoutineDay[] = [];

  // Helper to pick exercises for a day
  const pickExercisesForMuscles = (
    targetMuscles: MuscleGroupId[],
    maxExercises: number = 6
  ): RoutineExercise[] => {
    const picked: RoutineExercise[] = [];
    const usedIds = new Set<string>();

    // 1. Give prioritized slots to targetMuscles that match focusMuscles
    const sortedTargets = [...targetMuscles].sort((a, b) => {
      const aFocus = focusMuscles.includes(a) ? 1 : 0;
      const bFocus = focusMuscles.includes(b) ? 1 : 0;
      return bFocus - aFocus;
    });

    // Pick Tier 1 compounds first for main muscles
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const tier1 = availableExercises.find(
        ex => ex.muscleGroup === muscle && ex.tier === 1 && !usedIds.has(ex.id)
      );
      if (tier1) {
        usedIds.add(tier1.id);
        const { sets, reps, rest } = getSetsRepsRest(tier1.tier, experience);
        picked.push({
          instanceId: `inst_${tier1.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: tier1.id,
          originalExerciseId: tier1.id,
          sets,
          reps,
          rest,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    // Pick Tier 2 compounds or secondary movements
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const tier2 = availableExercises.find(
        ex => ex.muscleGroup === muscle && ex.tier === 2 && !usedIds.has(ex.id)
      );
      if (tier2) {
        usedIds.add(tier2.id);
        const { sets, reps, rest } = getSetsRepsRest(tier2.tier, experience);
        picked.push({
          instanceId: `inst_${tier2.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: tier2.id,
          originalExerciseId: tier2.id,
          sets,
          reps,
          rest,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    // Pick Tier 3 isolation / accessories
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const tier3 = availableExercises.find(
        ex => ex.muscleGroup === muscle && ex.tier === 3 && !usedIds.has(ex.id)
      );
      if (tier3) {
        usedIds.add(tier3.id);
        const { sets, reps, rest } = getSetsRepsRest(tier3.tier, experience);
        picked.push({
          instanceId: `inst_${tier3.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: tier3.id,
          originalExerciseId: tier3.id,
          sets,
          reps,
          rest,
          isTemporarilyReplaced: false,
          completedSets: new Array(sets).fill(false)
        });
      }
    }

    // If still have capacity, fill with general compound from target muscles
    for (const muscle of sortedTargets) {
      if (picked.length >= maxExercises) break;
      const filler = availableExercises.find(
        ex => (ex.muscleGroup === muscle || ex.secondaryMuscles.includes(muscle)) && !usedIds.has(ex.id)
      );
      if (filler) {
        usedIds.add(filler.id);
        const { sets, reps, rest } = getSetsRepsRest(filler.tier, experience);
        picked.push({
          instanceId: `inst_${filler.id}_${Math.random().toString(36).substring(2, 7)}`,
          exerciseId: filler.id,
          originalExerciseId: filler.id,
          sets,
          reps,
          rest,
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
      title: 'Día 1: Despliegue de Fuego Anterior (Full Body A)',
      subtitle: 'Enfoque Pectoral, Cuádriceps, Hombro y Core',
      focusMuscles: ['chest', 'quads', 'shoulders', 'triceps', 'core'],
      exercises: pickExercisesForMuscles(['chest', 'quads', 'shoulders', 'triceps', 'core'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2: Tracción y Retaguardia (Full Body B)',
      subtitle: 'Enfoque Dorsales, Isquios, Glúteos y Bíceps',
      focusMuscles: ['back_upper', 'hamstrings', 'glutes', 'biceps', 'back_lower'],
      exercises: pickExercisesForMuscles(['back_upper', 'hamstrings', 'glutes', 'biceps', 'back_lower'], 6),
      isRestDay: false
    });
  } else if (daysCount === 3) {
    days.push({
      dayNumber: 1,
      title: 'Día 1: El Empuje-Destructor (Push)',
      subtitle: 'Pectoral mayor, deltoides anterior/lateral y tríceps de acero',
      focusMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'shoulders', 'triceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2: La Tracción-del-Abismo (Pull)',
      subtitle: 'Dorsales amplios, espalda alta, deltoides posterior y bíceps',
      focusMuscles: ['back_upper', 'back_lower', 'biceps', 'shoulders'],
      exercises: pickExercisesForMuscles(['back_upper', 'back_lower', 'biceps', 'shoulders'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3: La Base-de-Titán (Legs & Core)',
      subtitle: 'Cuádriceps, isquiotibiales, glúteos y blindaje abdominal',
      focusMuscles: ['quads', 'hamstrings', 'glutes', 'core', 'calves'],
      exercises: pickExercisesForMuscles(['quads', 'hamstrings', 'glutes', 'core', 'calves'], 6),
      isRestDay: false
    });
  } else if (daysCount === 4) {
    days.push({
      dayNumber: 1,
      title: 'Día 1: Torso Superior Alfa (Fuerza & Densidad)',
      subtitle: 'Press horizontal, tracción vertical pesada y hombros',
      focusMuscles: ['chest', 'back_upper', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'shoulders', 'triceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2: Tren Inferior de Choque (Potencia de Gimmelshtump)',
      subtitle: 'Sentadilla pesada, cadena posterior y abdomen',
      focusMuscles: ['quads', 'hamstrings', 'glutes', 'core'],
      exercises: pickExercisesForMuscles(['quads', 'hamstrings', 'glutes', 'core'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3: Torso Superior Beta (Hipertrofia & Bombeo)',
      subtitle: 'Inclinados, remos densos, brazos y deltoides lateral',
      focusMuscles: ['chest', 'back_upper', 'biceps', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'biceps', 'shoulders', 'triceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 4,
      title: 'Día 4: Piernas & Glúteos Beta (Esculpir y Destruir)',
      subtitle: 'Hip hinge, aislamiento femoral, glúteos y pantorrillas',
      focusMuscles: ['glutes', 'hamstrings', 'quads', 'calves', 'core'],
      exercises: pickExercisesForMuscles(['glutes', 'hamstrings', 'quads', 'calves', 'core'], 6),
      isRestDay: false
    });
  } else if (daysCount === 5) {
    days.push({
      dayNumber: 1,
      title: 'Día 1: Empuje Pesado (Push A)',
      subtitle: 'Pectoral pesado, hombro y tríceps',
      focusMuscles: ['chest', 'shoulders', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'shoulders', 'triceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 2,
      title: 'Día 2: Tracción Pesada (Pull A)',
      subtitle: 'Dominadas, remos pesados y bíceps',
      focusMuscles: ['back_upper', 'back_lower', 'biceps'],
      exercises: pickExercisesForMuscles(['back_upper', 'back_lower', 'biceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 3,
      title: 'Día 3: Piernas de Acero (Legs Focus)',
      subtitle: 'Cuádriceps, prensa y pantorrillas',
      focusMuscles: ['quads', 'glutes', 'calves', 'core'],
      exercises: pickExercisesForMuscles(['quads', 'glutes', 'calves', 'core'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 4,
      title: 'Día 4: Torso Hipertrofia (Upper Pump)',
      subtitle: 'Aislamientos de pecho, espalda y hombros',
      focusMuscles: ['chest', 'back_upper', 'shoulders', 'biceps', 'triceps'],
      exercises: pickExercisesForMuscles(['chest', 'back_upper', 'shoulders', 'biceps', 'triceps'], 6),
      isRestDay: false
    });
    days.push({
      dayNumber: 5,
      title: 'Día 5: Cadena Posterior & Brazos',
      subtitle: 'Isquios, glúteos y súper-series de brazos',
      focusMuscles: ['hamstrings', 'glutes', 'biceps', 'triceps', 'core'],
      exercises: pickExercisesForMuscles(['hamstrings', 'glutes', 'biceps', 'triceps', 'core'], 6),
      isRestDay: false
    });
  } else {
    // 6 Days Push / Pull / Legs x 2
    const splits = [
      { num: 1, title: 'Día 1: Empuje A (Fuerza Pectoral)', sub: 'Banca pesada y hombros', muscles: ['chest', 'shoulders', 'triceps'] as MuscleGroupId[] },
      { num: 2, title: 'Día 2: Tracción A (Dorsal & Espesor)', sub: 'Remos y dominadas', muscles: ['back_upper', 'back_lower', 'biceps'] as MuscleGroupId[] },
      { num: 3, title: 'Día 3: Pierna A (Dominante Cuádriceps)', sub: 'Sentadilla y prensa', muscles: ['quads', 'glutes', 'calves'] as MuscleGroupId[] },
      { num: 4, title: 'Día 4: Empuje B (Hipertrofia & Deltoides)', sub: 'Inclinados y elevaciones', muscles: ['chest', 'shoulders', 'triceps'] as MuscleGroupId[] },
      { num: 5, title: 'Día 5: Tracción B (Detalle & Bíceps)', sub: 'Poleas y brazos', muscles: ['back_upper', 'biceps', 'shoulders'] as MuscleGroupId[] },
      { num: 6, title: 'Día 6: Pierna B (Glúteos & Isquios)', sub: 'RDL y curls femorales', muscles: ['hamstrings', 'glutes', 'core'] as MuscleGroupId[] }
    ];

    splits.forEach(s => {
      days.push({
        dayNumber: s.num,
        title: s.title,
        subtitle: s.sub,
        focusMuscles: s.muscles,
        exercises: pickExercisesForMuscles(s.muscles, 6),
        isRestDay: false
      });
    });
  }

  const blueprintComment = `«¡Ajá! El plano está sellado. Este ${name} transferirá la masa muscular directamente desde el ego de Roger hacia tus fibras. Sigue los descansos y no toques cables pelados».`;

  return {
    id: `routine_${Date.now()}`,
    name,
    subtitle,
    createdAt: new Date().toISOString(),
    experience,
    daysPerWeek: daysCount,
    equipment,
    selectedMuscles,
    days,
    heinzBlueprintComment: blueprintComment
  };
}

export function findQuickSubstitution(
  currentExId: string,
  equipment: EquipmentPreference,
  allExercises: Exercise[],
  currentDayExerciseIds: string[]
): { replacement: Exercise | null; complaint: string } {
  const current = allExercises.find(e => e.id === currentExId);
  if (!current) return { replacement: null, complaint: '¡Ejercicio desconocido! Perry debió alterar los planos.' };

  // Candidates: direct equivalents first, then free weight equivalents
  const candidateIds = [...current.directEquivalents, ...current.freeWeightEquivalents];
  const validCandidates = allExercises.filter(ex =>
    candidateIds.includes(ex.id) &&
    ex.id !== currentExId &&
    isExerciseAllowed(ex, equipment) &&
    !currentDayExerciseIds.includes(ex.id)
  );

  if (validCandidates.length === 0) {
    // Fallback: any exercise with same movement pattern
    const patternFallback = allExercises.find(ex =>
      ex.movementPattern === current.movementPattern &&
      ex.id !== currentExId &&
      isExerciseAllowed(ex, equipment) &&
      !currentDayExerciseIds.includes(ex.id)
    );
    if (patternFallback) {
      return {
        replacement: patternFallback,
        complaint: `¡Ugh, todas las máquinas habituales están colapsadas! Toma este ${patternFallback.doofSubtitle} que cumple el mismo patrón biomecánico.`
      };
    }
    return {
      replacement: null,
      complaint: '¡No hay más máquinas equivalentes disponibles en tu entorno! Tendrás que esperar o pelear por la polea.'
    };
  }

  const picked = validCandidates[Math.floor(Math.random() * validCandidates.length)];
  return {
    replacement: picked,
    complaint: `¡Maldito sujeto acaparador! Reemplazando temporalmente por ${picked.name} (${picked.doofSubtitle}). ¡Mismo estímulo de hipertrofia!`
  };
}

export function findPermanentSubstitution(
  currentExId: string,
  equipment: EquipmentPreference,
  allExercises: Exercise[],
  currentDayExerciseIds: string[]
): { replacement: Exercise | null; complaint: string } {
  const current = allExercises.find(e => e.id === currentExId);
  if (!current) return { replacement: null, complaint: '¡Ejercicio no encontrado!' };

  // For permanent change, prefer freeWeightEquivalents if home, or directEquivalents
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
        complaint: `¿Qué? ¿Tan delicado eres? He modificado el plano permanentemente por ${fallback.name}. ¡Espero que tus articulaciones queden contentas!`
      };
    }
    return {
      replacement: null,
      complaint: '¡No encontré un reemplazo viable en la base de datos para tu equipamiento!'
    };
  }

  const picked = validCandidates[0];
  return {
    replacement: picked,
    complaint: `¿No te gusta ${current.name}? ¡En mis tiempos en Gimmelshtump levantábamos yunques oxidados! Pero bien, he soldado ${picked.name} permanentemente en tu plano.`
  };
}
