'use client';

import { createTheme, PaletteMode, ThemeOptions } from '@mui/material/styles';
import { COLORS, RADIUS, SHADOWS, TIMING, EASING, TOUCH_TARGET } from './styleConstants';

// ============================================================================
// CUSTOM TYPE DECLARATIONS
// ============================================================================

declare module '@mui/material/styles' {
  interface Palette {
    agent: {
      financial: string;
      supply: string;
      news: string;
    };
    finflow: {
      profit: string;
      loss: string;
      neutral: string;
    };
  }
  interface PaletteOptions {
    agent?: {
      financial?: string;
      supply?: string;
      news?: string;
    };
    finflow?: {
      profit?: string;
      loss?: string;
      neutral?: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    buy: true;
    sell: true;
  }
}

// ============================================================================
// TYPOGRAPHY CONFIGURATION - FinFlow Dark
// ============================================================================

const typography: ThemeOptions['typography'] = {
  fontFamily: 'var(--font-inter), "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  // Hero text (72px for account balance)
  h1: {
    fontSize: '4.5rem',  // 72px
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
  },
  // Large display (48px for stock prices)
  h2: {
    fontSize: '3rem',    // 48px
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
  // Medium display (36px)
  h3: {
    fontSize: '2.25rem', // 36px
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
  },
  // Section headings (24px)
  h4: {
    fontSize: '1.5rem',  // 24px
    fontWeight: 700,
    lineHeight: 1.25,
  },
  // Card headings (20px)
  h5: {
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  // Small headings (18px)
  h6: {
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  // Body large (16px)
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  // Body regular (14px)
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  // Button text
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  // Caption (11px)
  caption: {
    fontSize: '0.6875rem',
    lineHeight: 1.4,
    fontWeight: 400,
  },
  // Overline (uppercase labels)
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

// ============================================================================
// SHAPE CONFIGURATION
// ============================================================================

const shape = {
  borderRadius: 12, // Base radius (12px = md)
};

// ============================================================================
// SHADOWS CONFIGURATION - Minimal for Dark Theme
// ============================================================================

const darkShadows = [
  'none',                                         // 0
  '0 1px 2px rgba(0, 0, 0, 0.5)',                // 1 - xs
  '0 2px 4px rgba(0, 0, 0, 0.5)',                // 2 - sm
  '0 4px 8px rgba(0, 0, 0, 0.5)',                // 3 - md
  '0 8px 16px rgba(0, 0, 0, 0.5)',               // 4 - lg
  '0 16px 32px rgba(0, 0, 0, 0.5)',              // 5 - xl
  '0 0 24px rgba(139, 92, 246, 0.4)',            // 6 - primary glow
  '0 0 24px rgba(0, 200, 5, 0.4)',               // 7 - success glow
  '0 0 24px rgba(255, 59, 48, 0.4)',             // 8 - danger glow
  'none', 'none', 'none', 'none', 'none', 'none',
  'none', 'none', 'none', 'none', 'none', 'none',
  'none', 'none', 'none', 'none',
] as any;

// ============================================================================
// THEME CREATION - FinFlow Dark
// ============================================================================

/**
 * Create FinFlow Dark theme
 * True black backgrounds, Robinhood-inspired colors
 *
 * @param mode - 'light' or 'dark' (dark is the primary mode)
 * @returns MUI Theme
 */
export const createAppTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      // Primary - Purple (Trust, Premium)
      primary: {
        main: COLORS.primary.main,       // #8B5CF6
        light: COLORS.primary.light,     // #A78BFA
        dark: COLORS.primary.dark,       // #7C3AED
        contrastText: '#FFFFFF',
      },
      // Secondary - Cyan/Blue
      secondary: {
        main: COLORS.secondary.main,     // #5AC8FA
        light: COLORS.secondary.light,   // #7DD3FC
        dark: COLORS.secondary.dark,     // #0EA5E9
        contrastText: '#000000',
      },
      // Success - Robinhood Green (Profit)
      success: {
        main: COLORS.success.main,       // #00C805
        light: COLORS.success.light,     // #32D74B
        dark: COLORS.success.dark,       // #00A504
        contrastText: '#FFFFFF',
      },
      // Error - Vibrant Red (Loss)
      error: {
        main: COLORS.danger.main,        // #FF3B30
        light: COLORS.danger.light,      // #FF6961
        dark: COLORS.danger.dark,        // #CC2F26
        contrastText: '#FFFFFF',
      },
      // Warning - Amber
      warning: {
        main: COLORS.warning.main,       // #FF9500
        light: COLORS.warning.light,     // #FFAC33
        dark: COLORS.warning.dark,       // #CC7700
        contrastText: '#000000',
      },
      // Info - iOS Blue
      info: {
        main: COLORS.info.main,          // #007AFF
        light: COLORS.info.light,        // #339AFF
        dark: COLORS.info.dark,          // #0062CC
        contrastText: '#FFFFFF',
      },
      // Backgrounds - True Black
      background: {
        default: isDark ? COLORS.background.pure : '#F9FAFB',     // #000000
        paper: isDark ? COLORS.background.tertiary : '#FFFFFF',   // #1A1A1A
      },
      // Text - High Contrast
      text: {
        primary: isDark ? COLORS.text.primary : '#1F2937',        // #FFFFFF
        secondary: isDark ? COLORS.text.secondary : '#6B7280',    // #8E8E93
        disabled: isDark ? COLORS.text.disabled : '#9CA3AF',      // #48484A
      },
      // Dividers
      divider: isDark ? COLORS.border.separator : 'rgba(0, 0, 0, 0.08)',
      // Custom agent colors
      agent: {
        financial: '#8B5CF6',  // Purple
        supply: '#5AC8FA',     // Cyan
        news: '#FF9500',       // Orange
      },
      // Custom finflow colors for trading
      finflow: {
        profit: COLORS.success.main,   // #00C805
        loss: COLORS.danger.main,      // #FF3B30
        neutral: COLORS.text.secondary, // #8E8E93
      },
    },
    typography,
    shape,
    shadows: darkShadows,
    // Transitions - Spring-based
    transitions: {
      easing: {
        easeInOut: EASING.inOut,
        easeOut: EASING.out,
        easeIn: EASING.in,
        sharp: EASING.snap,
      },
      duration: {
        shortest: 100,
        shorter: 150,
        short: 200,
        standard: 250,
        complex: 350,
        enteringScreen: 250,
        leavingScreen: 200,
      },
    },
    // Component Overrides - FinFlow Dark
    components: {
      // CSS Baseline
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? COLORS.background.pure : '#F9FAFB',
            scrollbarColor: isDark ? `${COLORS.text.tertiary} ${COLORS.background.secondary}` : '#D1D5DB #F3F4F6',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 4,
              backgroundColor: isDark ? COLORS.text.tertiary : '#D1D5DB',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDark ? COLORS.text.secondary : '#9CA3AF',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: isDark ? COLORS.background.secondary : '#F3F4F6',
            },
          },
        },
      },

