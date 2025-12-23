import React, { useState, useEffect, useRef } from 'react';
import { translateWord } from '../utils/translate';
import { removeBackground } from '@imgly/background-removal';
import VoiceRecorder from './VoiceRecorder';
import CharacterBuilder from './CharacterBuilder';

const EditModal = ({ isOpen, onClose, onSave, onDelete, onOpenEmojiPicker, item }) => {
    const [word, setWord] = useState('');
    const [icon, setIcon] = useState('');
    const [bgColor, setBgColor] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [customAudio, setCustomAudio] = useState(null);
    const [isImage, setIsImage] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isRemovingBackground, setIsRemovingBackground] = useState(false);
    const [showCharacterBuilder, setShowCharacterBuilder] = useState(false);
    const [characterConfig, setCharacterConfig] = useState(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && item) {
            setWord(item.word);
            setIcon(item.icon);
            setBgColor(item.bgColor || '');
            setViewMode(item.viewMode || 'grid');
            setCustomAudio(item.customAudio || null);
            setCharacterConfig(item.characterConfig || null);
            // Detect if current icon is image path/data or emoji
            const isImg = typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.'));
            setIsImage(isImg);
        }
    }, [isOpen, item]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Resize to avoid huge storage usage
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 256;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setIcon(dataUrl);
                    setIsImage(true);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBackground = async () => {
        if (!icon || !isImage) return;

        setIsRemovingBackground(true);
        try {
            const blob = await removeBackground(icon, {
                progress: (key, current, total) => {
                    console.log(`Background removal progress: ${key} ${current}/${total}`);
                }
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                setIcon(reader.result);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Background removal failed:', error);
            alert('Failed to remove background. Please try again.');
        } finally {
            setIsRemovingBackground(false);
        }
    };

    const handleTranslate = async () => {
        if (!word.trim()) return;
        setIsTranslating(true);
        try {
            const translated = await translateWord(word);
            setWord(translated);
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSave = () => {
        onSave(word, icon, bgColor, viewMode, customAudio, characterConfig);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm("Delete this item?")) {
            onDelete();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', padding: '20px',
                width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px'
            }}>
                <h2 style={{ margin: 0, textAlign: 'center' }}>{item?.type === 'folder' ? 'Edit Folder' : 'Edit Button'}</h2>

                {item?.type === 'folder' && (
                    <div style={{ background: '#f8f8f8', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Folder View Mode</label>
                        <div style={{ display: 'flex', gap: '5px', borderRadius: '10px', background: '#e0e0e0', padding: '2px' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    flex: 1, padding: '8px', border: 'none', borderRadius: '8px',
                                    background: viewMode === 'grid' ? 'white' : 'transparent',
                                    boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    fontWeight: viewMode === 'grid' ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                📱 Grid
                            </button>
                            <button
                                onClick={() => setViewMode('schedule')}
                                style={{
                                    flex: 1, padding: '8px', border: 'none', borderRadius: '8px',
                                    background: viewMode === 'schedule' ? 'white' : 'transparent',
                                    boxShadow: viewMode === 'schedule' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    fontWeight: viewMode === 'schedule' ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                🗓️ Schedule
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', position: 'relative' }}>
                    <div style={{
                        width: '100px', height: '100px', margin: '0 auto',
                        borderRadius: '20%', background: bgColor || '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '3rem', overflow: 'hidden', border: '1px solid #ccc'
                    }}>
                        {isImage ? (
                            <img src={icon} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                            icon
                        )}
                    </div>
                    {isImage && (
                        <button
                            onClick={handleRemoveBackground}
                            disabled={isRemovingBackground}
                            style={{
                                marginTop: '10px',
                                padding: '6px 12px',
                                background: '#34C759',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: isRemovingBackground ? 'default' : 'pointer',
                                fontSize: '0.8rem',
                                opacity: isRemovingBackground ? 0.7 : 1
                            }}
                        >
                            {isRemovingBackground ? '✨ Removing...' : '✨ Remove Background'}
                        </button>
                    )}
                </div>


                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Background Color</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE'].map(color => (
                            <button
                                key={color}
                                onClick={() => setBgColor(color)}
                                style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: color || '#f0f0f0',
                                    border: bgColor === color ? '2px solid black' : '1px solid #ccc',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Label</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={word}
                            onChange={(e) => setWord(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1.2rem' }}
                        />
                        <button
                            onClick={handleTranslate}
                            disabled={isTranslating || !word.trim()}
                            style={{
                                padding: '10px',
                                background: '#E5E5EA',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: (isTranslating || !word.trim()) ? 'default' : 'pointer',
                                fontSize: '0.9rem',
                                opacity: (isTranslating || !word.trim()) ? 0.6 : 1,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {isTranslating ? '...' : '🇺🇸➡️🇪🇸'}
                        </button>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Icon Source</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{ flex: '1 1 45%', padding: '10px', background: '#E5E5EA', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                        >
                            🖼️ Photo Library
                        </button>
                        <button
                            onClick={() => cameraInputRef.current.click()}
                            style={{ flex: '1 1 45%', padding: '10px', background: '#E5E5EA', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                        >
                            📷 Take Photo
                        </button>
                        <button
                            onClick={() => {
                                onOpenEmojiPicker(setWord, (newIcon, isImgSearch) => {
                                    setIcon(newIcon);
                                    setIsImage(!!isImgSearch);
                                });
                            }}
                            style={{ flex: '1 1 45%', padding: '10px', background: '#E5E5EA', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                        >
                            😀 Library
                        </button>
                        <button
                            onClick={() => setShowCharacterBuilder(true)}
                            style={{ flex: '1 1 45%', padding: '10px', background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            👤 Build Character
                        </button>
                        {/* File picker for photo library */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        {/* Camera capture for mobile devices */}
                        <input
                            type="file"
                            ref={cameraInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            capture="environment"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                {item?.type !== 'folder' && (
                    <VoiceRecorder
                        currentAudio={customAudio}
                        onSave={(audio) => setCustomAudio(audio)}
                        onRemove={() => setCustomAudio(null)}
                    />
                )}

                <button
                    onClick={handleDelete}
                    style={{ padding: '8px', background: 'none', border: 'none', color: '#FF3B30', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                    🗑️ Delete Item
                </button>


                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{ flex: 1, padding: '12px', background: '#E5E5EA', color: 'black', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ flex: 1, padding: '15px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}
                    >
                        Save
                    </button>
                </div>

                {showCharacterBuilder && (
                    <CharacterBuilder
                        initialConfig={characterConfig}
                        onSelect={(newIcon, config) => {
                            setIcon(newIcon);
                            setCharacterConfig(config);
                            setIsImage(true);
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

