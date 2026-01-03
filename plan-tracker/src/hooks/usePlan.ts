import { useState } from 'react';
import type { PlanData, Day, SessionKey } from '@/types';
import {
  loadPlan,
  updateDayLog,
  resetDayLog,
  overrideDaySession,
  regeneratePlan,
  resetPlanOnly,
  resetLogsOnly,
  factoryReset,
  exportData,
  importDataReplace,
  importDataMerge,
} from '@/lib/storage';

export function usePlan() {
  const [planData, setPlanData] = useState<PlanData>(() => loadPlan());

  // Reload plan from storage (useful after imports)
  const reloadPlan = () => {
    setPlanData(loadPlan());
  };

  // Update a day's log
  const updateLog = (date: string, log: Day['log']) => {
    const updated = updateDayLog(planData, date, log);
    setPlanData(updated);
  };

  // Reset a day's log
  const resetLog = (date: string) => {
    const updated = resetDayLog(planData, date);
    setPlanData(updated);
  };

  // Override a day's session
  const overrideSession = (date: string, sessionKey: SessionKey) => {
    const updated = overrideDaySession(planData, date, sessionKey);
    setPlanData(updated);
  };

  // Regenerate plan with new date range
  const regenerate = (newStart: string, newEnd: string) => {
    const updated = regeneratePlan(planData, newStart, newEnd);
    setPlanData(updated);
  };

  // Reset operations
  const resetPlan = () => {
    const updated = resetPlanOnly(planData);
    setPlanData(updated);
  };

  const resetLogs = () => {
    const updated = resetLogsOnly(planData);
    setPlanData(updated);
  };

  const factoryResetAll = () => {
    const fresh = factoryReset();
    setPlanData(fresh);
  };

  // Export/Import
  const exportJSON = () => {
    return exportData(planData);
  };

  const importReplace = (jsonData: string) => {
    const imported = importDataReplace(jsonData);
    setPlanData(imported);
  };

  const importMerge = (jsonData: string) => {
    const merged = importDataMerge(planData, jsonData);
    setPlanData(merged);
  };

  return {
    planData,
    updateLog,
    resetLog,
    overrideSession,
    regenerate,
    resetPlan,
    resetLogs,
    factoryResetAll,
    exportJSON,
    importReplace,
    importMerge,
    reloadPlan,
  };
}
