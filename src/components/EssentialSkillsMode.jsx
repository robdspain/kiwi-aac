import { useState } from 'react';

const EssentialSkillsMode = ({ onExit, sensitivity = 0.4, onLogEvent }) => {
    // Steps: 'request', 'denial', 'tolerance', 'cooperation', 'reward'
    // For MVP we implement: Request -> (Chance of Denial) -> Tolerance -> Reward
    const [step, setStep] = useState('request');
    const [toleranceEnabled, setToleranceEnabled] = useState(false);

    const handleRequest = () => {
        onLogEvent('fcr_attempt');

        if (!toleranceEnabled) {
            triggerReward("Yes! My way!");
            return;
        }

        // eslint-disable-next-line react-hooks/purity
        const isDenial = Math.random() < sensitivity;
        if (isDenial) {
            setStep('denial');
            onLogEvent('denial_presented');
        } else {
            triggerReward("Yes! My way!");
        }
    };

    const handleTolerance = () => {
        onLogEvent('tolerance_success');
        triggerReward("Good saying okay!");
    };

    const triggerReward = (msg) => {
        setStep('reward');
        const synth = window.speechSynthesis;
        if (synth) {
            const u = new SpeechSynthesisUtterance(msg);
            synth.speak(u);
        }

        document.body.classList.add('success-flash');

        setTimeout(() => {
            document.body.classList.remove('success-flash');
            setStep('request');
        }, 2000);
    };

    return (
        <div className="essential-mode-container" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh',
            background: '#F2F2F7', zIndex: 200, display: 'flex', flexDirection: 'column'
        }}>
            {/* Header / Controls */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onExit} style={{ background: '#636E72', color: 'var(--primary-text)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }}>
                    Exit Mode
                </button>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Tolerance Training ({toleranceEnabled ? 'ON' : 'OFF'})</span>
                    <div
                        onClick={() => setToleranceEnabled(!toleranceEnabled)}
                        style={{
                            width: '50px', height: '30px', background: toleranceEnabled ? 'var(--success)' : '#E5E5EA',
                            borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                        }}
                    >
                        <div style={{
                            width: '26px', height: '26px', background: 'white', borderRadius: '50%',
                            position: 'absolute', top: '2px', left: toleranceEnabled ? '22px' : '2px',
                            transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                </div>
            </div>

            {/* Main Interaction Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

                {step === 'request' && (
                    <button
                        onClick={handleRequest}
                        className="pulse-animation"
                        style={{
                            width: '300px', height: '300px', borderRadius: '50%', border: 'none',
                            background: 'var(--btn-blue-bg)',
                            color: 'var(--btn-blue-text)', fontSize: '3rem', fontWeight: 'bold',
                            boxShadow: '0 10px 30px rgba(0,122,255,0.4)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <span>🙋</span>
                        <span>My Way</span>
                    </button>
                )}

                {step === 'denial' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>✋</div>
                        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Not right now...</h2>

                        <button
                            onClick={() => setStep('tolerance')}
                            style={{
                                marginTop: '40px',
                                padding: '20px 60px',
                                fontSize: '2rem',
                                background: 'var(--warning)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                boxShadow: '0 5px 15px rgba(255,149,0,0.4)'
                            }}
                        >
                            Okay 👌
                        </button>
                    </div>
                )}

                {step === 'tolerance' && (
                    <div style={{ textAlign: 'center', animation: 'zoomIn 0.3s' }}>
                        <button
                            onClick={handleTolerance}
                            style={{
                                width: '300px', height: '300px', borderRadius: '50%', border: 'none',
                                background: 'var(--success)',
                                color: 'white', fontSize: '3rem', fontWeight: 'bold',
                                boxShadow: '0 10px 30px rgba(52,199,89,0.4)'
                            }}
                        >
                            Good Job!
                        </button>
                    </div>
                )}

                {step === 'reward' && (
                    <div style={{
                        animation: 'zoomIn 0.5s',
                        fontSize: '10rem',
                        textShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    }}>
                        🎉
                    </div>
                )}

            </div>

            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Essential Skills Mode • Based on Dr. Hanley&apos;s SBT
            </div>
        </div>
    );
};

export default EssentialSkillsMode;