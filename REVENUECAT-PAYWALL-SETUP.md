# RevenueCat Paywall Setup Guide

## ✅ SDK Already Installed

Your app already has the latest RevenueCat Paywalls SDK integrated:
- `@revenuecat/purchases-capacitor`: v12.0.1
- `@revenuecat/purchases-capacitor-ui`: v12.0.1

## 🎨 Configure Paywall in RevenueCat Dashboard

The new RevenueCat Paywalls UI allows you to design your entire paywall in the dashboard without code changes.

### Step 1: Access Paywalls

1. Go to https://app.revenuecat.com
2. Select your Kiwi AAC project
3. Navigate to **Paywalls** in the left sidebar
4. Click **Create Paywall**

### Step 2: Configure Paywall Content

#### **Header Section**
- **Title**: "Unlock Kiwi Pro"
- **Subtitle**: "Unlimited vocabulary, premium voices, and advanced features"
- **Image**: Upload Kiwi logo or hero image

#### **Features List** (What's included)
Add these features with checkmarks:
- ✅ Unlimited vocabulary (50+ → unlimited)
- ✅ Premium voice quality
- ✅ Multiple user profiles
- ✅ Cloud backup & sync
- ✅ Advanced analytics
- ✅ Custom themes
- ✅ Unlimited custom photos
- ✅ Priority support

#### **Pricing Section**
Configure your subscription tiers:

**Monthly Plan:**
- Product ID: `kiwi_monthly`
- Price: $9.99/month
- Badge: "Most Flexible"

**Yearly Plan:**
- Product ID: `kiwi_annual`
- Price: $79.99/year ($6.67/month)
- Badge: "Best Value" (Popular badge)
- Show savings: "Save 33%"

### Step 3: Design Customization

#### **Color Scheme**
- Primary Color: `#1A535C` (Kiwi teal)
- Accent Color: `#007AFF` (iOS blue)
- Background: `#FFFFFF` (White)
- Text: `#2D3436` (Dark gray)

#### **Typography**
- Font Family: SF Pro (iOS default)
- Title Size: Large
- Subtitle Size: Medium
- Body Text: Regular

#### **Button Styles**
- Call-to-Action Button: "Start Free Trial"
- Secondary Button: "Restore Purchases"
- Button Style: Rounded, filled
- Button Color: Primary color

### Step 4: Legal & Footer

Add required legal links:
- Terms of Service: `https://kiwivoiceapp.com/terms`
- Privacy Policy: `https://kiwivoiceapp.com/privacy`
- Support: `mailto:support@kiwivoiceapp.com`

### Step 5: Free Trial Configuration

Configure trial period:
- **Trial Duration**: 7 days
- **Trial Text**: "Start your 7-day free trial"
- **After Trial**: Automatically converts to paid subscription
- **Cancellation**: "Cancel anytime in Settings"

### Step 6: Offerings Setup

#### Default Offering
Name: "default"
Description: "Standard subscription options"

**Packages in Offering:**
1. Monthly Package (`$rc_monthly`)
   - Product: `kiwi_monthly`
   - Identifier: `$rc_monthly`

2. Annual Package (`$rc_annual`)
   - Product: `kiwi_annual`
   - Identifier: `$rc_annual`
   - Mark as "Best Value"

### Step 7: Entitlements

Configure your PRO entitlement:

**Entitlement ID**: `pro`
**Description**: "Access to all premium features"

**Attached Products:**
- `kiwi_monthly` → grants `pro` entitlement
- `kiwi_annual` → grants `pro` entitlement

## 📱 Test Your Paywall

### Option 1: Preview in Dashboard
1. In the Paywalls section, click **Preview**
2. View on different device sizes (iPhone, iPad)
3. Test light/dark mode appearance

### Option 2: Test in App (iOS)
1. Build and run your app on a physical device or simulator
2. Trigger a premium feature (e.g., try to change color theme)
3. Paywall should appear automatically

### Option 3: Use Test Users
1. In RevenueCat dashboard, go to **Customers**
2. Create a test user with your Apple ID email
3. Grant test entitlements to test premium features

## 🧪 Testing Purchases

### Sandbox Testing (iOS)

1. **Create Sandbox Tester:**
   - Go to App Store Connect
   - Users and Access → Sandbox Testers
   - Create test account

2. **Configure Device:**
   - Settings → App Store → Sandbox Account
   - Sign in with sandbox tester account

3. **Test Flow:**
   - Open Kiwi AAC app
   - Trigger paywall (tap premium color theme)
   - Select subscription
   - Use sandbox account to complete purchase
   - Verify entitlement is granted

