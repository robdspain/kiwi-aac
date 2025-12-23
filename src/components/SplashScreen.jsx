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
            background: 'var(--bg-gradient)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            transition: 'opacity 0.5s ease',
            opacity: fade ? 0 : 1,
            pointerEvents: 'none'
        }}>
            <div style={{
                fontSize: '8rem',
                marginBottom: '20px',
                animation: 'bounceIn 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                🥝
            </div>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--primary)',
                margin: 0,
                letterSpacing: '-1px',
                animation: 'fadeIn 1s ease 0.3s both'
            }}>
                Kiwi AAC
            </h1>
            <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                marginTop: '10px',
                fontWeight: 600,
                animation: 'fadeIn 1s ease 0.6s both'
            }}>
                Communication Made Simple
            </p>
            
            {/* Loading dots */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '40px'
            }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        animation: `pulse 1s infinite ${i * 0.2}s`
                    }} />
                ))}
            </div>
        </div>
    );
};

export default SplashScreen;
