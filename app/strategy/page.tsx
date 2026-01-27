'use client';

import { Box, Typography, Stack, Alert, CircularProgress, Tabs, Tab, Button, Select, MenuItem } from '@mui/material';
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: '#00FF41' }} />
        </Box>
      </DashboardShell>
    );
  }

  // Error state
  if (error || !strategy) {
    return (
      <DashboardShell>
        <Alert
          severity="error"
          sx={{
            bgcolor: 'rgba(255,0,110,0.05)',
            border: '1px solid rgba(255,0,110,0.2)',
            color: '#FF006E',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.75rem',
            borderRadius: '2px',
          }}
        >
          {error || '전략을 불러올 수 없습니다'}
          <Button
            size="small"
            onClick={refetch}
            sx={{
              ml: 2,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem',
              color: '#FF006E',
            }}
          >
            재시도
          </Button>
        </Alert>
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
        <Box sx={{ mb: 4, position: 'relative' }}>
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
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                STRATEGY
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.4)',
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
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: 'rgba(0,255,65,0.3)',
                  },
                  '&.Mui-focused': {
                    borderColor: '#00FF41',
                  },
                  '& .MuiSelect-icon': {
                    color: 'rgba(255,255,255,0.5)',
                  }
                }}
              >
                <MenuItem value="volume_breakout">거래량 돌파</MenuItem>
                <MenuItem value="bearish_volume_resistance">음봉 저항선 돌파</MenuItem>
              </Select>

              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                onClick={refetch}
                disabled={loading}
                sx={{
                  borderRadius: '2px',
                  textTransform: 'none',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  py: 0.8,
                  px: 2,
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '0.05em',
                  '&:hover': {
                    borderColor: '#00FF41',
                    bgcolor: 'rgba(0,255,65,0.05)',
                    color: '#00FF41',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                REFRESH
              </Button>
            </Stack>
          </Stack>

          {/* Accent line */}
          <Box
            sx={{
              height: '2px',
              background: 'linear-gradient(90deg, #00FF41 0%, transparent 50%)',
              mt: 2,
              opacity: 0.3,
            }}
          />
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            mb: 3,
            bgcolor: 'rgba(10,10,12,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
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
                color: 'rgba(255,255,255,0.4)',
                py: 2,
                '&.Mui-selected': {
                  color: '#00FF41',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#00FF41',
                height: '2px',
              }
            }}
          >
            <Tab label="파라미터 & 실행" />
            <Tab label="시그널 관리" />
          </Tabs>
        </Box>

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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress sx={{ color: '#00FF41' }} />
            </Box>
          </DashboardShell>
        }
      >
        <StrategyPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
