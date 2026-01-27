import React, { useState } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Slider,
} from '@mui/material';
import { BulkUpdateOrdersRequest } from '@/lib/hooks/useOrders';

interface BulkEditOrdersModalProps {
  open: boolean;
  orderIds: number[];
  adjustmentType: 'stop_loss' | 'take_profit';
  onClose: () => void;
  onSave: (request: BulkUpdateOrdersRequest) => Promise<void>;
}

export function BulkEditOrdersModal({
  open,
  orderIds,
  adjustmentType,
  onClose,
  onSave,
}: BulkEditOrdersModalProps) {
  const [adjustmentValue, setAdjustmentValue] = useState<number>(
    adjustmentType === 'stop_loss' ? -10 : 20
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        order_ids: orderIds,
        adjustment_type: adjustmentType === 'stop_loss' ? 'stop_loss_pct' : 'take_profit_pct',
        adjustment_value: adjustmentValue,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '일괄 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const isStopLoss = adjustmentType === 'stop_loss';
  const title = isStopLoss ? '일괄 손절가 조정' : '일괄 목표가 조정';
  const description = isStopLoss
    ? '선택한 주문들의 손절가를 일괄적으로 조정합니다.'
    : '선택한 주문들의 목표가를 일괄적으로 조정합니다.';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Alert severity="info">
            {description}
            <br />
            <strong>{orderIds.length}개</strong>의 주문이 선택되었습니다.
          </Alert>

          {/* 조정 방식 선택 */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              조정 비율
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              주문가 대비 {isStopLoss ? '손절가' : '목표가'}를 조정합니다.
            </Typography>

            <Box sx={{ px: 2 }}>
              <Slider
                value={adjustmentValue}
                onChange={(_, value) => setAdjustmentValue(value as number)}
                min={isStopLoss ? -20 : 0}
                max={isStopLoss ? 0 : 50}
                step={isStopLoss ? 0.5 : 1}
                marks={
                  isStopLoss
                    ? [
                        { value: -20, label: '-20%' },
                        { value: -15, label: '-15%' },
                        { value: -10, label: '-10%' },
                        { value: -5, label: '-5%' },
                        { value: 0, label: '0%' },
                      ]
                    : [
                        { value: 0, label: '0%' },
                        { value: 10, label: '+10%' },
                        { value: 20, label: '+20%' },
                        { value: 30, label: '+30%' },
                        { value: 50, label: '+50%' },
                      ]
                }
                valueLabelDisplay="on"
                valueLabelFormat={(value) =>
                  `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
                }
              />
            </Box>

            <TextField
              label="조정 비율 (%)"
              type="number"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(Number(e.target.value))}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{
                step: 0.5,
                min: isStopLoss ? -20 : 0,
                max: isStopLoss ? 0 : 50,
              }}
            />
          </Box>

          {/* 예시 */}
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              적용 예시
            </Typography>
            <Stack spacing={0.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">주문가</Typography>
                <Typography variant="caption" fontWeight={600}>
                  10,000원
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">
                  {isStopLoss ? '손절가' : '목표가'}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={isStopLoss ? 'error.main' : 'success.main'}
                >
                  {(10000 * (1 + adjustmentValue / 100)).toLocaleString()}원 (
                  {adjustmentValue >= 0 ? '+' : ''}
                  {adjustmentValue.toFixed(1)}%)
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          color={isStopLoss ? 'error' : 'success'}
        >
          {isSaving ? '적용 중...' : `${orderIds.length}개 주문에 적용`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
