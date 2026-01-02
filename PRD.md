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
- [x] **Customization Flow:** Selecting an icon triggers a polished customization screen to edit labels before saving.
- [x] **Visual Feedback:** Clear selection badges and highlight states.
- [x] **Persistence:** Track selected items across category switches.

#### 3.3. Customization
- [x] **Skin Tone Picker:** Long-press/Right-click access to variation selector.
- [x] **Mimoji Aesthetic:** Avatars feature premium 3D-style gradients, highlights, and shadows.
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
- [x] **Navigation Flow:** Seamless "Back to Library" transitions and Enter-key support for rapid saving.
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
- [x] **Installation UI:** iOS-specific instruction modal for adding the PWA to the home screen.

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
| **Phase 14** | Advanced Disruptor Refinements | **COMPLETE** |
| **Phase 15** | High-Fidelity Voice Engine | **COMPLETE** |
| **Phase 16** | Apple Design & Accessibility Standards | **COMPLETE** |
| **Phase 17** | Quick Start & Template System | **IN PROGRESS** |
| **Phase 18** | Social Sharing & Collaboration | **IN PROGRESS** |
| **Phase 19** | Usage Analytics & Progress Tracking | **IN PROGRESS** |
| **Phase 20** | AI Vision: JIT Visual Scene Automation | **PENDING** |
| **Phase 21** | Linguistic Growth: Morphology & Visual Action Cues | **PENDING** |
| **Phase 22** | Global Support: Multi-Language Mirroring | **PENDING** |

---

### 15. Phase 15: High-Fidelity Voice Engine (New)

#### 15.1. Multi-Voice Support
- [x] **Voice Selector:** Implement a dropdown to browse and select from all available system voices (Neural, Siri, etc.) provided by the Web Speech API.
- [x] **Voice Filtering:** Group voices by locale (e.g., English US vs English UK) and gender.

#### 15.2. Expressive Personalization
- [x] **Pitch & Rate Controls:** Add sliders in the Voice Settings modal to fine-tune the selected voice.
- [x] **Voice Preview:** A "Test Voice" button to hear a sample sentence before applying changes.

#### 15.3. Phonetic Pronunciation Editor
- [x] **Custom Dictionary:** Allow users to define phonetic overrides for specific words (e.g., "Kiwi" -> "Kee-wee") to fix mispronunciations in neural engines.
- [x] **Exportable Lexicon:** Include the pronunciation dictionary in `iconsData.json`.

#### 15.4. Multi-Language Voice Support
- [ ] **All Languages:** Show all system voices, not just English (currently filtered to English only).
- [ ] **Language Selector:** Allow filtering by language preference in voice settings.
- [ ] **Spanish Priority:** Ensure Spanish voices are easily accessible alongside English.
- [ ] **Language-Aware Rate:** Provide guidance on optimal speaking rates for different languages.

#### 15.5. Voice Quality Guidance
- [ ] **Download Indicators:** Mark which voices require iOS Settings download for offline use.
- [ ] **Quality Badges:** Clearly distinguish between Siri/Neural/Premium vs. basic system voices.
- [ ] **Setup Instructions:** Provide in-app guidance to download high-quality voices if needed.
- [ ] **Enhanced Voice Detection:** Automatically detect and prioritize Enhanced/Premium voices in the list.

#### 15.6. Voice Presets
- [ ] **Young Child Preset:** Higher pitch (1.2x), slower rate (0.8x) for child-like voice.
- [ ] **Adult Preset:** Normal pitch (1.0x), normal rate (1.0x) for standard adult voice.
- [ ] **Clear Speech Preset:** Normal pitch (1.0x), slower rate (0.7x) for maximum clarity.
- [ ] **Custom Presets:** Allow users to save their own preset combinations.
- [ ] **Quick Apply:** One-tap application of presets from voice settings.

#### 15.7. Communication Interface (Message Bar)
- [ ] **Sentence Strip:** Message bar at top where tapped icons accumulate into sentences.
- [ ] **Speak All Button:** Play entire sentence from message bar with proper spacing.
- [ ] **Clear Button:** Remove all icons from message bar at once.
- [ ] **Individual Removal:** Tap icons in message bar to remove them selectively.
- [ ] **Use Mode vs Edit Mode:** Dedicated communication mode separate from library editing.
- [ ] **Auto-Speak Option:** Toggle to speak words immediately on tap vs. accumulating first.

#### 15.8. Recorded Voice Integration
- [x] **Custom Voice Recording:** Allow recording custom audio clips for specific buttons.
- [x] **Playback Controls:** Play, re-record, and delete recorded audio.
- [ ] **Parent Voice Library:** Curated collection of common phrases in parent's voice (e.g., "I love you").
- [ ] **Mix TTS and Recordings:** Support both synthesized and recorded audio in the same sentence.

