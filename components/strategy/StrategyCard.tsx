'use client';

import { Card, CardContent, Box, Typography, Chip, Stack, LinearProgress, useTheme } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { Strategy, StrategyPerformance } from '@/lib/types/api';
import { formatPercent, formatNumber } from '@/lib/utils/formatters';

interface StrategyCardProps {
  strategy: Strategy;
  performance?: StrategyPerformance;
  onClick?: () => void;
  selected?: boolean;
}

export function StrategyCard({ strategy, performance, onClick, selected = false }: StrategyCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isActive = strategy.is_active;
  const hasPerformance = performance !== undefined;

  const winRate = performance?.win_rate || 0;
  const avgReturn = performance?.avg_return || 0;
  const sharpeRatio = performance?.sharpe_ratio || 0;
  const totalTrades = performance?.total_trades || 0;

  const isPositiveReturn = avgReturn >= 0;

  // Win rate color
  const getWinRateColor = (rate: number) => {
    if (rate >= 60) return 'success.main';
    if (rate >= 40) return 'warning.main';
    return 'error.main';
  };

  // Sharpe ratio color
  const getSharpeColor = (sharpe: number) => {
    if (sharpe >= 2) return 'success.main';
    if (sharpe >= 1) return 'warning.main';
    return 'error.main';
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: '3px solid',
        borderColor: selected ? 'primary.main' : isActive ? 'success.main' : 'divider',
        transition: 'all 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1.5}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} display="inline" mr={1}>
                {strategy.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="inline">
                {strategy.description}
              </Typography>
            </Box>
            <Chip
              label={isActive ? '활성' : '비활성'}
              size="small"
              sx={{
                backgroundColor: isActive ? 'success.main' : 'action.disabled',
                color: 'white',
                fontWeight: 600,
                height: 24,
              }}
            />
          </Box>

          {/* Performance Metrics */}
          {hasPerformance ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {/* 승률 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  승률
                </Typography>
                <Typography
                  variant="h6"
                  className="font-mono"
                  fontWeight={700}
                  sx={{ color: getWinRateColor(winRate) }}
                >
                  {winRate.toFixed(1)}%
                </Typography>
              </Box>

              {/* 평균 수익률 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  평균 수익률
                </Typography>
                <Typography
                  variant="h6"
                  className="font-mono"
                  fontWeight={700}
                  sx={{ color: isPositiveReturn ? 'success.main' : 'error.main' }}
                >
                  {isPositiveReturn ? '+' : ''}{avgReturn.toFixed(2)}%
                </Typography>
              </Box>

              {/* 샤프 비율 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  샤프 비율
                </Typography>
                <Typography
                  variant="h6"
                  className="font-mono"
                  fontWeight={700}
                  sx={{ color: getSharpeColor(sharpeRatio) }}
                >
                  {sharpeRatio.toFixed(2)}
                </Typography>
              </Box>

              {/* 총 거래 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  총 거래
                </Typography>
                <Typography variant="h6" className="font-mono" fontWeight={700}>
                  {formatNumber(totalTrades)}
                </Typography>
              </Box>

              {/* 누적 수익률 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  누적 수익률
                </Typography>
                <Typography
                  variant="h6"
                  className="font-mono"
                  fontWeight={700}
                  sx={{ color: performance.cumulative_return >= 0 ? 'success.main' : 'error.main' }}
                >
                  {performance.cumulative_return >= 0 ? '+' : ''}{formatPercent(performance.cumulative_return)}
                </Typography>
              </Box>

              {/* 최대 손실 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: 'action.hover' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  MDD
                </Typography>
                <Typography variant="h6" className="font-mono" fontWeight={700} color="error.main">
                  {formatPercent(performance.max_drawdown)}
                </Typography>
              </Box>

              {/* 최고 수익 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.15)' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  최고 수익
                </Typography>
                <Typography variant="h6" className="font-mono" fontWeight={700} color="success.main">
                  +{formatPercent(performance.best_trade)}
                </Typography>
              </Box>

              {/* 최대 손실 */}
              <Box sx={{ flex: '1 1 auto', minWidth: '100px', px: 1.5, py: 1, borderRadius: 1, backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)' }}>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                  최대 손실
                </Typography>
                <Typography variant="h6" className="font-mono" fontWeight={700} color="error.main">
                  {formatPercent(performance.worst_trade)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                py: 2,
                textAlign: 'center',
                borderRadius: 1,
                backgroundColor: 'action.hover',
              }}
            >
              <ShowChartIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary" display="block">
                성과 데이터 없음
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
