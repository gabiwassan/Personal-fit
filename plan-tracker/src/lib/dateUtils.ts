import {
  format,
  parseISO,
  startOfDay,
  addDays,
  differenceInDays,
  getDay,
  startOfWeek,
  endOfWeek,
  isSameWeek,
  isToday as isTodayFns
} from 'date-fns';

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getToday(): string {
  return format(startOfDay(new Date()), 'yyyy-MM-dd');
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable format
 */
export function formatDate(dateStr: string, formatStr: string = 'MMM d, yyyy'): string {
  return format(parseISO(dateStr), formatStr);
}

/**
 * Format a date string to a short format (e.g., "Mon, Jan 3")
 */
export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, MMM d');
}

/**
 * Get day of week (0 = Monday, 6 = Sunday)
 */
export function getDayOfWeek(dateStr: string): number {
  const day = getDay(parseISO(dateStr));
  // Convert Sunday (0) to 6, and shift others down by 1
  return day === 0 ? 6 : day - 1;
}

/**
 * Generate an array of date strings from start to end (inclusive)
 */
export function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  const days = differenceInDays(endDate, startDate) + 1;

  for (let i = 0; i < days; i++) {
    dates.push(format(addDays(startDate, i), 'yyyy-MM-dd'));
  }

  return dates;
}

/**
 * Get week start (Monday) for a given date
 */
export function getWeekStart(dateStr: string): string {
  return format(startOfWeek(parseISO(dateStr), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

/**
 * Get week end (Sunday) for a given date
 */
export function getWeekEnd(dateStr: string): string {
  return format(endOfWeek(parseISO(dateStr), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

/**
 * Check if two dates are in the same week
 */
export function areSameWeek(date1: string, date2: string): boolean {
  return isSameWeek(parseISO(date1), parseISO(date2), { weekStartsOn: 1 });
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string): boolean {
  return isTodayFns(parseISO(dateStr));
}

/**
 * Group dates by week (returns array of weeks, each week is array of dates)
 */
export function groupByWeek(dates: string[]): string[][] {
  const weeks: string[][] = [];
  let currentWeek: string[] = [];
  let currentWeekStart: string | null = null;

  dates.forEach(date => {
    const weekStart = getWeekStart(date);

    if (currentWeekStart === null || currentWeekStart !== weekStart) {
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      currentWeek = [date];
      currentWeekStart = weekStart;
    } else {
      currentWeek.push(date);
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Get relative week label (e.g., "This Week", "Last Week", "Week of Jan 3")
 */
export function getWeekLabel(weekStartDate: string): string {
  const today = getToday();
  const thisWeekStart = getWeekStart(today);

  if (weekStartDate === thisWeekStart) {
    return 'This Week';
  }

  const diff = differenceInDays(parseISO(thisWeekStart), parseISO(weekStartDate));

  if (diff === 7) {
    return 'Last Week';
  }

  return `Week of ${formatDate(weekStartDate, 'MMM d')}`;
}
