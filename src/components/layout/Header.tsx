/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  Bell,
  Plus,
  ChevronDown,
  Calendar,
  Sparkles,
  Utensils,
  Activity,
  FilePlus,
  Clock,
  HeartPulse,
} from 'lucide-react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: 'Health Overview',
    subtitle: 'Real-time intelligence across clinical records, goals, and appointments',
  },
  profile: {
    title: 'Personal Health Profile',
    subtitle: 'Comprehensive biological identity, clinical history, and dietary preferences',
  },
  records: {
    title: 'Health Records',
    subtitle: 'Your medical information, laboratory results, and imaging organized in one place',
  },
  journeys: {
    title: 'Health Journeys',
    subtitle: 'Active therapeutic protocols, longitudinal tracking, and clinical milestones',
  },
  streaks: {
    title: 'Streaks & Habits',
    subtitle: 'Daily lifestyle cadence, sleep timing, hydration, and medication compliance',
  },
  calendar: {
    title: 'Healthcare Schedule',
    subtitle: 'Appointments, laboratory draws, prescription periods, and health tasks',
  },
  assistant: {
    title: 'MediCall AI Assistant',
    subtitle: 'Grounded clinical health assistant with direct context from your records',
  },
  nutrition: {
    title: 'Nutrition & Metabolic Fuel',
    subtitle: 'Macronutrient ratios, caloric balance, meal tracking, and hydration',
  },
  appointment_detail: {
    title: 'Endocrinology Consultation',
    subtitle: 'Pre-visit checklist, during-visit documentation, and post-visit clinical summary',
  },
};

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    userProfile,
    setIsAddRecordModalOpen,
    setIsLogFoodModalOpen,
    setIsRecordMeasurementModalOpen,
    setIsScheduleApptModalOpen,
  } = useHealth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const pageInfo = PAGE_TITLES[currentPage] || PAGE_TITLES.overview;

  const NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'Upcoming Endocrinology Consultation',
      desc: 'Dr. Evelyn Vance on Wednesday, Nov 4 at 10:30 AM. Review prepared questions.',
      time: 'In 8 days',
      action: () => {
        setCurrentPage('appointment_detail');
        setIsNotificationsOpen(false);
      },
    },
    {
      id: 'notif-2',
      title: 'Prescription Schedule Reminder',
      desc: 'Ergocalciferol 50,000 IU Dose #7 scheduled for Sunday morning with meal.',
      time: 'Sunday, Nov 1',
      action: () => {
        setCurrentPage('calendar');
        setIsNotificationsOpen(false);
      },
    },
    {
      id: 'notif-3',
      title: 'Laboratory Result Analysis Ready',
      desc: 'Vitamin D 25-OH panel flagged at 18 ng/mL (+4 ng/mL improvement).',
      time: 'Sep 18, 2026',
      action: () => {
        setCurrentPage('records');
        setIsNotificationsOpen(false);
      },
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16 gap-4">
        {/* Left: Mobile Brand & Desktop Breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm">MediCall AI</span>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-slate-500 font-normal truncate max-w-lg">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Controls: Quick Actions + Notifications + Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsQuickActionsOpen(!isQuickActionsOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Action</span>
              <ChevronDown className="w-3.5 h-3.5 text-teal-200" />
            </button>

            {isQuickActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Create / Record
                </div>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    setIsAddRecordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <FilePlus className="w-4 h-4 text-teal-600" />
                  <span>Add Health Record</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    setIsLogFoodModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Log Food Item</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    setIsRecordMeasurementModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Record Measurement</span>
                </button>
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    setIsScheduleApptModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>Schedule Appointment</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    setCurrentPage('assistant');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-teal-800 hover:bg-teal-50 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsQuickActionsOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                  <span className="text-[11px] text-teal-700 font-semibold">3 active</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <button
                      key={n.id}
                      onClick={n.action}
                      className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Button */}
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-teal-600/30 transition-all"
            aria-label="Open profile settings"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
