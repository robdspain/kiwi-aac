# Kiwi Voice - Superwall Integration Guide

## Overview

Kiwi Voice uses Superwall for premium feature paywalls and subscription management. This document provides complete setup instructions and implementation details.

---

## Setup Steps

### 1. Create Superwall Account

1. Go to https://superwall.com
2. Sign up for a Superwall account
3. Create a new app in the dashboard
4. Note your **Public API Key**

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPERWALL_API_KEY=your_public_api_key_here
```

For production deployment, add this to your hosting platform (Netlify, Vercel, etc.)

### 3. Initialize Superwall Web SDK

The web SDK is initialized automatically in `public/index.html` (already configured):

```html
<script src="https://cdn.jsdelivr.net/npm/@superwall/superwall-web@latest"></script>
<script>
  window.Superwall.configure({
    apiKey: 'YOUR_API_KEY'
  });
</script>
```

**Note:** Replace `YOUR_API_KEY` with your actual Superwall public API key before deployment.

### 4. Configure Paywalls in Superwall Dashboard

For each premium feature, create a paywall campaign in the Superwall dashboard:

---

## Implemented Premium Features & Events

### 1. ✅ Color Themes (IMPLEMENTED)

**Event Name:** `colorThemes`

**Trigger Location:** `src/components/Controls.jsx:846`

**Implementation:**
```javascript
const result = await Superwall.register({ event: 'colorThemes' });
if (result.result === 'userIsSubscribed' || result.result === 'noRuleMatch') {
    onSetColorTheme(theme.id);
}
```

**Free Tier:** Default "Kiwi" theme
**Premium:** Ocean, Sunset, Forest, Berry, Candy themes

**Superwall Campaign Setup:**
- Campaign Name: "Premium Color Themes"
- Trigger Event: `colorThemes`
- Products: Monthly ($4.99), Yearly ($39.99)
- Paywall Template: Feature showcase with color theme previews

---

### 2. ✅ Export Analytics (IMPLEMENTED)

**Event Name:** `exportAnalytics`

**Trigger Location:** `src/components/Dashboard.jsx:70`

**Implementation:**
```javascript
const hasAccess = await checkExportAnalytics();
if (hasAccess) {
    exportToCSV();
}
```

**Free Tier:** View last 7 days, share reports
**Premium:** Export to CSV, unlimited history

**Superwall Campaign Setup:**
- Campaign Name: "Advanced Analytics"
- Trigger Event: `exportAnalytics`
- Paywall Template: Data insights showcase

---

### 3. ✅ Pronunciation Dictionary (IMPLEMENTED)

**Event Name:** `premiumVoice`

**Trigger Location:** `src/components/PronunciationEditor.jsx:14`

**Implementation:**
```javascript
const currentCount = Object.keys(pronunciations).length;
const hasAccess = await checkPronunciationLimit(currentCount);
```

**Free Tier:** 10 pronunciation entries
**Premium:** Unlimited entries, voice presets

**UI Shows:** "8/10 free entries used" (red when at limit)

**Superwall Campaign Setup:**
- Campaign Name: "Premium Voice Features"
- Trigger Event: `premiumVoice`
- Paywall Template: Voice customization showcase

---

### 4. ✅ Unlimited Vocabulary (IMPLEMENTED)

**Event Name:** `unlimitedVocabulary`

**Trigger Location:** `src/App.jsx:664`

**Implementation:**
```javascript
const totalIconCount = rootItems.reduce((total, page) =>
    total + countIcons(page.items || []), 0
);
const hasAccess = await checkUnlimitedVocabulary(totalIconCount);
if (!hasAccess) return; // Block adding 51st icon
```

**Free Tier:** 50 icons maximum
**Premium:** Unlimited icons and folders

**Superwall Campaign Setup:**
- Campaign Name: "Unlimited Vocabulary"
- Trigger Event: `unlimitedVocabulary`
- Alternative Event: `addIcon51` (specific trigger when hitting limit)
- Paywall Template: Vocabulary expansion showcase

---

### 5. ✅ Multi-Profile Support (IMPLEMENTED)

**Event Name:** `multiProfiles`

**Trigger Location:** `src/context/ProfileContext.jsx:60`

**Implementation:**
```javascript
const hasAccess = await checkMultiProfiles(profiles.length);
if (!hasAccess) {
    return null; // Block adding 2nd profile
}
```

**Free Tier:** 1 profile (default)
**Premium:** Unlimited profiles with easy switching

**Superwall Campaign Setup:**
- Campaign Name: "Multi-Learner Profiles"
- Trigger Event: `multiProfiles`
- Alternative Event: `addProfile2` (when adding 2nd profile)
- Paywall Template: Family/classroom use case showcase

---

## Pending Premium Features (To Add)

### 6. ⏳ Premium Templates

**Event Name:** `premiumTemplates`, `applyTemplate`

**Where to Add:** Template selection UI (future feature)

**Implementation Plan:**
```javascript
import { checkPremiumTemplates } from '../utils/paywall';

