// Avatar SVG Assets - Premium "Glossy" Definitions
// Note: Gradients are injected via the Renderer's <defs> block

export const SKIN_TONES = [
    { id: 'pale', color: '#F9D5D2', label: 'Pale' },
    { id: 'cream', color: '#F1C27D', label: 'Cream' },
    { id: 'light-brown', color: '#E0AC69', label: 'Light Brown' },
    { id: 'brown', color: '#8D5524', label: 'Brown' },
    { id: 'dark-brown', color: '#C68642', label: 'Dark Brown' },
    { id: 'black', color: '#3C2020', label: 'Deep' }
];

export const HAIR_COLORS = [
    { id: 'black', color: '#2C222B', highlight: '#4A3B49' },
    { id: 'dark-brown', color: '#4B2C20', highlight: '#6D4335' },
    { id: 'brown', color: '#A56B46', highlight: '#C48A68' },
    { id: 'blonde', color: '#E8BEAC', highlight: '#F5D9CC' },
    { id: 'red', color: '#B55239', highlight: '#D17A66' },
    { id: 'grey', color: '#D6D6D6', highlight: '#F0F0F0' }
];

export const EYE_COLORS = [
    { id: '#333333', label: 'Dark' },
    { id: '#634e34', label: 'Brown' },
    { id: '#2e536f', label: 'Blue' },
    { id: '#3d671d', label: 'Green' }
];

