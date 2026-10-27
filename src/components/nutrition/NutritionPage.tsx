/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Utensils,
  Plus,
  Droplets,
  Flame,
  PieChart,
  Trash2,
  Clock,
  Sparkles,
  Camera,
  Activity,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Scale,
  Zap,
} from 'lucide-react';
import {
  calculateCalorieProgress,
  calculateMacroPercentages,
  calculateBMRAndTDEE,
} from '../../utils/healthCalculations';

export const NutritionPage: React.FC = () => {
  const {
    nutrition,
    userProfile,
    logMeal,
    deleteMeal,
    addWater,
    setIsLogFoodModalOpen,
    setIsScanFoodModalOpen,
  } = useHealth();

  const calorieProg = calculateCalorieProgress(
    nutrition.caloriesConsumed,
    nutrition.calorieTarget
  );
  const macroPct = calculateMacroPercentages(
    nutrition.proteinGrams,
    nutrition.carbsGrams,
    nutrition.fatGrams
  );

  // Clinical metabolic calculation based on Mifflin-St Jeor (moderately active: 1.55x)
  const metabolic = calculateBMRAndTDEE(
    userProfile.currentWeightKg,
    userProfile.heightCm,
    userProfile.age,
    userProfile.biologicalSex,
    1.55
  );

  const netDeficit = metabolic.tdee - nutrition.caloriesConsumed;

  const MEAL_TYPES = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '☀️' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
    { id: 'snack', label: 'Snacks & Supplements', icon: '🍎' },
  ] as const;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Calorie Tracker & Nutrition AI
            </h1>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded uppercase tracking-wide">
              Cal AI Powered
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time metabolic expenditure, photo food scanner, macro equilibrium, and micronutrient repletion synergy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Cal AI Photo Scanner Button */}
          <button
            onClick={() => setIsScanFoodModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 text-teal-200" />
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Scan Meal with Cal AI</span>
          </button>

          {/* Manual Entry Button */}
          <button
            onClick={() => setIsLogFoodModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Log Item</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Calories & Macros Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calorie Ring / Gauge Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Daily Caloric Ingestion
            </span>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              {calorieProg.percentage}% of Target
            </span>
          </div>

          <div className="py-4 text-center">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tabular-nums">
              {nutrition.caloriesConsumed}
            </div>
            <span className="text-xs font-medium text-slate-500">
              calories consumed / {nutrition.calorieTarget} target
            </span>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${calorieProg.percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
            <span>
              Remaining: <strong className="text-teal-700 font-sans">{calorieProg.remaining} kcal</strong>
            </span>
            <span>
              Budget: <strong className="text-slate-800 font-sans">{nutrition.calorieTarget} kcal</strong>
            </span>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-teal-600" />
              Macronutrient Targets
            </h3>
            <span className="text-xs text-slate-400 font-mono">4:4:9 kcal/g</span>
          </div>

          {/* Protein Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Protein: {nutrition.proteinGrams}g ({macroPct.proteinPct}%)
              </span>
              <span className="font-mono text-slate-500">
                Goal: {nutrition.proteinTarget}g
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (nutrition.proteinGrams / nutrition.proteinTarget) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Carbohydrates: {nutrition.carbsGrams}g ({macroPct.carbsPct}%)
              </span>
              <span className="font-mono text-slate-500">
                Goal: {nutrition.carbsTarget}g
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (nutrition.carbsGrams / nutrition.carbsTarget) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Fats Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                Dietary Fats: {nutrition.fatGrams}g ({macroPct.fatPct}%)
              </span>
              <span className="font-mono text-slate-500">
                Goal: {nutrition.fatTarget}g
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (nutrition.fatGrams / nutrition.fatTarget) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Hydration Tracker Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-500" />
                Hydration Tracker
              </span>
              <span className="text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono font-bold">
                {Math.round((nutrition.waterMl / nutrition.waterTargetMl) * 100)}%
              </span>
            </div>

            <div className="py-2 text-center">
              <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {nutrition.waterMl}{' '}
                <span className="text-sm font-sans font-medium text-slate-500">
                  / {nutrition.waterTargetMl} mL
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Vital for cellular metabolism and fat-soluble vitamin absorption
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 mL Glass</span>
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500 mL Bottle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Metabolic & Deficit Balance (Mifflin-St Jeor Engine) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Metabolic Expenditure & Net Calorie Deficit Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculated via Mifflin-St Jeor equation customized to {userProfile.fullName} ({userProfile.age} yrs, {userProfile.currentWeightKg} kg, {userProfile.heightCm} cm, moderately active).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
            Target Pace: ~0.4 kg fat loss / week
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Basal Metabolic Rate (BMR)
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-slate-900">{metabolic.bmr}</span>
              <span className="text-xs text-slate-500">kcal/day</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum energy required for basal physiological homeostasis at rest.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Total Daily Expenditure (TDEE)
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-slate-900">{metabolic.tdee}</span>
              <span className="text-xs text-slate-500">kcal/day</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Estimated total daily burn inclusive of physical movement & NEAT.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Food Consumed Today
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-slate-900">{nutrition.caloriesConsumed}</span>
              <span className="text-xs text-slate-500">kcal</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Logged intake from {nutrition.meals.length} structured meals.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-900 uppercase block">
                Net Calorie Deficit
              </span>
              <TrendingDown className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-teal-800">
                {netDeficit > 0 ? `-${netDeficit}` : `+${Math.abs(netDeficit)}`}
              </span>
              <span className="text-xs text-teal-700">kcal deficit</span>
            </div>
            <p className="text-[11px] text-teal-800 mt-1">
              Optimal therapeutic deficit promoting gradual fat loss without catabolizing lean muscle mass.
            </p>
          </div>
        </div>
      </div>

      {/* Micronutrient Repletion Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Micronutrient & Clinical Synergy Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily micronutrient density aligned with your active clinical Vitamin D repletion protocol.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-600">
            Updated via Cal AI Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-700 block">Dietary Vitamin D</span>
            <span className="text-lg font-bold font-mono text-slate-900 block mt-1">840 IU</span>
            <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
              + Weekly 50,000 IU Rx
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-700 block">Bioavailable Calcium</span>
            <span className="text-lg font-bold font-mono text-slate-900 block mt-1">420 mg</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Target: 1,000 mg/day
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-700 block">Omega-3 EPA / DHA</span>
            <span className="text-lg font-bold font-mono text-slate-900 block mt-1">2,100 mg</span>
            <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
              Cardiovascular support
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-xs font-bold text-slate-700 block">Dietary Fiber</span>
            <span className="text-lg font-bold font-mono text-slate-900 block mt-1">24 g</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Target: 28 g/day
            </span>
          </div>
        </div>
      </div>

      {/* Meals Breakdown by Type */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Meals & Logged Food</h3>
            <p className="text-xs text-slate-500">
              Each meal is cross-referenced with your nutritional goals and active health journeys.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {nutrition.meals.length} item{nutrition.meals.length === 1 ? '' : 's'} logged
          </span>
        </div>

        <div className="space-y-4">
          {MEAL_TYPES.map((type) => {
            const mealsOfType = nutrition.meals.filter((m) => m.mealType === type.id);
            const totalCals = mealsOfType.reduce((acc, m) => acc + m.calories, 0);

            return (
              <div
                key={type.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{type.icon}</span>
                    <h4 className="text-sm font-bold text-slate-900">{type.label}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {totalCals} kcal
                  </span>
                </div>

                {mealsOfType.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400 italic mb-2">
                      No items logged for {type.label.toLowerCase()} yet.
                    </p>
                    <button
                      onClick={() => setIsScanFoodModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Scan {type.label} with Cal AI</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {mealsOfType.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.portion} · {item.time}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right font-mono">
                            <span className="font-bold text-slate-900 block">{item.calories} kcal</span>
                            <span className="text-[10px] text-slate-500 block">
                              P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                            </span>
                          </div>

                          <button
                            onClick={() => deleteMeal(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete meal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
