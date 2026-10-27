/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { HabitItem } from '../../types/health';
import {
  Flame,
  Plus,
  Check,
  Calendar,
  Clock,
  Sparkles,
  RotateCcw,
  Trash2,
  Edit2,
  Moon,
  Utensils,
  Droplets,
  Activity,
  Pill,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Moon,
  Utensils,
  Droplets,
  Activity,
  Pill,
  HeartPulse,
};

export const StreaksPage: React.FC = () => {
  const { habits, toggleHabitDay, addHabit, editHabit, deleteHabit } = useHealth();

  const todayStr = '2026-10-27';
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);

  // New habit form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitItem['category']>('sleep');
  const [iconName, setIconName] = useState('Moon');
  const [frequency, setFrequency] = useState<HabitItem['frequency']>('daily');
  const [targetTime, setTargetTime] = useState('22:00');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Today's summary calculation
  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const totalActiveStreakDays = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  // Last 7 days dates
  const LAST_7_DAYS = [
    { dateStr: '2026-10-21', label: 'Wed' },
    { dateStr: '2026-10-22', label: 'Thu' },
    { dateStr: '2026-10-23', label: 'Fri' },
    { dateStr: '2026-10-24', label: 'Sat' },
    { dateStr: '2026-10-25', label: 'Sun' },
    { dateStr: '2026-10-26', label: 'Mon' },
    { dateStr: '2026-10-27', label: 'Today' },
  ];

  const selectedHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];

  const handleCreateOrEditHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      editHabit(editingHabit.id, {
        name: name.trim(),
        category,
        iconName,
        frequency,
        targetTime,
        reminderEnabled,
      });
      setEditingHabit(null);
    } else {
      addHabit({
        name: name.trim(),
        category,
        iconName,
        frequency,
        targetTime,
        reminderEnabled,
        startDate: todayStr,
      });
    }

    setIsAddModalOpen(false);
    setName('');
  };

  const openEditModal = (habit: HabitItem) => {
    setEditingHabit(habit);
    setName(habit.name);
    setCategory(habit.category);
    setIconName(habit.iconName);
    setFrequency(habit.frequency);
    setTargetTime(habit.targetTime || '22:00');
    setReminderEnabled(habit.reminderEnabled);
    setIsAddModalOpen(true);
  };

  // Generate October 2026 calendar days for selected habit
  const renderOctoberDays = () => {
    const days = [];
    // Oct 1 2026 is a Thursday (3 blanks for Mon, Tue, Wed if starting Monday)
    for (let b = 0; b < 3; b++) {
      days.push(<div key={`b-${b}`} className="h-8 rounded-md bg-slate-50/50" />);
    }
    for (let d = 1; d <= 31; d++) {
      const dayPad = d < 10 ? `0${d}` : `${d}`;
      const dStr = `2026-10-${dayPad}`;
      const isDone = selectedHabit?.completedDates.includes(dStr);
      const isToday = dStr === todayStr;

      days.push(
        <button
          key={dStr}
          onClick={() => toggleHabitDay(selectedHabit.id, dStr)}
          className={`h-8 rounded-md text-xs font-mono font-medium flex items-center justify-center transition-all ${
            isDone
              ? 'bg-teal-700 text-white font-bold shadow-2xs'
              : isToday
              ? 'border-2 border-teal-600 text-teal-800 bg-teal-50/40'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title={`${dStr}: ${isDone ? 'Completed' : 'Not completed'}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Streaks & Healthy Habits
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Consistent daily lifestyle cadence for restorative sleep, nutrition, hydration, and medication adherence.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingHabit(null);
            setName('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Top Completion Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Today's Progress</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {completedTodayCount} / {totalHabits}
              </span>
              <span className="text-sm font-semibold text-teal-700 font-mono">
                ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Active Streaks */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">Cumulative Consistency</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {totalActiveStreakDays}{' '}
              <span className="text-sm font-sans font-medium text-slate-500">active streak days</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              All 6 habits actively maintained without reset this week.
            </p>
          </div>
        </div>

        {/* Weekly Completion Visualization */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">7-Day Completion Flow</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {LAST_7_DAYS.map((day) => {
              const dayCompletions = habits.filter((h) => h.completedDates.includes(day.dateStr)).length;
              const isFull = dayCompletions === totalHabits;

              return (
                <div key={day.dateStr} className="space-y-1">
                  <div
                    className={`h-8 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                      isFull
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : dayCompletions > 0
                        ? 'bg-teal-100 text-teal-900'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {dayCompletions}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-medium truncate">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer Note */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Clinical Safety Notice:</strong> Habit tracking for weekly Ergocalciferol (Vitamin D) is designed to assist personal schedule adherence and is not a substitute for clinical monitoring, lab follow-up, or medical direction from your physician.
        </p>
      </div>

      {/* 2-Column Section: Habit Cards & Interactive Monthly Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Cards (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Today's Habits ({todayStr})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {habits.map((habit) => {
              const Icon = ICON_MAP[habit.iconName] || Activity;
              const isDoneToday = habit.completedDates.includes(todayStr);
              const isSelected = selectedHabit?.id === habit.id;

              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs transition-all flex flex-col justify-between ${
                    isSelected ? 'border-teal-600 ring-2 ring-teal-600/10' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDoneToday ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {habit.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium capitalize">
                            {habit.frequency} · {habit.targetTime || 'Anytime'}
                          </span>
                        </div>
                      </div>

                      {/* Complete Today Toggle Button */}
                      <button
                        onClick={() => toggleHabitDay(habit.id, todayStr)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                          isDoneToday
                            ? 'bg-teal-700 border-teal-700 text-white shadow-2xs'
                            : 'border-slate-300 hover:border-teal-600 text-transparent hover:text-slate-300'
                        }`}
                        title={isDoneToday ? 'Mark incomplete' : 'Mark completed for today'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {/* Streak Numbers */}
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{habit.currentStreak} day streak</span>
                      </div>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Best: {habit.bestStreak} days
                      </span>
                    </div>

                    {/* Mini 7-day dot trail */}
                    <div className="flex items-center gap-1 pt-3">
                      {LAST_7_DAYS.map((d) => {
                        const done = habit.completedDates.includes(d.dateStr);
                        return (
                          <div
                            key={d.dateStr}
                            onClick={() => toggleHabitDay(habit.id, d.dateStr)}
                            className={`h-2 flex-1 rounded-full cursor-pointer transition-colors ${
                              done ? 'bg-teal-700' : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                            title={`${d.dateStr}: ${done ? 'Done' : 'Not done'} (click to toggle)`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedHabitId(habit.id)}
                      className={`text-[11px] font-semibold ${
                        isSelected ? 'text-teal-800' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isSelected ? 'Viewing Calendar' : 'View Calendar'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(habit)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Edit habit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Calendar View for Selected Habit */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Habit Calendar</h3>
                <span className="text-xs text-slate-500 truncate block max-w-[200px]">
                  {selectedHabit?.name}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                October 2026
              </span>
            </div>

            {/* Habit selector dropdown */}
            <div className="pt-3 pb-2">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Select Habit to Inspect
              </label>
              <select
                value={selectedHabit?.id}
                onChange={(e) => setSelectedHabitId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-900 bg-white"
              >
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.currentStreak} day streak)
                  </option>
                ))}
              </select>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1 pt-2">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 py-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-1">{renderOctoberDays()}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-700" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm border-2 border-teal-600" />
              <span>Today</span>
            </span>
            <span>Click day to toggle</span>
          </div>
        </div>
      </div>

      {/* Habit Creation / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrEditHabit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Habit Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 15-min mindfulness breathing, Drink 3L water"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="sleep">Sleep & Rest</option>
                    <option value="nutrition">Nutrition & Diet</option>
                    <option value="hydration">Hydration</option>
                    <option value="fitness">Exercise & Movement</option>
                    <option value="medication">Medication & Supplements</option>
                    <option value="mindfulness">Mindfulness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Icon
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="Moon">Moon (Sleep)</option>
                    <option value="Utensils">Utensils (Food)</option>
                    <option value="Droplets">Droplets (Water)</option>
                    <option value="Activity">Activity (Fitness)</option>
                    <option value="Pill">Pill (Medication)</option>
                    <option value="HeartPulse">Heart Pulse (Mindfulness)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="custom">Custom / Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Target Time
                  </label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reminder-toggle"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-600"
                />
                <label htmlFor="reminder-toggle" className="text-slate-700 font-medium cursor-pointer">
                  Enable device notification reminders
                </label>
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
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
