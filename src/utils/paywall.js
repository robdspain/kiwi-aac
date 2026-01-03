/**
 * Kiwi Voice - RevenueCat Paywall Integration
 *
 * This module provides centralized paywall trigger functions for all premium features.
 * Each function returns true if the user has access, false if paywalled.
 *
 * Uses RevenueCatService for all subscription management.
 */

import revenueCatService, { FREE_TIER_LIMITS } from '../services/RevenueCatService';

// Re-export FREE_TIER_LIMITS for backward compatibility
export { FREE_TIER_LIMITS };

/**
 * Helper to check if user has premium access
 */
const checkPremiumAccess = async () => {
  try {
    return await revenueCatService.hasPremiumAccess();
  } catch (error) {
    console.error('Error checking premium access:', error);
    // In development or if check fails, grant access
    return true;
  }
};

/**
 * Show native RevenueCat paywall
 * This displays the beautiful native paywall configured in RevenueCat dashboard
 */
const showPaywall = async (feature) => {
  try {
    await revenueCatService.showPaywallIfNeeded(feature);
    // After paywall dismissal, check if user subscribed
    return await checkPremiumAccess();
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
    return await revenueCatService.getSubscriptionStatus();
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
    await revenueCatService.restorePurchases();
    console.log('✅ Purchases restored successfully');
    return true;
  } catch (error) {
    console.error('❌ Restore purchases error:', error);
    return false;
  }
};

/**
 * Show Customer Center (subscription management UI)
 * Allows users to manage their subscription
 */
export const showCustomerCenter = async () => {
  try {
    await revenueCatService.showCustomerCenter();
  } catch (error) {
    console.error('Error showing customer center:', error);
  }
};
