

const SentenceStrip = ({ stripItems = [], onClear, onPlay, onDeleteItem }) => {
    return (
        <div id="strip-container">
            <div id="sentence-strip">
                <div className="strip-wrapper" id="strip-content">
                    {stripItems.length === 0 ? (
                        <span className="strip-placeholder">
                            Tap icons to build a sentence
                        </span>
                    ) : (
                        stripItems.map((item, index) => (
                            <div 
                                key={`${item.id}-${index}`} 
                                className="strip-item"
                                onClick={() => onDeleteItem && onDeleteItem(index)}
                            >
                                <div className="strip-icon-wrapper">
                                    {typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? (
                                        <img src={item.icon} alt={item.word} className="strip-img" />
                                    ) : (
                                        <span className="strip-emoji">{item.icon}</span>
                                    )}
                                </div>
                                <span className="strip-label">{item.word}</span>
                                <div className="strip-item-remove">✕</div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="strip-actions">
                    <button 
                        className="strip-action-btn speak-btn" 
                        onClick={onPlay}
                        disabled={stripItems.length === 0}
                        aria-label="Speak sentence"
                    >
                        🗣️
                    </button>
                    <button 
                        className="strip-action-btn clear-btn" 
                        onClick={onClear}
                        disabled={stripItems.length === 0}
                        aria-label="Clear sentence"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SentenceStrip;
