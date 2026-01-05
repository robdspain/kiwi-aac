import { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonIcon
} from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';

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
        <IonModal isOpen={true} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onClose}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Add Favorites</IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={() => {
                                if (selectedFavorites.length > 0) {
                                    onAddFavorites(selectedFavorites);
                                    onClose();
                                }
                            }}
                            disabled={selectedFavorites.length === 0}
                            style={{ fontWeight: 'bold' }}
                        >
                            Add
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <IonText color="medium">
                        <p style={{ fontSize: '0.9rem' }}>
                            Select items to add to the home screen
                        </p>
                    </IonText>
                </div>

                <IonGrid>
                    <IonRow>
                        {favoriteOptions.map(fav => {
                            const isSelected = !!selectedFavorites.find(f => f.id === fav.id);
                            const alreadyExists = isFavoriteExisting(fav.id);

                            return (
                                <IonCol size="4" key={fav.id}>
                                    <div
                                        onClick={() => !alreadyExists && handleFavoriteToggle(fav)}
                                        style={{
                                            background: isSelected
                                                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                                : alreadyExists
                                                    ? 'var(--ion-color-light)'
                                                    : 'white',
                                            border: isSelected
                                                ? '2px solid #FF8C00'
                                                : alreadyExists
                                                    ? '1px solid #D0D0D0'
                                                    : '1px solid var(--ion-color-light-shade)',
                                            borderRadius: '1.25rem',
                                            padding: '1rem 0.5rem',
                                            cursor: alreadyExists ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: isSelected
                                                ? '0 8px 24px rgba(255, 165, 0, 0.3)'
                                                : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                            opacity: alreadyExists ? 0.5 : 1,
                                            position: 'relative',
                                            minHeight: '6rem'
                                        }}
                                    >
                                        <span style={{ fontSize: '2.5rem' }}>{fav.icon}</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: isSelected ? '700' : '600',
                                            color: isSelected ? 'white' : alreadyExists ? '#999' : 'var(--ion-color-dark)',
                                            textAlign: 'center'
                                        }}>
                                            {fav.word}
                                        </span>
                                        {isSelected && (
                                            <IonIcon
                                                icon={checkmarkCircleOutline}
                                                style={{
                                                    fontSize: '1.2rem',
                                                    position: 'absolute',
                                                    top: '0.25rem',
                                                    right: '0.25rem',
                                                    color: 'white'
                                                }}
                                            />
                                        )}
                                        {alreadyExists && (
                                            <span style={{
                                                fontSize: '0.65rem',
                                                color: '#999',
                                                position: 'absolute',
                                                bottom: '0.25rem',
                                                right: '0.25rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ADDED
                                            </span>
                                        )}
                                    </div>
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>

                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: 'var(--ion-color-medium)',
                    fontSize: '0.9rem'
                }}>
                    {selectedFavorites.length === 0 ? (
                        'Tap to select favorites'
                    ) : (
                        <IonText color="primary" style={{ fontWeight: 600 }}>
                            {selectedFavorites.length} item{selectedFavorites.length !== 1 ? 's' : ''} selected
                        </IonText>
                    )}
                </div>
            </IonContent>
        </IonModal>
    );
};

export default FavoritesPickerModal;
