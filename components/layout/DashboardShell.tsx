'use client';

import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { COLORS, SPACING, TRANSITIONS } from '@/lib/theme/styleConstants';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const DRAWER_WIDTH = 256;

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      backgroundColor: COLORS.background.pure,
      overflow: 'hidden'
    }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden',
          width: { xs: '100%', md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { xs: 0, md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          transition: TRANSITIONS.all,
        }}
      >
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Page Content - Scrollable */}
        <Box
          id="main-content"
          sx={{
            flexGrow: 1,
            p: SPACING[6],
            overflow: 'auto',
            backgroundColor: COLORS.background.pure,
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}
