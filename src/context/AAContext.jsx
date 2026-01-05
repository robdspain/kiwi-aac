import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useProfile } from './ProfileContext';
import { AAC_LEXICON } from '../data/aacLexicon';
import { CORE_WORDS_LAYOUT } from '../data/aacData';
import { LEVELS, getLevel, getNextLevel, migratePhaseToLevel } from '../data/levelDefinitions';
import { trackSentence, trackItemClick } from '../utils/AnalyticsService';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ensureDefaultVoice } from '../utils/voiceUtils';
import { MIRROR_DICTIONARY } from '../utils/translate';

const AAContext = createContext();

const INITIAL_CONTEXTS = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'school', label: 'School', icon: '🏫' },
    { id: 'grandparents', label: 'Grandparents', icon: '👵' },
    { id: 'store', label: 'Store', icon: '🛒' },
    { id: 'outside', label: 'Outside', icon: '🌳' },
];

const CORE_WORDS_DATA = CORE_WORDS_LAYOUT.map(item => {
    const lexiconEntry = AAC_LEXICON[item.word.toLowerCase()];
    return {
        id: `core-${item.word.toLowerCase()}`,
        type: 'button',
        word: item.word,
        icon: lexiconEntry?.emoji || '⚪',
        pos: item.pos,
        wc: item.wc || lexiconEntry?.type,
        category: 'core'
    };
});

export const AACProvider = ({ children }) => {
    const { currentProfile, updateProfile, updateAccessProfile, pronunciations } = useProfile();

    const [contexts, setContexts] = useState(() => {
        const saved = localStorage.getItem('kiwi-contexts');
        return saved ? JSON.parse(saved) : INITIAL_CONTEXTS;
    });

    const [currentContext, setCurrentContext] = useState(() => localStorage.getItem('kiwi-context') || 'home');

    const [rootItems, setRootItems] = useState(() => {
        const saved = localStorage.getItem(`kiwi-words-${currentContext}`);
        // Default data logic... simplified for context
        return saved ? JSON.parse(saved) : [];
    });

    const [currentLevel, setCurrentLevel] = useState(1.1);
    const [stripItems, setStripItems] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Voice & Speech
    const [voiceSettings, setVoiceSettings] = useState({ rate: 1, pitch: 1, volume: 1, voiceURI: null });
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [speechDelay, setSpeechDelay] = useState(5);
    const lastSpeakTimeRef = useRef({});

    // ... lots more state from App.jsx ...
    // Note: I will move the core logic here gradually to ensure stability.

    const speak = useCallback((text, customAudio = null) => {
        const synth = window.speechSynthesis;
        if (!synth) return;
        if (synth.speaking) synth.cancel();

        const lang = currentProfile?.accessProfile?.language || 'en';
        let processedText = text;

        if (pronunciations) {
            const words = text.split(/\s+/);
            const processedWords = words.map(w => {
                const cleanWord = w.toLowerCase().replace(/[.,!?;:]/g, '');
                return pronunciations[cleanWord] || w;
            });
            processedText = processedWords.join(' ');
        }

        const u = new SpeechSynthesisUtterance(processedText);
        u.lang = lang === 'es' ? 'es-ES' : 'en-US';
        u.rate = voiceSettings.rate;
        u.pitch = voiceSettings.pitch;
        u.volume = voiceSettings.volume || 1;

        if (voiceSettings.voiceURI) {
            const voices = synth.getVoices();
            const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
            if (selectedVoice) u.voice = selectedVoice;
        }

        synth.speak(u);
    }, [currentProfile, voiceSettings, pronunciations]);

    const value = {
        contexts,
        currentContext,
        rootItems,
        currentLevel,
        stripItems,
        setStripItems,
        currentPath,
        setCurrentPath,
        currentPageIndex,
        setCurrentPageIndex,
        showSuccess,
        setShowSuccess,
        voiceSettings,
        setVoiceSettings,
        autoSpeak,
        setAutoSpeak,
        speechDelay,
        setSpeechDelay,
        speak,
        CORE_WORDS_DATA,
        setCurrentLevel,
        setRootItems,
        setContexts,
        setCurrentContext
    };

    return <AAContext.Provider value={value}>{children}</AAContext.Provider>;
};

export const useAAC = () => useContext(AAContext);
