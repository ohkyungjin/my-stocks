import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  InputAdornment,
  Alert,
  Divider,
} from '@mui/material';
import { Signal } from '@/lib/types/api';
import { UpdateOrderRequest } from '@/lib/hooks/useOrders';

interface EditSignalOrderModalProps {
  open: boolean;
  signal: Signal | null;
  onClose: () => void;
  onSave: (orderId: number, updated: UpdateOrderRequest) => Promise<void>;
}

export function EditSignalOrderModal({
  open,
  signal,
  onClose,
  onSave,
}: EditSignalOrderModalProps) {
  const [orderPrice, setOrderPrice] = useState(0);
  const [stopLossPrice, setStopLossPrice] = useState(0);
  const [takeProfitPrice, setTakeProfitPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (signal?.scheduled_order) {
      const orderPrice = signal.scheduled_order.order_price;
      setOrderPrice(orderPrice);
      setStopLossPrice(signal.scheduled_order.stop_loss_price);
      setTakeProfitPrice(signal.scheduled_order.take_profit_price);

      // 🔥 30만원 기준 자동 수량 계산
      const maxInvestment = 300000; // 1종목당 30만원 제한
      const autoQuantity = orderPrice > 0 ? Math.floor(maxInvestment / orderPrice) : 0;
      setQuantity(autoQuantity);
    }
  }, [signal]);

  const handleSave = async () => {
    if (!signal?.scheduled_order) return;

    setIsSaving(true);
    setError(null);

    try {
      await onSave(signal.scheduled_order.order_id, {
        order_price: orderPrice,
        stop_loss_price: stopLossPrice,
        take_profit_price: takeProfitPrice,
        quantity,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '주문 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stopLossPct = orderPrice > 0 ? ((stopLossPrice - orderPrice) / orderPrice * 100) : 0;
  const takeProfitPct = orderPrice > 0 ? ((takeProfitPrice - orderPrice) / orderPrice * 100) : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          {signal?.symbol_name} ({signal?.symbol})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          주문 수정 (1종목당 30만원 기준 자동 계산)
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 주문가 */}
          <TextField
            label="주문가"
            type="number"
            value={orderPrice}
            onChange={(e) => setOrderPrice(Number(e.target.value))}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">원</InputAdornment>,
            }}
          />

          {/* 수량 */}
          <Box>
            <TextField
              label="수량"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">주</InputAdornment>,
              }}
            />
            <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
              30만원 기준: {orderPrice > 0 ? `${Math.floor(300000 / orderPrice)}주` : '0주'} (총 {formatCurrency(orderPrice * quantity)}원)
            </Typography>
          </Box>

          <Divider />

          {/* 손절가 */}
          <Box>
            <TextField
              label="손절가"
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(Number(e.target.value))}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
            <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
              {stopLossPct.toFixed(2)}% ({stopLossPct >= 0 ? '+' : ''}{formatCurrency(stopLossPrice - orderPrice)}원)
            </Typography>
          </Box>

          {/* 목표가 */}
          <Box>
            <TextField
              label="목표가"
              type="number"
              value={takeProfitPrice}
              onChange={(e) => setTakeProfitPrice(Number(e.target.value))}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
              }}
            />
            <Typography
              variant="caption"
              color="success.main"
              sx={{ mt: 0.5, display: 'block' }}
            >
              +{takeProfitPct.toFixed(2)}% (+{formatCurrency(takeProfitPrice - orderPrice)}원)
            </Typography>
          </Box>

          {/* 금액 요약 */}
          <Box sx={{ bgcolor: 'grey.50', p: 1.5, borderRadius: 1, mt: 1 }}>
            <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
              주문 요약
            </Typography>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">주문 금액</Typography>
                <Typography variant="caption" fontWeight={600}>
                  {formatCurrency(orderPrice * quantity)}원
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">예상 손실</Typography>
                <Typography variant="caption" fontWeight={600} color="error.main">
                  {formatCurrency((stopLossPrice - orderPrice) * quantity)}원
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">예상 수익</Typography>
                <Typography variant="caption" fontWeight={600} color="success.main">
                  {formatCurrency((takeProfitPrice - orderPrice) * quantity)}원
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || !orderPrice || !quantity}
        >
          {isSaving ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
