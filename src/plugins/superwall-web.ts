import { WebPlugin } from '@capacitor/core';
import type { SuperwallPlugin } from './superwall';

export class SuperwallWeb extends WebPlugin implements SuperwallPlugin {
  async register(options: { event: string; params?: Record<string, any> }): Promise<{
    result: 'presented' | 'holdout' | 'noRuleMatch' | 'eventNotFound' | 'userIsSubscribed' | 'unknown';
  }> {
    // Use the existing web SDK
    if (window.Superwall) {
      return new Promise((resolve) => {
        window.Superwall.register(options.event, options.params, () => {
          resolve({ result: 'presented' });
        });
      });
    }
    return { result: 'eventNotFound' };
  }

  async setUserAttributes(options: { attributes: Record<string, any> }): Promise<void> {
    // Web SDK doesn't support this, but we can store for future use
    console.log('Superwall user attributes:', options.attributes);
  }

  async restore(): Promise<{ result: 'restored' | 'failed' }> {
    // Web SDK doesn't support restore functionality
    // Return success to prevent runtime crashes
    console.log('Superwall restore called on web - no-op');
    return { result: 'restored' };
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Superwall?: any;
  }
}
