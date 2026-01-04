import { useState, useEffect } from 'react';

const A2HSModal = () => {
    // Detect if device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Detect if app is running in standalone mode (installed)
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

    const [show, setShow] = useState(() => {
        if (isIOS && !isStandalone) {
            const lastShown = localStorage.getItem('kiwi-a2hs-prompt-last');
            if (!lastShown) return true;
            return Date.now() - parseInt(lastShown) > 24 * 60 * 60 * 1000;
        }
        return false;
    });

    useEffect(() => {
        // State initialized above, but we could use this for complex listeners if needed
    }, []);

    const handleClose = () => {
        setShow(false);
        localStorage.setItem('kiwi-a2hs-prompt-last', Date.now().toString());
    };

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.25rem',
            left: '1.25rem',
            right: '1.25rem',
            background: 'var(--card-bg)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            boxShadow: '0 0.75rem 2.5rem rgba(0,0,0,0.2)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            animation: 'slideUp 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
        }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.9375rem' }}>📱</div>
            <h2 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Install Kiwi Voice</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.25rem 0' }}>
                Install this app on your home screen for a full-screen experience and quick access.
            </p>
            
            <div style={{ 
                background: 'var(--gray-light)', 
                padding: '0.9375rem', 
                borderRadius: '1rem', 
                width: '100%',
                textAlign: 'left',
                marginBottom: '1.25rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ 
                        width: '1.5rem', height: '1.5rem', background: 'var(--primary-dark)', color: 'var(--primary-text)', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 'bold'
                    }}>1</div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Tap the <strong>Share</strong> button <span style={{ fontSize: '1.2rem' }}>⎋</span> below.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                        width: '1.5rem', height: '1.5rem', background: 'var(--primary-dark)', color: 'var(--primary-text)', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 'bold'
                    }}>2</div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Select <strong>Add to Home Screen</strong> <span style={{ fontSize: '1.2rem' }}>⊞</span>.</span>
                </div>
            </div>

            <button 
                onClick={handleClose}
                className="apple-blue-button"
                style={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    minHeight: '3.5rem',
                    marginTop: '0.5rem'
                }}
            >
                Got it
            </button>

            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default A2HSModal;
