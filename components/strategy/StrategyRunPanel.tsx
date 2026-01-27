'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface StrategyRunResult {
  status: string;
  signals_generated: number;
  signals: Array<{
    symbol: string;
    action: string;
    price: number;
    confidence: number;
    timestamp: string;
    strategy_name: string;
    metadata?: any;
  }>;
  execution_time: number;
}

interface StrategyRunPanelProps {
  strategyName: string;
  onRunStrategy: (symbols?: string[]) => Promise<StrategyRunResult>;
}

export function StrategyRunPanel({ strategyName, onRunStrategy }: StrategyRunPanelProps) {
  const [symbols, setSymbols] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StrategyRunResult | null>(null);

  const handleRun = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse symbols (comma-separated)
      const symbolList = symbols
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const runResult = await onRunStrategy(symbolList.length > 0 ? symbolList : undefined);
      setResult(runResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '전략 실행 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                전략 실행
              </Typography>
              <Typography variant="body2" color="text.secondary">
                선택한 종목에 대해 전략을 실행하고 시그널을 생성합니다
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="종목 코드 (선택사항)"
              placeholder="005930, 035720, 035420 (비워두면 전체 종목)"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              helperText="콤마(,)로 구분하여 여러 종목 입력 가능. 비워두면 기본 종목에 대해 실행됩니다."
              disabled={loading}
            />

            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? '실행 중...' : '전략 실행'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  실행 결과
                </Typography>
                <Chip
                  label={result.status === 'success' ? '성공' : '실패'}
                  color={result.status === 'success' ? 'success' : 'error'}
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    생성된 시그널
                  </Typography>
                  <Typography variant="h4" fontWeight={700} className="font-mono">
                    {result.signals_generated}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    실행 시간
                  </Typography>
                  <Typography variant="h4" fontWeight={700} className="font-mono">
                    {result.execution_time.toFixed(2)}s
                  </Typography>
                </Box>
              </Box>

              {result.signals.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    생성된 시그널 목록
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>종목</TableCell>
                          <TableCell>액션</TableCell>
                          <TableCell align="right">가격</TableCell>
                          <TableCell align="right">신뢰도</TableCell>
                          <TableCell>시각</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.signals.map((signal, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              <Typography fontWeight={600}>{signal.symbol}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={signal.action}
                                size="small"
                                color={signal.action === 'BUY' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {signal.price.toLocaleString()}원
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {(signal.confidence * 100).toFixed(0)}%
                            </TableCell>
                            <TableCell className="font-mono">
                              {new Date(signal.timestamp).toLocaleString('ko-KR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {result.signals.length === 0 && (
                <Alert severity="info">
                  선택한 종목에 대해 생성된 시그널이 없습니다. 다른 종목을 시도하거나 파라미터를 조정해보세요.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
