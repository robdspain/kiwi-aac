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

### 3. Development Philosophy & Feature Prioritization

#### 3.1. Core-First Approach

**Philosophy:** Kiwi Voice must excel at basic communication before adding innovative features.

**SLP-Validated Must-Haves (Priority 1):**
1. **Robust Vocabulary** - Comprehensive, easily customizable word library
2. **Reliable Speech Output** - Consistent, high-quality text-to-speech
3. **Intuitive Interface** - Simple, accessible UI that doesn't overwhelm
4. **Access to Support** - Help resources and responsive assistance

**Implementation Priority:**
- ✅ Core features MUST be complete, tested, and stable
- ⚠️ Advanced features should enhance, not complicate
- 🧪 Innovative features require user validation before full investment

#### 3.2. Anti-Overengineering Guidelines

**User Testing Requirements:**
- **Zen Animations:** Validate that calming animations don't distract from communication
- **Avatar Builder:** Confirm users prefer custom avatars vs. real photos (children recognize real faces better)
- **AI Vision:** Ensure object detection adds value vs. manual selection
- **Visual Action Cues:** Test whether illustrative imagery improves learning vs. standard icons

**Decision Framework:**
```
Feature Proposal
    ↓
Does it improve CORE communication?
    ├─ Yes → Prioritize
    └─ No → Is it frequently requested by SLPs/parents?
        ├─ Yes → User test, then decide
        └─ No → Defer or remove
```

**Red Flags:**
- Feature sounds "cool" but no clear use case
- Adds UI complexity without communication benefit
- Limited use expected (nice-to-have vs. need-to-have)
- Resource-intensive with uncertain ROI

#### 3.3. Progressive Disclosure Strategy

**Two-Tier Interface:**
- **Basic Mode (Default):** Essential features only, optimized for first-time users
  - Core vocabulary
  - Simple grid
  - Basic TTS
  - Quick templates

- **Advanced Mode (Opt-In):** Full feature set for power users
  - AI scene builder
  - Advanced analytics
  - Custom voice presets
  - Morphology engine

**Benefits:**
- New users not overwhelmed by complexity
- Advanced users can unlock full power
- Features validated through graduated adoption
- Clear user segmentation for analytics

#### 3.4. Modular Architecture

**Separate Core from Extras:**
- **Core Module:** Always loaded, always stable
  - Grid system
  - TTS engine
  - Basic customization

- **Optional Modules:** Load on demand
  - AI Vision tool (separate section, not forced)
  - Advanced analytics dashboard
  - Cloud collaboration
  - Multi-language mirroring

**Implementation:**
- Code splitting for performance
- Feature flags for gradual rollout
- A/B testing for validation
- Easy disable for problematic features

#### 3.5. PWA/Hybrid Compliance Considerations

**Platform Constraints:**
- **PWA Limitations:** Some native OS features unavailable
  - Bluetooth communication
  - Deep system integration
  - Background app refresh (limited)

- **Must Feel Native:** Despite PWA constraints
  - Follow iOS Human Interface Guidelines (Phase 16)
  - Android Material Design patterns where appropriate
  - Native-feeling animations and interactions

**Store Compliance:**
- ✅ In-app purchases follow Apple/Google rules
- ✅ Subscription pricing transparent and fair
- ✅ Privacy policy and data handling clear
- ✅ Accessibility guidelines met (WCAG 2.1 AA)

**Competitive Advantage:**
- ✅ Works on iOS, Android, and web (vs. iOS-only competitors)
- ✅ Successful hybrid AAC apps exist (TouchChat, CoughDrop)
- ✅ Cross-platform = larger addressable market
- ⚠️ Must maintain quality parity with native apps

#### 3.6. Validation Metrics

**Core Feature Success Criteria:**
- Communication success rate > 95%
- Speech output delay < 200ms
- Icon selection accuracy > 98%
- App crash rate < 0.1%

