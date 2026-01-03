import type { PlanData, Stats, WeekSummary, Insight, Day } from '@/types';
import { SESSION_DEFINITIONS } from '@/data/sessions';
import { groupByWeek, getWeekStart, getToday } from './dateUtils';
import { parseISO, differenceInDays } from 'date-fns';

/**
 * Calculate all statistics from plan data
 */
export function calculateStats(planData: PlanData): Stats {
  const { days } = planData;
  const completedDays = days.filter(day => day.log?.completed);

  const trainingDays = days.filter(day => {
    const sessionKey = day.overrideSessionKey || day.sessionKey;
    return sessionKey !== 'rest';
  });

  const completedTrainingDays = trainingDays.filter(day => day.log?.completed);

  // Total minutes
  const totalMinutes = completedDays.reduce(
    (sum, day) => sum + (day.log?.minutes || 0),
    0
  );

  // Compliance
  const trainingCompliance =
    trainingDays.length > 0
      ? (completedTrainingDays.length / trainingDays.length) * 100
      : 0;

  const overallCompliance =
    days.length > 0 ? (completedDays.length / days.length) * 100 : 0;

  // Sessions by type
  const sessionsByType = completedDays.reduce((acc, day) => {
    const sessionKey = day.overrideSessionKey || day.sessionKey;
    acc[sessionKey] = (acc[sessionKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cardio vs Strength minutes
  let cardioMinutes = 0;
  let strengthMinutes = 0;

  completedDays.forEach(day => {
    const sessionKey = day.overrideSessionKey || day.sessionKey;
    const session = SESSION_DEFINITIONS[sessionKey];
    const minutes = day.log?.minutes || 0;

    if (session.category === 'Cardio' || session.category === 'Cardio/Base') {
      cardioMinutes += minutes;
    } else if (session.category === 'Strength') {
      strengthMinutes += minutes;
    }
  });

  // Streaks
  const { currentStreak, bestStreak } = calculateStreaks(days);

  // Weekly summaries
  const weeklyMinutes = calculateWeeklySummaries(days);

  // Consistency score
  const consistencyScore = calculateConsistencyScore(
    trainingCompliance,
    weeklyMinutes,
    currentStreak
  );

  // Average RPE
  const rpeValues = completedDays
    .map(day => day.log?.rpe)
    .filter((rpe): rpe is number => rpe !== undefined);
  const avgRpe =
    rpeValues.length > 0
      ? rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length
      : undefined;

  return {
    totalMinutes,
    completedSessions: completedDays.length,
    totalTrainingSessions: trainingDays.length,
    totalSessions: days.length,
    trainingCompliance,
    overallCompliance,
    currentStreak,
    bestStreak,
    sessionsByType: sessionsByType as any,
    cardioMinutes,
    strengthMinutes,
    weeklyMinutes,
    consistencyScore,
    avgRpe,
  };
}

/**
 * Calculate current and best streaks
 */
function calculateStreaks(days: Day[]): {
  currentStreak: number;
  bestStreak: number;
} {
  const today = getToday();
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let lastCompletedDate: string | null = null;

  sortedDays.forEach(day => {
    // Only count training days (not rest days)
    const sessionKey = day.overrideSessionKey || day.sessionKey;
    if (sessionKey === 'rest') return;

    // Don't count future days
    if (day.date > today) return;

    if (day.log?.completed) {
      if (lastCompletedDate === null) {
        tempStreak = 1;
      } else {
        const dayDiff = differenceInDays(
          parseISO(day.date),
          parseISO(lastCompletedDate)
        );

        // Count consecutive training days (allowing for rest days in between)
        if (dayDiff <= 3) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }

      lastCompletedDate = day.date;
      bestStreak = Math.max(bestStreak, tempStreak);

      // Current streak only counts if it extends to today
      if (day.date === today) {
        currentStreak = tempStreak;
      }
    } else {
      // Reset current streak if we hit an incomplete day before today
      if (day.date < today) {
        tempStreak = 0;
        currentStreak = 0;
      }
    }
  });

  return { currentStreak, bestStreak };
}

/**
 * Calculate weekly summaries
 */
function calculateWeeklySummaries(days: Day[]): WeekSummary[] {
  const weeks = groupByWeek(days.map(d => d.date));
  const summaries: WeekSummary[] = [];

  weeks.forEach(weekDates => {
    const weekStart = getWeekStart(weekDates[0]);
    const weekDays = days.filter(day => weekDates.includes(day.date));
    const completedDays = weekDays.filter(day => day.log?.completed);

    const totalMinutes = completedDays.reduce(
      (sum, day) => sum + (day.log?.minutes || 0),
      0
    );

    const rpeValues = completedDays
      .map(day => day.log?.rpe)
      .filter((rpe): rpe is number => rpe !== undefined);

    const avgRpe =
      rpeValues.length > 0
        ? rpeValues.reduce((sum, rpe) => sum + rpe, 0) / rpeValues.length
        : undefined;

    summaries.push({
      weekStart,
      totalMinutes,
      completedSessions: completedDays.length,
      totalSessions: weekDays.length,
      avgRpe,
    });
  });

  return summaries;
}

/**
 * Calculate consistency score (0-100)
 * - 60% from training compliance
 * - 20% from weekly minutes stability (lower variance = higher score)
 * - 20% from streak contribution
 */
function calculateConsistencyScore(
  trainingCompliance: number,
  weeklyMinutes: WeekSummary[],
  currentStreak: number
): number {
  // Component 1: Training compliance (60%)
  const complianceScore = (trainingCompliance / 100) * 60;

  // Component 2: Weekly minutes stability (20%)
  let stabilityScore = 0;
  if (weeklyMinutes.length >= 2) {
    const minutes = weeklyMinutes.map(w => w.totalMinutes);
    const avg = minutes.reduce((sum, m) => sum + m, 0) / minutes.length;
    const variance =
      minutes.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) /
      minutes.length;
    const stdDev = Math.sqrt(variance);

    // Lower std dev = higher score (normalize to 0-20)
    const maxStdDev = 200; // Assume max std dev of 200 minutes
    stabilityScore = Math.max(0, 20 - (stdDev / maxStdDev) * 20);
  }

  // Component 3: Streak contribution (20%)
  // Max out at 7-day streak
  const streakScore = Math.min((currentStreak / 7) * 20, 20);

  return Math.round(complianceScore + stabilityScore + streakScore);
}

/**
 * Generate insights based on real data
 */
export function generateInsights(planData: PlanData, stats: Stats): Insight[] {
  const insights: Insight[] = [];
  const today = getToday();
  const weeklyMinutes = stats.weeklyMinutes;

  // Find current week and last week
  const currentWeek = weeklyMinutes.find(w => {
    const weekStart = getWeekStart(today);
    return w.weekStart === weekStart;
  });

  const lastWeekIndex = weeklyMinutes.findIndex(
    w => w.weekStart === currentWeek?.weekStart
  );
  const lastWeek = lastWeekIndex > 0 ? weeklyMinutes[lastWeekIndex - 1] : null;

  // Insight 1: Weekly minutes comparison
  if (currentWeek && lastWeek) {
    const diff = currentWeek.totalMinutes - lastWeek.totalMinutes;
    const percentChange =
      lastWeek.totalMinutes > 0
        ? Math.round((diff / lastWeek.totalMinutes) * 100)
        : 0;

    if (diff > 0) {
      insights.push({
        id: 'weekly-minutes-up',
        title: 'Great Progress!',
        description: `This week you logged ${currentWeek.totalMinutes} minutes (+${percentChange}% vs last week).`,
        type: 'success',
      });
    } else if (diff < 0) {
      insights.push({
        id: 'weekly-minutes-down',
        title: 'Activity Decreased',
        description: `This week you logged ${currentWeek.totalMinutes} minutes (${percentChange}% vs last week).`,
        type: 'warning',
      });
    }
  }

  // Insight 2: Strength consistency
  const strengthDays = planData.days.filter(day => {
    const sessionKey = day.overrideSessionKey || day.sessionKey;
    const session = SESSION_DEFINITIONS[sessionKey];
    return session.category === 'Strength' && day.date <= today;
  });

  if (lastWeek && strengthDays.length > 0) {
    const lastWeekStrengthDays = strengthDays.filter(day => {
      const weekStart = lastWeek.weekStart;
      const weekEnd = getWeekStart(
        new Date(
          parseISO(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString()
      );
      return day.date >= weekStart && day.date < weekEnd;
    });

    const completedStrength = lastWeekStrengthDays.filter(
      day => day.log?.completed
    ).length;
    const totalStrength = lastWeekStrengthDays.length;

    if (completedStrength === totalStrength && totalStrength > 0) {
      insights.push({
        id: 'strength-perfect',
        title: 'Perfect Strength Week!',
        description: `Completed all ${totalStrength} strength sessions last week.`,
        type: 'success',
      });
    } else if (totalStrength > 0) {
      insights.push({
        id: 'strength-consistency',
        title: 'Strength Consistency',
        description: `Completed ${completedStrength} of ${totalStrength} planned strength sessions last week.`,
        type: 'info',
      });
    }
  }

  // Insight 3: RPE trend
  if (weeklyMinutes.length >= 2) {
    const recentWeeks = weeklyMinutes.slice(-2);
    const [prev, current] = recentWeeks;

    if (
      prev?.avgRpe !== undefined &&
      current?.avgRpe !== undefined
    ) {
      const rpeDiff = current.avgRpe - prev.avgRpe;

      if (rpeDiff > 1) {
        insights.push({
          id: 'rpe-increasing',
          title: 'Effort Trending Up',
          description: `Average RPE increased by ${rpeDiff.toFixed(1)} over the last 2 weeks. Consider keeping tomorrow easy.`,
          type: 'warning',
        });
      } else if (rpeDiff < -1) {
        insights.push({
          id: 'rpe-decreasing',
          title: 'Good Recovery',
          description: `Average RPE decreased by ${Math.abs(rpeDiff).toFixed(1)} over the last 2 weeks. You're recovering well!`,
          type: 'success',
        });
      } else {
        insights.push({
          id: 'rpe-stable',
          title: 'Effort Stable',
          description: `Average RPE steady at ${current.avgRpe.toFixed(1)} over the last 2 weeks. Continue as planned.`,
          type: 'info',
        });
      }
    }
  }

  // Insight 4: Streak motivation
  if (stats.currentStreak >= 3) {
    insights.push({
      id: 'streak-active',
      title: `${stats.currentStreak}-Day Streak!`,
      description: `You're on a roll! Keep it going.`,
      type: 'success',
    });
  }

  // Insight 5: Compliance check
  if (stats.trainingCompliance < 50 && planData.days.length > 7) {
    insights.push({
      id: 'compliance-low',
      title: 'Stay Consistent',
      description: `Training compliance is ${Math.round(stats.trainingCompliance)}%. Small steps every day add up!`,
      type: 'warning',
    });
  }

  return insights.slice(0, 4); // Return max 4 insights
}
