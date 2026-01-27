'use client';

import { Box, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MONO_TEXT_SM, MONO_TEXT_MD, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

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
        px: 2,
      }}
    >
      <Card
        variant="highlight"
        padding="lg"
        sx={{
          maxWidth: 600,
          width: '100%',
          borderColor: TERMINAL_COLORS.error,
          bgcolor: 'rgba(239, 68, 68, 0.05)',
        }}
      >
        {/* Error Icon Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Badge variant="error" size="md">
            ✕
          </Badge>
        </Box>

        {/* Error Title */}
        <Typography
          sx={{
            ...MONO_TEXT_MD,
            color: TERMINAL_COLORS.error,
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        {/* Error Message */}
        <Typography
          sx={{
            ...MONO_TEXT_SM,
            color: TERMINAL_COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 1.6,
            mb: onRetry ? 3 : 0,
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
