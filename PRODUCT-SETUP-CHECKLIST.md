# RevenueCat Product Setup Checklist

## ✅ Programmatic Setup (DONE)

These items have been completed programmatically:

- ✅ RevenueCat SDK installed and configured
- ✅ Plugin wrapper with UI support created
- ✅ Service layer implemented
- ✅ Paywall integration points added
- ✅ Customer Center integrated
- ✅ Environment variables configured
- ✅ Paywall configuration JSON created
- ✅ Product identifiers standardized

---

## 📋 Manual Steps Required (DO THESE)

### STEP 1: App Store Connect (iOS) - 15 minutes

**Login:** https://appstoreconnect.apple.com

1. **Navigate to your app:**
   - My Apps → Kiwi Voice → Features → In-App Purchases

2. **Create Subscription Group:**
   - Click "+" next to Subscription Groups
   - **Subscription Group Name:** `Kiwi Pro`
   - **Subscription Group Reference Name:** `kiwi_pro_group`
   - Save

3. **Create Product 1 - Monthly:**
   - Click "+" to add new subscription
   - **Type:** Auto-Renewable Subscription
   - **Product ID:** `kiwi_monthly`
   - **Subscription Group:** Kiwi Pro (select the one you just created)
   - **Subscription Duration:** 1 Month
   - Click "Create"

   **Pricing:**
   - Click "Add Pricing"
   - **Price:** $4.99 USD
   - Select other countries (auto-convert) or set manually
   - Save

   **Subscription Display Name:** (for each language)
   - English (US): "Monthly Subscription"
   - Description: "Full access to all premium features"

   **Review Information:**
   - Screenshot: Upload app screenshot (required for review)
   - Review Notes: "Premium subscription for Kiwi Voice AAC app"
   - Save

4. **Create Product 2 - Annual:**
   - Click "+" again
   - **Type:** Auto-Renewable Subscription
   - **Product ID:** `kiwi_annual`
   - **Subscription Group:** Kiwi Pro (same group!)
   - **Subscription Duration:** 1 Year
   - Click "Create"

   **Pricing:**
   - **Price:** $39.99 USD (30% savings vs monthly)
   - Select other countries
   - Save

   **Subscription Display Name:**
   - English (US): "Annual Subscription"
   - Description: "Full access to all premium features - Best Value!"

   **Review Information:**
   - Screenshot: Same as monthly
   - Review Notes: "Annual subscription option"
   - Save

5. **Submit for Review:**
   - Select both subscriptions
   - Click "Submit for Review"
   - Wait for Apple approval (usually 24-48 hours)

**✅ Checklist:**
- [ ] Subscription group "Kiwi Pro" created
- [ ] Product `kiwi_monthly` created with correct ID
- [ ] Product `kiwi_annual` created with correct ID
- [ ] Pricing set for both products
- [ ] Descriptions added
- [ ] Screenshots uploaded
- [ ] Both products submitted for review

---

### STEP 2: Google Play Console (Android) - 15 minutes

**Login:** https://play.google.com/console

1. **Navigate to your app:**
   - All apps → Kiwi Voice → Monetize → Subscriptions

2. **Create Product 1 - Monthly:**
   - Click "Create subscription"
   - **Product ID:** `kiwi_monthly` (MUST match iOS)
   - **Name:** Kiwi Pro Monthly
   - **Description:** Full access to all premium features

   **Pricing:**
   - Click "Set price"
   - **Billing period:** Every 1 month
   - **Base plan price:** $4.99 USD
   - **Trial period:** None (or add 7-day free trial if desired)
   - Click "Add base plan"

   **Benefits:**
   - Add benefit: "Unlimited AAC icons and vocabulary"
   - Add benefit: "Premium color themes"
   - Add benefit: "Multi-profile support"
   - Add benefit: "Priority support"

   - Click "Activate" (top right)

