/**
 * Form validation utilities
 */

/**
 * Validate Korean stock symbol (6-digit code)
 * @example isValidSymbol('005930') => true
 * @example isValidSymbol('AAPL') => false
 */
export function isValidSymbol(symbol: string): boolean {
  return /^\d{6}$/.test(symbol);
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}

/**
 * Validate price (must be positive)
 */
export function isValidPrice(price: number): boolean {
  return isPositiveNumber(price);
}

/**
 * Validate quantity (must be positive integer)
 */
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0;
}

/**
 * Validate percentage (0-100)
 */
export function isValidPercentage(percent: number): boolean {
  return !isNaN(percent) && percent >= 0 && percent <= 100;
}

/**
 * Validate date string (ISO format)
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate API key format (non-empty string)
 */
export function isValidApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.trim().length > 0;
}

/**
 * Validate date range
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }
  return new Date(startDate) <= new Date(endDate);
}
