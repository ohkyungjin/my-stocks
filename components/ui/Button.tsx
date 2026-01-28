'use client';

import { forwardRef } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, BUTTON_GHOST, BUTTON_DANGER, COLORS, SPACING } from '@/lib/theme/styleConstants';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  /**
   * Button style variant
   * - primary: Purple (#8B5CF6), high emphasis
   * - secondary: Outlined, medium emphasis
   * - ghost: Transparent minimal, low emphasis
   * - danger: Vibrant red (#FF3B30), destructive actions
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
 * FinFlow Dark Button Component
 *
 * Modern fintech button with minimal shadows and spring-based animations.
 * True black backgrounds with purple primary and red danger variants.
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
      ghost: BUTTON_GHOST,
      danger: BUTTON_DANGER,
    };

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || isLoading}
        sx={[
          variantStyles[variant],
          {
            minWidth: 'auto',
            '&:focus-visible': {
              outline: `2px solid ${COLORS.primary.main}`,
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
        {isLoading && <CircularProgress size={16} sx={{ mr: SPACING[2], color: 'inherit' }} />}
        {!isLoading && leftIcon && <span style={{ marginRight: SPACING[2], display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span style={{ marginLeft: SPACING[2], display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';
