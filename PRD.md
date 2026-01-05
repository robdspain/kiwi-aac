# PRODUCT REQUIREMENT DOCUMENT (PRD) - KIWI VOICE
## Project: Kiwi Voice 1.0 - Production Release
## Date: January 2, 2026

### 1. Project Overview
Kiwi Voice is a specialized tool designed to curate and customize icon libraries for Augmentative and Alternative Communication (AAC). It allows users (caregivers, therapists, or developers) to browse, filter, skin-tone-customize, and export a specific set of emojis/icons for use in communication boards.

### 2. Objectives
- Provide a high-performance, mobile-first interface for emoji selection.
- Support standard AAC requirements: high contrast, large touch targets, and skin tone diversity.
- **Integrated Skill Training:** Provide native, evidence-based FCR (Functional Communication Response) and Denial Tolerance modes to bridge the gap between communication and clinical protocols.
- Export selected icons in a standardized JSON format (`iconsData.json`).
- Achieve full compliance for iOS App Store and Google Play Store deployment as a PWA/Hybrid app.

---

### 3. Unique Advantages & Differentiators

Kiwi Voice is designed to disrupt the high-cost AAC market by offering professional-grade features with a modern, high-fidelity experience.

1.  **Context-First Vocabulary (Hallmark Feature):** Language happens in context, not categories. Instant access to situation-specific vocabulary (Lunchtime, Playground, Bedtime) instead of navigating word-type categories. One tap switches your entire vocabulary board to match where you are and what you're doing.
2.  **Modern Memoji Aesthetic:** Replaces dated 2D clip-art with engaging, high-fidelity 3D characters.
3.  **Integrated Skill Training:** Native, evidence-based FCR (Functional Communication Response) and Denial Tolerance modes that usually require separate clinical protocols in other apps.
4.  **Built-in Routine Builder:** A dedicated Visual Schedule mode that transforms standard folders into sequential, step-by-step guides.
5.  **Price Accessibility:** Professional AAC for $39/year (vs. $249+ one-time) with 100% free core communication.
6.  **True Cross-Platform Parity:** A consistent, high-fidelity experience across Web, iOS, and Android.

---

### 3A. Context-First Vocabulary Architecture (Core Philosophy)

**Paradigm Shift:** Traditional AAC apps organize vocabulary by grammatical categories (Nouns, Verbs, Adjectives). Kiwi Voice organizes by situational contexts (Lunchtime, Playground, Bedtime).

#### Why Context-First?

**Linguistic Reality:**
- Language doesn't happen in abstract categories - it happens in real situations
- A child at lunch needs "more," "milk," "done," and "yummy" - not a folder of all possible nouns
- Adults naturally teach words in context: "Use your words at the table"
- Communication partners are part of the context (Mom, Teacher, Therapist)

**User Experience Benefits:**
1. **Faster Access:** One tap switches entire board vs. navigating category folders
2. **Reduced Cognitive Load:** Context pre-filters relevant vocabulary automatically
3. **Natural Learning:** Mirrors how language is naturally acquired in situations
4. **Adult Efficiency:** Caregivers can instantly match vocabulary to child's environment

#### Implementation Requirements

**Quick Context Switching (TOP PRIORITY):**
- Context selector MUST be first thing visible when opening settings
- Large, tap-friendly context buttons with icons
- Currently active context clearly highlighted
- Zero navigation depth - immediate access from any screen

**Pre-Built Contexts (Phase 1):**
- 🏠 **Home:** Morning routine, bedtime, family time
- 🍽️ **Mealtime:** Food preferences, table manners, requests
- 🎮 **Playtime:** Toys, games, turn-taking, sharing
- 🏫 **School:** Classroom, friends, activities, supplies
- 🌳 **Outside:** Park, playground, nature, weather
- 🛁 **Bath/Bedtime:** Hygiene, sleep routine, comfort
- 🚗 **Going Places:** Transportation, errands, waiting
- 🏥 **Medical/Therapy:** Body parts, feelings, pain scale
- ✅ **Starter Icons:** Each default context ships with 7 context-specific icons intended as quick-edit placeholders for adults.
- ✅ **App Defaults (v1):** Home, School, Grandparents, Store, Outside are pre-seeded with 7 editable icons each.

**Smart Context Features:**
- Core words (I, want, more, stop) appear in ALL contexts
- Context-specific fringe vocabulary auto-loads
- Consistent motor planning: same icon stays in same position across contexts
- Quick "Add to All Contexts" for frequently used custom words

**Visual Design:**
- Context name displayed prominently in header
- Quick-switch bar accessible from main screen
- Color-coded contexts for visual distinction
- Emoji icons for instant recognition

**Competitive Differentiation:**
> "Other AAC apps make you hunt through noun folders, verb folders, adjective folders. Kiwi asks: Where are you? What are you doing? Then gives you exactly the words you need - in one tap."

---

### 4. Development Philosophy & Feature Prioritization

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

**Kiwi Voice Community Advantage:**
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

**One-Time Access:**
- **Founder's Lifetime Pass ($149.99):** Unlimited lifetime access to all premium features. Limited to the first 500 initial users.

**Premium Features (RevenueCat Integration):**

1. **🎨 Premium Color Themes** (IMPLEMENTED)
   - Ocean, Sunset, Forest, Berry, Candy themes
   - Entitlement: `premium`
   - Trigger: Display paywall if `colorThemes` offering is active

2. **📊 Advanced Analytics** (RECOMMENDED)
   - Unlimited history (vs. 7 days free)
   - Vocabulary growth charts
   - IEP goal tracking
   - Weekly automated reports
   - CSV export with date ranges
   - Entitlement: `premium`

3. **🎭 Character & People Builder** (RECOMMENDED)
   - Unlimited custom characters (vs. 3 free)
   - Access to all 58 Memoji characters
   - Custom voice recordings per character
   - Entitlement: `premium`

4. **📚 Premium Templates & Contexts** (RECOMMENDED)
   - Extended template library (20+ templates)
   - Context-aware boards (School, Therapy, Home, Park, Mealtime)
   - Seasonal/holiday boards
   - Entitlement: `premium`

5. **☁️ Cloud Sync & Collaboration** (RECOMMENDED)
   - Sync across unlimited devices
   - Share boards with team (teachers, therapists, family)
   - Real-time collaboration
   - Board version history
   - Entitlement: `premium`

6. **🗣️ Premium Voice Features** (RECOMMENDED)
   - Custom pronunciation dictionary (unlimited entries vs. 10 free)
   - Voice presets (Young Child, Adult, Clear Speech)
   - Voice cloning for custom TTS (future)
   - Entitlement: `premium`

7. **👥 Multi-Profile Support** (RECOMMENDED)
   - Unlimited learner profiles (vs. 1 free)
   - Profile-specific settings and boards
   - Easy profile switching
   - Entitlement: `premium`

8. **🎯 Unlimited Vocabulary** (RECOMMENDED)
   - Unlimited icons on grid (vs. 50 free)
   - Unlimited categories
   - Full emoji dataset access
   - Entitlement: `premium`



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

**RevenueCat Offering Mapping:**

```javascript
// Check for Premium Entitlement
const { customerInfo } = await Purchases.getCustomerInfo();
const isPremium = customerInfo.entitlements.active['premium'] !== undefined;

// Show Paywall for specific offerings
if (!isPremium) {
  await RevenueCatUI.presentPaywall({ offering: 'default' });
}
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

**Success Metrics:**
- Free-to-paid conversion rate > 5%
- Monthly churn rate < 5%
- User satisfaction score > 4.5/5
- App Store rating > 4.7/5

#### 7.8. RevenueCat Paywall Audit (Current Implementation)

The following features are currently integrated with RevenueCat using the `premium` entitlement (pro tier).

| Feature Category | Free Tier Limit | Premium (Kiwi Pro) Access | Status |
| :--- | :--- | :--- | :--- |
| **Vocabulary Size** | Max 50 Icons | Unlimited Icons | ✅ Active |
| **Custom Photos** | Max 20 Photos | Unlimited Custom Photos | ✅ Active |
| **Profiles** | 1 Learner Profile | Unlimited Profiles | ✅ Active |
| **Characters** | Max 3 Custom People | Unlimited Memojis/Characters | ✅ Active |
| **Color Themes** | Default Theme only | All Premium Themes (Ocean, Forest, etc.) | ✅ Active |
| **Analytics** | Last 7 Days History | Unlimited History & Data Export (CSV) | ✅ Active |
| **Speech/Voice** | System Voices | Voice Presets & Custom Pronunciation | ✅ Active |
| **Templates** | Starter Templates | All Premium Contextual Boards | ✅ Active |
| **Multi-Page** | Single Page Boards | Unlimited Pages & Page Management | ✅ Active |
| **Cloud Sync** | Local-only Storage | Real-time Cloud Backup & Team Sharing | ✅ Active |

**Technical Implementation:**
- **Trigger:** `src/utils/paywall.js`
- **Service:** `src/services/RevenueCatService.js`
- **SDK:** `@revenuecat/purchases-capacitor` + `purchases-capacitor-ui` (Native Paywalls)

---

### 9. Brand Guidelines

> **Identity:** Kiwi Voice is professional, modern, and high-fidelity. The branding avoids "childish" tropes in favor of an accessible, sleek aesthetic that grows with the user.

#### 9.1. Brand Colors
| Role | Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Dark Teal | `#1A535C` | Hero buttons, active states, main brand marks. |
| **Secondary** | Kiwi Teal | `#4ECDC4` | Accents, success states, secondary brand marks. |
| **Background** | Cream Shell | `#FDF8F3` | Primary page background (warm, low-fatigue). |
| **Surface** | Pure White | `#FFFFFF` | Cards, modals, and communication buttons. |
| **Text** | Charcoal | `#2D3436` | Primary headings and high-contrast body text. |

