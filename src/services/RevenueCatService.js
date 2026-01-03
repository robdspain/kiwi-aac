/**
 * RevenueCat Service
 *
 * Centralized service for managing RevenueCat subscriptions and purchases
 * Provides a high-level API for the app to interact with RevenueCat
 */

/**
 * Configuration
 */
const CONFIG = {
  // Use Vite environment variables for production
  API_KEY: import.meta.env.VITE_REVENUECAT_API_KEY || 'test_GVsVAPHELhFcgnBFbWlVyrYGiUS',
  ENTITLEMENTS: {
    PRO: 'pro', // Main premium entitlement
  },
  OFFERINGS: {
    DEFAULT: null, // Uses default offering from RevenueCat dashboard
  },
};

/**
 * Product identifiers
 * These should match your RevenueCat dashboard configuration
 */
export const PRODUCT_IDS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
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
  MAX_CUSTOM_PHOTOS: 20,
};

class RevenueCatService {
  constructor() {
    this.revenueCat = null;
    this.isInitialized = false;
    this.customerInfo = null;
    this.offerings = null;
  }

  /**
   * Initialize RevenueCat SDK
   * Should be called once at app startup
   */
  async initialize(userId = null) {
    if (this.isInitialized) {
      console.log('RevenueCat already initialized');
      return;
    }

    try {
      // Lazy load the RevenueCat plugin
      const module = await import('../plugins/revenuecat');
      this.revenueCat = module.getRevenueCat();

      // Configure with API key
      await this.revenueCat.configure({
        apiKey: CONFIG.API_KEY,
        appUserID: userId,
      });

      this.isInitialized = true;
      console.log('✅ RevenueCat initialized successfully');

      // Load initial customer info
      await this.refreshCustomerInfo();

      // Load offerings
      await this.loadOfferings();
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Refresh customer info from RevenueCat
   */
  async refreshCustomerInfo() {
    try {
      this.customerInfo = await this.revenueCat.getCustomerInfo();
      console.log('Customer info refreshed:', this.customerInfo);
      return this.customerInfo;
    } catch (error) {
      console.error('Error refreshing customer info:', error);
      return null;
    }
  }

  /**
   * Load available offerings (products)
   */
  async loadOfferings() {
    try {
      this.offerings = await this.revenueCat.getOfferings();
      console.log('Offerings loaded:', this.offerings);
      return this.offerings;
    } catch (error) {
      console.error('Error loading offerings:', error);
      return null;
    }
  }

  /**
   * Check if user has premium access (PRO entitlement)
   */
  async hasPremiumAccess() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return await this.revenueCat.checkEntitlement(CONFIG.ENTITLEMENTS.PRO);
    } catch (error) {
      console.error('Error checking premium access:', error);
      // Default to true in development mode if check fails
      return true;
    }
  }

  /**
   * Present native paywall UI
   * This shows the beautiful native RevenueCat paywall
   * @param {string} feature - Name of the feature triggering the paywall (for analytics)
   */
  async showPaywall(feature = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Showing paywall for feature: ${feature}`);

      const result = await this.revenueCat.presentPaywall({
        offering: CONFIG.OFFERINGS.DEFAULT,
      });

      // Refresh customer info after paywall dismissal
      await this.refreshCustomerInfo();

      return result;
    } catch (error) {
      console.error('Error showing paywall:', error);
      throw error;
    }
  }

  /**
   * Present paywall only if user doesn't have PRO entitlement
   * This is the recommended approach - RevenueCat handles the check
   */
  async showPaywallIfNeeded(feature = null) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Checking paywall for feature: ${feature}`);

