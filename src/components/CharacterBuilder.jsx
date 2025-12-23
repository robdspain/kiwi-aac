import React, { useState } from 'react';

// Character options for building customizable person icons
const SKIN_TONES = [
    { id: 'light', color: '#FFDFC4', modifier: '🏻' },
    { id: 'mediumLight', color: '#E0C8A9', modifier: '🏼' },
    { id: 'medium', color: '#C29770', modifier: '🏽' },
    { id: 'mediumDark', color: '#976C43', modifier: '🏾' },
    { id: 'dark', color: '#5C3E2F', modifier: '🏿' },
];

const HAIR_STYLES = [
    { id: 'curly', emoji: '🦱', label: 'Curly' },
    { id: 'straight', emoji: '🦰', label: 'Red' },
    { id: 'blonde', emoji: '🦳', label: 'White' },
    { id: 'bald', emoji: '🦲', label: 'Bald' },
];

const CHARACTER_BASES = [
    { id: 'woman', base: '👩', label: 'Woman' },
    { id: 'man', base: '👨', label: 'Man' },
    { id: 'person', base: '🧑', label: 'Person' },
    { id: 'girl', base: '👧', label: 'Girl' },
    { id: 'boy', base: '👦', label: 'Boy' },
    { id: 'baby', base: '👶', label: 'Baby' },
    { id: 'oldwoman', base: '👵', label: 'Grandma' },
    { id: 'oldman', base: '👴', label: 'Grandpa' },
];

// Zero-width joiner for combining emojis
const ZWJ = '\u200D';

const buildCharacter = (base, skinTone, hairStyle) => {
    // Some combinations work with ZWJ sequences
    // Format: base + skin tone + ZWJ + hair style
    const skinModifier = skinTone?.modifier || '';
    const hairEmoji = hairStyle?.emoji || '';

    if (hairEmoji && skinModifier) {
        // Try ZWJ combination: 👩🏼‍🦱
        return base + skinModifier + ZWJ + hairEmoji;
    } else if (skinModifier) {
        return base + skinModifier;
    } else if (hairEmoji) {
        return base + ZWJ + hairEmoji;
    }
    return base;
};

const CharacterBuilder = ({ initialIcon, onSelect, onClose }) => {
    // Try to parse the initial icon
    const [selectedBase, setSelectedBase] = useState(
        CHARACTER_BASES.find(b => initialIcon?.startsWith(b.base)) || CHARACTER_BASES[0]
    );
    const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[1]); // mediumLight default
    const [selectedHair, setSelectedHair] = useState(HAIR_STYLES[0]); // curly default

    const previewIcon = buildCharacter(selectedBase.base, selectedSkin, selectedHair);

    const handleConfirm = () => {
        onSelect(previewIcon);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 250,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                maxWidth: '400px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
                    Customize Character
                </h2>

                {/* Preview */}
                <div style={{
                    fontSize: '6rem',
                    textAlign: 'center',
                    marginBottom: '24px',
                    padding: '20px',
                    background: '#f5f5f5',
                    borderRadius: '16px'
                }}>
                    {previewIcon}
                </div>

                {/* Character Type */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                        Character
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {CHARACTER_BASES.map(char => (
                            <button
                                key={char.id}
                                onClick={() => setSelectedBase(char)}
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: selectedBase.id === char.id ? '2px solid #4ECDC4' : '2px solid #E5E5EA',
                                    background: selectedBase.id === char.id ? '#E8F8F7' : 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <span>{char.base}</span>
                                <span style={{ fontSize: '12px' }}>{char.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skin Tone */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                        Skin Tone
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {SKIN_TONES.map(tone => (
                            <button
                                key={tone.id}
                                onClick={() => setSelectedSkin(tone)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: selectedSkin.id === tone.id ? '3px solid #4ECDC4' : '2px solid rgba(0,0,0,0.1)',
                                    background: tone.color,
                                    cursor: 'pointer'
                                }}
                                title={tone.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Hair Style */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                        Hair Style
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {HAIR_STYLES.map(hair => (
                            <button
                                key={hair.id}
                                onClick={() => setSelectedHair(hair)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    border: selectedHair.id === hair.id ? '2px solid #4ECDC4' : '2px solid #E5E5EA',
                                    background: selectedHair.id === hair.id ? '#E8F8F7' : 'white',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <span>{hair.emoji}</span>
                                <span style={{ fontSize: '10px' }}>{hair.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#E5E5EA',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Use This Character
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterBuilder;
