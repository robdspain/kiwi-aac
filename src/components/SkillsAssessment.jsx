import { useState } from 'react';
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
    IonIcon,
    IonRadioGroup,
    IonRadio,
    IonNote,
    IonSegment,
    IonSegmentButton
} from '@ionic/react';
import { closeOutline, checkmarkCircleOutline, helpCircleOutline, heartOutline, chatbubbleOutline } from 'ionicons/icons';
import { SKILLS_ASSESSMENT_QUESTIONS, LIFE_SKILLS } from '../data/skillsData';

const SkillsAssessment = ({ isOpen, onClose, onComplete }) => {
    const [assessmentType, setAssessmentType] = useState('core'); // 'core' or 'life'
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});

    // Generate life skills questions dynamically from data if not explicitly defined
    const lifeSkillsQuestions = Object.values(LIFE_SKILLS).map(s => ({
        id: `life-${s.id}`,
        question: `Can your child do this: ${s.title}? (${s.goal})`,
        phaseIfNo: s.id
    }));

    const activeQuestions = assessmentType === 'core' ? SKILLS_ASSESSMENT_QUESTIONS : lifeSkillsQuestions;

    const handleAnswer = (val) => {
        const question = activeQuestions[currentStep];
        const newAnswers = { ...answers, [question.id]: val };
        setAnswers(newAnswers);

        if (currentStep < activeQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Calculate recommended phase
            let recommendedPhase = 1;
            if (assessmentType === 'core') {
                for (const q of activeQuestions) {
                    if (newAnswers[q.id] === 'no') {
                        recommendedPhase = q.phasesIfNo[0];
                        break;
                    }
                    recommendedPhase = 9;
                }
            } else {
                for (const q of activeQuestions) {
                    if (newAnswers[q.id] === 'no') {
                        recommendedPhase = q.phaseIfNo;
                        break;
                    }
                    recommendedPhase = 7;
                }
            }
            onComplete(recommendedPhase, assessmentType);
        }
    };

    const question = activeQuestions[currentStep];

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle style={{ fontWeight: '800' }}>Life Skills Check</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose}>
                            <IonIcon icon={closeOutline} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={assessmentType} onIonChange={e => {
                        setAssessmentType(e.detail.value);
                        setCurrentStep(0);
                        setAnswers({});
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
            </IonHeader>

            <IonContent className="ion-padding" style={{ '--background': '#F2F2F7' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        {assessmentType === 'core' ? '📋' : '🏠'}
                    </div>
                    <h2 style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                        {assessmentType === 'core' ? 'Learning Path Check' : 'Social Skills Check'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Question {currentStep + 1} of {activeQuestions.length}
                    </p>
                </div>

                <div style={{ 
                    background: 'white', 
                    padding: '24px', 
                    borderRadius: '24px', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ 
                        margin: '0 0 24px 0', 
                        fontSize: '1.2rem', 
                        fontWeight: '700', 
                        lineHeight: '1.4',
                        textAlign: 'center'
                    }}>
                        {question.question}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => handleAnswer('yes')}
                            style={{
                                padding: '20px',
                                borderRadius: '16px',
                                border: '2px solid #E5E5EA',
                                background: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: '#34C759',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            Yes, they do this
                        </button>
                        <button
                            onClick={() => handleAnswer('no')}
                            style={{
                                padding: '20px',
                                borderRadius: '16px',
                                border: '2px solid #E5E5EA',
                                background: 'white',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: '#FF3B30',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            No, not yet
                        </button>
                    </div>
                </div>

                <div style={{ padding: '0 1rem', textAlign: 'center' }}>
                    <IonNote color="medium" style={{ fontSize: '0.85rem' }}>
                        <IonIcon icon={helpCircleOutline} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {assessmentType === 'core' 
                            ? 'Based on Dr. Gregory Hanley’s research on teaching independence.'
                            : 'Focusing on social independence and preschool readiness.'}
                    </IonNote>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default SkillsAssessment;