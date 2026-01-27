/**
 * Signal-related utility helpers
 */

export type SignalAction = 'buy' | 'hold' | 'sell';
export type ActionColor = 'primary' | 'warning' | 'error' | 'default';

export interface ActionMetadata {
  label: string;
  color: ActionColor;
}

const ACTION_MAP: Record<string, ActionMetadata> = {
  BUY: { label: '돌파중', color: 'primary' },
  HOLD: { label: '눌림중', color: 'warning' },
  SELL: { label: '매도', color: 'error' },
};

/**
 * Get action label from action string
 */
export const getActionLabel = (action: string): string => {
  const actionUpper = action.toUpperCase();
  return ACTION_MAP[actionUpper]?.label || actionUpper;
};

/**
 * Get action color from action string
 */
export const getActionColor = (action: string): ActionColor => {
  const actionUpper = action.toUpperCase();
  return ACTION_MAP[actionUpper]?.color || 'default';
};

/**
 * Get action metadata (label + color)
 */
export const getActionMetadata = (action: string): ActionMetadata => {
  const actionUpper = action.toUpperCase();
  return ACTION_MAP[actionUpper] || { label: actionUpper, color: 'default' };
};

/**
 * Extract metadata values with fallback support for different backend formats
 */
export const extractSignalMetadata = (metadata: any) => {
  return {
    distancePct: metadata?.price_diff_pct ?? metadata?.distance_pct ?? 0,
    resistancePrice:
      metadata?.max_volume_close ??
      metadata?.resistance_price ??
      0,
    maxVolumeDate: metadata?.max_volume_date ?? 'N/A',
    volumeIncreasePct: metadata?.volume_increase_pct ?? 0,
  };
};
