/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { ScannedFoodAnalysis } from '../../types/health';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Utensils,
  Plus,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const SAMPLE_PRESETS: {
  title: string;
  image: string;
  data: ScannedFoodAnalysis;
}[] = [
  {
    title: 'Grilled Wild Salmon & Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    data: {
      dishName: 'Pan-Seared Wild Alaskan Salmon with Tri-Color Quinoa & Steamed Asparagus',
      confidence: 96,
      portionEstimated: '1 bowl (~380g total)',
      calories: 520,
      proteinGrams: 46,
      carbsGrams: 38,
      fatGrams: 20,
      fiberGrams: 7,
      micronutrients: [
        { name: 'Vitamin D3', amount: '840 IU', clinicalBenefit: 'Synergizes with active repletion protocol' },
        { name: 'Omega-3 EPA/DHA', amount: '2,100 mg', clinicalBenefit: 'Cardiovascular & endothelial support' },
        { name: 'Potassium', amount: '680 mg', clinicalBenefit: 'Electrolyte & blood pressure homeostasis' },
      ],
      dietaryFitNotes: 'High-protein, Mediterranean compliant, zero lactose. Superior bioavailability for fat-soluble vitamins.',
    },
  },
  {
    title: 'Avocado Toast with Poached Eggs',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    data: {
      dishName: 'Artisan Sourdough Toast with Hass Avocado & Pasture-Raised Poached Eggs',
      confidence: 94,
      portionEstimated: '2 slices with toppings',
      calories: 460,
      proteinGrams: 22,
      carbsGrams: 36,
      fatGrams: 26,
      fiberGrams: 9,
      micronutrients: [
        { name: 'Choline', amount: '280 mg', clinicalBenefit: 'Cognitive & lipid transport support' },
        { name: 'Monounsaturated Fats', amount: '16g', clinicalBenefit: 'Optimizes LDL/HDL lipid fraction' },
        { name: 'Lutein & Zeaxanthin', amount: '420 mcg', clinicalBenefit: 'Retinal protection' },
      ],
      dietaryFitNotes: 'Excellent morning meal to take alongside Sunday Ergocalciferol dose for optimal lipid transport.',
    },
  },
  {
    title: 'Lactose-Free Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    data: {
      dishName: 'Strained Lactose-Free Greek Yogurt with Organic Berries, Chia Seeds & Walnuts',
      confidence: 98,
      portionEstimated: '1 large parfait glass (~260g)',
      calories: 340,
      proteinGrams: 28,
      carbsGrams: 32,
      fatGrams: 12,
      fiberGrams: 6,
      micronutrients: [
        { name: 'Calcium', amount: '350 mg', clinicalBenefit: 'Essential for bone mineralization' },
        { name: 'Probiotics', amount: '10 Billion CFU', clinicalBenefit: 'Microbiome gut barrier integrity' },
      ],
      dietaryFitNotes: '100% lactose-free dairy alternative. High leucine-to-protein ratio for muscle protein synthesis.',
    },
  },
];

