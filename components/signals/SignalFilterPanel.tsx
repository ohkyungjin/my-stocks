'use client';

import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { SignalFilters } from '@/lib/types/api';
import { getToday, getDateRange } from '@/lib/utils/dateHelpers';

interface SignalFilterPanelProps {
  initialFilters?: SignalFilters;
  onFilterChange: (filters: SignalFilters) => void;
  onClear: () => void;
}

export function SignalFilterPanel({ initialFilters, onFilterChange, onClear }: SignalFilterPanelProps) {
  const [filters, setFilters] = useState<SignalFilters>(initialFilters || {});

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleFilterChange = useCallback((key: keyof SignalFilters, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleClear = useCallback(() => {
    const defaultFilters: SignalFilters = {};
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    onClear();
  }, [onFilterChange, onClear]);

  const handleQuickDateFilter = useCallback((type: 'today' | 'week' | 'month' | 'quarter') => {
    const dateRange = getDateRange(type);
    const newFilters = { ...filters, ...dateRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const activeFilterCount = useMemo(
    () => Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '').length,
    [filters]
  );

  const today = useMemo(() => getToday(), []);
  const isTodaySelected = filters.start_date === today && filters.end_date === today;

  return (
    <Card>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1.5}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={600}>
                날짜 필터
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={`${activeFilterCount}개`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600, height: 20 }}
                />
              )}
            </Box>
            <Button
              size="small"
              startIcon={<ClearIcon fontSize="small" />}
              onClick={handleClear}
              disabled={activeFilterCount === 0}
              sx={{ py: 0.5 }}
            >
              초기화
            </Button>
          </Box>

          {/* Quick Date Filters & Date Range - Same Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              <Chip
                label="오늘"
                size="small"
                variant={isTodaySelected ? 'filled' : 'outlined'}
                color={isTodaySelected ? 'primary' : 'default'}
                onClick={() => handleQuickDateFilter('today')}
                sx={{ height: 28 }}
              />
              <Chip
                label="이번 주"
                size="small"
                variant="outlined"
                onClick={() => handleQuickDateFilter('week')}
                sx={{ height: 28 }}
              />
              <Chip
                label="이번 달"
                size="small"
                variant="outlined"
                onClick={() => handleQuickDateFilter('month')}
                sx={{ height: 28 }}
              />
              <Chip
                label="최근 3개월"
                size="small"
                variant="outlined"
                onClick={() => handleQuickDateFilter('quarter')}
                sx={{ height: 28 }}
              />
            </Box>

            {/* Date Range */}
            <Box sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 300 }}>
              <TextField
                type="date"
                label="시작일"
                value={filters.start_date || ''}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': { height: 36 } }}
              />
              <TextField
                type="date"
                label="종료일"
                value={filters.end_date || ''}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': { height: 36 } }}
              />
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
