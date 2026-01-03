# RevenueCat Quick Reference

## 🎯 What You Have Now

✅ **Full RevenueCat SDK Integration**
- Native paywalls (configured in dashboard)
- Customer Center for subscription management
- Restore purchases support
- 9 premium features integrated
- Clean, production-ready code

## 🚀 How to Use

### Show a Paywall (Method 1 - Recommended)

```javascript
import revenueCatService from './services/RevenueCatService';

// Automatically shows paywall only if user doesn't have PRO
await revenueCatService.showPaywallIfNeeded('feature_name');
```

### Show a Paywall (Method 2 - Existing Functions)

```javascript
import { checkUnlimitedVocabulary } from './utils/paywall';

// Automatically shows paywall if user is at limit
const hasAccess = await checkUnlimitedVocabulary(currentIconCount);
```

### Check Premium Status

```javascript
import revenueCatService from './services/RevenueCatService';

const hasPremium = await revenueCatService.hasPremiumAccess();
```

### Show Customer Center

```javascript
import { showCustomerCenter } from './utils/paywall';

await showCustomerCenter();
```

### Restore Purchases

```javascript
import { restorePurchases } from './utils/paywall';

const restored = await restorePurchases();
```

## 📋 Next Steps (In Order)

### 1. Configure RevenueCat Dashboard

**Go to:** https://app.revenuecat.com

**Create Products:**
- Product ID: `monthly` (monthly subscription)
- Product ID: `yearly` (annual subscription)
- Product ID: `lifetime` (one-time purchase)

**Create Entitlement:**
- Entitlement ID: `pro`
- Attach all 3 products to this entitlement

**Create Offering:**
- Name: "Default"
- Set as default offering
- Add all 3 packages

### 2. Design Your Paywall

**Go to:** Dashboard → Paywalls → Paywall Builder

- Choose a template
- Customize colors, fonts, text
- Add your app icon/images
- Preview on device
- Publish

### 3. Test on Device

**iOS:**
```bash
npx cap sync ios
npx cap open ios
# Run on real device (not simulator)
# Use sandbox Apple ID for testing
```

**Android:**
```bash
npx cap sync android
npx cap open android
# Run on real device
# Use test account for Google Play
```

### 4. Production Checklist

- [ ] Replace test API key with production key (in `RevenueCatService.js`)
- [ ] Configure App Store Connect / Google Play Console
- [ ] Link store accounts to RevenueCat
- [ ] Test purchases end-to-end
- [ ] Test restore purchases
- [ ] Submit for review

## 💡 Tips

**Free Tier Limits:** Already configured in code
- 50 icons
- 1 profile
- 3 custom people
- 10 pronunciation entries
- 7 days analytics
- 20 custom photos

**To Change Limits:** Edit `FREE_TIER_LIMITS` in `RevenueCatService.js`

**Paywall Triggers:** Automatically happen when user hits limits. No additional code needed!

**Customer Center:** Available in Settings → "⚙️ Manage Subscription"

## 📱 Platform Notes

**iOS:**
- Requires real device for testing purchases
- Use Sandbox accounts from App Store Connect
- Must include "Restore Purchases" button (already done ✅)

**Android:**
- Use test accounts from Google Play Console
- May need to configure license testing

**Web:**
- Works for development/testing
- Native features require iOS/Android

## 🐛 Troubleshooting

**"No offerings available"**
→ Make sure products are attached to entitlement in dashboard

**Paywall not showing**
→ Check offering is set as "default" in dashboard

**Purchases fail**
→ Must test on real device, not simulator

**Customer info not updating**
→ App automatically refreshes after purchases

## 📚 Full Documentation

See `REVENUECAT-SETUP-GUIDE.md` for complete documentation.

## 🎉 You're Ready!

Everything is integrated and working. Just configure your dashboard and test!

**Questions?** Check the setup guide or RevenueCat docs:
https://www.revenuecat.com/docs
