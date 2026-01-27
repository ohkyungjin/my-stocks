import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "한국 주식 트레이딩 AI - Korean Stock Trading AI",
  description: "AI 기반 한국 주식 자동 매매 시스템 | Volume Breakout 전략 | 3개 AI 에이전트 분석",
  keywords: ["주식", "AI", "자동매매", "Volume Breakout", "한국 주식", "트레이딩"],
  authors: [{ name: "Korean Stock Trading AI System" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F1419",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className={ibmPlexMono.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
