// Avatar SVG Assets - Paths and Definitions

export const SKIN_TONES = [
    { id: 'pale', color: '#F9D5D2', label: 'Pale' },
    { id: 'cream', color: '#F1C27D', label: 'Cream' },
    { id: 'light-brown', color: '#E0AC69', label: 'Light Brown' },
    { id: 'brown', color: '#8D5524', label: 'Brown' },
    { id: 'dark-brown', color: '#C68642', label: 'Dark Brown' },
    { id: 'black', color: '#3C2020', label: 'Deep' }
];

export const HAIR_COLORS = [
    { id: 'black', color: '#2C222B' },
    { id: 'dark-brown', color: '#4B2C20' },
    { id: 'brown', color: '#A56B46' },
    { id: 'blonde', color: '#E8BEAC' },
    { id: 'red', color: '#B55239' },
    { id: 'grey', color: '#D6D6D6' }
];

export const ASSETS = {
    heads: {
        round: '<circle cx="100" cy="100" r="80" />',
        oval: '<ellipse cx="100" cy="100" rx="70" ry="90" />',
        square: '<rect x="30" y="20" width="140" height="160" rx="40" />'
    },
    eyes: {
        happy: '<circle cx="70" cy="90" r="8" fill="#333" /><circle cx="130" cy="90" r="8" fill="#333" />',
        neutral: '<rect x="60" y="88" width="20" height="4" rx="2" fill="#333" /><rect x="120" y="88" width="20" height="4" rx="2" fill="#333" />',
        large: '<circle cx="70" cy="90" r="12" fill="#fff" stroke="#333" stroke-width="2" /><circle cx="70" cy="90" r="5" fill="#333" /><circle cx="130" cy="90" r="12" fill="#fff" stroke="#333" stroke-width="2" /><circle cx="130" cy="90" r="5" fill="#333" />'
    },
    mouths: {
        smile: '<path d="M60 130 Q100 160 140 130" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round" />',
        neutral: '<line x1="70" y1="140" x2="130" y2="140" stroke="#333" stroke-width="6" stroke-linecap="round" />',
        open: '<ellipse cx="100" cy="140" rx="20" ry="10" fill="#333" />'
    },
    hair: {
        short: (color) => `<path d="M30 80 Q30 20 100 20 Q170 20 170 80" fill="${color}" />`,
        pigtails: (color) => `<circle cx="30" cy="60" r="25" fill="${color}" /><circle cx="170" cy="60" r="25" fill="${color}" /><path d="M40 70 Q100 20 160 70" fill="${color}" />`,
        curly: (color) => `<path d="M30 100 Q30 10 100 10 Q170 10 170 100" fill="none" stroke="${color}" stroke-width="20" stroke-linecap="round" stroke-dasharray="1 30" />`,
        hijab: (color) => `<path d="M30 100 Q30 10 100 10 Q170 10 170 100 L180 180 L20 180 Z" fill="${color}" />`,
        buzzcut: (color) => `<path d="M40 80 Q40 30 100 30 Q160 30 160 80" fill="${color}" opacity="0.3" />`
    },
    facial_hair: {
        none: '',
        stubble: '<path d="M60 150 Q100 180 140 150" fill="none" stroke="#000" stroke-width="10" opacity="0.1" />',
        beard: '<path d="M40 120 Q100 200 160 120 L160 140 Q100 210 40 140 Z" fill="#4B2C20" opacity="0.8" />',
        mustache: '<path d="M70 125 Q100 115 130 125" fill="none" stroke="#333" stroke-width="8" stroke-linecap="round" />'
    },
    accessories: {
        none: '',
        glasses: '<rect x="50" y="80" width="40" height="30" rx="10" fill="none" stroke="#333" stroke-width="3" /><rect x="110" y="80" width="40" height="30" rx="10" fill="none" stroke="#333" stroke-width="3" /><line x1="90" y1="95" x2="110" y2="95" stroke="#333" stroke-width="3" />',
        hearing_aid: '<path d="M170 90 Q185 90 185 110 Q185 130 170 130" fill="none" stroke="#FFD700" stroke-width="4" />',
        aac_device: '<rect x="140" y="140" width="40" height="50" rx="5" fill="#333" /><rect x="145" y="145" width="30" height="35" fill="#4ECDC4" /><circle cx="160" cy="185" r="3" fill="#fff" />'
    }
};
