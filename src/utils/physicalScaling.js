import { Capacitor } from '@capacitor/core';

/**
 * Physical Scaling Utilities for Kiwi AAC
 * 
 * Ensures touch targets are sized in actual millimeters on physical device screens,
 * not just logical pixels. This is critical for motor accessibility compliance.
 * 
 * @module physicalScaling
 */

/**
 * Device-specific DPI overrides for accurate physical sizing
 * Values are in Pixels Per Inch (PPI/DPI)
 */
const DPI_OVERRIDES = {
    // iPhone models
    'iPhone 14 Pro Max': 460,
    'iPhone 14 Pro': 460,
    'iPhone 14 Plus': 458,
    'iPhone 14': 460,
    'iPhone 13 Pro Max': 458,
    'iPhone 13 Pro': 460,
    'iPhone 13': 460,
    'iPhone 13 mini': 476,
    'iPhone 12 Pro Max': 458,
    'iPhone 12 Pro': 460,
    'iPhone 12': 460,
    'iPhone 12 mini': 476,
    'iPhone SE': 326,
    'iPhone 11': 326,
    'iPhone XR': 326,
    'iPhone X': 458,

    // iPad models
    'iPad Pro 12.9': 264,
    'iPad Pro 11': 264,
    'iPad Air': 264,
    'iPad': 264,
    'iPad mini': 326,

    // Common Android devices
    'Pixel 7 Pro': 512,
    'Pixel 7': 416,
    'Pixel 6 Pro': 512,
    'Pixel 6': 411,
    'Galaxy S23 Ultra': 500,
    'Galaxy S23': 425,
    'Galaxy S22': 425,
    'Galaxy S21': 421,
    'OnePlus 11': 525,
    'OnePlus 10 Pro': 525,
};

/**
 * Get device model from user agent or Capacitor
 * 
 * @returns {string|null} Device model name or null if unknown
 * @example
 * const model = getDeviceModel(); // "iPhone 13 Pro"
 */
function getDeviceModel() {
    const ua = navigator.userAgent;

    // Check for iPhone/iPad
    if (/iPhone/.test(ua)) {
        // Try to extract model from user agent
        for (const model of Object.keys(DPI_OVERRIDES)) {
            if (model.startsWith('iPhone') && ua.includes(model.replace('iPhone ', ''))) {
                return model;
            }
        }
    }

    if (/iPad/.test(ua)) {
        // iPad Pro detection
        if (ua.includes('iPad Pro')) {
            if (screen.width === 1024 || screen.height === 1024) return 'iPad Pro 11';
            if (screen.width === 1366 || screen.height === 1366) return 'iPad Pro 12.9';
        }
        return 'iPad';
    }

    // Check for Android devices
    if (/Android/.test(ua)) {
        for (const model of Object.keys(DPI_OVERRIDES)) {
            if (ua.includes(model)) {
                return model;
            }
        }
    }

    return null;
}

/**
 * Get DPI for common devices from database
 * 
 * @param {string} userAgent - Navigator user agent string
 * @returns {number|null} Device DPI or null if unknown
 * @example
 * const dpi = getCommonDeviceDPI(navigator.userAgent); // 460 for iPhone 13 Pro
 */
export function getCommonDeviceDPI(userAgent = navigator.userAgent) {
    const model = getDeviceModel();
    if (model && DPI_OVERRIDES[model]) {
        return DPI_OVERRIDES[model];
    }
    return null;
}

/**
 * Detect device DPI using multiple methods
 * 
 * Priority:
 * 1. Device-specific override (most accurate)
 * 2. devicePixelRatio × CSS baseline (96 DPI)
 * 3. Screen dimensions validation
 * 4. Fallback to 160 DPI (common Android default)
 * 
 * @returns {number} Detected DPI value
 * @example
 * const dpi = getDeviceDPI(); // 326 for iPhone SE
 * console.log(`Device DPI: ${dpi}`);
 */
export function getDeviceDPI() {
    // 1. Try device-specific override (most accurate)
    const deviceOverride = getCommonDeviceDPI();
    if (deviceOverride) {
        console.log(`Using device-specific DPI: ${deviceOverride}`);
        return deviceOverride;
    }

    // 2. Calculate from devicePixelRatio
    // CSS uses 96 DPI as baseline, multiply by device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;
    const cssDPI = Math.round(devicePixelRatio * 96);

    // 3. Validate with screen dimensions
    const screenWidthInches = screen.width / cssDPI;
    const screenHeightInches = screen.height / cssDPI;

    // Sanity check: most phones/tablets are 4-15 inches diagonal
    const isReasonable = (screenWidthInches >= 2 && screenWidthInches <= 20) &&
        (screenHeightInches >= 3 && screenHeightInches <= 25);

    if (isReasonable) {
        console.log(`Calculated DPI from devicePixelRatio: ${cssDPI}`);
        return cssDPI;
    }

    // 4. Fallback to common default
    console.warn('DPI detection failed, using fallback: 160');
    return 160; // Common Android MDPI
}

/**
 * Convert millimeters to pixels based on device DPI
 * 
 * Uses standard conversion: 1 inch = 25.4mm
 * 
 * @param {number} mm - Measurement in millimeters
 * @param {number} [dpi=160] - Device DPI (pixels per inch)
 * @returns {number} Equivalent measurement in pixels (rounded)
 * @example
 * const dpi = 326; // iPhone Retina
 * const pixels = mmToPixels(10, dpi); // 128 pixels
 * 
 * // 10mm button on iPhone
 * const buttonSize = mmToPixels(10, 326); // ~128px
 */
