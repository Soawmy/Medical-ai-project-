/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Activity,
  ArrowRight,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Plus,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Utensils,
  Weight,
} from 'lucide-react';
import { calculateCalorieProgress, calculateMacroPercentages } from '../../utils/healthCalculations';

export const OverviewPage: React.FC = () => {
  const {
    userProfile,
    journeys,
    appointments,
    nutrition,
    healthRecords,
    setCurrentPage,
    setSelectedJourneyId,
    setSelectedRecordId,
    setSelectedAppointmentId,
    setIsAddRecordModalOpen,
    setIsLogFoodModalOpen,
    setIsScanFoodModalOpen,
    setIsRecordMeasurementModalOpen,
    setIsScheduleApptModalOpen,
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

  const upcomingAppts = appointments.filter((a) => a.status === 'scheduled').slice(0, 2);

  // Recent activity stream
  const RECENT_ACTIVITIES = [
    {
      id: 'act-1',
      title: 'Vitamin D 25-OH Lab Results Added',
      desc: 'Quest Diagnostics report recorded at 18.0 ng/mL (+4 ng/mL velocity).',
      date: 'Sep 18, 2026',
      icon: FileText,
      iconColor: 'text-teal-700 bg-teal-50',
      action: () => {
        setSelectedRecordId('rec-vitd-sep26');
      },
    },
    {
      id: 'act-2',
      title: 'Weight Measurement Logged',
      desc: 'Current weight 68.0 kg recorded under standardized morning conditions.',
      date: 'Oct 20, 2026',
      icon: Scale,
      iconColor: 'text-emerald-700 bg-emerald-50',
      action: () => setCurrentPage('journeys'),
    },
    {
      id: 'act-3',
      title: 'Hand & Wrist Radiograph Analyzed',
      desc: 'Epiphyseal growth plate fusion verified by Dr. Sterling.',
      date: 'Aug 12, 2026',
      icon: Activity,
      iconColor: 'text-sky-700 bg-sky-50',
      action: () => {
        setSelectedRecordId('rec-radiology-xray');
      },
    },
    {
      id: 'act-4',
      title: 'Endocrine Consultation Scheduled',
      desc: 'Dr. Evelyn Vance at Summit Endocrine & Metabolic Associates.',
      date: 'Nov 04, 2026',
      icon: Calendar,
      iconColor: 'text-amber-700 bg-amber-50',
      action: () => {
        setSelectedAppointmentId('appt-vance-nov26');
        setCurrentPage('appointment_detail');
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
            <span>Tuesday, October 27, 2026</span>
            <span>·</span>
            <span className="text-slate-500 font-normal">Active Patient Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {userProfile.fullName.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Your Vitamin D repletion is trending upward, and your appointment with Dr. Vance is in 8 days.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsScanFoodModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-teal-200" />
            <span>Scan Meal (Cal AI)</span>
          </button>
          <button
            onClick={() => setIsAddRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>Add Record</span>
          </button>
          <button
            onClick={() => setIsLogFoodModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Log Food</span>
          </button>
          <button
            onClick={() => setIsRecordMeasurementModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Record Vitals</span>
          </button>
          <button
            onClick={() => setIsScheduleApptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setCurrentPage('assistant')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Section A: Health Overview Compact Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Weight</span>
            <Weight className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {userProfile.currentWeightKg}{' '}
              <span className="text-sm font-sans font-medium text-slate-500">kg</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-0.5 mt-1">
              <TrendingDown className="w-3 h-3" />
              <span>-3.2 kg from start</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Latest Height</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {userProfile.heightCm}{' '}
              <span className="text-sm font-sans font-medium text-slate-500">cm</span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">
              Physes fused (Adult fixed)
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Fuel</span>
            <Utensils className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {nutrition.caloriesConsumed}{' '}
              <span className="text-sm font-sans font-medium text-slate-500">/ {nutrition.calorieTarget}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${calorieProg.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Journeys</span>
            <Compass className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {journeys.filter((j) => j.status === 'active').length}
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">
              All on therapeutic track
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Appts</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {upcomingAppts.length}
            </div>
            <div className="text-[11px] text-sky-700 font-medium mt-1">
              Next: Nov 4 (Dr. Vance)
            </div>
          </div>
        </div>
      </div>

      {/* Section F: AI Insights Panel */}
      <div className="bg-gradient-to-r from-teal-50 via-teal-50/40 to-white rounded-xl border border-teal-200/90 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Your AI Health Insights</h3>
                <span className="text-[10px] font-semibold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                  Clinical Synthesis
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed max-w-3xl">
                Your latest laboratory report contains a result outside its listed reference range:{' '}
                <strong>Vitamin D, 25-Hydroxy is 18.0 ng/mL</strong> (reference: 30.0–100.0 ng/mL).
                While this reflects positive therapeutic repletion from your 14.0 ng/mL baseline, review the
                result and discuss duration of high-dose supplementation with Dr. Vance at your upcoming visit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedRecordId('rec-vitd-sep26');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
            >
              <span>Review Lab Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Living Health Story Chronicle */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Continuous Health Story
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                Living Chronicle
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Clinical Trajectory & Milestone Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Longitudinal synthesis of your lab records, imaging reports, nutrition, and specialist care
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setCurrentPage('records')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors inline-flex items-center gap-1"
            >
              <span>Explore Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Milestone Steps / Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Milestone 1 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>MAR 2026</span>
                <span className="text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-bold text-[10px]">Nadir</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">Severe Deficiency Detected</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Serum 25-OH Vit D dropped to 14.0 ng/mL with chronic fatigue and lethargy.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRecordId('rec-vitd-sep26');
              }}
              className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 self-start"
            >
              <span>View baseline lab</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Milestone 2 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>AUG 2026</span>
                <span className="text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded font-bold text-[10px]">Stature</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">Epiphyseal Growth Fused</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Wrist radiograph verified complete physeal closure. 178 cm adult stature finalized.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRecordId('rec-radiology-xray');
              }}
              className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 self-start"
            >
              <span>View X-ray image</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Milestone 3 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>SEP 2026</span>
                <span className="text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded font-bold text-[10px]">Therapy</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">50k IU Repletion Protocol</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Ergocalciferol 50,000 IU weekly pulse launched with dietary lipid co-factors.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedRecordId('rec-rx-ergocalciferol');
              }}
              className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 self-start"
            >
              <span>View prescription</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Milestone 4 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-teal-300 transition-colors border-teal-200 bg-teal-50/30">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-teal-700 mb-1.5">
                <span>OCT 2026</span>
                <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold text-[10px]">+28.5%</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">Biomarker Velocity Rebound</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Level reached 18.0 ng/mL; daily caloric deficit controlled at 400 kcal via Cal AI food logging.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('nutrition')}
              className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 self-start"
            >
              <span>Track fuel & deficit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Milestone 5 */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-teal-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                <span>NOV 2026</span>
                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold text-[10px]">Upcoming</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">Endocrine Strategy Review</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Consult with Dr. Evelyn Vance to transition to 2,000 IU maintenance or continue repletion.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedAppointmentId('appt-vance-nov26');
                setCurrentPage('appointment_detail');
              }}
              className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 self-start"
            >
              <span>Prepare checklist</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Active Health Journeys + Nutrition & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Health Journeys */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Health Journeys</h3>
              <p className="text-xs text-slate-500">Longitudinal therapeutic management and personal wellness targets</p>
            </div>
            <button
              onClick={() => setCurrentPage('journeys')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journeys.map((journey) => {
              const progressPct = Math.min(
                100,
                Math.round(
                  (Math.abs(journey.currentValue - journey.startValue) /
                    Math.abs(journey.targetValue - journey.startValue || 1)) *
                    100
                )
              );

              return (
                <div
                  key={journey.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                        {journey.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Since {journey.startDate}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {journey.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {journey.description}
                    </p>

                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">{journey.targetMetricName}:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {journey.currentValue} {journey.metricUnit}
                          <span className="text-slate-400 font-normal"> / target {journey.targetValue}</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-600 h-1.5 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {journey.upcomingTasks.length} task{journey.upcomingTasks.length === 1 ? '' : 's'} scheduled
                    </span>
                    <button
                      onClick={() => {
                        setSelectedJourneyId(journey.id);
                        setCurrentPage('journeys');
                      }}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                    >
                      <span>Open Journey</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Health Activity Stream */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Health Activity</h3>
                <p className="text-xs text-slate-500">Chronological feed of medical documents, clinical notes, and vitals</p>
              </div>
              <button
                onClick={() => setCurrentPage('records')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                All Records
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {RECENT_ACTIVITIES.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    onClick={act.action}
                    className="py-3 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{act.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{act.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Nutrition Summary + Upcoming Appointments */}
        <div className="space-y-6">
          {/* Nutrition Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daily Nutrition</h3>
                <span className="text-xs text-slate-500">Caloric and macronutrient breakdown</span>
              </div>
              <button
                onClick={() => setCurrentPage('nutrition')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                <span>Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Consumed vs Target</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {nutrition.caloriesConsumed}{' '}
                  <span className="text-xs font-normal text-slate-500">/ {nutrition.calorieTarget} kcal</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Remaining</span>
                <span className="text-sm font-bold text-teal-700 font-mono">
                  {calorieProg.remaining} kcal
                </span>
              </div>
            </div>

            {/* Macros Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Protein: {nutrition.proteinGrams}g ({macroPct.proteinPct}%)</span>
                <span className="text-slate-500 font-mono">Goal: {nutrition.proteinTarget}g</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (nutrition.proteinGrams / nutrition.proteinTarget) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-slate-700">Carbs: {nutrition.carbsGrams}g ({macroPct.carbsPct}%)</span>
                <span className="text-slate-500 font-mono">Goal: {nutrition.carbsTarget}g</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (nutrition.carbsGrams / nutrition.carbsTarget) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-semibold text-slate-700">Fats: {nutrition.fatGrams}g ({macroPct.fatPct}%)</span>
                <span className="text-slate-500 font-mono">Goal: {nutrition.fatTarget}g</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (nutrition.fatGrams / nutrition.fatTarget) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsLogFoodModalOpen(true)}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal or Snack</span>
            </button>
          </div>

          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Consultations</h3>
                <span className="text-xs text-slate-500">Clinician visits & diagnostic appointments</span>
              </div>
              <button
                onClick={() => setCurrentPage('calendar')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                <span>Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingAppts.map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => {
                    setSelectedAppointmentId(appt.id);
                    setCurrentPage('appointment_detail');
                  }}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-500/80 bg-slate-50/50 hover:bg-teal-50/20 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{appt.doctorName}</span>
                    <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-800 font-medium">{appt.specialty}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {appt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {appt.time}
                    </span>
                  </div>
                  <div className="pt-2 text-[11px] text-teal-700 font-semibold inline-flex items-center gap-1">
                    <span>Prepare questions & documents</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
