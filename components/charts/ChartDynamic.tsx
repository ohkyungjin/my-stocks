/**
 * 차트 컴포넌트 동적 임포트 래퍼
 *
 * 차트 라이브러리를 lazy loading하여 초기 번들 크기 감소
 */

import dynamic from 'next/dynamic';
import { Box, Skeleton, Stack } from '@mui/material';
import { GLASS_PAPER } from '@/lib/theme/styleConstants';

// 로딩 컴포넌트
const ChartLoadingFallback = () => (
  <Box sx={{
    ...GLASS_PAPER,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2
  }}>
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={32} width="75%" />
      <Skeleton variant="rectangular" height={400} width="100%" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="rectangular" height={16} width="25%" />
        <Skeleton variant="rectangular" height={16} width="25%" />
      </Box>
    </Stack>
  </Box>
);

/**
 * CandlestickChart - 동적 임포트
 *
 * 캔들스틱 차트는 lightweight-charts 라이브러리를 사용하며
 * 상대적으로 큰 번들 크기를 가지므로 lazy loading 적용
 */
export const CandlestickChartDynamic = dynamic(
  () => import('./CandlestickChart').then((mod) => ({ default: mod.CandlestickChart })),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false, // 차트는 클라이언트에서만 렌더링
  }
);


