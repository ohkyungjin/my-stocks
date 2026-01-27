/**
 * TypeScript types for backend API integration
 * Based on FastAPI backend models
 */

// ===== Strategy Types =====

export interface StrategyParameters {
  // Common parameters (used by both strategies)
  lookback_months: number; // Default: 6
  resistance_range: number; // Default: 3.0 (%)
  min_trading_value: number; // Default: 100,000,000 (1억원)

  // Volume Breakout specific parameters
  min_days_since_max_volume?: number; // Default: 30 (일)
  same_day_surge_threshold?: number; // Default: 5 (%), 0 = disabled

  // Bearish Volume Resistance specific parameters
  min_days_since_bearish?: number; // Default: 20
  min_candle_drop?: number; // Default: 5.0 (%)
  max_upper_shadow_ratio?: number; // Default: 0.5 (50%)
  max_lower_shadow_ratio?: number; // Default: 0.3 (30%)
  max_current_volume_ratio?: number; // Default: 2.0 (2배)
  surge_filter_enabled?: boolean; // Default: true
  surge_lookback_days?: number; // Default: 20
  surge_threshold?: number; // Default: 20.0 (%)
}

export interface Strategy {
  name: string; // 'volume_breakout'
  display_name: string; // 'Volume Breakout'
  description: string;
  is_active: boolean;
  parameters: StrategyParameters;
  created_at: string;
  updated_at: string;
}

export interface StrategyPerformance {
  strategy_name: string;
  total_signals: number;
  total_trades: number;
  win_rate: number; // 0-100%
  avg_return: number; // %
  cumulative_return: number; // %
  sharpe_ratio: number;
  max_drawdown: number; // %
  best_trade: number; // %
  worst_trade: number; // %
  avg_holding_days: number;
}

export interface BacktestRequest {
  strategy_name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  parameters?: StrategyParameters; // Optional override
}

export interface BacktestTrade {
  symbol: string;
  entry_date: string;
  exit_date: string;
  entry_price: number;
  exit_price: number;
  return_pct: number;
  holding_days: number;
}

export interface BacktestResult {
  strategy_name: string;
  period: { start: string; end: string };
  total_trades: number;
  profitable_trades: number;
  win_rate: number;
  total_return: number;
  annualized_return: number;
  sharpe_ratio: number;
  max_drawdown: number;
  trades: BacktestTrade[];
  equity_curve: Array<{ date: string; value: number }>;
}

// ===== Signal Types =====

export interface SignalMetadata {
  // Volume Breakout 전략 필드
  resistance_price?: number;
  max_volume_date?: string;
  distance_pct?: number;
  max_volume_close?: number;
  price_diff_pct?: number;
  current_volume?: number;
  volume_ratio_pct?: number;
  signal_type?: string;
  max_volume?: number;

  // Bearish Volume Resistance 전략 필드
  bearish_candle_date?: string;
  bearish_volume?: number;
  bearish_drop_pct?: number;
  days_since_bearish?: number;

  // 다른 전략의 필드를 위해 확장 가능
  [key: string]: any;
}

export interface ScheduledOrderInfo {
  order_id: number;
  order_price: number;
  quantity: number;
  stop_loss_price: number;
  take_profit_price: number;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  monitoring_enabled: boolean;
  kis_order_no?: string;
  filled_at?: string;
  filled_price?: number;
}

export interface Signal {
  id: number;  // string → number (백엔드와 일치)
  symbol: string;
  symbol_name: string;
  action: 'buy' | 'sell' | 'hold';  // 대문자 → 소문자 (백엔드와 일치)
  signal_type?: string;
  price: number;
  volume: number;
  confidence?: number;
  timestamp: string;
  strategy_name: string;
  metadata: SignalMetadata;
  ai_analyzed?: boolean;
  ai_total_score?: number;
  ai_recommendation?: string;
  status?: string;
  created_at?: string;
  scheduled_order?: ScheduledOrderInfo;  // 예약 주문 정보
}

// ===== Trade Journal Types =====
// ===== AI Agent Types =====

export type AgentName = 'financial' | 'supply_demand' | 'news';

export interface AgentResult {
  agent_name: AgentName;
  score: number; // 0-100
  confidence: number; // 0.0-1.0
  rationale: string;
  key_points: string[];
  metadata: Record<string, any>;
}

// ===== Order/Position Types =====

export interface Position {
  symbol: string;
  symbol_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  position_value: number;
  stop_loss_price?: number;
  take_profit_price?: number;
}

export interface Order {
  id: number;
  signal_id: number;
  journal_id: number | null;
  symbol: string;
  symbol_name: string;
  order_type: string;
  order_price: number;
  quantity: number;
  amount: number;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  created_at: string;
}

