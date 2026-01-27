'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { Signal } from '@/lib/types/api';
import { bulkCreateSignals } from '@/lib/api/endpoints';
import { SignalResultsTable } from './SignalResultsTable';

interface StrategyRunResult {
  status: string;
  signals_generated: number;
  signals: Array<{
    symbol: string;
    symbol_name?: string;
    action: string;
    price: number;
    volume?: number;
    confidence: number;
    timestamp: string;
    strategy_name: string;
    metadata?: any;
  }>;
  execution_time: number;
}

interface StrategyExecutionResultsProps {
  result: StrategyRunResult;
  onRowClick: (signal: StrategyRunResult['signals'][0]) => void;
}

export function StrategyExecutionResults({
  result,
  onRowClick,
}: StrategyExecutionResultsProps) {
  const [selectedSignals, setSelectedSignals] = useState<number[]>([]);
  const [saveSignalsLoading, setSaveSignalsLoading] = useState(false);
  const [saveSignalsSuccess, setSaveSignalsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveSelectedSignals = async () => {
    if (!result || selectedSignals.length === 0) return;

    try {
      setSaveSignalsLoading(true);
      setError(null);

      const signalsToSave = selectedSignals.map((idx) => result.signals[idx]);
      const response = await bulkCreateSignals(signalsToSave);

      const createdCount = (response as any).created_count || 0;
      const skippedCount = (response as any).skipped_count || 0;
      const ordersCreated = (response as any).orders_created || 0;

      setSaveSignalsSuccess(true);
      setSelectedSignals([]);

      let message = `총 ${selectedSignals.length}개 선택\n`;
      if (createdCount > 0) {
        message += `✓ ${createdCount}개 시그널 저장 완료\n`;
      }
      if (skippedCount > 0) {
        message += `⊘ ${skippedCount}개 중복으로 스킵됨\n`;
      }
      if (ordersCreated > 0) {
        message += `✓ ${ordersCreated}개 예약 주문 자동 생성\n(저항선 가격, 목표가 +24%, 손절가 -8%)`;
      }

      alert(message);

      setTimeout(() => setSaveSignalsSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시그널 저장 실패');
    } finally {
      setSaveSignalsLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Metrics Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '4px',
          bgcolor: 'rgba(10,10,12,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            실행 결과
          </Typography>
          <Chip
            label={result.status === 'success' ? '성공' : '실패'}
            size="small"
            sx={{
              bgcolor: result.status === 'success' ? 'rgba(0,255,65,0.1)' : 'rgba(255,0,110,0.1)',
              color: result.status === 'success' ? '#00FF41' : '#FF006E',
              border: '1px solid',
              borderColor: result.status === 'success' ? 'rgba(0,255,65,0.3)' : 'rgba(255,0,110,0.3)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              fontWeight: 700,
              height: 22,
              borderRadius: '2px',
            }}
          />
        </Stack>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1.5,
              }}
            >
              생성된 시그널
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '3rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {result.signals_generated}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: '#00FF41',
                mt: 1,
              }}
            >
              ▲ 활성 시그널
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1.5,
              }}
            >
              실행 시간
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '3rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {result.execution_time.toFixed(2)}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.4)',
                mt: 1,
              }}
            >
              초 소요
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Signals Table */}
      {result.signals.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '4px',
            bgcolor: 'rgba(10,10,12,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Stack spacing={2}>
            {/* Selection Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                생성된 시그널
                <Typography
                  component="span"
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.4)',
                    ml: 1.5,
                  }}
                >
                  ({result.signals.length})
                </Typography>
              </Typography>
              {selectedSignals.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={`${selectedSignals.length}개 선택`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0,255,65,0.1)',
                      color: '#00FF41',
                      border: '1px solid rgba(0,255,65,0.3)',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      height: 22,
                      borderRadius: '2px',
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={saveSignalsLoading ? <CircularProgress size={16} sx={{ color: '#000000' }} /> : <SaveIcon sx={{ fontSize: 16 }} />}
                    onClick={handleSaveSelectedSignals}
                    disabled={saveSignalsLoading}
                    sx={{
                      borderRadius: '2px',
                      textTransform: 'none',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      py: 0.6,
                      px: 1.5,
                      bgcolor: '#00FF41',
                      color: '#000000',
                      '&:hover': {
                        bgcolor: '#00CC35',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.3)',
                      }
                    }}
                  >
                    저장
                  </Button>
                </Box>
              )}
            </Box>

            {/* Success Message */}
            {saveSignalsSuccess && (
              <Alert
                severity="success"
                sx={{
                  py: 0.5,
                  bgcolor: 'rgba(0,255,65,0.05)',
                  border: '1px solid rgba(0,255,65,0.2)',
                  color: '#00FF41',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  borderRadius: '2px',
                }}
              >
                선택한 시그널 저장 완료
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{
                  py: 0.5,
                  bgcolor: 'rgba(255,0,110,0.05)',
                  border: '1px solid rgba(255,0,110,0.2)',
                  color: '#FF006E',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  borderRadius: '2px',
                }}
              >
                {error}
              </Alert>
            )}

            {/* Results Table */}
            <SignalResultsTable
              signals={result.signals}
              selectedSignals={selectedSignals}
              onSelectionChange={setSelectedSignals}
              onRowClick={onRowClick}
            />
          </Stack>
        </Paper>
      ) : (
        <Alert
          severity="info"
          sx={{
            bgcolor: 'rgba(0,255,65,0.05)',
            border: '1px solid rgba(0,255,65,0.2)',
            color: '#00FF41',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            borderRadius: '2px',
          }}
        >
          생성된 시그널이 없습니다. 파라미터를 조정하거나 다른 시점에 다시 시도해보세요.
        </Alert>
      )}
    </Stack>
  );
}
