# RevenueCat Paywall Builder - Step-by-Step Configuration Guide

## 🎨 How to Configure Your Paywall in Paywall Builder

Since RevenueCat Paywall Builder uses a visual UI (not JSON import), follow these steps to recreate your exact paywall design.

---

## Step 1: Access Paywall Builder (2 minutes)

1. **Login to RevenueCat Dashboard**
   - Go to: https://app.revenuecat.com
   - Login with your account

2. **Navigate to Paywalls**
   - Click "Paywalls" in the left sidebar
   - Click "+ Create Paywall" button

3. **Choose Template**
   - Select **"Template 4"** or **"Multi-Package Template"**
   - This template supports multiple packages with features list
   - Click "Use Template"

---

## Step 2: Basic Settings (2 minutes)

### General Tab

**Paywall Information:**
- **Name**: `Kiwi Pro Paywall v1`
- **Identifier**: `kiwi_pro_paywall_v1`
- **Default Offering**: Select `default` (you'll create this in Dashboard first)

**Display Settings:**
- **Show Close Button**: Yes (allows users to dismiss)
- **Display Restore Purchases Button**: Yes ✅ (iOS requirement)
- **Blur Background**: No

---

## Step 3: Configure Header (3 minutes)

### Header Section

**Title:**
```
Unlock access to all recipes
```
- **Font**: System Bold
- **Size**: 28pt
- **Color**: #1A1A1A (dark gray/black)
- **Alignment**: Center

**Subtitle:**
- Leave empty (no subtitle in your design)

**Header Image:**
- None (or upload optional image if desired)

---

## Step 4: Configure Features List (5 minutes)

### Features Section

Click "Add Feature" 4 times and configure each:

**Feature 1:**
- **Icon**: 🥗 (or select "Custom" and upload icon)
- **Title**: `Healthy recipes, specially curated`
- **Description**: `Access our full library of nutritious and delicious recipes` (optional)
- **Icon Color**: Default or #34C759 (green)

**Feature 2:**
- **Icon**: 👥 (or custom icon)
- **Title**: `A welcoming cooking community`
- **Description**: `Connect with other cooking enthusiasts and share tips` (optional)
- **Icon Color**: Default or #007AFF (blue)

**Feature 3:**
- **Icon**: ✨ (or custom icon)
- **Title**: `New recipe recommendations`
- **Description**: `Get personalized recommendations based on your preferences` (optional)
- **Icon Color**: Default or #FF9500 (orange)

**Feature 4:**
- **Icon**: ⚡ (or custom icon)
- **Title**: `Priority support`
- **Description**: `Get help when you need it with priority customer support` (optional)
- **Icon Color**: Default or #FFD700 (gold)

**Feature List Style:**
- **Layout**: Vertical list
- **Icon size**: 24px
- **Text size**: 16px
- **Spacing**: 16px between items
- **Background**: Transparent or #F5F5F5 (light gray)

---

## Step 5: Configure Packages (5 minutes)

### Package Selection

**IMPORTANT:** Your offering must be created first in Dashboard → Offerings

**Package 1 - Annual (Default/Highlighted):**
- **Package Identifier**: `$rc_annual`
- **Display Order**: 1 (first/top)
- **Make Default**: ✅ Yes (checked)

**Package Display:**
- **Icon**: ⭐ (star) or 👑 (crown)
- **Title**: `Annual`
- **Subtitle/Price Display**: Use variable: `{{ product.price_per_period_abbreviated }}`
  - This will show: "$39.99/yr" automatically
- **Description**: `Full access for just {{ product.price_per_period_abbreviated }}`

**Badge:**
- **Show Badge**: ✅ Yes
- **Badge Text**: `SAVE 30%`
- **Badge Color**: #FF3B30 (red) or #FF9500 (orange)
- **Badge Position**: Top right corner

**Styling:**
- **Border**: 2px solid
- **Border Color**: #007AFF (blue - highlighted)
- **Background**: #FFFFFF (white)
- **Border Radius**: 16px
- **Shadow**: Medium (0 2px 8px rgba(0,0,0,0.1))

**Package 2 - Monthly:**
- **Package Identifier**: `$rc_monthly`
- **Display Order**: 2 (second)
- **Make Default**: ❌ No

**Package Display:**
- **Icon**: 📅 (calendar)
- **Title**: `Monthly`
- **Subtitle/Price Display**: `{{ product.price_per_period_abbreviated }}`
  - This will show: "$4.99/mo" automatically
- **Description**: `Full access for just {{ product.price_per_period_abbreviated }}`

**Badge:**
- **Show Badge**: ❌ No

**Styling:**
- **Border**: 1px solid
- **Border Color**: #E0E0E0 (light gray - unselected)
- **Background**: #FFFFFF (white)
- **Border Radius**: 16px
- **Shadow**: None or subtle

---

## Step 6: Configure Call-to-Action Button (2 minutes)

### Purchase Button

**Primary Button:**
- **Text**: `Continue in-app`
- **Background Color**: #007AFF (iOS blue) or #34C759 (green)
- **Text Color**: #FFFFFF (white)
- **Font**: System Semibold, 18pt
- **Border Radius**: 12px
- **Height**: 56px
- **Width**: Full width
- **Shadow**: Medium

**Secondary Text (above button):**
- **Text**: `Or, save 30%`
- **Font**: System Regular, 14pt
- **Color**: #666666 (gray)
- **Position**: Above button

**Alternative for Intro Offers (if you add trials later):**
- **Text with Intro Offer**: `Start Free Trial`
- **Subtitle**: `Then {{ product.price_per_period_abbreviated }} after trial`

---

## Step 7: Configure Footer (2 minutes)

### Footer Section

**Restore Purchases Button:**
- **Show**: ✅ Yes (REQUIRED for iOS)
- **Text**: `Restore purchases`
- **Style**: Text button (no background)
- **Color**: #007AFF (blue)
- **Font**: System Regular, 16pt
- **Position**: Center, bottom

**Legal Links:**
- **Terms of Service URL**: `https://kiwi-aac.netlify.app/terms.html`
- **Privacy Policy URL**: `https://kiwi-aac.netlify.app/privacy.html`
- **Display Style**: Small text links
- **Text**: `Terms • Privacy`
- **Color**: #999999 (light gray)
- **Font**: System Regular, 12pt

---

## Step 8: Configure Colors & Styling (3 minutes)

### Color Scheme

**Background:**
- **Main Background**: #FFFFFF (white)
- **Card Background**: #F5F5F5 (light gray)

**Text Colors:**
- **Primary Text**: #1A1A1A (almost black)
- **Secondary Text**: #666666 (medium gray)
- **Tertiary Text**: #999999 (light gray)

**Accent Colors:**
- **Primary Accent**: #007AFF (iOS blue)
- **Success**: #34C759 (green)
- **Alert/Badge**: #FF3B30 (red) or #FF9500 (orange)

**Borders:**
- **Selected**: #007AFF (blue)
- **Unselected**: #E0E0E0 (light gray)

### Typography

**Font Family:**
- Use **System Font** (San Francisco on iOS, Roboto on Android)

**Font Sizes:**
- Title: 28pt, Bold
- Subtitle: 20pt, Regular
- Feature Text: 16pt, Regular
- Button Text: 18pt, Semibold
- Footer Text: 14pt, Regular
- Legal Text: 12pt, Regular

### Spacing

- **Screen Padding**: 20px
- **Section Spacing**: 32px
- **Feature List Spacing**: 16px between items
- **Package Spacing**: 12px between packages
- **Button Spacing**: 16px from packages

### Border Radius

- **Cards/Packages**: 16px
- **Buttons**: 12px
- **Badges**: 8px

---

## Step 9: Localization (Optional - 5 minutes)

If you support multiple languages:

**Add Localizations:**
- Click "Add Localization"
- Select language (e.g., Spanish, French)
- Translate all text strings:
  - Title
  - Features
  - Button text
  - Footer text

**Example Spanish:**
- Title: `Desbloquea acceso a todas las recetas`
- Feature 1: `Recetas saludables, especialmente seleccionadas`
- Button: `Continuar en la app`
- Restore: `Restaurar compras`

---

## Step 10: Preview & Test (3 minutes)

### Preview

1. **Click "Preview" button** (top right)
2. **Choose platform:**
   - iOS: See how it looks on iPhone
   - Android: See how it looks on Android
3. **Test different screen sizes:**
   - iPhone SE (small)
   - iPhone 14 (medium)
   - iPhone 14 Pro Max (large)
   - Various Android sizes

### Preview Checklist

Verify:
- [ ] Title displays correctly
- [ ] All 4 features visible
- [ ] Icons show properly
- [ ] Annual package highlighted (blue border)
- [ ] "SAVE 30%" badge on annual
- [ ] Monthly package shows normally
- [ ] Button text is "Continue in-app"
- [ ] "Or, save 30%" text visible
- [ ] Restore purchases button at bottom
- [ ] Colors match your design
- [ ] Everything is readable

### Device Preview (Recommended)

**Using RevenueCat App:**
1. Download "RevenueCat" app from App Store/Play Store
2. Login with your account
3. Navigate to your paywall
4. Preview on real device
5. Test animations and interactions

**Using Your Own App:**
- Build and run your app
- Trigger a paywall (e.g., try to add 51st icon)
- See it live in your app

---

## Step 11: Publish (1 minute)

### Publish Paywall

1. **Review everything one last time**
2. **Click "Publish" button** (top right)
3. **Select offering**: Choose `default`
4. **Confirm**: Click "Publish Paywall"

**Status:**
- Paywall will be marked as "Live"
- Will show to users immediately
- Can update anytime without app release

---

## 📋 Quick Reference: Values from JSON

For easy copy/paste while configuring:

### Text Content
```
Title: Unlock access to all recipes

Feature 1: Healthy recipes, specially curated
Feature 2: A welcoming cooking community
Feature 3: New recipe recommendations
Feature 4: Priority support

Button: Continue in-app
Secondary: Or, save 30%
Footer: Restore purchases

Badge: SAVE 30%
```

### Colors
```
Primary: #007AFF
Success: #34C759
Alert: #FF3B30
Warning: #FF9500

Background: #FFFFFF
Card BG: #F5F5F5

Text Primary: #1A1A1A
Text Secondary: #666666
Text Tertiary: #999999

Border Selected: #007AFF
Border Normal: #E0E0E0
```

### Package Configuration
```
Package 1 (Annual):
- ID: $rc_annual
- Position: 1 (default)
- Badge: "SAVE 30%"
- Border: #007AFF (highlighted)

Package 2 (Monthly):
- ID: $rc_monthly
- Position: 2
- Badge: None
- Border: #E0E0E0 (normal)
```

---

## 🎯 Pro Tips

**1. Use Template Variables**
Always use RevenueCat's template variables for pricing:
- `{{ product.price }}` - Shows price (e.g., "$4.99")
- `{{ product.price_per_period_abbreviated }}` - Shows with period (e.g., "$4.99/mo")
- This ensures pricing updates automatically across all regions

**2. Test on Multiple Devices**
Preview on:
- Small phones (iPhone SE)
- Large phones (iPhone Pro Max)
- Android phones
- Tablets (if supported)

**3. A/B Testing**
RevenueCat supports A/B testing:
- Create multiple paywall variations
- Test different copy, colors, layouts
- See which converts better
- All without app updates!

**4. Update Anytime**
- Changes to paywall design are instant
- No need to release app update
- Test and iterate quickly

**5. Monitor Performance**
After publishing, check:
- Dashboard → Charts
- Paywall impression rate
- Conversion rate
- Revenue per customer

---

## ✅ Completion Checklist

Before clicking Publish:

- [ ] Title: "Unlock access to all recipes"
- [ ] 4 features with icons
- [ ] Annual package with "SAVE 30%" badge
- [ ] Monthly package (no badge)
- [ ] Button text: "Continue in-app"
- [ ] "Or, save 30%" secondary text
- [ ] "Restore purchases" button visible
- [ ] Terms & Privacy links added
- [ ] Colors match design (#007AFF primary)
- [ ] Previewed on iOS
- [ ] Previewed on Android
- [ ] Linked to "default" offering
- [ ] All text is readable

---

## 🚀 After Publishing

**Your paywall is now live!**

Users will see it when:
- They hit free tier limits (50 icons, etc.)
- They tap premium features
- Code calls `showPaywall()` or `showPaywallIfNeeded()`

**Analytics:**
- View impressions in Dashboard
- Track conversion rates
- Monitor revenue
- A/B test variations

---

## 📞 Need Help?

**RevenueCat Resources:**
- Paywall Builder Docs: https://www.revenuecat.com/docs/tools/paywalls
- Video Tutorial: https://www.youtube.com/revenuecat
- Community: https://community.revenuecat.com
- Support: support@revenuecat.com

**Your Configuration:**
- All values: `revenuecat-paywall-config.json`
- This guide: `PAYWALL-BUILDER-GUIDE.md`
- Setup checklist: `PRODUCT-SETUP-CHECKLIST.md`

---

**Total Time: ~25 minutes**

You now have a beautiful, conversion-optimized paywall ready to monetize your app! 🎉
