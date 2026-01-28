'use client';

import { useState } from 'react';
import {  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { COLORS, SPACING, RADIUS, TEXT_BODY_SM, TEXT_CAPTION, TRANSITIONS, SHADOWS } from '@/lib/theme/styleConstants';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const getUserInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: COLORS.background.secondary,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${COLORS.border.separator}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: SPACING[6], minHeight: '64px !important' }}>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onToggleSidebar}
          sx={{
            color: COLORS.text.secondary,
            transition: TRANSITIONS.color,
            '&:hover': {
              color: COLORS.primary.main,
              bgcolor: COLORS.primary.subtle,
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* User Section */}
        {isAuthenticated && user ? (
          <>
            <Avatar
              onClick={handleMenuOpen}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: COLORS.primary.main,
                color: COLORS.text.inverse,
                fontSize: '0.875rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: TRANSITIONS.background,
                '&:hover': {
                  backgroundColor: COLORS.primary.dark,
                  boxShadow: SHADOWS.glow.primary,
                }
              }}
            >
              {getUserInitial()}
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: SPACING[2],
                  minWidth: 200,
                  backgroundColor: COLORS.background.tertiary,
                  border: `1px solid ${COLORS.border.default}`,
                  borderRadius: RADIUS.md,
                  boxShadow: SHADOWS.lg,
                }
              }}
            >
              <Box sx={{ px: SPACING[4], py: SPACING[3] }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.primary.main, fontWeight: 600 }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ ...TEXT_CAPTION, color: COLORS.text.secondary }}>
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: COLORS.border.separator }} />

              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: COLORS.text.secondary }} />
                </ListItemIcon>
                <ListItemText sx={{ ...TEXT_BODY_SM }}>프로필</ListItemText>
              </MenuItem>

              <Divider sx={{ borderColor: COLORS.border.separator }} />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: COLORS.danger.main }} />
                </ListItemIcon>
                <ListItemText sx={{ ...TEXT_BODY_SM, color: COLORS.danger.main }}>로그아웃</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            size="small"
            sx={{
              color: COLORS.primary.main,
              borderColor: COLORS.primary.main,
              borderRadius: RADIUS.sm,
              transition: TRANSITIONS.all,
              '&:hover': {
                borderColor: COLORS.primary.dark,
                backgroundColor: COLORS.primary.subtle,
                boxShadow: SHADOWS.glow.primary,
              }
            }}
          >
            로그인
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
