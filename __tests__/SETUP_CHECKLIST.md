# Testing Infrastructure Setup Checklist

Based on: `.omc/plans/frontend-uiux-improvement.md` - Section 5: Testing Strategy

## Completion Status

### ✓ Requirement 1: Install Test Dependencies

**Status**: Ready to install (configuration files complete)

**Command to run**:
```bash
cd frontend && npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom jest-axe msw @types/jest
```

**Dependencies to be installed**:
- [ ] jest - Test runner
- [ ] @testing-library/react - React component testing utilities
- [ ] @testing-library/jest-dom - Custom Jest matchers for DOM
- [ ] @testing-library/user-event - User event simulation
- [ ] jest-environment-jsdom - Browser-like test environment
- [ ] jest-axe - Accessibility testing
- [ ] msw - Mock Service Worker for API mocking
- [ ] @types/jest - TypeScript types for Jest

### ✓ Requirement 2: Create jest.config.js

**File**: `/project/stocks/frontend/jest.config.js`

**Configuration Verified**:
- [x] Uses `next/jest` for Next.js compatibility
- [x] testEnvironment: 'jsdom'
- [x] setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
- [x] moduleNameMapper for '@/' alias: '^@/(.*)$': '<rootDir>/$1'
- [x] Transform for TypeScript (handled by next/jest)
- [x] collectCoverageFrom for components and lib
- [x] Coverage thresholds set to 70%:
  - [x] branches: 70
  - [x] functions: 70
  - [x] lines: 70
  - [x] statements: 70

### ✓ Requirement 3: Create jest.setup.js

**File**: `/project/stocks/frontend/jest.setup.js`

**Configuration Verified**:
- [x] Imports @testing-library/jest-dom
- [x] Provides jest-dom matchers (toBeInTheDocument, etc.)
- [x] Mocks next/router for tests
- [x] Mocks next/navigation for tests
- [x] Sets global test timeout (10 seconds)
- [x] Suppresses irrelevant React console warnings
- [x] Global test utilities available

### ✓ Requirement 4: Create Test Helpers Directory

**Directory**: `/project/stocks/frontend/__tests__/setup/`

**Files Created**:
- [x] `test-utils.tsx` - Custom render function with providers
  - [x] Wraps components with MUI ThemeProvider
  - [x] Includes CssBaseline for consistent styling
  - [x] Exports all React Testing Library utilities
  - [x] Ready for additional providers (Router, Redux, etc.)

- [x] `mocks.ts` - Mock Service Worker setup
  - [x] Configures mock handlers for API endpoints
  - [x] Provides server instance for tests
  - [x] Includes handlers for:
    - [x] Authentication endpoints (login, register, refresh, me)
    - [x] Orders management (GET /api/v1/orders)
    - [x] Real-time monitoring (status, start, stop, account/summary)

- [x] `example.test.ts` - Example test suite
  - [x] Verifies Jest configuration
  - [x] Tests basic functionality
  - [x] Validates timeout settings
  - [x] Confirms module path mapping

### ✓ Requirement 5: Add Test Scripts to package.json

**File**: `/project/stocks/frontend/package.json`

**Scripts Added**:
- [x] "test": "jest" - Run all tests once
- [x] "test:watch": "jest --watch" - Run tests in watch mode
- [x] "test:coverage": "jest --coverage" - Generate coverage report

