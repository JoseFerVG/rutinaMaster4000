import * as XLSX from 'xlsx';
import { Routine, Exercise } from '../types';
import { CardioRoutine } from '../types/cardio';
import { MUSCLE_LABELS_ES } from './routineEngine';
import { CARDIO_MODALITY_LABELS, CARDIO_GOAL_LABELS } from './cardioEngine';

export function exportRoutineToExcel(routine: Routine, allExercises: Exercise[]): void {
  const wb = XLSX.utils.book_new();

  // 1. Overview Sheet
  const overviewData = [
    ['KINETIC BIOMECHANICS · PROTOCOLO DE ENTRENAMIENTO'],
    [''],
    ['Nombre del Plan:', routine.name],
    ['Subtítulo:', routine.subtitle],
    ['Objetivo Fisiológico:', routine.goal.toUpperCase()],
    ['Nivel de Experiencia:', routine.experience.toUpperCase()],
    ['Frecuencia Semanal:', `${routine.daysPerWeek} días / semana`],
    ['Duración Estimada:', `${routine.sessionDuration || 60} minutos / sesión`],
    ['Entorno / Equipamiento:', routine.equipment === 'commercial' ? 'Gimnasio Comercial Completo' : 'Gimnasio en Casa / Mancuernas'],
    ['Fecha de Generación:', new Date(routine.createdAt || Date.now()).toLocaleDateString('es-ES')],
    ['Notas del Protocolo:', routine.summaryNote],
    [''],
    ['ESTRUCTURA GENERAL DEL PROTOCOLO:'],
    ['Día', 'Nombre de la Sesión', 'Enfoque Muscular', 'Nº Ejercicios']
  ];

  routine.days.forEach(day => {
    const focus = day.focusMuscles.map(m => MUSCLE_LABELS_ES[m] || m).join(', ');
    const activeCount = day.exercises.filter(e => !e.isOmitted).length;
    overviewData.push([
      `Día 0${day.dayNumber}`,
      day.title,
      focus,
      `${activeCount} ejercicios`
    ]);
  });

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  wsOverview['!cols'] = [
    { wch: 24 },
    { wch: 45 },
    { wch: 35 },
    { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Resumen_Protocolo');

  // 2. Individual Workout Day Sheets
  routine.days.forEach(day => {
    const activeExercises = day.exercises.filter(e => !e.isOmitted);
    const dayData: any[][] = [
      [`KINETIC BIOMECHANICS · ${day.title.toUpperCase()}`],
      [`Enfoque: ${day.subtitle}`],
      [`Músculos Objetivo: ${day.focusMuscles.map(m => MUSCLE_LABELS_ES[m] || m).join(' · ')}`],
      [''],
      [
        'Nº',
        'Ejercicio Principal',
        'Alternativa / Plan B (por si está ocupado)',
        'Mecánica',
        'Músculo Primario',
        'Sinergistas',
        'Series',
        'Repeticiones',
        'Descanso',
        'Intensidad (RIR)',
        'Guía Técnica & Biomecánica',
        'Semana 1 (Kg x Reps)',
        'Semana 2 (Kg x Reps)',
        'Semana 3 (Kg x Reps)',
        'Semana 4 (Kg x Reps)',
        'Notas del Atleta'
      ]
    ];

    activeExercises.forEach((exInst, idx) => {
      const meta = allExercises.find(e => e.id === exInst.exerciseId);
      const altMeta = exInst.alternativeExerciseId ? allExercises.find(e => e.id === exInst.alternativeExerciseId) : null;
      const name = meta ? meta.name : 'Ejercicio';
      const firstBackupId = exInst.backupExerciseIds?.[0];
      const altName = altMeta ? altMeta.name : (firstBackupId ? (allExercises.find(e => e.id === firstBackupId)?.name || '-') : '-');
      const mechanics = meta ? (meta.mechanics === 'compound' ? 'Compuesto' : 'Aislamiento') : '-';
      const primary = meta ? (MUSCLE_LABELS_ES[meta.muscleGroup] || meta.muscleGroup) : '-';
      const synergists = meta && meta.secondaryMuscles ? meta.secondaryMuscles.map(m => MUSCLE_LABELS_ES[m] || m).join(', ') : '-';
      const cue = meta ? meta.coachingCue : '';

      dayData.push([
        String(idx + 1).padStart(2, '0'),
        name,
        altName,
        mechanics,
        primary,
        synergists,
        exInst.sets,
        exInst.reps,
        exInst.rest,
        exInst.targetRir || 'RIR 1-2',
        cue,
        '', // Week 1 blank log column
        '', // Week 2 blank log column
        '', // Week 3 blank log column
        '', // Week 4 blank log column
        exInst.notes || ''
      ]);
    });

    const wsDay = XLSX.utils.aoa_to_sheet(dayData);
    wsDay['!cols'] = [
      { wch: 6 },  // Nº
      { wch: 32 }, // Ejercicio
      { wch: 32 }, // Alternativa / Plan B
      { wch: 14 }, // Mecánica
      { wch: 18 }, // Músculo Primario
      { wch: 22 }, // Sinergistas
      { wch: 8 },  // Series
      { wch: 14 }, // Reps
      { wch: 12 }, // Descanso
      { wch: 14 }, // RIR
      { wch: 55 }, // Guía Técnica
      { wch: 20 }, // Sem 1
      { wch: 20 }, // Sem 2
      { wch: 20 }, // Sem 3
      { wch: 20 }, // Sem 4
      { wch: 28 }  // Notas
    ];

    const sheetName = `Dia_${day.dayNumber}_${day.title.split('·')[1]?.trim().substring(0, 15) || `Sesion_${day.dayNumber}`}`.replace(/[:\\/?*\[\]]/g, '_');
    XLSX.utils.book_append_sheet(wb, wsDay, sheetName.substring(0, 31));
  });

  const sanitizedFileName = `Kinetic_Biomechanics_${routine.name.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, sanitizedFileName);
}

export function exportCardioToExcel(cardioRoutine: CardioRoutine): void {
  const wb = XLSX.utils.book_new();

  // Overview & Zones Sheet
  const zonesData = [
    ['KINETIC BIOMECHANICS · PLAN DE CARDIO & RESISTENCIA'],
    [''],
    ['Nombre del Plan:', cardioRoutine.name],
    ['Subtítulo:', cardioRoutine.subtitle],
    ['Modalidad:', CARDIO_MODALITY_LABELS[cardioRoutine.modality] || cardioRoutine.modality],
    ['Objetivo Fisiológico:', CARDIO_GOAL_LABELS[cardioRoutine.goal] || cardioRoutine.goal],
    ['Nivel:', cardioRoutine.experience.toUpperCase()],
    ['Frecuencia:', `${cardioRoutine.daysPerWeek} sesiones / semana`],
    ['Duración media:', `${cardioRoutine.sessionDuration} min / sesión`],
    ['Fecha:', new Date(cardioRoutine.createdAt || Date.now()).toLocaleDateString('es-ES')],
    [''],
    ['TABLA DE ZONAS FISIOLÓGICAS & ADAPTACIONES (KARVONEN / COGGAN):'],
    ['Zona', 'Denominación', '% FCmáx', 'Escala RPE', 'Sustrato Energético', 'Adaptación Fisiológica']
  ];

  cardioRoutine.zonesGuide.forEach(z => {
    zonesData.push([
      z.zone,
      z.name,
      z.percentageFcMax,
      z.rpeScale,
      z.primaryEnergySystem,
      z.physiologicalAdaptation
    ]);
  });

  const wsZones = XLSX.utils.aoa_to_sheet(zonesData);
  wsZones['!cols'] = [
    { wch: 8 },
    { wch: 28 },
    { wch: 16 },
    { wch: 24 },
    { wch: 32 },
    { wch: 55 }
  ];
  XLSX.utils.book_append_sheet(wb, wsZones, 'Zonas_Fisiologicas');

  // Sessions Sheet
  const sessionsData: any[][] = [
    ['KINETIC BIOMECHANICS · DESGLOSE DE SESIONES DE CARDIO'],
    [''],
    [
      'Sesión',
      'Título',
      'Tipo de Trabajo',
      'Zona Primaria',
      'Duración (min)',
      'Fase 1: Calentamiento',
      'Fase 2: Bloque Principal (Intervalos / Continuo)',
      'Fase 3: Enfriamiento',
      'Instrucción Biomecánica',
      'Nutrición & Hidratación',
      'Registro Real (FC media, Pace, Watios)'
    ]
  ];

  cardioRoutine.sessions.forEach(sess => {
    const mainDetails = sess.mainBlock
      .map(b => `${b.name}: ${b.duration} (${b.targetPaceOrRpe})`)
      .join(' | ');

    sessionsData.push([
      `Sesión 0${sess.sessionNumber}`,
      sess.title,
      sess.type,
      sess.primaryZone,
      sess.totalDurationMinutes,
      `${sess.warmup.duration} (${sess.warmup.targetPaceOrRpe})`,
      mainDetails,
      `${sess.cooldown.duration} (${sess.cooldown.targetPaceOrRpe})`,
      sess.biomechanicalCue,
      sess.nutritionHydrationTip,
      sess.userLogNotes || ''
    ]);
  });

  const wsSessions = XLSX.utils.aoa_to_sheet(sessionsData);
  wsSessions['!cols'] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 25 },
    { wch: 55 },
    { wch: 22 },
    { wch: 45 },
    { wch: 40 },
    { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSessions, 'Plan_Sesiones');

  const sanitizedFileName = `Kinetic_Cardio_${cardioRoutine.name.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, sanitizedFileName);
}

export function downloadMarkdownFile(routine: Routine, allExercises: Exercise[]): void {
  let text = `# ${routine.name}\n\n`;
  text += `> **Kinetic Biomechanics Protocol** · ${routine.subtitle}\n\n`;
  text += `- **Objetivo:** ${routine.goal.toUpperCase()}\n`;
  text += `- **Nivel:** ${routine.experience.toUpperCase()}\n`;
  text += `- **Frecuencia:** ${routine.daysPerWeek} días / semana\n`;
  text += `- **Duración por sesión:** ~${routine.sessionDuration || 60} minutos\n`;
  text += `- **Equipamiento:** ${routine.equipment === 'commercial' ? 'Gimnasio Comercial' : 'Gimnasio en Casa'}\n`;
  text += `- **Notas:** ${routine.summaryNote}\n\n`;
  text += `---\n\n`;

  routine.days.forEach(day => {
    text += `## ${day.title}\n`;
    text += `*${day.subtitle}*\n\n`;
    text += `| Nº | Ejercicio Principal | Alternativa / Plan B | Series | Reps | Descanso | RIR | Indicación Biomecánica |\n`;
    text += `|:---|:---|:---|:---:|:---:|:---:|:---:|:---|\n`;

    day.exercises.forEach((exInst, idx) => {
      if (exInst.isOmitted) return;
      const meta = allExercises.find(e => e.id === exInst.exerciseId);
      const altMeta = exInst.alternativeExerciseId ? allExercises.find(e => e.id === exInst.alternativeExerciseId) : null;
      const name = meta ? meta.name : 'Ejercicio';
      const firstBackupId = exInst.backupExerciseIds?.[0];
      const altName = altMeta ? altMeta.name : (firstBackupId ? (allExercises.find(e => e.id === firstBackupId)?.name || '-') : '-');
      const cue = meta ? meta.coachingCue : '';
      text += `| ${String(idx + 1).padStart(2, '0')} | **${name}** | *${altName}* | ${exInst.sets} | ${exInst.reps} | ${exInst.rest} | ${exInst.targetRir || 'RIR 1-2'} | ${cue} |\n`;
    });

    text += `\n`;
  });

  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Kinetic_Protocol_${routine.name.replace(/\s+/g, '_')}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadICSFile(routine: Routine, allExercises: Exercise[]): void {
  let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Kinetic Biomechanics//Routine Planner//ES\nCALSCALE:GREGORIAN\n`;

  const today = new Date();
  routine.days.forEach((day, index) => {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + index);
    const dateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const exerciseList = day.exercises
      .filter(e => !e.isOmitted)
      .map((e, idx) => {
        const meta = allExercises.find(m => m.id === e.exerciseId);
        return `${idx + 1}. ${meta ? meta.name : 'Ejercicio'} (${e.sets}x${e.reps})`;
      })
      .join('\\n');

    ics += `BEGIN:VEVENT\n`;
    ics += `UID:kinetic_${routine.id}_day_${day.dayNumber}_${Date.now()}@kineticbiomechanics.com\n`;
    ics += `DTSTAMP:${dateStr}\n`;
    ics += `DTSTART:${dateStr}\n`;
    ics += `SUMMARY:Kinetic: ${day.title}\n`;
    ics += `DESCRIPTION:${day.subtitle}\\n\\nEjercicios:\\n${exerciseList}\n`;
    ics += `END:VEVENT\n`;
  });

  ics += `END:VCALENDAR\n`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Kinetic_Schedule_${routine.name.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSONBackup(routine: Routine): void {
  const jsonStr = JSON.stringify(routine, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Kinetic_Backup_${routine.name.replace(/\s+/g, '_')}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
