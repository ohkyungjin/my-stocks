'use client';

import { Box, Alert, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

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
        gap: 2,
      }}
    >
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            다시 시도
          </Button>
        )}
      </Alert>
    </Box>
  );
}
