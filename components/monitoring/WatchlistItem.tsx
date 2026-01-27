/**
 * Watchlist Item Component
 * Displays a single order in the watchlist sidebar
 */

import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { formatCurrency } from '@/lib/utils/formatters';
import { MONO_TEXT_SM, MONO_TEXT_XS, TERMINAL_COLORS } from '@/lib/theme/styleConstants';
import type { Order } from '@/lib/types/monitoring';

interface WatchlistItemProps {
  order: Order;
  onClick: () => void;
}

export function WatchlistItem({ order, onClick }: WatchlistItemProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        '&:hover': {
          '& .watchlist-item-button': {
            bgcolor: 'rgba(255,255,255,0.02)',
          },
        },
      }}
    >
      <ListItemButton
        className="watchlist-item-button"
        onClick={onClick}
        sx={{
          py: 0.8,
          px: 1,
          borderBottom: `1px solid ${TERMINAL_COLORS.borderDefault}`,
          transition: 'all 0.2s',
          '&:last-child': { borderBottom: 'none' },
          minHeight: 'auto',
          borderRadius: '2px',
        }}
      >
        <ListItemText
          sx={{ my: 0 }}
          primary={
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: TERMINAL_COLORS.textPrimary,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '140px',
              }}
            >
              {order.symbol_name}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                ...MONO_TEXT_XS,
                color: TERMINAL_COLORS.textTertiary,
                lineHeight: 1.3,
              }}
            >
              {order.symbol}
            </Typography>
          }
        />
        <Box sx={{ textAlign: 'right', ml: 1 }}>
          <Typography
            sx={{
              ...MONO_TEXT_SM,
              fontWeight: 700,
              color: TERMINAL_COLORS.textPrimary,
              lineHeight: 1.2,
            }}
          >
            현재가 {formatCurrency(order.current_price || order.order_price)}
          </Typography>
          <Typography
            sx={{
              ...MONO_TEXT_XS,
              color: TERMINAL_COLORS.textTertiary,
              lineHeight: 1.3,
              mt: 0.2,
            }}
          >
            주문가격 {formatCurrency(order.order_price)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.4, mt: 0.2 }}>
            <CircleIcon
              sx={{
                fontSize: 5,
                color: order.monitoring_enabled ? TERMINAL_COLORS.lime : 'rgba(255,255,255,0.2)',
              }}
            />
            <Typography
              sx={{
                ...MONO_TEXT_XS,
                fontWeight: 600,
                color: order.monitoring_enabled ? TERMINAL_COLORS.lime : TERMINAL_COLORS.textTertiary,
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              {order.monitoring_enabled ? '실시간' : '대기'}
            </Typography>
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
