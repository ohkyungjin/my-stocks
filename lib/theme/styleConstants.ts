/**
 * Terminal Lux Design - Reusable Style Constants
 *
 * This file contains all repeated styling patterns used throughout the app
 * to eliminate code duplication and ensure consistent theming.
 */

import { SxProps, Theme } from '@mui/material';

// ============================================================================
// GLASS MORPHISM EFFECTS
// ============================================================================

/**
 * Standard glass morphism paper background
 * Used in cards, modals, and container components
 */
export const GLASS_PAPER: SxProps<Theme> = {
  bgcolor: 'rgba(10,10,12,0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '4px',
};

/**
 * Dark glass morphism variant
 * Used for nested containers and overlays
 */
export const GLASS_PAPER_DARK: SxProps<Theme> = {
  bgcolor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '4px',
};

/**
 * Light glass morphism variant
 * Used for highlighted sections
 */
export const GLASS_PAPER_LIGHT: SxProps<Theme> = {
  bgcolor: 'rgba(20,20,24,0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Monospace text - Extra Small (Labels, Metadata)
 */
export const MONO_TEXT_XS: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.02em',
};

/**
 * Monospace text - Small (Body, Values)
 */
export const MONO_TEXT_SM: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
};

/**
 * Monospace text - Medium (Headings, Important Values)
 */
export const MONO_TEXT_MD: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.875rem',
  fontWeight: 700,
};

/**
 * Monospace text - Large (Titles)
 */
export const MONO_TEXT_LG: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1rem',
  fontWeight: 700,
};

/**
 * Monospace text - Extra Large (Page Titles)
 */
export const MONO_TEXT_XL: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.25rem',
  fontWeight: 700,
};

// ============================================================================
// TERMINAL LUX COLORS
// ============================================================================

export const TERMINAL_COLORS = {
  // Primary accent colors
  lime: '#00FF41',
  pink: '#FF006E',

  // Status colors
  success: '#00FF41',
  error: '#FF006E',
  warning: '#FFD60A',
  info: '#00D9FF',

  // Neutral colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textTertiary: 'rgba(255,255,255,0.4)',

  // Background colors
  bgPrimary: '#000000',
  bgSecondary: 'rgba(10,10,12,0.6)',
  bgTertiary: 'rgba(20,20,24,0.7)',

  // Border colors
  borderSubtle: 'rgba(255,255,255,0.04)',
  borderDefault: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.08)',
};

// ============================================================================
// COMMON COMPONENT STYLES
// ============================================================================

/**
 * Standard section header
 */
export const SECTION_HEADER: SxProps<Theme> = {
  ...MONO_TEXT_MD,
  color: TERMINAL_COLORS.lime,
  mb: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

/**
 * Metric label (small gray text above values)
 */
export const METRIC_LABEL: SxProps<Theme> = {
  ...MONO_TEXT_XS,
  color: TERMINAL_COLORS.textTertiary,
  textTransform: 'uppercase',
  mb: 0.5,
};

/**
 * Metric value (large monospace numbers)
 */
export const METRIC_VALUE: SxProps<Theme> = {
  ...MONO_TEXT_LG,
  color: TERMINAL_COLORS.textPrimary,
  fontVariantNumeric: 'tabular-nums',
};

/**
 * Chip/Badge default style
 */
export const CHIP_DEFAULT: SxProps<Theme> = {
  ...MONO_TEXT_XS,
  bgcolor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '2px',
  px: 1,
  py: 0.5,
};

/**
 * Positive value color (green)
 */
export const VALUE_POSITIVE: SxProps<Theme> = {
  color: TERMINAL_COLORS.lime,
};

/**
 * Negative value color (pink/red)
 */
export const VALUE_NEGATIVE: SxProps<Theme> = {
  color: TERMINAL_COLORS.pink,
};

/**
 * Neutral value color
 */
export const VALUE_NEUTRAL: SxProps<Theme> = {
  color: TERMINAL_COLORS.textSecondary,
};

// ============================================================================
// TABLE STYLES
// ============================================================================

export const TABLE_HEADER_CELL: SxProps<Theme> = {
  ...MONO_TEXT_XS,
  color: TERMINAL_COLORS.textTertiary,
  textTransform: 'uppercase',
  borderBottom: `1px solid ${TERMINAL_COLORS.borderDefault}`,
  py: 1.5,
  px: 2,
};

export const TABLE_BODY_CELL: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  color: TERMINAL_COLORS.textPrimary,
  borderBottom: `1px solid ${TERMINAL_COLORS.borderSubtle}`,
  py: 1.5,
  px: 2,
};

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const BUTTON_PRIMARY: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  bgcolor: TERMINAL_COLORS.lime,
  color: '#000000',
  '&:hover': {
    bgcolor: '#00CC34',
  },
  textTransform: 'none',
  borderRadius: '2px',
  px: 3,
  py: 1,
};

