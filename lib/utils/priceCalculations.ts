/**
 * 가격 계산 유틸리티 함수
 *
 * 목표가, 손절가 등의 가격 계산 로직을 중앙화
 */

/**
 * 퍼센트를 기준으로 가격 계산
 * @param basePrice 기준 가격
 * @param percent 퍼센트 (양수/음수 모두 가능)
 * @returns 계산된 가격 (정수)
 */
export function calculatePriceFromPercent(basePrice: number, percent: number): number {
  return Math.round(basePrice * (1 + percent / 100));
}

/**
 * 타입에 따라 가격 계산 (금액 직접 입력 또는 퍼센트)
 * @param type 'amount' 또는 'percent'
 * @param amountValue 금액 값 (문자열)
 * @param percentValue 퍼센트 값 (문자열)
 * @param basePrice 기준 가격 (퍼센트 계산 시 필요)
 * @returns 계산된 가격 또는 undefined
 */
export function calculatePriceByType(
  type: 'amount' | 'percent',
  amountValue?: string,
  percentValue?: string,
  basePrice?: number
): number | undefined {
  if (type === 'amount' && amountValue) {
    const parsed = parseFloat(amountValue);
    return isNaN(parsed) ? undefined : parsed;
  } else if (type === 'percent' && percentValue && basePrice) {
    const percent = parseFloat(percentValue);
    return isNaN(percent) ? undefined : calculatePriceFromPercent(basePrice, percent);
  }
  return undefined;
}

/**
 * 목표가(익절가) 계산
 * @param type 'amount' 또는 'percent'
 * @param amount 금액 값
 * @param percent 퍼센트 값
 * @param currentPrice 현재 가격
 * @returns 목표가
 */
export function calculateTargetPrice(
  type: 'amount' | 'percent',
  amount?: string,
  percent?: string,
  currentPrice?: number
): number | undefined {
  return calculatePriceByType(type, amount, percent, currentPrice);
}

/**
 * 손절가 계산
 * @param type 'amount' 또는 'percent'
 * @param amount 금액 값
 * @param percent 퍼센트 값 (음수)
 * @param currentPrice 현재 가격
 * @returns 손절가
 */
export function calculateStopLossPrice(
  type: 'amount' | 'percent',
  amount?: string,
  percent?: string,
  currentPrice?: number
): number | undefined {
  return calculatePriceByType(type, amount, percent, currentPrice);
}

/**
 * 거래 수수료 계산
 * @param amount 거래 금액
 * @param feeRate 수수료율 (기본값: 0.001 = 0.1%)
 * @returns 수수료
 */
export function calculateTradingFee(amount: number, feeRate: number = 0.001): number {
  return Math.round(amount * feeRate);
}

/**
 * 증권거래세 계산 (매도 시)
 * @param amount 매도 금액
 * @param taxRate 세율 (기본값: 0.0025 = 0.25%)
 * @returns 세금
 */
export function calculateTransactionTax(amount: number, taxRate: number = 0.0025): number {
  return Math.round(amount * taxRate);
}

/**
 * 총 거래 비용 계산 (수수료 + 세금)
 * @param amount 거래 금액
 * @param isSell 매도 여부 (매도 시 세금 포함)
 * @returns 총 비용
 */
export function calculateTotalTradingCost(amount: number, isSell: boolean = false): number {
  const fee = calculateTradingFee(amount);
  const tax = isSell ? calculateTransactionTax(amount) : 0;
  return fee + tax;
}
