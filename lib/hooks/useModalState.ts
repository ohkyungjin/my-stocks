import { useState, useCallback } from 'react';

export interface ModalState<T = any> {
  isOpen: boolean;
  data: T | null;
}

export interface UseModalStateReturn<T = any> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  setData: (data: T | null) => void;
}

/**
 * Generic hook for managing modal state
 *
 * @example
 * ```typescript
 * const editModal = useModalState<Signal>();
 *
 * // Open modal with data
 * editModal.open(signal);
 *
 * // Access modal data
 * if (editModal.isOpen && editModal.data) {
 *   // Do something with editModal.data
 * }
 *
 * // Close modal
 * editModal.close();
 * ```
 */
export function useModalState<T = any>(initialData: T | null = null): UseModalStateReturn<T> {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    data: initialData,
  });

  const open = useCallback((data?: T) => {
    setState({
      isOpen: true,
      data: data !== undefined ? data : null,
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    data: state.data,
    open,
    close,
    setData,
  };
}

/**
 * Hook for managing multiple related modal states
 *
 * @example
 * ```typescript
 * const modals = useMultiModalState({
 *   edit: null,
 *   chart: null,
 *   bulkEdit: { type: 'stop_loss', orderIds: [] }
 * });
 *
 * modals.edit.open(signal);
 * modals.chart.open({ symbol: '005930', days: 180 });
 * ```
 */
export function useMultiModalState<T extends Record<string, any>>(
  initialStates: T
): { [K in keyof T]: UseModalStateReturn<T[K]> } {
  const entries = Object.entries(initialStates).map(([key, initialData]) => [
    key,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useModalState(initialData),
  ]);

  return Object.fromEntries(entries) as { [K in keyof T]: UseModalStateReturn<T[K]> };
}
