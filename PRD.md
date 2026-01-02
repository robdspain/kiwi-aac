# PRODUCT REQUIREMENT DOCUMENT (PRD) - KIWI VOICE
## Project: Library Builder v3.2

### 1. Project Overview
Kiwi Voice is a specialized tool designed to curate and customize icon libraries for Augmentative and Alternative Communication (AAC). It allows users (caregivers, therapists, or developers) to browse, filter, skin-tone-customize, and export a specific set of emojis/icons for use in communication boards.

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
- [x] **Search Enhancements:** Add "Clear Search" button.
- [x] **Full Dataset:** Replace placeholder `emojiData.js` with the complete Unicode emoji set.

#### 3.2. Selection & Curation
- [x] **Single Select:** Toggle individual icons.
- [x] **Bulk Select:** "Select All" and "Deselect" buttons for current categories.
- [x] **Visual Feedback:** Clear selection badges and highlight states.
- [x] **Persistence:** Track selected items across category switches.

#### 3.3. Customization
- [x] **Skin Tone Picker:** Long-press/Right-click access to variation selector.
- [x] **Variation Logic:** Automatically link base emojis to their skin-tone modifiers.
- [x] **Accessibility:** Focus trapping and keyboard management for the picker.

#### 3.4. Export
- [x] **JSON Export:** Download `iconsData.json` containing name and character mapping.
- [x] **Schema Validation:** Ensure exported JSON matches the target AAC app requirements.

---

### 4. Non-Functional Requirements

#### 4.1. Performance
- [x] **Build Size:** Maintain optimized production builds via Vite.
- [x] **Processing:** Pre-process emoji grouping on initial load (currently in `EmojiCurator.jsx`).
- [x] **Lazy Loading:** Implement for the grid if the dataset becomes very large.

#### 4.2. UI/UX & Responsive Design
- [x] **Responsive Layout:** Adaptive sidebar (desktop) vs. Drawer (mobile).
- [x] **Safe Areas:** Support for notches and home bars (`env(safe-area-inset)`).
- [x] **Theme Consistency:** Resolve conflicts between `index.css` (dark) and Component (light).

#### 4.3. Accessibility (AAC Specific)
- [x] **Touch Targets:** Large targets (>44px).
- [x] **ARIA Labels:** Basic labeling for screen readers.
- [x] **Focus Management:** Full keyboard navigation support (grid focus, picker trap).
- [x] **Haptic Feedback:** Vibrate on long-press (implemented but requires testing on physical devices).

---

### 5. Store & Platform Compliance

#### 5.1. PWA Requirements
- [x] **Manifest:** Create `manifest.json` with icons, theme colors, and display mode.
- [x] **Service Worker:** Basic offline support and caching.

#### 5.2. iOS / Android Assets
- [x] **App Icons:** 1024x1024 (iOS) and 512x512 (Android) source assets.
- [x] **Splash Screens:** Native-style launch images.

---

### 6. Roadmap & Implementation Status

| Phase | Feature | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core Infrastructure (Vite, React, Linting) | **COMPLETE** |
| **Phase 2** | UI Framework (Curator, Grid, Sidebar) | **COMPLETE** |
| **Phase 3** | Logic (Skin Tone, Selection, Export) | **COMPLETE** |
| **Phase 4** | Accessibility & Focus Management | **COMPLETE** |
| **Phase 5** | PWA & Store Readiness | **COMPLETE** |
| **Phase 6** | Full Dataset Integration | **COMPLETE** |
| **Phase 7** | iOS Compliance Polish | **COMPLETE** |
| **Phase 8** | Advanced AAC Features | **COMPLETE** |
| **Phase 9** | Customization & Privacy | **COMPLETE** |
| **Phase 10** | Roadmap Integration | **COMPLETE** |
| **Phase 11** | Market Disruption (Kiwi Edge) | **COMPLETE** |
| **Phase 12** | Context-Aware Intelligence | **COMPLETE** |
| **Phase 13** | Circle of Support (Avatar Builder) | **COMPLETE** |

---

### 7. Phase 7: iOS Compliance Polish (New)
To strictly adhere to iOS Human Interface Guidelines (HIG):

- [x] **Haptics:** Replace `navigator.vibrate` (unsupported on iOS) with `@capacitor/haptics`.
- [x] **Visual Feedback:** Add `:active` states (opacity/scale) to all interactive elements to mimic native touch feedback.
- [x] **Translucency:** Apply `backdrop-filter: blur()` to the Top Navigation Bar and Sidebar for the "Liquid Glass" feel.
- [x] **Loading Skeleton:** Replace the simple lazy loading spinner (if any) or blank space with a skeleton loader during the initial batch render.

---

### 8. Phase 8: Advanced AAC Features (New)

