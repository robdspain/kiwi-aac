import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to Kiwi AAC! 🥝",
            content: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🥝</div>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>
                        A powerful communication tool designed for children learning to express themselves.
                    </p>
                </div>
            )
        },
        {
            title: "What is PECS?",
            content: (
                <div>
                    <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                        <strong>PECS</strong> (Picture Exchange Communication System) teaches communication in progressive phases:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                        <div style={{ background: '#E3F2FD', padding: '12px', borderRadius: '12px' }}>
                            <strong>Phase 1:</strong> Single picture exchange
                        </div>
                        <div style={{ background: '#E8F5E9', padding: '12px', borderRadius: '12px' }}>
                            <strong>Phase 2:</strong> Distance & persistence
                        </div>
                        <div style={{ background: '#FFF3E0', padding: '12px', borderRadius: '12px' }}>
                            <strong>Phase 3:</strong> Discrimination between icons
                        </div>
                        <div style={{ background: '#FCE4EC', padding: '12px', borderRadius: '12px' }}>
                            <strong>Phase 4+:</strong> Sentence building
                        </div>
                    </div>
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
                        <div style={{ background: '#f0f0ff', padding: '15px', borderRadius: '12px' }}>
                            💡 <strong>Start simple</strong> — Begin with 1-3 highly motivating items
                        </div>
                        <div style={{ background: '#f0fff0', padding: '15px', borderRadius: '12px' }}>
                            🎯 <strong>Be consistent</strong> — Practice during natural routines
                        </div>
                        <div style={{ background: '#fff0f0', padding: '15px', borderRadius: '12px' }}>
                            🎉 <strong>Celebrate</strong> — Reinforce every communication attempt
                        </div>
                        <div style={{ background: '#fffff0', padding: '15px', borderRadius: '12px' }}>
                            📷 <strong>Personalize</strong> — Add photos of family, pets, favorite foods
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "You're Ready! 🎉",
            content: (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🚀</div>
                    <p style={{ fontSize: '1.2rem', color: '#555' }}>
                        Tap "Get Started" to begin using Kiwi AAC.
                    </p>
                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '15px' }}>
                        You can always access settings by tapping "Parent Settings" at the bottom.
                    </p>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            localStorage.setItem('kiwi-onboarding-complete', 'true');
            onComplete();
        }
    };

    const handleSkip = () => {
        localStorage.setItem('kiwi-onboarding-complete', 'true');
        onComplete();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(180deg, #E8F5E9 0%, #F2F2F7 100%)',
            zIndex: 1000, display: 'flex', flexDirection: 'column',
            padding: '40px 25px', boxSizing: 'border-box'
        }}>
            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
                {steps.map((_, i) => (
                    <div key={i} style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: i === step ? '#007AFF' : '#C7C7CC'
                    }} />
                ))}
            </div>

            {/* Title */}
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem' }}>
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
                            flex: 1, padding: '16px', background: '#E5E5EA',
                            border: 'none', borderRadius: '14px', fontSize: '1rem', cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                )}
                <button
                    onClick={handleNext}
                    style={{
                        flex: 2, padding: '16px', background: '#007AFF', color: 'white',
                        border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                    }}
                >
                    {step === steps.length - 1 ? 'Get Started' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
