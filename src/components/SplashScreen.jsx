import React from 'react';

const SplashScreen = ({ onComplete }) => {
    React.useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: '#4ECDC4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '2rem', fontWeight: 'bold'
        }}>
            Kiwi AAC
        </div>
    );
};

export default SplashScreen;
