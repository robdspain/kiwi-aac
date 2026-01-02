import React, { useState } from 'react';

const VisualSchedule = ({ folder, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = folder.contents || [];

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleReset = () => {
        setCurrentIndex(0);
    };

    const currentItem = items[currentIndex];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '20px',
            gap: '20px'
        }}>
            <div role="status" aria-live="polite" style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: '0'
            }}>
                {currentIndex === items.length - 1 ? 'Schedule finished!' : `Step ${currentIndex + 1} of ${items.length}: ${currentItem?.word}`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <button onClick={onBack} style={{ padding: '10px 15px', borderRadius: '10px', background: '#E5E5EA', border: 'none', cursor: 'pointer' }}>
                    ← Back
                </button>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{folder.word}</div>
                <button onClick={handleReset} style={{ padding: '10px 15px', borderRadius: '10px', background: '#E5E5EA', border: 'none', cursor: 'pointer' }}>
                    Reset
                </button>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px'
            }}>
                {currentItem ? (
                    <>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '20%',
                            background: currentItem.bgColor || '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '6rem',
                            overflow: 'hidden',
                            border: '4px solid #007AFF',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}>
                            {typeof currentItem.icon === 'string' && (currentItem.icon.startsWith('/') || currentItem.icon.startsWith('data:') || currentItem.icon.includes('.')) ? (
                                <img src={currentItem.icon} alt={currentItem.word} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                currentItem.icon
                            )}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{currentItem.word}</div>
                    </>
                ) : (
                    <div>No items in this schedule</div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                        padding: '15px 30px',
                        borderRadius: '15px',
                        background: '#E5E5EA',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: currentIndex === 0 ? 'default' : 'pointer',
                        opacity: currentIndex === 0 ? 0.5 : 1
                    }}
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === items.length - 1}
                    style={{
                        padding: '15px 30px',
                        borderRadius: '15px',
                        background: '#007AFF',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: currentIndex === items.length - 1 ? 'default' : 'pointer',
                        opacity: currentIndex === items.length - 1 ? 0.5 : 1
                    }}
                >
                    {currentIndex === items.length - 1 ? 'Finished!' : 'Next'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                {items.map((_, i) => (
                    <div key={i} style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: i === currentIndex ? '#007AFF' : '#D1D1D6'
                    }} />
                ))}
            </div>
        </div>
    );
};

export default VisualSchedule;
