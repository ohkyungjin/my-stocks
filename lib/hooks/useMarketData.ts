import { useApiData } from './useApiData';
import { CandlestickData } from '@/lib/types/api';

interface OHLCVResponse {
  symbol: string;
  symbol_name: string;
  data: CandlestickData[];
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
}

export function useMarketData(symbol: string | null, days: number = 180) {
  const endpoint = symbol ? `/api/v1/market-data/${symbol}/ohlcv?days=${days}` : null;

  const { data, isLoading: loading, error } = useApiData<OHLCVResponse>(endpoint, {
    enabled: !!symbol,
  });

  return { data, loading, error };
}
