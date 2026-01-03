export type SessionKey =
  | 'asian-walk'
  | 'walk-or-jog'
  | 'long-walk'
  | 'strength-a'
  | 'strength-b'
  | 'rest';

export type SessionCategory = 'Cardio' | 'Strength' | 'Cardio/Base' | 'Recovery';
export type SessionIntensity = 'Easy' | 'Medium' | 'Easy-Medium' | '—';
export type Mood = 'good' | 'ok' | 'bad';

export interface SessionDefinition {
  key: SessionKey;
  title: string;
  description: string;
  howTo: string;
  defaultMinutes: number;
  category: SessionCategory;
  intensity: SessionIntensity;
  icon: string;
}

export interface DayLog {
  completed: boolean;
  minutes: number;
  rpe?: number; // 1-10
  mood?: Mood;
  notes?: string;
  timestamp?: number;
}

export interface Day {
  date: string; // YYYY-MM-DD
  sessionKey: SessionKey;
  overrideSessionKey?: SessionKey;
  log?: DayLog;
}

export interface PlanData {
  version: number;
  rangeStart: string; // YYYY-MM-DD
  rangeEnd: string; // YYYY-MM-DD
  days: Day[];
}

export type FilterType = 'All' | 'Completed' | 'Pending' | 'Cardio' | 'Strength' | 'Recovery';

export interface WeekSummary {
  weekStart: string; // YYYY-MM-DD (Monday)
  totalMinutes: number;
  completedSessions: number;
  totalSessions: number;
  avgRpe?: number;
}

export interface Stats {
  totalMinutes: number;
  completedSessions: number;
  totalTrainingSessions: number; // Excludes rest days
  totalSessions: number; // Includes all days
  trainingCompliance: number; // percentage (excludes rest days)
  overallCompliance: number; // percentage (includes all days)
  currentStreak: number;
  bestStreak: number;
  sessionsByType: Record<SessionKey, number>;
  cardioMinutes: number;
  strengthMinutes: number;
  weeklyMinutes: WeekSummary[];
  consistencyScore: number; // 0-100
  avgRpe?: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
}
