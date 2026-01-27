/**
 * Custom hook for managing date range filters
 */

import { useState, useMemo } from 'react';
import { getToday, getDaysAgo } from '@/lib/utils/dateHelpers';

export type DateFilterPreset = 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

export function useDateRangeFilter() {
  const [preset, setPreset] = useState<DateFilterPreset>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const dateRange = useMemo<DateRange>(() => {
    const today = getToday();

    switch (preset) {
      case 'today':
        return { start: today, end: today };
      case 'week':
        return { start: getDaysAgo(7), end: today };
      case 'month':
        return { start: getDaysAgo(30), end: today };
      case 'custom':
        return customStartDate && customEndDate
          ? { start: customStartDate, end: customEndDate }
          : { start: today, end: today };
      default:
        return { start: today, end: today };
    }
  }, [preset, customStartDate, customEndDate]);

  return {
    preset,
    setPreset,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    dateRange,
  };
}
