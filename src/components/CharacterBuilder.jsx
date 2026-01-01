import React, { useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

// Build Character using standard emojis and ZWJ sequences
// This matches the "built-in" icon set used in the main application

const BASES = [
    { id: 'person', label: 'Person', emoji: '🧑' },
    { id: 'woman', label: 'Woman', emoji: '👩' },
    { id: 'man', label: 'Man', emoji: '👨' },
    { id: 'child', label: 'Child', emoji: '🧒' },
    { id: 'baby', label: 'Baby', emoji: '👶' },
    { id: 'older', label: 'Older', emoji: '🧓' },
    { id: 'beard', label: 'Beard', emoji: '🧔' },
    { id: 'smiley', label: 'Happy', emoji: '😊' },
    { id: 'cool', label: 'Cool', emoji: '😎' },
];

const TONES = [
    { id: 'none', label: 'Default', modifier: '' },
    { id: 'light', label: 'Light', modifier: '🏻' },
    { id: 'med-light', label: 'Med-Light', modifier: '🏼' },
    { id: 'medium', label: 'Medium', modifier: '🏽' },
    { id: 'med-dark', label: 'Med-Dark', modifier: '🏾' },
    { id: 'dark', label: 'Dark', modifier: '🏿' },
];

const HAIR = [
    { id: 'none', label: 'Standard', modifier: '' },
    { id: 'curly', label: 'Curly', modifier: '🦱' },
    { id: 'red', label: 'Red', modifier: '🦰' },
    { id: 'blond', label: 'Blond', modifier: '👱', isBaseOverride: true }, // Special case
    { id: 'white', label: 'White', modifier: '🦳' },
    { id: 'bald', label: 'Bald', modifier: '🦲' },
];

const ACCESSORIES = [
    { id: 'none', label: 'None', emoji: '👁️' },
    { id: 'glasses', label: 'Glasses', emoji: '👓' },
    { id: 'sunglasses', label: 'Sun', emoji: '🕶️' },
];

const BACKGROUND_COLORS = [
    { id: 'blue', name: 'Blue', hex: '#E3F2FD' },
    { id: 'purple', name: 'Purple', hex: '#F3E5F5' },
    { id: 'pink', name: 'Pink', hex: '#FCE4EC' },
    { id: 'red', name: 'Red', hex: '#FFEBEE' },
    { id: 'orange', name: 'Orange', hex: '#FFF3E0' },
    { id: 'yellow', name: 'Yellow', hex: '#FFFDE7' },
    { id: 'green', name: 'Green', hex: '#E8F5E9' },
    { id: 'teal', name: 'Teal', hex: '#E0F2F1' },
];

const applyModifier = (baseEmoji, modifier) => {
    if (!modifier) return baseEmoji;
    
    // Check for ZWJ
    const zwjIndex = baseEmoji.indexOf('\u200D');
    if (zwjIndex !== -1) {
        const part1 = baseEmoji.substring(0, zwjIndex);
        const part2 = baseEmoji.substring(zwjIndex);
        let cleanPart1 = part1;
        if (cleanPart1.endsWith('\uFE0F')) {
            cleanPart1 = cleanPart1.substring(0, cleanPart1.length - 1);
        }
        return cleanPart1 + modifier + part2;
    } else {
        let cleanBase = baseEmoji;
        if (cleanBase.endsWith('\uFE0F')) {
            cleanBase = cleanBase.substring(0, cleanBase.length - 1);
        }
        return cleanBase + modifier;
    }
};

const CharacterBuilder = ({ initialConfig, onSelect, onClose, isTab = false, triggerPaywall }) => {
    const [name, setName] = useState(initialConfig?.name || '');
    const [base, setBase] = useState(initialConfig?.base || 'person');
    const [skin, setSkin] = useState(initialConfig?.skin || 'none');
    const [hair, setHair] = useState(initialConfig?.hair || 'none');
    const [acc, setAcc] = useState(initialConfig?.acc || 'none');
    const [selectedColor, setSelectedColor] = useState(
        initialConfig?.color || 'blue'
    );
    const [activeTab, setActiveTab] = useState('face');
    const [importedImage, setImportedImage] = useState(initialConfig?.isImported ? initialConfig.url : null);
    const fileInputRef = useRef(null);

    const isIOS = Capacitor.getPlatform() === 'ios';

    // Calculate composed emoji
    const getComposedEmoji = () => {
        let res = BASES.find(b => b.id === base)?.emoji || '🧑';
        const toneMod = TONES.find(t => t.id === skin)?.modifier || '';
        const hairItem = HAIR.find(h => h.id === hair);
        const hairMod = hairItem?.modifier || '';
        
        // Humans only for skin/hair
        const isHuman = ['person', 'woman', 'man', 'child', 'baby', 'older', 'beard'].includes(base);
        
        if (isHuman) {
            if (hairItem?.isBaseOverride) {
                res = hairMod; // e.g. Person Blond Hair emoji
            }
            
            if (toneMod) res = applyModifier(res, toneMod);
            
            if (hairMod && !hairItem.isBaseOverride) {
                // Hair is a separate ZWJ part: Base + Tone + ZWJ + Hair
                res = res + '\u200D' + hairMod;
            }
        }
        return res;
    };

    const composedEmoji = getComposedEmoji();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImportedImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImportPhoto = () => {
        if (triggerPaywall) {
            triggerPaywall('custom_character_photo', () => fileInputRef.current?.click());
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleConfirm = () => {
        const url = importedImage || composedEmoji;
        onSelect(url, { 
            name, 
            base,
            skin, 
            hair, 
            acc, 
            color: selectedColor,
            isImported: !!importedImage,
            url: url // Store for re-editing
        });
    };

    const bgColorHex = BACKGROUND_COLORS.find(c => c.id === selectedColor)?.hex || '#E3F2FD';

    const content = (
        <div style={{
            background: isTab ? 'transparent' : 'white',
            borderRadius: isTab ? '0' : '24px',
            padding: isTab ? '0' : '20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            boxShadow: isTab ? 'none' : '0 20px 60px rgba(0,0,0,0.3)'
        }}>
            {/* Header */}
            {!isTab && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>✨ Build Character</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#F5F5F7',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '1.4rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Name Input */}
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Character Name..."
                    style={{
                        width: '100%',
                        padding: '15px',
                        paddingLeft: '45px',
                        borderRadius: '16px',
                        border: '2px solid #F0F0F0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'white'
                    }}
                />
                <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🏷️</span>
            </div>

            {/* Preview Section */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                borderRadius: '20px',
                padding: '25px',
                border: '2px solid #EEE'
            }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        background: bgColorHex,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '5rem',
                        overflow: 'hidden'
                    }}>
                        {importedImage ? (
                            <img src={importedImage} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ position: 'relative' }}>
                                {composedEmoji}
                                {acc !== 'none' && (
                                    <div style={{ position: 'absolute', top: '5%', left: 0, right: 0, textAlign: 'center', fontSize: '3rem', opacity: 0.9 }}>
                                        {ACCESSORIES.find(a => a.id === acc)?.emoji}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {importedImage && (
                        <button
                            onClick={() => setImportedImage(null)}
                            style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: '#FF3B30', color: 'white', border: 'none',
                                borderRadius: '50%', width: '30px', height: '30px',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {isIOS && !importedImage && (
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handleImportPhoto}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                color: 'white',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 165, 0, 0.3)'
                            }}
                        >
                            👑 Add Your Memoji Sticker
                        </button>
                        <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '6px', marginInline: '20px' }}>
                            Tip: Save a Memoji Sticker to your Photos app first, then import it here!
                        </p>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </div>

            {/* Customization Tabs */}
            <div style={{
                display: 'flex',
                gap: '5px',
                padding: '4px',
                background: '#F5F5F7',
                borderRadius: '12px',
                overflowX: 'auto'
            }}>
                {[
                    { id: 'face', label: 'Face', icon: '😊' },
                    { id: 'skin', label: 'Skin', icon: '🎨' },
                    { id: 'hair', label: 'Hair', icon: '💇' },
                    { id: 'eyes', label: 'Eyes', icon: '👁️' },
                    { id: 'bg', label: 'Back', icon: '🖼️' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            minWidth: '60px',
                            padding: '8px 4px',
                            borderRadius: '8px',
                            background: activeTab === tab.id ? 'white' : 'transparent',
                            border: 'none',
                            fontSize: '0.75rem',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            cursor: 'pointer',
                            boxShadow: activeTab === tab.id ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '1rem', marginBottom: '2px' }}>{tab.icon}</div>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: '120px' }}>
                {activeTab === 'face' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        {BASES.map(b => (
                            <button
                                key={b.id}
                                onClick={() => { setBase(b.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: base === b.id ? '#007AFF' : 'white',
                                    border: base === b.id ? 'none' : '1px solid #DDD',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transform: base === b.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={b.label}
                            >
                                {b.emoji}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'skin' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                        {TONES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSkin(s.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: s.modifier ? '#F0C5A9' : '#FFCC00', // Preview color
                                    border: skin === s.id ? '3px solid #007AFF' : '1px solid #DDD',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    transform: skin === s.id ? 'scale(1.1)' : 'scale(1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                title={s.label}
                            >
                                {s.modifier && (
                                    <div style={{ position: 'absolute', inset: 0, background: '#D4A78A', opacity: TONES.indexOf(s) / 6 }}></div>
                                )}
                                <span style={{ position: 'relative', fontSize: '1.2rem' }}>{s.modifier || '🟡'}</span>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'hair' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                        {HAIR.map(h => (
                            <button
                                key={h.id}
                                onClick={() => { setHair(h.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: hair === h.id ? '#007AFF' : 'white',
                                    border: hair === h.id ? 'none' : '1px solid #DDD',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transform: hair === h.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={h.label}
                            >
                                {h.modifier || '👤'}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'eyes' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {ACCESSORIES.map(e => (
                            <button
                                key={e.id}
                                onClick={() => { setAcc(e.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: acc === e.id ? '#007AFF' : 'white',
                                    border: acc === e.id ? 'none' : '1px solid #DDD',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transform: acc === e.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={e.label}
                            >
                                {e.emoji}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'bg' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {BACKGROUND_COLORS.map(color => (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColor(color.id)}
                                style={{
                                    padding: '12px 4px',
                                    borderRadius: '10px',
                                    background: color.hex,
                                    border: selectedColor === color.id ? '2px solid #007AFF' : '1px solid #DDD',
                                    color: '#333',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                    fontWeight: '700'
                                }}
                            >
                                {color.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                {!isTab && (
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '16px',
                            borderRadius: '18px',
                            background: '#F5F5F7',
                            color: '#333',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                )}
                <button
                    onClick={handleConfirm}
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, #007AFF, #0051D5)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0, 122, 255, 0.3)'
                    }}
                >
                    {isTab ? 'Add to Library' : 'Save Character'}
                </button>
            </div>
        </div>
    );

    if (isTab) return content;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))'
        }}>
            {content}
        </div>
    );
};

export default CharacterBuilder;