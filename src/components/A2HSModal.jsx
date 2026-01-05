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
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonText
} from '@ionic/react';
import { closeOutline, shareOutline, addCircleOutline, phonePortraitOutline } from 'ionicons/icons';

const A2HSModal = () => {
    // Detect if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Detect if app is running in standalone mode (installed)
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    const [show, setShow] = useState(() => {
        if (isIOS && !isStandalone) {
            const lastShown = localStorage.getItem('kiwi-a2hs-prompt-last');
            if (!lastShown) return true;
            return Date.now() - parseInt(lastShown) > 24 * 60 * 60 * 1000;
        }
        return false;
    });

    const handleClose = () => {
        setShow(false);
        localStorage.setItem('kiwi-a2hs-prompt-last', Date.now().toString());
    };

    return (
        <IonModal
            isOpen={show}
            onDidDismiss={handleClose}
            breakpoints={[0, 0.5, 0.8]}
            initialBreakpoint={0.5}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Install Kiwi Voice</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleClose}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>📱</div>
                    <IonText color="dark">
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Add to Home Screen</h2>
                    </IonText>
                    <p style={{ color: 'var(--ion-color-medium)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
                        Install this app for a full-screen experience and quick access anytime.
                    </p>
                </div>

                <div style={{
                    background: 'var(--ion-color-light)',
                    borderRadius: '16px',
                    padding: '8px',
                    marginTop: '1.5rem'
                }}>
                    <IonList lines="full" style={{ background: 'transparent' }}>
                        <IonItem style={{ '--background': 'transparent' }}>
                            <div slot="start" style={{
                                width: '28px', height: '28px', borderRadius: '14px',
                                background: 'var(--ion-color-primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '0.8rem'
                            }}>1</div>
                            <IonLabel className="ion-text-wrap">
                                Tap the <strong>Share</strong> button below
                                <IonIcon icon={shareOutline} style={{ verticalAlign: 'middle', marginLeft: '8px', fontSize: '1.2rem' }} color="primary" />
                            </IonLabel>
                        </IonItem>
                        <IonItem style={{ '--background': 'transparent' }} lines="none">
                            <div slot="start" style={{
                                width: '28px', height: '28px', borderRadius: '14px',
                                background: 'var(--ion-color-primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '0.8rem'
                            }}>2</div>
                            <IonLabel className="ion-text-wrap">
                                Select <strong>Add to Home Screen</strong>
                                <IonIcon icon={addCircleOutline} style={{ verticalAlign: 'middle', marginLeft: '8px', fontSize: '1.2rem' }} color="primary" />
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <IonButton expand="block" size="large" onClick={handleClose} style={{ '--border-radius': '14px', fontWeight: 'bold' }}>
                        Got it
                    </IonButton>
                </div>

                <div style={{ height: '3rem' }} />
            </IonContent>
        </IonModal>
    );
};

export default A2HSModal;