---

### 16. Phase 16: Apple Design & Accessibility Standards (New)

#### 16.1. High-Contrast Color System (WCAG 2.1 AA)
- [x] **Contrast Remediation:** 
    - Update primary UI colors to ensure 4.5:1 ratio against text.
    - **Teal (#4ECDC4) ->** Switch to dark text (`#1A535C`) instead of white.
    - **Fitzgerald Key:** 
        - Nouns (Yellow #FFEB3B) -> Dark Text (#2D3436).
        - Verbs (Green #4CAF50) -> Increase saturation/darkness to pass white text.
        - Adjectives (Blue #2196F3) -> Increase saturation/darkness.

#### 16.2. Typography & Layout Scaling
- [x] **Dynamic Type Implementation:** 
    - Convert all hardcoded `px` font sizes to `rem`.
    - Use `clamp()` for responsive header text to prevent clipping on small devices.
- [x] **SF Pro Rounded Integration:** Ensure `font-family` strictly defaults to system rounded variant for better readability.

#### 16.3. Motor & Hit-Area Standards
- [x] **Touch Target Audit:** 
    - Ensure all interactive elements (Close buttons, Search clears, Sidebar items) have a minimum hit area of `44x44px`.
- [x] **Pointer Cancellation:** 
    - Standardize action triggers on `pointerup` events.
    - Implement a "Slide-to-Cancel" visual cue for long-press actions.
- [x] **Haptic Feedback Hierarchy:** 
    - **Light:** Item selection / Toggle.
    - **Medium:** Navigation / Level Change.
    - **Success:** Export / Save.
    - **Error:** Blacklist / Delete (Heavy).

---

### 17. Phase 17: Quick Start & Template System

#### 17.1. Default Core Vocabulary
- [x] **Core 50 Words:** Pre-loaded default vocabulary based on AAC research (CORE_VOCABULARY).
- [x] **Ready Out of Box:** First launch includes functional board rather than blank slate.
- [x] **Bilingual Labels:** Core words available in English with Spanish translation support.
- [ ] **Auto-Population:** Automatically populate grid with core vocabulary on first install.
- [ ] **Guided Setup:** Onboarding flow to help users customize the default board.

#### 17.2. Template Library
- [x] **Pre-Built Templates:** Multiple ready-made boards (First 50 Words, School Day, etc.).
- [x] **Template Data Structure:** TEMPLATES object in aacData.js with curated word lists.
- [x] **Context-Specific Boards:** CONTEXT_DEFINITIONS for School, Home, Park, Mealtime scenarios.
- [ ] **One-Click Apply:** Quick-apply templates to current board or create new board from template.
- [ ] **Template Gallery:** Visual gallery showing preview of each template before application.
- [ ] **Community Templates:** User-submitted templates shared via cloud (future).

#### 17.3. Progressive Complexity
- [ ] **Starter Mode:** Simplified interface for first-time users with only essential features.
- [ ] **Advanced Mode:** Full feature set unlocked after user completes onboarding.
- [ ] **Feature Discovery:** Progressive disclosure of advanced features as users gain proficiency.
- [ ] **Contextual Help:** In-app tooltips and guidance for template customization.

---

### 18. Phase 18: Social Sharing & Collaboration

#### 18.1. Board Sharing (QR Code)
- [x] **QR Code Generation:** Share boards via QR code for instant device-to-device transfer.
- [x] **URL Encoding:** Compress board data with LZ-String for shareable URLs.
- [x] **Import from QR:** Scan QR code to import shared boards.
- [x] **Visual Share Modal:** Polished UI with QR code display and copyable link.

#### 18.2. Export & Backup
- [x] **Full Data Export:** BackupRestore component for exporting all Kiwi data.
- [x] **JSON Backup:** Export iconsData, settings, analytics in timestamped JSON file.
- [x] **Native Share:** Capacitor Share API integration for iOS/Android sharing.
- [x] **Import Restore:** Import backup files to restore complete app state.
- [ ] **Selective Export:** Choose specific boards or data to export (not all-or-nothing).

#### 18.3. Cloud Sync & Collaboration
- [ ] **Cloud Storage:** Supabase/Neon integration for cloud backup (infrastructure exists).
- [ ] **Team Sharing:** Share boards with multiple users (teachers, therapists, parents).
- [ ] **Real-Time Sync:** Sync boards across multiple devices for same user.
- [ ] **Access Codes:** Simple code-based system for sharing boards (like Zoom codes).
- [ ] **Board Gallery:** Browse and download community-shared boards.
- [ ] **Version History:** Track board changes and revert to previous versions.

#### 18.4. Collaboration Features
- [ ] **Team Roles:** Different permissions for parents, therapists, educators.
- [ ] **Comments & Notes:** Therapist notes on specific icons or progress.
- [ ] **Shared Analytics:** View usage data across team members.
- [ ] **Email/Link Sharing:** Send board link via email for easy distribution.

---

### 19. Phase 19: Usage Analytics & Progress Tracking

#### 19.1. Core Analytics Engine
- [x] **Click Tracking:** AnalyticsService tracks every icon interaction with timestamps.
- [x] **Item Usage Stats:** Count clicks per icon with daily breakdowns.
- [x] **Session Tracking:** Track session start/end times and durations.
- [x] **Sentence Logging:** Track complete sentences (last 100 saved).
- [x] **Local Storage:** All analytics stored locally in browser localStorage.

#### 19.2. Dashboard & Visualizations
- [x] **Progress Dashboard:** Comprehensive dashboard showing all usage metrics.
- [x] **Top Items Display:** Show most frequently used icons (top 5-10).
- [x] **Daily Usage Graph:** 7-day bar chart of daily click activity.
- [x] **Total Stats Summary:** Overall clicks, unique items, sessions, avg session time.
- [x] **Recent Sentences:** Display recently formed sentences.

#### 19.3. Export & Reporting
- [x] **CSV Export:** Export usage data to CSV for external analysis.
- [x] **Share Progress:** Share dashboard screenshots with team members.
- [ ] **Weekly Reports:** Automated weekly summary emails for parents/therapists.
- [ ] **PDF Reports:** Professional PDF reports for therapy documentation.
- [ ] **Custom Date Ranges:** Filter analytics by custom date ranges.

#### 19.4. Therapeutic Insights
- [ ] **New Words This Week:** Highlight newly used vocabulary.
- [ ] **Vocabulary Growth Chart:** Track vocabulary expansion over time.
- [ ] **Communication Patterns:** Identify peak usage times and contexts.
- [ ] **Goal Progress:** Track progress toward IEP goals (individualized education plan).
- [ ] **Recommendations:** AI-suggested vocabulary additions based on usage patterns.

#### 19.5. Privacy & Data Management
- [x] **Local-First:** All analytics stored locally, no automatic cloud upload.
- [ ] **Data Deletion:** Easy one-click delete all analytics data.
- [ ] **Export for Privacy:** Export and delete from device before sharing.
- [ ] **HIPAA Considerations:** Ensure compliance for clinical/educational use.
- [ ] **Parental Controls:** Password-protect analytics access from child.

---

### 20. Phase 20: AI Vision: JIT Visual Scene Automation

#### 20.1. On-Device Object Detection
- [ ] **Vision Engine Integration:** Integrate an on-device vision model (e.g., TensorFlow.js) to process uploaded "Visual Scene" photos locally.
- [ ] **Auto-Hotspot Suggestion:** Automatically identify common objects (cup, toy, snack) and suggest coordinate-based hotspots.

#### 20.2. Intelligent Icon Mapping
- [ ] **Semantic Linker:** Automatically map detected objects to existing icons in the library or suggest matching emojis from the dataset.

---

### 21. Phase 21: Linguistic Growth: Morphology & Visual Action Cues

#### 21.1. Advanced Morphology Engine
- [ ] **Noun Expansion:** Add toggles for Plurals (e.g., "Cookie" -> "Cookies") and Possessives ("Mom" -> "Mom's") in the customization modal.
- [ ] **Agreement Logic:** Implement automatic subject-verb agreement (e.g., "I want" vs "He wants") within the sentence strip logic.

#### 21.2. Visual Action Cues (Zen Style)
- [ ] **Illustrative Action Imagery:** Instead of video, create a set of high-quality illustrative images/icons that depict the *action* or *context* of a word, matching the unified Mimoji aesthetic.
- [ ] **Zen Animations:** Implement beautiful, calming animations (e.g., soft scaling or path-drawing) to illustrate specific concepts or learning milestones, avoiding sensory overload.

---

### 22. Phase 22: Global Support: Multi-Language Mirroring

#### 22.1. Decoupled Structure
- [ ] **Schema Refactor:** Decouple the board layout (spatial positions) from the linguistic labels.
- [ ] **Mirroring Engine:** Implement a toggle to switch the entire board between languages (e.g., English <-> Spanish) while keeping icon positions identical to preserve motor memory.

#### 19.2. Automated Translation
- [ ] **Local Lexicon Mapping:** Use an expanded `aacLexicon.js` to provide high-quality, clinical-grade translations for core and common fringe vocabulary.