3. **Create Product 2 - Annual:**
   - Click "Create subscription"
   - **Product ID:** `kiwi_annual` (MUST match iOS)
   - **Name:** Kiwi Pro Annual
   - **Description:** Full access to all premium features - Best Value!

   **Pricing:**
   - **Billing period:** Every 12 months
   - **Base plan price:** $39.99 USD
   - **Save:** Shows as 33% savings
   - Click "Add base plan"

   **Benefits:** (same as monthly)
   - Unlimited AAC icons and vocabulary
   - Premium color themes
   - Multi-profile support
   - Priority support

   - Click "Activate"

4. **Review Status:**
   - Check that both subscriptions show "Active"
   - May take a few hours to propagate

**✅ Checklist:**
- [ ] Product `kiwi_monthly` created and active
- [ ] Product `kiwi_annual` created and active
- [ ] Pricing matches iOS (for consistency)
- [ ] Benefits/features listed
- [ ] Both products are "Active" status

---

### STEP 3: RevenueCat Dashboard Setup - 10 minutes

**Login:** https://app.revenuecat.com

#### A. Link Store Credentials

1. **iOS Configuration:**
   - Projects → [Your Project] → App Settings → iOS
   - Click "Configure"
   - **Bundle ID:** com.yourcompany.kiwi (your actual bundle ID)
   - **App Store Connect:**
     - **Shared Secret:** Get from App Store Connect → My Apps → Kiwi Voice → App Information → App-Specific Shared Secret
     - Copy and paste into RevenueCat
   - **App Store Connect API:**
     - Generate API key in App Store Connect → Users and Access → Keys → In-App Purchase
     - Download .p8 file
     - Copy Issuer ID and Key ID
     - Upload to RevenueCat
   - Click "Save"

2. **Android Configuration:**
   - Projects → [Your Project] → App Settings → Android
   - Click "Configure"
   - **Package name:** com.yourcompany.kiwi (your actual package)
   - **Service Account:**
     - Go to Google Cloud Console
     - Create service account with "Monetization" role
     - Download JSON key file
     - Upload to RevenueCat
   - Click "Save"

#### B. Create Products in RevenueCat

1. **Go to:** Products tab
2. **Click:** "+ New Product"

**Product 1 - Monthly:**
- **Product identifier:** `kiwi_monthly`
- **Type:** Subscription
- **Store-specific IDs:**
  - iOS: `kiwi_monthly` (from App Store Connect)
  - Android: `kiwi_monthly` (from Google Play)
- Click "Save"

**Product 2 - Annual:**
- **Product identifier:** `kiwi_annual`
- **Type:** Subscription
- **Store-specific IDs:**
  - iOS: `kiwi_annual`
  - Android: `kiwi_annual`
- Click "Save"

**✅ Checklist:**
- [ ] iOS credentials linked
- [ ] Android credentials linked
- [ ] Product `kiwi_monthly` created in RevenueCat
- [ ] Product `kiwi_annual` created in RevenueCat
- [ ] Store IDs match exactly

#### C. Create Entitlement

1. **Go to:** Entitlements tab
2. **Click:** "+ New Entitlement"
3. **Configure:**
   - **Identifier:** `pro` (CRITICAL - must match code)
   - **Display name:** Pro
   - **Description:** Unlocks all premium features
4. **Attached Products:**
   - Click "Attach Products"
   - Select BOTH: `kiwi_monthly` AND `kiwi_annual`
   - Click "Save"

**✅ Checklist:**
- [ ] Entitlement "pro" created
- [ ] Both products attached to entitlement
- [ ] Identifier is exactly "pro" (lowercase)

#### D. Create Offering

1. **Go to:** Offerings tab
2. **Click:** "+ New Offering"
3. **Configure:**
   - **Identifier:** `default`
   - **Display name:** Default Offering
   - **Description:** Main offering for Kiwi Pro
   - **Make this the current offering:** ✅ CHECK THIS!
