# AI Trading System - Frontend

## 프로젝트 개요

AI 주식 자동 매매 시스템의 웹 프론트엔드입니다.

- **Framework**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: Material-UI (MUI) v6
- **State Management**: Zustand with persist
- **Charts**: Recharts
- **Authentication**: JWT (localStorage)

## 아키텍처

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈 페이지
│   ├── login/                 # 로그인 페이지
│   ├── register/              # 회원가입 페이지
│   ├── dashboard/             # 대시보드
│   ├── realtime-monitoring/   # 실시간 모니터링
│   ├── trading-history/       # 거래 이력
│   └── signals/               # 시그널 관리
│
├── components/                 # 재사용 가능한 컴포넌트
│   ├── auth/
│   │   ├── ProtectedRoute.tsx        # 인증 가드
│   │   └── LoginForm.tsx             # 로그인 폼
│   ├── layout/
│   │   ├── Sidebar.tsx               # 사이드바 (장 시간 표시)
│   │   └── TopBar.tsx                # 상단바
│   ├── charts/
│   │   └── CandlestickChart.tsx      # 캔들차트
│   └── realtime/
│       ├── MonitoringStatus.tsx      # 모니터링 상태
│       └── PositionCard.tsx          # 보유 포지션 카드
│
├── lib/                        # 유틸리티 및 설정
│   ├── api/
│   │   └── client.ts          # API 클라이언트 (fetch wrapper)
│   ├── store/
│   │   └── authStore.ts       # Zustand 인증 스토어
│   ├── hooks/
│   │   └── useWebSocket.ts    # WebSocket 훅
│   └── utils/
│       ├── formatters.ts      # 숫자/날짜 포맷터
│       └── validators.ts      # 입력 검증
│
├── types/                      # TypeScript 타입 정의
│   ├── auth.ts
│   ├── order.ts
│   └── market.ts
│
├── middleware.ts               # Next.js 미들웨어
└── next.config.ts             # Next.js 설정
```

## 핵심 개념

### 1. App Router (Next.js 16)

**파일 기반 라우팅**:
```
app/
  dashboard/
    page.tsx           → /dashboard
  realtime-monitoring/
    page.tsx           → /realtime-monitoring
```

**레이아웃 중첩**:
```tsx
// app/layout.tsx (루트)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Sidebar />
        {children}
      </body>
    </html>
  )
}
```

### 2. 인증 시스템

**Zustand Persist**:
```tsx
// lib/store/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,  // SSR hydration 추적

      login: async (username, password) => { /* ... */ },
      logout: () => { /* ... */ },
    }),
    {
      name: 'auth-storage',  // localStorage 키
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);  // hydration 완료 플래그
      },
    }
  )
)
```

**ProtectedRoute 컴포넌트**:
```tsx
// components/auth/ProtectedRoute.tsx
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  // hydration 완료까지 대기 (새로고침 시 로그아웃 방지)
  if (!hasHydrated) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (requireAdmin && !user?.is_superuser) {
    router.push('/');
    return null;
  }

  return <>{children}</>;
}
```

**사용법**:
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

### 3. API 클라이언트

**타입 안전한 fetch wrapper**:
```tsx
// lib/api/client.ts
class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.accessToken) {
        return { 'Authorization': `Bearer ${state.accessToken}` };
      }
    }
    return {};
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = this.buildURL(endpoint, config?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...config?.headers,
      },
    });
    return this.handleResponse<T>(response);
  }

  // post, put, delete 메서드도 유사
}

export const apiClient = new ApiClient();
```

**사용 예시**:
```tsx
// 타입 안전성
interface Order {
  id: number;
  symbol: string;
  quantity: number;
}

const orders = await apiClient.get<Order[]>('/api/v1/orders');
```

### 4. WebSocket 연결

**useWebSocket 훅**:
```tsx
// lib/hooks/useWebSocket.ts
export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 메시지 처리
    };

    wsRef.current = ws;

    return () => ws.close();
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage };
}
```

**사용 예시**:
```tsx
function RealtimeMonitoring() {
  const { isConnected, sendMessage } = useWebSocket('ws://localhost:8008/api/realtime/ws');

  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'subscribe', topic: 'orders' });
    }
  }, [isConnected]);

  return <div>Connected: {isConnected ? '✅' : '❌'}</div>;
}
```

### 5. 상태 관리 (Zustand)

**장점**:
- Redux보다 간단한 API
- TypeScript 완벽 지원
- persist 미들웨어로 localStorage 자동 동기화
- devtools 지원

**패턴**:
```tsx
// lib/store/ordersStore.ts
interface OrdersState {
  orders: Order[];
  isLoading: boolean;

  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()((set) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    const orders = await apiClient.get<Order[]>('/api/v1/orders');
    set({ orders, isLoading: false });
  },

