import React from 'react';

const SplashScreen = ({ onComplete }) => {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'linear-gradient(135deg, #4ECDC4 0%, #45B7AF 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', zIndex: 99999,
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '20px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>🥝</div>
                                <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>Kiwi Voice</h1>            <div style={{
                marginTop: '20px',
                width: '40px',
                height: '4px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div className="splash-loader" />
            </div>
            <style>{`
                @keyframes splash-load {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .splash-loader {
                    width: 100%;
                    height: 100%;
                    background: white;
                    animation: splash-load 1.5s infinite ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
