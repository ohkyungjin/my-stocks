/**
 * Generic table sorting hook
 * Provides sorting state and logic for any table
 */

import { useState, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export function useTableSort<TField extends string>(defaultField: TField, defaultOrder: SortOrder = 'desc') {
  const [sortBy, setSortBy] = useState<TField>(defaultField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);

  const handleSort = (field: TField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortData = <T,>(data: T[], getFieldValue: (item: T, field: TField) => any): T[] => {
    return useMemo(() => {
      return [...data].sort((a, b) => {
        const aVal = getFieldValue(a, sortBy);
        const bVal = getFieldValue(b, sortBy);

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }, [data, sortBy, sortOrder, getFieldValue]);
  };

  return {
    sortBy,
    sortOrder,
    handleSort,
    sortData,
  };
}
