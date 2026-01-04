# Source-of-Truth Map (Architecture)
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. State Ownership

| Domain | Owner (Context/Service) | Persistence |
| :--- | :--- | :--- |
| **Selection** | `EmojiCurator.jsx` | Transient (until saved) |
| **Board Layout** | `App.jsx` (rootItems) | `localStorage` (JSON) |
| **Profiles** | `ProfileContext.jsx` | `localStorage` (Array) |
| **Access Profile** | `ProfileContext.jsx` | `localStorage` (Nested Object) |
| **Settings** | `App.jsx` / `Controls.jsx` | `localStorage` (Single Keys) |
| **Analytics** | `AnalyticsService.js` | `localStorage` (JSON) |
| **Media (Binary)** | `db.js` | `IndexedDB` |

### 2. Persistence Layer Patterns
- **localStorage:** Used for structured JSON (up to 5MB). If data exceeds this, it must be migrated to IndexedDB.
- **IndexedDB:** Dedicated to binary blobs (photos, audio) and heavy datasets.
- **Cloud (Neon):** Primary sync for device-to-device transfer and anonymous restore.

### 3. Sync & Conflict Rules
- **Conflict Resolution:** Local wins on most recent write. Cloud is treated as a backup/restore source unless "Team Sync" is active.
- **Write Frequency:** Writes to local storage happen on every state change (debounced). Writes to cloud happen on app backgrounding or manual trigger.

### 4. Versioning & Migrations
- **Schema Version:** Current `2.1`.
- **Migration Strategy:** The `App.jsx` component checks the version integer on mount. If older than 2.1, it triggers the `migrate()` utility to wrap flat arrays into the new page structure.
