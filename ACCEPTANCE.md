# Definition of Done & Acceptance Checks
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Feature: Vocabulary Selection & Persistence
**Happy Path:**
1. Browse to any category (e.g., "Food").
2. Tap 3 icons to select them.
3. Switch categories (e.g., to "Animals").
4. Observe that the selection badges from "Food" are still present when you return to that category.
5. Tap "Save" and verify items appear on the main grid.

**Invariants:**
- **Persistence:** Selected icons must persist across category switches.
- **Scope:** "Select All" must only affect the currently visible category.
- **Motor Planning:** Grid order must remain stable unless manually dragged.

### 2. Feature: Custom Photo Upload
**Happy Path:**
1. Click "+ Add Icon" -> "Camera" or "Library".
2. Take/Select a photo.
3. Enter a label (e.g., "Buddy").
4. Verify the photo is saved to IndexedDB (not just base64 in localStorage).
5. Verify the button appears on the grid with the correct image.

**Outputs:**
- ID format: `custom-{timestamp}`
- Storage: Reference in `kiwi-words-*`, binary in `KiwiMediaDB`.
- Constraint: Max 20 photos on Free tier.

### 3. Feature: Physical Unit Scaling
**Happy Path:**
1. Go to "♿ Access" tab.
2. Change "Hit Area Diameter" to 22mm.
3. Return to the grid and observe significantly larger buttons.
4. Verify that buttons are sized using `px` calculated from `mm` (not just relative `vw/vh`).

**Acceptance Check:**
- Use a physical ruler on an iPad to confirm a 15mm setting is approximately 15mm.

### 4. Feature: JSON Backup & Restore
**Happy Path:**
1. Click "Backup Data".
2. Confirm a `.json` file is downloaded.
3. Clear browser cache/data.
4. Open app -> Click "Restore" -> Select the saved file.
5. Verify all custom vocabulary and media are restored.

**Invariants:**
- **Merge Logic:** Import replaces all current data (destructive restore).
- **Media Mapping:** Media keys in IndexedDB must match the icon references.

### 5. Browser & Platform Constraints
- **Speech API:** On iOS, speech only works after an explicit user interaction (click/tap).
- **Voices:** Premium "Enhanced" voices must be downloaded in iOS system settings to be visible.
- **Quota:** If IndexedDB quota is exceeded, the app must show a "Storage Full" warning instead of crashing.
- **Autoplay:** Speech will not trigger on page load without user gesture.

