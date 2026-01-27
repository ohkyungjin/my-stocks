/**
 * Trading-specific types for UI components
 */

export interface StockInfo {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface TradeSettings {
  buyPrice: number;
  quantity: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  reason?: string;
}

export interface PositionSummary {
  symbol: string;
  symbolName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  positionValue: number;
  allocation: number; // % of portfolio
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  todayPnL: number;
  todayPnLPercent: number;
  cash: number;
  investedValue: number;
  positions: PositionSummary[];
}

export interface TradeExecution {
  type: 'BUY' | 'SELL';
  symbol: string;
  symbolName: string;
  price: number;
  quantity: number;
  total: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  message?: string;
}

export interface PriceQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  prevClose: number;
}

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: string;
  nextClose?: string;
  timezone: string;
}
