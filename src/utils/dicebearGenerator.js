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

export const EYES_TYPES = {
    default: 'default',
    happy: 'happy',
    wink: 'wink',
    winkWacky: 'winkWacky',
    hearts: 'hearts',
    squint: 'squint',
    surprised: 'surprised',
    cry: 'cry',
    close: 'close',
    dizzy: 'dizzy',
    eyeRoll: 'eyeRoll',
    side: 'side'
};

export const EYES_LABELS = {
    default: '👀 Default',
    happy: '😊 Happy',
    wink: '😉 Wink',
    winkWacky: '😜 Wacky',
    hearts: '😍 Hearts',
    squint: '😆 Squint',
    surprised: '😲 Shocked',
    cry: '😢 Cry',
    close: '😌 Closed',
    dizzy: '😵 Dizzy',
    eyeRoll: '🙄 Roll',
    side: '😒 Side'
};

export const EYEBROW_TYPES = {
    default: 'default',
    defaultNatural: 'defaultNatural',
    angry: 'angry',
    angryNatural: 'angryNatural',
    flatNatural: 'flatNatural',
    raisedExcited: 'raisedExcited',
    raisedExcitedNatural: 'raisedExcitedNatural',
    sadConcerned: 'sadConcerned',
    sadConcernedNatural: 'sadConcernedNatural',
    unibrowNatural: 'unibrowNatural',
    upDown: 'upDown',
    upDownNatural: 'upDownNatural'
};

export const EYEBROW_LABELS = {
    default: '😐 Default',
    defaultNatural: '😐 Natural',
    angry: '😠 Angry',
    angryNatural: '😠 Mad',
    flatNatural: '😑 Flat',
    raisedExcited: '🤩 Excited',
    raisedExcitedNatural: '🤩 Pumped',
    sadConcerned: '😟 Sad',
    sadConcernedNatural: '😟 Worried',
    unibrowNatural: '🤨 Unibrow',
    upDown: '🤨 Skeptical',
    upDownNatural: '🤨 Doubt'
};

export const MOUTH_TYPES = {
    default: 'default',
    concerned: 'concerned',
    disbelief: 'disbelief',
    eating: 'eating',
    grimace: 'grimace',
    sad: 'sad',
    screamOpen: 'screamOpen',
    serious: 'serious',
    smile: 'smile',
    tongue: 'tongue',
    twinkle: 'twinkle',
    vomit: 'vomit'
};

export const MOUTH_LABELS = {
    default: '😐 Default',
    concerned: '😟 Worried',
    disbelief: '🤨 ??',
    eating: '😋 Nom',
    grimace: '😬 Grimace',
    sad: '😞 Sad',
    screamOpen: '😱 Scream',
    serious: '😐 Serious',
    smile: '🙂 Smile',
    tongue: '😛 Tongue',
    twinkle: '😏 Smirk',
    vomit: '🤢 Sick'
};

export const BACKGROUND_COLORS = [
    'b6e3f4', 'c0aede', 'd1d4f9', 'ffdfbf', 'ffd5dc', 'd5f5e3', 'fcf3cf'
];

// Hex values for Avataaars
const SKIN_TONE_HEX = {
    pale: 'ffdbb4',
    light: 'edb98a',
    brown: 'd08b5b',
    darkBrown: 'ae5d29',
    black: '614335',
    tanned: 'fd9841',
    yellow: 'f8d25c'
};

export const FACIAL_HAIR_COLOR_HEX = {
    auburn: 'a55728',
    black: '2c1b18',
    blonde: 'b58143',
    blondeGolden: 'd6b370',
    brown: '724133',
    brownDark: '4a312c',
    platinum: 'ecdcbf',
    red: 'c93305'
};

export const CLOTHES_COLOR_HEX = {
    black: '262e33',
    blue01: '65c9ff',
    blue02: '5199e4',
    blue03: '25557c',
    gray01: '929598',
    gray02: '3c4f5c',
    heather: '3c4f5c',
    pastelBlue: 'b1e2ff',
    pastelGreen: 'a7ffc4',
    pastelOrange: 'ffdeb5',
    pastelRed: 'ffafb9',
    pastelYellow: 'ffffb1',
    pink: 'ff488e',
    red: 'ff5c5c',
    white: 'ffffff'
};

export const HAT_COLOR_HEX = {
    black: '262e33',
    blue01: '65c9ff',
    blue02: '5199e4',
    blue03: '25557c',
    gray01: '929598',
    gray02: '3c4f5c',
    heather: '3c4f5c',
    pastelBlue: 'b1e2ff',
    pastelGreen: 'a7ffc4',
    pastelOrange: 'ffdeb5',
    pastelRed: 'ffafb9',
    pastelYellow: 'ffffb1',
    pink: 'ff488e',
    red: 'ff5c5c',
    white: 'ffffff'
};

