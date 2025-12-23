import React, { useState, useRef, useEffect } from 'react';

// --- SVG ASSETS & PATHS ---

const SKIN_COLORS = [
    { id: 'pale', color: '#FFDFC4', gradient: ['#FFF0E6', '#FFDFC4', '#E6C2A6'] },
    { id: 'fair', color: '#F0D5BE', gradient: ['#FFF5EB', '#F0D5BE', '#D1B49B'] },
    { id: 'medium', color: '#D1A378', gradient: ['#EBCFB0', '#D1A378', '#B3875E'] },
    { id: 'olive', color: '#B38B6D', gradient: ['#D6B59C', '#B38B6D', '#8F6B50'] },
    { id: 'brown', color: '#8D5524', gradient: ['#B88054', '#8D5524', '#663B14'] },
    { id: 'dark', color: '#523428', gradient: ['#7A5242', '#523428', '#38221B'] },
    { id: 'black', color: '#301F1A', gradient: ['#4F352E', '#301F1A', '#1A0F0C'] },
];

const HAIR_COLORS = [
    { id: 'blonde', color: '#F2D789' },
    { id: 'dirty-blonde', color: '#C6A967' },
    { id: 'ginger', color: '#D97546' },
    { id: 'brown', color: '#6A432D' },
    { id: 'black', color: '#2C2C2C' },
    { id: 'grey', color: '#9E9E9E' },
    { id: 'white', color: '#F0F0F0' },
    { id: 'pink', color: '#FF99CC' },
    { id: 'blue', color: '#66CCFF' },
    { id: 'purple', color: '#CC99FF' },
    { id: 'green', color: '#99CC99' },
];

const Defs = () => (
    <defs>
        {SKIN_COLORS.map(skin => (
            <radialGradient key={skin.id} id={`skin-grad-${skin.id}`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor={skin.gradient[0]} />
                <stop offset="60%" stopColor={skin.gradient[1]} />
                <stop offset="100%" stopColor={skin.gradient[2]} />
            </radialGradient>
        ))}
        <linearGradient id="hair-shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="50%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
    </defs>
);

const FaceBase = ({ skinId }) => (
    <g>
        {/* Neck */}
        <path d="M 40 80 L 40 95 L 60 95 L 60 80" fill={`url(#skin-grad-${skinId})`} />
        <path d="M 40 82 Q 50 88 60 82" fill="none" stroke="black" strokeOpacity="0.05" strokeWidth="2" />

        {/* Ears */}
        <circle cx="18" cy="50" r="7" fill={`url(#skin-grad-${skinId})`} />
        <circle cx="82" cy="50" r="7" fill={`url(#skin-grad-${skinId})`} />

        {/* Head */}
        <circle cx="50" cy="50" r="35" fill={`url(#skin-grad-${skinId})`} />

        {/* Shoulders / Shirt */}
        <path d="M 15 95 Q 50 110 85 95 L 95 110 L 5 110 Z" fill="#4ECDC4" />
    </g>
);

const FacialFeatures = () => (
    <g>
        {/* Eyes */}
        <g transform="translate(34, 48)">
            <ellipse cx="0" cy="0" rx="6" ry="7" fill="white" />
            <circle cx="0" cy="0" r="4" fill="#6A432D" />
            <circle cx="0" cy="0" r="2" fill="black" />
            <circle cx="-1.5" cy="-2.5" r="1.5" fill="white" opacity="0.8" />
            {/* Lashes */}
            <path d="M -6 -4 Q -7 -8 -9 -6" fill="none" stroke="#2C2C2C" strokeWidth="1" />
            <path d="M -4 -6 Q -4 -10 -6 -9" fill="none" stroke="#2C2C2C" strokeWidth="1" />
            <path d="M 0 -7 Q 2 -11 0 -10" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        </g>
        <g transform="translate(66, 48)">
            <ellipse cx="0" cy="0" rx="6" ry="7" fill="white" />
            <circle cx="0" cy="0" r="4" fill="#6A432D" />
            <circle cx="0" cy="0" r="2" fill="black" />
            <circle cx="-1.5" cy="-2.5" r="1.5" fill="white" opacity="0.8" />
            {/* Lashes */}
            <path d="M 6 -4 Q 7 -8 9 -6" fill="none" stroke="#2C2C2C" strokeWidth="1" />
            <path d="M 4 -6 Q 4 -10 6 -9" fill="none" stroke="#2C2C2C" strokeWidth="1" />
            <path d="M 0 -7 Q -2 -11 0 -10" fill="none" stroke="#2C2C2C" strokeWidth="1" />
        </g>

        {/* Nose */}
        <path d="M 48 58 Q 50 62 52 58" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth */}
        <path d="M 40 70 Q 50 78 60 70" fill="none" stroke="#442222" strokeWidth="2" strokeLinecap="round" />

        {/* Blush */}
        <circle cx="28" cy="62" r="5" fill="#FF8585" opacity="0.15" />
        <circle cx="72" cy="62" r="5" fill="#FF8585" opacity="0.15" />
    </g>
);