4. **Add Packages:**

   **Package 1 - Annual (First/Default):**
   - Click "+ Add Package"
   - **Identifier:** `$rc_annual`
   - **Product:** Select `kiwi_annual`
   - Click "Add"

   **Package 2 - Monthly:**
   - Click "+ Add Package"
   - **Identifier:** `$rc_monthly`
   - **Product:** Select `kiwi_monthly`
   - Click "Add"

5. **Reorder Packages:**
   - Drag `$rc_annual` to position 1 (top)
   - `$rc_monthly` should be position 2
   - This makes annual the default selection

6. **Click "Save"**

**✅ Checklist:**
- [ ] Offering "default" created
- [ ] Set as "current offering"
- [ ] Package `$rc_annual` added (position 1)
- [ ] Package `$rc_monthly` added (position 2)
- [ ] Offering is published

---

### STEP 4: Create Paywall in Paywall Builder - 10 minutes

1. **Go to:** Paywalls tab in RevenueCat Dashboard
2. **Click:** "+ Create Paywall"
3. **Choose Template:** Select "Multi-Package Template" or similar

#### Upload Configuration

**Option A: Use Paywall Builder UI**
1. Click "Design" tab
2. Configure each section:

**Header:**
- Title: "Unlock access to all recipes"
- No subtitle
- Font: System Bold, 28pt
- Color: #1A1A1A

**Feature List:** Add 4 features
1. Icon: 🥗 | Text: "Healthy recipes, specially curated"
2. Icon: 👥 | Text: "A welcoming cooking community"
3. Icon: ✨ | Text: "New recipe recommendations"
4. Icon: ⚡ | Text: "Priority support"

**Packages:**
- Link to offering: `default`
- Annual package:
  - Badge: "SAVE 30%"
  - Highlight: True
  - Border color: #007AFF
- Monthly package:
  - No badge
  - Normal appearance

**Call to Action:**
- Primary button text: "Continue in-app"
- Secondary text: "Or, save 30%"
- Button color: #007AFF

**Footer:**
- Show restore purchases: Yes
- Terms URL: https://kiwi-aac.netlify.app/terms.html
- Privacy URL: https://kiwi-aac.netlify.app/privacy.html

**Option B: Import JSON**
1. Click "JSON" or "Advanced" tab
2. Copy contents from `revenuecat-paywall-config.json`
3. Paste into editor
4. Click "Save"

5. **Preview:**
   - Click "Preview" button
   - Test on iOS/Android device using RevenueCat app
   - OR use preview URL in your app

6. **Publish:**
   - Click "Publish"
   - Select "default" offering
   - Click "Publish Paywall"

**✅ Checklist:**
- [ ] Paywall created with correct template
- [ ] Title and features configured
- [ ] Both packages display correctly
- [ ] "Save 30%" badge on annual
- [ ] Preview looks good
- [ ] Paywall published

---

### STEP 5: Environment Variables - 2 minutes

Already set up in code, but verify:

