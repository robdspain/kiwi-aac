const translationCache = new Map();

/**
 * Local dictionary for instant AAC language mirroring.
 * Keeps core vocabulary positions stable across languages.
 */
export const MIRROR_DICTIONARY = {
    // Core
    'i want': { es: 'quiero' },
    'i see': { es: 'veo' },
    'i feel': { es: 'me siento' },
    'i have': { es: 'tengo' },
    'i like': { es: 'me gusta' },
    'more': { es: 'más' },
    'yes': { es: 'sí' },
    'no': { es: 'no' },
    'help': { es: 'ayuda' },
    'stop': { es: 'parar' },
    'go': { es: 'ir' },
    'please': { es: 'por favor' },
    'thank you': { es: 'gracias' },
    'all done': { es: 'terminado' },
    // People
    'mom': { es: 'mamá' },
    'dad': { es: 'papá' },
    'teacher': { es: 'maestra' },
    'friend': { es: 'amigo' },
    // Actions
    'eat': { es: 'comer' },
    'drink': { es: 'beber' },
    'play': { es: 'jugar' },
    'sleep': { es: 'dormir' },
    'wash': { es: 'lavar' },
    'brush': { es: 'cepillar' },
    // Common Nouns
    'water': { es: 'agua' },
    'juice': { es: 'jugo' },
    'milk': { es: 'leche' },
    'cookie': { es: 'galleta' },
    'apple': { es: 'manzana' },
    'banana': { es: 'plátano' },
    'snack': { es: 'merienda' },
    'toy': { es: 'juguete' },
    'ball': { es: 'pelota' },
    'book': { es: 'libro' },
    'car': { es: 'carro' },
    'bathroom': { es: 'baño' },
    'park': { es: 'parque' },
    'home': { es: 'casa' },
    'school': { es: 'escuela' },
    // Feelings
    'happy': { es: 'feliz' },
    'sad': { es: 'triste' },
    'angry': { es: 'enojado' },
    'mad': { es: 'enfadado' },
    'scared': { es: 'asustado' },
    'tired': { es: 'cansado' },
    'hurt': { es: 'lastimado' },
    // Describe
    'big': { es: 'grande' },
    'little': { es: 'pequeño' },
    'hot': { es: 'caliente' },
    'cold': { es: 'frío' },
    'fast': { es: 'rápido' },
    'slow': { es: 'lento' },
    'good': { es: 'bueno' },
    'bad': { es: 'malo' },
    'red': { es: 'rojo' },
    'blue': { es: 'azul' },
    'green': { es: 'verde' },
    'yellow': { es: 'amarillo' },
    // Questions
    'what': { es: 'qué' },
    'where': { es: 'dónde' },
    'who': { es: 'quién' },
    'why': { es: 'por qué' }
};

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
