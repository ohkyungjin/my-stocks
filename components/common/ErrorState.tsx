'use client';

import { Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TEXT_SM, TEXT_MD, COLORS, SPACING, SHADOWS } from '@/lib/theme/styleConstants';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  minHeight?: string;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  message,
  onRetry,
  minHeight = '400px',
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        px: SPACING[4],
      }}
    >
      <Card
        variant="default"
        padding="lg"
        sx={{
          maxWidth: 600,
          width: '100%',
          borderColor: COLORS.danger.main,
          bgcolor: COLORS.danger.subtle,
          border: `1px solid rgba(255, 59, 48, 0.2)`,
          boxShadow: SHADOWS.md,
        }}
      >
        {/* Error Icon Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: SPACING[6] }}>
          <Badge variant="error" size="md">
            ✕
          </Badge>
        </Box>

        {/* Error Title */}
        <Typography
          sx={{
            ...TEXT_MD,
            color: COLORS.danger.main,
            textAlign: 'center',
            mb: SPACING[4],
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </Typography>

        {/* Error Message */}
        <Typography
          sx={{
            ...TEXT_SM,
            color: COLORS.text.secondary,
            textAlign: 'center',
            lineHeight: 1.7,
            mb: onRetry ? SPACING[6] : 0,
            letterSpacing: '0.02em',
          }}
        >
          {message}
        </Typography>

        {/* Retry Button */}
        {onRetry && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="danger"
              size="medium"
              onClick={onRetry}
              sx={{ minWidth: 140 }}
            >
              <RefreshIcon sx={{ mr: 1, fontSize: 18 }} />
              다시 시도
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}
