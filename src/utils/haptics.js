import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const triggerHaptic = async (style = 'medium') => {
    try {
        if (Capacitor.isNativePlatform()) {
            await Haptics.impact({ style: ImpactStyle[style.toUpperCase()] || ImpactStyle.Medium });
        } else {
            // Web Fallback
            if (navigator.vibrate) {
                navigator.vibrate(style === 'heavy' ? 20 : 10);
            }
        }
    } catch (e) {
        console.warn('Haptic trigger failed', e);
    }
};

export const triggerNotification = async (type = 'success') => {
     try {
        if (Capacitor.isNativePlatform()) {
            await Haptics.notification({ type: type.toUpperCase() });
        } else {
            // Web Fallback
            if (navigator.vibrate) {
                if (type === 'error') navigator.vibrate([50, 50, 50]);
                else navigator.vibrate(50);
            }
        }
    } catch (e) {
        console.warn('Haptic notification failed', e);
    }
};
