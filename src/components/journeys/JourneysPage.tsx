/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { HealthJourney } from '../../types/health';
import {
  Compass,
  Plus,
  ArrowRight,
  Calendar,
  FileText,
  Pill,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Activity,
  AlertTriangle,
  X,
} from 'lucide-react';

export const JourneysPage: React.FC = () => {
  const {
    journeys,
    selectedJourneyId,
    setSelectedJourneyId,
    healthRecords,
    setSelectedRecordId,
    appointments,
    setSelectedAppointmentId,
    setCurrentPage,
    addJourney,
    updateJourney,
    archiveJourney,
    deleteJourney,
  } = useHealth();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('active');
  const [detailTab, setDetailTab] = useState<
    'overview' | 'records' | 'medications' | 'progress' | 'insights' | 'appointments'
  >('overview');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HealthJourney['category']>('growth');
  const [newDesc, setNewDesc] = useState('');
  const [newMetricName, setNewMetricName] = useState('Target Value');
  const [newStartVal, setNewStartVal] = useState<number>(0);
  const [newTargetVal, setNewTargetVal] = useState<number>(100);
  const [newUnit, setNewUnit] = useState('units');

  const filteredJourneys = journeys.filter((j) => {
    if (filterStatus === 'all') return true;
    return j.status === filterStatus;
  });

  const activeJourney = journeys.find((j) => j.id === selectedJourneyId);

  const handleCreateJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addJourney({
      title: newTitle.trim(),
      category: newCategory,
      status: 'active',
      description: newDesc.trim() || 'Active health tracking journey.',
      startDate: '2026-10-27',
      targetMetricName: newMetricName.trim(),
      startValue: Number(newStartVal),
      currentValue: Number(newStartVal),
      targetValue: Number(newTargetVal),
      metricUnit: newUnit.trim(),
      relatedRecordIds: [],
      relatedMedications: [],
      upcomingTasks: [
        {
          id: `task-${Date.now()}`,
          title: 'Initial baseline evaluation',
          dueDate: '2026-11-05',
          completed: false,
          priority: 'medium',
        },
      ],
      milestones: [
        {
          id: `ms-${Date.now()}`,
          title: 'Journey initialized',
          date: '2026-10-27',
          completed: true,
        },
      ],
      historyPoints: [{ date: '2026-10', value: Number(newStartVal) }],
      aiClinicalInsights: {
        summary: `Baseline initialized for ${newTitle}. Monitoring trajectory toward ${newTargetVal} ${newUnit}.`,
        recommendedQuestions: ['Discuss appropriate evaluation intervals with clinician.'],
        missingDataSuggestions: ['Log first standardized diagnostic observation.'],
        scientificContext: 'Consistent tracking of longitudinal biomarkers improves clinical correlation.',
      },
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // If a journey is selected, render the Individual Journey Detail view
  if (activeJourney) {
    const relatedRecords = healthRecords.filter(
      (r) => activeJourney.relatedRecordIds.includes(r.id) || r.journeyId === activeJourney.id
    );

    const relatedAppts = appointments.filter((a) => a.journeyId === activeJourney.id);

    const progressPct = Math.min(
      100,
      Math.round(
        (Math.abs(activeJourney.currentValue - activeJourney.startValue) /
          Math.abs(activeJourney.targetValue - activeJourney.startValue || 1)) *
          100
      )
    );

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedJourneyId(null)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Back to all journeys"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                  {activeJourney.category}
                </span>
                <span>·</span>
                <span>Started {activeJourney.startDate}</span>
                <span>·</span>
                <span className="text-teal-700 font-semibold capitalize">Status: {activeJourney.status}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeJourney.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => archiveJourney(activeJourney.id)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => deleteJourney(activeJourney.id)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none pb-0 text-xs font-bold">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'records', label: `Medical Records (${relatedRecords.length})` },
              { id: 'medications', label: `Medications & Treatment (${activeJourney.relatedMedications.length})` },
              { id: 'progress', label: 'Progress & Charts' },
              { id: 'insights', label: 'AI Clinical Insights' },
              { id: 'appointments', label: `Appointments (${relatedAppts.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id)}
              className={`py-3 px-3.5 whitespace-nowrap border-b-2 transition-colors ${
                detailTab === tab.id
                  ? 'border-teal-700 text-teal-900 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {detailTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Clinical Journey Summary</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                {activeJourney.description}
              </p>

              {/* Metric Progress Bar */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {activeJourney.targetMetricName}: Current {activeJourney.currentValue} {activeJourney.metricUnit}
                  </span>
                  <span className="font-mono text-slate-500">
                    Goal: {activeJourney.targetValue} {activeJourney.metricUnit} ({progressPct}% fulfilled)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestones & Upcoming Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Milestones */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Journey Milestones</h4>
                <div className="space-y-2.5">
                  {activeJourney.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          m.completed ? 'text-teal-600' : 'text-slate-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>{m.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{m.date}</span>
                        </div>
                        {m.notes && <p className="text-[11px] text-slate-500 mt-0.5">{m.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Upcoming Health Actions</h4>
                <div className="space-y-2.5">
                  {activeJourney.upcomingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60"
                    >
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>{t.title}</span>
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono">
                            Due {t.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Medical Records */}
        {detailTab === 'records' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Related Diagnostic Records & Reports</h3>
            </div>
            {relatedRecords.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No specific documents directly tagged to this journey yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedRecords.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                        {r.category}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{r.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                    <p className="text-xs text-slate-500">{r.clinician} · {r.facility}</p>
                    <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1">
                      <span>View Structured Document & AI Findings</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Medications & Treatment */}
        {detailTab === 'medications' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Regimen & Prescription Adherence</h3>
            {activeJourney.relatedMedications.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No pharmaceutical medications currently associated with this journey. Regimen is lifestyle & nutritional.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeJourney.relatedMedications.map((med) => (
                  <div
                    key={med.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded">
                        Active Prescription
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        {med.adherenceRate}% Adherence
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{med.name}</h4>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Dosage: <strong className="text-slate-800">{med.dosage}</strong></div>
                      <div>Frequency: <strong className="text-slate-800">{med.frequency}</strong></div>
                      {med.sideEffects && (
                        <div>Side Effects: <strong className="text-slate-800">{med.sideEffects}</strong></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Progress & Charts */}
        {detailTab === 'progress' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Longitudinal Progress</h3>
              <p className="text-xs text-slate-500">
                Historical records for {activeJourney.targetMetricName} ({activeJourney.metricUnit})
              </p>
            </div>

            {/* Visual Bar / Point Trend */}
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="h-44 flex items-end justify-between gap-2 pt-6">
                {activeJourney.historyPoints.map((pt, idx) => {
                  const maxVal = Math.max(...activeJourney.historyPoints.map((p) => p.value), activeJourney.targetValue);
                  const minVal = Math.min(...activeJourney.historyPoints.map((p) => p.value), activeJourney.startValue);
                  const range = maxVal - minVal || 1;
                  const heightPct = Math.max(15, Math.min(100, ((pt.value - minVal) / range) * 85 + 15));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-800 tabular-nums">
                        {pt.value}
                      </span>
                      <div className="w-full max-w-[40px] bg-teal-700 rounded-t-md transition-all duration-300" style={{ height: `${heightPct}%` }} />
                      <span className="text-[10px] text-slate-400 font-mono">{pt.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Baseline Value</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{activeJourney.startValue} {activeJourney.metricUnit}</span>
              </div>
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                <span className="text-teal-800 block">Current Level</span>
                <span className="font-mono font-bold text-teal-900 text-sm">{activeJourney.currentValue} {activeJourney.metricUnit}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Target Milestone</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{activeJourney.targetValue} {activeJourney.metricUnit}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AI Clinical Insights */}
        {detailTab === 'insights' && (
          <div className="space-y-4">
            <div className="p-5 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">MediCall AI Longitudinal Clinical Assessment</h3>
              </div>
              <p className="leading-relaxed bg-white p-4 rounded-lg border border-teal-100">
                {activeJourney.aiClinicalInsights.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-teal-100 space-y-2">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                    Recommended Questions for Clinician
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1">
                    {activeJourney.aiClinicalInsights.recommendedQuestions.map((q, i) => (
                      <li key={i} className="leading-relaxed">{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-teal-100 space-y-2">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-600" />
                    Scientific Context
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {activeJourney.aiClinicalInsights.scientificContext}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Appointments */}
        {detailTab === 'appointments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Associated Medical Appointments</h3>
            {relatedAppts.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No appointments specifically linked to this journey.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedAppts.map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => {
                      setSelectedAppointmentId(appt.id);
                      setCurrentPage('appointment_detail');
                    }}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer shadow-2xs space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{appt.doctorName}</span>
                      <span className="text-[10px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded font-medium">
                        {appt.status}
                      </span>
                    </div>
                    <p className="text-xs text-teal-800 font-medium">{appt.specialty}</p>
                    <p className="text-xs text-slate-500">{appt.date} at {appt.time} · {appt.location}</p>
                    <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1">
                      <span>Open Pre-Appointment Checklist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Journeys List View
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Health Journeys
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Personalized health management across nutritional goals, deficiencies, and clinical plans.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Journey</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {(['active', 'completed', 'archived', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-2xs font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Journeys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJourneys.map((journey) => {
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
              onClick={() => setSelectedJourneyId(journey.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {journey.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Since {journey.startDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-900 transition-colors">
                  {journey.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {journey.description}
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
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

                <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                  <span>{journey.upcomingTasks.length} tasks scheduled</span>
                  <span>·</span>
                  <span>{journey.milestones.filter((m) => m.completed).length} milestones met</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {journey.relatedMedications.length > 0 ? 'Active medications tagged' : 'Lifestyle management'}
                </span>
                <span className="font-semibold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1">
                  <span>Open Full Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Journey Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Health Journey</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJourney} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Journey Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Iron & Ferritin Optimization, Posture Alignment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="growth">Growth & Height Tracking</option>
                    <option value="deficiency">Vitamin / Nutrient Deficiency</option>
                    <option value="nutrition">Weight & Body Composition</option>
                    <option value="sleep">Sleep & Circadian Rhythm</option>
                    <option value="chronic">Ongoing Health Concern</option>
                    <option value="wellness">General Preventive Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Metric Name
                  </label>
                  <input
                    type="text"
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                    placeholder="e.g. Ferritin, Sleep Hours, Weight"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Start Value
                  </label>
                  <input
                    type="number"
                    value={newStartVal}
                    onChange={(e) => setNewStartVal(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={newTargetVal}
                    onChange={(e) => setNewTargetVal(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="e.g. ng/mL, kg, hours"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Description & Plan
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Overview of health goals, physician recommendations, or regimen..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Create Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
