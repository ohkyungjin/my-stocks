import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Skeleton } from './Skeleton';
import { Box, Typography } from '@mui/material';
import { Card } from './Card';
import { MONO_TEXT_SM, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

/**
 * Terminal Lux Skeleton Component
 *
 * Loading placeholder component with shimmer animation.
 * Used to indicate content is loading while maintaining layout.
 */
const meta = {
  title: 'UI Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated loading placeholder that maintains layout while content loads. Supports text, rectangular, and circular variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular'],
      description: 'Shape variant',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    width: {
      control: 'text',
      description: 'Width (CSS value)',
    },
    height: {
      control: 'text',
      description: 'Height (CSS value)',
    },
    lines: {
      control: 'number',
      description: 'Number of text lines (text variant only)',
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Text skeleton - Single line
 */
export const Text: Story = {
  args: {
    variant: 'text',
    width: 200,
  },
};

/**
 * Multiple text lines
 */
export const MultipleLines: Story = {
  args: {
    variant: 'text',
    width: 300,
    lines: 3,
  },
};

/**
 * Rectangular skeleton - For images or blocks
 */
export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 120,
  },
};

/**
 * Circular skeleton - For avatars or icons
 */
export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

/**
 * Custom width - Full width
 */
export const FullWidth: Story = {
  args: {
    variant: 'text',
    width: '100%',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Custom height - Tall rectangle
 */
export const TallRectangle: Story = {
  args: {
    variant: 'rectangular',
    width: 300,
    height: 200,
  },
};

/**
 * Real-world example - Loading card
 */
export const LoadingCard: Story = {
  render: () => (
    <Card variant="default" padding="md" sx={{ width: 320 }}>
      <Skeleton variant="text" width="60%" />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="100%" lines={3} />
      </Box>
    </Card>
  ),
};

/**
 * Real-world example - Loading profile
 */
export const LoadingProfile: Story = {
  render: () => (
    <Card variant="default" padding="md" sx={{ width: 280 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </Box>
      </Box>
    </Card>
  ),
};

/**
 * Real-world example - Loading stats
 */
export const LoadingStats: Story = {
  render: () => (
    <Card variant="default" padding="md" sx={{ width: 280 }}>
      <Skeleton variant="text" width="40%" />
      <Box sx={{ mt: 1, mb: 1 }}>
        <Skeleton variant="text" width="60%" height={32} />
      </Box>
      <Skeleton variant="text" width="35%" />
    </Card>
  ),
};

/**
 * Real-world example - Loading list
 */
export const LoadingList: Story = {
  render: () => (
    <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} variant="default" padding="sm">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={50} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  ),
};

/**
 * Real-world example - Loading table
 */
export const LoadingTable: Story = {
  render: () => (
    <Card variant="default" padding="none" sx={{ width: 600 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="60%" />
        </Box>
      </Box>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ p: 2, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Box>
      ))}
    </Card>
  ),
};

/**
 * Real-world example - Loading dashboard
 */
export const LoadingDashboard: Story = {
  render: () => (
    <Box sx={{ width: 600, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      {/* Stat cards */}
      <Card variant="default" padding="md">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="40%" />
      </Card>
      <Card variant="default" padding="md">
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="40%" />
      </Card>

      {/* Chart */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Card variant="default" padding="md">
          <Skeleton variant="text" width="30%" />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </Card>
      </Box>

      {/* List items */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Card variant="default" padding="sm">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="25%" />
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  ),
};

/**
 * Before and after - Show loading vs loaded state
 */
export const BeforeAfter: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 4 }}>
      {/* Loading */}
      <Box>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, mb: 2 }}>
          Loading State:
        </Typography>
        <Card variant="default" padding="md" sx={{ width: 280 }}>
          <Skeleton variant="text" width="60%" />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Skeleton variant="text" width="100%" height={32} />
          </Box>
          <Skeleton variant="text" width="40%" />
        </Card>
      </Box>

      {/* Loaded */}
      <Box>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, mb: 2 }}>
          Loaded State:
        </Typography>
        <Card variant="default" padding="md" sx={{ width: 280 }}>
          <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.625rem', color: TERMINAL_COLORS.textTertiary, textTransform: 'uppercase' }}>
            Total Portfolio Value
          </Typography>
          <Typography sx={{ ...MONO_TEXT_SM, fontSize: '1.5rem', fontWeight: 700, color: TERMINAL_COLORS.textPrimary, my: 1 }}>
            $127,543.21
          </Typography>
          <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.75rem', color: TERMINAL_COLORS.lime }}>
            +5.4% (+$6,543.21)
          </Typography>
        </Card>
      </Box>
    </Box>
  ),
};
