import { useState, useEffect, useRef } from 'react';
import VoiceRecorder from './VoiceRecorder';
import CharacterBuilder from './CharacterBuilder';

const EditModal = ({ isOpen, onClose, onSave, onDelete, onOpenEmojiPicker, item, triggerPaywall }) => {
    const [word, setWord] = useState('');
    const [icon, setIcon] = useState('');
    const [bgColor, setBgColor] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [customAudio, setCustomAudio] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [showCharacterBuilder, setShowCharacterBuilder] = useState(false);
    const [characterConfig, setCharacterConfig] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const lastItemIdRef = useRef(null);

    useEffect(() => {
        if (isOpen && item && item.id !== lastItemIdRef.current) {
            lastItemIdRef.current = item.id;
            setTimeout(() => {
                setWord(item.word); setIcon(item.icon); setBgColor(item.bgColor || ''); setViewMode(item.viewMode || 'grid'); setCustomAudio(item.customAudio || null); setCharacterConfig(item.characterConfig || null);
                setIsImage(typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')));
            }, 0);
        }
    }, [isOpen, item]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas'); const maxSize = 256; let width = img.width, height = img.height;
                    if (width > height) { if (width > maxSize) { height *= maxSize / width; width = maxSize; } }
                    else { if (height > maxSize) { width *= maxSize / height; height = maxSize; } }
                    canvas.width = width; canvas.height = height; canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                    setIcon(canvas.toDataURL('image/jpeg', 0.8)); setIsImage(true);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ios-bottom-sheet-overlay" onClick={onClose}>
            <div className="ios-bottom-sheet" onClick={e => e.stopPropagation()}>
                <div className="ios-sheet-header">
                    <button className="ios-cancel-button" onClick={onClose}>Cancel</button>
                    <h2 className="ios-sheet-title">{item?.type === 'folder' ? 'Edit Folder' : 'Edit Button'}</h2>
                    <button className="ios-done-button" onClick={() => { onSave(word, icon, bgColor, viewMode, customAudio, characterConfig); onClose(); }}>Done</button>
                </div>
                
                <div className="ios-sheet-content" style={{ background: '#F2F2F7' }}>
                    <div className="ios-setting-group-header">Content</div>
                    <div className="ios-setting-card">
                        <div className="ios-row">
                            <span style={{ fontWeight: 600 }}>Label</span>
                            <input 
                                type="text" 
                                value={word} 
                                onChange={(e) => setWord(e.target.value)} 
                                style={{ border: 'none', textAlign: 'right', fontSize: '17px', outline: 'none', background: 'transparent', flex: 1 }}
                                placeholder="Enter label"
                            />
                        </div>
                        {item?.type === 'folder' && (
                            <div className="ios-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px', padding: '15px' }}>
                                <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', color: '#6e6e73' }}>View Mode</span>
                                <div className="ios-segmented-control" style={{ marginBottom: 0 }}>
                                    <div 
                                        className="selection-pill" 
                                        style={{ 
                                            width: 'calc(50% - 4px)',
                                            transform: viewMode === 'grid' ? 'translateX(0)' : 'translateX(100%)' 
                                        }} 
                                    />
                                    <button onClick={() => setViewMode('grid')}>Grid</button>
                                    <button onClick={() => setViewMode('schedule')}>Schedule</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ios-setting-group-header">Appearance</div>
                    <div className="ios-setting-card">
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '22%', background: bgColor || 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                {isImage ? <img src={icon} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : icon}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {['', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE'].map(color => (
                                    <button 
                                        key={color} 
                                        onClick={() => setBgColor(color)} 
                                        style={{ 
                                            width: '36px', height: '36px', borderRadius: '50%', 
                                            background: color || 'white', 
                                            border: bgColor === color ? '3px solid #007AFF' : '1px solid #ddd', 
                                            cursor: 'pointer',
                                            boxShadow: bgColor === color ? '0 0 0 2px white' : 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="ios-row" onClick={() => onOpenEmojiPicker(setWord, (ni, isImg) => { setIcon(ni); setIsImage(!!isImg); })}>
                            <span>Choose from Library</span>
                            <span className="ios-chevron">›</span>
                        </div>
                        <div className="ios-row" onClick={() => setShowCharacterBuilder(true)}>
                            <span>Customize Avatar</span>
                            <span className="ios-chevron">›</span>
                        </div>
                        <div className="ios-row" onClick={() => triggerPaywall ? triggerPaywall('upload_photo', () => fileInputRef.current.click()) : fileInputRef.current.click()}>
                            <span>Upload Photo</span>
                            <span className="ios-chevron">›</span>
                        </div>
                    </div>

                    <div className="ios-setting-group-header">Media</div>
                    <div className="ios-setting-card">
                        <div style={{ padding: '5px' }}>
                            {item?.type !== 'folder' && <VoiceRecorder currentAudio={customAudio} onSave={(audio) => setCustomAudio(audio)} onRemove={() => setCustomAudio(null)}/>}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <button 
                            onClick={() => { if (window.confirm("Delete this item?")) { onDelete(); onClose(); } }} 
                            className="ios-row" 
                            style={{ width: '100%', border: 'none', borderRadius: '12px', justifyContent: 'center' }}
                        >
                            <span style={{ color: '#FF3B30', fontWeight: 600 }}>Delete Item</span>
                        </button>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }}/>
                    <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" style={{ display: 'none' }}/>
                </div>

                {showCharacterBuilder && (
                    <CharacterBuilder 
                        initialConfig={characterConfig} 
                        triggerPaywall={triggerPaywall} 
                        onSelect={(newIcon, config) => { 
                            setIcon(newIcon); 
                            setCharacterConfig(config); 
                            if (config.name) setWord(config.name); 
                            setIsImage(!!config.isImported); 
                            setShowCharacterBuilder(false); 
                        }} 
                        onClose={() => setShowCharacterBuilder(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default EditModal;