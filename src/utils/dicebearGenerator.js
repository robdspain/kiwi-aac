/**
 * DiceBear Avatar Generator Utility (Avataaars Style)
 */

import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';

export const SKIN_TONE_OPTIONS = {
    pale: 'Pale',
    light: 'Light',
    brown: 'Brown',
    darkBrown: 'Dark Brown',
    black: 'Black',
    tanned: 'Tanned',
    yellow: 'Simpsons'
};

export const TOP_TYPES = {
    noHair: 'noHair',
    shortHairShortFlat: 'shortHairShortFlat',
    shortHairShortRound: 'shortHairShortRound',
    shortHairDreads01: 'shortHairDreads01',
    shortHairTheCaesar: 'shortHairTheCaesar',
    longHairBigHair: 'longHairBigHair',
    longHairBob: 'longHairBob',
    longHairBun: 'longHairBun',
    longHairCurly: 'longHairCurly',
    longHairStraight: 'longHairStraight',
    longHairMiaWallace: 'longHairMiaWallace',
    hijab: 'hijab',
    turban: 'turban',
    winterHat1: 'winterHat1',
    hat: 'hat'
};

export const TOP_TYPE_LABELS = {
    noHair: '👩‍🦲 Bald',
    shortHairShortFlat: '💇 Short Flat',
    shortHairShortRound: '💇 Short Round',
    shortHairDreads01: '💇 Dreads',
    shortHairTheCaesar: '💇 Caesar',
    longHairBigHair: '💇‍♀️ Big Hair',
    longHairBob: '💇‍♀️ Bob',
    longHairBun: '💇‍♀️ Bun',
    longHairCurly: '💇‍♀️ Curly',
    longHairStraight: '💇‍♀️ Straight',
    longHairMiaWallace: '💇‍♀️ Mia',
    hijab: '🧕 Hijab',
    turban: '👳 Turban',
    winterHat1: '❄️ Winter Hat',
    hat: '🧢 Hat'
};

export const HAIR_COLORS = {
    auburn: 'auburn',
    black: 'black',
    blonde: 'blonde',
    blondeGolden: 'blondeGolden',
    brown: 'brown',
    brownDark: 'brownDark',
    pastelPink: 'pastelPink',
    platinum: 'platinum',
    red: 'red',
    silverGray: 'silverGray'
};

export const HAIR_COLOR_LABELS = {
    black: '⚫ Black',
    brown: '🟤 Brown',
    brownDark: '🟤 Dark Brown',
    blonde: '🟡 Blonde',
    blondeGolden: '🟡 Golden',
    platinum: '⚪ Platinum',
    red: '🔴 Red',
    auburn: '🟠 Auburn',
    silverGray: '⚪ Gray',
    pastelPink: '🌸 Pink'
};

export const FACIAL_HAIR_TYPES = {
    none: 'blank',
    beardMedium: 'beardMedium',
    beardLight: 'beardLight',
    mustacheFancy: 'mustacheFancy'
};

export const FACIAL_HAIR_LABELS = {
    none: 'None',
    beardMedium: 'Beard',
    beardLight: 'Stubble',
    mustacheFancy: 'Mustache'
};

export const CLOTHING_TYPES = {
    blazerShirt: 'blazerShirt',
    hoodie: 'hoodie',
    overall: 'overall',
    shirtCrewNeck: 'shirtCrewNeck',
    shirtScoopNeck: 'shirtScoopNeck'
};

export const CLOTHING_LABELS = {
    blazerShirt: '👔 Blazer',
    hoodie: '🧥 Hoodie',
    overall: '👖 Overall',
    shirtCrewNeck: '👕 T-Shirt',
    shirtScoopNeck: '👕 Scoop'
};

export const ACCESSORIES_TYPES = {
    none: 'blank',
    prescription01: 'prescription01',
    sunglasses: 'sunglasses'
};

export const ACCESSORIES_LABELS = {
    none: 'None',
    prescription01: 'Glasses',
    sunglasses: 'Sunglasses'
};

export const BACKGROUND_COLORS = [
    'b6e3f4', 'c0aede', 'd1d4f9', 'ffdfbf', 'ffd5dc'
];


export function generateAvatar(options = {}) {
    const {
        seed = 'Avatar',
        skinColor = 'light',
        top = 'longHairStraight',
        hairColor = 'brown',
        facialHair = 'none',
        clothing = 'shirtCrewNeck',
        accessories = 'none',
        backgroundColor = 'b6e3f4'
    } = options;

    const dicebearOptions = {
        seed,
        skinColor: [SKIN_TONE_OPTIONS[skinColor] ? skinColor : 'light'], // Using keys directly as values for avataaars usually works if mapped correctly
        top: [top],
        hairColor: [hairColor],
        facialHair: [FACIAL_HAIR_TYPES[facialHair] || 'blank'],
        clothing: [clothing],
        accessories: [ACCESSORIES_TYPES[accessories] || 'blank'],
        backgroundColor: [backgroundColor]
    };

    // Fix mapping: Avataaars expects specific mapped values for skinColor if we passed labels, but we are passing keys.
    // The SDK expects arrays of values.

    // Let's ensure strict mapping if needed.
    // Actually, for skinColor, Avataaars uses 'light', 'pale', etc. so passing the key 'light' is correct.

    return createAvatar(avataaars, dicebearOptions).toDataUri();
}

export function generateRandomAvatar(seed) {
    const skins = Object.keys(SKIN_TONE_OPTIONS);
    const tops = Object.keys(TOP_TYPES);
    const hairs = Object.keys(HAIR_COLORS);
    const clothes = Object.keys(CLOTHING_TYPES);
    const accs = Object.keys(ACCESSORIES_TYPES);
    const facial = Object.keys(FACIAL_HAIR_TYPES);

    const config = {
        seed: seed || Math.random().toString(36).substring(7),
        skinColor: skins[Math.floor(Math.random() * skins.length)],
        top: tops[Math.floor(Math.random() * tops.length)],
        hairColor: hairs[Math.floor(Math.random() * hairs.length)],
        facialHair: Math.random() > 0.8 ? facial[Math.floor(Math.random() * facial.length)] : 'none',
        clothing: clothes[Math.floor(Math.random() * clothes.length)],
        accessories: Math.random() > 0.8 ? accs[Math.floor(Math.random() * accs.length)] : 'none',
        backgroundColor: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)]
    };

    return {
        dataUrl: generateAvatar(config),
        config
    };
}

export function generateRandomAvatars(count = 12) {
    return Array.from({ length: count }, () => generateRandomAvatar());
}
