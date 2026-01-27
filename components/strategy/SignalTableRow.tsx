import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  Chip,
} from '@mui/material';

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

interface SignalTableRowProps {
  signal: SignalData;
  index: number;
  selected: boolean;
  onSelect: (index: number, checked: boolean) => void;
  onClick: (signal: SignalData) => void;
}

export function SignalTableRow({
  signal,
  index,
  selected,
  onSelect,
  onClick,
}: SignalTableRowProps) {
  return (
    <TableRow
      hover
      selected={selected}
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(signal)}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect(index, e.target.checked)}
        />
      </TableCell>

      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {signal.symbol}
          </Typography>
          {signal.symbol_name && (
            <Typography variant="caption" color="text.secondary">
              {signal.symbol_name}
            </Typography>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <Chip
          label={signal.action}
          size="small"
          color={signal.action === 'BUY' ? 'success' : 'error'}
          sx={{ height: 20, fontSize: '0.75rem' }}
        />
      </TableCell>

      <TableCell align="right" className="font-mono">
        <Typography variant="body2">
          {signal.price.toLocaleString()}원
        </Typography>
      </TableCell>

      <TableCell align="right" className="font-mono">
        <Typography variant="body2">
          {signal.volume?.toLocaleString() || '-'}
        </Typography>
      </TableCell>

      <TableCell align="right" className="font-mono">
        <Typography variant="body2">
          {(signal.confidence * 100).toFixed(0)}%
        </Typography>
      </TableCell>

      <TableCell className="font-mono">
        <Typography variant="body2">
          {new Date(signal.timestamp).toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
