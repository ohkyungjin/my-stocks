'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8008';

interface UseApiDataOptions {
  enabled?: boolean;
  refreshInterval?: number; // milliseconds
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (data: T | null) => void;
}

/**
 * Generic hook for API data fetching with automatic refresh
 *
 * @param endpoint - API endpoint path (e.g., '/api/v1/portfolio/summary')
 * @param options - Configuration options
 * @returns Object with data, loading state, error, and control functions
 *
 * @example
 * ```typescript
 * const { data, isLoading, error, refetch } = useApiData<PortfolioSummary>(
 *   '/api/v1/portfolio/summary',
 *   { refreshInterval: 30000 }
 * );
 * ```
 */
export function useApiData<T = any>(
  endpoint: string | null,
  options: UseApiDataOptions = {}
): UseApiDataReturn<T> {
  const {
    enabled = true,
    refreshInterval,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef로 콜백을 저장하여 안정적인 참조 유지 (무한 루프 방지)
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // 최신 콜백으로 업데이트
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchData = useCallback(async () => {
    if (!endpoint || !enabled) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      // ref를 통해 최신 콜백 호출
      if (onSuccessRef.current) {
        onSuccessRef.current(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      setData(null);

      // ref를 통해 최신 콜백 호출
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled]); // onSuccess, onError 제거됨

  // Manual update function
  const mutate = useCallback((newData: T | null) => {
    setData(newData);
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh if interval is specified
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    mutate,
  };
}

/**
 * Hook for API data with query parameters
 *
 * @example
 * ```typescript
 * const { data } = useApiDataWithParams<Signal[]>(
 *   '/api/v1/signals',
 *   { status: 'active', limit: 10 }
 * );
 * ```
 */
export function useApiDataWithParams<T = any>(
  endpoint: string | null,
  params?: Record<string, any>,
  options?: UseApiDataOptions
): UseApiDataReturn<T> {
  const queryString = params
    ? '?' + new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString()
    : '';

  const fullEndpoint = endpoint ? `${endpoint}${queryString}` : null;

  return useApiData<T>(fullEndpoint, options);
}