**Advanced Feature Adoption Gates:**
- Feature used by > 20% of active users (within 30 days)
- User satisfaction score > 4.0/5 for feature
- Support tickets related to feature < 2% of total
- Performance impact < 5% (load time, battery)

**User Testing Requirements:**
- Minimum 10 SLP reviews before Phase 22+ features
- Parent/caregiver feedback sessions (n=20) per major feature
- A/B testing with 1000+ users for UI changes
- Accessibility testing with disabled users

---

### 4. Functional Requirements

#### 4.1. Browser & Search
- [x] **Category Navigation:** Sidebar navigation for major emoji groups.
- [x] **Search bar:** Real-time filtering of icons by name or character.
- [x] **Search Enhancements:** Add "Clear Search" button.
- [x] **Full Dataset:** Replace placeholder `emojiData.js` with the complete Unicode emoji set.

#### 4.2. Selection & Curation
- [x] **Single Select:** Toggle individual icons.
- [x] **Bulk Select:** "Select All" and "Deselect" buttons for current categories.
- [x] **Customization Flow:** Selecting an icon triggers a polished customization screen to edit labels before saving.
- [x] **Visual Feedback:** Clear selection badges and highlight states.
- [x] **Persistence:** Track selected items across category switches.

#### 4.3. Customization
- [x] **Skin Tone Picker:** Long-press/Right-click access to variation selector.
- [x] **Mimoji Aesthetic:** Avatars feature premium 3D-style gradients, highlights, and shadows.
- [x] **Variation Logic:** Automatically link base emojis to their skin-tone modifiers.
- [x] **Accessibility:** Focus trapping and keyboard management for the picker.

#### 4.4. Export
- [x] **JSON Export:** Download `iconsData.json` containing name and character mapping.
- [x] **Schema Validation:** Ensure exported JSON matches the target AAC app requirements.

---

### 5. Non-Functional Requirements

#### 5.1. Performance
- [x] **Build Size:** Maintain optimized production builds via Vite.
- [x] **Processing:** Pre-process emoji grouping on initial load (currently in `EmojiCurator.jsx`).
- [x] **Lazy Loading:** Implement for the grid if the dataset becomes very large.

#### 5.2. UI/UX & Responsive Design
- [x] **Responsive Layout:** Adaptive sidebar (desktop) vs. Drawer (mobile).
- [x] **Navigation Flow:** Seamless "Back to Library" transitions and Enter-key support for rapid saving.
- [x] **Safe Areas:** Support for notches and home bars (`env(safe-area-inset)`).
- [x] **Theme Consistency:** Resolve conflicts between `index.css` (dark) and Component (light).

#### 5.3. Accessibility (AAC Specific)
- [x] **Touch Targets:** Large targets (>44px).
- [x] **ARIA Labels:** Basic labeling for screen readers.
- [x] **Focus Management:** Full keyboard navigation support (grid focus, picker trap).
- [x] **Haptic Feedback:** Vibrate on long-press (implemented but requires testing on physical devices).

---

### 6. Store & Platform Compliance

#### 6.1. PWA Requirements
- [x] **Manifest:** Create `manifest.json` with icons, theme colors, and display mode.
- [x] **Service Worker:** Basic offline support and caching.
- [x] **Installation UI:** iOS-specific instruction modal for adding the PWA to the home screen.

#### 6.2. iOS / Android Assets
- [x] **App Icons:** 1024x1024 (iOS) and 512x512 (Android) source assets.
- [x] **Splash Screens:** Native-style launch images.

---

### 7. Pricing & Monetization Strategy

#### 7.1. Market Analysis & Competitive Pricing

**Competitor Pricing Landscape:**
- **Proloquo2Go:** $249.99 (one-time, iOS only)
- **TouchChat:** $149.99 base + $99.99 add-ons (iOS/Android)
- **LAMP Words for Life:** $299.99 (one-time)
- **Avaz:** $99.99 (one-time)
- **Cboard:** Free (open source, limited features)

