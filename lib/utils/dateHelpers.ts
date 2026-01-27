/**
 * Date utility helpers for filter panels and date calculations
 */

export const getToday = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFirstDayOfMonth = (): string => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
};

export const getDateRange = (
  type: 'today' | 'week' | 'month' | 'quarter'
): { start_date: string; end_date: string } => {
  const today = getToday();

  switch (type) {
    case 'today':
      return { start_date: today, end_date: today };
    case 'week':
      return { start_date: getDaysAgo(7), end_date: today };
    case 'month':
      return { start_date: getFirstDayOfMonth(), end_date: today };
    case 'quarter':
      return { start_date: getDaysAgo(90), end_date: today };
    default:
      return { start_date: today, end_date: today };
  }
};

/**
 * Convert YYYYMMDD date string to Unix timestamp (seconds)
 * Uses UTC to avoid timezone issues in chart display
 */
export const dateStringToTimestamp = (dateStr: string): number => {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1;
  const day = parseInt(dateStr.substring(6, 8), 10);
  // Use UTC to avoid timezone offset issues (KST = UTC+9)
  return Math.floor(Date.UTC(year, month, day) / 1000);
};
