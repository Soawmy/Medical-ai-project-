/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageId,
  UserProfile,
  HealthRecord,
  HealthJourney,
  HabitItem,
  CalendarEvent,
  DoctorAppointment,
  DailyNutrition,
  ChatMessage,
  MealItem,
  HealthDocumentaryChapter,
} from '../types/health';
import {
  INITIAL_USER_PROFILE,
  INITIAL_HEALTH_RECORDS,
  INITIAL_JOURNEYS,
  INITIAL_HABITS,
  INITIAL_APPOINTMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NUTRITION,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DOCUMENTARY_CHAPTERS,
} from '../data/initialData';
import { calculateHabitStreak, calculateBMRAndTDEE } from '../utils/healthCalculations';

interface HealthContextType {
  // Navigation & Active Views
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
  selectedJourneyId: string | null;
  setSelectedJourneyId: (id: string | null) => void;
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (id: string | null) => void;

  // Global modals
  isAddRecordModalOpen: boolean;
  setIsAddRecordModalOpen: (open: boolean) => void;
  isLogFoodModalOpen: boolean;
  setIsLogFoodModalOpen: (open: boolean) => void;
  isRecordMeasurementModalOpen: boolean;
  setIsRecordMeasurementModalOpen: (open: boolean) => void;
  isScheduleApptModalOpen: boolean;
  setIsScheduleApptModalOpen: (open: boolean) => void;
  isScanFoodModalOpen: boolean;
  setIsScanFoodModalOpen: (open: boolean) => void;
  isFloatingChatOpen: boolean;
  setIsFloatingChatOpen: (open: boolean) => void;
  chatMode: 'general' | 'records' | 'calories' | 'journeys';
  setChatMode: (mode: 'general' | 'records' | 'calories' | 'journeys') => void;

  // Documentary State
  documentaryChapters: HealthDocumentaryChapter[];

  // State
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => HealthRecord;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  runSimulatedRecordAI: (id: string) => void;

  journeys: HealthJourney[];
  addJourney: (journey: Omit<HealthJourney, 'id'>) => void;
  updateJourney: (id: string, updates: Partial<HealthJourney>) => void;
  archiveJourney: (id: string) => void;
  deleteJourney: (id: string) => void;

