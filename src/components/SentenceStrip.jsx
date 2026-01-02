

const SentenceStrip = ({ stripItems, onClear, onPlay }) => {
    return (
        <div id="strip-container" style={{ display: 'block' }}>
            <div id="sentence-strip" onClick={onPlay}>
                <div className="strip-wrapper" id="strip-content">
                    {stripItems.length === 0 ? (
                        <span style={{ color: '#8E8E93', fontSize: '1rem', width: '100%', textAlign: 'center', lineHeight: '80px' }}>
                            Tap icons to build
                        </span>
                    ) : (
                        stripItems.map((item, index) => (
                            <span key={index} className="strip-icon">
                                {item.icon}
                            </span>
                        ))
                    )}
                </div>
                <button id="clear-btn" onClick={(e) => { e.stopPropagation(); onClear(); }}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default SentenceStrip;
