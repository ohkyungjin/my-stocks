import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';
import { SignalTableHeader, SortField, SortOrder } from './SignalTableHeader';
import { SignalTableRow } from './SignalTableRow';

interface SignalData {
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

interface SignalResultsTableProps {
  signals: SignalData[];
  selectedSignals: number[];
  onSelectionChange: (indices: number[]) => void;
  onRowClick: (signal: SignalData) => void;
}

export function SignalResultsTable({
  signals,
  selectedSignals,
  onSelectionChange,
  onRowClick,
}: SignalResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('confidence');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(signals.map((_, index) => index));
    } else {
      onSelectionChange([]);
    }
  };

  // 개별 선택
  const handleSelectSignal = (index: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedSignals, index]);
    } else {
      onSelectionChange(selectedSignals.filter((i) => i !== index));
    }
  };

  // 정렬된 시그널 목록 (원본 인덱스 유지)
  const sortedSignals = useMemo(() => {
    const signalsWithIndex = signals.map((signal, index) => ({
      signal,
      originalIndex: index,
    }));

    return signalsWithIndex.sort((a, b) => {
      const aVal = a.signal[sortField];
      const bVal = b.signal[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [signals, sortField, sortOrder]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <SignalTableHeader
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          showSelectAll={true}
          allSelected={selectedSignals.length === signals.length}
          indeterminate={
            selectedSignals.length > 0 && selectedSignals.length < signals.length
          }
          onSelectAll={handleSelectAll}
        />
        <TableBody>
          {sortedSignals.map(({ signal, originalIndex }) => (
            <SignalTableRow
              key={originalIndex}
              signal={signal}
              index={originalIndex}
              selected={selectedSignals.includes(originalIndex)}
              onSelect={handleSelectSignal}
              onClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
