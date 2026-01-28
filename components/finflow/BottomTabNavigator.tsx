'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  TrendingUp as ExploreIcon,
  AccountBalanceWallet as PortfolioIcon,
  Notifications as ActivityIcon,
  Person as AccountIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { COLORS, RADIUS, SPACING, Z_INDEX, EASING, TIMING, SHADOWS, TOUCH_TARGET } from '@/lib/theme/styleConstants';

// ============================================================================
// TYPES
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number | boolean;
}

export interface BottomTabNavigatorProps {
  /**
   * Custom tabs configuration (optional)
   * Defaults to: Home, Explore, Portfolio, Activity, Account
   */
  tabs?: TabItem[];
  /**
   * Show center action button (like Robinhood's trade button)
   */
  showCenterAction?: boolean;
  /**
   * Center action button click handler
   */
  onCenterActionClick?: () => void;
  /**
   * Hide on scroll
   */
  hideOnScroll?: boolean;
  /**
   * Custom styles
   */
  sx?: object;
}

// ============================================================================
// DEFAULT TABS
// ============================================================================

const DEFAULT_TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/' },
  { id: 'explore', label: 'Explore', icon: <ExploreIcon />, path: '/explore' },
  { id: 'portfolio', label: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
  { id: 'activity', label: 'Activity', icon: <ActivityIcon />, path: '/activity' },
  { id: 'account', label: 'Account', icon: <AccountIcon />, path: '/settings' },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * BottomTabNavigator - Mobile-first bottom navigation
 *
 * Inspired by Robinhood/Webull mobile apps:
 * - 5 tab navigation
 * - Active indicator (purple pill)
 * - Optional center action button for quick trade
 * - Thumb-friendly touch targets
 * - Subtle animations
 *
 * @example
 * ```tsx
 * <BottomTabNavigator
 *   showCenterAction
 *   onCenterActionClick={() => setTradeSheetOpen(true)}
 * />
 * ```
 */
export function BottomTabNavigator({
  tabs = DEFAULT_TABS,
  showCenterAction = false,
  onCenterActionClick,
  hideOnScroll = false,
  sx = {},
}: BottomTabNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Find current tab index
  const getCurrentTabIndex = useCallback(() => {
    const index = tabs.findIndex((tab) => {
      if (tab.path === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(tab.path);
    });
    return index >= 0 ? index : 0;
  }, [tabs, pathname]);

  const [value, setValue] = useState(getCurrentTabIndex());

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    // If center action is enabled and this is the middle item
    if (showCenterAction && newValue === Math.floor(tabs.length / 2)) {
      onCenterActionClick?.();
      return;
    }
    setValue(newValue);
    router.push(tabs[newValue].path);
  };

  // Insert placeholder for center action
  const displayTabs: TabItem[] = showCenterAction
    ? [
        ...tabs.slice(0, 2),
        { id: 'center-action', label: '', icon: <AddIcon />, path: '', badge: undefined },
        ...tabs.slice(2),
      ]
    : tabs;

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: Z_INDEX.bottomNav,
        backgroundColor: COLORS.background.secondary,
        borderTop: `1px solid ${COLORS.border.separator}`,
        // Safe area for iPhone notch
        paddingBottom: 'env(safe-area-inset-bottom)',
        // Hide animation (optional)
        transition: `transform ${TIMING.normal} ${EASING.default}`,
        ...sx,
      }}
    >
      <BottomNavigation
        value={showCenterAction && value >= 2 ? value + 1 : value}
        onChange={handleChange}
        showLabels
        sx={{
          backgroundColor: 'transparent',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 64,
            maxWidth: 'none',
            padding: '8px 12px',
            color: COLORS.text.tertiary,
            transition: `all ${TIMING.fast} ${EASING.default}`,
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&.Mui-selected': {
              color: COLORS.primary.main,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.6875rem',
            fontWeight: 500,
            marginTop: '2px',
            transition: `all ${TIMING.fast} ${EASING.default}`,
            '&.Mui-selected': {
              fontSize: '0.6875rem',
              fontWeight: 600,
            },
          },
        }}
      >
        {displayTabs.map((tab, index) => {
          // Center action button
          if (showCenterAction && index === 2) {
            return (
              <BottomNavigationAction
                key="center-action"
                label=""
                icon={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: RADIUS.full,
                      backgroundColor: COLORS.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: SHADOWS.glow.primary,
                      transition: `all ${TIMING.fast} ${EASING.spring}`,
                      '&:hover': {
                        backgroundColor: COLORS.primary.dark,
                        transform: 'scale(1.05)',
                      },
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                    }}
                  >
                    <AddIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
                  </Box>
                }
                sx={{
                  minHeight: TOUCH_TARGET.large,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              />
            );
          }

          // Regular tab
          const isSelected =
            (showCenterAction && index > 2 ? value + 1 === index : value === index);

          return (
            <BottomNavigationAction
              key={tab.id}
              label={tab.label}
              icon={
                tab.badge ? (
                  <Badge
                    badgeContent={typeof tab.badge === 'number' ? tab.badge : ''}
                    color="error"
                    variant={typeof tab.badge === 'boolean' ? 'dot' : 'standard'}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: COLORS.danger.main,
                        color: '#FFFFFF',
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        minWidth: 16,
                        height: 16,
                      },
                    }}
                  >
                    {tab.icon}
                  </Badge>
                ) : (
                  tab.icon
                )
              }
              sx={{
                minHeight: TOUCH_TARGET.comfortable,
                // Active indicator (pill under icon)
                '&.Mui-selected': {
                  '& .MuiSvgIcon-root': {
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: RADIUS.full,
                      backgroundColor: COLORS.primary.main,
                    },
                  },
                },
              }}
            />
          );
        })}
      </BottomNavigation>

      {/* Active indicator bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 'env(safe-area-inset-bottom)',
          left: `calc(${(value / tabs.length) * 100}% + ${100 / tabs.length / 2}%)`,
          transform: 'translateX(-50%)',
          width: 24,
          height: 3,
          borderRadius: RADIUS.full,
          backgroundColor: COLORS.primary.main,
          transition: `left ${TIMING.normal} ${EASING.springGentle}`,
        }}
      />
    </Paper>
  );
}

export default BottomTabNavigator;
