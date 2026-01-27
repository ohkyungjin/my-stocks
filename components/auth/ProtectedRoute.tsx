'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, hasHydrated } = useAuthStore();

  useEffect(() => {
    // Skip check if authentication is not required
    if (!requireAuth) {
      return;
    }

    // Wait for hydration to complete
    if (!hasHydrated) {
      return;
    }

    // Wait for loading to complete
    if (isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect to home if admin is required but user is not admin
    if (requireAdmin && user && !user.is_superuser) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, isLoading, hasHydrated, requireAuth, requireAdmin, router]);

  // Show loading spinner while hydrating or checking authentication
  if (requireAuth && (!hasHydrated || isLoading)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show loading spinner if not authenticated (will redirect)
  if (requireAuth && !isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show loading if admin is required but user is not admin (will redirect)
  if (requireAdmin && user && !user.is_superuser) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
