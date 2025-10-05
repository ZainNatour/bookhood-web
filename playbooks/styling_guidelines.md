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

## 11. Cursor & Interaction States Playbook

**Why:** Cursors and state visuals communicate affordances before a user clicks. They must be consistent, accessible, and token-driven.

### 11.1 Cursor rules (token-driven)
Use the cursor tokens in `global.cursors.map` and `global.cursors.rules`:

- **Links & buttons:** `cursor-pointer` (never rely on color only).  
- **Inputs & selectable text:** `cursor-text`.  
- **Disabled interactive elements:** add `aria-disabled="true"` or `disabled` and `cursor-not-allowed`; do **not** attach click handlers.  
- **Draggable regions:** default `cursor-grab`, switch to `cursor-grabbing` while dragging.  
- **Movable canvases/maps:** `cursor-move`.  
- **Resizable edges/handles:** `ns-resize`, `ew-resize`, `nesw-resize`, `nwse-resize`, etc.  
- **Zoomable media:** `zoom-in` / `zoom-out`.  
- **Loading:** show **`progress`** when the UI remains responsive; show **`wait`** only for blocking operations longer than a moment.  
Map these via Tailwind classes (e.g., `cursor-pointer`) or component props. The source of truth is the token map, not ad-hoc values. See MDN for supported values. :contentReference[oaicite:0]{index=0}

### 11.2 State model (hover, focus, pressed, selected, disabled)
Follow Material 3 interaction states (hover, focus, pressed, selected, disabled). Use your tokenized opacities and focus ring. Combine states (e.g., focused + selected) as needed, but avoid conflicting visuals. :contentReference[oaicite:1]{index=1}

- **Focus:** Use `:focus-visible` and the tokenized focus ring (`global.states.focus_ring`). Do **not** remove focus indicators.  
- **Pressed:** Apply `global.states.opacity.pressed` on press down; keep for ≥80ms for perceptibility.  
- **Hover:** Treat as a hint only; never the sole indicator of interactivity.

### 11.3 Hover/focus content (tooltips, menus, popovers)
When content appears on hover or focus, ensure it is:
- **Dismissible** (Esc key or clear close control),
- **Hoverable** (pointer can move over it without it disappearing),
- **Persistent** (stays until dismissed or focus/hover moves away).  
Implement per WCAG 2.2 SC 1.4.13. :contentReference[oaicite:2]{index=2}

### 11.4 Semantics first
Prefer semantic elements:
- Use `<a href>` for links, `<button>` for actions, proper inputs for form controls. If you must create custom widgets, follow ARIA Authoring Practices (roles, focus, keyboard). :contentReference[oaicite:3]{index=3}

### 11.5 Pointer/target accessibility
- Maintain minimum target sizes (≥24×24 CSS px) and spacing per a11y guidance.  
- Pointer interactions must have keyboard equivalents (no drag-only actions). :contentReference[oaicite:4]{index=4}

### 11.6 Implementation checklist
- **Tokens:** Use `global.cursors` + `interaction_states` for all interactive components.  
- **Tailwind:** apply `cursor-*` utilities from tokens; avoid hard-coding.  
- **Shadcn:** set default cursor per variant/state (e.g., disabled → `not-allowed`).  
- **Keyboard:** verify focus order and `:focus-visible` ring.  
- **WCAG 2.2:** test hover/focus content for dismissible/hoverable/persistent.

> Reference: MDN `cursor`, WCAG 2.2 (SC 1.4.13), Material 3 states, and WAI-ARIA APG. :contentReference[oaicite:5]{index=5}

---

## 12. Layout & Alignment Playbook

**Purpose.** Keep key UI parts aligned and predictable when text length varies (e.g., testimonial quotes). These are best-practice rules the agent should apply by default.

### A) Pick the right layout tool
- **One axis (stack with header/body/footer):** use **Flexbox**; `display:flex; flex-direction:column;` enables easy vertical distribution. :contentReference[oaicite:1]{index=1}
- **Two axes / equal rows & columns:** use **CSS Grid** and let items **stretch**; on the grid container set `align-items: stretch`. :contentReference[oaicite:2]{index=2}

