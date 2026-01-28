'use client';

import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { COLORS, SPACING, RADIUS } from '@/lib/theme/styleConstants';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = '종목명 또는 코드 검색...' }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: COLORS.text.tertiary, fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => onChange('')}
              sx={{
                color: COLORS.text.tertiary,
                '&:hover': {
                  color: COLORS.text.secondary,
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: COLORS.background.secondary,
          borderRadius: `${RADIUS.md}px`,
          fontSize: '14px',
          '& fieldset': {
            borderColor: COLORS.border.default,
          },
          '&:hover fieldset': {
            borderColor: COLORS.border.light,
          },
          '&.Mui-focused fieldset': {
            borderColor: COLORS.primary.main,
            borderWidth: '2px',
          },
        },
        '& .MuiOutlinedInput-input': {
          py: SPACING[3],
          color: COLORS.text.primary,
          '&::placeholder': {
            color: COLORS.text.tertiary,
            opacity: 1,
          },
        },
      }}
    />
  );
}
