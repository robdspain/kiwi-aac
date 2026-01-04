# Design Audit: Accessibility & Color Contrast
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Contrast Standards (WCAG 2.1 AA)
All text and essential UI elements must meet the following minimum contrast ratios against their background:
- **Default Mode:** Light Mode is the strict system default. Dark Mode is an optional override.
- **Normal Text (under 18pt):** 4.5:1
- **Large Text (18pt+ or bold 14pt+):** 3:1
- **UI Components & Icons:** 3:1

### 2. Standardized Color Palette
These variables are defined in `src/index.css` and optimized for contrast.

| Variable | Hex Code | Usage | Contrast Check |
| :--- | :--- | :--- | :--- |
| `--primary` | `#1A535C` | Main Buttons / Brand | ✅ 4.5:1 on White |
| `--primary-text` | `#FFFFFF` | Text on Primary | ✅ 4.5:1 on Primary |
| `--bg-color` | `#FDF8F3` | Page Background | - |
| `--text-primary` | `#2D3436` | Heading / Body Text | ✅ 12:1 on White |
| `--text-secondary` | `#444444` | Subheadings | ✅ 9:1 on White |
| `--text-muted` | `#636E72` | Helper Text / Captions | ✅ 5.8:1 on White |

**Important:** Always use CSS variables (e.g., `var(--text-muted)`) instead of hardcoded hex values to ensure consistency and theme compatibility.

### 3. Fitzgerald Key Colors (AAC Optimized)
Optimized to ensure text is readable on all action buttons. **Rule:** Never use white text on yellow backgrounds.

| Word Class | Color | Text Variable | Contrast Check |
| :--- | :--- | :--- | :--- |
| **Nouns (Yellow)** | `#FFEB3B` | `--fitz-noun-text` (`#2D3436`) | ✅ 12:1 |
| **Verbs (Green)** | `#1B5E20` | `--fitz-verb-text` (`#FFFFFF`) | ✅ 5.1:1 |
| **Adjectives (Blue)** | `#0D47A1` | `--fitz-adj-text` (`#FFFFFF`) | ✅ 10.5:1 |
| **Social (Pink)** | `#880E4F` | `--fitz-social-text` (`#FFFFFF`) | ✅ 9.8:1 |
| **Misc (Orange)** | `#BF360C` | `--fitz-misc-text` (`#FFFFFF`) | ✅ 4.6:1 |
| **Questions (Purple)** | `#4A148C` | `--fitz-question-text` (`#FFFFFF`) | ✅ 11.5:1 |

### 4. Recent Remediations (Audit Jan 2026)
- **Default Theme:** Removed automatic OS-based dark mode switch. Light Mode is now the strict default for visual stability.
- **Noun Contrast:** Fixed "white on yellow" issues in Assessment and Grid by forcing dark text on nouns.
- **Primary Teal:** Darkened from `#4ECDC4` to `#1A535C` to meet 4.5:1 ratio for white text.
- **Onboarding Screens:** Removed hardcoded `color: white` on light backgrounds.
- **Child Lock Bar:** Ensured the background/text ratio in the triple-tap footer is accessible.
- **High-Contrast Mode:** Forced pure black/white variables to bypass themed colors for maximum visibility.
- **A2HS Modal:** Standardized step numbering to use `--primary-text` variable.
- **Helper Text Color (Jan 3, 2026):** Replaced all instances of `#8E8E93` (iOS gray, 2.4:1 contrast) with `var(--text-muted)` (`#636E72`, 5.8:1 contrast) across 18 components for WCAG AA compliance.
- **Minimum Font Size (Jan 3, 2026):** Increased all helper text from `0.625rem` (10px) to `0.75rem` (12px) for improved readability and accessibility standards.

### 5. Branding Invariants
To maintain professional identity, the following branding rules are non-negotiable:
- **Primary Logo:** `public/images/logo.png` is the sole source of truth for the brand mark. 
- **Splash Screen:** MUST use the high-resolution logo image. Generic emojis or alternative icons are prohibited.
- **Landing Page:** The header and footer MUST use the official logo image.
- **PWA Icons:** All generated icons in `public/icons/` must be derived directly from the primary logo.

### 6. Ongoing Monitoring
- **Manual Check:** Any new component must be tested with the "High Contrast" toggle.
- **Automated Check:** Run `axe-core` or Chrome DevTools Lighthouse audit before production releases.
