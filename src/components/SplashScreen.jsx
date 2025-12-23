import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Start fading out slightly before completion
        const fadeTimer = setTimeout(() => setFade(true), 1500);
        const completionTimer = setTimeout(onComplete, 2000);
        
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', // Dark premium background
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            transition: 'opacity 0.8s ease',
            opacity: fade ? 0 : 1,
            pointerEvents: 'none'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'bounceIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* Glow Effect */}
                <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'var(--primary)',
                    filter: 'blur(60px)',
                    opacity: 0.4,
                    borderRadius: '50%',
                    zIndex: -1
                }} />

                <img 
                    src="/icon-512.png" 
                    alt="Kiwi AAC Logo"
                    style={{
                        width: '140px',
                        height: '140px',
                        marginBottom: '30px',
                        borderRadius: '28%',
                        boxShadow: '0 0 40px rgba(78, 205, 196, 0.3)',
                    }}
                />
                
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    color: 'white',
                    margin: 0,
                    letterSpacing: '-2px',
                    textTransform: 'uppercase',
                    textShadow: '0 0 20px rgba(78, 205, 196, 0.5)'
                }}>
                    Kiwi AAC
                </h1>

                {/* Progress Bar like in the reference image */}
                <div style={{
                    width: '240px',
                    height: '6px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    marginTop: '40px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '100%',
                        background: 'var(--primary)',
                        animation: 'loading 2s ease-in-out'
                    }} />
                </div>
                
                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '15px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '1px'
                }}>
                    INITIALIZING EXPERIENCE...
                </p>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
