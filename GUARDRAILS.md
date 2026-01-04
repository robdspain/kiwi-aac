# Repo Guardrails (Change Boundaries)
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Fragile Files (Do Not Touch lightly)
- `src/plugins/revenuecat.ts`: Core monetization logic.
- `src/utils/db.js`: Persistence layer for media.
- `public/sw.js`: Service worker registration.

### 2. Allowed Refactor Scope
- **State:** Moving state into a Context is encouraged for cleaner props.
- **Styling:** Moving inline styles to CSS modules or `index.css` is encouraged.
- **Naming:** Renaming files is allowed IF the `import` map is updated globally.

### 3. Change Rules
- **No new dependencies:** Approval required before adding to `package.json`.
- **Invariants:** No changes allowed that violate rules in `AAC_INVARIANTS.md`.
- **Acceptance:** Any behavior change must be reflected by an update to `ACCEPTANCE.md`.
