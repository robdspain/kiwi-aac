import React, { useState } from 'react';
import Assessment from './Assessment';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [showAssessment, setShowAssessment] = useState(false);
    const [recommendedPhase, setRecommendedPhase] = useState(null);

    const steps = [
        {
            title: "Welcome to Kiwi AAC! 🥝",
            content: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🥝</div>
                    <p style={{ fontSize: '1.1rem', color: '#636E72', lineHeight: 1.5 }}>
                        A powerful communication tool designed for children learning to express themselves.
                    </p>
                </div>
            )
        },
        {
            title: "How to Use",
            content: (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '50px', textAlign: 'center' }}>👆</div>
                            <div>
                                <strong>Tap</strong> any icon to hear the word spoken
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '50px', textAlign: 'center' }}>📁</div>
                            <div>
                                <strong>Folders</strong> organize related words together
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '50px', textAlign: 'center' }}>⚙️</div>
                            <div>
                                <strong>Parent Settings</strong> to customize and edit
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '50px', textAlign: 'center' }}>✏️</div>
                            <div>
                                <strong>Edit Mode</strong> to add, remove, or rearrange icons
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Tips for Success",
            content: (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(78, 205, 196, 0.15)', padding: '15px', borderRadius: '12px' }}>
                            💡 <strong>Start simple</strong> — Begin with 1-3 highly motivating items
                        </div>
                        <div style={{ background: 'rgba(126, 217, 87, 0.15)', padding: '15px', borderRadius: '12px' }}>
                            🎯 <strong>Be consistent</strong> — Practice during natural routines
                        </div>
                        <div style={{ background: 'rgba(255, 107, 107, 0.15)', padding: '15px', borderRadius: '12px' }}>
                            🎉 <strong>Celebrate</strong> — Reinforce every communication attempt
                        </div>
                        <div style={{ background: 'rgba(255, 184, 77, 0.15)', padding: '15px', borderRadius: '12px' }}>
                            📷 <strong>Personalize</strong> — Add photos of family, pets, favorite foods
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step === 0) {
            // After welcome, show assessment
            setShowAssessment(true);
        } else if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            localStorage.setItem('kiwi-onboarding-complete', 'true');
            onComplete(recommendedPhase || 0);
        }
    };

    const handleAssessmentComplete = (phase) => {
        setRecommendedPhase(phase);
        setShowAssessment(false);
        setStep(1); // Move to "How to Use" step
    };

    const handleSkip = () => {
        localStorage.setItem('kiwi-onboarding-complete', 'true');
        onComplete(recommendedPhase || 0);
    };

    // Show assessment
    if (showAssessment) {
        return <Assessment onComplete={handleAssessmentComplete} />;
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'linear-gradient(180deg, #FDF8F3 0%, #F5F0EB 100%)',
            zIndex: 1000, display: 'flex', flexDirection: 'column',
            padding: '40px 25px', boxSizing: 'border-box'
        }}>
            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
                {steps.map((_, i) => (
                    <div key={i} style={{
                        width: i === step ? '24px' : '10px',
                        height: '10px',
                        borderRadius: '10px',
                        background: i <= step
                            ? 'linear-gradient(135deg, #4ECDC4, #3DB8B0)'
                            : '#D1D5DB',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>

            {/* Title */}
            <h1 style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#2D3436'
            }}>
                {steps[step].title}
            </h1>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {steps[step].content}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                {step < steps.length - 1 && (
                    <button
                        onClick={handleSkip}
                        style={{
                            flex: 1, padding: '16px',
                            background: 'white',
                            border: '2px solid #E5E5EA',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#636E72',
                            cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                )}
                <button
                    onClick={handleNext}
                    style={{
                        flex: 2, padding: '16px',
                        background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(78, 205, 196, 0.3)'
                    }}
                >
                    {step === steps.length - 1 ? 'Get Started →' : 'Next →'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
