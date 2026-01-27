'use client';

import { useState, useEffect } from 'react';
import { Strategy, StrategyPerformance, StrategyParameters } from '@/lib/types/api';
import {
  getStrategy,
  getStrategyPerformance,
  getStrategyConfig,
  updateStrategyConfig,
  getStrategies,
} from '@/lib/api/endpoints';

interface UseStrategyListResult {
  strategies: Strategy[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStrategyList(): UseStrategyListResult {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStrategies();
      setStrategies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '전략 목록을 가져오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  return { strategies, loading, error, refetch: fetchStrategies };
}

interface UseStrategyResult {
  strategy: Strategy | null;
  performance: StrategyPerformance | null;
  parameters: StrategyParameters | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateParameters: (params: Partial<StrategyParameters>) => Promise<void>;
}

export function useStrategy(strategyName: string): UseStrategyResult {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [performance, setPerformance] = useState<StrategyPerformance | null>(null);
  const [parameters, setParameters] = useState<StrategyParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [strategyData, performanceData, paramsData] = await Promise.all([
        getStrategy(strategyName),
        getStrategyPerformance(strategyName).catch(() => null), // Performance might not exist
        getStrategyConfig(strategyName),
      ]);

      setStrategy(strategyData);
      setPerformance(performanceData);
      setParameters(paramsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '전략 데이터를 가져오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const updateParameters = async (params: Partial<StrategyParameters>) => {
    try {
      const updatedStrategy = await updateStrategyConfig(strategyName, params);
      setStrategy(updatedStrategy);
      setParameters(updatedStrategy.parameters);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '파라미터 업데이트 실패');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyName]);

  return {
    strategy,
    performance,
    parameters,
    loading,
    error,
    refetch: fetchData,
    updateParameters,
  };
}
