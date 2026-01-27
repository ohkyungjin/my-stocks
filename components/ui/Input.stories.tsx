import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';

/**
 * Terminal Lux Input Component
 *
 * Styled text input with Terminal Lux theming.
 * Built on MUI TextField with custom focus states and styling.
 */
const meta = {
  title: 'UI Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Text input field with Terminal Lux styling. Supports labels, placeholders, helper text, and all standard HTML input types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Input size',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper or error text',
    },
    required: {
      control: 'boolean',
      description: 'Mark as required field',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic text input
 */
export const Basic: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
  },
};

/**
 * With placeholder only
 */
export const PlaceholderOnly: Story = {
  args: {
    placeholder: 'Search...',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    helperText: 'We\'ll never share your email',
    type: 'email',
  },
};

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    required: true,
    helperText: 'Password is required',
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Username',
    value: 'ab',
    error: true,
    helperText: 'Username must be at least 3 characters',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Account Number',
    value: '12345678',
    disabled: true,
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    label: 'Symbol',
    placeholder: 'AAPL',
    size: 'small',
  },
};

/**
 * Medium size (default)
 */
export const Medium: Story = {
  args: {
    label: 'Company Name',
    placeholder: 'Apple Inc.',
    size: 'medium',
  },
};

/**
 * Password input
 */
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
};

/**
 * Email input
 */
export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

/**
 * Number input
 */
export const Number: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '100',
  },
};

/**
 * Multiline input (textarea)
 */
export const Multiline: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Enter your notes here...',
    multiline: true,
    rows: 4,
  },
};

/**
 * Full width input
 */
export const FullWidth: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    fullWidth: true,
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
 * Real-world example - Login form
 */
export const LoginForm: Story = {
  render: () => (
    <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        fullWidth
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        fullWidth
      />
    </Box>
  ),
};

/**
 * Real-world example - Search with icon
 */
export const SearchWithIcon: Story = {
  render: () => (
    <Input
      placeholder="Search stocks..."
      InputProps={{
        startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.4)' }} />,
      }}
      sx={{ width: 320 }}
    />
  ),
};

/**
 * Real-world example - Password toggle
 */
export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        InputProps={{
          endAdornment: (
            <Box
              onClick={() => setShowPassword(!showPassword)}
              sx={{ cursor: 'pointer', display: 'flex', color: 'rgba(255,255,255,0.6)' }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Box>
          ),
        }}
        sx={{ width: 320 }}
      />
    );
  },
};

/**
 * Real-world example - Order form
 */
export const OrderForm: Story = {
  render: () => (
    <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input
        label="Symbol"
        placeholder="AAPL"
        helperText="Enter stock ticker symbol"
        fullWidth
        size="small"
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Input
          label="Quantity"
          type="number"
          placeholder="100"
          size="small"
        />
        <Input
          label="Price"
          type="number"
          placeholder="180.50"
          size="small"
        />
      </Box>
      <Input
        label="Notes (Optional)"
        placeholder="Add notes..."
        multiline
        rows={2}
        fullWidth
      />
    </Box>
  ),
};

/**
 * Real-world example - Account settings
 */
export const AccountSettings: Story = {
  render: () => (
    <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Input
        label="Display Name"
        defaultValue="John Doe"
        fullWidth
      />
      <Input
        label="Email"
        type="email"
        defaultValue="john@example.com"
        helperText="Email is used for notifications"
        fullWidth
      />
      <Input
        label="Account Number"
        value="12345678-01"
        disabled
        helperText="Contact support to change account number"
        fullWidth
      />
    </Box>
  ),
};

/**
 * Real-world example - Validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Input
        label="Valid Username"
        value="johndoe"
        helperText="Username is available"
        fullWidth
      />
      <Input
        label="Invalid Email"
        value="invalid.email"
        error
        helperText="Please enter a valid email address"
        fullWidth
      />
      <Input
        label="Required Field"
        error
        helperText="This field is required"
        required
        fullWidth
      />
    </Box>
  ),
};

/**
 * Size comparison
 */
export const AllSizes: Story = {
  render: () => (
    <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input
        label="Small Input"
        placeholder="Size: small"
        size="small"
        fullWidth
      />
      <Input
        label="Medium Input"
        placeholder="Size: medium"
        size="medium"
        fullWidth
      />
    </Box>
  ),
};

/**
 * Type variants
 */
export const AllTypes: Story = {
  render: () => (
    <Box sx={{ width: 320, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Input label="Text" type="text" placeholder="Text input" fullWidth />
      <Input label="Email" type="email" placeholder="email@example.com" fullWidth />
      <Input label="Password" type="password" placeholder="••••••••" fullWidth />
      <Input label="Number" type="number" placeholder="123" fullWidth />
      <Input label="Tel" type="tel" placeholder="+1 (555) 123-4567" fullWidth />
      <Input label="URL" type="url" placeholder="https://example.com" fullWidth />
    </Box>
  ),
};
