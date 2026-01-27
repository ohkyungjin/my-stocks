'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { BacktestRequest, BacktestResult, StrategyParameters } from '@/lib/types/api';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

interface BacktestPanelProps {
  strategyName: string;
  currentParameters?: StrategyParameters;
  onRunBacktest?: (request: BacktestRequest) => Promise<BacktestResult>;
  loading?: boolean;
}

type PeriodPreset = '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'CUSTOM';

export function BacktestPanel({
  strategyName,
  currentParameters,
  onRunBacktest,
  loading = false,
}: BacktestPanelProps) {
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('3M');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useCurrentParams, setUseCurrentParams] = useState(true);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on preset
  const getDateRange = (preset: PeriodPreset): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();

    switch (preset) {
      case '1M':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case 'YTD':
        start.setMonth(0);
        start.setDate(1);
        break;
      case 'CUSTOM':
        return { start: startDate, end: endDate };
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const handleRun = async () => {
    if (!onRunBacktest) return;

    try {
      setError(null);
      setResult(null);

      const dateRange = getDateRange(periodPreset);
      const request: BacktestRequest = {
        strategy_name: strategyName,
        start_date: dateRange.start,
        end_date: dateRange.end,
        parameters: useCurrentParams ? currentParameters : undefined,
      };

      const backtestResult = await onRunBacktest(request);
      setResult(backtestResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '백테스트 실행 실패');
    }
  };

  const isRunDisabled = loading || (periodPreset === 'CUSTOM' && (!startDate || !endDate));

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              백테스트 실행
            </Typography>
            <Typography variant="body2" color="text.secondary">
              과거 데이터로 전략 성과를 시뮬레이션합니다
            </Typography>
          </Box>

          {/* Period Selection */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              테스트 기간
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
              }}
            >
              {(['1M', '3M', '6M', '1Y', 'YTD', 'CUSTOM'] as PeriodPreset[]).map((preset) => (
                <Button
                  key={preset}
                  variant={periodPreset === preset ? 'contained' : 'outlined'}
                  onClick={() => setPeriodPreset(preset)}
                  size="small"
                  disabled={loading}
                >
                  {preset}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Custom Date Range */}
          {periodPreset === 'CUSTOM' && (
            <Stack direction="row" spacing={2}>
              <TextField
                type="date"
                label="시작일"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
              <TextField
                type="date"
                label="종료일"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Stack>
          )}

          {/* Parameter Option */}
          {currentParameters && (
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                파라미터 설정
              </Typography>
              <TextField
                select
                value={useCurrentParams ? 'current' : 'default'}
                onChange={(e) => setUseCurrentParams(e.target.value === 'current')}
                fullWidth
                size="small"
                disabled={loading}
              >
                <MenuItem value="current">현재 파라미터 사용</MenuItem>
                <MenuItem value="default">기본 파라미터 사용</MenuItem>
              </TextField>
              {useCurrentParams && (
                <Box sx={{ mt: 1, p: 1, backgroundColor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Lookback: {currentParameters.lookback_months}개월 |
                    Range: {currentParameters.resistance_range}% |
                    Min Trading Value: {(() => {
                      const value = currentParameters.min_trading_value;
                      if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억원`;
                      return `${value.toLocaleString()}원`;
                    })()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Run Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
            onClick={handleRun}
            disabled={isRunDisabled}
            fullWidth
          >
            {loading ? '실행 중...' : '백테스트 실행'}
          </Button>

          {/* Results Summary */}
          {result && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: 'action.hover',
                border: '2px solid',
                borderColor: result.total_return >= 0 ? 'success.main' : 'error.main',
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight={600}>
                    백테스트 결과
                  </Typography>
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`${result.period.start} ~ ${result.period.end}`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      총 수익률
                    </Typography>
                    <Typography
                      variant="h5"
                      className="font-mono"
                      fontWeight={700}
                      sx={{ color: result.total_return >= 0 ? 'success.main' : 'error.main' }}
                    >
                      {result.total_return >= 0 ? '+' : ''}{formatPercent(result.total_return)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      연환산 수익률
                    </Typography>
                    <Typography
                      variant="h5"
                      className="font-mono"
                      fontWeight={700}
                      sx={{ color: result.annualized_return >= 0 ? 'success.main' : 'error.main' }}
                    >
                      {result.annualized_return >= 0 ? '+' : ''}{formatPercent(result.annualized_return)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      총 거래
                    </Typography>
                    <Typography variant="body2" className="font-mono" fontWeight={600}>
                      {result.total_trades}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      승률
                    </Typography>
                    <Typography variant="body2" className="font-mono" fontWeight={600} color="primary.main">
                      {result.win_rate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      샤프
                    </Typography>
                    <Typography variant="body2" className="font-mono" fontWeight={600}>
                      {result.sharpe_ratio.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      MDD
                    </Typography>
                    <Typography variant="body2" className="font-mono" fontWeight={600} color="error.main">
                      {formatPercent(result.max_drawdown)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
