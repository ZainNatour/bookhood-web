# STATE & DATA MANAGEMENT

> **Note:** This file is formatted for AI model consumption (GPT-5). All content is preserved verbatim; only formatting is applied for clarity and structure.

---

## Purpose

Modern web applications juggle two broad categories of state:

1. **Local UI state** (e.g., form inputs, toggles, modals) and shared client state (e.g., theme, user authentication) held in React components.
2. **Server or remote state** (e.g., database records, API responses) that must be fetched and cached.

This guide explains when to fetch data on the server versus the client, how to choose a data-fetching library, how to configure caching and revalidation, and how to structure code for mutations, parallel fetching, and error handling.

---

## Server vs Client Data Fetching

- **Server fetching:** Use Server Components to perform data fetching. Call your data layer or backend API directly via `fetch()` or a database client. The result is used to pre-render HTML and delivered to the client.
- **Route Handlers:** Use `app/api/**/route.ts` for server endpoints called from the frontend. Handle custom HTTP methods and return JSON or perform side effects.
- **Client fetching:** For client-side interactions (e.g., search suggestions), start with server fetching but fall back to client fetching when necessary. Never expose sensitive credentials or database access to Client Components; use the `server-only` package to enforce this.

**Best Practice:**  
- Fetch data in Server Components by default. Fetch on the client only when data must be updated after initial render or tied to client interactions.
- Use Route Handlers to encapsulate complex server logic and return JSON.
- Never expose secrets or server code to the client; always import `server-only` at the top of files that interact with the database or secrets.

---

## Client State and Data

### Local State and Context

- Use `useState` or `useReducer` for local component state.
- Lift state up to the nearest common parent or use React Context to share state between distant components. Context is recommended for global app state (e.g., authentication, theme).
- Avoid over-architecting state: using `useState` and Context is often sufficient.

### Remote State and Data-Fetching Library

- **Standard:** TanStack Query (formerly React Query).
- Use TanStack Query for caching, deduplication, invalidation, retries, pagination, and optimistic updates.
- Integrates well with App Router and supports SSR/SSG.

**Usage:**  
1. Create a `QueryClient` in your root layout and wrap the app with `<QueryClientProvider>`.
2. On SSR/SSG pages, prefetch queries on the server using `prefetchQuery`, dehydrate the cache with `dehydrate(queryClient)`, and pass the result to the client. Wrap your client tree in `<Hydrate>` to rehydrate the cache.
3. Use `useQuery` hooks for reading data and `useMutation` for writing data.
4. Always provide loading and error states in your UI components. Use a `<Suspense>` boundary for skeletons or spinners.

### Global State Library

- **Standard:** Zustand.
- Use Zustand for sharing state across disparate components without prop drilling or heavy context management.
- Keep stores small and focused; avoid putting all app state into a single store.
- Do not store server data in Zustand unless the data is user-specific and needs immediate client access.

---

## Caching & Revalidation

- Next.js automatically caches `fetch()` requests in Server Components using the `force-cache` strategy.
- Requests are not cached when inside a Server Action, POST route handler, or when `cache: 'no-store'` is set.

**Caching Strategy Table:**

| Scenario | Recommended Setting | Rationale |
|---|---|---|
| Static/infrequently changing data | `force-cache` (default) or time-based revalidation | Stores responses in the Next.js Data Cache. Add `revalidate = <seconds>` for periodic refresh. |
| User-specific/rapidly changing data | No store (`cache: 'no-store'` or `revalidate = 0`) | Always fetch fresh data for dynamic content. |
| Data updated via actions | On-demand revalidation (`revalidatePath()` or `revalidateTag()`) | Trigger cache invalidation when data changes. |

**Time-based revalidation:**  
Set a revalidation interval using the `revalidate` option to refresh cached data after a set time.

```js
export const revalidate = 60; // Refresh every minute
```

**On-demand revalidation:**  
Call `revalidatePath()` or `revalidateTag()` from within a Server Action or Route Handler.

**Opting out of caching:**  
For always-fresh data, use `{ cache: 'no-store' }` or `revalidate = 0`.

---

## Parallel vs Sequential Fetching

- **Parallel fetching:** Use `Promise.all()` or multiple `useQuery` hooks for independent requests.
- **Sequential fetching:** Use only when requests depend on each other.

**Example:**

```js
const userPromise = fetch('https://api.example.com/user');
const ordersPromise = fetch('https://api.example.com/orders');
const [userRes, ordersRes] = await Promise.all([userPromise, ordersPromise]);
const user = await userRes.json();
const orders = await ordersRes.json();
```

Wrap parallel queries in a `<Suspense>` boundary and provide fallback UI.

---

## Server Actions & Mutations

- **Server Actions:** Async functions with `"use server"` directive. Run on the server, can mutate the database, and return updated data/UI in one round trip. Invoked via POST from Client Components.
- **Route Handlers:** For endpoints supporting multiple HTTP methods or intended for public/external consumption.

**Guidelines:**  
- Use Server Actions for UI-tied mutations, internal operations, and simple side effects.
- Use Route Handlers for multi-method endpoints, external clients, complex or reusable business logic, and middleware.

---

## Client Data Hydration

- **Prefetch on the server:** Use `prefetchQuery()`.
- **Dehydrate and pass state:** Use `dehydrate(queryClient)` and include in page props.
- **Rehydrate on the client:** Wrap with `<Hydrate state={dehydratedState}>` and `QueryClientProvider`.

**When to use prefetch & hydrate:**  
- For SEO and initial render performance.
- For complex server-dependent pages.
- For client-only interactions, fetch data entirely on the client.

---

## Server-Only Code Separation

- Create a `/lib/server` directory for database clients, secret keys, and server-only helpers.
- Import `server-only` at the top of every server-only module.

---

## URL State (optional)

- Use **nuqs** to synchronize UI state with query parameters.
- Use query parameters for shareable/bookmarkable state (filters, sorting, search, pagination).
- Do not store sensitive or large data in the URL.
- Sync with global state when needed.

---

## Error and Loading Handling

- **Loading:** Use `<Suspense>` boundaries for parallel fetches and `useQuery`. Provide skeletons or spinners. Use inline loaders for small elements.
- **Error:** Use `<ErrorBoundary>` for route components or root trees. Display user-friendly messages and retry options. Handle query errors with context-specific messages and retry buttons.

---

## Summary

By following these practices you can confidently manage local and remote state, fetch data efficiently, cache and revalidate content, and ensure sensitive operations stay server-side. Server-first data fetching reduces waterfalls and improves security. TanStack Query handles remote state with caching and rehydration. Zustand provides a lightweight global state store. Next.js caching and revalidation mechanisms let you tune freshness per endpoint. Use parallel fetches to speed up data loading, choose Server Actions for internal operations or Route Handlers for public APIs, store shareable state in the URL via nuqs, and always provide clear loading and error boundaries for a responsive user experience.

---