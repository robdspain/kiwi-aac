import { useState, useEffect, useRef, Suspense } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonListHeader
} from '@ionic/react';
import {
    closeOutline,
    checkmarkOutline,
    libraryOutline,
    personOutline,
    cameraOutline,
    trashOutline,
    chevronForwardOutline
} from 'ionicons/icons';
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

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} breakPoints={[0, 1]} initialBreakpoint={1}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose} color="primary">Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>{item?.type === 'folder' ? 'Edit Folder' : 'Edit Button'}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            color="primary"
                            style={{ fontWeight: 600 }}
                            disabled={processing}
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

                                if (typeof icon === 'string' && icon.startsWith('data:')) {
                                    if (typeof item.icon === 'string' && item.icon.startsWith('db:')) {
                                        const oldId = item.icon.split(':')[1];
                                        await deleteMedia(oldId);
                                    }
                                    const mediaId = `img-${Date.now()}`;
                                    await saveMedia(mediaId, icon);
                                    finalIcon = `db:${mediaId}`;
                                }

                                if (typeof customAudio === 'string' && customAudio.startsWith('data:')) {
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
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding-bottom" style={{ '--background': '#F2F2F7' }}>
                <IonListHeader style={{ marginTop: '1rem' }}>Content</IonListHeader>
                <IonList inset={true}>
                    <IonItem>
                        <IonLabel position="fixed" style={{ fontWeight: 600 }}>Label</IonLabel>
                        <IonInput
                            value={word}
                            onIonChange={(e) => setWord(e.detail.value)}
                            placeholder="Enter label"
                            className="ion-text-right"
                        />
                    </IonItem>
                    {item?.type === 'folder' && (
                        <IonItem lines="none" style={{ '--padding-top': '0.5rem', '--padding-bottom': '0.5rem' }}>
                            <div style={{ width: '100%' }}>
                                <IonLabel style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', color: '#6e6e73', marginBottom: '0.5rem' }}>View Mode</IonLabel>
                                <IonSegment value={viewMode} onIonChange={(e) => setViewMode(e.detail.value)}>
                                    <IonSegmentButton value="grid">
                                        <IonLabel>Grid</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value="schedule">
                                        <IonLabel>Schedule</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </div>
                        </IonItem>
                    )}
                </IonList>

                <IonListHeader>Appearance</IonListHeader>
                <IonList inset={true}>
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'white' }}>
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
                                        setBgColor('');
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
                    <IonItem onClick={() => onOpenEmojiPicker(setWord, (ni, isImg) => { setIcon(ni); setIsImage(!!isImg); })} button={true}>
                        <IonIcon icon={libraryOutline} slot="start" color="primary" />
                        <IonLabel>Choose from Library</IonLabel>
                        <IonIcon icon={chevronForwardOutline} slot="end" color="medium" size="small" />
                    </IonItem>
                    <IonItem onClick={() => setShowMemojiPicker(true)} button={true}>
                        <IonIcon icon={personOutline} slot="start" color="primary" />
                        <IonLabel>Select Character</IonLabel>
                        <IonIcon icon={chevronForwardOutline} slot="end" color="medium" size="small" />
                    </IonItem>
                    <IonItem onClick={() => takePhoto(CameraSource.Prompt)} button={true}>
                        <IonIcon icon={cameraOutline} slot="start" color="primary" />
                        <IonLabel>Add Photo or Image</IonLabel>
                        <IonIcon icon={chevronForwardOutline} slot="end" color="medium" size="small" />
                    </IonItem>
                </IonList>

                <IonListHeader>Media</IonListHeader>
                <IonList inset={true}>
                    <div style={{ padding: '0.5rem 1rem', background: 'white' }}>
                        {item?.type !== 'folder' && <VoiceRecorder currentAudio={customAudio} onSave={(audio) => setCustomAudio(audio)} onRemove={() => setCustomAudio(null)} />}
                    </div>
                </IonList>

                <div style={{ marginTop: '2rem', padding: '0 1rem' }}>
                    <IonButton
                        expand="block"
                        color="danger"
                        fill="clear"
                        style={{ background: 'white', borderRadius: '0.75rem', fontWeight: 600 }}
                        onClick={() => { if (window.confirm("Delete this item?")) { onDelete(); onClose(); } }}
                    >
                        Delete Item
                    </IonButton>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" style={{ display: 'none' }} />

                {showMemojiPicker && (
                    <Suspense fallback={null}>
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
                    </Suspense>
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
            </IonContent>
        </IonModal>
    );
};

export default EditModal;
