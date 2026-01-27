import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Box } from '@mui/material';

/**
 * Terminal Lux Badge Component
 *
 * Status badge for displaying tags, status indicators, and metadata.
 * Uses semantic colors that meet WCAG AA accessibility standards.
 */
const meta = {
  title: 'UI Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Compact badge component for status indicators and tags. Supports 5 semantic variants and 2 sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: 'Semantic color variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Badge size',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      control: 'text',
      description: 'Badge text content',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default badge - Neutral gray
 */
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default',
  },
};

/**
 * Success badge - Green for positive states
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Active',
  },
};

/**
 * Warning badge - Amber for warnings
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Pending',
  },
};

/**
 * Error badge - Red/pink for errors
 */
export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Failed',
  },
};

/**
 * Info badge - Blue for informational
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'New',
  },
};

/**
 * Small size badge
 */
export const Small: Story = {
  args: {
    variant: 'success',
    size: 'sm',
    children: 'Active',
  },
};

/**
 * Medium size badge (default)
 */
export const Medium: Story = {
  args: {
    variant: 'success',
    size: 'md',
    children: 'Active',
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

/**
 * Size comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge variant="success" size="sm">Small</Badge>
      <Badge variant="success" size="md">Medium</Badge>
    </div>
  ),
};

/**
 * Real-world example - Order status
 */
export const OrderStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>Order #1234:</span>
        <Badge variant="success">Filled</Badge>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>Order #1235:</span>
        <Badge variant="warning">Pending</Badge>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>Order #1236:</span>
        <Badge variant="error">Cancelled</Badge>
      </Box>
    </div>
  ),
};

/**
 * Real-world example - Position status
 */
export const PositionStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>AAPL:</span>
        <Badge variant="success" size="sm">Long</Badge>
        <Badge variant="info" size="sm">+5.2%</Badge>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>TSLA:</span>
        <Badge variant="error" size="sm">Short</Badge>
        <Badge variant="warning" size="sm">-2.1%</Badge>
      </Box>
    </div>
  ),
};

/**
 * Real-world example - Feature tags
 */
export const FeatureTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="info" size="sm">Beta</Badge>
      <Badge variant="success" size="sm">Pro</Badge>
      <Badge variant="warning" size="sm">Limited</Badge>
      <Badge variant="default" size="sm">Free</Badge>
    </div>
  ),
};

/**
 * Real-world example - Market status
 */
export const MarketStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>Market:</span>
      <Badge variant="success">Open</Badge>
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'monospace' }}>
        09:30 - 16:00 EST
      </span>
    </div>
  ),
};

/**
 * Real-world example - System notifications
 */
export const SystemNotifications: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Badge variant="success" size="sm">✓</Badge>
        <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
          Order executed successfully
        </span>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Badge variant="warning" size="sm">!</Badge>
        <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
          Price target approaching
        </span>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Badge variant="error" size="sm">✕</Badge>
        <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
          Connection lost
        </span>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Badge variant="info" size="sm">i</Badge>
        <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}>
          New feature available
        </span>
      </Box>
    </div>
  ),
};

/**
 * Real-world example - Trading signals
 */
export const TradingSignals: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box>
        <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', marginBottom: '8px' }}>
          Strong Buy Signals:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="success" size="sm">AAPL</Badge>
          <Badge variant="success" size="sm">MSFT</Badge>
          <Badge variant="success" size="sm">GOOGL</Badge>
        </div>
      </Box>
      <Box>
        <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', marginBottom: '8px' }}>
          Watch List:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="warning" size="sm">TSLA</Badge>
          <Badge variant="warning" size="sm">NVDA</Badge>
        </div>
      </Box>
    </div>
  ),
};
