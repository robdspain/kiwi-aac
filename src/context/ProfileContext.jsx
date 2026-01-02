import { createContext, useContext, useState, useEffect } from 'react';
import { checkMultiProfiles } from '../utils/paywall';

const ProfileContext = createContext();

const DEFAULT_PROFILE = {
    id: 'default',
    name: 'Default',
    avatar: '👤',
    createdAt: Date.now()
};

export const ProfileProvider = ({ children }) => {
    const [profiles, setProfiles] = useState(() => {
        const saved = localStorage.getItem('kiwi-profiles');
        return saved ? JSON.parse(saved) : [DEFAULT_PROFILE];
    });

    const [currentProfileId, setCurrentProfileId] = useState(() => {
        return localStorage.getItem('kiwi-current-profile') || 'default';
    });

    const [pronunciations, setPronunciations] = useState(() => {
        const saved = localStorage.getItem('kiwi-pronunciations');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('kiwi-profiles', JSON.stringify(profiles));
    }, [profiles]);

    useEffect(() => {
        localStorage.setItem('kiwi-current-profile', currentProfileId);
    }, [currentProfileId]);

    useEffect(() => {
        localStorage.setItem('kiwi-pronunciations', JSON.stringify(pronunciations));
    }, [pronunciations]);

    const currentProfile = profiles.find(p => p.id === currentProfileId) || DEFAULT_PROFILE;

    const getStorageKey = (key) => {
        return `kiwi-${currentProfileId}-${key}`;
    };

    const addPronunciation = (word, phonetic) => {
        setPronunciations(prev => ({ ...prev, [word.toLowerCase()]: phonetic }));
    };

    const deletePronunciation = (word) => {
        setPronunciations(prev => {
            const next = { ...prev };
            delete next[word.toLowerCase()];
            return next;
        });
    };

    const addProfile = async (name, avatar) => {
        // Check multi-profile limit
        const hasAccess = await checkMultiProfiles(profiles.length);
        if (!hasAccess) {
            return null; // User declined or not subscribed
        }

        const newProfile = {
            id: 'profile-' + Date.now(),
            name,
            avatar: avatar || '👤',
            createdAt: Date.now()
        };
        setProfiles([...profiles, newProfile]);
        return newProfile;
    };

    const updateProfile = (id, updates) => {
        setProfiles(profiles.map(p =>
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    const deleteProfile = (id) => {
        if (id === 'default') return; // Can't delete default
        setProfiles(profiles.filter(p => p.id !== id));
        if (currentProfileId === id) {
            setCurrentProfileId('default');
        }
        // Clean up profile data
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`kiwi-${id}-`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    };

    const switchProfile = (id) => {
        setCurrentProfileId(id);
    };

    return (
        <ProfileContext.Provider value={{
            profiles,
            currentProfile,
            currentProfileId,
            pronunciations,
            getStorageKey,
            addProfile,
            updateProfile,
            deleteProfile,
            switchProfile,
            addPronunciation,
            deletePronunciation
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export default ProfileContext;
