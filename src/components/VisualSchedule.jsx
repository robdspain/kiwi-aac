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
        <div className="visual-schedule-container" style={{ transition: 'var(--transition-zen)' }}>
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
            <div className="visual-schedule-header">
                <button onClick={onBack} style={{ padding: '10px 15px', borderRadius: '10px', background: '#E5E5EA', border: 'none', cursor: 'pointer' }}>
                    ← Back
                </button>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{folder.word}</div>
                <button onClick={handleReset} style={{ padding: '10px 15px', borderRadius: '10px', background: '#E5E5EA', border: 'none', cursor: 'pointer' }}>
                    Reset
                </button>
            </div>

            <div className="visual-schedule-content">
                {currentItem ? (
                    <>
                        <div className="visual-schedule-item-display" style={{
                            background: currentItem.bgColor || '#f0f0f0'
                        }}>
                            {typeof currentItem.icon === 'string' && (currentItem.icon.startsWith('/') || currentItem.icon.startsWith('data:') || currentItem.icon.includes('.')) ? (
                                <img src={currentItem.icon} alt={currentItem.word} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                currentItem.icon
                            )}
                        </div>
                        <div className="visual-schedule-label">{currentItem.word}</div>
                    </>
                ) : (
                    <div>No items in this schedule</div>
                )}
            </div>

            <div className="visual-schedule-controls">
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
                    className="primary"
                    style={{
                        padding: '15px 30px',
                        borderRadius: '15px',
                        fontSize: '1.2rem',
                        cursor: currentIndex === items.length - 1 ? 'default' : 'pointer',
                        opacity: currentIndex === items.length - 1 ? 0.5 : 1
                    }}
                >
                    {currentIndex === items.length - 1 ? 'Finished!' : 'Next'}
                </button>
            </div>

            <div className="visual-schedule-progress">
                {items.map((_, i) => (
                    <div key={i} className={`visual-schedule-dot ${i === currentIndex ? 'active' : 'inactive'}`} />
                ))}
            </div>
        </div>
    );
};

export default VisualSchedule;
