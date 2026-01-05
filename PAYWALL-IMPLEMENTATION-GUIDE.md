# Kiwi AAC Paywall - Implementation Guide

## 🎨 Visual Mockup

```
╔═══════════════════════════════════════════╗
║                                           ║
║              🥝 (80px icon)               ║
║                                           ║
║         Unlock Kiwi Pro                   ║
║                                           ║
║   Empower unlimited communication with    ║
║      premium AAC features                 ║
║                                           ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ✨ Unlimited Vocabulary                  ║
║     Break free from the 50-word limit.    ║
║     Add unlimited buttons and folders.    ║
║                                           ║
║  🎙️ Premium Voice Quality                 ║
║     Enhanced, natural-sounding voices     ║
║     for clearer communication.            ║
║                                           ║
║  👥 Multiple User Profiles                ║
║     Perfect for families, schools,        ║
║     and clinics. Unlimited profiles.      ║
║                                           ║
║  ☁️ Cloud Backup & Sync                   ║
║     Never lose your vocabulary.           ║
║     Auto backup across all devices.       ║
║                                           ║
║  📊 Advanced Analytics                    ║
║     Track communication progress with     ║
║     detailed insights and reports.        ║
║                                           ║
║  🎨 Premium Themes                        ║
║     Ocean, Sunset, Forest, Berry,         ║
║     and Candy color themes.               ║
║                                           ║
║  📸 Unlimited Photos                      ║
║     Add unlimited custom photos from      ║
║     your camera roll or albums.           ║
║                                           ║
║  🧑‍💼 Custom Characters                    ║
║     Create unlimited personalized         ║
║     avatars for your Circle of Support.   ║
║                                           ║
║  🔔 Priority Support                      ║
║     Fast, dedicated help from our         ║
║     AAC specialists anytime.              ║
║                                           ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ⭐⭐⭐⭐⭐ 4.9 out of 5 stars               ║
║  Join 10,000+ AAC users worldwide         ║
║                                           ║
╠═══════════════════════════════════════════╣
║                                           ║
║         Choose Your Plan                  ║
║                                           ║
║  ┌─────────────┬───────────────────────┐ ║
║  │   Monthly   │      Annual           │ ║
║  │             │    [BEST VALUE] 🏆    │ ║
║  │             │                       │ ║
║  │   $9.99     │      $79.99          │ ║
║  │ per month   │     per year         │ ║
║  │             │   ($6.67/month)      │ ║
║  │             │    Save 33%          │ ║
║  │             │   Save $40/year      │ ║
║  │             │                       │ ║
║  │ [Select]    │   [✓ Selected]       │ ║
║  └─────────────┴───────────────────────┘ ║
║                                           ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │   Start 7-Day Free Trial →          │ ║
║  │   (Primary Button - Kiwi Teal)      │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  Free for 7 days, then $79.99 per year.  ║
║  Cancel anytime.                          ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │   Restore Purchases                  │ ║
║  │   (Secondary Button - iOS Blue)      │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Terms • Privacy • Support                ║
║                                           ║
║  Subscription auto-renews unless          ║
║  cancelled 24h before period ends.        ║
║  Manage in Settings.                      ║
║                                           ║
╚═══════════════════════════════════════════╝
```

## 📋 Implementation Steps

### Step 1: Upload to RevenueCat Dashboard

1. **Log into RevenueCat Dashboard**
   - Go to https://app.revenuecat.com
   - Select Kiwi AAC project

2. **Navigate to Paywalls**
   - Click "Paywalls" in left sidebar
   - Click "Create Paywall" button

3. **Import Configuration**
   - Use the JSON from `kiwi-paywall-config.json`
   - Or manually configure using the visual editor

### Step 2: Configure Header

**Icon:**
- Upload Kiwi logo (80x80px, transparent background)
- Or use emoji: 🥝

**Title:**
```
Unlock Kiwi Pro
```

**Subtitle:**
```
Empower unlimited communication with premium AAC features
```