export const ASSETS = {
    heads: {
        round: () => `
            <circle cx="100" cy="100" r="80" fill="url(#skinGradient)" />
            <circle cx="100" cy="100" r="80" fill="url(#faceShadow)" opacity="0.3" />
        `,
        oval: () => `
            <ellipse cx="100" cy="100" rx="70" ry="90" fill="url(#skinGradient)" />
            <ellipse cx="100" cy="100" rx="70" ry="90" fill="url(#faceShadow)" opacity="0.3" />
        `,
        square: () => `
            <rect x="30" y="20" width="140" height="160" rx="40" fill="url(#skinGradient)" />
            <rect x="30" y="20" width="140" height="160" rx="40" fill="url(#faceShadow)" opacity="0.3" />
        `
    },
    eyes: {
        happy: (color) => `
            <g transform="translate(0, -5)">
                <circle cx="70" cy="90" r="10" fill="white" />
                <circle cx="70" cy="90" r="6" fill="${color}" />
                <circle cx="68" cy="88" r="2" fill="white" opacity="0.6" />
                <circle cx="130" cy="90" r="10" fill="white" />
                <circle cx="130" cy="90" r="6" fill="${color}" />
                <circle cx="128" cy="88" r="2" fill="white" opacity="0.6" />
            </g>
        `,
        neutral: () => `
            <rect x="60" y="85" width="22" height="6" rx="3" fill="#333" />
            <rect x="118" y="85" width="22" height="6" rx="3" fill="#333" />
        `,
        large: (color) => `
            <circle cx="70" cy="90" r="14" fill="white" stroke="#eee" stroke-width="1" />
            <circle cx="70" cy="90" r="8" fill="${color}" />
            <circle cx="70" cy="90" r="3" fill="#000" />
            <circle cx="67" cy="87" r="3" fill="white" opacity="0.8" />
            <circle cx="130" cy="90" r="14" fill="white" stroke="#eee" stroke-width="1" />
            <circle cx="130" cy="90" r="8" fill="${color}" />
            <circle cx="130" cy="90" r="3" fill="#000" />
            <circle cx="127" cy="87" r="3" fill="white" opacity="0.8" />
        `
    },
    mouths: {
        smile: `
            <path d="M65 135 Q100 165 135 135" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round" />
            <path d="M65 135 Q100 160 135 135" fill="rgba(0,0,0,0.05)" stroke="none" />
        `,
        neutral: '<line x1="75" y1="145" x2="125" y2="145" stroke="#333" stroke-width="5" stroke-linecap="round" />',
        open: `
            <ellipse cx="100" cy="145" rx="18" ry="12" fill="#442222" />
            <path d="M85 148 Q100 155 115 148" fill="#FF8888" opacity="0.6" />
        `
    },
    hair: {
        short: (color, highlight) => `
            <path d="M30 85 Q30 15 100 15 Q170 15 170 85" fill="${color}" />
            <path d="M50 40 Q100 25 150 40" fill="none" stroke="${highlight}" stroke-width="8" stroke-linecap="round" opacity="0.3" />
        `,
        medium: (color, highlight) => `
            <path d="M25 90 Q25 15 100 15 Q175 15 175 90 L175 140 Q100 130 25 140 Z" fill="${color}" />
            <path d="M40 50 Q100 25 160 50" fill="none" stroke="${highlight}" stroke-width="10" stroke-linecap="round" opacity="0.3" />
        `,
        long: (color, highlight) => `
            <path d="M25 90 Q25 15 100 15 Q175 15 175 90 L185 185 Q100 165 15 185 Z" fill="${color}" />
            <path d="M40 60 Q100 30 160 60" fill="none" stroke="${highlight}" stroke-width="12" stroke-linecap="round" opacity="0.2" />
        `,
        pigtails: (color, highlight) => `
            <circle cx="30" cy="65" r="28" fill="${color}" />
            <circle cx="170" cy="65" r="28" fill="${color}" />
            <path d="M40 75 Q100 20 160 75" fill="${color}" />
            <path d="M70 45 Q100 35 130 45" fill="none" stroke="${highlight}" stroke-width="6" stroke-linecap="round" opacity="0.3" />
        `,
        curly: (color, highlight) => `
            <path d="M30 100 Q30 10 100 10 Q170 10 170 100" fill="none" stroke="${color}" stroke-width="24" stroke-linecap="round" stroke-dasharray="1 35" />
            <path d="M40 100 Q40 20 100 20 Q160 20 160 100" fill="none" stroke="${highlight}" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 40" opacity="0.4" />
        `,
        hijab: (color) => `
            <path d="M20 100 Q20 5 100 5 Q180 5 180 100 L195 195 L5 195 Z" fill="${color}" />
            <path d="M100 5 Q150 5 170 50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10" stroke-linecap="round" />
        `,
        buzzcut: (color) => `
            <path d="M40 85 Q40 35 100 35 Q160 35 160 85" fill="${color}" opacity="0.2" />
        `
    },
    facial_hair: {
        none: '',
        stubble: '<path d="M60 150 Q100 185 140 150" fill="none" stroke="#000" stroke-width="12" opacity="0.08" />',
        short_beard: `
            <path d="M45 130 Q100 195 155 130 L155 145 Q100 205 45 145 Z" fill="url(#hairGradient)" opacity="0.9" />
        `,
        beard: `
            <path d="M40 120 Q100 210 160 120 L160 145 Q100 220 40 145 Z" fill="url(#hairGradient)" opacity="0.85" />
        `,
        mustache: '<path d="M70 128 Q100 118 130 128" fill="none" stroke="#333" stroke-width="9" stroke-linecap="round" opacity="0.9" />'
    },
    accessories: {
        none: '',
        glasses: `
            <g stroke="#333" stroke-width="4" fill="none" stroke-linecap="round">
                <rect x="45" y="82" width="45" height="34" rx="12" fill="rgba(255,255,255,0.2)" />
                <rect x="110" y="82" width="45" height="34" rx="12" fill="rgba(255,255,255,0.2)" />
                <line x1="90" y1="98" x2="110" y2="98" />
                <path d="M25 90 Q35 90 45 90" />
                <path d="M155 90 Q165 90 175 90" />
            </g>
        `,
        hearing_aid: '<path d="M172 95 Q188 95 188 115 Q188 135 172 135" fill="none" stroke="#FFD700" stroke-width="5" stroke-linecap="round" />',
        aac_device: `
            <rect x="145" y="145" width="42" height="52" rx="6" fill="#222" />
            <rect x="150" y="150" width="32" height="38" fill="#4ECDC4" />
            <circle cx="166" cy="191" r="3" fill="#fff" />
        `
    }
};

