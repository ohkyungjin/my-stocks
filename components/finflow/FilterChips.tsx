'use client';

import { Box, Chip } from '@mui/material';
import { COLORS, SPACING, RADIUS } from '@/lib/theme/styleConstants';

export type FilterValue = 'all' | 'up' | 'down';

interface FilterChipsProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FILTERS = [
  { value: 'all' as FilterValue, label: '전체' },
  { value: 'up' as FilterValue, label: '상승' },
  { value: 'down' as FilterValue, label: '하락' },
];

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: SPACING[2],
        overflowX: 'auto',
        pb: SPACING[1],
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}
    >
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;

        return (
          <Chip
            key={filter.value}
            label={filter.label}
            onClick={() => onChange(filter.value)}
            sx={{
              bgcolor: isActive ? COLORS.primary.main : COLORS.background.secondary,
              color: isActive ? COLORS.background.pure : COLORS.text.secondary,
              fontWeight: isActive ? 700 : 600,
              fontSize: '14px',
              borderRadius: `${RADIUS.full}px`,
              px: SPACING[3],
              py: SPACING[2],
              border: `1px solid ${isActive ? COLORS.primary.main : COLORS.border.default}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: isActive ? COLORS.primary.dark : COLORS.background.tertiary,
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          />
        );
      })}
    </Box>
  );
}
