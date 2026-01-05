import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
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
    IonText,
    IonIcon,
    IonNote
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';

import { revenueCatService, FREE_TIER_LIMITS } from '../services/RevenueCatService';

const PronunciationEditor = ({ onClose }) => {
    const { pronunciations, addPronunciation, deletePronunciation } = useProfile();
    const [word, setWord] = useState('');
    const [phonetic, setPhonetic] = useState('');

    const handleAdd = async (e) => {
        if (e) e.preventDefault();
        if (word && phonetic) {
            const currentCount = Object.keys(pronunciations).length;

            if (currentCount >= FREE_TIER_LIMITS.MAX_PRONUNCIATION_ENTRIES) {
                try {
                    const hasAccess = await revenueCatService.hasPremiumAccess();
                    if (!hasAccess) {
                        const paywallResult = await revenueCatService.showPaywallIfNeeded('premiumVoice');
                        const accessAfter = await revenueCatService.hasPremiumAccess();
                        if (!accessAfter) return;
                    }
                } catch (error) {
                    console.error('Failed to check pronunciation limit:', error);
                }
            }

            addPronunciation(word, phonetic);
            setWord('');
            setPhonetic('');
        }
    };

    const entriesCount = Object.keys(pronunciations).length;
    const isOverLimit = entriesCount >= FREE_TIER_LIMITS.MAX_PRONUNCIATION_ENTRIES;

    return (
        <IonModal isOpen={true} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Pronunciation</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} style={{ fontWeight: 'bold' }}>Done</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ marginBottom: '1.5rem' }}>
                    <IonText color="medium">
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Type a word and how you want it to sound (phonetically).
                            <br />Example: <b>Kiwi</b> → <b>Kee-wee</b>
                        </p>
                    </IonText>

                    <IonNote color={isOverLimit ? 'danger' : 'primary'} style={{ fontWeight: '600' }}>
                        {entriesCount}/{FREE_TIER_LIMITS.MAX_PRONUNCIATION_ENTRIES} free entries used
                    </IonNote>
                </div>

                <div className="ios-setting-card" style={{ padding: '0.5rem' }}>
                    <IonItem lines="none" style={{ borderRadius: '12px' }}>
                        <IonLabel position="stacked">Original Word</IonLabel>
                        <IonInput
                            value={word}
                            onIonChange={e => setWord(e.detail.value)}
                            placeholder="e.g. Kiwi"
                        />
                    </IonItem>
                    <IonItem lines="none" style={{ borderRadius: '12px', marginTop: '8px' }}>
                        <IonLabel position="stacked">Phonetic Spelling</IonLabel>
                        <IonInput
                            value={phonetic}
                            onIonChange={e => setPhonetic(e.detail.value)}
                            placeholder="e.g. Kee-wee"
                        />
                    </IonItem>
                    <div style={{ padding: '10px' }}>
                        <IonButton
                            expand="block"
                            onClick={() => handleAdd()}
                            disabled={!word || !phonetic}
                        >
                            <IonIcon icon={addOutline} slot="start" />
                            Add Override
                        </IonButton>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <IonLabel style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--ion-color-medium)',
                        textTransform: 'uppercase',
                        paddingLeft: '1rem',
                        display: 'block',
                        marginBottom: '0.5rem'
                    }}>
                        Existing Overrides
                    </IonLabel>

                    <IonList className="ios-setting-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        {Object.keys(pronunciations).length === 0 ? (
                            <IonItem>
                                <IonLabel color="medium" className="ion-text-center">No custom pronunciations yet.</IonLabel>
                            </IonItem>
                        ) : (
                            Object.entries(pronunciations).map(([w, p]) => (
                                <IonItem key={w}>
                                    <IonLabel>
                                        <h2 style={{ fontWeight: '600' }}>{w}</h2>
                                        <p style={{ color: 'var(--ion-color-primary)' }}>sounds like: {p}</p>
                                    </IonLabel>
                                    <IonButton
                                        slot="end"
                                        fill="clear"
                                        color="danger"
                                        onClick={() => deletePronunciation(w)}
                                    >
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </IonItem>
                            ))
                        )}
                    </IonList>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default PronunciationEditor;
