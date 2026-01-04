

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
            background: 'var(--bg-color)',
            zIndex: 1600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
        }}>
            <div style={{
                maxWidth: '37.5rem',
                width: '100%',
                textAlign: 'center'
            }}>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '2rem', fontWeight: 'bold' }}>Choose a Target Item</h1>
                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.5, fontWeight: 500 }}>
                    Pick one item that is highly motivating and can have multiple meanings (e.g. &quot;Play&quot; can mean tickles, chase, or ball).
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(8.75rem, 1fr))',
                    gap: '1.25rem',
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
                                padding: '1.5rem',
                                border: '2px solid var(--gray-border)',
                                borderRadius: '1.5rem',
                                background: 'var(--card-bg)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                minHeight: '4.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            <span style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? '🖼️' : item.icon}</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.word}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Phase1TargetSelector;
