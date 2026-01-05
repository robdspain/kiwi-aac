# Kiwi AAC Paywall Setup

## 📦 What's Included

I've created a complete RevenueCat paywall configuration package for you:

### 1. **Backend Setup Script** (`scripts/setup-revenuecat.sh`)
Automated script that creates all the backend infrastructure via RevenueCat REST API:
- ✅ Products (kiwi_monthly, kiwi_annual)
- ✅ Entitlement (pro)
- ✅ Offering (default)
- ✅ Packages ($rc_monthly, $rc_annual)

### 2. **Dashboard Configuration** (`paywall-dashboard-config.json`)
Complete JSON configuration matching RevenueCat's paywall format:
- 🎨 Header (icon, title, subtitle)
- ✨ 9 Premium features (2 highlighted)
- 💰 Pricing (monthly + annual with badges)
- 🎁 7-day free trial
- 🎯 CTA buttons (Kiwi teal + iOS blue)
- 📋 Footer (legal links, disclaimer)
- 🌍 Localization (English + Spanish)
- 🎯 Audience targeting (3 variants)

### 3. **Implementation Guide** (`FIRST-KIWI-PAYWALL-CONFIG.md`)
Step-by-step manual for configuring the paywall in RevenueCat dashboard.

### 4. **JavaScript API Script** (`scripts/create-paywall.js`)
Node.js script for programmatic paywall management (create, update, list).

---

## 🚀 Quick Start

### Option A: Automated Backend Setup (Recommended)

1. **Get your RevenueCat credentials:**
   ```bash
   # Go to: https://app.revenuecat.com/settings/api-keys
   # Copy your "Secret API Key" (starts with "sk_")
   # Get your project ID from the dashboard URL
   ```

2. **Set environment variables:**
   ```bash
   export REVENUECAT_SECRET_KEY="sk_your_secret_key_here"
   export REVENUECAT_PROJECT_ID="your_project_id_here"
   ```

3. **Run the setup script:**
   ```bash
   ./scripts/setup-revenuecat.sh
   ```

   This will create:
   - Products: `kiwi_monthly`, `kiwi_annual`
   - Entitlement: `pro`
   - Offering: `default` (with 2 packages)

4. **Configure the paywall visually:**
   - Go to https://app.revenuecat.com
   - Navigate to **Paywalls** → **Create Paywall**
   - Name it **"First Kiwi Paywall"**
   - Use `paywall-dashboard-config.json` as your reference
   - Copy/paste all content from `FIRST-KIWI-PAYWALL-CONFIG.md`

---

### Option B: Manual Dashboard Setup

If you prefer to set everything up manually:

1. **Follow the step-by-step guide:**
   - Open `FIRST-KIWI-PAYWALL-CONFIG.md`
   - Complete all 14 sections in order
   - Use the checklist at the end to verify

2. **Use the JSON config as reference:**
   - `paywall-dashboard-config.json` has all the exact values
   - Copy colors, font sizes, text content directly

---

## 📱 App Integration

Your app is already set up! The RevenueCat SDK is integrated:

### Show Paywall in Your App

```javascript
import { revenueCatService } from './services/RevenueCatService';

// Show paywall for a specific feature
await revenueCatService.showPaywallIfNeeded('premium_themes');

// OR show paywall unconditionally
await revenueCatService.showPaywall('subscription_prompt');
```

### Check Premium Access

```javascript
const hasPremium = await revenueCatService.hasPremiumAccess();

if (hasPremium) {
  // Grant access to premium features
} else {
  // Show paywall
  await revenueCatService.showPaywallIfNeeded('feature_name');
}
```

### Paywall Triggers Already Implemented

The following features already trigger the paywall automatically:
- ✅ Color themes (beyond default)
- ✅ Custom vocabulary (beyond 50 words)
- ✅ Multiple user profiles
- ✅ Advanced analytics
- ✅ Cloud sync
- ✅ Custom photos (beyond 20)
- ✅ Custom people (beyond 3)

See `src/utils/paywall.js` for all trigger points.

---

## 🎨 Paywall Design Highlights

### Visual Design
- **Icon**: 🥝 (80×80px)
- **Title**: "Unlock Kiwi Pro"
- **Subtitle**: "Empower unlimited communication with premium AAC features"
- **Primary Color**: #1A535C (Kiwi Teal)
- **Accent Color**: #007AFF (iOS Blue)

### 9 Premium Features
1. ✨ **Unlimited Vocabulary** (highlighted)
2. 🎙️ **Premium Voice Quality** (highlighted)
3. 👥 Multiple User Profiles
4. ☁️ Cloud Backup & Sync
5. 📊 Advanced Analytics
6. 🎨 Premium Themes
7. 📸 Unlimited Photos
8. 🧑‍💼 Custom Characters
9. 🔔 Priority Support

### Pricing
- **Monthly**: $9.99/month (Most Flexible badge)
- **Annual**: $79.99/year (Best Value badge 🏆)
  - Shows as $6.67/month
  - "Save 33%" badge
  - "Save $40/year" text
  - **Pre-selected by default**

### Free Trial
- **Duration**: 7 days
- **CTA**: "Start Free Trial"
- **Disclaimer**: "Free for 7 days, then {{price}} per {{period}}. Cancel anytime."

