import React, { useState } from 'react';

// Same favorites from Assessment
const favoriteOptions = [
    { id: 'bubbles', word: 'Bubbles', icon: '🫧' },
    { id: 'cookie', word: 'Cookie', icon: '🍪' },
    { id: 'train', word: 'Train', icon: '🚂' },
    { id: 'ipad', word: 'iPad', icon: '📱' },
    { id: 'tickles', word: 'Tickles', icon: '🤗' },
    { id: 'swing', word: 'Swing', icon: '🎢' },
    { id: 'music', word: 'Music', icon: '🎵' },
    { id: 'tv', word: 'TV', icon: '📺' },
    { id: 'ball', word: 'Ball', icon: '⚽' },
    { id: 'blocks', word: 'Blocks', icon: '🧱' },
    { id: 'car', word: 'Car', icon: '🚗' },
    { id: 'dinosaur', word: 'Dinosaur', icon: '🦕' },
    { id: 'dog', word: 'Dog', icon: '🐕' },
    { id: 'jump', word: 'Jump', icon: '🦘' },
    { id: 'book', word: 'Book', icon: '📚' },
    { id: 'puzzle', word: 'Puzzle', icon: '🧩' },
    { id: 'paint', word: 'Paint', icon: '🎨' },
    { id: 'bike', word: 'Bike', icon: '🚲' },
    { id: 'snack', word: 'Snack', icon: '🍿' },
    { id: 'game', word: 'Game', icon: '🎮' },
];

const FavoritesPickerModal = ({ onClose, onAddFavorites, existingFavorites = [] }) => {
    const [selectedFavorites, setSelectedFavorites] = useState([]);

    const handleFavoriteToggle = (favorite) => {
        if (selectedFavorites.find(f => f.id === favorite.id)) {
            setSelectedFavorites(selectedFavorites.filter(f => f.id !== favorite.id));
        } else {
            setSelectedFavorites([...selectedFavorites, favorite]);
        }
    };

    const isFavoriteExisting = (favId) => {
        return existingFavorites.some(item =>
            item.word === favoriteOptions.find(f => f.id === favId)?.word
        );
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '440px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '16px' }}>
                    ⭐
                </div>

                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#333', textAlign: 'center' }}>
                    Add More Favorites
                </h2>

                <p style={{ color: '#666', textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem' }}>
                    Select items to add to the home screen
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    {favoriteOptions.map(fav => {
                        const isSelected = selectedFavorites.find(f => f.id === fav.id);
                        const alreadyExists = isFavoriteExisting(fav.id);

                        return (
                            <button
                                key={fav.id}
                                onClick={() => !alreadyExists && handleFavoriteToggle(fav)}
                                disabled={alreadyExists}
                                style={{
                                    background: isSelected
                                        ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                        : alreadyExists
                                        ? '#F0F0F0'
                                        : 'white',
                                    border: isSelected
                                        ? '3px solid #FF8C00'
                                        : alreadyExists
                                        ? '2px solid #D0D0D0'
                                        : '2px solid #E5E5EA',
                                    borderRadius: '16px',
                                    padding: '16px 8px',
                                    cursor: alreadyExists ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isSelected
                                        ? '0 8px 20px rgba(255, 165, 0, 0.4)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    opacity: alreadyExists ? 0.5 : 1,
                                    position: 'relative'
                                }}
                            >
                                <span style={{ fontSize: '2.5rem' }}>{fav.icon}</span>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: isSelected ? '700' : '600',
                                    color: isSelected ? 'white' : alreadyExists ? '#999' : '#2D3436'
                                }}>
                                    {fav.word}
                                </span>
                                {isSelected && (
                                    <span style={{
                                        fontSize: '1.2rem',
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px'
                                    }}>
                                        ✓
                                    </span>
                                )}
                                {alreadyExists && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: '#999',
                                        position: 'absolute',
                                        bottom: '4px',
                                        right: '4px'
                                    }}>
                                        Added
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    textAlign: 'center',
                    color: '#636E72',
                    fontSize: '0.9rem',
                    marginBottom: '16px'
                }}>
                    {selectedFavorites.length === 0 && '👆 Tap to select favorites'}
                    {selectedFavorites.length > 0 &&
                        `✨ ${selectedFavorites.length} selected`}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: '#F5F5F7',
                            color: '#2D3436',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            if (selectedFavorites.length > 0) {
                                onAddFavorites(selectedFavorites);
                                onClose();
                            }
                        }}
                        disabled={selectedFavorites.length === 0}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: selectedFavorites.length > 0
                                ? 'linear-gradient(135deg, #4ECDC4, #3DB8B0)'
                                : '#D1D5DB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '14px',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: selectedFavorites.length > 0 ? 'pointer' : 'not-allowed',
                            boxShadow: selectedFavorites.length > 0
                                ? '0 6px 20px rgba(78, 205, 196, 0.3)'
                                : 'none'
                        }}
                    >
                        Add {selectedFavorites.length > 0 ? `(${selectedFavorites.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FavoritesPickerModal;
