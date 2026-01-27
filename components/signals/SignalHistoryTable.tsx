'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Paper,
  Typography,
  Checkbox,
  Button,
  Toolbar,
  TableSortLabel,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@mui/icons-material';
import { Signal } from '@/lib/types/api';
import { formatCurrency, formatNumber, formatDateTime } from '@/lib/utils/formatters';
import { getActionLabel, getActionColor, extractSignalMetadata } from '@/lib/utils/signalHelpers';

type SortField = 'symbol' | 'action' | 'price' | 'volume' | 'resistance' | 'distance' | 'timestamp';
type SortOrder = 'asc' | 'desc';

interface SignalHistoryTableProps {
  signals: Signal[];
  onRowClick?: (signal: Signal) => void;
  onBulkDelete?: (signalIds: number[]) => void;
  loading?: boolean;
}

export function SignalHistoryTable({ signals, onRowClick, onBulkDelete, loading = false }: SignalHistoryTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>('volume');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [limit, setLimit] = useState(1000);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const getSortValue = useCallback((signal: Signal, field: SortField): string | number => {
    const metadata = extractSignalMetadata(signal.metadata);

    switch (field) {
      case 'symbol':
        return signal.symbol;
      case 'action':
        return signal.action;
      case 'price':
        return signal.price;
      case 'volume':
        return signal.volume;
      case 'resistance':
        return metadata.resistancePrice || signal.price;
      case 'distance':
        return metadata.distancePct;
      case 'timestamp':
        return new Date(signal.timestamp).getTime();
      default:
        return 0;
    }
  }, []);

  const sortedSignals = useMemo(() => {
    const sorted = [...signals].sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted.slice(0, limit);
  }, [signals, sortField, sortOrder, limit, getSortValue]);

  const paginatedSignals = sortedSignals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = paginatedSignals.map((signal) => signal.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  }, [paginatedSignals]);

  const handleSelectOne = useCallback((signalId: number) => {
    setSelected((prev) =>
      prev.includes(signalId)
        ? prev.filter((id) => id !== signalId)
        : [...prev, signalId]
    );
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (selected.length === 0) return;
    if (confirm(`선택한 ${selected.length}개의 시그널을 삭제하시겠습니까?`)) {
      onBulkDelete?.(selected);
      setSelected([]);
    }
  }, [selected, onBulkDelete]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  }, [sortField]);

  const isAllSelected = useMemo(
    () => paginatedSignals.length > 0 && selected.length === paginatedSignals.length,
    [paginatedSignals.length, selected.length]
  );

  const isIndeterminate = useMemo(
    () => selected.length > 0 && selected.length < paginatedSignals.length,
    [selected.length, paginatedSignals.length]
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* 선택 삭제 툴바 */}
      {selected.length > 0 && onBulkDelete && (
        <Toolbar
          sx={{
            pl: 2,
            pr: 1,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="subtitle1" component="div">
            {selected.length}개 선택됨
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={handleBulkDelete}
          >
            선택 삭제
          </Button>
        </Toolbar>
      )}

      {/* 표시 개수 선택 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, pb: 0 }}>
        <TextField
          select
          label="표시 개수"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value={100}>100개</MenuItem>
          <MenuItem value={500}>500개</MenuItem>
          <MenuItem value={1000}>1000개</MenuItem>
          <MenuItem value={5000}>5000개</MenuItem>
          <MenuItem value={10000}>전체</MenuItem>
        </TextField>
      </Box>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {onBulkDelete && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'symbol'}
                  direction={sortField === 'symbol' ? sortOrder : 'asc'}
                  onClick={() => handleSort('symbol')}
                >
                  종목
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'action'}
                  direction={sortField === 'action' ? sortOrder : 'asc'}
                  onClick={() => handleSort('action')}
                >
                  액션
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'price'}
                  direction={sortField === 'price' ? sortOrder : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  현재가
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'volume'}
                  direction={sortField === 'volume' ? sortOrder : 'asc'}
                  onClick={() => handleSort('volume')}
                >
                  거래량
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'resistance'}
                  direction={sortField === 'resistance' ? sortOrder : 'asc'}
                  onClick={() => handleSort('resistance')}
                >
                  저항선
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'distance'}
                  direction={sortField === 'distance' ? sortOrder : 'asc'}
                  onClick={() => handleSort('distance')}
                >
                  거리
                </TableSortLabel>
              </TableCell>
              <TableCell>전략</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'timestamp'}
                  direction={sortField === 'timestamp' ? sortOrder : 'asc'}
                  onClick={() => handleSort('timestamp')}
                >
                  발생시간
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">상세</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={onBulkDelete ? 10 : 9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">로딩 중...</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedSignals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onBulkDelete ? 10 : 9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">시그널이 없습니다.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSignals.map((signal) => {
                const metadata = extractSignalMetadata(signal.metadata);
                const isPositive = metadata.distancePct >= 0;
                const isSelected = selected.includes(signal.id);
                return (
                  <TableRow
                    key={signal.id}
                    hover
                    selected={isSelected}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => onRowClick?.(signal)}
                  >
                    {onBulkDelete && (
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectOne(signal.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {signal.symbol}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {signal.symbol_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getActionLabel(signal.action)}
                        color={getActionColor(signal.action) as any}
                        size="small"
                        sx={{ fontWeight: 600, minWidth: 60 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" className="font-mono" fontWeight={600}>
                        {formatCurrency(signal.price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" className="font-mono">
                        {formatNumber(signal.volume)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" className="font-mono" color="text.secondary">
                        {formatCurrency(metadata.resistancePrice || signal.price)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {isPositive ? (
                          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                        <Typography
                          variant="caption"
                          className="font-mono"
                          fontWeight={600}
                          sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                        >
                          {isPositive ? '+' : ''}{metadata.distancePct.toFixed(2)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={signal.strategy_name}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" className="font-mono" color="text.secondary">
                        {mounted ? formatDateTime(new Date(signal.timestamp)) : '로딩 중...'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(signal);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={sortedSignals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="페이지당 행:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
      />
    </Paper>
  );
}
