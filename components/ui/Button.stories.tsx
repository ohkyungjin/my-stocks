import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

/**
 * Terminal Lux Button Component
 *
 * A versatile button component with multiple variants, loading states, and icon support.
 * Built on MUI Button with Terminal Lux design tokens.
 */
const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary button component for user actions. Supports 4 visual variants, loading states, and icon placement.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading spinner and disable button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button interaction',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button - High emphasis action (lime green)
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary button - Medium emphasis action (subtle border)
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Ghost button - Low emphasis action (transparent)
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Danger button - Destructive action (pink/red)
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

/**
 * Loading state - Shows spinner, disables interaction
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Submitting...',
  },
};

/**
 * Disabled state - Non-interactive button
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * With left icon - Icon before text
 */
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <AddIcon />,
    children: 'Add Item',
  },
};

/**
 * With right icon - Icon after text
 */
export const WithRightIcon: Story = {
  args: {
    variant: 'secondary',
    rightIcon: <SaveIcon />,
    children: 'Save',
  },
};

/**
 * Icon only - Just an icon, no text
 */
export const IconOnly: Story = {
  args: {
    variant: 'ghost',
    leftIcon: <DeleteIcon />,
    children: '',
    'aria-label': 'Delete',
  },
};

/**
 * Small size button
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Large size button
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

/**
 * All states comparison
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Button variant="primary">Normal</Button>
      <Button variant="primary" isLoading>Loading</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" leftIcon={<AddIcon />}>With Icon</Button>
    </div>
  ),
};

/**
 * Real-world example - Form actions
 */
export const FormActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary" leftIcon={<SaveIcon />}>
        Save Changes
      </Button>
    </div>
  ),
};

/**
 * Real-world example - Dangerous action with confirmation
 */
export const DangerousAction: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger" leftIcon={<DeleteIcon />}>
        Delete Account
      </Button>
    </div>
  ),
};
