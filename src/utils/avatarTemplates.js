/**
 * Curated Avatar Seed Collections
 * 
 * Each category contains hand-picked seeds that generate avatars
 * with specific characteristics (style, tone, hair).
 */

export const AVATAR_STYLES = {
    friendly: {
        label: '😊 Friendly',
        seeds: [
            'warm-sarah-smile',
            'gentle-dave-kind',
            'sweet-emma-joy',
            'caring-mom-love',
            'friendly-dad-happy',
            'warm-grandma-hug',
            'kind-teacher-help',
            'gentle-nurse-care',
            'happy-friend-smile',
            'cheerful-neighbor-wave',
            'loving-aunt-embrace',
            'caring-coach-support'
        ]
    },
    cool: {
        label: '😎 Cool',
        seeds: [
            'shades-mike-modern',
            'trendy-alex-style',
            'cool-jordan-vibe',
            'hip-sam-fresh',
            'modern-taylor-chic',
            'stylish-casey-sleek',
            'urban-riley-street',
            'edgy-morgan-bold',
            'slick-jamie-smooth',
            'rad-skylar-awesome',
            'fresh-avery-new',
            'dope-charlie-fly'
        ]
    },
    professional: {
        label: '💼 Professional',
        seeds: [
            'business-executive-suit',
            'formal-leader-corporate',
            'professional-manager-work',
            'office-director-smart',
            'corporate-boss-sharp',
            'business-consultant-expert',
            'formal-professor-academic',
            'professional-doctor-med',
            'office-lawyer-attorney',
            'corporate-analyst-data',
            'business-accountant-finance',
            'formal-engineer-tech'
        ]
    },
    playful: {
        label: '🎨 Playful',
        seeds: [
            'fun-bright-colors',
            'colorful-happy-joy',
            'energetic-kid-play',
            'vibrant-child-fun',
            'bright-youth-smile',
            'playful-teen-silly',
            'fun-spirit-laugh',
            'colorful-personality-unique',
            'energetic-vibe-positive',
            'vibrant-soul-creative',
            'bright-mind-imaginative',
            'playful-heart-cheerful'
        ]
    }
};

export const TONE_CATEGORIES = {
    light: {
        label: '🌟 Light',
        keywords: ['fair', 'light', 'pale', 'cream', 'ivory', 'peach']
    },
    medium: {
        label: '☀️ Medium',
        keywords: ['medium', 'tan', 'olive', 'beige', 'natural']
    },
    dark: {
        label: '✨ Dark',
        keywords: ['dark', 'deep', 'rich', 'chocolate', 'ebony', 'bronze']
    }
};

export const HAIR_CATEGORIES = {
    short: {
        label: '✂️ Short',
        keywords: ['short', 'buzz', 'cropped', 'trim', 'neat']
    },
    long: {
        label: '💇 Long',
        keywords: ['long', 'flowing', 'wavy', 'curly', 'locks']
    },
    bald: {
        label: '⭐ Bald',
        keywords: ['bald', 'shaved', 'minimal', 'clean', 'smooth']
    }
};

/**
 * Generate expanded seed set by combining base seeds with modifiers
 */
export function generateSeedVariations(baseSeed, count = 5) {
    const modifiers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    return modifiers.slice(0, count).map(mod => `${baseSeed}-${mod}`);
}

/**
 * Get all seeds for a specific style
 */
export function getSeedsForStyle(styleName) {
    const style = AVATAR_STYLES[styleName];
    if (!style) return [];

    // Expand each base seed into variations
    return style.seeds.flatMap(seed => [seed, ...generateSeedVariations(seed, 3)]);
}

/**
 * Simple heuristic to detect potential tone from SVG
 * (This is approximate - multiavatar doesn't expose this info)
 */
export function detectToneFromSVG(svgCode) {
    // Look for common skin tone hex colors in the SVG
    const lightPattern = /#[Ff][FfEeDdCc][EeDdCcBbAa][A-Fa-f0-9]{3}/g;
    const darkPattern = /#[0-9A-Fa-f]{1,2}[0-5][0-9A-Fa-f]{4}/g;

    const lightMatches = (svgCode.match(lightPattern) || []).length;
    const darkMatches = (svgCode.match(darkPattern) || []).length;

    if (lightMatches > darkMatches * 1.5) return 'light';
    if (darkMatches > lightMatches * 1.5) return 'dark';
    return 'medium';
}

/**
 * Simple heuristic to detect hair style from seed name
 * (Multiavatar doesn't expose this, so we use seed keywords)
 */
export function detectHairFromSeed(seed) {
    const lowerSeed = seed.toLowerCase();

    if (HAIR_CATEGORIES.bald.keywords.some(kw => lowerSeed.includes(kw))) {
        return 'bald';
    }
    if (HAIR_CATEGORIES.long.keywords.some(kw => lowerSeed.includes(kw))) {
        return 'long';
    }
    return 'short'; // Default
}
