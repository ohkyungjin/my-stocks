/**
 * Bulk Action Bar Component
 * Floating action bar for bulk operations on selected signals
 */

import { Box, Typography, Button } from '@mui/material';
import { MONO_TEXT_SM, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

interface BulkActionBarProps {
  selectedCount: number;
  onBulkEditStopLoss: () => void;
  onBulkEditTakeProfit: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onBulkEditStopLoss,
  onBulkEditTakeProfit,
  onBulkDelete,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'rgba(10,10,12,0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        borderRadius: '4px',
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        zIndex: 1000,
        border: '1px solid rgba(0,255,65,0.3)',
      }}
    >
      <Typography
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: TERMINAL_COLORS.lime,
        }}
      >
        {selectedCount}개 선택됨
      </Typography>

      <Button
        variant="outlined"
        size="small"
        onClick={onBulkEditStopLoss}
        sx={{
          borderRadius: '2px',
          textTransform: 'none',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          py: 0.5,
          px: 1.5,
          borderColor: 'rgba(255,0,110,0.5)',
          color: TERMINAL_COLORS.pink,
          '&:hover': {
            borderColor: TERMINAL_COLORS.pink,
            bgcolor: 'rgba(255,0,110,0.1)',
          }
        }}
      >
        일괄 손절가 조정
      </Button>

      <Button
        variant="outlined"
        size="small"
        onClick={onBulkEditTakeProfit}
        sx={{
          borderRadius: '2px',
          textTransform: 'none',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          py: 0.5,
          px: 1.5,
          borderColor: 'rgba(0,255,65,0.5)',
          color: TERMINAL_COLORS.lime,
          '&:hover': {
            borderColor: TERMINAL_COLORS.lime,
            bgcolor: 'rgba(0,255,65,0.1)',
          }
        }}
      >
        일괄 목표가 조정
      </Button>

      <Button
        variant="outlined"
        size="small"
        onClick={onBulkDelete}
        sx={{
          borderRadius: '2px',
          textTransform: 'none',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          py: 0.5,
          px: 1.5,
          borderColor: 'rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.5)',
          '&:hover': {
            borderColor: TERMINAL_COLORS.pink,
            bgcolor: 'rgba(255,0,110,0.1)',
            color: TERMINAL_COLORS.pink,
          }
        }}
      >
        일괄 삭제
      </Button>

      <Button
        variant="text"
        size="small"
        onClick={onClearSelection}
        sx={{
          borderRadius: '2px',
          textTransform: 'none',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.4)',
          minWidth: 'auto',
          px: 1,
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.05)',
          }
        }}
      >
        선택 해제
      </Button>
    </Box>
  );
}
