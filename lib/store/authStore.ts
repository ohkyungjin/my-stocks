/**
 * Authentication Store (Zustand)
 *
 * Manages user authentication state and tokens
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/client';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

interface LoginResponse {
  user: User;
  token: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
  message: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>(
            '/api/v1/auth/login',
            { username, password }
          );

          set({
            user: response.user,
            accessToken: response.token.access_token,
            refreshToken: response.token.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || '로그인에 실패했습니다',
          });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post<User>(
            '/api/v1/auth/register',
            userData
          );

          // Auto login after registration
          await get().login(userData.username, userData.password);
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '회원가입에 실패했습니다',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();

        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        try {
          const response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
          }>(
            '/api/v1/auth/refresh',
            { refresh_token: refreshToken }
          );

          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
          });
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => set({ user }),

      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
