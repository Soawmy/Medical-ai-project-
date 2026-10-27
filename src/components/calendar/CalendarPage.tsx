/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { CalendarEvent, EventCategory } from '../../types/health';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Filter,
} from 'lucide-react';

const CATEGORY_STYLES: Record<
  EventCategory,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  appointment: {
    label: 'Doctor Appointment',
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-200',
    dot: 'bg-sky-600',
  },
  medication_period: {
    label: 'Medication Schedule',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
  },
  lab_test: {
    label: 'Laboratory Test',
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    border: 'border-teal-200',
    dot: 'bg-teal-600',
  },
  radiology: {
    label: 'Radiology / Imaging',
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    dot: 'bg-indigo-600',
  },
  followup_reminder: {
    label: 'Follow-Up Reminder',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    dot: 'bg-amber-600',
  },
  personal_goal: {
    label: 'Personal Health Milestone',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    dot: 'bg-purple-600',
  },
};

export const CalendarPage: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    setCurrentPage,
    setSelectedAppointmentId,
    journeys,
  } = useHealth();

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'agenda'>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Nov = 10 (0-indexed)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add event modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [eventDate, setEventDate] = useState('2026-11-04');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('appointment');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [location, setLocation] = useState('');
  const [journeyId, setJourneyId] = useState('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState('1 day prior');

  // Event detail modal
  const [inspectedEvent, setInspectedEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = calendarEvents.filter((ev) => {
    if (categoryFilter === 'all') return true;
    return ev.category === categoryFilter;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title: title.trim(),
      category,
      date: eventDate,
      startTime,
      endTime,
      location: location.trim() || undefined,
      journeyId: journeyId || undefined,
      notes: notes.trim() || undefined,
      reminder,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setLocation('');
    setNotes('');
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Days in month calculation
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sun

  const renderMonthDays = () => {
    const cells = [];
    // Adjust so week starts on Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(
        <div
          key={`blank-${i}`}
          className="min-h-[110px] bg-slate-50/40 border border-slate-100 p-2 text-slate-300"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const monthPad = selectedMonth + 1 < 10 ? `0${selectedMonth + 1}` : `${selectedMonth + 1}`;
      const dayPad = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `${selectedYear}-${monthPad}-${dayPad}`;

      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      const isToday = dateStr === '2026-10-27';

      cells.push(
        <div
          key={dateStr}
          onClick={() => {
            setEventDate(dateStr);
            setIsAddModalOpen(true);
          }}
          className={`min-h-[110px] border border-slate-200/90 p-2 transition-all hover:bg-slate-50/80 cursor-pointer flex flex-col justify-between ${
            isToday ? 'bg-teal-50/20' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                isToday ? 'bg-teal-700 text-white' : 'text-slate-800'
              }`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-[10px] font-mono text-slate-400">
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Events inside day cell */}
          <div className="space-y-1 mt-1 overflow-y-auto max-h-[70px]">
            {dayEvents.map((ev) => {
              const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.appointment;
              return (
                <div
                  key={ev.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectedEvent(ev);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium border truncate transition-opacity hover:opacity-85 ${style.bg} ${style.text} ${style.border}`}
                >
                  {ev.startTime && <span className="font-mono mr-1">{ev.startTime}</span>}
                  <span>{ev.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Healthcare Calendar
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Coordinate upcoming medical appointments, lab draw dates, and medication courses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEventDate('2026-11-04');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Navigation & Month Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 min-w-[160px]">
            {monthNames[selectedMonth]} {selectedYear}
          </h3>

          <button
            onClick={() => {
              setSelectedMonth(9); // Oct 2026
              setSelectedYear(2026);
            }}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            Today
          </button>
        </div>

        {/* View Switcher: Month, Week, Agenda */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          {(['month', 'agenda'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                currentView === view
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {view} View
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900 bg-white"
          >
            <option value="all">All Event Types</option>
            <option value="appointment">Doctor Appointments</option>
            <option value="medication_period">Medication Schedule</option>
            <option value="lab_test">Laboratory Tests</option>
            <option value="radiology">Radiology</option>
            <option value="personal_goal">Personal Goals</option>
          </select>
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex items-center gap-4 flex-wrap text-[11px] text-slate-600 px-1">
        {Object.entries(CATEGORY_STYLES).map(([key, item]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* View Display: Month Grid or Agenda List */}
      {currentView === 'month' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2 text-xs font-semibold text-slate-500">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {renderMonthDays()}
          </div>
        </div>
      ) : (
        /* Chronological Agenda View */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Chronological Schedule Agenda</h3>
          <div className="space-y-3">
            {filteredEvents
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((ev) => {
                const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.appointment;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setInspectedEvent(ev)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${style.bg} ${style.text} border ${style.border}`}>
                          {style.label}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {ev.date}
                        </span>
                        {ev.startTime && (
                          <span className="text-xs text-slate-500 font-mono">· {ev.startTime}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                      {ev.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ev.location}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {ev.appointmentId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointmentId(ev.appointmentId || 'appt-vance-nov26');
                            setCurrentPage('appointment_detail');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1"
                        >
                          <span>Open Visit Plan</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCalendarEvent(ev.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Event Details Inspection Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {CATEGORY_STYLES[inspectedEvent.category]?.label}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{inspectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-semibold text-slate-800">{inspectedEvent.date}</span>
                {inspectedEvent.startTime && <span>at {inspectedEvent.startTime}</span>}
              </div>

              {inspectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{inspectedEvent.location}</span>
                </div>
              )}

              {inspectedEvent.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 mt-2">
                  {inspectedEvent.notes}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {inspectedEvent.appointmentId ? (
                <button
                  onClick={() => {
                    setSelectedAppointmentId(inspectedEvent.appointmentId || 'appt-vance-nov26');
                    setInspectedEvent(null);
                    setCurrentPage('appointment_detail');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center gap-1.5"
                >
                  <span>Open Doctor Appointment Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={() => {
                  deleteCalendarEvent(inspectedEvent.id);
                  setInspectedEvent(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Dialog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Healthcare Event</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dr. Vance Follow-Up, Quest Fasting Draw, Vitamin D Dose #8"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="appointment">Doctor Appointment</option>
                    <option value="medication_period">Medication Schedule</option>
                    <option value="lab_test">Laboratory Test</option>
                    <option value="radiology">Radiology Examination</option>
                    <option value="followup_reminder">Follow-up Reminder</option>
                    <option value="personal_goal">Personal Health Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="e.g. 11:15 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Location / Medical Facility
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Suite 410, Medical Arts Pavilion"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Associate with Health Journey
                </label>
                <select
                  value={journeyId}
                  onChange={(e) => setJourneyId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                >
                  <option value="">None / General</option>
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
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
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
