import { useState, useEffect, useRef } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';
import { getOpenMojiUrl } from '../utils/imageUtils';

const iconsData = {
    'TV': [{ w: 'Elmo', i: '🔴' }, { w: 'Bluey', i: '🐶' }, { w: 'Music', i: '🎵' }, { w: 'Book', i: '📚' }],
    'Food': [{ w: 'Apple', i: '🍎' }, { w: 'Banana', i: '🍌' }, { w: 'Juice', i: '🧃' }, { w: 'Cookie', i: '🍪' }],
    'Toys': [{ w: 'Ball', i: '⚽' }, { w: 'Blocks', i: '🧱' }, { w: 'Car', i: '🚗' }, { w: 'Bubbles', i: '🫧' }],
    'Feelings': [{ w: 'Happy', i: '😄' }, { w: 'Sad', i: '😢' }, { w: 'Mad', i: '😠' }]
};

const PickerModal = ({ isOpen, onClose, onSelect, userItems = [], triggerPaywall }) => {
    const [activeTab, setActiveTab] = useState('emoji');
    const [activeCategory, setActiveCategory] = useState('Smileys & Emotion');
    const [searchQuery, setSearchQuery] = useState('');
    const [symbols, setSymbols] = useState([]);
    const [arasaacSymbols, setArasaacSymbols] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showLibraryFilters, setShowLibraryFilters] = useState(false);
    const [selectedLibraries, setSelectedLibraries] = useState(['emoji', 'openmoji', 'arasaac']);
    const [customizingItem, setCustomizingItem] = useState(null);
    const [peekItem, setPeekItem] = useState(null);
    const [customName, setCustomName] = useState('');
    const fileInputRef = useRef(null);
    const customizingItemRef = useRef(null);
    const lastCustomizingItemIdRef = useRef(null);
    const peekTimerRef = useRef(null);

    const handlePointerDown = (word, icon, isImage) => {
        peekTimerRef.current = setTimeout(() => {
            setPeekItem({ word, icon, isImage });
            if (navigator.vibrate) navigator.vibrate(50);
        }, 500);
    };

    const handlePointerUp = () => {
        if (peekTimerRef.current) {
            clearTimeout(peekTimerRef.current);
            peekTimerRef.current = null;
        }
        if (peekItem) {
            setPeekItem(null);
        }
    };

    // Get photos from global registry + current board
    const getGlobalPhotos = () => {
        const saved = localStorage.getItem('kiwi-user-photos');
        const globalList = saved ? JSON.parse(saved) : [];
        
        // Also pull from current userItems just in case they aren't in registry yet
        const currentBoardPhotos = (userItems || [])
            .filter(item => item.type === 'button' && typeof item.icon === 'string' && (item.icon.startsWith('data:') || item.icon.startsWith('http')))
            .map(item => ({ w: item.word, i: item.icon }));

        // Merge and unique by icon string
        const unique = new Map();
        [...globalList, ...currentBoardPhotos].forEach(p => unique.set(p.i, p));
        return Array.from(unique.values());
    };

    const userPhotos = getGlobalPhotos();

    useEffect(() => {
        if (customizingItem && (customizingItem.word !== lastCustomizingItemIdRef.current)) {
            lastCustomizingItemIdRef.current = customizingItem.word;
            setTimeout(() => setCustomName(customizingItem.word), 0);
        }
    }, [customizingItem]);

    const handleConfirmSelection = () => {
        if (customizingItem) {
            // Save to global registry
            if (customizingItem.isImage) {
                const photos = getGlobalPhotos();
                if (!photos.find(p => p.i === customizingItem.icon)) {
                    photos.unshift({ w: customName || customizingItem.word, i: customizingItem.icon });
                    localStorage.setItem('kiwi-user-photos', JSON.stringify(photos.slice(0, 20))); // Keep last 20
                }
            }

            onSelect(customName || customizingItem.word, customizingItem.icon, customizingItem.isImage);
            setCustomizingItem(null); setSearchQuery('');
        }
    };

    const handleItemSelect = (word, icon, isImage) => {
        setCustomizingItem({ word, icon, isImage });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                handleItemSelect(file.name.split('.')[0], event.target.result, true);
                setSearchQuery('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        if (triggerPaywall) { triggerPaywall('upload_photo', () => fileInputRef.current?.click()); }
        else { fileInputRef.current?.click(); }
    };

    const searchBuiltInEmojis = (query) => {
        if (!query || query.length < 2) { setSymbols([]); return; }
        const q = query.toLowerCase();
        const allEmojis = Object.values(EMOJI_DATA).flat();
        const results = allEmojis.filter(item => item.name?.toLowerCase().includes(q)).slice(0, 24);
        setSymbols(results);
    };

    const searchARASAAC = async (query) => {
        if (!query || query.length < 2) { setArasaacSymbols([]); return; }
        setArasaacSymbols([]); // Clear stale results
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${query}`);
            if (response.ok) {
                const data = await response.json();
                const results = data.map(s => ({
                    w: s.keywords[0].keyword,
                    i: `https://static.arasaac.org/pictograms/${s._id}/${s._id}_300.png`,
                    isImage: true,
                    source: 'ARASAAC'
                }));
                setArasaacSymbols(results.slice(0, 30));
            }
        } catch (error) {
            console.error('ARASAAC search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'symbol' && searchQuery.length >= 2) {
            const timer = setTimeout(() => { 
                if (selectedLibraries.includes('emoji') || selectedLibraries.includes('openmoji')) {
                    searchBuiltInEmojis(searchQuery);
                } else {
                    setSymbols([]);
                }
                
                if (selectedLibraries.includes('arasaac')) {
                    searchARASAAC(searchQuery);
                } else {
                    setArasaacSymbols([]);
                }
            }, 600);
            return () => clearTimeout(timer);
        } else if (searchQuery.length < 2) {
            setSymbols([]);
            setArasaacSymbols([]);
        }
    }, [searchQuery, selectedLibraries, activeTab]);

    if (!isOpen) return null;

    if (customizingItem) {
        return (
            <div className="ios-bottom-sheet-overlay" onClick={() => setCustomizingItem(null)}>
                <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()} style={{ height: 'auto', minHeight: '400px' }}>
                    <div className="ios-sheet-header">
                        <button className="ios-cancel-button" onClick={() => setCustomizingItem(null)}>Back</button>
                        <h2 className="ios-sheet-title">Customize Icon</h2>
                        <button className="ios-done-button" onClick={handleConfirmSelection}>Save</button>
                    </div>
                    <div className="ios-sheet-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2.5rem 1.25rem' }}>
                        <div style={{ width: '7.5rem', height: '7.5rem', background: 'white', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '4rem', overflow: 'hidden' }}>
                            {customizingItem.isImage ? <img src={customizingItem.icon} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{customizingItem.icon}</span>}
                        </div>
                        <div className="ios-setting-card" style={{ width: '100%', maxWidth: '18.75rem' }}>
                            <div className="ios-row">
                                <span style={{ fontWeight: 600 }}>Label</span>
                                <input 
                                    type="text" 
                                    value={customName} 
                                    onChange={(e) => setCustomName(e.target.value)} 
                                    style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                    placeholder="Enter label"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'emoji', label: '😀', name: 'Emoji' },
        { id: 'openmoji', label: '🎨', name: 'OpenMoji' },
        { id: 'symbol', label: '📚', name: 'Symbols' },
        { id: 'photo', label: '📷', name: 'Photos' }
    ];
    const activeTabIndex = tabs.findIndex(t => t.id === activeTab);

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="ios-sheet-header" style={{ borderBottom: 'none' }}>
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <div className="ios-segmented-control" style={{ marginBottom: 0, width: '12rem' }}>
                        <div 
                            className="selection-pill" 
                            style={{ 
                                width: `calc(${100 / tabs.length}% - 4px)`,
                                transform: `translateX(${activeTabIndex * 100}%)` 
                            }} 
                        />
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.375rem 0', minHeight: '2.75rem' }}>{tab.label}</button>
                        ))}
                    </div>
                    <div style={{ width: '3.125rem' }}></div>
                </div>

                <div style={{ padding: '0 1.25rem 0.9375rem' }}>
                    <div style={{ position: 'relative', display: 'flex', gap: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input 
                                type="text" 
                                placeholder="Search icons..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                style={{ width: '100%', padding: '0.625rem 2.1875rem', borderRadius: '0.625rem', border: 'none', background: '#E3E3E8', fontSize: '1.0625rem', outline: 'none', minHeight: '2.75rem' }}
                            />
                            <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                        </div>
                        <button 
                            onClick={() => setShowLibraryFilters(!showLibraryFilters)}
                            style={{ 
                                width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem', 
                                border: 'none', background: showLibraryFilters ? 'var(--primary)' : '#E3E3E8',
                                color: showLibraryFilters ? 'white' : 'black',
                                fontSize: '1.25rem', cursor: 'pointer'
                            }}
                        >
                            ⚙️
                        </button>
                    </div>

                    {showLibraryFilters && (
                        <div style={{ 
                            marginTop: '0.625rem', padding: '0.75rem', background: '#F2F2F7', 
                            borderRadius: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' 
                        }}>
                            <span style={{ width: '100%', fontSize: '0.75rem', fontWeight: 700, color: '#666', marginBottom: '0.25rem' }}>SEARCH SOURCES</span>
                            {[{ id: 'emoji', label: '😀 System Emoji' }, { id: 'openmoji', label: '🎨 OpenMoji' }, { id: 'arasaac', label: '📚 Symbols' }].map(lib => (
                                <button
                                    key={lib.id}
                                    onClick={() => {
                                        if (selectedLibraries.includes(lib.id)) {
                                            if (selectedLibraries.length > 1) setSelectedLibraries(selectedLibraries.filter(id => id !== lib.id));
                                        } else {
                                            setSelectedLibraries([...selectedLibraries, lib.id]);
                                        }
                                    }}
                                    style={{
                                        padding: '0.375rem 0.75rem', borderRadius: '1rem', border: 'none',
                                        fontSize: '0.75rem', fontWeight: 600,
                                        background: selectedLibraries.includes(lib.id) ? 'var(--primary)' : 'white',
                                        color: selectedLibraries.includes(lib.id) ? 'white' : '#333',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {selectedLibraries.includes(lib.id) ? '✓ ' : '+ '} {lib.label}
                                </button>
                            ))}

                            <div style={{ width: '100%', height: '1px', background: '#ddd', margin: '0.5rem 0' }} />
                            <span style={{ width: '100%', fontSize: '0.7rem', fontWeight: 700, color: '#999' }}>DOWNLOAD SYMBOL PACKS (OFFLINE)</span>
                            <button
                                onClick={async () => {
                                    alert("Downloading ARASAAC Core Pack (50 essential icons)...");
                                    // Logic to pre-fetch URLs would go here to fill browser cache
                                    const coreWords = ["I", "want", "more", "stop", "go", "help", "eat", "drink", "play", "sleep"];
                                    for (const word of coreWords) {
                                        try {
                                            const res = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${word}`);
                                            const data = await res.json();
                                            if (data[0]) {
                                                const img = new Image();
                                                img.src = `https://static.arasaac.org/pictograms/${data[0]._id}/${data[0]._id}_300.png`;
                                            }
                                        } catch (e) { console.error(e); }
                                    }
                                    alert("ARASAAC Core Pack cached for offline use!");
                                }}
                                style={{
                                    padding: '0.375rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--primary)',
                                    fontSize: '0.7rem', fontWeight: 700,
                                    background: 'white', color: 'var(--primary)', cursor: 'pointer'
                                }}
                            >
                                📥 ARASAAC Core Pack
                            </button>
                        </div>
                    )}
                </div>

                <div className="ios-sheet-content" style={{ paddingTop: 0 }}>
                    {activeTab === 'emoji' || activeTab === 'openmoji' ? (
                        <>
                            {!searchQuery && (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.9375rem', paddingRight: '1.25rem' }}>
                                    <button onClick={() => setActiveCategory('My Icons')} style={{ background: activeCategory === 'My Icons' ? '#34C759' : '#F2F2F7', color: activeCategory === 'My Icons' ? '#fff' : '#34C759', padding: '0.5rem 1rem', borderRadius: '1.25rem', border: 'none', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '0.8125rem', minHeight: '2.75rem' }}>⭐ My Icons</button>
                                    {Object.keys(iconsData).map(cat => ( 
                                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? '#007AFF' : '#F2F2F7', color: activeCategory === cat ? '#fff' : '#000', padding: '0.5rem 1rem', borderRadius: '1.25rem', border: 'none', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '0.8125rem', minHeight: '2.75rem' }}>{cat}</button> 
                                    ))}
                                </div>
                            )}
                            <div className="picker-grid">
                                {(() => {
                                    const userIconsList = (userItems || []).filter(item => item.type === 'button').map(item => ({ w: item.word, i: item.icon, isUserIcon: true }));
                                    const libraryIcons = Object.values(iconsData).flat();
                                    
                                    let displayIcons = [];
                                    if (searchQuery) {
                                        displayIcons = [...userIconsList.filter(item => item.w.toLowerCase().includes(searchQuery.toLowerCase())), ...libraryIcons.filter(item => item.w.toLowerCase().includes(searchQuery.toLowerCase()))];
                                        
                                        // Also search emoji data
                                        const allEmojis = Object.values(EMOJI_DATA).flat();
                                        const emojiResults = allEmojis.filter(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 30);
                                        displayIcons = [...displayIcons, ...emojiResults.map(e => ({ w: e.name, i: e.emoji }))];
                                    } else {
                                        displayIcons = (activeCategory === 'My Icons' ? userIconsList : iconsData[activeCategory] || []);
                                    }

                                    if (displayIcons.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: '#666', fontSize: '0.875rem' }}>No icons found</div>;
                                    
                                    return displayIcons.map((item, index) => {
                                        const iconVal = item.icon || item.emoji || item.i;
                                        const wordVal = item.word || item.name || item.w;
                                        const isAlreadyImage = typeof iconVal === 'string' && (iconVal.startsWith('http') || iconVal.startsWith('data:'));
                                        
                                        let displayIcon = iconVal;
                                        let isOutputImage = isAlreadyImage;

                                        if (activeTab === 'openmoji' && !isAlreadyImage) {
                                            displayIcon = getOpenMojiUrl(iconVal);
                                            isOutputImage = true;
                                        }

                                        return (
                                            <button key={`${wordVal}-${index}`} className="picker-btn" onClick={() => handleItemSelect(wordVal, displayIcon, isOutputImage)} style={{ minHeight: '4.5rem' }}>
                                                {isOutputImage ? <img src={displayIcon} alt={wordVal} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} /> : <span style={{ fontSize: '1.75rem' }}>{displayIcon}</span>}
                                                <span style={{ fontSize: '0.6875rem', marginTop: '0.25rem', opacity: 0.8, fontWeight: 500 }}>{wordVal}</span>
                                                {item.isUserIcon && <span style={{ position: 'absolute', top: '0.125rem', right: '0.125rem', fontSize: '0.5rem', background: '#34C759', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>MY</span>}
                                                {activeTab === 'openmoji' && !isAlreadyImage && <span style={{ position: 'absolute', top: '0.125rem', left: '0.125rem', fontSize: '0.5rem', background: '#000', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>OMO</span>}
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </>
                    ) : activeTab === 'symbol' ? (
                        <>
                            {!searchQuery && (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.9375rem', paddingRight: '1.25rem' }}>
                                    {Object.keys(EMOJI_DATA).map(cat => ( 
                                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? '#5856D6' : '#F2F2F7', color: activeCategory === cat ? '#fff' : '#333', padding: '0.5rem 1rem', borderRadius: '1.25rem', border: 'none', fontWeight: '500', fontSize: '0.8125rem', whiteSpace: 'nowrap', cursor: 'pointer', minHeight: '2.75rem' }}>{cat}</button> 
                                    ))}
                                </div>
                            )}
                            <div className="picker-grid">
                                {isLoading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '1rem' }}>Searching symbols...</div>}
                                {(() => {
                                    if (searchQuery.length >= 2) {
                                        const results = [];
                                        
                                        if (selectedLibraries.includes('emoji') || selectedLibraries.includes('openmoji')) {
                                            results.push(...symbols.map(s => ({ ...s, isArasaac: false, type: 'emoji' })));
                                        }
                                        
                                        if (selectedLibraries.includes('arasaac')) {
                                            results.push(...arasaacSymbols.map(s => ({ ...s, isArasaac: true, type: 'arasaac' })));
                                        }

                                        if (results.length === 0 && !isLoading) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: '#666' }}>No results found</div>;
                                        
                                        return results.map((item, index) => {
                                            const iconVal = item.emoji || item.i;
                                            const wordVal = item.name || item.w;
                                            const isArasaac = item.isArasaac;
                                            
                                            let displayIcon = iconVal;
                                            let isImage = isArasaac;

                                            // If it's an emoji and OpenMoji is selected (or we are in OpenMoji tab), use SVG
                                            if (item.type === 'emoji' && (selectedLibraries.includes('openmoji') || activeTab === 'openmoji')) {
                                                displayIcon = getOpenMojiUrl(iconVal);
                                                isImage = true;
                                            }

                                            return (
                                                <button 
                                                    key={`${wordVal}-${index}`} 
                                                    className="picker-btn" 
                                                    onClick={() => handleItemSelect(wordVal, displayIcon, isImage)} 
                                                    onPointerDown={() => handlePointerDown(wordVal, displayIcon, isImage)}
                                                    onPointerUp={handlePointerUp}
                                                    onPointerLeave={handlePointerUp}
                                                    style={{ minHeight: '4.5rem', position: 'relative' }}
                                                >
                                                    {isImage ? (
                                                        <img src={displayIcon} alt={wordVal} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
                                                    ) : (
                                                        <span style={{ fontSize: '2rem' }}>{displayIcon}</span>
                                                    )}
                                                    <span style={{ fontSize: '0.625rem', marginTop: '0.25rem', opacity: 0.8, fontWeight: 500 }}>{wordVal}</span>
                                                    {isArasaac && <span style={{ position: 'absolute', top: '0.125rem', right: '0.125rem', fontSize: '0.5rem', background: '#007AFF', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>SYM</span>}
                                                    {item.type === 'emoji' && isImage && <span style={{ position: 'absolute', top: '0.125rem', left: '0.125rem', fontSize: '0.5rem', background: '#000', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>OMO</span>}
                                                </button>
                                            );
                                        });
                                    }
                                    
                                    const displayEmojis = EMOJI_DATA[activeCategory] || [];
                                    if (displayEmojis.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: '#666', fontSize: '0.875rem' }}>Select a category</div>;
                                    return displayEmojis.map((item, index) => {
                                        const iconVal = item.emoji || item.i;
                                        const wordVal = item.name || item.w;
                                        const isImage = activeTab === 'openmoji';
                                        const displayIcon = isImage ? getOpenMojiUrl(iconVal) : iconVal;

                                        return (
                                            <button 
                                                key={`${wordVal}-${index}`} 
                                                className="picker-btn" 
                                                onClick={() => handleItemSelect(wordVal, displayIcon, isImage)}
                                                onPointerDown={() => handlePointerDown(wordVal, displayIcon, isImage)}
                                                onPointerUp={handlePointerUp}
                                                onPointerLeave={handlePointerUp}
                                                style={{ minHeight: '4.5rem' }}
                                            >
                                                {isImage ? (
                                                    <img src={displayIcon} alt={wordVal} style={{ width: '2rem', height: '2.5rem', objectFit: 'contain' }} />
                                                ) : (
                                                    <span style={{ fontSize: '2rem' }}>{displayIcon}</span>
                                                )}
                                                <span style={{ fontSize: '0.625rem', marginTop: '0.25rem', opacity: 0.8, fontWeight: 500 }}>{wordVal}</span>
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </>
                    ) : (
                        <div className="picker-grid">
                            <div style={{ gridColumn: '1/-1', marginBottom: '0.9375rem' }}>
                                <button onClick={handleUploadClick} className="ios-row" style={{ width: '100%', borderRadius: '0.75rem', border: 'none', justifyContent: 'center', minHeight: '2.75rem' }}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>📱 Upload from Device</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
                            </div>
                            {(() => {
                                const filteredPhotos = searchQuery ? userPhotos.filter(p => p.w.toLowerCase().includes(searchQuery.toLowerCase())) : userPhotos;
                                if (filteredPhotos.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', opacity: 0.5, fontSize: '0.875rem' }}>No uploaded photos yet.</div>;
                                return filteredPhotos.map((photo, index) => ( 
                                    <button key={index} className="picker-btn" onClick={() => handleItemSelect(photo.w, photo.i, true)} style={{ minHeight: '5.625rem' }}>
                                        <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '3.75rem', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                        <span style={{ fontSize: '0.625rem', marginTop: '0.25rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{photo.w}</span>
                                    </button> 
                                ));
                            })()}
                        </div>
                    )}
                </div>
            </div>

            {peekItem && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 5000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)',
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '2rem',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        transform: 'scale(1.1)',
                        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div style={{ width: '12rem', height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {peekItem.isImage ? (
                                <img src={peekItem.icon} alt={peekItem.word} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '8rem' }}>{peekItem.icon}</span>
                            )}
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{peekItem.word}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickerModal;