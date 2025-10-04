# API Client: Standard Guidelines for Consuming the Backend API

## Purpose

The API client file defines how the frontend calls the BookHood backend API, which is described by an OpenAPI specification. Using a single source of truth for API interaction ensures consistency across pages, improves type safety, and reduces duplication. This guide describes how to generate a client from the OpenAPI spec, wrap it with shared logic (base URL, authentication, headers, timeouts, retries), and adopt industry‑standard practices for error handling, token management, logging, caching, debouncing, and throttling.

---

## What is an OpenAPI‑generated client?

An OpenAPI specification is a machine‑readable file (usually JSON or YAML) that describes every endpoint of your backend: methods, paths, request/response bodies, error types, and authentication schemes. Tools such as `openapi-generator` or `openapi-typescript` can consume this spec and produce a typed client—a set of TypeScript functions that wrap each endpoint. These functions include correct request and response types, eliminating manual fetch calls and reducing errors. You can configure the generated client to use axios or the native fetch API internally. In this project we generate a client library (e.g., `@bookhood/api-client-web`) that exposes typed methods for every endpoint. You import and use these methods instead of writing raw fetch calls.

---

## 1. Client Implementation and Wrapper

- **Select a client library:** Use the generated client from your OpenAPI spec (e.g., `@bookhood/api-client-web`). This package is produced at build time and uses axios as the underlying HTTP engine. You do not need to generate types manually; the generator creates TypeScript types and functions for you. If you later switch to another engine, regenerate the client with that configuration.
- **Centralised wrapper (`lib/api/client.ts`):** Create a wrapper module that imports the generated client and applies cross‑cutting concerns such as:
    - **Base URL:** Set a single base URL (`NEXT_PUBLIC_API_BASE_URL`) so that all requests point to the correct environment. Changing the base URL in one place updates every endpoint.
    - **Authentication:** Attach cookies or tokens to each request. The wrapper reads the current access token from memory or session storage (see §3) and adds it to the Authorization header or relies on `withCredentials` for cookie‑based auth.
    - **Default headers:** Define common headers (`Content-Type: application/json`, `Accept: application/json`) to avoid repetition.
    - **Error handling:** Intercept responses and map Problem Details errors to UI notifications (see §2).
    - **Timeouts:** Apply a global request timeout (e.g., 10 s) using axios’ timeout option or AbortController for fetch[^1]. See §4 for rules.
    - **Interceptors and middleware:** In axios, request interceptors and response interceptors run before sending the request and after receiving the response. Use them to inject headers, attach tokens, log requests, and transform errors. If you choose another HTTP client (e.g. ky or fetch), implement similar middleware to achieve the same functionality. Interceptors differ from server‑side middleware: they run inside the browser/client and do not modify server routing.

---

## 2. Error Handling and Problem Details

- **Adopt RFC 9457:** Use the Problem Details standard for all error responses. This specification provides a consistent schema with fields `type`, `title`, `status`, `detail`, and `instance`[^2].
- **Extensions:** Include the optional `code` (an internal error code) and `errors` array to capture field‑level validation errors. SmartBear recommends clearly defining these extensions and publishing a JSON schema to ensure clients ignore unknown fields[^3]. Each item in the `errors` array should contain `detail`, `pointer` (JSON pointer to the offending field), and/or `parameter` (name of the query/path parameter)[^4].

**Error schema:**

```json
{
    "type": "string",
    "title": "string",
    "status": 400,
    "detail": "string",
    "instance": "string",
    "code": "string",
    "errors": [
        {
            "detail": "string",
            "pointer": "/data/attributes/field",
            "parameter": "string"
        }
    ]
}
```

- **Mapping to the UI:**
    - Show `title` and/or `detail` in a toast notification for global errors.
    - For validation errors, map each `errors[]` entry to the corresponding form field. Use the `pointer` or `parameter` values to identify the target.
    - Log the `type` and `instance` values for debugging.
    - Clients must ignore unknown extensions (fields not documented in your schema)[^3].

---

