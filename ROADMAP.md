# Kiwi Voice - Product Roadmap

## Current Features ✅
- 6-Level Learning System (Phase 1-6 Communication)
- Character Builder with 58 Memoji characters
- Custom Voice Recording with playback controls
- Progress Analytics with local-first tracking
- Multiple Location Contexts (School, Home, Park, Mealtime)
- Photo Search (Unsplash integration)
- Child Lock Mode with guided access
- Works Offline (PWA with service worker)
- Lightning Fast Performance
- Visual Schedules & Routine Builder (COMPLETE)
- Essential Skills Training - FCR & Denial Tolerance (COMPLETE)
- QR Code Board Sharing (COMPLETE)
- Usage Analytics Dashboard (COMPLETE)
- Premium Color Themes with Superwall integration (COMPLETE)

---

## Market Position & Competitive Advantages

**Kiwi Voice vs. AAC Market Leaders:**

| Feature | Kiwi Voice | Proloquo2Go | TouchChat | LAMP | Snap+Core | CoughDrop |
|---------|------------|-------------|-----------|------|-----------|-----------|
| **Price** | $39.99/year | $249.99 | $299 | $299 | Free-$149 | $9/month |
| **Platforms** | iOS/Android/Web | iOS only | iOS/Android | iOS only | iOS/Android | All platforms |
| **Core Vocab Free** | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ Limited |
| **Cloud Sync** | Planned Q2 | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Bilingual Support** | In Progress | ✅ Yes | ✅ Yes | ❌ Limited | ✅ Yes | ✅ Yes |
| **Custom Photos** | Planned Q1 | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Symbol Libraries** | Planned Q2 | PCS/SymbolStix | WordPower | Unity | Core First | Open symbols |

**Unique Advantages:**
- ✅ **84% cheaper** than premium competitors ($39.99 vs $249-299)
- ✅ **Cross-platform PWA** works everywhere (iOS, Android, web, tablets)
- ✅ **Core communication always free** (ethical accessibility commitment)
- ✅ **Modern UX** with Memoji aesthetic vs dated competitors
- ✅ **Evidence-based training** modes (FCR, denial tolerance) built-in
- ✅ **Fast iteration** via web deployment vs app store delays

---

## Planned Features 🚀

### Q1 2025 (January - March)

#### 🚨 Critical Missing Features (Competitive Parity)

**Personal Photo Upload** *(Priority: CRITICAL)*
- Upload custom photos for people, places, objects
- Children recognize real photos better than stylized avatars
- Competitor standard: All major AAC apps support this
- Implementation: Capacitor Camera API + local storage
- Free tier: Up to 20 custom photos
- Premium: Unlimited photo uploads

**Core Vocabulary Organization** *(Priority: CRITICAL)*
- Explicit "Core Words" category (50-100 essential words)
- Dedicated section separate from emoji categories
- Based on AAC research (I, want, more, yes, no, help, stop, go, like, etc.)
- Bilingual support: English + Spanish labels
- Implementation: Add CORE_WORDS category to aacData.js
- Reference: Already have CORE_VOCABULARY data structure

**Message Bar / Sentence Strip** *(Priority: CRITICAL)*
- Visual strip where tapped icons accumulate before speaking
- Standard AAC feature present in all competitors
- Allows sentence construction vs single-word communication
- Buttons: Speak All, Clear, individual icon removal
- Toggle: Auto-speak on tap vs accumulate-then-speak mode
- Implementation: New MessageBar component in Controls.jsx

**Starter Vocabulary Templates** *(Priority: HIGH)*
- Default board with core 50 words (bilingual English/Spanish)
- Pre-populated on first launch vs blank slate
- Quick-apply templates: First 50 Words, School Day, Mealtime, Feelings
- Visual template gallery with previews
- Implementation: Auto-apply CORE_VOCABULARY on first install

**Help & Tutorial System** *(Priority: HIGH)*
- In-app onboarding for first-time users
- Contextual tooltips for advanced features
- Video tutorials for setup and customization
- Parent/therapist getting-started guide
- Implementation: Onboarding component with progressive disclosure

#### ⚠️ Validation & Testing (Before Scaling Advanced Features)

**User Testing Requirements:**
- [ ] Test Memoji aesthetic clarity with 20+ AAC users (children + adults)
- [ ] Validate emoji library sufficiency vs traditional symbol sets (PCS, SymbolStix)
- [ ] Test avatar builder preference vs real photos with 10+ children
- [ ] Validate AI vision object detection accuracy (>85% correct suggestions)
- [ ] Test Zen animations for distraction vs calming effect
- [ ] Validate grammar support (plurals/possessives) with SLPs

**High-Contrast Mode Option:**
- Provide optional high-contrast theme for users with visual processing needs
- Black/white mode or simplified color palette
- Larger font sizes and bolder borders
- Toggle in accessibility settings

