'use client';

import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { COLORS, RADIUS, SPACING } from '@/lib/theme/styleConstants';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  /**
   * Input size variant
   */
  size?: 'small' | 'medium';
}

/**
 * FinFlow Dark Input Component
 *
 * Modern fintech text input with smooth focus transitions.
 * Wrapper around MUI TextField with FinFlow Dark styling.
 *
 * @example
 * ```tsx
 * <Input label="Username" placeholder="Enter username" />
 * <Input type="password" label="Password" />
 * <Input multiline rows={4} label="Notes" />
 * ```
 */
export const Input = forwardRef<HTMLDivElement, InputProps>(
  ({ size = 'medium', sx, InputProps: inputProps, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        size={size}
        sx={[
          {
            '& .MuiOutlinedInput-root': {
              fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              bgcolor: COLORS.background.secondary,
              borderRadius: RADIUS.md,
              color: COLORS.text.primary,
              transition: 'all 0.2s ease',
              '& fieldset': {
                borderColor: COLORS.border.default,
                transition: 'border-color 0.2s ease',
              },
              '&:hover fieldset': {
                borderColor: COLORS.border.strong,
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.primary.main,
                borderWidth: '2px',
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            },
            '& .MuiInputLabel-root': {
              fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: COLORS.text.secondary,
              '&.Mui-focused': {
                color: COLORS.primary.main,
              },
            },
            '& .MuiInputBase-input': {
              padding: size === 'small' ? `${SPACING[1]} ${SPACING[3]}` : `${SPACING[2]} ${SPACING[3]}`,
              '&::placeholder': {
                color: COLORS.text.tertiary,
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
              fontSize: '0.75rem',
              fontWeight: 400,
              marginLeft: 0,
              marginTop: SPACING[1],
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        InputProps={{
          ...inputProps,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