const applyTemplate = async (template) => {
    if (template.premium) {
        const hasAccess = await checkPremiumTemplates();
        if (!hasAccess) return;
    }
    // Apply template logic
};
```

**Free Tier:** First 50 Words, Basic Needs
**Premium:** 20+ curated templates (School, Therapy, Mealtime, etc.)

---

### 7. ⏳ Cloud Sync & Collaboration

**Event Names:** `cloudSync`, `teamSharing`

**Where to Add:** Backup/Restore settings

**Implementation Plan:**
```javascript
import { checkCloudSync } from '../utils/paywall';

const enableCloudBackup = async () => {
    const hasAccess = await checkCloudSync();
    if (hasAccess) {
        // Enable Supabase sync
    }
};
```

**Free Tier:** Local storage only
**Premium:** Cloud backup, sync across devices, team sharing

---

### 8. ⏳ Unlimited People/Characters

**Event Name:** `unlimitedPeople`, `addCustomCharacter`

**Where to Add:** Character/People builder (future feature)

**Free Tier:** 3 custom characters
**Premium:** Unlimited custom characters with photos

---

### 9. ⏳ Advanced Analytics

**Event Name:** `advancedAnalytics`

**Where to Add:** Dashboard date range filters

**Free Tier:** Last 7 days only
**Premium:** Unlimited history, IEP goal tracking, weekly reports

---

## Helper Functions (src/utils/paywall.js)

All paywall logic is centralized in `src/utils/paywall.js`:

### Available Functions:

```javascript
// Color themes
await checkColorThemeAccess()

// Analytics
await checkAdvancedAnalytics()
await checkExportAnalytics()

// Voice features
await checkPremiumVoice()
await checkVoicePresets()
await checkPronunciationLimit(currentCount)

// Vocabulary
await checkUnlimitedVocabulary(currentIconCount)

// Profiles
await checkMultiProfiles(currentProfileCount)

// Templates
await checkPremiumTemplates()
await checkApplyTemplate(templateId)

// Cloud features
await checkCloudSync()
await checkTeamSharing()

// Custom photos
await checkCustomPhotoLimit(currentPhotoCount)

// Generic trigger
await triggerPaywall(eventName, params)

// Restore purchases
await restorePurchases()
```

### Free Tier Limits:

```javascript
export const FREE_TIER_LIMITS = {
  MAX_ICONS: 50,
  MAX_PROFILES: 1,
  MAX_CUSTOM_PEOPLE: 3,
  MAX_PRONUNCIATION_ENTRIES: 10,
  ANALYTICS_HISTORY_DAYS: 7,
  MAX_CUSTOM_PHOTOS: 20
};
```

---

## Subscription Products

Configure these products in Superwall Dashboard → Products:

### Monthly Plan: $4.99/month

- **Product ID:** `kiwi_pro_monthly`
- **Display Name:** "Kiwi Pro Monthly"
- **Trial Period:** 7 days free

### Yearly Plan: $39.99/year (Save 33%)

- **Product ID:** `kiwi_pro_yearly`
- **Display Name:** "Kiwi Pro Yearly"
- **Trial Period:** 7 days free
- **Best Value Badge:** Yes

### Family Plan: $99/year (Future)

- **Product ID:** `kiwi_pro_family`
- **Display Name:** "Kiwi Pro Family (5 users)"
- **Trial Period:** 7 days free

---

## Testing Paywalls

### Test Mode (Development)

Paywalls are graceful in development - if Superwall is not configured, all features return `true` (access granted).

### Production Testing

1. **Test Subscription Flow:**
   ```bash
   npm run build
   npm run preview
   ```
   - Click a premium color theme → Paywall should appear
   - Try adding 51st icon → Paywall should appear
   - Try exporting analytics → Paywall should appear

2. **Test Restore Purchases:**
   - In Controls → Advanced → "Restore Purchases"
   - Should call `Superwall.restore()`

3. **Test Subscription Status:**
   - After purchasing, all premium features should unlock
   - Close and reopen app → Should remain unlocked

---

## Paywall Campaign Examples

### Example 1: Color Themes Paywall

**Trigger:** User clicks premium color theme

**Paywall Content:**
```
🎨 Unlock Premium Themes

