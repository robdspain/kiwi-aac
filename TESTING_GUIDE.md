# Comprehensive Mobile Testing Guide - Kiwi AAC

## Quick Start

### Option 1: Use the Interactive Testing Tool
1. Open `test-mobile.html` in your browser
2. The tool will load the app in a mobile viewport (375x667)
3. Check off items as you test them
4. Export report when done

### Option 2: Manual Testing
1. Open Chrome DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "iPhone SE" or set to 375x667
4. Navigate to http://localhost:5174/

---

## Pre-Testing Setup

### Clear State for Fresh Test
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

### Check Console for Errors
- Open DevTools Console
- Look for red errors
- Note any warnings

---

## Detailed Testing Procedure

### 1. Initial Load & Onboarding

**Step 1.1: Splash Screen**
- [ ] Splash screen appears first
- [ ] Animation is smooth
- [ ] Duration is appropriate (2-3 seconds)
- [ ] Kiwi logo/branding visible

**Step 1.2: Assessment Flow**
- [ ] Assessment appears after splash
- [ ] Progress dots show at top (6 dots)
- [ ] Question counter shows "Question X of 6"
- [ ] Emoji displays correctly
- [ ] Question text is readable
- [ ] Hint text is visible

**Step 1.3: Answer Buttons**
- [ ] "✓ Yes" button (teal/green gradient)
- [ ] "✗ Not yet" button (white with border)
- [ ] "🤔 I'm not sure" button (yellow background)
- [ ] All buttons are touch-friendly (44px+)
- [ ] Buttons respond to tap immediately

**Step 1.4: "I'm not sure" Flow**
- [ ] Tapping opens modal overlay
- [ ] Modal has dark background (50% opacity)
- [ ] Modal content is centered
- [ ] Shows 3 options:
  - "🚀 Start at Level 1 (Recommended)"
  - "⏭️ Skip this question"
  - "Go back" (text button)
- [ ] All buttons functional
- [ ] Starting at Level 1 completes onboarding
- [ ] Skip question advances to next question

**Step 1.5: Assessment Completion**
- [ ] Shows result screen with 🎉 emoji
- [ ] Displays recommended level
- [ ] Shows level name and description
- [ ] "Start Learning! →" button visible
- [ ] "Retake assessment" button visible

**Step 1.6: Character Builder**
- [ ] Character Builder appears (if part of onboarding)
- [ ] Modal opens correctly
- [ ] All sections visible without scrolling issues

**KNOWN ISSUES TO CHECK:**
- [ ] Modal doesn't dismiss when tapping outside
- [ ] Text overflow on small screens
- [ ] Buttons too close together
- [ ] Animation lag

---

### 2. Main Interface

**Step 2.1: Grid Layout**
- [ ] Communication buttons display in 3-column grid
- [ ] Buttons are evenly spaced
- [ ] No buttons cut off at edges
- [ ] Scrolling is smooth
- [ ] Safe area insets respected (iPhone notch)

**Step 2.2: Communication Buttons**
- [ ] Each button shows:
  - Icon (emoji or image)
  - Label text below
- [ ] Icons are large (3rem / ~48px)
- [ ] Labels don't overflow
- [ ] Ellipsis (...) for long text
- [ ] Touch targets minimum 44x44px

**Step 2.3: Button Interaction**
- [ ] Tap animates (scale 0.92)
- [ ] Audio plays immediately
- [ ] No double-tap required
- [ ] Visual feedback is clear
- [ ] Success animation shows (🌟)

**Step 2.4: Folders**
- [ ] Folder icons show 4 mini-icons
- [ ] Tapping opens folder
- [ ] Back button appears
- [ ] Breadcrumb updates
- [ ] Can navigate back

**Step 2.5: Sentence Strip** (if enabled)
- [ ] Strip visible at top
- [ ] White background with blur effect
- [ ] Icons add to strip when tapped
- [ ] Scrolls horizontally if needed
- [ ] Clear button (red circle) visible
- [ ] Speak button works
- [ ] Clear button removes all items