**Colors:**
- Title: #2D3436 (Dark gray)
- Subtitle: #6C757D (Medium gray)
- Background: Linear gradient #FFFFFF → #F8F9FA

### Step 3: Add Features List

Copy these 9 features with exact text and emojis:

#### Feature 1 (Highlighted)
- Icon: ✨
- Title: **Unlimited Vocabulary**
- Description: Break free from the 50-word limit. Add unlimited custom buttons and folders.

#### Feature 2 (Highlighted)
- Icon: 🎙️
- Title: **Premium Voice Quality**
- Description: Access enhanced, natural-sounding voices for clearer communication.

#### Feature 3
- Icon: 👥
- Title: **Multiple User Profiles**
- Description: Perfect for families, schools, and clinics. Unlimited profiles with personalized settings.

#### Feature 4
- Icon: ☁️
- Title: **Cloud Backup & Sync**
- Description: Never lose your vocabulary. Automatic backup and sync across all devices.

#### Feature 5
- Icon: 📊
- Title: **Advanced Analytics**
- Description: Track communication progress with detailed insights and usage reports.

#### Feature 6
- Icon: 🎨
- Title: **Premium Themes**
- Description: Personalize your experience with Ocean, Sunset, Forest, Berry, and Candy themes.

#### Feature 7
- Icon: 📸
- Title: **Unlimited Photos**
- Description: Add unlimited custom photos from your camera roll or family albums.

#### Feature 8
- Icon: 🧑‍💼
- Title: **Custom Characters**
- Description: Create unlimited personalized avatars for your Circle of Support.

#### Feature 9
- Icon: 🔔
- Title: **Priority Support**
- Description: Get fast, dedicated help from our AAC specialists whenever you need it.

### Step 4: Add Social Proof

**Text:**
```
Join 10,000+ AAC users worldwide
```

**Rating:**
```
⭐⭐⭐⭐⭐ 4.9 out of 5 stars
```

### Step 5: Configure Pricing

