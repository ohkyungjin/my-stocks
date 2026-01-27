/**
 * 전략 파라미터 설정 정의
 *
 * 각 파라미터의 라벨, 설명, 범위, 기본값 등을 정의합니다.
 */

export interface ParameterConfig {
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  default: number | boolean;
  unit?: string;
  type?: 'slider' | 'input' | 'boolean';
  valueLabelFormat?: (value: number) => string;
}

export const parameterConfig: Record<string, ParameterConfig> = {
  // Common parameters
  lookback_months: {
    label: '분석 기간',
    description: '과거 데이터 분석 기간',
    min: 1,
    max: 12,
    step: 1,
    default: 6,
    unit: '개월',
  },
  resistance_range: {
    label: '저항선 범위',
    description: '저항선 범위 허용 오차',
    min: 0.5,
    max: 10.0,
    step: 0.5,
    default: 3.0,
    unit: '%',
  },
  min_trading_value: {
    label: '최소 거래대금',
    description: '최소 거래대금 필터',
    min: 10000000,
    max: 10000000000000,
    step: 100000000,
    default: 100000000,
    unit: '원',
    type: 'input',
  },

  // Volume Breakout specific
  min_days_since_max_volume: {
    label: '최대 거래량일 이후 최소 경과일',
    description: '최대 거래량 날짜가 이 일수 이상 경과해야 시그널 생성 (최근 급등 제외)',
    min: 7,
    max: 90,
    step: 1,
    default: 30,
    unit: '일',
    type: 'input',
  },
  same_day_surge_threshold: {
    label: '당일 급등 필터',
    description: '전일 대비 또는 저항선 대비 급등 종목 제외 (0 = 비활성화)',
    min: 0,
    max: 20,
    step: 1,
    default: 5,
    unit: '%',
  },

  // Bearish Volume Resistance specific
  min_days_since_bearish: {
    label: '음봉 이후 최소 경과일',
    description: '음봉 발생 후 최소 경과 일수',
    min: 7,
    max: 90,
    step: 1,
    default: 20,
    unit: '일',
  },
  min_candle_drop: {
    label: '최소 음봉 낙폭',
    description: '최소 음봉 낙폭 비율',
    min: 3,
    max: 20,
    step: 0.5,
    default: 5.0,
    unit: '%',
  },
  max_upper_shadow_ratio: {
    label: '최대 윗꼬리 비율',
    description: '윗꼬리가 몸통 대비 최대 비율 (낮을수록 아래로 꽂힌 형태)',
    min: 0.1,
    max: 1.0,
    step: 0.1,
    default: 0.5,
    unit: '',
    valueLabelFormat: (value: number) => `${(value * 100).toFixed(0)}%`,
  },
  max_lower_shadow_ratio: {
    label: '최대 아래꼬리 비율',
    description: '아래꼬리가 몸통 대비 최대 비율 (낮을수록 장대음봉)',
    min: 0.1,
    max: 1.0,
    step: 0.1,
    default: 0.3,
    unit: '',
    valueLabelFormat: (value: number) => `${(value * 100).toFixed(0)}%`,
  },
  max_current_volume_ratio: {
    label: '최대 현재 거래량 비율',
    description: '현재 거래량이 음봉 거래량의 N배 이상이면 제외 (새 이벤트)',
    min: 1.5,
    max: 5.0,
    step: 0.5,
    default: 2.0,
    unit: '배',
  },
  surge_filter_enabled: {
    label: '급등 후 조정 필터',
    description: '급등 후 조정 패턴 종목 제외',
    type: 'boolean',
    default: true,
  },
  surge_lookback_days: {
    label: '급등 확인 기간',
    description: '음봉 전 급등 확인 기간',
    min: 7,
    max: 60,
    step: 1,
    default: 20,
    unit: '일',
  },
  surge_threshold: {
    label: '급등 임계값',
    description: '급등으로 판단하는 상승 비율',
    min: 10,
    max: 50,
    step: 5,
    default: 20,
    unit: '%',
  },
};

/**
 * 전략별 사용 파라미터 매핑
 */
export const strategyParameters: Record<string, string[]> = {
  volume_breakout: [
    'lookback_months',
    'resistance_range',
    'min_trading_value',
    'min_days_since_max_volume',
    'same_day_surge_threshold',
  ],
  bearish_volume_resistance: [
    'lookback_months',
    'resistance_range',
    'min_trading_value',
    'min_days_since_bearish',
    'min_candle_drop',
    'max_upper_shadow_ratio',
    'max_lower_shadow_ratio',
    'max_current_volume_ratio',
    'surge_filter_enabled',
    'surge_lookback_days',
    'surge_threshold',
  ],
};

/**
 * 거래대금 값을 사람이 읽기 쉬운 형식으로 변환
 */
export function formatTradingValue(value: number): string {
  if (value >= 1000000000000) {
    const jo = value / 1000000000000;
    return jo % 1 === 0 ? `${jo.toFixed(0)}조원` : `${jo.toFixed(1)}조원`;
  }
  if (value >= 100000000000) return `${(value / 100000000000).toFixed(0)}천억원`;
  if (value >= 10000000000) return `${(value / 10000000000).toFixed(0)}백억원`;
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(0)}십억원`;
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억원`;
  return `${value.toLocaleString()}원`;
}
