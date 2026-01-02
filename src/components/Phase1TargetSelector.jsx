

const Phase1TargetSelector = ({ onSelect, rootItems = [] }) => {
    // Filter for the recommended "multiple meaning" items
    const recommendedIds = ['play-generic', 'snack-generic', 'toy-generic', 'music', 'book'];
    
    // Find these items in rootItems, or fallback to creating them if missing
    const options = recommendedIds.map(id => {
        const found = Array.isArray(rootItems) ? rootItems.find(i => i.id === id) : null;
        if (found) return found;
        
        // Fallbacks if not found in root (e.g. customized)
        switch(id) {
            case 'play-generic': return { id: 'play-generic', word: "Play", icon: "🏃" };
            case 'snack-generic': return { id: 'snack-generic', word: "Snack", icon: "🥨" };
            case 'toy-generic': return { id: 'toy-generic', word: "Toy", icon: "🧸" };
            case 'music': return { id: 'music', word: "Music", icon: "🎵" };
            case 'book': return { id: 'book', word: "Book", icon: "📚" };
            default: return null;
        }
    }).filter(Boolean);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            zIndex: 1600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#2D3436', marginBottom: '10px' }}>Choose a Target Item</h1>
                <p style={{ fontSize: '1.1rem', color: '#636E72', marginBottom: '40px', lineHeight: 1.5 }}>
                    Pick one item that is highly motivating and can have multiple meanings (e.g. &quot;Play&quot; can mean tickles, chase, or ball).
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '20px',
                    width: '100%'
                }}>
                    {options.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px',
                                border: '2px solid #E5E5EA',
                                borderRadius: '20px',
                                background: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '4rem', marginBottom: '10px' }}>{item.icon}</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2D3436' }}>{item.word}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Phase1TargetSelector;
