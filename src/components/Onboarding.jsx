import { useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import Assessment from './Assessment';
import TouchCalibration from './TouchCalibration';
import FavoritesPicker from './FavoritesPicker';
import ImageCropModal from './ImageCropModal';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [showAssessment, setShowAssessment] = useState(false);
    const [showCalibration, setShowCalibration] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [recommendedPhase, setRecommendedPhase] = useState(null);
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [canRead, setCanRead] = useState(null);
    const [assessmentAnswers, setAssessmentAnswers] = useState(null); // Store full assessment results
    const [learnerName, setLearnerName] = useState('');
    const [learnerPhoto, setLearnerPhoto] = useState(null);
    const [cropSource, setCropSource] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [isCalibrationComplete, setIsCalibrationComplete] = useState(false);
    const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
    const fileInputRef = useRef(null);

    const takePhoto = async () => {
        try {
            // Check if running on native platform
            const isNative = Capacitor.isNativePlatform();

            if (isNative) {
                // Use Capacitor Camera API for native apps
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Prompt
                });
                if (image && image.dataUrl) {
                    setCropSource(image.dataUrl);
                    setShowCropper(true);
                }
            } else {
                // Use file input for web browsers (PWA)
                if (fileInputRef.current) {
                    fileInputRef.current.click();
                }
            }
        } catch (error) {
            console.error('Camera error:', error);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCropSource(e.target.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    const steps = [
        {
            title: "Welcome to Kiwi Voice! 🥝",
            content: (
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/images/logo.png"
                        alt="Kiwi Voice Logo"
                        style={{
                            width: '10rem',
                            height: '10rem',
                            marginBottom: '1.25rem',
                            borderRadius: '2rem',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    />
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        A powerful communication tool designed for children learning to express themselves.
                    </p>
                </div>
            )
        },
        {
            title: "Who are we helping?",
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div
                        onClick={takePhoto}
                        aria-label="Take or upload photo"
                        style={{
                            width: '8rem', height: '8rem', borderRadius: '50%',
                            background: 'var(--gray-light, #F2F2F7)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '3rem', cursor: 'pointer',
                            overflow: 'hidden', border: '0.25rem solid var(--card-bg, #FFFFFF)',
                            boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}
                    >
                        {learnerPhoto ? (
                            <img src={learnerPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: '3.5rem' }}>📸</span>
                        )}
                        <div style={{
                            position: 'absolute', bottom: 0, width: '100%',
                            background: 'rgba(0,0,0,0.5)', color: 'white',
                            fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 0',
                            textAlign: 'center'
                        }}>EDIT</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>LEARNER'S NAME</label>
                        <input
                            type="text"
                            placeholder="Enter name (optional)"
                            value={learnerName}
                            onChange={(e) => setLearnerName(e.target.value)}
                            style={{
                                width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem',
                                border: '1px solid var(--gray-border)', background: 'var(--card-bg)', fontSize: '1.1rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)', outline: 'none', color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                        Adding a name and photo makes the app feel like it belongs to them!
                    </p>
                </div>
            )
        },
        {
            title: "How to Use",
            content: (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9375rem', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', gap: '0.9375rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '3.125rem', textAlign: 'center' }}>👆</div>
                            <div>
                                <strong>Tap</strong> any icon to hear the word spoken
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.9375rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '3.125rem', textAlign: 'center' }}>📁</div>
                            <div>
                                <strong>Folders</strong> organize related words together
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.9375rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2.5rem', width: '3.125rem', textAlign: 'center' }}>⚙️</div>
                            <div>
                                <strong>Adult Settings</strong> to customize and edit
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.9375rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2rem', width: '3.125rem', textAlign: 'center' }}>✏️</div>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)' }}>
                        <div style={{ background: 'var(--gray-light)', border: '1px solid var(--gray-border)', padding: '0.9375rem', borderRadius: '0.75rem' }}>
                            💡 <strong>Start simple</strong> — Begin with one item that could have multiple meanings such as play, snack or toy
                        </div>
                        <div style={{ background: 'var(--gray-light)', border: '1px solid var(--gray-border)', padding: '0.9375rem', borderRadius: '0.75rem' }}>
                            🎯 <strong>Be consistent</strong> — Practice during natural routines
                        </div>
                        <div style={{ background: 'var(--gray-light)', border: '1px solid var(--gray-border)', padding: '0.9375rem', borderRadius: '0.75rem' }}>
                            🎉 <strong>Celebrate</strong> — Reinforce every communication attempt
                        </div>
                        <div style={{ background: 'var(--gray-light)', border: '1px solid var(--gray-border)', padding: '0.9375rem', borderRadius: '0.75rem' }}>
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
                        src="/images/guided-access-instruction.png"
                        alt="Guided Access Instructions"
                        style={{ width: '100%', maxWidth: '25rem', marginBottom: '1.25rem', borderRadius: '1rem', border: '1px solid var(--gray-border)' }}
                    />
                    <div style={{ textAlign: 'left', background: 'var(--gray-light)', border: '1px solid var(--gray-border)', padding: '1.25rem', borderRadius: '1rem', marginTop: '0.9375rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>📱 Enable Guided Access</div>
                        <div style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                            <p style={{ marginBottom: '0.75rem' }}><strong>Step 1:</strong> Go to Settings → Accessibility → Guided Access</p>
                            <p style={{ marginBottom: '0.75rem' }}><strong>Step 2:</strong> Turn it ON and set a passcode</p>
                            <p style={{ marginBottom: '0.75rem' }}><strong>Step 3:</strong> Open Kiwi Voice and <strong>triple-click the Side Button</strong></p>
                            <p style={{ marginBottom: '0.75rem' }}><strong>Step 4:</strong> Tap "Start" to lock the app</p>
                            <p style={{ marginBottom: '0' }}><strong>To Exit:</strong> Triple-click Side Button again and enter passcode</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '0.9375rem', fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        This prevents accidental exits and keeps your child focused on communication
                    </div>
                </div>
            )
        }
    ];

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleNext = () => {
        if (step === 0 && (!isCalibrationComplete || !isAssessmentComplete)) {
            // After welcome, check motor skills if not done
            if (!isCalibrationComplete) {
                setShowCalibration(true);
            } else if (!isAssessmentComplete) {
                setShowAssessment(true);
            }
        } else if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            console.log('Onboarding: Final Get Started clicked. Calling onComplete...');
            localStorage.setItem('kiwi-onboarding-complete', 'true');
            onComplete(recommendedPhase || 0, selectedFavorites, canRead, { 
                name: learnerName, 
                photo: learnerPhoto,
                assessmentAnswers 
            });
        }
    };

    const handleCalibrationComplete = () => {
        setIsCalibrationComplete(true);
        setShowCalibration(false);
        if (!isAssessmentComplete) {
            setShowAssessment(true);
        } else {
            setStep(1);
        }
    };

    const handleAssessmentComplete = (phase, favorites, literacy, answers) => {
        setRecommendedPhase(phase);
        setSelectedFavorites(favorites || []);
        setCanRead(literacy);
        setAssessmentAnswers(answers); // Capture detailed answers
        setIsAssessmentComplete(true);
        setShowAssessment(false);
        console.log('Onboarding: Assessment complete. Moving to step 1.');
        setStep(1); // Move to "Who are we helping?" step
    };

    const handleFavoritesComplete = (favs) => {
        setSelectedFavorites(favs);
        setShowFavorites(false);
        setStep(1); // Move to "Who are we helping?" step
    };

    const handleSkip = () => {
        localStorage.setItem('kiwi-onboarding-complete', 'true');
        onComplete(recommendedPhase || 0, selectedFavorites, canRead, { assessmentAnswers });
    };

    if (showCalibration) {
        return (
            <TouchCalibration
                onComplete={handleCalibrationComplete}
                onBack={() => {
                    setShowCalibration(false);
                    setStep(0);
                }}
            />
        );
    }

    // Show assessment
    if (showAssessment) {
        return (
            <Assessment
                onComplete={handleAssessmentComplete}
                onBack={() => {
                    setShowAssessment(false);
                    setShowCalibration(true);
                }}
            />
        );
    }

    if (showFavorites) {
        return <FavoritesPicker onComplete={handleFavoritesComplete} />;
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'var(--bg-color)',
            zIndex: 1000, display: 'flex', flexDirection: 'column',
            padding: '2.5rem 1.5625rem', boxSizing: 'border-box'
        }}>
            {/* Hidden file input for web browsers */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.875rem' }}>
                {steps.map((_, i) => (
                    <div key={i} style={{
                        width: i === step ? '1.5rem' : '0.75rem',
                        height: '0.75rem',
                        borderRadius: '0.75rem',
                        background: i <= step
                            ? 'var(--primary-dark)'
                            : 'var(--gray-border)',
                        transition: 'all 0.3s ease'
                    }} />
                ))}
            </div>

            {/* Title */}
            <h1 style={{
                textAlign: 'center',
                marginBottom: '1.25rem',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)'
            }}>
                {steps[step].title}
            </h1>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {steps[step].content}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                {step > 0 && (
                    <button
                        onClick={handleBack}
                        style={{
                            flex: 1, padding: '1rem',
                            background: 'var(--card-bg)',
                            border: '0.125rem solid var(--gray-border)',
                            borderRadius: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            minHeight: '3.5rem'
                        }}
                    >
                        ← Back
                    </button>
                )}
                {step < steps.length - 1 && (
                    <button
                        onClick={handleSkip}
                        style={{
                            flex: 1, padding: '1rem',
                            background: 'var(--card-bg)',
                            border: '0.125rem solid var(--gray-border)',
                            borderRadius: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            minHeight: '3.5rem'
                        }}
                    >
                        Skip
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="primary-button"
                    style={{
                        flex: 2, padding: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        minHeight: '3.5rem'
                    }}
                >
                    {step === steps.length - 1 ? 'Get Started →' : 'Next →'}
                </button>
            </div>
            {showCropper && (
                <ImageCropModal
                    isOpen={showCropper}
                    imageSrc={cropSource}
                    onCancel={() => { setShowCropper(false); setCropSource(null); }}
                    onSave={(dataUrl) => {
                        setLearnerPhoto(dataUrl);
                        setShowCropper(false);
                        setCropSource(null);
                    }}
                    title="Crop Profile Photo"
                />
            )}
        </div>
    );
};

export default Onboarding;
