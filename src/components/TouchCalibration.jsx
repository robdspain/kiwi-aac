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
    IonFooter,
    IonProgressBar
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, checkmarkCircleOutline, handLeftOutline } from 'ionicons/icons';

// Grid size configurations
const GRID_SIZES = [
    { id: 'dense', icon: '🐜', label: '10mm', description: 'Precise', gridSize: 'dense', targetSize: 10, cols: 6 },
    { id: 'medium', icon: '🐈', label: '12mm', description: 'Compact', gridSize: 'medium', targetSize: 12, cols: 5 },
    { id: 'standard', icon: '🐕', label: '15mm', description: 'Balanced', gridSize: 'standard', targetSize: 15, cols: 4 },
    { id: 'big', icon: '🦒', label: '18mm', description: 'Comfortable', gridSize: 'big', targetSize: 18, cols: 3 },
    { id: 'super-big', icon: '🐘', label: '22mm', description: 'Easy', gridSize: 'super-big', targetSize: 22, cols: 2 }
];

const TEST_WORDS = ['Play', 'Snack', 'More', 'Help', 'Yes', 'No', 'Stop', 'Go'];
const TEST_ICONS = ['🏃', '🥨', '➕', '🆘', '✅', '❌', '🛑', '🚀'];

const TouchCalibration = ({ onComplete, onBack }) => {
    const { updateAccessProfile } = useProfile();
    const [step, setStep] = useState(1); // 1: Intro, 2: Testing, 3: Confirmation
    const [selectedSize, setSelectedSize] = useState(null);
    const [testingSize, setTestingSize] = useState(null);
    const [tappedTargets, setTappedTargets] = useState(new Set());

    const handleSizeSelect = (sizeConfig) => {
        const targetSize = sizeConfig.targetSize || 15;
        updateAccessProfile({ targetSize });
        localStorage.setItem('kiwi-grid-size', sizeConfig.gridSize);

        setTimeout(() => {
            onComplete();
        }, 300);
    };

    const handleTestTarget = (index) => {
        setTappedTargets(prev => new Set([...prev, index]));
        // Haptic feedback would go here
    };

    const handleStartTesting = () => {
        setTestingSize(GRID_SIZES[2]); // Start with standard (15mm)
        setStep(2);
    };

    const handleConfirmSize = () => {
        setSelectedSize(testingSize);
        setStep(3);
    };

    const handleTryDifferentSize = (direction) => {
        const currentIndex = GRID_SIZES.findIndex(s => s.id === testingSize.id);
        const newIndex = direction === 'smaller'
            ? Math.max(0, currentIndex - 1)
            : Math.min(GRID_SIZES.length - 1, currentIndex + 1);
        setTestingSize(GRID_SIZES[newIndex]);
        setTappedTargets(new Set());
    };

    const progress = step / 3;

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    {step > 1 && (
                        <IonButtons slot="start">
                            <IonButton onClick={() => setStep(step - 1)}>
                                <IonIcon icon={chevronBackOutline} slot="start" />
                                Back
                            </IonButton>
                        </IonButtons>
                    )}
                    <IonTitle>Touch Calibration</IonTitle>
                    {onBack && step === 1 && (
                        <IonButtons slot="end">
                            <IonButton onClick={onComplete} fill="clear">
                                Skip
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
                <IonProgressBar value={progress} color="primary" />
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Step 1: Introduction */}
                {step === 1 && (
                    <div style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>☝️</div>
                        <IonText>
                            <h1 style={{ fontWeight: 800, fontSize: '2rem', margin: '0 0 1rem 0' }}>
                                Find Your Perfect Button Size
                            </h1>
                            <p style={{ color: 'var(--ion-color-medium)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                We'll help you choose the right button size for comfortable tapping. This ensures the app works best for your motor skills.
                            </p>
                        </IonText>

                        <div style={{
                            background: 'var(--ion-color-light)',
                            borderRadius: '1.25rem',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '2rem' }}>🎯</div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '700' }}>
                                        What We'll Do
                                    </h3>
                                    <p style={{ margin: 0, color: 'var(--ion-color-medium)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        You'll tap some test buttons at different sizes. Choose the size that feels most comfortable and accurate for you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <IonButton
                            expand="block"
                            size="large"
                            onClick={handleStartTesting}
                            style={{ height: '3.5rem', marginTop: '2rem' }}
                        >
                            Let's Start
                            <IonIcon icon={chevronForwardOutline} slot="end" />
                        </IonButton>
                    </div>
                )}

                {/* Step 2: Interactive Testing */}
                {step === 2 && testingSize && (
                    <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{testingSize.icon}</div>
                            <IonText>
                                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                                    {testingSize.label} - {testingSize.description}
                                </h2>
                                <p style={{ color: 'var(--ion-color-medium)', fontSize: '1rem' }}>
                                    Tap the buttons below to test this size
                                </p>
                            </IonText>
                        </div>

                        {/* Interactive Test Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${testingSize.cols}, 1fr)`,
                            gap: '0.75rem',
                            marginBottom: '2rem',
                            padding: '1rem',
                            background: 'var(--ion-color-light)',
                            borderRadius: '1.25rem'
                        }}>
                            {TEST_WORDS.slice(0, testingSize.cols * 2).map((word, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleTestTarget(i)}
                                    style={{
                                        background: tappedTargets.has(i) ? 'var(--ion-color-success)' : 'white',
                                        border: tappedTargets.has(i) ? '2px solid var(--ion-color-success-shade)' : '2px solid var(--ion-color-light-shade)',
                                        borderRadius: '1.25rem',
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: tappedTargets.has(i) ? '0 4px 12px rgba(var(--ion-color-success-rgb), 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                                        transform: tappedTargets.has(i) ? 'scale(0.95)' : 'scale(1)'
                                    }}
                                >
                                    <span style={{ fontSize: '2rem' }}>
                                        {tappedTargets.has(i) ? '✓' : TEST_ICONS[i]}
                                    </span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: tappedTargets.has(i) ? 'white' : 'var(--ion-color-dark)'
                                    }}>
                                        {word}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Size Adjustment */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <IonText color="medium">
                                <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
                                    Not quite right? Try a different size:
                                </p>
                            </IonText>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    onClick={() => handleTryDifferentSize('smaller')}
                                    disabled={testingSize.id === GRID_SIZES[0].id}
                                    style={{ flex: 1 }}
                                >
                                    ← Smaller
                                </IonButton>
                                <IonButton
                                    expand="block"
                                    fill="outline"
                                    onClick={() => handleTryDifferentSize('larger')}
                                    disabled={testingSize.id === GRID_SIZES[GRID_SIZES.length - 1].id}
                                    style={{ flex: 1 }}
                                >
                                    Larger →
                                </IonButton>
                            </div>
                        </div>

                        <IonButton
                            expand="block"
                            size="large"
                            onClick={handleConfirmSize}
                            style={{ height: '3.5rem' }}
                        >
                            <IonIcon icon={checkmarkCircleOutline} slot="start" />
                            This Size Feels Good
                        </IonButton>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && selectedSize && (
                    <div style={{ maxWidth: '32rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
                        <IonText>
                            <h1 style={{ fontWeight: 800, fontSize: '2rem', margin: '0 0 1rem 0' }}>
                                Perfect!
                            </h1>
                            <p style={{ color: 'var(--ion-color-medium)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                You've selected <strong>{selectedSize.label}</strong> buttons. Here's how your grid will look:
                            </p>
                        </IonText>

                        {/* Preview Grid */}
                        <div style={{
                            background: 'var(--ion-color-light)',
                            borderRadius: '1.25rem',
                            padding: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${selectedSize.cols}, 1fr)`,
                                gap: '0.75rem'
                            }}>
                                {TEST_WORDS.slice(0, selectedSize.cols * 2).map((word, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            background: 'white',
                                            border: '2px solid var(--ion-color-light-shade)',
                                            borderRadius: '1.25rem',
                                            aspectRatio: '1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <span style={{ fontSize: '2rem' }}>{TEST_ICONS[i]}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{word}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <IonButton
                                expand="block"
                                fill="outline"
                                onClick={() => setStep(2)}
                                style={{ flex: 1, height: '3.5rem' }}
                            >
                                Try Again
                            </IonButton>
                            <IonButton
                                expand="block"
                                onClick={() => handleSizeSelect(selectedSize)}
                                style={{ flex: 1, height: '3.5rem' }}
                            >
                                <IonIcon icon={checkmarkCircleOutline} slot="start" />
                                Confirm
                            </IonButton>
                        </div>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default TouchCalibration;
