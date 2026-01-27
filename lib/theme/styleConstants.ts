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
} as const;

/**
 * Dark glass morphism variant
 * Used for nested containers and overlays
 */
export const GLASS_PAPER_DARK: SxProps<Theme> = {
  bgcolor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '4px',
} as const;

/**
 * Light glass morphism variant
 * Used for highlighted sections
 */
export const GLASS_PAPER_LIGHT: SxProps<Theme> = {
  bgcolor: 'rgba(20,20,24,0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
} as const;

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
} as const;

/**
 * Monospace text - Small (Body, Values)
 */
export const MONO_TEXT_SM: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
} as const;

/**
 * Monospace text - Medium (Headings, Important Values)
 */
export const MONO_TEXT_MD: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.875rem',
  fontWeight: 700,
} as const;

/**
 * Monospace text - Large (Titles)
 */
export const MONO_TEXT_LG: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1rem',
  fontWeight: 700,
} as const;

/**
 * Monospace text - Extra Large (Page Titles)
 */
export const MONO_TEXT_XL: SxProps<Theme> = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.25rem',
  fontWeight: 700,
} as const;

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
} as const;

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
} as const;

/**
 * Metric label (small gray text above values)
 */
export const METRIC_LABEL: SxProps<Theme> = {
  ...MONO_TEXT_XS,
  color: TERMINAL_COLORS.textTertiary,
  textTransform: 'uppercase',
  mb: 0.5,
} as const;

/**
 * Metric value (large monospace numbers)
 */
export const METRIC_VALUE: SxProps<Theme> = {
  ...MONO_TEXT_LG,
  color: TERMINAL_COLORS.textPrimary,
  fontVariantNumeric: 'tabular-nums',
} as const;

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
} as const;

/**
 * Positive value color (green)
 */
export const VALUE_POSITIVE: SxProps<Theme> = {
  color: TERMINAL_COLORS.lime,
} as const;

/**
 * Negative value color (pink/red)
 */
export const VALUE_NEGATIVE: SxProps<Theme> = {
  color: TERMINAL_COLORS.pink,
} as const;

/**
 * Neutral value color
 */
export const VALUE_NEUTRAL: SxProps<Theme> = {
  color: TERMINAL_COLORS.textSecondary,
} as const;

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
} as const;

export const TABLE_BODY_CELL: SxProps<Theme> = {
  ...MONO_TEXT_SM,
  color: TERMINAL_COLORS.textPrimary,
  borderBottom: `1px solid ${TERMINAL_COLORS.borderSubtle}`,
  py: 1.5,
  px: 2,
} as const;

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
} as const;

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
} as const;

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
} as const;

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
} as const;

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
