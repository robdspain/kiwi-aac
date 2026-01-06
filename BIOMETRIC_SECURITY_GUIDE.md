# Biometric Security User Guide

## Overview

Kiwi AAC includes **biometric security** to protect adult settings from accidental changes while maintaining guaranteed accessibility for AAC users.

---

## What is Biometric Security?

Biometric security uses your device's built-in authentication (FaceID, TouchID, or Fingerprint) to lock adult settings. This prevents children or other users from accidentally changing important communication settings.

**Key Features:**
- 🛡️ **Secure Protection** - FaceID, TouchID, or Fingerprint authentication
- ⏱️ **5-Minute Session** - Stay unlocked after authentication
- 🔓 **Triple-Tap Fallback** - Always available if biometric fails
- 📱 **Platform Support** - iOS and Android only (not available on web)
- ✨ **Ionic UI** - Native-styled settings using Ionic Framework components

---

## How to Enable Biometric Security

1. Open **Adult Settings** (tap gear icon ⚙️)
2. Go to **Access** tab
3. Scroll to **Security** section
4. Toggle **"Use [FaceID/TouchID/Fingerprint]"** ON
5. Authenticate once to confirm

**Status Indicator:**
- When enabled: "✓ Active - Session unlocked for 5 min"

---

## How to Use

### First Unlock of the Day

1. Tap the **"🔒 Child Mode Active"** bar at the bottom
2. Biometric prompt appears
3. Authenticate with FaceID/TouchID/Fingerprint
4. Settings unlock for 5 minutes

### Within 5-Minute Session

1. Tap the unlock bar
2. Settings unlock **immediately** (no prompt)
3. Session automatically extends

### After Session Expires

1. Tap the unlock bar
2. Biometric prompt appears again
3. Authenticate to unlock

---

## Triple-Tap Fallback

**IMPORTANT:** Biometric authentication can NEVER permanently lock you out. Triple-tap is always available.

### When to Use Fallback

- Biometric authentication fails
- You cancel the biometric prompt
- Device doesn't recognize you
- Biometric hardware malfunction

### How to Use Fallback

1. Tap the unlock bar
2. If biometric fails, you'll see: **"Triple-tap here to unlock"**
3. Tap the bar **3 times quickly**
4. Settings unlock

**Visual Feedback:**
- "2 more taps to unlock" (pulsing text)
- "1 more tap to unlock" (pulsing text)
- Settings unlock on 3rd tap

---

## Disabling Protection

### Quick Disable

1. Open Adult Settings → Access → Security
2. Tap **"🔓 Disable Protection"** (red button)
3. Biometric protection turns off immediately

### Toggle Disable

1. Open Adult Settings → Access → Security
2. Toggle **"Use [Type]"** OFF
3. Biometric protection turns off

---

## Platform Availability

| Platform | Biometric Support | Fallback |
|----------|-------------------|----------|
| **iOS (FaceID)** | ✅ iPhone X and newer | ✅ Triple-tap |
| **iOS (TouchID)** | ✅ iPhone 8 and older, iPads | ✅ Triple-tap |
| **Android (Fingerprint)** | ✅ Most devices | ✅ Triple-tap |
| **Android (Face Unlock)** | ✅ Newer devices | ✅ Triple-tap |
| **Web Browser** | ❌ Not available | ✅ Triple-tap only |

---

## Troubleshooting

### Biometric Prompt Doesn't Appear

**Possible Causes:**
- Biometric not enabled in device settings
- Device doesn't support biometric
- Running on web browser

**Solutions:**
1. Check device settings → FaceID/TouchID/Fingerprint
2. Ensure biometric is enrolled and enabled
3. Use triple-tap fallback

### Biometric Always Fails

**Possible Causes:**
- Poor lighting (FaceID)
- Dirty sensor (TouchID/Fingerprint)
- Face/finger not recognized

