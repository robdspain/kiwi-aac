/**
 * Kiwi Voice - RevenueCat Paywall Integration
 *
 * This module provides centralized paywall trigger functions for all premium features.
 * Each function returns true if the user has access, false if paywalled.
 */

/**
 * RevenueCat Configuration
 * TODO: Replace with your actual RevenueCat API keys
 */
const REVENUECAT_CONFIG = {
  // Get these from RevenueCat Dashboard -> Projects -> API Keys
  IOS_API_KEY: 'appl_YOUR_IOS_API_KEY_HERE',
  ANDROID_API_KEY: 'goog_YOUR_ANDROID_API_KEY_HERE',
  WEB_API_KEY: 'rc_YOUR_WEB_API_KEY_HERE', // For web testing
};

/**
 * RevenueCat Entitlement IDs
 * These should match the entitlement identifiers in your RevenueCat dashboard
 */
const ENTITLEMENTS = {
  PRO: 'pro', // Main premium subscription entitlement
};

/**
 * Free tier limits
 */
export const FREE_TIER_LIMITS = {
  MAX_ICONS: 50,
  MAX_PROFILES: 1,
  MAX_CUSTOM_PEOPLE: 3,
  MAX_PRONUNCIATION_ENTRIES: 10,
  ANALYTICS_HISTORY_DAYS: 7,
  MAX_CUSTOM_PHOTOS: 20
};

/**
 * Lazy-load RevenueCat to avoid circular dependencies
 */
let RevenueCatModule = null;
let isInitialized = false;

const getRevenueCat = async () => {
  if (!RevenueCatModule) {
    try {
      const module = await import('../plugins/revenuecat');
      RevenueCatModule = module.getRevenueCat();

      // Initialize RevenueCat on first access
      if (!isInitialized) {
        // Determine API key based on platform
        const platform = getPlatform();
        let apiKey;

        if (platform === 'ios') {
          apiKey = REVENUECAT_CONFIG.IOS_API_KEY;
        } else if (platform === 'android') {
          apiKey = REVENUECAT_CONFIG.ANDROID_API_KEY;
        } else {
          apiKey = REVENUECAT_CONFIG.WEB_API_KEY;
        }

        await RevenueCatModule.configure({ apiKey });
        isInitialized = true;
        console.log('RevenueCat initialized successfully');
      }
    } catch (error) {
      console.error('Failed to load RevenueCat plugin:', error);
      return null;
    }
  }
  return RevenueCatModule;
};

/**
 * Detect current platform
 */
const getPlatform = () => {
  // Check if running in Capacitor
  if (window.Capacitor) {
    return window.Capacitor.getPlatform();
  }
  // Fallback to web
  return 'web';
};

/**
 * Helper to check if user has premium access
 */
const checkPremiumAccess = async () => {
  try {
    const RevenueCat = await getRevenueCat();
    if (!RevenueCat) {
      // If RevenueCat isn't available, grant access (development mode)
      console.warn('RevenueCat not available, granting access for development');
      return true;
    }

    // Check if user has the PRO entitlement
    const hasAccess = await RevenueCat.checkEntitlement(ENTITLEMENTS.PRO);
    return hasAccess;
  } catch (error) {
    console.error('Error checking premium access:', error);
    // In development or if check fails, grant access
    return true;
  }
};

/**
 * Show paywall and attempt purchase
 * This will show the available offerings to the user
 */
const showPaywall = async (feature) => {
  try {
    const RevenueCat = await getRevenueCat();
    if (!RevenueCat) {
      console.warn('RevenueCat not available');
      return false;
    }

    // Get available offerings
    const offerings = await RevenueCat.getOfferings();

    if (!offerings.current || !offerings.current.availablePackages.length) {
      console.warn('No offerings available');
      return false;
    }

    // For now, just log the offerings
    // In a real implementation, you'd show a UI to let the user pick a package
    console.log('Available offerings:', offerings.current.availablePackages);
    console.log(`Feature "${feature}" requires premium subscription`);

    // TODO: Implement actual paywall UI
    // For now, just return false (no purchase made)
    return false;
  } catch (error) {
    console.error('Error showing paywall:', error);
    return false;
  }
};

/**
 * 1. COLOR THEMES - IMPLEMENTED ✅
 * Trigger when user tries to select a premium color theme
 */
export const checkColorThemeAccess = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('colorThemes');
  }
  return hasAccess;
};

/**
 * 2. ADVANCED ANALYTICS
 * Trigger when user tries to access analytics beyond 7 days
 */
export const checkAdvancedAnalytics = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('advancedAnalytics');
  }
  return hasAccess;
};

/**
 * Export analytics data (CSV, PDF)
 */
export const checkExportAnalytics = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('exportAnalytics');
  }
  return hasAccess;
};

