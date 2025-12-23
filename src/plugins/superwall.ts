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

const Superwall = registerPlugin<SuperwallPlugin>('Superwall', {
  web: () => import('./superwall-web').then(m => new m.SuperwallWeb()),
});

export default Superwall;