const HAIR_STYLES = [
    {
        id: 'bald',
        label: 'No Hair',
        front: null,
        back: null
    },
    {
        id: 'bob',
        label: 'Classic Bob',
        back: <path d="M 15 40 Q 10 90 30 90 L 70 90 Q 90 90 85 40 Q 50 -10 15 40" />,
        front: <path d="M 15 40 Q 50 -5 85 40 Q 82 85 75 80 Q 75 40 50 25 Q 25 80 18 85 15 40" />
    },
    {
        id: 'long-straight',
        label: 'Straight',
        back: <path d="M 12 40 Q 8 110 30 110 L 70 110 Q 92 110 88 40 Q 50 -10 12 40" />,
        front: <path d="M 12 40 Q 50 -5 88 40 L 88 100 L 75 100 Q 80 50 50 28 Q 20 50 25 100 L 12 100 Z" />
    },
    {
        id: 'long-wavy',
        label: 'Wavy',
        back: <path d="M 10 40 Q 0 70 10 100 Q 30 120 50 110 Q 70 120 90 100 Q 100 70 90 40 Q 50 -10 10 40" />,
        front: <path d="M 15 40 Q 50 -5 85 40 Q 95 70 85 100 Q 75 110 65 90 Q 75 50 50 28 Q 25 50 35 90 Q 25 110 15 100 Q 5 70 15 40" />
    },
    {
        id: 'curls',
        label: 'Big Curls',
        back: <path d="M 10 40 Q -5 70 15 95 Q 30 110 50 100 Q 70 110 85 95 Q 105 70 90 40 Q 50 -15 10 40" />,
        front: <path d="M 15 40 Q 50 -5 85 40 Q 90 60 85 85 Q 70 40 50 30 Q 30 40 15 85 Q 10 60 15 40" />
    },
    {
        id: 'ponytail',
        label: 'Ponytail',
        back: (
            <g>
                <path d="M 15 40 Q 50 -5 85 40 Z" />
                <path d="M 82 30 Q 105 30 100 85 Q 90 100 80 90" strokeWidth="16" strokeLinecap="round" fill="none" stroke="currentColor" />
                <path d="M 82 30 Q 105 30 100 85" strokeWidth="6" strokeLinecap="round" fill="none" stroke="white" opacity="0.2" />
            </g>
        ),
        front: <path d="M 15 40 Q 50 -5 85 40 Q 80 25 50 18 Q 20 25 15 40" />
    },
    {
        id: 'high-buns',
        label: 'Space Buns',
        back: (
            <g>
                <circle cx="22" cy="20" r="16" />
                <circle cx="78" cy="20" r="16" />
            </g>
        ),
        front: <path d="M 15 45 Q 50 -5 85 45 Q 80 25 50 18 Q 20 25 15 45" />
    },
    {
        id: 'pigtails',
        label: 'Pigtails',
        back: (
            <g>
                <path d="M 15 40 Q 50 -5 85 40 Z" />
                <path d="M 15 50 Q -10 60 5 95" strokeWidth="15" strokeLinecap="round" fill="none" stroke="currentColor" />
                <path d="M 85 50 Q 110 60 95 95" strokeWidth="15" strokeLinecap="round" fill="none" stroke="currentColor" />
            </g>
        ),
        front: <path d="M 20 40 Q 50 5 80 40 Q 50 15 20 40" />
    },
    {
        id: 'side-braid',
        label: 'Side Braid',
        back: (
            <g>
                <path d="M 12 40 Q 50 -10 88 40 Q 95 70 85 100 Q 75 110 70 100 Q 80 80 80 40" />
            </g>
        ),
        front: <path d="M 12 40 Q 30 -5 92 45 Q 85 25 50 15 Q 15 25 12 40" />
    },
    {
        id: 'pixie',
        label: 'Pixie',
        back: null,
        front: <path d="M 15 40 Q 15 0 50 -5 Q 85 0 85 40 Q 80 20 50 12 Q 20 20 15 40" />
    },
    {
        id: 'spiky',
        label: 'Spiky',
        back: null,
        front: <path d="M 15 45 L 20 15 L 30 35 L 50 5 L 70 35 L 80 15 L 85 45 Q 50 18 15 45" />
    },
    {
        id: 'afro',
        label: 'Afro/Puff',
        back: <circle cx="50" cy="40" r="48" />,
        front: <path d="M 12 40 Q 50 5 88 40 Q 85 20 50 12 Q 15 20 12 40" opacity="0.4" />
    }
];

