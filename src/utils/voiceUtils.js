/**
 * Reliable voice loading and selection utilities
 */

/**
 * Ensures voices are loaded from the Web Speech API.
 * Polling is used as a fallback for browsers where 'voiceschanged' is unreliable.
 */
export async function getVoicesReady(timeoutMs = 2000) {
    const synth = window.speechSynthesis;
    if (!synth) return [];

    let voices = synth.getVoices();
    if (voices?.length) return voices;

    return await new Promise((resolve) => {
        const start = performance.now();

        const finish = () => {
            const v = synth.getVoices();
            resolve(v || []);
            synth.removeEventListener?.("voiceschanged", onChanged);
            clearInterval(poll);
        };

        const onChanged = () => finish();

        // Some browsers populate later
        synth.addEventListener?.("voiceschanged", onChanged);

        // Poll as a fallback (handles cases where event is unreliable)
        const poll = setInterval(() => {
            const v = synth.getVoices();
            if (v?.length) finish();
            if (performance.now() - start > timeoutMs) finish();
        }, 100);
    });
}

/**
 * Scores and picks the best available voice for a given locale.
 * Prioritizes high-quality (enhanced/premium) and local services.
 */
export function pickBestVoice(voices, preferredLocale = "en-US") {
    const normLocale = (s) => (s || "").toLowerCase();

    const score = (v) => {
        const lang = normLocale(v.lang);
        const name = (v.name || "").toLowerCase();

        let s = 0;
        // Locale matching
        if (lang === normLocale(preferredLocale)) s += 100;
        if (lang.replace('_', '-').startsWith(normLocale(preferredLocale).split("-")[0])) s += 50;

        // Quality heuristics
        if (name.includes("enhanced")) s += 30;
        if (name.includes("premium")) s += 25;
        if (name.includes("neural")) s += 25;
        if (name.includes("siri")) s += 20;

        if (v.localService) s += 10; // on-device tends to be more reliable offline
        if (v.default) s += 5;

        return s;
    };

    return [...voices].sort((a, b) => score(b) - score(a))[0] || null;
}

/**
 * Ensures a valid default voice is selected and saved if missing.
 */
export async function ensureDefaultVoice(currentVoiceURI, preferredLocale = "en-US") {
    const voices = await getVoicesReady();
    
    const stillExists = currentVoiceURI && voices.some(v => v.voiceURI === currentVoiceURI);
    if (stillExists) return currentVoiceURI;

    const best = pickBestVoice(voices, preferredLocale);
    return best?.voiceURI || null;
}

/**
 * Checks if a voice is likely "high quality" based on naming conventions.
 */
export function isHighQualityVoice(voice) {
    if (!voice) return false;
    const name = (voice.name || "").toLowerCase();
    return name.includes("enhanced") || 
           name.includes("premium") || 
           name.includes("neural") || 
           name.includes("siri");
}
