import React, { useState } from 'react';

const COMMON_REINFORCERS = [
    { id: 'play', label: 'Play', icon: '🏃' },
    { id: 'my-turn', label: 'My Turn', icon: '🙋' },
    { id: 'snack', label: 'Snack', icon: '🥨' },
    { id: 'mom', label: 'Mom', icon: '👩' },
    { id: 'dad', label: 'Dad', icon: '👨' },
    { id: 'toy', label: 'Toy', icon: '🧸' }
];

const FavoritesPicker = ({ onComplete }) => {
    const [selected, setSelected] = useState([]);

    const toggleItem = (item) => {
        if (selected.find(i => i.id === item.id)) {
            setSelected(selected.filter(i => i.id !== item.id));
        } else {
            if (selected.length < 3) {
                setSelected([...selected, item]);
            }
        }
    };

    const handleContinue = () => {
        // Pass the selected items back
        onComplete(selected);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'linear-gradient(135deg, #FDF8F3, #F5F0EB)',
            zIndex: 1100,
            display: 'flex', flexDirection: 'column',
            padding: '24px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>❤️</div>
                <h1 style={{ fontSize: '1.8rem', color: '#2D3436', marginBottom: '8px' }}>
                    What do they love?
                </h1>
                <p style={{ color: '#636E72', lineHeight: 1.4 }}>
                    Select up to 3 favorite things. We'll put these on the home screen so they can request them immediately!
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                overflowY: 'auto',
                padding: '4px'
            }}>
                {COMMON_REINFORCERS.map(item => {
                    const isSelected = !!selected.find(i => i.id === item.id);
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleItem(item)}
                            style={{
                                background: isSelected ? '#4ECDC4' : 'white',
                                border: isSelected ? '2px solid #3DB8B0' : '2px solid #E5E5EA',
                                borderRadius: '16px',
                                padding: '16px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: isSelected ? '0 4px 12px rgba(78, 205, 196, 0.4)' : 'none'
                            }}
                        >
                            <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: isSelected ? 'white' : '#636E72'
                            }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button
                    onClick={handleContinue}
                    disabled={selected.length === 0}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: selected.length > 0
                            ? 'linear-gradient(135deg, #4ECDC4, #3DB8B0)'
                            : '#E5E5EA',
                        color: selected.length > 0 ? 'white' : '#A0A0A0',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: selected.length > 0 ? 'pointer' : 'default',
                        boxShadow: selected.length > 0 ? '0 6px 20px rgba(78, 205, 196, 0.3)' : 'none'
                    }}
                >
                    {selected.length === 0 ? 'Select at least 1' : `Continue (${selected.length})`}
                </button>
                
                <button
                    onClick={() => onComplete([])} // Skip
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#999',
                        fontSize: '0.9rem',
                        marginTop: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
};

export default FavoritesPicker;
