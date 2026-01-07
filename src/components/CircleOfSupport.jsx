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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonText,
    IonProgressBar,
    IonBadge
} from '@ionic/react';
import {
    peopleOutline,
    heartOutline,
    schoolOutline,
    medicalOutline,
    closeOutline,
    trendingUpOutline,
    checkmarkCircleOutline,
    informationCircleOutline
} from 'ionicons/icons';
import { getLevel, getStage, formatLevel } from '../data/levelDefinitions';
import { ROLE_SUPPORT_TIPS, getLifeSkillsMapping } from '../data/clinicalFrameworks';
import { getRecentSentences } from '../utils/AnalyticsService';

const CircleOfSupport = ({ isOpen, onClose, currentLevel, analyticsData, peopleItems }) => {
    const [activeRole, setActiveRole] = useState('parent');
    const [recentSuccesses, setRecentSuccesses] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setRecentSuccesses(getRecentSentences(5));
        }
    }, [isOpen]);

    const levelInfo = formatLevel(currentLevel);
    const stageInfo = getStage(currentLevel);
    const clinicalMapping = getLifeSkillsMapping(currentLevel);
    const roleTips = ROLE_SUPPORT_TIPS[activeRole];

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.95]} initialBreakpoint={0.95}>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle style={{ fontWeight: '800' }}>Circle of Support</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{
                '--background': 'transparent',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242,242,247,0.7))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}>

                <div style={{ height: '40px' }} />
            </IonContent>
        </IonModal>
    );
};

export default CircleOfSupport;
