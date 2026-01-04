import { useState, useEffect } from 'react';
import { getMedia } from '../utils/db';
import { triggerHaptic } from '../utils/haptics';
import { useProfile } from '../context/ProfileContext';
import { MIRROR_DICTIONARY } from '../utils/translate';

const VisualSceneView = ({ scene, onBack, speak }) => {
    const [image, setImage] = useState(null);
    const { currentProfile } = useProfile();
    const lang = currentProfile?.accessProfile?.language || 'en';

    useEffect(() => {
        const loadImage = async () => {
            if (scene.icon && scene.icon.startsWith('db:')) {
                const mediaId = scene.icon.split(':')[1];
                const data = await getMedia(mediaId);
                setImage(data);
            }
        };
        loadImage();
    }, [scene]);

    const handleHotspotClick = (hotspot) => {
        triggerHaptic('medium');
        const localizedWord = hotspot.labels?.[lang] || 
                              MIRROR_DICTIONARY[hotspot.word.toLowerCase()]?.[lang] || 
                              hotspot.word;
        speak(localizedWord);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: '#000',
            zIndex: 5000, display: 'flex', flexDirection: 'column',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
                position: 'absolute', top: '1rem', left: '1rem', zIndex: 10
            }}>
                <button 
                    onClick={onBack}
                    style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none', 
                        color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem',
                        backdropFilter: 'blur(10px)', fontWeight: 'bold'
                    }}
                >
                    ← Back to Grid
                </button>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {image && (
                    <>
                        <img 
                            src={image} 
                            alt={scene.word} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                {scene.hotspots?.map(h => {
                                    const [x, y, width, height] = h.bbox;
                                    const localizedLabel = h.labels?.[lang] || 
                                                           MIRROR_DICTIONARY[h.word.toLowerCase()]?.[lang] || 
                                                           h.word;
                                    return (
                                        <div 
                                            key={h.id}
                                            onClick={() => handleHotspotClick(h)}
                                            style={{
                                                position: 'absolute',
                                                left: `${(x / 640) * 100}%`,
                                                top: `${(y / 480) * 100}%`,
                                                width: `${(width / 640) * 100}%`,
                                                height: `${(height / 480) * 100}%`,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                // Optional: slight highlight or invisible
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                background: 'rgba(255,255,255,0.05)'
                                            }}
                                            title={localizedLabel}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div style={{
                position: 'absolute', bottom: '2rem', width: '100%',
                textAlign: 'center', color: 'white', pointerEvents: 'none'
            }}>
                <div style={{
                    background: 'rgba(0,0,0,0.5)', display: 'inline-block',
                    padding: '0.5rem 1.5rem', borderRadius: '2rem',
                    fontSize: '1.2rem', fontWeight: 'bold'
                }}>
                    {scene.labels?.[lang] || MIRROR_DICTIONARY[scene.word.toLowerCase()]?.[lang] || scene.word}
                </div>
            </div>
        </div>
    );
};

export default VisualSceneView;
