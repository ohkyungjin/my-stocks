/**
 * FinFlow Dark Design System - Revolutionary Fintech UI
 *
 * Inspired by Robinhood/Webull: Bold, immersive, mobile-first
 * True black backgrounds, vibrant profit/loss colors, giant typography
 *
 * Design Philosophy:
 * - OLED-optimized true black (#000000)
 * - Robinhood green (#00C805) for profit/success
 * - Vibrant red (#FF3B30) for loss/danger
 * - Purple (#8B5CF6) for primary actions and trust
 * - Mobile-first, thumb-friendly interactions
 * - Minimal shadows, maximum contrast
 */

import { SxProps, Theme } from '@mui/material';

// ============================================================================
// COLOR PALETTE - FinFlow Dark (Revolutionary)
// ============================================================================

/**
 * Revolutionary color system inspired by Robinhood/Webull
 * Emotion-driven colors for financial data
 */
export const COLORS = {
  // Primary (Purple - Trust, Premium)
  primary: {
    main: '#8B5CF6',        // Vibrant purple
    light: '#A78BFA',       // Light purple
    dark: '#7C3AED',        // Dark purple
    subtle: 'rgba(139, 92, 246, 0.12)',
    glow: 'rgba(139, 92, 246, 0.4)',
  },

  // Secondary (Cyan/Blue - Info, Calm)
  secondary: {
    main: '#5AC8FA',        // iOS blue
    light: '#7DD3FC',       // Light cyan
    dark: '#0EA5E9',        // Sky blue
    subtle: 'rgba(90, 200, 250, 0.12)',
    glow: 'rgba(90, 200, 250, 0.4)',
  },

  // Success/Profit (Robinhood Green - Excitement, Growth)
  success: {
    main: '#00C805',        // Robinhood green - THE profit color
    light: '#32D74B',       // Bright green
    dark: '#00A504',        // Deep green
    subtle: 'rgba(0, 200, 5, 0.12)',
    bg: 'rgba(0, 200, 5, 0.08)',
    glow: '0 0 20px rgba(0, 200, 5, 0.3)',
  },

  // Danger/Loss (Vibrant Red - Attention, Caution)
  danger: {
    main: '#FF3B30',        // iOS red - THE loss color
    light: '#FF6961',       // Bright red
    dark: '#CC2F26',        // Deep red
    subtle: 'rgba(255, 59, 48, 0.12)',
    bg: 'rgba(255, 59, 48, 0.08)',
    glow: '0 0 20px rgba(255, 59, 48, 0.3)',
  },

  // Warning (Amber/Gold)
  warning: {
    main: '#FF9500',        // iOS orange
    light: '#FFAC33',
    dark: '#CC7700',
    subtle: 'rgba(255, 149, 0, 0.12)',
    bg: 'rgba(255, 149, 0, 0.08)',
  },

  // Info (Blue)
  info: {
    main: '#007AFF',        // iOS blue
    light: '#339AFF',
    dark: '#0062CC',
    subtle: 'rgba(0, 122, 255, 0.12)',
    bg: 'rgba(0, 122, 255, 0.08)',
  },

  // Backgrounds (True Black - OLED Optimized)
  background: {
    pure: '#000000',        // True black - main background
    primary: '#000000',     // True black
    secondary: '#0D0D0D',   // Elevated surfaces
    tertiary: '#1A1A1A',    // Cards, modals
    elevated: '#262626',    // Highest elevation
    sheet: '#1C1C1E',       // Bottom sheets
  },

  // Text colors (High contrast on black)
  text: {
    primary: '#FFFFFF',     // Pure white - maximum contrast
    secondary: '#8E8E93',   // iOS gray
    tertiary: '#636366',    // Muted text
    disabled: '#48484A',    // Disabled state
    inverse: '#000000',     // For light backgrounds
  },

  // Border colors (Subtle on black)
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    light: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.2)',
    separator: 'rgba(255, 255, 255, 0.05)',
  },

  // Overlay (For modals, sheets)
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.6)',
    dark: 'rgba(0, 0, 0, 0.8)',
    blur: 'rgba(0, 0, 0, 0.7)',
  },

  // Chart colors
  chart: {
    profit: '#00C805',      // Green line/area
    loss: '#FF3B30',        // Red line/area
    neutral: '#5AC8FA',     // Blue line
    grid: 'rgba(255, 255, 255, 0.06)',
    volume: 'rgba(139, 92, 246, 0.3)',
  },

  // Semantic colors for Korean market (up = profit/green, down = loss/red)
  semantic: {
    profit: '#00C805',      // Robinhood green - Upward candles
    loss: '#FF3B30',        // Vibrant red - Downward candles
    profitAlpha: 'rgba(0, 200, 5, 0.3)',  // Volume bars up
    lossAlpha: 'rgba(255, 59, 48, 0.3)',  // Volume bars down
  },
} as const;

