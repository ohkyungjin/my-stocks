'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Skeleton, Chip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  COLORS,
  RADIUS,
  SPACING,
  SHADOWS,
  TIMING,
  EASING,
  GRADIENTS,
  TEXT_HERO,
  TEXT_HERO_SM,
  TEXT_DISPLAY_SM,
  TEXT_CHANGE,
  TEXT_LABEL_MD,
  TEXT_BODY_MD,
  TEXT_NUMBER_MD,
  getProfitLossColor,
  TRANSITIONS,
} from '@/lib/theme/styleConstants';

// ============================================================================
// TYPES
// ============================================================================

export interface ProfitLossHeroProps {
  /**
   * Total portfolio value
   */
  totalValue: number;
  /**
   * Today's gain/loss amount
   */
  todayChange: number;
  /**
   * Today's gain/loss percentage
   */
  todayChangePercent: number;
  /**
   * All-time gain/loss amount (optional)
   */
  allTimeChange?: number;
  /**
   * All-time gain/loss percentage (optional)
   */
  allTimeChangePercent?: number;
  /**
   * Buying power available (optional)
   */
  buyingPower?: number;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Allow hiding balance
   */
  allowHideBalance?: boolean;
  /**
   * Animate value changes
   */
  animateChanges?: boolean;
  /**
   * Show dynamic gradient background based on P/L
   */
  showGradientBg?: boolean;
  /**
   * Custom styles
   */
  sx?: object;
}

// ============================================================================
// ANIMATED NUMBER COMPONENT
// ============================================================================

interface AnimatedNumberProps {
  value: number;
  format: 'currency' | 'percent' | 'number';
  showSign?: boolean;
  duration?: number;
}

function AnimatedNumber({
  value,
  format,
  showSign = false,
  duration = 500,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = displayValue;
    const diff = value - startValue;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + diff * eased);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value, duration]);

  const formatValue = (val: number) => {
    const sign = showSign && val > 0 ? '+' : '';

    switch (format) {
      case 'currency':
        return `${sign}${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val)}`;
      case 'percent':
        return `${sign}${val.toFixed(2)}%`;
      case 'number':
      default:
        return `${sign}${val.toFixed(2)}`;
    }
  };

  return <>{formatValue(displayValue)}</>;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ProfitLossHero - Giant P/L display for dashboard header
 *
 * Inspired by Robinhood's portfolio view:
 * - Giant account value (72px font)
 * - Today's gain/loss with animation
 * - Background gradient based on P/L (green/red)
 * - Price flash animations on value changes
 * - Hide balance option for privacy
 *
 * @example
 * ```tsx
 * <ProfitLossHero
 *   totalValue={124567.89}
 *   todayChange={1234.56}
 *   todayChangePercent={1.01}
 *   allTimeChange={24567.89}
 *   allTimeChangePercent={24.55}
 *   showGradientBg
 *   animateChanges
 * />
 * ```
 */
