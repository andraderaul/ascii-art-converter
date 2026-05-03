# Dual error system: AppError for operational errors, typed classes for AI errors

The app has two error flows with distinct needs. AI analysis errors (`AuthError`, `QuotaError`, `ParseError`) are thrown by adapters, caught in `app.tsx`, and routed to an interactive modal with type-specific actions — that flow already worked and did not need to change. What was missing was handling for operational errors (PNG Export, TXT Export, Capture, localStorage) that were failing silently.

We introduced `AppError` — a plain object shape with `type`, `message`, and an optional `cause` — to cover these operational errors, alongside a custom toast system built on design system tokens. `normalizeError` ensures any `unknown` caught at a boundary becomes an `AppError` before reaching the toast.

The two systems coexist rather than being unified because forcing `AuthError/QuotaError/ParseError` into `AppError` would replace `instanceof` checks with string comparisons for no real gain — the modal already knows exactly what to do with each class, and that logic would not have become simpler.

## Considered Options

- **Migrate everything to `AppError`** — rejected: the AI adapters and `app.tsx` already have a well-defined contract via typed classes. The migration would be refactoring on principle, not out of necessity.
- **Unify everything into toast** — rejected: AI errors require specific instructions and user action (fix API key, retry). Toast is not the right mechanism for that.
- **Keep operational errors silent** — rejected: an export failing without feedback is a broken experience.