const FACIAL_HAIR_STYLES = [
    { id: 'none', label: 'None', path: null },
    { 
        id: 'stubble', 
        label: 'Stubble', 
        path: <path d="M 25 65 Q 50 85 75 65 L 75 75 Q 50 100 25 75 Z" opacity="0.3" /> 
    },
    { 
        id: 'beard-short', 
        label: 'Short', 
        path: <path d="M 25 60 Q 50 85 75 60 L 78 55 L 82 55 L 82 65 Q 85 85 50 95 Q 15 85 18 65 L 18 55 L 22 55 Z" /> 
    },
    { 
        id: 'beard-medium', 
        label: 'Medium', 
        path: <path d="M 25 60 Q 50 85 75 60 L 78 55 L 82 55 L 82 65 Q 85 95 50 105 Q 15 95 18 65 L 18 55 L 22 55 Z" /> 
    },
    { 
        id: 'beard-long', 
        label: 'Long', 
        path: <path d="M 25 60 Q 50 85 75 60 L 78 55 L 82 55 L 82 65 Q 90 110 50 125 Q 10 110 18 65 L 18 55 L 22 55 Z" /> 
    }
];

const CharacterBuilder = ({ initialConfig, onSelect, onClose }) => {
    const [skinId, setSkinId] = useState(SKIN_COLORS[2].id);
    const [hairColor, setHairColor] = useState(HAIR_COLORS[3].color);
    const [hairStyleId, setHairStyleId] = useState('long-straight');
    const [facialHairId, setFacialHairId] = useState('none');

    const svgRef = useRef(null);

    useEffect(() => {
        if (initialConfig) {
            setSkinId(initialConfig.skinId || 'medium');
            setHairColor(initialConfig.hairColor || HAIR_COLORS[3].color);
            setHairStyleId(initialConfig.hairStyleId || 'long-straight');
            setFacialHairId(initialConfig.facialHairId || 'none');
        }
    }, [initialConfig]);

    const selectedStyle = HAIR_STYLES.find(h => h.id === hairStyleId) || HAIR_STYLES[0];
    const selectedBeard = FACIAL_HAIR_STYLES.find(b => b.id === facialHairId) || FACIAL_HAIR_STYLES[0];

    const generateSVGString = () => {
        if (!svgRef.current) return '';
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgRef.current);
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    };

    const handleConfirm = () => {
        const dataUrl = generateSVGString();
        onSelect(dataUrl, { skinId, hairColor, hairStyleId, facialHairId });
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px',
            paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))'
        }}>
            <div style={{
                background: 'white', borderRadius: '24px', padding: '20px',
                width: '100%', maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#333' }}>✨ My Character</h2>
                    <button onClick={onClose} style={{ background: '#F5F5F7', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>

                {/* Preview Area - Responsive size */}
                <div style={{
                    display: 'flex', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                    borderRadius: '20px', padding: '20px', border: '1px solid #EEE'
                }}>
                    <svg
                        ref={svgRef}
                        width="160"
                        height="160"
                        viewBox="0 0 100 130"
                        style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.15))' }}
                    >
                        <Defs />
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.back}
                        </g>
                        <FaceBase skinId={skinId} />
                        
                        {/* Facial Hair Layer */}
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedBeard.path}
                        </g>

                        <FacialFeatures />
                        
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.front}
                            <rect x="0" y="0" width="100" height="130" fill="url(#hair-shine)" opacity="0.5" style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} />
                        </g>
                    </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' }}>Skin Tone</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                            {SKIN_COLORS.map(tone => (
                                <button
                                    key={tone.id}
                                    onClick={() => setSkinId(tone.id)}
                                    style={{
                                        minWidth: '44px', height: '44px', borderRadius: '50%',
                                        background: tone.color,
                                        border: skinId === tone.id ? '3px solid #007AFF' : '2px solid rgba(0,0,0,0.1)',
                                        cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' }}>Hair Color</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                            {HAIR_COLORS.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => setHairColor(color.color)}
                                    style={{
                                        minWidth: '44px', height: '44px', borderRadius: '50%',
                                        background: color.color,
                                        border: hairColor === color.color ? '3px solid #007AFF' : '2px solid rgba(0,0,0,0.1)',
                                        cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' }}>Hair Style</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                            {HAIR_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setHairStyleId(style.id)}
                                    style={{
                                        padding: '10px 6px',
                                        borderRadius: '12px',
                                        background: hairStyleId === style.id ? '#007AFF' : '#F5F5F7',
                                        color: hairStyleId === style.id ? 'white' : '#333',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        minHeight: '44px'
                                    }}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' }}>Facial Hair</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px', WebkitOverflowScrolling: 'touch' }}>
                            {FACIAL_HAIR_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setFacialHairId(style.id)}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: '12px',
                                        background: facialHairId === style.id ? '#007AFF' : '#F5F5F7',
                                        color: facialHairId === style.id ? 'white' : '#333',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        minWidth: '70px',
                                        flexShrink: 0
                                    }}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, padding: '16px', borderRadius: '18px', background: '#F5F5F7', color: '#333', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{ flex: 1, padding: '16px', borderRadius: '18px', background: '#007AFF', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0, 122, 255, 0.3)' }}
                    >
                        Save Character
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterBuilder;