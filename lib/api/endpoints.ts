/**
 * API endpoint definitions with typed functions
 */

import { apiClient } from './client';
import type {
  Strategy,
  StrategyParameters,
  StrategyPerformance,
  BacktestRequest,
  BacktestResult,
  Signal,
  SignalFilters,
  Position,
  Order,
  HealthCheck,
  PaginatedResponse,
  SymbolInfo,
  SymbolListResponse,
  NewsArticle,
  AnalysisResponse,
  OHLCVResponse,
  TradeCreateRequest,
  TradeExecutionResponse,
  TradeResponse,
  PositionDetail,
  DailyReportEnhanced,
} from '../types/api';

// ===== Strategy Endpoints =====

/**
 * Get list of all strategies
 */
export const getStrategies = () => {
  return apiClient.get<Strategy[]>('/api/v1/strategy/list');
};

/**
 * Get strategy details by name
 */
export const getStrategy = (name: string) => {
  return apiClient.get<Strategy>(`/api/v1/strategy/${name}`);
};

/**
 * Get strategy configuration
 */
export const getStrategyConfig = (name: string) => {
  return apiClient.get<StrategyParameters>(`/api/v1/strategy/${name}/config`);
};

/**
 * Update strategy configuration
 */
export const updateStrategyConfig = (
  name: string,
  config: Partial<StrategyParameters>
) => {
  return apiClient.put<Strategy>(`/api/v1/strategy/${name}/config`, config);
};

/**
 * Get strategy performance metrics
 */
export const getStrategyPerformance = (name: string) => {
  return apiClient.get<StrategyPerformance>(
    `/api/v1/strategy/${name}/performance`
  );
};

/**
 * Run backtest for strategy
 */
export const runBacktest = (request: BacktestRequest) => {
  return apiClient.post<BacktestResult>(
    `/api/v1/strategy/${request.strategy_name}/backtest`,
    request
  );
};

/**
 * Manually trigger strategy scan
 */
export const triggerStrategyRun = (name: string) => {
  return apiClient.post<{ message: string }>(`/api/v1/strategy/${name}/run`);
};

/**
 * Run strategy with optional symbol filter
 */
export const runStrategyWithSymbols = (
  strategyName: string,
  symbols?: string[],
  config?: any
) => {
  return apiClient.post<{
    status: string;
    signals_generated: number;
    signals: Array<{
      symbol: string;
      action: string;
      price: number;
      confidence: number;
      timestamp: string;
      strategy_name: string;
      metadata?: any;
    }>;
    execution_time: number;
  }>(`/api/v1/strategy/run`, {
    strategy_name: strategyName,
    symbols,
    config,
  });
};

// ===== Signal Endpoints =====

/**
 * Get all signals with optional filters
 */
export const getSignals = (filters?: SignalFilters) => {
  return apiClient.get<Signal[]>('/api/v1/signals', { params: filters });
};

/**
 * Get signal detail by symbol
 */
export const getSignal = (symbol: string) => {
  return apiClient.get<Signal>(`/api/v1/signals/${symbol}`);
};

/**
 * Get historical signals
 */
export const getSignalHistory = (filters?: SignalFilters) => {
  return apiClient.get<Signal[]>('/api/v1/signals/history', {
    params: filters,
  });
};

/**
 * Delete a signal by ID
 */
export const deleteSignal = (signalId: number) => {
  return apiClient.delete(`/api/v1/signals/${signalId}`);
};

/**
 * Delete multiple signals
 */
export const bulkDeleteSignals = (signalIds: number[]) => {
  return apiClient.post('/api/v1/signals/bulk-delete', { signal_ids: signalIds });
};

/**
 * Create multiple signals
 */
export const bulkCreateSignals = (signals: Array<{
  symbol: string;
  symbol_name?: string;
  action: string;
  price: number;
  volume?: number;
  confidence: number;
  timestamp: string;
  strategy_name: string;
  metadata?: any;
}>) => {
  return apiClient.post('/api/v1/signals/bulk-create', { signals });
};

/**
 * Delete all signals
 */
export const deleteAllSignals = () => {
  return apiClient.delete('/api/v1/signals/all?confirm=yes');
};

// ===== Order/Position Endpoints =====

/**
 * Get active positions (deprecated - use getAllPositions instead)
 */
export const getPositions = () => {
  return apiClient.get<Position[]>('/api/v1/trades/positions');
};

/**
 * Get scheduled order history
 */
export const getOrders = (params?: {
  start_date?: string;
  end_date?: string;
  status?: string;
}) => {
  return apiClient.get<Order[]>('/api/v1/orders/scheduled', { params });
};

