'use client';

import { createTheme, PaletteMode, ThemeOptions } from '@mui/material/styles';

// 추가 커스텀 색상 타입 정의
declare module '@mui/material/styles' {
  interface Palette {
    agent: {
      financial: string;
      supply: string;
      news: string;
    };
  }
  interface PaletteOptions {
    agent?: {
      financial?: string;
      supply?: string;
      news?: string;
    };
  }
}

// 공통 타이포그래피 설정
const typography: ThemeOptions['typography'] = {
  fontFamily: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};

// 공통 shape 설정
const shape = {
  borderRadius: 12,
};

// 공통 shadows (라이트 모드용)
const lightShadows = [
  'none',
  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
  '0 0 0 0 rgba(0, 0, 0, 0)',
] as any;

/**
 * 테마 생성 함수
 *
 * @param mode - 'light' 또는 'dark'
 * @returns MUI Theme
 */
export const createAppTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#3B82F6', // signal (동일)
        light: '#60A5FA',
        dark: '#2563EB',
      },
      secondary: {
        main: isDark ? '#1A1F26' : '#F3F4F6',
        light: isDark ? '#242B33' : '#F9FAFB',
        dark: isDark ? '#0F1419' : '#E5E7EB',
      },
      success: {
        main: '#10B981', // gain (동일)
        light: '#34D399',
        dark: '#059669',
      },
      error: {
        main: '#EF4444', // loss (동일)
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B', // ai (동일)
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#06B6D4', // agent-supply (동일)
        light: '#22D3EE',
        dark: '#0891B2',
      },
      background: {
        default: isDark ? '#0F1419' : '#F9FAFB',
        paper: isDark ? '#1A1F26' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#E8E8E8' : '#1F2937',
        secondary: isDark ? '#9AA0A6' : '#6B7280',
        disabled: isDark ? '#6B7280' : '#9CA3AF',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography,
    shape,
    shadows: lightShadows,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#6B7280 #1A1F26' : '#D1D5DB #F3F4F6',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 4,
              backgroundColor: isDark ? '#6B7280' : '#D1D5DB',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDark ? '#9AA0A6' : '#9CA3AF',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: isDark ? '#1A1F26' : '#F3F4F6',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '1rem',
          },
          sizeLarge: {
            padding: '12px 24px',
            fontSize: '1.125rem',
          },
          sizeSmall: {
            padding: '6px 12px',
            fontSize: '0.875rem',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? 'rgba(26, 31, 38, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
          },
        },
      },
    },
  });
};

// 기본 다크 테마 (하위 호환성)
export const theme = createAppTheme('dark');

// 커스텀 색상
export const customColors = {
  agent: {
    financial: '#8B5CF6',
    supply: '#06B6D4',
    news: '#EC4899',
  },
  glass: {
    darkBg: 'rgba(26, 31, 38, 0.7)',
    lightBg: 'rgba(255, 255, 255, 0.9)',
    darkBorder: 'rgba(255, 255, 255, 0.1)',
    lightBorder: 'rgba(0, 0, 0, 0.08)',
  },
};
