'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Stack, List } from '@mui/material';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CandlestickChartDynamic } from '@/components/charts/ChartDynamic';
import { PositionListItem, WatchlistItem } from '@/components/monitoring';
import { getOHLCVData } from '@/lib/api/endpoints';
import { formatCurrency } from '@/lib/utils/formatters';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import {
  MONO_TEXT_SM,
  MONO_TEXT_MD,
  MONO_TEXT_LG,
  MONO_TEXT_XL,
  MONO_TEXT_XS,
  TERMINAL_COLORS,
  SPACING,
  RADIUS,
} from '@/lib/theme/styleConstants';
import type { CandlestickData } from '@/lib/types/api';
import type {
  MonitoringStatus,
  Holding,
  AccountSummary,
  Order,
  WebSocketMessage,
} from '@/lib/types/monitoring';

// --- Inline components removed - now imported from @/components/monitoring ---

// --- Page Component ---

function RealtimeMonitoringPageContent() {
  // State
  const [status, setStatus] = useState<MonitoringStatus>({
    running: false,
    monitored_orders: 0,
    monitored_positions: 0,
    subscribed_symbols: [],
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [accountSummary, setAccountSummary] = useState<AccountSummary>({
    cash: { available: 0, total_assets: 0 },
    positions: { count: 0, total_value: 0, total_profit_loss: 0 },
    realized: { total_profit_loss: 0, today_profit_loss: 0, trades_count: 0 },
    holdings: [],
  });

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [timeframe, setTimeframe] = useState<string>('180');
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // API Base URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

  // --- Timeframe to days mapping ---
  const timeframeToDays: Record<string, number> = {
    '90': 90,
    '180': 180,
    '365': 365,
  };

  // --- Initial Data Fetching ---
  const fetchInitialData = async (isInitialLoad = false) => {
    try {
      // Fetch data sequentially with better error handling
      try {
        const statusData = await apiClient.get<MonitoringStatus>('/api/realtime/monitoring/status');
        if (statusData) setStatus(statusData);
      } catch (err) {
        console.error('Failed to fetch monitoring status:', err);
      }

      try {
        const ordersData = await apiClient.get<Order[]>('/api/v1/orders/scheduled');
        if (ordersData) {
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }

      try {
        const accountData = await apiClient.get<AccountSummary>('/api/realtime/account/summary');
        if (accountData) {
          setAccountSummary(accountData);
          // 최초 로드 시에만 첫 번째 종목 선택 (폴링 시에는 선택 유지)
          if (isInitialLoad && accountData.holdings && accountData.holdings.length > 0) {
            setSelectedSymbol(accountData.holdings[0].symbol);
          }
        }
      } catch (err) {
        console.error('Failed to fetch account summary:', err);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  useEffect(() => {
    // 최초 로드 시에는 첫 번째 종목 선택
    fetchInitialData(true);

    // 5초마다 손익률, 현재가, 계좌 요약 갱신 (선택된 종목 유지, 차트 제외)
    const interval = setInterval(() => fetchInitialData(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Chart Data Fetching ---
  useEffect(() => {
    if (!selectedSymbol) return;

    const fetchChart = async () => {
      setIsLoadingChart(true);
      try {
        const days = timeframeToDays[timeframe] || 60;
        const res = await getOHLCVData(selectedSymbol, days);
        if (res && res.data) {
          setChartData(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    fetchChart();
  }, [selectedSymbol, timeframe]);

  // --- WebSocket Connection ---
  useEffect(() => {
    let websocket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let isCleanupCalled = false;

    const connect = () => {
      if (isCleanupCalled) return;

      try {
        const wsUrl = apiUrl.replace('http', 'ws');
        const url = `${wsUrl}/api/realtime/ws`;

        websocket = new WebSocket(url);

        websocket.onopen = () => {
          reconnectAttempts = 0;
          if (websocket?.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({ type: 'subscribe', topic: 'orders' }));
            websocket.send(JSON.stringify({ type: 'subscribe', topic: 'executions' }));
            websocket.send(JSON.stringify({ type: 'subscribe', topic: 'status' }));
          }
        };

        websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            handleWebSocketMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        websocket.onclose = (event) => {
          if (isCleanupCalled) return;

          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectTimeout = setTimeout(connect, delay);
          }
        };
      } catch (error) {
        console.error('[WebSocket] Failed to create connection:', error);
      }
    };

    connect();

    return () => {
      isCleanupCalled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (websocket) websocket.close();
    };
  }, [apiUrl]);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'order_update': {
        const orderData = message.data as Partial<Order> & { order_id: number };
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderData.order_id
              ? { ...order, ...orderData }
              : order
          )
        );
        break;
      }

      case 'price_update': {
        const { symbol, price } = message.data as { symbol: string; price: number };
        setOrders((prev) =>
          prev.map((order) =>
            order.symbol === symbol ? { ...order, current_price: price } : order
          )
        );
        setAccountSummary(prev => {
          if (!prev.holdings) return prev;
          const updatedHoldings = prev.holdings.map(h =>
            h.symbol === symbol ? {
              ...h,
              current_price: price,
              eval_amount: price * h.quantity,
              profit_loss: (price - h.avg_price) * h.quantity,
              profit_loss_rate: ((price - h.avg_price) / h.avg_price) * 100
            } : h
          );
          return { ...prev, holdings: updatedHoldings };
        });
        break;
      }

      case 'execution':
        fetchInitialData();
        break;

      case 'service_status':
        setStatus(message.data as MonitoringStatus);
        break;
    }
  };

  const activeHolding = accountSummary.holdings?.find(h => h.symbol === selectedSymbol);

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
    const order = orders.find(o => o.symbol === symbol);
    setSelectedOrder(order || null);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };


  const scheduledOrders = orders.filter(order =>
    order.status === 'scheduled' || order.status === 'SCHEDULED'
  );

  // 상승/하락 종목 분리 및 정렬
  const { risingHoldings, fallingHoldings } = useMemo(() => {
    if (!accountSummary.holdings) return { risingHoldings: [], fallingHoldings: [] };

    const rising = accountSummary.holdings
      .filter(h => h.profit_loss_rate >= 0)
      .sort((a, b) => b.profit_loss_rate - a.profit_loss_rate);

    const falling = accountSummary.holdings
      .filter(h => h.profit_loss_rate < 0)
      .sort((a, b) => a.profit_loss_rate - b.profit_loss_rate); // 하락률 큰 순

    return { risingHoldings: rising, fallingHoldings: falling };
  }, [accountSummary.holdings]);

  const totalProfitLossRate = accountSummary.holdings && accountSummary.holdings.length > 0
    ? accountSummary.holdings.reduce((sum, h) => sum + h.profit_loss_rate, 0) / accountSummary.holdings.length
    : 0;
  const isOverallPositive = totalProfitLossRate >= 0;

  return (
    <DashboardShell>
      <Box sx={{ width: '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

          body {
            background: #000000;
          }
        `}</style>

        {/* Main Content Area - 3 Column Layout */}
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ flex: 1, width: '100%', maxWidth: '100%', minHeight: 0 }}>

          {/* Left - Rising & Falling */}
          <Box sx={{ width: { xs: '100%', lg: '280px' }, flexShrink: 0, height: '100%' }}>
            <Stack spacing={SPACING[2]} sx={{ height: '100%' }}>
              {/* Rising Holdings */}
              <Card
                variant="highlight"
                padding="md"
                sx={{
                  borderColor: TERMINAL_COLORS.lime,
                  bgcolor: 'rgba(0, 255, 65, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(50% - 8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography
                    sx={{
                      ...MONO_TEXT_MD,
                      fontWeight: 800,
                      color: TERMINAL_COLORS.lime,
                    }}
                  >
                    실시간 상승
                  </Typography>
                  <Badge variant="success" size="sm">
                    {risingHoldings.length}
                  </Badge>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: 'rgba(255,255,255,0.02)',
                      borderRadius: RADIUS.sm,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'rgba(0,255,65,0.2)',
                      borderRadius: RADIUS.sm,
                      '&:hover': {
                        bgcolor: 'rgba(0,255,65,0.3)',
                      }
                    }
                  }}
                >
                  {risingHoldings.length > 0 ? (
                    risingHoldings.map((holding) => (
                      <PositionListItem
                        key={holding.symbol}
                        holding={holding}
                        isSelected={selectedSymbol === holding.symbol}
                        onClick={() => handleSymbolClick(holding.symbol)}
                      />
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography
                        sx={{
                          ...MONO_TEXT_SM,
                          color: TERMINAL_COLORS.textTertiary,
                        }}
                      >
                        상승 종목 없음
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>

              {/* Falling Holdings */}
              <Card
                variant="highlight"
                padding="md"
                sx={{
                  borderColor: TERMINAL_COLORS.pink,
                  bgcolor: 'rgba(255, 0, 110, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(50% - 8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography
                    sx={{
                      ...MONO_TEXT_MD,
                      fontWeight: 800,
                      color: TERMINAL_COLORS.pink,
                    }}
                  >
                    실시간 하락
                  </Typography>
                  <Badge variant="error" size="sm">
                    {fallingHoldings.length}
                  </Badge>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: 'rgba(255,255,255,0.02)',
                      borderRadius: RADIUS.sm,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'rgba(255,0,110,0.2)',
                      borderRadius: RADIUS.sm,
                      '&:hover': {
                        bgcolor: 'rgba(255,0,110,0.3)',
                      }
                    }
                  }}
                >
                  {fallingHoldings.length > 0 ? (
                    fallingHoldings.map((holding) => (
                      <PositionListItem
                        key={holding.symbol}
                        holding={holding}
                        isSelected={selectedSymbol === holding.symbol}
                        onClick={() => handleSymbolClick(holding.symbol)}
                      />
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography
                        sx={{
                          ...MONO_TEXT_SM,
                          color: TERMINAL_COLORS.textTertiary,
                        }}
                      >
                        하락 종목 없음
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Stack>
          </Box>

          {/* Center - Chart Section */}
          <Box sx={{ flex: 1, height: '100%' }}>
            <Card
              variant="default"
              padding="lg"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at top left, rgba(0,255,65,0.03) 0%, transparent 50%)',
                  pointerEvents: 'none',
                },
              }}
            >
              {/* Chart Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={SPACING[3]} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={SPACING[2]} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: RADIUS.md,
                      background: activeHolding
                        ? `linear-gradient(135deg, ${activeHolding.profit_loss_rate >= 0 ? 'rgba(0,255,65,0.15)' : 'rgba(255,0,110,0.15)'}, transparent)`
                        : 'rgba(255,255,255,0.03)',
                      border: '1px solid',
                      borderColor: activeHolding
                        ? (activeHolding.profit_loss_rate >= 0 ? TERMINAL_COLORS.lime : TERMINAL_COLORS.pink)
                        : TERMINAL_COLORS.borderDefault,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...MONO_TEXT_XL,
                      fontWeight: 800,
                      color: activeHolding
                        ? (activeHolding.profit_loss_rate >= 0 ? TERMINAL_COLORS.lime : TERMINAL_COLORS.pink)
                        : TERMINAL_COLORS.textTertiary,
                    }}
                  >
                    {selectedSymbol ? selectedSymbol.substring(0, 2) : '?'}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        ...MONO_TEXT_XL,
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        mb: 0.5,
                        color: TERMINAL_COLORS.textPrimary,
                      }}
                    >
                      {activeHolding ? activeHolding.symbol_name : (selectedOrder ? selectedOrder.symbol_name : selectedSymbol || '종목 선택')}
                    </Typography>
                    <Typography
                      sx={{
                        ...MONO_TEXT_SM,
                        color: TERMINAL_COLORS.textSecondary,
                      }}
                    >
                      {selectedSymbol || '종목 없음'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack alignItems="flex-end">
                  <Stack direction="row" alignItems="baseline" spacing={1.5}>
                    {activeHolding && (
                      <Badge
                        variant={activeHolding.profit_loss_rate >= 0 ? 'success' : 'error'}
                        size="md"
                        sx={{ fontSize: '0.9rem', fontWeight: 800 }}
                      >
                        {activeHolding.profit_loss_rate >= 0 ? '+' : ''}{activeHolding.profit_loss_rate.toFixed(2)}%
                      </Badge>
                    )}
                    <Typography
                      sx={{
                        ...MONO_TEXT_XL,
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        color: TERMINAL_COLORS.textPrimary,
                      }}
                    >
                      {activeHolding
                        ? formatCurrency(activeHolding.current_price)
                        : (selectedOrder
                          ? formatCurrency(selectedOrder.current_price || selectedOrder.order_price)
                          : '₩0'
                        )
                      }
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      ...MONO_TEXT_XS,
                      color: TERMINAL_COLORS.textTertiary,
                      mt: 0.5,
                    }}
                  >
                    마지막 업데이트: {currentTime || '--:--:--'}
                  </Typography>
                </Stack>
              </Stack>

              {/* Timeframe Controls */}
              <Stack direction="row" spacing={1.5} mb={SPACING[3]} sx={{ position: 'relative', zIndex: 1 }}>
                {[
                  { value: '90', label: '3개월' },
                  { value: '180', label: '6개월' },
                  { value: '365', label: '1년' },
                ].map((tf) => (
                  <Box
                    key={tf.value}
                    onClick={() => handleTimeframeChange(tf.value)}
                    sx={{
                      px: 2.5,
                      py: 0.8,
                      borderRadius: RADIUS.sm,
                      border: '1px solid',
                      borderColor: timeframe === tf.value ? TERMINAL_COLORS.lime : TERMINAL_COLORS.borderDefault,
                      bgcolor: timeframe === tf.value ? 'rgba(0,255,65,0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: TERMINAL_COLORS.lime,
                        bgcolor: 'rgba(0,255,65,0.05)',
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        ...MONO_TEXT_SM,
                        fontWeight: 700,
                        color: timeframe === tf.value ? TERMINAL_COLORS.lime : TERMINAL_COLORS.textSecondary,
                      }}
                    >
                      {tf.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Chart Container */}
              <Box sx={{ flexGrow: 1, position: 'relative', width: '100%', zIndex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                {selectedSymbol && chartData.length > 0 ? (
                  <Box sx={{ width: '100%', height: '100%', flex: 1, minHeight: 0 }}>
                    <CandlestickChartDynamic
                      symbol={selectedSymbol}
                      symbolName={activeHolding?.symbol_name || selectedOrder?.symbol_name || selectedSymbol}
                      data={chartData}
                      currentPrice={activeHolding?.current_price || selectedOrder?.current_price || selectedOrder?.order_price}
                    />
                  </Box>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isLoadingChart ? (
                      <LoadingState message="차트 데이터 로딩 중..." variant="spinner" minHeight="100%" />
                    ) : (
                      <Typography
                        sx={{
                          ...MONO_TEXT_MD,
                          color: TERMINAL_COLORS.textTertiary,
                        }}
                      >
                        {selectedSymbol ? '차트 데이터 없음' : '종목을 선택해주세요'}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Card>
          </Box>

          {/* Right - Watchlist */}
          <Box sx={{ width: { xs: '100%', lg: '280px' }, flexShrink: 0, height: '100%' }}>
            <Card
              variant="default"
              padding="md"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexShrink: 0 }}>
                <Typography
                  sx={{
                    ...MONO_TEXT_MD,
                    fontWeight: 800,
                    color: TERMINAL_COLORS.textPrimary,
                  }}
                >
                  관심종목
                </Typography>
                <Badge variant="info" size="sm">
                  {scheduledOrders.length}
                </Badge>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: RADIUS.sm,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: RADIUS.sm,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }
                  }
                }}
              >
                <List sx={{ py: 0, px: 0 }}>
                  {scheduledOrders.map((order) => (
                    <WatchlistItem
                      key={order.id}
                      order={order}
                      onClick={() => handleSymbolClick(order.symbol)}
                    />
                  ))}
                  {scheduledOrders.length === 0 && (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography
                        sx={{
                          ...MONO_TEXT_SM,
                          color: TERMINAL_COLORS.textTertiary,
                        }}
                      >
                        예약 주문 없음
                      </Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Card>
          </Box>

        </Stack>
      </Box>
    </DashboardShell>
  );
}

export default function RealtimeMonitoringPage() {
  return (
    <ProtectedRoute>
      <RealtimeMonitoringPageContent />
    </ProtectedRoute>
  );
}
