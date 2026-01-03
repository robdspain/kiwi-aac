import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export const configureRevenueCat = async () => {
  if (Capacitor.getPlatform() === 'web') {
    console.log('RevenueCat: Web platform detected. Native purchases disabled.');
    return;
  }

  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    
    const apiKey = Capacitor.getPlatform() === 'ios' 
      ? 'test_GVsVAPHELhFcgnBFbWlVyrYGiUS' 
      : 'test_GVsVAPHELhFcgnBFbWlVyrYGiUS'; // Using provided test keys

    await Purchases.configure({ apiKey });
    console.log('RevenueCat: Configured successfully');
  } catch (error) {
    console.error('RevenueCat: Configuration failed', error);
  }
};

export default Purchases;
