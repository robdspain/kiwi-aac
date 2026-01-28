# Requirements: Kiwi Talk v1 App Store Release

## v1 Requirements

### Bug Fixes (BUGS)
- [ ] **BUGS-01**: Onboarding "Get Started" button advances user to next screen
- [ ] **BUGS-02**: Onboarding flow progresses logically through all screens
- [ ] **BUGS-03**: All navigation buttons respond correctly to taps
- [ ] **BUGS-04**: No console errors during normal app usage
- [ ] **BUGS-05**: App handles localStorage data properly without corruption

### Character Builder (CHAR)
- [x] **CHAR-01**: Glasses accessory renders over eyes, not forehead — FIXED
- [x] **CHAR-02**: Emoji composition renders single character, not broken ZWJ — FIXED
- [x] **CHAR-03**: Close button closes the character builder modal — FIXED
- [ ] **CHAR-04**: All character builder options produce valid output

### App Store Readiness (STORE)
- [ ] **STORE-01**: Screenshot generator produces all required iPhone sizes (6.7", 6.5", 5.5")
- [ ] **STORE-02**: Screenshot generator produces all required iPad sizes (12.9", 11")
- [ ] **STORE-03**: Screenshots display correctly in proper device frames
- [ ] **STORE-04**: All 5-10 required screenshots per device size are generated
- [ ] **STORE-05**: App icon meets Apple specifications (1024x1024, no alpha)
- [ ] **STORE-06**: App builds successfully with `npm run build`
- [ ] **STORE-07**: Capacitor iOS build compiles without errors
- [ ] **STORE-08**: App passes basic smoke test on iOS Simulator

### Core Functionality (CORE)
- [ ] **CORE-01**: Picture grid displays and taps speak the word aloud
- [ ] **CORE-02**: Folder navigation works (open folder, navigate back)
- [ ] **CORE-03**: Sentence strip allows building multi-word phrases
- [ ] **CORE-04**: Speech synthesis works on iOS/Safari
- [ ] **CORE-05**: Custom audio playback works for recorded words

### User Experience (UX)
- [ ] **UX-01**: No crashes during normal user flows
- [ ] **UX-02**: Loading states display appropriately
- [ ] **UX-03**: Error states are handled gracefully
- [ ] **UX-04**: Touch targets are appropriately sized for children

## v2 Requirements (Post-Launch)

- Cloud sync/backup for data
- Android Google Play submission
- Additional language support
- Advanced analytics dashboard
- Therapist/teacher collaboration features

## Out of Scope

- Real-time collaboration — not needed for v1 AAC app
- Social features — privacy concerns for children
- In-app purchases beyond paywall — keep monetization simple
- Web version — focus on native mobile experience

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUGS-01 | 1 | Pending |
| BUGS-02 | 1 | Pending |
| BUGS-03 | 1 | Pending |
| BUGS-04 | 1 | Pending |
| BUGS-05 | 1 | Pending |
| CHAR-01 | — | Done |
| CHAR-02 | — | Done |
| CHAR-03 | — | Done |
| CHAR-04 | 2 | Pending |
| STORE-01 | 3 | Pending |
| STORE-02 | 3 | Pending |
| STORE-03 | 3 | Pending |
| STORE-04 | 3 | Pending |
| STORE-05 | 4 | Pending |
| STORE-06 | 4 | Pending |
| STORE-07 | 4 | Pending |
| STORE-08 | 4 | Pending |
| CORE-01 | 2 | Pending |
| CORE-02 | 2 | Pending |
| CORE-03 | 2 | Pending |
| CORE-04 | 2 | Pending |
| CORE-05 | 2 | Pending |
| UX-01 | 2 | Pending |
| UX-02 | 2 | Pending |
| UX-03 | 2 | Pending |
| UX-04 | 2 | Pending |

---
*Last updated: 2026-01-25*
