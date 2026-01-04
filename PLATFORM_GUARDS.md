# Platform Guardrails
## Project: Kiwi Voice
## Last Updated: January 2, 2026

The following APIs are fragile and must always be wrapped in `try/catch` with a fallback.

### 1. `navigator.vibrate` & Haptics
- **Guard:** Check if `navigator.vibrate` exists before calling.
- **Capacitor Fallback:** Use `@capacitor/haptics` for native devices.
- **Fail Pattern:** Log warning and continue; do not interrupt user flow.

### 2. Web Speech API
- **Autoplay:** iOS/Safari will block `synth.speak` unless it follows a user click.
- **Voice Loading:** `window.speechSynthesis.getVoices()` is asynchronous on some browsers. Must listen for `voiceschanged` event.

### 3. File Downloads (Safari/iOS)
- **Safari constraint:** `window.open` or `a.click()` for blob URLs may be blocked if not directly in a click handler.
- **Fallback:** Show a manual "Download File" link if the programmatic click fails.

### 4. Camera/Mic Permissions
- **Capacitor:** Always check `Camera.checkPermissions()` before invoking the picker.
- **Privacy:** Provide a clear "Missing Permissions" explanation if the user previously denied access.

### 5. Storage Quotas
- **localStorage:** Limited to 5MB. Catch `QuotaExceededError` and prompt the user to delete old analytics or large photos.
- **IndexedDB:** Private/Incognito mode may disable IndexedDB entirely. Check availability on app start.
