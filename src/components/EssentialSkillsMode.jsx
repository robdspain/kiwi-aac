import { useState } from 'react';

const EssentialSkillsMode = ({ onExit, sensitivity = 0.4, onLogEvent }) => {
    // Steps: 'request', 'denial', 'tolerance', 'cooperation', 'reward'
    const [step, setStep] = useState('request');
    const [toleranceEnabled, setToleranceEnabled] = useState(false);
    const [cooperationEnabled, setCooperationEnabled] = useState(false);
    const [cabLevel, setCabLevel] = useState(1); // 1, 2, or 3 tasks

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
        if (cooperationEnabled) {
            setStep('cooperation');
        } else {
            triggerReward("Good saying okay!");
        }
    };

    const handleCooperation = () => {
        onLogEvent('cooperation_success');
        triggerReward("Great job working!");
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
            background: 'linear-gradient(135deg, rgba(242,242,247,0.8), rgba(255,255,255,0.8))',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            zIndex: 200, display: 'flex', flexDirection: 'column'
        }}>
            {/* Header / Controls */}
            <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
                <button onClick={onExit} style={{ background: '#636E72', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '800' }}>
                    Exit
                </button>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999', marginBottom: '4px' }}>TOLERANCE</div>
                        <div
                            onClick={() => setToleranceEnabled(!toleranceEnabled)}
                            style={{
                                width: '44px', height: '24px', background: toleranceEnabled ? 'var(--success)' : '#E5E5EA',
                                borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px', left: toleranceEnabled ? '22px' : '2px',
                                transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }} />
                        </div>
                    </div>

                    {toleranceEnabled && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#999', marginBottom: '4px' }}>WORK (CABs)</div>
                            <div
                                onClick={() => setCooperationEnabled(!cooperationEnabled)}
                                style={{
                                    width: '44px', height: '24px', background: cooperationEnabled ? '#5856D6' : '#E5E5EA',
                                    borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                <div style={{
                                    width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                                    position: 'absolute', top: '2px', left: cooperationEnabled ? '22px' : '2px',
                                    transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Interaction Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

                {step === 'request' && (
                    <button
                        onClick={handleRequest}
                        className="pulse-animation"
                        style={{
                            width: '280px', height: '280px', borderRadius: '40px', border: 'none',
                            background: '#007AFF',
                            color: 'white', fontSize: '2.5rem', fontWeight: '900',
                            boxShadow: '0 20px 40px rgba(0,122,255,0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px'
                        }}
                    >
                        <span style={{ fontSize: '5rem' }}>🙋‍♂️</span>
                        <span>MY WAY</span>
                    </button>
                )}

                {step === 'denial' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                        <div style={{ fontSize: '8rem', marginBottom: '20px', animation: 'shake 0.5s ease-in-out' }}>✋</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1D1D1F' }}>Not right now...</h2>
                        <p style={{ color: '#86868B', fontWeight: 600 }}>Can you say okay?</p>

                        <button
                            onClick={() => setStep('tolerance')}
                            style={{
                                marginTop: '40px',
                                padding: '25px 60px',
                                fontSize: '2rem',
                                background: '#FF9500',
                                color: 'white',
                                border: 'none',
                                borderRadius: '24px',
                                fontWeight: '900',
                                boxShadow: '0 10px 30px rgba(255,149,0,0.3)'
                            }}
                        >
                            OKAY 👌
                        </button>
                    </div>
                )}

                {step === 'tolerance' && (
                    <div style={{ textAlign: 'center', animation: 'zoomIn 0.3s' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌟</div>
                        <button
                            onClick={handleTolerance}
                            style={{
                                width: '280px', height: '280px', borderRadius: '40px', border: 'none',
                                background: '#34C759',
                                color: 'white', fontSize: '2.2rem', fontWeight: '900',
                                boxShadow: '0 20px 40px rgba(52,199,89,0.3)'
                            }}
                        >
                            GOOD <br />SAYING OKAY!
                        </button>
                    </div>
                )}

                {step === 'cooperation' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                        <div style={{ fontSize: '6rem', marginBottom: '20px' }}>🧩</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1D1D1F' }}>Let&apos;s do some work!</h2>
                        <p style={{ color: '#86868B', fontWeight: 600, marginBottom: '30px' }}>Complete your tasks to get My Way</p>

                        <button
                            onClick={handleCooperation}
                            style={{
                                width: '280px', height: '200px', borderRadius: '40px', border: 'none',
                                background: '#5856D6',
                                color: 'white', fontSize: '2rem', fontWeight: '900',
                                boxShadow: '0 20px 40px rgba(88,86,214,0.3)'
                            }}
                        >
                            I&apos;M ALL DONE! ✅
                        </button>
                    </div>
                )}

                {step === 'reward' && (
                    <div style={{
                        animation: 'zoomIn 0.5s',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '10rem', textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>🎉</div>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#34C759', marginTop: '20px' }}>YES!</h2>
                    </div>
                )}

            </div>

            <div style={{ padding: '30px', textAlign: 'center', color: '#86868B', fontSize: '0.8rem', fontWeight: 600 }}>
                ESSENTIAL SKILLS MODE • PFA/SBT FLOW
            </div>
        </div>
    );
};

export default EssentialSkillsMode;