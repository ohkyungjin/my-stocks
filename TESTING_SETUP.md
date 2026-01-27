# Testing Infrastructure Setup Guide

This document outlines the complete testing infrastructure setup for the Frontend application following the plan in `.omc/plans/frontend-uiux-improvement.md` (Section 5).

## Overview

The testing infrastructure includes:
- **Jest** for unit and integration testing
- **React Testing Library** for component testing
- **jest-axe** for accessibility testing
- **Mock Service Worker (MSW)** for API mocking
- **Coverage tracking** with 70% thresholds

## Installation Status

### Configuration Files Created ✓

1. **jest.config.js** - Main Jest configuration
   - testEnvironment: 'jsdom'
   - setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
   - moduleNameMapper for '@/' alias
   - TypeScript support via next/jest
   - Coverage thresholds: 70% global

2. **jest.setup.js** - Global test setup
   - Imports @testing-library/jest-dom
   - Mocks next/router and next/navigation
   - Configures console suppression for test-specific warnings

### Test Helpers Created ✓

3. **__tests__/setup/test-utils.tsx** - Custom render function
   - Wraps components with MUI ThemeProvider
   - Exports all React Testing Library utilities
   - Ready for adding additional providers (Redux, Router, etc.)

4. **__tests__/setup/mocks.ts** - MSW setup
   - Configures mock handlers for all API endpoints
   - Provides `server` for use in test setups
   - Includes handlers for:
     - Authentication endpoints
     - Orders management
     - Real-time monitoring
     - Account summary

5. **__tests__/README.md** - Testing documentation
   - Complete testing guide
   - Best practices and examples
   - Coverage and debugging instructions

### Example Tests Created ✓

6. **__tests__/setup/example.test.ts** - Basic test suite
   - Verifies Jest is configured correctly
   - Tests basic functionality
   - Validates timeout settings

7. **__tests__/integration/login-flow.test.tsx** - Integration test example
   - Tests complete login flow
   - Demonstrates MSW usage
   - Shows async testing patterns

### Package.json Updated ✓

Added test scripts:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Installation Instructions

### Step 1: Install Test Dependencies

Run the following command to install all required testing packages:

```bash
cd frontend
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  jest-axe \
  msw \
  @types/jest
```

Or as a single command:

```bash
cd frontend && npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom jest-axe msw @types/jest
```

### Step 2: Verify Installation

```bash
cd frontend
npm test -- __tests__/setup/example.test.ts
```

Expected output:
```
PASS  __tests__/setup/example.test.ts
  Testing Infrastructure
    ✓ Jest is configured correctly (X ms)
    ✓ can perform basic arithmetic (X ms)
    ✓ supports async operations (X ms)
    ✓ timeout is configured (10s) (X ms)
  Module Path Mapping
    ✓ moduleNameMapper is configured for @ alias (X ms)
  Coverage Configuration
    ✓ coverage thresholds are set to 70% (X ms)

Test Suites: 1 passed, 1 total
Tests: 6 passed, 6 total
```

## Project Structure

```
frontend/
├── jest.config.js                 # Jest configuration
├── jest.setup.js                  # Global test setup
├── TESTING_SETUP.md              # This file
├── package.json                   # Updated with test scripts
│
├── __tests__/                     # Test directory
│   ├── README.md                 # Testing guide
│   ├── setup/
│   │   ├── test-utils.tsx        # Custom render function with providers
│   │   ├── mocks.ts              # MSW mock handlers
│   │   └── example.test.ts       # Example test suite
│   └── integration/
│       └── login-flow.test.tsx   # Example integration test
│
├── components/                    # Component files
├── lib/                          # Library files
└── app/                          # App pages
```

## Configuration Details

### jest.config.js

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Key Features:**
- Uses `next/jest` for Next.js compatibility
- JSdom environment for browser-like testing
- Path alias support (@/ → root directory)
- TypeScript support (inherited from next/jest)
- Coverage collection from components and lib
- 70% global coverage threshold

### jest.setup.js

