/**
 * Watchlist Item Component
 * Displays a single order in the watchlist sidebar
 * FinFlow Dark Design: Minimal borders, subtle hover states, status indicators
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
import {
  COLORS,
  TEXT_BODY_SM,
  TEXT_LABEL_SM,
  TEXT_HEADING_SM,
} from '@/lib/theme/styleConstants';
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
            bgcolor: COLORS.background.secondary,
          },
        },
      }}
    >
      <ListItemButton
        className="watchlist-item-button"
        onClick={onClick}
        sx={{
          py: 1.25,
          px: 1.5,
          borderBottom: `1px solid ${COLORS.border.separator}`,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:last-child': { borderBottom: 'none' },
          minHeight: 'auto',
          borderRadius: '4px',
          '&:hover': {
            borderColor: COLORS.primary.subtle,
          },
        }}
      >
        <ListItemText
          sx={{ my: 0 }}
          primary={
            <Typography
              sx={{
                ...TEXT_HEADING_SM,
                color: COLORS.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '160px',
              }}
            >
              {order.symbol_name}
            </Typography>
          }
          secondary={
            <Typography
              sx={{
                ...TEXT_LABEL_SM,
                color: COLORS.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mt: 0.25,
              }}
            >
              {order.symbol}
            </Typography>
          }
        />
        <Box sx={{ textAlign: 'right', ml: 1.5 }}>
          <Typography
            sx={{
              ...TEXT_BODY_SM,
              fontWeight: 700,
              color: COLORS.text.primary,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.3,
            }}
          >
            {formatCurrency(order.current_price || order.order_price)}
          </Typography>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.tertiary,
              lineHeight: 1.4,
              mt: 0.25,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            주문 {formatCurrency(order.order_price)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
            <CircleIcon
              sx={{
                fontSize: 6,
                color: order.monitoring_enabled ? COLORS.success.main : COLORS.text.disabled,
              }}
            />
            <Typography
              sx={{
                ...TEXT_LABEL_SM,
                fontWeight: 600,
                color: order.monitoring_enabled ? COLORS.success.main : COLORS.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1,
              }}
            >
              {order.monitoring_enabled ? 'LIVE' : 'IDLE'}
            </Typography>
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
