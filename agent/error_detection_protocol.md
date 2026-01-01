# ERROR DETECTION WORKFLOW PROTOCOL - KIWI AAC
# Learning Loop System - Detection Agent

## DETECTION CYCLE WORKFLOW

### Phase 0: Project Integrity & Scaffolding (CRITICAL)
1. **Essential Files**
   - Check for `package.json` (Dependencies and Scripts)
   - Check for `index.html` (Entry point with correct meta tags)
   - Check for `vite.config.js` (Build configuration)
   - Verify `src/main.jsx` or `src/index.js` existence
   - Verify `src/utils/emojiData.js` existence (Required for Curator)

2. **Environment Configuration**
   - Check `.gitignore` setup
   - Verify node_modules installation status
   - Check for necessary assets (icons, fonts)

---

### Phase 1: iOS App Store Compliance Check
1. **Technical Requirements**
   - Check for iOS 12.0+ compatibility
   - Verify Xcode build settings (if native wrapper exists)
   - Check Info.plist configuration
   - Validate app icons (1024x1024 required)
   - Verify launch screens for all devices
   - Check for required device capabilities
   - Validate bundle identifier format

2. **App Store Review Guidelines**
   - Check for private API usage
   - Verify data collection transparency
   - Validate in-app purchase implementation (if applicable)
   - Check for proper error handling
   - Verify network connectivity handling
   - Check for iPad compatibility (if applicable)

3. **Performance Requirements**
   - Check app launch time (<400ms to first frame)
   - Verify memory usage
   - Check battery usage patterns
   - Test on multiple iOS versions

---

### Phase 2: Android Play Store Compliance Check
1. **Technical Requirements**
   - Check for Android 5.0 (API 21)+ compatibility
   - Verify targetSdkVersion is current
   - Check AndroidManifest.xml configuration
   - Validate app icons (512x512 for store listing)
   - Verify adaptive icons
   - Check for required permissions justification
   - Validate signing configuration

2. **Play Store Policies**
   - Verify data safety section requirements
   - Check for proper permission requests
   - Validate privacy policy link
   - Check for COPPA compliance (if applicable)
   - Verify content rating accuracy
   - Check for accessibility services (if used)

3. **Performance Requirements**
   - Check app startup time
   - Verify APK/AAB size (<150MB recommended)
   - Test on multiple Android versions
   - Check for 64-bit support

---

### Phase 3: Mobile Responsiveness & UI/UX Testing
1. **Component Specifics: EmojiCurator**
   - **Touch Targets:** Verify grid items in `EmojiCurator.jsx` are >44px (iOS) / >48dp (Android).
   - **Layout:** Check sidebar collapse behavior on mobile.
   - **Safe Areas:** Verify `env(safe-area-inset-*)` usage for notches/home bars.
   - **Feedback:** Ensure visual feedback on touch (highlight/ripple).

2. **Screen Size Compatibility**
   - Test on iPhone SE (375x667)
   - Test on iPhone 14 Pro Max (430x932)
   - Test on iPad (various sizes)
   - Test on Android phones (360x640 to 412x915)
   - Test on Android tablets
   - Test landscape orientation

3. **General UI Elements**
   - Verify text readability (minimum 11pt)
   - Check for proper contrast ratios
   - Test with system font size changes
   - Verify navigation patterns

---

### Phase 4: Performance & Optimization
1. **Load Time Analysis**
   - Measure initial page load
   - Check Time to Interactive (TTI)
   - Verify First Contentful Paint (FCP)
   - Check Largest Contentful Paint (LCP)
   - Measure API response times

2. **Resource Optimization**
   - Check image compression
   - Verify lazy loading implementation
   - Check bundle size
   - Verify code splitting
   - Check for unused dependencies

3. **Network Efficiency**
   - Test on 3G/4G/5G connections
   - Verify offline functionality (Service Workers)
   - Check caching strategies
   - Test API retry logic

---

### Phase 5: Security Audit
1. **Authentication & Authorization**
   - Check HTTPS enforcement
   - Verify token storage (secure)
   - Check session management
   - Verify password requirements
   - Check for XSS vulnerabilities

2. **Data Protection**
   - Verify data encryption at rest
   - Check data encryption in transit
   - Verify sensitive data handling
   - Check for data leakage
   - Verify proper error messages (no sensitive info)

3. **API Security**
   - Check for API key exposure
   - Verify CORS configuration
   - Check rate limiting
   - Verify input sanitization

---

### Phase 6: Accessibility Compliance (AAC Specific)
1. **Motor & Physical Access**
   - **Target Size:** Strict enforcement of large touch targets for motor impairment.
   - **Timing:** Avoid short timeouts; allow user control over timing.
   - **Gestures:** Ensure complex gestures have simple tap alternatives.

2. **Visual & Cognitive Access**
   - **Contrast:** High contrast modes (WCAG AAA preferred for AAC).
   - **Clarity:** Use clear icons and labels; avoid abstract metaphors.
   - **Feedback:** Immediate auditory/haptic feedback for selections.

3. **Standard WCAG 2.1**
   - Check color contrast (4.5:1 minimum)
   - Verify keyboard navigation
   - Check screen reader compatibility
   - Verify ARIA labels
   - Check focus indicators

---

### Phase 7: Functionality Testing
1. **Core Features**
   - Test user registration/login
   - Test main app workflows
   - Test data persistence
   - Test form validations
   - Test error states

2. **Edge Cases**
   - Test with poor network
   - Test with no network
   - Test with maximum data
   - Test with empty states
   - Test concurrent sessions

---

### Phase 8: Store Compliance Final Check
1. **Content Requirements**
   - Verify privacy policy is accessible
   - Check terms of service
   - Verify contact information
   - Check app description accuracy
   - Verify screenshots represent actual app

2. **Legal Compliance**
   - Check age rating accuracy
   - Verify copyright information
   - Check trademark usage
   - Verify third-party licenses

---

## ERROR LOGGING FORMAT

When an error is detected, log it as:

```
[TIMESTAMP] | [CATEGORY] | [SEVERITY] | [LOCATION] | [DESCRIPTION]
Details: [Specific technical details]
Impact: [How this affects users or submission]
Testing Context: [Device, OS version, network condition]
Reference: [Relevant documentation or requirement]
```

## DETECTION CYCLE TRIGGERS

Run detection cycle:
1. On demand (manual trigger)
2. After code changes
3. Before submission attempt
4. Weekly scheduled check
5. After dependency updates

## SUCCESS CRITERIA

Detection cycle is complete when:
- All checklist items reviewed
- All detected errors logged to .agent file
- Severity levels assigned
- Metrics updated
- Ready for fixing agent to process