      // Button - Buy/Sell focused
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: RADIUS.sm,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            minHeight: TOUCH_TARGET.comfortable,
            transition: `all ${TIMING.fast} ${EASING.spring}`,
            '&:active': {
              transform: 'scale(0.98)',
            },
          },
          sizeLarge: {
            padding: '16px 32px',
            fontSize: '1.125rem',
            minHeight: TOUCH_TARGET.large,
          },
          sizeSmall: {
            padding: '8px 16px',
            fontSize: '0.875rem',
            minHeight: TOUCH_TARGET.min,
          },
          // Contained Primary (Purple)
          containedPrimary: {
            backgroundColor: COLORS.primary.main,
            '&:hover': {
              backgroundColor: COLORS.primary.dark,
              boxShadow: SHADOWS.glow.primary,
            },
          },
          // Contained Success (Buy - Green)
          containedSuccess: {
            backgroundColor: COLORS.success.main,
            color: '#FFFFFF',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: COLORS.success.dark,
              boxShadow: SHADOWS.glow.success,
            },
          },
          // Contained Error (Sell - Red)
          containedError: {
            backgroundColor: COLORS.danger.main,
            color: '#FFFFFF',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: COLORS.danger.dark,
              boxShadow: SHADOWS.glow.danger,
            },
          },
          // Outlined
          outlined: {
            borderColor: COLORS.border.light,
            color: COLORS.text.primary,
            '&:hover': {
              backgroundColor: COLORS.background.secondary,
              borderColor: COLORS.border.strong,
            },
          },
          // Text (Ghost)
          text: {
            color: COLORS.text.secondary,
            '&:hover': {
              backgroundColor: COLORS.background.secondary,
              color: COLORS.text.primary,
            },
          },
        },
        variants: [
          // Custom Buy variant
          {
            props: { variant: 'buy' as const },
            style: {
              backgroundColor: COLORS.success.main,
              color: '#FFFFFF',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: COLORS.success.dark,
                boxShadow: SHADOWS.glow.success,
              },
              '&:disabled': {
                backgroundColor: COLORS.background.elevated,
                color: COLORS.text.disabled,
              },
            },
          },
          // Custom Sell variant
          {
            props: { variant: 'sell' as const },
            style: {
              backgroundColor: COLORS.danger.main,
              color: '#FFFFFF',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: COLORS.danger.dark,
                boxShadow: SHADOWS.glow.danger,
              },
              '&:disabled': {
                backgroundColor: COLORS.background.elevated,
                color: COLORS.text.disabled,
              },
            },
          },
        ],
      },

      // Card - Clean, minimal
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? COLORS.background.tertiary : '#FFFFFF',
            borderRadius: RADIUS.md,
            border: `1px solid ${isDark ? COLORS.border.default : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: 'none',
            transition: `all ${TIMING.normal} ${EASING.default}`,
          },
        },
      },

      // Paper - No glass
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? COLORS.background.tertiary : '#FFFFFF',
            borderRadius: RADIUS.md,
          },
          elevation0: {
            boxShadow: 'none',
          },
          elevation1: {
            boxShadow: SHADOWS.xs,
          },
          elevation2: {
            boxShadow: SHADOWS.sm,
          },
          elevation3: {
            boxShadow: SHADOWS.md,
          },
          elevation4: {
            boxShadow: SHADOWS.lg,
          },
        },
      },

      // Chip - Pills
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.full,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
          filled: {
            backgroundColor: isDark ? COLORS.background.elevated : '#F3F4F6',
          },
          outlined: {
            borderColor: COLORS.border.light,
          },
          // Profit chip
          colorSuccess: {
            backgroundColor: COLORS.success.bg,
            color: COLORS.success.main,
            borderColor: COLORS.success.main,
          },
          // Loss chip
          colorError: {
            backgroundColor: COLORS.danger.bg,
            color: COLORS.danger.main,
            borderColor: COLORS.danger.main,
          },
        },
      },

      // Input - Clean, focused
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: RADIUS.sm,
              backgroundColor: isDark ? COLORS.background.secondary : '#F9FAFB',
              '& fieldset': {
                borderColor: COLORS.border.default,
              },
              '&:hover fieldset': {
                borderColor: COLORS.border.light,
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },

      // Input Base
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: '1rem',
            '&.Mui-disabled': {
              color: COLORS.text.disabled,
            },
          },
          input: {
            '&::placeholder': {
              color: COLORS.text.tertiary,
              opacity: 1,
            },
          },
        },
      },

      // Switch - iOS style
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 52,
            height: 32,
            padding: 0,
          },
          switchBase: {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: COLORS.success.main,
                opacity: 1,
                border: 0,
              },
            },
          },
          thumb: {
            width: 28,
            height: 28,
            boxShadow: SHADOWS.sm,
          },
          track: {
            borderRadius: 16,
            backgroundColor: isDark ? COLORS.background.elevated : '#E5E7EB',
            opacity: 1,
          },
        },
      },

      // Slider
      MuiSlider: {
        styleOverrides: {
          root: {
            height: 4,
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
              '&:focus, &:hover, &.Mui-active': {
                boxShadow: SHADOWS.glow.primary,
              },
            },
          },
          track: {
            borderRadius: 2,
          },
          rail: {
            borderRadius: 2,
            backgroundColor: isDark ? COLORS.background.elevated : '#E5E7EB',
          },
        },
      },

      // Tabs - Bottom nav style
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 48,
          },
          indicator: {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: COLORS.primary.main,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 48,
            padding: '12px 16px',
            color: COLORS.text.secondary,
            '&.Mui-selected': {
              color: COLORS.primary.main,
              fontWeight: 600,
            },
          },
        },
      },

      // Bottom Navigation
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? COLORS.background.secondary : '#FFFFFF',
            borderTop: `1px solid ${COLORS.border.separator}`,
            height: 64,
          },
        },
      },

      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            color: COLORS.text.tertiary,
            minWidth: 64,
            padding: '8px 12px',
            '&.Mui-selected': {
              color: COLORS.primary.main,
            },
          },
          label: {
            fontSize: '0.6875rem',
            fontWeight: 500,
            '&.Mui-selected': {
              fontSize: '0.6875rem',
              fontWeight: 600,
            },
          },
        },
      },

      // Drawer - Bottom sheets
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? COLORS.background.sheet : '#FFFFFF',
            borderRadius: `${RADIUS.xl} ${RADIUS.xl} 0 0`,
          },
        },
      },

      // Dialog/Modal
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? COLORS.background.tertiary : '#FFFFFF',
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.xl,
          },
        },
      },

      // Skeleton - Loading shimmer
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? COLORS.background.secondary : '#F3F4F6',
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${isDark ? COLORS.background.elevated : '#E5E7EB'}, transparent)`,
            },
          },
        },
      },

      // Tooltip
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? COLORS.background.elevated : '#1F2937',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: RADIUS.sm,
            padding: '8px 12px',
          },
          arrow: {
            color: isDark ? COLORS.background.elevated : '#1F2937',
          },
        },
      },

      // Snackbar/Alert
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.md,
          },
          filledSuccess: {
            backgroundColor: COLORS.success.main,
          },
          filledError: {
            backgroundColor: COLORS.danger.main,
          },
          filledWarning: {
            backgroundColor: COLORS.warning.main,
          },
          filledInfo: {
            backgroundColor: COLORS.info.main,
          },
        },
      },

      // List
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.sm,
            '&:hover': {
              backgroundColor: isDark ? COLORS.background.secondary : '#F3F4F6',
            },
          },
        },
      },

      // Avatar
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: COLORS.primary.subtle,
            color: COLORS.primary.main,
            fontWeight: 600,
          },
        },
      },

      // Badge
      MuiBadge: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: COLORS.primary.main,
          },
          colorSuccess: {
            backgroundColor: COLORS.success.main,
          },
          colorError: {
            backgroundColor: COLORS.danger.main,
          },
        },
      },

      // Linear Progress
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: RADIUS.xs,
            backgroundColor: isDark ? COLORS.background.secondary : '#E5E7EB',
          },
          barColorPrimary: {
            backgroundColor: COLORS.primary.main,
          },
          barColorSecondary: {
            backgroundColor: COLORS.secondary.main,
          },
        },
      },

      // Circular Progress
      MuiCircularProgress: {
        styleOverrides: {
          colorPrimary: {
            color: COLORS.primary.main,
          },
          colorSecondary: {
            color: COLORS.secondary.main,
          },
        },
      },

      // Divider
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: COLORS.border.separator,
          },
        },
      },

      // Icon Button
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: COLORS.text.secondary,
            transition: `all ${TIMING.fast} ${EASING.default}`,
            '&:hover': {
              backgroundColor: COLORS.background.secondary,
              color: COLORS.text.primary,
            },
          },
        },
      },

      // Fab (Floating Action Button)
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: SHADOWS.lg,
            '&:hover': {
              boxShadow: SHADOWS.glow.primary,
            },
          },
          primary: {
            backgroundColor: COLORS.primary.main,
            '&:hover': {
              backgroundColor: COLORS.primary.dark,
            },
          },
        },
      },
    },
  });
};

// ============================================================================
// DEFAULT THEME EXPORT
// ============================================================================

// Default dark theme (FinFlow Dark is dark-mode first)
export const theme = createAppTheme('dark');

// ============================================================================
// CUSTOM COLORS EXPORT
// ============================================================================

export const customColors = {
  agent: {
    financial: '#8B5CF6',  // Purple
    supply: '#5AC8FA',     // Cyan
    news: '#FF9500',       // Orange
  },
  finflow: {
    profit: COLORS.success.main,   // #00C805
    loss: COLORS.danger.main,      // #FF3B30
    neutral: COLORS.text.secondary, // #8E8E93
  },
  // Legacy glass colors (no longer used, kept for compatibility)
  glass: {
    darkBg: COLORS.background.tertiary,
    lightBg: '#FFFFFF',
    darkBorder: COLORS.border.default,
    lightBorder: 'rgba(0, 0, 0, 0.08)',
  },
};