## 3. Authentication and Token Management

### 3.1 Token Storage Strategy

- **Memory + HttpOnly cookie approach:** Store the access token in browser memory (e.g., React context or a service singleton) and the refresh token in an HttpOnly, Secure, SameSite=strict cookie[^5]. This prevents JavaScript from reading the refresh token (mitigating XSS) while allowing the browser to send it automatically with requests. The access token lives only in memory or session storage; it disappears when the tab closes[^5].
- **Cookie flags:** Set `httpOnly` to prevent JavaScript access; `secure` to ensure cookies only travel over HTTPS; and `sameSite=strict` (or lax if cross‑domain) to mitigate CSRF[^5].
- **Refresh flow:** When the access token nears expiry (e.g., within 5 minutes), call the backend refresh endpoint (via the wrapper) to obtain a new access token[^5]. Retry the original request after refreshing. If the refresh fails (refresh token expired or invalid), clear tokens and redirect to sign in.
- **CSRF protection:** For state‑changing requests, include an anti‑CSRF token (e.g., read from a cookie and send in a header) along with the HttpOnly cookie. This prevents malicious sites from forging authenticated requests.

### 3.2 Wrapper Responsibilities for Auth

- **Attach tokens:** The wrapper adds the access token to the `Authorization: Bearer <token>` header on each request. Use `withCredentials: true` for axios or set `credentials: 'include'` for fetch to send cookies.
- **Handle 401/403:** If the backend returns 401 (unauthenticated) or 403 (forbidden) due to an expired token, the wrapper should automatically call the refresh endpoint. Upon success, retry the original request once. If refresh fails, log out the user.
- **Pre‑emptive refresh:** Refresh access tokens proactively on route changes or at regular intervals (e.g., every 15 minutes) to reduce the probability of expired tokens disrupting user flows.

---

## 4. Timeouts and Retry Strategy

### 4.1 Timeouts

- **Default request timeout:** The browser’s default fetch timeout is ~300 s, which is far too long[^1]. Set a global client timeout of 10 seconds using axios’ timeout option or an AbortController wrapper[^6].
- **Page‑specific overrides:** For long‑running operations (e.g., exporting reports), allow a longer timeout by passing an explicit timeout parameter to the wrapper. For quick endpoints (e.g., live search), you can shorten the timeout to improve responsiveness. The agent should choose timeouts based on expected backend performance.

### 4.2 Retry Logic

- **Retryable errors:** Retry on transient failures: 5xx errors (500, 502, 503, 504), network errors, and timeouts. For 429 (Too Many Requests), honour the `Retry-After` header or delay at least 60 seconds before retrying. Do not retry on client errors (4xx) other than 429.
- **Maximum attempts:** Attempt a request at most 3 times (initial attempt + 2 retries). Set a global maximum but allow the wrapper to accept a per‑request override.
- **Exponential backoff with jitter:** After each retryable error, double the delay (e.g., 0.5 s → 1 s → 2 s) and add random jitter (±50 %) to avoid thundering‑herd patterns[^7]. This reduces server overload.
- **Overall timeout:** When using retries, cap the total elapsed time (including retries and backoff) to avoid infinite waits. If the overall timeout is reached, surface an error to the UI.

---

## 5. Throttling and Debouncing

- **Debouncing user input:** Use debouncing for search boxes and auto‑save forms. Wait 400–500 ms after the user stops typing before sending the request[^8]. Implement a `useDebounce` hook or use Lodash’s `debounce` function[^9]. Debounce delays should be configurable per component; choose longer delays for heavy operations.
- **Throttling high‑frequency events:** Use throttling for events that fire rapidly (scroll, resize, mouse move). Limit handlers to run once every 200–300 ms[^10]. For rate‑limited API endpoints, throttle requests to avoid hitting quotas; adjust intervals based on the endpoint’s limit.
- **Choosing between debounce and throttle:** Debounce when you care only about the final event (e.g., user stops typing); throttle when you need periodic updates while the event continues (e.g., scroll position). Always clean up timers in `useEffect` to avoid memory leaks[^11].
- **Libraries vs custom hooks:** Standardise on using Lodash for debounce and throttle functions in the API layer. Lodash’s implementations are battle‑tested; still, custom hooks may be used in component code when needed. Avoid implementing your own debounce/throttle logic unless you need React‑specific behaviour.

