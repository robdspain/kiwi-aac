import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

/**
 * Biometric Authentication Utilities for Kiwi AAC
 * 
 * Provides FaceID, TouchID, and Fingerprint authentication for securing adult settings
 * while maintaining guaranteed accessibility through triple-tap fallback.
 * 
 * @module biometricAuth
 * @see {@link https://github.com/capacitor-community/capacitor-native-biometric}
 */

/**
 * Check if biometric authentication is available on this device
 * 
 * Only returns true on native platforms (iOS/Android) with biometric hardware.
 * Web platforms always return false.
 * 
 * @async
 * @returns {Promise<boolean>} True if biometric hardware is available and enabled
 * @example
 * const available = await isBiometricAvailable();
 * if (available) {
 *   // Show biometric toggle in settings
 * }
 */
export async function isBiometricAvailable() {
    // Only available on native platforms (iOS/Android)
    if (!Capacitor.isNativePlatform()) {
        return false;
    }

    try {
        const result = await NativeBiometric.isAvailable();
        return result.isAvailable || false;
    } catch (error) {
        console.warn('Biometric availability check failed:', error);
        return false;
    }
}

/**
 * Get the type of biometric authentication available
 * 
 * Detects the specific biometric type (FaceID, TouchID, Fingerprint) for
 * display in the UI.
 * 
 * @async
 * @returns {Promise<string>} Biometric type: 'faceId', 'touchId', 'fingerprint', 'biometric', or 'none'
 * @example
 * const type = await getBiometricType();
 * console.log(`Device has ${type}`); // "Device has FaceID"
 */
export async function getBiometricType() {
    if (!Capacitor.isNativePlatform()) {
        return 'none';
    }

    try {
        const result = await NativeBiometric.isAvailable();
        if (!result.isAvailable) return 'none';

        // BiometryType enum: 0 = none, 1 = touchId, 2 = faceId, 3 = fingerprint
        switch (result.biometryType) {
            case 1: return 'touchId';
            case 2: return 'faceId';
            case 3: return 'fingerprint';
            default: return 'biometric';
        }
    } catch (error) {
        console.warn('Biometric type check failed:', error);
        return 'none';
    }
}

/**
 * Authenticate user with biometric (FaceID/TouchID/Fingerprint)
 * 
 * Prompts the user for biometric authentication. On failure or cancellation,
 * the triple-tap fallback should be used.
 * 
 * @async
 * @param {Object} options - Authentication options
 * @param {string} [options.reason='Authenticate to access Adult Settings'] - Reason shown to user
 * @param {string} [options.title='Kiwi Voice'] - Dialog title
 * @returns {Promise<{success: boolean, error?: any, cancelled?: boolean}>} Authentication result
 * @example
 * const result = await authenticateWithBiometric({
 *   reason: 'Unlock settings',
 *   title: 'Kiwi Voice Security'
 * });
 * 
 * if (result.success) {
 *   // Unlock settings
 * } else if (result.cancelled) {
 *   // Show triple-tap hint
 * }
 */
export async function authenticateWithBiometric(options = {}) {
    const {
        reason = 'Authenticate to access Adult Settings',
        title = 'Kiwi Voice'
    } = options;

    try {
        await NativeBiometric.verifyIdentity({
            reason,
            title,
            subtitle: 'Protect your communication setup',
            description: 'Use FaceID or TouchID to unlock settings',
            negativeButtonText: 'Cancel',
            maxAttempts: 3
        });

        return { success: true };
    } catch (error) {
        // User cancelled or authentication failed
        console.log('Biometric authentication failed:', error);
        return {
            success: false,
            error,
            cancelled: error.code === 10 || error.message?.includes('cancel')
        };
    }
}

/**
 * Check if a biometric session is still valid
 * 
 * Sessions are used to avoid repeated authentication prompts. After successful
 * authentication, the session remains valid for a specified duration (default 5 minutes).
 * 
 * @param {number|null} unlockTimestamp - Timestamp when session was created (from Date.now())
 * @param {number} [durationMs=300000] - Session duration in milliseconds (default: 5 minutes)
 * @returns {boolean} True if session is still valid
 * @example
 * const timestamp = Date.now();
 * // ... 2 minutes later ...
 * if (isSessionValid(timestamp, 5 * 60 * 1000)) {
 *   // Session still valid, skip biometric prompt
 * }
 */
export function isSessionValid(unlockTimestamp, durationMs = 5 * 60 * 1000) {
    if (!unlockTimestamp) return false;

    const now = Date.now();
    return (now - unlockTimestamp) < durationMs;
}

/**
 * Format biometric type for display
 * 
 * Converts internal biometric type codes to user-friendly display names.
 * 
 * @param {string} type - Biometric type from getBiometricType()
 * @returns {string} Human-readable biometric type
 * @example
 * const formatted = formatBiometricType('faceId');
 * console.log(formatted); // "FaceID"
 */
export function formatBiometricType(type) {
    switch (type) {
        case 'faceId': return 'FaceID';
        case 'touchId': return 'TouchID';
        case 'fingerprint': return 'Fingerprint';
        case 'biometric': return 'Biometric';
        default: return 'None';
    }
}
