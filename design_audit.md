# DESIGN AUDIT - ZEN UI/UX REVIEW
# Status: In Progress

## 1. Visual Hierarchy & Clutter
- [ ] **EmojiCurator.jsx:** The grid items are clean, but the "Edit Metadata" pencil icon (absolute position) might clutter the visual space on small screens.
- [ ] **Dashboard.jsx:** The dashboard is data-heavy. The "Level History" and "Usage Overview" sections are well-separated, but the color palette in the charts relies heavily on multiple distinct colors (rainbow effect) which might not be "Zen."
- [ ] **VisualSchedule.jsx:** Very clean. Good focus on the single active item.

## 2. Color & Contrast
- [x] **Global CSS:** The `--bg-gradient` (#FDF8F3 to #F5F0EB) provides a warm, calming base.
- [ ] **Dashboard:** Uses `#E3F2FD`, `#E8F5E9`, `#FFF3E0`, `#FCE4EC` for stats cards. These are pastel and accessible, but maybe too many distinct hues for a "Zen" feel.
- [ ] **EmojiCurator:** The `#f0f7ff` selection background is subtle. The `#4ECDC4` primary color is fresh and modern.

## 3. Touch Targets
- [x] **General:** Buttons have `min-height: 52px` (Global CSS), exceeding the 44px minimum.
- [ ] **EmojiCurator:** The "Edit" pencil icon is `24x24`. This is too small for a touch target, even if the hit area is padded. *Action: Increase visual size or padding.*

## 4. Consistency
- [ ] **VisualSchedule:** Uses inline styles for buttons (`borderRadius: '15px'`) which deviates from the Global CSS variable `--radius-md` (20px).
- [ ] **Dashboard:** Uses inline styles for cards instead of CSS classes, making it harder to maintain theme consistency.

## 5. Animations
- [x] **Global:** `fadeIn`, `bounceIn`, `pulse` are defined in CSS.
- [ ] **EmojiCurator:** Uses `animation: popIn` in inline styles. Should be moved to CSS class for performance and reusability.

## ACTION PLAN
1.  **Refactor Inline Styles:** Move inline styles from `VisualSchedule.jsx` and `Dashboard.jsx` to `App.css` or `index.css` to use CSS variables.
2.  **Fix Touch Targets:** Increase the size of the edit pencil in `EmojiCurator`.
3.  **Harmonize Colors:** Ensure the Dashboard colors align with the global CSS variables.