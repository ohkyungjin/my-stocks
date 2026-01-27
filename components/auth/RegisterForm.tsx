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
import { TEXT_BODY_SM, TEXT_HEADING_LG, COLORS } from '@/lib/theme/styleConstants';

export default function RegisterForm() {
  const router = useRouter();
  const { register, error, isLoading, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError();
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('비밀번호가 일치하지 않습니다');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setValidationError('비밀번호는 최소 8자 이상이어야 합니다');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || undefined,
      });
      router.push('/');
    } catch (error) {
      // Error is handled by the store
      console.error('Registration failed:', error);
    }
  };

  const displayError = validationError || error;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
        py: 4,
        bgcolor: COLORS.background.primary,
      }}
    >
      <Card
        variant="default"
        padding="lg"
        sx={{
          maxWidth: 480,
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component="h1"
            sx={{
              ...TEXT_HEADING_LG,
              color: COLORS.primary.main,
              mb: 1,
            }}
          >
            회원가입
          </Typography>
          <Typography
            sx={{
              ...TEXT_BODY_SM,
              color: COLORS.text.secondary,
            }}
          >
            새로운 계정을 만들어보세요
          </Typography>
        </Box>

        {/* Error Alert */}
        {displayError && (
          <Card
            variant="highlight"
            padding="sm"
            sx={{
              mb: 3,
              borderColor: COLORS.danger.main,
              bgcolor: 'rgba(239, 68, 68, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Badge variant="error" size="sm">
                ✕
              </Badge>
              <Typography
                sx={{
                  ...TEXT_BODY_SM,
                  color: COLORS.danger.main,
                  flex: 1,
                }}
              >
                {displayError}
              </Typography>
            </Box>
          </Card>
        )}

        {/* Registration Form */}
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
              placeholder="johndoe"
              helperText="3자 이상의 고유한 사용자명을 입력하세요"
            />

            <Input
              fullWidth
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="your@email.com"
            />

            <Input
              fullWidth
              label="이름 (선택)"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="홍길동"
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
              helperText="최소 8자 이상"
            />

            <Input
              fullWidth
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
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
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </Box>
        </form>

        {/* Footer Links */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography
            sx={{
              ...TEXT_BODY_SM,
              color: COLORS.text.secondary,
            }}
          >
            이미 계정이 있으신가요?{' '}
            <MuiLink
              component={Link}
              href="/login"
              sx={{
                color: COLORS.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              로그인
            </MuiLink>
          </Typography>
        </Box>

        {/* Info Card */}
        <Card
          variant="secondary"
          padding="sm"
          sx={{ mt: 3 }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Badge variant="info" size="sm">
              i
            </Badge>
            <Typography
              sx={{
                ...TEXT_BODY_SM,
                fontSize: '0.625rem',
                color: COLORS.text.tertiary,
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              계정 생성 후 자동으로 로그인되며, 실시간 거래 모니터링 페이지로 이동합니다.
            </Typography>
          </Box>
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