/**
 * 3. PREMIUM TEMPLATES
 * Trigger when user tries to apply a premium template
 */
export const checkPremiumTemplates = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('premiumTemplates');
  }
  return hasAccess;
};

export const checkApplyTemplate = async (templateId) => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('applyTemplate');
  }
  return hasAccess;
};

/**
 * 4. CLOUD SYNC & COLLABORATION
 * Trigger when user tries to enable cloud backup
 */
export const checkCloudSync = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('cloudSync');
  }
  return hasAccess;
};

export const checkTeamSharing = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('teamSharing');
  }
  return hasAccess;
};

/**
 * 5. PREMIUM VOICE FEATURES
 * Trigger when user tries to access voice presets or custom pronunciation beyond limit
 */
export const checkPremiumVoice = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('premiumVoice');
  }
  return hasAccess;
};

export const checkVoicePresets = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('voicePresets');
  }
  return hasAccess;
};

/**
 * Check if user can add more pronunciation entries
 */
export const checkPronunciationLimit = async (currentCount) => {
  if (currentCount < FREE_TIER_LIMITS.MAX_PRONUNCIATION_ENTRIES) {
    return true; // Under free limit
  }
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('premiumVoice');
  }
  return hasAccess;
};

/**
 * 6. UNLIMITED PEOPLE/CHARACTERS
 * Trigger when user tries to add more than 3 custom characters
 */
export const checkUnlimitedPeople = async (currentCount) => {
  if (currentCount < FREE_TIER_LIMITS.MAX_CUSTOM_PEOPLE) {
    return true; // Under free limit
  }
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('unlimitedPeople');
  }
  return hasAccess;
};

export const checkAddCustomCharacter = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('addCustomCharacter');
  }
  return hasAccess;
};

/**
 * 7. UNLIMITED VOCABULARY
 * Trigger when user tries to add 51st icon
 */
export const checkUnlimitedVocabulary = async (currentIconCount) => {
  if (currentIconCount < FREE_TIER_LIMITS.MAX_ICONS) {
    return true; // Under free limit
  }
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('unlimitedVocabulary');
  }
  return hasAccess;
};

export const checkAddIcon51 = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('addIcon51');
  }
  return hasAccess;
};

/**
 * 8. MULTI-PROFILE SUPPORT
 * Trigger when user tries to add a 2nd profile
 */
export const checkMultiProfiles = async (currentProfileCount) => {
  if (currentProfileCount < FREE_TIER_LIMITS.MAX_PROFILES + 1) {
    return true; // Can have 1 profile for free
  }
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('multiProfiles');
  }
  return hasAccess;
};

export const checkAddProfile2 = async () => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('addProfile2');
  }
  return hasAccess;
};

/**
 * 9. CUSTOM PHOTOS
 * Trigger when user tries to add more than 20 custom photos
 */
export const checkCustomPhotoLimit = async (currentPhotoCount) => {
  if (currentPhotoCount < FREE_TIER_LIMITS.MAX_CUSTOM_PHOTOS) {
    return true; // Under free limit
  }
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall('customPhotos');
  }
  return hasAccess;
};

/**
 * Generic paywall trigger for any feature
 */
export const triggerPaywall = async (feature, params = {}) => {
  const hasAccess = await checkPremiumAccess();
  if (!hasAccess) {
    await showPaywall(feature);
  }
  return {
    hasAccess,
    result: hasAccess ? 'userIsSubscribed' : 'noAccess'
  };
};

/**
 * Get subscription status (for UI display)
 */
export const getSubscriptionStatus = async () => {
  try {
    const RevenueCat = await getRevenueCat();
    if (!RevenueCat) {
      return {
        isSubscribed: false,
        tier: 'free',
        expiresAt: null
      };
    }

    const customerInfo = await RevenueCat.getCustomerInfo();
    const hasProAccess = customerInfo.entitlements[ENTITLEMENTS.PRO]?.isActive || false;

    return {
      isSubscribed: hasProAccess,
      tier: hasProAccess ? 'pro' : 'free',
      expiresAt: customerInfo.entitlements[ENTITLEMENTS.PRO]?.expirationDate || null,
      activeSubscriptions: customerInfo.activeSubscriptions
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isSubscribed: false,
      tier: 'free',
      expiresAt: null
    };
  }
};

/**
 * Restore purchases (iOS/Android)
 */
export const restorePurchases = async () => {
  try {
    const RevenueCat = await getRevenueCat();
    if (!RevenueCat) {
      console.warn('RevenueCat not available');
      return false;
    }

    const result = await RevenueCat.restorePurchases();
    console.log('Purchases restored successfully', result);
    return true;
  } catch (error) {
    console.error('Restore purchases error:', error);
    return false;
  }
};
