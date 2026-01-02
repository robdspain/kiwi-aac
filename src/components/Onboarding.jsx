import { useState } from 'react';
import Assessment from './Assessment';
import TouchCalibration from './TouchCalibration';
import FavoritesPicker from './FavoritesPicker';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [showAssessment, setShowAssessment] = useState(false);
    const [showCalibration, setShowCalibration] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [recommendedPhase, setRecommendedPhase] = useState(null);
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [canRead, setCanRead] = useState(null);

    const steps = [
        {
            title: "Welcome to Kiwi Voice! 🥝",
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
                            <div style={{ width: '50px', textAlign: 'center' }}>
                                <img 
                                    src="/images/settings-gear.png" 
                                    alt="Settings" 
                                    style={{ width: '50px', height: '50px', objectFit: 'contain', opacity: 0.5 }} 
                                />
                            </div>
                            <div>
                                <strong>Adult Settings</strong> to customize and edit
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
                            💡 <strong>Start simple</strong> — Begin with one item that could have multiple meanings such as play, snack or toy
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
        },
        {
            title: "Child Lock Mode 🔒",
            content: (
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/images/guided-access.png"
                        alt="Guided Access Instructions"
                        style={{ width: '100%', maxWidth: '400px', marginBottom: '20px', borderRadius: '16px' }}
                    />
                    <div style={{ textAlign: 'left', background: 'rgba(88, 86, 214, 0.1)', padding: '20px', borderRadius: '16px', marginTop: '15px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '12px', textAlign: 'center' }}>📱 Enable Guided Access</div>
                        <div style={{ fontSize: '1rem', lineHeight: 1.7, color: '#636E72' }}>
                            <p style={{ marginBottom: '12px' }}><strong>Step 1:</strong> Go to Settings → Accessibility → Guided Access</p>
                            <p style={{ marginBottom: '12px' }}><strong>Step 2:</strong> Turn it ON and set a passcode</p>
                            <p style={{ marginBottom: '12px' }}><strong>Step 3:</strong> Open Kiwi Voice and <strong>triple-click the Side Button</strong></p>
                            <p style={{ marginBottom: '12px' }}><strong>Step 4:</strong> Tap &quot;Start&quot; to lock the app</p>
                            <p style={{ marginBottom: '0' }}><strong>To Exit:</strong> Triple-click Side Button again and enter passcode</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '15px', fontSize: '0.95rem', color: '#95A5A6', textAlign: 'center' }}>
                        This prevents accidental exits and keeps your child focused on communication
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step === 0) {
            // After welcome, check motor skills
            setShowCalibration(true);
        } else if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            localStorage.setItem('kiwi-onboarding-complete', 'true');
            onComplete(recommendedPhase || 0, selectedFavorites, canRead);
        }
    };

    const handleCalibrationComplete = () => {
        setShowCalibration(false);
        setShowAssessment(true);
    };

    const handleAssessmentComplete = (phase, favorites, literacy) => {
        setRecommendedPhase(phase);
        setSelectedFavorites(favorites || []);
        setCanRead(literacy);
        setShowAssessment(false);
        setStep(1); // Move to "How to Use" step
    };

    const handleFavoritesComplete = (favs) => {
        setSelectedFavorites(favs);
        setShowFavorites(false);
        setStep(1); // Move to "How to Use" step
    };

    const handleSkip = () => {
        localStorage.setItem('kiwi-onboarding-complete', 'true');
        onComplete(recommendedPhase || 0, selectedFavorites, canRead);
    };

    if (showCalibration) {
        return <TouchCalibration onComplete={handleCalibrationComplete} />;
    }

    // Show assessment
    if (showAssessment) {
        return <Assessment onComplete={handleAssessmentComplete} />;
    }

    if (showFavorites) {
        return <FavoritesPicker onComplete={handleFavoritesComplete} />;
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
