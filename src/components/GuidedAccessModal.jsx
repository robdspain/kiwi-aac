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
    IonText,
    IonImg
} from '@ionic/react';
import { closeOutline, lockClosedOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';

const GuidedAccessModal = ({ onClose }) => {
    return (
        <IonModal
            isOpen={true}
            onDidDismiss={onClose}
            breakpoints={[0, 0.6, 0.9]}
            initialBreakpoint={0.6}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Guided Access</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} fontWeight="bold">Done</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'var(--ion-color-light)' }}>
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🔒</div>
                    <IonText color="dark">
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0' }}>Lock Screen (iOS)</h2>
                    </IonText>
                    <p style={{ color: 'var(--ion-color-medium)', fontSize: '1.05rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                        Keep your child focused by locking the app on screen using <strong>Guided Access</strong>.
                    </p>
                </div>

                <div style={{ margin: '1.5rem auto', textAlign: 'center' }}>
                    <img
                        src="/images/guided-access.png"
                        alt="Guided Access Instructions"
                        style={{
                            width: '100%',
                            maxWidth: '280px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            border: '1px solid var(--ion-color-light-shade)'
                        }}
                    />
                </div>

                <IonList inset={true} style={{ margin: '0 0 1.5rem 0' }}>
                    <IonItem>
                        <IonText slot="start" color="primary" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '16px' }}>1</IonText>
                        <IonLabel className="ion-text-wrap">
                            Open this app to the screen you want.
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonText slot="start" color="primary" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '16px' }}>2</IonText>
                        <IonLabel className="ion-text-wrap">
                            <strong>Triple-click</strong> the side button.
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                        <IonText slot="start" color="primary" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '16px' }}>3</IonText>
                        <IonLabel className="ion-text-wrap">
                            Tap <strong>Start</strong> in the corner.
                        </IonLabel>
                    </IonItem>
                </IonList>

                <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(var(--ion-color-warning-rgb), 0.1)',
                    border: '1px solid rgba(var(--ion-color-warning-rgb), 0.2)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'start'
                }}>
                    <IonIcon icon={alertCircleOutline} color="warning" style={{ fontSize: '1.4rem' }} />
                    <IonText color="dark" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        <strong>Note:</strong> If nothing happens, go to <em>Settings &gt; Accessibility &gt; Guided Access</em> to turn it on first.
                    </IonText>
                </div>

                <div style={{ height: '3rem' }} />
            </IonContent>
        </IonModal>
    );
};

export default GuidedAccessModal;
