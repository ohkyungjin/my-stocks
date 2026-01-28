'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrackChanges as StrategyIcon,
  ShowChart as MonitoringIcon,
  Circle as CircleIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';
import { formatDateTime } from '@/lib/utils/formatters';
import { useAuthStore } from '@/lib/store/authStore';
import {
  COLORS,
  SPACING,
  RADIUS,
  TEXT_LABEL_SM,
  TEXT_CAPTION,
  TRANSITIONS,
  TEXT_BODY_SM,
  SHADOWS,
} from '@/lib/theme/styleConstants';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const DRAWER_WIDTH = 256;
const APP_VERSION = 'v1.0.0';
const APP_COPYRIGHT = '© 2026';

const MARKET_OPEN_HOUR = 8;
const MARKET_OPEN_MINUTE = 50;
const MARKET_CLOSE_HOUR = 15;
const MARKET_CLOSE_MINUTE = 30;
const UPDATE_INTERVAL = 1000;

const isMarketOpen = (date: Date): boolean => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const dayOfWeek = date.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

  if (!isWeekday) return false;

  return (
    (hour === MARKET_OPEN_HOUR && minute >= MARKET_OPEN_MINUTE) ||
    (hour > MARKET_OPEN_HOUR && hour < MARKET_CLOSE_HOUR) ||
    (hour === MARKET_CLOSE_HOUR && minute <= MARKET_CLOSE_MINUTE)
  );
};

