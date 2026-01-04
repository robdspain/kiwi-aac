import { useState, useEffect } from 'react';
import multiavatar from '@multiavatar/multiavatar';

const MemojiPicker = ({ onSelect, onClose, initialName = '', initialSeed = null }) => {
    const [name, setName] = useState(initialName || '');
    const [selectedSeed, setSelectedSeed] = useState(initialSeed);
    const [selectedSvg, setSelectedSvg] = useState(() => (initialSeed ? multiavatar(initialSeed) : null));
    const [randomSeeds, setRandomSeeds] = useState([]);

    // Generate random seeds on mount
    useEffect(() => {
        refreshAvatars();
    }, []);

    // If name changes and we haven't manually selected one, maybe show the name's avatar?
    // For now, let's keep them separate to allow "Mom" to look like anything.
    
    // Auto-select the first one initially or if name is typed? 
    // Let's just default to a random one if nothing selected.
    useEffect(() => {
        if (!selectedSvg && randomSeeds.length > 0) {
            const seed = randomSeeds[0];
            setSelectedSeed(seed);
            setSelectedSvg(multiavatar(seed));
        }
    }, [randomSeeds, selectedSvg]);

    useEffect(() => {
        if (initialName) setName(initialName);
    }, [initialName]);

    useEffect(() => {
        if (initialSeed) {
            setSelectedSeed(initialSeed);
            setSelectedSvg(multiavatar(initialSeed));
        }
    }, [initialSeed]);

    const refreshAvatars = () => {
        const seeds = Array.from({ length: 12 }, () => Math.random().toString(36).substring(7));
        setRandomSeeds(seeds);
    };

    const handleSelect = (seed, svgCode) => {
        setSelectedSeed(seed);
        setSelectedSvg(svgCode);
    };

    const formatAvatarSvg = (svgCode) => {
        if (!svgCode) return '';
        if (svgCode.includes('width=') || svgCode.includes('height=')) return svgCode;
        return svgCode.replace(
            '<svg ',
            '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" '
        );
    };

    const handleSave = () => {
        if (!selectedSvg) return alert('Please select a character');
        
        const svgToEncode = formatAvatarSvg(selectedSvg);
        // Convert SVG string to Base64 Data URL
        const svgBase64 = btoa(unescape(encodeURIComponent(svgToEncode)));
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

        const trimmedName = name.trim();

        onSelect(dataUrl, { 
            name: trimmedName || 'Avatar', 
            type: 'multiavatar',
            id: Date.now(), // Unique ID
            seed: selectedSeed
        });
    };

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div
                className="ios-bottom-sheet"
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                style={{ height: '80vh' }}
            >
                <button className="ios-close-button" onClick={onClose} aria-label="Close">✕</button>
                <div className="ios-sheet-header">
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <h2 className="ios-sheet-title">Create Avatar</h2>
                    <button className="ios-done-button" onClick={handleSave}>Done</button>
                </div>

                <div className="ios-sheet-content" style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Preview Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
                        <div style={{ 
                            width: '8rem', height: '8rem', 
                            background: 'white', borderRadius: '50%', 
                            border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            overflow: 'hidden', marginBottom: '1rem'
                        }}
                        dangerouslySetInnerHTML={{ __html: formatAvatarSvg(selectedSvg) }}
                        />
                        
                        <div className="ios-setting-card" style={{ width: '100%' }}>
                            <div className="ios-row">
                                <span style={{ fontWeight: 600 }}>Name</span>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    onInput={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSave();
                                    }}
                                    style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                    placeholder="e.g. Mom"
                                    autoCapitalize="words"
                                    autoCorrect="on"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                        <div className="ios-setting-group-header" style={{ marginBottom: 0 }}>Choose a Look</div>
                        <button onClick={refreshAvatars} style={{ color: 'var(--primary)', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                            🔄 Shuffle
                        </button>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(4, 1fr)', 
                        gap: '0.75rem',
                        paddingBottom: '2rem'
                    }}>
                        {randomSeeds.map(seed => {
                            const svg = multiavatar(seed);
                            return (
                                <button
                                    key={seed}
                                    onClick={() => handleSelect(seed, svg)}
                                    style={{
                                        aspectRatio: '1/1',
                                        background: 'white',
                                        border: selectedSeed === seed ? '3px solid #007AFF' : '1px solid #ddd',
                                        borderRadius: '1rem',
                                        padding: '0.25rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        transform: selectedSeed === seed ? 'scale(1.05)' : 'scale(1)',
                                        boxShadow: selectedSeed === seed ? '0 4px 12px rgba(0,122,255,0.2)' : 'none',
                                        overflow: 'hidden'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: formatAvatarSvg(svg) }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemojiPicker;
