/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { X, CheckCircle2 } from 'lucide-react';
import { DoctorAppointment, CalendarEvent } from '../../types/health';

export const ScheduleAppointmentModal: React.FC = () => {
  const {
    isScheduleApptModalOpen,
    setIsScheduleApptModalOpen,
    journeys,
    addCalendarEvent,
    userProfile,
  } = useHealth();

  const [doctorName, setDoctorName] = useState('Dr. Evelyn Vance, MD');
  const [specialty, setSpecialty] = useState('Endocrinology & Metabolic Health');
  const [clinicName, setClinicName] = useState('Summit Endocrine & Metabolic Associates');
  const [date, setDate] = useState('2026-11-18');
  const [time, setTime] = useState('11:00 AM');
  const [location, setLocation] = useState('Suite 410, Medical Arts Pavilion');
  const [journeyId, setJourneyId] = useState('journey-deficiency');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('1 day prior');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isScheduleApptModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;

    const eventTitle = `${doctorName} — ${specialty}`;

    addCalendarEvent({
      title: eventTitle,
      category: 'appointment',
      date,
      startTime: time,
      location: location || clinicName,
      journeyId: journeyId || undefined,
      notes: notes.trim() || undefined,
      reminder,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsScheduleApptModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Schedule Medical Appointment</h2>
            <p className="text-xs text-slate-500">Add an upcoming clinician visit and configure reminders</p>
          </div>
          <button
            onClick={() => setIsScheduleApptModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mb-2" />
            <h3 className="text-base font-semibold text-slate-900">Appointment Scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">Added to your calendar, upcoming tasks, and health journey.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Clinician Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins, MD"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Cardiology, Endocrinology"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Clinic / Medical Practice
              </label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="e.g. Summit Medical Center"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Associate with Health Journey
              </label>
              <select
                value={journeyId}
                onChange={(e) => setJourneyId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 bg-white"
              >
                <option value="">None / General Check-up</option>
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Suite
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Suite 410, Pavilion A"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reminder Setting
                </label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 text-slate-900 bg-white"
                >
                  <option value="2 days prior">2 days prior</option>
                  <option value="1 day prior">1 day prior</option>
                  <option value="2 hours prior">2 hours prior</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsScheduleApptModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
              >
                Save Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
