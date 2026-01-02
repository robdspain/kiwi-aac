import { useState, useEffect, useRef } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';

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
    const [customizingItem, setCustomizingItem] = useState(null);
    const [customName, setCustomName] = useState('');
    const fileInputRef = useRef(null);
    const lastCustomizingItemIdRef = useRef(null);

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
                    localStorage.setItem('kiwi-user-photos', JSON.stringify(photos.slice(0, 50))); // Keep last 50
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

    useEffect(() => {
        if (activeTab === 'symbol' && searchQuery.length >= 2) {
            const timer = setTimeout(() => { searchBuiltInEmojis(searchQuery); }, 500);
            return () => clearTimeout(timer);
        } else if (activeTab === 'symbol' && searchQuery.length < 2) {
            if (symbols.length > 0) setTimeout(() => setSymbols([]), 0);
        }
    }, [searchQuery, activeTab, symbols.length]);

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
                    <div className="ios-sheet-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '40px 20px' }}>
                        <div style={{ width: '120px', height: '120px', background: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '4rem', overflow: 'hidden' }}>
                            {customizingItem.isImage ? <img src={customizingItem.icon} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{customizingItem.icon}</span>}
                        </div>
                        <div className="ios-setting-card" style={{ width: '100%', maxWidth: '300px' }}>
                            <div className="ios-row">
                                <span style={{ fontWeight: 600 }}>Label</span>
                                <input 
                                    type="text" 
                                    value={customName} 
                                    onChange={(e) => setCustomName(e.target.value)} 
                                    style={{ border: 'none', textAlign: 'right', fontSize: '17px', outline: 'none', background: 'transparent', flex: 1 }}
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
        { id: 'emoji', label: '😀' },
        { id: 'symbol', label: '🖼️' },
        { id: 'photo', label: '📷' }
    ];
    const activeTabIndex = tabs.findIndex(t => t.id === activeTab);

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="ios-sheet-header" style={{ borderBottom: 'none' }}>
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <div className="ios-segmented-control" style={{ marginBottom: 0, width: '140px' }}>
                        <div 
                            className="selection-pill" 
                            style={{ 
                                width: `calc(${100 / tabs.length}% - 4px)`,
                                transform: `translateX(${activeTabIndex * 100}%)` 
                            }} 
                        />
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '6px 0' }}>{tab.label}</button>
                        ))}
                    </div>
                    <div style={{ width: '50px' }}></div>
                </div>

                <div style={{ padding: '0 20px 15px' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Search icons..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            style={{ width: '100%', padding: '10px 35px', borderRadius: '10px', border: 'none', background: '#E3E3E8', fontSize: '17px', outline: 'none' }}
                        />
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
                    </div>
                </div>

                <div className="ios-sheet-content" style={{ paddingTop: 0 }}>
                    {activeTab === 'emoji' ? (
                        <>
                            {!searchQuery && (
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', paddingRight: '20px' }}>
                                    <button onClick={() => setActiveCategory('My Icons')} style={{ background: activeCategory === 'My Icons' ? '#34C759' : '#F2F2F7', color: activeCategory === 'My Icons' ? '#fff' : '#34C759', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '13px' }}>⭐ My Icons</button>
                                    {Object.keys(iconsData).map(cat => ( 
                                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? '#007AFF' : '#F2F2F7', color: activeCategory === cat ? '#fff' : '#000', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '500', whiteSpace: 'nowrap', fontSize: '13px' }}>{cat}</button> 
                                    ))}
                                </div>
                            )}
                            <div className="picker-grid">
                                {(() => {
                                    const userIconsList = (userItems || []).filter(item => item.type === 'button').map(item => ({ w: item.word, i: item.icon, isUserIcon: true }));
                                    const libraryIcons = Object.values(iconsData).flat();
                                    let displayIcons = searchQuery ? [...userIconsList.filter(item => item.w.toLowerCase().includes(searchQuery.toLowerCase())), ...libraryIcons.filter(item => item.w.toLowerCase().includes(searchQuery.toLowerCase()))] : (activeCategory === 'My Icons' ? userIconsList : iconsData[activeCategory] || []);
                                    if (displayIcons.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>No icons found</div>;
                                    return displayIcons.map((item, index) => (
                                        <button key={`${item.w}-${index}`} className="picker-btn" onClick={() => handleItemSelect(item.word || item.w, item.icon || item.i, typeof item.i === 'string' && (item.i.startsWith('http') || item.i.startsWith('data:')))}>
                                            {typeof item.i === 'string' && (item.i.startsWith('http') || item.i.startsWith('data:')) ? <img src={item.i} alt={item.w} style={{ width: '40px', height: '40px', objectFit: 'contain' }} /> : <span style={{ fontSize: '28px' }}>{item.i}</span>}
                                            <span style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8, fontWeight: 500 }}>{item.w}</span>
                                            {item.isUserIcon && <span style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '8px', background: '#34C759', color: 'white', borderRadius: '4px', padding: '1px 3px' }}>MY</span>}
                                        </button>
                                    ));
                                })()}
                            </div>
                        </>
                    ) : activeTab === 'symbol' ? (
                        <>
                            {!searchQuery && (
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '15px', paddingRight: '20px' }}>
                                    {Object.keys(EMOJI_DATA).map(cat => ( 
                                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? '#5856D6' : '#F2F2F7', color: activeCategory === cat ? '#fff' : '#333', padding: '8px 16px', borderRadius: '20px', border: 'none', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer' }}>{cat}</button> 
                                    ))}
                                </div>
                            )}
                            <div className="picker-grid">
                                {(() => {
                                    const displayEmojis = searchQuery.length >= 2 ? symbols : (EMOJI_DATA[activeCategory] || []);
                                    if (displayEmojis.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>{searchQuery.length >= 2 ? 'No emojis found' : 'Select a category'}</div>;
                                    return displayEmojis.map((item, index) => ( 
                                        <button key={`${item.name || item.w}-${index}`} className="picker-btn" onClick={() => handleItemSelect(item.name || item.w, item.emoji || item.i, false)}>
                                            <span style={{ fontSize: '32px' }}>{item.emoji || item.i}</span>
                                            <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8, fontWeight: 500 }}>{item.name || item.w}</span>
                                        </button> 
                                    ));
                                })()}
                            </div>
                        </>
                    ) : (
                        <div className="picker-grid">
                            <div style={{ gridColumn: '1/-1', marginBottom: '15px' }}>
                                <button onClick={handleUploadClick} className="ios-row" style={{ width: '100%', borderRadius: '12px', border: 'none', justifyContent: 'center' }}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>📱 Upload from Device</span>
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
                            </div>
                            {(() => {
                                const filteredPhotos = searchQuery ? userPhotos.filter(p => p.w.toLowerCase().includes(searchQuery.toLowerCase())) : userPhotos;
                                if (filteredPhotos.length === 0) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', opacity: 0.5 }}>No uploaded photos yet.</div>;
                                return filteredPhotos.map((photo, index) => ( 
                                    <button key={index} className="picker-btn" onClick={() => handleItemSelect(photo.w, photo.i, true)}>
                                        <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <span style={{ fontSize: '10px', marginTop: '4px', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{photo.w}</span>
                                    </button> 
                                ));
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PickerModal;