// ============================================================================
// TYPOGRAPHY - Giant Financial Numbers
// ============================================================================

/**
 * Revolutionary typography scale
 * Huge numbers for financial data, minimal text for labels
 * Range: 12px to 72px (expanded from traditional 12-48px)
 */

const FONT_FAMILY = 'var(--font-inter), "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-serif';
const FONT_FAMILY_MONO = '"SF Mono", "Roboto Mono", "Fira Code", monospace';

// Hero Numbers (Account balance, main P/L)
export const TEXT_HERO: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '4.5rem',     // 72px - GIANT
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_HERO_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '3.5rem',     // 56px
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '-0.02em',
  fontVariantNumeric: 'tabular-nums',
};

// Display (Stock prices, large values)
export const TEXT_DISPLAY_XL: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '3rem',       // 48px
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_DISPLAY_LG: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '2.25rem',    // 36px
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_DISPLAY_MD: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.75rem',    // 28px
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
};

export const TEXT_DISPLAY_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.5rem',     // 24px
  fontWeight: 700,
  lineHeight: 1.25,
};

// Headings
export const TEXT_HEADING_LG: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.25rem',    // 20px
  fontWeight: 600,
  lineHeight: 1.3,
};

export const TEXT_HEADING_MD: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.125rem',   // 18px
  fontWeight: 600,
  lineHeight: 1.4,
};

export const TEXT_HEADING_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1rem',       // 16px
  fontWeight: 600,
  lineHeight: 1.5,
};

// Body text
export const TEXT_BODY_LG: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1rem',       // 16px
  fontWeight: 400,
  lineHeight: 1.6,
};

export const TEXT_BODY_MD: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.875rem',   // 14px
  fontWeight: 400,
  lineHeight: 1.5,
};

export const TEXT_BODY_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.75rem',    // 12px
  fontWeight: 400,
  lineHeight: 1.5,
};

// Labels (Uppercase, spaced - section headers)
export const TEXT_LABEL_LG: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.875rem',   // 14px
  fontWeight: 600,
  lineHeight: 1.5,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: COLORS.text.tertiary,
};

export const TEXT_LABEL_MD: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.75rem',    // 12px
  fontWeight: 600,
  lineHeight: 1.5,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: COLORS.text.tertiary,
};

export const TEXT_LABEL_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.6875rem',  // 11px
  fontWeight: 500,
  lineHeight: 1.4,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: COLORS.text.tertiary,
};

// Caption (Small metadata)
export const TEXT_CAPTION: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '0.6875rem',  // 11px
  fontWeight: 400,
  lineHeight: 1.4,
  color: COLORS.text.secondary,
};

// Numbers (Tabular figures for price alignment)
export const TEXT_NUMBER_XL: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '2rem',       // 32px
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_NUMBER_LG: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.5rem',     // 24px
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_NUMBER_MD: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.125rem',   // 18px
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const TEXT_NUMBER_SM: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1rem',       // 16px
  fontWeight: 500,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

