import { Purchases } from '@revenuecat/purchases-capacitor';

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
}

// Lazy initialization to prevent circular dependencies
let revenueCatInstance: RevenueCatPlugin | null = null;
let isConfigured = false;

export const getRevenueCat = (): RevenueCatPlugin => {
  if (!revenueCatInstance) {
    revenueCatInstance = {
      configure: async (options) => {
        if (!isConfigured) {
          await Purchases.configure({
            apiKey: options.apiKey,
            appUserID: options.appUserID,
          });
          isConfigured = true;
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
    };
  }
  return revenueCatInstance;
};

// Export the getter, NOT the instance
export default { get: getRevenueCat };