### Verifying Purchases

Check purchase in RevenueCat dashboard:
1. Go to **Customers**
2. Search for your test user email
3. Verify subscription is active
4. Check `pro` entitlement status

## 🔧 Current Implementation

Your app is already configured to use RevenueCat Paywalls:

### Code Integration Points

**1. Service Layer** (`src/services/RevenueCatService.js`)
```javascript
// Shows native paywall configured in dashboard
await revenueCatService.showPaywall('feature-name');

// Shows paywall only if user doesn't have PRO entitlement
await revenueCatService.showPaywallIfNeeded('feature-name');
```

**2. Paywall Triggers** (`src/utils/paywall.js`)
All premium features already have paywall triggers:
- Color themes
- Advanced analytics
- Premium templates
- Cloud sync
- Premium voices
- Unlimited people
- Unlimited vocabulary
- Multi-profiles

**3. Plugin** (`src/plugins/revenuecat.ts`)
Uses RevenueCatUI.presentPaywall() and RevenueCatUI.presentPaywallIfNeeded()

## 📋 Paywall Features You Can Configure

### Dashboard-Configurable (No Code Changes Needed)

✅ **Visual Design**
- Colors, fonts, spacing
- Images, icons, logos
- Light/dark mode styles

✅ **Content**
- Title and subtitle text
- Features list
- Pricing display
- Legal links

✅ **Pricing Options**
- Monthly/Annual toggle
- Free trial duration
- Discount badges
- Price formatting

✅ **Localization**
- Multiple languages
- Currency formatting
- Regional pricing

✅ **A/B Testing**
- Multiple paywall variants
- Conversion tracking
- Winner selection

## 🎯 Best Practices

### 1. Clear Value Proposition
- Lead with benefits, not features
- Use customer-focused language ("You get" vs "We offer")
- Highlight most popular plan

### 2. Social Proof
- Add testimonials if available
- Show user count ("Join 10,000+ AAC users")
- Display ratings/reviews

### 3. Free Trial
- Emphasize "Start Free Trial"
- Make cancellation easy ("Cancel anytime")
- Show trial duration prominently

### 4. Pricing Psychology
- Show annual savings percentage
- Display price per month for annual plan
- Use "Most Popular" badge on best value

### 5. Trust Signals
- Privacy policy link
- Terms of service link
- Money-back guarantee (if applicable)
- Support contact

## 🚀 Quick Start Checklist

- [ ] Log into RevenueCat dashboard
- [ ] Create default paywall
- [ ] Add header (title, subtitle, image)
- [ ] Configure features list (8-10 features)
- [ ] Set up pricing (monthly + annual)
- [ ] Add legal links (terms, privacy)
- [ ] Configure free trial (7 days recommended)
- [ ] Set color scheme (match Kiwi brand)
- [ ] Preview on different devices
- [ ] Test in sandbox mode
- [ ] Launch to production

## 📞 Support

**RevenueCat Documentation:**
https://www.revenuecat.com/docs/paywalls

**Kiwi AAC Specific:**
- Current implementation: See `src/services/RevenueCatService.js`
- Paywall triggers: See `src/utils/paywall.js`
- Free tier limits: See `FREE_TIER_LIMITS` constant

## 🎨 Example Paywall Template

```
╔══════════════════════════════════╗
║                                  ║
║         🥝 Kiwi Pro              ║
║                                  ║
║   Unlock Unlimited Features      ║
║   Premium AAC Communication      ║
║                                  ║
╠══════════════════════════════════╣
║                                  ║
║  ✅ Unlimited vocabulary         ║
║  ✅ Premium voices               ║
║  ✅ Multiple profiles            ║
║  ✅ Cloud backup                 ║
║  ✅ Advanced analytics           ║
║  ✅ Custom themes                ║
║                                  ║
╠══════════════════════════════════╣
║                                  ║
║  ┌────────────┬────────────┐    ║
║  │  Monthly   │   Annual   │    ║
║  │  $9.99/mo  │  $79.99/yr │    ║
║  │            │  BEST VALUE│    ║
║  │            │  Save 33%  │    ║
║  └────────────┴────────────┘    ║
║                                  ║
║  [ Start 7-Day Free Trial ]     ║
║                                  ║
║     Cancel anytime • No risk    ║
║                                  ║
║  Terms • Privacy • Support       ║
║                                  ║
╚══════════════════════════════════╝
```

Your app is ready! Just configure the paywall content in the RevenueCat dashboard and it will automatically appear in your app. 🎉
