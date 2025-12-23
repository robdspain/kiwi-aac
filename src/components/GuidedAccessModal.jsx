import React from 'react';

const GuidedAccessModal = ({ onClose }) => {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 3000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '30px',
                width: '100%',
                maxWidth: '400px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#333' }}>Lock Screen (iOS)</h2>
                <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '25px' }}>
                    Keep your child focused by locking the app on screen using <strong>Guided Access</strong>.
                </p>

                {/* SVG Illustration */}
                <div style={{
                    margin: '0 auto 30px auto',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <svg width="200" height="260" viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Device Body */}
                        <rect x="40" y="10" width="120" height="240" rx="20" fill="#F5F5F7" stroke="#E5E5EA" strokeWidth="4"/>
                        {/* Screen */}
                        <rect x="50" y="20" width="100" height="220" rx="12" fill="white"/>
                        
                        {/* Side Button */}
                        <path d="M162 60H164C165.105 60 166 60.8954 166 62V98C166 99.1046 165.105 100 164 100H162V60Z" fill="#FF3B30"/>
                        
                        {/* 3x Click Indicator */}
                        <g filter="url(#shadow)">
                            <rect x="130" y="65" width="50" height="30" rx="8" fill="#FF3B30"/>
                            <text x="155" y="85" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">3x Click</text>
                        </g>
                        
                        {/* Tap Ripple Effect lines */}
                        <path d="M175 70C180 75 180 85 175 90" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                        <path d="M180 65C188 72 188 88 180 95" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>

                        <defs>
                            <filter id="shadow" x="120" y="60" width="70" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="4"/>
                                <feGaussianBlur stdDeviation="4"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.231373 0 0 0 0 0.188235 0 0 0 0.25 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                            </filter>
                        </defs>
                    </svg>
                </div>

                <div style={{ textAlign: 'left', background: '#F9F9F9', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                    <ol style={{ paddingLeft: '20px', margin: 0, color: '#444', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        <li>Open this app to the screen you want.</li>
                        <li><strong>Triple-click</strong> the side button (or Home button).</li>
                        <li>Tap <strong>Start</strong> in the corner.</li>
                    </ol>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', marginBottom: '20px' }}>
                    Note: If nothing happens, go to Settings &gt; Accessibility &gt; Guided Access to turn it on first.
                </p>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#007AFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    Got it
                </button>
            </div>
        </div>
    );
};

export default GuidedAccessModal;
