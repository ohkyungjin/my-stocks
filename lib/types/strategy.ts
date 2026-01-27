/**
 * Strategy-specific types
 */

import { StrategyParameters } from './api';

export interface StrategyConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  enabled: boolean;
  parameters: StrategyParameters;
}

export interface ParameterDefinition {
  name: string;
  displayName: string;
  description: string;
  type: 'number' | 'percentage' | 'integer';
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
}

export interface StrategyMetrics {
  totalSignals: number;
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
  avgHoldingDays: number;
}

export interface SignalQuality {
  date: string;
  totalSignals: number;
  truePositives: number;
  falsePositives: number;
  accuracy: number;
}
