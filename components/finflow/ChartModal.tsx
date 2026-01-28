'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { CandlestickChartDynamic } from '@/components/charts/ChartDynamic';
import { useOHLCVData } from '@/lib/hooks/useFinflowData';
import { COLORS, SPACING, RADIUS, TEXT_HEADING_LG, TEXT_BODY_MD, TEXT_LABEL_SM } from '@/lib/theme/styleConstants';

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  symbolName: string;
  position?: {
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profitLoss: number;
    profitLossPercent: number;
  };
}

export function ChartModal({
  open,
  onClose,
  symbol,
  symbolName,
  position,
}: ChartModalProps) {
  const { data: ohlcvData, isLoading, error } = useOHLCVData(open ? symbol : null, 60);

  // Convert OHLCV data to chart format (already in correct format from API)
  const chartData = ohlcvData || [];

  const isProfit = position ? position.profitLoss >= 0 : true;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: COLORS.background.pure,
          m: 0,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: COLORS.background.pure,
          borderBottom: `1px solid ${COLORS.border.separator}`,
          px: SPACING[4],
          py: SPACING[3],
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography
            sx={{
              ...TEXT_HEADING_LG,
              color: COLORS.text.primary,
              fontWeight: 700,
            }}
          >
            {symbolName}
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.text.tertiary,
              mt: SPACING[0.5],
            }}
          >
            {symbol}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: COLORS.text.tertiary,
            '&:hover': {
              color: COLORS.text.primary,
              bgcolor: COLORS.background.secondary,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Position Details */}
        {position && (
          <Box
            sx={{
              px: SPACING[4],
              py: SPACING[4],
              bgcolor: COLORS.background.secondary,
              borderBottom: `1px solid ${COLORS.border.separator}`,
            }}
          >
            <Stack spacing={2}>
              {/* P/L */}
              <Box>
                <Typography
                  sx={{
                    ...TEXT_LABEL_SM,
                    color: COLORS.text.tertiary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    mb: SPACING[1],
                  }}
                >
                  평가 손익
                </Typography>
                <Typography
                  sx={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: isProfit ? COLORS.success.main : COLORS.danger.main,
                  }}
                >
                  {isProfit ? '+' : ''}₩{position.profitLoss.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    ...TEXT_BODY_MD,
                    color: isProfit ? COLORS.success.main : COLORS.danger.main,
                    fontWeight: 600,
                    mt: SPACING[0.5],
                  }}
                >
                  {isProfit ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                </Typography>
              </Box>

              {/* Position Info Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: SPACING[3],
                  pt: SPACING[2],
                  borderTop: `1px solid ${COLORS.border.separator}`,
                }}
              >
                <Box>
                  <Typography sx={{ ...TEXT_LABEL_SM, color: COLORS.text.tertiary, mb: SPACING[0.5] }}>
                    보유 수량
                  </Typography>
                  <Typography sx={{ ...TEXT_BODY_MD, color: COLORS.text.primary, fontWeight: 600 }}>
                    {position.quantity}주
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ ...TEXT_LABEL_SM, color: COLORS.text.tertiary, mb: SPACING[0.5] }}>
                    평균 단가
                  </Typography>
                  <Typography sx={{ ...TEXT_BODY_MD, color: COLORS.text.primary, fontWeight: 600 }}>
                    ₩{position.avgPrice.toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ ...TEXT_LABEL_SM, color: COLORS.text.tertiary, mb: SPACING[0.5] }}>
                    현재가
                  </Typography>
                  <Typography sx={{ ...TEXT_BODY_MD, color: COLORS.text.primary, fontWeight: 600 }}>
                    ₩{position.currentPrice.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Chart */}
        <Box sx={{ px: SPACING[4], py: SPACING[4] }}>
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 500,
              }}
            >
              <CircularProgress sx={{ color: COLORS.primary.main }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: SPACING[4] }}>
              차트 데이터를 불러오는데 실패했습니다.
            </Alert>
          )}

          {!isLoading && !error && chartData.length > 0 && (
            <CandlestickChartDynamic
              symbol={symbol}
              symbolName={symbolName}
              data={chartData}
              currentPrice={position?.currentPrice}
              height={500}
            />
          )}

          {!isLoading && !error && chartData.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 500,
                color: COLORS.text.tertiary,
              }}
            >
              <Typography>차트 데이터가 없습니다.</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
