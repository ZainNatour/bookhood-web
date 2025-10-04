

---

# Performance Playbook

---

## Purpose

This document outlines performance optimization practices for the **Next.js app**.  
It covers **code splitting**, **lazy loading**, **image optimization**, **prefetching**, **script loading**, and **caching strategies**.  
Adhering to these guidelines ensures **fast page loads** and a **responsive user experience**.

---

## Code Splitting & Lazy Loading

### Dynamic Imports with `next/dynamic`

To avoid loading large client bundles on initial page load, use `next/dynamic` to load heavy Client Components or libraries lazily.  
Dynamic imports create separate bundles for the imported modules [1].  

You can specify options such as `ssr: false` to disable server rendering of a Client Component and provide a loading component while the module loads [1].

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('../components/HeavyChart'), {
  loading: () => <p>Loading chart…</p>,
  ssr: false,
});

export default function Dashboard() {
  return (
    <section>
      <h1>Dashboard</h1>
      <HeavyChart />
    </section>
  );
}
````

Dynamic imports may also be used to load external libraries (e.g., `fuse.js`) only when needed [2].
Note that code-splitting isn’t supported for Server Components and `ssr: false` cannot be used in them [3].

---

### React.lazy() & Suspense

You may also use `React.lazy()` with `Suspense` for lazy loading.
Wrap the component in `<Suspense fallback={...}>` and provide a fallback UI while it loads.
However, **Next.js does not prefetch modules imported with `React.lazy()`**.

---

### Shared Libraries and Dependencies

Identify large third-party dependencies (e.g., charts, maps) and load them dynamically.
Remove unused dependencies to reduce bundle size.

---

## Image Optimization

### Using `next/image`

Always use Next.js’s `Image` component for images.
It optimizes file formats, generates responsive sizes, and lazy loads images by default.
It requires `width` and `height` props to avoid layout shift.

For images that fill their container, use the `fill` prop with `sizes` to control downloaded sizes.
Configure `remotePatterns` in `next.config.js` if using remote images [4].

---

### Static and Remote Assets

Host your images in `/public` or a CDN.
For remote images, whitelist domains via `images.remotePatterns` in `next.config.js`.
Avoid embedding large images directly in the bundle; link to the optimized image.

---

### SVGs and Icons

Use **SVGs** for icons and vector graphics.
Inline small SVGs as React components; store larger SVG files in `public` and import them as files to allow caching.

---

## Prefetching

Next.js automatically prefetches **code and data** for linked pages in production.
Prefetching splits your application into smaller bundles and loads resources for a route ahead of navigation [5].
It occurs only in production and only for static routes by default [6].

You can disable prefetch for specific links by setting `prefetch={false}` on `<Link>`.

---

### Manual and Hover-Triggered Prefetching

Use `router.prefetch()` to manually prefetch pages triggered by user actions (e.g., on hover).
Hover-triggered prefetching improves perceived performance: call `router.prefetch(path)` inside the `onMouseEnter` event [7].
Use caution with dynamic routes because prefetching them can cause extra network requests.

---

### Prefetching API Data

For pages that fetch data on the client, use **TanStack Query** or **SWR** to prefetch data (see `STATE_AND_DATA.md`).
In **SSR/SSG** pages, prefetch data on the server to avoid waterfalls.

---

## Script Loading

Next.js offers a `<Script>` component to load third-party scripts with different strategies:

* **beforeInteractive:**
  Scripts loaded before hydration; use for critical scripts like bot detection or polyfills.
  Must be placed in the root layout [8].

* **afterInteractive (default):**
  Scripts loaded after hydration; use for analytics and tag managers [8].

* **lazyOnload:**
  Scripts loaded during idle time; use for non-critical scripts [8].

* **worker (experimental):**
  Runs scripts in a Web Worker, requiring `next/script` with an experimental flag.

Place `<Script>` tags near where they are used but avoid blocking rendering.
For external scripts, prefer `strategy="afterInteractive"` or `"lazyOnload"`.

---

## Caching & Revalidation

Next.js caches **fetch responses** and **static resources** by default.
Use `cache: 'no-store'` to disable caching when fresh data is required and define `revalidate` values to specify how often to update cached data (see `STATE_AND_DATA.md`).

Use `next.config.js` to configure **HTTP caching headers** for static assets in `/public`.

---

## Other Performance Tips

* **Avoid unnecessary re-renders:**
  Use `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders.

* **Keep dependencies small:**
  Remove unused polyfills and libraries.
  Use the `next/legacy-polyfills` package only if you support legacy browsers.

* **Measure Core Web Vitals:**
  Use Next.js `useReportWebVitals` to measure **LCP**, **FID**, and **CLS**, and monitor them with an analytics provider.

---

