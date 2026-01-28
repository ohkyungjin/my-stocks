'use client';

import { Box, Typography } from '@mui/material';
import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';
import { TEXT_MD, COLORS, SPACING, SHADOWS } from '@/lib/theme/styleConstants';

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton' | 'card';
  minHeight?: string;
}

export function LoadingState({
  message = '로딩 중...',
  variant = 'skeleton',
  minHeight = '400px',
}: LoadingStateProps) {
  // Skeleton variant - modern loading placeholder
  if (variant === 'skeleton') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight,
          justifyContent: 'center',
        }}
      >
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rectangular" width="100%" height={120} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="50%" height={80} />
          <Skeleton variant="rectangular" width="50%" height={80} />
        </Box>
        <Skeleton variant="text" width="60%" lines={2} />
      </Box>
    );
  }

  // Card variant - loading card with message
  if (variant === 'card') {
    return (
      <Card
        variant="default"
        padding="lg"
        sx={{
          minHeight,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="30%" />
        </Box>
      </Card>
    );
  }

  // Spinner variant - simple centered loader
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: SPACING[6],
        bgcolor: COLORS.background.primary, // True black background
        borderRadius: '12px',
      }}
    >
      {/* Animated Purple Spinner */}
      <Box
        sx={{
          width: 48,
          height: 48,
          border: '3px solid',
          borderColor: COLORS.border.separator, // Subtle border
          borderTopColor: COLORS.primary.main, // Purple accent
          borderRadius: '50%',
          animation: 'spin 0.8s ease-in-out infinite',
          boxShadow: SHADOWS.sm, // Subtle depth
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />
      <Typography
        sx={{
          ...TEXT_MD,
          color: COLORS.text.secondary,
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
