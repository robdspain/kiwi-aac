import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';

const PronunciationEditor = ({ onClose }) => {
    const { pronunciations, addPronunciation, deletePronunciation } = useProfile();
    const [word, setWord] = useState('');
    const [phonetic, setPhonetic] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (word && phonetic) {
            addPronunciation(word, phonetic);
            setWord('');
            setPhonetic('');
        }
    };

    return (
        <div className="ios-modal-overlay" onClick={onClose}>
            <div className="ios-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
                <div className="ios-modal-header">
                    <h3>Pronunciation Editor</h3>
                    <button className="ios-close-btn" onClick={onClose} style={{ minWidth: '2.75rem', minHeight: '2.75rem' }}>✕</button>
                </div>
                
                <div style={{ padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
                        Type a word and how you want it to sound (phonetically).
                        <br/>Example: <b>Kiwi</b> → <b>Kee-wee</b>
                    </p>

                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="ios-input-group">
                            <label>Original Word</label>
                            <input 
                                type="text" 
                                value={word} 
                                onChange={e => setWord(e.target.value)}
                                placeholder="e.g. Kiwi"
                                className="ios-input"
                            />
                        </div>
                        <div className="ios-input-group">
                            <label>Phonetic Spelling</label>
                            <input 
                                type="text" 
                                value={phonetic} 
                                onChange={e => setPhonetic(e.target.value)}
                                placeholder="e.g. Kee-wee"
                                className="ios-input"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="apple-blue-button" 
                            disabled={!word || !phonetic}
                            style={{ marginTop: '0.625rem', minHeight: '2.75rem' }}
                        >
                            Add Override
                        </button>
                    </form>

                    <div style={{ marginTop: '1.875rem' }}>
                        <h4 style={{ fontSize: '0.8125rem', color: '#8E8E93', marginBottom: '0.625rem', textTransform: 'uppercase' }}>
                            Existing Overrides
                        </h4>
                        <div className="ios-setting-card" style={{ maxHeight: '12.5rem', overflowY: 'auto' }}>
                            {Object.keys(pronunciations).length === 0 ? (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#999', fontSize: '0.875rem' }}>
                                    No custom pronunciations yet.
                                </div>
                            ) : (
                                Object.entries(pronunciations).map(([w, p]) => (
                                    <div key={w} className="ios-row" style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{w}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#007AFF' }}>sounds like: {p}</span>
                                        </div>
                                        <button 
                                            onClick={() => deletePronunciation(w)}
                                            style={{ border: 'none', background: '#FFE5E5', color: '#FF3B30', borderRadius: '50%', width: '2.75rem', height: '2.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >×</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PronunciationEditor;
