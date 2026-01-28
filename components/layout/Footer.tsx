import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { COLORS, SPACING, TEXT_BODY_SM, TRANSITIONS } from '@/lib/theme/styleConstants';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: SPACING[4],
        px: SPACING[6],
        borderTop: `1px solid ${COLORS.border.separator}`,
        backgroundColor: COLORS.background.secondary,
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
        <Typography variant="body2" sx={{ ...TEXT_BODY_SM, color: COLORS.text.disabled }}>
          © 2026 Korean Stock Trading AI System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING[4] }}>
          <Typography variant="body2" sx={{ ...TEXT_BODY_SM, color: COLORS.text.disabled }}>
            Version 1.0.0
          </Typography>
          <Typography variant="body2" sx={{ ...TEXT_BODY_SM, color: COLORS.text.disabled }}>
            •
          </Typography>
          <MuiLink
            component={Link}
            href="/docs"
            underline="hover"
            sx={{
              ...TEXT_BODY_SM,
              color: COLORS.text.disabled,
              transition: TRANSITIONS.color,
              '&:hover': {
                color: COLORS.primary.main,
              },
            }}
          >
            문서
          </MuiLink>
          <Typography variant="body2" sx={{ ...TEXT_BODY_SM, color: COLORS.text.disabled }}>
            •
          </Typography>
          <MuiLink
            component={Link}
            href="/support"
            underline="hover"
            sx={{
              ...TEXT_BODY_SM,
              color: COLORS.text.disabled,
              transition: TRANSITIONS.color,
              '&:hover': {
                color: COLORS.primary.main,
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
