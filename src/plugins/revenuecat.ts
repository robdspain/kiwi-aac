import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { RevenueCatUI } from '@revenuecat/purchases-capacitor-ui';

export interface RevenueCatPlugin {
  /**
   * Configure RevenueCat with API key
   */
  configure(options: { apiKey: string; appUserID?: string }): Promise<void>;

  /**
   * Get customer info (subscription status)
   */
  getCustomerInfo(): Promise<{
    activeSubscriptions: string[];
    allPurchasedProductIdentifiers: string[];
    entitlements: Record<string, { isActive: boolean }>;
  }>;

  /**
   * Get available offerings (products/paywalls)
   */
  getOfferings(): Promise<{
    current: {
      availablePackages: Array<{
        identifier: string;
        product: {
          identifier: string;
          description: string;
          title: string;
          price: string;
          priceString: string;
        };
      }>;
    };
  }>;

  /**
   * Purchase a package
   */
  purchasePackage(options: { packageIdentifier: string }): Promise<{
    customerInfo: any;
    productIdentifier: string;
  }>;

  /**
   * Restore purchases
   */
  restorePurchases(): Promise<{
    customerInfo: any;
  }>;

  /**
   * Check if user has an active entitlement
   */
  checkEntitlement(entitlementId: string): Promise<boolean>;

  /**
   * Present native paywall UI
   */
  presentPaywall(options?: { offering?: string }): Promise<{
    customerInfo: any;
  }>;

  /**
   * Present native paywall if needed (only shows if user doesn't have entitlement)
   */
  presentPaywallIfNeeded(options: {
    requiredEntitlementIdentifier: string;
    offering?: string;
  }): Promise<{
    customerInfo: any;
  }>;

  /**
   * Present Customer Center (manage subscriptions)
   */
  presentCustomerCenter(): Promise<void>;
}

// Lazy initialization to prevent circular dependencies
let revenueCatInstance: RevenueCatPlugin | null = null;
let isConfigured = false;

export const getRevenueCat = (): RevenueCatPlugin => {
  if (!revenueCatInstance) {
    revenueCatInstance = {
      configure: async (options) => {
        if (!isConfigured) {
          try {
            await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
            await Purchases.configure({
              apiKey: options.apiKey || (import.meta.env.VITE_REVENUECAT_API_KEY || 'test_GVsVAPHELhFcgnBFbWlVyrYGiUS'),
              appUserID: options.appUserID,
            });
            isConfigured = true;
            console.log('RevenueCat configured successfully');
          } catch (error) {
            console.error('RevenueCat configuration error:', error);
          }
        }
      },

      getCustomerInfo: async () => {
        const { customerInfo } = await Purchases.getCustomerInfo();
        return {
          activeSubscriptions: customerInfo.activeSubscriptions,
          allPurchasedProductIdentifiers: customerInfo.allPurchasedProductIdentifiers,
          entitlements: customerInfo.entitlements.active,
        };
      },

      getOfferings: async () => {
        const { offerings } = await Purchases.getOfferings();
        return {
          current: {
            availablePackages: offerings.current?.availablePackages || [],
          },
        };
      },

      purchasePackage: async (options) => {
        // Get the package from offerings first
        const { offerings } = await Purchases.getOfferings();
        const pkg = offerings.current?.availablePackages.find(
          (p) => p.identifier === options.packageIdentifier
        );

        if (!pkg) {
          throw new Error(`Package ${options.packageIdentifier} not found`);
        }

        const result = await Purchases.purchasePackage({ aPackage: pkg });
        return {
          customerInfo: result.customerInfo,
          productIdentifier: result.productIdentifier,
        };
      },

      restorePurchases: async () => {
        const result = await Purchases.restorePurchases();
        return {
          customerInfo: result.customerInfo,
        };
      },

      checkEntitlement: async (entitlementId: string) => {
        try {
          const { customerInfo } = await Purchases.getCustomerInfo();
          const entitlement = customerInfo.entitlements.active[entitlementId];
          return entitlement?.isActive || false;
        } catch (error) {
          console.error('Error checking entitlement:', error);
          return false;
        }
      },

      presentPaywall: async (options = {}) => {
        try {
          const result = await RevenueCatUI.presentPaywall({
            offering: options.offering,
          });
          return {
            customerInfo: result.customerInfo,
          };
        } catch (error) {
          console.error('Error presenting paywall:', error);
          throw error;
        }
      },

      presentPaywallIfNeeded: async (options) => {
        try {
          const result = await RevenueCatUI.presentPaywallIfNeeded({
            requiredEntitlementIdentifier: options.requiredEntitlementIdentifier,
            offering: options.offering,
          });
          return {
            customerInfo: result.customerInfo,
          };
        } catch (error) {
          console.error('Error presenting paywall if needed:', error);
          throw error;
        }
      },

      presentCustomerCenter: async () => {
        try {
          await RevenueCatUI.presentCustomerCenter();
        } catch (error) {
          console.error('Error presenting customer center:', error);
          throw error;
        }
      },
    };
  }
  return revenueCatInstance;
};

// Export the getter, NOT the instance
export default { get: getRevenueCat };
