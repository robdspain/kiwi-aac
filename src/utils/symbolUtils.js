/**
 * Utility for managing and pre-caching Symbols.
 */

// 50 Base Symbols for Kiwi Voice
export const BASE_SYMBOL_SET = [
    "I", "want", "more", "stop", "go", "help", "eat", "drink", "play", "sleep",
    "yes", "no", "please", "thank you", "hello", "goodbye", "toilet", "bath", "book", "car",
    "happy", "sad", "angry", "mad", "scared", "tired", "sick", "hot", "cold", "big",
    "little", "fast", "slow", "loud", "quiet", "good", "bad", "up", "down", "in",
    "out", "on", "off", "who", "what", "where", "when", "why", "how", "finished"
];

/**
 * Pre-caches the base symbol set for offline use.
 * This should be called on app initialization or onboarding.
 */
export async function precacheBaseSymbols() {
    const isCached = localStorage.getItem('kiwi-symbols-precached');
    if (isCached) return;

    console.log('📦 Starting pre-cache of base 50 symbols...');
    
    // Process in small batches to avoid rate limiting or UI lag
    const batchSize = 5;
    for (let i = 0; i < BASE_SYMBOL_SET.length; i += batchSize) {
        const batch = BASE_SYMBOL_SET.slice(i, i + batchSize);
        await Promise.all(batch.map(async (word) => {
            try {
                const response = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${word}`);
                if (!response.ok) return;
                
                const data = await response.json();
                if (data && data[0]) {
                    // Pre-load the image to fill browser cache
                    const img = new Image();
                    img.src = `https://static.arasaac.org/pictograms/${data[0]._id}/${data[0]._id}_300.png`;
                }
            } catch (error) {
                console.warn(`Failed to pre-cache symbol: ${word}`, error);
            }
        }));
    }

    localStorage.setItem('kiwi-symbols-precached', 'true');
    console.log('✅ Base 50 symbols cached successfully');
}