// Percentage change (colored by profit/loss)
export const TEXT_CHANGE: SxProps<Theme> = {
  fontFamily: FONT_FAMILY,
  fontSize: '1.5rem',     // 24px
  fontWeight: 500,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

// Mono (for codes, symbols)
export const TEXT_MONO: SxProps<Theme> = {
  fontFamily: FONT_FAMILY_MONO,
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
};

// ============================================================================
// SPACING SCALE - 8px Grid System
// ============================================================================

/**
 * 8px grid system for consistent spacing
 * Base unit: 8px (0.5rem)
 */
export const SPACING = {
  0: 0,
  0.5: '0.125rem',  // 2px - micro spacing
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px - base unit
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px (2 units)
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px (3 units)
  8: '2rem',        // 32px (4 units)
  10: '2.5rem',     // 40px (5 units)
  12: '3rem',       // 48px (6 units)
  16: '4rem',       // 64px (8 units)
  20: '5rem',       // 80px (10 units)
  24: '6rem',       // 96px (12 units)
  32: '8rem',       // 128px (16 units)
} as const;

// Grid unit helper (multiply by 8)
export const grid = (units: number): string => `${units * 0.5}rem`;

// ============================================================================
// BORDER RADIUS - Rounded, Soft
// ============================================================================

/**
 * Border radius scale - Robinhood/iOS inspired
 */
export const RADIUS = {
  none: '0',
  xs: '0.25rem',    // 4px - subtle
  sm: '0.5rem',     // 8px - buttons
  md: '0.75rem',    // 12px - cards
  lg: '1rem',       // 16px - modals
  xl: '1.5rem',     // 24px - sheets
  '2xl': '2rem',    // 32px - large containers
  full: '9999px',   // Pills, avatars
} as const;

// ============================================================================
// SHADOWS - Minimal, Not Glass
// ============================================================================

/**
 * Minimal shadow system for dark themes
 * Focus on subtle depth, not glass morphism
 */
export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.5)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.5)',
  md: '0 4px 8px rgba(0, 0, 0, 0.5)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.5)',
  // Colored glows for emphasis
  glow: {
    primary: `0 0 24px rgba(139, 92, 246, 0.4)`,
    success: `0 0 24px rgba(0, 200, 5, 0.4)`,
    danger: `0 0 24px rgba(255, 59, 48, 0.4)`,
    secondary: `0 0 24px rgba(90, 200, 250, 0.4)`,
  },
  // Inset for pressed states
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
} as const;

// ============================================================================
// ANIMATION - Spring Physics
// ============================================================================

/**
 * Animation timing and easing
 * Spring-based for natural feel
 */
export const TIMING = {
  instant: '100ms',
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  slower: '500ms',
  // Specific animations
  priceFlash: '200ms',
  cardSlide: '300ms',
  sheetSpring: '400ms',
  sparklineDraw: '500ms',
} as const;

export const EASING = {
  // Standard curves
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Spring curves (natural, bouncy)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springGentle: 'cubic-bezier(0.22, 1, 0.36, 1)',
  springBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // Specific purposes
  slideOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  snap: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

export const TRANSITIONS = {
  color: `color ${TIMING.fast} ${EASING.default}`,
  background: `background-color ${TIMING.fast} ${EASING.default}`,
  border: `border-color ${TIMING.fast} ${EASING.default}`,
  transform: `transform ${TIMING.normal} ${EASING.spring}`,
  opacity: `opacity ${TIMING.normal} ${EASING.default}`,
  all: `all ${TIMING.normal} ${EASING.default}`,
  shadow: `box-shadow ${TIMING.normal} ${EASING.default}`,
  // Specific transitions
  priceFlash: `background-color ${TIMING.priceFlash} ${EASING.out}`,
  cardHover: `transform ${TIMING.cardSlide} ${EASING.springGentle}, box-shadow ${TIMING.cardSlide} ${EASING.default}`,
  buttonPress: `transform ${TIMING.fast} ${EASING.spring}, background-color ${TIMING.fast} ${EASING.default}`,
} as const;

// ============================================================================
// SURFACE STYLES - Cards & Containers (No Glass)
// ============================================================================

/**
 * Card surfaces - Clean, minimal, no glass morphism
 */
export const CARD_DEFAULT: SxProps<Theme> = {
  bgcolor: COLORS.background.tertiary,
  borderRadius: RADIUS.md,
  border: `1px solid ${COLORS.border.default}`,
  boxShadow: SHADOWS.none,
  transition: TRANSITIONS.all,
};

export const CARD_ELEVATED: SxProps<Theme> = {
  bgcolor: COLORS.background.tertiary,
  borderRadius: RADIUS.md,
  border: `1px solid ${COLORS.border.light}`,
  boxShadow: SHADOWS.sm,
  transition: TRANSITIONS.all,
};

export const CARD_INTERACTIVE: SxProps<Theme> = {
  ...CARD_DEFAULT,
  cursor: 'pointer',
  '&:hover': {
    bgcolor: COLORS.background.elevated,
    borderColor: COLORS.border.light,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    bgcolor: COLORS.background.tertiary,
  },
};

export const CARD_HIGHLIGHT: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.primary.main,
  bgcolor: COLORS.primary.subtle,
  boxShadow: SHADOWS.glow.primary,
};

