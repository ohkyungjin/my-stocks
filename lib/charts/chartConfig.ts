/**
 * Lightweight Charts Configuration
 * Chart color schemes and default options
 *
 * FinFlow Dark Edition - Korean Market Standards
 * - Upward/Profit candles: Robinhood Green (#00C805)
 * - Downward/Loss candles: Vibrant Red (#FF3B30)
 * - True black background (#000000)
 * - Subtle grid lines for OLED displays
 */

import { DeepPartial, ChartOptions, ColorType } from 'lightweight-charts';
import { COLORS } from '@/lib/theme/styleConstants';

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
 * FinFlow Dark: True black with vibrant profit/loss colors
 */
export function getChartColors(isDark: boolean): ChartColors {
  if (isDark) {
    // FinFlow Dark - Revolutionary fintech colors
    return {
      background: COLORS.background.pure,           // True black (#000000)
      text: COLORS.text.secondary,                  // High contrast gray
      grid: COLORS.chart.grid,                      // Subtle grid (rgba 0.05)
      upColor: COLORS.semantic.profit,              // Robinhood green
      downColor: COLORS.semantic.loss,              // Vibrant red
      resistanceLine: COLORS.warning.main,          // iOS orange
      volumeUp: COLORS.semantic.profitAlpha,        // Green with alpha
      volumeDown: COLORS.semantic.lossAlpha,        // Red with alpha
      orderLine: COLORS.secondary.main,             // Cyan blue
    };
  } else {
    // Light mode (fallback)
    return {
      background: '#FFFFFF',
      text: '#1F2937',
      grid: '#E5E7EB',
      upColor: '#00C805',
      downColor: '#FF3B30',
      resistanceLine: '#FF9500',
      volumeUp: 'rgba(0, 200, 5, 0.3)',
      volumeDown: 'rgba(255, 59, 48, 0.3)',
      orderLine: '#5AC8FA',
    };
  }
}

/**
 * Get default chart options
 * FinFlow Dark: OLED-optimized true black with subtle accents
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
      fontSize: 12,
      fontFamily: 'var(--font-inter), "Pretendard Variable", -apple-system, sans-serif',
    },
    grid: {
      vertLines: {
        color: colors.grid,
        style: 0,  // Solid lines
        visible: true,
      },
      horzLines: {
        color: colors.grid,
        style: 0,
        visible: true,
      },
    },
    width,
    height,
    rightPriceScale: {
      borderColor: colors.grid,
      textColor: colors.text,
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    timeScale: {
      borderColor: colors.grid,
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: 1,  // Normal crosshair
      vertLine: {
        color: COLORS.border.light,
        width: 1,
        style: 2,  // Dashed
        labelBackgroundColor: COLORS.background.elevated,
      },
      horzLine: {
        color: COLORS.border.light,
        width: 1,
        style: 2,  // Dashed
        labelBackgroundColor: COLORS.background.elevated,
      },
    },
    handleScale: {
      axisPressedMouseMove: {
        time: true,
        price: true,
      },
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
    },
  };
}

/**
 * Candlestick series options
 * Korean market: Green up, Red down
 */
export function getCandlestickSeriesOptions(colors: ChartColors) {
  return {
    upColor: colors.upColor,           // Body fill - profit green
    downColor: colors.downColor,       // Body fill - loss red
    borderUpColor: colors.upColor,     // Border - profit green
    borderDownColor: colors.downColor, // Border - loss red
    wickUpColor: colors.upColor,       // Wick - profit green
    wickDownColor: colors.downColor,   // Wick - loss red
  };
}

/**
 * Volume series options
 * Color-coded: Green for up days, Red for down days
 */
export function getVolumeSeriesOptions() {
  return {
    color: COLORS.chart.volume,  // Default purple volume
    priceFormat: {
      type: 'volume' as const,
    },
    priceScaleId: 'volume',
    lastValueVisible: false,
  };
}

/**
 * Volume scale margins
 */
export const VOLUME_SCALE_MARGINS = {
  top: 0.7,
  bottom: 0,
};
