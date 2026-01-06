import { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonText } from '@ionic/react';
import { playCircleOutline, closeOutline } from 'ionicons/icons';

export default function VideoTutorialsModal({ isOpen, onClose }) {
    const [activeVideo, setActiveVideo] = useState(null);

    const tutorials = [
        { id: 1, title: 'Getting Started with Your Grid', duration: '2:15', thumbnail: '🎬' },
        { id: 2, title: 'How to Edit Buttons', duration: '1:45', thumbnail: '✏️' },
        { id: 3, title: 'Using Guided Access', duration: '1:10', thumbnail: '🔒' },
        { id: 4, title: 'Adding Your Own Photos', duration: '1:30', thumbnail: '📸' },
        { id: 5, title: 'Customizing the Voice', duration: '2:00', thumbnail: '🗣️' },
        { id: 6, title: 'Backing Up Data', duration: '1:00', thumbnail: '☁️' },
    ];

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ fontSize: '1.2rem', fontWeight: 800 }}>Video Tutorials</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} style={{ fontWeight: 600 }}>Done</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'var(--bg-color)' }}>
                {activeVideo ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            aspectRatio: '16/9',
                            background: 'black',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: 'white',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ fontSize: '4rem' }}>▶️</div>
                            <div style={{ opacity: 0.7 }}>Placeholder Video Player</div>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{activeVideo.title}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>This would be a video tutorial explaining the feature in depth.</p>
                        <IonButton expand="block" fill="outline" onClick={() => setActiveVideo(null)} style={{ marginTop: 'auto' }}>
                            Back to List
                        </IonButton>
                    </div>
                ) : (
                    <IonGrid>
                        <IonRow>
                            {tutorials.map(video => (
                                <IonCol size="12" sizeMd="6" key={video.id}>
                                    <div
                                        onClick={() => setActiveVideo(video)}
                                        style={{
                                            background: 'var(--card-bg)',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            cursor: 'pointer',
                                            border: '1px solid var(--gray-border)'
                                        }}
                                    >
                                        <div style={{
                                            aspectRatio: '16/9',
                                            background: '#E5E7EB',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '3rem',
                                            position: 'relative'
                                        }}>
                                            {video.thumbnail}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '0.5rem',
                                                right: '0.5rem',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {video.duration}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{video.title}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <IonIcon icon={playCircleOutline} /> Watch Now
                                            </div>
                                        </div>
                                    </div>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                )}
            </IonContent>
        </IonModal>
    );
}