### B) Pin important regions (don’t let footers “float”)
- Structure cards **header → body → spacer → footer**.  
  - Flex: put `margin-top:auto` on the spacer or footer.  
  - Grid: keep the card as a grid/flex and align the footer to the end.  
  This prevents the author/CTA block from drifting when the body text grows. :contentReference[oaicite:3]{index=3}
- Avoid absolute positioning for routine alignment; it harms responsive reflow. Ensure layouts reflow without two-direction scrolling. :contentReference[oaicite:4]{index=4}

### C) Make sibling cards the same visual height
- On the **row container** (grid or flex-wrap), use **stretch** alignment.  
- On each **card**, use `height:100%` and a sensible `min-height` (responsive) so very short content doesn’t collapse. Prefer layout stretch over hard-coded fixed heights. :contentReference[oaicite:5]{index=5}

### D) Control variable-length text (without breaking a11y)
- Clamp long blurbs (quotes/descriptions) so footers align:  
  - Prefer `line-clamp` (progressively enhance; check support). For single-line cases use `text-overflow: ellipsis`. :contentReference[oaicite:6]{index=6}
- **Never clamp primary labels** (e.g., names). Clamp **secondary meta** (e.g., location) instead.

### E) Responsive rhythm & spacing
- Scale spacing or gaps with `clamp()` (e.g., `gap: clamp(12px, 2vw, 24px)`) to keep density consistent across viewports. :contentReference[oaicite:7]{index=7}
- Start mobile-first; add columns at larger breakpoints via Grid/Flex rather than ad-hoc one-off rules. :contentReference[oaicite:8]{index=8}

### F) Accessibility guardrails to always apply
- **Reflow:** content must work at 320 CSS px without horizontal scroll (WCAG 2.2 **1.4.10 Reflow**). :contentReference[oaicite:9]{index=9}
- **Custom widgets:** if you build non-native interactive patterns (menus, listboxes, etc.), follow **WAI-ARIA APG** for roles, keyboard and focus. :contentReference[oaicite:10]{index=10}

### G) Canonical card recipe (use for testimonials/reviews)
- Container: grid/list with `align-items: stretch` so all cards are equal height. :contentReference[oaicite:11]{index=11}
- Inside each card:  
  1) header (e.g., stars),  
  2) body text **clamped** (4–6 lines by breakpoint),  
  3) spacer (`mt-auto` in Flex),  
  4) footer (author name **not clamped**; location 1-line clamp if needed). :contentReference[oaicite:12]{index=12}

### H) Quick QA checklist (agents)
- [ ] Footers (author/CTA) align along a common baseline within each row.  
- [ ] Quotes are clamped; they never push footers off-card. :contentReference[oaicite:13]{index=13}  
- [ ] Row uses stretch; every card is equal visual height. :contentReference[oaicite:14]{index=14}  
- [ ] Layout passes 320-px **Reflow** (no horizontal scrolling). :contentReference[oaicite:15]{index=15}  
- [ ] Any custom widget matches APG keyboard & focus patterns. :contentReference[oaicite:16]{index=16}

---

## 13. Performance and Maintainability

- **Purge CSS automatically:** Tailwind’s Just‑in‑Time (JIT) engine removes unused styles automatically, keeping your bundle small. Make sure `content` in `tailwind.config.ts` includes all files with classes (e.g., `src/**/*.tsx`).
- **Avoid class bloat:** Even though classes are cheap, aim to keep markup concise by grouping related classes logically and avoiding redundant classes. Do not use `@apply` in this project, but create small helper components instead.
- **Optimise images:** Use `priority` and `placeholder="blur"` on critical images to improve LCP; compress assets and use modern formats (WebP/AVIF) when possible.
- **Lazy load icons and components:** Import icons individually to reduce bundle size; code-split heavy components with dynamic imports.

---

## 14. Tailwind Plugins

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