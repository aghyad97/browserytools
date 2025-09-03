# Testing Guide for BrowseryTools

This document provides comprehensive information about the testing setup and how to run tests for the BrowseryTools application.

## Testing Stack

- **Unit/Integration Tests**: Jest + React Testing Library
- **End-to-End Tests**: Playwright
- **Visual Regression**: Playwright with screenshot comparison
- **Performance Testing**: Playwright with performance metrics
- **Coverage**: Jest with Istanbul

## Test Structure

```
src/
├── __tests__/
│   ├── components/          # Component unit tests
│   ├── integration/         # Integration tests
│   └── utils/              # Test utilities and helpers
e2e/                        # End-to-end tests
├── fixtures/               # Test fixtures and mock data
└── *.spec.ts              # Playwright test files
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- TextCounter.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="password"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run specific test file
npx playwright test text-counter.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Categories

### 1. Unit Tests

Test individual components in isolation:

- **Component rendering**: Verify components render correctly
- **User interactions**: Test button clicks, form inputs, etc.
- **State management**: Test component state changes
- **Props handling**: Test component behavior with different props

Example:

```typescript
test("renders the component correctly", () => {
  render(<TextCounter />);
  expect(screen.getByText("Text Counter")).toBeInTheDocument();
});
```

### 2. Integration Tests

Test component interactions and data flow:

- **Component communication**: Test how components interact
- **Store integration**: Test Zustand store usage
- **Navigation**: Test routing and navigation
- **API integration**: Test data fetching and updates

Example:

```typescript
test("navigates between different tools", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Text Counter").click();
  await expect(page).toHaveURL("/tools/text-counter");
});
```

### 3. End-to-End Tests

Test complete user workflows:

- **User journeys**: Test complete user workflows
- **Cross-browser compatibility**: Test in different browsers
- **Responsive design**: Test on different screen sizes
- **Performance**: Test loading times and responsiveness

### 4. Visual Regression Tests

Test UI consistency:

- **Screenshot comparison**: Compare screenshots across versions
- **Layout testing**: Test responsive layouts
- **Theme testing**: Test light/dark theme consistency

### 5. Performance Tests

Test application performance:

- **Loading times**: Test page load performance
- **Memory usage**: Test memory consumption
- **Bundle size**: Test JavaScript bundle size
- **Core Web Vitals**: Test LCP, FID, CLS metrics

## Test Utilities

### Mock Data

Located in `src/__tests__/utils/mock-data.ts`:

- Sample text data for text tools
- Mock image data for image tools
- Mock PDF data for PDF tools
- Mock audio/video data for media tools

### Test Helpers

Located in `src/__tests__/utils/test-utils.tsx`:

- Custom render function with providers
- Mock file creation utilities
- Clipboard mocking
- Canvas mocking for image processing

### Mock Functions

- `createMockFile()`: Create mock files for upload tests
- `createMockImageFile()`: Create mock image files
- `createMockPDFFile()`: Create mock PDF files
- `waitFor()`: Utility for async operations

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from "../utils/test-utils";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  test("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  test("handles user interaction", async () => {
    render(<MyComponent />);
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("Result")).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("My Tool", () => {
  test("completes user workflow", async ({ page }) => {
    await page.goto("/tools/my-tool");

    // Test the workflow
    await page.getByPlaceholderText("Enter text").fill("test");
    await page.getByText("Process").click();

    // Verify result
    await expect(page.getByText("Result")).toBeVisible();
  });
});
```

## Test Configuration

### Jest Configuration

- **Test environment**: jsdom for React components
- **Setup files**: `jest.setup.js` for global mocks
- **Coverage threshold**: 70% for branches, functions, lines, statements
- **Module mapping**: `@/` alias for src directory

### Playwright Configuration

- **Browsers**: Chromium, Firefox, WebKit
- **Mobile testing**: iPhone 12, Pixel 5
- **Base URL**: http://localhost:3000
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On failure

## CI/CD Integration

### GitHub Actions

The project includes GitHub Actions workflows for:

- **Unit tests**: Run on Node.js 18.x and 20.x
- **E2E tests**: Run on Ubuntu with Playwright
- **Visual regression**: Screenshot comparison
- **Performance tests**: Core Web Vitals testing
- **Coverage reporting**: Codecov integration

### Pre-commit Hooks

Recommended pre-commit hooks:

```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "jest --bail --findRelatedTests"
    ]
  }
}
```

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Keep tests independent and isolated

### 2. Mocking

- Mock external dependencies
- Use realistic mock data
- Mock browser APIs (clipboard, file system)
- Mock Next.js specific features

### 3. Assertions

- Use specific assertions
- Test both positive and negative cases
- Test edge cases and error conditions
- Verify user-visible behavior

### 4. Performance

- Keep tests fast
- Use `waitFor` for async operations
- Avoid unnecessary renders
- Mock heavy operations

### 5. Maintenance

- Update tests when features change
- Remove obsolete tests
- Keep test data up to date
- Document complex test scenarios

## Debugging Tests

### Unit Tests

```bash
# Run tests in debug mode
npm test -- --verbose

# Run specific test with debug output
npm test -- --testNamePattern="specific test" --verbose
```

### E2E Tests

```bash
# Run tests in headed mode
npm run test:e2e:headed

# Run tests with UI
npm run test:e2e:ui

# Debug specific test
npx playwright test --debug text-counter.spec.ts
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or use `waitFor`
2. **Mock not working**: Check mock setup in `jest.setup.js`
3. **E2E tests failing**: Verify test server is running
4. **Coverage not updating**: Clear coverage directory

### Debug Tips

- Use `screen.debug()` to see current DOM state
- Use `page.pause()` in Playwright tests
- Check browser console for errors
- Verify test data and mocks

## Contributing

When adding new tests:

1. Follow existing test patterns
2. Add tests for new features
3. Update test documentation
4. Ensure tests pass in CI
5. Maintain coverage thresholds

For questions or issues with testing, please open an issue or contact the development team.