export function mmToPixels(mm, dpi = 160) {
    if (typeof mm !== 'number' || mm < 0) {
        console.warn('Invalid mm value:', mm);
        return 0;
    }

    if (typeof dpi !== 'number' || dpi <= 0) {
        console.warn('Invalid DPI value:', dpi);
        dpi = 160;
    }

    // Convert mm to inches, then to pixels
    const inches = mm / 25.4;
    const pixels = inches * dpi;

    return Math.round(pixels);
}

/**
 * Convert pixels to millimeters based on device DPI
 * 
 * Uses standard conversion: 1 inch = 25.4mm
 * 
 * @param {number} pixels - Measurement in pixels
 * @param {number} [dpi=160] - Device DPI (pixels per inch)
 * @returns {number} Equivalent measurement in millimeters
 * @example
 * const dpi = 326; // iPhone Retina
 * const mm = pixelsToMm(128, dpi); // ~10mm
 * 
 * // Verify button size
 * const actualMm = pixelsToMm(128, 326); // 9.97mm ≈ 10mm
 */
export function pixelsToMm(pixels, dpi = 160) {
    if (typeof pixels !== 'number' || pixels < 0) {
        console.warn('Invalid pixels value:', pixels);
        return 0;
    }

    if (typeof dpi !== 'number' || dpi <= 0) {
        console.warn('Invalid DPI value:', dpi);
        dpi = 160;
    }

    // Convert pixels to inches, then to mm
    const inches = pixels / dpi;
    const mm = inches * 25.4;

    return mm;
}

/**
 * Calibrate DPI based on user measurement
 * 
 * When user measures a known size (e.g., 50mm ruler) and reports actual measurement,
 * calculate the correct DPI for their device.
 * 
 * @param {number} expectedMm - Expected measurement in mm (what we told user)
 * @param {number} measuredPixels - Actual pixel size rendered on screen
 * @returns {number} Calibrated DPI value
 * @example
 * // We showed a 50mm line that rendered as 200 pixels
 * // User measured it with ruler and it was actually 40mm
 * const calibratedDPI = calibrateDPI(50, 200);
 * // Returns DPI that makes 200px = 50mm on this device
 */
export function calibrateDPI(expectedMm, measuredPixels) {
    if (expectedMm <= 0 || measuredPixels <= 0) {
        console.warn('Invalid calibration values:', { expectedMm, measuredPixels });
        return 160;
    }

    // If user says 50mm line is correct, pixels/mm ratio tells us DPI
    const inches = expectedMm / 25.4;
    const calibratedDPI = Math.round(measuredPixels / inches);

    // Sanity check: DPI should be between 96 and 600
    if (calibratedDPI < 96 || calibratedDPI > 600) {
        console.warn('Calibrated DPI out of range:', calibratedDPI);
        return Math.max(96, Math.min(600, calibratedDPI));
    }

    return calibratedDPI;
}

/**
 * Get physical screen dimensions in millimeters
 * 
 * @param {number} [dpi] - Device DPI (auto-detected if not provided)
 * @returns {{width: number, height: number}} Screen dimensions in mm
 * @example
 * const dimensions = getScreenDimensionsMm();
 * console.log(`Screen: ${dimensions.width}mm × ${dimensions.height}mm`);
 * // iPhone 13 Pro: ~143mm × 310mm (6.1" diagonal)
 */
export function getScreenDimensionsMm(dpi) {
    const detectedDPI = dpi || getDeviceDPI();

    return {
        width: pixelsToMm(screen.width, detectedDPI),
        height: pixelsToMm(screen.height, detectedDPI)
    };
}

/**
 * Calculate diagonal screen size in inches
 * 
 * @param {number} [dpi] - Device DPI (auto-detected if not provided)
 * @returns {number} Screen diagonal in inches
 * @example
 * const diagonal = getScreenDiagonalInches();
 * console.log(`${diagonal.toFixed(1)}" screen`); // "6.1" screen"
 */
export function getScreenDiagonalInches(dpi) {
    const detectedDPI = dpi || getDeviceDPI();

    const widthInches = screen.width / detectedDPI;
    const heightInches = screen.height / detectedDPI;

    // Pythagorean theorem
    const diagonal = Math.sqrt(widthInches ** 2 + heightInches ** 2);

    return diagonal;
}

/**
 * Validate if DPI value is reasonable
 * 
 * @param {number} dpi - DPI value to validate
 * @returns {boolean} True if DPI is in expected range
 * @example
 * isValidDPI(326); // true (iPhone Retina)
 * isValidDPI(50);  // false (too low)
 * isValidDPI(800); // false (too high)
 */
export function isValidDPI(dpi) {
    return typeof dpi === 'number' && dpi >= 96 && dpi <= 600;
}

/**
 * Format DPI value for display
 * 
 * @param {number} dpi - DPI value
 * @param {boolean} [showCalibrated=false] - Whether to show "(Calibrated)" suffix
 * @returns {string} Formatted DPI string
 * @example
 * formatDPI(326); // "326 DPI"
 * formatDPI(326, true); // "326 DPI (Calibrated)"
 */
export function formatDPI(dpi, showCalibrated = false) {
    if (!isValidDPI(dpi)) {
        return 'Auto';
    }

    let formatted = `${dpi} DPI`;
    if (showCalibrated) {
        formatted += ' (Calibrated)';
    }

    return formatted;
}
