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

                <div className="ios-sheet-content" style={{ background: '#F2F2F7', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="ios-setting-card" style={{ padding: '15px' }}>
                        <div className="ios-row">
                            <span style={{ fontWeight: 600 }}>Name</span>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                style={{ border: 'none', textAlign: 'right', fontSize: '17px', outline: 'none', background: 'transparent', flex: 1 }}
                                placeholder="e.g. Mom"
                            />
                        </div>
                    </div>

                    <div className="ios-setting-group-header">High-Quality Characters</div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                        gap: '12px',
                        paddingBottom: '20px'
                    }}>
                        {memojis.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedId(m.id)}
                                style={{
                                    aspectRatio: '1/1',
                                    background: selectedId === m.id ? 'var(--primary)' : 'white',
                                    border: selectedId === m.id ? '3px solid #007AFF' : '1px solid #ddd',
                                    borderRadius: '16px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: selectedId === m.id ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: selectedId === m.id ? '0 4px 12px rgba(0,122,255,0.3)' : 'none'
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