#### 9.2. Typography
- **Primary Typeface:** `SF Pro Rounded` (System)
  - *Rationale:* Rounded terminals feel friendly and approachable while maintaining high legibility for AAC.
- **Alternative Typeface:** `Lexend`
  - *Usage:* Literacy mode / Dyslexia-friendly override.
- **Font Scale:** 
  - **Hero Header:** `4rem / 900 weight`
  - **Section Title:** `3.5rem / 900 weight`
  - **Icon Labels:** `0.875rem to 1.25rem / 600 weight`

#### 9.3. Visual Elements
- **Logo:** `public/images/logo.png` (PNG format required for high fidelity).
- **Corner Radii:** Standardized at `radius-md` (1.25rem) for cards and `radius-xl` (2.5rem) for avatars.
- **Haptic Tone:** Clean, crisp haptics (Light/Medium) to match the visual spring animations.
- **Icon Layout:** Icons always render above their labels (image top, word bottom) in all grid modes.
- **Dialog Close:** Every dialog includes a standard iOS close box in the upper-right corner.

---

### 10. Roadmap & Implementation Status

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
| **Phase 19** | Quick Start & Template System | **COMPLETE** |
| **Phase 20** | Social Sharing & Collaboration | **COMPLETE** |
| **Phase 21** | Usage Analytics & Progress Tracking | **COMPLETE** |
| **Phase 22** | Symbol Libraries & Personal Photos | **PARTIAL** (Photos Complete) |
| **Phase 23** | Board Layout & Motor Planning | **COMPLETE** |
| **Phase 24** | Switch Access & Motor Accessibility | **✅ COMPLETE** |
| **Phase 25** | AI Vision: JIT Visual Scene Automation | **COMPLETE** |
| **Phase 26** | Multi-Language Mirroring | **COMPLETE** |
| **Phase 27** | Native Quality Parity (High Fidelity) | **COMPLETE** |
| **Phase 28** | Advanced Motor Accessibility & Access Profiles | **PLANNED** |
| **Phase 29** | Biometric Security (FaceID/TouchID) | **✅ COMPLETE** |
| **Phase 30** | Physical Scaling for Motor Accessibility | **✅ COMPLETE** (Calibration UI pending) |


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
- [x] **All Languages:** Show all system voices, not just English (currently filtered to English only).
- [x] **Language Selector:** Allow filtering by language preference in voice settings.
- [x] **Spanish Priority:** Ensure Spanish voices are easily accessible alongside English.
- [x] **Language-Aware Rate:** Provide guidance on optimal speaking rates for different languages.

#### 15.5. Voice Quality Guidance
- [x] **Download Indicators:** Mark which voices require iOS Settings download for offline use.
- [x] **Quality Badges:** Clearly distinguish between Siri/Neural/Premium vs. basic system voices.
- [x] **Setup Instructions:** Provide in-app guidance to download high-quality voices if needed.
- [x] **Enhanced Voice Detection:** Automatically detect and prioritize Enhanced/Premium voices in the list.
- [x] **Smart Voice Filtering (IMPLEMENTED):** Default view shows only natural-sounding, high-quality voices
  - Filters out robotic/novelty voices (Albert, Bad News, Bahh, Bells, Boing, Bubbles, Cellos, etc.)
  - Shows only Enhanced, Premium, Neural, Siri, and other natural-sounding voices
  - "Show All" / "Quality Only" toggle for advanced users who need access to all voices
  - Clear visual indicators: ✨ for high-quality voices, 🤖 for robotic voices (when showing all)
  - Empty state message when no high-quality voices are available with download instructions
- [x] **Zen Voice Setup Guide (REDESIGNED):**
  - Clean, minimal notification card with microphone icon 🎙️
  - "Upgrade Voice Quality" → "Get natural-sounding voices"
  - Simple 3-step instructions (numbered 1-2-3) instead of verbose text
  - Single action button: "Refresh Voice List" with loading state
  - Removed yellow warning colors → neutral gray gradient
  - Removed redundant tips and pro tip sections
  - Standard iOS "Done" button instead of circular X
  - Calm, focused design that doesn't overwhelm users

#### 15.6. Voice Presets
- [x] **Young Child Preset:** Higher pitch (1.2x), slower rate (0.8x) for child-like voice.
- [x] **Adult Preset:** Normal pitch (1.0x), normal rate (1.0x) for standard adult voice.
- [x] **Clear Speech Preset:** Normal pitch (1.0x), slower rate (0.7x) for maximum clarity.
- [x] **Custom Presets:** Allow users to save their own preset combinations.
- [x] **Quick Apply:** One-tap application of presets from voice settings.

#### 15.7. Communication Interface (Message Bar)
- [x] **Sentence Strip:** Message bar at top where tapped icons accumulate into sentences.
- [x] **Speak All Button:** Play entire sentence from message bar with proper spacing.
- [x] **Clear Button:** Remove all icons from message bar at once.
- [x] **Individual Removal:** Tap icons in message bar to remove them selectively.
- [x] **Use Mode vs Edit Mode:** Dedicated communication mode separate from library editing.
- [x] **Auto-Speak Option:** Toggle to speak words immediately on tap vs. accumulating first.
- [x] **Repetition Delay (Anti-Spam Protection):**
    - Default: 5 seconds between same word repetitions
    - Prevents children from rapid-fire tapping the same button
    - Adjustable from 0-15 seconds in Adult Settings
    - Per-word cooldown tracking (each word has independent timer)
    - Visual feedback when button is in cooldown period
    - Rationale: Encourages intentional communication vs. stimming/button-mashing
- [x] **Smart Speak Button Feedback:**
    - Visual indicator (glow/highlight) when sentence meets minimum length criteria
    - Button is always active - user can speak partial sentences at any time
    - Enhanced visual state when sentence is "complete" according to level goals
    - Provides clear affordance for when communication goal has been achieved
    - Supports progressive learning by celebrating milestone completion

#### 15.8. Recorded Voice Integration
- [x] **Custom Voice Recording:** Allow recording custom audio clips for specific buttons.
- [x] **Playback Controls:** Play, re-record, and delete recorded audio.
- [x] **Parent Voice Library:** Curated collection of common phrases in parent's voice (e.g., "I love you").
- [x] **Mix TTS and Recordings:** Support both synthesized and recorded audio in the same sentence.

---

### 16. Phase 16: Apple Design & Accessibility Standards (New)

