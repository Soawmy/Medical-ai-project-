/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { PageId } from '../../types/health';
import {
  LayoutDashboard,
  User,
  FileText,
  Compass,
  Flame,
  Calendar,
  Sparkles,
  Utensils,
  HeartPulse,
  Plus,
  Menu,
  X,
  Camera,
  Scale,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'nutrition', label: 'Nutrition & Calories', icon: Utensils },
  { id: 'records', label: 'Health Records', icon: FileText },
  { id: 'journeys', label: 'My Journeys', icon: Compass },
  { id: 'streaks', label: 'Streaks & Habits', icon: Flame },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { id: 'profile', label: 'My Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    userProfile,
    setIsAddRecordModalOpen,
    setIsScanFoodModalOpen,
    setIsRecordMeasurementModalOpen,
  } = useHealth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 4 Primary bottom tabs on mobile + More Hub button
  const MOBILE_PRIMARY_TABS = [
    { id: 'overview' as PageId, label: 'Overview', icon: LayoutDashboard },
    { id: 'nutrition' as PageId, label: 'Nutrition', icon: Utensils },
    { id: 'records' as PageId, label: 'Records', icon: FileText },
    { id: 'journeys' as PageId, label: 'Journeys', icon: Compass },
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 z-30 select-none">
        {/* Brand Zone */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 tracking-tight block">
              MediCall AI
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Health Intelligence
            </span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'assistant' && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100/70 text-teal-800">
                    Live
                  </span>
                )}
                {item.id === 'nutrition' && (
                  <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Cal AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Action in Sidebar */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setIsScanFoodModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5 text-teal-200" />
            <span>Scan Meal (Cal AI)</span>
          </button>
          <button
            onClick={() => setIsAddRecordModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>Add Health Record</span>
          </button>
        </div>

        {/* Patient Profile Footer in Sidebar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={() => setCurrentPage('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {userProfile.fullName}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {userProfile.age} yrs · {userProfile.currentWeightKg} kg · {userProfile.heightCm} cm
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Optimized for one-hand touch ergonomics) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {MOBILE_PRIMARY_TABS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setCurrentPage(item.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg min-h-[46px] transition-all ${
                isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-teal-50 text-teal-700' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-slate-500'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}

        {/* 5th Tab: Hub / More Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-lg min-h-[46px] transition-all ${
            isMobileMenuOpen || ['profile', 'streaks', 'calendar', 'assistant', 'appointment_detail'].includes(currentPage)
              ? 'text-teal-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="More navigation and tools"
        >
          <div className={`p-1 rounded-md transition-colors ${
            isMobileMenuOpen || ['profile', 'streaks', 'calendar', 'assistant'].includes(currentPage)
              ? 'bg-teal-50 text-teal-700'
              : ''
          }`}>
            {isMobileMenuOpen ? <X className="w-5 h-5 text-teal-700" /> : <Menu className="w-5 h-5 text-slate-500" />}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate">More</span>
        </button>
      </nav>

      {/* Mobile Drawer / Hub Sheet */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl p-5 border-t border-slate-200 shadow-2xl max-h-[80vh] overflow-y-auto mb-[60px] animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            {/* Patient Header */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.fullName}
                className="w-11 h-11 rounded-full object-cover border border-slate-300"
              />
              <div className="flex-1 truncate">
                <span className="font-bold text-sm text-slate-900 block truncate">{userProfile.fullName}</span>
                <span className="text-xs text-slate-500 block truncate">
                  {userProfile.age} yrs · {userProfile.currentWeightKg} kg · {userProfile.heightCm} cm
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCurrentPage('profile');
                }}
                className="text-xs font-semibold text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs"
              >
                Profile
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsScanFoodModalOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-700 text-white font-bold text-xs shadow-xs"
              >
                <Camera className="w-4 h-4 text-teal-200 shrink-0" />
                <span className="truncate">Scan Food (Cal AI)</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRecordMeasurementModalOpen(true);
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs"
              >
                <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Log Vitals</span>
              </button>
            </div>

            {/* Hub Links */}
            <div className="space-y-1">
              {[
                { id: 'assistant' as PageId, label: 'MediCall AI Assistant', desc: 'Clinical records reasoning & guidance', icon: Sparkles, badge: 'Active' },
                { id: 'calendar' as PageId, label: 'Schedule & Calendar', desc: 'Appointments & medication timings', icon: Calendar },
                { id: 'streaks' as PageId, label: 'Streaks & Habits', desc: 'Sleep, sunlight, hydration cadence', icon: Flame },
                { id: 'profile' as PageId, label: 'Profile & Clinical Identity', desc: 'Allergies, conditions, genetics', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setCurrentPage(item.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isActive ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isActive ? 'text-teal-900' : 'text-slate-900'}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
