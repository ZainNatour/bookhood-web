# Agent Engineering Playbook – Next.js Frontend

## Purpose

This document is the initial prompt your coding agent (e.g. GPT‑5 Codex running in VS Code) should read before making any change to the BookHood Next.js project. It explains where to find all source‑of‑truth files, how to use them in specific scenarios, and how to bootstrap the project from a vanilla Next.js skeleton. By following these rules you’ll avoid contradictions, ensure consistency across the codebase, and adhere to modern best practices while using only the latest trusted official libraries.

## Design Tokens and File Locations

- All files containing rules, guidelines and playbooks live in the `playbooks/` directory at the project root.
- This agent file (`agent.md`) lives in the `playbooks/` directory of this repository.
- The design tokens live in `playbooks/design_tokens.json` (and platform‑specific exports) in the same directory; they define colours, spacing, typography, motion, z‑index and other primitives used by both the web and mobile apps.
- **Never hard‑code visual values**—always reference tokens via the Tailwind theme, CSS variables, or the generated React Native constants, as described in the Tokens and Theme playbook.
- When adding or changing tokens, update `playbooks/design_tokens.json`, regenerate the Tailwind and CSS outputs, and then update any component libraries to consume the new variables.

---

## Document Overview

Each Markdown document in the `playbooks/` folder covers a specific domain. Use this section to choose the appropriate reference for your task. (The citations below point to authoritative sources used to compile these guidelines.)

- **Coding standards** – `playbooks/coding_standards_and_practices.md`  
    Defines naming conventions, function and component size guidelines, DRY/KISS/YAGNI principles, commenting, environment configuration and dependency management. Use descriptive camelCase names and avoid unused variables[1][2]. Follow the `.env` conventions (only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser)[3]. Configure linting with ESLint (including `eslint-plugin-jsx-a11y`) and formatting with Prettier. Use Husky and lint‑staged to run checks pre‑commit.

- **Directory structure and routing** – `playbooks/directory_structure_and_routing.md`  
    Explains how to organise files in the App Router. Each folder in `src/app/` is a route segment; pages use `page.tsx`, API endpoints use `route.ts`[4]. Group routes by wrapping folders in parentheses (marketing), and use `_` prefixes for private folders[5]. Put shared components in `src/components` and page‑specific components in the route’s `_components` folder. Tests live in a root‑level `__tests__/` folder.

- **Styling guidelines** – `playbooks/styling_guidelines.md`  
    Describes how to use Tailwind CSS, design tokens and shadcn/ui. Extend Tailwind’s theme with values from `playbooks/design_tokens.json` and avoid `@apply` to keep CSS consistent. Use shadcn/ui components themed with your tokens. Load all images via `next/image` with explicit width and height[6]. For exceptional cases, use styled‑components or CSS Modules sparingly. Respect the breakpoints defined by your tokens (mobile‑first responsive design).

- **State and data management** – `playbooks/state_and_data_management.md` (and `playbooks/state_and_data_management2_2.md`)  
    Guides how to fetch and cache data. Use TanStack Query for client‑side data fetching and caching. Use Zustand for global client state. Fetch data in Server Components when possible; rely on Next.js caching and revalidate intervals for static/semi‑static data[7]. Use `{ cache: 'no-store' }` for dynamic data[8]. Fetch multiple resources in parallel to avoid waterfalls[9]. Use Server Actions for simple form submissions and route handlers for multi‑method APIs[10]. The second version of this document provides playbooks for choosing between time‑based and on‑demand revalidation[11].

- **API client** – `playbooks/api_client.md`  
    Standardises API usage with the generated openapi‑client‑axios client. Calls must go through `lib/api/client.ts`, which sets the base URL, attaches authentication cookies, configures interceptors, and centralises logging. Tokens are stored in HttpOnly, Secure and SameSite cookies and refreshed automatically[12]. Errors follow the Problem Details schema with optional `code` and `errors[]` fields[13]. The document provides playbooks for timeouts and retries (exponential backoff with jitter)[14], debouncing and throttling user input[15], concurrency limits, logging toggles, and guidelines for when to use interceptors versus middleware.

- **Rendering strategies** – `playbooks/rendering_strategy.md`  
    Helps choose between SSR, SSG, ISR and CSR. Use SSR for personalised or frequently changing data; SSG for static content; ISR for large collections or periodically updated content; CSR only for private dashboards or highly interactive pages[16][17]. The document includes decision playbooks, streaming and Suspense guidelines, and warnings about embedding secrets in pre‑rendered HTML[18].

- **Security** – `playbooks/security.md`  
    Lists security measures: use `NEXT_PUBLIC_` to expose only truly public environment variables[3]; implement a strict Content Security Policy using nonces and the `frame-ancestors` directive[19]; avoid inline scripts and use the Script component instead[20]; store tokens in HttpOnly, Secure, SameSite cookies; never store secrets in localStorage[21]; validate and sanitise all user inputs[22][23]; and segregate server-only code using the `server-only` package[24].

