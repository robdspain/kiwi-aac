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

// Reusable SVG Components
const Defs = () => (
    <defs>
        {SKIN_COLORS.map(skin => (
            <radialGradient key={skin.id} id={`skin-grad-${skin.id}`} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor={skin.gradient[0]} />
                <stop offset="60%" stopColor={skin.gradient[1]} />
                <stop offset="100%" stopColor={skin.gradient[2]} />
            </radialGradient>
        ))}
        <linearGradient id="hair-shine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
    </defs>
);

const FaceBase = ({ skinId }) => (
    <g>
        {/* Neck */}
        <path d="M 35 85 L 35 100 L 65 100 L 65 85" fill={`url(#skin-grad-${skinId})`} />
        {/* Head */}
        <circle cx="50" cy="50" r="40" fill={`url(#skin-grad-${skinId})`} />
        {/* Shirt Collar */}
        <path d="M 20 100 Q 50 110 80 100" stroke="#DDD" strokeWidth="20" fill="none" />
    </g>
);

const FacialFeatures = () => (
    <g>
        {/* Eyes (Sclera + Iris + Pupil + Shine) */}
        <g transform="translate(32, 45)">
            <ellipse cx="0" cy="0" rx="7" ry="8" fill="white" />
            <circle cx="0" cy="0" r="4" fill="#6A432D" />
            <circle cx="0" cy="0" r="2" fill="black" />
            <circle cx="-1.5" cy="-2.5" r="1.5" fill="white" opacity="0.8" />
        </g>
        <g transform="translate(68, 45)">
            <ellipse cx="0" cy="0" rx="7" ry="8" fill="white" />
            <circle cx="0" cy="0" r="4" fill="#6A432D" />
            <circle cx="0" cy="0" r="2" fill="black" />
            <circle cx="-1.5" cy="-2.5" r="1.5" fill="white" opacity="0.8" />
        </g>

        {/* Nose Shadow */}
        <path d="M 50 55 Q 55 60 50 62" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />

        {/* Mouth */}
        <path d="M 38 70 Q 50 78 62 70" fill="none" stroke="#442222" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 38 70 Q 50 78 62 70" fill="none" stroke="#D66" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" transform="translate(0, 2)" />
        
        {/* Blush */}
        <ellipse cx="25" cy="62" rx="6" ry="4" fill="#D66" opacity="0.1" />
        <ellipse cx="75" cy="62" rx="6" ry="4" fill="#D66" opacity="0.1" />
    </g>
);


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
        front: <path d="M 15 40 Q 15 10 50 5 Q 85 10 85 40 Q 85 25 50 15 Q 15 25 15 40" />,
        back: null
    },
    {
        id: 'bob',
        label: 'Bob',
        back: <path d="M 12 40 Q 5 90 25 90 L 75 90 Q 95 90 88 40 Q 50 10 12 40" />,
        front: (
            <g>
                <path d="M 12 40 Q 50 -5 88 40 Q 85 80 85 80 Q 75 85 75 55 Q 50 20 25 55 Q 25 85 15 80 Q 15 80 12 40" />
            </g>
        )
    },
    {
        id: 'long-straight',
        label: 'Long Straight',
        back: <path d="M 8 40 Q 0 100 20 100 L 80 100 Q 100 100 92 40 Q 50 -5 8 40" />,
        front: <path d="M 12 40 Q 50 -5 88 40 Q 90 90 90 90 L 80 90 Q 80 50 50 25 Q 20 50 20 90 L 10 90 Q 10 90 12 40" />
    },
    {
        id: 'long-wavy',
        label: 'Long Wavy',
        back: <path d="M 5 40 Q -5 70 15 100 L 85 100 Q 105 70 95 40 Q 50 -5 5 40" />,
        front: <path d="M 12 40 Q 50 -5 88 40 Q 95 70 85 100 L 75 100 Q 85 60 50 25 Q 15 60 25 100 L 15 100 Q 5 70 12 40" />
    },
    {
        id: 'ponytail',
        label: 'Ponytail',
        back: (
            <g>
                <path d="M 15 40 Q 50 -5 85 40 L 85 50 Q 50 10 15 50 Z" /> {/* Top/Back cover */}
                <path d="M 80 30 Q 105 30 100 80 Q 90 100 80 90" strokeWidth="15" strokeLinecap="round" fill="none" stroke="currentColor" />
            </g>
        ),
        front: <path d="M 15 45 Q 50 10 85 45 Q 85 30 50 15 Q 15 30 15 45" />
    },
    {
        id: 'high-pony',
        label: 'High Pony',
        back: (
            <g>
               <path d="M 30 10 Q 50 -20 70 10 L 80 80 Q 50 90 20 80 Z" />
            </g>
        ),
        front: <path d="M 15 45 Q 50 5 85 45 Q 85 30 50 15 Q 15 30 15 45" />
    },
    {
        id: 'pigtails',
        label: 'Pigtails',
        back: (
            <g>
                <path d="M 10 40 Q 50 -5 90 40 Z" />
                <path d="M 10 50 Q -10 60 5 90" strokeWidth="14" strokeLinecap="round" fill="none" stroke="currentColor" />
                <path d="M 90 50 Q 110 60 95 90" strokeWidth="14" strokeLinecap="round" fill="none" stroke="currentColor" />
            </g>
        ),
        front: <path d="M 18 40 Q 50 15 82 40 Q 50 10 18 40" />
    },
    {
        id: 'buns',
        label: 'Space Buns',
        back: (
            <g>
                <circle cx="15" cy="30" r="16" />
                <circle cx="85" cy="30" r="16" />
            </g>
        ),
        front: <path d="M 20 45 Q 50 15 80 45 Q 80 30 50 15 Q 20 30 20 45" />
    },
    {
        id: 'afro',
        label: 'Puffy/Afro',
        back: <circle cx="50" cy="50" r="50" />,
        front: <path d="M 12 40 Q 50 15 88 40 Q 85 20 50 10 Q 15 20 12 40" opacity="0.6" />
    },
    {
        id: 'side-part',
        label: 'Side Part',
        back: <path d="M 20 30 Q 50 20 80 30 L 80 50 Q 50 40 20 50" />,
        front: <path d="M 10 45 Q 30 -10 92 45 Q 90 30 50 5 Q 10 25 10 45" />
    },
    {
        id: 'spiky',
        label: 'Spiky',
        back: null,
        front: <path d="M 12 45 L 20 20 L 30 35 L 45 10 L 60 35 L 75 20 L 88 45 Q 50 15 12 45" />
    },
    {
        id: 'messy-bun',
        label: 'Messy Bun',
        back: (
             <g>
                <path d="M 30 10 Q 50 -20 70 10 Q 80 20 60 25 Q 40 30 30 10" />
             </g>
        ),
        front: <path d="M 15 45 Q 50 10 85 45 Q 85 30 50 15 Q 15 30 15 45" />
    }
];

