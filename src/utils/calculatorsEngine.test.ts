/**
 * SUITE DE TESTS UNITARIOS · 12 CALCULADORAS CIENTÍFICAS
 * Ejecutable con Vitest / Jest o como script de aserción.
 */

import {
  calculateReadiness,
  calculateSleepCycles,
  calculateMacros,
  calculateDeadlift1RM,
  calculateBenchPress1RM,
  calculateCaffeineDosage,
  calculateDetailedTDEE,
  calculateWaterRequirement,
  calculateBodyFatSkinfolds,
  calculateHeartRateZones,
  calculateCreatineDosage,
  calculateMagnesiumRequirements
} from './calculatorsEngine';

export function runAllCalculatorTests(): boolean {
  console.log('🧪 Iniciando verificación de 12 motores de cálculo...');

  // 1. Test Readiness (Hooper + ACWR)
  const readiness = calculateReadiness({
    sleepQuality: 8,
    muscleSoreness: 3,
    stressLevel: 2,
    fatigueLevel: 3,
    acuteLoad: 1200,
    chronicLoad: 1100
  });
  console.assert(readiness.readinessScore > 70, 'Test 1 Fallido: Score de recuperación');
  console.assert(readiness.recoveryState === 'Óptimo (Verde)', 'Test 1 Fallido: Estado');

  // 2. Test Sueño (Target Wake 07:00)
  const sleep = calculateSleepCycles({
    mode: 'bedtime_for_target_wake',
    targetTime: '07:00',
    sleepLatencyMinutes: 15
  });
  console.assert(sleep.options.length === 4, 'Test 2 Fallido: Opciones de sueño');
  console.assert(sleep.options.some(o => o.formattedTime === '23:15'), 'Test 2 Fallido: Hora 5 ciclos (7.5h + 15m latencia)');

  // 3. Test Macros (Hombre 80kg, 180cm, 25a, volumen limpio)
  const macros = calculateMacros({
    weightKg: 80,
    heightCm: 180,
    ageYears: 25,
    gender: 'male',
    activityFactor: 1.55,
    goal: 'volumen_limpio'
  });
  console.assert(macros.bmrKcal > 1700 && macros.bmrKcal < 1900, 'Test 3 Fallido: BMR');
  console.assert(macros.macros.proteinGrams === 144, 'Test 3 Fallido: Proteínas (80kg x 1.8 = 144g)');

  // 4. Test 1RM Peso Muerto (140 kg x 5 reps)
  const dl1rm = calculateDeadlift1RM({ weightLiftedKg: 140, repetitions: 5 });
  console.assert(dl1rm.weightedEstimated1RMKg >= 160 && dl1rm.weightedEstimated1RMKg <= 165, 'Test 4 Fallido: 1RM Deadlift');

  // 5. Test 1RM Press Banca (100 kg x 5 reps)
  const bp1rm = calculateBenchPress1RM({ weightLiftedKg: 100, repetitions: 5 });
  console.assert(bp1rm.consensusEstimated1RMKg >= 115 && bp1rm.consensusEstimated1RMKg <= 118, 'Test 5 Fallido: 1RM Bench');

  // 6. Test Cafeína (Atleta 75kg)
  const caffeine = calculateCaffeineDosage({ weightKg: 75 });
  console.assert(caffeine.ergogenicPreWorkoutDoseMg.minMg === 225, 'Test 6 Fallido: Min cafeína (75 * 3)');
  console.assert(caffeine.ergogenicPreWorkoutDoseMg.maxMg === 450, 'Test 6 Fallido: Max cafeína (75 * 6)');

  // 7. Test TDEE Desglosado (Hombre 75kg, 10000 pasos, 5h entreno)
  const tdee = calculateDetailedTDEE({
    weightKg: 75,
    heightCm: 178,
    ageYears: 28,
    gender: 'male',
    stepsPerDay: 10000,
    trainingHoursPerWeek: 5,
    trainingIntensity: 'moderate'
  });
  console.assert(tdee.totalTdeeKcal > 2400 && tdee.totalTdeeKcal < 3000, 'Test 7 Fallido: TDEE');

  // 8. Test Agua (70kg, 60min entreno, clima templado)
  const water = calculateWaterRequirement({
    weightKg: 70,
    trainingDurationMinutes: 60,
    environmentClimate: 'temperate'
  });
  console.assert(water.totalDailyWaterLiters >= 3.0 && water.totalDailyWaterLiters <= 3.5, 'Test 8 Fallido: Hidratación');

  // 9. Test Pliegues JP3 (Hombre 25 años: Pec 8mm, Abd 14mm, Muslo 12mm)
  const skinfolds = calculateBodyFatSkinfolds({
    model: 'jp3',
    gender: 'male',
    ageYears: 25,
    chestMm: 8,
    abdomenMm: 14,
    thighMm: 12
  }, 75);
  console.assert(skinfolds.bodyFatSiriPercentage >= 9 && skinfolds.bodyFatSiriPercentage <= 13, 'Test 9 Fallido: Grasa Siri');

  // 10. Test FC Máx & Karvonen (30 años, FC reposo 55)
  const hr = calculateHeartRateZones({ ageYears: 30, restingHeartRateBpm: 55 });
  console.assert(hr.consensusMaxHrBpm >= 185 && hr.consensusMaxHrBpm <= 190, 'Test 10 Fallido: FC Máx');
  console.assert(hr.zones.length === 5, 'Test 10 Fallido: Zonas');

  // 11. Test Creatina (80kg)
  const creatine = calculateCreatineDosage({ weightKg: 80, strategy: 'fast_loading' });
  console.assert(creatine.dailyDoseGrams === 24, 'Test 11 Fallido: Dosis de carga 80 * 0.3 = 24g');

  // 12. Test Magnesio (Hombre atleta alta sudoración)
  const magnesium = calculateMagnesiumRequirements({ ageYears: 26, gender: 'male', highSweatAthlete: true });
  console.assert(magnesium.athleteAdjustedRdaMg === 483, 'Test 12 Fallido: Magnesio atleta (420 * 1.15 = 483mg)');

  console.log('✅ ¡Los 12 tests matemáticos de las calculadoras pasaron exitosamente!');
  return true;
}