- **SEO** – `playbooks/seo.md`  
    Explains how to use the Next.js Metadata API (`metadata` or `generateMetadata`) to set titles, descriptions, and Open Graph/Twitter tags[25]. Instructs how to create `robots.txt` and `sitemap.(xml|js|ts)` files in the `app/` directory[26][27]. Recommends semantic HTML, canonical URLs, structured data, and accessible headings. Lists guidelines for dynamic metadata and streaming metadata.

- **Performance** – `playbooks/performance.md`  
    Outlines optimisation practices: lazy‑load heavy client components via `next/dynamic` or `React.lazy()`[28]; always use `next/image` and specify width and height[6]; understand Next.js prefetching and use `router.prefetch` for dynamic routes[29]; choose appropriate script loading strategies (`afterInteractive`, `lazyOnload`, etc.)[20]; manage caching and revalidation; configure remote image domains and compression. Use only maintained libraries and remove unused dependencies.

- **Accessibility** – `playbooks/a11y.md`  
    Defines WCAG 2.2 requirements: ensure text contrast ratios of ≥4.5:1 for normal text and ≥3:1 for large text[30]; focus indicators must have at least a 2 px outline and 3:1 contrast[31]; targets (buttons, links, inputs) must be at least 24×24 CSS px[32]. Use semantic HTML, proper ARIA roles, labelled controls, and maintain keyboard navigability. Use `eslint-plugin-jsx-a11y` to enforce accessibility rules. Test accessibility with axe (unit tests) and Playwright (E2E).

- **Testing** – `playbooks/testing.md`  
    Details the testing strategy: use Jest with React Testing Library for unit and component tests; set up Jest with `next/jest` and configure `testEnvironment: 'jsdom'`[33]. Use Playwright for end‑to‑end tests; configure it to run tests against a production build across Chromium, Firefox and WebKit[34]. Include accessibility checks with `jest-axe` or `axe-playwright`. Aim for at least 80% coverage on critical modules and integrate tests into your CI pipeline.

- **Assets guide** – `playbooks/assets_guide.md`  
    Explains how to handle static assets: store images, icons, fonts and videos in `public/` and reference them via root‑relative paths. Set caching headers in `next.config.js` and fingerprint filenames to enable long‑term caching. Use `next/image` for image optimisation and prefer SVG for icons. Host large media on a CDN. Include `robots.txt`, `sitemap.xml`, favicons and the PWA manifest in `public/`.

- **Components guide** – `playbooks/components_guide.md`  
    Defines naming conventions and component organisation: use kebab‑case file names and PascalCase component names[35]; differentiate presentational (UI only) and feature (logic) components; store shared components in `src/components` and route‑specific components in `_components` inside the route. Utilise design tokens with Tailwind via class variance authority; expose props such as `variant`, `size` and `as` for flexibility.

- **Error model** – `playbooks/error_models.md`  
    Defines the API error schema based on RFC 9457 Problem Details. Errors must include `type`, `title`, `status` and `detail`, plus optional `code` and `errors[]` arrays[13]. Use `errors[]` to return field‑level validation messages. The document provides patterns for mapping these errors to UI (toast for global errors, inline text for field errors) and explains which errors are retryable.

- **Fetching recipes** – `playbooks/FETCHING_RECIPES.md`  
    Provides copy‑and‑paste patterns for data fetching. It shows how to fetch data inside Server Components with caching and revalidate options[7], how to handle dynamic data using `{ cache: 'no-store' }`[8], how to trigger on‑demand revalidation via `revalidateTag` or `revalidatePath`[11], and how to implement client fetching with TanStack Query or SWR. It also includes guidelines for optimistic updates and explains when to use Server Actions versus client POST requests[10].

- **Tokens and theme** – `playbooks/tokens_and_theme.md`  
    Explains how design tokens in `playbooks/design_tokens.json` feed into Tailwind and CSS variables. Use a build script or Style Dictionary to generate platform‑specific outputs. Map tokens into Tailwind’s theme and avoid magic numbers. When adding or updating tokens, update the JSON file, regenerate the Tailwind config and CSS variables, and ensure both light and dark themes function correctly.

---

## Setup Prompt – Bootstrapping the Project

You will often start from the default scaffold generated by `npx create-next-app@latest` (App Router, TypeScript enabled). Follow these steps to align the skeleton with our playbook:

1. **Clean up the template:**  
     Remove unused files such as default pages, images, and CSS. Rename `app/page.tsx` to `app/(marketing)/home/page.tsx` or similar, following the directory structure playbook.

2. **Create the proper folder structure:**  
     Under `src/`, create `app/` with route groups (marketing, dashboard, etc.), and add `_components` directories for page‑specific components. Create `src/components/` for shared components and `__tests__/` at the root for tests.