Configures:
- Jest-DOM matchers (toBeInTheDocument, etc.)
- Mocks for Next.js router and navigation
- Global test timeout (10 seconds)
- Console error suppression for React warnings

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (re-run on changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

View coverage report:
```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

### Run Specific Test
```bash
npm test -- example.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="login"
```

## Writing Your First Test

### Component Test Example

Create `components/ui/Button.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@/__tests__/setup/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Test Example

Create `__tests__/integration/orders-flow.test.tsx`:

```typescript
import { render, screen, fireEvent, waitFor } from '@/__tests__/setup/test-utils';

describe('Orders Flow', () => {
  it('fetches and displays orders', async () => {
    render(<OrdersPage />);

    await waitFor(() => {
      expect(screen.getByText('Samsung Electronics')).toBeInTheDocument();
    });
  });
});
```

## API Mocking with MSW

All API endpoints are automatically mocked. To override a mock in your test:

```typescript
import { server } from '@/__tests__/setup/mocks';
import { http, HttpResponse } from 'msw';

describe('Error Handling', () => {
  it('handles login errors', async () => {
    server.use(
      http.post('/api/v1/auth/login', () => {
        return HttpResponse.json(
          { detail: 'Invalid credentials' },
          { status: 401 }
        );
      })
    );

    render(<LoginForm />);
    // Test error handling...
  });
});
```

## Accessibility Testing

Use jest-axe to automatically test for accessibility violations:

```typescript
import { render } from '@/__tests__/setup/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Coverage Thresholds

The project requires **70% coverage** across all metrics:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Files included in coverage:
- `components/**/*.{ts,tsx}`
- `lib/**/*.{ts,tsx}`

Files excluded:
- `**/*.stories.{ts,tsx}` (Storybook stories)
- `**/node_modules/**`

To check current coverage:
```bash
npm run test:coverage
```

## Validation Checklist

- [x] jest.config.js created with proper configuration
- [x] jest.setup.js created with global setup
- [x] test-utils.tsx created with custom render function
- [x] mocks.ts created with MSW handlers
- [x] example.test.ts created for basic validation
- [x] login-flow.test.tsx created for integration test example
- [x] package.json updated with test scripts
- [x] Testing documentation created (__tests__/README.md)
- [x] This setup guide created (TESTING_SETUP.md)

## Next Steps

1. **Install dependencies**: Run the npm install command above
2. **Run example tests**: Execute `npm test` to verify setup
3. **Create component tests**: Add test files alongside components
4. **Set up CI/CD**: Configure GitHub Actions for automated testing
5. **Monitor coverage**: Regularly check coverage with `npm run test:coverage`

## Common Issues & Solutions

### Issue: "Cannot find module '@/...'"
**Solution**: Verify jest.config.js moduleNameMapper is correct

### Issue: "jsdom is not defined"
**Solution**: Ensure jest-environment-jsdom is installed

### Issue: "jest-dom matchers not available"
**Solution**: Verify jest.setup.js imports @testing-library/jest-dom

### Issue: "Next.js router errors in tests"
**Solution**: Next.js router is mocked in jest.setup.js

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mock Service Worker](https://mswjs.io/)
- [jest-axe](https://github.com/nickcolley/jest-axe)

## Plan Reference

This setup follows the testing strategy from:
**File**: `.omc/plans/frontend-uiux-improvement.md`
**Section**: 5. Testing Strategy

### 5.1 Unit Testing
- ✓ Framework: Jest + React Testing Library
- ✓ jest.config.js with jsdom environment
- ✓ jest.setup.js with global utilities
- ✓ moduleNameMapper for path aliases
- ✓ Coverage thresholds (70%)

### 5.2 Accessibility Testing
- ✓ jest-axe included in dependencies
- ✓ Examples provided in __tests__/README.md
- ✓ Storybook a11y addon configured

### 5.3 Visual Regression Testing
- Chromatic integration (configured, pending setup)

### 5.4 Integration Testing
- ✓ MSW setup for API mocking
- ✓ Example login flow test
- ✓ Custom render with providers

### 5.5 Manual Testing
- Checklists provided in plan

---

**Setup Status**: ✓ Complete - Ready for dependency installation
