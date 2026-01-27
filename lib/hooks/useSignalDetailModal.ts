import { useState } from 'react';
import { Signal } from '@/lib/types/api';

interface StrategySignal {
  symbol: string;
  symbol_name?: string;
  action: string;
  price: number;
  volume?: number;
  confidence: number;
  timestamp: string;
  strategy_name: string;
  metadata?: any;
}

export function useSignalDetailModal() {
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSignalForDetail, setSelectedSignalForDetail] = useState<Signal | null>(null);

  const handleRowClick = (signal: StrategySignal) => {
    // 전략 실행 결과를 Signal 타입으로 변환
    const convertedSignal: Signal = {
      id: 0, // 임시 ID (저장되지 않은 시그널)
      symbol: signal.symbol,
      symbol_name: signal.symbol_name || signal.symbol,
      strategy_name: signal.strategy_name,
      action: signal.action.toLowerCase() as 'buy' | 'sell' | 'hold',
      signal_type: undefined,
      confidence: signal.confidence,
      price: signal.price,
      volume: signal.volume || 0,
      timestamp: signal.timestamp,
      metadata: signal.metadata || {},
      ai_analyzed: false,
      ai_total_score: undefined,
      ai_recommendation: undefined,
      status: 'preview', // 미리보기 상태
      created_at: new Date().toISOString(),
    };
    setSelectedSignalForDetail(convertedSignal);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedSignalForDetail(null);
  };

  return {
    detailModalOpen,
    selectedSignalForDetail,
    handleRowClick,
    handleCloseDetailModal,
  };
}
