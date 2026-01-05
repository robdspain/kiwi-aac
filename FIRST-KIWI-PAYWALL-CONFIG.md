# First Kiwi Paywall - RevenueCat Configuration Guide

## 🎯 Overview
This guide provides the exact configuration for the "First Kiwi Paywall" in your RevenueCat dashboard.

---

## 1️⃣ BASIC INFORMATION

### Paywall Details
- **Paywall Name**: First Kiwi Paywall
- **Identifier**: `first_kiwi_paywall` (auto-generated)
- **Status**: Active
- **Default Paywall**: Yes (set as default)

---

## 2️⃣ HEADER SECTION

### App Icon / Logo
- **Upload**: Kiwi logo (if available in your assets)
- **Alternative**: Use emoji 🥝
- **Size**: 80×80px recommended
- **Format**: PNG with transparent background

### Title Text
```
Unlock Kiwi Pro
```

### Subtitle Text
```
Empower unlimited communication with premium AAC features
```

### Header Styling
- **Title Font Size**: 28pt
- **Title Font Weight**: Bold
- **Title Color**: #2D3436 (Dark Gray)
- **Subtitle Font Size**: 17pt
- **Subtitle Font Weight**: Regular
- **Subtitle Color**: #6C757D (Medium Gray)
- **Background**: Linear gradient #FFFFFF → #F8F9FA

---

## 3️⃣ FEATURES SECTION

### Section Title
```
What's Included
```

### Feature List (9 Premium Features)

#### ✨ Feature 1 - HIGHLIGHTED
**Icon**: ✨
**Title**: Unlimited Vocabulary
**Description**: Break free from the 50-word limit. Add unlimited custom buttons and folders.
**Highlight**: Yes (show with accent background)

#### 🎙️ Feature 2 - HIGHLIGHTED
**Icon**: 🎙️
**Title**: Premium Voice Quality
**Description**: Access enhanced, natural-sounding voices for clearer communication.
**Highlight**: Yes (show with accent background)

#### 👥 Feature 3
**Icon**: 👥
**Title**: Multiple User Profiles
**Description**: Perfect for families, schools, and clinics. Unlimited profiles with personalized settings.
**Highlight**: No

#### ☁️ Feature 4
**Icon**: ☁️
**Title**: Cloud Backup & Sync
**Description**: Never lose your vocabulary. Automatic backup and sync across all devices.
**Highlight**: No

#### 📊 Feature 5
**Icon**: 📊
**Title**: Advanced Analytics
**Description**: Track communication progress with detailed insights and usage reports.
**Highlight**: No

#### 🎨 Feature 6
**Icon**: 🎨
**Title**: Premium Themes
**Description**: Personalize your experience with Ocean, Sunset, Forest, Berry, and Candy themes.
**Highlight**: No

#### 📸 Feature 7
**Icon**: 📸
**Title**: Unlimited Photos
**Description**: Add unlimited custom photos from your camera roll or family albums.
**Highlight**: No

#### 🧑‍💼 Feature 8
**Icon**: 🧑‍💼
**Title**: Custom Characters
**Description**: Create unlimited personalized avatars for your Circle of Support.
**Highlight**: No

#### 🔔 Feature 9
**Icon**: 🔔
**Title**: Priority Support
**Description**: Get fast, dedicated help from our AAC specialists whenever you need it.
**Highlight**: No

---

## 4️⃣ SOCIAL PROOF SECTION

### Rating Display
```
⭐⭐⭐⭐⭐ 4.9 out of 5 stars
```

### User Count
```
Join 10,000+ AAC users worldwide
```

### Styling
- **Font Size**: 15pt
- **Color**: #6C757D (Medium Gray)
- **Alignment**: Center

---

## 5️⃣ PRICING SECTION

### Section Header
```
Choose Your Plan
```

### Package 1: Monthly Subscription

