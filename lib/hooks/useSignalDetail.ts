/**
 * Custom hook for managing signal detail modal data
 * Handles chart data, order data, AI analysis, and news fetching
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Signal,
  CandlestickData,
  Order,
  UpdateOrderRequest,
  AnalysisResponse,
  NewsArticle,
} from '@/lib/types/api';
import {
  getOHLCVData,
  getOrderBySignal,
  updateOrder,
  analyzeSymbol,
  getSymbolNews,
} from '@/lib/api/endpoints';

interface UseSignalDetailProps {
  signal: Signal | null;
  open: boolean;
}

export function useSignalDetail({ signal, open }: UseSignalDetailProps) {
  // Chart state
  const [chartPeriod, setChartPeriod] = useState(60);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<Error | null>(null);

  // Order state
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editedOrder, setEditedOrder] = useState<UpdateOrderRequest>({});
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderSaveSuccess, setOrderSaveSuccess] = useState(false);

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // News state
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsExpanded, setNewsExpanded] = useState(false);

  // Fetch chart data
  const fetchChartData = useCallback(async () => {
    if (!signal) return;

    try {
      setChartLoading(true);
      setChartError(null);
      const response = await getOHLCVData(signal.symbol, chartPeriod);
      setChartData(response.data);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
      setChartError(err as Error);
    } finally {
      setChartLoading(false);
    }
  }, [signal, chartPeriod]);

  // Fetch order data
  const fetchOrder = useCallback(async () => {
    if (!signal || !signal.id) return;

    try {
      setOrderLoading(true);
      const orderData = await getOrderBySignal(signal.id);
      setOrder(orderData);
      if (orderData) {
        setEditedOrder({
          order_price: orderData.order_price,
          quantity: orderData.quantity,
          stop_loss_price: orderData.stop_loss_price || undefined,
          take_profit_price: orderData.take_profit_price || undefined,
        });
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setOrderLoading(false);
    }
  }, [signal]);

  // Save order
  const handleSaveOrder = useCallback(async () => {
    if (!order) return;

    try {
      setOrderSaving(true);
      await updateOrder(order.id, editedOrder);
      await fetchOrder();
      setIsEditingOrder(false);
      setOrderSaveSuccess(true);
      setTimeout(() => setOrderSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save order:', err);
      alert('주문 수정 실패');
    } finally {
      setOrderSaving(false);
    }
  }, [order, editedOrder, fetchOrder]);

  // Cancel order editing
  const handleCancelEdit = useCallback(() => {
    if (order) {
      setEditedOrder({
        order_price: order.order_price,
        quantity: order.quantity,
        stop_loss_price: order.stop_loss_price || undefined,
        take_profit_price: order.take_profit_price || undefined,
      });
    }
    setIsEditingOrder(false);
  }, [order]);

  // Fetch AI analysis
  const handleAIAnalysis = useCallback(async () => {
    if (!signal) return;

    try {
      setAiLoading(true);
      setAiError(null);
      const analysis = await analyzeSymbol(signal.symbol);
      setAiAnalysis(analysis);
    } catch (err) {
      console.error('Failed to fetch AI analysis:', err);
      setAiError(err instanceof Error ? err.message : 'AI 분석을 불러올 수 없습니다');
    } finally {
      setAiLoading(false);
    }
  }, [signal]);

  // Fetch news
  const fetchNews = useCallback(async () => {
    if (!signal) return;

    try {
      setNewsLoading(true);
      const newsData = await getSymbolNews(signal.symbol, { days: 7, limit: 10 });
      setNews(newsData);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setNewsLoading(false);
    }
  }, [signal]);

  // Effect: Load data when modal opens
  useEffect(() => {
    if (signal && open) {
      fetchChartData();
      fetchOrder();
      fetchNews();
    }
  }, [signal, open, fetchChartData, fetchOrder, fetchNews]);

  return {
    // Chart
    chartPeriod,
    setChartPeriod,
    chartData,
    chartLoading,
    chartError,
    fetchChartData,

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
    fetchNews,
  };
}