**Market Barriers:**
- High cost ($100-300) prohibitive for many families
- iOS-only apps exclude Android tablet users
- Hidden costs through paid add-ons and voice packs
- No trial period to evaluate before purchase

**Kiwi Voice Competitive Advantage:**
- **Cross-Platform:** PWA works on iOS, Android, tablets, web browsers
- **Transparent Pricing:** No hidden add-ons or surprise costs
- **Accessible Entry Point:** Lower barrier to entry than premium competitors
- **Freemium Model:** Core features free, premium features via subscription

#### 7.2. Free Tier (Core AAC Functionality)

**Always Free - No Paywall:**
- ✅ Core 50 word vocabulary
- ✅ Basic grid system (up to 50 icons)
- ✅ Text-to-speech (system voices)
- ✅ Skin tone customization
- ✅ Basic templates (First 50 Words)
- ✅ Default Kiwi color theme
- ✅ Export to JSON
- ✅ QR code sharing
- ✅ Basic analytics (last 7 days)
- ✅ Single user profile

**Rationale:** Core communication should NEVER be paywalled. Every child deserves the ability to communicate regardless of ability to pay.

#### 7.3. Premium Tier - "Kiwi Pro" ($4.99/month or $39.99/year)

**Premium Features (Superwall Integration):**

1. **🎨 Premium Color Themes** (IMPLEMENTED)
   - Ocean, Sunset, Forest, Berry, Candy themes
   - Paywall trigger: `Superwall.register({ event: 'colorThemes' })`
   - Current implementation: Controls.jsx:544

2. **📊 Advanced Analytics** (RECOMMENDED)
   - Unlimited history (vs. 7 days free)
   - Vocabulary growth charts
   - IEP goal tracking
   - Weekly automated reports
   - CSV export with date ranges
   - Paywall trigger: `Superwall.register({ event: 'advancedAnalytics' })`

3. **🎭 Character & People Builder** (RECOMMENDED)
   - Unlimited custom characters (vs. 3 free)
   - Access to all 58 Memoji characters
   - Custom voice recordings per character
   - Paywall trigger: `Superwall.register({ event: 'unlimitedPeople' })`

4. **📚 Premium Templates & Contexts** (RECOMMENDED)
   - Extended template library (20+ templates)
   - Context-aware boards (School, Therapy, Home, Park, Mealtime)
   - Seasonal/holiday boards
   - Paywall trigger: `Superwall.register({ event: 'premiumTemplates' })`

5. **☁️ Cloud Sync & Collaboration** (RECOMMENDED)
   - Sync across unlimited devices
   - Share boards with team (teachers, therapists, family)
   - Real-time collaboration
   - Board version history
   - Paywall trigger: `Superwall.register({ event: 'cloudSync' })`

6. **🗣️ Premium Voice Features** (RECOMMENDED)
   - Custom pronunciation dictionary (unlimited entries vs. 10 free)
   - Voice presets (Young Child, Adult, Clear Speech)
   - Voice cloning for custom TTS (future)
   - Paywall trigger: `Superwall.register({ event: 'premiumVoice' })`

7. **👥 Multi-Profile Support** (RECOMMENDED)
   - Unlimited learner profiles (vs. 1 free)
   - Profile-specific settings and boards
   - Easy profile switching
   - Paywall trigger: `Superwall.register({ event: 'multiProfiles' })`

8. **🎯 Unlimited Vocabulary** (RECOMMENDED)
   - Unlimited icons on grid (vs. 50 free)
   - Unlimited categories
   - Full emoji dataset access
   - Paywall trigger: `Superwall.register({ event: 'unlimitedVocabulary' })`

9. **📱 Priority Support** (RECOMMENDED)
   - Email support within 24 hours
   - Video tutorials
   - Setup assistance
   - Direct access to AAC specialists

#### 7.4. Institutional Pricing