**Display Configuration:**
- **Product Identifier**: `$rc_monthly` (or your actual monthly product ID: `kiwi_monthly`)
- **Package Title**: Monthly
- **Badge Text**: Most Flexible
- **Badge Color**: #007AFF (iOS Blue)
- **Price Display**: $9.99
- **Billing Period**: per month
- **Additional Text**: Cancel anytime
- **Default Selection**: No
- **Highlight**: No

**Features Included:**
- All premium features
- Monthly billing
- Cancel anytime

### Package 2: Annual Subscription (RECOMMENDED)

**Display Configuration:**
- **Product Identifier**: `$rc_annual` (or your actual annual product ID: `kiwi_annual`)
- **Package Title**: Annual
- **Badge Text**: Best Value 🏆
- **Badge Color**: #22C55E (Green)
- **Price Display**: $79.99
- **Billing Period**: per year
- **Price Per Month**: $6.67/month
- **Savings Badge**: Save 33%
- **Savings Amount**: Save $40/year
- **Additional Text**: Best value for families
- **Default Selection**: Yes (pre-selected)
- **Highlight**: Yes (show with accent border/background)

**Features Included:**
- All premium features
- Save $40 per year
- Best value

### Pricing Layout
- **Style**: Side-by-side comparison cards
- **Card Border Radius**: 16px
- **Selected Card Border**: 3px solid #007AFF
- **Shadow**: 0 4px 12px rgba(0,0,0,0.1)

---

## 6️⃣ FREE TRIAL SECTION

### Free Trial Configuration
- **Enable Free Trial**: Yes
- **Trial Duration**: 7 days
- **Trial Text Display**: Start 7-Day Free Trial

### Trial Details Text
```
Free for 7 days, then $79.99 per year. Cancel anytime.
```

### Styling
- **Font Size**: 13pt
- **Color**: #6C757D (Medium Gray)
- **Alignment**: Center

---

## 7️⃣ CALL TO ACTION BUTTONS

### Primary Button (Purchase/Trial)
**Button Text**:
```
Start Free Trial
```

**Styling:**
- **Background Color**: #1A535C (Kiwi Teal)
- **Text Color**: #FFFFFF (White)
- **Font Size**: 17pt
- **Font Weight**: 600 (Semibold)
- **Border Radius**: 12px
- **Height**: 56px
- **Shadow**: 0 4px 12px rgba(26,83,92,0.3)
- **Full Width**: Yes

### Secondary Button (Restore Purchases)
**Button Text**:
```
Restore Purchases
```

**Styling:**
- **Background Color**: Transparent
- **Text Color**: #007AFF (iOS Blue)
- **Font Size**: 17pt
- **Font Weight**: 600 (Semibold)
- **Border**: 2px solid #007AFF
- **Border Radius**: 12px
- **Height**: 44px
- **Full Width**: Yes

### Button Spacing
- **Gap Between Buttons**: 12px
- **Margin Top**: 24px

---

## 8️⃣ FOOTER SECTION

### Legal Links
Display as horizontal list with bullets:

```
Terms of Service • Privacy Policy • Support
```

**Link URLs:**
- **Terms**: `https://kiwivoiceapp.com/terms`
- **Privacy**: `https://kiwivoiceapp.com/privacy`
- **Support**: `mailto:support@kiwivoiceapp.com`

**Link Styling:**
- **Font Size**: 13pt
- **Color**: #007AFF (iOS Blue)
- **Underline**: None (underline on hover)

### Subscription Disclaimer
```
Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage subscriptions in Settings.
```

**Disclaimer Styling:**
- **Font Size**: 12pt
- **Color**: #6C757D (Medium Gray)
- **Line Height**: 1.5
- **Alignment**: Center
- **Margin Top**: 16px

---

## 9️⃣ DESIGN & COLORS