**File: `.env` (create if doesn't exist)**

```bash
# RevenueCat API Key (Production)
# Get this from: RevenueCat Dashboard → Project Settings → API Keys
VITE_REVENUECAT_API_KEY=test_GVsVAPHELhFcgnBFbWlVyrYGiUS

# For production, replace with:
# VITE_REVENUECAT_API_KEY=your_production_api_key_here
```

**✅ Checklist:**
- [ ] `.env` file exists
- [ ] Variable name is `VITE_REVENUECAT_API_KEY`
- [ ] Currently using test key for development
- [ ] Know where to get production key (Project Settings → API Keys)

---

### STEP 6: Testing - 20 minutes

#### Sandbox Testing (iOS)

1. **Create Sandbox Account:**
   - App Store Connect → Users and Access → Sandbox Testers
   - Click "+"
   - Create test account with unique email
   - Remember password

2. **On iOS Device:**
   - Settings → App Store → Sandbox Account
   - Sign in with test account
   - Run your app from Xcode

3. **Test Flow:**
   - Try to add 51st icon
   - Paywall should appear
   - Tap annual package
   - Tap "Continue in-app"
   - Complete purchase with Face ID/Touch ID
   - Should grant access immediately
   - Restart app → Access should persist

4. **Test Restore:**
   - Delete app
   - Reinstall
   - Try premium feature → Paywall appears
   - Tap "Restore Purchases"
   - Access should restore

#### Test Accounts (Android)

1. **Add License Testers:**
   - Google Play Console → Setup → License Testing
   - Add your Google account email
   - Save

2. **On Android Device:**
   - Must use account added to license testers
   - Run app from Android Studio

3. **Test Flow:** (same as iOS)

**✅ Testing Checklist:**
- [ ] Sandbox account created (iOS)
- [ ] Test account added (Android)
- [ ] Paywall displays correctly
- [ ] Both packages show with correct pricing
- [ ] Can complete purchase
- [ ] Access granted after purchase
- [ ] Access persists after app restart
- [ ] Restore purchases works
- [ ] Customer Center opens and displays subscription

---

### STEP 7: Production Deployment

**Before submitting to stores:**

1. **Replace Test API Key:**
   - RevenueCat Dashboard → Project Settings → API Keys
   - Copy PRODUCTION key (starts with `appl_` for iOS or `goog_` for Android, or universal key)
   - Update `.env`:
     ```bash
     VITE_REVENUECAT_API_KEY=your_production_key_here
     ```

2. **Build Production:**
   ```bash
   npm run build
   npx cap sync
   ```

3. **Verify Integration:**
   - Products show in RevenueCat Dashboard
   - Offerings are "current"
   - Paywall is published
   - Store credentials are linked

4. **Submit to Stores:**
   - iOS: Upload to App Store Connect → TestFlight → Production
   - Android: Upload to Google Play Console → Production

**✅ Production Checklist:**
- [ ] Production API key configured
- [ ] Test purchases work in TestFlight/Internal Testing
- [ ] Paywall displays on production build
- [ ] Subscriptions auto-renew correctly
- [ ] Analytics showing in RevenueCat Dashboard
- [ ] App submitted and approved

---

## 🎯 Quick Summary: What You Need To Do

**Required Actions (in order):**

1. ⏱️ **15 min** - Create 2 products in App Store Connect (`kiwi_monthly`, `kiwi_annual`)
2. ⏱️ **15 min** - Create 2 products in Google Play Console (same IDs)
3. ⏱️ **10 min** - Link stores to RevenueCat Dashboard
4. ⏱️ **5 min** - Create products in RevenueCat (same IDs)
5. ⏱️ **2 min** - Create "pro" entitlement, attach both products
6. ⏱️ **3 min** - Create "default" offering with 2 packages
7. ⏱️ **10 min** - Design paywall in Paywall Builder
8. ⏱️ **20 min** - Test on devices
9. ⏱️ **5 min** - Replace test API key with production key
10. ⏱️ **Submit** - Upload to App Store & Google Play

**Total Time: ~85 minutes (1.5 hours)**

---

## 📞 Need Help?

**RevenueCat Support:**
- Dashboard: https://app.revenuecat.com
- Docs: https://www.revenuecat.com/docs
- Community: https://community.revenuecat.com
- Email: support@revenuecat.com

**Apple Support:**
- App Store Connect Help: https://developer.apple.com/contact/

**Google Support:**
- Play Console Help: https://support.google.com/googleplay/android-developer

---

## ✅ Completion

Once all steps are complete, your RevenueCat integration will be fully operational!

**You'll have:**
- ✅ Native paywalls automatically appearing when users hit limits
- ✅ Beautiful subscription UI (no coding needed to update)
- ✅ Customer Center for subscription management
- ✅ Restore purchases working
- ✅ Analytics tracking in RevenueCat Dashboard
- ✅ Production-ready monetization

**🎉 Congrats! You're ready to monetize! 🚀**