**Kiwi Pro for Schools/Clinics:**
- $99/year per organization (unlimited students)
- Volume discounts for districts
- Admin dashboard for managing multiple users
- Professional development training included
- HIPAA/FERPA compliance documentation

**Kiwi Pro for Therapists:**
- $59/year (up to 10 active clients)
- Professional reporting templates
- Session notes integration
- Progress monitoring tools

#### 7.5. Implementation Strategy

**Superwall Event Mapping:**

```javascript
// Color Themes (DONE)
await Superwall.register({ event: 'colorThemes' })

// Analytics (TO ADD)
await Superwall.register({ event: 'advancedAnalytics' })
await Superwall.register({ event: 'exportAnalytics' })

// Templates (TO ADD)
await Superwall.register({ event: 'premiumTemplates' })
await Superwall.register({ event: 'applyTemplate' })

// Cloud Features (TO ADD)
await Superwall.register({ event: 'cloudSync' })
await Superwall.register({ event: 'teamSharing' })

// Voice (TO ADD)
await Superwall.register({ event: 'premiumVoice' })
await Superwall.register({ event: 'voicePresets' })

// People/Characters (TO ADD)
await Superwall.register({ event: 'unlimitedPeople' })
await Superwall.register({ event: 'addCustomCharacter' })

// Vocabulary (TO ADD)
await Superwall.register({ event: 'unlimitedVocabulary' })
await Superwall.register({ event: 'addIcon51' }) // Trigger when adding 51st icon

// Profiles (TO ADD)
await Superwall.register({ event: 'multiProfiles' })
await Superwall.register({ event: 'addProfile2' }) // Trigger when adding 2nd profile
```

#### 7.6. Value Proposition & Positioning

**Compared to Proloquo2Go ($249.99):**
- ✅ $39.99/year = **84% cheaper**
- ✅ Works on Android (Proloquo2Go is iOS-only)
- ✅ No platform lock-in
- ✅ Try before you buy

**Compared to Free Options (Cboard):**
- ✅ Premium analytics and insights
- ✅ Cloud sync and collaboration
- ✅ Professional support
- ✅ Better UX and performance

**Unique Selling Points:**
1. **Most Affordable Premium AAC:** Under $50/year vs. $100-300 one-time
2. **True Cross-Platform:** iOS, Android, web - use anywhere
3. **Family-Friendly Freemium:** Core features always free
4. **Transparent Pricing:** No hidden costs or surprise add-ons
5. **Subscription Flexibility:** Cancel anytime, keep your data

#### 7.7. Revenue Projections & Success Metrics

**Target Market Size:**
- 2M+ AAC users in US alone
- Growing market (autism rates increasing)
- Underserved Android market

**Conservative Projections (Year 1):**
- 10,000 free tier users
- 5% conversion to premium (500 paid users)
- $500 × $39.99/year = **$19,995 ARR**

**Moderate Growth (Year 2):**
- 50,000 free tier users
- 8% conversion to premium (4,000 paid users)
- 4,000 × $39.99 = **$159,960 ARR**

**Success Metrics:**
- Free-to-paid conversion rate > 5%
- Monthly churn rate < 5%
- User satisfaction score > 4.5/5
- App Store rating > 4.7/5

---

### 8. Roadmap & Implementation Status

> **Note:** For quarter-based roadmap and detailed feature timelines, see [ROADMAP.md](./ROADMAP.md). This section provides phase-based implementation tracking with detailed technical requirements for each feature.

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
| **Phase 17** | Visual Schedules & Routine Builder | **COMPLETE** |
| **Phase 18** | Essential Skills Training (FCR, Denial Tolerance) | **COMPLETE** |
| **Phase 19** | Quick Start & Template System | **IN PROGRESS** |
| **Phase 20** | Social Sharing & Collaboration | **IN PROGRESS** |
| **Phase 21** | Usage Analytics & Progress Tracking | **IN PROGRESS** |
| **Phase 22** | AI Vision: JIT Visual Scene Automation | **PENDING** |
| **Phase 23** | Linguistic Growth: Morphology & Visual Action Cues | **PENDING** |
| **Phase 24** | Global Support: Multi-Language Mirroring | **PENDING** |

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

