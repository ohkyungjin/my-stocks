'use client';

import { useState, useRef, useMemo } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowForwardIos as ArrowIcon,
} from '@mui/icons-material';
import {
  COLORS,
  RADIUS,
  SPACING,
  SHADOWS,
  TIMING,
  EASING,
  TRANSITIONS,
  TEXT_HEADING_SM,
  TEXT_NUMBER_MD,
  TEXT_BODY_SM,
  TEXT_LABEL_SM,
  getProfitLossColor,
  TOUCH_TARGET,
} from '@/lib/theme/styleConstants';

// ============================================================================
// TYPES
// ============================================================================

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparklineData?: number[];
  isWatchlisted?: boolean;
}

export interface StockCardProps {
  /**
   * Stock data to display
   */
  stock: StockData;
  /**
   * Card click handler (navigate to stock detail)
   */
  onClick?: () => void;
  /**
   * Swipe left action (add to watchlist)
   */
  onSwipeLeft?: () => void;
  /**
   * Swipe right action (quick trade)
   */
  onSwipeRight?: () => void;
  /**
   * Toggle watchlist
   */
  onToggleWatchlist?: () => void;
  /**
   * Show sparkline chart
   */
  showSparkline?: boolean;
  /**
   * Compact mode (smaller height)
   */
  compact?: boolean;
  /**
   * Custom styles
   */
  sx?: object;
}

// ============================================================================
// SPARKLINE COMPONENT
// ============================================================================

interface MicroSparklineProps {
  data: number[];
  isProfit: boolean;
  width?: number;
  height?: number;
}

function MicroSparkline({ data, isProfit, width = 80, height = 32 }: MicroSparklineProps) {
  const pathD = useMemo(() => {
    if (!data || data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const color = isProfit ? COLORS.success.main : COLORS.danger.main;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sparkline-gradient-${isProfit}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {pathD && (
        <path
          d={`${pathD} L ${width},${height} L 0,${height} Z`}
          fill={`url(#sparkline-gradient-${isProfit})`}
        />
      )}

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          animation: `drawSparkline 500ms ${EASING.out} forwards`,
        }}
      />

      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * height}
          r={3}
          fill={color}
          style={{
            opacity: 0,
            animation: `fadeIn 200ms ${EASING.out} 400ms forwards`,
          }}
        />
      )}

      <style>{`
        @keyframes drawSparkline {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * StockCard - Swipeable stock item
 *
 * Inspired by Robinhood/Webull watchlist items:
 * - Tap to view full chart
 * - Swipe left to add to watchlist (future)
 * - Swipe right for quick trade (future)
 * - Sparkline showing 7-day price trend
 * - Color-coded profit/loss
 *
 * @example
 * ```tsx
 * <StockCard
 *   stock={{
 *     symbol: 'AAPL',
 *     name: 'Apple Inc.',
 *     price: 178.72,
 *     change: 2.34,
 *     changePercent: 1.33,
 *     sparklineData: [170, 172, 175, 173, 176, 178, 179],
 *   }}
 *   onClick={() => router.push('/stock/AAPL')}
 *   showSparkline
 * />
 * ```
 */
export function StockCard({
  stock,
  onClick,
  onSwipeLeft,
  onSwipeRight,
  onToggleWatchlist,
  showSparkline = true,
  compact = false,
  sx = {},
}: StockCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef(0);

  const isProfit = stock.change >= 0;
  const profitColor = getProfitLossColor(stock.change);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPressed(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - touchStartX.current;
    // Limit swipe distance
    setSwipeX(Math.max(-80, Math.min(80, diff)));
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (swipeX > 60) {
      onSwipeRight?.();
    } else if (swipeX < -60) {
      onSwipeLeft?.();
    }
    setSwipeX(0);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Format change
  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  return (
    <Box
      component="div"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: compact ? SPACING[3] : SPACING[4],
        backgroundColor: COLORS.background.tertiary,
        borderRadius: RADIUS.md,
        border: `1px solid ${COLORS.border.default}`,
        cursor: 'pointer',
        userSelect: 'none',
        transition: TRANSITIONS.cardHover,
        transform: isPressed ? 'scale(0.98)' : `translateX(${swipeX}px)`,
        '&:hover': {
          backgroundColor: COLORS.background.elevated,
          borderColor: COLORS.border.light,
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        '&:focus-visible': {
          outline: `2px solid ${COLORS.primary.main}`,
          outlineOffset: 2,
        },
        ...sx,
      }}
    >
      {/* Left: Symbol & Name */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{
              ...TEXT_HEADING_SM,
              color: COLORS.text.primary,
              fontWeight: 700,
            }}
          >
            {stock.symbol}
          </Typography>
          {stock.isWatchlisted !== undefined && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist?.();
              }}
              sx={{
                padding: 0.5,
                color: stock.isWatchlisted ? COLORS.warning.main : COLORS.text.tertiary,
                '&:hover': {
                  color: COLORS.warning.main,
                  backgroundColor: 'transparent',
                },
              }}
            >
              {stock.isWatchlisted ? (
                <StarIcon sx={{ fontSize: 16 }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          )}
        </Box>
        <Typography
          sx={{
            ...TEXT_BODY_SM,
            color: COLORS.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 120,
          }}
        >
          {stock.name}
        </Typography>
      </Box>

      {/* Center: Sparkline */}
      {showSparkline && stock.sparklineData && stock.sparklineData.length > 1 && (
        <Box sx={{ mx: 2, flexShrink: 0 }}>
          <MicroSparkline data={stock.sparklineData} isProfit={isProfit} />
        </Box>
      )}

      {/* Right: Price & Change */}
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography
          sx={{
            ...TEXT_NUMBER_MD,
            color: COLORS.text.primary,
          }}
        >
          {formatPrice(stock.price)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          {isProfit ? (
            <TrendingUpIcon sx={{ fontSize: 14, color: profitColor }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, color: profitColor }} />
          )}
          <Typography
            sx={{
              ...TEXT_BODY_SM,
              color: profitColor,
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatChange(stock.change, stock.changePercent)}
          </Typography>
        </Box>
      </Box>

      {/* Chevron */}
      <ArrowIcon
        sx={{
          fontSize: 16,
          color: COLORS.text.tertiary,
          ml: 1,
          transition: TRANSITIONS.transform,
          '.MuiBox-root:hover &': {
            transform: 'translateX(2px)',
          },
        }}
      />
    </Box>
  );
}

export default StockCard;
