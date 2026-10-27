/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ArrowRight,
  Stethoscope,
  Pill,
  Send,
  HelpCircle,
  ClipboardList,
  CheckSquare,
  Square,
  Building,
} from 'lucide-react';

export const AppointmentDetailPage: React.FC = () => {
  const {
    selectedAppointmentId,
    appointments,
    updateAppointment,
    togglePrepQuestion,
    addCustomPrepQuestion,
    savePostVisitSummary,
    healthRecords,
    setSelectedRecordId,
    setCurrentPage,
    journeys,
  } = useHealth();

  const appointment =
    appointments.find((a) => a.id === selectedAppointmentId) || appointments[0];

  const [activeSection, setActiveSection] = useState<'prep' | 'during' | 'after'>('prep');
  const [newQuestionText, setNewQuestionText] = useState('');

  // During-visit note state
  const [duringNotes, setDuringNotes] = useState(appointment?.visitNotes || '');
  const [newInVisitQuestion, setNewInVisitQuestion] = useState('');

  // After-visit form fields
  const [findings, setFindings] = useState(
    'Therapeutic 25-OH Vitamin D level rose to 18 ng/mL (+4 ng/mL). Epiphyseal wrist plates verified closed with stable adult bone structure.'
  );
  const [assessment, setAssessment] = useState(
    'Subclinical fatigue improved. Patient is responding well to high-dose repletion without hypercalcemia.'
  );
  const [testsOrdered, setTestsOrdered] = useState(
    'Repeat 25-OH Vitamin D and Comprehensive Metabolic Panel in 8 weeks (late December 2026).'
  );
  const [medChanges, setMedChanges] = useState(
    'Complete final 2 weekly doses of 50,000 IU Ergocalciferol, then transition to Cholecalciferol (Vitamin D3) 2,000 IU daily with breakfast.'
  );
  const [followUpInstructions, setFollowUpInstructions] = useState(
    'Maintain daily morning resistance exercises. Follow up in clinic in 3 months.'
  );
  const [nextApptDate, setNextApptDate] = useState('2027-02-10');

  // AI Summary generation state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<any | null>(null);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  if (!appointment) return null;

  const associatedJourney = journeys.find((j) => j.id === appointment.journeyId);

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    addCustomPrepQuestion(appointment.id, newQuestionText);
    setNewQuestionText('');
  };

  const handleSaveNotes = () => {
    updateAppointment(appointment.id, { visitNotes: duringNotes });
  };

  const handleAddInVisitQuestion = () => {
    if (!newInVisitQuestion.trim()) return;
    const updated = [...(appointment.inVisitQuestions || []), newInVisitQuestion.trim()];
    updateAppointment(appointment.id, { inVisitQuestions: updated });
    setNewInVisitQuestion('');
  };

  const handleGenerateAISummary = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      // Synthesize directly from the entered notes & inputs
      const summaryObj = {
        discussed: `Discussion centered on 25-OH Vitamin D trajectory (current 18 ng/mL) and radiological verification of closed growth plates from the August hand radiograph. ${duringNotes ? `Additional patient visit notes: "${duringNotes}".` : ''}`,
        conclusion: assessment,
        recommendedActions: [
          followUpInstructions,
          'Maintain balanced Mediterranean nutrition with healthy fats to optimize fat-soluble vitamin absorption.',
          'Continue morning resistance training for bone mineral remodeling.',
        ],
        medicationInstructions: [
          medChanges || 'No changes to ongoing medication regimen.',
        ],
        testsOrFollowUps: [
          testsOrdered || 'Routine follow-up as directed.',
          `Next clinical visit scheduled for ${nextApptDate}.`,
        ],
        unansweredQuestions: appointment.inVisitQuestions || [],
        savedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setGeneratedSummary(summaryObj);
      setIsSummarizing(false);
    }, 1000);
  };

  const handleSaveFinalSummary = () => {
    if (!generatedSummary) return;
    savePostVisitSummary(appointment.id, generatedSummary);
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
      setCurrentPage('records');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('calendar')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Back to schedule"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-teal-800 uppercase tracking-wider text-[10px]">
                {appointment.specialty}
              </span>
              <span>·</span>
              <span className="font-mono text-slate-700">{appointment.date}</span>
              <span>·</span>
              <span className="text-teal-700 font-semibold capitalize">{appointment.status}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {appointment.doctorName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newStatus = appointment.status === 'scheduled' ? 'completed' : 'scheduled';
              updateAppointment(appointment.id, { status: newStatus });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
              appointment.status === 'completed'
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{appointment.status === 'completed' ? 'Completed Visit' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Appointment Location & Clinician Metadata Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Specialty & Practice</span>
          <span className="font-bold text-slate-900">{appointment.specialty}</span>
          <span className="text-slate-500 block">{appointment.clinicName}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Date & Time</span>
          <span className="font-mono font-bold text-slate-900">{appointment.date}</span>
          <span className="text-slate-500 block font-mono">{appointment.time}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Clinical Facility Location</span>
          <span className="text-slate-800 leading-snug">{appointment.location}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Associated Journey</span>
          <span className="font-semibold text-teal-800">
            {associatedJourney?.title || 'Deficiency Repletion'}
          </span>
        </div>
      </div>

      {/* Appointment Phase Switcher Tabs: Before, During, After */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSection('prep')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeSection === 'prep'
              ? 'border-teal-700 text-teal-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>1. Prepare for Your Appointment</span>
        </button>
        <button
          onClick={() => setActiveSection('during')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeSection === 'during'
              ? 'border-teal-700 text-teal-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>2. During the Appointment (Visit Notes)</span>
        </button>
        <button
          onClick={() => setActiveSection('after')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeSection === 'after'
              ? 'border-teal-700 text-teal-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. What Happened & AI Summary</span>
        </button>
      </div>

      {/* Section 1: Before the Appointment */}
      {activeSection === 'prep' && (
        <div className="space-y-6">
          {/* AI-Generated & Custom Questions Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  <span>Questions to Ask Dr. Vance</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Grounded in your recent laboratory reports, hand X-ray, and weekly medication logs.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {appointment.prepQuestions.filter((q) => q.checked).length} of{' '}
                {appointment.prepQuestions.length} reviewed
              </span>
            </div>

            <div className="space-y-2.5">
              {appointment.prepQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => togglePrepQuestion(appointment.id, q.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    q.checked
                      ? 'bg-teal-50/40 border-teal-200 text-slate-800'
                      : 'bg-slate-50/60 border-slate-200 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <button className="mt-0.5 text-teal-700">
                    {q.checked ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 text-xs leading-relaxed font-medium">
                    <span className={q.checked ? 'line-through text-slate-500' : ''}>
                      {q.text}
                    </span>
                    {q.isCustom && (
                      <span className="ml-2 text-[10px] uppercase font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Question Form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                placeholder="Type your own question for Dr. Vance..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-slate-900"
              />
              <button
                onClick={handleAddQuestion}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shrink-0"
              >
                Add Question
              </button>
            </div>
          </div>

          {/* 3-Column Split: Medical Findings, Documents to Bring, and Logged Symptoms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Relevant Recent Findings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>Recent Diagnostic Highlights</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-900">Vitamin D 25-OH: 18.0 ng/mL</div>
                  <div className="text-[11px] text-teal-700 font-mono">+4 ng/mL velocity since baseline nadir</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-900">Hand & Wrist X-Ray</div>
                  <div className="text-[11px] text-slate-600">Physeal growth plates closed & fused</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-900">Thyroid Panel TSH: 2.15 mIU/L</div>
                  <div className="text-[11px] text-slate-600">Euthyroid with normal lipid ratio</div>
                </div>
              </div>
            </div>

            {/* Documents Ready to Present */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Documents to Present</span>
              </h4>
              <div className="space-y-2 text-xs">
                {appointment.prepDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedRecordId(doc.recordId)}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-teal-500 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate pr-2">{doc.title}</span>
                    <span className="text-[10px] text-teal-700 font-bold shrink-0">Open →</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recorded Symptoms & History */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Patient Logged Observations</span>
              </h4>
              <div className="space-y-2 text-xs">
                {appointment.prepSymptoms.map((symp) => (
                  <div key={symp.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-800 leading-snug">{symp.text}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">Logged {symp.loggedDate}</span>
                  </div>
                ))}
                <div className="p-2.5 bg-teal-50/60 rounded-lg border border-teal-100 text-teal-900">
                  <span className="font-semibold block mb-0.5">Active Prescription</span>
                  <span>Ergocalciferol 50,000 IU oral (Sunday mornings)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: During the Appointment */}
      {activeSection === 'during' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Visit Notes & Clinician Instructions</h3>
                <p className="text-xs text-slate-500">Record recommendations, doctor advice, and clinical directives in real time</p>
              </div>
              <button
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Save Notes
              </button>
            </div>

            <textarea
              rows={6}
              value={duringNotes}
              onChange={(e) => setDuringNotes(e.target.value)}
              placeholder="Record Dr. Vance's clinical findings, physical exam notes, dietary recommendations, or prescription adjustments..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 text-slate-900 leading-relaxed"
            />

            {/* Questions that arose during visit */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Questions That Came Up During Visit
              </h4>
              <div className="space-y-2">
                {(appointment.inVisitQuestions || []).map((q, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-800">
                    {idx + 1}. {q}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newInVisitQuestion}
                  onChange={(e) => setNewInVisitQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInVisitQuestion()}
                  placeholder="Record additional point discussed..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-900"
                />
                <button
                  onClick={handleAddInVisitQuestion}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: After the Appointment (What Happened & AI Summary) */}
      {activeSection === 'after' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">What Happened at Your Appointment?</h3>
              <p className="text-xs text-slate-500">
                Structure the encounter findings. MediCall AI will transform this into an organized clinical encounter note.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Main Findings & Lab Review
                </label>
                <textarea
                  rows={2}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Clinician's Clinical Assessment
                </label>
                <textarea
                  rows={2}
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Tests Ordered / Next Lab Draws
                  </label>
                  <input
                    type="text"
                    value={testsOrdered}
                    onChange={(e) => setTestsOrdered(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Prescriptions / Medication Changes
                  </label>
                  <input
                    type="text"
                    value={medChanges}
                    onChange={(e) => setMedChanges(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Follow-Up Instructions
                  </label>
                  <input
                    type="text"
                    value={followUpInstructions}
                    onChange={(e) => setFollowUpInstructions(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Next Appointment Date
                  </label>
                  <input
                    type="date"
                    value={nextApptDate}
                    onChange={(e) => setNextApptDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleGenerateAISummary}
                  disabled={isSummarizing}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSummarizing ? 'Synthesizing Encounter...' : 'Summarize Appointment with AI'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Generated Clinical Summary Section */}
          {generatedSummary && (
            <div className="bg-teal-50/50 rounded-xl border border-teal-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <h3 className="text-base font-bold text-slate-900">
                    MediCall AI Structured Consultation Summary
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-teal-800">
                  {generatedSummary.savedAt}
                </span>
              </div>

              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-3.5 bg-white rounded-lg border border-teal-100">
                  <h4 className="font-bold text-slate-900 mb-1">1. What Was Discussed</h4>
                  <p className="leading-relaxed text-slate-700">{generatedSummary.discussed}</p>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-teal-100">
                  <h4 className="font-bold text-slate-900 mb-1">2. Clinician Assessment & Conclusion</h4>
                  <p className="leading-relaxed text-slate-700">{generatedSummary.conclusion}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white rounded-lg border border-teal-100 space-y-1.5">
                    <h4 className="font-bold text-slate-900">3. Recommended Clinical Actions</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {generatedSummary.recommendedActions.map((act: string, idx: number) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-teal-100 space-y-1.5">
                    <h4 className="font-bold text-slate-900">4. Medication Instructions Recorded</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {generatedSummary.medicationInstructions.map((inst: string, idx: number) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-teal-100 space-y-1.5">
                  <h4 className="font-bold text-slate-900">5. Required Tests & Follow-Up Schedule</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {generatedSummary.testsOrFollowUps.map((t: string, idx: number) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-teal-200/60">
                  <span className="text-[11px] text-slate-500">
                    Saving will attach this clinical report to your Health Records and Journey timeline.
                  </span>
                  <button
                    onClick={handleSaveFinalSummary}
                    disabled={isSavedSuccessfully}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavedSuccessfully ? 'Saved to Records!' : 'Save Summary to Timeline'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
