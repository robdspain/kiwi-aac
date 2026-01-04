import { useState, useRef, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { saveMedia } from '../utils/db';
import { triggerHaptic } from '../utils/haptics';

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
        <div style={{
            position: 'fixed', inset: 0, background: 'var(--bg-color)',
            zIndex: 11000, display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                padding: '1rem', borderBottom: '1px solid var(--gray-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'white'
            }}>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>Cancel</button>
                <h3 style={{ margin: 0 }}>AI Visual Scene</h3>
                <button 
                    onClick={handleSave} 
                    disabled={!image || isProcessing}
                    style={{ background: 'transparent', border: 'none', color: image ? 'var(--primary)' : '#ccc', fontWeight: 'bold', fontSize: '1rem' }}
                >
                    Save
                </button>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
                {!image ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'white' }}>
                        <div style={{ fontSize: '4rem' }}>🤖</div>
                        <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                            <h2 style={{ marginBottom: '0.5rem' }}>Create a JIT Scene</h2>
                            <p style={{ opacity: 0.8 }}>Take a photo of your environment and our AI will automatically identify objects for communication.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => handleGetPhoto(CameraSource.Camera)} className="primary-button" style={{ padding: '1rem 2rem' }}>📸 Camera</button>
                            <button onClick={() => handleGetPhoto(CameraSource.Photos)} className="secondary-button" style={{ padding: '1rem 2rem', background: 'white', color: 'black' }}>🖼️ Library</button>
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
                                    // These coords need to be relative to the displayed image
                                    // For MVP, we assume the image fills the container or we use standard CSS scaling
                                    const [x, y, width, height] = h.bbox;
                                    
                                    // Simple scale factor if we had image natural size vs displayed size
                                    // For now, let's just render them as absolute overlays on the image
                                    return (
                                        <div 
                                            key={h.id}
                                            onClick={() => toggleHotspot(h.id)}
                                            style={{
                                                position: 'absolute',
                                                left: `${(x / 640) * 100}%`, // Assuming 640 is model input size
                                                top: `${(y / 480) * 100}%`,
                                                width: `${(width / 640) * 100}%`,
                                                height: `${(height / 480) * 100}%`,
                                                border: h.active ? '3px solid var(--primary)' : '2px dashed rgba(255,255,255,0.5)',
                                                background: h.active ? 'rgba(78, 205, 196, 0.2)' : 'transparent',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                zIndex: h.active ? 10 : 5
                                            }}
                                        >
                                            {h.active && (
                                                <div style={{
                                                    position: 'absolute', top: '-25px', left: 0,
                                                    background: 'var(--primary)', color: 'white',
                                                    padding: '2px 6px', fontSize: '0.7rem', borderRadius: '4px',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {h.label}
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
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: 'white', gap: '1rem', zIndex: 100
                    }}>
                        <div className="processing-spinner" />
                        <p>AI is identifying objects...</p>
                    </div>
                )}
            </div>

            {image && !isProcessing && (
                <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--gray-border)' }}>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', paddingBottom: '0.5rem' }}>
                        {hotspots.filter(h => h.active).map(h => (
                            <div 
                                key={h.id}
                                style={{ 
                                    background: 'var(--gray-light)', padding: '0.5rem 1rem', 
                                    borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <input 
                                    value={h.label} 
                                    onChange={(e) => updateLabel(h.id, e.target.value)}
                                    style={{ border: 'none', background: 'transparent', fontWeight: 'bold', width: '80px' }}
                                />
                                <button onClick={() => toggleHotspot(h.id)} style={{ border: 'none', background: 'transparent', opacity: 0.5 }}>✕</button>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#999', margin: '0.5rem 0 0 0' }}>
                        Tap detected boxes to enable/disable them. Click labels to rename.
                    </p>
                </div>
            )}

            <style>{`
                .processing-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default VisualSceneCreator;
