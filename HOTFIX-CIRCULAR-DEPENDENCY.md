# Hotfix: Circular Dependency Error

**Date:** 2026-01-02
**Issue:** `ReferenceError: Cannot access 'Ui' before initialization`
**Status:** ✅ RESOLVED

---

## Problem

After deploying to Netlify, the app was throwing a runtime error:

```
ReferenceError: Cannot access 'Ui' before initialization
```

This was caused by a circular dependency issue with the Superwall plugin.

---

## Root Cause

The `src/utils/paywall.js` module was statically importing Superwall:

```javascript
import Superwall from '../plugins/superwall';
```

The Superwall plugin uses Capacitor's `registerPlugin()` which does dynamic imports on the web platform. When multiple modules import Superwall at the top level, it can cause initialization order issues in production builds.

---

## Solution

Changed all Superwall imports to use **lazy loading** with dynamic imports:

### Before:
```javascript
// paywall.js
import Superwall from '../plugins/superwall';

const checkSubscription = async (eventName) => {
  const result = await Superwall.register({ event: eventName });
  // ...
}
```

### After:
```javascript
// paywall.js
let SuperwallModule = null;
const getSuperwall = async () => {
  if (!SuperwallModule) {
    const module = await import('../plugins/superwall');
    SuperwallModule = module.default;
  }
  return SuperwallModule;
};

const checkSubscription = async (eventName) => {
  const Superwall = await getSuperwall();
  if (!Superwall) return true; // Graceful fallback

  const result = await Superwall.register({ event: eventName });
  // ...
}
```

---

## Files Modified

1. **src/utils/paywall.js**
   - Added `getSuperwall()` lazy loader
   - Updated all functions to use dynamic import
   - Added null checks for graceful fallback

2. **src/components/Controls.jsx**
   - Removed static Superwall import
   - Now imports `checkColorThemeAccess` and `restorePurchases` from paywall utils
   - Uses helper functions instead of direct Superwall calls

---

## Benefits

✅ **No more circular dependencies**
✅ **Smaller initial bundle** (Superwall loaded on demand)
✅ **Graceful fallback** if Superwall fails to load
✅ **Works in both dev and production**
✅ **No warnings in build output**

---

## Testing

```bash
# Build passed
npm run build
✓ 496 modules transformed
✓ built in 3.39s

# No errors on Netlify
✓ Deploys successfully
✓ App loads without errors
✓ Paywalls work correctly
```

---

## Prevention

Going forward, **never statically import Superwall** in utility modules. Always use the lazy loading pattern from `src/utils/paywall.js`.

**Good:**
```javascript
import { checkColorThemeAccess } from '../utils/paywall';
```

**Bad:**
```javascript
import Superwall from '../plugins/superwall'; // Don't do this in utils!
```

---

**Status:** ✅ FIXED and DEPLOYED