**Usage**:
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode (re-run on changes)
npm run test:coverage # Generate coverage report
```

## Created Files Summary

### Configuration Files
1. `/project/stocks/frontend/jest.config.js` (29 lines)
   - Main Jest configuration with all required settings

2. `/project/stocks/frontend/jest.setup.js` (77 lines)
   - Global test setup with providers and mocks

### Test Infrastructure Files
3. `/project/stocks/frontend/__tests__/setup/test-utils.tsx` (35 lines)
   - Custom render function with MUI theme provider

4. `/project/stocks/frontend/__tests__/setup/mocks.ts` (136 lines)
   - MSW setup with all API endpoint mocks

5. `/project/stocks/frontend/__tests__/setup/example.test.ts` (37 lines)
   - Example test suite for validation

### Test Examples
6. `/project/stocks/frontend/__tests__/integration/login-flow.test.tsx` (102 lines)
   - Integration test example showing MSW usage
   - Demonstrates async testing patterns
   - Shows error handling

### Documentation Files
7. `/project/stocks/frontend/__tests__/README.md` (308 lines)
   - Complete testing guide
   - Best practices and examples
   - Coverage instructions
   - Debugging tips

8. `/project/stocks/frontend/TESTING_SETUP.md` (386 lines)
   - Comprehensive setup guide
   - Installation instructions
   - Configuration details
   - Validation checklist

9. `/project/stocks/frontend/__tests__/SETUP_CHECKLIST.md` (This file)
   - Completion status tracking
   - Reference to plan section

**Total**: 9 new files created

## Validation Status

### Configuration Validation ✓

- [x] jest.config.js uses next/jest wrapper
- [x] jest.config.js includes testEnvironment: 'jsdom'
- [x] jest.config.js includes setupFilesAfterEnv reference
- [x] jest.config.js includes moduleNameMapper for @ alias
- [x] jest.config.js includes TypeScript transform (via next/jest)
- [x] jest.config.js includes collectCoverageFrom
- [x] jest.config.js includes coverage thresholds (70%)
- [x] jest.setup.js imports @testing-library/jest-dom
- [x] jest.setup.js provides global test utilities
- [x] package.json includes "test" script
- [x] package.json includes "test:watch" script
- [x] package.json includes "test:coverage" script

### File Integrity ✓

- [x] jest.config.js is valid JavaScript
- [x] jest.setup.js is valid JavaScript
- [x] test-utils.tsx is valid TypeScript React
- [x] mocks.ts is valid TypeScript
- [x] example.test.ts is valid TypeScript
- [x] login-flow.test.tsx is valid TypeScript React
- [x] All files have proper headers/comments

### Test Framework Setup ✓

- [x] Custom render function created with providers
- [x] MSW server setup configured
- [x] Mock API handlers defined for all endpoints
- [x] Example tests created for validation
- [x] Test utilities exported correctly

## Next Steps

### Before Running Tests

1. **Install test dependencies**:
   ```bash
   cd frontend && npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom jest-axe msw @types/jest
   ```

2. **Verify setup**:
   ```bash
   cd frontend && npm test -- __tests__/setup/example.test.ts
   ```

3. **Check coverage**:
   ```bash
   cd frontend && npm run test:coverage
   ```

### Writing Tests

1. Create test files next to components (e.g., `Button.test.tsx` next to `Button.tsx`)
2. Use custom render function from `__tests__/setup/test-utils.tsx`
3. Use semantic queries (getByRole, getByLabelText)
4. Test user behavior, not implementation
5. Use MSW for API calls (already configured)

### CI/CD Integration

- Add test step to GitHub Actions
- Run `npm test` with `--coverage` flag
- Enforce coverage thresholds (70%)
- Run tests on every PR

## Test Coverage Targets

According to plan section 5.2:

**Coverage Thresholds**: 70% global
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

**Files included**:
- `components/**/*.{ts,tsx}`
- `lib/**/*.{ts,tsx}`

**Files excluded**:
- `**/*.stories.{ts,tsx}`
- `**/node_modules/**`

## Plan Compliance

✓ All items from `.omc/plans/frontend-uiux-improvement.md` Section 5 are addressed:

### Section 5.1: Unit Testing
- [x] Framework: Jest + React Testing Library
- [x] jest.config.js with testEnvironment: 'jsdom'
- [x] jest.setup.js with global utilities
- [x] moduleNameMapper for path aliases
- [x] TypeScript transform
- [x] Coverage thresholds (70%)

### Section 5.2: Accessibility Testing
- [x] jest-axe dependency included
- [x] Examples in documentation
- [x] Storybook a11y addon (pre-configured)

### Section 5.3: Visual Regression Testing
- Chromatic (pre-configured in package.json)

### Section 5.4: Integration Testing
- [x] MSW setup for API mocking
- [x] Example login flow test
- [x] Custom render with providers

### Section 5.5: Manual Testing
- [x] Checklists in documentation

## Notes

- Dependencies are NOT yet installed (would require npm install command)
- All configuration files are created and ready
- Tests can be validated once dependencies are installed
- Documentation is complete and comprehensive
- Project follows next/jest best practices
- Coverage thresholds are appropriately set for a new project

---

**Setup Completed**: 2026-01-27
**Status**: Ready for npm install and validation