---

## 🧪 Testing

### 1. Preview in Dashboard
- Click **Preview** in RevenueCat paywall editor
- View on iPhone SE, iPhone 15, iPad
- Test light/dark mode

### 2. Sandbox Testing (iOS)

```bash
# 1. Create sandbox tester in App Store Connect
# 2. Build app on device
# 3. Sign in with sandbox account in Settings > App Store
# 4. Trigger paywall in app
# 5. Complete purchase with sandbox credentials
```

### 3. Verify Entitlement

```javascript
// Check in app
const status = await revenueCatService.getSubscriptionStatus();
console.log('Subscription:', status.tier); // 'free' or 'pro'
```

---

## 📊 Success Metrics

Track these in RevenueCat dashboard:

| Metric | Goal |
|--------|------|
| Conversion Rate | 5-10% |
| Trial-to-Paid | 40-60% |
| Annual Preference | 70%+ |
| Avg Revenue Per User | Monitor |

---

## 🌍 Localization

Spanish translation is ready to use:

| English | Spanish |
|---------|---------|
| Unlock Kiwi Pro | Desbloquea Kiwi Pro |
| Start Free Trial | Comenzar Prueba Gratis |
| Choose Your Plan | Elige Tu Plan |
| Restore Purchases | Restaurar Compras |

Full translations available in `paywall-dashboard-config.json`.

---

## 🎯 A/B Test Variants

Three audience-targeted variants ready:

### Variant A: New Users (0-7 days)
- Title: "Try Kiwi Pro Free"
- Subtitle: "7 days free, then unlock unlimited AAC features"
- CTA: "Start Free Trial Now"

### Variant B: Engaged Users (7+ days, 5+ sessions)
- Title: "Save 33% with Annual Plan"
- Subtitle: "Get unlimited features for less than $7/month"
- Emphasis: Annual package

### Variant C: Users at Free Limit (50+ words)
- Title: "Go Unlimited"
- Subtitle: "Break free from limits. Unlimited vocabulary, photos, and profiles."
- Emphasis: Unlimited Vocabulary feature

---

## ✅ Launch Checklist

### Backend Configuration
- [ ] Products created (kiwi_monthly, kiwi_annual)
- [ ] Entitlement created (pro)
- [ ] Offering created (default)
- [ ] Packages added to offering

### Paywall Design
- [ ] Paywall created in dashboard
- [ ] Set as default paywall
- [ ] Header configured (icon, title, subtitle)
- [ ] All 9 features added with correct text
- [ ] Features 1 & 2 highlighted
- [ ] Social proof added (rating, user count)
- [ ] Monthly package configured
- [ ] Annual package configured (default, highlighted)
- [ ] 7-day free trial enabled
- [ ] CTA buttons styled (Kiwi Teal + iOS Blue)
- [ ] Legal links added (terms, privacy, support)
- [ ] Disclaimer text added
- [ ] Colors match Kiwi brand
- [ ] Typography set (SF Pro)

### Testing
- [ ] Previewed on iPhone/iPad
- [ ] Tested in sandbox mode
- [ ] Verified entitlement grants correctly
- [ ] Tested restore purchases
- [ ] Checked analytics tracking

### App Store / Play Store
- [ ] Products created in App Store Connect
- [ ] Products created in Google Play Console
- [ ] Pricing configured ($9.99, $79.99)
- [ ] Free trial configured (7 days)
- [ ] Screenshots updated (show Pro features)

### Optional
- [ ] Spanish localization added
- [ ] A/B test variants created
- [ ] Custom audiences configured

---

## 🛠️ Troubleshooting

### Paywall Not Showing
1. Check RevenueCat is initialized: `revenueCatService.isInitialized`
2. Verify API keys in environment variables
3. Check offerings are loaded: `revenueCatService.offerings`
4. Look for errors in console

### Purchase Not Working
1. Verify products exist in App Store Connect / Google Play
2. Check product IDs match exactly: `kiwi_monthly`, `kiwi_annual`
3. Ensure products are approved and available
4. Test with sandbox account, not production

### Entitlement Not Granted
1. Check entitlement ID is `pro` (lowercase)
2. Verify products are attached to entitlement
3. Refresh customer info: `revenueCatService.refreshCustomerInfo()`
4. Check RevenueCat dashboard for customer status

---

## 📞 Support Resources

**RevenueCat:**
- Dashboard: https://app.revenuecat.com
- Docs: https://www.revenuecat.com/docs
- Paywalls Guide: https://www.revenuecat.com/docs/paywalls

**Kiwi AAC Files:**
- Service: `src/services/RevenueCatService.js`
- Plugin: `src/plugins/revenuecat.ts`
- Triggers: `src/utils/paywall.js`
- Config: `paywall-dashboard-config.json`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Your paywall is professionally designed, optimized for conversions, and ready to turn free users into Kiwi Pro subscribers.

**Next Step**: Run `./scripts/setup-revenuecat.sh` to create the backend infrastructure, then configure the visual paywall in the RevenueCat dashboard using `FIRST-KIWI-PAYWALL-CONFIG.md` as your guide.

Good luck with your launch! 🥝🚀
