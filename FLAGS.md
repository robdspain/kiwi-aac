# Feature Flags & Contracts
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Source of Truth
Feature availability is controlled via `src/config/features.js` (or `.env` for production toggles).

### 2. The "Coming Soon" Contract
- **Rule:** If a feature is disabled, the entry point (button/route) must be hidden or clearly labeled "Coming Soon".
- **Rule:** Never leave a button that points to a crashing/blank screen or a pending module.
- **Rule:** Do not wire experimental features into the core `App.jsx` unless they are gated by a flag.

### 3. Current Flags
- `VITE_ENABLE_AI_VISION`: Gated behind high-performance device check.
- `VITE_STRICT_STORE_MODE`: Disables web-specific download links for App Store compliance.