export function ProfitLossHero({
  totalValue,
  todayChange,
  todayChangePercent,
  allTimeChange,
  allTimeChangePercent,
  buyingPower,
  isLoading = false,
  allowHideBalance = true,
  animateChanges = true,
  showGradientBg = true,
  sx = {},
}: ProfitLossHeroProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [flashClass, setFlashClass] = useState<'profit' | 'loss' | null>(null);

  // Detect value changes and trigger flash
  useEffect(() => {
    if (!animateChanges) return;

    const flashType = todayChange > 0 ? 'profit' : todayChange < 0 ? 'loss' : null;
    if (flashType) {
      setFlashClass(flashType);
      const timeout = setTimeout(() => setFlashClass(null), 200);
      return () => clearTimeout(timeout);
    }
  }, [todayChange, animateChanges]);

  const isProfit = todayChange >= 0;
  const profitColor = getProfitLossColor(todayChange);

  // Dynamic gradient based on P/L
  const backgroundGradient = useMemo(() => {
    if (!showGradientBg) return 'transparent';
    if (isProfit) {
      return `linear-gradient(180deg, rgba(0, 200, 5, 0.08) 0%, transparent 100%)`;
    }
    return `linear-gradient(180deg, rgba(255, 59, 48, 0.08) 0%, transparent 100%)`;
  }, [showGradientBg, isProfit]);

  // Hidden balance display
  const hiddenValue = '*****.**';

  if (isLoading) {
    return (
      <Box
        sx={{
          padding: SPACING[6],
          background: backgroundGradient,
          ...sx,
        }}
      >
        <Skeleton
          variant="text"
          width={200}
          height={80}
          sx={{ bgcolor: COLORS.background.secondary }}
        />
        <Skeleton
          variant="text"
          width={150}
          height={32}
          sx={{ bgcolor: COLORS.background.secondary, mt: 1 }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        padding: SPACING[6],
        background: backgroundGradient,
        transition: `background ${TIMING.slow} ${EASING.default}`,
        // Flash animation
        ...(flashClass === 'profit' && {
          animation: `flashProfit ${TIMING.priceFlash} ${EASING.out}`,
        }),
        ...(flashClass === 'loss' && {
          animation: `flashLoss ${TIMING.priceFlash} ${EASING.out}`,
        }),
        '@keyframes flashProfit': {
          '0%': { backgroundColor: 'rgba(0, 200, 5, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        '@keyframes flashLoss': {
          '0%': { backgroundColor: 'rgba(255, 59, 48, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        ...sx,
      }}
    >
      {/* Balance Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography
          sx={{
            ...TEXT_LABEL_MD,
            color: COLORS.text.tertiary,
          }}
        >
          PORTFOLIO VALUE
        </Typography>
        {allowHideBalance && (
          <Box
            component="button"
            onClick={() => setIsBalanceHidden(!isBalanceHidden)}
            sx={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: SPACING[1],
              borderRadius: RADIUS.sm,
              color: COLORS.text.tertiary,
              display: 'flex',
              alignItems: 'center',
              transition: TRANSITIONS.color,
              '&:hover': {
                color: COLORS.text.secondary,
              },
            }}
          >
            {isBalanceHidden ? (
              <VisibilityOffIcon sx={{ fontSize: 20 }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: 20 }} />
            )}
          </Box>
        )}
      </Box>

      {/* Main Value - Giant Typography */}
      <Typography
        sx={{
          ...TEXT_HERO,
          color: COLORS.text.primary,
          letterSpacing: '-0.03em',
          // Responsive font size
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
        }}
      >
        {isBalanceHidden ? (
          hiddenValue
        ) : animateChanges ? (
          <AnimatedNumber value={totalValue} format="currency" />
        ) : (
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(totalValue)
        )}
      </Typography>

      {/* Today's Change */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 2,
        }}
      >
        {/* Trend Icon */}
        {isProfit ? (
          <TrendingUpIcon sx={{ fontSize: 24, color: profitColor }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 24, color: profitColor }} />
        )}

        {/* Change Amount */}
        <Typography
          sx={{
            ...TEXT_CHANGE,
            color: profitColor,
            fontWeight: 600,
          }}
        >
          {isBalanceHidden ? (
            '***.**'
          ) : animateChanges ? (
            <AnimatedNumber value={todayChange} format="currency" showSign />
          ) : (
            `${todayChange >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(todayChange)}`
          )}
        </Typography>

        {/* Change Percentage */}
        <Chip
          size="small"
          label={
            isBalanceHidden ? (
              '**.**%'
            ) : animateChanges ? (
              <AnimatedNumber value={todayChangePercent} format="percent" showSign />
            ) : (
              `${todayChangePercent >= 0 ? '+' : ''}${todayChangePercent.toFixed(2)}%`
            )
          }
          sx={{
            backgroundColor: isProfit ? COLORS.success.bg : COLORS.danger.bg,
            color: profitColor,
            fontWeight: 600,
            fontSize: '0.875rem',
            height: 28,
            '& .MuiChip-label': {
              px: 1.5,
            },
          }}
        />

        {/* Today Label */}
        <Typography
          sx={{
            ...TEXT_BODY_MD,
            color: COLORS.text.tertiary,
          }}
        >
          TODAY
        </Typography>
      </Box>

      {/* All-time Change (optional) */}
      {allTimeChange !== undefined && allTimeChangePercent !== undefined && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 1,
          }}
        >
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: getProfitLossColor(allTimeChange),
              fontWeight: 500,
            }}
          >
            {isBalanceHidden ? (
              '***.**'
            ) : (
              `${allTimeChange >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(allTimeChange)}`
            )}{' '}
            ({allTimeChangePercent >= 0 ? '+' : ''}{allTimeChangePercent.toFixed(2)}%)
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.text.tertiary,
            }}
          >
            ALL TIME
          </Typography>
        </Box>
      )}

      {/* Buying Power (optional) */}
      {buyingPower !== undefined && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 3,
            pt: 3,
            borderTop: `1px solid ${COLORS.border.separator}`,
          }}
        >
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.text.secondary,
            }}
          >
            Buying Power
          </Typography>
          <Typography
            sx={{
              ...TEXT_NUMBER_MD,
              color: COLORS.text.primary,
              fontWeight: 600,
            }}
          >
            {isBalanceHidden
              ? hiddenValue
              : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(buyingPower)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ProfitLossHero;
