# Roadmap: Kiwi Talk v1 App Store Release

## Overview

**Goal**: Get Kiwi Talk ready for Apple App Store submission with all bugs fixed and screenshots ready.

**Phases**: 4
**Requirements**: 24 total (3 already complete)

## Phases

### Phase 1: Fix Onboarding Flow
**Goal**: Users can complete onboarding from start to finish without errors.

**Requirements**:
- BUGS-01: Onboarding "Get Started" button advances user
- BUGS-02: Onboarding flow progresses logically
- BUGS-03: All navigation buttons respond correctly
- BUGS-04: No console errors during normal usage
- BUGS-05: localStorage data handled properly

**Success Criteria**:
1. User can tap "Get Started" and advance to next screen
2. User can complete entire onboarding flow
3. No JavaScript errors in console during onboarding
4. App state persists correctly after onboarding

**Status**: Not Started

---

### Phase 2: Verify Core Functionality
**Goal**: All core AAC features work correctly end-to-end.

**Requirements**:
- CHAR-04: All character builder options produce valid output
- CORE-01: Picture grid displays and speaks words
- CORE-02: Folder navigation works
- CORE-03: Sentence strip allows building phrases
- CORE-04: Speech synthesis works on iOS/Safari
- CORE-05: Custom audio playback works
- UX-01: No crashes during normal flows
- UX-02: Loading states display appropriately
- UX-03: Error states handled gracefully
- UX-04: Touch targets appropriately sized

**Success Criteria**:
1. User can tap any grid button and hear the word spoken
2. User can navigate into and out of folders
3. User can build and speak a multi-word sentence
4. Custom recorded audio plays correctly
5. No crashes during 10-minute usage session

**Status**: Not Started

---

### Phase 3: Screenshot Generator
**Goal**: Generate all required App Store screenshots for all device sizes.

**Requirements**:
- STORE-01: Generate iPhone screenshots (6.7", 6.5", 5.5")
- STORE-02: Generate iPad screenshots (12.9", 11")
- STORE-03: Screenshots display in proper device frames
- STORE-04: All 5-10 screenshots per device size generated

**Success Criteria**:
1. Screenshot generator script runs without errors
2. All device sizes have correctly sized output images
3. Screenshots show key app features (grid, sentence strip, folders)
4. Output images are in correct format for App Store Connect

**Status**: Not Started

---

### Phase 4: Build & Submission Prep
**Goal**: App builds successfully and meets all App Store technical requirements.

**Requirements**:
- STORE-05: App icon meets Apple specifications
- STORE-06: npm build succeeds
- STORE-07: Capacitor iOS build compiles
- STORE-08: App passes smoke test on Simulator

**Success Criteria**:
1. `npm run build` completes without errors
2. `npx cap sync ios` completes without errors
3. Xcode build succeeds for release configuration
4. App launches and runs basic flows on iOS Simulator
5. App icon is 1024x1024 with no transparency

**Status**: Not Started

---

## Progress

| Phase | Name | Requirements | Complete | Status |
|-------|------|--------------|----------|--------|
| 1 | Fix Onboarding Flow | 5 | 0 | Not Started |
| 2 | Verify Core Functionality | 10 | 0 | Not Started |
| 3 | Screenshot Generator | 4 | 0 | Not Started |
| 4 | Build & Submission Prep | 5 | 0 | Not Started |

**Already Fixed** (before roadmap):
- CHAR-01: Glasses position ✓
- CHAR-02: Emoji ZWJ composition ✓
- CHAR-03: Close button ✓

---
*Last updated: 2026-01-25*
