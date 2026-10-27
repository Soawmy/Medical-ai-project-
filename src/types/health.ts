/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId =
  | 'overview'
  | 'profile'
  | 'records'
  | 'journeys'
  | 'streaks'
  | 'calendar'
  | 'assistant'
  | 'nutrition'
  | 'appointment_detail';

export interface UserProfile {
  fullName: string;
  dob: string;
  age: number;
  biologicalSex: 'female' | 'male' | 'other';
  pronouns: string;
  intro: string;
  heightCm: number;
  currentWeightKg: number;
  preferredUnits: 'metric' | 'imperial';
  avatarUrl: string;
  bannerGradient: string;
  healthGoals: string[];
  foodPreferences: string[];
  allergies: string[];
  conditions: string[];
  medications: string[];
  treatmentPlans: string[];
  medicalHistory: string[];
  healthcareProviders: {
    id: string;
    name: string;
    specialty: string;
    clinic: string;
    contact: string;
  }[];
}

export type RecordCategory =
  | 'lab'
  | 'radiology'
  | 'clinical_notes'
  | 'prescriptions'
  | 'other';

export interface LabTestItem {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  minNormal: number;
  maxNormal: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  previousValue?: string;
  flagNotes?: string;
}

export interface AIAnalysisReport {
  summary: string;
  keyFindings: string[];
  attentionItems: string[];
  earlierComparison: string;
  questionsForDoctor: string[];
  limitations: string;
  simulatedTimestamp: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  category: RecordCategory;
  date: string;
  facility: string;
  clinician: string;
  journeyId?: string;
  aiAnalysisStatus: 'analyzed' | 'pending' | 'review_needed';
  previewImageUrl?: string;
  fileType: 'image' | 'pdf' | 'document' | 'report';
  fileName: string;
  fileSize: string;
  notes?: string;
  labItems?: LabTestItem[];
  radiologyFindings?: {
    modality: string;
    bodyPart: string;
    indication: string;
    impression: string;
  };
  aiAnalysis?: AIAnalysisReport;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface JourneyTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface HealthJourney {
  id: string;
  title: string;
  category: 'growth' | 'deficiency' | 'nutrition' | 'sleep' | 'chronic' | 'wellness';
  status: 'active' | 'completed' | 'archived';
  description: string;
  startDate: string;
  targetMetricName: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  metricUnit: string;
  relatedRecordIds: string[];
  relatedMedications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    adherenceRate: number;
    sideEffects?: string;
  }[];
  upcomingTasks: JourneyTask[];
  milestones: JourneyMilestone[];
  historyPoints: { date: string; value: number }[];
  aiClinicalInsights: {
    summary: string;
    recommendedQuestions: string[];
    missingDataSuggestions: string[];
    scientificContext: string;
  };
}

export interface HabitItem {
  id: string;
  name: string;
  category: 'sleep' | 'nutrition' | 'hydration' | 'fitness' | 'medication' | 'mindfulness';
  iconName: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  currentStreak: number;
  bestStreak: number;
  targetTime?: string;
  reminderEnabled: boolean;
  startDate: string;
  completedDates: string[]; // YYYY-MM-DD
}

export type EventCategory =
  | 'appointment'
  | 'medication_period'
  | 'lab_test'
  | 'radiology'
  | 'followup_reminder'
  | 'personal_goal';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  journeyId?: string;
  notes?: string;
  reminder: string;
  appointmentId?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  journeyId: string;
  prepQuestions: {
    id: string;
    text: string;
    checked: boolean;
    isCustom?: boolean;
  }[];
  prepDocuments: {
    id: string;
    recordId: string;
    title: string;
    ready: boolean;
  }[];
  prepSymptoms: {
    id: string;
    text: string;
    loggedDate: string;
    checked: boolean;
  }[];
  visitNotes: string;
  inVisitQuestions: string[];
  postVisitSummary?: {
    discussed: string;
    conclusion: string;
    recommendedActions: string[];
    medicationInstructions: string[];
    testsOrFollowUps: string[];
    unansweredQuestions: string[];
    savedAt: string;
  };
}

export interface MealItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface DailyNutrition {
  date: string;
  calorieTarget: number;
  caloriesConsumed: number;
  proteinGrams: number;
  proteinTarget: number;
  carbsGrams: number;
  carbsTarget: number;
  fatGrams: number;
  fatTarget: number;
  waterMl: number;
  waterTargetMl: number;
  meals: MealItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referencedRecordIds?: string[];
  referencedJourneyIds?: string[];
  followUpSuggestions?: string[];
}

export interface HealthDocumentaryChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  timeframe: string;
  narrative: string;
  clinicalTakeaway: string;
  clinicianQuote: {
    doctorName: string;
    specialty: string;
    quote: string;
  };
  metricsHighlight: {
    label: string;
    value: string;
    comparison?: string;
  }[];
  milestoneRecordId?: string;
  journeyId?: string;
  tags: string[];
}

export interface ScannedFoodAnalysis {
  dishName: string;
  confidence: number;
  portionEstimated: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  micronutrients: { name: string; amount: string; clinicalBenefit: string }[];
  dietaryFitNotes: string;
}

