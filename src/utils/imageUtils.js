/**
 * Converts an emoji character to its OpenMoji SVG URL.
 * @param {string} emoji - The emoji character (e.g., '🍎')
 * @returns {string} - The URL to the OpenMoji SVG
 */
export const getOpenMojiUrl = (emoji) => {
    if (!emoji) return '';
    
    // Get the hex code of the emoji
    const codes = [];
    for (let i = 0; i < emoji.length; i++) {
        const code = emoji.charCodeAt(i);
        if (code >= 0xD800 && code <= 0xDBFF) {
            const nextCode = emoji.charCodeAt(i + 1);
            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                codes.push(((code - 0xD800) * 0x400 + (nextCode - 0xDC00) + 0x10000).toString(16).toUpperCase());
                i++;
            }
        } else {
            codes.push(code.toString(16).toUpperCase());
        }
    }
    
    const hexCode = codes.join('-');
    return `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/${hexCode}.svg`;
};

/**
 * Returns the fallback icon if an image fails to load.
 */
export const getFallbackIcon = () => '⚪';
