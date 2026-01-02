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
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            animation: 'slideUp 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
        }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📱</div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>Install Kiwi Voice</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                Install this app on your home screen for a full-screen experience and quick access.
            </p>
            
            <div style={{ 
                background: '#F2F2F7', 
                padding: '15px', 
                borderRadius: '16px', 
                width: '100%',
                textAlign: 'left',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ 
                        width: '24px', height: '24px', background: '#007AFF', color: 'white', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold'
                    }}>1</div>
                    <span style={{ fontSize: '0.9rem' }}>Tap the <strong>Share</strong> button <span style={{ fontSize: '1.2rem' }}>⎋</span> below.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                        width: '24px', height: '24px', background: '#007AFF', color: 'white', 
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold'
                    }}>2</div>
                    <span style={{ fontSize: '0.9rem' }}>Select <strong>Add to Home Screen</strong> <span style={{ fontSize: '1.2rem' }}>⊞</span>.</span>
                </div>
            </div>

            <button 
                onClick={handleClose}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
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
