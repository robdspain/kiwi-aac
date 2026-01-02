const GuidedAccessModal = ({ onClose }) => {
    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="ios-sheet-header">
                    <div style={{ width: '50px' }}></div>
                    <h2 className="ios-sheet-title">Guided Access</h2>
                    <button className="ios-done-button" onClick={onClose}>Done</button>
                </div>
                
                <div className="ios-sheet-content" style={{ textAlign: 'center', background: '#F2F2F7' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333' }}>Lock Screen (iOS)</h3>
                    <p style={{ color: '#666', lineHeight: '1.5', marginBottom: '25px', fontSize: '15px' }}>
                        Keep your child focused by locking the app on screen using <strong>Guided Access</strong>.
                    </p>

                    <div style={{ margin: '0 auto 20px auto' }}>
                        <img
                            src="/images/guided-access.png"
                            alt="Guided Access Instructions"
                            style={{
                                width: '100%',
                                maxWidth: '280px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>

                    <div className="ios-setting-card">
                        <div className="ios-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#007AFF', fontWeight: 700 }}>1</span> <span>Open this app to the screen you want.</span></div>
                            <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#007AFF', fontWeight: 700 }}>2</span> <span><strong>Triple-click</strong> the side button.</span></div>
                            <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#007AFF', fontWeight: 700 }}>3</span> <span>Tap <strong>Start</strong> in the corner.</span></div>
                        </div>
                    </div>

                    <div className="ios-setting-card">
                        <div className="ios-row" style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                            Note: If nothing happens, go to Settings &gt; Accessibility &gt; Guided Access to turn it on first.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidedAccessModal;