

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

                {/* Guided Access Illustration */}
                <div style={{
                    margin: '0 auto 30px auto',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/images/guided-access.png"
                        alt="Guided Access Instructions"
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    />
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
