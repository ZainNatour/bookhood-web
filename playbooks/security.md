
This configuration allows scripts/styles only from your own origin or those explicitly whitelisted with a nonce [6].  
The `frame-ancestors 'none'` directive prevents your site from being embedded in iframes or other frames, which mitigates clickjacking [7].

### 3. Dynamic Rendering Required
Nonce support requires pages to be dynamically rendered; static pages generated at build time cannot inject a nonce [8].  
Use middleware to force dynamic rendering for routes that need a nonce.  
Next.js automatically attaches the nonce to framework scripts and `<Script>` components [9].

### 4. SRI Fallback
If you need to support static generation, consider **Subresource Integrity (SRI)**.  
SRI allows you to include hash values of allowed scripts/styles in the CSP header.  
However, this is currently experimental and not recommended for production [10].

---

## Clickjacking Prevention

Clickjacking occurs when an attacker embeds your site in an iframe and tricks users into interacting with it.  
To prevent this:

- Use the `frame-ancestors` directive in CSP set to `'none'` (recommended) or `'self'` to limit framing to your own domain [7].
- As a secondary fallback for browsers that don’t support CSP, send an `X-Frame-Options` header with `DENY` to disallow framing, or `SAMEORIGIN` to allow only same-origin framing [11].

---

## Secure Cookie Storage

- **HttpOnly & Secure:**  
  Store authentication tokens (refresh tokens) in cookies with the `HttpOnly` and `Secure` flags.  
  This prevents JavaScript access and ensures cookies are sent only over HTTPS [12].

- **SameSite:**  
  Set `SameSite=strict` (or at minimum `lax`) to reduce cross-site request forgery (CSRF) risk.  
  Strict mode prevents the cookie from being sent on any third-party requests, while lax allows sending cookies for top-level navigations.

- **No localStorage for tokens:**  
  Never store tokens or secrets in localStorage or plain JavaScript variables; they can be accessed by malicious scripts [12].

- **CSRF protections:**  
  When using cookies for auth, implement CSRF protection (e.g., by including a CSRF token header on all state-changing requests).  
  Use libraries such as `csurf` for Express or built-in middleware in Next.js route handlers.

- **Refresh strategy:**  
  Keep short-lived access tokens in memory and refresh them using a secure server endpoint.  
  Store only the refresh token in a cookie.  
  This reduces exposure in the browser and provides a predictable refresh mechanism [12].

---

## Cross-Site Scripting (XSS) and Input Validation

- **Validate on the server:**  
  Always validate user inputs on the server, rejecting unexpected values (e.g., numeric fields should contain only numbers) [13].  
  Client-side validation is helpful for UX but should never be the only defense layer.

- **Sanitize untrusted HTML:**  
  If you must render user-generated HTML, sanitize it using a library like `DOMPurify` [14].  
  React escapes strings by default; avoid using `dangerouslySetInnerHTML`.

- **Avoid inline scripts and event handlers:**  
  Do not use inline event handlers (e.g., `onclick`) or inline scripts.  
  Use external scripts or event bindings [15].  
  Pair with a strong CSP to restrict script sources [16].

- **Use server-only for sensitive logic:**  
  Mark server-only modules with the `server-only` package to ensure they cannot be imported in client code [17].  
  Sensitive values (e.g., user passwords, secret keys) should never be passed to client components [18].

---

## Input Sanitization and Server-Side Validation

- **Sanitize output before sending to client:**  
  When returning data from your server, remove any fields that shouldn’t be exposed (e.g., hash fields, access levels).  
  A well-meaning developer might inadvertently expose the entire row from the database in a Client Component; always sanitize to include only public fields [19].

- **Taint API & data propagation:**  
  Use Next.js Taint APIs to mark values as server-only and track data flows.  
  This helps detect when sensitive values might leak into the client [20].

---

## Additional Security Headers and Policies

- **X-Content-Type-Options:**  
  Set to `nosniff` to prevent MIME type sniffing, which can lead to code execution.

- **Referrer-Policy:**  
  Set to `no-referrer` or `strict-origin` to limit referrer information.

- **Permissions-Policy:**  
  Use to control access to features like camera, microphone, geolocation, and more.

- **Strict-Transport-Security (HSTS):**  
  Enforce HTTPS by setting `max-age=63072000; includeSubDomains; preload` on your responses.

- **Subresource Integrity:**  
  When loading third-party scripts or stylesheets, include an `integrity` attribute with a SHA-256 or stronger hash of the resource and a `crossorigin` attribute.  
  Combine with CSP to allow these hashes [10].

---

## Summary

The goal of these guidelines is to reduce the attack surface of your application.  
Use strict CSP and nonce generation to thwart XSS and clickjacking.  
Store secrets securely with environment variables and HttpOnly cookies.  
Sanitize inputs and outputs to avoid data leakage.  
Apply additional security headers as **defense in depth**.  

Implementing these practices will help keep your Next.js application resilient against common web threats.

---

________________________________________
