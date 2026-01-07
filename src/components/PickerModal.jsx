import { useState, useEffect, useRef } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonNote,
    IonInput,
    IonListHeader
} from '@ionic/react';
import {
    closeOutline,
    settingsOutline,
    happyOutline,
    bookOutline,
    cameraOutline,
    chevronBackOutline,
    checkmarkOutline,
    searchOutline
} from 'ionicons/icons';
import { EMOJI_DATA } from '../utils/emojiData';
import { AAC_LEXICON } from '../data/aacLexicon';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import ImageCropModal from './ImageCropModal';

const iconsData = {
    'Characters': [{ w: 'Elmo', i: '🔴' }, { w: 'Bluey', i: '🐶' }, { w: 'Music', i: '🎵' }, { w: 'Book', i: '📚' }],
    'Food': [{ w: 'Apple', i: '🍎' }, { w: 'Banana', i: '🍌' }, { w: 'Juice', i: '🧃' }, { w: 'Cookie', i: '🍪' }],
    'Toys': [{ w: 'Ball', i: '⚽' }, { w: 'Blocks', i: '🧱' }, { w: 'Car', i: '🚗' }, { w: 'Bubbles', i: '🫧' }],
    'Feelings': [{ w: 'Happy', i: '😄' }, { w: 'Sad', i: '😢' }, { w: 'Mad', i: '😠' }]
};

const ImageWithFallback = ({ src, alt, fallback, style }) => {
    const [failed, setFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (failed || !src) return <span style={style}>{fallback}</span>;

    return (
        <div style={{ position: 'relative', ...style }}>
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#E5E5EA',
                    borderRadius: '8px',
                    animation: 'pulse 1.5s infinite ease-in-out'
                }} />
            )}
            <img
                src={src}
                alt={alt}
                style={{
                    ...style,
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.2s ease-in'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setFailed(true);
                }}
            />
            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

