import { useState, useEffect } from 'react';
import { IonIcon, IonButton, IonText } from '@ionic/react';
import { closeOutline, sparklesOutline, volumeHighOutline, settingsOutline, lockClosedOutline, chevronForwardOutline } from 'ionicons/icons';

const GuidedTour = ({ isOpen, onComplete, targetRefs, onEditNode }) => {
    const [step, setStep] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const tourSteps = [
        {
            title: "Tap to Speak",
            content: "Tap the picture to hear the word spoken out loud. This helps your child learn cause and effect.",
            target: 'mainCard',
            icon: sparklesOutline,
            position: 'bottom'
        },
        {
            title: "Make it Yours",
            content: "You can change this picture and text to whatever motivates your child most!",
            target: 'mainCard',
            icon: settingsOutline,
            position: 'bottom',
            action: {
                label: "Customize Now",
                onClick: () => onEditNode && onEditNode(0)
            }
        },
        {
            title: "Voice Output",
            content: "The sound comes from your device. Make sure your volume is up!",
            target: 'mainCard',
            icon: volumeHighOutline,
            position: 'bottom'
        },
        {
            title: "Adult Settings",
            content: "Swipe up or tap here to open the menu. This is where you can edit words, change voices, and more.",
            target: 'controlsHandle',
            icon: settingsOutline,
            position: 'top'
        },
        {
            title: "Child Lock",
            content: "Keep your child focused! Triple-click the side button to lock them in the app (Guided Access).",
            target: 'center',
            icon: lockClosedOutline,
            position: 'center'
        }
    ];

    useEffect(() => {
        if (!isOpen) return;

        const currentTargetKey = tourSteps[step].target;

        if (currentTargetKey === 'center') {
            setPosition(null);
            return;
        }

        const targetEl = targetRefs[currentTargetKey]?.current;

        if (targetEl) {
            const rect = targetEl.getBoundingClientRect();
            setPosition({
                top: rect.top - 10,
                left: rect.left - 10,
                width: rect.width + 20,
                height: rect.height + 20
            });
        }
    }, [step, isOpen, targetRefs]);

    const handleNext = () => {
        if (step < tourSteps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    if (!isOpen) return null;

    const currentStep = tourSteps[step];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'auto'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                transition: 'all 0.3s ease'
            }}>
                {position && (
                    <div style={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        height: position.height,
                        background: 'rgba(255,255,255,0.1)',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.5)',
                        borderRadius: '1.5rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        pointerEvents: 'none'
                    }} />
                )}
            </div>

            <div style={{
                position: 'absolute',
                top: currentStep.position === 'center' ? '50%' :
                    currentStep.position === 'top' ? (position ? position.top - 20 : '30%') :
                        (position ? position.top + position.height + 20 : '60%'),
                left: '50%',
                transform: currentStep.position === 'center' || currentStep.position === 'top' ? 'translate(-50%, -50%)' : 'translate(-50%, 0)',
                marginTop: currentStep.position === 'top' ? '-12rem' : '0',

                width: '90%',
                maxWidth: '22rem',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '3.5rem', height: '3.5rem',
                    background: 'var(--ion-color-primary-tint)',
                    borderRadius: '50%', margin: '0 auto 1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--ion-color-primary)'
                }}>
                    <IonIcon icon={currentStep.icon} style={{ fontSize: '1.8rem' }} />
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--ion-color-dark)' }}>
                    {currentStep.title}
                </h3>

                <p style={{ fontSize: '1rem', color: 'var(--ion-color-medium)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                    {currentStep.content}
                </p>

                {currentStep.action && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <IonButton
                            expand="block"
                            fill="outline"
                            shape="round"
                            onClick={currentStep.action.onClick}
                        >
                            {currentStep.action.label}
                        </IonButton>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                        {tourSteps.map((_, i) => (
                            <div key={i} style={{
                                width: '0.5rem', height: '0.5rem',
                                borderRadius: '50%',
                                background: i === step ? 'var(--ion-color-primary)' : 'var(--ion-color-light-shade)'
                            }} />
                        ))}
                    </div>

                    <IonButton
                        onClick={handleNext}
                        shape="round"
                        style={{ minWidth: '8rem' }}
                    >
                        {step === tourSteps.length - 1 ? 'Finish' : 'Next'}
                        {step < tourSteps.length - 1 && <IonIcon slot="end" icon={chevronForwardOutline} />}
                    </IonButton>
                </div>

                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    <IonButton fill="clear" size="small" color="medium" onClick={onComplete}>
                        <IonIcon slot="icon-only" icon={closeOutline} />
                    </IonButton>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};

export default GuidedTour;
