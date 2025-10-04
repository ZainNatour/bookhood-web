# Testing Strategy

---

## Purpose

This document defines testing practices for the application.  
It covers **unit/component tests** with **Jest** and **React Testing Library**, **integration** and **end-to-end (E2E)** tests with **Playwright**, and **accessibility tests** using **axe**.  
Following these guidelines ensures a robust and maintainable test suite.

---

## Types of Tests

According to Next.js documentation, you should maintain a variety of test types: **unit**, **component**, **integration**, **end-to-end**, and **snapshot** tests [1].  
Each serves a different purpose:

- **Unit tests** verify a single function or pure logic (e.g., input validators, data transformation functions). They should run in isolation.  
- **Component tests** verify a single React component’s behavior (inputs, outputs, interactions). Use React Testing Library to render components and simulate user events.  
- **Integration tests** ensure multiple components or modules work together (e.g., a form submission updates state and calls a server action).  
- **End-to-end tests** simulate a user’s journey through the application in a real browser, verifying routing, network requests, and DOM changes.  
- **Snapshot tests** capture the output of components and ensure it doesn’t change unexpectedly. Use sparingly for static components.

---

## Unit and Component Testing with Jest & React Testing Library

Next.js recommends **Jest** for unit and component tests and provides a `next/jest` preset to integrate with Next.js and Babel [2].  
React Testing Library encourages testing components from the user’s perspective (queries like `getByRole`, `getByLabelText`) [2].

---

### Setup

Install dependencies:
```

pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @testing-library/react-hooks next/jest

````

Configure Jest using `next/jest`:
```js
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
````

Create `jest.setup.ts` to configure Jest DOM:

```ts
import '@testing-library/jest-dom';
```

---

### Best Practices

* Write tests that mimic **user interactions** (e.g., using `userEvent.click`), not internal state. Avoid testing implementation details.
* Test **asynchronous operations** with `findBy*` queries and `waitFor`.
* Use **MSW (Mock Service Worker)** to mock network requests for deterministic tests.
* Avoid snapshot tests for dynamic content; prefer assertive queries.

---

## Accessibility Smoke Tests

Integrate **jest-axe** to catch common accessibility issues. Example:

```ts
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import MyComponent from '@/components/MyComponent';

test('is accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results.violations).toHaveLength(0);
});
```

---

## End-to-End Testing with Playwright

Next.js provides a **Playwright** example and recommends using it to test complete user flows across browsers [3].
Playwright controls Chromium, Firefox, and WebKit headlessly or interactively.

---

### Setup

Install Playwright:

```
pnpm add -D @playwright/test
npx playwright install
```

Create a `playwright.config.ts` with base URL and test settings:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

---

### Example E2E Test (Navigation)

Write E2E tests in the `playwright/` directory:

```ts
import { test, expect } from '@playwright/test';

test('navigation from home to about', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /about/i }).click();
  await expect(page).toHaveURL('/about');
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
});
```

---

### Running in CI

* Run Playwright tests against a production build:

  ```
  pnpm build && pnpm start
  ```

  [3]
* Install dependencies with `npx playwright install-deps` on CI platforms to ensure browsers are available [3].
* Use Playwright’s **built-in reporter** for logs and screenshots; integrate with CI dashboards for metrics.

---

## Accessibility E2E Testing

Include accessibility assertions in Playwright using **axe-playwright** or **@axe-core/playwright**. Example:

```ts
import { test, expect } from '@playwright/test';
import { AxePuppeteer } from '@axe-core/puppeteer';

test('home page accessibility', async ({ page }) => {
  await page.goto('/');
  const results = await new AxePuppeteer(page).analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Testing Policy

* **Write tests before or alongside code:**
  Follow test-driven or behavior-driven development for complex features.

* **Achieve reasonable coverage:**
  Aim for at least **80 % coverage** on critical modules.
  Use coverage reports to guide testing effort.

* **Run tests locally and in CI:**
  Use **Husky** or a **pre-commit hook** to run tests before pushing;
  run the full test suite in GitHub Actions or your CI pipeline.

* **Update tests when requirements change:**
  Keep the test suite aligned with current behavior.
  Remove obsolete tests.

---

