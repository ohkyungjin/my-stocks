'use client';

import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TEXT_SM, TEXT_MD, COLORS, SPACING, SHADOWS } from '@/lib/theme/styleConstants';

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
        px: SPACING[4],
      }}
    >
      <Card
        variant="secondary"
        padding="lg"
        sx={{
          maxWidth: 600,
          width: '100%',
          border: '2px dashed',
          borderColor: COLORS.border.separator, // Subtle gray border
          bgcolor: 'rgba(156, 163, 175, 0.03)', // Very subtle gray background
          boxShadow: SHADOWS.sm,
        }}
      >
        {/* Empty Icon Badge with Modern Illustration */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: SPACING[6] }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(156, 163, 175, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: COLORS.text.tertiary,
            }}
          >
            📭
          </Box>
        </Box>

        {/* Empty Title */}
        <Typography
          sx={{
            ...TEXT_MD,
            color: COLORS.text.secondary,
            textAlign: 'center',
            mb: message ? SPACING[4] : action ? SPACING[6] : 0,
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </Typography>

        {/* Empty Message */}
        {message && (
          <Typography
            sx={{
              ...TEXT_SM,
              color: COLORS.text.tertiary,
              textAlign: 'center',
              lineHeight: 1.7,
              mb: action ? SPACING[6] : 0,
              letterSpacing: '0.02em',
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
