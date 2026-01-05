import { useState, useEffect } from 'react';
import {
    generateAvatar,
    generateRandomAvatars,
    SKIN_TONE_LABELS,
    HAIR_STYLE_LABELS,
    HAIR_COLOR_LABELS,
    BACKGROUND_COLORS
} from '../utils/dicebearGenerator';

const MemojiPicker = ({ onSelect, onClose, initialName = '', initialConfig = null }) => {
    const [name, setName] = useState(initialName || '');
    const [activeTab, setActiveTab] = useState('presets');

    // Presets tab state
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState(null);

    // Customize tab state
    const [skinTone, setSkinTone] = useState(initialConfig?.skinTone || 'medium');
    const [hairStyle, setHairStyle] = useState(initialConfig?.hairStyle || 'short');
    const [hairColor, setHairColor] = useState(initialConfig?.hairColor || 'brown');
    const [glasses, setGlasses] = useState(initialConfig?.glasses || false);
    const [facialHair, setFacialHair] = useState(initialConfig?.facialHair || false);
    const [bgColor, setBgColor] = useState(initialConfig?.backgroundColor || '#ffdfbf');

    // Preview
    const [preview, setPreview] = useState('');

    // Generate initial presets
    useEffect(() => {
        refreshPresets();
    }, []);

    // Update preview when customize options change
    useEffect(() => {
        if (activeTab === 'customize' || activeTab === 'presets') {
            const dataUrl = generateAvatar({
                seed: name || 'Avatar',
                skinTone,
                hairStyle,
                hairColor,
                glasses,
                facialHair,
                backgroundColor: bgColor
            });
            setPreview(dataUrl);
        }
    }, [activeTab, skinTone, hairStyle, hairColor, glasses, facialHair, bgColor, name]);

    // Initial name set
    useEffect(() => {
        if (initialName) setName(initialName);
    }, [initialName]);

    const refreshPresets = () => {
        const newPresets = generateRandomAvatars(12);
        setPresets(newPresets);
        if (newPresets.length > 0 && !selectedPreset) {
            setSelectedPreset(0);
            const first = newPresets[0];
            setSkinTone(first.config.skinTone);
            setHairStyle(first.config.hairStyle);
            setHairColor(first.config.hairColor);
            setGlasses(first.config.glasses);
            setFacialHair(first.config.facialHair);
            setBgColor(first.config.backgroundColor);
        }
    };

    const handlePresetSelect = (index) => {
        setSelectedPreset(index);
        const preset = presets[index];
        // Load preset config into customize tab
        setSkinTone(preset.config.skinTone);
        setHairStyle(preset.config.hairStyle);
        setHairColor(preset.config.hairColor);
        setGlasses(preset.config.glasses);
        setFacialHair(preset.config.facialHair);
        setBgColor(preset.config.backgroundColor);
    };

    const randomizeCustomize = () => {
        const random = generateRandomAvatars(1)[0];
        setSkinTone(random.config.skinTone);
        setHairStyle(random.config.hairStyle);
        setHairColor(random.config.hairColor);
        setGlasses(random.config.glasses);
        setFacialHair(random.config.facialHair);
        setBgColor(random.config.backgroundColor);
    };

    const handleSave = () => {
        if (!preview) return alert('Please create an avatar');

        const trimmedName = name.trim();

        const config = {
            type: 'dicebear',
            style: 'big-smile',
            config: {
                seed: trimmedName || 'Avatar',
                skinTone,
                hairStyle,
                hairColor,
                glasses,
                facialHair,
                backgroundColor: bgColor
            }
        };

        onSelect(preview, {
            name: trimmedName || 'Avatar',
            ...config,
            id: Date.now()
        });
    };

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div
                className="ios-bottom-sheet"
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                style={{ height: '85vh' }}
            >
                <button className="ios-close-button" onClick={onClose} aria-label="Close">✕</button>
                <div className="ios-sheet-header">
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <h2 className="ios-sheet-title">Create Avatar</h2>
                    <button className="ios-done-button" onClick={handleSave}>Done</button>
                </div>

                <div className="ios-sheet-content" style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Preview Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
                        <div style={{
                            width: '7rem', height: '7rem',
                            background: 'white', borderRadius: '50%',
                            border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            overflow: 'hidden', marginBottom: '1rem'
                        }}>
                            {preview && <img src={preview} alt="Avatar preview" style={{ width: '100%', height: '100%' }} />}
                        </div>

                        <div className="ios-setting-card" style={{ width: '100%' }}>
                            <div className="ios-row">
                                <span style={{ fontWeight: 600 }}>Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave();
                                    }}
                                    style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                    placeholder="e.g. Mom"
                                    autoCapitalize="words"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="ios-segmented-control" style={{ margin: '0 1rem' }}>
                        <div
                            className="selection-pill"
                            style={{
                                width: 'calc(50% - 4px)',
                                transform: activeTab === 'presets' ? 'translateX(0)' : 'translateX(100%)',
                                transition: 'transform 0.25s ease'
                            }}
                        />
                        <button
                            onClick={() => setActiveTab('presets')}
                            style={{ flex: 1, minHeight: '2.75rem' }}
                        >
                            Presets
                        </button>
                        <button
                            onClick={() => setActiveTab('customize')}
                            style={{ flex: 1, minHeight: '2.75rem' }}
                        >
                            Customize
                        </button>
                    </div>

                    {/* Presets Tab */}
                    {activeTab === 'presets' && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                                <div className="ios-setting-group-header" style={{ marginBottom: 0 }}>Quick Pick</div>
                                <button onClick={refreshPresets} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                                    🔄 Shuffle
                                </button>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '0.75rem',
                                paddingBottom: '2rem'
                            }}>
                                {presets.map((preset, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePresetSelect(index)}
                                        style={{
                                            aspectRatio: '1/1',
                                            background: 'white',
                                            border: selectedPreset === index ? '3px solid #007AFF' : '1px solid #ddd',
                                            borderRadius: '1rem',
                                            padding: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            transform: selectedPreset === index ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: selectedPreset === index ? '0 4px 12px rgba(0,122,255,0.2)' : 'none',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img src={preset.dataUrl} alt={`Preset ${index + 1}`} style={{ width: '100%', height: '100%' }} />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Customize Tab */}
                    {activeTab === 'customize' && (
                        <>
                            <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Skin Tone */}
                                <div>
                                    <div className="ios-setting-group-header">Skin Tone</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {Object.entries(SKIN_TONE_LABELS).map(([key, label]) => (
                                            <button
                                                key={key}
                                                onClick={() => setSkinTone(key)}
                                                style={{
                                                    padding: '0.75rem',
                                                    background: skinTone === key ? '#007AFF' : 'white',
                                                    color: skinTone === key ? 'white' : '#000',
                                                    border: skinTone === key ? '2px solid #007AFF' : '1px solid #ddd',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hair Style */}
                                <div>
                                    <div className="ios-setting-group-header">Hair Style</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {Object.entries(HAIR_STYLE_LABELS).map(([key, label]) => (
                                            <button
                                                key={key}
                                                onClick={() => setHairStyle(key)}
                                                style={{
                                                    padding: '0.75rem',
                                                    background: hairStyle === key ? '#007AFF' : 'white',
                                                    color: hairStyle === key ? 'white' : '#000',
                                                    border: hairStyle === key ? '2px solid #007AFF' : '1px solid #ddd',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hair Color */}
                                {hairStyle !== 'bald' && (
                                    <div>
                                        <div className="ios-setting-group-header">Hair Color</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                            {Object.entries(HAIR_COLOR_LABELS).map(([key, label]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setHairColor(key)}
                                                    style={{
                                                        padding: '0.75rem',
                                                        background: hairColor === key ? '#007AFF' : 'white',
                                                        color: hairColor === key ? 'white' : '#000',
                                                        border: hairColor === key ? '2px solid #007AFF' : '1px solid #ddd',
                                                        borderRadius: '0.5rem',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Accessories */}
                                <div>
                                    <div className="ios-setting-group-header">Accessories</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setGlasses(!glasses)}
                                            style={{
                                                padding: '0.75rem',
                                                background: glasses ? '#007AFF' : 'white',
                                                color: glasses ? 'white' : '#000',
                                                border: glasses ? '2px solid #007AFF' : '1px solid #ddd',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            👓 Glasses
                                        </button>
                                        <button
                                            onClick={() => setFacialHair(!facialHair)}
                                            style={{
                                                padding: '0.75rem',
                                                background: facialHair ? '#007AFF' : 'white',
                                                color: facialHair ? 'white' : '#000',
                                                border: facialHair ? '2px solid #007AFF' : '1px solid #ddd',
                                                borderRadius: '0.5rem',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🧔 Facial Hair
                                        </button>
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <div className="ios-setting-group-header">Background</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {BACKGROUND_COLORS.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setBgColor(color)}
                                                style={{
                                                    aspectRatio: '1/1',
                                                    background: color,
                                                    border: bgColor === color ? '3px solid #007AFF' : '1px solid #ddd',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    boxShadow: bgColor === color ? '0 0 0 2px white' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Randomize Button */}
                                <button
                                    onClick={randomizeCustomize}
                                    style={{
                                        padding: '1rem',
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '0.75rem',
                                        fontWeight: 600,
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    🎲 Randomize All
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemojiPicker;

