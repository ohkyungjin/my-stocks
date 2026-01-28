'use client';

import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { COLORS, RADIUS, SPACING, SHADOWS, TRANSITIONS } from '@/lib/theme/styleConstants';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  /**
   * Input size variant
   */
  size?: 'small' | 'medium';
}

/**
 * FinFlow Dark Input Component
 *
 * Modern fintech text input with purple focus ring and smooth transitions.
 * True black backgrounds with subtle borders.
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
              borderRadius: RADIUS.sm,
              color: COLORS.text.primary,
              transition: TRANSITIONS.all,
              '& fieldset': {
                borderColor: COLORS.border.default,
                transition: TRANSITIONS.border,
              },
              '&:hover fieldset': {
                borderColor: COLORS.border.light,
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.primary.main,
                borderWidth: '2px',
                boxShadow: `0 0 0 3px ${COLORS.primary.subtle}`,
              },
              '&.Mui-error fieldset': {
                borderColor: COLORS.danger.main,
              },
              '&.Mui-error.Mui-focused fieldset': {
                borderColor: COLORS.danger.main,
                boxShadow: `0 0 0 3px ${COLORS.danger.subtle}`,
              },
              '&.Mui-disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
                bgcolor: COLORS.background.primary,
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
              '&.Mui-error': {
                color: COLORS.danger.main,
              },
            },
            '& .MuiInputBase-input': {
              padding: size === 'small' ? `${SPACING[2]} ${SPACING[3]}` : `${SPACING[3]} ${SPACING[4]}`,
              '&::placeholder': {
                color: COLORS.text.tertiary,
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              fontFamily: 'var(--font-inter), "Pretendard Variable", sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 400,
              marginLeft: 0,
              marginTop: SPACING[1],
              color: COLORS.text.secondary,
              '&.Mui-error': {
                color: COLORS.danger.main,
              },
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