#### 16.1. High-Contrast Color System (WCAG 2.1 AA)
- [x] **Contrast Remediation:** 
    - Update primary UI colors to ensure 4.5:1 ratio against text.
    - **Design Audit:** See [design_audit.md](./design_audit.md) for full contrast mapping and remediation logs.
    - **Teal (#4ECDC4) ->** Switch to dark teal (#1A535C) to meet 4.5:1 ratio.
    - **Fitzgerald Key:** 
        - Nouns (Yellow #FFEB3B) -> Dark Text (#2D3436).
        - Verbs (Green #4CAF50) -> Darkened (#1B5E20) to pass white text.
        - Adjectives (Blue #2196F3) -> Darkened (#0D47A1).

#### 16.2. Typography & Layout Scaling
- [x] **Dynamic Type Implementation:**
    - Convert all hardcoded `px` font sizes to `rem`.
    - Use `clamp()` for responsive header text to prevent clipping on small devices.

#### 16.2a. iOS Modal/Sheet Close Button Standards (UPDATED)
- [x] **Adult Settings Sheet:** "Done" button (top-right, iOS blue #007AFF)
- [ ] **Systematic Update Needed:** Apply standard iOS close patterns across all modals
  - **Standard Pattern:** Text-based "Done" or "Cancel" buttons instead of circular X buttons
  - **Positioning:** Top-right corner for primary action ("Done"), top-left for secondary ("Cancel")
  - **Color:** iOS blue (#007AFF) for affirmative actions
  - **Typography:** SF Pro, 600 weight, ~17pt (1.0625rem)
  - **Touch Target:** Minimum 44x44pt per Apple HIG
  - **Rationale:** Circular X buttons are not standard iOS design (more Android Material Design)

**Apple HIG Reference:**
- Sheets should use "Done" button in navigation bar
- Full-screen modals can use "Cancel" (left) and "Done" (right)
- Avoid custom close button designs that don't match platform conventions
- Maintain consistent dismiss patterns throughout the app

**Components to Update:**
- Dashboard.jsx ❌ (uses circular X)
- EditModal.jsx ❌ (uses circular X)
- PickerModal.jsx ❌ (uses circular X)
- MemojiPicker.jsx ❌ (uses circular X)
- All other modal components ❌
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

**Integrated Skill Training:** Kiwi Voice provides native, evidence-based FCR (Functional Communication Response) and Denial Tolerance modes—features that usually require separate clinical protocols in other apps.

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

> **Competitive Context:** All major AAC apps (Proloquo2Go, TouchChat, Snap+Core First) provide starter vocabularies. Blank-slate apps have poor adoption rates. Default boards reduce setup friction for parents/therapists.

#### 19.1. Default Core Vocabulary
- [x] **Core 50 Words:** Pre-loaded default vocabulary based on AAC research (CORE_VOCABULARY).
- [x] **Ready Out of Box:** First launch includes functional board rather than blank slate.
- [x] **Bilingual Labels:** Core words available in English with Spanish translation support.
- [x] **Auto-Population:** Automatically populate grid with core vocabulary on first install.
- [x] **Guided Setup:** Onboarding flow to help users customize the default board.

**Competitor Comparison:**
- **Snap+Core First:** Default 70-word core board (industry standard)
- **TouchChat:** WordPower default board with 100+ words
- **Proloquo2Go:** Crescendo preset with customizable starting vocabulary
- **Kiwi Voice:** 50-word bilingual starter (competitive parity)

**Core Vocabulary Category:**
- [ ] **Dedicated "Core Words" Section:** Explicit category separate from emoji categories
- [ ] **High-Frequency Words:** I, want, more, yes, no, help, stop, go, like, feel, see, etc.
- [ ] **AAC Research-Based:** Based on Banajee, Dicarlo, and Buras (2003) core vocabulary lists
- [ ] **Visual Priority:** Core words always visible, not buried in emoji categories
- [ ] **Color Coding:** Optional Fitzgerald Key coloring (nouns=yellow, verbs=green, etc.)

**Friction Reduction - Smart Category Headers (IMPLEMENTED):**
- [x] **Auto-Hide at Level 3+:** Category section headers automatically hide when all items fit on one screen
- [x] **Color-Only Organization:** Background colors (Fitzgerald Key) provide visual organization without headers
- [x] **Rationale:** Reduce nested folder friction - one of the main points is eliminating unnecessary complexity
- [x] **Smart Detection:** Calculates if items fit based on grid dimensions (rows × cols)
- [x] **Manual Override:** Users can still toggle headers in settings if needed
- [x] **Benefit:** Faster access to vocabulary, less scrolling, simpler visual hierarchy

#### 19.2. Template Library
- [x] **Pre-Built Templates:** Multiple ready-made boards (First 50 Words, School Day, etc.).
- [x] **Template Data Structure:** TEMPLATES object in aacData.js with curated word lists.
- [x] **Context-Specific Boards:** CONTEXT_DEFINITIONS for School, Home, Park, Mealtime scenarios.
- [ ] **One-Click Apply:** Quick-apply templates to current board or create new board from template.
- [ ] **Template Gallery:** Visual gallery showing preview of each template before application.
- [ ] **Community Templates:** User-submitted templates shared via cloud (future).

**Template Categories:**
- **Starter Templates (Free):**
  - First 50 Words (bilingual English/Spanish)
  - Feelings & Emotions
  - Basic Needs (food, bathroom, help)
  - Yes/No Communication

- **Premium Templates (Kiwi Pro):**
  - School Day (classroom, homework, friends)
  - Mealtime & Food Preferences
  - Medical & Therapy Sessions
  - Social Situations & Greetings
  - Sensory & Self-Regulation
  - Holiday & Seasonal Boards

#### 19.3. Progressive Complexity
- [ ] **Starter Mode:** Simplified interface for first-time users with only essential features.
- [ ] **Advanced Mode:** Full feature set unlocked after user completes onboarding.
- [ ] **Feature Discovery:** Progressive disclosure of advanced features as users gain proficiency.
- [ ] **Contextual Help:** In-app tooltips and guidance for template customization.

#### 19.4. Onboarding & Help System
- [ ] **First Launch Tutorial:** Interactive walkthrough of core features
- [ ] **Video Tutorials:** Short (<2 min) videos for key tasks (adding icons, changing voice, etc.)
- [ ] **Contextual Tooltips:** Appear when user hovers over advanced features
- [ ] **Parent/Therapist Guide:** Downloadable PDF guide for setup and customization
- [ ] **Best Practices:** Built-in AAC therapy tips and recommendations
- [ ] **Help Center Link:** Direct link to online documentation and support

**Competitor Comparison:**
- **CoughDrop:** Excellent in-app tutorials and tooltips (industry leader)
- **Proloquo2Go:** Video library and extensive documentation
- **TouchChat:** Built-in help system with search
- **Kiwi Voice:** Must match or exceed for first-time user success

---

### 20. Phase 20: Social Sharing & Collaboration

> **Competitive Context:** CoughDrop excels at cloud-based sharing ($9/month). Proloquo2Go/TouchChat use proprietary file exports. Cboard has community board gallery. Kiwi must provide simple sharing while maintaining privacy-first approach.

#### 20.1. Board Sharing (QR Code) - IMPLEMENTED
- [x] **QR Code Generation:** Share boards via QR code for instant device-to-device transfer.
- [x] **URL Encoding:** Compress board data with LZ-String for shareable URLs.
- [x] **Import from QR:** Scan QR code to import shared boards.
- [x] **Visual Share Modal:** Polished UI with QR code display and copyable link.

**Current Limitations:**
- QR codes only work for small boards (data size limits)
- No cloud storage means data loss if QR code expires
- Manual process vs one-click cloud sharing

#### 20.2. Export & Backup - IMPLEMENTED
- [x] **Full Data Export:** BackupRestore component for exporting all Kiwi data.
- [x] **JSON Backup:** Export iconsData, settings, analytics in timestamped JSON file.
- [x] **Native Share:** Capacitor Share API integration for iOS/Android sharing.
- [x] **Import Restore:** Import backup files to restore complete app state.
- [ ] **Selective Export:** Choose specific boards or data to export (not all-or-nothing).

**Competitor Comparison:**
- **Proloquo2Go:** Proprietary .p2g files (iOS only)
- **TouchChat:** .cht files with cross-platform compatibility
- **CoughDrop:** Cloud-first with JSON export option
- **Kiwi Voice:** JSON export (open format, privacy-first)

#### 20.3. Cloud Sync & Collaboration
- [x] **Cloud Storage:** Neon integration for anonymous cloud backup and restore (restores automatically based on device ID).
- [ ] **Team Sharing:** Share boards with multiple users (teachers, therapists, parents).
- [x] **Real-Time Sync:** Sync boards across multiple devices for same user.
- [x] **Access Codes:** Simple 8-digit codes for sharing boards (like Zoom/Kahoot).
- [ ] **Version History:** Track board changes and revert to previous versions.

**Access Code System (Recommended):**
```javascript
// Simple sharing model:
// 1. User clicks "Share Board"
// 2. System generates 6-digit code (e.g., "K1W2I3")
// 3. Code valid for 30 days
// 4. Recipient enters code → instant board download
// 5. No account required, privacy-focused
```

**Competitor Comparison:**
- **CoughDrop:** Full cloud sync, real-time collaboration, $9/month
- **Proloquo2Go:** iCloud sync within same Apple ID only
- **TouchChat:** Dropbox integration for board sharing
- **Kiwi Voice:** Simple access codes (easier than file sharing)

#### 20.4. Community Board Gallery (NEW)

> **Inspired by:** Cboard's free community boards, but with quality curation and SLP validation

- [ ] **Public Board Library:** Cloud-based gallery of community-created boards
- [ ] **Browse by Category:** Age group (toddler, child, teen, adult), language, use case
- [ ] **Search & Filter:** Keyword search, language filter, rating sort
- [ ] **One-Click Download:** Instant board import from gallery
- [ ] **Rating System:** 5-star ratings with written reviews
- [ ] **Usage Stats:** "Downloaded X times" to show popular boards

**Board Submission Process:**
1. User creates board and tests it
2. Clicks "Share to Community"
3. Submits with title, description, tags, language, age range
4. Optional: Submit for SLP review (featured badge)
5. Board appears in gallery within 24 hours
6. Community rates and reviews

**Quality & Moderation:**
- "Featured" badge
- Community flagging for inappropriate content
- Automated checks for broken images/links
- Required metadata: Language, age range, use case

**Privacy Considerations:**
- No personal data in shared boards (names, photos)
- Anonymous submission option
- User can unpublish boards anytime
- Downloaded boards are local copies (not synced to original)

#### 20.5. Collaboration Features
- [ ] **Team Roles:** Different permissions for parents, therapists, educators.
- [ ] **Comments & Notes:** Therapist annotations on specific icons or progress.
- [ ] **Shared Analytics:** View usage data across team members.
- [ ] **Email/Link Sharing:** Send board link via email for easy distribution.
- [ ] **Activity Feed:** See when team members make changes to shared boards
- [ ] **Read-Only Mode:** Share boards for viewing without editing permissions

**Team Collaboration Use Cases:**
- **Parent-Therapist:** Therapist creates board, parent uses at home, data shared
- **School Team:** Teacher, SLP, aide all access same board for consistency
- **Multi-Device Family:** Same boards on iPad (home), tablet (school), phone (errands)
- **Clinical Settings:** SLP manages multiple client boards from admin dashboard

**Competitor Comparison:**
- **CoughDrop:** Industry leader in team collaboration (benchmark)
- **Snap+Core First:** Limited team features (room for improvement)
- **Proloquo2Go:** No collaboration (single-user focus)
- **Kiwi Voice:** Must match CoughDrop's collaboration to compete

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

#### 21.4. Adult Insights
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

### 22. Phase 22: Symbol Libraries & Personal Photos (CRITICAL MISSING FEATURE)

> **Competitive Context:** ALL major AAC apps support personal photo upload and traditional AAC symbol sets. This is table-stakes functionality, not a premium feature. Without this, Kiwi cannot compete professionally.

#### 22.1. Personal Photo Upload

**Why Critical:**
- Children with autism recognize real photos better than stylized icons/avatars
- AAC best practice: Use real photos of familiar people, places, objects
- Competitor standard: Proloquo2Go, TouchChat, LAMP, Snap+Core, CoughDrop all support
- Current limitation: Emoji/Memoji may not represent child's actual family/environment

**Implementation Requirements:**
- [x] **Camera Integration:** Capacitor Camera API for taking photos directly
- [x] **Photo Library Access:** Select from device photo library
- [x] **Photo Editor:** Manual square crop on import for icon/profile photos
- [x] **Auto-Optimization:** Resize to optimal dimensions, compress for performance
- [ ] **Photo Categories:** Automatically suggest categories (People, Places, Food, Objects)
- [ ] **Label Suggestions:** OCR or manual labeling for each photo
- [ ] **Storage Management:** Show photo storage usage, delete unused photos

**Free Tier Limits:**
- Up to 20 custom photos (sufficient for core family/environment)
- Basic photo editing (crop)
- Local storage only

**Premium Tier (Kiwi Pro):**
- Unlimited custom photos
- Advanced editing (filters, contrast, brightness)
- Cloud backup of photos (synced across devices)
- Batch photo import
- Photo collections (organize by context)

**Technical Specifications:**
```javascript
// Photo data structure
{
  id: 'photo_uuid',
  type: 'custom_photo',
  imageUrl: 'data:image/jpeg;base64,...', // or local file path
  label: 'Grandma',
  category: 'My People',
  dateAdded: '2025-01-02',
  metadata: {
    originalFilename: 'IMG_1234.jpg',
    dimensions: { width: 800, height: 600 },
    fileSize: 125000, // bytes
    tags: ['family', 'people']
  }
}
```

**Use Cases:**
- Family members (Mom, Dad, siblings, grandparents)
- Familiar places (home, school, therapy clinic, park)
- Favorite objects (specific toy, blanket, snack, pet)
- Medical equipment (wheelchair, AAC device, medication)
- Daily routine items (toothbrush, backpack, lunchbox)

#### 22.2. Symbol Library Integration

**Why Critical:**
- Emoji limitations: Missing AAC-specific concepts (therapy, medication, sensory, bathroom, etc.)
- Professional AAC apps use PCS, SymbolStix, Widgit, or open symbol sets
- SLPs expect traditional symbol support for clinical credibility
- Some concepts clearer with symbols than emoji (abstract actions, medical terms)

**Open Symbol Libraries (Free Tier):**

**ARASAAC (Recommended Priority 1):**
- [x] 40,000+ symbols in 30+ languages
- [x] Free, Creative Commons license
- [x] Covers comprehensive AAC vocabulary
- [x] API available: https://api.arasaac.org/
- [x] Used by Cboard (proven integration)
- [x] High-quality, clear, consistent style

**Mulberry Symbols:**
- 3,400+ symbols
- Creative Commons license
- Designed for AAC specifically
- SVG format (scalable)
- Good for basic vocabulary

**OpenMoji:**
- 4,000+ open-source emoji
- Consistent style (vs platform emoji variance)
- SVG format
- Good emoji alternative

**Premium Symbol Libraries (Kiwi Pro):**

**PCS (Picture Communication Symbols) - Tobii Dynavox:**
- Industry standard (used in Proloquo2Go, Snap+Core)
- 50,000+ symbols
- Requires licensing ($$$)
- High recognition, professional quality

**SymbolStix - n2y:**
- 40,000+ symbols
- Used in TouchChat, Boardmaker
- Licensing required
- Excellent for educational settings

**Implementation Architecture:**
```javascript
// Unified search across libraries
searchIcons(query, libraries = ['emoji', 'arasaac', 'mulberry']) {
  const results = [];

  if (libraries.includes('emoji')) {
    results.push(...searchEmoji(query));
  }

  if (libraries.includes('arasaac')) {
    results.push(...searchARASAAC(query)); // API call
  }

  if (libraries.includes('mulberry')) {
    results.push(...searchMulberry(query));
  }

  // Merge and deduplicate
  return deduplicateResults(results);
}
```

**User Experience:**
- [x] **Unified Search:** Search across emoji + symbols simultaneously
- [x] **Library Selector:** Toggle which libraries to search (emoji, ARASAAC, Mulberry, etc.)
- [x] **Visual Distinction:** Clear icon badges showing source (🎨 emoji, 📚 ARASAAC, etc.)
- [x] **Mixed Boards:** Allow emoji and symbols on same board
- [x] **Symbol Preview:** Hover/long-press to see larger preview
- [x] **Download Management:** Symbols cached locally for offline use (via browser cache)
- [x] **Symbol Packs:** Pre-download common symbol sets (Core Vocabulary, Medical, School)

**Category Mapping:**
- Map ARASAAC categories to Kiwi categories
- Automatic suggestion: "No emoji found, try ARASAAC symbols?"
- Fallback hierarchy: Emoji → ARASAAC → Mulberry → Custom Photo

#### 22.3. Hybrid Icon Boards

**Best Practice Approach:**
- Emoji for universally recognized items (food, animals, basic emotions)
- Symbols for AAC-specific concepts (therapy, communication, sensory)
- Photos for personal/familiar items (family, home, favorite objects)
- Mixed approach recommended by SLPs

**Example Board Composition:**
- "I" → Memoji avatar (visual appeal)
- "want" → ARASAAC symbol (clear action)
- "Mom" → Personal photo (recognition)
- "cookie" → Cookie emoji (universal)
- "bathroom" → ARASAAC symbol (clear, appropriate)
- "help" → ARASAAC symbol (professional)

#### 22.4. Technical Implementation

**ARASAAC API Integration:**
```javascript
// Fetch symbols by keyword
async function searchARASAAC(keyword, language = 'en') {
  const response = await fetch(
    `https://api.arasaac.org/api/pictograms/${language}/search/${keyword}`
  );
  const symbols = await response.json();

  return symbols.map(s => ({
    id: `arasaac_${s._id}`,
    name: s.keywords[0].keyword,
    category: mapARASAACCategory(s.categories),
    imageUrl: `https://static.arasaac.org/pictograms/${s._id}/${s._id}_500.png`,
    type: 'arasaac_symbol',
    source: 'ARASAAC'
  }));
}
```

**Local Caching:**
- Cache symbol images in IndexedDB for offline use
- Pre-download core vocabulary symbols on install
- Progressive download: Fetch symbols as user searches
- Storage quota management: Limit to 50MB symbol cache

**Competitor Feature Comparison:**

| Feature | Kiwi Voice | Proloquo2Go | TouchChat | Cboard |
|---------|------------|-------------|-----------|---------|
| Personal Photos | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Open Symbols | ✅ ARASAAC+OpenMoji | ❌ No | ❌ No | ✅ ARASAAC |
| Premium Symbols | ⏳ Planned | ✅ PCS | ✅ SymbolStix | ❌ No |
| Mixed Boards | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Symbol Search | ✅ Unified (4 sources) | ✅ Yes | ✅ Yes | ✅ Yes |
| Motor Planning | ✅ Yes (Fixed Grid) | ✅ Yes | ✅ Yes | ❌ Dynamic |
| Switch Access | ⏳ Planned | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Color Coding | ✅ Yes (Fitzgerald) | ✅ Yes | ✅ Yes | ✅ Yes |
| Multi-Page | ✅ Yes (Tabs+Thumbs) | ✅ Yes | ✅ Yes | ✅ Yes |
| **Memoji Aesthetic**| ✅ **3D Characters** | ❌ 2D Only | ❌ 2D Only | ❌ 2D Only |
| **Skill Training** | ✅ **FCR & Denial** | ❌ No | ❌ No | ❌ No |
| **Routine Builder** | ✅ **Visual Schedules**| ❌ No | ❌ No | ❌ No |
| **Biometric Security** | ✅ **FaceID/TouchID** | ✅ Yes | ✅ Yes | ❌ No |
| **Physical Scaling (mm)** | ✅ **Precise** | ❌ No | ❌ No | ❌ No |
| **Price** | ✅ **$39/yr (Free Tier)**| ❌ $249+ | ❌ $299+ | ✅ Free |
| **Cross-Platform** | ✅ **Web/iOS/Android** | ❌ iOS Only | ⚠️ iOS/Android | ✅ Web Only |
| Biometrics | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |

---

### 23. Phase 23: Board Layout & Motor Planning (CRITICAL AAC FEATURE)

> **Competitive Context:** Motor planning is foundational to AAC success. LAMP Words for Life ($299) built entire system on this principle. TouchChat, Proloquo2Go all support consistent icon positioning. Without this, Kiwi is not a serious AAC tool.

#### 23.1. Grid Arrangement & Customization

**Why Critical:**
- **Motor Planning:** Consistent icon positions = muscle memory = faster communication
- **Cognitive Load:** Same word in same spot reduces decision fatigue
- **AAC Best Practice:** Position stability is more important than alphabetical order
- **LAMP Principle:** "Learning a motor plan" (Unity system, $299 competitor)

**Current Limitation:**
- Kiwi currently uses dynamic emoji grids with shifting positions
- Icons move when searching/filtering (destroys motor planning)
- No control over icon placement

**Required Features:**
- [x] **Drag-and-Drop Positioning:** Click and drag icons to exact positions
- [x] **Grid Size Options:** 2×2, 3×3, 4×4, 5×5, 6×6, 8×8, custom
- [x] **Icon Size Controls:** Small (1cm), Medium (1.5cm), Large (2cm), Extra Large (3cm)
- [x] **Spacing Controls:** Tight, Normal, Comfortable (padding between icons)
- [x] **Snap-to-Grid:** Automatic alignment for neat organization
- [x] **Lock Layout:** Prevent accidental position changes
- [ ] **Grid Lines:** Optional visual grid for precise placement
- [ ] **Position Numbers:** Show grid coordinates (A1, B2, etc.) for reference

**Grid Specifications:**
```javascript
// Grid configuration options
const gridConfigs = {
  '2x2': { rows: 2, cols: 2, iconSize: 'xl', spacing: 'comfortable' },
  '3x3': { rows: 3, cols: 3, iconSize: 'large', spacing: 'comfortable' },
  '4x4': { rows: 4, cols: 4, iconSize: 'large', spacing: 'normal' },
  '5x5': { rows: 5, cols: 5, iconSize: 'medium', spacing: 'normal' },
  '6x6': { rows: 6, cols: 6, iconSize: 'medium', spacing: 'tight' },
  '8x8': { rows: 8, cols: 8, iconSize: 'small', spacing: 'tight' },
  'custom': { rows: null, cols: null, iconSize: 'medium', spacing: 'normal' }
};
```

#### 23.2. Motor Planning Features

**Position Locking:**
- [x] **Lock All Positions:** Global lock to prevent any icon movement (Implemented via 'isLayoutLocked')
- [x] **Lock Individual Icons:** Lock specific icons (e.g., core vocabulary stays put via fixed 'pos')
- [x] **Visual Lock Indicator:** Padlock icon on locked items
- [ ] **Unlock with Password:** Require passcode to unlock layout (prevent child changes)

**Consistent Placement Across Contexts:**
- [x] **Core Vocabulary Fixed:** Core words (I, want, more, yes, no) in same spot across all boards
- [x] **Context-Specific Layers:** School board shows school words, but core words stay in place
- [x] **Overlay System:** Core layer + context layer (Dynamic merge at root)

**Color Coding (Fitzgerald Key):**
- [x] **Noun Color:** Yellow background for nouns (Mom, cookie, ball)
- [x] **Verb Color:** Green background for verbs (want, go, eat, play)
- [x] **Adjective Color:** Blue background for adjectives (big, little, happy, sad)
- [x] **Social Words:** Pink background for social words (hi, bye, please, sorry)
- [x] **Questions:** Purple background for question words (what, where, when, who)
- [x] **Custom Colors:** User-defined color categories (Already supported via 'bgColor')
- [x] **Toggle On/Off:** Option to disable color coding if overwhelming

**Competitor Comparison:**
- **LAMP Words for Life:** Entire app based on motor planning ($299)
- **TouchChat:** Supports WordPower with consistent positions (industry standard)
- **Proloquo2Go:** Crescendo system with stable core vocabulary positions
- **Kiwi Voice:** MUST implement to be taken seriously by SLPs

#### 23.3. Progressive Revelation (Hide/Show Icons)

**Why Important:**
- Start simple (20 icons) → gradually add complexity as proficiency grows
- Prevents overwhelming new users with 100+ icons immediately
- SLP-controlled vocabulary expansion
- Encourages mastery before adding new words

**Implementation:**
- [x] **Hide Icons:** Gray out or completely hide icons not yet introduced
- [x] **Show Icons:** Gradually reveal new icons as child progresses
- [x] **Proficiency Levels:** Beginner (20 icons) → Intermediate (50) → Advanced (100+)
- [x] **Unlock Criteria:** Manual unlock via Vocabulary Level settings
- [x] **Visual Cues:** "Unlock Soon" badge on grayed-out icons
- [x] **Mastery Tracking:** Track icon usage to determine readiness for new vocabulary (Integrated with Proficiency settings)

**Example Progression:**
1. **Week 1:** Show only 10 core words (I, want, more, yes, no, help, stop, go, eat, drink)
2. **Week 2:** Add 10 more words (Mom, Dad, play, toy, happy, sad, like, all done, come, please)
3. **Week 3:** Add specific vocabulary based on usage patterns
4. **Month 2:** Full 50-word core vocabulary visible
5. **Month 3+:** Context-specific fringe vocabulary unlocked

**Adult Controls:**
- [ ] **Unlock Schedule:** Define which icons unlock when
- [ ] **Manual Override:**  can unlock specific icons anytime
- [ ] **Adult View:** Parents see what's hidden vs visible
- [ ] **Progress Reports:** Track vocabulary expansion over time

#### 23.4. Visual Boundaries & Organization

**Category Sections:**
- [x] **Section Borders:** Visual dividers between categories (Implemented via themed cards)
- [x] **Section Labels:** Category headers (Core, People, Actions, Things, etc.)
- [x] **Collapsible Sections:** Hide/show entire categories
- [x] **Section Colors:** Background color per category for visual organization

**Page/Folder Navigation:**
- [x] **Folder System:** Already implemented for contexts (School, Home, etc.)
- [x] **Page Tabs:** Multiple pages within same board (Page 1, Page 2, etc.)
- [x] **Page Thumbnails:** Visual preview of each page (Implemented at grid bottom)
- [x] **Quick Jump:** Jump to specific page/category with one tap

---

### 24. Phase 24: Switch Access & Motor Accessibility (CRITICAL ACCESSIBILITY FEATURE)

> **Competitive Context:** Users with severe motor disabilities cannot use touchscreens. Switch scanning is legally required for accessibility compliance (ADA, Section 508). All professional AAC apps support this.

#### 24.1. Why Critical

**Legal Requirements:**
- ADA (Americans with Disabilities Act) requires accessible technology
- Section 508 compliance for educational/government use
- WCAG 2.1 Level AA accessibility standard

**User Need:**
- Cerebral palsy, muscular dystrophy, spinal cord injury users
- Cannot use touchscreen or precise pointing
- Require switch scanning (sequential highlighting)
- May be 10-20% of AAC user population

**Competitor Standard:**
- Proloquo2Go: Full switch scanning support
- TouchChat: Industry-leading switch access
- Snap+Core First: Comprehensive scanning options
- Kiwi Voice: MUST have basic scanning to be accessible

#### 24.2. Basic Auto-Scan Mode (Priority 1 - IN DEVELOPMENT)

**Development Timeline:** 2-4 weeks for basic implementation

**Sequential Scanning:**
- [ ] **Auto-Highlight:** Icons highlighted one-by-one automatically
- [ ] **Scan Speed:** Adjustable 1s - 3s per icon (start with 1.5s default)
- [ ] **Visual Indicator:** Bold border + color change on highlighted icon
- [ ] **Audio Cue:** Optional beep/click sound on each highlight
- [ ] **Single-Switch Activation:** Tap anywhere (screen, external switch, keyboard spacebar) to select
- [ ] **Wraparound:** Scan loops continuously until selection made
- [ ] **Pause on Hover:** Longer pause on icon mouse/touch hover (optional)

**Scan Pattern Options:**
- [ ] **Linear Scan:** Left-to-right, top-to-bottom
- [ ] **Row-Column Scan:** Scan rows first, then columns within selected row
- [ ] **Reverse Scan:** Right-to-left, bottom-to-top
- [ ] **Random Scan:** Random order (for testing attention)

**Technical Implementation:**
```javascript
// Auto-scan state machine
const ScanMode = {
  currentIndex: 0,
  scanSpeed: 1500, // ms
  isScanning: true,
  scanPattern: 'linear', // 'linear', 'row-column', 'reverse'

  startScan() {
    this.interval = setInterval(() => {
      this.highlightNext();
    }, this.scanSpeed);
  },

  highlightNext() {
    // Move highlight to next icon
    const icons = document.querySelectorAll('.aac-icon');
    icons[this.currentIndex].classList.remove('scanning');
    this.currentIndex = (this.currentIndex + 1) % icons.length;
    icons[this.currentIndex].classList.add('scanning');

    // Audio cue
    if (this.audioCuesEnabled) this.playBeep();
  },

  select() {
    // User pressed switch
    const selectedIcon = document.querySelectorAll('.aac-icon')[this.currentIndex];
    this.triggerIconAction(selectedIcon);
  }
};
```

#### 24.3. Two-Switch Mode (Priority 2)

**Switch Functions:**
- [ ] **Switch 1:** Advance to next icon
- [ ] **Switch 2:** Select current icon
- [ ] **Manual Control:** User controls scan speed (no auto-advance)
- [ ] **More Precise:** Better control than single-switch auto-scan
- [ ] **Preferred by Power Users:** Faster for experienced users

**Switch Input Methods:**
- Keyboard keys (Space = advance, Enter = select)
- External switch hardware (Bluetooth, USB)
- Capacitive switches (AbleNet, Enabling Devices)
- Sip-and-puff switches
- Eye-gaze dwell clicks (future)

#### 24.4. Advanced Scanning Options (Priority 3)

**Group Scanning:**
- [ ] **Category-First:** Scan categories, then icons within category
- [ ] **Reduces Steps:** Fewer scans to reach target icon
- [ ] **Hierarchical:** Multiple levels (Category → Subcategory → Icon)

**Auditory Scanning:**
- [ ] **Speak Icon Names:** Text-to-speech reads icon label during scan
- [ ] **For Blind Users:** Vision-impaired users can use AAC via scanning
- [ ] **Dual Feedback:** Visual + auditory for maximum accessibility

**Scan Profiles:**
- [ ] **Save Scan Settings:** Different profiles for different users
- [ ] **Quick Switch:** Toggle between scan profiles easily
- [ ] **Per-User Customization:** Each learner profile has own scan settings

**Scan Optimization:**
- [ ] **Frequency-Based:** Place most-used icons earlier in scan order
- [ ] **Context-Aware:** Different scan orders for different contexts
- [ ] **Learning Algorithm:** Adapt scan order based on usage patterns

#### 24.5. External Switch Integration

**Hardware Support:**
- [ ] **Bluetooth Switches:** AbleNet Blue2, Enabling Devices switches
- [ ] **USB Switches:** Wired switch input via USB adapter
- [ ] **Keyboard Mapping:** Map any key to switch function
- [ ] **Multi-Switch:** Support 2-5 switches for advanced users
- [ ] **Switch Calibration:** Test switch responsiveness and adjust timing

**Switch Vendors:**
- AbleNet (Blue2 Bluetooth Switch)
- Enabling Devices (iTalk2 with Levels)
- Ablenet Jellybean Twist
- Specs Switch
- Tecla Shield (smartphone switch adapter)

**Implementation:**
```javascript
// Bluetooth switch listener
if ('bluetooth' in navigator) {
  navigator.bluetooth.requestDevice({
    filters: [{ services: ['human_interface_device'] }]
  })
  .then(device => device.gatt.connect())
  .then(server => {
    // Listen for switch press events
    server.on('characteristicvaluechanged', handleSwitchPress);
  });
}

function handleSwitchPress(event) {
  const switchId = event.target.value.getUint8(0);
  if (switchId === 1) ScanMode.advance();
  if (switchId === 2) ScanMode.select();
}
```

#### 24.6. Accessibility Compliance

**WCAG 2.1 Level AA Requirements:**
- [x] Keyboard navigation (Improved with focus indicators)
- [ ] Switch scanning (Planned Future Feature)
- [x] ARIA labels for screen readers
- [x] Focus indicators (High-visibility outline-offset implemented)
- [x] Skip links (Added 'Skip to main content')
- [x] High contrast modes (via color themes and Fitzgerald Key)
- [x] Text spacing adjustment (Ensured fluid layout and relative units)
- [x] Orientation flexibility (Added landscape-specific layout optimizations)

**Testing Requirements:**
- Test with real external switches
- User testing with motor-impaired AAC users
- SLP/OT validation of scan speeds and patterns
- Compliance audit by accessibility expert

---

### 25. Phase 25: AI Vision & Advanced Features (EXPERIMENTAL - REQUIRES VALIDATION)

> **IMPORTANT:** These features are innovative but UNPROVEN in AAC context. Require extensive user testing before full implementation. Do NOT prioritize over core features.

#### 25.1. AI Vision: JIT Visual Scene Automation

**Concept:**
- Upload photo of environment → AI detects objects → auto-create hotspots
- Example: Photo of kitchen → AI finds fridge, stove, sink → create clickable areas
- TensorFlow.js on-device processing (privacy-first, offline capable)

**Validation Requirements:**
- [x] Test with 50+ users to validate usefulness
- [x] Measure accuracy: >90% correct object identification required
- [x] Compare to manual creation: Is AI actually faster/better?
- [x] SLP feedback: Does this improve AAC therapy outcomes?

**If Validated:**
- [x] **Vision Engine Integration:** TensorFlow.js object detection
- [x] **Auto-Hotspot Suggestion:** Bounding boxes → clickable areas
- [x] **Semantic Linking:** Map objects to icons automatically
- [x] **Manual Override:** User can adjust all AI suggestions

**If NOT Validated:**
- Remove feature or keep as experimental "Labs" feature
- Do not prioritize over core features
- Acknowledge that manual creation may be better

#### 25.2. Advanced Morphology Engine

**Grammar Support:**
- [ ] **Plurals:** Cookie → Cookies (add +s toggle)
- [ ] **Possessives:** Mom → Mom's (add 's toggle)
- [ ] **Verb Conjugation:** I want → He wants (subject-verb agreement)
- [ ] **Past Tense:** eat → ate (irregular verb support)

**SLP Validation Required:**
- Does automatic grammar help or confuse learners?
- Should grammar be taught explicitly first?
- Is this appropriate for early AAC users?

#### 25.3. Visual Action Cues (Zen Animations)

**Concept:**
- Beautiful, calming animations to illustrate concepts
- Example: "happy" icon shows gentle smile animation
- Soft, non-distracting visual cues

**Validation Requirements:**
- Test with sensory-sensitive users
- Measure distraction vs. engagement
- SLP feedback on learning impact
- Option to disable for those who find it overwhelming

---

### 26. Phase 26: Multi-Language Mirroring

> **Competitive Context:** Snap+Core First excels at bilingual AAC. Critical for Hispanic families (40M+ Spanish speakers in US). Motor planning requires consistent positions across languages.

#### 26.1. Bilingual AAC Support

**Why Critical:**
- 40 million Spanish speakers in US
- Bilingual AAC is best practice (not separate language boards)
- Motor planning requires same positions across languages
- Code-switching support (mix English/Spanish in same sentence)

**Implementation:**
- [x] **Language Toggle:** Switch entire board English ↔ Spanish instantly
- [x] **Dual Labels:** Show both languages simultaneously (optional)
- [x] **Position Consistency:** Icons stay in exact same spot across languages
- [x] **Voice Switch:** Auto-change TTS voice with language
- [x] **Bilingual Search:** Find icons in either language

**Technical Architecture:**
```javascript
// Language-agnostic board structure
const bilingualIcon = {
  id: 'icon_cookie',
  position: { row: 2, col: 3 }, // Same across languages
  labels: {
    en: 'cookie',
    es: 'galleta'
  },
  image: '🍪', // Same visual
  voices: {
    en: 'Samantha',
    es: 'Monica'
  }
};
```

#### 26.2. Multi-Language Support

**Additional Languages:**
- [ ] French (2M+ speakers in US)
- [ ] Mandarin Chinese (3.5M speakers in US)
- [ ] German (1M+ speakers in US)
- [ ] Arabic (1M+ speakers in US, RTL support required)
- [ ] Hebrew (RTL support)

**Symbol Translation:**
- ARASAAC symbols available in 30+ languages
- Automatic symbol translation via API
- Fallback to emoji if symbol unavailable

---

### 28. Phase 28: Advanced Motor Accessibility & Access Profiles (NEW)

> **Research-Backed Standards:** AAC success depends on physically consistent touch targets. Platform defaults (44pt/48dp) are a baseline, but motor-impaired users require larger, physically-measured targets.

#### 28.1. Touch Target Research & Standards
- **Baseline (Typical Touch):** 9–10 mm minimum (maps to 44pt iOS / 48dp Android).
- **Moderate Motor Challenges / Younger Kids:** 12–15 mm targets.
- **Significant Motor Challenges:** 15–22 mm targets.
- **Hit Area vs. Visual Area:** The "hit area" must always meet the Access Profile requirement, even if the visual icon is smaller.

#### 28.2. Access Profiles
Instead of a single UI for everyone, Kiwi Voice uses **Access Profiles** to drive layout decisions:
- **Target Size:** 10 / 12 / 15 / 18 / 22 mm (Physical measurement).
- **Spacing:** Default to 8dp (approx. 1.5mm) minimum between hit areas.
- **Selection Type:** Direct Touch (Default). Switch Scanning and Eye Gaze are planned future features.
- **Visual Needs:** High contrast, field size limits, and symbol scaling.

#### 28.3. Physical Sizing Strategy
- **Physical Units:** Goal is 10mm feels like 10mm on every device.
- **Conversion Logic:** Use device pixel ratio and standard PPI estimates to convert physical `mm` to CSS `rem/px`.
- **Stable Motor Planning:** When scaling for different screens, keep button relative positions stable. Expand grids by adding rows/columns around the core, rather than reflowing.

#### 28.4. Implementation Requirements
- [x] **Access Profile State:** Store user-specific motor settings in `ProfileContext`.
- [x] **Physical Calibration Tool:** Update `TouchCalibration.jsx` to measure accuracy at specific `mm` sizes.
- [x] **Dynamic Grid Scaling:** Grid cells must calculate size based on the Access Profile's `targetSize` while maintaining a stable layout.
- [x] **Hit Area Enforcement:** Ensure all buttons have a minimum hit area of 44x44pt or the user's custom target size.

#### 28.5. Touch Calibration Interface (IMPLEMENTED)

**Visual Grid Size Selector:**
- [x] **5 Grid Layout Options:** Users can choose from 2×2, 3×3, 4×4, 5×5, or 6×6 grid layouts
- [x] **Animal-Themed Icons:** Each grid size represented by an animal emoji (🐘 elephant for largest, 🐜 ant for smallest)
- [x] **Visual Feedback:** Selected size shows dark teal background (#1A535C) with white text
- [x] **Instant Application:** Grid size and target size settings apply immediately upon selection
- [x] **Integrated with Onboarding:** Touch calibration shown during first-time setup flow
- [x] **Settings Access:** "Redo Touch Calibration" button in Adult Settings → Extra → Accessibility section
- [x] **Unified Experience:** Same calibration interface used in both onboarding and settings

**Grid Size to Target Size Mapping:**
- 2×2 (🐘 Super Big): 22mm touch targets
- 3×3 (🦒 Big): 18mm touch targets
- 4×4 (🐕 Standard): 15mm touch targets
- 5×5 (🐈 Medium): 12mm touch targets
- 6×6 (🐜 Dense): 10mm touch targets

**User Experience:**
- Clear explanatory text: "Larger grids have bigger buttons but fewer words visible"
- Skip option for users who want to configure later
- Persistent storage of calibration choice in user profile

---

### 29. Phase 29: Biometric Security (FaceID/TouchID) ✅ COMPLETE

> **Landing Page Commitment:** Biometric authentication is listed as a key differentiator in the comparison table. This feature protects adult settings from accidental changes while maintaining AAC accessibility.

**Status:** ✅ Implementation complete  
**Implementation Date:** December 2025 - January 2026

#### What Was Implemented

**✅ Biometric Authentication Utilities**
- Created `src/utils/biometricAuth.js` with:
  - `isBiometricAvailable()` - Hardware detection
  - `getBiometricType()` - Returns FaceID, TouchID, or Fingerprint
  - `authenticateWithBiometric()` - Prompts for authentication
  - `isSessionValid()` - 5-minute session management
  - `formatBiometricType()` - User-friendly display strings

**✅ App Integration**
- Added `biometricUnlockTimestamp` state to `App.jsx`
- Settings unlock requires biometric authentication
- 5-minute auto-lock timer after successful auth
- Session management prevents repeated prompts

**✅ Triple-Tap Fallback (AAC Invariant Compliance)**
- Always available, regardless of biometric status
- Visual feedback with tap counter (3 taps remaining → 2 → 1)
- Pulse animation for visibility
- Never blocks access if biometrics fail

**✅ UI Polish**
- `Controls.jsx` enhanced with:
  - Biometric type indicator (e.g., "FaceID", "TouchID")
  - Session status display ("✓ Active - Session unlocked for 5 min")
  - Explicit "🔓 Disable Protection" option
  - Contextual help messages

**✅ Documentation**
- `BIOMETRIC_SECURITY_GUIDE.md` - Comprehensive user guide covering:
  - How to enable/disable
  - Triple-tap fallback instructions
  - Platform availability
  - Troubleshooting
  - Privacy & security details

#### Security Use Cases

**Prevent Accidental Changes:**
- ✅ Child cannot delete icons or change board layout
- ✅ Grid size and motor planning settings protected
- ✅ Voice settings and pronunciation dictionary secured

**Privacy Protection:**
- ✅ Analytics data requires authentication
- ✅ Progress reports and tracking secured
- ✅ Custom voice recordings protected

**Multi-User Environments:**
- ✅ Classroom: Prevent profile switching
- ✅ Therapy: Protect therapist-configured settings
- ✅ Home: Secure sibling boards

#### Fallback Mechanism (AAC Invariant)

**Critical Requirement:** Biometric locks must NEVER permanently block access if hardware fails.

**Fallback Options:**
- [ ] **Triple-Tap Override:** Tap logo 3 times rapidly → Manual unlock
- [ ] **Password Fallback:** Optional PIN code for backup access
- [ ] **Biometric Failure Handling:** If biometric unavailable, skip to fallback immediately
- [ ] **Session Persistence:** Keep settings unlocked for 5 minutes after successful auth

**AAC Invariant (from AAC_INVARIANTS.md):**
> "Biometric locks must NEVER block the user if the hardware fails or authentication is cancelled. A non-biometric fallback (e.g. Triple-Tap) must always be available to prevent permanent lockouts."

**Package:** `capacitor-native-biometric` (already installed)

**Basic Integration:**
```javascript
import { NativeBiometric } from 'capacitor-native-biometric';

async function authenticateForSettings() {
  try {
    // Check if biometric is available
    const result = await NativeBiometric.isAvailable();
    
    if (!result.isAvailable) {
      // Fallback to triple-tap or password
      return showFallbackAuth();
    }
    
    // Request biometric authentication
    await NativeBiometric.verifyIdentity({
      reason: 'Authenticate to access Adult Settings',
      title: 'Kiwi Voice Settings',
      subtitle: 'Protect your communication setup',
      description: 'Use FaceID or TouchID to unlock settings'
    });
    
    // Success - unlock settings
    return true;
    
  } catch (error) {
    // User cancelled or authentication failed
    console.log('Biometric auth failed:', error);
    return showFallbackAuth();
  }
}

function showFallbackAuth() {
  // Show triple-tap instructions or password prompt
  // Always provide a way to access settings
}
```

**Platform-Specific Behavior:**
- **iOS:** FaceID or TouchID (depending on device)
- **Android:** Fingerprint or Face Unlock
- **Web:** Skip biometric, use password or no protection

**Settings Integration:**
- [ ] Add "Require Authentication" toggle in Adult Settings → Security
- [ ] Add "Change Fallback Method" option (Triple-tap, PIN, None)
- [ ] Add "Authentication Timeout" slider (1-30 minutes)
- [ ] Show biometric type available (FaceID, TouchID, Fingerprint)

#### 29.5. User Experience Design

**Onboarding Flow:**
1. During first-time setup, show security screen
2. "Protect your settings with FaceID/TouchID?"
3. Explain benefits: "Prevent accidental changes"
4. Allow skip: "Set up later in Adult Settings"
5. If enabled, test authentication immediately

**Settings Access Flow:**
1. User taps "Adult Settings" button
2. Biometric prompt appears immediately
3. On success: Smooth transition to settings
4. On failure: Show retry option + fallback link
5. After 3 failures: Automatically show fallback

**Visual Design:**
- Use native biometric prompts (iOS/Android system dialogs)
- Show lock icon on Adult Settings button when protected
- Display "Protected by FaceID" badge in settings header
- Provide clear "Disable Protection" option in settings

#### 29.6. Testing Requirements

**Functional Testing:**
- [ ] Test FaceID on iPhone X+ devices
- [ ] Test TouchID on older iPhones and iPads
- [ ] Test Fingerprint on Android devices
- [ ] Test Face Unlock on Android devices
- [ ] Test fallback when biometric unavailable
- [ ] Test triple-tap override mechanism
- [ ] Test session timeout behavior

**Edge Cases:**
- [ ] Biometric hardware failure
- [ ] User cancels authentication
- [ ] Multiple failed attempts
- [ ] Device doesn't support biometric
- [ ] Web platform (no biometric available)
- [ ] User disables biometric in OS settings

**Accessibility:**
- [ ] Screen reader announces biometric prompt
- [ ] Fallback accessible via keyboard navigation
- [ ] Clear error messages for failures
- [ ] No permanent lockouts possible

#### 29.7. Competitive Advantage

**Unique Features:**
- **Triple-Tap Fallback:** No other AAC app has this safety mechanism
- **Session Persistence:** Reduces auth friction (5-minute unlock)
- **Granular Control:** Choose what requires auth (settings vs. analytics vs. profiles)
- **AAC-First Design:** Never blocks communication, only settings

**Comparison:**
- **Proloquo2Go:** Has biometric for settings (no fallback documented)
- **TouchChat:** Has biometric for settings (no fallback documented)
- **Kiwi Voice:** Biometric + guaranteed fallback (AAC invariant compliance)

---

### 30. Phase 30: Physical Scaling for Motor Accessibility ✅ COMPLETE (Core Implementation)

> **Landing Page Commitment:** Physical Scaling (mm) is listed as "✓ Precise" in the comparison table, while all competitors show "✕ No". This is a unique differentiator for motor accessibility.

**Status:** ✅ Core implementation complete, 🔨 Calibration UI pending

**Implementation Date:** January 5, 2026

#### What Was Implemented

**✅ Phase 1: DPI Detection & Utilities**
- Created `src/utils/physicalScaling.js` with:
  - `getDeviceDPI()` - Auto-detection with 4-tier fallback strategy
  - `mmToPixels()` & `pixelsToMm()` - Physical conversion functions
  - `calibrateDPI()` - Manual calibration calculation
  - Device database with 50+ iPhone, iPad, Android models (326-512 DPI)
  - Screen dimension utilities and validation

**✅ Phase 2: Profile Integration**
- Added `deviceDPI` and `dpiCalibrated` to ProfileContext
- Auto-detects DPI on first app load
- Persists to localStorage via profile system

**✅ Phase 3: Grid Physical Scaling**
- Updated `src/utils/imageUtils.js` `getPxFromMm()` to use actual device DPI
- Grid.jsx automatically converts mm → pixels using detected DPI
- Touch targets now sized in actual physical millimeters
- Spacing calculations use physical measurements

**🔨 Phase 4: Calibration UI (Pending)**
- DPICalibration component with ruler verification
- Settings integration for manual DPI adjustment
- One-time calibration prompt for existing users

#### Technical Details

**DPI Detection Strategy:**
1. Device-specific overrides (highest accuracy)
2. `window.devicePixelRatio` × 96 DPI
3. Screen dimension validation
4. Fallback to 160 DPI

**Example Calculations:**
- iPhone 13 Pro (460 DPI): 10mm = 181px
- iPad Pro (264 DPI): 10mm = 104px
- Pixel 7 (416 DPI): 10mm = 164px

#### Professional Impact

✅ **Motor Accessibility Compliance:**
- Touch targets sized in physical mm, not logical pixels
- Consistent across devices regardless of screen DPI
- 10mm minimum (fine motor) to 22mm maximum (gross motor)

✅ **Competitive Advantage:**
- Only AAC app with transparent DPI detection
- User-verifiable with physical ruler (pending UI)
- Professional-grade motor accessibility

#### Migration Strategy

**Existing Users:**
- DPI auto-detected on first launch post-update
- Existing `targetSize` values (mm) preserved
- Grid layout adjusts to physical sizing (may appear different but more accurate)

**New Users:**
- DPI detected during onboarding
- Touch Calibration shows accurate mm measurements
- Optional ruler verification (pending Phase 4)

#### Files Modified

- ✅ `src/utils/physicalScaling.js` (NEW)
- ✅ `src/context/ProfileContext.jsx` (deviceDPI, dpiCalibrated fields)
- ✅ `src/App.jsx` (DPI auto-detection on load)
- ✅ `src/utils/imageUtils.js` (getPxFromMm uses actual DPI)
- 🔨 `src/components/DPICalibration.jsx` (PENDING)
- 🔨 `src/components/Controls.jsx` (calibration option PENDING)

#### 30.1. Millimeter-Based Icon Sizing

**Purpose:**
- Set icon sizes in millimeters instead of pixels for consistent motor planning
- Same physical size across all devices (iPad, Android tablet, phone)
- Therapist can prescribe exact icon sizes (e.g., "20mm icons for this child")
- Measurable IEP goals (e.g., "reduce from 30mm to 20mm over 6 months")

**User Need:**
- Motor impairment requires precise targeting specifications
- Screen density varies (iPad: 264 PPI, Android: 160-640 PPI)
- Pixel-based sizing = different physical sizes on different devices
- Millimeter-based sizing = consistent motor planning across devices

#### 30.2. DPI Calculation & Conversion

**Technical Challenge:**
- Web browsers don't provide accurate physical screen size
- `window.devicePixelRatio` gives pixel density, not physical size
- Need to estimate or calibrate actual DPI

**Conversion Formula:**
```javascript
// Calculate pixels from millimeters
function mmToPixels(mm, dpi = 96) {
  const inches = mm / 25.4; // Convert mm to inches
  return inches * dpi; // Convert to pixels
}

// Estimate DPI based on device
function estimateDPI() {
  const dpr = window.devicePixelRatio || 1;
  
  // Common device DPIs
  const deviceDPI = {
    'iPad': 264,
    'iPhone': 326,
    'Android Phone': 400,
    'Android Tablet': 240,
    'Desktop': 96
  };
  
  // Detect device type and return estimated DPI
  // Fallback to standard CSS DPI (96) * device pixel ratio
  return dpr * 96;
}

// Set icon size in millimeters
function setIconPhysicalSize(mm) {
  const dpi = estimateDPI();
  const pixels = mmToPixels(mm, dpi);
  
  iconElement.style.width = `${pixels}px`;
  iconElement.style.height = `${pixels}px`;
}
```

**Calibration Tool:**
- [ ] Show ruler on screen with known measurements
- [ ] User measures with physical ruler
- [ ] Adjust DPI until screen ruler matches physical ruler
- [ ] Store calibrated DPI in user profile

#### 30.3. User Interface Design

**Adult Settings → Accessibility → Physical Sizing:**

**Icon Size Control:**
- [ ] **Slider:** 10mm - 40mm range (1mm increments)
- [ ] **Current Size Display:** "Current: 18mm (0.71 inches)"
- [ ] **Visual Preview:** Show actual-size icon next to slider
- [ ] **Recommended Sizes:** Markers at 10mm, 15mm, 20mm, 25mm
- [ ] **Quick Presets:** Buttons for "Small (12mm)", "Medium (18mm)", "Large (25mm)"

**Calibration Section:**
- [ ] **"Calibrate Screen Size" Button:** Opens calibration wizard
- [ ] **Ruler Display:** Shows 10cm ruler on screen
- [ ] **Instructions:** "Measure this ruler with a physical ruler"
- [ ] **Adjustment Slider:** Fine-tune if measurements don't match
- [ ] **Save Calibration:** Store DPI in profile

**Visual Feedback:**
- [ ] Show grid with current icon size in mm
- [ ] Display "Approximately X icons will fit on screen"
- [ ] Warning if size too large: "Only 4 icons will fit"
- [ ] Warning if size too small: "Icons may be hard to tap"

#### 30.4. Use Cases & Benefits

**Motor Impairment:**
- SLP prescribes: "Child needs 25mm minimum for accurate targeting"
- Parent sets icon size to 25mm in Kiwi Voice
- Same 25mm size on iPad at school, Android tablet at home, phone in car
- Consistent motor planning across all devices

**Cross-Device Consistency:**
- Child practices on iPad at therapy (25mm icons)
- Uses Android tablet at school (same 25mm icons)
- Uses parent's phone in emergency (same 25mm icons)
- Motor memory transfers perfectly across devices

**IEP Goals (Measurable Progress):**
- **Baseline:** "Child requires 30mm icons for 80% accuracy"
- **6-month goal:** "Reduce to 25mm icons with 80% accuracy"
- **12-month goal:** "Reduce to 20mm icons with 80% accuracy"
- **Progress tracking:** Analytics show accuracy at each size

**Switch Access Integration:**
- Larger physical targets easier to scan to
- Switch timing can be adjusted based on target size
- Consistent scan patterns across devices

#### 30.5. Competitive Advantage

**Unique Feature:**
- **No other AAC app offers physical sizing**
- Proloquo2Go: Pixel-based only
- TouchChat: Pixel-based only
- Snap+Core First: Pixel-based only
- **Kiwi Voice: Millimeter-based (industry first)**

**Professional Tool:**
- Matches clinical assessment standards (OT/PT use mm measurements)
- Enables evidence-based IEP goals
- Demonstrates commitment to motor accessibility
- Positions Kiwi as professional-grade AAC tool

**Marketing Message:**
> "Other AAC apps use pixels. Kiwi Voice uses millimeters. Because your child's motor planning shouldn't change when you switch devices."

#### 30.6. Technical Implementation Plan

**Phase 1: Basic MM Sizing (Week 1-2)**
- [ ] Implement `mmToPixels()` conversion function
- [ ] Add DPI estimation based on device type
- [ ] Create "Icon Size (mm)" slider in Adult Settings
- [ ] Apply mm sizing to grid icons
- [ ] Test on iOS, Android, web platforms

**Phase 2: Calibration Tool (Week 3)**
- [ ] Build calibration wizard UI
- [ ] Implement ruler display with adjustable DPI
- [ ] Add physical measurement instructions
- [ ] Store calibrated DPI in user profile
- [ ] Test calibration accuracy on multiple devices

**Phase 3: Visual Feedback (Week 4)**
- [ ] Add icon preview next to slider
- [ ] Show "X icons will fit" calculation
- [ ] Add recommended size markers
- [ ] Implement warning messages
- [ ] Polish UI and animations

**Phase 4: Integration & Testing (Week 5-6)**
- [ ] Integrate with Access Profiles (Phase 28)
- [ ] Test cross-device consistency
- [ ] Validate with OT/PT professionals
- [ ] User testing with motor-impaired AAC users
- [ ] Document in user guide and onboarding

#### 30.7. Integration with Existing Features

**Access Profiles (Phase 28):**
- Phase 28 already has physical sizing in Access Profiles
- Phase 30 adds explicit UI controls for mm sizing
- Unified backend: Both use same physical measurement system
- Access Profile stores target size in mm
- Adult Settings exposes mm slider for manual adjustment

**Grid Layout (Phase 23):**
- Grid size (2×2, 3×3, etc.) determines icon count
- Icon size (mm) determines physical dimensions
- Combined: "3×3 grid with 20mm icons"
- Motor planning: Positions stay consistent, size scales

**Touch Calibration (Phase 28.5):**
- Current: Animal-themed grid size selector
- Enhanced: Show mm size for each grid option
- Example: "🐘 Super Big (25mm icons)"
- User understands physical size, not just relative size

#### 30.8. Documentation & Training

**User Guide:**
- [ ] "What is Physical Scaling?" explainer
- [ ] "How to Calibrate Your Screen" tutorial
- [ ] "Choosing the Right Icon Size" guide
- [ ] Video demonstration of calibration process

**Therapist Resources:**
- [ ] "Setting IEP Goals with Physical Sizing" guide
- [ ] "Prescribing Icon Sizes for Motor Challenges" worksheet
- [ ] "Cross-Device Consistency Best Practices" document
- [ ] Professional development webinar on physical scaling

**Marketing Materials:**
- [ ] Comparison table highlighting unique feature
- [ ] Case study: "How Physical Scaling Improved Motor Planning"
- [ ] Infographic: "Pixels vs. Millimeters in AAC"
- [ ] Demo video showing same size across devices

---

## End of PRD
- Visual selection state with shadow effects and color changes
- Responsive layout adapts to different screen sizes
