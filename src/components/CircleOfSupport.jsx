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
import { ROLE_SUPPORT_TIPS, getClinicalMapping } from '../data/clinicalFrameworks';
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
    const clinicalMapping = getClinicalMapping(currentLevel);
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
                {/* 1. Progress Overview */}
                <IonCard style={{ margin: '0 0 20px 0', border: '1px solid rgba(var(--ion-color-primary-rgb), 0.1)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                    <IonCardHeader>
                        <IonCardSubtitle color="primary" style={{ fontWeight: '700', letterSpacing: '1px' }}>CURRENT STATUS</IonCardSubtitle>
                        <IonCardTitle style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '4px' }}>
                            {stageInfo.icon} Level {currentLevel}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1rem', fontWeight: '600' }}>
                            <span>Stage: {levelInfo.stageName}</span>
                            <span>{levelInfo.progress}</span>
                        </div>
                        <IonProgressBar
                            value={currentLevel / 7.3}
                            style={{ height: '12px', borderRadius: '6px', '--buffer-background': 'rgba(var(--ion-color-primary-rgb), 0.1)' }}
                        />
                        <p style={{ marginTop: '12px', color: 'var(--ion-color-medium)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            {levelInfo.levelName}: {getLevel(currentLevel).description}
                        </p>
                    </IonCardContent>
                </IonCard>

                {/* 2. Clinical Alignment (SBA/PLS) */}
                {clinicalMapping && (
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '16px',
                        borderRadius: '16px',
                        marginBottom: '24px',
                        border: '1px solid var(--gray-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <IonIcon icon={informationCircleOutline} style={{ color: 'var(--primary)' }} />
                            <IonText style={{ fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary)' }}>
                                Dr. Hanley's SBT Context
                            </IonText>
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontWeight: '700', color: 'var(--text-primary)' }}>{clinicalMapping.skill}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{clinicalMapping.objective}</p>
                    </div>
                )}

                {/* 3. The Team (Circle of Support) */}
                <h3 style={{ fontWeight: '800', marginBottom: '16px', paddingLeft: '4px' }}>Your Team</h3>
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    padding: '4px',
                    marginBottom: '24px',
                    scrollbarWidth: 'none'
                }}>
                    {['parent', 'teacher', 'therapist', 'other'].map(roleId => {
                        const members = (peopleItems || []).filter(p => (p.role === roleId) || (!p.role && roleId === 'other'));
                        if (members.length === 0 && roleId !== activeRole) return null;

                        return members.map(person => (
                            <div
                                key={person.id}
                                onClick={() => setActiveRole(person.role || 'other')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    minWidth: '80px',
                                    opacity: activeRole === (person.role || 'other') ? 1 : 0.5,
                                    transform: activeRole === (person.role || 'other') ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    border: `3px solid var(--ion-color-${roleId === 'parent' ? 'danger' : roleId === 'teacher' ? 'primary' : 'tertiary'})`,
                                    padding: '2px',
                                    background: 'white'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--gray-light)'
                                    }}>
                                        {person.icon && person.icon.length < 5 ? (
                                            <span style={{ fontSize: '1.5rem' }}>{person.icon}</span>
                                        ) : (
                                            <img src={person.icon || person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{person.word}</span>
                            </div>
                        ));
                    })}
                    {(!peopleItems || peopleItems.length === 0) && (
                        <p style={{ color: 'var(--ion-color-medium)', fontSize: '0.85rem', padding: '10px' }}>
                            Add team members in the "Avatar" tab to see them here.
                        </p>
                    )}
                </div>

                {/* 4. Role Selector */}
                <IonSegment
                    value={activeRole}
                    onIonChange={e => setActiveRole(e.detail.value)}
                    style={{ marginBottom: '20px', '--background': 'var(--ion-color-light)' }}
                >
                    <IonSegmentButton value="parent">
                        <IonIcon icon={heartOutline} />
                        <IonLabel>Parent</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="teacher">
                        <IonIcon icon={schoolOutline} />
                        <IonLabel>Teacher</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="therapist">
                        <IonIcon icon={medicalOutline} />
                        <IonLabel>Pro</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                {/* 5. Support Tips */}
                <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            background: `var(--ion-color-${activeRole === 'parent' ? 'danger' : activeRole === 'teacher' ? 'primary' : 'tertiary'})`,
                            padding: '10px',
                            borderRadius: '12px',
                            display: 'flex'
                        }}>
                            <IonIcon
                                icon={activeRole === 'parent' ? heartOutline : activeRole === 'teacher' ? schoolOutline : medicalOutline}
                                style={{ color: 'white', fontSize: '1.2rem' }}
                            />
                        </div>
                        <h2 style={{ margin: 0, fontWeight: '800' }}>{roleTips.title}</h2>
                    </div>

                    <IonList lines="none" style={{ background: 'transparent' }}>
                        {roleTips.tips.map((tip, i) => (
                            <IonItem key={i} style={{ '--background': 'transparent', marginBottom: '12px' }}>
                                <div slot="start" style={{
                                    background: 'var(--ion-color-success)',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    display: 'flex'
                                }}>
                                    <IonIcon icon={checkmarkCircleOutline} style={{ color: 'white', fontSize: '1.1rem' }} />
                                </div>
                                <IonLabel className="ion-text-wrap" style={{ fontSize: '1rem', fontWeight: '500' }}>
                                    {tip}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </div>

                {/* 5. Success Moments (Real-time Feed) */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '24px',
                    marginTop: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1.2rem' }}>Success Moments</h3>
                        <IonBadge color="success" style={{ borderRadius: '12px', padding: '6px 12px' }}>LIVE</IonBadge>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(analyticsData?.sentences || []).slice(0, 3).map((s, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'center',
                                animation: 'slideInRight 0.5s ease-out'
                            }}>
                                <div style={{ fontSize: '1.5rem', background: '#f0fdf4', padding: '10px', borderRadius: '12px' }}>✨</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: '#1A535C' }}>{s.text}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                        {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!analyticsData?.sentences || analyticsData.sentences.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</div>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Waiting for the first success of the day!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ height: '40px' }} />
            </IonContent>
        </IonModal>
    );
};

export default CircleOfSupport;
