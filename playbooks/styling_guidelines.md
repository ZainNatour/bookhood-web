# Styling Guidelines for the Next.js Web App

> **Purpose:**  
> These guidelines define how to style your Next.js application consistently using Tailwind CSS, your design tokens, Shadcn UI, and modern best practices. Use this document as the definitive reference when styling pages, components, and layouts.

---

## Goals

- Integrate your design tokens into Tailwind.
- Use utility‑first classes to implement the design system.
- Theme Shadcn UI components with tokens.
- Handle images and icons responsibly.
- Maintain minimal global styles while supporting responsive design, dark mode, and accessibility.
- Optimize for performance and leverage Tailwind’s plugin ecosystem.

---

## 1. Design Tokens and Theme Mapping

**Centralised tokens:**  
All colours, spacing, radii, typography, and other visual primitives come from your `design_tokens.json`. Design tokens keep your UI consistent, scalable, and maintainable[^1]. When you change a value in the tokens file (e.g., a brand colour), the change automatically propagates across the entire app[^2].

**Tailwind config:**  
Map your tokens into Tailwind’s theme inside `tailwind.config.ts`. Use `require()` (or `import`) to load the token JSON and then extend Tailwind’s `colors`, `spacing`, `fontSize`, `borderRadius`, `zIndex`, and `screens` objects.

```js
const tokens = require("./design_tokens.json");
module.exports = {
    theme: {
        extend: {
            colors: tokens.colors,
            spacing: tokens.spacing,
            fontSize: tokens.fontSizes,
            borderRadius: tokens.radii,
            zIndex: tokens.zIndex,
            screens: tokens.breakpoints,
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
    ],
};
```

- **Extend vs override:** Use `extend` to add new values while preserving Tailwind’s defaults. Only override defaults if a token specifically replaces a default value.
- **Breakpoints:** Include both Tailwind’s default breakpoints and your custom ones (e.g., for iPad) by merging them in the `screens` section.
- **Dark mode:** Enable dark mode using the `class` strategy so you can toggle themes at runtime. Tailwind will generate `dark:` variants that apply your dark‑theme tokens. Add a `dark` class at the root (`<html class="dark">`) when dark mode is active.

---

## 2. Utility‑First CSS

Tailwind encourages a utility‑first approach, where small, single‑purpose classes compose the UI. Using the configuration file to extend the theme keeps code DRY and consistent[^3].

- **No `@apply` for reusable classes:** Compose UIs directly in JSX using classes like `bg-primary`, `text-lg`, `p-medium`, and responsive variants (`sm:text-lg`, `md:text-xl`). This ensures that styling lives alongside markup and uses tokens directly.
- **Semantic class names:** For readability, group related classes logically: colour classes together, spacing classes together, etc.
- **Avoid inline styles:** Never hard‑code CSS values in inline styles; always use utility classes or tokens to stay consistent.

---

## 3. Component Library: Shadcn UI

Adopt Shadcn UI for ready‑made, accessible components that are themeable via Tailwind. Shadcn UI is built on Radix UI primitives and integrates seamlessly with Tailwind.

1. **Install and configure:** Generate Shadcn UI components via the CLI in your project. After installation, update `components.json` (Shadcn’s registry) to include your custom theme and path settings.
2. **Token‑driven theming:** Update your Shadcn UI `tailwind.config` entry to map to your design tokens. For example, set the primary and secondary colours to `tokens.colors.primary` and `tokens.colors.secondary`.
3. **Consistency with tokens:** When writing custom components that wrap Shadcn primitives, use your utility classes and avoid inline styles. Leverage Shadcn’s prop APIs to set sizes, variants, and states.

---

## 4. Icon Library

Choose Heroicons as your icon set. It aligns visually with Tailwind’s aesthetic and is maintained by Tailwind Labs. Import only the icons you need to reduce bundle size:

```js
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
```

Place any custom SVG icons in the `public/icons/` directory or import them as React components so you can apply Tailwind classes directly.

---

## 5. Global Styles

- **`global.css`:** Import Tailwind’s base, components, and utilities layers at the top of `src/app/layout.tsx`:

    ```css
    /* src/styles/globals.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

    Tailwind’s Preflight reset automatically applies sensible defaults and modernises element styles[^4]. Avoid adding additional CSS resets or global rules unless necessary; keep global styles minimal.

- **Fonts:** Import custom fonts via Next.js’s built‑in font module or CSS `@font-face` declarations in `globals.css`. Set the base font family using tokens (e.g., `font-sans` from your tokens). Use the tokens’ line heights and letter spacing to maintain typographic rhythm.

---

## 6. Responsive Design

- **Mobile‑first:** Tailwind is mobile‑first by design; classes apply to the smallest screens by default and then override at larger breakpoints[^5]. Structure your layouts to look correct on phones first, then layer on tablet and desktop styles.
- **Custom breakpoints:** Use both Tailwind’s default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`) and your custom breakpoints (e.g., `tablet`, `desktop`) defined in the tokens.

    ```js
    module.exports = {
        theme: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
                tablet: tokens.breakpoints.tablet,
                desktop: tokens.breakpoints.desktop,
            },
        },
    };
    ```

- **iPhone/iPad/Desktop support:** Use responsive utilities (`md:`, `lg:`) and custom breakpoints to target these devices. Test on common screen sizes to ensure layouts scale gracefully.

---

## 7. Images & Media

