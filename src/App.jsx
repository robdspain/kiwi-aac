import React, { useState, useEffect, Suspense, lazy, useRef, useCallback } from 'react';
import Grid from './components/Grid';
import SentenceStrip from './components/SentenceStrip';
import Controls from './components/Controls';
import SplashScreen from './components/SplashScreen';
import LevelIntro from './components/LevelIntro';
const SwitchAccessMode = lazy(() => import('./components/SwitchAccessMode'));

const PickerModal = lazy(() => import('./components/PickerModal'));
const AdvancementModal = lazy(() => import('./components/AdvancementModal'));
const Phase1TargetSelector = lazy(() => import('./components/Phase1TargetSelector'));
const A2HSModal = lazy(() => import('./components/A2HSModal'));
const EssentialSkillsMode = lazy(() => import('./components/EssentialSkillsMode'));

const Dashboard = lazy(() => import('./components/Dashboard'));
const EditModal = lazy(() => import('./components/EditModal'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const TouchCalibration = lazy(() => import('./components/TouchCalibration'));
const VisualSceneView = lazy(() => import('./components/VisualSceneView'));
import GuidedTour from './components/GuidedTour';
import { playBellSound } from './utils/sounds';
import { trackSentence, trackItemClick, trackEvent } from './utils/AnalyticsService';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { InAppReview } from '@capacitor-community/in-app-review';
import {
  LEVELS,
  getLevel,
  getNextLevel,
  migratePhaseToLevel
} from './data/levelDefinitions';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import Toast from './components/Toast';
import {
  sortableKeyboardCoordinates,
  arrayMove
} from '@dnd-kit/sortable';
import { AAC_LEXICON } from './data/aacLexicon';
import { CORE_WORDS_LAYOUT, TEMPLATES } from './data/aacData';
import { useProfile } from './context/ProfileContext';
import { MIRROR_DICTIONARY } from './utils/translate';
import { ensureDefaultVoice } from './utils/voiceUtils';
import { Capacitor } from '@capacitor/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { authenticateWithBiometric, isSessionValid } from './utils/biometricAuth';
import { getDeviceDPI } from './utils/physicalScaling';
import { saveMedia, deleteMedia } from './utils/db';

const synth = window.speechSynthesis || null;

const INITIAL_CONTEXTS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'mealtime', label: 'Mealtime', icon: '🥣' },
  { id: 'school', label: 'School', icon: '🏫' },
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

const attributesFolder = {
  id: 'attributes-folder', type: 'folder', word: "Describe", icon: "🎨", contents: [
    {
      id: 'colors-folder', type: 'folder', word: "Colors", icon: "🌈", contents: [
        { id: 'red', type: 'button', word: "Red", icon: "🔴" },
        { id: 'blue', type: 'button', word: "Blue", icon: "🔵" },
        { id: 'green', type: 'button', word: "Green", icon: "🟢" },
        { id: 'yellow', type: 'button', word: "Yellow", icon: "🟡" },
        { id: 'orange', type: 'button', word: "Orange", icon: "🟠" },
        { id: 'purple', type: 'button', word: "Purple", icon: "🟣" }
      ]
    },
    {
      id: 'numbers-folder', type: 'folder', word: "Numbers", icon: "1️⃣", contents: [
        { id: 'one', type: 'button', word: "1", icon: "1️⃣" },
        { id: 'two', type: 'button', word: "2", icon: "2️⃣" },
        { id: 'three', type: 'button', word: "3", icon: "3️⃣" },
        { id: 'all', type: 'button', word: "All", icon: "🔢" },
        { id: 'some', type: 'button', word: "Some", icon: "🤏" }
      ]
    },
    {
      id: 'size-folder', type: 'folder', word: "Size", icon: "📏", contents: [
        { id: 'big', type: 'button', word: "Big", icon: "🐘" },
        { id: 'little', type: 'button', word: "Little", icon: "🐜" },
        { id: 'long', type: 'button', word: "Long", icon: "🦒" },
        { id: 'short', type: 'button', word: "Short", icon: "🐛" }
      ]
    },
    {
      id: 'texture-folder', type: 'folder', word: "Feel", icon: "✋", contents: [
        { id: 'soft', type: 'button', word: "Soft", icon: "☁️" },
        { id: 'hard', type: 'button', word: "Hard", icon: "🪨" },
        { id: 'smooth', type: 'button', word: "Smooth", icon: "🧊" },
        { id: 'bumpy', type: 'button', word: "Bumpy", icon: "🐊" }
      ]
    }
  ]
};

const homeDefaultData = [
  { id: 'social-hi', type: 'button', word: "Hi", icon: "👋" },
  { id: 'social-bye', type: 'button', word: "Bye-bye", icon: "👋" },
  { id: 'social-yes', type: 'button', word: "Yes", icon: "✅" },
  { id: 'social-no', type: 'button', word: "No", icon: "❌" },
  { id: 'social-want', type: 'button', word: "Want", icon: "🙏" },
  { id: 'social-mine', type: 'button', word: "Mine", icon: "🧒" },
  { id: 'social-help', type: 'button', word: "Help", icon: "🆘" },
  { id: 'social-again', type: 'button', word: "Again", icon: "🔄" },
  { id: 'action-open', type: 'button', word: "Open", icon: "🔓" },
  { id: 'action-close', type: 'button', word: "Close", icon: "🔒" },
  { id: 'action-put', type: 'button', word: "Put", icon: "📥" },
  { id: 'action-play', type: 'button', word: "Play", icon: "🪁" },
  { id: 'action-wash', type: 'button', word: "Wash", icon: "🧼" },
  { id: 'action-sleep', type: 'button', word: "Sleep", icon: "😴" },
  { id: 'action-get', type: 'button', word: "Get", icon: "🤲" },
  { id: 'mama', type: 'button', word: "Mama", icon: "👩" },
  { id: 'dada', type: 'button', word: "Dada", icon: "👨" },
  { id: 'book', type: 'button', word: "Book", icon: "📖" },
  { id: 'toy', type: 'button', word: "Toy", icon: "🧸" },
  { id: 'blanket', type: 'button', word: "Blanket", icon: "🛌" },
  { id: 'diaper', type: 'button', word: "Diaper", icon: "👶" }
];

const mealtimeDefaultData = [
  { id: 'req-eat', type: 'button', word: "Eat", icon: "🥣" },
  { id: 'req-drink', type: 'button', word: "Drink", icon: "🥤" },
  { id: 'req-more', type: 'button', word: "More", icon: "➕" },
  { id: 'req-please', type: 'button', word: "Please", icon: "🙏" },
  { id: 'req-want', type: 'button', word: "Want", icon: "👈" },
  { id: 'req-alldone', type: 'button', word: "All done", icon: "👐" },
  { id: 'desc-yummy', type: 'button', word: "Yummy", icon: "😋" },
  { id: 'desc-yucky', type: 'button', word: "Yucky", icon: "🤢" },
  { id: 'desc-hot', type: 'button', word: "Hot", icon: "🔥" },
  { id: 'desc-cold', type: 'button', word: "Cold", icon: "❄️" },
  { id: 'desc-big', type: 'button', word: "Big", icon: "🐘" },
  { id: 'desc-little', type: 'button', word: "Little", icon: "🐜" },
  { id: 'milk', type: 'button', word: "Milk", icon: "🥛" },
  { id: 'juice', type: 'button', word: "Juice", icon: "🧃" },
  { id: 'water', type: 'button', word: "Water", icon: "💧" },
  { id: 'apple', type: 'button', word: "Apple", icon: "🍎" },
  { id: 'cookie', type: 'button', word: "Cookie", icon: "🍪" },
  { id: 'spoon', type: 'button', word: "Spoon", icon: "🥄" },
  { id: 'bowl', type: 'button', word: "Bowl", icon: "🥣" }
];

const schoolDefaultData = [
  { id: 'social-hello', type: 'button', word: "Hello", icon: "👋" },
  { id: 'social-excuseme', type: 'button', word: "Excuse me", icon: "🙋" },
  { id: 'social-thanks', type: 'button', word: "Thank you", icon: "🙏" },
  { id: 'social-please', type: 'button', word: "Please", icon: "🙏" },
  { id: 'social-friend', type: 'button', word: "Friend", icon: "🧑‍🤝‍🧑" },
  { id: 'social-share', type: 'button', word: "Share", icon: "🤲" },
  { id: 'action-look', type: 'button', word: "Look", icon: "👀" },
  { id: 'action-see', type: 'button', word: "See", icon: "👁️" },
  { id: 'action-turn', type: 'button', word: "Turn", icon: "🔄" },
  { id: 'action-read', type: 'button', word: "Read", icon: "📖" },
  { id: 'action-color', type: 'button', word: "Color", icon: "🖍️" },
  { id: 'action-make', type: 'button', word: "Make", icon: "🛠️" },
  { id: 'action-work', type: 'button', word: "Work", icon: "📝" },
  { id: 'action-sit', type: 'button', word: "Sit", icon: "🪑" }
];

const storeDefaultData = [
  { id: 'obs-look', type: 'button', word: "Look", icon: "👀" },
  { id: 'obs-see', type: 'button', word: "See", icon: "👁️" },
  { id: 'obs-that', type: 'button', word: "That", icon: "👉" },
  { id: 'obs-what', type: 'button', word: "What", icon: "❓" },
  { id: 'obs-hear', type: 'button', word: "Hear", icon: "👂" },
  { id: 'obs-find', type: 'button', word: "Find", icon: "🔍" },
  { id: 'mvmt-go', type: 'button', word: "Go", icon: "🟢" },
  { id: 'mvmt-stop', type: 'button', word: "Stop", icon: "🛑" },
  { id: 'mvmt-in', type: 'button', word: "In", icon: "📥" },
  { id: 'mvmt-out', type: 'button', word: "Out", icon: "📤" },
  { id: 'mvmt-here', type: 'button', word: "Here", icon: "📍" },
  { id: 'mvmt-there', type: 'button', word: "There", icon: "🏁" }
];

const outsideDefaultData = [
  { id: 'action-go', type: 'button', word: "Go", icon: "🟢" },
  { id: 'action-stop', type: 'button', word: "Stop", icon: "🛑" },
  { id: 'action-push', type: 'button', word: "Push", icon: "👐" },
  { id: 'action-run', type: 'button', word: "Run", icon: "🏃" },
  { id: 'action-jump', type: 'button', word: "Jump", icon: "🦘" },
  { id: 'action-slide', type: 'button', word: "Slide", icon: "🛝" },
  { id: 'action-swing', type: 'button', word: "Swing", icon: "⛓️" },
  { id: 'action-climb', type: 'button', word: "Climb", icon: "🧗" },
  { id: 'action-fall', type: 'button', word: "Fall", icon: "🤕" },
  { id: 'dir-up', type: 'button', word: "Up", icon: "⬆️" },
  { id: 'dir-down', type: 'button', word: "Down", icon: "⬇️" },
  { id: 'dir-fast', type: 'button', word: "Fast", icon: "⚡" },
  { id: 'dir-slow', type: 'button', word: "Slow", icon: "🐢" },
  { id: 'dir-over', type: 'button', word: "Over", icon: "⤴️" },
  { id: 'dir-under', type: 'button', word: "Under", icon: "⤵️" },
  { id: 'sound-uhoh', type: 'button', word: "Uh-oh", icon: "😮" },
  { id: 'sound-vroom', type: 'button', word: "Vroom", icon: "🏎️" },
  { id: 'sound-beep', type: 'button', word: "Beep-beep", icon: "🚗" },
  { id: 'sound-wow', type: 'button', word: "Wow", icon: "✨" }
];

const getDefaultDataForContext = (contextId) => {
  switch (contextId) {
    case 'school': return JSON.parse(JSON.stringify(schoolDefaultData));
    case 'mealtime': return JSON.parse(JSON.stringify(mealtimeDefaultData));
    case 'store': return JSON.parse(JSON.stringify(storeDefaultData));
    case 'outside': return JSON.parse(JSON.stringify(outsideDefaultData));
    default: return JSON.parse(JSON.stringify(homeDefaultData));
  }
};

const getContextStorageKey = (ctx) => `kiwi-words-${ctx}`;

function App() {
  const [contexts, setContexts] = useState(() => {
    const saved = localStorage.getItem('kiwi-contexts');
    return saved ? JSON.parse(saved) : INITIAL_CONTEXTS;
  });

  const [currentContext, setCurrentContext] = useState(() => localStorage.getItem('kiwi-context') || 'home');

  const [rootItems, setRootItems] = useState(() => {
    const key = getContextStorageKey(localStorage.getItem('kiwi-context') || 'home');
    const saved = localStorage.getItem(key);
    const data = saved ? JSON.parse(saved) : getDefaultDataForContext(localStorage.getItem('kiwi-context') || 'home');

    // Migration: If data is a flat array, wrap it in a pages structure
    if (Array.isArray(data)) {
      return [{ name: 'Page 1', items: data }];
    }
    return data; // Assume it's already { pages: [...] } or similar
  });

  const [currentLevel, setCurrentLevel] = useState(() => {
    const savedLevel = localStorage.getItem('kiwi-level');
    if (savedLevel !== null) {
      const parsed = parseFloat(savedLevel);
      if (!isNaN(parsed) && LEVELS[parsed]) return parsed;
    }
    const oldPhase = localStorage.getItem('kians-phase');
    if (oldPhase !== null) {
      const parsed = parseInt(oldPhase, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) return migratePhaseToLevel(parsed);
    }
    return 1.1;
  });

  const currentStage = Math.floor(currentLevel);
  const currentPhase = currentStage;

  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('kiwi-onboarding-complete'));
  const [showSplash, setShowSplash] = useState(true);
  const [showLevelIntro, setShowLevelIntro] = useState(false);
  const [showPhase1Selector, setShowPhase1Selector] = useState(false);
  const [phase1TargetId, setPhase1TargetId] = useState(() => localStorage.getItem('kiwi-phase1-target'));

  const [currentPath, setCurrentPath] = useState([]);
  const [stripItems, setStripItems] = useState([]);
  const [showStrip, setShowStrip] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kiwi-voice-settings');
      return saved ? JSON.parse(saved) : { rate: 1, pitch: 1, volume: 1, voiceURI: null };
    } catch { return { rate: 1, pitch: 1, volume: 1, voiceURI: null }; }
  });

  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [isEssentialSkillsMode, setIsEssentialSkillsMode] = useState(false);
  const [trainingSelection, setTrainingSelection] = useState([]);
  const [isScanning, setIsScanning] = useState(() => localStorage.getItem('kiwi-is-scanning') === 'true');
  const [isLayoutLocked, setIsLayoutLocked] = useState(() => localStorage.getItem('kiwi-layout-locked') === 'true');
  const [isColorCodingEnabled, setIsColorCodingEnabled] = useState(() => {
    const saved = localStorage.getItem('kiwi-color-coding-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isCategorizationEnabled] = useState(() => {
    const saved = localStorage.getItem('kiwi-categorization-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [scanIndex, setScanIndex] = useState(-1);
  const [scanSpeed, setScanSpeed] = useState(() => {
    const saved = localStorage.getItem('kiwi-scan-speed');
    return saved ? parseInt(saved, 10) : 2000;
  });
  const [shuffledItems, setShuffledItems] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Tour State & Refs
  const [showTour, setShowTour] = useState(false);
  const controlsHandleRef = useRef(null);
  const mainCardRef = useRef(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState(null);
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('kiwi-child-mode') === 'locked');
  const [lockTapCount, setLockTapCount] = useState(0);
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdvancementModal, setShowAdvancementModal] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [activeVisualScene, setActiveVisualScene] = useState(null);
  const [progressData, setProgressData] = useState(() => {
    try {
      const saved = localStorage.getItem('kians-progress');
      return saved ? JSON.parse(saved) : { currentStreak: 0, successDates: [], lastSuccessTime: null, trials: [] };
    } catch { return { currentStreak: 0, successDates: [], lastSuccessTime: null, trials: [] }; }
  });
  const [isPrompted, setIsPrompted] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [bellCooldown, setBellCooldown] = useState(false);
  const [isCommunicating, setIsCommunicating] = useState(false);
  const [bellSound, setBellSound] = useState(() => localStorage.getItem('kiwi-bell-sound') || 'traditional');
  const [gridSize, setGridSize] = useState(() => {
    const saved = localStorage.getItem('kiwi-grid-size');
    const valid = ['super-big', 'big', 'standard', 'medium', 'dense'];
    return valid.includes(saved) ? saved : 'big';
  });
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('kiwi-color-theme') || 'default');
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem('kiwi-auto-speak');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [proficiencyLevel, setProficiencyLevel] = useState(() => {
    return localStorage.getItem('kiwi-proficiency-level') || 'beginner';
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showCategoryHeaders, setShowCategoryHeaders] = useState(() => {
    const saved = localStorage.getItem('kiwi-show-category-headers');
    return saved !== null ? saved === 'true' : true;
  });
  const [collapsedSections, setCollapsedSections] = useState(() => {
    const saved = localStorage.getItem('kiwi-collapsed-sections');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  const [speechDelay, setSpeechDelay] = useState(() => {
    const saved = localStorage.getItem('kiwi-speech-delay');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [inflectionData, setInflectionData] = useState(null);
  const [biometricUnlockTimestamp, setBiometricUnlockTimestamp] = useState(null);

  const lastSpeakTimeRef = useRef({});

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const { currentProfile, updateProfile, updateAccessProfile, pronunciations } = useProfile();

  /* 
  // Sync isScanning with Access Profile Selection Type (Disabled until Switch/Eye Gaze returns)
  useEffect(() => {
    if (currentProfile?.accessProfile?.selectionType === 'scan') {
      if (!isScanning) setIsScanning(true);
    } else {
      if (isScanning && currentProfile?.accessProfile?.selectionType) { // Avoid false positive on initial load
        setIsScanning(false);
      }
    }
  }, [currentProfile?.accessProfile?.selectionType]);
  */

  const currentPageItems = rootItems[currentPageIndex]?.items || [];
  let itemsToShow = currentPath.length === 0
    ? currentPageItems
    : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems);

  // Dynamic Core Overlay: Prepend core words if at root (and not in Training Mode)
  if (currentPath.length === 0 && !isTrainingMode && currentPhase > 2) {
    // Only prepend if they aren't already there (to avoid duplication if they were saved in rootItems)
    const coreIds = new Set(CORE_WORDS_DATA.map(c => c.id));
    const fringeItems = itemsToShow.filter(i => !coreIds.has(i.id));
    itemsToShow = [...CORE_WORDS_DATA, ...fringeItems];
  }

  // Phase Filtering
  if (isTrainingMode && shuffledItems) {
    itemsToShow = shuffledItems.map(obj => obj.item);
  } else if (currentPhase === 1 || currentPhase === 2) {
    let target = phase1TargetId ? currentPageItems.find(i => i.id === phase1TargetId) : null;
    if (!target) {
      const allowedIds = ['snack-generic', 'play-generic', 'toy-generic', 'mom', 'dad'];
      target = currentPageItems.find(i => i.type === 'button' && allowedIds.includes(i.id));
    }
    itemsToShow = target ? [target] : [];
  } else if (currentPhase === 3) {
    itemsToShow = currentPageItems.filter(i => i.type === 'button' && i.category !== 'starter').slice(0, 20);
  } else if (currentPhase > 0 && currentPhase < 6) {
    itemsToShow = itemsToShow.filter(i => i.category !== 'starter');
  }

  // Categorization Sorting
  if (isCategorizationEnabled && !isTrainingMode && currentPhase > 2 && currentPath.length === 0) {
    const categoryOrder = ['core', 'pronoun', 'verb', 'adj', 'noun', 'social', 'question', 'misc', 'unknown'];
    itemsToShow = [...itemsToShow].sort((a, b) => {
      const getCat = (item) => {
        const lexiconEntry = item.word ? AAC_LEXICON[item.word.toLowerCase()] : null;
        return item.category || item.wc || lexiconEntry?.type || 'unknown';
      };
      const catA = getCat(a);
      const catB = getCat(b);
      return categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
    });
  }

  // Progressive Revelation Logic
  itemsToShow = itemsToShow.map((item, index) => {
    let isRevealed = true;
    if (proficiencyLevel === 'beginner' && index >= 20) isRevealed = false;
    else if (proficiencyLevel === 'intermediate' && index >= 50) isRevealed = false;
    if (item.category === 'core') isRevealed = true; // Always show core
    return { ...item, isRevealed };
  });

  // Filter for Auto-Scanning (excluding collapsed sections)
  const visibleItemsForScanning = itemsToShow.filter(item => {
    if (!isCategorizationEnabled) return true;
    const lexiconEntry = item.word ? AAC_LEXICON[item.word.toLowerCase()] : null;
    const category = item.category || item.wc || lexiconEntry?.type || 'unknown';
    return !collapsedSections.includes(category);
  });

  const handleAddNewPage = () => {
    const newPage = { name: `Page ${rootItems.length + 1}`, items: [] };
    setRootItems([...rootItems, newPage]);
    setCurrentPageIndex(rootItems.length);
  };

  const handleDeletePage = (index) => {
    if (rootItems.length <= 1) return;
    if (confirm("Delete this entire page?")) {
      const newPages = rootItems.filter((_, i) => i !== index);
      setRootItems(newPages);
      setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
    }
  };

  const triggerPaywall = async (feature, cb) => {
    try {
      const { triggerPaywall: trigger } = await import('./utils/paywall');
      const { hasAccess } = await trigger(feature);
      if (hasAccess && cb) cb();
    } catch (error) {
      console.error('Paywall trigger failed:', error);
      if (cb) cb(); // Fallback to allowing access
    }
  };

  const handleSetLevel = (newLevel) => { setCurrentLevel(newLevel); const resetProgress = { ...progressData, currentStreak: 0, successDates: [], lastSuccessTime: null }; setProgressData(resetProgress); localStorage.setItem('kians-progress', JSON.stringify(resetProgress)); };
  const handleSetPhase = (newPhase) => handleSetLevel(migratePhaseToLevel(newPhase));
  const handleAdvance = () => { const nextLevel = getNextLevel(currentLevel); if (nextLevel) handleSetLevel(nextLevel); setShowAdvancementModal(false); };
  const handleWait = () => { setShowAdvancementModal(false); const resetProgress = { ...progressData, currentStreak: 0, successDates: [], lastSuccessTime: null }; setProgressData(resetProgress); localStorage.setItem('kians-progress', JSON.stringify(resetProgress)); };



  useEffect(() => {
    const attemptCloudRestore = async () => {
      let relationalSyncService;
      try {
        const module = await import('./services/RelationalSyncService');
        relationalSyncService = module.default;
      } catch (e) {
        console.error('Failed to load RelationalSyncService', e);
        return;
      }

      if (!relationalSyncService.isConfigured()) return;
      const onboardingComplete = localStorage.getItem('kiwi-onboarding-complete');
      if (onboardingComplete) return;

      try {
        const restored = await relationalSyncService.restoreFromCloud();

        if (restored) {
          console.log('☁️ Data restored automatically from cloud');
          if (restored.profile) {
            updateProfile('default', {
              name: restored.profile.name,
              avatar: restored.profile.avatar,
              pecs_phase: restored.profile.pecs_phase
            });
            if (restored.profile.onboarding_complete) {
              localStorage.setItem('kiwi-onboarding-complete', 'true');
              setShowOnboarding(false);
            }
            if (restored.profile.pecs_phase) {
              handleSetLevel(migratePhaseToLevel(restored.profile.pecs_phase));
            }
          }

          if (restored.boards && restored.boards.home) {
            const homeData = restored.boards.home;
            setRootItems(Array.isArray(homeData) ? [{ name: 'Page 1', items: homeData }] : homeData);
          }
          window.location.reload();
        }
      } catch (error) {
        console.error('Cloud restore failed:', error);
      }
    };

    const initializeApp = async () => {
      let revenueCatService = null;

      // Initialize RevenueCat SDK on app startup
      try {
        const module = await import('./services/RevenueCatService');
        revenueCatService = module.default;
        const userId = currentProfile?.id || null;
        await revenueCatService.initialize(userId);
        console.log('✅ RevenueCat initialized in App.jsx');
      } catch (error) {
        console.error('❌ Failed to initialize RevenueCat:', error);
      }

      let canUseCloudSync = false;
      let cloudSyncService = null;
      try {
        const csModule = await import('./services/CloudSyncService');
        cloudSyncService = csModule.default;

        if (cloudSyncService && cloudSyncService.isConfigured() && revenueCatService) {
          canUseCloudSync = await revenueCatService.hasPremiumAccess();
        }
      } catch (error) {
        console.error('Failed to verify cloud sync entitlement:', error);
      }

      if (canUseCloudSync && cloudSyncService) {
        await attemptCloudRestore();
        // Auto-sync if a cloud code is active
        cloudSyncService.autoSync();
      }
    };

    initializeApp();

    // Ensure a high-quality voice is selected
    const initVoice = async () => {
      const bestUri = await ensureDefaultVoice(voiceSettings.voiceURI, currentProfile?.accessProfile?.language === 'es' ? 'es-ES' : 'en-US');
      if (bestUri && bestUri !== voiceSettings.voiceURI) {
        setVoiceSettings(prev => ({ ...prev, voiceURI: bestUri }));
      }
    };
    initVoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { localStorage.setItem('kiwi-contexts', JSON.stringify(contexts)); }, [contexts]);
  useEffect(() => { localStorage.setItem('kiwi-speech-delay', speechDelay.toString()); }, [speechDelay]);
  useEffect(() => { if (phase1TargetId) localStorage.setItem('kiwi-phase1-target', phase1TargetId); }, [phase1TargetId]);
  useEffect(() => { localStorage.setItem('kiwi-bell-sound', bellSound); }, [bellSound]);
  useEffect(() => { localStorage.setItem('kiwi-auto-speak', JSON.stringify(autoSpeak)); }, [autoSpeak]);
  useEffect(() => { localStorage.setItem('kiwi-is-scanning', isScanning.toString()); }, [isScanning]);
  useEffect(() => { localStorage.setItem('kiwi-scan-speed', scanSpeed.toString()); }, [scanSpeed]);
  useEffect(() => { localStorage.setItem('kiwi-layout-locked', isLayoutLocked.toString()); }, [isLayoutLocked]);
  useEffect(() => { localStorage.setItem('kiwi-color-coding-enabled', isColorCodingEnabled.toString()); }, [isColorCodingEnabled]);
  useEffect(() => { localStorage.setItem('kiwi-categorization-enabled', isCategorizationEnabled.toString()); }, [isCategorizationEnabled]);
  useEffect(() => { localStorage.setItem('kiwi-proficiency-level', proficiencyLevel); }, [proficiencyLevel]);
  useEffect(() => { localStorage.setItem('kiwi-show-category-headers', showCategoryHeaders.toString()); }, [showCategoryHeaders]);
  useEffect(() => { localStorage.setItem('kiwi-collapsed-sections', JSON.stringify(collapsedSections)); }, [collapsedSections]);

  // Color Theme Application
  useEffect(() => {
    localStorage.setItem('kiwi-color-theme', colorTheme);

    // Apply theme colors to CSS variables
    const themes = {
      default: { primary: '#1A535C', bg: '#FAFAFA' },
      ocean: { primary: '#0EA5E9', bg: '#E8F4FC' },
      sunset: { primary: '#F97316', bg: '#FFF7ED' },
      forest: { primary: '#22C55E', bg: '#F0FDF4' },
      berry: { primary: '#A855F7', bg: '#FAF5FF' },
      candy: { primary: '#EC4899', bg: '#FDF2F8' },
    };

    const theme = themes[colorTheme] || themes.default;
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--btn-primary-bg', theme.primary);

    // Update background gradient based on theme
    const darkerBg = theme.bg.replace(/\d+/g, (match) => Math.max(0, parseInt(match) - 10).toString());
    root.style.setProperty('--bg-gradient', `linear-gradient(180deg, ${theme.bg} 0%, ${darkerBg} 100%)`);

    // Update shadow colors to match theme
    const primaryWithAlpha = theme.primary + '1A'; // Add alpha for shadow
    root.style.setProperty('--shadow-color', primaryWithAlpha);

  }, [colorTheme]);

  // Auto-scanning Logic
  useEffect(() => {
    const anyModalOpen = editModalOpen || pickerOpen || showDashboard || showOnboarding || showLevelIntro || showAdvancementModal || showCalibration;

    if (!isScanning || anyModalOpen) {
      if (!anyModalOpen) setScanIndex(-1);
      return;
    }

    const interval = setInterval(() => {
      setScanIndex(prev => {
        if (visibleItemsForScanning.length === 0) return -1;
        return (prev + 1) % visibleItemsForScanning.length;
      });
    }, scanSpeed);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning, scanSpeed, visibleItemsForScanning.length, editModalOpen, pickerOpen, showDashboard, showOnboarding, showLevelIntro, showAdvancementModal, showCalibration]);


  useEffect(() => {
    if (typeof currentLevel === 'number' && !isNaN(currentLevel)) {
      localStorage.setItem('kiwi-level', currentLevel.toString());
    }
    const levelDef = getLevel(currentLevel);
    const shouldShowStrip = !!levelDef?.showStrip;
    if (showStrip !== shouldShowStrip) {
      setTimeout(() => setShowStrip(shouldShowStrip), 0);
    }
    if (currentPath.length > 0) {
      setTimeout(() => setCurrentPath([]), 0);
    }
  }, [currentLevel, currentPath.length, showStrip]);

  // Auto-lock biometric session after 5 minutes
  useEffect(() => {
    if (!biometricUnlockTimestamp) return;

    const timeout = setTimeout(() => {
      setBiometricUnlockTimestamp(null);
      console.log('Biometric session expired after 5 minutes');
    }, 5 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [biometricUnlockTimestamp]);

  // Auto-detect device DPI on first app load (Phase 30: Physical Scaling)
  useEffect(() => {
    const { accessProfile } = currentProfile || {};

    // Only detect if not already set
    if (accessProfile && accessProfile.deviceDPI === null) {
      const detectedDPI = getDeviceDPI();
      console.log('Physical Scaling: Auto-detected DPI:', detectedDPI);

      updateAccessProfile({
        deviceDPI: detectedDPI,
        dpiCalibrated: false // Mark as auto-detected, not calibrated
      });
    }
  }, [currentProfile?.id]); // Run when profile changes

  const handleSetContext = (id) => {
    setCurrentContext(id);
    localStorage.setItem('kiwi-context', id);
    if (currentPath.length > 0) setCurrentPath([]);
    setCurrentPageIndex(0); // Reset to first page
    const key = getContextStorageKey(id);
    const saved = localStorage.getItem(key);
    let data = saved ? JSON.parse(saved) : getDefaultDataForContext(id);

    if (Array.isArray(data)) {
      data = [{ name: 'Page 1', items: data }];
    }
    setRootItems(data);
  };

  const handleAddContext = (label, icon) => {
    const newId = 'ctx-' + new Date().getTime();
    const newContexts = [...contexts, { id: newId, label, icon }];
    setContexts(newContexts);
    handleSetContext(newId);
  };

  const handleRenameContext = (id, newLabel, icon) => {
    setContexts(contexts.map(c => c.id === id ? { ...c, label: newLabel, icon } : c));
  };

  const handleDeleteContext = (id) => {
    if (confirm('Delete this location?')) {
      setContexts(contexts.filter(c => c.id !== id));
      if (currentContext === id) handleSetContext('home');
    }
  };

  const handleApplyTemplate = (templateName) => {
    const wordList = TEMPLATES[templateName];
    if (!wordList) return;

    // Hydrate items from lexicon
    const hydratedItems = wordList.map((word, index) => {
      const lowerWord = word.toLowerCase();
      const lexiconEntry = AAC_LEXICON[lowerWord];
      const coreMatch = CORE_WORDS_LAYOUT.find(c => c.word.toLowerCase() === lowerWord);

      return {
        id: `template-${lowerWord}-${Date.now()}-${index}`,
        type: 'button',
        word: word, // Keep original casing from template
        icon: lexiconEntry?.emoji || '⚪',
        wc: coreMatch?.wc || lexiconEntry?.type || 'misc',
        category: coreMatch?.wc || lexiconEntry?.type || 'misc'
      };
    });

    // Determine grid structure
    let newRootItems;
    // Always use paged structure now
    const pageSize = 20; // Default page size for templates
    const pages = [];
    for (let i = 0; i < hydratedItems.length; i += pageSize) {
      pages.push({
        name: `Page ${pages.length + 1}`,
        items: hydratedItems.slice(i, i + pageSize)
      });
    }

    newRootItems = pages;

    setRootItems(newRootItems);

    // Reset path to root
    setCurrentPath([]);
    setCurrentPageIndex(0);

    // Save to storage (specific to context)
    const key = getContextStorageKey(currentContext);
    localStorage.setItem(key, JSON.stringify(newRootItems));

    setToastMessage(`Applied template: ${templateName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Expose handler for Controls.jsx (which can't easily access context/props in current arch)
  useEffect(() => {
    window.handleApplyTemplate = handleApplyTemplate;
    return () => { delete window.handleApplyTemplate; };
  }, [currentContext]);

  const speak = (text, customAudio = null) => {
    if (customAudio) { new Audio(customAudio).play(); return; }
    if (!synth) return;
    if (synth.speaking) synth.cancel();

    const lang = currentProfile?.accessProfile?.language || 'en';

    // Phonetic Override Logic
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
      if (selectedVoice) {
        u.voice = selectedVoice;
      } else {
        // Fallback to any voice matching current lang
        const langVoice = voices.find(v => v.lang.startsWith(lang));
        if (langVoice) u.voice = langVoice;
      }
    } else {
      // Auto-select a voice for the current language if none saved
      const voices = synth.getVoices();
      const langVoice = voices.find(v => v.lang.startsWith(lang));
      if (langVoice) u.voice = langVoice;
    }
    synth.speak(u);
  };

  const speakSentence = async (items) => {
    if (synth) synth.cancel();

    for (const item of items) {
      await new Promise((resolve) => {
        if (item.customAudio) {
          const audio = new Audio(item.customAudio);
          audio.onended = resolve;
          audio.onerror = resolve; // Don't get stuck if audio fails
          audio.play();
        } else {
          // Phonetic Override Logic
          let processedText = item.word;
          if (pronunciations) {
            const words = item.word.split(/\s+/);
            const processedWords = words.map(w => {
              const cleanWord = w.toLowerCase().replace(/[.,!?;:]/g, '');
              return pronunciations[cleanWord] || w;
            });
            processedText = processedWords.join(' ');
          }

          const u = new SpeechSynthesisUtterance(processedText);
          u.rate = voiceSettings.rate;
          u.pitch = voiceSettings.pitch;
          u.volume = voiceSettings.volume || 1;

          if (voiceSettings.voiceURI) {
            const voices = synth.getVoices();
            const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
            if (selectedVoice) u.voice = selectedVoice;
          }

          u.onend = resolve;
          u.onerror = resolve;
          synth.speak(u);
        }
      });
      // Small gap between words
      await new Promise(r => setTimeout(r, 100));
    }
  };

  const triggerSuccess = () => {
    setShowSuccess(true); document.body.classList.add('success-flash');
    const today = new Date().toISOString().split('T')[0];
    const newProgress = { ...progressData };
    if (!newProgress.trials) newProgress.trials = [];
    const now = new Date().getTime();
    newProgress.trials.push({ date: today, timestamp: now, level: currentLevel, phase: currentPhase, isPrompted: isPrompted });
    if (!isPrompted) newProgress.currentStreak += 1; else newProgress.currentStreak = 0;
    if (currentPhase === 4 && !isPrompted) {
      if (newProgress.trials.filter(t => t.phase === 4 && !t.isPrompted).length === 5) {
        if (!rootItems.find(i => i.word === "Describe")) {
          const list = [...rootItems, attributesFolder];
          setRootItems(list);
          alert("🎉 Great Job! The &apos;Describe&apos; folder has been added.");
        }
      }
    }
    const levelDef = getLevel(currentLevel);
    if (levelDef && levelDef.next) {
      const levelTrials = newProgress.trials.filter(t => t.level === currentLevel);
      if (levelTrials.length >= (levelDef.threshold || 20)) {
        const independent = levelTrials.filter(t => !t.isPrompted).length;
        const accuracy = (independent / levelTrials.length) * 100;
        if (!levelDef.accuracy || accuracy >= levelDef.accuracy) {
          const advanceKey = `kiwi-auto-advance-${currentLevel}-shown`;
          if (!localStorage.getItem(advanceKey)) {
            localStorage.setItem(advanceKey, 'true');
            setTimeout(() => { if (confirm(`🎉 Ready to advance to Level ${levelDef.next}?`)) handleSetLevel(levelDef.next); }, 500);
          }
        }
      }
    }
    newProgress.lastSuccessTime = now;
    if (newProgress.currentStreak >= 3) {
      if (!newProgress.successDates.includes(today)) newProgress.successDates.push(today);
      if (newProgress.successDates.length > 3) newProgress.successDates = newProgress.successDates.slice(-3);
      if (newProgress.successDates.length === 3) {
        const dates = newProgress.successDates.map(d => new Date(d));
        let consecutive = true;
        for (let i = 1; i < dates.length; i++) if (Math.round((dates[i] - dates[i - 1]) / 86400000) !== 1) consecutive = false;
        if (consecutive && currentPhase < 6) setShowAdvancementModal(true);
      }
      newProgress.currentStreak = 0;
    }
    if (newProgress.trials.length === 20 || newProgress.trials.length === 50) { try { InAppReview.requestReview(); } catch (error) { console.log('Review request skipped:', error); } }
    setProgressData(newProgress); localStorage.setItem('kians-progress', JSON.stringify(newProgress));
    setIsPrompted(false);
    setTimeout(() => { document.body.classList.remove('success-flash'); setShowSuccess(false); if (currentPhase === 2) setIsCommunicating(false); }, 1200);
  };

  const handleItemClick = useCallback(async (item, index) => {
    // Analytics tracking
    trackItemClick(item.id || item.word, item.word);

    // Smart Haptics
    try {
      let hapticStyle = ImpactStyle.Medium;
      const lowerWord = item.word?.toLowerCase();
      const lexiconEntry = lowerWord ? AAC_LEXICON[lowerWord] : null;
      const wc = item.wc || lexiconEntry?.type;

      if (lowerWord === 'stop' || lowerWord === 'no') hapticStyle = ImpactStyle.Heavy;
      else if (wc === 'social' || wc === 'pronoun') hapticStyle = ImpactStyle.Light;
      else if (wc === 'misc') hapticStyle = ImpactStyle.Soft;

      await Haptics.impact({ style: hapticStyle });
    } catch { /* Ignore */ }

    if (item.bgColor === '#FFF3E0') {
      const updatedItems = rootItems.map(i => i.id === item.id ? { ...i, usageCount: (i.usageCount || 0) + 1, lastUsed: new Date().getTime() } : i);
      setRootItems(updatedItems);
    }
    if (item.type === 'folder') setCurrentPath([...currentPath, index]);
    else if (item.type === 'visual_scene') {
      setActiveVisualScene(item);
    }
    else {
      // Repetition Delay Logic
      const now = Date.now();
      const lang = currentProfile?.accessProfile?.language || 'en';
      const localizedWord = item.labels?.[lang] ||
        MIRROR_DICTIONARY[item.word.toLowerCase()]?.[lang] ||
        item.word;

      const lastTime = lastSpeakTimeRef.current[item.word] || 0;
      if (now - lastTime < speechDelay * 1000) {
        console.log(`Speech delay active for: ${item.word}`);
        return;
      }
      lastSpeakTimeRef.current[item.word] = now;

      // Grammar Inflection Logic
      const lexiconEntry = AAC_LEXICON[item.word] || AAC_LEXICON[item.word.toLowerCase()];
      if (lexiconEntry?.type === 'verb' && stripItems.length > 0) {
        const lastItem = stripItems[stripItems.length - 1];
        const lastLexiconEntry = AAC_LEXICON[lastItem.word] || AAC_LEXICON[lastItem.word.toLowerCase()];
        if (lastLexiconEntry?.type === 'pronoun') {
          setInflectionData({ item, verbEntry: lexiconEntry, index });
          // We'll still add the base verb, but show the bubble for alternatives
        }
      }

      if (currentPhase === 1 || currentPhase === 2) { speak(localizedWord, item.customAudio); triggerSuccess(); return; }
      if (currentPhase === 4 && stripItems.length === 0) {
        if (item.word === "I want") { setStripItems([item]); if (autoSpeak) speak(localizedWord, item.customAudio); }
        else {
          const iWantRoot = rootItems.find(i => i.word === "I want");
          if (iWantRoot) {
            setStripItems([iWantRoot, item]);
            if (autoSpeak) {
              if (iWantRoot.customAudio) {
                speakSentence([iWantRoot, item]);
              } else {
                const iWantLocalized = iWantRoot.labels?.[lang] || MIRROR_DICTIONARY["i want"]?.[lang] || "I want";
                speak(iWantLocalized + " " + localizedWord, item.customAudio);
              }
            }
            triggerSuccess();
          }
        }
        return;
      }
      if (showStrip) {
        setStripItems([...stripItems, item]);
        if (autoSpeak) speak(localizedWord, item.customAudio);
        if (currentPhase >= 3) triggerSuccess();
      }
      else { speak(localizedWord, item.customAudio); triggerSuccess(); }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootItems, currentPath, currentProfile, speechDelay, stripItems, currentPhase, autoSpeak, showStrip, voiceSettings, pronunciations]);
  // Global Switch Listener (Space/Enter or Screen Tap when scanning)
  useEffect(() => {
    const handleGlobalSwitch = (e) => {
      if (!isScanning) return;

      // If it's a keyboard event, check for Space or Enter
      if (e.type === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;

      // If it's a click, we only trigger if it's NOT on a settings button or modal
      if (e.type === 'click') {
        if (e.target.closest('#settings-button') || e.target.closest('#controls-content') || e.target.closest('.ios-bottom-sheet')) return;
      }

      if (scanIndex >= 0 && scanIndex < visibleItemsForScanning.length) {
        e.preventDefault();
        e.stopPropagation();
        handleItemClick(visibleItemsForScanning[scanIndex], scanIndex);
      }
    };

    window.addEventListener('keydown', handleGlobalSwitch);
    window.addEventListener('click', handleGlobalSwitch, true); // Use capture phase
    return () => {
      window.removeEventListener('keydown', handleGlobalSwitch);
      window.removeEventListener('click', handleGlobalSwitch, true);
    };
  }, [isScanning, scanIndex, visibleItemsForScanning, handleItemClick]);

  const handleDeleteItemFromStrip = (index) => {
    const newItems = [...stripItems];
    newItems.splice(index, 1);
    setStripItems(newItems);
    try { Haptics.impact({ style: ImpactStyle.Light }); } catch { /* Ignore */ }
  };

  const handleBack = () => setCurrentPath(currentPath.slice(0, -1));
  const handleDelete = (index) => {
    if (confirm("Delete this item?")) {
      const currentPageItems = rootItems[currentPageIndex]?.items || [];
      const list = [...currentPath.length === 0 ? currentPageItems : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems)];
      list.splice(index, 1);

      const newRootItems = [...rootItems];
      if (currentPath.length === 0) {
        newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: list };
      }
      else {
        let target = newRootItems[currentPageIndex].items;
        for (let i = 0; i < currentPath.length - 1; i++) target = target[currentPath[i]].contents;
        target[currentPath[currentPath.length - 1]].contents = list;
      }
      setRootItems(newRootItems);
    }
  };

  const handleEdit = (index) => { setEditingItemIndex(index); setEditModalOpen(true); };
  const handleSaveEdit = (newWord, newIcon, newBgColor, newViewMode, newCustomAudio, newCharacterConfig, newWc) => {
    if (editingItemIndex === null) return;
    const currentPageItems = rootItems[currentPageIndex]?.items || [];
    const currentList = currentPath.length === 0 ? currentPageItems : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems);
    const item = currentList[editingItemIndex];
    const newItem = { ...item, word: newWord, icon: newIcon, bgColor: newBgColor, customAudio: newCustomAudio, characterConfig: newCharacterConfig, wc: newWc };
    if (item.type === 'folder') newItem.viewMode = newViewMode;
    const newList = [...currentList]; newList[editingItemIndex] = newItem;

    const newRootItems = [...rootItems];
    if (currentPath.length === 0) {
      newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: newList };
    }
    else {
      let target = newRootItems[currentPageIndex].items;
      for (let i = 0; i < currentPath.length - 1; i++) target = target[currentPath[i]].contents;
      target[currentPath[currentPath.length - 1]].contents = newList;
    }
    setRootItems(newRootItems);
    setEditModalOpen(false); setEditingItemIndex(null);
  };



  const handleAddItem = async (word, icon, type) => {
    const currentPageItems = rootItems[currentPageIndex]?.items || [];
    const list = [...currentPath.length === 0 ? currentPageItems : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems)];

    // Count total icons (excluding folders) across all items
    const countIcons = (items) => {
      return items.reduce((count, item) => {
        if (item.type === 'folder') {
          return count + countIcons(item.contents || []);
        }
        return count + 1;
      }, 0);
    };
    const totalIconCount = rootItems.reduce((total, page) => total + countIcons(page.items || []), 0);

    // Check vocabulary limit if adding a button (not a folder)
    if (type !== 'folder') {
      try {
        const { checkUnlimitedVocabulary } = await import('./utils/paywall');
        const hasAccess = await checkUnlimitedVocabulary(totalIconCount);
        if (!hasAccess) return; // User declined or not subscribed
      } catch (error) {
        console.error('Failed to check vocabulary limit:', error);
        // Continue anyway in case of error
      }
    }

    const newItem = type === 'folder' ? { id: 'item-' + new Date().getTime(), type: 'folder', word: word || 'New Folder', icon: icon || '📁', contents: [] } : { id: 'item-' + new Date().getTime(), type: 'button', word: word || 'New Item', icon: icon || '⚪' };
    const newList = [...list, newItem];

    const newRootItems = [...rootItems];
    if (currentPath.length === 0) {
      newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: newList };
    }
    else {
      let target = newRootItems[currentPageIndex].items;
      for (let i = 0; i < currentPath.length - 1; i++) target = target[currentPath[i]].contents;
      target[currentPath[currentPath.length - 1]].contents = newList;
    }
    setRootItems(newRootItems);

    // Save to localStorage (FIX: This was missing!)
    const key = getContextStorageKey(currentContext);
    localStorage.setItem(key, JSON.stringify(newRootItems));

    setEditingItemIndex(newList.length - 1); setEditModalOpen(true);
  };

  const isPersonItem = (item) => {
    if (!item || item.type !== 'button') return false;
    if (item.isCustomPerson || item.characterConfig?.type === 'multiavatar') return true;
    if (typeof item.icon === 'string' && item.icon.includes('/images/memojis/')) return true;
    return false;
  };

  const countCustomPeopleInItems = (items) => {
    return (items || []).reduce((count, item) => {
      if (item.type === 'folder') {
        return count + countCustomPeopleInItems(item.contents || []);
      }
      return count + (item.isCustomPerson || item.characterConfig?.type === 'multiavatar' ? 1 : 0);
    }, 0);
  };

  const countCustomPhotosInItems = (items) => {
    return (items || []).reduce((count, item) => {
      if (item.type === 'folder') {
        return count + countCustomPhotosInItems(item.contents || []);
      }
      if (item.isCustomPerson || item.characterConfig?.type === 'multiavatar') {
        return count;
      }
      const icon = item.icon;
      const isCustomPhoto = typeof icon === 'string' && (icon.startsWith('data:') || icon.startsWith('db:'));
      return count + (isCustomPhoto ? 1 : 0);
    }, 0);
  };

  const getPersonInsertIndex = (items) => {
    let lastPersonIndex = -1;
    items.forEach((item, index) => {
      if (isPersonItem(item)) lastPersonIndex = index;
    });
    if (lastPersonIndex >= 0) return lastPersonIndex + 1;
    let fallbackIndex = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].category === 'starter' || items[i].category === 'core') fallbackIndex = i + 1;
      else break;
    }
    return fallbackIndex;
  };

  const findPersonInItems = (items, personId) => {
    for (const item of items || []) {
      if (!item) continue;
      if (item.id === personId) return item;
      if (item.type === 'folder') {
        const found = findPersonInItems(item.contents || [], personId);
        if (found) return found;
      }
    }
    return null;
  };

  const findPersonInPages = (pages, personId) => {
    for (const page of pages || []) {
      const found = findPersonInItems(page?.items || [], personId);
      if (found) return found;
    }
    return null;
  };

  const updatePersonInItems = (items, personId, updater) => {
    let didUpdate = false;
    const nextItems = (items || []).map(item => {
      if (!item) return item;
      if (item.id === personId) {
        didUpdate = true;
        return updater(item);
      }
      if (item.type === 'folder') {
        const [updatedContents, updated] = updatePersonInItems(item.contents || [], personId, updater);
        if (updated) {
          didUpdate = true;
          return { ...item, contents: updatedContents };
        }
      }
      return item;
    });
    return [nextItems, didUpdate];
  };

  const updatePersonAcrossPages = (pages, personId, updater) => {
    let didUpdate = false;
    const nextPages = (pages || []).map(page => {
      const [updatedItems, updated] = updatePersonInItems(page?.items || [], personId, updater);
      if (updated) {
        didUpdate = true;
        return { ...page, items: updatedItems };
      }
      return page;
    });
    return [nextPages, didUpdate];
  };

  const removePersonFromItems = (items, personId) => {
    let removedItem = null;
    let didRemove = false;
    const nextItems = [];
    for (const item of items || []) {
      if (!item) continue;
      if (item.id === personId) {
        removedItem = item;
        didRemove = true;
        continue;
      }
      if (item.type === 'folder') {
        const [updatedContents, removed, removedFromChild] = removePersonFromItems(item.contents || [], personId);
        if (removed) {
          didRemove = true;
          if (removedFromChild) removedItem = removedFromChild;
          nextItems.push({ ...item, contents: updatedContents });
          continue;
        }
      }
      nextItems.push(item);
    }
    return [nextItems, didRemove, removedItem];
  };

  const removePersonAcrossPages = (pages, personId) => {
    let removedPerson = null;
    let didRemove = false;
    const nextPages = (pages || []).map(page => {
      const [updatedItems, removed, removedItem] = removePersonFromItems(page?.items || [], personId);
      if (removed) {
        didRemove = true;
        if (!removedPerson && removedItem) removedPerson = removedItem;
        return { ...page, items: updatedItems };
      }
      return page;
    });
    return [nextPages, didRemove, removedPerson];
  };

  const handleAddPerson = async ({ name, icon, config }) => {
    const currentPageItems = rootItems[currentPageIndex]?.items || [];
    const totalCustomPeople = rootItems.reduce((sum, page) => sum + countCustomPeopleInItems(page.items || []), 0);
    try {
      const { checkUnlimitedPeople } = await import('./utils/paywall');
      const hasAccess = await checkUnlimitedPeople(totalCustomPeople);
      if (!hasAccess) return;
    } catch (error) {
      console.error('Failed to check people limit:', error);
    }

    const trimmedName = (name || '').trim() || 'Friend';
    let finalIcon = icon;

    if (typeof icon === 'string' && icon.startsWith('data:')) {
      const mediaId = `avatar-${Date.now()}`;
      try {
        await saveMedia(mediaId, icon);
        finalIcon = `db:${mediaId}`;
      } catch (error) {
        console.warn('Failed to store avatar media');
      }
    }

    const newPerson = {
      id: `person-${Date.now()}`,
      type: 'button',
      word: trimmedName,
      icon: finalIcon,
      category: 'pronoun',
      wc: 'pronoun',
      isCustomPerson: true,
      characterConfig: config || null,
      role: config?.role || 'other'
    };

    const newList = [...currentPageItems];
    const insertIndex = getPersonInsertIndex(newList);
    newList.splice(insertIndex, 0, newPerson);

    const newRootItems = [...rootItems];
    newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: newList };
    setRootItems(newRootItems);
  };

  const handleUpdatePerson = async (personId, { name, icon, config }) => {
    const person = findPersonInPages(rootItems, personId);
    if (!person) return;

    const trimmedName = (name || '').trim() || person.word || 'Friend';
    const previousIcon = person.icon;
    let finalIcon = icon || person.icon;

    if (typeof finalIcon === 'string' && finalIcon.startsWith('data:')) {
      const mediaId = `avatar-${Date.now()}`;
      try {
        await saveMedia(mediaId, finalIcon);
        finalIcon = `db:${mediaId}`;
      } catch (error) {
        console.warn('Failed to store avatar media');
      }
    }

    if (typeof previousIcon === 'string' && previousIcon.startsWith('db:') && previousIcon !== finalIcon) {
      const mediaId = previousIcon.split(':')[1];
      try {
        await deleteMedia(mediaId);
      } catch (error) {
        console.warn('Failed to delete avatar media');
      }
    }

    const updatedPerson = {
      ...person,
      word: trimmedName,
      icon: finalIcon,
      isCustomPerson: person.isCustomPerson || config?.type === 'multiavatar',
      characterConfig: config || person.characterConfig || null,
      role: config?.role || person.role || 'other'
    };

    const [nextPages, didUpdate] = updatePersonAcrossPages(rootItems, personId, () => updatedPerson);
    if (didUpdate) setRootItems(nextPages);
  };

  const handleRemovePerson = async (personId) => {
    const [nextPages, didRemove, removedPerson] = removePersonAcrossPages(rootItems, personId);
    if (!didRemove || !removedPerson) return;

    setRootItems(nextPages);

    if (typeof removedPerson.icon === 'string' && removedPerson.icon.startsWith('db:')) {
      const mediaId = removedPerson.icon.split(':')[1];
      try {
        await deleteMedia(mediaId);
      } catch (error) {
        console.warn('Failed to delete avatar media');
      }
    }
  };

  const handleToggleTraining = (index) => { if (trainingSelection.includes(index)) setTrainingSelection(trainingSelection.filter(i => i !== index)); else setTrainingSelection([...trainingSelection, index]); };
  const handleShuffle = () => {
    const currentPageItems = rootItems[currentPageIndex]?.items || [];
    const list = currentPath.length === 0 ? currentPageItems : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems);
    const selected = trainingSelection.map(i => ({ item: list[i], originalIndex: i }));
    selected.sort(() => Math.random() - 0.5);
    setShuffledItems(selected);
  };
  const handleStopTraining = () => { setIsTrainingMode(false); setShuffledItems(null); setTrainingSelection([]); setIsEditMode(false); };
  const handlePickerOpen = (setWord, setIcon) => {
    setPickerCallback(() => (w, i, isImage, category) => {
      if (typeof setIcon === 'function') {
        setWord(w);
        setIcon(i, isImage, category);
      } else if (typeof setWord === 'function') {
        setWord(w, i, isImage, category);
      }
      setPickerOpen(false);
    });
    setPickerOpen(true);
  };


  const handleDragEnd = (event) => {
    if (isLayoutLocked) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemsToShow.findIndex(i => (i.id || i.word) === active.id);
      const newIndex = itemsToShow.findIndex(i => (i.id || i.word) === over.id);

      const newList = arrayMove(itemsToShow, oldIndex, newIndex);

      const newRootItems = [...rootItems];
      if (currentPath.length === 0) {
        newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: newList };
      }
      else {
        let target = newRootItems[currentPageIndex].items;
        for (let i = 0; i < currentPath.length - 1; i++) target = target[currentPath[i]].contents;
        target[currentPath[currentPath.length - 1]].contents = newList;
      }
      setRootItems(newRootItems);
    }
  };

  // Logic moved to top to prevent ReferenceError in useEffect


  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const totalCustomPhotos = rootItems.reduce((sum, page) => sum + countCustomPhotosInItems(page.items || []), 0);

  return (
    <div id="main-area">
      {showLevelIntro && <Suspense fallback={null}><LevelIntro level={currentLevel} onComplete={() => { localStorage.setItem(`kiwi-intro-seen-level-${currentLevel}`, 'true'); setShowLevelIntro(false); if (currentStage <= 2 && !phase1TargetId) setShowPhase1Selector(true); }} onChangeLevel={() => { setShowLevelIntro(false); setIsEditMode(true); }} /></Suspense>}
      {showStrip && (gridSize !== 'super-big' || localStorage.getItem('kiwi-force-strip') === 'true') && (
        <SentenceStrip
          stripItems={stripItems}
          onClear={() => setStripItems([])}
          onPlay={() => {
            const sentence = stripItems.map(i => i.word).join(" ");
            trackSentence(sentence);
            speakSentence(stripItems);
          }}
          onDeleteItem={handleDeleteItemFromStrip}
          isGoalComplete={(() => {
            const levelDef = getLevel(currentLevel);
            if (!levelDef || stripItems.length === 0) return false;
            if (currentLevel === 4.1) return stripItems.length >= 2 && stripItems[0]?.word === "I want";
            if (currentLevel === 4.2) return stripItems.length >= 3;
            if (currentLevel >= 4.3) return stripItems.length >= 4;
            return stripItems.length > 0;
          })()}
        />
      )}

      {showSuccess && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', zIndex: 300, pointerEvents: 'none', animation: 'zoomIn 0.5s ease' }}>{currentPhase === 3 ? "🎯" : "🌟"}</div>}
      {currentPhase === 2 && !callActive && !isCommunicating && (
        <div className="call-overlay"><h2>{timerRemaining > 0 ? "Wait for partner..." : "I have something to say"}</h2><button className={`call-btn ${bellCooldown ? 'cooldown' : ''}`} disabled={bellCooldown} onClick={() => { if (!bellCooldown) { playBellSound(bellSound); setBellCooldown(true); setTimerRemaining(5); const interval = setInterval(() => { setTimerRemaining(prev => { if (prev <= 1) { clearInterval(interval); setCallActive(true); setBellCooldown(false); return 0; } return prev - 1; }); }, 1000); } }}>{timerRemaining > 0 ? <div className="timer-display"><div className="timer-circle" style={{ background: `conic-gradient(var(--primary) ${timerRemaining * 72}deg, #eee 0deg)` }}><span className="timer-text">{timerRemaining}</span></div></div> : '🔔'}</button></div>
      )}
      {callActive && <div className="call-overlay" style={{ background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}><button onClick={() => { setCallActive(false); setIsCommunicating(true); }} style={{ background: '#FF3B30', color: 'white', border: 'none', borderRadius: '30px', padding: '40px 80px', fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 40px rgba(255, 59, 48, 0.4)', transition: 'transform 0.2s ease' }}>Let&apos;s talk!</button></div>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div id="main-grid" ref={mainCardRef} role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Suspense fallback={<div style={{ flex: 1 }} />}>
            <SwitchAccessMode onIconSelect={handleItemClick}>
              <Grid
                items={itemsToShow}
                currentPhase={currentPhase}
                gridSize={gridSize}
                isTrainingMode={isTrainingMode}
                trainingSelection={trainingSelection}
                isEditMode={isEditMode}
                onItemClick={handleItemClick}
                onBack={handleBack}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onAddItem={handleAddItem}
                onOpenPicker={handlePickerOpen}
                onToggleTraining={handleToggleTraining}
                hasBack={currentPath.length > 0}
                trainingPanelVisible={!shuffledItems}
                folder={currentPath.length > 0 ? currentPath.reduce((acc, i) => acc[i].contents, (rootItems[currentPageIndex]?.items || [])) : null}
                scanIndex={scanIndex}
                isLayoutLocked={isLayoutLocked}
                isColorCodingEnabled={isColorCodingEnabled}
                isCategorizationEnabled={isCategorizationEnabled}
                collapsedSections={collapsedSections}
                showCategoryHeaders={showCategoryHeaders}
                pages={rootItems}
                currentPageIndex={currentPageIndex}
                onSetPage={setCurrentPageIndex}
                onToggleSection={(sectionId) => {
                  setCollapsedSections(prev =>
                    prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
                  );
                }}
              />
            </SwitchAccessMode>
          </Suspense>
        </div>
      </DndContext>
      {!isLocked && !isEditMode && !isTrainingMode && <button id="settings-button" onClick={() => setIsEditMode(true)} aria-label="Open Settings">⚙️</button>}
      {!isLocked && <Controls handleRef={controlsHandleRef} isEditMode={isEditMode} isTrainingMode={isTrainingMode} currentPhase={currentPhase} currentLevel={currentLevel} showStrip={showStrip} currentContext={currentContext} contexts={contexts} onSetContext={handleSetContext} onToggleMenu={() => setIsEditMode(!isEditMode)} onAddItem={handleAddItem} onAddContext={handleAddContext} onRenameContext={handleRenameContext} onDeleteContext={handleDeleteContext} onSetLevel={handleSetLevel} onStartTraining={() => { setIsTrainingMode(true); setTrainingSelection([]); }} onStartEssentialSkills={() => setIsEssentialSkillsMode(true)} onReset={() => { if (confirm("Reset everything?")) { localStorage.clear(); location.reload(); } }} onShuffle={handleShuffle} onStopTraining={handleStopTraining} onOpenPicker={handlePickerOpen} onToggleDashboard={() => setShowDashboard(true)} onRedoCalibration={() => setShowCalibration(true)} onToggleLock={() => setIsLocked(true)} voiceSettings={voiceSettings} onUpdateVoiceSettings={setVoiceSettings} gridSize={gridSize} onUpdateGridSize={setGridSize} phase1TargetId={phase1TargetId} onSetPhase1Target={setPhase1TargetId} rootItems={currentPageItems} allRootItems={rootItems} colorTheme={colorTheme} onSetColorTheme={setColorTheme} triggerPaywall={triggerPaywall} bellSound={bellSound} onUpdateBellSound={setBellSound} speechDelay={speechDelay} onUpdateSpeechDelay={setSpeechDelay} autoSpeak={autoSpeak} onUpdateAutoSpeak={setAutoSpeak} isScanning={isScanning} onToggleScanning={() => setIsScanning(!isScanning)} scanSpeed={scanSpeed} onUpdateScanSpeed={setScanSpeed} isLayoutLocked={isLayoutLocked} onToggleLayoutLock={() => setIsLayoutLocked(!isLayoutLocked)} isColorCodingEnabled={isColorCodingEnabled} onToggleColorCoding={() => setIsColorCodingEnabled(!isColorCodingEnabled)} showCategoryHeaders={showCategoryHeaders} onToggleCategoryHeaders={() => setShowCategoryHeaders(!showCategoryHeaders)} proficiencyLevel={proficiencyLevel} onUpdateProficiencyLevel={setProficiencyLevel} onAddPage={handleAddNewPage} onDeletePage={handleDeletePage} currentPageIndex={currentPageIndex} onAddFavorites={(favorites) => {
        const nowTime = new Date().getTime();
        const newFavs = favorites.map((fav, i) => ({ id: `fav-${nowTime}-${i}`, type: 'button', word: fav.word || fav.label, icon: fav.icon, bgColor: '#FFF3E0' }));

        const newRootItems = [...rootItems];
        const list = [...(newRootItems[currentPageIndex]?.items || [])];
        let insertIndex = 0;
        for (let i = 0; i < list.length; i++) if (list[i].category === 'starter' || list[i].category === 'core') insertIndex = i + 1; else break;
        list.splice(insertIndex, 0, ...newFavs);

        newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: list };
        setRootItems(newRootItems);
      }} onAddPerson={handleAddPerson} onUpdatePerson={handleUpdatePerson} onRemovePerson={handleRemovePerson} progressData={progressData} analyticsData={progressData} />}

      {isLocked && (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px)) 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, cursor: 'pointer', textAlign: 'center' }}
          onClick={async () => {
            // Biometric Unlock Path
            if (currentProfile?.accessProfile?.biometricLock && Capacitor.isNativePlatform()) {
              if (isSessionValid(biometricUnlockTimestamp, 5 * 60 * 1000)) {
                setIsLocked(false);
                localStorage.setItem('kiwi-child-mode', 'unlocked');
                setLockTapCount(0);
                setShowUnlockHint(false);
                return;
              }

              const result = await authenticateWithBiometric({
                reason: 'Unlock settings',
                title: 'Kiwi Voice Security'
              });

              if (result.success) {
                setIsLocked(false);
                localStorage.setItem('kiwi-child-mode', 'unlocked');
                setLockTapCount(0);
                setShowUnlockHint(false);
                setBiometricUnlockTimestamp(Date.now());
                return;
              } else {
                setShowUnlockHint(true);
              }
            }

            const newCount = lockTapCount + 1;
            setLockTapCount(newCount);
            setShowUnlockHint(true);
            if (newCount >= 3) {
              setIsLocked(false);
              localStorage.setItem('kiwi-child-mode', 'unlocked');
              setLockTapCount(0);
              setShowUnlockHint(false);
              setBiometricUnlockTimestamp(Date.now());
            }
            setTimeout(() => { setLockTapCount(0); setShowUnlockHint(false); }, 3000);
          }}>
          <span style={{ fontSize: '12px', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>🔒 Child Mode Active</span>
            {currentProfile?.accessProfile?.biometricLock && Capacitor.isNativePlatform()
              ? (showUnlockHint
                ? <span style={{
                  color: 'var(--primary-dark)',
                  fontWeight: 700,
                  fontSize: '13px',
                  animation: 'pulse 1s ease-in-out infinite'
                }}>
                  {lockTapCount > 0 ? `${3 - lockTapCount} more tap${3 - lockTapCount !== 1 ? 's' : ''} to unlock` : 'Triple-tap here to unlock'}
                </span>
                : <span style={{ opacity: 0.8 }}>Tap to use FaceID / TouchID</span>)
              : (showUnlockHint
                ? <span style={{
                  color: 'var(--primary-dark)',
                  fontWeight: 700,
                  fontSize: '13px',
                  animation: 'pulse 1s ease-in-out infinite'
                }}>
                  {3 - lockTapCount} more tap{3 - lockTapCount !== 1 ? 's' : ''} to unlock
                </span>
                : <span style={{ opacity: 0.8 }}>Tap 3x here to unlock</span>)}
          </span>
        </div>
      )}

      {editModalOpen && <Suspense fallback={null}><EditModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveEdit} onDelete={() => { if (editingItemIndex !== null) { handleDelete(editingItemIndex); setEditModalOpen(false); } }} onOpenEmojiPicker={handlePickerOpen} item={editingItemIndex !== null ? (currentPath.length === 0 ? (rootItems[currentPageIndex]?.items || []) : currentPath.reduce((acc, i) => acc[i].contents, (rootItems[currentPageIndex]?.items || [])))[editingItemIndex] : null} customPhotoCount={totalCustomPhotos} triggerPaywall={triggerPaywall} /></Suspense>}
      {pickerOpen && <Suspense fallback={null}><PickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} userItems={rootItems[currentPageIndex]?.items || []} triggerPaywall={triggerPaywall} onSelect={(w, i, isImage, category) => { if (pickerCallback) pickerCallback(w, i, isImage, category); }} /></Suspense>}
      {showPhase1Selector && <Suspense fallback={null}><Phase1TargetSelector rootItems={rootItems[currentPageIndex]?.items || []} onSelect={(id) => { setPhase1TargetId(id); setShowPhase1Selector(false); }} /></Suspense>}
      {showAdvancementModal && <Suspense fallback={null}><AdvancementModal currentPhase={currentPhase} onAdvance={handleAdvance} onWait={handleWait} /></Suspense>}
      <Suspense fallback={null}><A2HSModal /></Suspense>

      {inflectionData && (
        <div className="inflection-bubble" style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '10px',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          zIndex: 10000,
          display: 'flex',
          gap: '10px',
          border: '2px solid #4ECDC4',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {inflectionData.verbEntry.inflections.map((inflection, i) => (
            <button key={i} onClick={() => {
              const updatedItems = [...stripItems];
              updatedItems[updatedItems.length - 1] = { ...inflectionData.item, word: inflection };
              setStripItems(updatedItems);
              speak(inflection);
              setInflectionData(null);
            }} style={{
              padding: '10px 20px',
              borderRadius: '15px',
              border: 'none',
              background: '#f0f2f5',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>{inflection}</button>
          ))}
          <button onClick={() => setInflectionData(null)} style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            border: 'none',
            background: '#ffefef',
            color: '#FF3B30',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>✕</button>
        </div>
      )}

      {isEssentialSkillsMode && (
        <Suspense fallback={null}>
          <EssentialSkillsMode
            onExit={() => setIsEssentialSkillsMode(false)}
            onLogEvent={(event) => {
              trackEvent(event);
              // Also update progressData for the graph
              const today = new Date().toISOString().split('T')[0];
              const newTrial = {
                date: today,
                timestamp: Date.now(),
                isPrompted: false,
                level: 0, // Event specific
                type: 'skill_event'
              };
              setProgressData(prev => ({
                ...prev,
                trials: [...(prev.trials || []), newTrial]
              }));
            }}
          />
        </Suspense>
      )}

      {showDashboard && <Suspense fallback={null}><Dashboard onClose={() => setShowDashboard(false)} progressData={progressData} currentPhase={currentPhase} currentLevel={currentLevel} rootItems={rootItems[currentPageIndex]?.items || []} /></Suspense>}

      {activeVisualScene && (
        <Suspense fallback={null}>
          <VisualSceneView
            scene={activeVisualScene}
            onBack={() => setActiveVisualScene(null)}
            speak={speak}
          />
        </Suspense>
      )}

      {showCalibration && (
        <Suspense fallback={null}>
          <TouchCalibration onComplete={() => setShowCalibration(false)} />
        </Suspense>
      )}

      {showOnboarding && (
        <Suspense fallback={null}>
          <Onboarding onComplete={(recommendedPhase, favorites, canRead, learnerProfile) => {
            if (typeof recommendedPhase === 'number') handleSetPhase(recommendedPhase);
            if (canRead !== null && canRead !== undefined) { localStorage.setItem('kiwi-literacy', JSON.stringify(canRead)); if (canRead === true || canRead === 'partial') document.body.classList.add('literacy-mode'); }

            if (learnerProfile) {
              if (learnerProfile.name) updateProfile('default', { name: learnerProfile.name });
              if (learnerProfile.photo) updateProfile('default', { avatar: learnerProfile.photo });
            }

            if (favorites && Array.isArray(favorites) && favorites.length > 0) {
              const now = new Date().getTime();
              const newFavs = favorites.map((fav, i) => ({ id: `fav-${now}-${i}`, type: 'button', word: fav.word || fav.label, icon: fav.icon, bgColor: '#FFF3E0' }));
              const newRootItems = [...rootItems];
              const list = [...(newRootItems[currentPageIndex]?.items || [])];
              let insertIndex = 0;
              for (let i = 0; i < list.length; i++) if (list[i].category === 'starter') insertIndex = i + 1; else break;
              list.splice(insertIndex, 0, ...newFavs);
              if (canRead === true) list.push({ id: 'keyboard-folder', type: 'folder', word: 'Keyboard', icon: '⌨️', contents: [{ id: 'type-word', type: 'button', word: 'Type a word', icon: '✏️' }, { id: 'abc', type: 'button', word: 'ABC', icon: '🔤' }] });
              newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: list };
              setRootItems(newRootItems);
            }
            setShowOnboarding(false);
            setIsEditMode(false); // Ensure controls are closed
            // Trigger tour if not completed
            if (!localStorage.getItem('kiwi-tour-completed')) {
              setShowTour(true);
            }
          }} />
        </Suspense>
      )}

      <GuidedTour
        isOpen={showTour}
        onComplete={() => {
          setShowTour(false);
          localStorage.setItem('kiwi-tour-completed', 'true');
        }}
        targetRefs={{
          controlsHandle: controlsHandleRef,
          mainCard: mainCardRef
        }}
        onEditNode={(index) => {
          setEditingItemIndex(index);
          setEditModalOpen(true);
        }}
      />
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Floating Level Helper Button (Dr. Hanley SBT Strategy Helper) */}
      {!isLocked && !isEditMode && !showSplash && !showOnboarding && !activeVisualScene && (
        <button
          onClick={() => setShowLevelIntro(true)}
          style={{
            position: 'fixed',
            bottom: showStrip ? '9.5rem' : '1.5rem',
            left: '1.5rem',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--text-primary)',
            border: '2px solid var(--primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="level-helper-btn"
          aria-label="Level Instructions"
        >
          🎓
        </button>
      )}
    </div>
  );
}

export default App;
