import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        // Remove the static splash screen from index.html if it exists
        const staticSplash = document.getElementById('static-splash');
        if (staticSplash) {
            staticSplash.remove();
        }

        // Start fading out slightly before completion
        const fadeTimer = setTimeout(() => setFade(true), 800);
        const completionTimer = setTimeout(onComplete, 1000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    return (
        <div 
            onClick={onComplete}
            style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)', // Dark premium background
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            transition: 'opacity 0.2s ease',
            opacity: fade ? 0 : 1,
            pointerEvents: 'auto',
            cursor: 'pointer'
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'bounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
                    alt="Kiwi Voice Logo"
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
                    Kiwi Voice
                </h1>

                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '15px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    letterSpacing: '1px'
                }}>
                    INITIALIZING...
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
