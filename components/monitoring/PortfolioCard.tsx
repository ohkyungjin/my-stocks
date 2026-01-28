/**
 * Portfolio Card Component
 * Displays a single holding in the portfolio carousel
 * FinFlow Dark Design: Giant profit/loss numbers with semantic colors
 */

import { Box, Paper, Stack, Typography, alpha } from '@mui/material';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  COLORS,
  CARD_INTERACTIVE,
  TEXT_DISPLAY_MD,
  TEXT_BODY_SM,
  TEXT_LABEL_SM,
} from '@/lib/theme/styleConstants';
import type { Holding } from '@/lib/types/monitoring';

interface PortfolioCardProps {
  holding: Holding;
  onClick: () => void;
  isSelected: boolean;
}

export function PortfolioCard({ holding, onClick, isSelected }: PortfolioCardProps) {
  const isPositive = holding.profit_loss_rate >= 0;
  const accentColor = isPositive ? COLORS.semantic.profit : COLORS.semantic.loss;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        ...CARD_INTERACTIVE,
        p: 2,
        cursor: 'pointer',
        borderColor: isSelected ? accentColor : COLORS.border.default,
        backgroundColor: isSelected
          ? (isPositive ? COLORS.success.subtle : COLORS.danger.subtle)
          : COLORS.background.tertiary,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        minHeight: '140px',
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
          height: '3px',
          background: isSelected
            ? accentColor
            : 'transparent',
          transition: 'all 0.25s',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: accentColor,
          boxShadow: isPositive ? COLORS.success.glow : COLORS.danger.glow,
          backgroundColor: isSelected
            ? (isPositive ? COLORS.success.subtle : COLORS.danger.subtle)
            : COLORS.background.elevated,
        },
      }}
    >
      {/* Header: Symbol Name */}
      <Stack spacing={0.5} mb={1.5}>
        <Typography
          sx={{
            fontFamily: 'var(--font-inter)',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            color: COLORS.text.primary,
          }}
        >
          {holding.symbol_name}
        </Typography>
        <Typography
          sx={{
            ...TEXT_LABEL_SM,
            color: COLORS.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {holding.symbol}
        </Typography>
      </Stack>

      {/* Metrics */}
      <Stack spacing={1} sx={{ mt: 'auto' }}>
        <MetricRow label="수량" value={holding.quantity.toLocaleString()} />
        <MetricRow label="평가액" value={formatCurrency(holding.eval_amount)} />

        <Box
          sx={{
            height: '1px',
            background: COLORS.border.separator,
            my: 0.75,
          }}
        />

        {/* Giant Profit/Loss Display */}
        <Stack spacing={0.5}>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            손익률
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography
              sx={{
                ...TEXT_DISPLAY_MD,
                color: accentColor,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isPositive ? '+' : ''}{holding.profit_loss_rate.toFixed(2)}%
            </Typography>
            <Box
              sx={{
                fontSize: 20,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                pb: 0.5,
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
          ...TEXT_LABEL_SM,
          color: COLORS.text.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...TEXT_BODY_SM,
          fontWeight: 600,
          color: COLORS.text.primary,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
