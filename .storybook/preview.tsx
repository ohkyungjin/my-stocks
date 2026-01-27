import type { Preview } from '@storybook/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../lib/theme/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{
          padding: '24px',
          backgroundColor: '#000',
          minHeight: '100vh',
        }}>
          <Story />
        </div>
      </MuiThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'terminal-dark',
      values: [
        { name: 'terminal-dark', value: '#000000' },
        { name: 'terminal-secondary', value: '#0A0A0C' },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
