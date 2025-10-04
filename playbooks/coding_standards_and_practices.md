## purpose

This document defines the coding practices and standards for the Next.js application, specifically tailored for AI coding agents such as OpenAI GPT-5. It summarizes well‑established guidelines from trusted sources and must be read by the AI model before generating or modifying code. The goal is to ensure clean, maintainable, and secure code throughout the project. Each section below contains actionable recommendations.

## Naming Conventions and Variable Declarations

- **Meaningful names** – Use short but descriptive names. Variables should not use non‑common abbreviations or archaic prefixes. Collections should be plural, and identifiers should be written in camelCase. Avoid Hungarian notation and names like myCar that add unnecessary articles.
- **Use let and const** – Declare variables with let or const instead of var and prefer const when the value does not change. Declare one variable per line to improve clarity. Use destructuring when appropriate.
- **Function names** – Name functions with camelCase starting with a lowercase letter, and choose names that reveal the function’s purpose (e.g., getUserData rather than getData). Prefer function declarations over function expressions when defining reusable functions. Use arrow functions for callbacks when they do not need their own this and prefer implicit returns for concise callbacks.
- **Custom hooks and components** – In React, components must begin with a capital letter and custom hooks must start with use to signal that they call other hooks. Functions that do not call hooks must not be prefixed with use.

## Functions and Components

- **Small and focused** – Keep functions and components small. A function should perform a single task and a component should ideally represent one visual or logical unit. If a function or component becomes too complex, refactor it into smaller pieces.
- **Container–presenter pattern** – Separate data fetching and state management from rendering when practical. Presentational components handle only UI, while container components handle state and logic. This pattern increases reusability and testability, although hooks can sometimes replace containers.
- **Custom hooks** – Encapsulate reusable logic in custom hooks to avoid duplicating the same useEffect, data fetching or form logic across components. Follow naming conventions and avoid conditional hook calls.

## Comments and Documentation

- **Self‑explanatory code** – Write code that is clear without comments. Use comments sparingly to explain why something is done, not what the code does. Do not restate obvious code behavior.
- **Single‑line comments** – Use // for single‑line comments and start with a capital letter; place the comment above the line or block it refers to. Avoid /* … */ multi‑line comments unless marking intentionally unused parameters.
- **Project documentation** – Maintain an up‑to‑date README describing setup, development commands, build steps and deployment. Document API endpoints using OpenAPI/Swagger or at least a Markdown file listing each route’s request and response schema. For internal utilities, use JSDoc or TSdoc to generate documentation automatically.

## DRY, KISS and YAGNI Principles

- **DRY (Don’t Repeat Yourself)** – Each piece of knowledge should have a single, authoritative representation. Repetitive code leads to bugs when changes are made in one place but not the others. Consolidate duplicate logic into functions, classes or modules. Consolidation reduces maintenance effort and leads to cleaner code.
- **KISS (Keep It Simple, Stupid)** – Favour simple solutions and straightforward algorithms over complex ones whenever possible. Simple code is easier to understand, debug and maintain.
- **YAGNI (You Aren’t Gonna Need It)** – Don’t implement features or optimizations before they are required. Building capabilities “just in case” wastes time and leads to unnecessary complexity.

## Design Patterns and Structure

- **Composition over inheritance** – Compose functionality using functions and hooks instead of deep inheritance hierarchies. This improves flexibility and testability.
- **React patterns** – Use container–presenter separation when components become complex; otherwise rely on custom hooks and simple function components to encapsulate logic. Avoid mixing responsibilities in a single component.
- **Node/Nest patterns** – On the backend, use layered architecture (controllers → services → data access) and dependency injection (NestJS provides DI by default). Keep controllers thin; put business logic in services. Use entities/models to represent database structures.

## Environment Configuration

- **Environment variables** – Store configuration settings (API keys, database URLs, ports, third‑party credentials) in environment variables instead of hardcoding them. Do not commit .env files containing secrets to version control. Use a .env.example template to illustrate required variables without values.
- **Loading order** – Next.js loads environment variables in a specific order: process.env, .env.$(NODE_ENV).local, .env.local (except when NODE_ENV is test), .env.$(NODE_ENV), .env. Values prefixed with NEXT_PUBLIC_ become part of the client bundle and are available in the browser.
- **Keep secrets outside committed code** – Use environment‑aware, secure configuration. Config keys should support reading from files and environment variables. Sensitive secrets must remain outside committed code; config should be hierarchical and validated; specify a default for each key. Tools like dotenv, convict, or env-var can help with schema validation. Check that required variables exist before starting the application to avoid partial failures.
- **Separate environment files** – Maintain environment‑specific .env files (e.g., .development.env, .production.env) to separate configuration for different stages. For Node versions prior to v20, use a package like dotenv to load env files; Node v20 supports --env-file flags.

## Dependency Management

- **Install necessary dependencies** – Add dependencies when you first scaffold the project. Document their purpose in the package.json comments or project docs. Avoid installing unused packages.
- **Semantic versioning** – Use semantic version ranges carefully. Pin exact versions for stability or use caret (^) for minor updates; avoid leaving dependencies unbounded. Follow npm’s guidelines and keep package-lock.json committed to ensure identical versions across environments.
- **Audit dependencies** – Run npm audit regularly or integrate it into CI to identify vulnerabilities and outdated packages. Use npm audit fix to automatically fix vulnerabilities, but review semver-major changes before upgrading.

## Tooling and Formatting

- **ESLint** – Configure ESLint with recommended rules and project‑specific rules. ESLint identifies problematic patterns, enforces best practices, and can be customized for your codebase.
- **Prettier** – Use Prettier as an opinionated code formatter. Prettier parses your code and reprints it with consistent formatting, ignoring any style differences. Combine Prettier with ESLint using eslint-plugin-prettier to run Prettier as part of the lint process.
- **EditorConfig** – Provide an .editorconfig file to enforce indentation, line endings and encoding across different editors.
- **TypeScript** – Use TypeScript for type safety. Keep types simple and avoid over‑complicating type definitions. Use interfaces and types to model shapes of objects rather than complex generics unless necessary.

## Git Hooks and Continuous Integration

- **Pre‑commit hooks** – Use a pre-commit hook (via Husky or a similar tool) to run linters, type checks and tests before code is committed. A pre-commit script runs before the commit message is entered and aborts the commit on non‑zero exit status. You can also check for whitespace errors or run code formatters automatically.
- **CI pipeline** – Configure a simple CI workflow (e.g., GitHub Actions) that runs on push and pull request events. The pipeline should install dependencies, run npm run lint, npm run test, and build the application. Optionally, run npm audit and upload coverage reports.

## Additional Considerations

- **Error handling** – Use asynchronous error handling (async/await with try–catch). Create custom error classes extending the built‑in Error to unify error structure across the project; differentiate between operational and programmer errors for better resilience.
- **Logging** – Use structured logging (e.g., Pino) and ensure logs include timestamps and request identifiers. Avoid logging secrets. Consider integrating a monitoring tool for real‑time observability.
- **Modularization** – Organize code by feature rather than by type. For example, group all files related to user profiles under a profile/ directory containing component, hook, API call and style files. This improves cohesion and discoverability.
- **Tests** – Write unit tests for core utilities and components; use integration tests and end‑to‑end tests for full flows. Ensure tests run consistently in CI and use a test database or mocks for backend interactions.

## Conclusion

Following these coding practices helps maintain a clean, consistent and secure codebase. AI coding agents must adopt these guidelines early, refine them as the project evolves, and document any deviations in Architecture Decision Records (ADRs). Always consult this document and the associated playbooks before writing or reviewing code.

---