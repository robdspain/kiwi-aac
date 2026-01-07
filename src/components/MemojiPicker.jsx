import { useState, useEffect } from 'react';
import {
    generateAvatar,
    generateRandomAvatars,
    SKIN_TONE_OPTIONS,
    TOP_TYPE_LABELS,
    HAIR_COLOR_LABELS,
    FACIAL_HAIR_LABELS,
    CLOTHING_LABELS,
    ACCESSORIES_LABELS,
    EYES_LABELS,
    EYEBROW_LABELS,
    MOUTH_LABELS,
    BACKGROUND_COLORS,
    FACIAL_HAIR_COLOR_HEX,
    CLOTHES_COLOR_HEX,
    HAT_COLOR_HEX,
    ACCESSORIES_COLOR_HEX
} from '../utils/dicebearGenerator';

const MemojiPicker = ({ onSelect, onClose, initialName = '', initialConfig = null }) => {
    const [name, setName] = useState(initialName || '');
    const [activeTab, setActiveTab] = useState('presets');
    const [activeCategory, setActiveCategory] = useState('body');

    // Seed state DECOUPLED from name
    const [seed, setSeed] = useState(initialConfig?.seed || Math.random().toString(36).substring(7));

    // Presets tab state
    const [presets, setPresets] = useState([]);
    const [selectedPreset, setSelectedPreset] = useState(null);

    // Customize tab state
    const [skinColor, setSkinColor] = useState(initialConfig?.skinColor || 'light');
    const [top, setTop] = useState(initialConfig?.top || 'shortHairShortFlat');
    const [hairColor, setHairColor] = useState(initialConfig?.hairColor || 'brown');
    const [hatColor, setHatColor] = useState(initialConfig?.hatColor || 'pastelBlue');
    const [facialHair, setFacialHair] = useState(initialConfig?.facialHair || 'none');
    const [facialHairColor, setFacialHairColor] = useState(initialConfig?.facialHairColor || 'brown');
    const [clothing, setClothing] = useState(initialConfig?.clothing || 'shirtCrewNeck');
    const [clothesColor, setClothesColor] = useState(initialConfig?.clothesColor || 'blue02');
    const [accessories, setAccessories] = useState(initialConfig?.accessories || 'none');
    const [accessoriesColor, setAccessoriesColor] = useState(initialConfig?.accessoriesColor || 'black');

    // New Face Attributes
    const [eyes, setEyes] = useState(initialConfig?.eyes || 'default');
    const [eyebrows, setEyebrows] = useState(initialConfig?.eyebrows || 'default');
    const [mouth, setMouth] = useState(initialConfig?.mouth || 'default');

    const [bgColor, setBgColor] = useState(initialConfig?.backgroundColor || 'b6e3f4');

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
                seed, // Stable seed, not name
                skinColor,
                top,
                hairColor,
                hatColor,
                facialHair,
                facialHairColor,
                clothing,
                clothesColor,
                accessories,
                accessoriesColor,
                eyes,
                eyebrows,
                mouth,
                backgroundColor: bgColor
            });
            setPreview(dataUrl);
        }
    }, [activeTab, seed, skinColor, top, hairColor, hatColor, facialHair, facialHairColor, clothing, clothesColor, accessories, accessoriesColor, eyes, eyebrows, mouth, bgColor]);

    // Initial name set
    useEffect(() => {
        if (initialName) setName(initialName);
    }, [initialName]);

    const refreshPresets = () => {
        const newPresets = generateRandomAvatars(12);
        setPresets(newPresets);
        if (newPresets.length > 0 && !selectedPreset) {
            setSelectedPreset(0);
            applyConfig(newPresets[0].config);
        }
    };

    const handlePresetSelect = (index) => {
        setSelectedPreset(index);
        applyConfig(presets[index].config);
    };

    const applyConfig = (config) => {
        setSeed(config.seed);
        setSkinColor(config.skinColor);
        setTop(config.top);
        setHairColor(config.hairColor);
        setHatColor(config.hatColor || 'pastelBlue');
        setFacialHair(config.facialHair);
        setFacialHairColor(config.facialHairColor || 'brown');
        setClothing(config.clothing);
        setClothesColor(config.clothesColor || 'blue02');
        setAccessories(config.accessories);
        setAccessoriesColor(config.accessoriesColor || 'black');
        setEyes(config.eyes || 'default');
        setEyebrows(config.eyebrows || 'default');
        setMouth(config.mouth || 'default');
        setBgColor(config.backgroundColor);
    };

    const randomizeCustomize = () => {
        const random = generateRandomAvatars(1)[0];
        applyConfig(random.config);
    };

    const [role, setRole] = useState(initialConfig?.role || 'other');

    const handleSave = () => {
        if (!preview) return alert('Please create an avatar');

        const trimmedName = name.trim();

        const config = {
            type: 'dicebear',
            style: 'avataaars',
            role, // Include role in config
            config: {
                seed,
                skinColor,
                top,
                hairColor,
                hatColor,
                facialHair,
                facialHairColor,
                clothing,
                clothesColor,
                accessories,
                accessoriesColor,
                eyes,
                eyebrows,
                mouth,
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
                style={{ height: '90vh' }}
            >
                <div className="ios-sheet-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1rem 0 1rem', marginBottom: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            color: '#007AFF',
                            fontSize: '1rem',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <h2 className="ios-sheet-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Create Avatar</h2>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '6px 16px',
                            background: '#007AFF',
                            color: 'white',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Save
                    </button>
                </div>

                <div className="ios-sheet-content" style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>

                    {/* Preview Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
                        <div style={{
                            width: '7rem', height: '7rem',
                            background: 'white', borderRadius: '50%',
                            border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            overflow: 'hidden', marginBottom: '1rem', position: 'relative'
                        }}>
                            {/* Re-seed button overlay */}
                            <button
                                onClick={() => setSeed(Math.random().toString(36))}
                                style={{
                                    position: 'absolute', bottom: 0, right: 0,
                                    background: 'rgba(0,0,0,0.5)', color: 'white',
                                    border: 'none', borderRadius: '50% 0 0 0',
                                    padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                🎲
                            </button>
                            {preview && <img src={preview} alt="Avatar preview" style={{ width: '100%', height: '100%' }} />}
                        </div>

                        <div className="ios-setting-card" style={{ width: '100%' }}>
                            <div className="ios-row">
                                <span style={{ fontWeight: 600 }}>Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                    placeholder="e.g. Mom"
                                />
                            </div>
                            <div className="ios-row" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 16px', borderTop: '1px solid #E5E5EA' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#666' }}>ROLE</span>
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    {[
                                        { id: 'parent', label: 'Parent', icon: '❤️' },
                                        { id: 'teacher', label: 'Teacher', icon: '🏫' },
                                        { id: 'therapist', label: 'Pro', icon: '🩺' },
                                        { id: 'other', label: 'Other', icon: '👤' }
                                    ].map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => setRole(r.id)}
                                            style={{
                                                flex: 1,
                                                padding: '8px 4px',
                                                borderRadius: '10px',
                                                border: '1px solid ' + (role === r.id ? '#007AFF' : '#E5E5EA'),
                                                background: role === r.id ? '#007AFF15' : 'white',
                                                color: role === r.id ? '#007AFF' : '#000',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <span style={{ fontSize: '1rem' }}>{r.icon}</span>
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
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
                        <button onClick={() => setActiveTab('presets')} style={{ flex: 1, minHeight: '2.75rem' }}>Presets</button>
                        <button onClick={() => setActiveTab('customize')} style={{ flex: 1, minHeight: '2.75rem' }}>Customize</button>
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', paddingBottom: '2rem' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                            {/* Category Menu */}
                            <div className="ios-scroll-container" style={{
                                padding: '0 1rem 1rem',
                                display: 'flex',
                                gap: '0.75rem',
                                overflowX: 'auto',
                                flexShrink: 0,
                                borderBottom: '1px solid #e5e5ea',
                                marginBottom: '1rem'
                            }}>
                                {[
                                    { id: 'body', label: 'Body', icon: '🎨' },
                                    { id: 'face', label: 'Face', icon: '🙂' },
                                    { id: 'hair', label: 'Hair', icon: '💇' },
                                    { id: 'outfit', label: 'Outfit', icon: '👕' },
                                    { id: 'bg', label: 'Back', icon: '🖼️' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '2rem',
                                            border: 'none',
                                            background: activeCategory === cat.id ? '#007AFF' : '#fff',
                                            color: activeCategory === cat.id ? '#fff' : '#000',
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                            fontSize: '0.9rem',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span>{cat.icon}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '0 1rem 2rem', overflowY: 'auto', flex: 1 }}>
                                {activeCategory === 'body' && (
                                    <OptionGroup label="Skin Tone" options={SKIN_TONE_OPTIONS} selected={skinColor} onChange={setSkinColor} />
                                )}

                                {activeCategory === 'face' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <OptionGroup label="Eyes" options={EYES_LABELS} selected={eyes} onChange={setEyes} />
                                        <OptionGroup label="Eyebrows" options={EYEBROW_LABELS} selected={eyebrows} onChange={setEyebrows} />
                                        <OptionGroup label="Mouth" options={MOUTH_LABELS} selected={mouth} onChange={setMouth} />
                                        <OptionGroup label="Accessories" options={ACCESSORIES_LABELS} selected={accessories} onChange={setAccessories} />
                                        <OptionGroup label="Glasses Color" options={colorOptions(ACCESSORIES_COLOR_HEX)} selected={accessoriesColor} onChange={setAccessoriesColor} isColor />
                                    </div>
                                )}

                                {activeCategory === 'hair' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <OptionGroup label="Hairstyle & Hats" options={TOP_TYPE_LABELS} selected={top} onChange={setTop} />
                                        <OptionGroup label="Hair Color" options={HAIR_COLOR_LABELS} selected={hairColor} onChange={setHairColor} />
                                        <OptionGroup label="Hat Color" options={colorOptions(HAT_COLOR_HEX)} selected={hatColor} onChange={setHatColor} isColor />
                                        <OptionGroup label="Facial Hair" options={FACIAL_HAIR_LABELS} selected={facialHair} onChange={setFacialHair} />
                                        <OptionGroup label="Facial Hair Color" options={HAIR_COLOR_LABELS} selected={facialHairColor} onChange={setFacialHairColor} />
                                    </div>
                                )}

                                {activeCategory === 'outfit' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <OptionGroup label="Clothing" options={CLOTHING_LABELS} selected={clothing} onChange={setClothing} />
                                        <OptionGroup label="Clothing Color" options={colorOptions(CLOTHES_COLOR_HEX)} selected={clothesColor} onChange={setClothesColor} isColor />
                                    </div>
                                )}

                                {activeCategory === 'bg' && (
                                    <div>
                                        <div className="ios-setting-group-header">Background Color</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                                            {BACKGROUND_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setBgColor(color)}
                                                    style={{
                                                        aspectRatio: '1/1',
                                                        background: `#${color}`,
                                                        border: bgColor === color ? '3px solid #007AFF' : '2px solid white',
                                                        borderRadius: '50%',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                        transform: bgColor === color ? 'scale(1.1)' : 'scale(1)',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e5e5ea' }}>
                                    <button onClick={randomizeCustomize} style={{ width: '100%', padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '0.75rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        🎲 Randomize Avatar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const colorOptions = (hexMap) => {
    // Generate label map for colors (simplified)
    const labels = {};
    Object.keys(hexMap).forEach(key => {
        labels[key] = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    });
    return labels;
};

const OptionGroup = ({ label, options, selected, onChange, isColor }) => (
    <div>
        <div className="ios-setting-group-header">{label}</div>
        <div style={{ display: 'grid', gridTemplateColumns: isColor ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {Object.entries(options).map(([key, label]) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    style={{
                        padding: '0.75rem',
                        background: selected === key ? '#007AFF' : 'white',
                        color: selected === key ? 'white' : '#000',
                        border: selected === key ? '2px solid #007AFF' : '1px solid #ddd',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        textTransform: isColor ? 'capitalize' : 'none'
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
);

export default MemojiPicker;
