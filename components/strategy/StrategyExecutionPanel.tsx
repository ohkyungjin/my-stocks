'use client';

import {
  Stack,
  Alert,
} from '@mui/material';
import { StrategyParameters } from '@/lib/types/api';
import { SignalDetailModal } from '@/components/signals/SignalDetailModal';
import { StrategyParameterEditor } from './StrategyParameterEditor';
import { StrategyExecutionResults } from './StrategyExecutionResults';
import { useStrategyExecution } from '@/lib/hooks/useStrategyExecution';
import { useSignalDetailModal } from '@/lib/hooks/useSignalDetailModal';

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

interface StrategyExecutionPanelProps {
  strategyName: string;
  initialParameters: StrategyParameters;
  onSaveParameters: (params: StrategyParameters) => Promise<void>;
  onRunStrategy: (params?: StrategyParameters) => Promise<StrategyRunResult>;
}

export function StrategyExecutionPanel({
  strategyName,
  initialParameters,
  onSaveParameters,
  onRunStrategy,
}: StrategyExecutionPanelProps) {
  // Strategy execution hook
  const {
    parameters,
    runLoading,
    error,
    saveSuccess,
    result,
    handleParametersChange,
    handleResetToDefault,
    handleRun,
    setError,
  } = useStrategyExecution({
    strategyName,
    initialParameters,
    onSaveParameters,
    onRunStrategy,
  });

  // Signal detail modal hook
  const {
    detailModalOpen,
    selectedSignalForDetail,
    handleRowClick,
    handleCloseDetailModal,
  } = useSignalDetailModal();

  return (
    <Stack spacing={2}>
      {/* Strategy Parameter Editor */}
      <StrategyParameterEditor
        strategyName={strategyName}
        parameters={parameters}
        onParametersChange={handleParametersChange}
        onResetToDefault={handleResetToDefault}
        onRun={handleRun}
        runLoading={runLoading}
        saveSuccess={saveSuccess}
      />

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            py: 0.5,
            bgcolor: 'rgba(255,0,110,0.05)',
            border: '1px solid rgba(255,0,110,0.2)',
            color: '#FF006E',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            borderRadius: '2px',
          }}
        >
          {error}
        </Alert>
      )}

      {result && (
        <StrategyExecutionResults
          result={result}
          onRowClick={handleRowClick}
        />
      )}

      {/* Signal Detail Modal */}
      <SignalDetailModal
        signal={selectedSignalForDetail}
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </Stack>
  );
}
