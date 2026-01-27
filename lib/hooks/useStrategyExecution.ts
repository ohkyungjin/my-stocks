import { useState } from 'react';
import { StrategyParameters } from '@/lib/types/api';
import { parameterConfig, strategyParameters } from '@/components/strategy/strategyParameterConfig';

interface StrategyRunResult {
  status: string;
  signals_generated: number;
  signals: Array<{
    symbol: string;
    symbol_name?: string;
    action: string;
    price: number;
    volume?: number;
    confidence: number;
    timestamp: string;
    strategy_name: string;
    metadata?: any;
  }>;
  execution_time: number;
}

interface UseStrategyExecutionOptions {
  strategyName: string;
  initialParameters: StrategyParameters;
  onSaveParameters: (params: StrategyParameters) => Promise<void>;
  onRunStrategy: (params?: StrategyParameters) => Promise<StrategyRunResult>;
}

export function useStrategyExecution({
  strategyName,
  initialParameters,
  onSaveParameters,
  onRunStrategy,
}: UseStrategyExecutionOptions) {
  const [parameters, setParameters] = useState<StrategyParameters>(initialParameters);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [result, setResult] = useState<StrategyRunResult | null>(null);

  const handleParametersChange = (newParams: StrategyParameters) => {
    setParameters(newParams);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleResetToDefault = () => {
    const relevantParams = strategyParameters[strategyName] || [];
    const defaultParams: any = {};
    relevantParams.forEach((key) => {
      if (parameterConfig[key]) {
        defaultParams[key] = parameterConfig[key].default;
      }
    });
    setParameters(defaultParams as StrategyParameters);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      await onSaveParameters(parameters);
      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파라미터 저장 실패');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRun = async () => {
    try {
      setRunLoading(true);
      setError(null);
      setResult(null);

      // 현재 화면에서 설정한 parameters를 전달
      const runResult = await onRunStrategy(parameters);
      setResult(runResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '전략 실행 실패');
    } finally {
      setRunLoading(false);
    }
  };

  return {
    // States
    parameters,
    hasChanges,
    saveLoading,
    runLoading,
    error,
    saveSuccess,
    result,

    // Handlers
    handleParametersChange,
    handleResetToDefault,
    handleSave,
    handleRun,
    setError,
  };
}
