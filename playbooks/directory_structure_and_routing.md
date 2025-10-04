## Purpose

This document formalizes how to organize your Next.js App Router project. It explains folder conventions, routing rules, and naming standards to ensure your codebase remains maintainable as it grows. All practices are based on official Next.js documentation and trusted community guides (2024–2025). Explicit decisions are noted where applicable.

---

## High‑Level Decisions

Before building, confirm these choices:

1. **Use a `src/` folder**  
    Place all application code (including `app/`, `components/`, `lib/`, `utils/`, `config/`, and `content/`) inside `src/`. Only configuration files (`package.json`, `next.config.js`, `tsconfig.json`, `.env.*`) stay at the project root.

2. **Adopt standard top‑level route groups**  
    Use `(marketing)`, `auth/`, `home/`, `join/`, and `admin/` to separate marketing pages, authentication flows, dashboards, team invitations, and admin panels.

3. **Shared vs page‑specific components**  
    Keep reusable UI in `src/components/`. Store route‑specific UI inside each route’s folder under `_components/` to prevent these files from becoming routable.

4. **Separate `lib/` and `utils/`**  
    Use `src/lib/` for business logic that interacts with external services (e.g., API clients, Zod schemas). Use `src/utils/` for pure, side‑effect‑free helper functions.

5. **Centralize configuration in `src/config/` and validate with Zod**  
    All environment and feature flags live here; validate them at build time.

6. **Store static content in `src/content/`**  
    Markdown files and other static documents live here for easy colocation.

7. **Enforce kebab‑case naming**  
    All file and folder names use lowercase with hyphens (e.g., `login-form.tsx`). React components use PascalCase inside their files.

8. **Tests in a global `__tests__/` folder**  
    Place all Jest/Playwright test files in a root‑level `__tests__/` folder (outside of `src/`) to avoid them becoming routes.

9. **Single‑app repository**  
    This repo contains only the Next.js frontend. Backend and mobile projects live in separate repositories.

---

## Project Layout

A typical top‑level tree (simplified):

```
/
├── src/
│   ├── app/            # Route definitions and UI logic
│   │   ├── (marketing)/  # Marketing pages
│   │   ├── auth/         # Authentication routes
│   │   ├── home/         # Dashboard / application routes
│   │   ├── join/         # Team invitation routes
│   │   └── admin/        # Admin routes
│   ├── components/      # Reusable UI components (shared)
│   ├── lib/             # Business logic & external integrations
│   ├── utils/           # Pure helper functions
│   ├── config/          # Environment & feature configuration
│   ├── content/         # Static content (e.g., Markdown posts)
│   ├── styles/          # Global CSS or Tailwind base files
│   ├── public/          # Static assets served from root
│   └── entrypoints...   # Additional folders (e.g., analytics)
├── __tests__/          # Jest & Playwright tests
├── .env.*, next.config.js, etc.
└── README.md, AGENTS.md, etc.
```

---

## src/app/ – Routing & Layout

- Each folder under `app/` corresponds to a URL segment. A route is created only when the folder contains a `page.tsx` or `route.ts` file.
- Use `layout.tsx` inside a folder to apply shared UI (header, footer, sidebar) to all nested routes.
- **Route Groups:** Wrap a folder name in parentheses (e.g., `(marketing)`) to create a group that does not appear in the URL.
- **Private Folders:** Prefix a folder with `_` to opt out of routing (e.g., `_components/`, `_lib/`).
- **Dynamic Segments:** Use `[param]` for dynamic paths and `[...slug]` or `[[...slug]]` for catch‑all segments.
- **Server vs Client Components:** Files in `app/` are server components by default. Add `'use client'` at the top of a file to mark it as a client component.

**Example: Feature Route**

```
src/app/home/[account]/tickets/
├── _components/
│   ├── ticket-list.tsx
│   └── ticket-form.tsx
├── _lib/
│   ├── server/
│   │   └── server-actions.ts
│   └── schema/
│       └── ticket.schema.ts
└── page.tsx
```

---

## Route Organization Decisions

