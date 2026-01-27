'use client';

import { Box, BoxProps } from '@mui/material';
import { GLASS_PAPER, GLASS_PAPER_DARK, GLASS_PAPER_LIGHT, RADIUS, SPACING, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

interface CardProps extends BoxProps {
  /**
   * Card style variant
   * - default: Standard glass morphism
   * - dark: Darker variant for nested containers
   * - light: Lighter variant for highlighted sections
   * - highlight: Lime-accented border for emphasis
   */
  variant?: 'default' | 'dark' | 'light' | 'highlight';
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
 * Terminal Lux Card Component
 *
 * Glass morphism card with consistent Terminal Lux styling.
 * Supports multiple variants and padding sizes.
 *
 * @example
 * ```tsx
 * <Card>Basic card content</Card>
 * <Card variant="highlight" padding="lg">Highlighted card</Card>
 * <Card variant="dark" padding="none">Dark nested card</Card>
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
    default: GLASS_PAPER,
    dark: GLASS_PAPER_DARK,
    light: GLASS_PAPER_LIGHT,
    highlight: {
      bgcolor: 'rgba(0, 255, 65, 0.05)',
      border: `1px solid rgba(0, 255, 65, 0.2)`,
      backdropFilter: 'blur(20px)',
      borderRadius: RADIUS.md,
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
