import { useState, useEffect, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import VoiceRecorder from './VoiceRecorder';
import MemojiPicker from './MemojiPicker';
import ImageCropModal from './ImageCropModal';
import { saveMedia, getMedia, deleteMedia } from '../utils/db';

const EditModal = ({ isOpen, onClose, onSave, onDelete, onOpenEmojiPicker, item, customPhotoCount = 0 }) => {
    const [word, setWord] = useState('');
    const [icon, setIcon] = useState('');
    const [bgColor, setBgColor] = useState('');
    const [wc, setWc] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [customAudio, setCustomAudio] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [showMemojiPicker, setShowMemojiPicker] = useState(false);
    const [characterConfig, setCharacterConfig] = useState(null);
    const [cropSource, setCropSource] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const lastItemIdRef = useRef(null);

    useEffect(() => {
        if (isOpen && item && item.id !== lastItemIdRef.current) {
            lastItemIdRef.current = item.id;

            const loadData = async () => {
                let resolvedIcon = item.icon;
                let resolvedAudio = item.customAudio;

                if (typeof item.icon === 'string' && item.icon.startsWith('db:')) {
                    const mediaId = item.icon.split(':')[1];
                    resolvedIcon = await getMedia(mediaId);
                }

                if (typeof item.customAudio === 'string' && item.customAudio.startsWith('db:')) {
                    const mediaId = item.customAudio.split(':')[1];
                    resolvedAudio = await getMedia(mediaId);
                }

                setWord(item.word);
                setIcon(resolvedIcon);
                setBgColor(item.bgColor || '');
                setWc(item.wc || item.category || '');
                setViewMode(item.viewMode || 'grid');
                setCustomAudio(resolvedAudio);
                setCharacterConfig(item.characterConfig || null);
                setIsImage(typeof resolvedIcon === 'string' && (resolvedIcon.startsWith('/') || resolvedIcon.startsWith('data:') || resolvedIcon.includes('.')));
            };

            loadData();
        }
    }, [isOpen, item]);

    const isCustomPhotoIcon = (value) => typeof value === 'string' && (value.startsWith('data:') || value.startsWith('db:'));
    const isAvatarItem = item?.isCustomPerson || item?.characterConfig?.type === 'multiavatar';

    const ensureCustomPhotoAccess = async () => {
        if (isCustomPhotoIcon(item?.icon) && !isAvatarItem) return true;
        try {
            const { checkCustomPhotoLimit } = await import('../utils/paywall');
            return await checkCustomPhotoLimit(customPhotoCount);
        } catch (error) {
            console.error('Failed to check custom photo limit:', error);
            return true;
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const hasAccess = await ensureCustomPhotoAccess();
            if (!hasAccess) return;
            setProcessing(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setProcessing(false);
                setCropSource(event.target.result);
                setShowCropper(true);
            };
            reader.onerror = () => setProcessing(false);
            reader.readAsDataURL(file);
        }
    };

    const takePhoto = async (source = CameraSource.Prompt) => {
        const hasAccess = await ensureCustomPhotoAccess();
        if (!hasAccess) return;
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: source
            });
            if (image && image.dataUrl) {
                setCropSource(image.dataUrl);
                setShowCropper(true);
            }
        } catch (error) {
            console.error('Camera error:', error);
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="ios-sheet-header">
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <h2 className="ios-sheet-title">{item?.type === 'folder' ? 'Edit Folder' : 'Edit Button'}</h2>
                    <button
                        className="ios-done-button"
                        disabled={processing}
                        style={{ opacity: processing ? 0.5 : 1 }}
                        onClick={async () => {
                            let finalIcon = icon;
                            let finalAudio = customAudio;

                            const shouldTrackCustomPhoto = typeof icon === 'string' && icon.startsWith('data:') && !characterConfig;

                            if (shouldTrackCustomPhoto) {
                                try {
                                    const saved = localStorage.getItem('kiwi-user-photos');
                                    const photos = saved ? JSON.parse(saved) : [];
                                    if (!photos.find(p => p.i === icon)) {
                                        photos.unshift({ w: word || 'Photo', i: icon });
                                        localStorage.setItem('kiwi-user-photos', JSON.stringify(photos));
                                    }
                                } catch (error) {
                                    console.warn('Failed to update custom photo registry:', error);
                                }
                            }

                            // Move heavy icon to IndexedDB if it's a new data URL
                            if (typeof icon === 'string' && icon.startsWith('data:')) {
                                // Cleanup old entry if it was from DB
                                if (typeof item.icon === 'string' && item.icon.startsWith('db:')) {
                                    const oldId = item.icon.split(':')[1];
                                    await deleteMedia(oldId);
                                }
                                const mediaId = `img-${Date.now()}`;
                                await saveMedia(mediaId, icon);
                                finalIcon = `db:${mediaId}`;
                            }

                            // Move heavy audio to IndexedDB if it's a new data URL
                            if (typeof customAudio === 'string' && customAudio.startsWith('data:')) {
                                // Cleanup old entry if it was from DB
                                if (typeof item.customAudio === 'string' && item.customAudio.startsWith('db:')) {
                                    const oldId = item.customAudio.split(':')[1];
                                    await deleteMedia(oldId);
                                }
                                const audioId = `audio-${Date.now()}`;
                                await saveMedia(audioId, customAudio);
                                finalAudio = `db:${audioId}`;
                            }

                            onSave(word, finalIcon, bgColor, viewMode, finalAudio, characterConfig, wc);
                            onClose();
                        }}
                    >
                        {processing ? '...' : 'Save'}
                    </button>
                </div>

                <div className="ios-sheet-content" style={{ background: '#F2F2F7' }}>
                    <div className="ios-setting-group-header">Content</div>
                    <div className="ios-setting-card">
                        <div className="ios-row">
                            <span style={{ fontWeight: 600 }}>Label</span>
                            <input
                                type="text"
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                                style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                placeholder="Enter label"
                            />
                        </div>
                        {item?.type === 'folder' && (
                            <div className="ios-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.75rem', padding: '1rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6e6e73' }}>View Mode</span>
                                <div className="ios-segmented-control" style={{ marginBottom: 0 }}>
                                    <div
                                        className="selection-pill"
                                        style={{
                                            width: 'calc(50% - 4px)',
                                            transform: viewMode === 'grid' ? 'translateX(0)' : 'translateX(100%)'
                                        }}
                                    />
                                    <button onClick={() => setViewMode('grid')} style={{ minHeight: '2.75rem' }}>Grid</button>
                                    <button onClick={() => setViewMode('schedule')} style={{ minHeight: '2.75rem' }}>Schedule</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ios-setting-group-header">Appearance</div>
                    <div className="ios-setting-card">
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '6.25rem', height: '6.25rem', borderRadius: '22%', background: bgColor || 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                {isImage ? <img src={icon} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : icon}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%' }}>
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
                                        onClick={() => {
                                            setWc(cat.id);
                                            setBgColor(''); // Clear manual color so dynamic color takes over
                                        }}
                                        style={{
                                            padding: '0.75rem 0.25rem',
                                            borderRadius: '8px',
                                            background: (wc === cat.id) ? cat.color : '#F2F2F7',
                                            color: (wc === cat.id) ? cat.text : '#000',
                                            border: (wc === cat.id) ? '2px solid #000' : '1px solid #E5E5EA',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            boxShadow: (wc === cat.id) ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="ios-row" onClick={() => onOpenEmojiPicker(setWord, (ni, isImg) => { setIcon(ni); setIsImage(!!isImg); })} style={{ minHeight: '3rem' }}>
                            <span>Choose from Library</span>
                            <span className="ios-chevron">›</span>
                        </div>
                        <div className="ios-row" onClick={() => setShowMemojiPicker(true)} style={{ minHeight: '3rem' }}>
                            <span>Select Character</span>
                            <span className="ios-chevron">›</span>
                        </div>
                        <div className="ios-row" onClick={() => takePhoto(CameraSource.Prompt)} style={{ minHeight: '3rem' }}>
                            <span>📷 Add Photo or Image</span>
                            <span className="ios-chevron">›</span>
                        </div>
                    </div>

                    <div className="ios-setting-group-header">Media</div>
                    <div className="ios-setting-card">
                        <div style={{ padding: '0.3125rem' }}>
                            {item?.type !== 'folder' && <VoiceRecorder currentAudio={customAudio} onSave={(audio) => setCustomAudio(audio)} onRemove={() => setCustomAudio(null)} />}
                        </div>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                        <button
                            onClick={() => { if (window.confirm("Delete this item?")) { onDelete(); onClose(); } }}
                            className="ios-row"
                            style={{ width: '100%', border: 'none', borderRadius: '0.75rem', justifyContent: 'center', minHeight: '3rem' }}
                        >
                            <span style={{ color: '#FF3B30', fontWeight: 600 }}>Delete Item</span>
                        </button>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                    <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" style={{ display: 'none' }} />
                </div>

                {showMemojiPicker && (
                    <MemojiPicker
                        onSelect={(newIcon, config) => {
                            setIcon(newIcon);
                            setCharacterConfig(config);
                            if (config.name) setWord(config.name);
                            setIsImage(true);
                            setShowMemojiPicker(false);
                        }}
                        onClose={() => setShowMemojiPicker(false)}
                    />
                )}
                {showCropper && (
                    <ImageCropModal
                        isOpen={showCropper}
                        imageSrc={cropSource}
                        onCancel={() => { setShowCropper(false); setCropSource(null); }}
                        onSave={(dataUrl) => {
                            setIcon(dataUrl);
                            setIsImage(true);
                            setShowCropper(false);
                            setCropSource(null);
                        }}
                        title="Crop Icon"
                    />
                )}
            </div>
        </div>
    );
};

export default EditModal;
