'use client';

import { Box, BoxProps } from '@mui/material';
import { MONO_TEXT_XS, TERMINAL_COLORS, COLORS_EXTENDED, RADIUS, SPACING } from '@/lib/theme/styleConstants';

interface BadgeProps extends BoxProps {
  /**
   * Badge color variant
   * - default: Neutral gray
   * - success: Green for positive states
   * - warning: Amber for warnings
   * - error: Red/pink for errors
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
 * Terminal Lux Badge Component
 *
 * Status badge with semantic colors for displaying tags, status, and metadata.
 * Supports multiple variants for different contexts.
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
      bgcolor: COLORS_EXTENDED.alpha.white[10],
      color: 'rgba(255,255,255,0.8)',
      border: `1px solid ${COLORS_EXTENDED.alpha.white[10]}`,
    },
    success: {
      bgcolor: 'rgba(0, 255, 65, 0.1)',
      color: TERMINAL_COLORS.lime,
      border: '1px solid rgba(0, 255, 65, 0.3)',
    },
    warning: {
      bgcolor: 'rgba(245, 158, 11, 0.1)',
      color: COLORS_EXTENDED.status.warning,
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    error: {
      bgcolor: 'rgba(255, 0, 110, 0.1)',
      color: TERMINAL_COLORS.pink,
      border: '1px solid rgba(255, 0, 110, 0.3)',
    },
    info: {
      bgcolor: 'rgba(59, 130, 246, 0.1)',
      color: COLORS_EXTENDED.status.info,
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
  };

  const sizes = {
    sm: { px: SPACING[1.5], py: SPACING[0.5] },
    md: { px: SPACING[2], py: SPACING[1] },
  };

  return (
    <Box
      component="span"
      sx={[
        MONO_TEXT_XS,
        {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: RADIUS.sm,
          whiteSpace: 'nowrap',
          fontWeight: 700,
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
