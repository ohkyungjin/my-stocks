'use client';

import { COLORS } from '@/lib/theme/styleConstants';

/**
 * Skip Navigation Component
 *
 * Provides keyboard users with a quick way to bypass navigation and jump directly to main content.
 * This component is visually hidden until focused, improving accessibility for screen reader
 * and keyboard-only users.
 *
 * WCAG 2.1 Level A Compliance: Bypass Blocks (2.4.1)
 */
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '1rem 1.5rem',
        backgroundColor: COLORS.success.main,
        color: COLORS.background.pure,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.875rem',
        fontWeight: 700,
        textDecoration: 'none',
        borderRadius: '0 0 4px 0',
        transition: 'left 0.2s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      메인 콘텐츠로 바로가기 (Press Enter)
    </a>
  );
}
