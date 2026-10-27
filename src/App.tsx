/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './components/overview/OverviewPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { HealthRecordsPage } from './components/records/HealthRecordsPage';
import { JourneysPage } from './components/journeys/JourneysPage';
import { StreaksPage } from './components/streaks/StreaksPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { AppointmentDetailPage } from './components/appointment/AppointmentDetailPage';
import { AssistantPage } from './components/assistant/AssistantPage';
import { NutritionPage } from './components/nutrition/NutritionPage';
import { FloatingAIChatWidget } from './components/assistant/FloatingAIChatWidget';
import { AddRecordModal } from './components/modals/AddRecordModal';
import { LogFoodModal } from './components/modals/LogFoodModal';
import { ScanFoodModal } from './components/modals/ScanFoodModal';
import { RecordMeasurementModal } from './components/modals/RecordMeasurementModal';
import { ScheduleAppointmentModal } from './components/modals/ScheduleAppointmentModal';
import { RecordDetailModal } from './components/modals/RecordDetailModal';

const AppContent: React.FC = () => {
  const { currentPage } = useHealth();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Persistent Left Sidebar (Desktop) + Mobile Bottom Bar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <Header />

        <main className="flex-1 overflow-x-hidden">
          {currentPage === 'overview' && <OverviewPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'records' && <HealthRecordsPage />}
          {currentPage === 'journeys' && <JourneysPage />}
          {currentPage === 'streaks' && <StreaksPage />}
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'appointment_detail' && <AppointmentDetailPage />}
          {currentPage === 'assistant' && <AssistantPage />}
          {currentPage === 'nutrition' && <NutritionPage />}
        </main>
      </div>

      {/* Global Interactive Modals & Floating AI Chatbot */}
      <AddRecordModal />
      <LogFoodModal />
      <ScanFoodModal />
      <RecordMeasurementModal />
      <ScheduleAppointmentModal />
      <RecordDetailModal />
      <FloatingAIChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}
