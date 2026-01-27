/**
 * FinFlow Dark Design System - Modern Fintech UI
 *
 * Inspired by Robinhood/Webull: Minimal, intuitive, mobile-friendly
 * Color palette: Purple/Teal/Emerald/Rose on dark slate
 * Typography: Inter Variable + Pretendard Variable (Sans-serif)
 */

import { SxProps, Theme } from '@mui/material';

// ============================================================================
// COLOR PALETTE - FinFlow Dark
// ============================================================================

/**
 * Core colors for the FinFlow Dark theme
 */
export const COLORS = {
  // Primary (Purple/Violet)
  primary: {
    main: '#8B5CF6',      // violet-500
    light: '#A78BFA',     // violet-400
    dark: '#7C3AED',      // violet-600
    subtle: 'rgba(139, 92, 246, 0.1)',
    glow: 'rgba(139, 92, 246, 0.3)',
  },

  // Secondary (Teal/Cyan)
  secondary: {
    main: '#14B8A6',      // teal-500
    light: '#2DD4BF',     // teal-400
    dark: '#0D9488',      // teal-600
    subtle: 'rgba(20, 184, 166, 0.1)',
    glow: 'rgba(20, 184, 166, 0.3)',
  },

  // Success (Emerald - for profit/gains)
  success: {
    main: '#10B981',      // emerald-500
    light: '#34D399',     // emerald-400
    dark: '#059669',      // emerald-600
    subtle: 'rgba(16, 185, 129, 0.1)',
    bg: 'rgba(16, 185, 129, 0.05)',
  },

  // Danger (Rose - for loss/decline)
  danger: {
    main: '#F43F5E',      // rose-500
    light: '#FB7185',     // rose-400
    dark: '#E11D48',      // rose-600
    subtle: 'rgba(244, 63, 94, 0.1)',
    bg: 'rgba(244, 63, 94, 0.05)',
  },

  // Warning (Amber)
  warning: {
    main: '#F59E0B',      // amber-500
    light: '#FBBF24',     // amber-400
    dark: '#D97706',      // amber-600
    subtle: 'rgba(245, 158, 11, 0.1)',
    bg: 'rgba(245, 158, 11, 0.05)',
  },

  // Info (Blue)
  info: {
    main: '#3B82F6',      // blue-500
    light: '#60A5FA',     // blue-400
    dark: '#2563EB',      // blue-600
    subtle: 'rgba(59, 130, 246, 0.1)',
    bg: 'rgba(59, 130, 246, 0.05)',
  },

  // Background & Surfaces (Slate)
  background: {
    primary: '#0F172A',   // slate-900
    secondary: '#1E293B', // slate-800
    tertiary: '#334155',  // slate-700
    elevated: '#475569',  // slate-600
  },

  // Text colors
  text: {
    primary: '#F1F5F9',   // slate-100
    secondary: '#CBD5E1', // slate-300
    tertiary: '#94A3B8',  // slate-400
    disabled: '#64748B',  // slate-500
  },

  // Border colors
  border: {
    default: 'rgba(148, 163, 184, 0.1)',  // subtle slate
    light: 'rgba(148, 163, 184, 0.2)',
    strong: 'rgba(148, 163, 184, 0.3)',
  },

  // Overlay
  overlay: {
    light: 'rgba(15, 23, 42, 0.5)',
    medium: 'rgba(15, 23, 42, 0.7)',
    dark: 'rgba(15, 23, 42, 0.9)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY - Inter + Pretendard Sans-serif
// ============================================================================

/**
 * Typography scale for headings and body text
 * Uses Inter Variable for numbers/English, Pretendard Variable for Korean
 */

// Display (Page titles, hero text)
export const TEXT_DISPLAY_LG: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '3rem',      // 48px
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
};

export const TEXT_DISPLAY_MD: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '2.25rem',   // 36px
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
};

export const TEXT_DISPLAY_SM: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1.875rem',  // 30px
  fontWeight: 700,
  lineHeight: 1.25,
};

// Headings
export const TEXT_HEADING_LG: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1.5rem',    // 24px
  fontWeight: 600,
  lineHeight: 1.3,
};

export const TEXT_HEADING_MD: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1.25rem',   // 20px
  fontWeight: 600,
  lineHeight: 1.4,
};

export const TEXT_HEADING_SM: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1.125rem',  // 18px
  fontWeight: 600,
  lineHeight: 1.5,
};

// Body text
export const TEXT_BODY_LG: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1rem',      // 16px
  fontWeight: 400,
  lineHeight: 1.6,
};

export const TEXT_BODY_MD: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '0.875rem',  // 14px
  fontWeight: 400,
  lineHeight: 1.5,
};

export const TEXT_BODY_SM: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '0.75rem',   // 12px
  fontWeight: 400,
  lineHeight: 1.5,
};

