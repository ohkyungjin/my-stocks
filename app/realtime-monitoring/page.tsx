'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Chip,
  List,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Circle as CircleIcon,
  Lens as LensIcon,
} from '@mui/icons-material';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { CandlestickChartDynamic } from '@/components/charts/ChartDynamic';
import { PositionListItem, WatchlistItem } from '@/components/monitoring';
import { getOHLCVData } from '@/lib/api/endpoints';
import { formatCurrency } from '@/lib/utils/formatters';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api/client';
import {
  GLASS_PAPER,
  MONO_TEXT_SM,
  MONO_TEXT_MD,
  MONO_TEXT_XS,
  TERMINAL_COLORS,
  SECTION_HEADER,
  METRIC_LABEL,
  METRIC_VALUE,
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
            <Stack spacing={2} sx={{ height: '100%' }}>
              {/* Rising Holdings */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '4px',
                  bgcolor: 'rgba(10,10,12,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,255,65,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(50% - 8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: TERMINAL_COLORS.lime,
                    }}
                  >
                    실시간 상승
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: '2px',
                      bgcolor: 'rgba(0,255,65,0.1)',
                      border: '1px solid rgba(0,255,65,0.3)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: TERMINAL_COLORS.lime,
                      }}
                    >
                      {risingHoldings.length}
                    </Typography>
                  </Box>
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
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'rgba(0,255,65,0.2)',
                      borderRadius: '3px',
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
                          fontFamily: '"JetBrains Mono", monospace',
                          color: 'rgba(255,255,255,0.3)',
                          fontSize: '0.75rem',
                        }}
                      >
                        상승 종목 없음
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Falling Holdings */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '4px',
                  bgcolor: 'rgba(10,10,12,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,0,110,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(50% - 8px)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: TERMINAL_COLORS.pink,
                    }}
                  >
                    실시간 하락
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: '2px',
                      bgcolor: 'rgba(255,0,110,0.1)',
                      border: '1px solid rgba(255,0,110,0.3)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: TERMINAL_COLORS.pink,
                      }}
                    >
                      {fallingHoldings.length}
                    </Typography>
                  </Box>
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
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: 'rgba(255,0,110,0.2)',
                      borderRadius: '3px',
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
                          fontFamily: '"JetBrains Mono", monospace',
                          color: 'rgba(255,255,255,0.3)',
                          fontSize: '0.75rem',
                        }}
                      >
                        하락 종목 없음
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Box>

          {/* Center - Chart Section */}
          <Box sx={{ flex: 1, height: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '4px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'rgba(10,10,12,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
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
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '4px',
                      background: activeHolding
                        ? `linear-gradient(135deg, ${activeHolding.profit_loss_rate >= 0 ? 'rgba(0,255,65,0.15)' : 'rgba(255,0,110,0.15)'}, transparent)`
                        : 'rgba(255,255,255,0.03)',
                      border: '1px solid',
                      borderColor: activeHolding
                        ? (activeHolding.profit_loss_rate >= 0 ? 'rgba(0,255,65,0.3)' : 'rgba(255,0,110,0.3)')
                        : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: activeHolding
                        ? (activeHolding.profit_loss_rate >= 0 ? '#00FF41' : '#FF006E')
                        : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {selectedSymbol ? selectedSymbol.substring(0, 2) : '?'}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        mb: 0.5,
                        color: '#FFFFFF',
                      }}
                    >
                      {activeHolding ? activeHolding.symbol_name : (selectedOrder ? selectedOrder.symbol_name : selectedSymbol || '종목 선택')}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.5)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {selectedSymbol || '종목 없음'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack alignItems="flex-end">
                  <Stack direction="row" alignItems="baseline" spacing={1.5}>
                    {activeHolding && (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '2px',
                          bgcolor: activeHolding.profit_loss_rate >= 0 ? 'rgba(0,255,65,0.1)' : 'rgba(255,0,110,0.1)',
                          border: '1px solid',
                          borderColor: activeHolding.profit_loss_rate >= 0 ? 'rgba(0,255,65,0.3)' : 'rgba(255,0,110,0.3)',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: activeHolding.profit_loss_rate >= 0 ? '#00FF41' : '#FF006E',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {activeHolding.profit_loss_rate >= 0 ? '+' : ''}{activeHolding.profit_loss_rate.toFixed(2)}%
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '2.2rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
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
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.4)',
                      mt: 0.5,
                      letterSpacing: '0.05em',
                    }}
                  >
                    마지막 업데이트: {currentTime || '--:--:--'}
                  </Typography>
                </Stack>
              </Stack>

              {/* Timeframe Controls */}
              <Stack direction="row" spacing={1.5} mb={3} sx={{ position: 'relative', zIndex: 1 }}>
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
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: timeframe === tf.value ? '#00FF41' : 'rgba(255,255,255,0.1)',
                      bgcolor: timeframe === tf.value ? 'rgba(0,255,65,0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#00FF41',
                        bgcolor: 'rgba(0,255,65,0.05)',
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: timeframe === tf.value ? '#00FF41' : 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.05em',
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
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {selectedSymbol
                        ? (isLoadingChart ? '차트 데이터 로딩 중...' : '차트 데이터 없음')
                        : '종목을 선택해주세요'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Right - Watchlist */}
          <Box sx={{ width: { xs: '100%', lg: '280px' }, flexShrink: 0, height: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '4px',
                bgcolor: 'rgba(10,10,12,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  관심종목
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '2px',
                    bgcolor: 'rgba(0,255,65,0.1)',
                    border: '1px solid rgba(0,255,65,0.3)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#00FF41',
                    }}
                  >
                    {scheduledOrders.length}
                  </Typography>
                </Box>
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
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
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
                          fontFamily: '"JetBrains Mono", monospace',
                          color: 'rgba(255,255,255,0.3)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        예약 주문 없음
                      </Typography>
                    </Box>
                  )}
                </List>
              </Box>
            </Paper>
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
