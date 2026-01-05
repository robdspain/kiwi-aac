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
    IonNote
} from '@ionic/react';
import {
    closeOutline,
    settingsOutline,
    happyOutline,
    brushOutline,
    bookOutline,
    cameraOutline,
    starOutline,
    chevronBackOutline,
    checkmarkOutline,
    chevronForwardOutline
} from 'ionicons/icons';
import { EMOJI_DATA } from '../utils/emojiData';
import { getOpenMojiUrl } from '../utils/imageUtils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import ImageCropModal from './ImageCropModal';

const iconsData = {
    'TV': [{ w: 'Elmo', i: '🔴' }, { w: 'Bluey', i: '🐶' }, { w: 'Music', i: '🎵' }, { w: 'Book', i: '📚' }],
    'Food': [{ w: 'Apple', i: '🍎' }, { w: 'Banana', i: '🍌' }, { w: 'Juice', i: '🧃' }, { w: 'Cookie', i: '🍪' }],
    'Toys': [{ w: 'Ball', i: '⚽' }, { w: 'Blocks', i: '🧱' }, { w: 'Car', i: '🚗' }, { w: 'Bubbles', i: '🫧' }],
    'Feelings': [{ w: 'Happy', i: '😄' }, { w: 'Sad', i: '😢' }, { w: 'Mad', i: '😠' }]
};

