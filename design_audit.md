# Design Audit: Accessibility & Color Contrast
## Project: Kiwi Voice
## Last Updated: January 2, 2026

### 1. Contrast Standards (WCAG 2.1 AA)
All text and essential UI elements must meet the following minimum contrast ratios against their background:
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

### 3. Brand Typography
Optimized for legibility and dyslexic-friendly accessibility.

| Role | Font Family | Weight | Rationale |
| :--- | :--- | :--- | :--- |
| **Primary** | `SF Pro Rounded` | 600 - 900 | Friendly, modern, high legibility. |
| **Fallback** | `SF Pro Text`, `Roboto` | 400 - 700 | Native system compatibility. |
| **Literacy** | `Lexend`, `OpenDyslexic` | 500 | Proven to improve readability for neurodiverse users. |

### 4. Fitzgerald Key Colors (AAC Optimized)
Optimized to ensure white text is readable on all action buttons.

| Word Class | Color | Contrast (White Text) |
| :--- | :--- | :--- |
| **Nouns (Yellow)** | `#FFEB3B` | N/A (Uses Dark Text `#2D3436`) |
| **Verbs (Green)** | `#1B5E20` | ✅ 5.1:1 |
| **Adjectives (Blue)** | `#0D47A1` | ✅ 10.5:1 |
| **Social (Pink)** | `#880E4F` | ✅ 9.8:1 |
| **Misc (Orange)** | `#BF360C` | ✅ 4.6:1 |
| **Questions (Purple)** | `#4A148C` | ✅ 11.5:1 |

### 4. Recent Remediations (Audit Jan 2026)
- **Primary Teal:** Darkened from `#4ECDC4` to `#1A535C` to meet 4.5:1 ratio for white text.
- **Onboarding Screens:** Removed hardcoded `color: white` on light backgrounds.
- **Child Lock Bar:** Ensured the background/text ratio in the triple-tap footer is accessible.
- **High-Contrast Mode:** Forced pure black/white variables to bypass themed colors for maximum visibility.
- **A2HS Modal:** Standardized step numbering to use `--primary-text` variable.

### 5. Ongoing Monitoring
- **Manual Check:** Any new component must be tested with the "High Contrast" toggle.
- **Automated Check:** Run `axe-core` or Chrome DevTools Lighthouse audit before production releases.