**Step 2.6: Breadcrumbs**
- [ ] Shows "Home" by default
- [ ] Updates when entering folder
- [ ] Shows current context badge (if not Home)
- [ ] Shows level badge (if not Level 0)

**KNOWN ISSUES TO CHECK:**
- [ ] Buttons too small on iPhone SE
- [ ] Labels cut off
- [ ] Sentence strip overlaps content
- [ ] Scroll doesn't work smoothly
- [ ] Icons not centered

---

### 3. Adult Settings Panel

**Step 3.1: Opening Panel**
- [ ] "Adult Settings" bar at bottom
- [ ] Shows "Show ▲" text
- [ ] Tapping slides panel up
- [ ] Changes to "Hide ▼"
- [ ] Animation is smooth
- [ ] Drag handle visible (gray bar)

**Step 3.2: Lock for Child Use Button**
- [ ] Located at top of panel
- [ ] Red gradient background (#FF3B30 to #FF6B6B)
- [ ] White text: "🔒 Lock for Child Use"
- [ ] Full width button
- [ ] Bold font
- [ ] Tapping enables Child Mode

**Step 3.3: Add Button/Folder**
- [ ] Two buttons side by side:
  - "+ Add Button" (teal)
  - "+ Add Folder" (green)
- [ ] Both functional
- [ ] Opens edit modal

**Step 3.4: Export/Import Layout**
- [ ] Two buttons:
  - "📂 Export Layout"
  - "📤 Import Layout"
- [ ] Export downloads JSON
- [ ] Import opens file picker

**Step 3.5: Communication Level Selector**
- [ ] White background section
- [ ] Header: "Communication Level"
- [ ] Grid of 7 buttons (0-6)
- [ ] Each shows:
  - Icon at top
  - Number below
- [ ] Current level highlighted (teal)
- [ ] Description updates when selected
- [ ] Grid layout: 4 columns

**Step 3.6: Locations Selector**
- [ ] White background section
- [ ] Header: "📍 Locations"
- [ ] "+ New" button on right
- [ ] Shows all contexts as chips:
  - Home 🏠
  - School 🏫
  - Grandparents 👵
  - Store 🛒
  - Outside 🌳
- [ ] Current location highlighted
- [ ] Edit (✎) icon on each chip
- [ ] Delete (×) icon on each chip
- [ ] Can add new location
- [ ] Can rename location
- [ ] Can delete location (min 1 required)

**Step 3.7: Grid Layout Options**
- [ ] White background section
- [ ] Header: "📐 Grid Layout"
- [ ] 5 buttons in 2-column grid:
  - 📱 Auto
  - 🐘 Super Big
  - 🦒 Big
  - 🐕 Standard
  - 🐜 Dense
- [ ] Current selection highlighted
- [ ] Grid updates immediately when changed
- [ ] Super Big shows extra checkbox:
  "Force sentence strip in Super Big mode"

**Step 3.8: Trial Mode Selector**
- [ ] White background section
- [ ] Header: "Next Trial Mode"
- [ ] Two buttons:
  - "Independent" (teal when selected)
  - "Prompted" (orange when selected)
- [ ] Selection toggles correctly
- [ ] Only one can be active

**Step 3.9: Skin Tone Selector**
- [ ] White background section
- [ ] Header: "Skin Tone"
- [ ] 6 circular buttons:
  - Default (gold)
  - Light
  - Medium-Light
  - Medium
  - Medium-Dark
  - Dark
- [ ] Each 32px circle
- [ ] Selected has blue border (3px)
- [ ] Selecting updates emoji skin tones

**Step 3.10: Voice Settings**
- [ ] White background section
- [ ] Header: "🗣️ Voice Settings"
- [ ] Voice dropdown:
  - Shows "Default System Voice"
  - Lists available English voices
  - Selection persists
- [ ] Speed slider:
  - Range: 0.5x to 1.5x
  - Shows current value
  - Updates in real-time
- [ ] Pitch slider:
  - Range: 0.5 to 1.5
  - Shows current value
  - Updates in real-time
- [ ] "▶️ Preview Voice" button:
  - Speaks test phrase
  - Uses current settings

**Step 3.11: Additional Buttons**
- [ ] "🗣️ Play Question Prompt" (only Level 5)
  - Orange background
  - Speaks "What do you want?"

- [ ] "📊 View Progress Dashboard"
  - Blue background (#007AFF)
  - Opens dashboard modal

- [ ] "🧠 Training Mode"
  - Purple background (#5856D6)
  - Enters training mode

- [ ] "🔒 Enable Child Mode"
  - Green background (#34C759)
  - White text
  - Locks interface

- [ ] "📱 How to Lock Screen (iOS)" (iOS only)
  - Light gray background
  - Blue text
  - Opens Guided Access modal

- [ ] "Reset All"
  - Red background (danger)
  - Shows confirmation dialog
  - Clears all data

- [ ] "🧪 Restart Onboarding (Testing)"
  - Orange background
  - Shows confirmation
  - Clears data and reloads

**Step 3.12: Scrolling**
- [ ] Panel scrollable when content overflows
- [ ] Max height: 80vh
- [ ] Smooth scroll on mobile
- [ ] All content accessible
- [ ] No content cut off at bottom
- [ ] Safe area inset at bottom respected

**KNOWN ISSUES TO CHECK:**
- [ ] Sections overlap
- [ ] Buttons too small
- [ ] Text overflow in labels
- [ ] Dropdowns don't open
- [ ] Sliders not responsive
- [ ] Modal doesn't scroll
- [ ] Bottom content hidden by safe area

---

### 4. Child Mode Lock

**Step 4.1: Enabling Child Mode**
- [ ] Tap green "Enable Child Mode" button
- [ ] Panel closes immediately
- [ ] Bottom bar changes to lock indicator

**Step 4.2: Lock Indicator**
- [ ] Fixed at bottom
- [ ] White background (95% opacity)
- [ ] Blur effect (backdrop-filter)
- [ ] Rounded top corners (20px)
- [ ] Shadow above
- [ ] Text: "🔒 Child Mode"
- [ ] Gray text color
- [ ] Centered

**Step 4.3: Unlock Mechanism**
- [ ] Tap lock bar once → hint appears
- [ ] Shows "X more taps to unlock"
- [ ] Teal color hint text
- [ ] Tap 3 times total → unlocks
- [ ] Hint disappears after 3 seconds
- [ ] Counter resets after 3 seconds

**Step 4.4: Locked State**
- [ ] Adult Settings inaccessible
- [ ] Communication buttons still work
- [ ] Folders still navigable
- [ ] All child features functional

**KNOWN ISSUES TO CHECK:**
- [ ] Unlock too easy for child
- [ ] Hint always visible
- [ ] Counter doesn't reset
- [ ] Unlock doesn't work

---

### 5. Context Switching

**Step 5.1: Switching Contexts**
- [ ] Open Adult Settings
- [ ] Tap different location (e.g., School)
- [ ] Icons change to school-specific items
- [ ] Breadcrumb shows context badge
- [ ] Settings panel stays open

**Step 5.2: Context-Specific Icons**
Test each context has unique icons:

**Home:**
- [ ] I want, I see, I feel (starters)
- [ ] Mom, Dad
- [ ] Foods folder
- [ ] Toys folder
- [ ] TV folder
- [ ] Feelings folder

**School:**
- [ ] I want, I see (starters)
- [ ] Teacher, Help, Bathroom
- [ ] School folder (pencil, paper, computer)
- [ ] Friends folder

**Grandparents:**
- [ ] I want (starter)
- [ ] Grandma, Grandpa
- [ ] Hug, Cookie
- [ ] Treats folder

**Store:**
- [ ] I want (starter)
- [ ] Help, Cart, Bathroom
- [ ] Shopping folder

**Outside:**
- [ ] I want (starter)
- [ ] Play, Swing, Slide
- [ ] Nature folder
- [ ] Playground folder

**Step 5.3: Context Persistence**
- [ ] Switching contexts saves current layout
- [ ] Returning to context restores layout
- [ ] Each context independent
- [ ] Custom icons persist per context

**KNOWN ISSUES TO CHECK:**
- [ ] Icons don't change
- [ ] Context doesn't save
- [ ] Badge doesn't show
- [ ] Data loss on switch

---

### 6. Grid Size Options

Test each grid size at mobile viewport (375px):

**Step 6.1: Auto**
- [ ] Default 3 columns
- [ ] Responsive behavior
- [ ] Icons ~3rem (~48px)

**Step 6.2: Super Big (2 columns)**
- [ ] 2 columns only
- [ ] Very large icons
- [ ] Minimal buttons visible
- [ ] Good for motor difficulties
- [ ] Sentence strip hidden by default
- [ ] Checkbox to force strip appears

**Step 6.3: Big (3 columns)**
- [ ] 3 columns
- [ ] Larger than standard
- [ ] Good balance of size/quantity

**Step 6.4: Standard (4 columns)**
- [ ] 4 columns
- [ ] More buttons visible
- [ ] Smaller icons

**Step 6.5: Dense (6 columns)**
- [ ] 6 columns
- [ ] Smallest icons
- [ ] Maximum buttons visible
- [ ] May be too small on mobile

**KNOWN ISSUES TO CHECK:**
- [ ] Icons overlap
- [ ] Text cut off
- [ ] Grid doesn't update
- [ ] Too small to tap

---

### 7. Training Mode

**Step 7.1: Entering Training Mode**
- [ ] Tap "Training Mode" button
- [ ] Adult Settings stays open
- [ ] Shows "Select 2+ items" header
- [ ] Shows Shuffle and Done buttons
- [ ] Edit badges disappear
- [ ] Training checkboxes appear

**Step 7.2: Selecting Items**
- [ ] Tap item → checkbox appears
- [ ] Tap again → checkbox disappears
- [ ] Selected items stay visible
- [ ] Non-selected items don't dim (until shuffled)
- [ ] Can select 2+ items

**Step 7.3: Shuffling**
- [ ] Tap "Shuffle" button
- [ ] Selected items randomize
- [ ] Non-selected items become dimmed (15% opacity)
- [ ] Only selected items are interactive
- [ ] Tapping selected items still works

**Step 7.4: Exiting Training Mode**
- [ ] Tap "Done" button
- [ ] Returns to normal mode
- [ ] All items visible again
- [ ] Edit badges return (if edit mode)
- [ ] Selection cleared

**KNOWN ISSUES TO CHECK:**
- [ ] Checkboxes not visible
- [ ] Shuffle doesn't randomize
- [ ] Can't exit training mode
- [ ] Dimmed items still clickable

---

### 8. Character Builder

**Step 8.1: Opening Character Builder**
- [ ] Edit an item
- [ ] Choose "Custom Icon" > "Create Character"
- [ ] Modal opens from bottom
- [ ] Centered on screen

**Step 8.2: Modal Layout**
- [ ] Header: "✨ My Character"
- [ ] Close button (×) top-right
- [ ] Preview area with gray gradient background
- [ ] 160x160px SVG preview
- [ ] Smooth shadow effect
- [ ] Scrollable content (if needed)

**Step 8.3: Skin Tone Picker**
- [ ] Label: "Skin Tone"
- [ ] 7 circular buttons (44x44px each)
- [ ] Horizontally scrollable
- [ ] Colors:
  - Pale, Fair, Medium, Olive, Brown, Dark, Black
- [ ] Selected has blue border
- [ ] Preview updates immediately

**Step 8.4: Hair Color Picker**
- [ ] Label: "Hair Color"
- [ ] 11 circular buttons (44x44px each)
- [ ] Horizontally scrollable
- [ ] Colors:
  - Natural: Blonde, Dirty Blonde, Ginger, Brown, Black
  - Gray/White
  - Fun: Pink, Blue, Purple, Green
- [ ] Selected has blue border
- [ ] Preview updates immediately

**Step 8.5: Hair Style Grid**
- [ ] Label: "Hair Style"
- [ ] Grid layout (2-3 columns responsive)
- [ ] 12 style options:
  - No Hair, Classic Bob, Straight, Wavy
  - Big Curls, Ponytail, Space Buns, Pigtails
  - Side Braid, Pixie, Spiky, Afro/Puff
- [ ] Selected has blue background + white text
- [ ] All buttons 44px min height
- [ ] Preview updates immediately

**Step 8.6: Real-time Preview**
- [ ] Character updates as selections change
- [ ] Smooth transitions
- [ ] All features render correctly
- [ ] No broken SVG paths

**Step 8.7: Saving**
- [ ] "Cancel" button (gray) bottom-left
- [ ] "Save Character" button (blue) bottom-right
- [ ] Saving generates SVG data URL
- [ ] Icon uses generated character
- [ ] Modal closes
- [ ] Character appears in button

**Step 8.8: Re-editing**
- [ ] Edit same item again
- [ ] Character Builder opens
- [ ] Previous selections restored
- [ ] Can modify and save again

**KNOWN ISSUES TO CHECK:**
- [ ] Modal doesn't scroll
- [ ] Pickers not scrollable on mobile
- [ ] Buttons too small to tap
- [ ] Preview doesn't update
- [ ] SVG generation fails
- [ ] Modal can't close

---

### 9. Progress Dashboard

**Step 9.1: Opening Dashboard**
- [ ] Tap "View Progress Dashboard"
- [ ] Opens full-screen modal
- [ ] Dark overlay background
- [ ] White content area

**Step 9.2: Dashboard Content**
- [ ] Shows current level
- [ ] Shows streak count
- [ ] Shows charts/graphs
- [ ] Charts are responsive
- [ ] Scrollable if needed
- [ ] Close button visible

**Step 9.3: Closing Dashboard**
- [ ] Close button (×) works
- [ ] Tapping outside doesn't close
- [ ] Returns to main view

**KNOWN ISSUES TO CHECK:**
- [ ] Charts don't render on mobile
- [ ] Text too small
- [ ] Overflow hidden
- [ ] Can't scroll
- [ ] Can't close

---

### 10. Photo/Camera Features

**Step 10.1: Custom Icon Upload**
- [ ] Edit item
- [ ] Tap "Custom Icon"
- [ ] Options appear:
  - 📷 Take Photo (if camera available)
  - 📁 Choose from Gallery
  - 👤 Create Character
  - 🎨 Choose Emoji

**Step 10.2: File Picker**
- [ ] Tap "Choose from Gallery"
- [ ] Native file picker opens
- [ ] Can select images
- [ ] Shows image preview

**Step 10.3: Image Upload**
- [ ] Select image
- [ ] Image uploads successfully
- [ ] Thumbnail generated
- [ ] Icon displays image
- [ ] Image maintains aspect ratio

**Step 10.4: Camera (if available)**
- [ ] Tap "Take Photo"
- [ ] Camera permission requested
- [ ] Camera viewfinder opens
- [ ] Can capture photo
- [ ] Photo used as icon

**KNOWN ISSUES TO CHECK:**
- [ ] File picker doesn't open
- [ ] Images too large
- [ ] Upload fails
- [ ] Camera not working
- [ ] Images distorted

---

## Performance Testing

### Load Time
```javascript
// Run in console:
performance.timing.loadEventEnd - performance.timing.navigationStart
```
- [ ] Initial load < 3000ms (3 seconds)
- [ ] Splash screen animates smoothly

### Interaction Responsiveness
- [ ] Button tap responds < 100ms
- [ ] Audio plays immediately
- [ ] Animations at 60fps
- [ ] No janky scrolling

### Memory Usage
- [ ] Open DevTools > Performance Monitor
- [ ] Use app for 5 minutes
- [ ] Check for memory leaks
- [ ] JS Heap should stabilize

---

## Accessibility Testing

### Touch Targets
- [ ] All buttons minimum 44x44px
- [ ] Adequate spacing between buttons (8px+)
- [ ] No overlapping tap areas

### Text Readability
- [ ] Font size minimum 14px
- [ ] Labels not truncated
- [ ] Good contrast ratio
- [ ] Line height adequate

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Icons distinguishable
- [ ] Disabled states clear

### Motion
- [ ] Animations respect prefers-reduced-motion
- [ ] Can disable animations if needed

---

## Browser Compatibility

### iOS Safari
- [ ] Safe area insets respected
- [ ] Rubber band scroll prevented
- [ ] Audio plays without user gesture issues
- [ ] File upload works
- [ ] Speech synthesis works

### Chrome Mobile
- [ ] All features work
- [ ] Performance good
- [ ] File upload works

### Firefox Mobile
- [ ] All features work
- [ ] No layout issues

---

## Edge Cases

### Empty States
- [ ] No items in folder
- [ ] No sentence strip items
- [ ] No progress data

### Overflow
- [ ] Long item labels
- [ ] Many items in folder
- [ ] Many contexts

### Rapid Interactions
- [ ] Tap button multiple times quickly
- [ ] Switch contexts rapidly
- [ ] Open/close modals quickly

### Network
- [ ] Works offline (PWA)
- [ ] LocalStorage persists

---

## Bug Report Template

When you find an issue, document it:

```markdown
### Bug: [Short Description]

**Severity:** Critical / Major / Minor

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshot:**
[Attach screenshot]

**Environment:**
- Device: iPhone SE / Pixel 5 / etc.
- Browser: Safari 17.1 / Chrome 120 / etc.
- Viewport: 375x667

**Console Errors:**
```
[Paste any console errors]
```

**Additional Notes:**
Any other relevant information
```

---

## Success Criteria

### Must Pass (Critical)
- [ ] All main features accessible on mobile
- [ ] Touch targets meet 44px minimum
- [ ] No layout breaking issues
- [ ] Performance acceptable (< 3s load)
- [ ] Adult Settings fully functional
- [ ] Child Mode locks correctly

### Should Pass (Important)
- [ ] All animations smooth
- [ ] Text readable without zooming
- [ ] No horizontal scroll
- [ ] Images load correctly
- [ ] Audio plays reliably

### Nice to Have (Enhancement)
- [ ] Haptic feedback on interactions
- [ ] Smooth transitions
- [ ] Delightful micro-interactions

---

## Final Report Template

```markdown
# Mobile Testing Report - [Date]

## Executive Summary
Brief overview of testing results

## Test Coverage
- Total Tests: X
- Passed: Y
- Failed: Z
- Coverage: XX%

## Critical Issues
List any blocking issues

## Major Issues
List important but not blocking issues

## Minor Issues
List cosmetic or low-impact issues

## Performance Results
- Load time: Xms
- Interaction responsiveness: Good/Fair/Poor
- Memory usage: Stable/Increasing

## Browser Compatibility
- iOS Safari: ✓ / ✗
- Chrome Mobile: ✓ / ✗
- Firefox Mobile: ✓ / ✗

## Recommendations
Priority-ordered list of fixes

## Screenshots
Attach relevant screenshots

## Conclusion
Overall assessment and sign-off
```

---

## Quick Reference: Common Issues

### Issue: Buttons too small
**Fix:** Check CSS min-width/min-height (44px), adjust grid gap

### Issue: Text overflow
**Fix:** Check text-overflow: ellipsis, adjust max-width

### Issue: Modal won't scroll
**Fix:** Check max-height, overflow-y: auto on modal content

### Issue: Safe area not respected
**Fix:** Check padding uses env(safe-area-inset-*)

### Issue: Animation lag
**Fix:** Use transform/opacity for animations, check will-change

### Issue: Touch doesn't work
**Fix:** Check z-index, pointer-events, touch-action

---

## Testing Shortcuts

### Clear data and restart
```javascript
localStorage.clear(); location.reload();
```

### Skip onboarding
```javascript
localStorage.setItem('kiwi-onboarding-complete', 'true'); location.reload();
```

### Set specific level
```javascript
localStorage.setItem('kians-phase', '4'); location.reload();
```

### Enable all features
```javascript
localStorage.setItem('kiwi-child-mode', 'unlocked');
localStorage.setItem('kians-show-strip', 'true');
location.reload();
```

---

## Help & Support

If you encounter issues during testing:
1. Check browser console for errors
2. Take screenshots
3. Document steps to reproduce
4. Note device/browser version
5. Check if issue exists on desktop
6. Test in different browsers

---

**Happy Testing! 🧪**
