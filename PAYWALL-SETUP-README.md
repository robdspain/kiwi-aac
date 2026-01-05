# Kiwi Paywall Setup (All-in-One Manual Steps)

Use this single document for all remaining paywall setup steps in RevenueCat and the stores.

## 0) Quick Checklist
- Products exist in App Store Connect / Google Play with correct IDs and prices.
- RevenueCat products created and linked to entitlement `pro`.
- Offering `default` created with packages `$rc_monthly`, `$rc_annual`, `$rc_lifetime`.
- Paywall UI configured in RevenueCat Paywalls with the exact copy below.
- Preview + sandbox test completes and grants `pro` entitlement.

---

## 1) Store Products (App Store Connect / Google Play)

Create these in-app purchases with exact IDs:
- Monthly (auto-renewing): `kiwi_monthly` — $4.99 / month
- Annual (auto-renewing): `kiwi_annual` — $39.99 / year
- Lifetime (non-consumable): `kiwi_lifetime` — $149.99 one-time

Notes:
- Use the same product IDs across stores and RevenueCat.
- Ensure products are in an "Active" or "Ready to Submit" state.

---

## 2) RevenueCat Setup (Dashboard)

### 2.1 Products
In RevenueCat, create/verify:
- `kiwi_monthly` (subscription)
- `kiwi_annual` (subscription)
- `kiwi_lifetime` (one_time / non-consumable)

### 2.2 Entitlement
Create entitlement:
- **Lookup Key**: `pro`
- **Display Name**: `Pro`

Attach products to `pro`:
- `kiwi_monthly`, `kiwi_annual`, `kiwi_lifetime`

### 2.3 Offering + Packages
Create offering:
- **Lookup Key**: `default`
- **Display Name**: `Default Offering`

Create packages inside the offering and link to products:
1) `$rc_annual` → `kiwi_annual` (position 1, default/selected)
2) `$rc_monthly` → `kiwi_monthly` (position 2)
3) `$rc_lifetime` → `kiwi_lifetime` (position 3)

---

## 3) Paywall UI (RevenueCat Paywalls)

### 3.1 Template
- Template: **Standard Full Screen** (Full Screen with Features)

### 3.2 Header
- Title: **Unlock Kiwi Pro**
- Subtitle: **Empower unlimited communication with premium AAC features**
- Image: Kiwi logo / app icon

### 3.3 Features (copy exact text)
1. ✨ **Unlimited Vocabulary** - Break free from the 50-icon limit.
2. 📸 **Unlimited Custom Photos** - Add unlimited custom photos from your device.
3. ☁️ **Cloud Backup & Sync** - Sync boards, photos, and voice across devices with a secure code.
4. 👥 **Multiple Profiles** - Perfect for families & therapists.
5. 📊 **Advanced Analytics** - View progress history beyond 7 days (30-day view).
6. 🎨 **Premium Themes** - Ocean, Sunset, Forest, Berry, Candy & more.
7. 🗣️ **Custom Pronunciations** - Unlock unlimited pronunciation overrides.
8. 🎭 **Character Builder** - Create unlimited custom avatars.

### 3.4 Pricing + Badges
- **Monthly**: $4.99
  - Package: `$rc_monthly`
  - Badge: "Most Flexible"
- **Annual**: $39.99
  - Package: `$rc_annual`
  - Badge: "Best Value 🏆"
  - Offer: "Save 33%" (Save $20/year)
  - Show: "$3.33/month"
  - Pre-select/highlight
- **Lifetime**: $149.99
  - Package: `$rc_lifetime`
  - Badge: "One-Time Payment"

### 3.5 Colors
- Primary/Button: `#1A535C` (Kiwi Teal)
- Text: `#2D3436` (Charcoal)
- Background: `#FDF8F3` (Cream Shell)
- Accent: `#4ECDC4` (Kiwi Teal)
- Surface/Card: `#FFFFFF` (White)
- Secondary button outline: `#007AFF`

### 3.6 Free Trial (Subscriptions)
- Duration: 7 days
- CTA: "Start Free Trial"
- Disclaimer: "Free for 7 days, then {{price}} per {{period}}. Cancel anytime."

### 3.7 Footer Links
- Terms: `https://kiwivoiceapp.com/terms`
- Privacy: `https://kiwivoiceapp.com/privacy`
- Support: `mailto:support@kiwivoiceapp.com`

---

## 4) Testing

1) Preview in RevenueCat Paywalls (all device sizes).
2) Sandbox purchase test:
   - Trigger a premium feature in-app (e.g., premium theme).
   - Complete purchase.
   - Verify `pro` entitlement is granted.
3) Verify premium features unlock:
   - 50+ icons
   - 20+ custom photos
   - 3+ custom people/avatars
   - 30-day analytics
   - Cloud backup & sync

Cloud sync note:
- Requires `VITE_NEON_DATABASE_URL` in the environment.
- Cloud sync runs only when user has `pro`.

---

## 5) Optional: Attach Metadata to Offering

If you want to attach the JSON metadata to the offering:
```
./scripts/upload-offering-metadata.sh
```

This does not replace the Paywall UI; it only attaches metadata for custom UI use.
