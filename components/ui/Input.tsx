'use client';

import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { INPUT_DEFAULT, MONO_TEXT_SM, TERMINAL_COLORS, RADIUS, SPACING } from '@/lib/theme/styleConstants';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  /**
   * Input size variant
   */
  size?: 'small' | 'medium';
}

/**
 * Terminal Lux Input Component
 *
 * Styled text input with Terminal Lux theme.
 * Wrapper around MUI TextField with consistent styling.
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
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              bgcolor: 'rgba(255,255,255,0.03)',
              borderRadius: RADIUS.sm,
              color: TERMINAL_COLORS.textPrimary,
              '& fieldset': {
                borderColor: TERMINAL_COLORS.borderDefault,
              },
              '&:hover fieldset': {
                borderColor: TERMINAL_COLORS.borderStrong,
              },
              '&.Mui-focused fieldset': {
                borderColor: TERMINAL_COLORS.lime,
                borderWidth: '1px',
              },
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            },
            '& .MuiInputLabel-root': {
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              color: TERMINAL_COLORS.textSecondary,
              '&.Mui-focused': {
                color: TERMINAL_COLORS.lime,
              },
            },
            '& .MuiInputBase-input': {
              padding: size === 'small' ? `${SPACING[1.5]} ${SPACING[3]}` : `${SPACING[2]} ${SPACING[3]}`,
              '&::placeholder': {
                color: TERMINAL_COLORS.textTertiary,
                opacity: 1,
              },
            },
            '& .MuiFormHelperText-root': {
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
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