/**
 * Get order by signal ID
 */
export const getOrderBySignal = (signalId: number) => {
  return apiClient.get<Order | null>(`/api/v1/orders/by-signal/${signalId}`);
};

/**
 * Update scheduled order
 */
export const updateOrder = (orderId: number, data: {
  order_price?: number;
  quantity?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  scheduled_date?: string;
  scheduled_time?: string;
}) => {
  return apiClient.put<Order>(`/api/v1/orders/${orderId}`, data);
};

// ===== Symbol Endpoints =====

/**
 * Get all symbols with pagination
 */
export const getSymbols = (params?: {
  market?: string;
  limit?: number;
  offset?: number;
}) => {
  return apiClient.get<SymbolListResponse>('/api/v1/symbols', { params });
};

/**
 * Get symbol details
 */
export const getSymbol = (symbol: string) => {
  return apiClient.get<SymbolInfo>(`/api/v1/symbols/${symbol}`);
};

// ===== News Endpoints =====

/**
 * Get news for specific symbol
 */
export const getSymbolNews = (
  symbol: string,
  params?: {
    days?: number;
    limit?: number;
  }
) => {
  return apiClient.get<NewsArticle[]>(`/api/v1/news/${symbol}`, { params });
};

/**
 * Get recent news for all symbols
 */
export const getRecentNews = (params?: { days?: number; limit?: number }) => {
  return apiClient.get<NewsArticle[]>('/api/v1/news', { params });
};

// ===== AI Analysis Endpoints =====

/**
 * Get AI analysis for symbol
 */
export const analyzeSymbol = (symbol: string) => {
  return apiClient.post<AnalysisResponse>(`/api/v1/analysis/symbol/${symbol}`);
};

// ===== Market Data Endpoints =====

/**
 * Get OHLCV candlestick data for a symbol
 */
export const getOHLCVData = async (
  symbol: string,
  days: number = 60
): Promise<OHLCVResponse> => {
  return apiClient.get<OHLCVResponse>(
    `/api/v1/market-data/${symbol}/ohlcv`,
    { params: { days } }
  );
};

// ===== Trade Endpoints =====

/**
 * Create and execute a trade order
 */
export const createTrade = (request: TradeCreateRequest) => {
  return apiClient.post<TradeExecutionResponse>('/api/v1/trades', request);
};

/**
 * Get trade history
 */
export const getTrades = (symbol?: string, limit?: number) => {
  const params: any = {};
  if (symbol) params.symbol = symbol;
  if (limit) params.limit = limit;
  return apiClient.get<TradeResponse[]>('/api/v1/trades', { params });
};

/**
 * Get all current positions
 */
export const getAllPositions = () => {
  return apiClient.get<PositionDetail[]>('/api/v1/trades/positions');
};

/**
 * Get position for a specific symbol
 */
export const getPositionBySymbol = (symbol: string) => {
  return apiClient.get<PositionDetail>(`/api/v1/trades/positions/${symbol}`);
};

/**
 * Delete all trades and positions
 */
export const deleteAllTrades = () => {
  return apiClient.delete('/api/v1/trades/all?confirm=yes');
};

// ===== System Health Endpoints =====

/**
 * Health check
 */
export const getHealthCheck = () => {
  return apiClient.get<HealthCheck>('/health');
};

// ===== Daily Report Enhanced Endpoints =====

/**
 * Get enhanced daily report with LLM theme analysis
 */
export const getDailyReportEnhanced = (date?: string) => {
  const params: Record<string, string> = {};
  if (date) params.date = date;
  return apiClient.get<DailyReportEnhanced>('/api/v1/trading/daily-report-enhanced', { params });
};

// ===== Export all =====

export const api = {
  // Strategy
  getStrategies,
  getStrategy,
  getStrategyConfig,
  updateStrategyConfig,
  getStrategyPerformance,
  runBacktest,
  triggerStrategyRun,

  // Signals
  getSignals,
  getSignal,
  getSignalHistory,
  bulkCreateSignals,
  bulkDeleteSignals,

  // Orders/Positions
  getPositions,
  getOrders,
  getOrderBySignal,
  updateOrder,

  // Symbols
  getSymbols,
  getSymbol,

  // News
  getSymbolNews,
  getRecentNews,

  // AI Analysis
  analyzeSymbol,

  // Market Data
  getOHLCVData,

  // Trades
  createTrade,
  getTrades,
  getAllPositions,
  getPositionBySymbol,
  deleteAllTrades,

  // System
  getHealthCheck,

  // Daily Report Enhanced
  getDailyReportEnhanced,
};
