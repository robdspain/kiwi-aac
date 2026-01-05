import React from 'react';

const VoiceSetupModal = ({ isOpen, onClose, onRefresh, isRefreshing, isIOS }) => {
    if (!isOpen) return null;

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                {/* iOS Standard Header */}
                <div className="ios-sheet-header" style={{ borderBottom: '1px solid #E5E5EA', paddingBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '60px' }}></div>
                    <h2 className="ios-sheet-title" style={{ fontSize: '1.0625rem', fontWeight: 600, margin: 0 }}>
                        Better Voice Quality
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '6px 16px',
                            background: '#E5E5EA',
                            color: '#000',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Close
                    </button>
                </div>

                {/* Clean, Zen Content */}
                <div className="ios-sheet-content" style={{
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.75rem',
                    alignItems: 'center'
                }}>

                    {/* Simple Icon Header */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '0.75rem',
                            filter: 'grayscale(20%)'
                        }}>
                            🎙️
                        </div>
                        <h3 style={{
                            margin: '0 0 0.5rem 0',
                            color: '#2D3436',
                            fontSize: '1.25rem',
                            fontWeight: 700
                        }}>
                            Upgrade Your Voice
                        </h3>
                        <p style={{
                            margin: '0',
                            color: '#6C757D',
                            fontSize: '0.9375rem',
                            lineHeight: '1.5',
                            maxWidth: '20rem'
                        }}>
                            Download natural-sounding voices for clearer communication
                        </p>
                    </div>

                    {/* Clean Step-by-Step */}
                    <div style={{
                        width: '100%',
                        maxWidth: '24rem',
                        background: '#F8F9FA',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        border: '1px solid #E9ECEF'
                    }}>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: '#6C757D',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: '1rem'
                        }}>
                            How to Download
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            color: '#2D3436'
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    minWidth: '1.5rem',
                                    fontWeight: 700,
                                    color: '#007AFF'
                                }}>1</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Open Settings
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6C757D' }}>
                                        Go to your device Settings app
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    minWidth: '1.5rem',
                                    fontWeight: 700,
                                    color: '#007AFF'
                                }}>2</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Navigate to Voices
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6C757D' }}>
                                        {isIOS ? (
                                            <>Accessibility → Spoken Content → Voices</>
                                        ) : (
                                            <>Text-to-speech → Install voice data</>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <span style={{
                                    fontSize: '1.25rem',
                                    minWidth: '1.5rem',
                                    fontWeight: 700,
                                    color: '#007AFF'
                                }}>3</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Download Enhanced
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6C757D' }}>
                                        Look for "Enhanced" or "Premium" labels
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        style={{
                            width: '100%',
                            maxWidth: '24rem',
                            padding: '1rem 1.5rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: '#007AFF',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: isRefreshing ? 'default' : 'pointer',
                            opacity: isRefreshing ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'opacity 0.2s ease'
                        }}
                    >
                        {isRefreshing ? (
                            <>
                                <span style={{ fontSize: '1.25rem' }}>⏳</span>
                                Checking for voices...
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '1.25rem' }}>🔄</span>
                                Refresh Voice List
                            </>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default VoiceSetupModal;