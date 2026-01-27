/**
 * Position List Item Component
 * Simplified view showing only symbol name and profit/loss rate
 */

import { Box, Typography } from '@mui/material';
import { TERMINAL_COLORS } from '@/lib/theme/styleConstants';
import type { Holding } from '@/lib/types/monitoring';

interface PositionListItemProps {
  holding: Holding;
  onClick: () => void;
  isSelected: boolean;
}

export function PositionListItem({ holding, onClick, isSelected }: PositionListItemProps) {
  const isPositive = holding.profit_loss_rate >= 0;
  const accentColor = isPositive ? TERMINAL_COLORS.lime : TERMINAL_COLORS.pink;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
        px: 1.5,
        borderRadius: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        bgcolor: isSelected ? 'rgba(0,255,65,0.05)' : 'transparent',
        border: '1px solid',
        borderColor: isSelected ? accentColor : 'transparent',
        mb: 0.5,
        '&:hover': {
          bgcolor: isSelected ? 'rgba(0,255,65,0.08)' : 'rgba(255,255,255,0.02)',
          borderColor: accentColor,
        }
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: TERMINAL_COLORS.textPrimary,
          letterSpacing: '-0.01em',
        }}
      >
        {holding.symbol_name}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '-0.01em',
          }}
        >
          {isPositive ? '+' : ''}{holding.profit_loss_rate.toFixed(2)}%
        </Typography>
        <Box
          sx={{
            fontSize: 12,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isPositive ? '▲' : '▼'}
        </Box>
      </Box>
    </Box>
  );
}
