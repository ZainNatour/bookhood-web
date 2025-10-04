
# Data Fetching Recipes

---

## Purpose

This document provides patterns for fetching data and submitting forms in a **Next.js App Router** application.  
It covers **Server Components**, **Client Components** using **TanStack Query** or **SWR**, and forms handled via **Server Actions** or **route handlers**.  
Use these recipes as reference when building new pages.

---

## Server Component Data Fetch

Server Components run only on the server and can fetch data directly from databases, APIs, or file systems.  
They support caching and revalidation out of the box.

---

### Basic Fetch with Default Caching

```tsx
// app/blog/page.tsx
import { Suspense } from 'react';
import PostsList from './posts-list';

export const revalidate = 60; // Revalidate data every 60 seconds

export default function BlogPage() {
  return (
    <section>
      <h1>Blog</h1>
      <Suspense fallback={<p>Loading posts…</p>}>
        <PostsList />
      </Suspense>
    </section>
  );
}

// app/blog/posts-list.tsx
export default async function PostsList() {
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json());
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
````

The `revalidate` export triggers **time-based revalidation**, refreshing the cache at most once per interval [1].
Without specifying `revalidate`, Next.js caches the fetch response indefinitely.

---

### Opting Out of Caching

Pass `{ cache: 'no-store' }` in `fetch()` to disable caching and fetch fresh data on every request [2]:

```ts
const data = await fetch('/api/realtime', { cache: 'no-store' }).then((res) => res.json());
```

---

### On-Demand Revalidation

Use `revalidateTag()` or `revalidatePath()` in a **Server Action** to invalidate cached data when mutating it.
Example:

```ts
// app/admin/posts/new/submit.ts
import { revalidateTag } from 'next/cache';

export const createPost = async (formData) => {
  'use server';
  await db.createPost(formData);
  revalidateTag('posts');
};
```

Then tag your fetch call:

```ts
fetch('/api/posts', { next: { tags: ['posts'] } });
```

When `revalidateTag('posts')` is called, cached responses with that tag are invalidated [3].

---

## Client Fetch with TanStack Query or SWR

For data that must update in real time or on user interaction, use a **client state library**.
**TanStack Query** and **SWR** handle caching, refetching, and mutations automatically.
They are ideal for dashboards, forms, and interactive pages.

---

### TanStack Query Pattern

```tsx
// app/dashboard/page.tsx (Client Component)
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery(['posts'], fetchPosts);
  const mutation = useMutation(createPost, {
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  });

  if (isLoading) return <p>Loading…</p>;

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <button
        onClick={() => mutation.mutate({ title: 'New Post' })}
        disabled={mutation.isLoading}
      >
        Add Post
      </button>
    </div>
  );
}

async function fetchPosts() {
  const res = await fetch('/api/posts');
  return res.json();
}

async function createPost(data) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

---

### SWR Pattern

SWR (*stale-while-revalidate*) automatically revalidates data in the background:

```tsx
import useSWR from 'swr';

export default function Profile() {
  const { data, error, mutate } = useSWR('/api/user', fetcher);
  if (error) return <p>Failed to load</p>;
  if (!data) return <p>Loading…</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

async function fetcher(url) {
  const res = await fetch(url);
  return res.json();
}
```

Use `mutate()` or `trigger()` to revalidate SWR caches.
Combine SWR with a **debounce hook** for search suggestions.

---

## Form Submission Patterns

### Server Actions

Server Actions let you handle form submissions on the server without writing a separate API route.
They are asynchronous functions defined inside a Server Component or in `app/route.ts` files.
They must be annotated with `'use server'` and accept **serializable arguments** [4].

Example:

```tsx
// app/contact/page.tsx
'use client';
import { sendMessage } from './actions';

export default function ContactPage() {
  const action = async (formData) => {
    await sendMessage(formData);
    alert('Thank you for your message!');
  };
  return (
    <form action={action} className="space-y-4">
      <input name="name" type="text" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}

// app/contact/actions.ts
export async function sendMessage(formData) {
  'use server';
  const { name, email, message } = Object.fromEntries(formData);
  await db.saveMessage({ name, email, message });
  // on success, revalidate affected data if necessary
}
```

Server Actions automatically handle **POST** requests and integrate with **caching** and **revalidation** [4].

---

### Route Handlers

Use route handlers (`app/api/.../route.ts`) for API endpoints that:

* Need to be accessed by **external clients**
* Support multiple **HTTP methods**
* Perform **complex logic**

Route handlers can still use server utilities and set cookies.
Choose route handlers for operations like **Stripe webhooks**, **open endpoints**, or when you need explicit control over HTTP methods [5].

When using route handlers, call them from Client Components via `fetch()` or via **TanStack Query**.
Use your `lib/api` wrapper to handle authentication and errors (see `API_CLIENT.md`).

---

## Summary

Choose the appropriate fetching pattern based on context:

* Use **Server Components** for static or periodically updated data; leverage `revalidate` and tags for caching.
* Use **TanStack Query** or **SWR** for interactive pages requiring client-side updates and caching.
* Use **Server Actions** for simple, internal form submissions.
* Use **route handlers** for external or multi-method APIs [5][6].

Always handle errors gracefully and provide loading states.

---

---

