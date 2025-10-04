# Rendering Strategy Playbook

This guide helps the AI agent decide how to render each page in the Next.js App Router. Modern Next.js supports multiple rendering modes—SSR, SSG, ISR, CSR—and hybrid approaches using React Server Components and streaming. There is no one‑size‑fits‑all solution: the agent should choose based on each page’s purpose, data requirements, SEO importance, and interactivity. The playbooks below provide criteria and examples for when to use each technique.

---

## Choosing a Rendering Method

### Server‑Side Rendering (SSR)

SSR generates HTML on every request. It delivers fresh data and improves SEO but increases server load and time‑to‑first‑byte (TTFB).  
**Use SSR when:**
- **User‑specific or authenticated content:** dashboards, profiles, account pages, or any page requiring login. Each request must reflect the latest user state.
- **Real‑time data or frequently changing information:** live dashboards, trading platforms, or pages showing current inventory or pricing.
- **SEO matters for dynamic content:** landing pages that personalise content based on location, cookies, or AB tests.
- **No caching or revalidation is appropriate:** critical updates must be served fresh each time. In these cases, set `cache: 'no-store'` in your server fetch calls to opt out of caching.

**Implementation notes:**
1. Use Server Components by default. Only mark Client Components when you need interactivity (`'use client'`).
2. Avoid blocking the entire response. Instead, break the page into smaller Server Components and use streaming (see below) to send parts of the page as soon as they’re ready.
3. Do not embed sensitive data in the HTML; filter and sanitise objects before passing them to Client Components.
4. Document the decision in the page header, e.g.:  
    `// Rendering: SSR – personalised dashboard.`

---

### Static Site Generation (SSG)

SSG pre‑builds HTML at compile time. This yields the fastest performance, excellent SEO, and zero runtime server cost.  
**Use SSG when:**
- **Content is public and rarely changes:** marketing pages, product documentation, blog posts, landing pages.
- **SEO is critical:** pages intended to rank on search engines. Search bots can index pre‑rendered markup easily.
- **Page data can be fetched ahead of time:** you can fetch the content at build time or from a CMS via draft mode.

**Implementation notes:**
1. Declare `export const dynamic = 'force-static'` (optional) or rely on default caching; do not call dynamic APIs (`cache: 'no-store'`) in Server Components.
2. Use `generateStaticParams` to define static paths when there are dynamic route segments (e.g., `[slug]`).
3. Document the decision:  
    `// Rendering: SSG – blog article.`

---

### Incremental Static Regeneration (ISR)

ISR blends SSG with freshness by adding revalidation. It generates static pages at build time and regenerates them on demand.  
**Use ISR when:**
- **You have lots of pages or frequently updated public content:** e‑commerce product listings, news articles, or dynamic catalogs.
- **Data updates at predictable intervals:** stock tickers, daily deals, or any feed where periodic freshness is sufficient.
- **You want CDN caching and performance of SSG but need updates without a full rebuild.**

**Playbook for revalidation:**
1. **Time‑based revalidation:** add `export const revalidate = <seconds>` to the page file. Choose a sensible default (e.g., 60 seconds) when data changes frequently. For content updated hourly or daily, set higher values.
2. **On‑demand revalidation:** use `revalidatePath('/route')` or `revalidateTag('tag')` in Server Actions after data mutations (e.g., create/edit/delete). This provides immediate freshness after updates.
3. When in doubt, start with time‑based revalidation and add on‑demand for specific mutations.
4. Document the strategy:  
    `// Rendering: ISR (revalidate: 60)`  
    or  
    `// Rendering: ISR with revalidateTag('product-list').`

---

### Client‑Side Rendering (CSR)

CSR renders HTML only in the browser. It downloads minimal HTML and JavaScript and hydrates the UI client‑side.  
**Use CSR sparingly** because it yields the slowest initial load and poorest SEO.  
**Suitable scenarios:**
- **Private dashboards and admin areas** where SEO is irrelevant and the data is user‑specific.
- **Highly interactive apps** that rely heavily on client state and real‑time updates (e.g., spreadsheets, design tools).
- **Single‑page applications (SPAs)** served via `/app` with no pre-rendered HTML. Use `Next.js app/spa.tsx` or dynamic SSR fallback to handle them.

