import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

// Grid size configurations - ordered from smallest to largest animals
const GRID_SIZES = [
    { id: '2x2', icon: '🐜', label: '10mm', animal: 'ant', gridSize: 'dense', targetSize: 10 },
    { id: '3x3', icon: '🐈', label: '12mm', animal: 'cat', gridSize: 'medium', targetSize: 12 },
    { id: '4x4', icon: '🐕', label: '15mm', animal: 'dog', gridSize: 'standard', targetSize: 15 },
    { id: '5x5', icon: '🦒', label: '18mm', animal: 'giraffe', gridSize: 'big', targetSize: 18 },
    { id: '6x6', icon: '🐘', label: '22mm', animal: 'elephant', gridSize: 'super-big', targetSize: 22 }
];

const TouchCalibration = ({ onComplete, onBack }) => {
    const { updateAccessProfile } = useProfile();
    const [selectedSize, setSelectedSize] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleSizeSelect = (sizeConfig) => {
        setSelectedSize(sizeConfig.id);

        // Use target size directly from config
        const targetSize = sizeConfig.targetSize || 15;

        // Update access profile with target size
        updateAccessProfile({ targetSize });

        // Also save grid size for legacy compatibility
        localStorage.setItem('kiwi-grid-size', sizeConfig.gridSize);

        // Complete after a brief delay for visual feedback
        setTimeout(() => {
            onComplete();
        }, 300);
    };

    const handleTestSize = () => {
        if (selectedSize) {
            setShowPreview(true);
        }
    };

    const selectedConfig = GRID_SIZES.find(s => s.id === selectedSize);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'var(--bg-color)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', textAlign: 'center', zIndex: 1200
        }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>☝️</div>
                <h1 style={{
                    marginBottom: '0.5rem',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)'
                }}>
                    Touch Calibration
                </h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    maxWidth: '22rem',
                    margin: '0 auto'
                }}>
                    Choose the grid layout that feels most comfortable to tap
                </p>
            </div>

            {/* Grid Layout Section */}
            <div style={{
                background: '#F2F2F7',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                width: '100%',
                maxWidth: '28rem',
                marginBottom: '1rem'
            }}>
                <h2 style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#8E8E93',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '1rem'
                }}>
                    GRID LAYOUT
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.5rem'
                }}>
                    {GRID_SIZES.map(size => (
                        <button
                            key={size.id}
                            onClick={() => setSelectedSize(size.id)}
                            style={{
                                background: selectedSize === size.id ? '#1A535C' : 'white',
                                border: selectedSize === size.id ? '3px solid #1A535C' : '1px solid #E5E5EA',
                                borderRadius: '1rem',
                                padding: '1rem 0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.375rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                minHeight: '6rem',
                                boxShadow: selectedSize === size.id
                                    ? '0 4px 12px rgba(26, 83, 92, 0.2)'
                                    : '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            <span style={{
                                fontSize: '2rem',
                                filter: selectedSize === size.id ? 'grayscale(0%)' : 'grayscale(20%)'
                            }}>
                                {size.icon}
                            </span>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: selectedSize === size.id ? 'white' : '#2D3436'
                            }}>
                                {size.label}
                            </span>
                        </button>
                    ))}
                </div>

                <p style={{
                    fontSize: '0.75rem',
                    color: '#8E8E93',
                    marginTop: '1rem',
                    lineHeight: '1.4'
                }}>
                    💡 Smaller targets (🐜 10mm) show more words but require more precision. Larger targets (🐘 22mm) have bigger buttons but fewer words visible.
                </p>
            </div>

            {/* Test Size Button - Prominent when size selected */}
            {selectedSize && (
                <button
                    onClick={handleTestSize}
                    className="primary-button"
                    style={{
                        width: '100%',
                        maxWidth: '28rem',
                        marginBottom: '1rem',
                        minHeight: '3.5rem',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <span style={{ fontSize: '1.3rem' }}>👆</span>
                    Test {selectedConfig?.label} Size
                </button>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '28rem' }}>
                {onBack && (
                    <button
                        onClick={onBack}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#007AFF',
                            fontSize: '1rem',
                            fontWeight: 600,
                            padding: '0.75rem',
                            cursor: 'pointer'
                        }}
                    >
                        ← Back
                    </button>
                )}
                <button
                    onClick={selectedSize ? () => handleSizeSelect(selectedConfig) : onComplete}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#007AFF',
                        fontSize: '1rem',
                        fontWeight: 600,
                        padding: '0.75rem',
                        cursor: 'pointer'
                    }}
                >
                    {selectedSize ? 'Confirm & Continue →' : 'Skip for now'}
                </button>
            </div>

            {/* Preview Modal */}
            {showPreview && selectedConfig && (
                <div
                    onClick={() => setShowPreview(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 1300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                    }}
                >
                    <div style={{
                        background: 'var(--bg-color)',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '0.5rem',
                            textAlign: 'center'
                        }}>
                            {selectedConfig.icon} {selectedConfig.label} Preview
                        </h2>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            This is how buttons will look on your device
                        </p>

                        {/* Sample Grid Preview */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${selectedConfig.gridSize === 'super-big' ? 2 : selectedConfig.gridSize === 'big' ? 3 : selectedConfig.gridSize === 'standard' ? 4 : selectedConfig.gridSize === 'medium' ? 5 : 6}, 1fr)`,
                            gap: '0.75rem',
                            marginBottom: '1.5rem',
                            width: '100%'
                        }}>
                            {['Play', 'Snack', 'More', 'Help', 'Yes', 'No'].slice(0, selectedConfig.gridSize === 'super-big' ? 4 : 6).map((word, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: 'var(--card-bg)',
                                        border: '2px solid var(--gray-border)',
                                        borderRadius: '1rem',
                                        aspectRatio: '1',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <span style={{ fontSize: '2rem' }}>
                                        {i === 0 ? '🏃' : i === 1 ? '🥨' : i === 2 ? '➕' : i === 3 ? '🆘' : i === 4 ? '✅' : '❌'}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)'
                                    }}>
                                        {word}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: '#FFF3CD',
                            border: '1px solid #FFE69C',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            width: '100%'
                        }}>
                            <p style={{
                                fontSize: '0.85rem',
                                color: '#664D03',
                                margin: 0,
                                lineHeight: 1.4
                            }}>
                                <strong>💡 Tip:</strong> Try tapping the sample buttons above to test if {selectedConfig.label} feels comfortable for you!
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                            <button
                                onClick={() => setShowPreview(false)}
                                style={{
                                    flex: 1,
                                    background: 'var(--card-bg)',
                                    border: '2px solid var(--gray-border)',
                                    borderRadius: '1rem',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    minHeight: '3.5rem'
                                }}
                            >
                                Try Different Size
                            </button>
                            <button
                                onClick={() => {
                                    setShowPreview(false);
                                    handleSizeSelect(selectedConfig);
                                }}
                                className="primary-button"
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    minHeight: '3.5rem'
                                }}
                            >
                                Looks Good! Continue →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TouchCalibration;
