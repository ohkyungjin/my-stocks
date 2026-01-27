'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MONO_TEXT_SM, MONO_TEXT_MD, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

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
        px: 2,
      }}
    >
      <Card
        variant="dark"
        padding="lg"
        sx={{
          maxWidth: 600,
          width: '100%',
          border: '2px dashed',
          borderColor: TERMINAL_COLORS.borderDefault,
        }}
      >
        {/* Empty Icon Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Badge variant="default" size="md">
            ∅
          </Badge>
        </Box>

        {/* Empty Title */}
        <Typography
          sx={{
            ...MONO_TEXT_MD,
            color: TERMINAL_COLORS.textSecondary,
            textAlign: 'center',
            mb: message ? 2 : action ? 3 : 0,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        {/* Empty Message */}
        {message && (
          <Typography
            sx={{
              ...MONO_TEXT_SM,
              color: TERMINAL_COLORS.textTertiary,
              textAlign: 'center',
              lineHeight: 1.6,
              mb: action ? 3 : 0,
            }}
          >
            {message}
          </Typography>
        )}

        {/* Action Button */}
        {action && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              size="medium"
              onClick={action.onClick}
              sx={{ minWidth: 140 }}
            >
              {action.icon && (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  {action.icon}
                </Box>
              )}
              {action.label}
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
}