- **Use Next.js `<Image>` for all images:** Always specify `width` and `height` props (intrinsic size) to prevent cumulative layout shift[^6]. When images need to fill a container, use the `fill` prop along with an explicit `sizes` attribute.

    ```jsx
    <Image
        src="/blog/hero.jpg"
        width={1200}
        height={630}
        alt="Blog hero image"
        priority
    />
    ```

- **No remote images:** Your project doesn’t load images from external domains, so there’s no need to configure remote patterns in `next.config.js`. If that changes, add allowed domains to the config.
- **Icons:** Import icon components (e.g., from Heroicons) rather than embedding raw SVG markup. This allows Tailwind classes to style the icons and keeps the markup clean.

---

## 8. Styled Components & CSS Modules

While Tailwind covers most styling needs, you also use styled‑components and CSS Modules for complex or dynamic styling.

- **Isolation:** Use CSS Modules (`ComponentName.module.css`) to scope styles to a component. Do not rely on global selectors; each class name is hashed automatically.
- **Styled components:** Use the `styled` API for dynamic styles that depend on props or runtime values. Keep CSS‑in‑JS minimal and prefer Tailwind for static styling. When using styled components, reference your tokens via CSS custom properties or inline variables.
- **Naming:** Use descriptive, kebab‑case names for CSS module files (e.g., `navbar.module.css`).

---

## 9. Dark Mode and Theming

- **Dark mode:** Enable dark mode in `tailwind.config.ts` with `darkMode: 'class'`. Add the `dark` class to the `<html>` element when the user enables dark mode. Use dark‑theme tokens for colours, backgrounds, and typography.
- **Theme toggling:** Provide a theme switcher component (e.g., in the navbar) that toggles the `dark` class on the document root. Persist the theme in local storage and respect the system preference using `prefers-color-scheme` as an initial value.

---

## 10. Accessibility

Accessibility is part of styling. Ensure all components:

- **Visible focus states:** Never remove outline styles unless you replace them with a visible alternative that meets contrast ratios[^8]. Use tokens for focus rings and apply them consistently.
- **Alt text for images:** Provide meaningful `alt` attributes for all images; leave empty (`alt=""`) only when images are decorative.
- **Semantic HTML:** Use proper HTML elements (`<button>`, `<nav>`, `<header>`, etc.) rather than generic `<div>`s. Semantic elements improve screen‑reader navigation.
- **ARIA roles and labels:** When a component isn’t semantically represented by native HTML, add appropriate ARIA roles and `aria-label` or `aria-labelledby` attributes.
- **Contrast:** Ensure text and interactive elements meet WCAG 2.1 AA or AAA colour contrast targets; rely on tokens that satisfy these contrast ratios.

---

## 11. Performance and Maintainability

- **Purge CSS automatically:** Tailwind’s Just‑in‑Time (JIT) engine removes unused styles automatically, keeping your bundle small. Make sure `content` in `tailwind.config.ts` includes all files with classes (e.g., `src/**/*.tsx`).
- **Avoid class bloat:** Even though classes are cheap, aim to keep markup concise by grouping related classes logically and avoiding redundant classes. Do not use `@apply` in this project, but create small helper components instead.
- **Optimise images:** Use `priority` and `placeholder="blur"` on critical images to improve LCP; compress assets and use modern formats (WebP/AVIF) when possible.
- **Lazy load icons and components:** Import icons individually to reduce bundle size; code-split heavy components with dynamic imports.

---

## 12. Tailwind Plugins

Leverage Tailwind’s first‑party plugins to extend utility classes:

- `@tailwindcss/forms` – Adds better form element styling.
- `@tailwindcss/typography` – Provides prose classes for rich text content.
- `@tailwindcss/aspect-ratio` – Simplifies aspect ratio handling.
- `@tailwindcss/line-clamp` – Enables truncating text with ellipsis.

Install these via npm and register them in `tailwind.config.ts` as shown earlier. Additional third‑party plugins can be considered on a per‑feature basis as long as they integrate well with the design tokens.

---

## Summary

- **Tokens → Tailwind:** All styling derives from your design tokens. Map tokens into Tailwind’s theme and avoid hard‑coded values.
- **Utility‑first, no `@apply`:** Compose UI using Tailwind classes only.
- **Shadcn UI:** Use Shadcn components, themed with your tokens.
- **Heroicons:** Standardise on one icon library and import icons as React components.
- **Images:** Always use `<Image width height>`; no remote images.
- **Global styles:** Minimal global CSS; rely on Tailwind preflight and your tokens.
- **Responsive & breakpoints:** Support both default and custom breakpoints; mobile‑first design for iPhone, iPad, and desktop.
- **Styled components & CSS Modules:** Use them for dynamic or complex styles, while referencing tokens.
- **Dark mode & a11y:** Enable class‑based dark mode; follow accessibility guidelines.
- **Performance:** Purge unused CSS, compress images, avoid excessive utilities.
- **Plugins:** Use forms, typography, aspect ratio, and line clamp plugins to enhance productivity.

> **Follow this document for every new component, page, or style rule. It ensures a cohesive, accessible, and efficient UI that stays aligned with your design system.**

---

[^1]: Design tokens promote consistency and scalability.
[^2]: Token changes propagate automatically.
[^3]: Utility-first keeps code DRY.
[^4]: Preflight modernizes element styles.
[^5]: Tailwind is mobile-first.
[^6]: Prevents layout shift.
[^7]: Optimizes image loading.
[^8]: Focus states must meet contrast requirements.