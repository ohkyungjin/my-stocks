'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useAuthStore } from '../../lib/store/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MONO_TEXT_SM, MONO_TEXT_XL, TERMINAL_COLORS, SPACING } from '@/lib/theme/styleConstants';

export default function LoginForm() {
  const router = useRouter();
  const { login, error, isLoading, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.username, formData.password);

      // Check if there's a redirect parameter in the URL
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');

      // Redirect to the intended page or default to realtime-monitoring
      router.push(redirect || '/realtime-monitoring');
    } catch (error) {
      // Error is handled by the store
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
        bgcolor: TERMINAL_COLORS.bgPrimary,
      }}
    >
      <Card
        variant="default"
        padding="lg"
        sx={{
          maxWidth: 420,
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="h1"
            sx={{
              ...MONO_TEXT_XL,
              color: TERMINAL_COLORS.lime,
              mb: 1,
            }}
          >
            로그인
          </Typography>
          <Typography
            sx={{
              ...MONO_TEXT_SM,
              color: TERMINAL_COLORS.textSecondary,
            }}
          >
            AI Trading System에 오신 것을 환영합니다
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Card
            variant="highlight"
            padding="sm"
            sx={{
              mb: 3,
              borderColor: TERMINAL_COLORS.error,
              bgcolor: 'rgba(239, 68, 68, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Badge variant="error" size="sm">
                ✕
              </Badge>
              <Typography
                sx={{
                  ...MONO_TEXT_SM,
                  color: TERMINAL_COLORS.error,
                  flex: 1,
                }}
              >
                {error}
              </Typography>
            </Box>
          </Card>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Input
              fullWidth
              label="사용자명"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
              disabled={isLoading}
              placeholder="admin"
            />

            <Input
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />

            <Button
              fullWidth
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={isLoading}
              sx={{ mt: 1 }}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </form>

        {/* Footer Links */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography
            sx={{
              ...MONO_TEXT_SM,
              color: TERMINAL_COLORS.textSecondary,
            }}
          >
            계정이 없으신가요?{' '}
            <MuiLink
              component={Link}
              href="/register"
              sx={{
                color: TERMINAL_COLORS.lime,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              회원가입
            </MuiLink>
          </Typography>
        </Box>

        {/* Test Account Info */}
        <Card
          variant="secondary"
          padding="sm"
          sx={{ mt: 3 }}
        >
          <Typography
            sx={{
              ...MONO_TEXT_SM,
              fontSize: '0.625rem',
              color: TERMINAL_COLORS.textTertiary,
              lineHeight: 1.6,
            }}
          >
            <Box component="span" sx={{ color: TERMINAL_COLORS.lime, fontWeight: 700 }}>
              테스트 계정:
            </Box>
            <br />
            사용자명: admin
            <br />
            비밀번호: admin123!
          </Typography>
        </Card>
      </Card>

      {/* Bottom Badge */}
      <Box sx={{ mt: 3 }}>
        <Badge variant="info" size="sm">
          Terminal Lux Design
        </Badge>
      </Box>
    </Box>
  );
}
