import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

const DEFAULT_ACCESS_PROFILE = {
    targetSize: 10, // mm
    spacing: 1.5, // mm
    selectionType: 'touch', // 'touch' | 'scan' | 'eye'
    visualContrast: 'standard',
    fieldSize: 'unlimited',
    language: 'en', // 'en' | 'es'
    biometricLock: false,
    // Physical Scaling
    deviceDPI: null, // Auto-detected on first load, null = not yet detected
    dpiCalibrated: false, // Has user manually calibrated DPI?
    // Switch Access Settings
    switchAccessEnabled: false,
    scanSpeed: 1500, // milliseconds (1-3 seconds)
    audioFeedback: false,
    switchKey: 'Space' // Default switch key
};

const DEFAULT_PROFILE = {
    id: 'default',
    name: 'Default',
    avatar: '👤',
    createdAt: Date.now(),
    accessProfile: DEFAULT_ACCESS_PROFILE
};

const getInitialProfiles = () => {
    try {
        const saved = localStorage.getItem('kiwi-profiles');
        const data = saved ? JSON.parse(saved) : [DEFAULT_PROFILE];
        if (!Array.isArray(data)) return [DEFAULT_PROFILE];

        // Migration for existing profiles - Force 'touch' as scan/eye are future features
        return data.map(p => ({
            ...p,
            accessProfile: {
                ...(p.accessProfile || DEFAULT_ACCESS_PROFILE),
                selectionType: 'touch'
            }
        }));
    } catch (e) {
        console.error('Failed to load profiles:', e);
        return [DEFAULT_PROFILE];
    }
};

const getInitialProfileId = () => {
    return localStorage.getItem('kiwi-current-profile') || 'default';
};

const getInitialPronunciations = () => {
    try {
        const saved = localStorage.getItem('kiwi-pronunciations');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
};

export const ProfileProvider = ({ children }) => {
    const [profiles, setProfiles] = useState(getInitialProfiles);
    const [currentProfileId, setCurrentProfileId] = useState(getInitialProfileId);
    const [pronunciations, setPronunciations] = useState(getInitialPronunciations);

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

    const updateAccessProfile = (updates) => {
        updateProfile(currentProfileId, {
            accessProfile: { ...currentProfile.accessProfile, ...updates }
        });
    };

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
        // Check multi-profile limit using lazy import to avoid circular dependency
        if (profiles.length >= 1) {
            try {
                const { checkMultiProfiles } = await import('../utils/paywall');
                const hasAccess = await checkMultiProfiles(profiles.length);
                if (!hasAccess) {
                    return null; // User declined or not subscribed
                }
            } catch (error) {
                console.error('Failed to check multi-profile limit:', error);
                // Continue anyway in case of error
            }
        }

        const newProfile = {
            id: 'profile-' + Date.now(),
            name,
            avatar: avatar || '👤',
            createdAt: Date.now(),
            accessProfile: DEFAULT_ACCESS_PROFILE
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
            deletePronunciation,
            updateAccessProfile
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
