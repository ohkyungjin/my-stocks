'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

// ===== Type Definitions =====

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
  portfolio: {
    total_return: number;
    total_return_percent: number;
    total_invested: number;
  };
  holdings: PositionSummary[];
}

export interface PositionSummary {
  symbol: string;
  symbol_name: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  eval_amount: number;
  profit_loss: number;
  profit_loss_rate: number;
}

export interface PortfolioSummary {
  total_value: number;
  total_return: number;
  total_return_percent: number;
  today_change: number;
  today_change_percent: number;
  positions_count: number;
  top_gainers: Array<{
    symbol: string;
    symbol_name: string;
    profit_loss_percent: number;
  }>;
  top_losers: Array<{
    symbol: string;
    symbol_name: string;
    profit_loss_percent: number;
  }>;
}

export interface OHLCVDataPoint {
  date: string; // YYYYMMDD format
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trade_amount?: number;
}

export interface OHLCVResponse {
  symbol: string;
  symbol_name: string;
  data: OHLCVDataPoint[];
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
}

// ===== Custom Hook =====

export interface UseFinflowDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
  onError?: (error: Error) => void;
}

export function useFinflowData(options: UseFinflowDataOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 10000, // 10 seconds
    onError,
  } = options;

  const [accountData, setAccountData] = useState<AccountSummary | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAccountData = useCallback(async () => {
    try {
      const data = await apiClient.get<AccountSummary>('/api/realtime/account/summary');
      return data;
    } catch (err) {
      throw new Error(`Failed to fetch account data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, []);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const data = await apiClient.get<PortfolioSummary>('/api/v1/portfolio/summary');
      return data;
    } catch (err) {
      // Portfolio API is optional, return empty data if it fails
      console.warn('Portfolio API failed, using account data only:', err);
      return {
        total_value: 0,
        total_return: 0,
        total_return_percent: 0,
        today_change: 0,
        today_change_percent: 0,
        positions_count: 0,
        top_gainers: [],
        top_losers: [],
      };
    }
  }, []);

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Fetch account data first (primary data source)
      const account = await fetchAccountData();

      // Try to fetch portfolio data (optional, for additional insights)
      const portfolio = await fetchPortfolioData();

      setAccountData(account);
      setPortfolioData(portfolio);
      setLastUpdated(new Date());
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAccountData, fetchPortfolioData, onError]);

  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchData(false);
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchData]);

  // Refresh on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && autoRefresh) {
        fetchData(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [autoRefresh, fetchData]);

  return {
    accountData,
    portfolioData,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}

// ===== OHLCV Data Hook =====

export function useOHLCVData(symbol: string | null, days: number = 60) {
  const [data, setData] = useState<OHLCVDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOHLCVData = useCallback(async () => {
    if (!symbol) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<OHLCVResponse>(
        `/api/v1/market-data/${symbol}/ohlcv`,
        { params: { days } }
      );
      setData(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch OHLCV data');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [symbol, days]);

  useEffect(() => {
    fetchOHLCVData();
  }, [fetchOHLCVData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOHLCVData,
  };
}
