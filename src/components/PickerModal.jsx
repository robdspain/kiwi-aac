import React, { useState, useEffect, useRef } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';

const iconsData = {
    'TV': [{ w: 'Elmo', i: '🔴' }, { w: 'Bluey', i: '🐶' }, { w: 'Music', i: '🎵' }, { w: 'Book', i: '📚' }],
    'Food': [{ w: 'Apple', i: '🍎' }, { w: 'Banana', i: '🍌' }, { w: 'Juice', i: '🧃' }, { w: 'Cookie', i: '🍪' }],
    'Toys': [{ w: 'Ball', i: '⚽' }, { w: 'Blocks', i: '🧱' }, { w: 'Car', i: '🚗' }, { w: 'Bubbles', i: '🫧' }],
    'Feelings': [{ w: 'Happy', i: '😄' }, { w: 'Sad', i: '😢' }, { w: 'Mad', i: '😠' }]
};

const PickerModal = ({ isOpen, onClose, onSelect, userItems = [], triggerPaywall }) => {
    const [activeTab, setActiveTab] = useState('symbol'); // 'emoji' is 'symbol' in this version, representing built-in library
    const [activeCategory, setActiveCategory] = useState('Smileys & Emotion');
    const [searchQuery, setSearchQuery] = useState('');
    const [symbols, setSymbols] = useState([]);
    const [isLoadingSymbols, setIsLoadingSymbols] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [customizingItem, setCustomizingItem] = useState(null); // { word, icon, isImage }
    const [customName, setCustomName] = useState('');
    const fileInputRef = useRef(null);

    // Get only photos/images from user's current board
    const userPhotos = (userItems || [])
        .filter(item => item.type === 'button' && typeof item.icon === 'string' && (item.icon.startsWith('data:') || item.icon.startsWith('http')))
        .map(item => ({
            w: item.word,
            i: item.icon
        }));

    useEffect(() => {
        if (customizingItem) {
            setCustomName(customizingItem.word);
        }
    }, [customizingItem]);

    const handleConfirmSelection = () => {
        if (customizingItem) {
            onSelect(customName || customizingItem.word, customizingItem.icon, customizingItem.isImage);
            setCustomizingItem(null);
            setSearchQuery('');
        }
    };

    const handleItemSelect = (word, icon, isImage) => {
        setCustomizingItem({ word, icon, isImage });
    };

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'symbol' && searchQuery.length > 2) {
            const timer = setTimeout(() => {
                searchSymbols(searchQuery);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, activeTab]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Return just the filename as word, and dataURL as icon, isImage=true
                const fileName = file.name.split('.')[0];
                handleItemSelect(fileName, event.target.result, true);
                setSearchQuery('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        if (triggerPaywall) {
            triggerPaywall('upload_photo', () => fileInputRef.current?.click());
        } else {
            fileInputRef.current?.click();
        }
    };

    // Get all categories from the emoji data
    const getEmojiCategories = () => Object.keys(EMOJI_DATA);

    // Get all emojis flattened for searching
    const getAllEmojis = () => Object.values(EMOJI_DATA).flat();

    // Search built-in emoji library (instant, no network needed)
    const searchBuiltInEmojis = (query) => {
        if (!query || query.length < 2) {
            setSymbols([]);
            return;
        }
        const q = query.toLowerCase();
        const results = getAllEmojis()
            .filter(item => item.name?.toLowerCase().includes(q))
            .slice(0, 24);
        setSymbols(results);
    };

    // Trigger emoji search when query changes on symbol tab
    useEffect(() => {
        if (activeTab === 'symbol' && searchQuery.length >= 2) {
            searchBuiltInEmojis(searchQuery);
        } else if (activeTab === 'symbol' && searchQuery.length < 2) {
            setSymbols([]);
        }
    }, [searchQuery, activeTab]);

    if (!isOpen) return null;

    if (customizingItem) {
        return (
            <div id="picker-modal" style={{ display: 'flex' }}>
                <div id="picker-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ marginBottom: '10px' }}>Customize Icon</h2>
                        <p style={{ color: '#666' }}>What should this icon say?</p>
                    </div>

                    <div style={{ 
                        width: '120px', height: '120px', 
                        background: 'white', borderRadius: '24px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        marginBottom: '30px',
                        fontSize: '4rem',
                        overflow: 'hidden'
                    }}>
                        {customizingItem.isImage ? (
                            <img src={customizingItem.icon} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span>{customizingItem.icon}</span>
                        )}
                    </div>

                    <div style={{ width: '100%', maxWidth: '300px', marginBottom: '40px' }}>
                        <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>Icon Label</label>
                        <input 
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Enter name..."
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: '2px solid #4ECDC4',
                                fontSize: '1.2rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                textAlign: 'center'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '300px' }}>
                        <button 
                            onClick={() => setCustomizingItem(null)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: '16px',
                                background: '#f0f0f0',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleConfirmSelection}
                            style={{
                                flex: 2,
                                padding: '16px',
                                borderRadius: '16px',
                                background: '#4ECDC4',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)'
                            }}
                        >
                            Save to Board
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div id="picker-modal" style={{ display: 'flex' }}>
            <div id="picker-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
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
                <div style={{ marginBottom: '15px', flexShrink: 0 }}>
                    <input
                        type="text"
                        placeholder={activeTab === 'emoji' ? "Search emojis..." : activeTab === 'symbol' ? "Search symbols..." : "Search photos..."}
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
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', flexShrink: 0 }}>
                                <button
                                    key="my-icons"
                                    onClick={() => setActiveCategory('My Icons')}
                                    style={{
                                        background: activeCategory === 'My Icons' ? '#34C759' : '#E8F5E9',
                                        color: activeCategory === 'My Icons' ? '#fff' : '#34C759',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        fontWeight: '600',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    ⭐ My Icons
                                </button>
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
                            {(() => {
                                // Prepare user icons in picker format
                                const userIconsList = (userItems || []).filter(item => item.type === 'button').map(item => ({
                                    w: item.word,
                                    i: item.icon,
                                    isUserIcon: true
                                }));

                                // Get library icons
                                const libraryIcons = Object.values(iconsData).flat();

                                let displayIcons;
                                if (searchQuery) {
                                    // Search both user icons and library
                                    const q = searchQuery.toLowerCase();
                                    displayIcons = [
                                        ...userIconsList.filter(item => item.w.toLowerCase().includes(q)),
                                        ...libraryIcons.filter(item => item.w.toLowerCase().includes(q))
                                    ];
                                } else if (activeCategory === 'My Icons') {
                                    displayIcons = userIconsList;
                                } else {
                                    displayIcons = iconsData[activeCategory] || [];
                                }

                                if (displayIcons.length === 0) {
                                    return (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
                                            {activeCategory === 'My Icons'
                                                ? 'No icons yet. Add some from the library!'
                                                : searchQuery
                                                    ? 'No icons found'
                                                    : 'No icons in this category'}
                                        </div>
                                    );
                                }

                                return displayIcons.map((item, index) => (
                                    <button
                                        key={`${item.w}-${index}`}
                                        className="picker-btn"
                                        onClick={() => {
                                            handleItemSelect(item.w, item.i, typeof item.i === 'string' && (item.i.startsWith('http') || item.i.startsWith('data:')));
                                        }}
                                        style={{ position: 'relative' }}
                                    >
                                        {typeof item.i === 'string' && (item.i.startsWith('http') || item.i.startsWith('data:')) ? (
                                            <img src={item.i} alt={item.w} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                                        ) : (
                                            <span style={{ fontSize: '32px' }}>{item.i}</span>
                                        )}
                                        <span style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>{item.w}</span>
                                        {item.isUserIcon && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                fontSize: '10px',
                                                background: '#34C759',
                                                color: 'white',
                                                borderRadius: '4px',
                                                padding: '2px 4px'
                                            }}>My</span>
                                        )}
                                    </button>
                                ));
                            })()}
                        </div>
                    </>
                ) : activeTab === 'symbol' ? (
                    <>
                        {!searchQuery && (
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', flexWrap: 'nowrap', flexShrink: 0 }}>
                                {getEmojiCategories().map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            background: activeCategory === cat ? '#5856D6' : '#f0f0f0',
                                            color: activeCategory === cat ? '#fff' : '#333',
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            fontWeight: '500',
                                            fontSize: '0.75rem',
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div id="picker-grid" className="picker-grid">
                            {(() => {
                                const displayEmojis = searchQuery.length >= 2
                                    ? symbols
                                    : (EMOJI_DATA[activeCategory] || []);

                                if (displayEmojis.length === 0) {
                                    return (
                                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
                                            {searchQuery.length >= 2 ? 'No emojis found' : 'Select a category or search'}
                                        </div>
                                    );
                                }

                                return displayEmojis.map((item, index) => (
                                    <button
                                        key={`${item.name || item.w}-${index}`}
                                        className="picker-btn"
                                        onClick={() => {
                                            handleItemSelect(item.name || item.w, item.emoji || item.i, false);
                                        }}
                                    >
                                        <span style={{ fontSize: '32px' }}>{item.emoji || item.i}</span>
                                        <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8 }}>{item.name || item.w}</span>
                                    </button>
                                ));
                            })()}
                        </div>
                    </>
                ) : (
                    <div id="picker-grid" className="picker-grid">
                        <div style={{ gridColumn: '1/-1', marginBottom: '10px' }}>
                            <button
                                onClick={handleUploadClick}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#E5E5EA',
                                    color: '#007AFF',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <span>📱</span> Upload from Device
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        {(() => {
                            const filteredPhotos = searchQuery
                                ? userPhotos.filter(p => p.w.toLowerCase().includes(searchQuery.toLowerCase()))
                                : userPhotos;

                            if (filteredPhotos.length === 0) {
                                return (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                        {searchQuery ? "No matching photos found" : "No uploaded photos yet. Tap 'Upload from Device' to add one!"}
                                    </div>
                                );
                            }

                            return filteredPhotos.map((photo, index) => (
                                <button
                                    key={index}
                                    className="picker-btn"
                                    onClick={() => handleItemSelect(photo.w, photo.i, true)}
                                    style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                >
                                    <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{photo.w}</span>
                                </button>
                            ));
                        })()}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PickerModal;