---

## 6. Concurrency and Abort Control

- **Concurrency limits:** Avoid overwhelming the backend with too many simultaneous requests. Limit the number of in‑flight API calls to 5 per user. For pages that need to fetch many small resources, group requests or paginate. Agents should consider whether an operation is bandwidth‑intensive and adjust concurrency accordingly.
- **Abort on navigation:** Use AbortController to cancel ongoing requests when the user navigates away or changes filters. This prevents race conditions and wasted network bandwidth. For example, attach a unique AbortController to each fetch and call `controller.abort()` in the `useEffect` cleanup or a route change handler.

---

## 7. Base URL, Versioning and Environment Configuration

- **Base URL resolution:** Read the base API URL from a single environment variable such as `NEXT_PUBLIC_API_BASE_URL`. Provide separate values for development, staging and production. Do not hard‑code hostnames. The wrapper should append `/v1` or another version path automatically.
- **Version negotiation:** Use path versioning (e.g., `/api/v1/users`) by default, as it is explicit and simple to implement. If the backend supports header negotiation (e.g., `Accept: application/vnd.bookhood+json;version=2`), document how to set the header in the wrapper. The agent should choose path versioning unless there is a compelling need for header negotiation.
- **Environment switching:** For mobile apps or tests pointing to different backends, the wrapper should accept an override for the base URL. For example, pass `{ baseURL: 'https://staging-api.example.com' }` when instantiating the client.

---

## 8. Logging and Observability

- **Configurable logging:** Use a lightweight logger (e.g., pino or `console.debug`) to log request/response metadata, timings, retries and errors. The wrapper should read an env var (e.g., `NEXT_PUBLIC_ENABLE_API_LOGS`) to decide whether to emit logs. This allows debugging without polluting production consoles.
- **Sensitive data:** Do not log access tokens, refresh tokens, passwords or any personally identifiable information. Mask sensitive headers and payloads before logging.
- **Correlation IDs:** Generate a unique request ID per API call (e.g., using `crypto.randomUUID()`). Set it in an `X-Request-Id` header so the backend can include it in logs and error responses. This aids tracing across distributed systems.
- **Error reporting:** Forward unhandled errors to an external monitoring service (e.g., Sentry). Include the correlation ID and Problem Details fields to aid debugging.

---

## 9. External APIs and Secrets

- **No third‑party secrets in the client:** Never embed API keys or secrets for external services in the frontend. Instead, call external services via your backend (Backend‑for‑Frontend/BFF pattern). The backend stores the keys securely (e.g., environment variables or a secrets manager) and proxies requests.
- **Public API keys:** If a third‑party API provides a public key (intended for the browser), you can embed it in code. However, treat such keys as non‑sensitive and still restrict them using allowed origins or quotas. Consider routing these calls through the backend for consistent logging and retry logic.
- **API gateway or proxy:** Optionally create a backend proxy route (e.g., `/api/external/google`) that forwards requests to the external service. Apply the same timeout and retry policies as internal API calls. This ensures consistent error handling and simplifies CORS.

---

## 10. Rules and Playbooks

The API client must adapt to varying scenarios. The following playbooks define when to apply the techniques above:

- **Caching vs no-store:**
    - Default: allow Next.js to cache GET requests in Server Components. When data must always be fresh (e.g., user notifications), call the endpoint with `{ cache: 'no-store' }`[^12].
    - Use time‑based revalidation (`revalidate: 60`) for lists that change occasionally (e.g., catalogue pages)[^13]. Set the interval according to how often the data changes. Use on‑demand revalidation (`revalidatePath`/`revalidateTag`) after mutations to refresh specific pages[^14].

