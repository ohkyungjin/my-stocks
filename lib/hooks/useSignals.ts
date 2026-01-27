'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Signal, SignalFilters } from '@/lib/types/api';
import { getSignals } from '@/lib/api/endpoints';

interface UseSignalsResult {
  signals: Signal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateSignalOrder: (signalId: number, orderData: any) => void;
  removeSignal: (signalId: number) => void;
  removeSignals: (signalIds: number[]) => void;
}

export function useSignals(filters?: SignalFilters): UseSignalsResult {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract filter values for proper dependency tracking
  const strategyId = filters?.strategy_id;
  const action = filters?.action;
  const startDate = filters?.start_date;
  const endDate = filters?.end_date;
  const confidenceMin = filters?.confidence_min;
  const confidenceMax = filters?.confidence_max;

  const fetchSignals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Reconstruct filters from individual values
      const filterParams: SignalFilters = {};
      if (strategyId !== undefined) filterParams.strategy_id = strategyId;
      if (action !== undefined) filterParams.action = action;
      if (startDate !== undefined) filterParams.start_date = startDate;
      if (endDate !== undefined) filterParams.end_date = endDate;
      if (confidenceMin !== undefined) filterParams.confidence_min = confidenceMin;
      if (confidenceMax !== undefined) filterParams.confidence_max = confidenceMax;

      const data = await getSignals(Object.keys(filterParams).length > 0 ? filterParams : undefined);
      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '시그널을 가져오는데 실패했습니다');
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, [strategyId, action, startDate, endDate, confidenceMin, confidenceMax]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  // 시그널의 주문 정보 로컬 업데이트 (리프레시 없이)
  const updateSignalOrder = (signalId: number, orderData: any) => {
    setSignals((prevSignals) =>
      prevSignals.map((signal) =>
        signal.id === signalId
          ? {
              ...signal,
              scheduled_order: {
                ...signal.scheduled_order!,
                ...orderData,
              },
            }
          : signal
      )
    );
  };

  // 시그널 삭제 (로컬 상태에서 제거, 리프레시 없이)
  const removeSignal = (signalId: number) => {
    setSignals((prevSignals) =>
      prevSignals.filter((signal) => signal.id !== signalId)
    );
  };

  // 여러 시그널 일괄 삭제 (로컬 상태에서 제거, 리프레시 없이)
  const removeSignals = (signalIds: number[]) => {
    setSignals((prevSignals) =>
      prevSignals.filter((signal) => !signalIds.includes(signal.id))
    );
  };

  return {
    signals,
    loading,
    error,
    refetch: fetchSignals,
    updateSignalOrder,
    removeSignal,
    removeSignals,
  };
}
