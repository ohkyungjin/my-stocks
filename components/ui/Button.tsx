'use client';

import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, BUTTON_DANGER, TERMINAL_COLORS, RADIUS } from '@/lib/theme/styleConstants';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * Button style variant
   * - primary: Lime green, high emphasis
   * - secondary: Subtle with border, medium emphasis
   * - ghost: Transparent, low emphasis
   * - danger: Pink/red, destructive actions
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /**
   * Show loading spinner and disable button
   */
  isLoading?: boolean;
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Terminal Lux Button Component
 *
 * Wrapper around MUI Button with Terminal Lux design tokens.
 * Supports loading states, icons, and accessibility features.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>Submit</Button>
 * <Button variant="secondary" leftIcon={<Add />}>Add Item</Button>
 * <Button variant="danger" isLoading>Delete</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, leftIcon, rightIcon, children, disabled, sx, ...props }, ref) => {
    const variantStyles = {
      primary: BUTTON_PRIMARY,
      secondary: BUTTON_SECONDARY,
      ghost: {
        bgcolor: 'transparent',
        color: 'rgba(255,255,255,0.6)',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.05)',
          color: '#FFFFFF',
        },
      },
      danger: BUTTON_DANGER,
    };

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || isLoading}
        sx={[
          variantStyles[variant],
          {
            borderRadius: RADIUS.sm,
            minWidth: 'auto',
            transition: 'all 0.2s ease',
            '&:focus-visible': {
              outline: `2px solid ${TERMINAL_COLORS.lime}`,
              outlineOffset: '2px',
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {isLoading && <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />}
        {!isLoading && leftIcon && <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
