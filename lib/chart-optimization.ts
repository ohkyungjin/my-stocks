/**
 * 차트 최적화 유틸리티
 *
 * 차트 라이브러리 사용 최적화 및 성능 개선
 */

/**
 * 데이터 다운샘플링
 *
 * 차트에 표시할 데이터 포인트가 너무 많을 경우 다운샘플링하여 성능 향상
 *
 * @param data - 원본 데이터 배열
 * @param maxPoints - 최대 포인트 수 (기본값: 500)
 * @returns 다운샘플링된 데이터
 */
export function downsampleData<T>(data: T[], maxPoints: number = 500): T[] {
  if (data.length <= maxPoints) {
    return data;
  }

  const step = Math.ceil(data.length / maxPoints);
  const downsampled: T[] = [];

  for (let i = 0; i < data.length; i += step) {
    downsampled.push(data[i]);
  }

  // 마지막 데이터 포인트는 항상 포함
  if (downsampled[downsampled.length - 1] !== data[data.length - 1]) {
    downsampled.push(data[data.length - 1]);
  }

  return downsampled;
}

/**
 * LTTB (Largest Triangle Three Buckets) 알고리즘
 *
 * 시계열 데이터 다운샘플링 알고리즘으로 데이터의 시각적 특성을 유지
 *
 * @param data - 원본 데이터 (x, y 좌표)
 * @param threshold - 목표 데이터 포인트 수
 * @returns 다운샘플링된 데이터
 */
export function lttbDownsample(
  data: Array<{ x: number; y: number }>,
  threshold: number
): Array<{ x: number; y: number }> {
  if (data.length <= threshold) {
    return data;
  }

  const sampled: Array<{ x: number; y: number }> = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  // 첫 번째 포인트는 항상 포함
  sampled.push(data[0]);

  for (let i = 0; i < threshold - 2; i++) {
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    const avgRangeLength = avgRangeEnd - avgRangeStart;

    // 다음 버킷의 평균 포인트 계산
    let avgX = 0;
    let avgY = 0;

    for (let j = avgRangeStart; j < avgRangeEnd && j < data.length; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }

    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    // 현재 버킷에서 삼각형 면적이 가장 큰 포인트 선택
    const rangeStart = Math.floor(i * bucketSize) + 1;
    const rangeEnd = Math.floor((i + 1) * bucketSize) + 1;

    let maxArea = -1;
    let maxAreaPoint = data[rangeStart];

    const pointA = sampled[sampled.length - 1];

    for (let j = rangeStart; j < rangeEnd && j < data.length; j++) {
      const pointB = data[j];

      // 삼각형 면적 계산
      const area = Math.abs(
        (pointA.x - avgX) * (pointB.y - pointA.y) -
          (pointA.x - pointB.x) * (avgY - pointA.y)
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = pointB;
      }
    }

    sampled.push(maxAreaPoint);
  }

  // 마지막 포인트는 항상 포함
  sampled.push(data[data.length - 1]);

  return sampled;
}

/**
 * 데이터 메모이제이션 키 생성
 *
 * 차트 데이터 캐싱을 위한 고유 키 생성
 *
 * @param params - 쿼리 파라미터
 * @returns 메모이제이션 키
 */
export function createChartCacheKey(params: Record<string, any>): string {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

/**
 * Recharts 최적화 Props
 *
 * Recharts 컴포넌트에 적용할 최적화 props
 */
export const rechartsOptimizationProps = {
  // 애니메이션 비활성화 (대량 데이터 시)
  isAnimationActive: false,

  // 툴팁 공유 설정
  shared: true,

  // 성능 최적화
  syncId: 'chart-sync',
  syncMethod: 'value',
} as const;

/**
 * Lightweight Charts 최적화 옵션
 *
 * Lightweight Charts 라이브러리 최적화 설정
 */
export const lightweightChartsOptimizationOptions = {
  // 크로스헤어 최적화
  crosshair: {
    mode: 1, // Normal mode
    vertLine: {
      labelBackgroundColor: '#2962FF',
    },
    horzLine: {
      labelBackgroundColor: '#2962FF',
    },
  },

  // 그리드 최적화
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      color: '#eee',
    },
  },

  // 시간 스케일 최적화
  timeScale: {
    rightOffset: 12,
    barSpacing: 3,
    fixLeftEdge: false,
    lockVisibleTimeRangeOnResize: true,
    rightBarStaysOnScroll: true,
    borderVisible: false,
    visible: true,
    timeVisible: true,
    secondsVisible: false,
  },

  // 레이아웃 최적화
  layout: {
    background: { color: '#ffffff' },
    textColor: '#333',
  },

  // 핸들 스크롤 최적화
  handleScroll: {
    mouseWheel: true,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: true,
  },

  // 핸들 스케일 최적화
  handleScale: {
    axisPressedMouseMove: {
      time: true,
      price: true,
    },
    axisDoubleClickReset: {
      time: true,
      price: true,
    },
    mouseWheel: true,
    pinch: true,
  },
} as const;

/**
 * 차트 데이터 검증
 *
 * 차트에 표시할 데이터의 유효성 검증
 *
 * @param data - 검증할 데이터
 * @returns 유효 여부
 */
export function validateChartData(data: any[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // 첫 번째 요소 검증
  const firstItem = data[0];
  if (typeof firstItem !== 'object' || firstItem === null) {
    return false;
  }

  return true;
}

/**
 * 차트 색상 팔레트
 *
 * 일관된 차트 색상 사용
 */
export const chartColorPalette = {
  primary: '#2962FF',
  secondary: '#00C853',
  danger: '#FF5252',
  warning: '#FFC107',
  info: '#00B0FF',
  success: '#00E676',
  bullish: '#26A69A',
  bearish: '#EF5350',
  neutral: '#78909C',
  grid: '#E0E0E0',
  text: '#424242',
  background: '#FFFFFF',
} as const;

/**
 * 차트 리사이즈 디바운스
 *
 * 차트 리사이즈 이벤트 최적화
 *
 * @param callback - 리사이즈 콜백
 * @param delay - 디바운스 딜레이 (ms)
 * @returns 디바운스된 함수
 */
export function debounceResize(
  callback: () => void,
  delay: number = 300
): () => void {
  let timeoutId: NodeJS.Timeout;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * 차트 인터랙션 쓰로틀
 *
 * 차트 인터랙션 이벤트 최적화
 *
 * @param callback - 이벤트 콜백
 * @param delay - 쓰로틀 딜레이 (ms)
 * @returns 쓰로틀된 함수
 */
export function throttleInteraction<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 100
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}
