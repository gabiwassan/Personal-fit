import type { PlanData, Day, SessionKey } from '@/types';
import { WEEKLY_TEMPLATE } from '@/data/sessions';
import { generateDateRange, getDayOfWeek, getToday } from './dateUtils';

const STORAGE_KEY = 'plan-tracker:v1';

/**
 * Generate a training plan from start to end date
 */
export function generatePlan(
  startDate: string,
  endDate: string,
  existingDays: Day[] = []
): Day[] {
  const dates = generateDateRange(startDate, endDate);
  const existingLogsMap = new Map(
    existingDays.map(day => [day.date, day])
  );

  return dates.map(date => {
    const dayOfWeek = getDayOfWeek(date);
    const sessionKey: SessionKey = WEEKLY_TEMPLATE[dayOfWeek];
    const existing = existingLogsMap.get(date);

    return {
      date,
      sessionKey,
      overrideSessionKey: existing?.overrideSessionKey,
      log: existing?.log,
    };
  });
}

/**
 * Load plan data from localStorage
 */
export function loadPlan(): PlanData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as PlanData;
      return data;
    }
  } catch (error) {
    console.error('Error loading plan:', error);
  }

  // Generate default plan from today to 2026-02-15
  const today = getToday();
  const endDate = '2026-02-15';

  const defaultPlan: PlanData = {
    version: 1,
    rangeStart: today,
    rangeEnd: endDate,
    days: generatePlan(today, endDate),
  };

  savePlan(defaultPlan);
  return defaultPlan;
}

/**
 * Save plan data to localStorage
 */
export function savePlan(data: PlanData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving plan:', error);
  }
}

/**
 * Update a single day's log
 */
export function updateDayLog(
  planData: PlanData,
  date: string,
  log: Day['log']
): PlanData {
  const updatedDays = planData.days.map(day =>
    day.date === date ? { ...day, log } : day
  );

  const updatedPlan = { ...planData, days: updatedDays };
  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Reset a single day's log
 */
export function resetDayLog(planData: PlanData, date: string): PlanData {
  const updatedDays = planData.days.map(day =>
    day.date === date ? { ...day, log: undefined } : day
  );

  const updatedPlan = { ...planData, days: updatedDays };
  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Override a day's session type
 */
export function overrideDaySession(
  planData: PlanData,
  date: string,
  sessionKey: SessionKey
): PlanData {
  const updatedDays = planData.days.map(day =>
    day.date === date ? { ...day, overrideSessionKey: sessionKey } : day
  );

  const updatedPlan = { ...planData, days: updatedDays };
  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Regenerate plan with new date range (preserves existing logs)
 */
export function regeneratePlan(
  planData: PlanData,
  newStart: string,
  newEnd: string
): PlanData {
  const newDays = generatePlan(newStart, newEnd, planData.days);

  const updatedPlan: PlanData = {
    ...planData,
    rangeStart: newStart,
    rangeEnd: newEnd,
    days: newDays,
  };

  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Reset plan only (keep logs)
 */
export function resetPlanOnly(planData: PlanData): PlanData {
  const newDays = generatePlan(
    planData.rangeStart,
    planData.rangeEnd,
    planData.days
  );

  const updatedPlan = { ...planData, days: newDays };
  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Reset logs only (keep plan)
 */
export function resetLogsOnly(planData: PlanData): PlanData {
  const updatedDays = planData.days.map(day => ({
    ...day,
    log: undefined,
  }));

  const updatedPlan = { ...planData, days: updatedDays };
  savePlan(updatedPlan);
  return updatedPlan;
}

/**
 * Factory reset (wipe everything)
 */
export function factoryReset(): PlanData {
  localStorage.removeItem(STORAGE_KEY);
  return loadPlan();
}

/**
 * Export data as JSON
 */
export function exportData(planData: PlanData): string {
  return JSON.stringify(planData, null, 2);
}

/**
 * Import data from JSON (replace mode)
 */
export function importDataReplace(jsonData: string): PlanData {
  try {
    const data = JSON.parse(jsonData) as PlanData;
    savePlan(data);
    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid JSON data');
  }
}

/**
 * Import data from JSON (merge mode - keeps existing logs, adds new ones)
 */
export function importDataMerge(planData: PlanData, jsonData: string): PlanData {
  try {
    const importedData = JSON.parse(jsonData) as PlanData;

    // Create a map of existing logs
    const logsMap = new Map(
      planData.days
        .filter(day => day.log)
        .map(day => [day.date, day])
    );

    // Merge with imported data (imported data takes precedence)
    importedData.days.forEach(importedDay => {
      if (importedDay.log) {
        logsMap.set(importedDay.date, importedDay);
      }
    });

    // Regenerate plan with merged logs
    const mergedDays = generatePlan(
      planData.rangeStart,
      planData.rangeEnd,
      Array.from(logsMap.values())
    );

    const updatedPlan = { ...planData, days: mergedDays };
    savePlan(updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid JSON data');
  }
}
