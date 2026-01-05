import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonModal,
    IonFooter
} from '@ionic/react';
import { chevronBackOutline, helpCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

// Grid size configurations - ordered from smallest to largest animals
const GRID_SIZES = [
    { id: '2x2', icon: '🐜', label: '10mm', animal: 'ant', gridSize: 'dense', targetSize: 10 },
    { id: '3x3', icon: '🐈', label: '12mm', animal: 'cat', gridSize: 'medium', targetSize: 12 },
    { id: '4x4', icon: '🐕', label: '15mm', animal: 'dog', gridSize: 'standard', targetSize: 15 },
    { id: '5x5', icon: '🦒', label: '18mm', animal: 'giraffe', gridSize: 'big', targetSize: 18 },
    { id: '6x6', icon: '🐘', label: '22mm', animal: 'elephant', gridSize: 'super-big', targetSize: 22 }
];

const TouchCalibration = ({ onComplete, onBack }) => {
    const { updateAccessProfile } = useProfile();
    const [selectedSize, setSelectedSize] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleSizeSelect = (sizeConfig) => {
        setSelectedSize(sizeConfig.id);

        // Use target size directly from config
        const targetSize = sizeConfig.targetSize || 15;

        // Update access profile with target size
        updateAccessProfile({ targetSize });

        // Also save grid size for legacy compatibility
        localStorage.setItem('kiwi-grid-size', sizeConfig.gridSize);

        // Complete after a brief delay for visual feedback
        setTimeout(() => {
            onComplete();
        }, 300);
    };

    const handleTestSize = () => {
        if (selectedSize) {
            setShowPreview(true);
        }
    };

    const selectedConfig = GRID_SIZES.find(s => s.id === selectedSize);

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    {onBack && (
                        <IonButtons slot="start">
                            <IonButton onClick={onBack}>
                                <IonIcon icon={chevronBackOutline} slot="start" />
                                Back
                            </IonButton>
                        </IonButtons>
                    )}
                    <IonTitle>Touch Calibration</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding ion-text-center">
                <div style={{ padding: '1rem 0 2rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☝️</div>
                    <IonText>
                        <h1 style={{ fontWeight: 800, fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>
                            Touch Calibration
                        </h1>
                        <p style={{ color: 'var(--ion-color-medium)', fontSize: '1.1rem', maxWidth: '24rem', margin: '0 auto' }}>
                            Choose the grid layout that feels most comfortable to tap
                        </p>
                    </IonText>
                </div>

                <div className="ios-setting-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', maxWidth: '32rem', margin: '0 auto' }}>
                    <IonText color="medium">
                        <p style={{
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            textAlign: 'left',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05rem',
                            marginBottom: '1rem'
                        }}>
                            Grid Layout
                        </p>
                    </IonText>

                    <IonGrid className="ion-no-padding">
                        <IonRow>
                            {GRID_SIZES.map(size => (
                                <IonCol key={size.id}>
                                    <div
                                        onClick={() => setSelectedSize(size.id)}
                                        style={{
                                            background: selectedSize === size.id ? 'var(--ion-color-primary)' : 'var(--ion-color-light)',
                                            borderRadius: '1.25rem',
                                            padding: '1rem 0.5rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            minHeight: '7rem',
                                            border: selectedSize === size.id ? '3px solid var(--ion-color-primary-shade)' : '1px solid transparent',
                                            boxShadow: selectedSize === size.id ? '0 8px 16px rgba(var(--ion-color-primary-rgb), 0.2)' : 'none'
                                        }}
                                    >
                                        <span style={{ fontSize: '2.5rem' }}>{size.icon}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            color: selectedSize === size.id ? 'white' : 'var(--ion-color-dark)'
                                        }}>
                                            {size.label}
                                        </span>
                                    </div>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>

                    <div style={{ marginTop: '1.5rem', textAlign: 'left', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <IonIcon icon={helpCircleOutline} color="medium" style={{ fontSize: '1.2rem', marginTop: '0.1rem' }} />
                        <IonText color="medium">
                            <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                                Smaller targets (🐜) show more words but require more precision. Larger targets (🐘) have bigger buttons but fewer words visible.
                            </p>
                        </IonText>
                    </div>
                </div>

                {selectedSize && (
                    <IonButton
                        expand="block"
                        onClick={handleTestSize}
                        style={{ maxWidth: '32rem', margin: '0 auto 1rem auto', height: '3.5rem' }}
                    >
                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                        Test {selectedConfig?.label} Size
                    </IonButton>
                )}
            </IonContent>

            <IonFooter className="ion-no-border">
                <IonToolbar className="ion-padding-horizontal">
                    <IonButton
                        fill="clear"
                        expand="block"
                        onClick={selectedSize ? () => handleSizeSelect(selectedConfig) : onComplete}
                        style={{ height: '3rem', fontWeight: '600' }}
                    >
                        {selectedSize ? 'Confirm & Continue →' : 'Skip for now'}
                    </IonButton>
                </IonToolbar>
            </IonFooter>

            {/* Preview Modal */}
            <IonModal isOpen={showPreview} onDidDismiss={() => setShowPreview(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{selectedConfig?.icon} {selectedConfig?.label} Preview</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowPreview(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding ion-text-center">
                    <IonText color="medium">
                        <p style={{ marginBottom: '2rem' }}>This is how buttons will look on your device</p>
                    </IonText>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${selectedConfig?.gridSize === 'super-big' ? 2 : selectedConfig?.gridSize === 'big' ? 3 : selectedConfig?.gridSize === 'standard' ? 4 : selectedConfig?.gridSize === 'medium' ? 5 : 6}, 1fr)`,
                        gap: '0.75rem',
                        marginBottom: '2rem',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }}>
                        {['Play', 'Snack', 'More', 'Help', 'Yes', 'No'].slice(0, selectedConfig?.gridSize === 'super-big' ? 4 : 6).map((word, i) => (
                            <div
                                key={i}
                                style={{
                                    background: 'var(--ion-color-white)',
                                    border: '2px solid var(--ion-color-light-shade)',
                                    borderRadius: '1.25rem',
                                    aspectRatio: '1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                            >
                                <span style={{ fontSize: '2rem' }}>
                                    {i === 0 ? '🏃' : i === 1 ? '🥨' : i === 2 ? '➕' : i === 3 ? '🆘' : i === 4 ? '✅' : '❌'}
                                </span>
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    color: 'var(--ion-color-dark)'
                                }}>
                                    {word}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: 'var(--ion-color-warning-tint)',
                        borderRadius: '1rem',
                        padding: '1rem',
                        marginBottom: '2rem',
                        maxWidth: '32rem',
                        margin: '0 auto 2rem auto',
                        textAlign: 'left'
                    }}>
                        <IonText color="warning-shade">
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                <strong>💡 Tip:</strong> Try tapping the sample buttons above to test if {selectedConfig?.label} feels comfortable for you!
                            </p>
                        </IonText>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', maxWidth: '32rem', margin: '0 auto' }}>
                        <IonButton
                            fill="outline"
                            expand="block"
                            onClick={() => setShowPreview(false)}
                            style={{ flex: 1 }}
                        >
                            Try Different Size
                        </IonButton>
                        <IonButton
                            expand="block"
                            onClick={() => {
                                setShowPreview(false);
                                handleSizeSelect(selectedConfig);
                            }}
                            style={{ flex: 1 }}
                        >
                            Looks Good!
                        </IonButton>
                    </div>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default TouchCalibration;
