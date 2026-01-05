import { useState } from 'react';

// Same favorites from Assessment
const favoriteOptions = [
    { id: 'play', word: 'Play', icon: '🏃' },
    { id: 'my-turn', word: 'My Turn', icon: '🙋' },
    { id: 'snack', word: 'Snack', icon: '🥨' },
    { id: 'mom', word: 'Mom', icon: '👩' },
    { id: 'dad', word: 'Dad', icon: '👨' },
    { id: 'toy', word: 'Toy', icon: '🧸' },
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
            padding: '1.25rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                width: '100%',
                maxWidth: '27.5rem',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 1.25rem 3.125rem rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                <div className="ios-sheet-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E5E5EA' }}>
                    <button
                        onClick={onClose}
                        style={{ color: '#007AFF', background: 'transparent', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Add Favorites</h2>
                    <button
                        disabled={selectedFavorites.length === 0}
                        onClick={() => {
                            if (selectedFavorites.length > 0) {
                                onAddFavorites(selectedFavorites);
                                onClose();
                            }
                        }}
                        style={{
                            padding: '6px 16px',
                            background: selectedFavorites.length > 0 ? '#007AFF' : '#E5E5EA',
                            color: selectedFavorites.length > 0 ? 'white' : '#999',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: selectedFavorites.length > 0 ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                        }}
                    >
                        Add
                    </button>
                </div>

                <p style={{ color: '#666', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Select items to add to the home screen
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
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
                                        ? '0.1875rem solid #FF8C00'
                                        : alreadyExists
                                            ? '0.125rem solid #D0D0D0'
                                            : '0.125rem solid #E5E5EA',
                                    borderRadius: '1rem',
                                    padding: '1rem 0.5rem',
                                    cursor: alreadyExists ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isSelected
                                        ? '0 0.5rem 1.25rem rgba(255, 165, 0, 0.4)'
                                        : '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                                    opacity: alreadyExists ? 0.5 : 1,
                                    position: 'relative',
                                    minHeight: '4.5rem'
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
                                        top: '0.25rem',
                                        right: '0.25rem'
                                    }}>
                                        ✓
                                    </span>
                                )}
                                {alreadyExists && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        color: '#999',
                                        position: 'absolute',
                                        bottom: '0.25rem',
                                        right: '0.25rem'
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
                    marginBottom: '1rem'
                }}>
                    {selectedFavorites.length === 0 && '👆 Tap to select favorites'}
                    {selectedFavorites.length > 0 &&
                        `✨ ${selectedFavorites.length} selected`}
                </div>


            </div>
        </div>
    );
};

export default FavoritesPickerModal;
