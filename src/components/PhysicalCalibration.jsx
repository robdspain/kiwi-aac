import { useState, useEffect } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    IonRange
} from '@ionic/react';
import { closeOutline, checkmarkCircleOutline, contractOutline, expandOutline } from 'ionicons/icons';
import { getDeviceDPI, setDeviceDPI, calculateDPI } from '../utils/physicalScaling';

const PhysicalCalibration = ({ isOpen, onClose }) => {
    // Standard credit card width is 85.6mm
    const REFERENCE_MM = 85.6;
    const [cardPx, setCardPx] = useState(300); // Initial guess

    useEffect(() => {
        if (isOpen) {
            // Calculate initial cardPx based on current DPI
            const dpi = getDeviceDPI();
            const initialPx = (REFERENCE_MM / 25.4) * dpi;
            setCardPx(initialPx);
        }
    }, [isOpen]);

    const handleSave = () => {
        const newDpi = calculateDPI(REFERENCE_MM, cardPx);
        setDeviceDPI(newDpi);
        onClose();
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.95]} initialBreakpoint={0.95}>
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent' }}>
                    <IonTitle style={{ fontWeight: '900' }}>Physical Calibration</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} color="dark" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{
                '--background': 'transparent',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242,242,247,0.7))',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📏</div>
                    <h2 style={{ fontWeight: '900', margin: '0' }}>Measure for Accuracy</h2>
                    <p style={{ color: '#666', fontSize: '0.95rem', margin: '0.5rem 0' }}>
                        Hold a standard credit card (or ID) against the screen. Adjust the slider until the box below matches the card exactly.
                    </p>
                </div>

                {/* Calibration Box */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                    <div style={{
                        width: `${cardPx}px`,
                        height: `${cardPx * 0.63}px`, // Standard card aspect ratio
                        background: 'linear-gradient(45deg, #2C3E50, #000000)',
                        borderRadius: '12px',
                        border: '2px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                        position: 'relative',
                        transition: 'width 0.1s ease-out, height 0.1s ease-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Reference Card (85.6mm)
                    </div>
                </div>

                <div style={{ padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <IonIcon icon={contractOutline} color="medium" />
                        <IonRange
                            min={200}
                            max={600}
                            value={cardPx}
                            onIonChange={e => setCardPx(e.detail.value)}
                            style={{ flex: 1, '--bar-height': '6px', '--knob-size': '24px' }}
                        />
                        <IonIcon icon={expandOutline} color="medium" />
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', fontWeight: 600 }}>
                        ADJUST SLIDER TO MATCH PHYSICAL CARD
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <IonButton expand="block" onClick={handleSave} style={{
                        '--background': '#007AFF',
                        '--border-radius': '20px',
                        height: '60px',
                        fontWeight: '900',
                        fontSize: '1.1rem'
                    }}>
                        <IonIcon icon={checkmarkCircleOutline} slot="start" />
                        Save Calibration
                    </IonButton>
                    <IonButton expand="block" fill="clear" onClick={onClose} style={{ color: '#FF3B30', fontWeight: '700' }}>
                        Cancel
                    </IonButton>
                </div>

                <div style={{ height: '3rem' }} />
            </IonContent>
        </IonModal>
    );
};

export default PhysicalCalibration;