      const result = await this.revenueCat.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: CONFIG.ENTITLEMENTS.PRO,
        offering: CONFIG.OFFERINGS.DEFAULT,
      });

      // Refresh customer info after paywall dismissal
      await this.refreshCustomerInfo();

      return result;
    } catch (error) {
      console.error('Error showing paywall if needed:', error);
      throw error;
    }
  }

  /**
   * Show Customer Center (subscription management)
   * Allows users to manage their subscription, cancel, change plans, etc.
   */
  async showCustomerCenter() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Only show if user has an active subscription
      const hasPremium = await this.hasPremiumAccess();
      if (!hasPremium) {
        console.log('User has no active subscription, showing paywall instead');
        await this.showPaywall('customer_center_access');
        return;
      }

      await this.revenueCat.presentCustomerCenter();

      // Refresh customer info after customer center dismissal
      await this.refreshCustomerInfo();
    } catch (error) {
      console.error('Error showing customer center:', error);
      throw error;
    }
  }

  /**
   * Restore purchases
   * Important for iOS - required by App Store guidelines
   */
  async restorePurchases() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Restoring purchases...');
      const result = await this.revenueCat.restorePurchases();

      await this.refreshCustomerInfo();

      console.log('✅ Purchases restored successfully');
      return result;
    } catch (error) {
      console.error('❌ Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Get subscription status for UI display
   */
  async getSubscriptionStatus() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const customerInfo = await this.refreshCustomerInfo();

      const proEntitlement = customerInfo?.entitlements[CONFIG.ENTITLEMENTS.PRO];
      const isActive = proEntitlement?.isActive || false;

      return {
        isSubscribed: isActive,
        tier: isActive ? 'pro' : 'free',
        productIdentifier: proEntitlement?.productIdentifier || null,
        expirationDate: proEntitlement?.expirationDate || null,
        willRenew: proEntitlement?.willRenew || false,
        periodType: proEntitlement?.periodType || null,
        activeSubscriptions: customerInfo?.activeSubscriptions || [],
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        isSubscribed: false,
        tier: 'free',
        productIdentifier: null,
        expirationDate: null,
        willRenew: false,
        periodType: null,
        activeSubscriptions: [],
      };
    }
  }

  /**
   * Get available packages (products) for display
   */
  getAvailablePackages() {
    if (!this.offerings?.current) {
      return [];
    }

    return this.offerings.current.availablePackages.map((pkg) => ({
      identifier: pkg.identifier,
      productId: pkg.product.identifier,
      title: pkg.product.title,
      description: pkg.product.description,
      price: pkg.product.priceString,
      pricePerMonth: this.calculatePricePerMonth(pkg),
      isMostPopular: pkg.identifier === '$rc_monthly',
      isBestValue: pkg.identifier === '$rc_annual',
    }));
  }

  /**
   * Calculate price per month for comparison
   */
  calculatePricePerMonth(pkg) {
    // This is a simple calculation - RevenueCat SDK provides better methods
    const identifier = pkg.identifier.toLowerCase();
    const price = parseFloat(pkg.product.price);

    if (identifier.includes('annual') || identifier.includes('yearly')) {
      return (price / 12).toFixed(2);
    } else if (identifier.includes('lifetime')) {
      return '0'; // One-time payment
    } else {
      return price.toFixed(2);
    }
  }

  /**
   * Purchase a specific package
   * Note: This is mainly for custom UI - native paywall handles this automatically
   */
  async purchasePackage(packageIdentifier) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`Purchasing package: ${packageIdentifier}`);
      const result = await this.revenueCat.purchasePackage({
        packageIdentifier,
      });

      await this.refreshCustomerInfo();

      console.log('✅ Purchase successful');
      return result;
    } catch (error) {
      console.error('❌ Purchase error:', error);
      throw error;
    }
  }

  /**
   * Check if feature is available based on subscription
   */
  async checkFeatureAccess(feature, currentCount = 0, limit = 0) {
    // If under free tier limit, grant access
    if (currentCount < limit) {
      return true;
    }

    // Check if user has premium subscription
    const hasPremium = await this.hasPremiumAccess();

    if (!hasPremium) {
      // Show paywall for this feature
      await this.showPaywallIfNeeded(feature);
      // Re-check after paywall dismissal
      return await this.hasPremiumAccess();
    }

    return true;
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
export default revenueCatService;
