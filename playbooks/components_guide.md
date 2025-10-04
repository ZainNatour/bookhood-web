# Component Guidelines

## Purpose

This guide establishes standards for naming, structuring, and styling React components in the application. It distinguishes between presentational and feature components, defines their placement in the file tree, and describes how to use design tokens with Tailwind CSS. Adhering to these conventions ensures consistency, reusability, and maintainability.

---

## Naming Conventions

- **Component file names:**  
    Use kebab-case for file and directory names (e.g., `button.tsx`, `user-card.tsx`). This aligns with Next.js App Router’s routing conventions and avoids case sensitivity issues across platforms.

- **Component names:**  
    Use PascalCase (e.g., `Button`, `UserCard`) for React component functions or classes.

- **Props:**  
    Document props in JSDoc or TypeScript interfaces. Use descriptive names (e.g., `onSubmit`, `isLoading`) and avoid abbreviations.

---

## Presentational vs Feature Components

### Presentational Components

Presentational (or “dumb”) components focus on rendering UI. They:

- Receive data and callbacks solely through props.
- Do not manage global or remote state; may manage internal UI state (e.g., a toggle state).
- Contain minimal logic; easily reused across pages.
- Live in `src/components/` (root) if shared across routes, or inside a route’s `components/` directory if used only in that route.

### Feature Components

Feature (or “smart”) components manage data fetching, form submission, or business logic. They may use TanStack Query or SWR, context providers, or server actions. Feature components often wrap presentational components:

- Fetch or mutate data in `lib/api/` or server actions.
- Manage state with Zustand or context (see `STATE_AND_DATA.md`).
- Own side effects like analytics events or router navigation.
- Live in the route’s folder hierarchy (e.g., `app/home/_components/`) or in `src/components/` if truly shared. Use underscore prefix to mark private directories (see `DIRECTORY_STRUCTURE.md`).

**Tip:**  
Use this separation to improve testability and reuse: presentational components are pure and easily tested, while feature components integrate data and logic.

---

## Component Placement

### Shared Components

Place components used across multiple routes in `src/components/`. Examples include buttons, form inputs, modals, cards, and icons. These components should be generic and configurable via props (e.g., `variant`, `size`).

### Route‑Specific Components

Place components used only by a single page or route under that route’s folder. For example, `app/dashboard/_components/expense-table.tsx` houses a table unique to the dashboard. Prefix the folder with an underscore to prevent Next.js from treating it as a route (see `DIRECTORY_STRUCTURE.md`).

### Layout and Slot Components

Use layout components (`layout.tsx`) to wrap groups of routes with a consistent shell (header, footer, nav). Use slot layouts (parallel routes) for nested interactive sections.

---

## Tokens & Tailwind Integration

To keep styling consistent, map your design tokens into Tailwind’s theme (see `TOKENS_AND_THEME.md`). Use Tailwind utility classes referencing tokens via custom names (e.g., `bg-primary`, `text-secondary`). Avoid hard‑coding colours, spacing, or typography.

**Example:**

```tsx
// Button.tsx
import { cva } from 'class-variance-authority';

const buttonStyles = cva(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    {
        variants: {
            variant: {
                primary: 'bg-primary text-on-primary hover:bg-primary-hover',
                secondary: 'bg-secondary text-on-secondary hover:bg-secondary-hover',
                outline: 'bg-transparent border border-outline text-on-surface hover:bg-surface-variant',
            },
            size: {
                sm: 'h-8 px-3 text-sm',
                md: 'h-10 px-4 text-base',
                lg: 'h-12 px-6 text-lg',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export function Button({ variant, size, ...props }) {
    return <button className={buttonStyles({ variant, size })} {...props} />;
}
```

In this example, the `class-variance-authority` utility helps combine Tailwind classes and tokens for different variants and sizes. Use similar patterns for other components. Always reference tokens (e.g., `bg-primary`, `border-outline`) defined in your `tailwind.config.ts` and tokens file.

---

## Reusable Props Patterns

When designing reusable components, expose props that allow customization without duplicating code:

- **Variant prop:** Choose visual styles (`variant="primary" | "secondary" | "outline"`).
- **Size prop:** Choose dimensions (`size="sm" | "md" | "lg"`).
- **As prop:** For components that may render different HTML elements (`as="a"` to render `<a>` tag). Combine with `href` for links.
- **Disabled state:** Provide a `disabled` boolean prop. Use `aria-disabled` and update `className` to reflect disabled styling.

Define sensible defaults for props and document them in TypeScript. Use union types to restrict values and avoid invalid combinations.

---

## Conclusion

Following these guidelines ensures that components are consistent, reusable, and accessible. Always leverage design tokens and Tailwind for styling, separate presentational and feature logic, and structure your component files for clarity.

---