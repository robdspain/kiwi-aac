const translationCache = new Map();

/**
 * Translates a word or phrase from English to Spanish.
 * Uses MyMemory API (free tier).
 * 
 * @param {string} text - The English text to translate.
 * @returns {Promise<string>} - The Spanish translation.
 */
export const translateWord = async (text) => {
    if (!text || text.trim() === '') return text;

    const trimmedText = text.trim();

    // Check cache first
    if (translationCache.has(trimmedText)) {
        return translationCache.get(trimmedText);
    }

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedText)}&langpair=en|es`
        );
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            const translated = data.responseData.translatedText;
            translationCache.set(trimmedText, translated);
            return translated;
        }

        console.warn('Translation API returned unexpected response:', data);
        return text; // Return original if translation fails
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
};