**Solutions:**
1. Clean sensor/camera
2. Improve lighting
3. Re-enroll biometric in device settings
4. Use triple-tap fallback

### Session Expires Too Quickly

**Explanation:**
- Sessions expire after 5 minutes for security
- This is intentional to prevent unauthorized access

**Solutions:**
- Authenticate again (quick with biometric)
- Disable biometric protection if not needed

### Can't Unlock Settings

**This should NEVER happen!**

If you cannot unlock settings:
1. **Triple-tap the bottom bar** - This ALWAYS works
2. If triple-tap doesn't work, report this as a critical bug
3. As a last resort, clear app data (will reset all settings)

---

## Privacy & Security

### What is Stored?

- ✅ **Biometric enabled/disabled** - Stored locally
- ✅ **Session timestamp** - Stored in memory (cleared on app close)
- ❌ **Biometric data** - NEVER stored (handled by OS)

### How Secure is This?

- **OS-Level Security** - Uses device's secure enclave
- **No Cloud Storage** - All authentication is local
- **Guaranteed Fallback** - Triple-tap prevents lockouts
- **Session Timeout** - Auto-locks after 5 minutes

### Can Someone Bypass This?

**Biometric Protection:**
- Requires your face/fingerprint to unlock
- Cannot be bypassed without device access

**Triple-Tap Fallback:**
- Anyone with physical device access can triple-tap
- This is intentional for AAC accessibility
- If you need stronger security, use device-level passcode

---

## Best Practices

### For Parents/Therapists

1. **Enable biometric** to prevent accidental changes
2. **Test triple-tap** to ensure you can always unlock
3. **Educate users** about the unlock bar location
4. **Monitor session** - Re-authenticate if needed

### For AAC Users

1. **Know the fallback** - Triple-tap always works
2. **Don't panic** - You can never be permanently locked out
3. **Ask for help** - If confused, ask caregiver to triple-tap

### For Multi-User Environments

1. **Use biometric** to prevent cross-user changes
2. **Disable when not needed** - Reduces friction
3. **Document who has access** - Track authorized users

---

## AAC Accessibility Compliance

> **AAC Invariant:** "Biometric locks must NEVER block the user if the hardware fails or authentication is cancelled. A non-biometric fallback (e.g. Triple-Tap) must always be available to prevent permanent lockouts."

**How Kiwi AAC Complies:**

✅ **Triple-tap always works** - No conditions can disable it  
✅ **Biometric failure shows hint** - Clear guidance to user  
✅ **No permanent lockouts** - Guaranteed access via fallback  
✅ **Session management** - Reduces authentication friction  
✅ **Platform independence** - Works on all platforms  

---

## Technical Details

### Session Management

- **Duration:** 5 minutes
- **Storage:** In-memory only (not persisted)
- **Auto-lock:** Clears on timeout
- **Extension:** Each unlock extends session

### Biometric Types Detected

- **FaceID** - iPhone X and newer
- **TouchID** - iPhone 8 and older, iPads
- **Fingerprint** - Android devices
- **Face Unlock** - Android devices

### Error Handling

All biometric failures gracefully fall back to triple-tap:
- User cancellation
- Authentication failure
- Hardware malfunction
- OS-level errors

---

## Support

### Need Help?

- **Triple-tap not working?** - Report as critical bug
- **Biometric issues?** - Check device settings first
- **Questions?** - Contact support with device model

### Feedback

We'd love to hear about your experience with biometric security:
- What works well?
- What could be improved?
- Any accessibility concerns?

---

## Technical Note: Ionic UI

As of Phase 33, all Adult Settings modals and components use **Ionic Framework** for native-styled UI on both iOS and Android. The biometric controls appear in an `IonModal` with `IonItem`, `IonToggle`, and `IonButton` components for a polished, platform-native look.

---

**Last Updated:** January 5, 2026  
**Version:** 2.0 (Phase 33 - Ionic UI Migration)