const CharacterBuilder = ({ initialConfig, onSelect, onClose }) => {
    const [skinId, setSkinId] = useState(SKIN_COLORS[2].id);
    const [hairColor, setHairColor] = useState(HAIR_COLORS[3].color);
    const [hairStyleId, setHairStyleId] = useState('long-straight');

    const svgRef = useRef(null);

    // Load initial config if present
    useEffect(() => {
        if (initialConfig) {
            setSkinId(initialConfig.skinId || 'medium');
            setHairColor(initialConfig.hairColor || HAIR_COLORS[3].color);
            setHairStyleId(initialConfig.hairStyleId || 'long-straight');
        }
    }, [initialConfig]);

    const selectedStyle = HAIR_STYLES.find(h => h.id === hairStyleId) || HAIR_STYLES[0];
    const selectedSkin = SKIN_COLORS.find(s => s.id === skinId) || SKIN_COLORS[2];

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
        // Return both the visual data URL and the config object
        onSelect(dataUrl, {
            skinId,
            hairColor,
            hairStyleId
        });
    };

    return (
        <div style={{ 
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1300,
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
                    background: 'radial-gradient(circle, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '20px', padding: '20px'
                }}>
                    <svg
                        ref={svgRef}
                        width="200"
                        height="200"
                        viewBox="0 0 100 100"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    >
                        <Defs />

                        {/* 1. Back Hair */}
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.back}
                        </g>

                        {/* 2. Face Base */}
                        <FaceBase skinId={skinId} />

                        {/* 3. Facial Features */}
                        <FacialFeatures />

                        {/* 4. Front Hair + Shine */}
                        <g fill={hairColor} stroke={hairColor} strokeWidth="1">
                            {selectedStyle.front}
                            {/* Overlay shine gradient on hair */}
                            <path 
                                d="M 0 0 H 100 V 100 H 0 Z" 
                                fill="url(#hair-shine)" 
                                style={{ mixBlendMode: 'overlay', pointerEvents: 'none' }} 
                                clipPath="url(#front-hair-clip)" // Would need clip defs, simple overlay for now
                            />
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
                                    onClick={() => setSkinId(tone.id)}
                                    style={{
                                        minWidth: '36px', height: '36px', borderRadius: '50%',
                                        background: tone.color,
                                        border: skinId === tone.id ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
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
