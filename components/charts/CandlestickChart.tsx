'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  IPriceLine,
  CandlestickSeries,
  HistogramSeries
} from 'lightweight-charts';
import { formatCurrency } from '@/lib/utils/formatters';
import { dateStringToTimestamp } from '@/lib/utils/dateHelpers';
import {
  getChartColors,
  getChartOptions,
  getCandlestickSeriesOptions,
  getVolumeSeriesOptions,
  VOLUME_SCALE_MARGINS,
} from '@/lib/charts/chartConfig';
import type { CandlestickData } from '@/lib/types/api';

// 디바운스 유틸리티 함수
function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface CandlestickChartProps {
  symbol: string;
  symbolName: string;
  data: CandlestickData[];
  currentPrice?: number;
  resistancePrice?: number;
  showResistanceLine?: boolean;
  orderPrice?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  height?: number;
}

export function CandlestickChart({
  symbol,
  symbolName,
  data,
  currentPrice,
  resistancePrice,
  showResistanceLine = false,
  orderPrice,
  stopLossPrice,
  takeProfitPrice,
  height = 500,
}: CandlestickChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const CHART_COLORS = useMemo(() => getChartColors(isDark), [isDark]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 가격 라인 참조 저장 (업데이트 시 제거용)
  const priceLinesRef = useRef<{
    current?: IPriceLine;
    resistance?: IPriceLine;
    order?: IPriceLine;
    stopLoss?: IPriceLine;
    takeProfit?: IPriceLine;
  }>({});

  const [tooltipData, setTooltipData] = useState<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trade_amount?: number;
    openPct: number;
    highPct: number;
    lowPct: number;
    closePct: number;
    visible: boolean;
    x: number;
    y: number;
  } | null>(null);

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: dateStringToTimestamp(d.date) as any,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      })),
    [data]
  );

  const volumeData = useMemo(
    () =>
      data.map((d) => ({
        time: dateStringToTimestamp(d.date) as any,
        value: d.volume,
        color: d.close >= d.open ? CHART_COLORS.volumeUp : CHART_COLORS.volumeDown,
      })),
    [data, CHART_COLORS]
  );

  // 1. 차트 인스턴스 생성 및 데이터 설정 (data 변경 시만 재생성)
  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chartHeight = height || chartContainerRef.current.clientHeight;
    const chart = createChart(
      chartContainerRef.current,
      getChartOptions(CHART_COLORS, chartHeight, chartContainerRef.current.clientWidth)
    );

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(
      CandlestickSeries,
      getCandlestickSeriesOptions(CHART_COLORS)
    );

    candlestickSeriesRef.current = candlestickSeries;

    const volumeSeries = chart.addSeries(HistogramSeries, getVolumeSeriesOptions());

    volumeSeries.priceScale().applyOptions({
      scaleMargins: VOLUME_SCALE_MARGINS,
    });

    volumeSeriesRef.current = volumeSeries;

    candlestickSeries.setData(chartData);
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    // Crosshair move 이벤트 (툴팁)
    const handleCrosshairMove = (param: any) => {
      if (!param.time || !param.point || !chartContainerRef.current) {
        setTooltipData(null);
        return;
      }

      const candleData = param.seriesData.get(candlestickSeries);
      if (!candleData) {
        setTooltipData(null);
        return;
      }

      // Find original data with trade_amount
      const timestamp = param.time as number;
      const currentIndex = data.findIndex((d) => dateStringToTimestamp(d.date) === timestamp);
      const originalData = currentIndex >= 0 ? data[currentIndex] : null;

      // Get previous day's data for percentage calculations
      const prevData = currentIndex > 0 ? data[currentIndex - 1] : null;

      const tooltipWidth = 200;
      const tooltipHeight = 160;
      const padding = 10;

      const container = chartContainerRef.current.getBoundingClientRect();
      let x = param.point.x;
      let y = param.point.y;

      // Adjust position to keep tooltip within bounds
      if (x + tooltipWidth + padding > container.width) {
        x = x - tooltipWidth - padding;
      } else {
        x = x + padding;
      }

      if (y + tooltipHeight + padding > container.height) {
        y = container.height - tooltipHeight - padding;
      }

      // Format date from timestamp
      const date = new Date(timestamp * 1000);
      const dateStr = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      // Calculate percentages
      const prevClose = prevData?.close || candleData.open;
      const openPct = ((candleData.open - prevClose) / prevClose) * 100;
      const highPct = ((candleData.high - candleData.open) / candleData.open) * 100;
      const lowPct = ((candleData.low - candleData.open) / candleData.open) * 100;
      const closePct = ((candleData.close - candleData.open) / candleData.open) * 100;

      setTooltipData({
        date: dateStr,
        open: candleData.open,
        high: candleData.high,
        low: candleData.low,
        close: candleData.close,
        volume: originalData?.volume || 0,
        trade_amount: originalData?.trade_amount,
        openPct,
        highPct,
        lowPct,
        closePct,
        visible: true,
        x,
        y,
      });
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    // Resize 핸들러 (디바운싱 적용)
    const handleResize = debounce(() => {
      try {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      } catch (error) {
        console.error('Chart resize failed:', error);
      }
    }, 100);

    // Window resize 이벤트
    window.addEventListener('resize', handleResize);

    // ResizeObserver로 컨테이너 크기 변경 감지 (사이드바 토글 등)
    const resizeObserver = new ResizeObserver(handleResize);

    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshairMove);

      // 차트 인스턴스 제거
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      // 참조 초기화
      candlestickSeriesRef.current = null;
      volumeSeriesRef.current = null;
      priceLinesRef.current = {};
    };
  }, [data, chartData, volumeData, CHART_COLORS, height]);  // ← 최소 의존성만

  // 2. 가격 라인 업데이트 (차트 재생성 없이 라인만 업데이트)
  useEffect(() => {
    const series = candlestickSeriesRef.current;
    if (!series) return;

    // 기존 가격 라인 모두 제거
    Object.values(priceLinesRef.current).forEach((line) => {
      if (line) {
        try {
          series.removePriceLine(line);
        } catch (e) {
          // 이미 제거된 경우 무시
        }
      }
    });
    priceLinesRef.current = {};

    // 저항선
    if (showResistanceLine && resistancePrice) {
      priceLinesRef.current.resistance = series.createPriceLine({
        price: resistancePrice,
        color: CHART_COLORS.resistanceLine,
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: '저항선',
      });
    }

    // 현재가
    if (currentPrice) {
      const lastClose = data[data.length - 1]?.close || currentPrice;
      const isRising = currentPrice >= lastClose;

      priceLinesRef.current.current = series.createPriceLine({
        price: currentPrice,
        color: isRising ? CHART_COLORS.upColor : CHART_COLORS.downColor,
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: true,
        title: '현재가',
      });
    }

    // 주문가
    if (orderPrice) {
      priceLinesRef.current.order = series.createPriceLine({
        price: orderPrice,
        color: CHART_COLORS.orderLine,
        lineWidth: 2,
        lineStyle: 0, // 실선
        axisLabelVisible: true,
        title: '주문가',
      });
    }

    // 손절가
    if (stopLossPrice) {
      priceLinesRef.current.stopLoss = series.createPriceLine({
        price: stopLossPrice,
        color: CHART_COLORS.downColor,
        lineWidth: 2,
        lineStyle: 2, // 점선
        axisLabelVisible: true,
        title: '손절가',
      });
    }

    // 목표가
    if (takeProfitPrice) {
      priceLinesRef.current.takeProfit = series.createPriceLine({
        price: takeProfitPrice,
        color: CHART_COLORS.upColor,
        lineWidth: 2,
        lineStyle: 2, // 점선
        axisLabelVisible: true,
        title: '목표가',
      });
    }
  }, [
    currentPrice,
    resistancePrice,
    showResistanceLine,
    orderPrice,
    stopLossPrice,
    takeProfitPrice,
    data,
    CHART_COLORS,
  ]);

  const priceStats = useMemo(() => {
    const firstPrice = data[0]?.close || 0;
    const lastPrice = data[data.length - 1]?.close || currentPrice || 0;
    const priceChange = lastPrice - firstPrice;
    const priceChangePct = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
    const isPositive = priceChange >= 0;

    return { firstPrice, lastPrice, priceChange, priceChangePct, isPositive };
  }, [data, currentPrice]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={1} sx={{ height: '100%', flex: 1, minHeight: 0 }}>
          {/* Chart Container */}
          <Box
            ref={chartContainerRef}
            sx={{
              width: '100%',
              height: height ? height : '100%',
              flex: height ? 'none' : 1,
              position: 'relative',
              minHeight: 0,
            }}
          >
            {/* Tooltip */}
            {tooltipData && tooltipData.visible && (
              <Box
                ref={tooltipRef}
                sx={{
                  position: 'absolute',
                  left: tooltipData.x,
                  top: tooltipData.y,
                  backgroundColor: isDark ? 'rgba(26, 32, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  border: `1px solid ${CHART_COLORS.grid}`,
                  borderRadius: 1,
                  padding: 1,
                  pointerEvents: 'none',
                  zIndex: 1000,
                  minWidth: 180,
                  boxShadow: isDark
                    ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Stack spacing={0.3}>
                  <Typography variant="caption" fontWeight={700} sx={{ color: CHART_COLORS.text, mb: 0.2, fontSize: '0.7rem' }}>
                    {tooltipData.date}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      시가
                    </Typography>
                    <Typography variant="caption" fontWeight={600} className="font-mono" sx={{ color: CHART_COLORS.text, fontSize: '0.65rem' }}>
                      {formatCurrency(tooltipData.open)}{' '}
                      <Box component="span" sx={{
                        color: tooltipData.openPct >= 0 ? CHART_COLORS.upColor : CHART_COLORS.downColor,
                        fontSize: '0.6rem'
                      }}>
                        ({tooltipData.openPct >= 0 ? '+' : ''}{tooltipData.openPct.toFixed(1)}%)
                      </Box>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      고가
                    </Typography>
                    <Typography variant="caption" fontWeight={600} className="font-mono" sx={{ color: CHART_COLORS.upColor, fontSize: '0.65rem' }}>
                      {formatCurrency(tooltipData.high)}{' '}
                      <Box component="span" sx={{
                        color: CHART_COLORS.upColor,
                        fontSize: '0.6rem'
                      }}>
                        ({tooltipData.highPct >= 0 ? '+' : ''}{tooltipData.highPct.toFixed(1)}%)
                      </Box>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      저가
                    </Typography>
                    <Typography variant="caption" fontWeight={600} className="font-mono" sx={{ color: CHART_COLORS.downColor, fontSize: '0.65rem' }}>
                      {formatCurrency(tooltipData.low)}{' '}
                      <Box component="span" sx={{
                        color: CHART_COLORS.downColor,
                        fontSize: '0.6rem'
                      }}>
                        ({tooltipData.lowPct >= 0 ? '+' : ''}{tooltipData.lowPct.toFixed(1)}%)
                      </Box>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                      종가
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      className="font-mono"
                      sx={{
                        color: tooltipData.close >= tooltipData.open
                          ? CHART_COLORS.upColor
                          : CHART_COLORS.downColor,
                        fontSize: '0.65rem'
                      }}
                    >
                      {formatCurrency(tooltipData.close)}{' '}
                      <Box component="span" sx={{
                        color: tooltipData.closePct >= 0 ? CHART_COLORS.upColor : CHART_COLORS.downColor,
                        fontSize: '0.6rem'
                      }}>
                        ({tooltipData.closePct >= 0 ? '+' : ''}{tooltipData.closePct.toFixed(1)}%)
                      </Box>
                    </Typography>
                  </Box>

                  <Box sx={{ borderTop: `1px solid ${CHART_COLORS.grid}`, pt: 0.3, mt: 0.2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                        거래량
                      </Typography>
                      <Typography variant="caption" fontWeight={600} className="font-mono" sx={{ color: CHART_COLORS.text, fontSize: '0.65rem' }}>
                        {tooltipData.volume.toLocaleString()}
                      </Typography>
                    </Box>

                    {tooltipData.trade_amount !== undefined && tooltipData.trade_amount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                          거래대금
                        </Typography>
                        <Typography variant="caption" fontWeight={600} className="font-mono" sx={{ color: CHART_COLORS.text, fontSize: '0.65rem' }}>
                          {tooltipData.trade_amount >= 100000000
                            ? `${(tooltipData.trade_amount / 100000000).toFixed(1)}억원`
                            : `${tooltipData.trade_amount.toLocaleString()}원`
                          }
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', mt: 0.5, flexShrink: 0 }}>
            {orderPrice && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 2,
                    backgroundColor: CHART_COLORS.orderLine,
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  주문가 ({formatCurrency(orderPrice)})
                </Typography>
              </Stack>
            )}
            {stopLossPrice && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 2,
                    backgroundColor: CHART_COLORS.downColor,
                    borderTop: `2px dashed ${CHART_COLORS.downColor}`,
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  손절가 ({formatCurrency(stopLossPrice)})
                </Typography>
              </Stack>
            )}
            {takeProfitPrice && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 2,
                    backgroundColor: CHART_COLORS.upColor,
                    borderTop: `2px dashed ${CHART_COLORS.upColor}`,
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  목표가 ({formatCurrency(takeProfitPrice)})
                </Typography>
              </Stack>
            )}
            {showResistanceLine && resistancePrice && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 2,
                    backgroundColor: CHART_COLORS.resistanceLine,
                    borderTop: `2px dashed ${CHART_COLORS.resistanceLine}`,
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  저항선
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
  );
}