### Color Palette
```css
Primary (Kiwi Teal): #1A535C
Accent (iOS Blue): #007AFF
Success (Green): #22C55E
Background: #FFFFFF
Card Background: #F8F9FA
Text Primary: #2D3436
Text Secondary: #6C757D
Border: #E5E5EA
```

### Typography
- **Font Family**: SF Pro (iOS), -apple-system (fallback)
- **Title**: 28pt Bold
- **Subtitle**: 17pt Regular
- **Body**: 15pt Regular
- **Caption**: 13pt Regular
- **Small**: 12pt Regular

### Spacing & Layout
- **Container Padding**: 24px
- **Section Spacing**: 32px
- **Item Spacing**: 16px
- **Border Radius**: 16px (cards), 12px (buttons)
- **Max Width**: 600px (centered)

---

## 🔟 LOCALIZATION (OPTIONAL)

### Spanish Translation (es)

**Header:**
- Title: `Desbloquea Kiwi Pro`
- Subtitle: `Potencia la comunicación ilimitada con funciones AAC premium`

**Features:**
1. Vocabulario Ilimitado - Libérate del límite de 50 palabras. Agrega botones y carpetas personalizados ilimitados.
2. Calidad de Voz Premium - Accede a voces mejoradas y naturales para una comunicación más clara.
3. Múltiples Perfiles de Usuario - Perfecto para familias, escuelas y clínicas. Perfiles ilimitados con configuraciones personalizadas.
4. Copia de Seguridad en la Nube - Nunca pierdas tu vocabulario. Copia de seguridad automática y sincronización en todos los dispositivos.
5. Análisis Avanzados - Sigue el progreso de comunicación con informes detallados y de uso.
6. Temas Premium - Personaliza tu experiencia con temas Océano, Atardecer, Bosque, Mora y Dulce.
7. Fotos Ilimitadas - Agrega fotos personalizadas ilimitadas desde tu rollo de cámara o álbumes familiares.
8. Personajes Personalizados - Crea avatares personalizados ilimitados para tu Círculo de Apoyo.
9. Soporte Prioritario - Obtén ayuda rápida y dedicada de nuestros especialistas en AAC cuando la necesites.

**Pricing:**
- Section Header: `Elige Tu Plan`

**Buttons:**
- Primary: `Comenzar Prueba Gratis`
- Secondary: `Restaurar Compras`

---

## 1️⃣1️⃣ TARGETING & VARIANTS (Advanced)

### Audience Segments

#### New Users (0-7 days)
**Variant**: Emphasis on Free Trial
**Changes:**
- Title: `Try Kiwi Pro Free`
- Subtitle: `7 days free, then unlock unlimited AAC features`
- CTA: `Start Free Trial Now`

#### Engaged Users (7+ days, 5+ sessions)
**Variant**: Emphasis on Value
**Changes:**
- Title: `Save 33% with Annual Plan`
- Subtitle: `Get unlimited features for less than $7/month`
- Highlight: Annual package (even more prominent)

#### Users at Free Limit (50+ vocabulary items)
**Variant**: Emphasis on Unlimited
**Changes:**
- Title: `Go Unlimited`
- Subtitle: `Break free from limits. Unlimited vocabulary, photos, and profiles.`
- Highlight: Unlimited Vocabulary feature (top of list)

---

## 1️⃣2️⃣ PREVIEW & TESTING

### Preview Checklist
- [ ] View on iPhone SE (small screen)
- [ ] View on iPhone 15 Pro (standard)
- [ ] View on iPad (tablet)
- [ ] Test light mode appearance
- [ ] Test dark mode appearance
- [ ] Verify all text fits properly
- [ ] Check button tap targets (min 44×44pt)
- [ ] Verify colors match brand
- [ ] Test scrolling on small screens

### Sandbox Testing Steps
1. Build app with RevenueCat SDK integrated
2. Set up App Store Connect sandbox tester account
3. Sign into device with sandbox account
4. Trigger paywall in app (tap premium color theme)
5. Complete purchase with sandbox credentials
6. Verify `pro` entitlement is granted
7. Test restore purchases functionality
8. Test subscription cancellation flow

