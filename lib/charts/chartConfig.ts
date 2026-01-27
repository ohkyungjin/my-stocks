/**
 * Lightweight Charts Configuration
 * Chart color schemes and default options
 */

import { DeepPartial, ChartOptions, ColorType } from 'lightweight-charts';

export interface ChartColors {
  background: string;
  text: string;
  grid: string;
  upColor: string;
  downColor: string;
  resistanceLine: string;
  volumeUp: string;
  volumeDown: string;
  orderLine: string;
}

/**
 * Get chart colors based on theme mode
 */
export function getChartColors(isDark: boolean): ChartColors {
  return {
    background: isDark ? '#131722' : '#FFFFFF',
    text: isDark ? '#D1D4DC' : '#1F2937',
    grid: isDark ? '#2A2E39' : '#E5E7EB',
    upColor: '#089981',
    downColor: '#F23645',
    resistanceLine: '#F59E0B',
    volumeUp: 'rgba(8, 153, 129, 0.3)',
    volumeDown: 'rgba(242, 54, 69, 0.3)',
    orderLine: '#3B82F6',
  };
}

/**
 * Get default chart options
 */
export function getChartOptions(
  colors: ChartColors,
  height: number,
  width: number
): DeepPartial<ChartOptions> {
  return {
    layout: {
      background: { type: ColorType.Solid, color: colors.background },
      textColor: colors.text,
    },
    grid: {
      vertLines: { color: colors.grid },
      horzLines: { color: colors.grid },
    },
    width,
    height,
    rightPriceScale: {
      borderColor: colors.grid,
    },
    timeScale: {
      borderColor: colors.grid,
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: 1,
    },
  };
}

/**
 * Candlestick series options
 */
export function getCandlestickSeriesOptions(colors: ChartColors) {
  return {
    upColor: colors.upColor,
    downColor: colors.downColor,
    borderUpColor: colors.upColor,
    borderDownColor: colors.downColor,
    wickUpColor: colors.upColor,
    wickDownColor: colors.downColor,
  };
}

/**
 * Volume series options
 */
export function getVolumeSeriesOptions() {
  return {
    color: '#26a69a',
    priceFormat: {
      type: 'volume' as const,
    },
    priceScaleId: 'volume',
  };
}

/**
 * Volume scale margins
 */
export const VOLUME_SCALE_MARGINS = {
  top: 0.7,
  bottom: 0,
};
