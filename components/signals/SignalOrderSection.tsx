/**
 * Signal Order Section Component
 * Displays and allows editing of scheduled orders for a signal
 */

import {
  Box,
  Stack,
  Typography,
  Alert,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Order, UpdateOrderRequest, Signal } from '@/lib/types/api';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';

interface SignalOrderSectionProps {
  signal: Signal;
  order: Order | null;
  orderLoading: boolean;
  isEditingOrder: boolean;
  editedOrder: UpdateOrderRequest;
  orderSaving: boolean;
  orderSaveSuccess: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onEditChange: (updates: UpdateOrderRequest) => void;
}

export function SignalOrderSection({
  signal,
  order,
  orderLoading,
  isEditingOrder,
  editedOrder,
  orderSaving,
  orderSaveSuccess,
  onStartEdit,
  onCancelEdit,
  onSave,
  onEditChange,
}: SignalOrderSectionProps) {
  if (orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!order) {
    return signal.id > 0 ? (
      <Alert severity="info">이 시그널에 대한 예약 주문이 없습니다</Alert>
    ) : null;
  }

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" fontWeight={600}>
          예약 주문 설정
        </Typography>
        {!isEditingOrder ? (
          <Button size="small" startIcon={<EditIcon />} onClick={onStartEdit}>
            수정
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={orderSaving ? <CircularProgress size={16} /> : <SaveIcon />}
              onClick={onSave}
              disabled={orderSaving}
            >
              저장
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancelEdit}
              disabled={orderSaving}
            >
              취소
            </Button>
          </Box>
        )}
      </Box>

      {orderSaveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          예약 주문이 수정되었습니다
        </Alert>
      )}

      {/* Order Details */}
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          backgroundColor: 'action.hover',
        }}
      >
        <Stack spacing={2}>
          {/* Price and Quantity */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <OrderField
              label="주문가 (매수가)"
              value={order.order_price}
              editValue={editedOrder.order_price}
              isEditing={isEditingOrder}
              onChange={(value) => onEditChange({ ...editedOrder, order_price: value })}
              suffix="원"
            />
            <OrderField
              label="수량"
              value={order.quantity}
              editValue={editedOrder.quantity}
              isEditing={isEditingOrder}
              onChange={(value) => onEditChange({ ...editedOrder, quantity: Math.round(value) })}
              suffix="주"
              isInteger
            />
          </Box>

          {/* Take Profit and Stop Loss */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <OrderField
              label="목표가 (+24%)"
              value={order.take_profit_price}
              editValue={editedOrder.take_profit_price}
              isEditing={isEditingOrder}
              onChange={(value) => onEditChange({ ...editedOrder, take_profit_price: value })}
              suffix="원"
              color="success.main"
            />
            <OrderField
              label="손절가 (-8%)"
              value={order.stop_loss_price}
              editValue={editedOrder.stop_loss_price}
              isEditing={isEditingOrder}
              onChange={(value) => onEditChange({ ...editedOrder, stop_loss_price: value })}
              suffix="원"
              color="error.main"
            />
          </Box>

          {/* Expected Investment Amount */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              예상 투자금액
            </Typography>
            <Typography variant="h6" className="font-mono" fontWeight={700}>
              {formatCurrency(
                (editedOrder.order_price || order.order_price) *
                  (editedOrder.quantity || order.quantity)
              )}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

// Helper component for individual order field
interface OrderFieldProps {
  label: string;
  value: number | null | undefined;
  editValue?: number | null | undefined;
  isEditing: boolean;
  onChange: (value: number) => void;
  suffix: string;
  color?: string;
  isInteger?: boolean;
}

function OrderField({
  label,
  value,
  editValue,
  isEditing,
  onChange,
  suffix,
  color,
  isInteger = false,
}: OrderFieldProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {isEditing ? (
        <TextField
          type="number"
          size="small"
          fullWidth
          value={editValue || 0}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          InputProps={{
            endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
          }}
        />
      ) : (
        <Typography
          variant="body1"
          className="font-mono"
          fontWeight={600}
          color={color}
        >
          {value ? (isInteger ? formatNumber(value) : formatCurrency(value)) : '-'}
          {value && isInteger ? suffix : ''}
        </Typography>
      )}
    </Box>
  );
}
