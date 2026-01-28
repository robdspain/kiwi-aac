# Kiwi Talk

## What This Is

Kiwi Talk (Kiwi Voice) is an AAC (Augmentative and Alternative Communication) app for children learning to express themselves. Built on PECS methodology, it provides a progressive level system from basic pointing through advanced sentence building, with customizable picture grids, voice output, and personalization features.

## Core Value

Children can independently communicate their needs by tapping picture icons that speak aloud, progressing through structured learning levels with parent/therapist guidance.

## Requirements

### Validated

- ✓ Picture grid with tap-to-speak — existing
- ✓ Folder organization for related words — existing
- ✓ 6-stage PECS progression system — existing
- ✓ Sentence strip for building phrases — existing
- ✓ Multiple contexts (home, school, store, etc.) — existing
- ✓ Onboarding with skill assessment — existing
- ✓ Character builder for personalization — existing
- ✓ Custom photo/audio support — existing
- ✓ Drag-and-drop grid editing — existing
- ✓ Progress tracking and analytics — existing
- ✓ Multi-profile support — existing
- ✓ iOS/Android via Capacitor — existing

### Active

- [ ] Fix all blocking usability bugs (onboarding, character builder, etc.)
- [ ] Ensure complete user flow works end-to-end without errors
- [ ] App Store metadata and screenshots ready
- [ ] Screenshot generator produces all required sizes
- [ ] Pass Apple App Store review criteria

### Out of Scope

- Cloud sync/backup — complexity, privacy concerns for children's data
- Real-time collaboration — not needed for v1
- Android Google Play submission — iOS first
- New features beyond bug fixes — stabilize existing functionality first

## Context

**Current State:**
- App has core functionality but multiple bugs block usability
- Onboarding flow has issues (Get Started button, screen transitions)
- Character builder has rendering bugs (glasses position, emoji composition)
- Screenshot generator exists but needs verification
- Built with React 19, Vite, Capacitor 8 for iOS/Android

**Known Issues (from testing):**
- Character builder glasses overlay position incorrect
- Character builder emoji ZWJ sequences don't render properly
- Character builder close button wasn't working (fixed)
- Onboarding progression issues
- Potential localStorage data migration issues between versions

**App Store Requirements:**
- Screenshots for all required device sizes
- App preview videos (optional but recommended)
- Privacy policy URL
- App description and keywords
- No crashes or blocking bugs

## Constraints

- **Platform**: iOS App Store submission (Capacitor-wrapped React app)
- **Timeline**: Get to submission-ready state
- **Tech Stack**: React 19, Vite 7, Capacitor 8 — no major refactoring

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Fix bugs before new features | App must be stable for App Store review | — Pending |
| iOS first, Android later | Focus resources on one platform | — Pending |
| Use existing screenshot generator | Already built, just needs verification | — Pending |

---
*Last updated: 2026-01-25 after initialization*
