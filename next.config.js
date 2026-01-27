/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션 최적화
  reactStrictMode: true,

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 실험적 기능
  experimental: {
    // 최적화된 패키지 임포트
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'date-fns'
    ],
  },

  // 컴파일러 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // 페이지 확장자
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // 정적 파일 압축
  compress: true,

  // 파워드 바이 헤더 비활성화 (보안)
  poweredByHeader: false,

  // 트레일링 슬래시
  trailingSlash: false,

  // 출력 설정
  output: 'standalone',
}

module.exports = nextConfig
