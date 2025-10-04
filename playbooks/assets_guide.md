
# Assets Guide

---

## Purpose

This document explains how to manage static assets (images, icons, fonts, and other files) in the Next.js application.  
Proper asset management improves **performance**, **caching**, and **maintainability**.

---

## Public Folder

All static assets should be placed in the `public/` directory at the root of the repository.  
Files in `public/` are served at the base URL of your site and can be referenced via `/path` without import statements (e.g., `<img src="/logo.svg" alt="Logo" />`).  

The folder is **not bundled by webpack**; assets are served directly by the **server** or **CDN**.

---

## Caching Headers

By default, assets in `public/` are served with:


Cache-Control: public, max-age=0

````
which means they are not cached across deployments [1].

To enable caching for large or rarely updated assets (e.g., fonts, icons), configure custom headers in `next.config.js`:

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
````

Always include a **fingerprint (hash)** in filenames when caching for long periods (e.g., `logo.f3c1a.svg`) to bust cache when the asset changes.

---

## Images

### next/image

Use the Next.js `Image` component for images to benefit from built-in optimizations such as:

* Automatic resizing
* Responsive loading
* Modern formats

The `Image` component requires `width` and `height` props to avoid layout shift.
For container-filling images, use the `fill` prop and provide a `sizes` attribute [2].

---

### Remote Images

If images are hosted on external domains, configure `images.remotePatterns` in `next.config.js` to whitelist those domains.
Avoid remote images that cannot be cached or resized by Next.js.

---

### Large and Dynamic Images

For images that are large or generated dynamically (e.g., user uploads), use a **CDN** or **object storage** (S3, Cloudinary).
Offload resizing and format conversion to the CDN or the Next.js Image component with remote patterns.

---

## Icons & SVGs

Prefer **scalable vector graphics (SVG)** for icons.
Options include:

* **Inline React components:**
  Convert small SVG icons into React components (e.g., with **SVGR**).
  This allows customizing colors via props or CSS.

* **Import from `public/`:**
  For larger illustrations or icons referenced across many pages, store them in `public/` and reference via
  `<img src="/illustrations/hero.svg" />`.
  Use caching headers for these files.

* **Icon libraries:**
  Use a single icon set (e.g., **Heroicons**, **Lucide**) via package installation or CDN.
  Avoid mixing multiple icon libraries to keep design consistent.

---

## Fonts

Place custom font files in `public/fonts` and reference them in CSS via `@font-face`.
Use the `font-display: swap` property to improve performance and avoid invisible text.

For Google Fonts, use the Next.js `next/font/google` API to load fonts with automatic optimization.
Always specify **fallback fonts**.

---

## Videos & Other Media

Large media files should **not** be committed to the repository.
Host them on a CDN or video hosting service (e.g., **Cloudflare Stream**, **YouTube**) and embed them via `<video>` or `<iframe>` tags.

---

## Robots, Sitemap & Favicons

Add `robots.txt`, `sitemap.xml`, and favicons (e.g., `favicon.ico`, `apple-touch-icon.png`) to the `public/` folder.
See **SEO.md** for guidelines on generating these files.

---