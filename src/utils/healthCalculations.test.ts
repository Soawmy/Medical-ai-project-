/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMI,
  calculateCalorieProgress,
  calculateMacroPercentages,
  evaluateLabStatus,
  calculateHabitStreak,
  calculateBMRAndTDEE,
} from './healthCalculations';

test('calculateBMI computes correct BMI and category', () => {
  const result = calculateBMI(68, 175);
  // 68 / (1.75 * 1.75) = 22.2
  assert.equal(result.bmi, 22.2);
  assert.equal(result.category, 'Normal weight');

  const underweight = calculateBMI(45, 170);
  assert.equal(underweight.category, 'Underweight');

  const overweight = calculateBMI(85, 170);
  assert.equal(overweight.category, 'Overweight');
});

test('calculateCalorieProgress calculates percentage and remaining', () => {
  const progress = calculateCalorieProgress(1450, 2100);
  assert.equal(progress.percentage, 69);
  assert.equal(progress.remaining, 650);

  const overflow = calculateCalorieProgress(2400, 2100);
  assert.equal(overflow.percentage, 100);
  assert.equal(overflow.remaining, 0);
});

test('calculateMacroPercentages computes accurate ratios', () => {
  const macros = calculateMacroPercentages(120, 200, 55);
  // Protein: 120 * 4 = 480
  // Carbs: 200 * 4 = 800
  // Fat: 55 * 9 = 495
  // Total: 1775
  // P: 480/1775 = 27%, C: 800/1775 = 45%, F: 495/1775 = 28%
  assert.equal(macros.proteinPct + macros.carbsPct + macros.fatPct, 100);
  assert.equal(macros.proteinPct, 27);
  assert.equal(macros.carbsPct, 45);
  assert.equal(macros.fatPct, 28);
});

test('evaluateLabStatus accurately flags out-of-range clinical results', () => {
  assert.equal(evaluateLabStatus(50, 30, 100), 'normal');
  assert.equal(evaluateLabStatus(18, 30, 100), 'low'); // Vitamin D deficiency
  assert.equal(evaluateLabStatus(120, 30, 100), 'high');
  assert.equal(evaluateLabStatus(5, 30, 100), 'critical'); // severe drop
});

test('calculateHabitStreak tracks consecutive completion days', () => {
  const completed = [
    '2026-10-24',
    '2026-10-25',
    '2026-10-26',
    '2026-10-27',
  ];
  const streak = calculateHabitStreak(completed, '2026-10-27');
  assert.equal(streak.currentStreak, 4);
  assert.equal(streak.bestStreak, 4);

  // If today is not done yet, but yesterday was done, streak is active at 3
  const completedYesterday = [
    '2026-10-24',
    '2026-10-25',
    '2026-10-26',
  ];
  const activeStreak = calculateHabitStreak(completedYesterday, '2026-10-27');
  assert.equal(activeStreak.currentStreak, 3);
});

test('calculateBMRAndTDEE computes metabolic baseline correctly', () => {
  const result = calculateBMRAndTDEE(68, 175, 28, 'female', 1.45);
  // BMR = 10*68 + 6.25*175 - 5*28 - 161 = 1473
  assert.equal(result.bmr, 1473);
  assert.equal(result.tdee, 2136);
});

