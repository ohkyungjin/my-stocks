import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(26, 31, 38, 0.5)'
            : 'rgba(243, 244, 246, 0.8)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color="text.disabled">
          © 2026 Korean Stock Trading AI System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.disabled">
            Version 1.0.0
          </Typography>
          <Typography variant="body2" color="text.disabled">
            •
          </Typography>
          <MuiLink
            component={Link}
            href="/docs"
            underline="hover"
            color="text.disabled"
            sx={{
              fontSize: '0.875rem',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            문서
          </MuiLink>
          <Typography variant="body2" color="text.disabled">
            •
          </Typography>
          <MuiLink
            component={Link}
            href="/support"
            underline="hover"
            color="text.disabled"
            sx={{
              fontSize: '0.875rem',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            지원
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
}
