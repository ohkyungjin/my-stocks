'use client';

import { Box, BoxProps } from '@mui/material';
import { CARD_DEFAULT, CARD_ELEVATED, CARD_HIGHLIGHT, RADIUS, SPACING, COLORS, SHADOWS } from '@/lib/theme/styleConstants';

interface CardProps extends BoxProps {
  /**
   * Card style variant
   * - default: Standard tertiary background surface (#1A1A1A)
   * - secondary: Secondary background (#0D0D0D)
   * - elevated: Elevated surface with shadow
   * - highlight: Purple-accented border with glow
   */
  variant?: 'default' | 'secondary' | 'elevated' | 'highlight';
  /**
   * Padding size preset
   * - none: No padding
   * - sm: 12px
   * - md: 16px (default)
   * - lg: 24px
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * FinFlow Dark Card Component
 *
 * Modern fintech card with true black backgrounds and minimal shadows.
 * Supports multiple surface levels and padding sizes.
 *
 * @example
 * ```tsx
 * <Card>Basic card content</Card>
 * <Card variant="highlight" padding="lg">Highlighted card</Card>
 * <Card variant="elevated" padding="none">Elevated card</Card>
 * ```
 */
export function Card({
  variant = 'default',
  padding = 'md',
  children,
  sx,
  ...props
}: CardProps) {
  const paddingMap = {
    none: 0,
    sm: SPACING[3],
    md: SPACING[4],
    lg: SPACING[6],
  };

  const variants = {
    default: CARD_DEFAULT,
    secondary: {
      bgcolor: COLORS.background.secondary,
      borderRadius: RADIUS.md,
      border: `1px solid ${COLORS.border.default}`,
      boxShadow: SHADOWS.none,
    },
    elevated: CARD_ELEVATED,
    highlight: CARD_HIGHLIGHT,
  };

  return (
    <Box
      sx={[
        variants[variant],
        {
          p: paddingMap[padding],
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {children}
    </Box>
  );
}
