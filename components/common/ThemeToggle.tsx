/**
 * 테마 토글 버튼
 *
 * 라이트/다크 모드를 전환하는 버튼 컴포넌트
 */

'use client';

import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '@/lib/store/themeStore';

export function ThemeToggle() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeStore();

  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        sx={{
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'rotate(15deg)',
          },
        }}
        aria-label="테마 전환"
      >
        {isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
