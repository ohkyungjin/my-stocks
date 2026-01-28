/**
 * Position List Item Component
 * Simplified view showing only symbol name and profit/loss rate
 * FinFlow Dark Design: Minimal borders, color-coded profit/loss
 */

import { Box, Typography } from '@mui/material';
import { COLORS, TEXT_HEADING_SM, TEXT_BODY_SM } from '@/lib/theme/styleConstants';
import type { Holding } from '@/lib/types/monitoring';

interface PositionListItemProps {
  holding: Holding;
  onClick: () => void;
  isSelected: boolean;
}

export function PositionListItem({ holding, onClick, isSelected }: PositionListItemProps) {
  const isPositive = holding.profit_loss_rate >= 0;
  const accentColor = isPositive ? COLORS.semantic.profit : COLORS.semantic.loss;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.25,
        px: 2,
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: isSelected
          ? (isPositive ? COLORS.success.subtle : COLORS.danger.subtle)
          : 'transparent',
        border: '1px solid',
        borderColor: isSelected ? accentColor : 'transparent',
        mb: 0.5,
        '&:hover': {
          bgcolor: isSelected
            ? (isPositive ? COLORS.success.subtle : COLORS.danger.subtle)
            : COLORS.background.secondary,
          borderColor: accentColor,
          boxShadow: isPositive ? COLORS.success.glow : COLORS.danger.glow,
        }
      }}
    >
      <Typography
        sx={{
          ...TEXT_HEADING_SM,
          color: COLORS.text.primary,
        }}
      >
        {holding.symbol_name}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <Typography
          sx={{
            ...TEXT_BODY_SM,
            fontWeight: 800,
            color: accentColor,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {isPositive ? '+' : ''}{holding.profit_loss_rate.toFixed(2)}%
        </Typography>
        <Box
          sx={{
            fontSize: 14,
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
