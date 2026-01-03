import { registerPlugin } from '@capacitor/core';

export interface SuperwallPlugin {
  /**
   * Register an event with Superwall to potentially show a paywall
   * @param options - Event name and optional parameters
   */
  register(options: { event: string; params?: Record<string, any> }): Promise<{
    result: 'presented' | 'holdout' | 'noRuleMatch' | 'eventNotFound' | 'userIsSubscribed' | 'unknown';
  }>;

  /**
   * Set user attributes for targeting
   * @param options - User attributes object
   */
  setUserAttributes(options: { attributes: Record<string, any> }): Promise<void>;

  /**
   * Restore purchases
   */
  restore(): Promise<{ result: 'restored' | 'failed' }>;
}

// Lazy initialization to prevent circular dependencies
// The plugin is only registered when first accessed, not at module load time
let superwallInstance: SuperwallPlugin | null = null;

export const getSuperwall = (): SuperwallPlugin => {
  if (!superwallInstance) {
    superwallInstance = registerPlugin<SuperwallPlugin>('Superwall', {
      web: () => import('./superwall-web').then(m => new m.SuperwallWeb()),
    });
  }
  return superwallInstance;
};

// Export the getter, NOT the instance
export default { get: getSuperwall };
