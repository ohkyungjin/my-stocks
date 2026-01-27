import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Format number with commas for thousands separator
 * @example formatNumber(1234567.89) => "1,234,567.89"
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format currency in Korean Won (KRW)
 * @example formatCurrency(1234567) => "₩1,234,567"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage with + or - sign
 * @example formatPercent(15.75) => "+15.75%"
 * @example formatPercent(-3.25) => "-3.25%"
 */
export function formatPercent(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K, M, B suffixes
 * @example formatCompact(1234567) => "1.23M"
 */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '-';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  } else if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(2)}M`;
  } else if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(2)}K`;
  }
  return `${sign}${absValue.toFixed(0)}`;
}

/**
 * Format volume with Korean units (만 = 10K, 억 = 100M)
 * @example formatVolume(12345678) => "1,234만"
 */
export function formatVolume(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '-';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 100_000_000) {
    // 억 (hundred million)
    return `${sign}${formatNumber(absValue / 100_000_000, 0)}억`;
  } else if (absValue >= 10_000) {
    // 만 (ten thousand)
    return `${sign}${formatNumber(absValue / 10_000, 0)}만`;
  }
  return `${sign}${formatNumber(absValue, 0)}`;
}

/**
 * Format date in Korean format
 * @example formatDate('2024-01-18T10:30:00Z') => "2024년 1월 18일"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy년 M월 d일', { locale: ko });
  } catch {
    return '-';
  }
}

/**
 * Format date with time in Korean format
 * @example formatDateTime('2024-01-18T10:30:00Z') => "2024년 1월 18일 10:30"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'yyyy년 M월 d일 HH:mm', { locale: ko });
  } catch {
    return '-';
  }
}

/**
 * Format time only
 * @example formatTime('2024-01-18T10:30:00Z') => "10:30"
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm', { locale: ko });
  } catch {
    return '-';
  }
}

/**
 * Format relative time (e.g., "3 hours ago")
 * @example formatRelativeTime('2024-01-18T07:30:00Z') => "3시간 전"
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { locale: ko, addSuffix: true });
  } catch {
    return '-';
  }
}

/**
 * Format stock symbol with name
 * @example formatSymbol('005930', '삼성전자') => "005930 삼성전자"
 */
export function formatSymbol(symbol: string, name?: string): string {
  if (!name) return symbol;
  return `${symbol} ${name}`;
}

/**
 * Get color class for positive/negative values
 * @example getColorClass(5.5) => "text-gain"
 * @example getColorClass(-2.3) => "text-loss"
 */
export function getColorClass(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value) || value === 0) {
    return 'text-text-secondary';
  }
  return value > 0 ? 'text-gain' : 'text-loss';
}

/**
 * Get sign prefix for numbers
 * @example getSign(5.5) => "+"
 * @example getSign(-2.3) => "-"
 */
export function getSign(value: number): string {
  if (value > 0) return '+';
  if (value < 0) return '-';
  return '';
}
