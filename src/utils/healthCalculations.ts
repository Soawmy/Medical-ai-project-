/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Unknown' };
  }
  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  return { bmi, category };
}

export function calculateCalorieProgress(consumed: number, target: number): { percentage: number; remaining: number } {
  if (target <= 0) return { percentage: 0, remaining: 0 };
  const percentage = Math.min(100, Math.round((consumed / target) * 100));
  const remaining = Math.max(0, target - consumed);
  return { percentage, remaining };
}

export function calculateMacroPercentages(
  proteinG: number,
  carbsG: number,
  fatG: number
): { proteinPct: number; carbsPct: number; fatPct: number } {
  const proteinKcal = proteinG * 4;
  const carbsKcal = carbsG * 4;
  const fatKcal = fatG * 9;
  const totalKcal = proteinKcal + carbsKcal + fatKcal;

  if (totalKcal <= 0) {
    return { proteinPct: 0, carbsPct: 0, fatPct: 0 };
  }

  return {
    proteinPct: Math.round((proteinKcal / totalKcal) * 100),
    carbsPct: Math.round((carbsKcal / totalKcal) * 100),
    fatPct: Math.round((fatKcal / totalKcal) * 100),
  };
}

export function evaluateLabStatus(
  value: number,
  minNormal: number,
  maxNormal: number
): 'normal' | 'low' | 'high' | 'critical' {
  if (minNormal >= maxNormal) return 'normal';
  
  if (value < minNormal * 0.5) return 'critical';
  if (value > maxNormal * 1.5) return 'critical';
  if (value < minNormal) return 'low';
  if (value > maxNormal) return 'high';
  return 'normal';
}

export function calculateHabitStreak(
  completedDates: string[],
  referenceDateStr: string = '2026-10-27'
): { currentStreak: number; bestStreak: number } {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const sortedDates = Array.from(new Set(completedDates)).sort().reverse();
  const dateSet = new Set(completedDates);

  // Parse reference date
  const ref = new Date(referenceDateStr + 'T00:00:00Z');
  
  // Check if reference date or previous day was completed
  let currentStreak = 0;
  let checkDate = new Date(ref);

  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  // If today isn't completed, streak can continue if yesterday was completed
  const todayStr = formatYMD(checkDate);
  if (!dateSet.has(todayStr)) {
    checkDate.setUTCDate(checkDate.getUTCDate() - 1);
  }

  while (dateSet.has(formatYMD(checkDate))) {
    currentStreak++;
    checkDate.setUTCDate(checkDate.getUTCDate() - 1);
  }

  // Calculate best historical streak
  let bestStreak = 0;
  let running = 0;
  
  // Sort ascending for best streak
  const ascending = Array.from(dateSet).sort();
  for (let i = 0; i < ascending.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(ascending[i - 1] + 'T00:00:00Z');
      const curr = new Date(ascending[i] + 'T00:00:00Z');
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else {
        running = 1;
      }
    }
    if (running > bestStreak) {
      bestStreak = running;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}

export function calculateBMRAndTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'female' | 'male' | 'other',
  activityMultiplier: number = 1.45
): { bmr: number; tdee: number } {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return { bmr: 1500, tdee: 2000 };
  }
  // Mifflin-St Jeor formula
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? Math.round(base + 5) : Math.round(base - 161);
  const tdee = Math.round(bmr * activityMultiplier);
  return { bmr, tdee };
}

