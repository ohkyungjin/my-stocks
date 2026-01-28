'use client';

import { useState, useRef, ReactNode, useCallback, TouchEvent } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { COLORS, SPACING } from '@/lib/theme/styleConstants';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Pull distance threshold in pixels
  disabled?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 100,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const startY = useRef(0);
  const scrollY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing) return;

    // Only allow pull to refresh if at the top of the page
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    scrollY.current = scrollTop;

    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  }, [disabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (!canPull || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Only pull down (positive difference)
    if (diff > 0) {
      // Apply resistance: diminishing returns as you pull further
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, threshold * 1.5);
      setPullDistance(distance);

      // Prevent default scroll behavior when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [canPull, disabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!canPull || disabled || isRefreshing) {
      setPullDistance(0);
      setCanPull(false);
      return;
    }

    setCanPull(false);

    // Trigger refresh if pulled beyond threshold
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold); // Lock at threshold during refresh

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Snap back if not pulled far enough
      setPullDistance(0);
    }
  }, [canPull, disabled, isRefreshing, pullDistance, threshold, onRefresh]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const showSpinner = pullDistance > 20 || isRefreshing;

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: 'relative',
        transition: isRefreshing ? 'none' : 'transform 0.2s ease-out',
        transform: `translateY(${pullDistance}px)`,
        touchAction: canPull && pullDistance > 10 ? 'none' : 'auto',
      }}
    >
      {/* Pull indicator */}
      {showSpinner && (
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
          }}
        >
          <CircularProgress
            variant={isRefreshing ? 'indeterminate' : 'determinate'}
            value={pullProgress * 100}
            size={40}
            thickness={4}
            sx={{
              color: COLORS.primary.main,
              opacity: isRefreshing ? 1 : pullProgress,
            }}
          />
        </Box>
      )}

      {children}
    </Box>
  );
}
