# Web Coding and Architecture Rules

These rules define how the agent writes and extends web projects: consistent layering, predictable code, and maintainable structure. They are static defaults; adjust only if a project’s spec explicitly says otherwise.

---

## 1) Layered Architecture (strict)

```
UI (components/pages) → State/Controllers (hooks/stores) → Services (API/IO) → Domain Models & Utilities
```

- Allowed dependencies flow only to the right; never import UI from state/services, never call services directly from dumb/presentational components.
- Keep cross-cutting helpers (formatters, validation, feature flags) in utilities; they must stay pure and framework-agnostic.

---

## 2) UI Layer (components/pages)

- Framework-agnostic defaults; if React/Next/Vite is present, follow their conventions.
- Responsibilities: render data, raise events, minimal derived UI logic only.
- Avoid side effects and I/O in UI components. Fetching/async orchestration lives in hooks/state modules.
- Keep components small and composable; prefer props over global state. Use stable keys and avoid inline heavy callbacks in hot paths.
- Styling: follow the project’s existing system (CSS modules, Tailwind, styled components, etc.). Do not introduce a new styling library without approval.

### 2.1 File Extensions and Syntax Rules
- UI components must use `.tsx`.
- Hooks/controllers must use `.ts`.
- Services must use `.ts`.
- Domain models and utilities must use `.ts`.
- Use ESM imports (`import … from`) exclusively; no CommonJS (`require`, `module.exports`).

### 2.2 Side Effect Limitations
- No top-level side effects in any module.
- Do not instantiate global clients (e.g., API clients) at module load time.
- Services must export factories or pure functions, not singletons.
- UI components must not mutate global state outside allowed stores/hooks.

---

## 3) State / Controllers (hooks/stores)

- Owns screen/stateful logic: data fetching, mutations, optimistic updates, validation, permission checks, and mapping domain data to UI-ready shapes.
- May coordinate multiple services; never embed rendering concerns.
- Keep state isolated per feature; avoid global singletons unless project already uses them.
- Expose small, typed APIs: `useFeature()` hooks, store slices, or controller classes. Return plain data + callbacks; avoid exposing raw service clients to UI.

---

## 4) Services (API/IO)

- Sole location for side effects and external boundaries (HTTP, storage, auth, analytics, feature flags, 3rd-party SDKs).
- No UI framework imports. Keep services deterministic and parameter-driven; avoid hidden globals.
- Input/output must be typed; prefer thin DTO mappers to decouple transport from domain models.
- Handle retries/backoff/timeouts where appropriate; surface structured errors to state layer.

---

## 5) Domain Models & Utilities

- Define canonical types, schemas, and business rules here. Keep pure and side-effect free.
- Prefer TypeScript types/interfaces; use runtime validation (e.g., zod/Valibot) only if the project already uses it or the spec requires it.
- Keep formatting, parsing, and calculation helpers here; they must not reach into services or UI.

### 5.1 Architecture Safety Boundaries
Do NOT introduce the following unless explicitly required by the spec:
- repositories
- factories
- DI containers
- service locators
- mediator/event-bus layers

Keep the architecture minimal and flat.

---

## 6) Error Handling

- Fail loud in development (clear errors, console logs with context); fail soft in production (user-friendly messaging, safe fallbacks).
- Services: wrap low-level errors and return typed results (success/error). Avoid throwing raw network errors into UI.
- State/controllers decide how to degrade (retry, stale data, empty state). UI only renders the chosen state.

---

## 7) Testing Philosophy

- Unit test domain utilities and service adapters with mocked I/O.
- Integration test service + API boundaries using fixtures or test servers where available.
- Component tests focus on behavior, not implementation details; prefer testing hooks/state logic in isolation.
- Keep test data minimal and realistic; prefer factories/builders over copy-paste blobs.

---

## 8) Performance & Data

- Avoid redundant requests; cache via state layer or existing query libraries. Batch network calls where it fits.
- Be mindful of render churn: memoize expensive computations, stable dependencies for hooks, avoid recreating functions/objects in tight loops.
- Paginate or virtualize lists when counts are unbounded. Stream/pipe large payloads only in services.

---

## 9) Security & Privacy

- Do not log secrets or PII. Sanitize user input at boundaries. Escape/encode output for the target context.
- Respect existing auth flows; do not invent new token/storage patterns without approval.
- Use HTTPS-only endpoints; handle token refresh/expiration in services, not UI components.

---

## 10) Agent Interaction Rules

- Read before editing: relevant code, `docs/specs.md`, `docs/component-map.md`, and `docs/todo.md` when present.
- Respect layering: UI ↔ state ↔ services ↔ domain. Do not bypass layers or mix concerns.
- Follow existing patterns in the repo (routing, state management, styling, API clients). Do not introduce major dependencies or frameworks without explicit approval.
- Update `docs/component-map.md` when adding/renaming/moving components, services, hooks, or notable `// MARK`-style sections used for navigation.
- Keep changes minimal and scoped to the requested task; avoid drive-by refactors.

### 10.1 Component Map Responsibilities
Whenever adding or modifying a component, update `docs/component-map.md` with:
- File path
- Component type (UI/state/service/domain)
- Purpose
- Exported API

Keep entries small, factual, and aligned with the project tree.

---

## 11) File Organization & Naming

- Prefer one main export per file. Names should be descriptive and aligned with the layer (e.g., `useInvoices`, `invoices.service`, `invoice.types`).
- Group feature code by domain/feature folders when possible: `feature/Component`, `feature/state`, `feature/service`, `feature/types`.
- Keep barrel files small and intentional; avoid accidental circular deps.

### 11.1 File Structure Markers
For agent navigation, use these section markers:

UI components:
- `// SECTION: rendering`
- `// SECTION: events`
- `// SECTION: props`

Hooks/state:
- `// SECTION: state`
- `// SECTION: effects`
- `// SECTION: actions`

Services:
- `// API:`
- `// HELPERS:`

Domain:
- `// TYPES:`
- `// PARSERS:`
- `// VALIDATORS:`

---

## 12) Summary

These rules enforce a predictable web stack: clean layering, typed boundaries, and minimal coupling. Use them unless the project spec or existing codebase defines stricter alternatives.
