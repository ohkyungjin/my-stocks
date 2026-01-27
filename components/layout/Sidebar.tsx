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
} from '@mui/icons-material';
import { formatDateTime } from '@/lib/utils/formatters';
import { useAuthStore } from '@/lib/store/authStore';

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
  borderRadius: '2px',
  backgroundColor: isActive ? 'rgba(0,255,65,0.1)' : 'transparent',
  color: isActive ? '#00FF41' : 'rgba(255,255,255,0.5)',
  border: '1px solid',
  borderColor: isActive ? 'rgba(0,255,65,0.3)' : 'transparent',
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.02em',
  mb: 0.5,
  '&:hover': {
    backgroundColor: isActive ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.05)',
    borderColor: isActive ? 'rgba(0,255,65,0.4)' : 'rgba(0,255,65,0.2)',
    color: isActive ? '#00FF41' : 'rgba(255,255,255,0.8)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0,255,65,0.1)',
    color: '#00FF41',
    borderColor: 'rgba(0,255,65,0.3)',
    '&:hover': {
      backgroundColor: 'rgba(0,255,65,0.15)',
      borderColor: 'rgba(0,255,65,0.4)',
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
          p: 3,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 800,
              fontSize: '1.75rem',
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              mb: 0.5,
            }}
          >
            잭팟 STOCK
          </Typography>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Trading System
          </Typography>
        </Box>

        <List sx={{ flex: 1, p: 2 }}>
          {navItems.map((item) => renderNavItem(item, includeOnClick))}
        </List>

        <Box sx={{
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Market Status */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
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
                bgcolor: marketStatus === 'open' ? 'rgba(0,255,65,0.1)' : 'rgba(255,255,255,0.05)',
                color: marketStatus === 'open' ? '#00FF41' : 'rgba(255,255,255,0.5)',
                border: '1px solid',
                borderColor: marketStatus === 'open' ? 'rgba(0,255,65,0.3)' : 'rgba(255,255,255,0.1)',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 700,
                height: 28,
                borderRadius: '2px',
                letterSpacing: '0.05em',
              }}
            />
          </Box>

          {/* System Health */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircleIcon
                sx={{
                  fontSize: 6,
                  color: '#00FF41',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                System OK
              </Typography>
            </Box>
          </Box>

          {/* Current Time */}
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
              Current Time
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: '#FFFFFF',
                fontWeight: 600,
              }}
            >
              {mounted ? formatDateTime(currentTime) : '로딩 중...'}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />

          {/* Version Info */}
          <Box
            sx={{
              p: 2,
              borderRadius: '2px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              {APP_VERSION}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                mt: 0.5,
              }}
            >
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
            backgroundColor: 'rgba(10,10,12,0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH}px)`,
            transition: 'transform 0.3s ease-in-out',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1200,
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
            backgroundColor: 'rgba(10,10,12,0.98)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      >
        {drawerContent(true)}
      </Drawer>
    </>
  );
}
