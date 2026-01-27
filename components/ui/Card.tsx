'use client';

import { Box, BoxProps } from '@mui/material';
import { CARD_PRIMARY, CARD_SECONDARY, CARD_ELEVATED, RADIUS, SPACING, COLORS } from '@/lib/theme/styleConstants';

interface CardProps extends BoxProps {
  /**
   * Card style variant
   * - default: Standard slate-800 surface
   * - secondary: Lighter slate-700 variant
   * - elevated: Elevated slate-600 with strong shadow
   * - highlight: Purple-accented border for emphasis
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
 * Modern fintech card with soft shadows and rounded corners.
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
    default: CARD_PRIMARY,
    secondary: CARD_SECONDARY,
    elevated: CARD_ELEVATED,
    highlight: {
      bgcolor: COLORS.primary.subtle,
      border: `1px solid ${COLORS.primary.main}`,
      borderRadius: RADIUS.lg,
      boxShadow: `0 0 0 1px ${COLORS.primary.glow}`,
    },
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
