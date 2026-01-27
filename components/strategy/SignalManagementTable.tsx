import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
  Chip,
  IconButton,
  TableSortLabel,
  Tooltip,
  TextField,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Signal } from '@/lib/types/api';
import { formatNumber } from '@/lib/utils/formatters';
import { GLASS_PAPER } from '@/lib/theme/styleConstants';

interface SignalManagementTableProps {
  signals: Signal[];
  selectedSignals: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit: (signal: Signal) => void;
  onDelete: (signalId: number) => void;
  onViewChart?: (signal: Signal) => void;
  onUpdateOrder?: (orderId: number, data: any) => Promise<void>;
}

type SortField = 'symbol' | 'order_price' | 'stop_loss_price' | 'take_profit_price' | 'confidence' | 'created_at' | 'timestamp' | 'monitoring_status' | 'order_status';
type SortOrder = 'asc' | 'desc';

export function SignalManagementTable({
  signals,
  selectedSignals,
  onSelectionChange,
  onEdit,
  onDelete,
  onViewChart,
  onUpdateOrder,
}: SignalManagementTableProps) {
  const theme = useTheme();
  const [sortBy, setSortBy] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 저장 중인 시그널 ID들
  const [savingSignals, setSavingSignals] = useState<Set<number>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedSignals.length === signals.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(signals.map((s) => s.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedSignals.includes(id)) {
      onSelectionChange(selectedSignals.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedSignals, id]);
    }
  };

  // 필드에서 포커스를 잃었을 때 자동 저장
  const handleFieldBlur = async (
    signal: Signal,
    field: 'orderPrice' | 'quantity' | 'stopLossPrice' | 'takeProfitPrice',
    value: string
  ) => {
    if (!signal.scheduled_order || !onUpdateOrder) return;

    // 콤마 제거 후 숫자로 변환
    const cleanValue = value.replace(/,/g, '');
    const numericValue = Number(cleanValue);

    if (isNaN(numericValue) || cleanValue === '') return;

    // 원본 값과 비교
    let originalValue: number;
    switch (field) {
      case 'orderPrice':
        originalValue = signal.scheduled_order.order_price;
        break;
      case 'quantity':
        originalValue = signal.scheduled_order.quantity;
        break;
      case 'stopLossPrice':
        originalValue = signal.scheduled_order.stop_loss_price;
        break;
      case 'takeProfitPrice':
        originalValue = signal.scheduled_order.take_profit_price;
        break;
    }

    // 값이 변경되지 않았으면 저장하지 않음
    if (numericValue === originalValue) return;

    setSavingSignals((prev) => new Set(prev).add(signal.id));

    try {
      // 현재 값들을 가져와서 변경된 필드만 업데이트
      const updateData: any = {
        order_price: signal.scheduled_order.order_price,
        quantity: signal.scheduled_order.quantity,
        stop_loss_price: signal.scheduled_order.stop_loss_price,
        take_profit_price: signal.scheduled_order.take_profit_price,
      };

      switch (field) {
        case 'orderPrice':
          updateData.order_price = numericValue;
          break;
        case 'quantity':
          updateData.quantity = numericValue;
          break;
        case 'stopLossPrice':
          updateData.stop_loss_price = numericValue;
          break;
        case 'takeProfitPrice':
          updateData.take_profit_price = numericValue;
          break;
      }

      await onUpdateOrder(signal.scheduled_order.order_id, updateData);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSavingSignals((prev) => {
        const newSet = new Set(prev);
        newSet.delete(signal.id);
        return newSet;
      });
    }
  };


  const sortedSignals = useMemo(() => {
    return [...signals].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortBy) {
        case 'symbol':
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case 'order_price':
          aVal = a.scheduled_order?.order_price || 0;
          bVal = b.scheduled_order?.order_price || 0;
          break;
        case 'stop_loss_price':
          aVal = a.scheduled_order?.stop_loss_price || 0;
          bVal = b.scheduled_order?.stop_loss_price || 0;
          break;
        case 'take_profit_price':
          aVal = a.scheduled_order?.take_profit_price || 0;
          bVal = b.scheduled_order?.take_profit_price || 0;
          break;
        case 'confidence':
          aVal = a.confidence || 0;
          bVal = b.confidence || 0;
          break;
        case 'timestamp':
          aVal = a.timestamp || '';
          bVal = b.timestamp || '';
          break;
        case 'created_at':
          aVal = a.created_at || '';
          bVal = b.created_at || '';
          break;
        case 'monitoring_status':
          // ON(1) > OFF(0) > 없음(-1)
          aVal = a.scheduled_order ? (a.scheduled_order.monitoring_enabled ? 1 : 0) : -1;
          bVal = b.scheduled_order ? (b.scheduled_order.monitoring_enabled ? 1 : 0) : -1;
          break;
        case 'order_status':
          // 주문됨(2) > 대기(1) > 없음(0)
          const aHasOrder = a.scheduled_order?.kis_order_no || a.scheduled_order?.filled_at;
          const bHasOrder = b.scheduled_order?.kis_order_no || b.scheduled_order?.filled_at;
          aVal = a.scheduled_order ? (aHasOrder ? 2 : 1) : 0;
          bVal = b.scheduled_order ? (bHasOrder ? 2 : 1) : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [signals, sortBy, sortOrder]);

  const calculatePercentage = (basePrice?: number, targetPrice?: number) => {
    if (!basePrice || !targetPrice) return 0;
    return ((targetPrice - basePrice) / basePrice * 100);
  };

  if (signals.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 8,
          textAlign: 'center',
          borderRadius: '4px',
          ...GLASS_PAPER,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            mb: 1,
          }}
        >
          생성된 시그널이 없습니다
        </Typography>
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          전략을 실행하여 새로운 매매 기회를 포착해보세요.
        </Typography>
      </Paper>
    );
  }

  // Input 스타일 정의
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      fontSize: '0.75rem',
      fontFamily: '"JetBrains Mono", monospace',
      fontWeight: 600,
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      '& fieldset': {
        borderWidth: '0px',
        transition: 'all 0.2s',
      },
      '&:hover fieldset': {
        borderWidth: '1px',
        borderColor: '#00FF41',
        backgroundColor: 'rgba(0,255,65,0.05)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(0,255,65,0.1)',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '1px',
        borderColor: '#00FF41',
      },
    },
    '& input': {
      py: 1,
      px: 1,
      textAlign: 'right',
      fontWeight: 600,
      color: '#FFFFFF',
    },
  };

  return (
    <Box>
      {/* Count Display */}
      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          총 <Box component="span" sx={{ color: '#00FF41', mx: 0.5 }}>{signals.length}</Box>건
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '4px',
          bgcolor: 'rgba(10,10,12,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'visible'
        }}
      >
        <Table>
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                py: 1,
                px: 1.5,
                bgcolor: 'transparent',
              }
            }}
          >
            <TableCell padding="checkbox" sx={{ width: 48 }}>
              <Checkbox
                checked={selectedSignals.length === signals.length && signals.length > 0}
                indeterminate={
                  selectedSignals.length > 0 && selectedSignals.length < signals.length
                }
                onChange={handleSelectAll}
                size="small"
                sx={{
                  p: 0.5,
                  color: 'rgba(255,255,255,0.2)',
                  '&.Mui-checked': {
                    color: '#00FF41',
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: '#00FF41',
                  }
                }}
              />
            </TableCell>
            <TableCell sx={{ width: 140 }}>
              <TableSortLabel
                active={sortBy === 'symbol'}
                direction={sortBy === 'symbol' ? sortOrder : 'asc'}
                onClick={() => handleSort('symbol')}
                sx={{
                  '&.MuiTableSortLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-active': {
                    color: '#00FF41',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: '#00FF41 !important',
                  }
                }}
              >
                종목
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>주문가</TableCell>
            <TableCell align="right" sx={{ width: 80 }}>수량</TableCell>
            <TableCell align="right" sx={{ width: 180 }}>목표가</TableCell>
            <TableCell align="right" sx={{ width: 180 }}>손절가</TableCell>
            <TableCell align="center" sx={{ width: 90 }}>
              <TableSortLabel
                active={sortBy === 'monitoring_status'}
                direction={sortBy === 'monitoring_status' ? sortOrder : 'asc'}
                onClick={() => handleSort('monitoring_status')}
                sx={{
                  '&.MuiTableSortLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-active': {
                    color: '#00FF41',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: '#00FF41 !important',
                  }
                }}
              >
                모니터링
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ width: 90 }}>
              <TableSortLabel
                active={sortBy === 'order_status'}
                direction={sortBy === 'order_status' ? sortOrder : 'asc'}
                onClick={() => handleSort('order_status')}
                sx={{
                  '&.MuiTableSortLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-active': {
                    color: '#00FF41',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: '#00FF41 !important',
                  }
                }}
              >
                주문 상태
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ width: 100 }}>
              <TableSortLabel
                active={sortBy === 'timestamp'}
                direction={sortBy === 'timestamp' ? sortOrder : 'asc'}
                onClick={() => handleSort('timestamp')}
                sx={{
                  '&.MuiTableSortLabel-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-active': {
                    color: '#00FF41',
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: '#00FF41 !important',
                  }
                }}
              >
                발생일시
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ width: 80 }}>관리</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSignals.map((signal) => {
            // 원본 데이터에서 직접 값 가져오기
            const orderPrice = signal.scheduled_order?.order_price || 0;
            const stopLossPrice = signal.scheduled_order?.stop_loss_price || 0;
            const takeProfitPrice = signal.scheduled_order?.take_profit_price || 0;

            const stopLossPct = calculatePercentage(orderPrice, stopLossPrice);
            const takeProfitPct = calculatePercentage(orderPrice, takeProfitPrice);

            return (
              <TableRow
                key={signal.id}
                selected={selectedSignals.includes(signal.id)}
                hover
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.02)',
                  },
                  '&.Mui-selected': { bgcolor: 'rgba(0,255,65,0.05)' },
                  '&.Mui-selected:hover': { bgcolor: 'rgba(0,255,65,0.08)' },
                  transition: 'background-color 0.2s',
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    py: 0.75,
                    px: 1.5,
                  }
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSignals.includes(signal.id)}
                    onChange={() => handleSelectOne(signal.id)}
                    size="small"
                    sx={{
                      p: 0.5,
                      color: 'rgba(255,255,255,0.2)',
                      '&.Mui-checked': {
                        color: '#00FF41',
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: 1.2,
                      }}
                    >
                      {signal.symbol_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.55rem',
                        color: 'rgba(255,255,255,0.35)',
                        lineHeight: 1.3,
                        mt: 0.2,
                      }}
                    >
                      {signal.symbol}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {signal.scheduled_order ? (
                    <TextField
                      key={`order-price-${signal.id}-${signal.scheduled_order.order_price}`}
                      size="small"
                      defaultValue={formatNumber(signal.scheduled_order.order_price, 0)}
                      onBlur={(e) => handleFieldBlur(signal, 'orderPrice', e.target.value)}
                      disabled={savingSignals.has(signal.id)}
                      sx={{ ...inputSx, width: 100 }}
                      InputProps={{
                        endAdornment: <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', ml: 0.5 }}>₩</Typography>
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {signal.scheduled_order ? (
                    <TextField
                      key={`quantity-${signal.id}-${signal.scheduled_order.quantity}`}
                      size="small"
                      defaultValue={formatNumber(signal.scheduled_order.quantity, 0)}
                      onBlur={(e) => handleFieldBlur(signal, 'quantity', e.target.value)}
                      disabled={savingSignals.has(signal.id)}
                      sx={{ ...inputSx, width: 70 }}
                      InputProps={{
                        endAdornment: <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', ml: 0.5 }}>주</Typography>
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {signal.scheduled_order ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <TextField
                        key={`take-profit-${signal.id}-${signal.scheduled_order.take_profit_price}`}
                        size="small"
                        defaultValue={formatNumber(signal.scheduled_order.take_profit_price, 0)}
                        onBlur={(e) => handleFieldBlur(signal, 'takeProfitPrice', e.target.value)}
                        disabled={savingSignals.has(signal.id)}
                        sx={{
                          ...inputSx,
                          width: 100,
                          '& input': { ...inputSx['& input'], color: '#00FF41' }
                        }}
                      />
                      <Chip
                        label={`+${takeProfitPct.toFixed(1)}%`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          fontFamily: '"JetBrains Mono", monospace',
                          bgcolor: 'rgba(0,255,65,0.1)',
                          color: '#00FF41',
                          border: '1px solid rgba(0,255,65,0.3)',
                          minWidth: 50,
                          borderRadius: '2px',
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {signal.scheduled_order ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      <TextField
                        key={`stop-loss-${signal.id}-${signal.scheduled_order.stop_loss_price}`}
                        size="small"
                        defaultValue={formatNumber(signal.scheduled_order.stop_loss_price, 0)}
                        onBlur={(e) => handleFieldBlur(signal, 'stopLossPrice', e.target.value)}
                        disabled={savingSignals.has(signal.id)}
                        sx={{
                          ...inputSx,
                          width: 100,
                          '& input': { ...inputSx['& input'], color: '#FF006E' }
                        }}
                      />
                      <Chip
                        label={`${stopLossPct.toFixed(1)}%`}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          fontFamily: '"JetBrains Mono", monospace',
                          bgcolor: 'rgba(255,0,110,0.1)',
                          color: '#FF006E',
                          border: '1px solid rgba(255,0,110,0.3)',
                          minWidth: 50,
                          borderRadius: '2px',
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>

                {/* 모니터링 상태 */}
                <TableCell align="center">
                  {signal.scheduled_order ? (
                    <Chip
                      label={signal.scheduled_order.monitoring_enabled ? 'ON' : 'OFF'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        bgcolor: signal.scheduled_order.monitoring_enabled
                          ? 'rgba(0,255,65,0.1)'
                          : 'rgba(255,255,255,0.05)',
                        color: signal.scheduled_order.monitoring_enabled
                          ? '#00FF41'
                          : 'rgba(255,255,255,0.4)',
                        border: signal.scheduled_order.monitoring_enabled
                          ? '1px solid rgba(0,255,65,0.3)'
                          : '1px solid rgba(255,255,255,0.1)',
                        minWidth: 40,
                        borderRadius: '2px',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>

                {/* 주문 상태 */}
                <TableCell align="center">
                  {signal.scheduled_order ? (
                    (() => {
                      const hasOrder = signal.scheduled_order.kis_order_no || signal.scheduled_order.filled_at;
                      return (
                        <Chip
                          label={hasOrder ? '주문' : '대기'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            fontFamily: '"JetBrains Mono", monospace',
                            bgcolor: hasOrder
                              ? 'rgba(59,130,246,0.1)'
                              : 'rgba(255,165,0,0.1)',
                            color: hasOrder
                              ? '#3B82F6'
                              : '#FFA500',
                            border: hasOrder
                              ? '1px solid rgba(59,130,246,0.3)'
                              : '1px solid rgba(255,165,0,0.3)',
                            minWidth: 40,
                            borderRadius: '2px',
                          }}
                        />
                      );
                    })()
                  ) : (
                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>-</Typography>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {signal.timestamp
                      ? (() => {
                          const date = new Date(signal.timestamp);
                          const year = String(date.getFullYear()).slice(-2);
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          return `${year}-${month}-${day}`;
                        })()
                      : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    {onViewChart && (
                      <Tooltip title="차트 보기">
                        <IconButton
                          size="small"
                          onClick={() => onViewChart(signal)}
                          sx={{
                            p: 0.5,
                            color: 'rgba(255,255,255,0.4)',
                            '&:hover': { color: '#00FF41', bgcolor: 'rgba(0,255,65,0.1)' }
                          }}
                        >
                          <ShowChartIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="시그널 삭제">
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm(`${signal.symbol_name} 시그널을 삭제하시겠습니까?`)) {
                            onDelete(signal.id);
                          }
                        }}
                        sx={{
                          p: 0.5,
                          color: 'rgba(255,255,255,0.4)',
                          '&:hover': { color: '#FF006E', bgcolor: 'rgba(255,0,110,0.1)' }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
}
