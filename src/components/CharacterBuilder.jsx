import React, { useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

// Tapback Memoji API configuration
const TAPBACK_API = 'https://www.tapback.co/api/avatar';

// Pre-defined attribute options
const SKIN_TONES = [
    { id: 'pale', label: 'Pale', color: '#F7D7C4' },
    { id: 'light', label: 'Light', color: '#F0C5A9' },
    { id: 'medium', label: 'Medium', color: '#D4A78A' },
    { id: 'dark', label: 'Dark', color: '#8D5524' },
    { id: 'black', label: 'Deep', color: '#3C2E28' },
];

const HAIR_STYLES = [
    { id: 'short', label: 'Short', emoji: '💇‍♂️' },
    { id: 'long', label: 'Long', emoji: '💇‍♀️' },
    { id: 'curly', label: 'Curly', emoji: '👨‍🦱' },
    { id: 'bald', label: 'Bald', emoji: '👨‍🦲' },
    { id: 'bob', label: 'Bob', emoji: '👩‍🦳' },
];

const EYE_COLORS = [
    { id: 'brown', label: 'Brown', color: '#634e34' },
    { id: 'blue', label: 'Blue', color: '#2e536f' },
    { id: 'green', label: 'Green', color: '#3d671d' },
    { id: 'hazel', label: 'Hazel', color: '#8e7618' },
];

const FACES = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'cool', label: 'Cool', emoji: '😎' },
    { id: 'thinking', label: 'Thinking', emoji: '🤔' },
    { id: 'wink', label: 'Wink', emoji: '😉' },
    { id: 'star', label: 'Star', emoji: '🤩' },
];

const BACKGROUND_COLORS = [
    { id: 5, name: 'Blue', hex: '#E3F2FD' },
    { id: 6, name: 'Purple', hex: '#F3E5F5' },
    { id: 7, name: 'Pink', hex: '#FCE4EC' },
    { id: 1, name: 'Red', hex: '#FFEBEE' },
    { id: 2, name: 'Orange', hex: '#FFF3E0' },
    { id: 3, name: 'Yellow', hex: '#FFFDE7' },
    { id: 4, name: 'Green', hex: '#E8F5E9' },
    { id: 8, name: 'Teal', hex: '#E0F2F1' },
];

const CharacterBuilder = ({ initialConfig, onSelect, onClose, isTab = false, triggerPaywall }) => {
    const [name, setName] = useState(initialConfig?.name || '');
    const [skin, setSkin] = useState(initialConfig?.skin || 'light');
    const [hair, setHair] = useState(initialConfig?.hair || 'short');
    const [eyes, setEyes] = useState(initialConfig?.eyes || 'brown');
    const [face, setFace] = useState(initialConfig?.face || 'happy');
    const [selectedColor, setSelectedColor] = useState(
        initialConfig?.color || 5 // Default to Blue (ID 5)
    );
    const [activeTab, setActiveTab] = useState('skin');
    const [importedImage, setImportedImage] = useState(null);
    const fileInputRef = useRef(null);

    const isIOS = Capacitor.getPlatform() === 'ios';

    const getSeed = () => {
        // Use name if provided to make it unique, otherwise use attribute combination
        const base = name.trim() ? `${name}-${face}` : `${face}-${hair}-${skin}-${eyes}`;
        return base.toLowerCase().replace(/\s+/g, '-');
    };

    const getAvatarUrl = () => {
        if (importedImage) return importedImage;
        return `${TAPBACK_API}/${getSeed()}.webp?color=${selectedColor}`;
    };

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
        const url = getAvatarUrl();
        onSelect(url, { 
            name, 
            skin, 
            hair, 
            eyes, 
            face, 
            color: selectedColor,
            isImported: !!importedImage,
            seed: getSeed()
        });
    };
    const content = (
        <div style={{
            background: 'white',
            borderRadius: isTab ? '0' : '24px',
            padding: isTab ? '0' : '20px',
            width: '100%',
            maxWidth: isTab ? 'none' : '500px',
            maxHeight: isTab ? 'none' : '90vh',
            overflowY: isTab ? 'visible' : 'auto',
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
                        transition: 'border-color 0.2s'
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
                    <img
                        src={getAvatarUrl()}
                        alt="Character Preview"
                        style={{
                            width: '130px',
                            height: '130px',
                            borderRadius: '50%',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            background: 'white',
                            objectFit: 'cover'
                        }}
                        onError={(e) => {
                            e.target.src = `${TAPBACK_API}/user1.webp?color=${selectedColor}`;
                        }}
                    />
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
                    { id: 'skin', label: 'Skin', icon: '🎨' },
                    { id: 'hair', label: 'Hair', icon: '💇' },
                    { id: 'eyes', label: 'Eyes', icon: '👁️' },
                    { id: 'face', label: 'Face', icon: '😊' },
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
                {activeTab === 'skin' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        {SKIN_TONES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setSkin(s.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: s.color,
                                    border: skin === s.id ? '3px solid #007AFF' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    transform: skin === s.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={s.label}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'hair' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        {HAIR_STYLES.map(h => (
                            <button
                                key={h.id}
                                onClick={() => { setHair(h.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: hair === h.id ? '#007AFF' : '#F5F5F7',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transform: hair === h.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={h.label}
                            >
                                {h.emoji}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'eyes' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {EYE_COLORS.map(e => (
                            <button
                                key={e.id}
                                onClick={() => { setEyes(e.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: e.color,
                                    border: eyes === e.id ? '3px solid #007AFF' : '2px solid transparent',
                                    cursor: 'pointer',
                                    transform: eyes === e.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={e.label}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'face' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                        {FACES.map(f => (
                            <button
                                key={f.id}
                                onClick={() => { setFace(f.id); setImportedImage(null); }}
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: face === f.id ? '#007AFF' : '#F5F5F7',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    transform: face === f.id ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={f.label}
                            >
                                {f.emoji}
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
