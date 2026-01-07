const DEFAULT_DPI = 96;
const CALIBRATION_KEY = 'kiwi-physical-dpi';

/**
 * Gets the current calibrated DPI or default.
 */
export const getDeviceDPI = () => {
    const saved = localStorage.getItem(CALIBRATION_KEY);
    return saved ? parseFloat(saved) : DEFAULT_DPI;
};

/**
 * Sets the calibrated DPI.
 * @param {number} dpi 
 */
export const setDeviceDPI = (dpi) => {
    localStorage.setItem(CALIBRATION_KEY, dpi.toString());
};

/**
 * Converts physical millimeters to pixels based on current DPI.
 * @param {number} mm 
 * @param {number} [dpi]
 * @returns {number} pixels
 */
export const mmToPixels = (mm, dpi) => {
    const currentDPI = dpi || getDeviceDPI();
    const inches = mm / 25.4;
    return Math.round(inches * currentDPI);
};

/**
 * Estimates DPI from a known physical reference.
 */
export const calculateDPI = (physicalMm, screenPx) => {
    const physicalInches = physicalMm / 25.4;
    return screenPx / physicalInches;
};

// Aliases for compatibility
export const getDPI = getDeviceDPI;
export const mmToPx = mmToPixels;

export default {
    getDeviceDPI,
    setDeviceDPI,
    mmToPixels,
    calculateDPI,
    getDPI,
    mmToPx
};
