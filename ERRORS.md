# Error Handling & UX Copy
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Toast & Error Usage
- **Success:** Green background, checkmark, 2s duration (e.g., "Saved!").
- **Warning:** Yellow background, 4s duration (e.g., "Storage almost full").
- **Error:** Red background, requires manual dismissal or 6s duration.

### 2. Copy Patterns
- **Do:** "Try again in a few seconds."
- **Do:** "We couldn't load your voice. Please check your internet."
- **Don't:** "Fatal error: 0x08234".
- **Don't:** "NULL pointer exception in grid".

### 3. Logging Rules
- **Privacy:** NEVER log personal words, child names, or photos.
- **Redaction:** Redact any PII from error logs before syncing to cloud.
- **Level:** Use `console.error` for breaking bugs and `console.warn` for platform API fallbacks.