const dedupeIcons = (icons) => {
    const seen = new Set();
    const results = [];
    icons.forEach(item => {
        const wordVal = (item.word || item.name || item.w || '').toLowerCase();
        const iconVal = item.icon || item.emoji || item.i || '';
        const key = `${wordVal}::${iconVal}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push(item);
    });
    return results;
};

const PickerModal = ({ isOpen, onClose, onSelect, userItems = [] }) => {
    const [activeTab, setActiveTab] = useState('emoji');
    const [activeCategory, setActiveCategory] = useState('My Icons');
    const [searchQuery, setSearchQuery] = useState('');
    const [symbols, setSymbols] = useState([]);
    const [arasaacSymbols, setArasaacSymbols] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showLibraryFilters, setShowLibraryFilters] = useState(false);
    const [selectedLibraries, setSelectedLibraries] = useState(['emoji', 'arasaac']);
    const [customizingItem, setCustomizingItem] = useState(null);
    const [peekItem, setPeekItem] = useState(null);
    const [customName, setCustomName] = useState('');
    const [cropSource, setCropSource] = useState(null);
    const [cropName, setCropName] = useState('');
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef(null);
    const lastCustomizingItemIdRef = useRef(null);
    const peekTimerRef = useRef(null);
    const wasSearchingRef = useRef(false);
    const [showSaveOptions, setShowSaveOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (!customName) return;
        const lower = customName.toLowerCase().trim();
        const entry = AAC_LEXICON[lower];
        if (entry) {
            setSelectedCategory(entry.type);
        }
    }, [customName]);

    const triggerHaptic = async (style) => {
        try {
            let impactStyle = ImpactStyle.Medium;
            if (style === 'light') impactStyle = ImpactStyle.Light;
            if (style === 'heavy') impactStyle = ImpactStyle.Heavy;
            await Haptics.impact({ style: impactStyle });
        } catch {
            // Ignore haptic errors
        }
    };

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

    const getGlobalPhotos = () => {
        const saved = localStorage.getItem('kiwi-user-photos');
        const globalList = saved ? JSON.parse(saved) : [];
        const currentBoardPhotos = (userItems || [])
            .filter(item => item.type === 'button' && typeof item.icon === 'string' && (item.icon.startsWith('data:') || item.icon.startsWith('http')))
            .map(item => ({ w: item.word, i: item.icon }));
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

    const isDataUrlPhoto = (value) => typeof value === 'string' && value.startsWith('data:');
    const countCustomPhotos = (photos) => photos.filter(photo => isDataUrlPhoto(photo.i)).length;

    const handleConfirmSelection = () => {
        setShowSaveOptions(true);
    };

    const executeSave = async (alsoUse) => {
        if (!customizingItem) return;

        if (customizingItem.isImage) {
            const photos = getGlobalPhotos();
            const isNewPhoto = !photos.find(p => p.i === customizingItem.icon);
            if (isNewPhoto) {
                const isCustomPhoto = isDataUrlPhoto(customizingItem.icon);
                if (isCustomPhoto) {
                    try {
                        const { checkCustomPhotoLimit } = await import('../utils/paywall');
                        const hasAccess = await checkCustomPhotoLimit(countCustomPhotos(photos));
                        if (!hasAccess) {
                            setShowSaveOptions(false);
                            return;
                        }
                    } catch (error) {
                        console.error('Failed to check custom photo limit:', error);
                    }
                }
                photos.unshift({ w: customName || customizingItem.word, i: customizingItem.icon });
                localStorage.setItem('kiwi-user-photos', JSON.stringify(photos));
            }
        }

        if (alsoUse) {
            onSelect(customName || customizingItem.word, customizingItem.icon, customizingItem.isImage, selectedCategory);
            setCustomizingItem(null);
            setSearchQuery('');
        } else {
            setCustomizingItem(null);
        }
        setShowSaveOptions(false);
    };

    const handleItemSelect = (word, icon, isImage) => {
        setCustomizingItem({ word, icon, isImage });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCropSource(event.target.result);
                setCropName(file.name.split('.')[0]);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = async () => {
        try {
            const { checkCustomPhotoLimit } = await import('../utils/paywall');
            const hasAccess = await checkCustomPhotoLimit(countCustomPhotos(getGlobalPhotos()));
            if (!hasAccess) return;
        } catch (error) {
            console.error('Failed to check custom photo limit:', error);
        }
        fileInputRef.current?.click();
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
        setArasaacSymbols([]);
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.arasaac.org/api/pictograms/en/search/${query}`);
            if (response.ok) {
                const data = await response.json();
                const results = data.map(s => ({
                    w: s.keywords[0].keyword,
                    i: `https://static.arasaac.org/pictograms/${s._id}/${s._id}_300.png`,
                    isImage: true,
                    source: 'Symbols'
                }));
                setArasaacSymbols(results.slice(0, 30));
            }
        } catch (error) {
            console.error('Symbol search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const trimmedQuery = (searchQuery || '').trim();
        if (trimmedQuery.length < 2) {
            setSymbols([]);
            setArasaacSymbols([]);
            return;
        }
        const timer = setTimeout(() => {
            if (selectedLibraries.includes('emoji')) {
                searchBuiltInEmojis(trimmedQuery);
            } else {
                setSymbols([]);
            }
            if (selectedLibraries.includes('arasaac')) {
                searchARASAAC(trimmedQuery);
            } else {
                setArasaacSymbols([]);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedLibraries]);

    useEffect(() => {
        const isSearching = (searchQuery || '').trim().length >= 2;
        if (isSearching && !wasSearchingRef.current) {
            setActiveTab('all');
        }
        if (!isSearching && wasSearchingRef.current && activeTab === 'all') {
            setActiveTab('emoji');
        }
        wasSearchingRef.current = isSearching;
    }, [searchQuery, activeTab]);

    useEffect(() => {
        if ((searchQuery || '').trim().length >= 2) return;
        if (activeTab === 'emoji') {
            const emojiCategories = ['My Icons', ...Object.keys(iconsData)];
            if (!emojiCategories.includes(activeCategory)) {
                setActiveCategory(emojiCategories[0] || 'My Icons');
            }
        } else if (activeTab === 'symbol') {
            const symbolCategories = Object.keys(EMOJI_DATA).filter(k => !k.startsWith('Tone') && !k.startsWith('Skin'));
            if (symbolCategories.length > 0 && !symbolCategories.includes(activeCategory)) {
                setActiveCategory(symbolCategories[0]);
            }
        }
    }, [activeTab, activeCategory]);

    const isSearching = (searchQuery || '').trim().length >= 2;
    const tabs = [
        ...(isSearching ? [{ id: 'all', icon: searchOutline, label: 'All' }] : []),
        { id: 'emoji', icon: happyOutline, label: 'Emoji' },
        { id: 'symbol', icon: bookOutline, label: 'Symbols' },
        { id: 'photo', icon: cameraOutline, label: 'Photos' }
    ];

    // Calculate display categories for Symbols tab
    const symbolDisplayCategories = (() => {
        const cats = Object.keys(EMOJI_DATA).filter(k => !k.startsWith('Tone') && !k.startsWith('Skin'));
        const mapping = { 'Things': 'Objects', 'Food': 'Food & Drink', 'TV': 'Characters' };
        const mappedCats = cats.map(c => mapping[c] || c);
        const priority = ['Activities', 'Objects', 'Food & Drink', 'Characters', 'People', 'Places', 'Nature'];
        const otherCats = mappedCats.filter(c => !priority.includes(c)).sort();
        return [...priority.filter(p => mappedCats.includes(p)), ...otherCats];
    })();

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.5, 0.9]} initialBreakpoint={0.9}>
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--padding-top': '0.5rem' }}>
                    <IonButtons slot="start">
                        {customizingItem ? (
                            <IonButton onClick={() => setCustomizingItem(null)}>
                                <IonIcon icon={chevronBackOutline} slot="start" />
                                Back
                            </IonButton>
                        ) : (
                            <IonButton onClick={onClose}>Cancel</IonButton>
                        )}
                    </IonButtons>
                    <IonTitle>{customizingItem ? 'Customize Icon' : 'Select Icon'}</IonTitle>
                    <IonButtons slot="end">
                        {customizingItem ? (
                            <IonButton onClick={handleConfirmSelection} style={{ fontWeight: 600 }}>Save</IonButton>
                        ) : (
                            <IonButton onClick={() => setShowLibraryFilters(!showLibraryFilters)} color={showLibraryFilters ? 'primary' : 'medium'}>
                                <IonIcon icon={settingsOutline} slot="icon-only" />
                            </IonButton>
                        )}
                    </IonButtons>
                </IonToolbar>
                {!customizingItem && (
                    <IonToolbar style={{ '--padding-top': '0.25rem', '--padding-bottom': '0.25rem', '--min-height': '4.25rem' }}>
                        <div style={{ padding: '0.25rem 0.75rem' }}>
                            <IonSearchbar
                                value={searchQuery}
                                onIonInput={(e) => setSearchQuery(e.detail.value ?? '')}
                                placeholder="Search icons..."
                                style={{ '--border-radius': '0.75rem', margin: 0 }}
                            />
                        </div>
                    </IonToolbar>
                )}
            </IonHeader>

            <IonContent style={{ '--background': '#F2F2F7' }}>
                {customizingItem ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
                        <div style={{ width: '8rem', height: '8rem', background: 'white', borderRadius: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '4.5rem', overflow: 'hidden' }}>
                            {customizingItem.isImage ? <img src={customizingItem.icon} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{customizingItem.icon}</span>}
                        </div>
                        <IonButton
                            expand="block"
                            fill="outline"
                            onClick={() => {
                                setSearchQuery(customName || customizingItem.word || '');
                                setCustomizingItem(null);
                            }}
                            style={{ width: '100%', maxWidth: '20rem' }}
                        >
                            Choose Different Icon
                        </IonButton>
                        <IonList inset={true} style={{ width: '100%' }}>
                            <IonItem lines="none" style={{ '--background': 'transparent' }}>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>LABEL</div>
                                    <IonInput
                                        value={customName}
                                        onIonInput={(e) => setCustomName(e.detail.value)}
                                        placeholder="Enter label"
                                        className="ion-text-center"
                                        style={{ '--padding-start': '0', fontSize: '1.25rem', fontWeight: 700 }}
                                        autofocus
                                    />
                                </div>
                            </IonItem>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%', padding: '0 0.5rem 1rem' }}>
                                {[
                                    { id: 'noun', label: 'Noun', color: '#FFEB3B', text: '#2D3436' },
                                    { id: 'verb', label: 'Verb', color: '#1B5E20', text: '#FFFFFF' },
                                    { id: 'adj', label: 'Adjective', color: '#0D47A1', text: '#FFFFFF' },
                                    { id: 'social', label: 'Social', color: '#880E4F', text: '#FFFFFF' },
                                    { id: 'question', label: 'Question', color: '#4A148C', text: '#FFFFFF' },
                                    { id: 'misc', label: 'Misc', color: '#BF360C', text: '#FFFFFF' }
                                ].map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            background: selectedCategory === cat.id ? cat.color : '#F2F2F7',
                                            color: selectedCategory === cat.id ? cat.text : '#000',
                                            border: selectedCategory === cat.id ? '2px solid #000' : '1px solid #E5E5EA',
                                            cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            minHeight: '2.5rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </IonList>
                    </div>
                ) : (
                    <>
                        {showLibraryFilters && (
                            <div style={{ margin: '0 1rem 1rem' }}>
                                <IonList inset={true}>
                                    <IonListHeader>Search Sources</IonListHeader>
                                    {[
                                        { id: 'emoji', label: 'Emoji' },
                                        { id: 'arasaac', label: 'Symbols' }
                                    ].map(lib => (
                                        <IonItem key={lib.id} button onClick={() => {
                                            if (selectedLibraries.includes(lib.id)) {
                                                if (selectedLibraries.length > 1) setSelectedLibraries(selectedLibraries.filter(id => id !== lib.id));
                                            } else {
                                                setSelectedLibraries([...selectedLibraries, lib.id]);
                                            }
                                        }}>
                                            <IonLabel>{lib.label}</IonLabel>
                                            <IonIcon icon={checkmarkOutline} slot="end" style={{ opacity: selectedLibraries.includes(lib.id) ? 1 : 0 }} color="primary" />
                                        </IonItem>
                                    ))}
                                </IonList>
                            </div>
                        )}

                        <div style={{ padding: '0 1rem' }}>
                            <IonSegment value={activeTab} onIonChange={(e) => {
                                triggerHaptic('light');
                                setActiveTab(e.detail.value);
                            }} style={{ marginBottom: '1rem' }}>
                                {tabs.map(tab => (
                                    <IonSegmentButton key={tab.id} value={tab.id}>
                                        <IonIcon icon={tab.icon} />
                                        <IonLabel style={{ fontSize: '0.6rem' }}>{tab.label}</IonLabel>
                                    </IonSegmentButton>
                                ))}
                            </IonSegment>

                            {!isSearching && (activeTab === 'emoji' || activeTab === 'symbol') && (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                    {(activeTab === 'symbol' ? symbolDisplayCategories : ['My Icons', ...Object.keys(iconsData)]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                triggerHaptic('light');
                                                // Map display name back to original data key if needed
                                                let lookupCat = cat;
                                                if (activeTab === 'symbol') {
                                                    const reverseMapping = { 'Objects': 'Things', 'Food & Drink': 'Food', 'Characters': 'TV' };
                                                    // Only map back if the original key exists in EMOJI_DATA (e.g. 'TV' might not exist, 'Characters' might be the key)
                                                    if (reverseMapping[cat] && EMOJI_DATA[reverseMapping[cat]]) {
                                                        lookupCat = reverseMapping[cat];
                                                    } else if (cat === 'Characters' && EMOJI_DATA['Characters']) {
                                                        lookupCat = 'Characters';
                                                    }
                                                }
                                                setActiveCategory(lookupCat);
                                            }}
                                            style={{
                                                background: (activeCategory === cat || 
                                                    (activeTab === 'symbol' && (
                                                        (cat === 'Objects' && activeCategory === 'Things') ||
                                                        (cat === 'Food & Drink' && activeCategory === 'Food') ||
                                                        (cat === 'Characters' && activeCategory === 'TV')
                                                    ))) ? 'var(--primary)' : '#fff',
                                                color: (activeCategory === cat || 
                                                    (activeTab === 'symbol' && (
                                                        (cat === 'Objects' && activeCategory === 'Things') ||
                                                        (cat === 'Food & Drink' && activeCategory === 'Food') ||
                                                        (cat === 'Characters' && activeCategory === 'TV')
                                                    ))) ? '#fff' : '#000',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '1.25rem',
                                                border: 'none',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                fontSize: '0.8125rem',
                                                minHeight: '2.75rem',
                                                flexShrink: 0,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {cat === 'My Icons' ? '⭐ ' : ''}{cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="picker-grid">
                                {(() => {
                                    const normalizedQuery = (searchQuery || '').trim().toLowerCase();
                                    const userIconsList = (userItems || [])
                                        .filter(item => item.type === 'button')
                                        .map(item => ({ w: item.word, i: item.icon, isUserIcon: true }));
                                    const libraryIcons = Object.values(iconsData).flat();
                                    const emojiSearchMatches = symbols.map(item => ({ w: item.name, i: item.emoji }));

                                    const emojiResults = isSearching
                                        ? (selectedLibraries.includes('emoji')
                                            ? dedupeIcons([
                                                ...userIconsList.filter(item => item.w.toLowerCase().includes(normalizedQuery)),
                                                ...libraryIcons.filter(item => item.w.toLowerCase().includes(normalizedQuery)),
                                                ...emojiSearchMatches
                                            ])
                                            : [])
                                        : (activeCategory === 'My Icons' ? dedupeIcons(userIconsList) : iconsData[activeCategory] || []);

                                    const symbolResults = isSearching
                                        ? (selectedLibraries.includes('arasaac')
                                            ? arasaacSymbols.map(item => ({ ...item, isArasaac: true }))
                                            : [])
                                        : (EMOJI_DATA[activeCategory] || []);

                                    const photoResults = isSearching
                                        ? userPhotos.filter(photo => (photo.w || '').toLowerCase().includes(normalizedQuery))
                                        : userPhotos;

                                    if (activeTab === 'photo') {
                                        return (
                                            <>
                                                <div style={{ gridColumn: '1/-1', marginBottom: '1rem', width: '100%' }}>
                                                    <IonButton expand="block" onClick={handleUploadClick} fill="solid" style={{ fontWeight: 600 }}>
                                                        <IonIcon icon={cameraOutline} slot="start" />
                                                        Upload from Device
                                                    </IonButton>
                                                </div>
                                                {photoResults.length === 0 ? (
                                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No photos yet.</div>
                                                ) : photoResults.map((photo, index) => (
                                                    <button key={index} className="picker-btn" onClick={() => handleItemSelect(photo.w, photo.i, true)} style={{ minHeight: '6rem' }}>
                                                        <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '4rem', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                                        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{photo.w}</span>
                                                    </button>
                                                ))}
                                            </>
                                        );
                                    }

                                    const allResults = isSearching ? [
                                        ...emojiResults.map(item => ({ ...item, resultType: 'emoji' })),
                                        ...symbolResults.map(item => ({ ...item, resultType: 'symbol', isArasaac: item.isArasaac || item.source === 'Symbols' })),
                                        ...photoResults.map(item => ({ ...item, resultType: 'photo', isPhoto: true }))
                                    ] : [];

                                    let results = [];
                                    if (activeTab === 'all') {
                                        results = allResults;
                                    } else if (activeTab === 'emoji') {
                                        results = emojiResults.map(item => ({ ...item, resultType: 'emoji' }));
                                    } else if (activeTab === 'symbol') {
                                        results = symbolResults.map(item => ({ ...item, resultType: 'symbol', isArasaac: item.isArasaac || item.source === 'Symbols' }));
                                    }

                                    if (results.length === 0 && !isLoading) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: '#666' }}>No icons found</div>;

                                    return results.map((item, index) => {
                                        const resultType = item.resultType || activeTab;
                                        const iconVal = item.icon || item.emoji || item.i;
                                        const wordVal = item.word || item.name || item.w;
                                        const isAlreadyImage = typeof iconVal === 'string' && (iconVal.startsWith('http') || iconVal.startsWith('data:'));
                                        const isArasaac = item.isArasaac;
                                        const isPhoto = item.isPhoto || resultType === 'photo';
                                        let displayIcon = iconVal;
                                        let isOutputImage = isAlreadyImage || isArasaac || isPhoto;

                                        return (
                                            <button
                                                key={`${wordVal}-${index}`}
                                                className="picker-btn"
                                                onClick={() => handleItemSelect(wordVal, displayIcon, isOutputImage)}
                                                onPointerDown={() => handlePointerDown(wordVal, displayIcon, isOutputImage)}
                                                onPointerUp={handlePointerUp}
                                                onPointerLeave={handlePointerUp}
                                            >
                                                {isOutputImage ? (
                                                    <ImageWithFallback src={displayIcon} alt={wordVal} fallback={iconVal} style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '8px' }} />
                                                ) : <span className="emoji-span">{displayIcon}</span>}
                                                <span>{wordVal}</span>
                                                {item.isUserIcon && <span style={{ position: 'absolute', top: '0.125rem', right: '0.125rem', fontSize: '0.5rem', background: 'var(--success)', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>MY</span>}
                                            </button>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    </>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            </IonContent>

            {/* Peek Backdrop */}
            {peekItem && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', pointerEvents: 'none' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '12rem', height: '12rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {peekItem.isImage ? <img src={peekItem.icon} alt={peekItem.word} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: '8rem' }}>{peekItem.icon}</span>}
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{peekItem.word}</span>
                    </div>
                </div>
            )}

            {/* Crop Modal */}
            {showCropper && (
                <ImageCropModal
                    isOpen={showCropper}
                    imageSrc={cropSource}
                    onCancel={() => { setShowCropper(false); setCropSource(null); setCropName(''); }}
                    onSave={(dataUrl) => {
                        handleItemSelect(cropName || 'Photo', dataUrl, true);
                        setSearchQuery('');
                        setShowCropper(false);
                        setCropSource(null);
                        setCropName('');
                    }}
                    title="Crop Photo"
                />
            )}

            {/* Save Options Action Sheet (Manual) */}
            {showSaveOptions && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 6000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowSaveOptions(false)}>
                    <div style={{ width: '100%', background: 'white', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', padding: '1.5rem', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Save Icon</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <IonButton expand="block" color="primary" onClick={() => executeSave(true)}>Save to Library & Use</IonButton>
                            <IonButton expand="block" color="light" onClick={() => executeSave(false)}>Save to Library Only</IonButton>
                            <IonButton expand="block" fill="clear" color="danger" onClick={() => setShowSaveOptions(false)}>Cancel</IonButton>
                        </div>
                    </div>
                </div>
            )}
        </IonModal>
    );
};

export default PickerModal;