#### 🎨 Enhanced Visual Schedules

**Improvements:**
- Add time-based schedules (7:00 AM - Breakfast, 8:00 AM - School)
- Visual timer integration for each step
- Completion checkmarks with celebratory animations
- Photo-based schedules (not just emojis)
- Export schedules as printable PDF for offline use

---

### Q2 2025 (April - June)

#### ☁️ Cloud Sync & Team Collaboration

**Cloud Infrastructure:**
- Supabase/Neon backend for board storage
- Real-time sync across devices for same user
- Team sharing: Invite therapists, teachers, family via email
- Access codes: Simple 6-digit codes like Zoom (vs complex account management)
- Version history: Track board changes and revert

**Collaboration Features:**
- Team roles: Parent, Therapist, Educator (different permissions)
- Comments & notes: Therapist annotations on specific icons
- Shared analytics: View usage data across team members
- Email notifications: Activity updates for team members

#### 🌐 Community Board Gallery

**Social Sharing Beyond JSON:**
- Cloud-based board gallery (like app store for AAC boards)
- Browse community-created boards by category, language, age group
- One-click download and apply to device
- Rating/review system for quality boards
- Share codes: Simple codes to share specific boards (vs QR/JSON files)
- Featured boards: Curated by SLPs and AAC specialists

#### 📚 Symbol Library Integration

**Open Symbol Support:**
- ARASAAC integration (40,000+ open-source AAC symbols in 30+ languages)
- Mulberry Symbols support (3,400+ symbols, Creative Commons)
- OpenMoji support (4,000+ open-source emoji)
- User choice: Emoji + symbols hybrid boards
- Rationale: Emoji may miss AAC-specific concepts (therapy, medication, sensory)

**Symbol Features:**
- Search across emoji + symbol libraries simultaneously
- Visual distinction: Symbol icons marked differently than emoji
- Premium symbols: PCS/SymbolStix integration (licensing required)
- Mixed boards: Emoji for people/food, symbols for actions/concepts

#### 🗣️ Enhanced Voice Features

**Voice Quality Indicators:**
- Badge system: "Enhanced", "Premium", "Neural", "Siri" labels
- Download instructions: In-app guide to download iOS voices
- Voice comparison: Side-by-side preview of different voices
- Auto-select best: Automatically choose highest quality voice available
- Offline indicators: Mark which voices work offline

**Advanced Voice Controls:**
- Voice presets: Young Child (high pitch), Adult (normal), Clear Speech (slow)
- Per-icon voice overrides: Different voices for different characters
- Multi-language voices: Seamless English/Spanish switching
- Voice cloning: Record parent voice for custom TTS (future, premium)

---

### Q3 2025 (July - September)

#### ♿ Switch Access & Motor Accessibility

**Basic Auto-Scan Mode:**
- Sequential scanning: Highlight icons one-by-one automatically
- Configurable scan speed: 1-5 seconds per icon
- Single-switch activation: Tap anywhere to select highlighted icon
- Two-switch mode: One to advance, one to select
- Visual scan indicator: Clear highlighting with sound cues

**Advanced Scanning:**
- Row-column scanning: Scan rows first, then columns
- Group scanning: Scan categories, then items within category
- Reverse scanning: Backward movement option
- Auditory scanning: Speak icon names during scan
- Switch profiles: Save different scan settings per user

#### 📊 Advanced Analytics & IEP Tracking

**Therapeutic Insights:**
- New words this week: Highlight newly used vocabulary
- Vocabulary growth chart: Track expansion over time (7, 30, 90 days)
- Most-used icons: Top 10-20 with usage percentage
- Communication patterns: Peak usage times and contexts
- Recommendations: AI-suggested vocabulary based on usage

**IEP Integration:**
- Goal tracking: Link icons to specific IEP goals
- Progress reports: Automated PDF reports for educators/therapists
- Session notes: Add notes to specific sessions
- Milestone markers: Celebrate communication achievements
- Custom date ranges: Filter analytics by therapy session dates

**Privacy & Compliance:**
- HIPAA considerations: Documentation for clinical use
- FERPA compliance: Educational data privacy
- Parental controls: Password-protect analytics from child
- Data deletion: One-click delete all analytics
- Export for privacy: Export then delete from device

---

### Q4 2025 (October - December)

#### 🌍 Multi-Language Mirroring

**Bilingual AAC Support:**
- Language toggle: Switch entire board English ↔ Spanish instantly
- Consistent layouts: Icon positions preserved across languages (motor planning)
- Dual labels: Show both languages simultaneously (optional)
- Language-specific voices: Auto-switch TTS voice with language
- Vocabulary translation: Built-in lexicon for core + common words

