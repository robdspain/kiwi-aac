import React, { useState, useRef, useEffect } from 'react';

// --- SVG ASSETS & PATHS ---

const SKIN_COLORS = [
    { id: 'pale', color: '#FFDFC4' },
    { id: 'fair', color: '#F0D5BE' },
    { id: 'medium', color: '#D1A378' },
    { id: 'olive', color: '#B38B6D' },
    { id: 'brown', color: '#8D5524' },
    { id: 'dark', color: '#523428' },
    { id: 'black', color: '#301F1A' },
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

const FACE_SHAPES = {
    round: <circle cx="50" cy="50" r="40" />,
};

const FEATURES = {
    eyes: (
        <g fill="#333">
            <circle cx="35" cy="48" r="4" />
            <circle cx="65" cy="48" r="4" />
        </g>
    ),
    smile: (
        <path d="M 35 65 Q 50 75 65 65" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    ),
    blush: (
        <g fill="#FF0000" opacity="0.1">
            <circle cx="30" cy="58" r="6" />
            <circle cx="70" cy="58" r="6" />
        </g>
    )
};

// Hair definitions: 'front' is rendered over the face, 'back' is rendered behind the face
const HAIR_STYLES = [
    {
        id: 'bald',
        label: 'Bald',
        front: null,
        back: null
    },
    {
        id: 'short-clean',
        label: 'Short Clean',
        front: <path d="M 15 40 Q 50 -10 85 40 Q 85 20 50 5 Q 15 20 15 40" />,
        back: null
    },
    {
        id: 'bob',
        label: 'Bob',
        back: <path d="M 15 40 Q 10 80 25 85 L 75 85 Q 90 80 85 40 Q 50 10 15 40" />,
        front: <path d="M 15 40 Q 50 0 85 40 Q 80 70 75 65 Q 75 40 50 25 Q 25 40 25 65 Q 20 70 15 40" />
    },
    {
        id: 'long-straight',
        label: 'Long Straight',
        back: <path d="M 10 40 Q 5 100 20 100 L 80 100 Q 95 100 90 40 Q 50 0 10 40" />,
        front: <path d="M 15 40 Q 50 10 85 40 Q 85 80 85 80 Q 70 40 50 25 Q 30 40 15 80 Q 15 40 15 40" />
    },
    {
        id: 'long-wavy',
        label: 'Long Wavy',
        back: <path d="M 10 40 Q 0 60 10 80 Q 20 100 30 90 L 70 90 Q 80 100 90 80 Q 100 60 90 40 Q 50 0 10 40" />,
        front: <path d="M 15 40 Q 50 10 85 40 Q 88 60 85 80 Q 70 40 50 25 Q 30 40 15 80 Q 12 60 15 40" />
    },
    {
        id: 'ponytail',
        label: 'Ponytail',
        back: (
            <g>
                <path d="M 10 40 Q 50 0 90 40 L 90 50 Q 50 10 10 50 Z" /> {/* Top/Back cover */}
                <path d="M 85 40 Q 100 40 100 70 Q 95 90 85 80" /> {/* The Tail */}
            </g>
        ),
        front: <path d="M 15 45 Q 50 15 85 45 Q 85 30 50 15 Q 15 30 15 45" />
    },
    {
        id: 'pigtails',
        label: 'Pigtails',
        back: (
            <g>
                <path d="M 10 40 Q 50 0 90 40 Z" />
                <path d="M 15 50 Q 0 60 5 80" strokeWidth="12" strokeLinecap="round" fill="none" stroke="currentColor" />
                <path d="M 85 50 Q 100 60 95 80" strokeWidth="12" strokeLinecap="round" fill="none" stroke="currentColor" />
            </g>
        ),
        front: <path d="M 20 40 Q 50 20 80 40 Q 50 10 20 40" />
    },
    {
        id: 'buns',
        label: 'Space Buns',
        back: (
            <g>
                <circle cx="20" cy="30" r="15" />
                <circle cx="80" cy="30" r="15" />
            </g>
        ),
        front: <path d="M 20 45 Q 50 20 80 45 Q 80 30 50 15 Q 20 30 20 45" />
    },
    {
        id: 'afro',
        label: 'Puffy/Afro',
        back: <circle cx="50" cy="50" r="48" />,
        front: <path d="M 15 40 Q 50 20 85 40 Q 80 20 50 10 Q 20 20 15 40" opacity="0.5" />
    },
    {
        id: 'side-part',
        label: 'Side Part',
        back: null,
        front: <path d="M 10 45 Q 30 -5 90 45 Q 90 30 50 10 Q 10 30 10 45" />
    },
    {
        id: 'spiky',
        label: 'Spiky',
        back: null,
        front: <path d="M 15 45 L 25 25 L 35 40 L 50 15 L 65 40 L 75 25 L 85 45 Q 50 20 15 45" />
    }
];

const CharacterBuilder = ({ initialIcon, onSelect, onClose }) => {
    const [skinColor, setSkinColor] = useState(SKIN_COLORS[2].color);
    const [hairColor, setHairColor] = useState(HAIR_COLORS[3].color);
    const [hairStyleId, setHairStyleId] = useState('long-straight');

    const svgRef = useRef(null);

    const selectedStyle = HAIR_STYLES.find(h => h.id === hairStyleId) || HAIR_STYLES[0];

    const generateSVGString = () => {
        if (!svgRef.current) return '';
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgRef.current);
        // Add XML namespace
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        // Add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    };

    const handleConfirm = () => {
        const dataUrl = generateSVGString();
        onSelect(dataUrl);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px'
        }}>
            <div style={{
                background: 'white', borderRadius: '25px', padding: '20px',
                width: '100%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>✨ Character Builder</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* Preview Area */}
                <div style={{
                    display: 'flex', justifyContent: 'center',
                    background: 'radial-gradient(circle, #f0f0f0 0%, #e0e0e0 100%)',
                    borderRadius: '20px', padding: '20px'
                }}>
                    <svg
                        ref={svgRef}
                        width="180"
                        height="180"
                        viewBox="0 0 100 100"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    >
                        {/* 1. Back Hair */}
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.back}
                        </g>

                        {/* 2. Face Base */}
                        <g fill={skinColor}>
                            {FACE_SHAPES.round}
                        </g>

                        {/* 3. Facial Features */}
                        {FEATURES.eyes}
                        {FEATURES.smile}
                        {FEATURES.blush}

                        {/* 4. Front Hair */}
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.front}
                        </g>
                    </svg>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Skin Tone */}
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#666', marginBottom: '8px', display: 'block' }}>Skin Tone</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {SKIN_COLORS.map(tone => (
                                <button
                                    key={tone.id}
                                    onClick={() => setSkinColor(tone.color)}
                                    style={{
                                        minWidth: '36px', height: '36px', borderRadius: '50%',
                                        background: tone.color,
                                        border: skinColor === tone.color ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
                                        cursor: 'pointer', flexShrink: 0
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hair Color */}
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#666', marginBottom: '8px', display: 'block' }}>Hair Color</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                            {HAIR_COLORS.map(color => (
                                <button
                                    key={color.id}
                                    onClick={() => setHairColor(color.color)}
                                    style={{
                                        minWidth: '36px', height: '36px', borderRadius: '50%',
                                        background: color.color,
                                        border: hairColor === color.color ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
                                        cursor: 'pointer', flexShrink: 0
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hair Style */}
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#666', marginBottom: '8px', display: 'block' }}>Hair Style</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                            {HAIR_STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setHairStyleId(style.id)}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '12px',
                                        background: hairStyleId === style.id ? '#E3F2FD' : '#F5F5F7',
                                        border: hairStyleId === style.id ? '2px solid #007AFF' : '1px solid transparent',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: '#333'
                                    }}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '15px', borderRadius: '15px',
                            background: '#F5F5F7', color: '#333',
                            border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            flex: 1, padding: '15px', borderRadius: '15px',
                            background: '#007AFF', color: 'white',
                            border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterBuilder;