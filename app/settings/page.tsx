'use client';

/**
 * Settings Page
 *
 * 사용자 설정 페이지 - 자격증명 관리
 */

import { Container, Typography, Box, Paper, Breadcrumbs, Link } from '@mui/material';
import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CredentialsForm from '@/components/settings/CredentialsForm';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            href="/"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            홈
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SettingsIcon fontSize="small" />
            설정
          </Box>
        </Breadcrumbs>

        {/* 페이지 헤더 */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            설정
          </Typography>
          <Typography variant="body1" color="text.secondary">
            API 키 및 자격증명을 안전하게 관리하세요. 모든 정보는 암호화되어 저장됩니다.
          </Typography>
        </Box>

        {/* 자격증명 폼 */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box mb={3}>
            <Typography variant="h5" gutterBottom fontWeight="medium">
              API 자격증명
            </Typography>
            <Typography variant="body2" color="text.secondary">
              한국투자증권 API, 텔레그램 봇, OpenAI API 키를 설정하세요.
            </Typography>
          </Box>

          <CredentialsForm
            onSaveSuccess={() => {
              console.log('자격증명 저장 성공');
            }}
          />
        </Paper>

        {/* 추가 설정 섹션 (향후 확장) */}
        {/* <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mt: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            계정 설정
          </Typography>
          <Typography variant="body2" color="text.secondary">
            프로필, 비밀번호 변경 등
          </Typography>
        </Paper> */}
      </Container>
    </ProtectedRoute>
  );
}
