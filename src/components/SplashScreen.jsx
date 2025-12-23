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
            <img 
                src="/icon-512.png" 
                alt="Kiwi AAC Logo"
                style={{
                    width: '160px',
                    height: '160px',
                    marginBottom: '20px',
                    borderRadius: '22%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    animation: 'bounceIn 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            />
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
        </div>
    );
};

export default SplashScreen;
