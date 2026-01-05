/**
 * DiceBear Avatar Generator Utility
 * 
 * Provides functions for generating customizable avatars using DiceBear's Big Smile style.
 * Supports skin tone, hair style/color, accessories, and background customization.
 */

import { createAvatar } from '@dicebear/core';
import * as bigSmile from '@dicebear/big-smile';

// Skin tone variants (light to dark)
export const SKIN_TONES = {
    light: 'variant01',
    'light-medium': 'variant02',
    medium: 'variant03',
    'medium-dark': 'variant04',
    dark: 'variant05'
};

export const SKIN_TONE_LABELS = {
    light: '🌟 Light',
    'light-medium': '☀️ Fair',
    medium: '🌞 Medium',
    'medium-dark': '🌅 Tan',
    dark: '✨ Dark'
};

// Hair style variants
export const HAIR_STYLES = {
    short: 'short01',
    'short-2': 'short02',
    'short-3': 'short03',
    long: 'long01',
    'long-2': 'long02',
    bun: 'bun',
    bald: 'bald'
};

export const HAIR_STYLE_LABELS = {
    short: '✂️ Short',
    long: '💇 Long',
    bald: '⭐ Bald'
};

// Hair color variants
export const HAIR_COLORS = {
    black: 'black',
    brown: 'brown',
    blonde: 'blonde',
    red: 'red',
    auburn: 'auburn',
    platinum: 'platinum'
};

export const HAIR_COLOR_LABELS = {
    black: '⚫ Black',
    brown: '🟤 Brown',
    blonde: '🟡 Blonde',
    red: '🔴 Red',
    auburn: '🟠 Auburn',
    platinum: '⚪ Platinum'
};

// Accessory options
export const ACCESSORIES = {
    none: 'none',
    glasses1: 'glasses01',
    glasses2: 'glasses02',
    glasses3: 'glasses03'
};

// Facial hair options
export const FACIAL_HAIR = {
    none: 'none',
    beard1: 'beard01',
    beard2: 'beard02',
    mustache: 'mustache'
};

// Background colors
export const BACKGROUND_COLORS = [
    '#ffdfbf', // Peach
    '#c0aede', // Purple
    '#d1d4f9', // Blue
    '#ffd5dc', // Pink
    '#b6e3d4', // Mint
    '#ffd89b', // Yellow
    '#dfe7fd', // Sky
    '#ffe4e1'  // Rose
];

/**
 * Generate a DiceBear avatar with custom options
 * 
 * @param {Object} options - Avatar customization options
 * @param {string} options.seed - Unique seed for avatar (e.g., name)
 * @param {string} options.skinTone - Skin tone variant (light, medium, dark)
 * @param {string} options.hairStyle - Hair style (short, long, bald)
 * @param {string} options.hairColor - Hair color (blonde, brown, black, etc.)
 * @param {boolean} options.glasses - Whether to add glasses
 * @param {boolean} options.facialHair - Whether to add facial hair
 * @param {string} options.backgroundColor - Background hex color
 * @returns {string} Data URL of generated SVG avatar
 */
export function generateAvatar(options = {}) {
    const {
        seed = 'Avatar',
        skinTone = 'medium',
        hairStyle = 'short',
        hairColor = 'brown',
        glasses = false,
        facialHair = false,
        backgroundColor = '#ffdfbf'
    } = options;

    // Map simple options to DiceBear parameters
    const dicebearOptions = {
        seed,
        skinColor: [SKIN_TONES[skinTone] || SKIN_TONES.medium],
        hair: [HAIR_STYLES[hairStyle] || HAIR_STYLES.short],
        hairColor: [HAIR_COLORS[hairColor] || HAIR_COLORS.brown],
        backgroundColor: [backgroundColor]
    };

    // Add accessories if enabled
    if (glasses) {
        dicebearOptions.accessories = [ACCESSORIES.glasses1];
        dicebearOptions.accessoriesProbability = 100;
    } else {
        dicebearOptions.accessories = [ACCESSORIES.none];
        dicebearOptions.accessoriesProbability = 0;
    }

    // Add facial hair if enabled
    if (facialHair) {
        dicebearOptions.facialHair = [FACIAL_HAIR.beard1];
        dicebearOptions.facialHairProbability = 100;
    } else {
        dicebearOptions.facialHair = [FACIAL_HAIR.none];
        dicebearOptions.facialHairProbability = 0;
    }

    const avatar = createAvatar(bigSmile, dicebearOptions);
    return avatar.toDataUri();
}

/**
 * Generate a random avatar with random parameters
 * 
 * @param {string} seed - Optional seed (uses random if not provided)
 * @returns {Object} Avatar data URL and config
 */
export function generateRandomAvatar(seed) {
    const skinTones = Object.keys(SKIN_TONES);
    const hairStyles = ['short', 'long', 'bald'];
    const hairColors = Object.keys(HAIR_COLORS);

    const config = {
        seed: seed || Math.random().toString(36).substring(7),
        skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
        hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
        hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
        glasses: Math.random() > 0.7,
        facialHair: Math.random() > 0.7,
        backgroundColor: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)]
    };

    const dataUrl = generateAvatar(config);

    return {
        dataUrl,
        config
    };
}

/**
 * Generate multiple random avatars
 * 
 * @param {number} count - Number of avatars to generate
 * @returns {Array} Array of avatar objects with dataUrl and config
 */
export function generateRandomAvatars(count = 12) {
    return Array.from({ length: count }, () => generateRandomAvatar());
}