#### Package 1: Monthly
- **Product ID:** `kiwi_monthly`
- **Badge:** "Most Flexible" (Blue #007AFF)
- **Price:** $9.99
- **Period:** per month
- **Description:** Cancel anytime
- **Default:** No

#### Package 2: Annual (Recommended)
- **Product ID:** `kiwi_annual`
- **Badge:** "Best Value" 🏆 (Green #22C55E)
- **Price:** $79.99
- **Period:** per year
- **Price per month:** $6.67/month
- **Savings:** Save 33%
- **Savings amount:** Save $40/year
- **Description:** Best value for families
- **Default:** Yes (pre-selected)
- **Highlighted:** Yes

### Step 6: Configure Free Trial

- **Enabled:** Yes
- **Duration:** 7 days
- **CTA Text:** "Start 7-Day Free Trial"
- **Disclaimer:** "Free for 7 days, then {{price}} per {{period}}. Cancel anytime."

### Step 7: Configure Buttons

#### Primary Button
- **Text:** "Start Free Trial"
- **Background:** #1A535C (Kiwi Teal)
- **Text Color:** #FFFFFF (White)
- **Corner Radius:** 12px
- **Height:** 56px
- **Shadow:** Yes

#### Secondary Button
- **Text:** "Restore Purchases"
- **Background:** Transparent
- **Text Color:** #007AFF (iOS Blue)
- **Border:** 2px solid #007AFF
- **Corner Radius:** 12px
- **Height:** 44px

### Step 8: Add Footer Links

**Legal Links:**
- Terms of Service: `https://kiwivoiceapp.com/terms`
- Privacy Policy: `https://kiwivoiceapp.com/privacy`
- Support: `mailto:support@kiwivoiceapp.com`

**Disclaimer:**
```
Subscription automatically renews unless cancelled at least 24 hours before
the end of the current period. Manage subscriptions in Settings.
```

### Step 9: Configure Design

**Colors:**
- Primary: #1A535C (Kiwi Teal)
- Accent: #007AFF (iOS Blue)
- Background: #FFFFFF (White)
- Text Primary: #2D3436 (Dark Gray)
- Text Secondary: #6C757D (Medium Gray)
- Success: #22C55E (Green)
- Card Background: #F8F9FA (Light Gray)

**Typography:**
- Font: SF Pro (iOS default)
- Title: 28pt, Bold
- Subtitle: 17pt, Regular
- Body: 15pt, Regular
- Caption: 13pt, Regular

**Spacing:**
- Padding: 24px
- Item Spacing: 16px
- Section Spacing: 32px
- Corner Radius: 16px

### Step 10: Add Localization (Optional)

**Spanish (es) Translation:**

Title: "Desbloquea Kiwi Pro"
Subtitle: "Potencia la comunicación ilimitada con funciones AAC premium"

Features: See `kiwi-paywall-config.json` for full translations

## 🧪 Testing Your Paywall

### Preview in Dashboard
1. Click "Preview" button in paywall editor
2. View on iPhone, iPad sizes
3. Test light/dark mode
4. Check all text fits properly

### Test in App (Sandbox)
1. Build app on device
2. Set up sandbox tester account
3. Trigger paywall (try color theme)
4. Complete purchase with sandbox account
5. Verify entitlement granted

### A/B Test Variants

#### Variant A: Emphasis on Free Trial
- Title: "Try Kiwi Pro Free"
- Subtitle: "7 days free, then unlock unlimited AAC features"
- CTA: "Start Free Trial Now"

#### Variant B: Emphasis on Value
- Title: "Save 33% with Annual Plan"
- Subtitle: "Get unlimited features for less than $7/month"
- Highlight: Annual package

#### Variant C: Emphasis on Unlimited
- Title: "Go Unlimited"
- Subtitle: "Break free from limits. Unlimited vocabulary, photos, and profiles."
- Highlight: Unlimited Vocabulary feature

## 📊 Success Metrics

**Track these metrics in RevenueCat:**
- Paywall impressions
- Conversion rate
- Trial starts
- Trial conversions
- Revenue per user
- Churn rate

**Goals:**
- Conversion rate: 5-10%
- Trial-to-paid: 40-60%
- Annual vs Monthly: 70% annual preferred

## 🎯 Optimization Tips

### 1. Messaging
- Focus on "unlimited" and "freedom" language
- Emphasize communication empowerment
- Use AAC-specific terminology families understand

### 2. Pricing Psychology
- Default to annual (better value, higher LTV)
- Show monthly price for annual ($6.67/month)
- Emphasize savings (33%, $40/year)

### 3. Social Proof
- Update user count regularly
- Add testimonials from real AAC families
- Show app store rating prominently

### 4. Urgency (Optional)
- Limited-time intro pricing
- Special pricing for early adopters
- Season-specific promotions

## 📱 Platform-Specific Notes

### iOS
- Follow App Store guidelines
- Include "Restore Purchases" button
- Use SF Pro font
- Support Family Sharing (if applicable)

### Android
- Follow Google Play guidelines
- Support subscriptions v5 API
- Handle pending purchases
- Test on various Android versions

## 🚀 Launch Checklist

- [ ] Paywall created in RevenueCat dashboard
- [ ] All 9 features added with correct text/emojis
- [ ] Pricing configured (monthly + annual)
- [ ] Free trial enabled (7 days)
- [ ] Colors match Kiwi brand (#1A535C)
- [ ] Legal links added (terms, privacy, support)
- [ ] Preview on iPhone/iPad sizes
- [ ] Test in sandbox mode
- [ ] Verify entitlements grant correctly
- [ ] A/B test variants created
- [ ] Analytics tracking enabled
- [ ] Launch to production

## 📞 Need Help?

**RevenueCat Support:**
- Docs: https://www.revenuecat.com/docs
- Community: https://community.revenuecat.com

**Implementation Files:**
- Config: `kiwi-paywall-config.json`
- Service: `src/services/RevenueCatService.js`
- Triggers: `src/utils/paywall.js`

Your paywall is ready to launch! 🎉
