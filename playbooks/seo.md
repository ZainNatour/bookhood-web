# SEO Playbook

---

## Purpose

This document defines how to implement **search-engine optimization (SEO)** in the application using **Next.js 15’s App Router**.  
It specifies how to use the **Metadata API** for titles, descriptions, Open Graph (OG) and Twitter cards, and how to provide **sitemap** and **robots** files.  
It also addresses **dynamic metadata generation** and **streaming metadata**.

---

## Metadata API

### Static Metadata

For pages that do not need dynamic titles or descriptions, export a `metadata` object from the layout or page.  
The object supports fields such as `title`, `description`, `openGraph`, `twitter` and more [1].  
This object is only supported in **Server Components** [1].

#### Example (in `app/(marketing)/about/page.tsx`)
```ts
export const metadata = {
  title: 'About Us – MyApp',
  description: 'Learn more about MyApp and what drives us.',
  openGraph: {
    title: 'About – MyApp',
    description: 'Discover our mission and values.',
    images: [
      {
        url: '/og/about.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About – MyApp',
    description: 'Discover our mission and values.',
    images: ['/og/about.png'],
  },
};
````

---

### Dynamic Metadata

If the page needs to fetch data or compute metadata at runtime, export an async `generateMetadata` function from the page or layout.
This function runs on the **server** and returns a metadata object.
Use it to fetch content (e.g., from a CMS) and compute titles/descriptions [2].
To avoid duplicate fetches, use `React.cache` or a local cache inside `generateMetadata` [2].

#### Example (in `app/blog/[slug]/page.tsx`)

```ts
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: `${post.title} – Blog – MyApp`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage],
    },
  };
}
```

---

### Streaming Metadata

Next.js supports **streaming metadata** for nested layouts.
When `generateMetadata` calls asynchronous functions, metadata can be streamed in parts to the client as soon as it’s ready [2].
Use `cache()` from React to memoize data fetches and avoid duplicate requests [2].

---

## Special Files: Favicon, Sitemap, and Robots

### Favicon and OG Images

Place your icons and OG images in the `public/` directory and reference them in the metadata object.
For example, `openGraph.images` can reference `/og/home.png`.
Favicon files like `favicon.ico` and `apple-touch-icon.png` should also go in `public/`.

---

### robots.txt

Search engine crawlers read `robots.txt` to determine which paths to crawl.
Create either:

* `app/robots.txt` (static), or
* `app/robots.js` / `app/robots.ts` (dynamic)

#### Example: Static robots file (allowing all pages except a private directory)

```
User-Agent: *
Allow: /
Disallow: /private/
Sitemap: https://example.com/sitemap.xml
```

[3]

A dynamic robots file can export a `GET` function returning a **Robots** object.
This allows different rules per user agent and referencing a dynamic sitemap [4].

---

### sitemap.xml

A sitemap helps search engines index pages.
Create either:

* `app/sitemap.xml` (static), or
* `app/sitemap.ts` (dynamic)

A static file lists each page’s URL and optional `lastmod`, `changefreq`, and `priority` [5].

#### Example static sitemap:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-10-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- more entries -->
</urlset>
```

[5]

A dynamic sitemap returns an array of objects with `url`, `lastModified`, `changeFrequency`, and `priority` fields.
Next.js caches dynamic sitemaps by default [6].

---

### Advanced Sitemaps

If your site includes **image** or **video** content, you can add `<image:image>` or `<video:video>` tags to your sitemap.
Next.js supports including additional properties for image or video sitemaps [7].

---

## General SEO Guidelines

• Use meaningful page titles and meta descriptions in all languages your site supports.
Titles should include the site name or brand and unique keywords for the page.
Descriptions should summarise the page content in 150–160 characters.

• Define canonical URLs for pages accessible via multiple URLs (avoid duplicate content).

• Use semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`) for better accessibility and SEO.

• Implement accessible navigation and heading hierarchy (H1, H2, etc.).
Avoid hiding headings purely for SEO as this is considered a deceptive tactic.

---