**Additional Languages:**
- French, German, Mandarin support (high-frequency US languages)
- RTL language support: Arabic, Hebrew (right-to-left layouts)
- Symbol translations: ARASAAC symbols in 30+ languages
- Community translations: User-contributed vocabulary translations

#### 🎯 Board Layout & Customization

**Grid Arrangement Tools:**
- Drag-and-drop icon positioning
- Grid size options: 2x2, 3x3, 4x4, 5x5, custom
- Icon size adjustment: Small, Medium, Large, Extra Large
- Spacing controls: Tight, Normal, Comfortable
- Snap-to-grid: Ensure consistent alignment

**Progressive Revelation:**
- Hide/show icons based on proficiency level
- Start simple (20 icons) → gradually add more
- Mastery tracking: Unlock new icons when current set mastered
- SLP-controlled: Therapist sets which icons visible
- Visual cues: Grayed-out icons to "unlock soon"

**Motor Planning Support:**
- Lock icon positions: Prevent accidental rearrangement
- Consistent placement: Same word always in same spot
- Color coding: Fitzgerald Key (nouns=yellow, verbs=green)
- Visual boundaries: Category sections with borders

---

### 2026 & Beyond (Future Considerations)

#### 🤖 AI Features (Requires Validation)

**AI Vision Scene Builder:**
- Upload photo → auto-detect objects → suggest hotspots
- TensorFlow.js on-device processing (privacy-first)
- Accuracy requirement: >85% correct object identification
- Manual override: User can adjust all suggestions
- User testing: Validate usefulness vs manual icon selection

**AI Vocabulary Suggestions:**
- Analyze usage patterns → recommend new vocabulary
- Context-aware: Suggest relevant words for specific situations
- SLP-approved: Only suggest clinically appropriate vocabulary
- Parent approval: All AI suggestions require parent review

#### 📱 Platform Expansions

**Apple Watch Companion:**
- Quick communication: 10-20 most-used phrases on wrist
- Voice output via watch speaker
- Haptic feedback for confirmation
- Emergency phrases: "Help", "I need...", "Stop"

**Wearable Integration:**
- Smart glasses support (future accessibility tech)
- EMG wristband control (electromyography for motor disabilities)
- Eye-tracking integration (Tobii, EyeGaze compatibility)

#### 🏫 Educational Integrations

**IEP System Integration:**
- Import goals from school IEP software
- Auto-sync progress to district systems
- Compliance: FERPA-compliant data handling
- SSO: Single sign-on for school districts

**Learning Management Systems:**
- Google Classroom integration
- Canvas/Blackboard compatibility
- Assignment submission via AAC board
- Participation tracking for teachers

#### 🔬 Research & Development

**Morphology Engine:**
- Grammar support: Plurals (cookie → cookies)
- Possessives: (Mom → Mom's)
- Verb conjugation: (I want → He wants)
- Sentence structure: Auto-suggest word order
- User testing: Validate with SLPs before full implementation

**Visual Action Cues:**
- Illustrative imagery: Depict action/context of words
- Zen animations: Calming, beautiful transitions
- Avoid sensory overload: Test with sensory-sensitive users
- Opt-in feature: Not forced on all users

---

## Implementation Priorities

### MUST HAVE (Q1 2025):
1. ✅ Personal photo upload
2. ✅ Core vocabulary organization
3. ✅ Message bar / sentence strip
4. ✅ Starter vocabulary templates
5. ✅ Help & tutorial system
6. ✅ High-contrast mode option

### SHOULD HAVE (Q2 2025):
1. Cloud sync & team collaboration
2. Community board gallery
3. Symbol library integration (ARASAAC)
4. Enhanced voice quality indicators
5. Voice presets

### NICE TO HAVE (Q3-Q4 2025):
1. Switch access & scanning
2. IEP integration & tracking
3. Multi-language mirroring
4. Advanced board layout tools
5. Progressive revelation system

### EXPERIMENTAL (2026+):
1. AI vision scene builder (pending validation)
2. AI vocabulary suggestions (pending validation)
3. Morphology engine (pending SLP approval)
4. Visual action cues (pending user testing)
5. Platform expansions (Apple Watch, wearables)

---

## Validation Framework

**Before Adding Any Feature:**
1. Does it improve CORE communication? → Prioritize
2. Is it frequently requested by SLPs/parents? → User test
3. Is it standard in competitor AAC apps? → Implement for parity
4. Is it experimental/innovative? → Validate with 20+ users first
5. Does it add UI complexity? → Consider progressive disclosure

**Success Criteria for Advanced Features:**
- Used by >20% of active users within 30 days
- User satisfaction score >4.0/5
- Support tickets <2% of total
- Performance impact <5% (load time, battery)

---

*Last updated: January 2025*
