import { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonGrid, IonRow, IonCol, IonCard, IonIcon, IonText } from '@ionic/react';
import { closeOutline, cloudDownloadOutline, alertCircleOutline } from 'ionicons/icons';
import { AAC_LEXICON } from '../data/aacLexicon';
import { TEMPLATES } from '../data/aacData';

export default function TemplateGallery({ isOpen, onClose, onApply }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSelect = (templateId) => {
        if (selectedTemplate === templateId) {
            setShowConfirm(true);
        } else {
            setSelectedTemplate(templateId);
            setShowConfirm(false);
        }
    };

    const handleConfirmApply = () => {
        if (selectedTemplate && onApply) {
            onApply(selectedTemplate);
            onClose();
        }
    };

    const getPreviewIcons = (templateName) => {
        const words = TEMPLATES[templateName];
        if (!words) return [];
        // Show first 8 icons as preview
        return words.slice(0, 8).map(word => {
            const lexiconEntry = AAC_LEXICON[word.toLowerCase()];
            return lexiconEntry ? lexiconEntry.emoji : '⚪';
        });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ fontSize: '1.2rem', fontWeight: 800 }}>Template Gallery</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} style={{ fontWeight: 600 }}>Done</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'var(--bg-color)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        Start with a Template
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '20rem', margin: '0 auto' }}>
                        Choose a pre-built board to quickly set up vocabulary for specific activities.
                    </p>
                </div>

                <IonGrid>
                    <IonRow>
                        {Object.keys(TEMPLATES).map(name => {
                            const isSelected = selectedTemplate === name;
                            const previewIcons = getPreviewIcons(name);

                            return (
                                <IonCol size="12" sizeMd="6" key={name}>
                                    <div
                                        onClick={() => handleSelect(name)}
                                        style={{
                                            background: 'var(--card-bg)',
                                            borderRadius: '1.5rem',
                                            padding: '1.25rem',
                                            border: `2px solid ${isSelected ? 'var(--primary-color)' : 'transparent'}`,
                                            boxShadow: isSelected
                                                ? '0 8px 24px rgba(26, 83, 92, 0.2)'
                                                : '0 4px 12px rgba(0,0,0,0.05)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{name}</h3>
                                            {isSelected && (
                                                <div style={{
                                                    background: 'var(--primary-color)',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '1.5rem',
                                                    height: '1.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    ✓
                                                </div>
                                            )}
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            flexWrap: 'wrap',
                                            marginBottom: '1rem'
                                        }}>
                                            {previewIcons.map((icon, i) => (
                                                <div key={i} style={{
                                                    fontSize: '1.8rem',
                                                    width: '3rem',
                                                    height: '3rem',
                                                    background: 'var(--bg-color)',
                                                    borderRadius: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {icon}
                                                </div>
                                            ))}
                                            {TEMPLATES[name].length > 8 && (
                                                <div style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    background: 'var(--bg-color)',
                                                    borderRadius: '0.75rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600
                                                }}>
                                                    +{TEMPLATES[name].length - 8}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <IonButton
                                                fill={isSelected ? "solid" : "outline"}
                                                color={isSelected ? "primary" : "medium"}
                                                size="small"
                                                shape="round"
                                            >
                                                {isSelected ? (showConfirm ? "Click again to confirm" : "Apply Template") : "Select"}
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#FEF2F2',
                    borderRadius: '1rem',
                    border: '1px solid #FCA5A5',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'start'
                }}>
                    <IonIcon icon={alertCircleOutline} style={{ color: '#EF4444', fontSize: '1.5rem', minWidth: '1.5rem' }} />
                    <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#B91C1C', fontSize: '1rem', fontWeight: 700 }}>Warning</h4>
                        <p style={{ margin: 0, color: '#B91C1C', fontSize: '0.9rem' }}>
                            Applying a template will <strong>replace</strong> your current board's content. This action cannot be undone.
                        </p>
                    </div>
                </div>

                <IonModal isOpen={showConfirm} onDidDismiss={() => setShowConfirm(false)} style={{ '--height': 'auto', '--border-radius': '1.5rem' }}>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{
                            width: '4rem', height: '4rem', background: '#FEE2E2', borderRadius: '50%', color: '#EF4444',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem auto'
                        }}>
                            ⚠️
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Replace Current Board?</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Are you sure you want to apply the <strong>{selectedTemplate}</strong> template? All current icons will be removed.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <IonButton expand="block" fill="outline" color="medium" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>
                                Cancel
                            </IonButton>
                            <IonButton expand="block" color="danger" style={{ flex: 1 }} onClick={handleConfirmApply}>
                                Yes, Replace
                            </IonButton>
                        </div>
                    </div>
                </IonModal>

            </IonContent>
        </IonModal>
    );
}
