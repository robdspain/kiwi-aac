# AAC UI Invariants (Non-Negotiables)
## Project: Kiwi Voice
## Last Updated: January 2, 2026

These rules are essential for maintaining AAC usability and accessibility. They must NEVER be violated during refactors or feature additions.

### 1. Touch Target Minimums
- **Baseline:** Minimum hit area must be **44x44pt** (iOS) or **48x48dp** (Android).
- **Access Profile Override:** If `targetSize` is set in the Access Profile, the hit area MUST strictly respect that physical size (converted from mm).
- **Hit area vs Visual area:** The visual button (the "icon box") can be smaller than the hit area for styling, but the functional tap target must remain consistent.

### 2. Motor Planning Stability
- **Fixed Positions:** Core vocabulary (I, want, more, etc.) must remain in identical grid positions across all boards/pages.
- **Search Logic:** Searching or filtering must NEVER reorder the board. It should hide non-matching items while keeping matching items in their original motor plan positions.
- **Resizing:** When changing grid density (e.g. from 4x4 to 5x5), new cells must be added *around* the core vocabulary rather than shifting existing core buttons.

### 3. Scanning & Switch Access
- **Always Escapable:** The scanning loop must be interruptible (e.g. via Escape key or Back button).
- **Timer Management:** All `setInterval` or `setTimeout` related to auto-scanning must be cleared on component unmount.
- **Text Entry Protection:** Scanning triggers should NEVER hijack keyboard focus if an input field (like Search or Edit Label) is active.

### 4. Visual Contrast & Focus
- **Focus Rings:** A high-visibility focus indicator must ALWAYS be present for keyboard/switch navigation. Standard browser outlines are insufficient; use the project's high-contrast focus theme.
- **Text Contrast:** All labels must meet **WCAG 2.1 AA (4.5:1)** contrast targets. White text is only allowed on dark background variables (e.g., `--fitz-verb`, `--primary-dark`).
- **No Overlapping:** Labels must never overlap icons, even on small screens. If a label is too long, use ellipsis or wrap within the hit area.

### 5. JIT Visual Scenes (AI Vision)
- **Privacy:** All AI object detection MUST happen on-device (via TensorFlow.js). Image data must never be sent to a server.
- **Interactivity:** Hotspots in visual scenes must provide consistent haptic feedback and speech output identical to grid buttons.
- **Escapability:** Full-screen scene views must always have a clear, high-contrast "Back" button to return to the grid.

### 6. Biometric Security
- **Always Accessible:** Biometric locks must NEVER block the user if the hardware fails or authentication is cancelled. A non-biometric fallback (e.g. Triple-Tap) must always be available to prevent permanent lockouts.
- **Platform Awareness:** Biometric prompts should only trigger on native platforms (iOS/Android) where secure hardware is present.
