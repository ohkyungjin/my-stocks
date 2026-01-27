'use client';

import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  minHeight?: string;
}

export function EmptyState({
  title,
  message,
  action,
  minHeight = '400px',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: 2,
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 4,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      )}
      {action && (
        <Button
          variant="outlined"
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