#### 8.1. Linguistic & Clinical Metadata
- [x] **Part of Speech Tagging:** Add a `wordClass` attribute to the data model (Noun, Verb, Adjective, Social) to support Fitzgerald Key color-coding in the target app.
- [x] **Label Customization:** Implement a "Display Label" override field in the curator. This allows renaming complex Unicode names (e.g., "Potable Water" → "Tap") for age-appropriate speech output.
- [x] **Background Color:** Allow setting a specific background color per icon (hex/picker) for visual tracking or coding.

#### 8.2. Guided Selection
- [x] **Core Vocabulary Filter:** Add a "Core vs. Fringe" toggle to isolate high-frequency words (e.g., I, want, go, stop) that constitute 80% of daily speech.
- [x] **Template Pre-sets:** Introduce a "Templates" modal or dropdown allowing users to load curated sets like "First 50 Words" or "School Day" instead of starting from scratch.

---

### 9. Phase 9: Customization & Privacy (New)

#### 9.1. Advanced Selection Logic
- [x] **Exclude List (Blacklist):** Allow therapists to flag specific icons as "Excluded" so they do not appear in search results or the grid, preventing distraction.
- [x] **Image Upload:** Enable uploading custom images (e.g., photo of "Mom") which are encoded (Base64/URI) and stored in `iconsData.json` instead of a standard emoji.

---

### 10. Phase 10: Roadmap Integration (New)
Integrating key features from the product roadmap:

- [x] **Visual Schedule Builder:** Allow users to create and export ordered sequences (e.g., "Morning Routine": Toilet -> Wash Hands -> Brush Teeth) as distinct entities.
- [x] **Skill Tagging:** Add metadata tags for "Essential Skills" (FCR, Wait, Denial) to support the upcoming training modes in Kiwi Voice.

---

### 11. Phase 11: Market Disruption & Kiwi Edge (New)

#### 11.1. Zero-to-Hero Setup
- [x] **Smart Import:** "Bulk Import" engine that takes a text list (e.g., "apple, sit, more") and automatically populates the library with matching icons, skin tones, and tags.
- [x] **QR Code/Link Sync:** Generate a QR code or 6-digit link to instantly share the curated board with another device (e.g., Therapist desktop -> Parent iPad).

#### 11.2. Gestalt Language Processor (GLP) Support
- [x] **Phrase Buttons:** Support "Multi-Icon Gestalts" where a single button represents a full phrase/script (e.g., "Let's go to the park") with a storyboard-style visual.

#### 11.3. Integrated Modeling Mode
- [x] **Guide Mode:** A "Mirror" feature where parents can see a guide highlighting which icons to press, facilitating modeling. (Implementation note: This might be a toggle in the app to highlight core words or specific targets).

#### 11.4. Semantic Intelligence
- [x] **Grammar Inflection Cues:** When a user selects a Pronoun + Verb (e.g., "I" + "Eat"), logically suggest or popup inflection options ("Ate", "Eating"). (Implementation note: Requires basic grammar logic in the builder to tag verbs for inflection).

#### 11.5. Distinguishable Haptics
- [x] **Smart Haptics:** Implement distinct vibration patterns for different word classes (e.g., "Nudge" for Core, "Sharp" for Stop/No).

---

### 12. Phase 12: Context-Aware Intelligence (New)

#### 12.1. Dynamic Context Switching
- [x] **Smart Sidebar (Geofencing):** Simulate context switching based on location (Home, School, Park). Implementation: Add a "Context Simulator" toggle to preview how the sidebar changes based on selected "Location".
- [x] **Time-Based Triggers:** Surface folders based on time of day (Morning, Lunch, Evening). Implementation: Add a "Time Simulator" or rules engine to the builder.

#### 12.2. Visual Intelligence
- [x] **JIT Visual Scenes:** Allow uploading a photo and manually drawing "Hotspots" linked to icons/words (simulating AI object detection for now).

#### 12.3. Predictive Logic
- [x] **Semantic Prediction:** When "I want" is selected, visually highlight Noun categories (Food, Toys) in the sidebar.

#### 12.4. Privacy
- [x] **Privacy Firewall:** Ensure all "Context" data (Geo/Time) is processed locally. (Implementation: Store rules in `iconsData.json`, not on a server).

---

### 13. Phase 13: Circle of Support (Avatar Builder) (New)

#### 13.1. Personalized Representation
- [x] **SVG Layering Engine:** Implement a high-performance system to layer head shapes, hair styles, eyes, and accessories.
- [x] **Diversity Toggles:** Support 6+ skin tones, varied hair textures (curly, coily, straight), and facial hair options.
- [x] **Accessibility Accessories:** Include options for hearing aids, glasses, and "AAC devices" in the avatar builder.
- [x] **Recipe-Based Export:** Store avatars as "Recipes" (JSON objects) in `iconsData.json` rather than flat images to preserve scalability and editability.
- [x] **Default Personas:** Pre-populate "My People" with default Mom (Black hair) and Dad (Brown hair, Blue eyes, Short beard) characters.


