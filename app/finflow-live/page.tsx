'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, Chip, LinearProgress, Alert, CircularProgress, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import {
  ProfitLossHero,
  BuyButton,
  SellButton,
  PullToRefresh,
  FilterChips,
  ChartModal,
} from '@/components/finflow';
import type { FilterValue } from '@/components/finflow';
import { useFinflowData } from '@/lib/hooks/useFinflowData';
import {
  COLORS,
  TEXT_HERO,
  TEXT_DISPLAY_MD,
  TEXT_HEADING_MD,
  TEXT_BODY_MD,
  TEXT_BODY_SM,
  TEXT_LABEL_SM,
  SPACING,
  SHADOWS,
  RADIUS,
} from '@/lib/theme/styleConstants';

export default function FinFlowLivePage() {
  const [selectedTab, setSelectedTab] = useState<'positions' | 'watchlist'>('positions');
  const [filterValue, setFilterValue] = useState<FilterValue>('all');
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    symbol: string;
    symbolName: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    profitLoss: number;
    profitLossPercent: number;
  } | null>(null);

  // Fetch real data from API
  const { accountData, portfolioData, isLoading, error, refresh } = useFinflowData({
    autoRefresh: true,
    refreshInterval: 10000, // 10 seconds
  });

  // Handle pull to refresh
  const handleRefresh = async () => {
    await refresh();
  };

  // Open chart modal
  const handleOpenChart = (position: any) => {
    setSelectedPosition({
      symbol: position.symbol,
      symbolName: position.symbol_name,
      quantity: position.quantity,
      avgPrice: position.avg_price,
      currentPrice: position.current_price,
      profitLoss: position.profit_loss,
      profitLossPercent: position.profit_loss_rate,
    });
    setChartModalOpen(true);
  };

  // Close chart modal
  const handleCloseChart = () => {
    setChartModalOpen(false);
    setSelectedPosition(null);
  };

  // Filter positions
  const filteredPositions = useMemo(() => {
    if (!accountData?.holdings) return [];

    let filtered = accountData.holdings;

    // Apply profit/loss filter
    if (filterValue === 'up') {
      filtered = filtered.filter((p) => p.profit_loss >= 0);
    } else if (filterValue === 'down') {
      filtered = filtered.filter((p) => p.profit_loss < 0);
    }

    // Sort by profit/loss rate (descending - highest profit first)
    return filtered.sort((a, b) => b.profit_loss_rate - a.profit_loss_rate);
  }, [accountData?.holdings, filterValue]);

  // Calculate stats
  const stats = useMemo(() => {
    const holdings = accountData?.holdings || [];
    return {
      totalCount: holdings.length,
      upCount: holdings.filter((p) => p.profit_loss > 0).length,
      downCount: holdings.filter((p) => p.profit_loss < 0).length,
    };
  }, [accountData?.holdings]);

  // Portfolio values
  const totalValue = accountData?.cash.total_assets || 0;
  const todayChange = accountData?.positions.total_profit_loss || 0;
  const todayChangePercent = accountData?.positions.total_profit_loss
    ? (accountData.positions.total_profit_loss / (accountData.positions.total_value - accountData.positions.total_profit_loss)) * 100
    : 0;
  const buyingPower = accountData?.cash.available || 0;
  const totalReturn = accountData?.portfolio?.total_return || 0;
  const totalReturnPercent = accountData?.portfolio?.total_return_percent || 0;
  const todayRealizedPL = accountData?.realized?.today_profit_loss || 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: COLORS.background.pure,
        pb: 10,
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
        }}
      >
        <Typography
          sx={{
            ...TEXT_HEADING_MD,
            color: COLORS.text.primary,
            fontWeight: 700,
          }}
        >
          FinFlow Live
        </Typography>
      </Box>

      <PullToRefresh onRefresh={handleRefresh}>
        {/* Error State */}
        {error && (
          <Box sx={{ px: SPACING[4], pt: SPACING[4] }}>
            <Alert severity="error" sx={{ mb: SPACING[4] }}>
              데이터를 불러오는데 실패했습니다. 다시 시도해주세요.
            </Alert>
          </Box>
        )}

        {/* Portfolio Hero Section */}
        <Box sx={{ px: SPACING[4], pt: SPACING[6] }}>
          {isLoading && !accountData ? (
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: `${RADIUS.md}px` }} />
          ) : (
            <ProfitLossHero
              totalValue={totalValue}
              todayChange={todayChange}
              todayChangePercent={todayChangePercent}
              showGradientBg
              animateChanges
            />
          )}

          {/* Stats Row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: SPACING[2],
              mt: SPACING[4],
            }}
          >
            {/* Buying Power */}
            <Box
              sx={{
                bgcolor: COLORS.background.secondary,
                borderRadius: `${RADIUS.md}px`,
                p: SPACING[2.5],
                border: `1px solid ${COLORS.border.default}`,
              }}
            >
              <Typography
                sx={{
                  ...TEXT_LABEL_SM,
                  color: COLORS.text.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: SPACING[1],
                  fontSize: '0.7rem',
                }}
              >
                매수가능
              </Typography>
              {isLoading && !accountData ? (
                <Skeleton width="80%" height={28} />
              ) : (
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    color: COLORS.text.primary,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  ₩{(buyingPower / 10000).toFixed(0)}만
                </Typography>
              )}
            </Box>

            {/* Total Return */}
            <Box
              sx={{
                bgcolor: COLORS.background.secondary,
                borderRadius: `${RADIUS.md}px`,
                p: SPACING[2.5],
                border: `1px solid ${COLORS.border.default}`,
              }}
            >
              <Typography
                sx={{
                  ...TEXT_LABEL_SM,
                  color: COLORS.text.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: SPACING[1],
                  fontSize: '0.7rem',
                }}
              >
                총수익률
              </Typography>
              {isLoading && !portfolioData ? (
                <Skeleton width="80%" height={28} />
              ) : (
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    color: totalReturnPercent >= 0 ? COLORS.success.main : COLORS.danger.main,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {totalReturnPercent >= 0 ? '+' : ''}
                  {totalReturnPercent.toFixed(1)}%
                </Typography>
              )}
            </Box>

            {/* Today Realized P/L */}
            <Box
              sx={{
                bgcolor: COLORS.background.secondary,
                borderRadius: `${RADIUS.md}px`,
                p: SPACING[2.5],
                border: `1px solid ${COLORS.border.default}`,
              }}
            >
              <Typography
                sx={{
                  ...TEXT_LABEL_SM,
                  color: COLORS.text.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  mb: SPACING[1],
                  fontSize: '0.7rem',
                }}
              >
                오늘실현
              </Typography>
              {isLoading && !accountData ? (
                <Skeleton width="80%" height={28} />
              ) : (
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    color: todayRealizedPL >= 0 ? COLORS.success.main : COLORS.danger.main,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {todayRealizedPL >= 0 ? '+' : ''}₩{(todayRealizedPL / 10000).toFixed(0)}만
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Tab Selector */}
        <Box
          sx={{
            display: 'flex',
            gap: SPACING[2],
            px: SPACING[4],
            mt: SPACING[4],
          }}
        >
          <Chip
            label="보유 종목"
            onClick={() => setSelectedTab('positions')}
            sx={{
              bgcolor:
                selectedTab === 'positions' ? COLORS.primary.main : COLORS.background.secondary,
              color:
                selectedTab === 'positions' ? COLORS.background.pure : COLORS.text.secondary,
              fontWeight: 600,
              fontSize: '14px',
              borderRadius: `${RADIUS.full}px`,
              px: SPACING[4],
              py: SPACING[2],
              border: `1px solid ${selectedTab === 'positions' ? COLORS.primary.main : COLORS.border.default}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor:
                  selectedTab === 'positions'
                    ? COLORS.primary.dark
                    : COLORS.background.tertiary,
              },
            }}
          />
          <Chip
            label="관심 종목"
            onClick={() => setSelectedTab('watchlist')}
            sx={{
              bgcolor:
                selectedTab === 'watchlist' ? COLORS.primary.main : COLORS.background.secondary,
              color:
                selectedTab === 'watchlist' ? COLORS.background.pure : COLORS.text.secondary,
              fontWeight: 600,
              fontSize: '14px',
              borderRadius: `${RADIUS.full}px`,
              px: SPACING[4],
              py: SPACING[2],
              border: `1px solid ${selectedTab === 'watchlist' ? COLORS.primary.main : COLORS.border.default}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor:
                  selectedTab === 'watchlist'
                    ? COLORS.primary.dark
                    : COLORS.background.tertiary,
              },
            }}
          />
        </Box>

        {/* Filter Chips */}
        {selectedTab === 'positions' && (
          <Box sx={{ px: SPACING[4], mt: SPACING[3] }}>
            <FilterChips value={filterValue} onChange={setFilterValue} />
          </Box>
        )}

        {/* Positions List */}
        {selectedTab === 'positions' && (
          <Box sx={{ px: SPACING[4], mt: SPACING[4] }}>
            {isLoading && !accountData ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: SPACING[3],
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={120}
                    sx={{ borderRadius: `${RADIUS.md}px` }}
                  />
                ))}
              </Box>
            ) : filteredPositions.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: SPACING[8],
                  color: COLORS.text.tertiary,
                }}
              >
                <Typography sx={{ ...TEXT_BODY_MD }}>
                  {filterValue !== 'all'
                    ? '필터 조건에 맞는 종목이 없습니다.'
                    : '보유 종목이 없습니다.'}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: SPACING[3],
                }}
              >
                {filteredPositions.map((position) => {
                  const isProfit = position.profit_loss >= 0;
                  const borderColor = isProfit ? COLORS.success.main : COLORS.danger.main;
                  const bgColor = isProfit
                    ? 'rgba(0, 200, 5, 0.04)'
                    : 'rgba(255, 59, 48, 0.04)';

                  return (
                    <Box
                      key={position.symbol}
                      onClick={() => handleOpenChart(position)}
                      sx={{
                        position: 'relative',
                        bgcolor: bgColor,
                        borderRadius: `${RADIUS.md}px`,
                        p: SPACING[3],
                        border: `1px solid ${COLORS.border.default}`,
                        borderLeft: `4px solid ${borderColor}`,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: SHADOWS.lg,
                          borderColor: borderColor,
                          bgcolor: isProfit
                            ? 'rgba(0, 200, 5, 0.08)'
                            : 'rgba(255, 59, 48, 0.08)',
                        },
                      }}
                    >
                      {/* Top row: Name + P/L% */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: SPACING[1],
                        }}
                      >
                        <Typography
                          sx={{
                            ...TEXT_HEADING_MD,
                            color: COLORS.text.primary,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            flex: 1,
                            mr: SPACING[2],
                          }}
                        >
                          {position.symbol_name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '1.75rem',
                            fontWeight: 800,
                            lineHeight: 1,
                            color: borderColor,
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {position.profit_loss_rate >= 0 ? '+' : ''}
                          {position.profit_loss_rate.toFixed(1)}%
                        </Typography>
                      </Box>

                      {/* Middle row: Symbol + Quantity + P/L amount */}
                      <Box sx={{ mb: SPACING[2] }}>
                        <Typography
                          sx={{
                            ...TEXT_BODY_SM,
                            color: COLORS.text.tertiary,
                            mb: SPACING[0.5],
                          }}
                        >
                          {position.symbol} · {position.quantity}주
                        </Typography>
                        <Typography
                          sx={{
                            ...TEXT_BODY_MD,
                            color: borderColor,
                            fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {position.profit_loss >= 0 ? '+' : ''}₩{position.profit_loss.toLocaleString()}
                        </Typography>
                      </Box>

                      {/* Bottom row: Current price (Avg price) */}
                      <Box>
                        <Typography
                          sx={{
                            ...TEXT_BODY_MD,
                            color: COLORS.text.primary,
                            fontWeight: 600,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          ₩{position.current_price.toLocaleString()}
                          <Typography
                            component="span"
                            sx={{
                              ...TEXT_BODY_SM,
                              color: COLORS.text.tertiary,
                              ml: SPACING[1],
                            }}
                          >
                            (평균 ₩{position.avg_price.toLocaleString()})
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Watchlist - Coming Soon */}
        {selectedTab === 'watchlist' && (
          <Box
            sx={{
              px: SPACING[4],
              mt: SPACING[8],
              textAlign: 'center',
              color: COLORS.text.tertiary,
            }}
          >
            <Typography sx={{ ...TEXT_BODY_MD }}>
              관심 종목 기능은 곧 제공됩니다.
            </Typography>
          </Box>
        )}
      </PullToRefresh>

      {/* Quick Stats Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: COLORS.background.secondary,
          borderTop: `1px solid ${COLORS.border.default}`,
          px: SPACING[4],
          py: SPACING[3],
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: SPACING[2],
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.tertiary,
              mb: SPACING[0.5],
            }}
          >
            보유
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.text.primary,
              fontWeight: 700,
            }}
          >
            {stats.totalCount}개
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.tertiary,
              mb: SPACING[0.5],
            }}
          >
            상승
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.success.main,
              fontWeight: 700,
            }}
          >
            {stats.upCount}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.tertiary,
              mb: SPACING[0.5],
            }}
          >
            하락
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_MD,
              color: COLORS.danger.main,
              fontWeight: 700,
            }}
          >
            {stats.downCount}
          </Typography>
        </Box>
      </Box>

      {/* Chart Modal */}
      {selectedPosition && (
        <ChartModal
          open={chartModalOpen}
          onClose={handleCloseChart}
          symbol={selectedPosition.symbol}
          symbolName={selectedPosition.symbolName}
          position={{
            quantity: selectedPosition.quantity,
            avgPrice: selectedPosition.avgPrice,
            currentPrice: selectedPosition.currentPrice,
            profitLoss: selectedPosition.profitLoss,
            profitLossPercent: selectedPosition.profitLossPercent,
          }}
        />
      )}
    </Box>
  );
}
