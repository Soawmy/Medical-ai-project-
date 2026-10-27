/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { X, CheckCircle2 } from 'lucide-react';

export const RecordMeasurementModal: React.FC = () => {
  const {
    isRecordMeasurementModalOpen,
    setIsRecordMeasurementModalOpen,
    userProfile,
    updateUserProfile,
    journeys,
    updateJourney,
  } = useHealth();

  const [weightKg, setWeightKg] = useState<number>(userProfile.currentWeightKg);
  const [heightCm, setHeightCm] = useState<number>(userProfile.heightCm);
  const [systolic, setSystolic] = useState<number>(118);
  const [diastolic, setDiastolic] = useState<number>(76);
  const [restingHeartRate, setRestingHeartRate] = useState<number>(64);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isRecordMeasurementModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update profile
    updateUserProfile({
      currentWeightKg: Number(weightKg) || userProfile.currentWeightKg,
      heightCm: Number(heightCm) || userProfile.heightCm,
    });

    // Update Weight journey if active
    const weightJourney = journeys.find((j) => j.id === 'journey-weight');
    if (weightJourney) {
      const todayShort = '2026-10';
      const updatedHistory = [...weightJourney.historyPoints, { date: todayShort, value: Number(weightKg) }];
      updateJourney('journey-weight', {
        currentValue: Number(weightKg),
        historyPoints: updatedHistory,
      });
    }

    // Update Height journey if active
    const heightJourney = journeys.find((j) => j.id === 'journey-growth');
    if (heightJourney) {
      updateJourney('journey-growth', {
        currentValue: Number(heightCm),
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsRecordMeasurementModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Record Measurement</h2>
            <p className="text-xs text-slate-500">Log vitals, body composition, and metrics</p>
          </div>
          <button
            onClick={() => setIsRecordMeasurementModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mb-2" />
            <h3 className="text-base font-semibold text-slate-900">Measurements Recorded</h3>
            <p className="text-xs text-slate-500 mt-1">Profile and health journeys updated seamlessly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Blood Pressure
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg text-center text-slate-900 tabular-nums"
                    placeholder="Sys"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full px-2 py-2 text-sm border border-slate-200 rounded-lg text-center text-slate-900 tabular-nums"
                    placeholder="Dia"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Context / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Standard morning measurement, post-workout, fasting"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRecordMeasurementModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
              >
                Save Measurement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
