import { useState, useRef, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { saveMedia } from '../utils/db';
import { triggerHaptic } from '../utils/haptics';

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText,
    IonFooter,
    IonList,
    IonItem,
    IonLabel,
    IonChip,
    IonInput
} from '@ionic/react';
import {
    closeOutline,
    saveOutline,
    cameraOutline,
    imageOutline,
    sparklesOutline,
    alertCircleOutline
} from 'ionicons/icons';

const VisualSceneCreator = ({ onSave, onClose }) => {
    const [image, setImage] = useState(null);
    const [isProcessing, setIsScanning] = useState(false);
    const [hotspots, setHotspots] = useState([]);
    const [model, setModel] = useState(null);

    const imageRef = useRef(null);

    // Load model once on mount
    useEffect(() => {
        const loadModel = async () => {
            try {
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
                console.log('✅ AI Vision model loaded');
            } catch (error) {
                console.error('❌ Failed to load AI model:', error);
            }
        };
        loadModel();
    }, []);

    const handleGetPhoto = async (source) => {
        try {
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source
            });

            if (photo?.dataUrl) {
                setImage(photo.dataUrl);
                setHotspots([]); // Reset
                runDetection(photo.dataUrl);
            }
        } catch (error) {
            console.error('Camera error:', error);
        }
    };

    const runDetection = async (dataUrl) => {
        if (!model) return;
        setIsScanning(true);

        try {
            // Create a temporary image element to run detection on
            const img = new Image();
            img.src = dataUrl;
            await img.decode();

            const predictions = await model.detect(img);

            // Map predictions to our hotspot format
            const autoHotspots = predictions.map((p, i) => ({
                id: `auto-${i}-${Date.now()}`,
                label: p.class,
                word: p.class,
                bbox: p.bbox, // [x, y, width, height]
                active: true
            }));

            setHotspots(autoHotspots);
            triggerHaptic('success');
        } catch (error) {
            console.error('Detection error:', error);
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = async () => {
        if (!image) return;

        try {
            const sceneId = `scene-${Date.now()}`;
            // Store the large background image in IndexedDB
            await saveMedia(sceneId, image);

            const newScene = {
                id: sceneId,
                type: 'visual_scene',
                word: 'Visual Scene', // User can rename
                icon: `db:${sceneId}`,
                hotspots: hotspots.filter(h => h.active)
            };

            onSave(newScene);
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save scene.');
        }
    };

    const toggleHotspot = (id) => {
        setHotspots(prev => prev.map(h =>
            h.id === id ? { ...h, active: !h.active } : h
        ));
    };

    const updateLabel = (id, newLabel) => {
        setHotspots(prev => prev.map(h =>
            h.id === id ? { ...h, label: newLabel, word: newLabel } : h
        ));
    };

    return (
        <IonModal isOpen={true} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>AI Visual Scene</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={handleSave}
                            disabled={!image || isProcessing}
                            color="primary"
                            style={{ fontWeight: 'bold' }}
                        >
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" scrollY={false}>
                <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#000',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {!image ? (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <IonIcon icon={sparklesOutline} style={{ fontSize: '4rem', marginBottom: '1.5rem', color: 'var(--ion-color-primary)' }} />
                            <h2>Create a JIT Scene</h2>
                            <IonText color="light">
                                <p style={{ margin: '1rem 0 2rem 0', opacity: 0.8 }}>
                                    Take a photo of your environment and our AI will automatically identify objects for communication.
                                </p>
                            </IonText>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '300px' }}>
                                <IonButton expand="block" onClick={() => handleGetPhoto(CameraSource.Camera)}>
                                    <IonIcon icon={cameraOutline} slot="start" />
                                    Camera
                                </IonButton>
                                <IonButton expand="block" fill="outline" color="light" onClick={() => handleGetPhoto(CameraSource.Photos)}>
                                    <IonIcon icon={imageOutline} slot="start" />
                                    Library
                                </IonButton>
                            </div>
                        </div>
                    ) : (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                ref={imageRef}
                                src={image}
                                alt="Scene"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />

                            {/* Detection Overlay */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    {hotspots.map(h => {
                                        const [x, y, width, height] = h.bbox;
                                        return (
                                            <div
                                                key={h.id}
                                                onClick={() => toggleHotspot(h.id)}
                                                style={{
                                                    position: 'absolute',
                                                    left: `${(x / 640) * 100}%`,
                                                    top: `${(y / 480) * 100}%`,
                                                    width: `${(width / 640) * 100}%`,
                                                    height: `${(height / 480) * 100}%`,
                                                    border: h.active ? '3px solid var(--ion-color-primary)' : '2px dashed rgba(255,255,255,0.4)',
                                                    background: h.active ? 'rgba(78, 205, 196, 0.15)' : 'transparent',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    zIndex: h.active ? 10 : 5,
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {h.active && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '100%',
                                                        left: '0',
                                                        marginBottom: '4px',
                                                        background: 'var(--ion-color-primary)',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        fontSize: '10px',
                                                        borderRadius: '6px',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                    }}>
                                                        {h.label.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {isProcessing && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            gap: '1.5rem',
                            zIndex: 100,
                            backdropFilter: 'blur(4px)'
                        }}>
                            <IonSpinner name="crescent" color="primary" style={{ width: '48px', height: '48px' }} />
                            <IonText>
                                <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>AI identifying objects...</p>
                            </IonText>
                        </div>
                    )}
                </div>
            </IonContent>

            {image && !isProcessing && (
                <IonFooter className="ion-padding">
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        {hotspots.filter(h => h.active).map(h => (
                            <IonChip key={h.id} color="primary" outline>
                                <IonLabel>
                                    <input
                                        value={h.label}
                                        onChange={(e) => updateLabel(h.id, e.target.value)}
                                        style={{ border: 'none', background: 'transparent', fontWeight: 'bold', outline: 'none', color: 'inherit', width: 'auto', minWidth: '40px' }}
                                    />
                                </IonLabel>
                                <IonIcon icon={closeOutline} onClick={() => toggleHotspot(h.id)} />
                            </IonChip>
                        ))}
                    </div>
                    <IonText color="medium">
                        <p style={{ fontSize: '0.75rem', margin: '8px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IonIcon icon={alertCircleOutline} />
                            Tap detected boxes to enable/disable. Click labels to rename.
                        </p>
                    </IonText>
                </IonFooter>
            )}
        </IonModal>
    );
};

export default VisualSceneCreator;
