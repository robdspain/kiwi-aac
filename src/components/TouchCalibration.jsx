import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

// Grid size configurations matching the image
const GRID_SIZES = [
    { id: '2x2', icon: '🐘', label: '2×2', animal: 'elephant', gridSize: 'super-big' },
    { id: '3x3', icon: '🦒', label: '3×3', animal: 'giraffe', gridSize: 'big' },
    { id: '4x4', icon: '🐕', label: '4×4', animal: 'dog', gridSize: 'standard' },
    { id: '5x5', icon: '🐈', label: '5×5', animal: 'cat', gridSize: 'medium' },
    { id: '6x6', icon: '🐜', label: '6×6', animal: 'ant', gridSize: 'dense' }
];

const TouchCalibration = ({ onComplete }) => {
    const { updateAccessProfile } = useProfile();
    const [selectedSize, setSelectedSize] = useState(null);

    const handleSizeSelect = (sizeConfig) => {
        setSelectedSize(sizeConfig.id);

        // Map grid size to target size in mm
        const targetSizeMap = {
            'super-big': 22,
            'big': 18,
            'standard': 15,
            'medium': 12,
            'dense': 10
        };

        const targetSize = targetSizeMap[sizeConfig.gridSize] || 15;

        // Update access profile with target size
        updateAccessProfile({ targetSize });

        // Also save grid size for legacy compatibility
        localStorage.setItem('kiwi-grid-size', sizeConfig.gridSize);

        // Complete after a brief delay for visual feedback
        setTimeout(() => {
            onComplete();
        }, 300);
    };

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
                    Redo Touch Calibration
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
                            onClick={() => handleSizeSelect(size)}
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
                    💡 Larger grids (🐘 2×2) have bigger buttons but fewer words visible. Smaller grids (🐜 6×6) show more words but require more precision.
                </p>
            </div>

            {/* Skip Button */}
            <button
                onClick={onComplete}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#007AFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.75rem',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                }}
            >
                Skip for now
            </button>
        </div>
    );
};

export default TouchCalibration;