3. **Install core dependencies:**  
     Use the latest stable versions of official libraries only. At a minimum:
     ```sh
     pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand
     pnpm add tailwindcss postcss autoprefixer class-variance-authority tailwind-merge
     pnpm add @shadcn/ui
     pnpm add axios openapi-client-axios
     pnpm add eslint eslint-plugin-jsx-a11y eslint-config-prettier prettier
     pnpm add jest @testing-library/react @testing-library/jest-dom jest-axe
     pnpm add @playwright/test playwright-axe
     pnpm add husky lint-staged
     ```
     These packages provide state management, data fetching, styling, API client generation, linting/formatting, testing, and pre‑commit hooks. **Do not install deprecated or unmaintained libraries.**

4. **Initialize Tailwind:**  
     Run `npx tailwindcss init -p` and extend the theme using values from `playbooks/design_tokens.json` as described in `playbooks/tokens_and_theme.md`. Configure responsive breakpoints and colour palettes accordingly.

5. **Configure ESLint and Prettier:**  
     Create `.eslintrc.json` and `.prettierrc` based on the rules in `playbooks/coding_standards_and_practices.md`. Include `eslint-plugin-jsx-a11y` for accessibility linting and configure Prettier for consistent formatting.

6. **Set up Jest and Playwright:**  
     Use the `next/jest` preset to initialise Jest; add `jest.setup.js` to import `@testing-library/jest-dom` and `jest-axe`. Configure `playwright.config.ts` to point at the built app; install browsers with `npx playwright install` and `npx playwright install-deps` for CI.

7. **Configure Husky and lint-staged:**  
     Add pre‑commit hooks to run `pnpm lint` (ESLint), `pnpm format` (Prettier), and `pnpm test` (Jest) on staged files. Use `husky install` and configure `.husky/pre-commit` accordingly.

8. **Generate the API client:**  
     Place your OpenAPI specification in `openapi/openapi.yaml` and use `openapi-client-axios` to generate `lib/api` (via an npm script). Follow `playbooks/api_client.md` to wrap the generated client and handle authentication, errors and retries.

9. **Add metadata, sitemap and robots files:**  
     Create `app/robots.ts` or `robots.txt` and `app/sitemap.ts` or `sitemap.xml` following the guidelines in `playbooks/seo.md`[26][27]. Ensure metadata is defined in each page or layout using the Metadata API[25].

10. **Set up environment variables:**  
        Create an `.env.local` file for local development. Only variables prefixed with `NEXT_PUBLIC_` will be exposed to the client; keep secrets (API keys, database URLs) without this prefix so they remain server-only[3].

11. **Configure CSP and security headers:**  
        Use `next.config.js` or an Edge middleware to inject a Content Security Policy with nonces and `frame-ancestors` restrictions[19]. Add other security headers (e.g. Strict-Transport-Security, X-Content-Type-Options). Follow `playbooks/security.md` for cookie flags and input sanitisation[22][21].

12. **Update the design tokens and theme:**  
        If the project uses a new brand palette, update `playbooks/design_tokens.json` and regenerate the Tailwind theme and CSS variables. Check `playbooks/tokens_and_theme.md` for instructions.

By following these steps you will turn the default Next.js scaffold into a project that aligns with the playbooks. **Always cross‑reference the documents when making structural or dependency decisions.**

---

## Handling Ambiguous Tasks

Some tasks may not map neatly to a single playbook. In such cases:

1. **Consult multiple documents:**  
     For example, when adding a new page that also needs API calls, consult `playbooks/directory_structure_and_routing.md`, `playbooks/rendering_strategy.md`, `playbooks/state_and_data_management.md`, `playbooks/api_client.md`, and `playbooks/seo.md`.

2. **Follow coding standards:**  
     When in doubt, fall back on the principles in `playbooks/coding_standards_and_practices.md`. Make functions small and focused, keep concerns separated, and avoid premature optimisation.

3. **Use playbooks flexibly:**  
     The documents include decision matrices for revalidation, fetching patterns, error retries, etc. Use them to decide case by case. If a scenario does not fit any existing playbook, propose an ADR and update the playbook.

4. **Prefer explicit over implicit:**  
     When the choice is optional (e.g. time‑based vs on‑demand revalidation), favour explicit configuration and document your decision.

---

## Conclusion

This Agent Engineering Playbook centralises all knowledge needed to build, secure, test and optimise the BookHood Next.js frontend. Each Markdown document in the `playbooks/` folder contains detailed rules and examples. **Before writing code, identify the relevant documents, read them thoroughly, and follow their guidance.** When the documentation is lacking, make decisions based on best practices from the referenced sources and add an ADR to record your rationale. By adhering to this process you will avoid contradictions, stay aligned with current best practices, and deliver a robust, maintainable application.

---