import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
} from '@mui/material';

export type SortField = 'symbol' | 'action' | 'price' | 'volume' | 'confidence' | 'timestamp';
export type SortOrder = 'asc' | 'desc';

interface SignalTableHeaderProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  showSelectAll: boolean;
  allSelected: boolean;
  indeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
}

export function SignalTableHeader({
  sortField,
  sortOrder,
  onSort,
  showSelectAll,
  allSelected,
  indeterminate,
  onSelectAll,
}: SignalTableHeaderProps) {
  return (
    <TableHead>
      <TableRow>
        {showSelectAll && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={allSelected}
              indeterminate={indeterminate}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </TableCell>
        )}

        <TableCell>
          <TableSortLabel
            active={sortField === 'symbol'}
            direction={sortField === 'symbol' ? sortOrder : 'asc'}
            onClick={() => onSort('symbol')}
          >
            종목
          </TableSortLabel>
        </TableCell>

        <TableCell>
          <TableSortLabel
            active={sortField === 'action'}
            direction={sortField === 'action' ? sortOrder : 'asc'}
            onClick={() => onSort('action')}
          >
            액션
          </TableSortLabel>
        </TableCell>

        <TableCell align="right">
          <TableSortLabel
            active={sortField === 'price'}
            direction={sortField === 'price' ? sortOrder : 'asc'}
            onClick={() => onSort('price')}
          >
            가격
          </TableSortLabel>
        </TableCell>

        <TableCell align="right">
          <TableSortLabel
            active={sortField === 'volume'}
            direction={sortField === 'volume' ? sortOrder : 'asc'}
            onClick={() => onSort('volume')}
          >
            거래량
          </TableSortLabel>
        </TableCell>

        <TableCell align="right">
          <TableSortLabel
            active={sortField === 'confidence'}
            direction={sortField === 'confidence' ? sortOrder : 'asc'}
            onClick={() => onSort('confidence')}
          >
            신뢰도
          </TableSortLabel>
        </TableCell>

        <TableCell>
          <TableSortLabel
            active={sortField === 'timestamp'}
            direction={sortField === 'timestamp' ? sortOrder : 'asc'}
            onClick={() => onSort('timestamp')}
          >
            시각
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