  addOrder: (order) => set((state) => ({
    orders: [...state.orders, order]
  })),
}));
```

**컴포넌트에서 사용**:
```tsx
function OrdersList() {
  const { orders, isLoading, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) return <CircularProgress />;

  return (
    <List>
      {orders.map(order => (
        <ListItem key={order.id}>{order.symbol}</ListItem>
      ))}
    </List>
  );
}
```

### 6. Material-UI 테마

**커스터마이징**:
```tsx
// app/theme.ts
export const theme = createTheme({
  palette: {
    mode: 'dark',  // 다크 모드
    primary: {
      main: '#1976d2',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',  // 대문자 변환 비활성화
        },
      },
    },
  },
});
```

**사용**:
```tsx
// app/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 페이지별 기능

### 실시간 모니터링 (`/realtime-monitoring`)

**주요 기능**:
1. 모니터링 ON/OFF 토글 (관리자만)
2. 보유 포지션 실시간 손익률 표시
3. 예약 주문 목록
4. WebSocket 연결 상태

**데이터 흐름**:
```
1. 페이지 로드 → GET /api/realtime/account/summary
2. WebSocket 연결 → WS /api/realtime/ws
3. 실시간 업데이트 수신 → 화면 갱신
4. 5초마다 폴링 (fallback)
```

### 거래 이력 (`/trading-history`)

**필터링**:
- 기간별 (오늘, 1주일, 1개월, 전체)
- 종목별
- 상태별 (체결, 미체결, 취소)

**정렬**:
- 최신순, 오래된순
- 수익률 높은순, 낮은순

### 시그널 페이지 (`/signals`)

**기능**:
- 시그널 생성 (AI 분석 기반)
- 예약 주문 변환
- 모니터링 ON/OFF

## 개발 가이드

### 새 페이지 추가

1. **페이지 파일 생성**
```tsx
// app/my-page/page.tsx
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <h1>My Page</h1>
    </ProtectedRoute>
  );
}
```

2. **사이드바에 링크 추가**
```tsx
// components/layout/Sidebar.tsx
const menuItems = [
  // ...
  { label: 'My Page', href: '/my-page', icon: <MyIcon /> },
];
```

### API 호출 추가

1. **타입 정의**
```tsx
// types/mydata.ts
export interface MyData {
  id: number;
  name: string;
}
```

2. **API 호출**
```tsx
import { apiClient } from '@/lib/api/client';
import { MyData } from '@/types/mydata';

const data = await apiClient.get<MyData[]>('/api/v1/my-data');
```

### 새 컴포넌트 작성

**원칙**:
- `'use client'` 디렉티브 명시 (상태/이벤트 사용 시)
- TypeScript Props 인터페이스 정의
- Material-UI 컴포넌트 우선 사용

```tsx
'use client';

import { Card, CardContent, Typography } from '@mui/material';

interface MyCardProps {
  title: string;
  value: number;
}

export default function MyCard({ title, value }: MyCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value.toLocaleString()}</Typography>
      </CardContent>
    </Card>
  );
}
```

### 포맷터 사용

```tsx
// lib/utils/formatters.ts
export const formatNumber = (num: number) => num.toLocaleString('ko-KR');
export const formatCurrency = (num: number) => `${formatNumber(num)}원`;
export const formatPercent = (num: number) => `${num.toFixed(2)}%`;
export const formatDate = (date: string) => new Date(date).toLocaleDateString('ko-KR');
```

**사용**:
```tsx
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';

<Typography>{formatCurrency(1234567)}</Typography>  // 1,234,567원
<Typography>{formatPercent(3.14159)}</Typography>   // 3.14%
```

## 스타일링

### Material-UI sx prop 우선

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 1,
  }}
>
  {/* content */}
</Box>
```

### 반응형 디자인

```tsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6} lg={4}>
    <Card>...</Card>
  </Grid>
</Grid>
```

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8008
```

**중요**: `NEXT_PUBLIC_` 접두사가 있어야 클라이언트에서 접근 가능

## 빌드 및 배포

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 성능 최적화

### 1. React.memo 사용

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // 비싼 연산...
  return <div>{data}</div>;
});
```

### 2. useMemo / useCallback

```tsx
const sortedOrders = useMemo(
  () => orders.sort((a, b) => b.id - a.id),
  [orders]
);

const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

### 3. 이미지 최적화

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
  priority  // LCP 최적화
/>
```

## 문제 해결

### "새로고침 시 로그아웃됨"
- `hasHydrated` 플래그 확인
- `onRehydrateStorage` 콜백 구현 확인

### "API 401 Unauthorized"
- localStorage의 `auth-storage` 확인
- Access Token 만료 → Refresh Token으로 갱신

### "WebSocket 연결 실패"
- CORS 설정 확인
- WebSocket URL 확인 (`ws://` 또는 `wss://`)

### "TypeScript 에러"
- `npm run type-check` 실행
- `@types/*` 패키지 설치 확인

## 참고 자료

- [Next.js 16 문서](https://nextjs.org/docs)
- [Material-UI 문서](https://mui.com/)
- [Zustand 문서](https://docs.pmnd.rs/zustand/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