---

## 1️⃣3️⃣ ANALYTICS & METRICS

### Events to Track
- `paywall_viewed` - User sees paywall
- `paywall_dismissed` - User closes without purchase
- `paywall_monthly_selected` - Monthly plan selected
- `paywall_annual_selected` - Annual plan selected (default)
- `paywall_trial_started` - Free trial initiated
- `paywall_purchased` - Purchase completed
- `paywall_restore_attempted` - Restore purchases tapped

### Success Metrics
- **Conversion Rate Goal**: 5-10%
- **Trial-to-Paid Goal**: 40-60%
- **Annual vs Monthly**: 70% annual preferred
- **Average Revenue Per User (ARPU)**: Track monthly
- **Churn Rate**: Monitor monthly cancellations

---

## 1️⃣4️⃣ FINAL CONFIGURATION CHECKLIST

### RevenueCat Dashboard Setup
- [ ] Create "First Kiwi Paywall" in Paywalls section
- [ ] Set as default paywall
- [ ] Upload Kiwi logo (80×80px PNG)
- [ ] Configure header (title, subtitle, colors)
- [ ] Add all 9 features with icons and descriptions
- [ ] Highlight features 1 & 2 (Unlimited Vocabulary, Premium Voices)
- [ ] Add social proof (rating, user count)
- [ ] Configure monthly package ($9.99/month)
- [ ] Configure annual package ($79.99/year, default, highlighted)
- [ ] Enable 7-day free trial
- [ ] Style primary CTA button (Kiwi Teal #1A535C)
- [ ] Style secondary button (iOS Blue outline)
- [ ] Add legal links (terms, privacy, support)
- [ ] Add subscription disclaimer
- [ ] Set color scheme (match Kiwi brand)
- [ ] Configure typography (SF Pro)
- [ ] Preview on all device sizes
- [ ] Test in sandbox mode
- [ ] Enable analytics tracking
- [ ] (Optional) Add Spanish localization
- [ ] (Optional) Create A/B test variants
- [ ] Publish to production

### App Integration Verification
- [ ] RevenueCat SDK installed (v12.0.1+)
- [ ] API keys configured (iOS & Android)
- [ ] Paywall triggers implemented
- [ ] Entitlements configured (`pro` entitlement)
- [ ] Products linked (kiwi_monthly, kiwi_annual)
- [ ] Restore purchases working
- [ ] Analytics events firing
- [ ] Error handling implemented

---

## 📞 SUPPORT RESOURCES

**RevenueCat Documentation:**
- Paywalls: https://www.revenuecat.com/docs/paywalls
- Templates: https://www.revenuecat.com/docs/paywall-templates
- A/B Testing: https://www.revenuecat.com/docs/experiments

**Kiwi AAC Specific Files:**
- Implementation: `src/services/RevenueCatService.js`
- Triggers: `src/utils/paywall.js`
- Free Tier Limits: `FREE_TIER_LIMITS` constant
- Paywall Config: `kiwi-paywall-config.json`

---

## ✅ READY TO LAUNCH

Your "First Kiwi Paywall" is now fully configured and ready to convert free users into Kiwi Pro subscribers!

**Key Selling Points:**
1. **Unlimited Vocabulary** - Core value proposition for AAC users
2. **Premium Voices** - Better communication quality
3. **7-Day Free Trial** - Low-risk way to experience Pro
4. **33% Savings** - Strong incentive for annual plan
5. **Family-Friendly** - Multiple profiles for households/clinics

**Expected Performance:**
- Conversion rate: 5-10% (industry standard for mobile subscriptions)
- Annual preference: 70%+ (due to strong value messaging)
- Trial conversion: 40-60% (with quality onboarding)

Good luck with your launch! 🥝🚀
