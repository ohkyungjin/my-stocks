/**
 * Portfolio Card Component
 * Displays a single holding in the portfolio carousel
 */

import { Box, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { formatCurrency } from '@/lib/utils/formatters';
import { GLASS_PAPER, MONO_TEXT_SM, MONO_TEXT_XS, TERMINAL_COLORS } from '@/lib/theme/styleConstants';
import type { Holding } from '@/lib/types/monitoring';

interface PortfolioCardProps {
  holding: Holding;
  onClick: () => void;
  isSelected: boolean;
}

export function PortfolioCard({ holding, onClick, isSelected }: PortfolioCardProps) {
  const isPositive = holding.profit_loss_rate >= 0;
  const accentColor = isPositive ? TERMINAL_COLORS.lime : TERMINAL_COLORS.pink;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        ...GLASS_PAPER,
        p: 1.5,
        cursor: 'pointer',
        borderColor: isSelected ? accentColor : TERMINAL_COLORS.borderDefault,
        backgroundColor: isSelected
          ? alpha(accentColor, 0.03)
          : 'rgba(10,10,12,0.6)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: isSelected
            ? `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`
            : 'transparent',
          transition: 'all 0.3s',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: accentColor,
          boxShadow: `0 8px 24px ${alpha(accentColor, 0.15)}`,
        },
      }}
    >
      {/* Header: Symbol Name */}
      <Stack spacing={0.5} mb={1.2}>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            color: TERMINAL_COLORS.textPrimary,
          }}
        >
          {holding.symbol_name}
        </Typography>
        <Typography
          sx={{
            ...MONO_TEXT_SM,
            color: TERMINAL_COLORS.textSecondary,
          }}
        >
          {holding.symbol}
        </Typography>
      </Stack>

      {/* Metrics */}
      <Stack spacing={0.6} sx={{ mt: 'auto' }}>
        <MetricRow label="수량" value={holding.quantity.toLocaleString()} />
        <MetricRow label="평가액" value={formatCurrency(holding.eval_amount)} />

        <Box
          sx={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            my: 0.5,
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              ...MONO_TEXT_XS,
              color: TERMINAL_COLORS.textSecondary,
              letterSpacing: '0.05em',
              fontWeight: 500,
            }}
          >
            손익률
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: accentColor,
                letterSpacing: '-0.02em',
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
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

// Helper component for metric rows
function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
      <Typography
        sx={{
          ...MONO_TEXT_XS,
          color: TERMINAL_COLORS.textSecondary,
          letterSpacing: '0.05em',
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...MONO_TEXT_SM,
          fontWeight: 600,
          color: TERMINAL_COLORS.textPrimary,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
