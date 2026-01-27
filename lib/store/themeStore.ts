/**
 * 테마 상태 관리 스토어
 *
 * Zustand를 사용하여 라이트/다크 모드 전환 상태 관리
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteMode } from '@mui/material';

interface ThemeState {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark', // 기본값: 다크 모드

      toggleMode: () =>
        set((state) => ({
          mode: state.mode === 'dark' ? 'light' : 'dark',
        })),

      setMode: (mode: PaletteMode) =>
        set({ mode }),
    }),
    {
      name: 'theme-storage', // localStorage 키
    }
  )
);
