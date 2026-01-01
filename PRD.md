# PRODUCT REQUIREMENT DOCUMENT (PRD) - KIWI AAC
## Project: Library Builder v3.2

### 1. Project Overview
Kiwi AAC is a specialized tool designed to curate and customize icon libraries for Augmentative and Alternative Communication (AAC). It allows users (caregivers, therapists, or developers) to browse, filter, skin-tone-customize, and export a specific set of emojis/icons for use in communication boards.

### 2. Objectives
- Provide a high-performance, mobile-first interface for emoji selection.
- Support standard AAC requirements: high contrast, large touch targets, and skin tone diversity.
- Export selected icons in a standardized JSON format (`iconsData.json`).
- Achieve full compliance for iOS App Store and Google Play Store deployment as a PWA/Hybrid app.

---

### 3. Functional Requirements

#### 3.1. Browser & Search
- [x] **Category Navigation:** Sidebar navigation for major emoji groups.
- [x] **Search bar:** Real-time filtering of icons by name or character.
- [ ] **Search Enhancements:** Add "Clear Search" button.
- [ ] **Full Dataset:** Replace placeholder `emojiData.js` with the complete Unicode emoji set.

#### 3.2. Selection & Curation
- [x] **Single Select:** Toggle individual icons.
- [x] **Bulk Select:** "Select All" and "Deselect" buttons for current categories.
- [x] **Visual Feedback:** Clear selection badges and highlight states.
- [x] **Persistence:** Track selected items across category switches.

#### 3.3. Customization
- [x] **Skin Tone Picker:** Long-press/Right-click access to variation selector.
- [x] **Variation Logic:** Automatically link base emojis to their skin-tone modifiers.
- [ ] **Accessibility:** Focus trapping and keyboard management for the picker.

#### 3.4. Export
- [x] **JSON Export:** Download `iconsData.json` containing name and character mapping.
- [ ] **Schema Validation:** Ensure exported JSON matches the target AAC app requirements.

---

### 4. Non-Functional Requirements

#### 4.1. Performance
- [x] **Build Size:** Maintain optimized production builds via Vite.
- [x] **Processing:** Pre-process emoji grouping on initial load (currently in `EmojiCurator.jsx`).
- [ ] **Lazy Loading:** Implement for the grid if the dataset becomes very large.

#### 4.2. UI/UX & Responsive Design
- [x] **Responsive Layout:** Adaptive sidebar (desktop) vs. Drawer (mobile).
- [x] **Safe Areas:** Support for notches and home bars (`env(safe-area-inset)`).
- [ ] **Theme Consistency:** Resolve conflicts between `index.css` (dark) and Component (light).

#### 4.3. Accessibility (AAC Specific)
- [x] **Touch Targets:** Large targets (>44px).
- [x] **ARIA Labels:** Basic labeling for screen readers.
- [ ] **Focus Management:** Full keyboard navigation support (grid focus, picker trap).
- [ ] **Haptic Feedback:** Vibrate on long-press (implemented but requires testing on physical devices).

---

### 5. Store & Platform Compliance

#### 5.1. PWA Requirements
- [ ] **Manifest:** Create `manifest.json` with icons, theme colors, and display mode.
- [ ] **Service Worker:** Basic offline support and caching.

#### 5.2. iOS / Android Assets
- [ ] **App Icons:** 1024x1024 (iOS) and 512x512 (Android) source assets.
- [ ] **Splash Screens:** Native-style launch images.

---

### 6. Roadmap & Implementation Status

| Phase | Feature | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core Infrastructure (Vite, React, Linting) | **COMPLETE** |
| **Phase 2** | UI Framework (Curator, Grid, Sidebar) | **COMPLETE** |
| **Phase 3** | Logic (Skin Tone, Selection, Export) | **COMPLETE** |
| **Phase 4** | Accessibility & Focus Management | **IN PROGRESS** |
| **Phase 5** | PWA & Store Readiness | **PENDING** |
| **Phase 6** | Full Dataset Integration | **PENDING** |
