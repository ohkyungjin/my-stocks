'use client';

import { forwardRef, useState } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress, Box } from '@mui/material';
import {
  COLORS,
  RADIUS,
  SPACING,
  SHADOWS,
  TIMING,
  EASING,
  TRANSITIONS,
  TEXT_HEADING_SM,
  TEXT_HEADING_MD,
  TOUCH_TARGET,
  BUTTON_BUY,
  BUTTON_SELL,
} from '@/lib/theme/styleConstants';

// ============================================================================
// TYPES
// ============================================================================

export type TradeAction = 'buy' | 'sell';

export interface TradeButtonProps extends Omit<MuiButtonProps, 'variant' | 'color' | 'action'> {
  /**
   * Trade action type
   * - buy: Green button (Robinhood green)
   * - sell: Red button (Vibrant red)
   */
  action: TradeAction;
  /**
   * Stock symbol (e.g., "AAPL")
   */
  symbol?: string;
  /**
   * Trade amount in USD (optional, for display)
   */
  amount?: number;
  /**
   * Show loading spinner and disable button
   */
  isLoading?: boolean;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Show glow effect on hover
   */
  showGlow?: boolean;
  /**
   * Haptic feedback (vibration) on click
   */
  hapticFeedback?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * TradeButton - Buy/Sell CTA buttons
 *
 * Robinhood-inspired trading buttons:
 * - Buy button: Vibrant green (#00C805) - excitement, growth
 * - Sell button: Vibrant red (#FF3B30) - urgency, caution
 * - Large touch targets for mobile
 * - Smooth spring animations
 * - Optional glow effects on hover
 * - Haptic feedback support
 *
 * @example
 * ```tsx
 * // Simple Buy/Sell
 * <TradeButton action="buy">Buy AAPL</TradeButton>
 * <TradeButton action="sell">Sell AAPL</TradeButton>
 *
 * // With amount
 * <TradeButton action="buy" symbol="AAPL" amount={1000}>
 *   Buy $1,000
 * </TradeButton>
 *
 * // Loading state
 * <TradeButton action="buy" isLoading>
 *   Processing...
 * </TradeButton>
 *
 * // Side by side
 * <Box sx={{ display: 'flex', gap: 2 }}>
 *   <TradeButton action="buy" fullWidth>Buy</TradeButton>
 *   <TradeButton action="sell" fullWidth>Sell</TradeButton>
 * </Box>
 * ```
 */
export const TradeButton = forwardRef<HTMLButtonElement, TradeButtonProps>(
  (
    {
      action,
      symbol,
      amount,
      isLoading = false,
      fullWidth = false,
      size = 'large',
      showGlow = true,
      hapticFeedback = true,
      disabled,
      children,
      onClick,
      sx,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const isBuy = action === 'buy';
    const baseColor = isBuy ? COLORS.success : COLORS.danger;

    // Handle click with optional haptic feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback if supported
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
      onClick?.(e);
    };

    // Size configurations
    const sizeConfig = {
      small: {
        py: SPACING[2],
        px: SPACING[4],
        fontSize: '0.875rem',
        minHeight: TOUCH_TARGET.min,
      },
      medium: {
        py: SPACING[3],
        px: SPACING[6],
        fontSize: '1rem',
        minHeight: TOUCH_TARGET.comfortable,
      },
      large: {
        py: SPACING[4],
        px: SPACING[8],
        fontSize: '1.125rem',
        minHeight: TOUCH_TARGET.large,
      },
    };

    const currentSize = sizeConfig[size];

    // Generate button label if not provided
    const buttonLabel = children || (
      <>
        {isBuy ? 'Buy' : 'Sell'}
        {symbol && ` ${symbol}`}
        {amount && ` $${amount.toLocaleString()}`}
      </>
    );

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || isLoading}
        fullWidth={fullWidth}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        sx={[
          {
            // Base styles
            backgroundColor: baseColor.main,
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: currentSize.fontSize,
            fontFamily: 'inherit',
            letterSpacing: '-0.01em',
            textTransform: 'none',
            borderRadius: RADIUS.sm,
            border: 'none',
            boxShadow: SHADOWS.none,
            minHeight: currentSize.minHeight,
            py: currentSize.py,
            px: currentSize.px,
            position: 'relative',
            overflow: 'hidden',
            transition: `all ${TIMING.fast} ${EASING.spring}`,

            // Hover state
            '&:hover': {
              backgroundColor: baseColor.dark,
              boxShadow: showGlow
                ? isBuy
                  ? SHADOWS.glow.success
                  : SHADOWS.glow.danger
                : SHADOWS.none,
              transform: 'translateY(-1px)',
            },

            // Active/Pressed state
            '&:active': {
              transform: 'scale(0.98)',
              boxShadow: SHADOWS.none,
            },

            // Focus state
            '&:focus-visible': {
              outline: `2px solid ${baseColor.light}`,
              outlineOffset: 2,
            },

            // Disabled state
            '&:disabled': {
              backgroundColor: COLORS.background.elevated,
              color: COLORS.text.disabled,
              boxShadow: SHADOWS.none,
              transform: 'none',
            },

            // Pressed visual
            ...(isPressed && {
              transform: 'scale(0.98)',
            }),
          },
          // Merge custom sx
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {/* Ripple effect on top */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Loading spinner */}
        {isLoading && (
          <CircularProgress
            size={20}
            sx={{
              color: 'inherit',
              mr: 1,
            }}
          />
        )}

        {/* Button text */}
        <span style={{ position: 'relative', zIndex: 1 }}>{buttonLabel}</span>
      </MuiButton>
    );
  }
);

TradeButton.displayName = 'TradeButton';

// ============================================================================
// COMPOUND COMPONENTS
// ============================================================================

/**
 * BuyButton - Shorthand for TradeButton with action="buy"
 */
export const BuyButton = forwardRef<HTMLButtonElement, Omit<TradeButtonProps, 'action'>>(
  (props, ref) => <TradeButton ref={ref} action="buy" {...props} />
);
BuyButton.displayName = 'BuyButton';

/**
 * SellButton - Shorthand for TradeButton with action="sell"
 */
export const SellButton = forwardRef<HTMLButtonElement, Omit<TradeButtonProps, 'action'>>(
  (props, ref) => <TradeButton ref={ref} action="sell" {...props} />
);
SellButton.displayName = 'SellButton';

// ============================================================================
// TRADE BUTTON GROUP
// ============================================================================

export interface TradeButtonGroupProps {
  /**
   * Stock symbol
   */
  symbol?: string;
  /**
   * Buy button click handler
   */
  onBuyClick?: () => void;
  /**
   * Sell button click handler
   */
  onSellClick?: () => void;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state (shows on both buttons)
   */
  isLoading?: boolean;
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Custom styles
   */
  sx?: object;
}

/**
 * TradeButtonGroup - Side-by-side Buy/Sell buttons
 *
 * @example
 * ```tsx
 * <TradeButtonGroup
 *   symbol="AAPL"
 *   onBuyClick={() => openTradeModal('buy')}
 *   onSellClick={() => openTradeModal('sell')}
 * />
 * ```
 */
export function TradeButtonGroup({
  symbol,
  onBuyClick,
  onSellClick,
  disabled,
  isLoading,
  size = 'large',
  sx = {},
}: TradeButtonGroupProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: SPACING[3],
        ...sx,
      }}
    >
      <BuyButton
        symbol={symbol}
        onClick={onBuyClick}
        disabled={disabled}
        isLoading={isLoading}
        size={size}
        fullWidth
      >
        Buy
      </BuyButton>
      <SellButton
        symbol={symbol}
        onClick={onSellClick}
        disabled={disabled}
        isLoading={isLoading}
        size={size}
        fullWidth
      >
        Sell
      </SellButton>
    </Box>
  );
}

export default TradeButton;