**Implementation notes:**
1. Mark the root component `'use client'` and fetch data inside the Client Component using TanStack Query or other libraries.
2. Provide skeletons and error boundaries while data loads.
3. Document:  
    `// Rendering: CSR – admin dashboard.`

---

### Streaming and Suspense

Streaming is a rendering technique where the server sends HTML chunks to the client as soon as they’re ready, instead of waiting for the entire page to render. In Next.js, streaming is enabled by default for Server Components wrapped in Suspense. It improves first contentful paint and user experience.

**Guidelines:**
1. Wrap dynamic components in `<Suspense>` with a fallback UI (e.g., skeleton). This allows their content to stream separately while static content displays immediately.
2. Choose a standard fallback component (e.g., `LoadingSpinner` or `SkeletonSection`) for consistent UX. Pages may override the fallback if they have unique requirements.
3. Use streaming for pages with independent sections—such as product pages (static details + dynamic recommendations) or dashboards (static layout + live widgets).
4. Avoid streaming extremely small components if the overhead outweighs benefits.
5. Document streaming usage in the page file (e.g.,  
    `// Streaming: Suspense used for <Recommendations />`).

---

### Sensitive Data

- **Never expose secrets or private data** in pre‑rendered HTML or Client Components. Only access environment variables from Server Components or a Data Access Layer. Filter and sanitise objects before passing them to the client.
- Place database queries and secret operations in server files (`lib/server/*`) and import server-only to enforce server‑only execution.
- Use React Taint APIs to mark sensitive values as server‑only when needed.
- Document sensitive data decisions in your data access code, not in page comments.

---

## Hybrid Pages and Decision Flow

Modern Next.js encourages hybrid pages combining static, dynamic, and client components.  
**Use the following decision flow when building each page:**

1. **Is the data user-specific or sensitive?**  
    Yes → prefer SSR or client‑side (CSR) and avoid SSG/ISR. Enforce authentication and filter data.
2. **Is the content public and infrequently changing?**  
    Yes → use SSG. If there are many pages or minor updates, choose ISR with a sensible revalidation interval.
3. **Does the page require real-time or personalised data for SEO?**  
    Yes → use SSR with streaming.
4. **Is the page part of a private dashboard?**  
    Yes → use CSR or SSR with streaming, but skip SEO considerations.
5. **Are there independent sections that can load separately?**  
    Yes → wrap them in Suspense for streaming.
6. **Does the page combine static and dynamic segments?**  
    Yes → adopt a hybrid approach: pre-render static shell (SSG/ISR) and stream dynamic parts (SSR with Suspense).
7. **Is partial prerendering (PPR) needed?**  
    This is experimental and not recommended in production. Do not enable PPR.

---

## Per‑Page Documentation

For maintainability, every page file (`app/.../page.tsx`) should include a header comment summarising its rendering strategy, revalidation interval, and any streaming or hybrid details. For example:

```js
// Rendering: ISR (revalidate: 60) + streaming
// This page serves a public product list.  It regenerates every minute and streams recommendations separately.
export const revalidate = 60;

import { Suspense } from 'react';
import ProductList from './ProductList';
import Recommendations from './Recommendations';

export default function Page() {
  return (
     <>
        <ProductList />
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations />
        </Suspense>
     </>
  );
}
```

If a page uses the default rendering mode (e.g., SSG for static marketing pages), you may omit the comment for brevity. However, always document departures from the default.

---

## Summary

This playbook empowers the AI agent to select the optimal rendering strategy for each page. By balancing freshness, performance, and SEO—and by following security and streaming guidelines—you can build a Next.js application that delivers fast, secure, and scalable experiences. Revisit this document whenever you introduce new pages or features.