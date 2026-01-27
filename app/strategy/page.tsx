'use client';

import { Box, Typography, Stack, Tabs, Tab, Select, MenuItem } from '@mui/material';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { SignalManagementTab } from '@/components/strategy/SignalManagementTab';
import { StrategyExecutionPanel } from '@/components/strategy/StrategyExecutionPanel';
import { StrategyParameters } from '@/lib/types/api';
import { useStrategy } from '@/lib/hooks/useStrategy';
import { runStrategyWithSymbols } from '@/lib/api/endpoints';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  MONO_TEXT_SM,
  MONO_TEXT_MD,
  MONO_TEXT_XS,
  TERMINAL_COLORS,
  SPACING,
  RADIUS,
} from '@/lib/theme/styleConstants';

function StrategyPageContent() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  // 탭 인덱스 검증 (0: 파라미터&실행, 1: 시그널 관리)
  const getValidTabIndex = (tabParam: string | null): number => {
    if (!tabParam) return 0;
    const tabIndex = parseInt(tabParam);
    return tabIndex >= 0 && tabIndex <= 1 ? tabIndex : 0;
  };

  const [selectedTab, setSelectedTab] = useState(getValidTabIndex(tabFromUrl));
  const [selectedStrategy, setSelectedStrategy] = useState<'volume_breakout' | 'bearish_volume_resistance'>('volume_breakout');

  // URL의 tab 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    setSelectedTab(getValidTabIndex(tabFromUrl));
  }, [tabFromUrl]);

  // API 연동 - 선택된 전략 사용
  const {
    strategy,
    parameters,
    loading,
    error,
    refetch,
    updateParameters,
  } = useStrategy(selectedStrategy);

  const handleSaveParameters = async (params: StrategyParameters) => {
    try {
      await updateParameters(params);
    } catch (err) {
      console.error('Parameter update failed:', err);
      throw err;
    }
  };

  const handleRunStrategy = async (runtimeParams?: StrategyParameters) => {
    try {
      const configToUse = runtimeParams || parameters;
      const result = await runStrategyWithSymbols(selectedStrategy, undefined, configToUse);
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '전략 실행 실패');
    }
  };

  // Loading state
  if (loading && !strategy) {
    return (
      <DashboardShell>
        <LoadingState message="전략 정보를 불러오는 중..." variant="spinner" minHeight="400px" />
      </DashboardShell>
    );
  }

  // Error state
  if (error || !strategy) {
    return (
      <DashboardShell>
        <ErrorState
          message={error || '전략을 불러올 수 없습니다'}
          onRetry={refetch}
          minHeight="400px"
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

          body {
            background: #000000;
          }
        `}</style>

        {/* Header Section */}
        <Box sx={{ mb: SPACING[4], position: 'relative' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  mb: 1,
                  color: TERMINAL_COLORS.textPrimary,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                STRATEGY
              </Typography>
              <Typography
                sx={{
                  ...MONO_TEXT_SM,
                  color: TERMINAL_COLORS.textTertiary,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Strategy Management & Parameters
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* 전략 선택 드롭다운 */}
              <Select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value as any)}
                size="small"
                sx={{
                  minWidth: 280,
                  bgcolor: 'rgba(10,10,12,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: TERMINAL_COLORS.borderDefault,
                  borderRadius: RADIUS.sm,
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: TERMINAL_COLORS.textPrimary,
                  fontSize: '0.85rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: TERMINAL_COLORS.lime,
                  },
                  '&.Mui-focused': {
                    borderColor: TERMINAL_COLORS.lime,
                  },
                  '& .MuiSelect-icon': {
                    color: TERMINAL_COLORS.textSecondary,
                  }
                }}
              >
                <MenuItem value="volume_breakout">거래량 돌파</MenuItem>
                <MenuItem value="bearish_volume_resistance">음봉 저항선 돌파</MenuItem>
              </Select>

              <Button
                variant="secondary"
                size="medium"
                onClick={refetch}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                <RefreshIcon sx={{ fontSize: 16, mr: 0.5 }} />
                REFRESH
              </Button>
            </Stack>
          </Stack>

          {/* Accent line */}
          <Box
            sx={{
              height: '2px',
              background: `linear-gradient(90deg, ${TERMINAL_COLORS.lime} 0%, transparent 50%)`,
              mt: SPACING[2],
              opacity: 0.3,
            }}
          />
        </Box>

        {/* Tabs */}
        <Card
          variant="default"
          padding="none"
          sx={{
            mb: SPACING[3],
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '-0.01em',
                textTransform: 'none',
                color: TERMINAL_COLORS.textSecondary,
                py: SPACING[2],
                '&.Mui-selected': {
                  color: TERMINAL_COLORS.lime,
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: TERMINAL_COLORS.lime,
                height: '2px',
              }
            }}
          >
            <Tab label="파라미터 & 실행" />
            <Tab label="시그널 관리" />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {selectedTab === 0 && parameters && (
          <StrategyExecutionPanel
            strategyName={strategy.name}
            initialParameters={parameters}
            onSaveParameters={handleSaveParameters}
            onRunStrategy={handleRunStrategy}
          />
        )}

        {selectedTab === 1 && (
          <SignalManagementTab />
        )}
      </Box>
    </DashboardShell>
  );
}

export default function StrategyPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <DashboardShell>
            <LoadingState message="페이지를 불러오는 중..." variant="spinner" minHeight="400px" />
          </DashboardShell>
        }
      >
        <StrategyPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