export interface UpdateOrderRequest {
  order_price?: number;
  quantity?: number;
  stop_loss_price?: number;
  take_profit_price?: number;
  scheduled_date?: string;
  scheduled_time?: string;
}

export interface BulkUpdateOrdersRequest {
  order_ids: number[];
  adjustment_type: 'stop_loss_pct' | 'take_profit_pct';
  adjustment_value: number;
}

// ===== System Health Types =====

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: boolean;
    kis_api: boolean;
    telegram: boolean;
    llm: boolean;
  };
}

// ===== API Response Types =====

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ===== Filter/Query Types =====

export interface SignalFilters extends Record<string, string | undefined> {
  strategy_name?: string;
  symbol?: string;
  start_date?: string;
  end_date?: string;
  action?: 'BUY' | 'SELL' | 'HOLD';
  sort_by?: 'created_at' | 'volume' | 'confidence' | 'price';
  sort_order?: 'asc' | 'desc';
  limit?: string;
}

// ===== Symbol Types =====

export interface SymbolInfo {
  symbol: string;
  name: string;
  market: string;
  sector?: string;
  listed_shares?: number;
  market_cap?: number;
}

export interface SymbolListResponse {
  symbols: SymbolInfo[];
  total: number;
}

// ===== News Types =====

export interface NewsArticle {
  id: number;
  symbol: string;
  title: string;
  snippet?: string;
  source?: string;
  published_date?: string;
  link?: string;
  sentiment?: string;
  sentiment_score?: number;
  fetched_at: string;
}

// ===== AI Analysis Types =====

export interface AgentAnalysisResult {
  score: number;
  confidence: number;
  rationale: string;
  key_points: string[];
  metadata?: Record<string, any>;
}

export interface AnalysisResponse {
  symbol: string;
  symbol_name: string;
  decision: string; // 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  confidence: number;
  total_score: number;
  rationale: string;
  key_points: string[];
  financial_analysis?: AgentAnalysisResult;
  supply_demand_analysis?: AgentAnalysisResult;
  news_analysis?: AgentAnalysisResult;
  analyzed_at: string;
}

// ===== Chart Data Types =====

export interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade_amount?: number; // 거래대금 (원)
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface PerformanceData {
  date: string;
  portfolio_value: number;
  daily_return: number;
  cumulative_return: number;
}

export interface OHLCVResponse {
  symbol: string;
  symbol_name: string;
  data: CandlestickData[];
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
}

// ===== Daily Report Enhanced Types =====

export interface ThemeStats {
  buy_count: number;
  buy_amount: number;
  sell_count: number;
  realized_profit_loss: number;
  unrealized_profit_loss: number;
  total_profit_loss: number;
  profit_rate: number; // 수익률 %
  symbols: string[];
  symbol_details: Array<{
    symbol: string;
    name: string;
  }>;
}

export interface TopPerformer {
  symbol: string;
  symbol_name: string;
  profit_loss: number;
  profit_loss_percent: number;
  buy_price: number;
  sell_price: number;
  is_realized: boolean; // true: 실현 손익, false: 미실현 손익
}

export interface DailyReportEnhanced {
  date: string;
  summary: {
    total_buys: number;
    total_sells: number;
    total_buy_amount: number;
    total_sell_amount: number;
    total_realized_profit_loss: number;
    win_rate: number;
    holding_positions: number;
  };
  theme_classification: Record<string, string[]>; // { "반도체": ["005930", ...] }
  theme_stats: Record<string, ThemeStats>;
  top_gainers: TopPerformer[];
  top_losers: TopPerformer[];
}

// ===== Trade & Position Types =====

export interface TradeCreateRequest {
  symbol: string;
  symbol_name?: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  order_type: 'market' | 'limit';
  target_price?: number;
  stop_loss_price?: number;
  strategy?: string;
  notes?: string;
}

export interface TradeResponse {
  id: number;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  total_amount: number;
  commission: number;
  tax: number;
  order_id: string | null;
  status: string;
  strategy: string | null;
  notes: string | null;
  traded_at: string;
  created_at: string;
}

export interface PositionDetail {
  id: number;
  symbol: string;
  name: string | null;
  quantity: number;
  avg_price: number;
  current_price: number | null;
  total_value: number | null;
  profit_loss: number | null;
  profit_loss_rate: number | null;
  stop_loss_price: number | null;
  take_profit_price: number | null;
  entry_date: string;
  updated_at: string;
  created_at: string;
}

export interface TradeExecutionResponse {
  success: boolean;
  message: string;
  trade: TradeResponse;
  position: PositionDetail | null;
}
