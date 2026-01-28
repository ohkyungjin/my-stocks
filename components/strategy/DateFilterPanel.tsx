/**
 * Date Filter Panel Component
 * Simple date range filter with presets
 */

import { Paper, Stack, Typography, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';
import { GLASS_PAPER, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

export type DateFilterPreset = 'today' | 'week' | 'month' | 'custom';
export type MonitoringFilter = 'all' | 'on' | 'off';
export type OrderStatusFilter = 'all' | 'filled' | 'pending' | 'scheduled';

interface DateFilterPanelProps {
  preset: DateFilterPreset;
  startDate: string;
  endDate: string;
  onPresetChange: (preset: DateFilterPreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;

  // New filters
  monitoringFilter: MonitoringFilter;
  onMonitoringFilterChange: (filter: MonitoringFilter) => void;
  orderStatusFilter: OrderStatusFilter;
  onOrderStatusFilterChange: (filter: OrderStatusFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function DateFilterPanel({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
  monitoringFilter,
  onMonitoringFilterChange,
  orderStatusFilter,
  onOrderStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: DateFilterPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...GLASS_PAPER,
        mb: 3,
        p: 2.5,
      }}
    >
      <Stack spacing={2}>
        {/* First Row: Date Filter */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: TERMINAL_COLORS.textPrimary,
              minWidth: 80,
            }}
          >
            기간
          </Typography>

          <ToggleButtonGroup
            value={preset}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                onPresetChange(newValue);
              }
            }}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '2px !important',
                px: 2,
                py: 0.5,
                border: '1px solid rgba(255,255,255,0.1)',
                mx: 0.5,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: 'rgba(0,255,65,0.15)',
                  color: TERMINAL_COLORS.lime,
                  borderColor: 'rgba(0,255,65,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,255,65,0.2)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                }
              }
            }}
          >
            <ToggleButton value="today">오늘</ToggleButton>
            <ToggleButton value="week">최근 7일</ToggleButton>
            <ToggleButton value="month">최근 30일</ToggleButton>
            <ToggleButton value="custom">사용자 지정</ToggleButton>
          </ToggleButtonGroup>

          {/* Custom Date Range - inline when selected */}
          {preset === 'custom' && (
            <>
              <TextField
                label="시작일"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: 160,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: '2px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: TERMINAL_COLORS.textPrimary,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,255,65,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: TERMINAL_COLORS.lime,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                  }
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                ~
              </Typography>
              <TextField
                label="종료일"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: 160,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: '2px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: TERMINAL_COLORS.textPrimary,
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,255,65,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: TERMINAL_COLORS.lime,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                  }
                }}
              />
            </>
          )}
        </Stack>

        {/* Second Row: All other filters in one line */}
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          {/* Monitoring Filter */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: TERMINAL_COLORS.textPrimary,
              }}
            >
              모니터링
            </Typography>

            <ToggleButtonGroup
              value={monitoringFilter}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  onMonitoringFilterChange(newValue);
                }
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '2px !important',
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid rgba(255,255,255,0.1)',
                  mx: 0.25,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,255,65,0.15)',
                    color: TERMINAL_COLORS.lime,
                    borderColor: 'rgba(0,255,65,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,255,65,0.2)',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                  }
                }
              }}
            >
              <ToggleButton value="all">전체</ToggleButton>
              <ToggleButton value="on">ON</ToggleButton>
              <ToggleButton value="off">OFF</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Order Status Filter */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: TERMINAL_COLORS.textPrimary,
              }}
            >
              주문 상태
            </Typography>

            <ToggleButtonGroup
              value={orderStatusFilter}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  onOrderStatusFilterChange(newValue);
                }
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '2px !important',
                  px: 1.5,
                  py: 0.5,
                  border: '1px solid rgba(255,255,255,0.1)',
                  mx: 0.25,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,255,65,0.15)',
                    color: TERMINAL_COLORS.lime,
                    borderColor: 'rgba(0,255,65,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,255,65,0.2)',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.03)',
                  }
                }
              }}
            >
              <ToggleButton value="all">전체</ToggleButton>
              <ToggleButton value="filled">체결완료</ToggleButton>
              <ToggleButton value="pending">미체결</ToggleButton>
              <ToggleButton value="scheduled">예약중</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {/* Search */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: TERMINAL_COLORS.textPrimary,
              }}
            >
              종목
            </Typography>

            <TextField
              placeholder="종목명 또는 코드"
              size="small"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              sx={{
                width: 200,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: '2px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: TERMINAL_COLORS.textPrimary,
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(0,255,65,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: TERMINAL_COLORS.lime,
                  }
                },
                '& .MuiInputBase-input::placeholder': {
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)',
                  opacity: 1,
                }
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
