/**
 * Kiwi Voice - Superwall Paywall Integration
 *
 * This module provides centralized paywall trigger functions for all premium features.
 * Each function returns true if the user has access, false if paywalled.
 */

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
 * Lazy-load Superwall to avoid circular dependencies
 */
let SuperwallModule = null;
const getSuperwall = async () => {
  if (!SuperwallModule) {
    try {
      const module = await import('../plugins/superwall');
      SuperwallModule = module.default;
    } catch (error) {
      console.error('Failed to load Superwall plugin:', error);
      return null;
    }
  }
  return SuperwallModule;
};

/**
 * Helper to check if user is subscribed
 */
const checkSubscription = async (eventName) => {
  try {
    const Superwall = await getSuperwall();
    if (!Superwall) {
      // If Superwall isn't available, grant access (development mode)
      return true;
    }

    const result = await Superwall.register({ event: eventName });
    // User has access if they're subscribed or there's no paywall rule
    return result.result === 'userIsSubscribed' || result.result === 'noRuleMatch';
  } catch (error) {
    console.error(`Paywall error for ${eventName}:`, error);
    // In development or if paywall fails, grant access
    return true;
  }
};

/**
 * 1. COLOR THEMES - IMPLEMENTED ✅
 * Trigger when user tries to select a premium color theme
 */
export const checkColorThemeAccess = async () => {
  return await checkSubscription('colorThemes');
};

/**
 * 2. ADVANCED ANALYTICS
 * Trigger when user tries to access analytics beyond 7 days
 */
export const checkAdvancedAnalytics = async () => {
  return await checkSubscription('advancedAnalytics');
};

/**
 * Export analytics data (CSV, PDF)
 */
export const checkExportAnalytics = async () => {
  return await checkSubscription('exportAnalytics');
};

/**
 * 3. PREMIUM TEMPLATES
 * Trigger when user tries to apply a premium template
 */
export const checkPremiumTemplates = async () => {
  return await checkSubscription('premiumTemplates');
};

export const checkApplyTemplate = async (templateId) => {
  return await checkSubscription('applyTemplate');
};

/**
 * 4. CLOUD SYNC & COLLABORATION
 * Trigger when user tries to enable cloud backup
 */
export const checkCloudSync = async () => {
  return await checkSubscription('cloudSync');
};

export const checkTeamSharing = async () => {
  return await checkSubscription('teamSharing');
};

/**
 * 5. PREMIUM VOICE FEATURES
 * Trigger when user tries to access voice presets or custom pronunciation beyond limit
 */
export const checkPremiumVoice = async () => {
  return await checkSubscription('premiumVoice');
};

export const checkVoicePresets = async () => {
  return await checkSubscription('voicePresets');
};

/**
 * Check if user can add more pronunciation entries
 */
export const checkPronunciationLimit = async (currentCount) => {
  if (currentCount < FREE_TIER_LIMITS.MAX_PRONUNCIATION_ENTRIES) {
    return true; // Under free limit
  }
  return await checkSubscription('premiumVoice');
};

/**
 * 6. UNLIMITED PEOPLE/CHARACTERS
 * Trigger when user tries to add more than 3 custom characters
 */
export const checkUnlimitedPeople = async (currentCount) => {
  if (currentCount < FREE_TIER_LIMITS.MAX_CUSTOM_PEOPLE) {
    return true; // Under free limit
  }
  return await checkSubscription('unlimitedPeople');
};

export const checkAddCustomCharacter = async () => {
  return await checkSubscription('addCustomCharacter');
};

/**
 * 7. UNLIMITED VOCABULARY
 * Trigger when user tries to add 51st icon
 */
export const checkUnlimitedVocabulary = async (currentIconCount) => {
  if (currentIconCount < FREE_TIER_LIMITS.MAX_ICONS) {
    return true; // Under free limit
  }
  return await checkSubscription('unlimitedVocabulary');
};

export const checkAddIcon51 = async () => {
  return await checkSubscription('addIcon51');
};

/**
 * 8. MULTI-PROFILE SUPPORT
 * Trigger when user tries to add a 2nd profile
 */
export const checkMultiProfiles = async (currentProfileCount) => {
  if (currentProfileCount < FREE_TIER_LIMITS.MAX_PROFILES + 1) {
    return true; // Can have 1 profile for free
  }
  return await checkSubscription('multiProfiles');
};

export const checkAddProfile2 = async () => {
  return await checkSubscription('addProfile2');
};

/**
 * 9. CUSTOM PHOTOS
 * Trigger when user tries to add more than 20 custom photos
 */
export const checkCustomPhotoLimit = async (currentPhotoCount) => {
  if (currentPhotoCount < FREE_TIER_LIMITS.MAX_CUSTOM_PHOTOS) {
    return true; // Under free limit
  }
  return await checkSubscription('unlimitedVocabulary');
};

/**
 * Generic paywall trigger for any event
 */
export const triggerPaywall = async (eventName, params = {}) => {
  try {
    const Superwall = await getSuperwall();
    if (!Superwall) {
      return { hasAccess: true, result: 'error' };
    }

    const result = await Superwall.register({ event: eventName, params });
    return {
      hasAccess: result.result === 'userIsSubscribed' || result.result === 'noRuleMatch',
      result: result.result
    };
  } catch (error) {
    console.error(`Paywall error for ${eventName}:`, error);
    return { hasAccess: true, result: 'error' };
  }
};

/**
 * Get subscription status (for UI display)
 */
export const getSubscriptionStatus = () => {
  // This would integrate with Superwall's subscription status API
  // For now, return a placeholder
  return {
    isSubscribed: false,
    tier: 'free',
    expiresAt: null
  };
};

/**
 * Restore purchases (iOS/Android)
 */
export const restorePurchases = async () => {
  try {
    const Superwall = await getSuperwall();
    if (!Superwall) {
      return false;
    }

    const result = await Superwall.restore();
    return result.result === 'restored';
  } catch (error) {
    console.error('Restore purchases error:', error);
    return false;
  }
};
