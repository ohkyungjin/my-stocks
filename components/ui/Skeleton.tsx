'use client';

import { Box, keyframes } from '@mui/material';
import { COLORS, RADIUS } from '@/lib/theme/styleConstants';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

interface SkeletonProps {
  /**
   * Skeleton shape variant
   * - text: Text line with rounded corners
   * - rectangular: Full rectangular shape
   * - circular: Circle (for avatars, icons)
   */
  variant?: 'text' | 'rectangular' | 'circular';
  /**
   * Width of skeleton (CSS value or number in px)
   */
  width?: string | number;
  /**
   * Height of skeleton (CSS value or number in px)
   */
  height?: string | number;
  /**
   * Number of skeleton lines (only for text variant)
   * Creates multiple stacked skeleton lines with the last one at 80% width
   */
  lines?: number;
}

/**
 * FinFlow Dark Skeleton Component
 *
 * Loading skeleton with smooth shimmer animation.
 * Used to indicate loading states and reduce layout shift (CLS).
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width="100%" height={20} />
 * <Skeleton variant="rectangular" width={300} height={200} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="text" lines={3} />
 * ```
 */
export function Skeleton({
  variant = 'rectangular',
  width = '100%',
  height = 20,
  lines = 1,
}: SkeletonProps) {
  const baseStyles = {
    background: `linear-gradient(
      90deg,
      ${COLORS.background.secondary} 25%,
      ${COLORS.background.tertiary} 50%,
      ${COLORS.background.secondary} 75%
    )`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 1.5s infinite`,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Box
            key={i}
            sx={{
              ...baseStyles,
              width: i === lines - 1 ? '80%' : width,
              height: 16,
              borderRadius: RADIUS.sm,
            }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        ...baseStyles,
        width,
        height,
        borderRadius: variant === 'circular' ? RADIUS.full : RADIUS.md,
      }}
    />
  );
}