const listItemStyles = (isActive: boolean) => ({
  borderRadius: RADIUS.sm,
  backgroundColor: isActive ? COLORS.primary.subtle : 'transparent',
  color: isActive ? COLORS.primary.main : COLORS.text.secondary,
  border: '1px solid',
  borderColor: isActive ? COLORS.primary.main : 'transparent',
  ...TEXT_BODY_SM,
  fontWeight: 600,
  mb: SPACING[1],
  transition: TRANSITIONS.all,
  '&:hover': {
    backgroundColor: isActive ? COLORS.primary.subtle : COLORS.background.secondary,
    borderColor: isActive ? COLORS.primary.light : COLORS.border.light,
    color: isActive ? COLORS.primary.light : COLORS.text.primary,
  },
  '&.Mui-selected': {
    backgroundColor: COLORS.primary.subtle,
    color: COLORS.primary.main,
    borderColor: COLORS.primary.main,
    '&:hover': {
      backgroundColor: COLORS.primary.subtle,
      borderColor: COLORS.primary.light,
    },
  },
});

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  const marketStatus = useMemo(
    () => (isMarketOpen(currentTime) ? 'open' : 'closed'),
    [currentTime]
  );

  // Dynamic navigation items based on user role
  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      {
        name: 'FinFlow Live',
        href: '/finflow-live',
        icon: <BoltIcon />,
      },
      {
        name: '실시간 모니터링',
        href: '/realtime-monitoring',
        icon: <MonitoringIcon />,
      },
      {
        name: '전략',
        href: '/strategy',
        icon: <StrategyIcon />,
      },
      {
        name: '설정',
        href: '/settings',
        icon: <SettingsIcon />,
      },
    ];

    // Add admin-only menu items
    if (user?.is_superuser) {
      items.push({
        name: '사용자 관리',
        href: '/users',
        icon: <GroupIcon />,
      });
    }

    return items;
  }, [user?.is_superuser]);

  useEffect(() => {
    setMounted(true);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const drawerContent = useMemo(() => {
    const renderNavItem = (item: NavItem, includeOnClick: boolean) => {
      const isActive = pathname === item.href;
      return (
        <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={Link}
            href={item.href}
            selected={isActive}
            onClick={includeOnClick ? onClose : undefined}
            sx={listItemStyles(isActive)}
          >
            <ListItemIcon sx={{
              color: 'inherit',
              minWidth: 40,
              '& svg': {
                fontSize: '1.25rem',
              }
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            />
          </ListItemButton>
        </ListItem>
      );
    };

    return (includeOnClick: boolean) => (
      <>
        <Box sx={{
          p: SPACING[6],
          borderBottom: `1px solid ${COLORS.border.separator}`,
        }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: '1.75rem',
              letterSpacing: '-0.03em',
              color: COLORS.text.primary,
              mb: SPACING[1],
            }}
          >
            잭팟 STOCK
          </Typography>
          <Typography
            sx={{
              ...TEXT_LABEL_SM,
              color: COLORS.text.tertiary,
            }}
          >
            Trading System
          </Typography>
        </Box>

        <List sx={{ flex: 1, p: SPACING[4] }}>
          {navItems.map((item) => renderNavItem(item, includeOnClick))}
        </List>

        <Box sx={{
          p: SPACING[4],
          borderTop: `1px solid ${COLORS.border.separator}`,
        }}>
          {/* Market Status */}
          <Box sx={{ mb: SPACING[4] }}>
            <Typography sx={{ ...TEXT_LABEL_SM, mb: SPACING[2] }}>
              Market Status
            </Typography>
            <Chip
              icon={
                <CircleIcon
                  sx={{
                    fontSize: 8,
                    animation: marketStatus === 'open' ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 },
                    },
                  }}
                />
              }
              label={marketStatus === 'open' ? '장 운영중' : '장 마감'}
              size="small"
              sx={{
                width: '100%',
                bgcolor: marketStatus === 'open' ? COLORS.success.bg : COLORS.background.secondary,
                color: marketStatus === 'open' ? COLORS.success.main : COLORS.text.secondary,
                border: '1px solid',
                borderColor: marketStatus === 'open' ? COLORS.success.main : COLORS.border.default,
                ...TEXT_BODY_SM,
                fontWeight: 700,
                height: 28,
                borderRadius: RADIUS.sm,
                transition: TRANSITIONS.all,
              }}
            />
          </Box>

          {/* System Health */}
          <Box sx={{ mb: SPACING[4] }}>
            <Typography sx={{ ...TEXT_LABEL_SM, mb: SPACING[2] }}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING[2] }}>
              <CircleIcon
                sx={{
                  fontSize: 6,
                  color: COLORS.success.main,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Typography sx={{ ...TEXT_BODY_SM, color: COLORS.text.secondary }}>
                System OK
              </Typography>
            </Box>
          </Box>

          {/* Current Time */}
          <Box sx={{ mb: SPACING[4] }}>
            <Typography sx={{ ...TEXT_LABEL_SM, mb: SPACING[2] }}>
              Current Time
            </Typography>
            <Typography sx={{ ...TEXT_BODY_SM, color: COLORS.text.primary, fontWeight: 600 }}>
              {mounted ? formatDateTime(currentTime) : '로딩 중...'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: COLORS.border.separator, mb: SPACING[4] }} />

          {/* Version Info */}
          <Box
            sx={{
              p: SPACING[4],
              borderRadius: RADIUS.sm,
              backgroundColor: COLORS.background.secondary,
              border: `1px solid ${COLORS.border.default}`,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ ...TEXT_BODY_SM, color: COLORS.text.tertiary, fontWeight: 600 }}>
              {APP_VERSION}
            </Typography>
            <Typography sx={{ ...TEXT_CAPTION, color: COLORS.text.disabled, mt: SPACING[1] }}>
              {APP_COPYRIGHT}
            </Typography>
          </Box>
        </Box>
      </>
    );
  }, [pathname, onClose, marketStatus, mounted, currentTime, navItems]);

  return (
    <>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: COLORS.background.secondary,
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${COLORS.border.separator}`,
            transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH}px)`,
            transition: TRANSITIONS.transform,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1200,
            boxShadow: SHADOWS.lg,
          },
        }}
      >
        {drawerContent(false)}
      </Drawer>

      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: COLORS.background.secondary,
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${COLORS.border.separator}`,
            boxShadow: SHADOWS.xl,
          },
        }}
      >
        {drawerContent(true)}
      </Drawer>
    </>
  );
}
