import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Box, Typography } from '@mui/material';
import { MONO_TEXT_SM, TERMINAL_COLORS } from '@/lib/theme/styleConstants';

/**
 * Terminal Lux Card Component
 *
 * Container component with glass morphism effects and multiple visual variants.
 * Perfect for grouping related content with consistent styling.
 */
const meta = {
  title: 'UI Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible container with glass morphism effects. Supports 4 variants and 4 padding sizes for different use cases.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'dark', 'light', 'highlight'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding size',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      control: false,
      description: 'Card content',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content for demonstrations
const SampleContent = () => (
  <Box>
    <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, color: TERMINAL_COLORS.lime, mb: 1 }}>
      Card Title
    </Typography>
    <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary }}>
      This is sample content inside a card component. Cards provide a container for related information.
    </Typography>
  </Box>
);

/**
 * Default card - Standard glass morphism
 */
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    children: <SampleContent />,
  },
};

/**
 * Dark variant - Darker glass effect for nested containers
 */
export const Dark: Story = {
  args: {
    variant: 'dark',
    padding: 'md',
    children: <SampleContent />,
  },
};

/**
 * Light variant - Lighter glass effect for emphasis
 */
export const Light: Story = {
  args: {
    variant: 'light',
    padding: 'md',
    children: <SampleContent />,
  },
};

/**
 * Highlight variant - Lime accent border for important content
 */
export const Highlight: Story = {
  args: {
    variant: 'highlight',
    padding: 'md',
    children: <SampleContent />,
  },
};

/**
 * No padding - Useful for custom layouts
 */
export const NoPadding: Story = {
  args: {
    variant: 'default',
    padding: 'none',
    children: (
      <Box sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700 }}>Header Section</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary }}>
            Content section with custom padding
          </Typography>
        </Box>
      </Box>
    ),
  },
};

/**
 * Small padding - Compact spacing
 */
export const SmallPadding: Story = {
  args: {
    variant: 'default',
    padding: 'sm',
    children: <SampleContent />,
  },
};

/**
 * Large padding - Spacious layout
 */
export const LargePadding: Story = {
  args: {
    variant: 'default',
    padding: 'lg',
    children: <SampleContent />,
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: '16px' }}>
      <Card variant="default" padding="md">
        <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 1 }}>Default</Typography>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.625rem' }}>
          Standard glass morphism
        </Typography>
      </Card>
      <Card variant="dark" padding="md">
        <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 1 }}>Dark</Typography>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.625rem' }}>
          Darker for nesting
        </Typography>
      </Card>
      <Card variant="light" padding="md">
        <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 1 }}>Light</Typography>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.625rem' }}>
          Lighter for emphasis
        </Typography>
      </Card>
      <Card variant="highlight" padding="md">
        <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 1, color: TERMINAL_COLORS.lime }}>
          Highlight
        </Typography>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.625rem' }}>
          With lime accent border
        </Typography>
      </Card>
    </div>
  ),
};

/**
 * Nested cards - Dark variant for nested containers
 */
export const NestedCards: Story = {
  render: () => (
    <Card variant="default" padding="lg" sx={{ width: 400 }}>
      <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, color: TERMINAL_COLORS.lime, mb: 2 }}>
        Outer Card
      </Typography>
      <Card variant="dark" padding="md">
        <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 1 }}>Nested Card</Typography>
        <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.625rem' }}>
          Dark variant works well for nested content
        </Typography>
      </Card>
    </Card>
  ),
};

/**
 * Real-world example - Stats card
 */
export const StatsCard: Story = {
  render: () => (
    <Card variant="default" padding="md" sx={{ width: 280 }}>
      <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.625rem', color: TERMINAL_COLORS.textTertiary, textTransform: 'uppercase', mb: 0.5 }}>
        Total Portfolio Value
      </Typography>
      <Typography sx={{ ...MONO_TEXT_SM, fontSize: '1.5rem', fontWeight: 700, color: TERMINAL_COLORS.textPrimary, mb: 1 }}>
        $127,543.21
      </Typography>
      <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.75rem', color: TERMINAL_COLORS.lime }}>
        +5.4% (+$6,543.21)
      </Typography>
    </Card>
  ),
};

/**
 * Real-world example - Alert card
 */
export const AlertCard: Story = {
  render: () => (
    <Card variant="highlight" padding="md" sx={{ width: 320 }}>
      <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, color: TERMINAL_COLORS.lime, mb: 1 }}>
        ⚠ Important Notice
      </Typography>
      <Typography sx={{ ...MONO_TEXT_SM, color: TERMINAL_COLORS.textSecondary, fontSize: '0.75rem' }}>
        Your account verification is pending. Please check your email to complete the process.
      </Typography>
    </Card>
  ),
};

/**
 * Real-world example - List item card
 */
export const ListItemCard: Story = {
  render: () => (
    <Card variant="default" padding="sm" sx={{ width: 360 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700, mb: 0.5 }}>AAPL</Typography>
          <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.625rem', color: TERMINAL_COLORS.textSecondary }}>
            Apple Inc.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ ...MONO_TEXT_SM, fontWeight: 700 }}>$182.45</Typography>
          <Typography sx={{ ...MONO_TEXT_SM, fontSize: '0.625rem', color: TERMINAL_COLORS.lime }}>
            +2.4%
          </Typography>
        </Box>
      </Box>
    </Card>
  ),
};