export const BUTTON_SECONDARY: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  bgcolor: 'rgba(255,255,255,0.05)',
  color: TERMINAL_COLORS.textPrimary,
  border: `1px solid ${TERMINAL_COLORS.borderDefault}`,
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.08)',
  },
  textTransform: 'none',
  borderRadius: '2px',
  px: 3,
  py: 1,
};

export const BUTTON_DANGER: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  bgcolor: TERMINAL_COLORS.pink,
  color: '#FFFFFF',
  '&:hover': {
    bgcolor: '#CC0058',
  },
  textTransform: 'none',
  borderRadius: '2px',
  px: 3,
  py: 1,
};

// ============================================================================
// INPUT STYLES
// ============================================================================

export const INPUT_DEFAULT: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  bgcolor: 'rgba(255,255,255,0.03)',
  border: `1px solid ${TERMINAL_COLORS.borderDefault}`,
  borderRadius: '2px',
  color: TERMINAL_COLORS.textPrimary,
  '&:hover': {
    borderColor: TERMINAL_COLORS.borderStrong,
  },
  '&:focus': {
    borderColor: TERMINAL_COLORS.lime,
    outline: 'none',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color based on numeric value (positive/negative)
 */
export function getValueColor(value: number): string {
  if (value > 0) return TERMINAL_COLORS.lime;
  if (value < 0) return TERMINAL_COLORS.pink;
  return TERMINAL_COLORS.textSecondary;
}

/**
 * Merge multiple style constants
 * Usage: mergeStyles(GLASS_PAPER, MONO_TEXT_SM, { p: 2 })
 */
export function mergeStyles(...styles: SxProps<Theme>[]): SxProps<Theme> {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
}

// ============================================================================
// SPACING SCALE (NEW SECTION)
// ============================================================================

/**
 * 4px base unit spacing scale
 * Usage: sx={{ p: SPACING[4], gap: SPACING[2] }}
 */
export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
};

// Component-specific spacing tokens
export const COMPONENT_SPACING = {
  card: {
    padding: SPACING[4],
    paddingLg: SPACING[6],
    gap: SPACING[3],
  },
  button: {
    paddingX: SPACING[4],
    paddingY: SPACING[2],
    paddingXLg: SPACING[6],
    paddingYLg: SPACING[3],
    paddingXSm: SPACING[3],
    paddingYSm: SPACING[1.5],
  },
  input: {
    paddingX: SPACING[3],
    paddingY: SPACING[2],
  },
  section: {
    gap: SPACING[6],
    marginBottom: SPACING[8],
  },
  page: {
    padding: SPACING[6],
    maxWidth: '1440px',
  },
};

// ============================================================================
// Z-INDEX SCALE (NEW SECTION)
// ============================================================================

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  drawer: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
};

// ============================================================================
// ANIMATION TOKENS (NEW SECTION)
// ============================================================================

export const TIMING = {
  instant: '0ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
};

export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const TRANSITIONS = {
  color: `color ${TIMING.fast} ${EASING.default}`,
  background: `background-color ${TIMING.fast} ${EASING.default}`,
  border: `border-color ${TIMING.fast} ${EASING.default}`,
  transform: `transform ${TIMING.normal} ${EASING.default}`,
  opacity: `opacity ${TIMING.normal} ${EASING.default}`,
  all: `all ${TIMING.normal} ${EASING.default}`,
};

// ============================================================================
// BORDER RADIUS SCALE (NEW SECTION)
// ============================================================================

export const RADIUS = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// ============================================================================
// BREAKPOINTS (NEW SECTION)
// ============================================================================

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================================================
// EXTENDED COLOR PALETTE (NEW SECTION)
// ============================================================================

// Extends TERMINAL_COLORS with additional semantic colors
export const COLORS_EXTENDED = {
  ...TERMINAL_COLORS,

  // Primary Brand Colors (extended)
  primary: {
    main: '#00FF41',
    light: '#66FF8C',
    dark: '#00CC35',
    muted: 'rgba(0, 255, 65, 0.1)',
  },

  // Accent Colors (extended)
  accent: {
    main: '#FF006E',
    light: '#FF4D94',
    dark: '#CC0058',
    muted: 'rgba(255, 0, 110, 0.1)',
  },

  // Status Colors (WCAG AA compliant)
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Transparency Scale
  alpha: {
    white: {
      5: 'rgba(255, 255, 255, 0.05)',
      10: 'rgba(255, 255, 255, 0.10)',
      20: 'rgba(255, 255, 255, 0.20)',
      40: 'rgba(255, 255, 255, 0.40)',
      60: 'rgba(255, 255, 255, 0.60)',
      80: 'rgba(255, 255, 255, 0.80)',
    },
    black: {
      5: 'rgba(0, 0, 0, 0.05)',
      10: 'rgba(0, 0, 0, 0.10)',
      20: 'rgba(0, 0, 0, 0.20)',
      40: 'rgba(0, 0, 0, 0.40)',
      60: 'rgba(0, 0, 0, 0.60)',
      80: 'rgba(0, 0, 0, 0.80)',
    },
  },
};
