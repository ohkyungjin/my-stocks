# Testing Infrastructure

This directory contains the testing setup and tests for the Frontend application.

## Structure

```
__tests__/
├── setup/
│   ├── test-utils.tsx       # Custom render function with providers
│   ├── mocks.ts             # MSW mock handlers for API endpoints
│   └── example.test.ts      # Example test suite
└── integration/
    └── login-flow.test.tsx  # Integration test for login flow
```

## Test Scripts

Run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Configuration Files

### jest.config.js

Main Jest configuration file in the root `frontend/` directory.

**Key Settings:**
- `testEnvironment`: `jsdom` - Tests run in a browser-like environment
- `setupFilesAfterEnv`: Runs `jest.setup.js` before each test suite
- `moduleNameMapper`: Maps `@/` alias to the root directory
- `collectCoverageFrom`: Collects coverage from components and lib
- `coverageThreshold`: Requires 70% coverage for branches, functions, lines, and statements

### jest.setup.js

Runs before each test suite to configure the test environment.

**Includes:**
- Jest-DOM matchers for assertions
- Mocks for `next/router` and `next/navigation`
- Global test utilities

## Test Utilities

### Custom Render Function

Use the custom `render` function from `setup/test-utils.tsx` instead of the standard React Testing Library render:

```typescript
import { render, screen } from '@/__tests__/setup/test-utils';

// Components will be automatically wrapped with MUI ThemeProvider
render(<MyComponent />);
```

## Mock Service Worker (MSW)

All API endpoints are mocked using MSW for consistent test behavior.

**Predefined Mock Handlers:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `GET /api/v1/orders`
- `GET /api/realtime/monitoring/status`
- `POST /api/realtime/monitoring/start`
- `POST /api/realtime/monitoring/stop`
- `GET /api/realtime/account/summary`

**Override Handlers in Tests:**

```typescript
import { server } from '@/__tests__/setup/mocks';
import { http, HttpResponse } from 'msw';

it('handles error response', () => {
  server.use(
    http.post('/api/v1/auth/login', () => {
      return HttpResponse.json(
        { detail: 'Invalid credentials' },
        { status: 401 }
      );
    })
  );

  // Test your error handling...
});
```

## Writing Tests

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@/__tests__/setup/test-utils';
import { MyButton } from '@/components/ui/Button';

describe('MyButton', () => {
  it('renders with children', () => {
    render(<MyButton>Click me</MyButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyButton onClick={handleClick}>Click</MyButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Test Example

```typescript
import { render, screen, fireEvent, waitFor } from '@/__tests__/setup/test-utils';

describe('Login Flow', () => {
  it('allows user to login successfully', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.getItem('auth-token')).toBeDefined();
    });
  });
});
```

## Testing Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test user behavior**: Focus on what users do, not implementation details
3. **Use waitFor for async**: Wait for async operations with `waitFor`
4. **Keep tests isolated**: Use `afterEach` to clean up state
5. **Mock external APIs**: Use MSW for API calls
6. **Use custom render**: Always use the custom render function that includes providers

## Coverage Reports

After running `npm run test:coverage`, a coverage report is generated in `coverage/` directory.

View the HTML report:
```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

## Accessibility Testing

Accessibility tests use `jest-axe` to automatically detect violations:

```typescript
import { render } from '@/__tests__/setup/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MyButton } from '@/components/ui/Button';

expect.extend(toHaveNoViolations);

describe('MyButton Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyButton>Accessible</MyButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Debugging Tests

### Run a single test
```bash
npm test -- example.test.ts
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="login"
```

### Run in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Mock Service Worker](https://mswjs.io/)