// Labels (Medium weight for emphasis)
export const TEXT_LABEL_LG: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '1rem',      // 16px
  fontWeight: 500,
  lineHeight: 1.5,
};

export const TEXT_LABEL_MD: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '0.875rem',  // 14px
  fontWeight: 500,
  lineHeight: 1.5,
};

export const TEXT_LABEL_SM: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '0.75rem',   // 12px
  fontWeight: 500,
  lineHeight: 1.5,
};

// Caption (Small metadata text)
export const TEXT_CAPTION: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
  fontSize: '0.6875rem', // 11px
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '0.01em',
};

// Numbers (Tabular figures for price alignment)
export const TEXT_NUMBER_LG: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '2rem',      // 32px
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_NUMBER_MD: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '1.5rem',    // 24px
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_NUMBER_SM: SxProps<Theme> = {
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '1rem',      // 16px
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

// ============================================================================
// SPACING SCALE
// ============================================================================

/**
 * Consistent spacing scale (4px base unit)
 */
export const SPACING = {
  0: 0,
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius scale - Robinhood/Webull style (rounded, soft)
 */
export const RADIUS = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Soft shadow system for depth and elevation
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  glow: {
    primary: `0 0 20px ${COLORS.primary.glow}`,
    secondary: `0 0 20px ${COLORS.secondary.glow}`,
    success: `0 0 15px rgba(16, 185, 129, 0.3)`,
    danger: `0 0 15px rgba(244, 63, 94, 0.3)`,
  },
} as const;

// ============================================================================
// ANIMATION TIMING
// ============================================================================

/**
 * Animation duration and easing curves
 */
export const TIMING = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
} as const;

export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const TRANSITIONS = {
  color: `color ${TIMING.fast} ${EASING.default}`,
  background: `background-color ${TIMING.fast} ${EASING.default}`,
  border: `border-color ${TIMING.fast} ${EASING.default}`,
  transform: `transform ${TIMING.normal} ${EASING.spring}`,
  opacity: `opacity ${TIMING.normal} ${EASING.default}`,
  all: `all ${TIMING.normal} ${EASING.default}`,
  shadow: `box-shadow ${TIMING.normal} ${EASING.default}`,
} as const;

// ============================================================================
// SURFACE STYLES - Modern Cards & Containers
// ============================================================================

/**
 * Default card surface - subtle background with soft shadow
 */
export const CARD_DEFAULT: SxProps<Theme> = {
  bgcolor: COLORS.background.secondary,
  borderRadius: RADIUS.lg,
  border: `1px solid ${COLORS.border.default}`,
  boxShadow: SHADOWS.sm,
  transition: TRANSITIONS.all,
};

/**
 * Elevated card - stronger shadow for hover/active states
 */
export const CARD_ELEVATED: SxProps<Theme> = {
  ...CARD_DEFAULT,
  boxShadow: SHADOWS.md,
  border: `1px solid ${COLORS.border.light}`,
};

/**
 * Interactive card - hover effects
 */
export const CARD_INTERACTIVE: SxProps<Theme> = {
  ...CARD_DEFAULT,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: SHADOWS.lg,
    border: `1px solid ${COLORS.border.light}`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: SHADOWS.md,
  },
};

/**
 * Highlighted card - with primary color accent
 */
export const CARD_HIGHLIGHT: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.primary.main,
  bgcolor: COLORS.primary.subtle,
  boxShadow: SHADOWS.glow.primary,
};

/**
 * Success card - for profit/gains
 */
export const CARD_SUCCESS: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.success.main,
  bgcolor: COLORS.success.bg,
};

/**
 * Danger card - for loss/decline
 */
export const CARD_DANGER: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.danger.main,
  bgcolor: COLORS.danger.bg,
};

// ============================================================================
// GRADIENT BACKGROUNDS
// ============================================================================

