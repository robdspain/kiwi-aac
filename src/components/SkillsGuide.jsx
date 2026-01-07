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
    IonCardContent,
    IonList,
    IonItem,
    IonText,
    IonListHeader,
    IonBadge
} from '@ionic/react';
import {
    closeOutline,
    checkmarkCircleOutline,
    schoolOutline,
    bulbOutline,
    chevronForwardOutline,
    chevronBackOutline,
    playCircleOutline,
    heartOutline,
    chatbubbleOutline
} from 'ionicons/icons';
import { SKILLS_PHASES, LIFE_SKILLS } from '../data/skillsData';

const SkillsGuide = ({ isOpen, onClose, initialPhase = 1, initialType = 'core' }) => {
    const [viewType, setViewType] = useState(initialType); // 'core' or 'life'
    const [currentPhase, setCurrentPhase] = useState(initialPhase);

    useEffect(() => {
        if (isOpen) {
            setViewType(initialType);
            setCurrentPhase(initialPhase);
        }
    }, [isOpen, initialPhase, initialType]);

    const data = viewType === 'core' ? SKILLS_PHASES : LIFE_SKILLS;
    const phase = data[currentPhase] || data[1];
    const totalPhases = Object.keys(data).length;

    const nextPhase = () => {
        if (currentPhase < totalPhases) setCurrentPhase(currentPhase + 1);
    };

    const prevPhase = () => {
        if (currentPhase > 1) setCurrentPhase(currentPhase - 1);
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                    <IonTitle style={{ fontWeight: '800' }}>Teaching Guide</IonTitle>
                </IonToolbar>
                
                <IonToolbar>
                    <IonSegment value={viewType} onIonChange={e => {
                        setViewType(e.detail.value);
                        setCurrentPhase(1); // Reset to first item when switching types
                    }}>
                        <IonSegmentButton value="core">
                            <IonIcon icon={chatbubbleOutline} />
                            <IonLabel>Learning Path</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="life">
                            <IonIcon icon={heartOutline} />
                            <IonLabel>Social Skills</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>

                <IonToolbar>
                    <IonSegment 
                        scrollable={true} 
                        value={currentPhase.toString()} 
                        onIonChange={e => setCurrentPhase(parseInt(e.detail.value))}
                    >
                        {Object.keys(data).map(num => (
                            <IonSegmentButton key={num} value={num.toString()}>
                                <IonLabel>Step {num}</IonLabel>
                            </IonSegmentButton>
                        ))}
                    </IonSegment>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{ '--background': '#F2F2F7' }}>
                {/* 1. Header Card */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                        width: '140px', 
                        height: '140px', 
                        margin: '0 auto 1rem',
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))',
                        dangerouslySetInnerHTML: { __html: phase.image }
                    }} />
                    
                    <IonBadge color={viewType === 'core' ? 'primary' : 'success'} style={{ borderRadius: '12px', padding: '6px 12px', marginBottom: '8px' }}>
                        {viewType === 'core' ? 'COMMUNICATION' : 'SOCIAL SKILL'}
                    </IonBadge>

                    <h1 style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1D1D1F', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                        {phase.title}
                    </h1>
                    
                    <p style={{ 
                        marginTop: '12px', 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: '#48484A',
                        padding: '0 15px',
                        lineHeight: '1.4'
                    }}>
                        {phase.goal}
                    </p>
                </div>

                {/* 2. Implementation Guide / Procedure */}
                <div style={{ background: 'white', borderRadius: '24px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IonIcon icon={schoolOutline} />
                        How to teach this
                    </h3>
                    <IonList lines="none">
                        {(phase.implementation || phase.procedure).map((step, i) => (
                            <IonItem key={i} style={{ '--padding-start': '0', marginBottom: '8px' }}>
                                <div slot="start" style={{ 
                                    background: viewType === 'core' ? '#007AFF' : '#34C759', 
                                    width: '24px', 
                                    height: '24px', 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: '800'
                                }}>
                                    {i + 1}
                                </div>
                                <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                                    {step}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </div>

                {/* 3. Task Analysis / Prompting */}
                {(phase.taskAnalysis || phase.prompting) && (
                    <div style={{ background: '#F8F9FA', borderRadius: '24px', border: '2px dashed #E5E5EA', padding: '20px', marginBottom: '40px' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#8E8E93', textTransform: 'uppercase', marginBottom: '16px' }}>
                            {viewType === 'core' ? '🧩 Simple Steps' : '🤖 Help Strategy'}
                        </h3>
                        {viewType === 'core' ? (
                            <IonList lines="none" style={{ background: 'transparent' }}>
                                {phase.taskAnalysis.map((task, i) => (
                                    <IonItem key={i} style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '12px' }}>
                                        <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1D1D1F' }}>
                                            {task}
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        ) : (
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#48484A', lineHeight: 1.5 }}>
                                {phase.prompting}
                            </p>
                        )}
                    </div>
                )}

                {/* 4. Extra Info (Life Skills only) */}
                {viewType === 'life' && (
                    <div style={{ background: '#F0F9FF', borderRadius: '24px', padding: '20px', marginBottom: '20px', border: '1px solid #BAE6FD' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0369A1', textTransform: 'uppercase', marginBottom: '12px' }}>
                            ✨ Communication Context
                        </h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '600', color: '#075985', lineHeight: 1.5 }}>
                            <b>Exchange Tip:</b> {phase.exchangeTip}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#0C4A6E', opacity: 0.8 }}>
                            <b>Research Link:</b> {phase.connection}
                        </p>
                    </div>
                )}

                {/* 5. Reinforcement (Life Skills only) */}
                {phase.reinforcement && (
                    <div style={{ background: '#E8F5E9', borderRadius: '24px', padding: '20px', marginBottom: '40px' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '0.9rem', color: '#2E7D32', textTransform: 'uppercase', marginBottom: '12px' }}>
                            🎁 Reward Plan
                        </h3>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1B5E20', lineHeight: 1.5 }}>
                            {phase.reinforcement}
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: '12px', paddingBottom: '40px' }}>
                    <button 
                        onClick={prevPhase}
                        disabled={currentPhase === 1}
                        style={{ 
                            flex: 1, 
                            padding: '16px', 
                            borderRadius: '16px', 
                            background: '#E5E5EA', 
                            border: 'none',
                            fontWeight: '700',
                            opacity: currentPhase === 1 ? 0.5 : 1
                        }}
                    >
                        <IonIcon icon={chevronBackOutline} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Back
                    </button>
                    <button 
                        onClick={nextPhase}
                        disabled={currentPhase === totalPhases}
                        style={{ 
                            flex: 2, 
                            padding: '16px', 
                            borderRadius: '16px', 
                            background: viewType === 'core' ? '#007AFF' : '#34C759', 
                            color: 'white',
                            border: 'none',
                            fontWeight: '700',
                            opacity: currentPhase === totalPhases ? 0.5 : 1
                        }}
                    >
                        {currentPhase === totalPhases ? 'Goal Mastered!' : 'Next Step'}
                        <IonIcon icon={chevronForwardOutline} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
                    </button>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default SkillsGuide;
