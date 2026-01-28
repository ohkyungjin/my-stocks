'use client';

import { Box, BoxProps } from '@mui/material';
import { TEXT_CAPTION, COLORS, RADIUS, SPACING } from '@/lib/theme/styleConstants';

interface BadgeProps extends BoxProps {
  /**
   * Badge color variant
   * - default: Neutral tertiary background
   * - success: Robinhood green (#00C805) for positive states (profit)
   * - warning: Amber for warnings
   * - error: Vibrant red (#FF3B30) for errors (loss)
   * - info: Blue for informational
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Badge size
   * - sm: Small, compact
   * - md: Medium (default)
   */
  size?: 'sm' | 'md';
}

/**
 * FinFlow Dark Badge Component
 *
 * Modern status badge with semantic colors for tags, status, and metadata.
 * Uses rounded corners and soft colors for a friendly fintech aesthetic.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Failed</Badge>
 * <Badge variant="warning">Pending</Badge>
 * ```
 */
export function Badge({
  variant = 'default',
  size = 'md',
  children,
  sx,
  ...props
}: BadgeProps) {
  const variants = {
    default: {
      bgcolor: COLORS.background.tertiary,
      color: COLORS.text.secondary,
      border: `1px solid ${COLORS.border.default}`,
    },
    success: {
      bgcolor: COLORS.success.bg,
      color: COLORS.success.main,
      border: `1px solid ${COLORS.success.subtle}`,
    },
    warning: {
      bgcolor: COLORS.warning.bg,
      color: COLORS.warning.main,
      border: `1px solid ${COLORS.warning.subtle}`,
    },
    error: {
      bgcolor: COLORS.danger.bg,
      color: COLORS.danger.main,
      border: `1px solid ${COLORS.danger.subtle}`,
    },
    info: {
      bgcolor: COLORS.info.bg,
      color: COLORS.info.main,
      border: `1px solid ${COLORS.info.subtle}`,
    },
  };

  const sizes = {
    sm: { px: SPACING[2], py: '0.375rem' },  // 8px horizontal, 6px vertical
    md: { px: SPACING[3], py: SPACING[1] },  // 12px horizontal, 4px vertical
  };

  return (
    <Box
      component="span"
      sx={[
        TEXT_CAPTION,
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: RADIUS.sm,
          whiteSpace: 'nowrap',
          fontWeight: 600,
        },
        sizes[size],
        variants[variant],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {children}
    </Box>
  );
}