- **When to use server actions vs route handlers:**
    - Use Server Actions for form submissions, sign‑in, sign‑up, and other internal mutations that require POST and return updated UI[^15]. They run on the server, integrate with Next.js caching and revalidation, and reduce client boilerplate.
    - Use Route Handlers (e.g., `/app/api/user/route.ts`) for public APIs, webhooks, or when multiple HTTP methods (GET, PUT, DELETE) are needed[^16]. They are accessible by any client and are better for external integrations. A Server Action can call a route handler internally.

- **When to use time‑based revalidation:** Use revalidation when data updates regularly but not on every request (e.g., news feed). Choose an interval that balances freshness and performance. For high‑frequency data, prefer no-store.

- **When to use on‑demand revalidation:** After a successful mutation (e.g., user creates a post), call `revalidatePath('/posts')` or `revalidateTag('posts')` to refresh affected pages immediately[^17].

- **Retry rulebook:**
    - Retry on 5xx, 408, 429 and network errors. Do not retry on 4xx client errors (except 429). Use exponential backoff with jitter[^7].
    - Maximum 3 attempts (configurable). Implement global backoff delays (e.g., 0.5 s, 1 s, 2 s). For 429 with a Retry-After header, wait the specified time.
    - Use an overall cap on total retry time (e.g., 30 s) to avoid long waits.

- **Timeout rulebook:**
    - Default timeout: 10 seconds. Use shorter timeouts (5 s) for predictive or auto‑complete queries. Use longer timeouts (30 s) for file uploads or report generation.
    - Expose a per‑request override parameter to allow the caller to set a custom timeout.

- **Debounce/throttle rulebook:**
    - Debounce search/autocomplete inputs at 400–500 ms; throttle scroll or resize events at 200–300 ms[^8][^10].
    - Use Lodash’s debounce/throttle functions; create wrappers (e.g., `useDebounce`) for React components.
    - For expensive endpoints (e.g., sending analytics), throttle to match the backend’s rate limits (e.g., one call per second).

- **Concurrency rulebook:**
    - Limit global concurrent API calls to 5 by default. For pages that need to fetch multiple small resources, group them into a single API call when possible or increase the limit temporarily.
    - Cancel or suspend new requests if the concurrency limit is reached until previous requests complete.

- **Abort on route change:**
    - When using `useEffect` for data fetching in Client Components, create an AbortController and call `abort()` in the cleanup function. When using the wrapper, provide a helper that ties the request lifecycle to a unique controller ID and aborts it on navigation or on filter change.

- **Versioning rulebook:**
    - Default to path versioning (e.g., `/v1/`). If you need to support multiple versions concurrently, maintain separate clients (e.g., `@bookhood/api-client-web-v2`) or parameterize the base path. Avoid mixing header versioning with path versioning unless there is a clear requirement.

- **Logging & observability rulebook:**
    - Use an environment variable (e.g., `NEXT_PUBLIC_ENABLE_API_LOGS`) to toggle logging. Log request method, URL, status, duration, retry count, and correlation ID. Do not log request or response bodies containing sensitive data.
    - Generate a unique request ID per call and set it in the `X-Request-Id` header. Include this ID in error logs so that backend logs can correlate the request.
    - When logging is disabled, the wrapper should not perform any side effects (no debug output). Always respect user privacy.

- **Third‑party services rulebook:**
    - Never embed private API keys in the frontend. Make all calls to external services through your backend. If a public API key is truly public, still restrict its usage (allowed domains, quotas) and treat it as non-sensitive.
    - Consider creating backend proxy endpoints (e.g., `/api/proxy/<service>`) for external API calls. The proxy can implement your standard timeout, retry and logging policies and keep keys secret.

---

## 11. Conclusion

This API client guide brings all the best practices together to simplify data fetching, error handling, authentication and performance tuning in your Next.js application. By centralising configuration, unifying error shapes, and enforcing sensible defaults with overridable playbooks, your frontend becomes easier to reason about and your coding agent can focus on business logic instead of plumbing.