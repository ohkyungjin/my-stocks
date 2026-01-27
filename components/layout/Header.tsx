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
        backgroundColor: 'rgba(10,10,12,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3, minHeight: '64px !important' }}>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onToggleSidebar}
          sx={{
            color: 'rgba(255,255,255,0.6)',
            '&:hover': {
              color: '#00FF41',
              bgcolor: 'rgba(0,255,65,0.1)',
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
                backgroundColor: '#00FF41',
                color: '#000000',
                fontSize: '0.875rem',
                fontWeight: 800,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#00CC35',
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
                  mt: 1,
                  minWidth: 200,
                  backgroundColor: 'rgba(20,20,24,0.98)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: '#00FF41', fontWeight: 600 }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </ListItemIcon>
                <ListItemText>프로필</ListItemText>
              </MenuItem>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: '#FF4444' }} />
                </ListItemIcon>
                <ListItemText sx={{ color: '#FF4444' }}>로그아웃</ListItemText>
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
              color: '#00FF41',
              borderColor: '#00FF41',
              '&:hover': {
                borderColor: '#00CC35',
                backgroundColor: 'rgba(0,255,65,0.1)',
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