export const ACCESSORIES_COLOR_HEX = {
    black: '262e33',
    blue01: '65c9ff',
    blue02: '5199e4',
    blue03: '25557c',
    gray01: '929598',
    gray02: '3c4f5c',
    heather: '3c4f5c',
    pastelBlue: 'b1e2ff',
    pastelGreen: 'a7ffc4',
    pastelOrange: 'ffdeb5',
    pastelRed: 'ffafb9',
    pastelYellow: 'ffffb1',
    pink: 'ff488e',
    red: 'ff5c5c',
    white: 'ffffff'
};

export function generateAvatar(options = {}) {
    const {
        seed = 'Avatar',
        skinColor = 'light',
        top = 'shortHairShortFlat',
        hairColor = 'brown',
        hatColor = 'pastelBlue',
        facialHair = 'none',
        facialHairColor = 'brown',
        clothing = 'shirtCrewNeck',
        clothesColor = 'blue02',
        accessories = 'none',
        accessoriesColor = 'black',
        eyes = 'default',
        eyebrows = 'default',
        mouth = 'default',
        backgroundColor = 'b6e3f4'
    } = options;

    const dicebearOptions = {
        seed,
        skinColor: [SKIN_TONE_HEX[skinColor] || SKIN_TONE_HEX.light],
        top: [top],
        hairColor: [HAIR_COLOR_HEX[hairColor] || HAIR_COLOR_HEX.brown],
        hatColor: [HAT_COLOR_HEX[hatColor] || HAT_COLOR_HEX.pastelBlue],
        facialHair: [FACIAL_HAIR_TYPES[facialHair] || 'blank'],
        facialHairColor: [FACIAL_HAIR_COLOR_HEX[facialHairColor] || FACIAL_HAIR_COLOR_HEX.brown],
        clothing: [clothing],
        clothesColor: [CLOTHES_COLOR_HEX[clothesColor] || CLOTHES_COLOR_HEX.blue02],
        accessories: [ACCESSORIES_TYPES[accessories] || 'blank'],
        accessoriesColor: [ACCESSORIES_COLOR_HEX[accessoriesColor] || ACCESSORIES_COLOR_HEX.black],
        eyes: [eyes],
        eyebrows: [eyebrows],
        mouth: [mouth],
        backgroundColor: [backgroundColor]
    };

    return createAvatar(avataaars, dicebearOptions).toDataUri();
}

export function generateRandomAvatar(seed) {
    const skins = Object.keys(SKIN_TONE_OPTIONS);
    const tops = Object.keys(TOP_TYPES);
    const hairs = Object.keys(HAIR_COLORS);
    const facial = Object.keys(FACIAL_HAIR_TYPES);
    const clothes = Object.keys(CLOTHING_TYPES);
    const clothesColors = Object.keys(CLOTHES_COLOR_HEX);
    const accs = Object.keys(ACCESSORIES_TYPES);
    const eyesList = Object.keys(EYES_TYPES);
    const browsList = Object.keys(EYEBROW_TYPES);
    const mouthList = Object.keys(MOUTH_TYPES);

    const config = {
        seed: seed || Math.random().toString(36).substring(7),
        skinColor: skins[Math.floor(Math.random() * skins.length)],
        top: tops[Math.floor(Math.random() * tops.length)],
        hairColor: hairs[Math.floor(Math.random() * hairs.length)],
        hatColor: clothesColors[Math.floor(Math.random() * clothesColors.length)], // Reuse palette
        facialHair: Math.random() > 0.8 ? facial[Math.floor(Math.random() * facial.length)] : 'none',
        facialHairColor: hairs[Math.floor(Math.random() * hairs.length)], // Reuse hair palette
        clothing: clothes[Math.floor(Math.random() * clothes.length)],
        clothesColor: clothesColors[Math.floor(Math.random() * clothesColors.length)],
        accessories: Math.random() > 0.8 ? accs[Math.floor(Math.random() * accs.length)] : 'none',
        accessoriesColor: clothesColors[Math.floor(Math.random() * clothesColors.length)],
        eyes: eyesList[Math.floor(Math.random() * eyesList.length)],
        eyebrows: browsList[Math.floor(Math.random() * browsList.length)],
        mouth: mouthList[Math.floor(Math.random() * mouthList.length)],
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