export const CARD_SUCCESS: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.success.main,
  bgcolor: COLORS.success.bg,
};

export const CARD_DANGER: SxProps<Theme> = {
  ...CARD_DEFAULT,
  borderColor: COLORS.danger.main,
  bgcolor: COLORS.danger.bg,
};

// ============================================================================
// GRADIENTS - Dynamic Theming
// ============================================================================

/**
 * Gradient backgrounds for hero sections, dynamic P/L
 */
export const GRADIENTS = {
  // Profit/Loss dynamic backgrounds
  profit: 'linear-gradient(135deg, #00C805 0%, #00A504 100%)',
  loss: 'linear-gradient(135deg, #FF3B30 0%, #CC2F26 100%)',
  // Brand gradients
  primary: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
  secondary: 'linear-gradient(135deg, #0EA5E9 0%, #5AC8FA 100%)',
  // Subtle backgrounds
  darkFade: 'linear-gradient(180deg, #0D0D0D 0%, #000000 100%)',
  cardShine: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
  // Overlays
  bottomFade: 'linear-gradient(180deg, transparent 0%, #000000 100%)',
  topFade: 'linear-gradient(180deg, #000000 0%, transparent 100%)',
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

/**
 * Z-index scale for layering
 */
export const Z_INDEX = {
  base: 0,
  card: 10,
  sticky: 100,
  header: 200,
  dropdown: 1000,
  bottomNav: 1100,
  overlay: 1200,
  modal: 1300,
  sheet: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Mobile-first breakpoints
 */
export const BREAKPOINTS = {
  xs: 0,        // Mobile (default)
  sm: 428,      // Large phones (iPhone Pro Max)
  md: 768,      // Tablets
  lg: 1024,     // Small laptops
  xl: 1280,     // Desktops
  '2xl': 1536,  // Large screens
} as const;

// Touch target minimum (accessibility)
export const TOUCH_TARGET = {
  min: '44px',  // Minimum touch target
  comfortable: '48px',
  large: '56px',
};

// ============================================================================
// BUTTON STYLES - Buy (Green) / Sell (Red)
// ============================================================================

/**
 * Primary action button - Purple
 */
export const BUTTON_PRIMARY: SxProps<Theme> = {
  ...TEXT_HEADING_SM,
  bgcolor: COLORS.primary.main,
  color: '#FFFFFF',
  px: SPACING[6],
  py: SPACING[3],
  borderRadius: RADIUS.sm,
  border: 'none',
  boxShadow: SHADOWS.none,
  textTransform: 'none',
  fontWeight: 600,
  minHeight: TOUCH_TARGET.comfortable,
  transition: TRANSITIONS.buttonPress,
  '&:hover': {
    bgcolor: COLORS.primary.dark,
    boxShadow: SHADOWS.glow.primary,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    bgcolor: COLORS.background.elevated,
    color: COLORS.text.disabled,
  },
};

/**
 * Secondary button - Outlined
 */
export const BUTTON_SECONDARY: SxProps<Theme> = {
  ...TEXT_HEADING_SM,
  bgcolor: 'transparent',
  color: COLORS.text.primary,
  px: SPACING[6],
  py: SPACING[3],
  borderRadius: RADIUS.sm,
  border: `1px solid ${COLORS.border.light}`,
  textTransform: 'none',
  fontWeight: 500,
  minHeight: TOUCH_TARGET.comfortable,
  transition: TRANSITIONS.buttonPress,
  '&:hover': {
    bgcolor: COLORS.background.secondary,
    borderColor: COLORS.border.strong,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    borderColor: COLORS.border.default,
    color: COLORS.text.disabled,
  },
};

/**
 * Ghost button - Minimal
 */
export const BUTTON_GHOST: SxProps<Theme> = {
  ...TEXT_BODY_MD,
  bgcolor: 'transparent',
  color: COLORS.text.secondary,
  px: SPACING[4],
  py: SPACING[2],
  borderRadius: RADIUS.sm,
  border: 'none',
  textTransform: 'none',
  fontWeight: 500,
  minHeight: TOUCH_TARGET.min,
  transition: TRANSITIONS.buttonPress,
  '&:hover': {
    bgcolor: COLORS.background.secondary,
    color: COLORS.text.primary,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    color: COLORS.text.disabled,
  },
};

/**
 * BUY button - Robinhood Green
 */
export const BUTTON_BUY: SxProps<Theme> = {
  ...TEXT_HEADING_SM,
  bgcolor: COLORS.success.main,
  color: '#FFFFFF',
  px: SPACING[8],
  py: SPACING[4],
  borderRadius: RADIUS.sm,
  border: 'none',
  boxShadow: SHADOWS.none,
  textTransform: 'none',
  fontWeight: 700,
  minHeight: TOUCH_TARGET.large,
  transition: TRANSITIONS.buttonPress,
  '&:hover': {
    bgcolor: COLORS.success.dark,
    boxShadow: SHADOWS.glow.success,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    bgcolor: COLORS.background.elevated,
    color: COLORS.text.disabled,
  },
};

/**
 * SELL button - Vibrant Red
 */
export const BUTTON_SELL: SxProps<Theme> = {
  ...TEXT_HEADING_SM,
  bgcolor: COLORS.danger.main,
  color: '#FFFFFF',
  px: SPACING[8],
  py: SPACING[4],
  borderRadius: RADIUS.sm,
  border: 'none',
  boxShadow: SHADOWS.none,
  textTransform: 'none',
  fontWeight: 700,
  minHeight: TOUCH_TARGET.large,
  transition: TRANSITIONS.buttonPress,
  '&:hover': {
    bgcolor: COLORS.danger.dark,
    boxShadow: SHADOWS.glow.danger,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '&:disabled': {
    bgcolor: COLORS.background.elevated,
    color: COLORS.text.disabled,
  },
};

/**
 * Danger button (alias for SELL, destructive actions)
 */
export const BUTTON_DANGER = BUTTON_SELL;

// ============================================================================
// PRICE FLASH ANIMATIONS
// ============================================================================

/**
 * Price flash styles for real-time updates
 */
export const PRICE_FLASH = {
  profit: {
    animation: 'flashProfit 200ms ease-out',
    '@keyframes flashProfit': {
      '0%': { backgroundColor: 'rgba(0, 200, 5, 0.3)' },
      '100%': { backgroundColor: 'transparent' },
    },
  },
  loss: {
    animation: 'flashLoss 200ms ease-out',
    '@keyframes flashLoss': {
      '0%': { backgroundColor: 'rgba(255, 59, 48, 0.3)' },
      '100%': { backgroundColor: 'transparent' },
    },
  },
};

// ============================================================================
// COMPONENT HELPERS
// ============================================================================

/**
 * Helper to get profit/loss color
 */
export const getProfitLossColor = (value: number): string => {
  if (value > 0) return COLORS.success.main;
  if (value < 0) return COLORS.danger.main;
  return COLORS.text.secondary;
};

/**
 * Helper to get profit/loss background
 */
export const getProfitLossBg = (value: number): string => {
  if (value > 0) return COLORS.success.bg;
  if (value < 0) return COLORS.danger.bg;
  return 'transparent';
};

/**
 * Helper to format currency with color
 */
export const formatCurrencyStyle = (value: number): SxProps<Theme> => ({
  color: getProfitLossColor(value),
  fontVariantNumeric: 'tabular-nums',
});

// ============================================================================
// LEGACY COMPATIBILITY (Deprecated)
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
  lime: COLORS.success.main,
  pink: COLORS.danger.main,
  textPrimary: COLORS.text.primary,
  textSecondary: COLORS.text.secondary,
  textTertiary: COLORS.text.tertiary,
  error: COLORS.danger.main,
  borderDefault: COLORS.border.default,
  bgPrimary: COLORS.background.primary,
};

// Legacy exports for backwards compatibility
export const COLORS_EXTENDED = COLORS;
export const SECTION_HEADER = TEXT_HEADING_MD;
export const METRIC_LABEL = TEXT_LABEL_SM;
export const METRIC_VALUE = TEXT_NUMBER_MD;
export const CARD_PRIMARY = CARD_DEFAULT;
export const CARD_SECONDARY = CARD_ELEVATED;
export const TEXT_XS = TEXT_CAPTION;
export const TEXT_SM = TEXT_BODY_SM;
export const TEXT_MD = TEXT_BODY_MD;
