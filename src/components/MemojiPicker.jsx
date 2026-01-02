import { useState } from 'react';

const MemojiPicker = ({ onSelect, onClose }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [name, setName] = useState('');

    const memojiCount = 58;
    const memojis = Array.from({ length: memojiCount }, (_, i) => ({
        id: i + 1,
        url: `/images/memojis/${i + 1}.png`
    }));

    const handleSave = () => {
        if (!selectedId) return alert('Please select a character');
        if (!name) return alert('Please enter a name');
        
        onSelect(`/images/memojis/${selectedId}.png`, { name, type: 'memoji', id: selectedId });
    };

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()} style={{ height: '80vh' }}>
                <div className="ios-sheet-header">
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <h2 className="ios-sheet-title">Select Character</h2>
                    <button className="ios-done-button" onClick={handleSave}>Add</button>
                </div>

                <div className="ios-sheet-content" style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="ios-setting-card" style={{ padding: '0.9375rem' }}>
                        <div className="ios-row">
                            <span style={{ fontWeight: 600 }}>Name</span>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                style={{ border: 'none', textAlign: 'right', fontSize: '1.0625rem', outline: 'none', background: 'transparent', flex: 1, minHeight: '2.75rem' }}
                                placeholder="e.g. Mom"
                            />
                        </div>
                    </div>

                    <div className="ios-setting-group-header">High-Quality Characters</div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(5rem, 1fr))', 
                        gap: '0.75rem',
                        paddingBottom: '1.25rem'
                    }}>
                        {memojis.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedId(m.id)}
                                style={{
                                    aspectRatio: '1/1',
                                    background: selectedId === m.id ? 'var(--primary)' : 'white',
                                    border: selectedId === m.id ? '0.1875rem solid #007AFF' : '0.0625rem solid #ddd',
                                    borderRadius: '1rem',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: selectedId === m.id ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: selectedId === m.id ? '0 0.25rem 0.75rem rgba(0,122,255,0.3)' : 'none',
                                    minHeight: '2.75rem'
                                }}
                            >
                                <img src={m.url} alt={`Memoji ${m.id}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemojiPicker;
