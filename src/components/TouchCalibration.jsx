import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

// Standard PPI estimate for mobile devices (can be refined per platform)
const PPI_ESTIMATE = 160; 
const getPxFromMm = (mm) => (mm / 25.4) * PPI_ESTIMATE;

const getRandomPos = () => {
    // Avoid edges (20% to 80% area)
    return {
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
    };
};

const SIZES = [10, 12, 15, 18, 22]; // mm

const TouchCalibration = ({ onComplete }) => {
    const { updateAccessProfile } = useProfile();
    // 0: Start, 1..N: Size Tests, Result
    const [phase, setPhase] = useState(0);
    const [results, setResults] = useState({});
    const [attempts, setAttempts] = useState(0); // Count attempts per phase
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 }); // Center by default

    const MAX_ATTEMPTS = 3;

    const handleTap = (success) => {
        if (phase === 0) {
            setPhase(1);
            setTargetPos(getRandomPos());
            return;
        }

        const sizeMm = SIZES[phase - 1];
        if (success) {
            setResults(prev => ({ ...prev, [sizeMm]: (prev[sizeMm] || 0) + 1 }));
        }

        const nextAttempt = attempts + 1;

        if (nextAttempt >= MAX_ATTEMPTS) {
            const finalSuccessCount = (results[sizeMm] || 0) + (success ? 1 : 0);
            
            // If they are accurate at this size (>= 2/3), we found their size!
            // Smallest accurate size is best for vocabulary density.
            if (finalSuccessCount >= 2) {
                finishCalibration(sizeMm);
            } else if (phase < SIZES.length) {
                // Try next larger size
                setPhase(phase + 1);
                setAttempts(0);
                setTargetPos(getRandomPos());
            } else {
                // Even failed the largest size, use largest
                finishCalibration(SIZES[SIZES.length - 1]);
            }
        } else {
            setAttempts(nextAttempt);
            setTargetPos(getRandomPos());
        }
    };

    const finishCalibration = (sizeMm) => {
        updateAccessProfile({ targetSize: sizeMm });
        
        // Also map to legacy grid-size for compatibility
        let gridSize = 'standard';
        if (sizeMm <= 10) gridSize = 'dense';
        else if (sizeMm <= 12) gridSize = 'medium';
        else if (sizeMm <= 15) gridSize = 'standard';
        else if (sizeMm <= 18) gridSize = 'big';
        else gridSize = 'super-big';
        
        localStorage.setItem('kiwi-grid-size', gridSize);
        onComplete();
    };

    const getTargetPx = () => {
        if (phase === 0) return 0;
        return getPxFromMm(SIZES[phase - 1]);
    };

    const getButtonLabel = () => {
        const labels = ["🍎", "🍪", "🍬", "🍇", "🍓"];
        return labels[phase - 1] || "";
    };

    if (phase === 0) {
        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'var(--bg-color)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '1.25rem', textAlign: 'center', zIndex: 1200
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🎯</div>
                <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem', color: 'var(--text-primary)' }}>Touch Assessment</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.875rem', maxWidth: '18.75rem', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    We&apos;ll check your touch accuracy to set the best button size for you.
                </p>
                <button
                    onClick={() => handleTap(true)}
                    className="primary-button"
                    style={{
                        padding: '1rem 2.5rem', fontSize: '1.25rem', minHeight: '4rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    Start Game
                </button>
            </div>
        );
    }

    const sizePx = getTargetPx();

    return (
        <div 
            style={{
                position: 'fixed', inset: 0, background: 'var(--bg-color)',
                zIndex: 1200, overflow: 'hidden'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    handleTap(false);
                }
            }}
        >
            <div style={{ 
                position: 'absolute', top: '1.25rem', width: '100%', 
                textAlign: 'center', color: 'var(--text-primary)', 
                fontSize: '1.25rem', fontWeight: 'bold' 
            }}>
                Tap the picture! {attempts + 1}/{MAX_ATTEMPTS}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleTap(true);
                }}
                style={{
                    position: 'absolute',
                    left: `${targetPos.x}%`,
                    top: `${targetPos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${sizePx}px`,
                    height: `${sizePx}px`,
                    borderRadius: '1.25rem',
                    background: 'var(--card-bg)',
                    border: '4px solid var(--primary)',
                    boxShadow: '0 0.75rem 1.25rem rgba(0,0,0,0.15)',
                    fontSize: `${sizePx * 0.6}px`,
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
