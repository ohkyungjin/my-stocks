/**
 * Type definitions for realtime monitoring features
 */

export interface MonitoringStatus {
  running: boolean;
  monitored_orders: number;
  monitored_positions: number;
  subscribed_symbols: string[];
}

export interface Holding {
  symbol: string;
  symbol_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  eval_amount: number;
  profit_loss: number;
  profit_loss_rate: number;
}

export interface AccountSummary {
  cash: {
    available: number;
    total_assets: number;
  };
  positions: {
    count: number;
    total_value: number;
    total_profit_loss: number;
  };
  realized: {
    total_profit_loss: number;
    today_profit_loss: number;
    trades_count: number;
  };
  holdings?: Holding[];
}

export interface Order {
  id: number;
  symbol: string;
  symbol_name: string;
  order_price: number;
  quantity: number;
  stop_loss_price: number;
  take_profit_price: number;
  current_price?: number;
  status: string;
  monitoring_enabled: boolean;
}

export interface WebSocketMessage {
  type: string;
  data: unknown;
}