### 17. Phase 17: Visual Schedules & Routine Builder

> **See also:** [ROADMAP.md - Q1 2025](./ROADMAP.md#q1-2025) for release timeline

#### 17.1. Visual Schedule Component
- [x] **VisualSchedule.jsx:** Dedicated component for step-by-step routine navigation
- [x] **Step-by-Step Display:** Large visual display of current activity
- [x] **Navigation Controls:** Previous, Next, and Reset buttons
- [x] **Progress Tracking:** Visual indication of position in schedule (Step X of Y)
- [x] **Accessibility:** ARIA live regions for screen reader support

#### 17.2. Routine Builder Integration
- [x] **Folder-Based Schedules:** Use existing folder system as schedule containers
- [x] **Icon Sequences:** Display folder contents in sequential order
- [x] **Mixed Media Support:** Images, emojis, and custom icons in schedules
- [x] **Background Colors:** Visual distinction between schedule items

#### 17.3. Use Cases & Benefits
- **Morning Routines:** Brush teeth → Get dressed → Eat breakfast
- **Bedtime Sequences:** Bath → Pajamas → Story → Sleep
- **School Transitions:** Arrival → Locker → Classroom → Unpack
- **Custom Activities:** Any repeatable multi-step sequence
- **Anxiety Reduction:** Predictable visual structure reduces transition stress
- **Independence Building:** Child can follow routine without constant verbal prompts

#### 17.4. Technical Implementation
- **Location:** `src/components/VisualSchedule.jsx`
- **Integration:** Activated when opening folders in schedule mode
- **State Management:** Local component state for current step tracking
- **Animations:** Spring transitions for smooth step changes

---

### 18. Phase 18: Essential Skills Training (FCR, Denial Tolerance)

> **See also:** [ROADMAP.md - Q1 2025](./ROADMAP.md#q1-2025) for evidence-based protocols

#### 18.1. Functional Communication Response (FCR)
- [x] **FCR Mode:** Dedicated training interface for functional communication
- [x] **Request Training:** "My Way" button for practicing manding (requesting)
- [x] **Immediate Feedback:** Vocal and visual reinforcement on successful request
- [x] **Success Flash:** Full-screen positive reinforcement animation

#### 18.2. Denial Tolerance Training
- [x] **Controlled Denial:** Configurable probability of denial (sensitivity slider)
- [x] **"Not right now..." Screen:** Visual denial presentation
- [x] **"Say Okay" Button:** Teaches appropriate response to denial
- [x] **Tolerance Reward:** Positive reinforcement for accepting denial
- [x] **Toggle On/Off:** Option to practice with or without denials

#### 18.3. Wait Behavior Training
- [x] **Delay Mechanism:** Random denial introduces wait time
- [x] **Tolerance Step:** Explicit practice accepting delayed gratification
- [x] **Progressive Difficulty:** Adjustable sensitivity for gradual skill building

#### 18.4. Evidence-Based Design
- **ABA Principles:** Based on applied behavior analysis research
- **Positive Reinforcement:** Immediate vocal praise for correct responses
- **Error Correction:** Gentle "not right now" without punishment
- **Data Logging:** Event tracking for FCR attempts, denials, tolerance successes
- **Therapist Customization:** Adjustable parameters for individual programs

#### 18.5. Technical Implementation
- **Location:** `src/components/EssentialSkillsMode.jsx`
- **State Flow:** Request → (Random Denial) → Tolerance → Reward → Reset
- **Event Logging:** Integration with analytics for progress tracking
- **Full-Screen Mode:** Immersive experience to minimize distractions
- **Exit Protection:** Dedicated exit button to prevent accidental closure

#### 18.6. Clinical Applications
- **Early Intervention:** Teaching functional communication to non-verbal children
- **Behavior Management:** Reducing tantrum behaviors through denial tolerance
- **Transition Preparation:** Building cooperation skills for school/therapy
- **IEP Goals:** Trackable metrics for individualized education plans
- **Parent Training:** Consistent home-based skill practice

---

### 19. Phase 19: Quick Start & Template System

#### 19.1. Default Core Vocabulary
- [x] **Core 50 Words:** Pre-loaded default vocabulary based on AAC research (CORE_VOCABULARY).
- [x] **Ready Out of Box:** First launch includes functional board rather than blank slate.
- [x] **Bilingual Labels:** Core words available in English with Spanish translation support.
- [ ] **Auto-Population:** Automatically populate grid with core vocabulary on first install.
- [ ] **Guided Setup:** Onboarding flow to help users customize the default board.

#### 19.2. Template Library
- [x] **Pre-Built Templates:** Multiple ready-made boards (First 50 Words, School Day, etc.).
- [x] **Template Data Structure:** TEMPLATES object in aacData.js with curated word lists.
- [x] **Context-Specific Boards:** CONTEXT_DEFINITIONS for School, Home, Park, Mealtime scenarios.
- [ ] **One-Click Apply:** Quick-apply templates to current board or create new board from template.
- [ ] **Template Gallery:** Visual gallery showing preview of each template before application.
- [ ] **Community Templates:** User-submitted templates shared via cloud (future).

#### 19.3. Progressive Complexity
- [ ] **Starter Mode:** Simplified interface for first-time users with only essential features.
- [ ] **Advanced Mode:** Full feature set unlocked after user completes onboarding.
- [ ] **Feature Discovery:** Progressive disclosure of advanced features as users gain proficiency.
- [ ] **Contextual Help:** In-app tooltips and guidance for template customization.

---

### 20. Phase 20: Social Sharing & Collaboration

#### 20.1. Board Sharing (QR Code)
- [x] **QR Code Generation:** Share boards via QR code for instant device-to-device transfer.
- [x] **URL Encoding:** Compress board data with LZ-String for shareable URLs.
- [x] **Import from QR:** Scan QR code to import shared boards.
- [x] **Visual Share Modal:** Polished UI with QR code display and copyable link.

#### 20.2. Export & Backup
- [x] **Full Data Export:** BackupRestore component for exporting all Kiwi data.
- [x] **JSON Backup:** Export iconsData, settings, analytics in timestamped JSON file.
- [x] **Native Share:** Capacitor Share API integration for iOS/Android sharing.
- [x] **Import Restore:** Import backup files to restore complete app state.
- [ ] **Selective Export:** Choose specific boards or data to export (not all-or-nothing).

#### 20.3. Cloud Sync & Collaboration
- [ ] **Cloud Storage:** Supabase/Neon integration for cloud backup (infrastructure exists).
- [ ] **Team Sharing:** Share boards with multiple users (teachers, therapists, parents).
- [ ] **Real-Time Sync:** Sync boards across multiple devices for same user.
- [ ] **Access Codes:** Simple code-based system for sharing boards (like Zoom codes).
- [ ] **Board Gallery:** Browse and download community-shared boards.
- [ ] **Version History:** Track board changes and revert to previous versions.

#### 20.4. Collaboration Features
- [ ] **Team Roles:** Different permissions for parents, therapists, educators.
- [ ] **Comments & Notes:** Therapist notes on specific icons or progress.
- [ ] **Shared Analytics:** View usage data across team members.
- [ ] **Email/Link Sharing:** Send board link via email for easy distribution.

---

### 21. Phase 21: Usage Analytics & Progress Tracking

#### 21.1. Core Analytics Engine
- [x] **Click Tracking:** AnalyticsService tracks every icon interaction with timestamps.
- [x] **Item Usage Stats:** Count clicks per icon with daily breakdowns.
- [x] **Session Tracking:** Track session start/end times and durations.
- [x] **Sentence Logging:** Track complete sentences (last 100 saved).
- [x] **Local Storage:** All analytics stored locally in browser localStorage.

#### 21.2. Dashboard & Visualizations
- [x] **Progress Dashboard:** Comprehensive dashboard showing all usage metrics.
- [x] **Top Items Display:** Show most frequently used icons (top 5-10).
- [x] **Daily Usage Graph:** 7-day bar chart of daily click activity.
- [x] **Total Stats Summary:** Overall clicks, unique items, sessions, avg session time.
- [x] **Recent Sentences:** Display recently formed sentences.

#### 21.3. Export & Reporting
- [x] **CSV Export:** Export usage data to CSV for external analysis.
- [x] **Share Progress:** Share dashboard screenshots with team members.
- [ ] **Weekly Reports:** Automated weekly summary emails for parents/therapists.
- [ ] **PDF Reports:** Professional PDF reports for therapy documentation.
- [ ] **Custom Date Ranges:** Filter analytics by custom date ranges.

#### 21.4. Therapeutic Insights
- [ ] **New Words This Week:** Highlight newly used vocabulary.
- [ ] **Vocabulary Growth Chart:** Track vocabulary expansion over time.
- [ ] **Communication Patterns:** Identify peak usage times and contexts.
- [ ] **Goal Progress:** Track progress toward IEP goals (individualized education plan).
- [ ] **Recommendations:** AI-suggested vocabulary additions based on usage patterns.

#### 21.5. Privacy & Data Management
- [x] **Local-First:** All analytics stored locally, no automatic cloud upload.
- [ ] **Data Deletion:** Easy one-click delete all analytics data.
- [ ] **Export for Privacy:** Export and delete from device before sharing.
- [ ] **HIPAA Considerations:** Ensure compliance for clinical/educational use.
- [ ] **Parental Controls:** Password-protect analytics access from child.

---

### 22. Phase 22: AI Vision: JIT Visual Scene Automation

#### 22.1. On-Device Object Detection
- [ ] **Vision Engine Integration:** Integrate an on-device vision model (e.g., TensorFlow.js) to process uploaded "Visual Scene" photos locally.
- [ ] **Auto-Hotspot Suggestion:** Automatically identify common objects (cup, toy, snack) and suggest coordinate-based hotspots.

#### 22.2. Intelligent Icon Mapping
- [ ] **Semantic Linker:** Automatically map detected objects to existing icons in the library or suggest matching emojis from the dataset.

---

### 23. Phase 23: Linguistic Growth: Morphology & Visual Action Cues

#### 23.1. Advanced Morphology Engine
- [ ] **Noun Expansion:** Add toggles for Plurals (e.g., "Cookie" -> "Cookies") and Possessives ("Mom" -> "Mom's") in the customization modal.
- [ ] **Agreement Logic:** Implement automatic subject-verb agreement (e.g., "I want" vs "He wants") within the sentence strip logic.

#### 23.2. Visual Action Cues (Zen Style)
- [ ] **Illustrative Action Imagery:** Instead of video, create a set of high-quality illustrative images/icons that depict the *action* or *context* of a word, matching the unified Mimoji aesthetic.
- [ ] **Zen Animations:** Implement beautiful, calming animations (e.g., soft scaling or path-drawing) to illustrate specific concepts or learning milestones, avoiding sensory overload.

---

### 24. Phase 24: Global Support: Multi-Language Mirroring

#### 24.1. Decoupled Structure
- [ ] **Schema Refactor:** Decouple the board layout (spatial positions) from the linguistic labels.
- [ ] **Mirroring Engine:** Implement a toggle to switch the entire board between languages (e.g., English <-> Spanish) while keeping icon positions identical to preserve motor memory.

#### 24.2. Automated Translation
- [ ] **Local Lexicon Mapping:** Use an expanded `aacLexicon.js` to provide high-quality, clinical-grade translations for core and common fringe vocabulary.