- **Top‑level groups:** Use `(marketing)`, `auth/`, `home/`, `join/`, and `admin/` as shown.
- **Auth flows:** Group login, signup, and reset password pages under `auth/`.
- **Dynamic account segmentation:** Place user and team pages under `home/[account]`.
- **Admin and join:** Use `admin/` for admin pages and `join/` for invitation flows.

---

## src/components/ – Shared UI

- **Purpose:** Houses reusable UI components (buttons, form inputs, modals, cards).
- **Reusability:** Only promote a component to `src/components/` if used across multiple pages.
- **Naming:** Files use kebab‑case (e.g., `modal.tsx`); exported components use PascalCase (e.g., `Modal`).
- **Style:** Use Tailwind classes and design tokens.

---

## src/lib/ vs src/utils/ – Business Logic & Helpers

- **lib/:** Business logic and code that interacts with external services (API clients, authentication helpers, Zod schemas).
- **utils/:** Pure, deterministic helper functions with no side effects (e.g., date formatting).
- **File names:** Use kebab‑case (e.g., `format-date.ts`).
- **Import boundaries:** Components may import from `lib/` and `utils/`, but `lib/` should not import from `components/`.

---

## src/config/ – Central Configuration

- **Purpose:** Centralize environment variables, feature flags, and other settings.
- **Validation:** Use Zod or similar to validate at build time.
- **Access pattern:** Import configuration objects from this directory.

---

## src/content/ – Static Content

- **Purpose:** Store Markdown/MDX files, static JSON, YAML, and other content not served by an external CMS.
- **Examples:** Blog posts, terms of service, privacy policy, help pages.
- **Routing:** Use dynamic routing (e.g., `[slug]/page.tsx`) to load content.

---

## src/styles/ & Design Tokens

- **Global CSS:** Place reset and base styles here (e.g., `globals.css`). Import at the root layout.
- **Tailwind config:** `tailwind.config.ts` at the project root; import design tokens and expose via the theme property.

---

## public/ – Static Assets

- **Location:** Keep `public/` in the project root.
- **Caching:** Static assets are not cached beyond the current deployment by default.
- **Images:** Use Next.js `next/image` component; configure domains in `next.config.js`.

---

## Tests – Global `__tests__/`

- **Placement:** Store all test files in a root‑level `__tests__/` directory outside of `src/`.
- **Naming:** Use `.test.tsx` or `.spec.tsx` suffixes.
- **Running tests:** Jest should ignore the `src/app` folder except for imported components.

---

## Naming & Conventions

- **Kebab‑case:** Use for files and folders (e.g., `user-profile/page.tsx`, `auth/sign-in/page.tsx`).
- **PascalCase:** Use for component names (e.g., `UserProfile`).
- **Imports:** Always use relative imports from `src/` (e.g., `import Button from '@/components/button'`).

---

## Example: Account & Tickets Feature

```
src/
├── app/
│   └── home/
│       └── [account]/
│           ├── layout.tsx
│           ├── page.tsx
│           ├── (tickets)/
│           │   └── page.tsx
│           │   └── _components/
│           │       ├── ticket-list.tsx
│           │       ├── ticket-form.tsx
│           │   └── _lib/
│               ├── schema/
│               │   └── ticket.schema.ts
│               ├── server/
│               │   └── server-actions.ts
│               └── ticket.service.ts
│   └── ...
├── components/
│   ├── button.tsx
│   ├── modal.tsx
│   └── form-field.tsx
├── lib/
│   ├── api/
│   │   └── index.ts
│   ├── auth.ts
│   └── ...
├── utils/
│   └── date-format.ts
├── config/
│   ├── app.config.ts
│   ├── auth.config.ts
│   └── feature-flags.config.ts
├── content/
│   └── privacy-policy.md
├── __tests__/
│   └── home-account.test.tsx
└── ...
```

---

## Conclusion

Following this directory structure will help your team scale your Next.js application without disorganization. Each folder has a clear purpose, and all routes, components, and utilities are placed where other developers—or your coding agent—will expect them. Adhering to these conventions ensures only route files create URL paths, sensitive logic remains server‑side, and tests/configuration do not accidentally become part of your public API.

---