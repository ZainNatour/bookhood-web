
# Error Model

---

## Purpose

This document defines the error response structure for our APIs and how the frontend should handle and display errors.  
We adopt **RFC 9457 – Problem Details for HTTP APIs** as the standard envelope for all errors.  

Using a consistent error model improves **debuggability**, **security**, and **user experience** [1].

---

## Problem Details Schema

The base error object contains the following fields:

- **type** *(string)* — A URI reference that identifies the problem type.  
  Use a URL (e.g., `https://example.com/problems/validation-error`) to point to documentation.  
  This field is **required**.

- **title** *(string)* — A short, human-readable summary of the problem type.  
  Do not change from occurrence to occurrence.

- **status** *(number)* — The HTTP status code associated with the error (e.g., 400, 401, 403, 404, 500).

- **detail** *(string)* — A human-readable explanation specific to this occurrence of the problem.  
  Provide context about what went wrong.

- **instance** *(string, optional)* — A URI reference that identifies the specific occurrence of the problem.  
  It could be a request ID or a path.

---

## Extension Fields

RFC 9457 allows adding custom members.  
We extend the base schema with:

- **code** *(string)* — A unique application error code (e.g., `USER_NOT_FOUND`) to allow programmatic handling.  
- **errors** *(array of objects)* — For validation errors, provide an array of objects with `field` and `message` properties describing each invalid field.  
  This helps clients map errors to specific input fields.

Define a JSON Schema describing these extension fields and document how clients should ignore unknown extensions [2].

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ProblemDetails",
  "type": "object",
  "properties": {
    "type": { "type": "string", "format": "uri" },
    "title": { "type": "string" },
    "status": { "type": "integer" },
    "detail": { "type": "string" },
    "instance": { "type": "string", "format": "uri" },
    "code": { "type": "string" },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": { "type": "string" },
          "message": { "type": "string" }
        },
        "required": ["field", "message"]
      }
    }
  },
  "required": ["type", "title", "status", "detail"]
}
````

---

## Examples

### Validation Error *(422 Unprocessable Entity)*

```json
{
  "type": "https://example.com/problems/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "One or more fields were invalid",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Email must be valid" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

### Generic Server Error *(500)*

```json
{
  "type": "https://example.com/problems/internal-server-error",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "An unexpected error occurred"
}
```

---

## Frontend Handling

### Display Rules

* **Global errors (non-field):**
  When `code` or `type` indicates a generic error (401, 403, 404, 500),
  show a **toast or error banner** with `title` and `detail`.
  Provide fallback messages if these fields are absent.

* **Validation errors:**
  For errors with an `errors` array, map each item to its corresponding form field.
  Display the message below the field and set `aria-invalid="true"` on the input.
  Also show a summary (toast) if multiple fields are invalid.

* **Unauthorized (401):**
  When receiving a 401 error, automatically sign the user out or refresh tokens.
  Show a message prompting the user to log in.

* **Forbidden (403):**
  Display a message indicating the action is not permitted.
  Do not retry automatically.

* **Network errors:**
  Use a retry pattern for transient network issues.
  Retry up to a limited number of times with **exponential backoff** (see `API_CLIENT.md`).

---

## Retry Logic

The frontend should **not automatically retry** on validation errors or other client errors (4xx).
Only retry on network failures or idempotent requests returning **500 / 502 / 503 / 504**.
Use the retry guidelines defined in `API_CLIENT.md`.

---

## Logging and Monitoring

All errors should be logged to an observability service (e.g., **Sentry**, **Datadog**) with the `type`, `code`, and `status` fields.
Include the **stack trace** (server side) or **additional context** (client side) for debugging.
For validation errors, log the offending fields for analysis.

---

## Summary

Adopting a consistent **Problem Details error model** allows the frontend to handle errors uniformly and provides clarity for both developers and users.
It also supports extensibility by adding custom fields while preserving the core schema [1].

---

---