const ImageWithFallback = ({ src, alt, fallback, style }) => {
    const [failed, setFailed] = useState(false);
    if (failed || !src) return <span style={style}>{fallback}</span>;
    return (
        <img
            src={src}
            alt={alt}
            style={style}
            onError={() => setFailed(true)}
        />
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
    const [activeCategory, setActiveCategory] = useState(Object.keys(iconsData)[0] || 'My Icons');
    const [searchQuery, setSearchQuery] = useState('');
    const [symbols, setSymbols] = useState([]);
    const [arasaacSymbols, setArasaacSymbols] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showLibraryFilters, setShowLibraryFilters] = useState(false);
    const [selectedLibraries, setSelectedLibraries] = useState(['emoji', 'openmoji', 'arasaac']);
    const [customizingItem, setCustomizingItem] = useState(null);
    const [peekItem, setPeekItem] = useState(null);
    const [customName, setCustomName] = useState('');
    const [cropSource, setCropSource] = useState(null);
    const [cropName, setCropName] = useState('');
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef(null);
    const lastCustomizingItemIdRef = useRef(null);
    const peekTimerRef = useRef(null);
    const [showSaveOptions, setShowSaveOptions] = useState(false);

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
            onSelect(customName || customizingItem.word, customizingItem.icon, customizingItem.isImage);
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

    useEffect(() => {
        if (activeTab === 'emoji' || activeTab === 'openmoji') {
            const emojiCategories = ['My Icons', ...Object.keys(iconsData)];
            if (!emojiCategories.includes(activeCategory)) {
                setActiveCategory(emojiCategories[0] || 'My Icons');
            }
        } else if (activeTab === 'symbol') {
            const symbolCategories = Object.keys(EMOJI_DATA);
            if (symbolCategories.length > 0 && !symbolCategories.includes(activeCategory)) {
                setActiveCategory(symbolCategories[0]);
            }
        }
    }, [activeTab, activeCategory]);

    const tabs = [
        { id: 'emoji', icon: happyOutline, label: 'Emoji' },
        { id: 'openmoji', icon: brushOutline, label: 'OpenMoji' },
        { id: 'symbol', icon: bookOutline, label: 'Symbols' },
        { id: 'photo', icon: cameraOutline, label: 'Photos' }
    ];

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
                    <IonToolbar>
                        <IonSearchbar
                            value={searchQuery}
                            onIonInput={(e) => setSearchQuery(e.detail.value)}
                            placeholder="Search icons..."
                            style={{ '--border-radius': '0.75rem' }}
                        />
                    </IonToolbar>
                )}
            </IonHeader>

            <IonContent style={{ '--background': '#F2F2F7' }}>
                {customizingItem ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
                        <div style={{ width: '8rem', height: '8rem', background: 'white', borderRadius: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', fontSize: '4.5rem', overflow: 'hidden' }}>
                            {customizingItem.isImage ? <img src={customizingItem.icon} alt="Selected" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{customizingItem.icon}</span>}
                        </div>
                        <IonList inset={true} style={{ width: '100%' }}>
                            <IonItem>
                                <IonLabel position="fixed" style={{ fontWeight: 600 }}>Label</IonLabel>
                                <IonInput
                                    value={customName}
                                    onIonInput={(e) => setCustomName(e.detail.value)}
                                    placeholder="Enter label"
                                    className="ion-text-right"
                                    autofocus
                                />
                            </IonItem>
                        </IonList>
                    </div>
                ) : (
                    <>
                        {showLibraryFilters && (
                            <div style={{ margin: '0 1rem 1rem' }}>
                                <IonList inset={true}>
                                    <IonListHeader>Search Sources</IonListHeader>
                                    {[
                                        { id: 'emoji', label: 'System Emoji' },
                                        { id: 'openmoji', label: 'OpenMoji' },
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

                            {!searchQuery.trim() && (activeTab === 'emoji' || activeTab === 'openmoji' || activeTab === 'symbol') && (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                                    {(activeTab === 'symbol' ? Object.keys(EMOJI_DATA) : ['My Icons', ...Object.keys(iconsData)]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                triggerHaptic('light');
                                                setActiveCategory(cat);
                                            }}
                                            style={{
                                                background: activeCategory === cat ? 'var(--primary)' : '#fff',
                                                color: activeCategory === cat ? '#fff' : '#000',
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
                                    if (activeTab === 'photo') {
                                        return (
                                            <>
                                                <div style={{ gridColumn: '1/-1', marginBottom: '1rem', width: '100%' }}>
                                                    <IonButton expand="block" onClick={handleUploadClick} fill="solid" style={{ fontWeight: 600 }}>
                                                        <IonIcon icon={cameraOutline} slot="start" />
                                                        Upload from Device
                                                    </IonButton>
                                                </div>
                                                {userPhotos.length === 0 ? (
                                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', opacity: 0.5 }}>No photos yet.</div>
                                                ) : userPhotos.map((photo, index) => (
                                                    <button key={index} className="picker-btn" onClick={() => handleItemSelect(photo.w, photo.i, true)} style={{ minHeight: '6rem' }}>
                                                        <img src={photo.i} alt={photo.w} style={{ width: '100%', height: '4rem', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                                        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{photo.w}</span>
                                                    </button>
                                                ))}
                                            </>
                                        );
                                    }

                                    let results = [];
                                    const normalizedQuery = searchQuery.trim().toLowerCase();

                                    if (activeTab === 'emoji' || activeTab === 'openmoji') {
                                        const userIconsList = (userItems || []).filter(item => item.type === 'button').map(item => ({ w: item.word, i: item.icon, isUserIcon: true }));
                                        const libraryIcons = Object.values(iconsData).flat();
                                        if (normalizedQuery) {
                                            const userMatches = userIconsList.filter(item => item.w.toLowerCase().includes(normalizedQuery));
                                            const libraryMatches = libraryIcons.filter(item => item.w.toLowerCase().includes(normalizedQuery));
                                            const allEmojis = Object.values(EMOJI_DATA).flat();
                                            const emojiResults = allEmojis.filter(item => item.name?.toLowerCase().includes(normalizedQuery)).slice(0, 30);
                                            results = dedupeIcons([...userMatches, ...libraryMatches, ...emojiResults.map(e => ({ w: e.name, i: e.emoji }))]);
                                        } else {
                                            results = (activeCategory === 'My Icons' ? dedupeIcons(userIconsList) : iconsData[activeCategory] || []);
                                        }
                                    } else if (activeTab === 'symbol') {
                                        if (normalizedQuery) {
                                            if (selectedLibraries.includes('emoji') || selectedLibraries.includes('openmoji')) results.push(...symbols.map(s => ({ ...s, type: 'emoji' })));
                                            if (selectedLibraries.includes('arasaac')) results.push(...arasaacSymbols.map(s => ({ ...s, type: 'arasaac', isArasaac: true })));
                                        } else {
                                            results = EMOJI_DATA[activeCategory] || [];
                                        }
                                    }

                                    if (results.length === 0 && !isLoading) return <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2.5rem', color: '#666' }}>No icons found</div>;

                                    return results.map((item, index) => {
                                        const iconVal = item.icon || item.emoji || item.i;
                                        const wordVal = item.word || item.name || item.w;
                                        const isAlreadyImage = typeof iconVal === 'string' && (iconVal.startsWith('http') || iconVal.startsWith('data:'));
                                        const isArasaac = item.isArasaac;

                                        let displayIcon = iconVal;
                                        let isOutputImage = isAlreadyImage || isArasaac;

                                        if ((activeTab === 'openmoji' || (activeTab === 'symbol' && selectedLibraries.includes('openmoji'))) && !isAlreadyImage) {
                                            displayIcon = getOpenMojiUrl(iconVal);
                                            isOutputImage = true;
                                        }

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
                                                    <ImageWithFallback src={displayIcon} alt={wordVal} fallback={iconVal} style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px' }} />
                                                ) : <span className="emoji-span">{displayIcon}</span>}
                                                <span>{wordVal}</span>
                                                {item.isUserIcon && <span style={{ position: 'absolute', top: '0.125rem', right: '0.125rem', fontSize: '0.5rem', background: '#34C759', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>MY</span>}
                                                {isArasaac && <span style={{ position: 'absolute', top: '0.125rem', right: '0.125rem', fontSize: '0.5rem', background: '#007AFF', color: 'white', borderRadius: '0.25rem', padding: '0.0625rem 0.1875rem' }}>SYM</span>}
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
