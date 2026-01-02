import { useState } from 'react';

const TouchCalibration = ({ onComplete }) => {
    // 0: Start, 1: Large Test, 2: Standard Test, 3: Dense Test, 4: Result
    const [phase, setPhase] = useState(0);
    const [results, setResults] = useState({ large: 0, standard: 0, dense: 0 });
    const [attempts, setAttempts] = useState(0); // Count attempts per phase
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 }); // Center by default

    const MAX_ATTEMPTS = 3;

    const getRandomPos = () => {
        // Avoid edges (10% to 90%)
        return {
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 70
        };
    };

    const handleTap = (success) => {
        if (phase === 0) {
            setPhase(1); // Start Large Test
            setTargetPos(getRandomPos());
            return;
        }

        const currentKey = phase === 1 ? 'large' : phase === 2 ? 'standard' : 'dense';

        if (success) {
            setResults(prev => ({ ...prev, [currentKey]: prev[currentKey] + 1 }));
        }

        const nextAttempt = attempts + 1;

        if (nextAttempt >= MAX_ATTEMPTS) {
            // End of this phase
            if (phase === 1) {
                // If they failed large (<=1 success), stop here.
                if (results.large + (success ? 1 : 0) <= 1) {
                    finishCalibration('super-big');
                } else {
                    setPhase(2);
                    setAttempts(0);
                    setTargetPos(getRandomPos());
                }
            } else if (phase === 2) {
                // If they failed standard, set to Big
                if (results.standard + (success ? 1 : 0) <= 1) {
                    finishCalibration('big');
                } else {
                    setPhase(3);
                    setAttempts(0);
                    setTargetPos(getRandomPos());
                }
            } else if (phase === 3) {
                // If they passed dense
                if (results.dense + (success ? 1 : 0) >= 2) {
                    finishCalibration('dense');
                } else {
                    finishCalibration('standard');
                }
            }
        } else {
            setAttempts(nextAttempt);
            setTargetPos(getRandomPos());
        }
    };

    const finishCalibration = (size) => {
        // Save and exit
        localStorage.setItem('kiwi-grid-size', size);
        // Force refresh of settings if needed? App.jsx watches localStorage on mount, 
        // but we might need to pass this up or rely on the final reload.
        // Actually App.jsx uses localStorage default.
        onComplete();
    };

    const getButtonSize = () => {
        if (phase === 1) return 11.25; // 180px
        if (phase === 2) return 6.25;  // 100px
        if (phase === 3) return 3.75;  // 60px
        return 6.25;
    };

    const getButtonLabel = () => {
        if (phase === 1) return "🍎";
        if (phase === 2) return "🍪";
        if (phase === 3) return "🍬";
        return "";
    };

    if (phase === 0) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: '#FDF8F3',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '1.25rem', textAlign: 'center', zIndex: 1200
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🎯</div>
                <h1 style={{ marginBottom: '0.625rem', fontSize: '2rem' }}>Let&apos;s check your touch</h1>
                <p style={{ color: '#666', marginBottom: '1.875rem', maxWidth: '18.75rem', fontSize: '1rem' }}>
                    We&apos;ll play a quick game to see which button size works best for you.
                </p>
                <button
                    onClick={() => handleTap(true)}
                    style={{
                        padding: '1rem 2rem', background: '#007AFF', color: 'white',
                        border: 'none', borderRadius: '1rem', fontSize: '1.2rem', fontWeight: 'bold',
                        minHeight: '3.5rem'
                    }}
                >
                    Start Game
                </button>
            </div>
        );
    }

    return (
        <div 
            style={{
                position: 'fixed', inset: 0, background: '#FDF8F3',
                zIndex: 1200, overflow: 'hidden'
            }}
            onClick={(e) => {
                // Missed tap
                // Only count if they clicked the background, not the button
                if (e.target === e.currentTarget) {
                    handleTap(false);
                }
            }}
        >
            <div style={{ position: 'absolute', top: '1.25rem', width: '100%', textAlign: 'center', color: '#999', fontSize: '1rem' }}>
                Tap the picture! {attempts + 1}/{MAX_ATTEMPTS}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent background click
                    handleTap(true);
                }}
                style={{
                    position: 'absolute',
                    left: `${targetPos.x}%`,
                    top: `${targetPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${getButtonSize()}rem`,
                    height: `${getButtonSize()}rem`,
                    borderRadius: '1.25rem',
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 0.625rem 1.25rem rgba(0,0,0,0.15)',
                    fontSize: `${getButtonSize() * 0.6}rem`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                {getButtonLabel()}
            </button>
        </div>
    );
};

export default TouchCalibration;