export const ScanFoodModal: React.FC = () => {
  const { isScanFoodModalOpen, setIsScanFoodModalOpen, logMeal } = useHealth();

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<ScannedFoodAnalysis | null>(
    SAMPLE_PRESETS[0].data
  );
  const [targetMealType, setTargetMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isLogged, setIsLogged] = useState(false);

  if (!isScanFoodModalOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setCustomFileUrl(null);
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setScannedResult(SAMPLE_PRESETS[idx].data);
      setIsScanning(false);
    }, 700);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomFileUrl(url);
      setIsScanning(true);
      setScannedResult(null);

      // AI Simulated extraction for uploaded photo
      setTimeout(() => {
        setScannedResult({
          dishName: `Custom Dish: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`,
          confidence: 92,
          portionEstimated: 'Standard meal plate (~350g)',
          calories: 480,
          proteinGrams: 34,
          carbsGrams: 42,
          fatGrams: 18,
          fiberGrams: 6,
          micronutrients: [
            { name: 'Dietary Minerals', amount: 'Multi-spectrum', clinicalBenefit: 'Cellular electrolyte balance' },
            { name: 'Vitamin Bioavailability', amount: 'Adequate', clinicalBenefit: 'Lipid-soluble micronutrient transport' },
          ],
          dietaryFitNotes: 'Estimated from visual photo composition. Adjust portions as desired before logging.',
        });
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleConfirmLog = () => {
    if (!scannedResult) return;

    logMeal({
      mealType: targetMealType,
      name: scannedResult.dishName,
      portion: scannedResult.portionEstimated,
      calories: scannedResult.calories,
      protein: scannedResult.proteinGrams,
      carbs: scannedResult.carbsGrams,
      fat: scannedResult.fatGrams,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setIsLogged(true);
    setTimeout(() => {
      setIsLogged(false);
      setIsScanFoodModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cal AI Food Photo Intelligence
              </h2>
              <p className="text-xs text-slate-500">
                Visual computer vision scanner: detect dishes, calculate macros, and extract micronutrients
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScanFoodModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close food scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isLogged ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-teal-600 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Meal Scanned & Logged!</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Updated your daily calorie budget, macronutrient bars, and micronutrient tracking.
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Quick Demo Presets Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Sample Food Photo or Upload Your Own
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {SAMPLE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-2 rounded-xl border text-left transition-all flex flex-col items-center gap-1.5 ${
                      selectedPresetIndex === idx && !customFileUrl
                        ? 'border-teal-700 bg-teal-50/60 ring-2 ring-teal-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1 text-center">
                      {p.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Upload Custom File Input */}
              <div className="mt-2.5">
                <label className="cursor-pointer flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-slate-200 rounded-xl hover:border-teal-500 transition-colors bg-slate-50/50 text-xs font-semibold text-teal-800">
                  <Upload className="w-4 h-4 text-teal-700" />
                  <span>{customFileUrl ? 'Uploaded Custom Photo (Ready)' : 'Upload Food Photo from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Visual Scanner Stage */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col items-center justify-center min-h-[180px]">
              <img
                src={customFileUrl || SAMPLE_PRESETS[selectedPresetIndex].image}
                alt="Scanning meal"
                className="w-full h-48 object-cover opacity-80"
              />

              {isScanning && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <Sparkles className="w-8 h-8 text-teal-400 animate-spin" />
                  <span className="text-xs font-bold font-mono tracking-wider">
                    SCANNING INGREDIENTS & MACROS...
                  </span>
                </div>
              )}

              {scannedResult && !isScanning && (
                <div className="absolute top-2 right-2 bg-teal-900/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border border-teal-500/50 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{scannedResult.confidence}% Confidence</span>
                </div>
              )}
            </div>

            {/* Extracted AI Results */}
            {scannedResult && !isScanning && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                        Identified Dish
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{scannedResult.dishName}</h4>
                      <span className="text-xs text-slate-500 font-mono">
                        Portion: {scannedResult.portionEstimated}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        {scannedResult.calories}{' '}
                        <span className="text-xs font-normal text-slate-500">kcal</span>
                      </span>
                    </div>
                  </div>

                  {/* 3 Macro Cards */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">PROTEIN</span>
                      <span className="font-mono font-bold text-teal-800 text-xs">{scannedResult.proteinGrams}g</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">CARBS</span>
                      <span className="font-mono font-bold text-amber-800 text-xs">{scannedResult.carbsGrams}g</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">FATS</span>
                      <span className="font-mono font-bold text-rose-800 text-xs">{scannedResult.fatGrams}g</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">FIBER</span>
                      <span className="font-mono font-bold text-emerald-800 text-xs">{scannedResult.fiberGrams}g</span>
                    </div>
                  </div>
                </div>

                {/* Micronutrient synergy for clinical health profile */}
                <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Zap className="w-3.5 h-3.5 text-teal-700" />
                    <span>Clinical Profile & Micronutrient Synergy</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {scannedResult.micronutrients.map((m, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-teal-100">
                        <div className="font-semibold text-slate-900 flex justify-between">
                          <span>{m.name}</span>
                          <span className="font-mono text-teal-800 font-bold">{m.amount}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{m.clinicalBenefit}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-600 italic pt-1">
                    "{scannedResult.dietaryFitNotes}"
                  </p>
                </div>

                {/* Target Meal Type Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-slate-700">Assign to Meal:</span>
                  <div className="flex items-center gap-1">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTargetMealType(t)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded capitalize transition-colors ${
                          targetMealType === t
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        {!isLogged && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-mono">
              Cal AI Vision Engine v2
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsScanFoodModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLog}
                disabled={!scannedResult || isScanning}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Scanned Meal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
