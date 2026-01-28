/**
 * Signal Management Tab - Refactored
 * Main component for managing trading signals
 */

import React, { useState, useMemo } from 'react';
import { Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, ToggleButtonGroup, ToggleButton, Typography, Button } from '@mui/material';
import { SignalManagementTable } from './SignalManagementTable';
import { EditSignalOrderModal } from './EditSignalOrderModal';
import { BulkEditOrdersModal } from './BulkEditOrdersModal';
import { DateFilterPanel, MonitoringFilter, OrderStatusFilter } from './DateFilterPanel';
import { BulkActionBar } from './BulkActionBar';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { Signal } from '@/lib/types/api';
import { useSignals } from '@/lib/hooks/useSignals';
import { useOrders } from '@/lib/hooks/useOrders';
import { useMarketData } from '@/lib/hooks/useMarketData';
import { useModalState } from '@/lib/hooks/useModalState';
import { useDateRangeFilter } from '@/lib/hooks/useDateRangeFilter';
import { deleteSignal, bulkDeleteSignals } from '@/lib/api/endpoints';
import { GLASS_PAPER, MONO_TEXT_SM, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

export function SignalManagementTab() {
  // Date filter
  const {
    preset,
    setPreset,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    dateRange,
  } = useDateRangeFilter();

  // Additional filters
  const [monitoringFilter, setMonitoringFilter] = useState<MonitoringFilter>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch signals - 전체 데이터를 한 번만 가져옴
  const { signals: allSignals, loading, error, refetch, updateSignalOrder, removeSignal, removeSignals } = useSignals({});
  const { updateOrder, bulkUpdateOrders } = useOrders();

  // 클라이언트에서 필터링 (날짜, 모니터링, 주문상태, 검색어)
  const signals = useMemo(() => {
    return allSignals.filter((signal) => {
      // Date filter
      if (dateRange.start && dateRange.end && signal.timestamp) {
        const signalDate = signal.timestamp.split('T')[0];
        if (signalDate < dateRange.start || signalDate > dateRange.end) {
          return false;
        }
      }

      // Monitoring filter
      if (monitoringFilter !== 'all') {
        const isMonitoring = signal.scheduled_order?.monitoring_enabled || false;
        if (monitoringFilter === 'on' && !isMonitoring) return false;
        if (monitoringFilter === 'off' && isMonitoring) return false;
      }

      // Order status filter
      if (orderStatusFilter !== 'all') {
        const orderStatus = signal.scheduled_order?.status;
        if (orderStatusFilter === 'filled' && orderStatus !== 'filled') return false;
        if (orderStatusFilter === 'pending' && orderStatus !== 'pending') return false;
        if (orderStatusFilter === 'scheduled' && orderStatus !== 'scheduled') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const symbolMatch = signal.symbol?.toLowerCase().includes(query);
        const nameMatch = signal.symbol_name?.toLowerCase().includes(query);
        if (!symbolMatch && !nameMatch) return false;
      }

      return true;
    });
  }, [allSignals, dateRange, monitoringFilter, orderStatusFilter, searchQuery]);

  // Selection state
  const [selectedSignals, setSelectedSignals] = useState<number[]>([]);

  // Modal states
  const editModal = useModalState<Signal>();
  const bulkEditModal = useModalState<{ type: 'stop_loss' | 'take_profit' }>();
  const chartModal = useModalState<{ signal: Signal; days: number }>();

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Event handlers
  const handleEdit = (signal: Signal) => {
    editModal.open(signal);
  };

  const handleViewChart = (signal: Signal) => {
    chartModal.open({ signal, days: 180 });
  };

  const { data: chartData, loading: chartLoading } = useMarketData(
    chartModal.isOpen && chartModal.data ? chartModal.data.signal.symbol : null,
    chartModal.data?.days || 180
  );

  const handleSaveOrder = async (orderId: number, request: any) => {
    try {
      const updatedOrder = await updateOrder(orderId, request);

      const signal = signals.find((s) => s.scheduled_order?.order_id === orderId);
      if (signal) {
        updateSignalOrder(signal.id, updatedOrder);
      }

      setSnackbar({ open: true, message: '주문이 수정되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('Failed to update order:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '주문 수정에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  const handleBulkEdit = (type: 'stop_loss' | 'take_profit') => {
    if (selectedSignals.length === 0) {
      setSnackbar({ open: true, message: '시그널을 선택해주세요.', severity: 'error' });
      return;
    }
    bulkEditModal.open({ type });
  };

  const handleBulkSave = async (request: any) => {
    try {
      await bulkUpdateOrders(request);
      setSnackbar({
        open: true,
        message: `${request.order_ids.length}개 주문이 수정되었습니다.`,
        severity: 'success',
      });
      setSelectedSignals([]);
      refetch();
    } catch (error) {
      console.error('Failed to bulk update orders:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : '일괄 수정에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (signalId: number) => {
    try {
      await deleteSignal(signalId);
      removeSignal(signalId); // 로컬 상태에서 제거 (새로고침 없이)
      setSnackbar({ open: true, message: '시그널이 삭제되었습니다.', severity: 'success' });
    } catch (error) {
      console.error('Failed to delete signal:', error);
      setSnackbar({
        open: true,
        message: '시그널 삭제에 실패했습니다.',
        severity: 'error',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSignals.length === 0) {
      setSnackbar({ open: true, message: '시그널을 선택해주세요.', severity: 'error' });
      return;
    }

    if (
      window.confirm(
        `${selectedSignals.length}개의 시그널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      try {
        await bulkDeleteSignals(selectedSignals);
        removeSignals(selectedSignals); // 로컬 상태에서 제거 (새로고침 없이)
        setSnackbar({
          open: true,
          message: `${selectedSignals.length}개 시그널이 삭제되었습니다.`,
          severity: 'success',
        });
        setSelectedSignals([]);
      } catch (error) {
        console.error('Failed to bulk delete signals:', error);
        setSnackbar({
          open: true,
          message: '일괄 삭제에 실패했습니다.',
          severity: 'error',
        });
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress sx={{ color: TERMINAL_COLORS.lime }} />
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            mt: 2,
          }}
        >
          시그널을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          bgcolor: 'rgba(255,0,110,0.05)',
          border: '1px solid rgba(255,0,110,0.2)',
          color: TERMINAL_COLORS.pink,
          ...MONO_TEXT_SM,
          borderRadius: '2px',
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Date Filter Panel */}
      <DateFilterPanel
        preset={preset}
        startDate={customStartDate}
        endDate={customEndDate}
        onPresetChange={setPreset}
        onStartDateChange={setCustomStartDate}
        onEndDateChange={setCustomEndDate}
        monitoringFilter={monitoringFilter}
        onMonitoringFilterChange={setMonitoringFilter}
        orderStatusFilter={orderStatusFilter}
        onOrderStatusFilterChange={setOrderStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* Signal Table */}
      <SignalManagementTable
        signals={signals}
        selectedSignals={selectedSignals}
        onSelectionChange={setSelectedSignals}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewChart={handleViewChart}
        onUpdateOrder={handleSaveOrder}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedSignals.length}
        onBulkEditStopLoss={() => handleBulkEdit('stop_loss')}
        onBulkEditTakeProfit={() => handleBulkEdit('take_profit')}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedSignals([])}
      />

      {/* Edit Order Modal */}
      <EditSignalOrderModal
        open={editModal.isOpen}
        signal={editModal.data}
        onClose={editModal.close}
        onSave={handleSaveOrder}
      />

      {/* Bulk Edit Orders Modal */}
      <BulkEditOrdersModal
        open={bulkEditModal.isOpen}
        orderIds={selectedSignals
          .map((id) => {
            const signal = signals.find((s) => s.id === id);
            return signal?.scheduled_order?.order_id;
          })
          .filter((id): id is number => id !== undefined)}
        adjustmentType={bulkEditModal.data?.type || 'stop_loss'}
        onClose={bulkEditModal.close}
        onSave={handleBulkSave}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            bgcolor: snackbar.severity === 'success' ? 'rgba(0,255,65,0.1)' : 'rgba(255,0,110,0.1)',
            color: snackbar.severity === 'success' ? TERMINAL_COLORS.lime : TERMINAL_COLORS.pink,
            border: '1px solid',
            borderColor: snackbar.severity === 'success' ? 'rgba(0,255,65,0.3)' : 'rgba(255,0,110,0.3)',
            ...MONO_TEXT_SM,
            borderRadius: '2px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Chart Modal */}
      <Dialog
        open={chartModal.isOpen}
        onClose={chartModal.close}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            ...GLASS_PAPER,
            bgcolor: 'rgba(10,10,12,0.95)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: TERMINAL_COLORS.textPrimary,
              }}
            >
              {chartData ? `${chartData.symbol_name} (${chartData.symbol})` : chartModal.data?.signal.symbol}
            </Typography>
            <ToggleButtonGroup
              value={chartModal.data?.days || 180}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null && chartModal.data) {
                  chartModal.open({ signal: chartModal.data.signal, days: newValue });
                }
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '2px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,255,65,0.15)',
                    color: TERMINAL_COLORS.lime,
                    borderColor: 'rgba(0,255,65,0.5)',
                  }
                }
              }}
            >
              <ToggleButton value={30}>30일</ToggleButton>
              <ToggleButton value={60}>60일</ToggleButton>
              <ToggleButton value={90}>90일</ToggleButton>
              <ToggleButton value={180}>180일</ToggleButton>
              <ToggleButton value={365}>1년</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </DialogTitle>
        <DialogContent>
          {chartLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: TERMINAL_COLORS.lime }} />
            </Box>
          ) : chartData && chartData.data.length > 0 ? (
            <CandlestickChart
              symbol={chartData.symbol}
              symbolName={chartData.symbol_name}
              data={chartData.data}
              currentPrice={chartModal.data?.signal.price || 0}
              orderPrice={chartModal.data?.signal.scheduled_order?.order_price}
              stopLossPrice={chartModal.data?.signal.scheduled_order?.stop_loss_price}
              takeProfitPrice={chartModal.data?.signal.scheduled_order?.take_profit_price}
              showResistanceLine={false}
              height={600}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography
                sx={{
                  ...MONO_TEXT_SM,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                차트 데이터를 불러올 수 없습니다.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={chartModal.close}
            sx={{
              borderRadius: '2px',
              textTransform: 'none',
              ...MONO_TEXT_SM,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