Make Kiwi Voice truly yours with beautiful color themes:

✨ Ocean - Calming blue tones
🌅 Sunset - Warm orange & pink
🌲 Forest - Natural greens
🍇 Berry - Vibrant purples
🍬 Candy - Playful pinks

Plus unlock ALL premium features:
📊 Advanced analytics
☁️ Cloud sync
🗣️ Voice customization
👥 Multiple profiles
📚 Premium templates

Only $3.33/month (billed yearly)
```

### Example 2: Vocabulary Limit Paywall

**Trigger:** User tries to add 51st icon

**Paywall Content:**
```
📚 Expand Your Vocabulary

You've reached the free tier limit (50 icons)

Kiwi Pro unlocks:
✅ Unlimited icons and folders
✅ Multiple pages
✅ Advanced organization
✅ Cloud backup

Plus get access to:
🎨 Premium themes
📊 Export analytics
🗣️ Voice presets
👥 Multi-user support

Start your 7-day free trial
Only $39.99/year
```

---

## Analytics & Tracking

### Paywall Events to Track:

1. **Impressions:** How many times paywall shown
2. **Conversions:** How many users subscribe
3. **Dismissals:** How many users close paywall
4. **Revenue:** Total subscription revenue

Superwall automatically tracks these metrics.

### Custom Event Params (Optional):

```javascript
await Superwall.register({
    event: 'unlimitedVocabulary',
    params: {
        currentIconCount: 50,
        attemptedAction: 'add_icon'
    }
});
```

---

## Troubleshooting

### Paywall Not Showing

1. Check Superwall API key is set
2. Verify campaign is active in dashboard
3. Check event name matches exactly
4. Look for errors in browser console

### Subscription Not Persisting

1. Ensure `Superwall.restore()` is called on app launch
2. Check localStorage is not being cleared
3. Verify subscription status in Superwall dashboard

### Web SDK vs Native

- **Web (PWA):** Uses Superwall Web SDK (implemented)
- **iOS/Android:** Uses Superwall native SDK (via Capacitor plugin)

Both work seamlessly with the same dashboard configuration.

---

## Revenue Projections

Based on PRD Section 7.7:

**Conservative (Year 1):**
- 10,000 free users
- 5% conversion = 500 paid users
- 500 × $39.99/year = **$19,995 ARR**

**Moderate (Year 2):**
- 50,000 free users
- 8% conversion = 4,000 paid users
- 4,000 × $39.99 = **$159,960 ARR**

**Target Metrics:**
- Free-to-paid conversion > 5%
- Monthly churn < 5%
- Average revenue per user > $35/year

---

## Next Steps

1. ✅ **Complete:** Core paywall triggers implemented
2. ⏳ **Pending:** Create Superwall account and get API key
3. ⏳ **Pending:** Configure paywall campaigns in dashboard
4. ⏳ **Pending:** Add API key to production environment
5. ⏳ **Pending:** Test subscription flow on staging
6. ⏳ **Pending:** Add remaining premium features (templates, cloud sync)
7. ⏳ **Pending:** Submit app to App Store / Play Store with in-app purchases

---

**Last Updated:** 2026-01-02
**Status:** ✅ Code Implementation Complete
**Remaining:** Superwall Dashboard Configuration