  habits: HabitItem[];
  toggleHabitDay: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<HabitItem, 'id' | 'currentStreak' | 'bestStreak' | 'completedDates'>) => void;
  editHabit: (id: string, updates: Partial<HabitItem>) => void;
  deleteHabit: (id: string) => void;

  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  editCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  appointments: DoctorAppointment[];
  updateAppointment: (id: string, updates: Partial<DoctorAppointment>) => void;
  togglePrepQuestion: (apptId: string, questionId: string) => void;
  addCustomPrepQuestion: (apptId: string, questionText: string) => void;
  savePostVisitSummary: (
    apptId: string,
    summary: NonNullable<DoctorAppointment['postVisitSummary']>
  ) => void;

  nutrition: DailyNutrition;
  logMeal: (meal: Omit<MealItem, 'id'>) => void;
  deleteMeal: (mealId: string) => void;
  addWater: (amountMl: number) => void;

  chatMessages: ChatMessage[];
  isAssistantThinking: boolean;
  sendChatMessage: (content: string) => void;
  clearChatMessages: () => void;
  resetAllDemoData: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const STORAGE_PREFIX = 'medicall_ai_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    'appt-vance-nov26'
  );

  // Global modals & tools
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isLogFoodModalOpen, setIsLogFoodModalOpen] = useState(false);
  const [isRecordMeasurementModalOpen, setIsRecordMeasurementModalOpen] = useState(false);
  const [isScheduleApptModalOpen, setIsScheduleApptModalOpen] = useState(false);
  const [isScanFoodModalOpen, setIsScanFoodModalOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'general' | 'records' | 'calories' | 'journeys'>('general');

  // Core entities
  const [documentaryChapters] = useState<HealthDocumentaryChapter[]>(() =>
    loadFromStorage('documentary', INITIAL_DOCUMENTARY_CHAPTERS)
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadFromStorage('profile', INITIAL_USER_PROFILE)
  );
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() =>
    loadFromStorage('records', INITIAL_HEALTH_RECORDS)
  );
  const [journeys, setJourneys] = useState<HealthJourney[]>(() =>
    loadFromStorage('journeys', INITIAL_JOURNEYS)
  );
  const [habits, setHabits] = useState<HabitItem[]>(() =>
    loadFromStorage('habits', INITIAL_HABITS)
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() =>
    loadFromStorage('events', INITIAL_CALENDAR_EVENTS)
  );
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(() =>
    loadFromStorage('appointments', INITIAL_APPOINTMENTS)
  );
  const [nutrition, setNutrition] = useState<DailyNutrition>(() =>
    loadFromStorage('nutrition', INITIAL_NUTRITION)
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage('chat', INITIAL_CHAT_MESSAGES)
  );
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage('profile', userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveToStorage('records', healthRecords);
  }, [healthRecords]);

  useEffect(() => {
    saveToStorage('journeys', journeys);
  }, [journeys]);

  useEffect(() => {
    saveToStorage('habits', habits);
  }, [habits]);

  useEffect(() => {
    saveToStorage('events', calendarEvents);
  }, [calendarEvents]);

  useEffect(() => {
    saveToStorage('appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    saveToStorage('nutrition', nutrition);
  }, [nutrition]);

  useEffect(() => {
    saveToStorage('chat', chatMessages);
  }, [chatMessages]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>): HealthRecord => {
    const id = `rec-${Date.now()}`;
    const newRecord: HealthRecord = { ...record, id };
    setHealthRecords((prev) => [newRecord, ...prev]);

    // Add entry to calendar if it's a lab or radiology
    if (newRecord.category === 'lab' || newRecord.category === 'radiology') {
      const newEvent: CalendarEvent = {
        id: `ev-${Date.now()}`,
        title: `${newRecord.title} (Recorded)`,
        category: newRecord.category === 'lab' ? 'lab_test' : 'radiology',
        date: newRecord.date,
        location: newRecord.facility,
        journeyId: newRecord.journeyId,
        reminder: 'None',
      };
      setCalendarEvents((prev) => [...prev, newEvent]);
    }

    return newRecord;
  };

  const updateHealthRecord = (id: string, updates: Partial<HealthRecord>) => {
    setHealthRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec))
    );
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((rec) => rec.id !== id));
    if (selectedRecordId === id) setSelectedRecordId(null);
  };

  const runSimulatedRecordAI = (id: string) => {
    const record = healthRecords.find((r) => r.id === id);
    if (!record) return;

    // Simulate AI generation with intelligent response based on category
    let simulatedReport = record.aiAnalysis;
    if (!simulatedReport) {
      if (record.category === 'lab') {
        simulatedReport = {
          summary: `Clinical synthesis of ${record.title} reveals stable biochemical parameters aligned with your baseline health profile.`,
          keyFindings: [
            'All documented numerical items were compared against standard clinical reference intervals.',
            'No critical acute emergencies detected in the submitted panel.',
          ],
          attentionItems: [
            'Compare trend against previous lab draws and bring questions to your next clinical consult.',
          ],
          earlierComparison: 'Established as an updated reference point in your personal health records.',
          questionsForDoctor: [
            'How do these values fit into our overarching longitudinal treatment strategy?',
          ],
          limitations: 'Simulated AI clinical summary for patient engagement. Not an official medical diagnostic test.',
          simulatedTimestamp: new Date().toLocaleString(),
        };
      } else {
        simulatedReport = {
          summary: `Visual imaging review of ${record.title}. Structural landmarks show clear diagnostic orientation without apparent acute fractures or pathological tissue changes.`,
          keyFindings: [
            'Visual contrast and bone/tissue architecture are clear and well-defined.',
            'Correlates with documented clinical history in your profile.',
          ],
          attentionItems: [
            'Ensure your primary care physician and specialist have direct access to the full DICOM series.',
          ],
          earlierComparison: 'Consistent with historical radiological records.',
          questionsForDoctor: [
            'Are any follow-up cross-sectional views recommended in the coming 6–12 months?',
          ],
          limitations: 'Simulated diagnostic analysis. Always rely on formal board-certified radiologist interpretation.',
          simulatedTimestamp: new Date().toLocaleString(),
        };
      }
    }

    updateHealthRecord(id, {
      aiAnalysisStatus: 'analyzed',
      aiAnalysis: simulatedReport,
    });
  };

  const addJourney = (journey: Omit<HealthJourney, 'id'>) => {
    const newJourney: HealthJourney = {
      ...journey,
      id: `journey-${Date.now()}`,
    };
    setJourneys((prev) => [newJourney, ...prev]);
  };

  const updateJourney = (id: string, updates: Partial<HealthJourney>) => {
    setJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
  };

  const archiveJourney = (id: string) => {
    setJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'archived' } : j))
    );
  };

  const deleteJourney = (id: string) => {
    setJourneys((prev) => prev.filter((j) => j.id !== id));
    if (selectedJourneyId === id) setSelectedJourneyId(null);
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const exists = habit.completedDates.includes(dateStr);
        const newDates = exists
          ? habit.completedDates.filter((d) => d !== dateStr)
          : [...habit.completedDates, dateStr];
        const { currentStreak, bestStreak } = calculateHabitStreak(newDates, '2026-10-27');
        return {
          ...habit,
          completedDates: newDates,
          currentStreak,
          bestStreak,
        };
      })
    );
  };

  const addHabit = (
    habit: Omit<HabitItem, 'id' | 'currentStreak' | 'bestStreak' | 'completedDates'>
  ) => {
    const newHabit: HabitItem = {
      ...habit,
      id: `habit-${Date.now()}`,
      currentStreak: 0,
      bestStreak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const editHabit = (id: string, updates: Partial<HabitItem>) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const updated = { ...h, ...updates };
        const { currentStreak, bestStreak } = calculateHabitStreak(
          updated.completedDates,
          '2026-10-27'
        );
        return { ...updated, currentStreak, bestStreak };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const editCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateAppointment = (id: string, updates: Partial<DoctorAppointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const togglePrepQuestion = (apptId: string, questionId: string) => {
    setAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== apptId) return appt;
        return {
          ...appt,
          prepQuestions: appt.prepQuestions.map((q) =>
            q.id === questionId ? { ...q, checked: !q.checked } : q
          ),
        };
      })
    );
  };

  const addCustomPrepQuestion = (apptId: string, questionText: string) => {
    if (!questionText.trim()) return;
    setAppointments((prev) =>
      prev.map((appt) => {
        if (appt.id !== apptId) return appt;
        return {
          ...appt,
          prepQuestions: [
            ...appt.prepQuestions,
            {
              id: `custom-q-${Date.now()}`,
              text: questionText.trim(),
              checked: false,
              isCustom: true,
            },
          ],
        };
      })
    );
  };

  const savePostVisitSummary = (
    apptId: string,
    summary: NonNullable<DoctorAppointment['postVisitSummary']>
  ) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === apptId
          ? {
              ...appt,
              status: 'completed',
              postVisitSummary: summary,
            }
          : appt
      )
    );

    // Also add to clinical records as a clinical note!
    const targetAppt = appointments.find((a) => a.id === apptId);
    if (targetAppt) {
      addHealthRecord({
        title: `Clinical Consultation Summary: ${targetAppt.doctorName}`,
        category: 'clinical_notes',
        date: targetAppt.date,
        facility: targetAppt.clinicName,
        clinician: targetAppt.doctorName,
        journeyId: targetAppt.journeyId,
        aiAnalysisStatus: 'analyzed',
        fileType: 'document',
        fileName: `Visit_Summary_${targetAppt.date}.pdf`,
        fileSize: '142 KB',
        notes: `Conclusion: ${summary.conclusion}\nActions: ${summary.recommendedActions.join(', ')}`,
        aiAnalysis: {
          summary: summary.conclusion,
          keyFindings: summary.recommendedActions,
          attentionItems: summary.medicationInstructions,
          earlierComparison: 'Recorded from formal clinician encounter.',
          questionsForDoctor: summary.unansweredQuestions,
          limitations: 'Documented patient-clinician visit notes.',
          simulatedTimestamp: summary.savedAt,
        },
      });
    }
  };

  const logMeal = (meal: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = {
      ...meal,
      id: `meal-${Date.now()}`,
    };
    setNutrition((prev) => {
      const newMeals = [...prev.meals, newMeal];
      const newCalories = newMeals.reduce((acc, m) => acc + m.calories, 0);
      const newProtein = newMeals.reduce((acc, m) => acc + m.protein, 0);
      const newCarbs = newMeals.reduce((acc, m) => acc + m.carbs, 0);
      const newFat = newMeals.reduce((acc, m) => acc + m.fat, 0);

      return {
        ...prev,
        meals: newMeals,
        caloriesConsumed: newCalories,
        proteinGrams: newProtein,
        carbsGrams: newCarbs,
        fatGrams: newFat,
      };
    });
  };

  const deleteMeal = (mealId: string) => {
    setNutrition((prev) => {
      const newMeals = prev.meals.filter((m) => m.id !== mealId);
      const newCalories = newMeals.reduce((acc, m) => acc + m.calories, 0);
      const newProtein = newMeals.reduce((acc, m) => acc + m.protein, 0);
      const newCarbs = newMeals.reduce((acc, m) => acc + m.carbs, 0);
      const newFat = newMeals.reduce((acc, m) => acc + m.fat, 0);

      return {
        ...prev,
        meals: newMeals,
        caloriesConsumed: newCalories,
        proteinGrams: newProtein,
        carbsGrams: newCarbs,
        fatGrams: newFat,
      };
    });
  };

  const addWater = (amountMl: number) => {
    setNutrition((prev) => ({
      ...prev,
      waterMl: Math.min(prev.waterTargetMl * 2, prev.waterMl + amountMl),
    }));
  };

  const sendChatMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    // Generate simulated contextual AI response matching user prompt and Alex's clinical profile
    setTimeout(() => {
      let replyContent = '';
      let referencedRecords: string[] = [];
      let referencedJourneys: string[] = [];
      let followUps: string[] = [];

      const queryLower = userText.toLowerCase();

      if (queryLower.includes('blood') || queryLower.includes('lab') || queryLower.includes('test') || queryLower.includes('cbc')) {
        replyContent = `Looking at your latest laboratory results from September 18, 2026:\n\n1. **Vitamin D 25-Hydroxy**: Your level reached **18 ng/mL**, up from 14 ng/mL (+28% increase). While this confirms that the weekly 50,000 IU Ergocalciferol therapy is working, it remains below the normal clinical threshold (30–100 ng/mL). Parathyroid hormone (PTH 42 pg/mL) and calcium (9.4 mg/dL) are in healthy equilibrium.\n\n2. **Complete Blood Count (CBC)**: Hemoglobin is 12.8 g/dL, Hematocrit is 38.5%, and WBC is 6.2 10³/µL. Platelets are optimal at 245 10³/µL. This rules out anemia as a major contributor to prior fatigue.\n\n3. **Thyroid & Lipids**: TSH is 2.15 mIU/L (euthyroid) and Fasting Blood Glucose is 88 mg/dL. Your LDL is slightly borderline at 104 mg/dL (target <100 mg/dL), which Sarah Lin can address via dietary fiber adjustments.`;
        referencedRecords = ['rec-vitd-sep26', 'rec-cbc-sep26', 'rec-thyroid-sep26'];
        referencedJourneys = ['journey-deficiency', 'journey-weight'];
        followUps = [
          'What questions should I bring to Dr. Vance?',
          'What foods can boost Vitamin D absorption?',
          'How does my thyroid panel look?',
        ];
      } else if (queryLower.includes('growth') || queryLower.includes('height') || queryLower.includes('x-ray') || queryLower.includes('bone')) {
        replyContent = `Based on your Bilateral Hand & Wrist Radiograph dated August 12, 2026, Dr. Sterling confirmed **complete physiological closure of all distal radial, ulnar, and metacarpal growth plates (physes)**.\n\n**Key Takeaway**: Your adult height has permanently stabilized at **175.0 cm (5 ft 8.9 in)**. Because growth plates have fused, longitudinal bone elongation is complete. The clinical recommendation now focuses on maintaining bone mineral density through:\n- Resolving Vitamin D deficiency to >30 ng/mL\n- Adequate dietary calcium (1,000 mg/day)\n- Progressive resistance training to stimulate cortical bone remodeling.`;
        referencedRecords = ['rec-radiology-xray'];
        referencedJourneys = ['journey-growth', 'journey-deficiency'];
        followUps = [
          'Should I schedule a DEXA bone density scan?',
          'How much calcium do I get from my current diet?',
          'Can poor posture make me feel shorter?',
        ];
      } else if (queryLower.includes('appointment') || queryLower.includes('doctor') || queryLower.includes('dr. vance') || queryLower.includes('dr vance') || queryLower.includes('endocrinolog')) {
        replyContent = `You have an upcoming consultation with **Dr. Evelyn Vance, MD** on **Wednesday, November 4, 2026 at 10:30 AM** at Summit Endocrine & Metabolic Associates (Suite 410, Medical Arts Pavilion).\n\n**Prepared questions ready in your checklist**:\n1. Transitioning from weekly 50,000 IU to daily maintenance D3\n2. Reviewing the closed growth plates from your August hand X-ray\n3. Addressing borderline LDL (104 mg/dL)\n4. Discussing if a baseline DEXA scan is indicated\n\nAll three relevant lab and radiology reports are marked ready for presentation.`;
        referencedRecords = ['rec-vitd-sep26', 'rec-radiology-xray', 'rec-thyroid-sep26'];
        referencedJourneys = ['journey-deficiency'];
        followUps = [
          'Open Appointment Detail page',
          'Add a new question for Dr. Vance',
          'Review Vitamin D repletion trajectory',
        ];
      } else if (queryLower.includes('documentary') || queryLower.includes('story') || queryLower.includes('timeline') || queryLower.includes('chapter') || queryLower.includes('history')) {
        replyContent = `Here is the comprehensive chronicle of your health journey to date:\n\n1. **The Baseline Discovery (March 2026)**: Persistent fatigue prompted investigation by Dr. Marcus Chen, uncovering marked Vitamin D deficiency at 14.0 ng/mL with normal hemoglobin.\n\n2. **Skeletal Maturation (August 2026)**: Dr. Sterling confirmed 100% physeal fusion on bilateral hand radiographs, establishing adult height stability at 178.0 cm.\n\n3. **Endocrine Repletion (August–Sept 2026)**: Dr. Vance initiated 50,000 IU weekly Ergocalciferol with 100% adherence and Mediterranean diet synergy.\n\n4. **Metabolic Velocity (Sept–Oct 2026)**: 25-OH Vitamin D surged +28.5% to 18.0 ng/mL, weight normalized from 71.2 kg to 68.0 kg with preserved muscle, and sleep stabilized at 7.4 hrs.\n\n5. **The Specialist Review (Nov 2026 & Beyond)**: Preparing for the Nov 4 consult to transition to daily D3 maintenance and baseline DEXA planning.`;
        referencedJourneys = ['journey-deficiency', 'journey-growth', 'journey-weight', 'journey-sleep'];
        referencedRecords = ['rec-vitd-sep26', 'rec-radiology-xray'];
        followUps = [
          'Review all Health Records',
          'What should I ask Dr. Vance next week?',
          'Explain my latest blood test results',
        ];
      } else if (queryLower.includes('nutrition') || queryLower.includes('calorie') || queryLower.includes('protein') || queryLower.includes('macro') || queryLower.includes('food') || queryLower.includes('deficit')) {
        replyContent = `Here is your metabolic calorie and nutrition breakdown for today (October 27, 2026):\n\n- **Basal Metabolic Rate (BMR)**: ~1,473 kcal/day\n- **Total Daily Energy Expenditure (TDEE)**: ~2,136 kcal (with 30-min exercise + daily activity)\n- **Target Calorie Intake**: 2,150 kcal (350 kcal deficit for fat reduction)\n- **Consumed Today**: 1,540 kcal (610 kcal remaining for dinner/snack)\n- **Macros**: Protein 118g / 135g (87%), Carbs 162g / 220g (74%), Fats 48g / 65g (74%)\n- **Hydration**: 2,000 mL / 2,500 mL goal.\n\nTip: You can use the **Scan Food** tool in the Calories Tracker to take or upload a food photo for instant AI macro recognition!`;
        referencedJourneys = ['journey-weight'];
        followUps = [
          'Open Calorie Scanner',
          'Log dinner meal',
          'What are high-protein lactose-free foods?',
        ];
      } else {
        replyContent = `I've analyzed your health records and profile. As of late October 2026, your overall health trajectory is very positive:\n\n- **Vitamin D**: Reached 18 ng/mL (improving steadily on weekly 50,000 IU).\n- **Height & Bone Status**: Fixed at 178.0 cm with complete physeal fusion confirmed on radiograph.\n- **Weight**: 68.0 kg (on track toward 66.5 kg goal with lean preservation).\n- **Sleep & Habits**: 12-day bedtime streak, average sleep up to 7.4 hours.\n\nIs there a specific lab result, journey milestone, or appointment preparation detail you would like to explore deeper?`;
        referencedJourneys = ['journey-growth', 'journey-deficiency', 'journey-weight', 'journey-sleep'];
        followUps = [
          'Explain my latest blood test results',
          'What should I ask Dr. Vance next week?',
          'Synthesize my complete health history',
          'How is my daily nutrition tracking?',
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedRecordIds: referencedRecords.length > 0 ? referencedRecords : undefined,
        referencedJourneyIds: referencedJourneys.length > 0 ? referencedJourneys : undefined,
        followUpSuggestions: followUps,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAssistantThinking(false);
    }, 700);
  };

  const clearChatMessages = () => {
    setChatMessages([INITIAL_CHAT_MESSAGES[0]]);
  };

  const resetAllDemoData = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setHealthRecords(INITIAL_HEALTH_RECORDS);
    setJourneys(INITIAL_JOURNEYS);
    setHabits(INITIAL_HABITS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setNutrition(INITIAL_NUTRITION);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSelectedRecordId(null);
    setSelectedJourneyId(null);
    setSelectedAppointmentId('appt-vance-nov26');
    setCurrentPage('overview');
    localStorage.clear();
  };

  return (
    <HealthContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedRecordId,
        setSelectedRecordId,
        selectedJourneyId,
        setSelectedJourneyId,
        selectedAppointmentId,
        setSelectedAppointmentId,
        isAddRecordModalOpen,
        setIsAddRecordModalOpen,
        isLogFoodModalOpen,
        setIsLogFoodModalOpen,
        isRecordMeasurementModalOpen,
        setIsRecordMeasurementModalOpen,
        isScheduleApptModalOpen,
        setIsScheduleApptModalOpen,
        isScanFoodModalOpen,
        setIsScanFoodModalOpen,
        isFloatingChatOpen,
        setIsFloatingChatOpen,
        chatMode,
        setChatMode,
        documentaryChapters,
        userProfile,
        updateUserProfile,
        healthRecords,
        addHealthRecord,
        updateHealthRecord,
        deleteHealthRecord,
        runSimulatedRecordAI,
        journeys,
        addJourney,
        updateJourney,
        archiveJourney,
        deleteJourney,
        habits,
        toggleHabitDay,
        addHabit,
        editHabit,
        deleteHabit,
        calendarEvents,
        addCalendarEvent,
        editCalendarEvent,
        deleteCalendarEvent,
        appointments,
        updateAppointment,
        togglePrepQuestion,
        addCustomPrepQuestion,
        savePostVisitSummary,
        nutrition,
        logMeal,
        deleteMeal,
        addWater,
        chatMessages,
        isAssistantThinking,
        sendChatMessage,
        clearChatMessages,
        resetAllDemoData,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
