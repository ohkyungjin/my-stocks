/**
 * Signal Detail Modal - Refactored
 * Main modal component for viewing signal details
 */

'use client';

import { useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { Signal } from '@/lib/types/api';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { SignalAIAnalysisSection } from './SignalAIAnalysisSection';
import { SignalNewsSection } from './SignalNewsSection';
import { SignalOrderSection } from './SignalOrderSection';
import { useSignalDetail } from '@/lib/hooks/useSignalDetail';
import { getActionMetadata, extractSignalMetadata } from '@/lib/utils/signalHelpers';

interface SignalDetailModalProps {
  signal: Signal | null;
  open: boolean;
  onClose: () => void;
}

export function SignalDetailModal({ signal, open, onClose }: SignalDetailModalProps) {
  const {
    // Chart
    chartPeriod,
    setChartPeriod,
    chartData,
    chartLoading,
    chartError,

    // Order
    order,
    orderLoading,
    isEditingOrder,
    setIsEditingOrder,
    editedOrder,
    setEditedOrder,
    orderSaving,
    orderSaveSuccess,
    handleSaveOrder,
    handleCancelEdit,

    // AI Analysis
    aiAnalysis,
    aiLoading,
    aiError,
    handleAIAnalysis,

    // News
    news,
    newsLoading,
    newsExpanded,
    setNewsExpanded,
  } = useSignalDetail({ signal, open });

  const handlePeriodChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newPeriod: number | null) => {
      if (newPeriod !== null) {
        setChartPeriod(newPeriod);
      }
    },
    [setChartPeriod]
  );

  const metadata = useMemo(
    () => (signal ? extractSignalMetadata(signal.metadata) : null),
    [signal]
  );

  const actionMeta = useMemo(
    () => (signal ? getActionMetadata(signal.action) : null),
    [signal]
  );

  if (!signal || !metadata || !actionMeta) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {signal.symbol} - {signal.symbol_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              시그널 상세 정보
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Signal Action and Strategy */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              label={actionMeta.label}
              color={actionMeta.color}
              sx={{ fontWeight: 700, fontSize: '0.875rem' }}
            />
            <Chip
              label={signal.strategy_name}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Price Information */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              가격 정보
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'action.hover',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  현재가
                </Typography>
                <Typography variant="h5" className="font-mono" fontWeight={700}>
                  {formatCurrency(signal.price)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  거래량
                </Typography>
                <Typography variant="h5" className="font-mono" fontWeight={700}>
                  {formatNumber(signal.volume)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Chart Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                가격 차트
              </Typography>
              <ToggleButtonGroup
                size="small"
                value={chartPeriod}
                exclusive
                onChange={handlePeriodChange}
              >
                <ToggleButton value={30}>30일</ToggleButton>
                <ToggleButton value={60}>60일</ToggleButton>
                <ToggleButton value={90}>90일</ToggleButton>
                <ToggleButton value={180}>180일</ToggleButton>
                <ToggleButton value={365}>1년</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {chartLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : chartError ? (
              <Alert severity="error">차트 데이터를 불러올 수 없습니다.</Alert>
            ) : chartData.length === 0 ? (
              <Alert severity="info">차트 데이터가 없습니다.</Alert>
            ) : (
              <CandlestickChart
                symbol={signal.symbol}
                symbolName={signal.symbol_name}
                data={chartData}
                currentPrice={signal.price}
                resistancePrice={metadata.resistancePrice || signal.price}
                showResistanceLine={true}
                height={500}
              />
            )}
          </Box>

          <Divider />

          {/* Order Section */}
          <SignalOrderSection
            signal={signal}
            order={order}
            orderLoading={orderLoading}
            isEditingOrder={isEditingOrder}
            editedOrder={editedOrder}
            orderSaving={orderSaving}
            orderSaveSuccess={orderSaveSuccess}
            onStartEdit={() => setIsEditingOrder(true)}
            onCancelEdit={handleCancelEdit}
            onSave={handleSaveOrder}
            onEditChange={setEditedOrder}
          />

          <Divider />

          {/* AI Analysis Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AIIcon sx={{ color: 'primary.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  AI 에이전트 분석
                </Typography>
              </Stack>

              {!aiAnalysis && !aiLoading && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleAIAnalysis}
                  startIcon={<AIIcon />}
                >
                  분석 시작
                </Button>
              )}
            </Box>

            <SignalAIAnalysisSection
              aiAnalysis={aiAnalysis}
              aiLoading={aiLoading}
              aiError={aiError}
              onAnalyze={handleAIAnalysis}
            />
          </Box>

          <Divider />

          {/* News Section */}
          <SignalNewsSection
            news={news}
            newsLoading={newsLoading}
            newsExpanded={newsExpanded}
            onToggleExpand={() => setNewsExpanded(!newsExpanded)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        <Button variant="contained" onClick={onClose}>
          대시보드로 이동
        </Button>
      </DialogActions>
    </Dialog>
  );
}
