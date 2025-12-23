import React, { useState, useEffect } from 'react';

const iconsData = {
    'TV': [{ w: 'Elmo', i: '🔴' }, { w: 'Bluey', i: '🐶' }, { w: 'Music', i: '🎵' }, { w: 'Book', i: '📚' }],
    'Food': [{ w: 'Apple', i: '🍎' }, { w: 'Banana', i: '🍌' }, { w: 'Juice', i: '🧃' }, { w: 'Cookie', i: '🍪' }],
    'Toys': [{ w: 'Ball', i: '⚽' }, { w: 'Blocks', i: '🧱' }, { w: 'Car', i: '🚗' }, { w: 'Bubbles', i: '🫧' }],
    'Feelings': [{ w: 'Happy', i: '😄' }, { w: 'Sad', i: '😢' }, { w: 'Mad', i: '😠' }]
};

const PickerModal = ({ isOpen, onClose, onSelect }) => {
    const [activeTab, setActiveTab] = useState('emoji'); // 'emoji', 'photo', or 'symbol'
    const [activeCategory, setActiveCategory] = useState('TV');
    const [searchQuery, setSearchQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
    const [isLoadingSymbols, setIsLoadingSymbols] = useState(false);

    useEffect(() => {
        if (activeTab === 'photo' && searchQuery.length > 2) {
            const timer = setTimeout(() => {
                searchUnsplash(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (activeTab === 'symbol' && searchQuery.length > 2) {
            const timer = setTimeout(() => {
                searchSymbols(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, activeTab]);

    const searchUnsplash = async (query) => {
        setIsLoadingPhotos(true);
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
            if (response.ok) {
                const data = await response.json();
                setPhotos(data.results.map(p => ({ w: query, i: p.urls.small })));
            } else {
                // Fallback: use picsum.photos
                const simulatedResults = Array.from({ length: 8 }).map((_, i) => ({
                    w: query,
                    i: `https://picsum.photos/seed/${query}${i}/200`
                }));
                setPhotos(simulatedResults);
            }
        } catch (error) {
            console.error('Photo search failed:', error);
        } finally {
            setIsLoadingPhotos(false);
        }
    };

    const searchSymbols = async (query) => {
        setIsLoadingSymbols(true);
        try {
            // OpenMoji API - CC BY-SA 4.0 (allows commercial use with attribution)
            // Using openmoji.org CDN which serves all emojis
            const response = await fetch(`https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/data/openmoji.json`);
            if (response.ok) {
                const data = await response.json();
                const queryLower = query.toLowerCase();
                const results = data
                    .filter(item =>
                        item.annotation?.toLowerCase().includes(queryLower) ||
                        item.tags?.toLowerCase().includes(queryLower)
                    )
                    .slice(0, 12)
                    .map(item => ({
                        w: item.annotation || query,
                        i: `https://openmoji.org/data/color/svg/${item.hexcode}.svg`
                    }));
                setSymbols(results);
            } else {
                setSymbols([]);
            }
        } catch (error) {
            console.error('Symbol search failed:', error);
            setSymbols([]);
        } finally {
            setIsLoadingSymbols(false);
        }
    };

    if (!isOpen) return null;


    return (
        <div id="picker-modal" style={{ display: 'flex' }}>
            <div id="picker-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>Library</h2>
                        <div style={{ display: 'flex', background: '#e0e0e0', padding: '2px', borderRadius: '8px' }}>
                            <button
                                onClick={() => setActiveTab('emoji')}
                                style={{
                                    padding: '4px 10px', border: 'none', borderRadius: '6px',
                                    background: activeTab === 'emoji' ? 'white' : 'transparent',
                                    fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                😀
                            </button>
                            <button
                                onClick={() => setActiveTab('symbol')}
                                style={{
                                    padding: '4px 10px', border: 'none', borderRadius: '6px',
                                    background: activeTab === 'symbol' ? 'white' : 'transparent',
                                    fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                🖼️
                            </button>
                            <button
                                onClick={() => setActiveTab('photo')}
                                style={{
                                    padding: '4px 10px', border: 'none', borderRadius: '6px',
                                    background: activeTab === 'photo' ? 'white' : 'transparent',
                                    fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                📷
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'rgba(0,0,0,0.1)', width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}
                    >
                        ✕
                    </button>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder={activeTab === 'emoji' ? "Search emojis..." : activeTab === 'symbol' ? "Search AAC symbols..." : "Search photos..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}

                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid #ddd',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {activeTab === 'emoji' ? (
                    <>
                        {!searchQuery && (
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {Object.keys(iconsData).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            background: activeCategory === cat ? '#007AFF' : '#f0f0f0',
                                            color: activeCategory === cat ? '#fff' : '#000',
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div id="picker-grid" className="picker-grid">
                            {(searchQuery
                                ? Object.values(iconsData).flat().filter(item =>
                                    item.w.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                : iconsData[activeCategory]
                            ).map((item, index) => (
                                <button
                                    key={`${item.w}-${index}`}
                                    className="picker-btn"
                                    onClick={() => {
                                        onSelect(item.w, item.i, false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <span style={{ fontSize: '32px' }}>{item.i}</span>
                                    <span style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>{item.w}</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'symbol' ? (
                    <div id="picker-grid" className="picker-grid">
                        {isLoadingSymbols ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Searching symbols...</div>
                        ) : symbols.length > 0 ? (
                            symbols.map((symbol, index) => (
                                <button
                                    key={index}
                                    className="picker-btn"
                                    onClick={() => {
                                        onSelect(symbol.w, symbol.i, true);
                                        setSearchQuery('');
                                    }}
                                    style={{ padding: '5px' }}
                                >
                                    <img src={symbol.i} alt={symbol.w} style={{ width: '100%', height: '60px', objectFit: 'contain', borderRadius: '8px' }} />
                                    <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>{symbol.w}</span>
                                </button>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                {searchQuery.length < 3 ? "Type 3+ characters to search AAC symbols" : "No symbols found"}
                            </div>
                        )}
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '0.7rem', color: '#888', marginTop: '10px' }}>
                            Symbols from <a href="https://openmoji.org" target="_blank" rel="noopener noreferrer">OpenMoji</a> (CC BY-SA 4.0)
                        </div>
                    </div>
                ) : (
                    <div id="picker-grid" className="picker-grid">
                        {isLoadingPhotos ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Searching...</div>
                        ) : photos.length > 0 ? (
                            photos.map((photo, index) => (
                                <button
                                    key={index}
                                    className="picker-btn"
                                    onClick={() => {
                                        onSelect(photo.w, photo.i, true);
                                        setSearchQuery('');
                                    }}
                                    style={{ padding: '5px' }}
                                >
                                    <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', width: '100%' }}>{photo.w}</span>
                                </button>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                {searchQuery.length < 3 ? "Type 3+ characters to search photos" : "No photos found"}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PickerModal;