/**
 * Gradient backgrounds for headers, hero sections, etc.
 */
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${COLORS.primary.dark} 0%, ${COLORS.primary.main} 100%)`,
  secondary: `linear-gradient(135deg, ${COLORS.secondary.dark} 0%, ${COLORS.secondary.main} 100%)`,
  success: `linear-gradient(135deg, ${COLORS.success.dark} 0%, ${COLORS.success.main} 100%)`,
  danger: `linear-gradient(135deg, ${COLORS.danger.dark} 0%, ${COLORS.danger.main} 100%)`,
  purple: `linear-gradient(135deg, ${COLORS.primary.main} 0%, ${COLORS.secondary.main} 100%)`,
  dark: `linear-gradient(180deg, ${COLORS.background.secondary} 0%, ${COLORS.background.primary} 100%)`,
  overlay: `linear-gradient(180deg, transparent 0%, ${COLORS.overlay.dark} 100%)`,
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

/**
 * Z-index scale for layering elements
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints (same as Tailwind)
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================================================
// LEGACY COMPATIBILITY (Deprecated - will be removed)
// ============================================================================

/**
 * @deprecated Use CARD_DEFAULT instead
 */
export const GLASS_PAPER = CARD_DEFAULT;

/**
 * @deprecated Use CARD_ELEVATED instead
 */
export const GLASS_PAPER_DARK = CARD_ELEVATED;

/**
 * @deprecated Use CARD_HIGHLIGHT instead
 */
export const GLASS_PAPER_LIGHT = CARD_HIGHLIGHT;

/**
 * @deprecated Use TEXT_* constants instead
 */
export const MONO_TEXT_XS = TEXT_CAPTION;
export const MONO_TEXT_SM = TEXT_BODY_SM;
export const MONO_TEXT_MD = TEXT_BODY_MD;
export const MONO_TEXT_LG = TEXT_BODY_LG;
export const MONO_TEXT_XL = TEXT_HEADING_SM;

/**
 * @deprecated Use COLORS instead
 */
export const TERMINAL_COLORS = {
  lime: COLORS.primary.main,
  pink: COLORS.danger.main,
  textPrimary: COLORS.text.primary,
  textSecondary: COLORS.text.secondary,
  textTertiary: COLORS.text.tertiary,
  error: COLORS.danger.main,
  borderDefault: COLORS.border.default,
  bgPrimary: COLORS.background.primary,
};

// ============================================================================
// BUTTON STYLES - FinFlow Dark
// ============================================================================

/**
 * Primary button - Purple gradient, high emphasis
 */
export const BUTTON_PRIMARY: SxProps<Theme> = {
  ...TEXT_LABEL_MD,
  bgcolor: COLORS.primary.main,
  color: '#FFFFFF',
  px: SPACING[6],
  py: SPACING[3],
  borderRadius: RADIUS.lg,
  boxShadow: SHADOWS.sm,
  textTransform: 'none',
  fontWeight: 600,
  transition: TRANSITIONS.all,
  '&:hover': {
    bgcolor: COLORS.primary.dark,
    boxShadow: SHADOWS.md,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    bgcolor: COLORS.background.tertiary,
    color: COLORS.text.disabled,
  },
};

/**
 * Secondary button - Outlined, medium emphasis
 */
export const BUTTON_SECONDARY: SxProps<Theme> = {
  ...TEXT_LABEL_MD,
  bgcolor: 'transparent',
  color: COLORS.text.primary,
  px: SPACING[6],
  py: SPACING[3],
  borderRadius: RADIUS.lg,
  border: `1px solid ${COLORS.border.light}`,
  textTransform: 'none',
  fontWeight: 500,
  transition: TRANSITIONS.all,
  '&:hover': {
    bgcolor: COLORS.background.tertiary,
    borderColor: COLORS.border.strong,
  },
  '&:disabled': {
    borderColor: COLORS.border.default,
    color: COLORS.text.disabled,
  },
};

/**
 * Ghost button - Transparent, low emphasis
 */
export const BUTTON_GHOST: SxProps<Theme> = {
  ...TEXT_LABEL_MD,
  bgcolor: 'transparent',
  color: COLORS.text.secondary,
  px: SPACING[4],
  py: SPACING[2],
  borderRadius: RADIUS.md,
  textTransform: 'none',
  fontWeight: 500,
  transition: TRANSITIONS.all,
  '&:hover': {
    bgcolor: COLORS.background.tertiary,
    color: COLORS.text.primary,
  },
  '&:disabled': {
    color: COLORS.text.disabled,
  },
};

/**
 * Danger button - Rose red, destructive actions
 */
export const BUTTON_DANGER: SxProps<Theme> = {
  ...TEXT_LABEL_MD,
  bgcolor: COLORS.danger.main,
  color: '#FFFFFF',
  px: SPACING[6],
  py: SPACING[3],
  borderRadius: RADIUS.lg,
  boxShadow: SHADOWS.sm,
  textTransform: 'none',
  fontWeight: 600,
  transition: TRANSITIONS.all,
  '&:hover': {
    bgcolor: COLORS.danger.dark,
    boxShadow: SHADOWS.md,
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    bgcolor: COLORS.background.tertiary,
    color: COLORS.text.disabled,
  },
};

// Legacy exports for backwards compatibility
export const COLORS_EXTENDED = COLORS;
export const SECTION_HEADER = TEXT_HEADING_MD;
export const METRIC_LABEL = TEXT_LABEL_SM;
export const METRIC_VALUE = TEXT_NUMBER_MD;

// Component-friendly aliases
export const CARD_PRIMARY = CARD_DEFAULT;
export const CARD_SECONDARY = CARD_ELEVATED;
export const TEXT_XS = TEXT_CAPTION;
export const TEXT_SM = TEXT_BODY_SM;
export const TEXT_MD = TEXT_BODY_MD;
