import { useState, useEffect, Suspense, lazy, useRef } from 'react';
import Grid from './components/Grid';
import SentenceStrip from './components/SentenceStrip';
import Controls from './components/Controls';
import PickerModal from './components/PickerModal';
import AdvancementModal from './components/AdvancementModal';
import SplashScreen from './components/SplashScreen';
import LevelIntro from './components/LevelIntro';
import Phase1TargetSelector from './components/Phase1TargetSelector';
import A2HSModal from './components/A2HSModal';

const Dashboard = lazy(() => import('./components/Dashboard'));
const EditModal = lazy(() => import('./components/EditModal'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const TouchCalibration = lazy(() => import('./components/TouchCalibration'));
import { playBellSound } from './utils/sounds';
import { trackSentence, trackItemClick } from './utils/AnalyticsService';
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
import {
  sortableKeyboardCoordinates,
  arrayMove
} from '@dnd-kit/sortable';
import { AAC_LEXICON } from './data/aacLexicon';
import { CORE_WORDS_LAYOUT } from './data/aacData';
import { useProfile } from './context/ProfileContext';
import { checkUnlimitedVocabulary } from './utils/paywall';

const synth = window.speechSynthesis || null;

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
  ...CORE_WORDS_DATA,
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter', isPhrase: true, phraseIcons: ["🙋", "➕"] },
  { id: 'starter-see', type: 'button', word: "I see", icon: "👀", category: 'starter', isPhrase: true, phraseIcons: ["👀", "✨"] },
  { id: 'starter-feel', type: 'button', word: "I feel", icon: "😊", category: 'starter', isPhrase: true, phraseIcons: ["😊", "🧠"] },
  { id: 'starter-have', type: 'button', word: "I have", icon: "🤲", category: 'starter', isPhrase: true, phraseIcons: ["🤲", "📦"] },
  { id: 'starter-like', type: 'button', word: "I like", icon: "❤️", category: 'starter', isPhrase: true, phraseIcons: ["❤️", "👍"] },
  { id: 'nicety-please', type: 'button', word: "Please", icon: "🙏", category: 'nicety' },
  { id: 'nicety-thanks', type: 'button', word: "Thank you", icon: "😊", category: 'nicety' },
  { id: 'toy-generic', type: 'button', word: "Toy", icon: "🧸" },
  { id: 'snack-generic', type: 'button', word: "Snack", icon: "🥨" },
  { id: 'play-generic', type: 'button', word: "Play", icon: "🏃" },
  { id: 'mom', type: 'button', word: "Mom", icon: "/images/memojis/1.png" },
  { id: 'dad', type: 'button', word: "Dad", icon: "/images/memojis/2.png" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  { id: 'food-folder', type: 'folder', word: "Foods", icon: "🍎", contents: [ { id: 'banana', type: 'button', word: "Banana", icon: "🍌" }, { id: 'apple', type: 'button', word: "Apple", icon: "🍎" }, { id: 'cracker', type: 'button', word: "Cracker", icon: "🍘" }, { id: 'water', type: 'button', word: "Water", icon: "💧" }, { id: 'broccoli', type: 'button', word: "Broccoli", icon: "🥦" }, { id: 'strawberry', type: 'button', word: "Strawberry", icon: "🍓" }, { id: 'pizza', type: 'button', word: "Pizza", icon: "🍕" }, { id: 'chicken', type: 'button', word: "Chicken", icon: "🍗" }, { id: 'juice', type: 'button', word: "Juice", icon: "🧃" }, { id: 'milk', type: 'button', word: "Milk", icon: "🥛" }, { id: 'cookie', type: 'button', word: "Cookie", icon: "🍪" }, { id: 'yogurt', type: 'button', word: "Yogurt", icon: "🍦" }, { id: 'carrot', type: 'button', word: "Carrot", icon: "🥕" }, { id: 'grape', type: 'button', word: "Grape", icon: "🍇" }, { id: 'real-apple', type: 'button', word: "Healthy Snack", icon: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop", bgColor: "#E3F2FD" }, { id: 'custom-photo', type: 'button', word: "My Snack", icon: "📷", bgColor: "#E3F2FD" } ] },
  { id: 'toys-folder', type: 'folder', word: "Toys", icon: "⚽", contents: [ { id: 'ball', type: 'button', word: "Ball", icon: "⚽" }, { id: 'bubbles', type: 'button', word: "Bubbles", icon: "🫧" }, { id: 'blocks', type: 'button', word: "Blocks", icon: "🧱" }, { id: 'car', type: 'button', word: "Car", icon: "🚗" }, { id: 'mouse', type: 'button', word: "Mouse", icon: "🐭" } ] },
  { id: 'tv-folder', type: 'folder', word: "TV", icon: "📺", contents: [ { id: 'elmo', type: 'button', word: "Elmo", icon: "🔴" }, { id: 'bluey', type: 'button', word: "Bluey", icon: "🐶" }, { id: 'music', type: 'button', word: "Music", icon: "🎵" }, { id: 'book', type: 'button', word: "Book", icon: "📚" } ] },
  { id: 'feelings-folder', type: 'folder', word: "Feelings", icon: "😄", contents: [ { id: 'happy', type: 'button', word: "Happy", icon: "😄" }, { id: 'sad', type: 'button', word: "Sad", icon: "😢" }, { id: 'mad', type: 'button', word: "Mad", icon: "😠" } ] },
  { 
    id: 'phrases-folder', 
    type: 'folder', 
    word: "My Phrases", 
    icon: "🗣️", 
    contents: [ 
      { id: 'phrase-love', type: 'button', word: "I love you", icon: "❤️", bgColor: '#FDF2F8' }, 
      { id: 'phrase-help', type: 'button', word: "Can you help me?", icon: "🤝", bgColor: '#FDF2F8' }, 
      { id: 'phrase-break', type: 'button', word: "I need a break", icon: "🧘", bgColor: '#FDF2F8' } 
    ] 
  },
  attributesFolder
];

const schoolDefaultData = [ { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' }, { id: 'starter-see', type: 'button', word: "I see", icon: "👀", category: 'starter' }, { id: 'teacher', type: 'button', word: "Teacher", icon: "👩‍🏫" }, { id: 'help', type: 'button', word: "Help", icon: "🙋‍" }, { id: 'bathroom', type: 'button', word: "Bathroom", icon: "🚽" }, { id: 'more', type: 'button', word: "More", icon: "➕" }, { id: 'school-folder', type: 'folder', word: "School", icon: "🏫", contents: [ { id: 'pencil', type: 'button', word: "Pencil", icon: "✏️" }, { id: 'paper', type: 'button', word: "Paper", icon: "📄" }, { id: 'computer', type: 'button', word: "Computer", icon: "💻" }, { id: 'backpack', type: 'button', word: "Backpack", icon: "🎒" } ] }, { id: 'friends-folder', type: 'folder', word: "Friends", icon: "👫", contents: [ { id: 'friend1', type: 'button', word: "Friend", icon: "🧑" }, { id: 'play', type: 'button', word: "Play", icon: "⚽" }, { id: 'share', type: 'button', word: "Share", icon: "🤝" } ] } ];
const grandparentsDefaultData = [ { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' }, { id: 'grandma', type: 'button', word: "Grandma", icon: "👵" }, { id: 'grandpa', type: 'button', word: "Grandpa", icon: "👴" }, { id: 'hug', type: 'button', word: "Hug", icon: "🫲" }, { id: 'cookie', type: 'button', word: "Cookie", icon: "🍪" }, { id: 'more', type: 'button', word: "More", icon: "➕" }, { id: 'treats-folder', type: 'folder', word: "Treats", icon: "🍬", contents: [ { id: 'candy', type: 'button', word: "Candy", icon: "🍬" }, { id: 'ice-cream', type: 'button', word: "Ice Cream", icon: "🍦" }, { id: 'juice', type: 'button', word: "Juice", icon: "🧃" } ] } ];
const storeDefaultData = [ { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' }, { id: 'help', type: 'button', word: "Help", icon: "🙋‍" }, { id: 'cart', type: 'button', word: "Cart", icon: "🛒" }, { id: 'bathroom', type: 'button', word: "Bathroom", icon: "🚽" }, { id: 'more', type: 'button', word: "More", icon: "➕" }, { id: 'shopping-folder', type: 'folder', word: "Shopping", icon: "🛒", contents: [ { id: 'snack', type: 'button', word: "Snack", icon: "🍿" }, { id: 'drink', type: 'button', word: "Drink", icon: "🧃" }, { id: 'toy', type: 'button', word: "Toy", icon: "🧸" } ] } ];
const outsideDefaultData = [ { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' }, { id: 'play', type: 'button', word: "Play", icon: "⚽" }, { id: 'swing', type: 'button', word: "Swing", icon: "🧘" }, { id: 'slide', type: 'button', word: "Slide", icon: "🚻" }, { id: 'more', type: 'button', word: "More", icon: "➕" }, { id: 'nature-folder', type: 'folder', word: "Nature", icon: "🌳", contents: [ { id: 'tree', type: 'button', word: "Tree", icon: "🌳" }, { id: 'flower', type: 'button', word: "Flower", icon: "🌸" }, { id: 'bird', type: 'button', word: "Bird", icon: "🐦" }, { id: 'bug', type: 'button', word: "Bug", icon: "🐛" } ] }, { id: 'playground-folder', type: 'folder', word: "Playground", icon: "🎢", contents: [ { id: 'sandbox', type: 'button', word: "Sandbox", icon: "🏖️" }, { id: 'climb', type: 'button', word: "Climb", icon: "🧗" }, { id: 'run', type: 'button', word: "Run", icon: "🏃" } ] } ];

const getDefaultDataForContext = (contextId) => {
  switch (contextId) {
    case 'school': return JSON.parse(JSON.stringify(schoolDefaultData));
    case 'grandparents': return JSON.parse(JSON.stringify(grandparentsDefaultData));
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
  const [trainingSelection, setTrainingSelection] = useState([]);
  const [isScanning, setIsScanning] = useState(() => localStorage.getItem('kiwi-is-scanning') === 'true');
  const [isLayoutLocked, setIsLayoutLocked] = useState(() => localStorage.getItem('kiwi-layout-locked') === 'true');
  const [isColorCodingEnabled, setIsColorCodingEnabled] = useState(() => {
    const saved = localStorage.getItem('kiwi-color-coding-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [isCategorizationEnabled, setIsCategorizationEnabled] = useState(() => {
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
    const valid = ['super-big', 'big', 'standard'];
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

  const [speechDelay, setSpeechDelay] = useState(() => {
    const saved = localStorage.getItem('kiwi-speech-delay');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [inflectionData, setInflectionData] = useState(null);

  const lastSpeakTimeRef = useRef({});

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const triggerPaywall = (feature, cb) => { if (cb) cb(); };

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
  }, [isScanning, scanSpeed, visibleItemsForScanning.length, editModalOpen, pickerOpen, showDashboard, showOnboarding, showLevelIntro, showAdvancementModal, showCalibration]);

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
  }, [isScanning, scanIndex, visibleItemsForScanning]);

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

  const { profiles, updateProfile, pronunciations } = useProfile();

  const speak = (text, customAudio = null) => {
    if (customAudio) { new Audio(customAudio).play(); return; }
    if (!synth) return;
    if (synth.speaking) synth.cancel();

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
    u.rate = voiceSettings.rate; 
    u.pitch = voiceSettings.pitch;
    u.volume = voiceSettings.volume || 1;
    
    if (voiceSettings.voiceURI) {
      const voices = synth.getVoices();
      const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
      if (selectedVoice) u.voice = selectedVoice;
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

  const handleItemClick = async (item, index) => {
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
    else {
      // Repetition Delay Logic
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
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

      if (currentPhase === 1 || currentPhase === 2) { speak(item.word, item.customAudio); triggerSuccess(); return; }
      if (currentPhase === 4 && stripItems.length === 0) {
        if (item.word === "I want") { setStripItems([item]); if (autoSpeak) speak(item.word, item.customAudio); }
        else {
          const iWantRoot = rootItems.find(i => i.word === "I want");
          if (iWantRoot) { 
            setStripItems([iWantRoot, item]); 
            if (autoSpeak) {
                if (iWantRoot.customAudio) {
                    speakSentence([iWantRoot, item]);
                } else {
                    speak("I want " + item.word, item.customAudio); 
                }
            }
            triggerSuccess(); 
          }
        }
        return;
      }
      if (showStrip) { 
        setStripItems([...stripItems, item]); 
        if (autoSpeak) speak(item.word, item.customAudio); 
        if (currentPhase >= 3) triggerSuccess(); 
      }
      else { speak(item.word, item.customAudio); triggerSuccess(); }
    }
  };

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
  const handleSaveEdit = (newWord, newIcon, newBgColor, newViewMode, newCustomAudio, newCharacterConfig) => {
    if (editingItemIndex === null) return;
    const currentPageItems = rootItems[currentPageIndex]?.items || [];
    const currentList = currentPath.length === 0 ? currentPageItems : currentPath.reduce((acc, i) => acc[i].contents, currentPageItems);
    const item = currentList[editingItemIndex];
    const newItem = { ...item, word: newWord, icon: newIcon, bgColor: newBgColor, customAudio: newCustomAudio, characterConfig: newCharacterConfig };
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

  const handleSetLevel = (newLevel) => { setCurrentLevel(newLevel); const resetProgress = { ...progressData, currentStreak: 0, successDates: [], lastSuccessTime: null }; setProgressData(resetProgress); localStorage.setItem('kians-progress', JSON.stringify(resetProgress)); };
  const handleSetPhase = (newPhase) => handleSetLevel(migratePhaseToLevel(newPhase));
  const handleAdvance = () => { const nextLevel = getNextLevel(currentLevel); if (nextLevel) handleSetLevel(nextLevel); setShowAdvancementModal(false); };
  const handleWait = () => { setShowAdvancementModal(false); const resetProgress = { ...progressData, currentStreak: 0, successDates: [], lastSuccessTime: null }; setProgressData(resetProgress); localStorage.setItem('kians-progress', JSON.stringify(resetProgress)); };

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
      const hasAccess = await checkUnlimitedVocabulary(totalIconCount);
      if (!hasAccess) return; // User declined or not subscribed
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
    setEditingItemIndex(newList.length - 1); setEditModalOpen(true);
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
  const handlePickerOpen = (setWord, setIcon) => { setPickerCallback(() => (w, i, isImage) => { setWord(w); setIcon(i, isImage); setPickerOpen(false); }); setPickerOpen(true); };

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

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div id="main-area">
      {showLevelIntro && <Suspense fallback={null}><LevelIntro level={currentLevel} onComplete={() => { localStorage.setItem(`kiwi-intro-seen-level-${currentLevel}`, 'true'); setShowLevelIntro(false); if (currentStage <= 2 && !phase1TargetId) setShowPhase1Selector(true); }} onChangeLevel={() => { setShowLevelIntro(false); setIsEditMode(true); }}/></Suspense>}
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
        />
      )}
      
      {/* iOS Navigation Header */}
      <header className="ios-nav-header" style={{ opacity: 0.3 }}>
        <div className="ios-nav-top">
          {currentPath.length > 0 && (
            <button className="ios-back-button" onClick={handleBack}>
              <span className="ios-chevron-left">‹</span>
              {currentPath.length === 1 ? 'Home' : 'Back'}
            </button>
          )}
          <div className="ios-nav-badges">
            {currentContext !== 'home' && (
              <span className="ios-context-badge">
                {contexts.find(c => c.id === currentContext)?.icon} {contexts.find(c => c.id === currentContext)?.label}
              </span>
            )}
            {currentPhase > 0 && <span className="ios-phase-badge">Level {currentPhase}</span>}
          </div>
        </div>
        <h1 className="ios-large-title">
          {currentPath.length === 0 ? "Home" : currentPath.reduce((acc, i, idx) => { 
            if (idx === 0) return rootItems[i].word; 
            let list = rootItems; 
            for (let j=0; j<idx; j++) list = list[currentPath[j]].contents; 
            return list[i].word; 
          }, "")}
        </h1>
      </header>

      {showSuccess && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', zIndex: 300, pointerEvents: 'none', animation: 'zoomIn 0.5s ease' }}>{currentPhase === 3 ? "🎯" : "🌟"}</div>}
      {currentPhase === 2 && !callActive && !isCommunicating && (
        <div className="call-overlay"><h2>{timerRemaining > 0 ? "Wait for partner..." : "I have something to say"}</h2><button className={`call-btn ${bellCooldown ? 'cooldown' : ''}`} disabled={bellCooldown} onClick={() => { if (!bellCooldown) { playBellSound(bellSound); setBellCooldown(true); setTimerRemaining(5); const interval = setInterval(() => { setTimerRemaining(prev => { if (prev <= 1) { clearInterval(interval); setCallActive(true); setBellCooldown(false); return 0; } return prev - 1; }); }, 1000); } }}>{timerRemaining > 0 ? <div className="timer-display"><div className="timer-circle" style={{ background: `conic-gradient(var(--primary) ${timerRemaining * 72}deg, #eee 0deg)` }}><span className="timer-text">{timerRemaining}</span></div></div> : '🔔'}</button></div>
      )}
      {callActive && <div className="call-overlay" style={{ background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}><button onClick={() => { setCallActive(false); setIsCommunicating(true); }} style={{ background: '#FF3B30', color: 'white', border: 'none', borderRadius: '30px', padding: '40px 80px', fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 40px rgba(255, 59, 48, 0.4)', transition: 'transform 0.2s ease' }}>Let&apos;s talk!</button></div>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div id="main-grid" role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
            onToggleTraining={handleToggleTraining} 
            hasBack={currentPath.length > 0}
            trainingPanelVisible={!shuffledItems}
            folder={currentPath.length > 0 ? currentPath.reduce((acc, i) => acc[i].contents, (rootItems[currentPageIndex]?.items || [])) : null} 
            scanIndex={scanIndex} 
            isLayoutLocked={isLayoutLocked} 
            isColorCodingEnabled={isColorCodingEnabled}
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
        </div>
      </DndContext>
      {!isLocked && !isEditMode && !isTrainingMode && <button id="settings-button" onClick={() => setIsEditMode(true)} aria-label="Open Settings">⚙️</button>}
      {!isLocked && <Controls isEditMode={isEditMode} isTrainingMode={isTrainingMode} currentPhase={currentPhase} currentLevel={currentLevel} showStrip={showStrip} currentContext={currentContext} contexts={contexts} onSetContext={handleSetContext} onToggleMenu={() => setIsEditMode(!isEditMode)} onAddItem={handleAddItem} onAddContext={handleAddContext} onRenameContext={handleRenameContext} onDeleteContext={handleDeleteContext} onSetLevel={handleSetLevel} onStartTraining={() => { setIsTrainingMode(true); setTrainingSelection([]); }} onReset={() => { if (confirm("Reset everything?")) { localStorage.clear(); location.reload(); } }} onShuffle={handleShuffle} onStopTraining={handleStopTraining} onOpenPicker={handlePickerOpen} onToggleDashboard={() => setShowDashboard(true)} onRedoCalibration={() => setShowCalibration(true)} onToggleLock={() => setIsLocked(true)} voiceSettings={voiceSettings} onUpdateVoiceSettings={setVoiceSettings} gridSize={gridSize} onUpdateGridSize={setGridSize} phase1TargetId={phase1TargetId} onSetPhase1Target={setPhase1TargetId} rootItems={currentPageItems} colorTheme={colorTheme} onSetColorTheme={setColorTheme} triggerPaywall={triggerPaywall} bellSound={bellSound} onUpdateBellSound={setBellSound} speechDelay={speechDelay} onUpdateSpeechDelay={setSpeechDelay} autoSpeak={autoSpeak} onUpdateAutoSpeak={setAutoSpeak} isScanning={isScanning} onToggleScanning={() => setIsScanning(!isScanning)} scanSpeed={scanSpeed} onUpdateScanSpeed={setScanSpeed} isLayoutLocked={isLayoutLocked} onToggleLayoutLock={() => setIsLayoutLocked(!isLayoutLocked)} isColorCodingEnabled={isColorCodingEnabled} onToggleColorCoding={() => setIsColorCodingEnabled(!isColorCodingEnabled)} showCategoryHeaders={showCategoryHeaders} onToggleCategoryHeaders={() => setShowCategoryHeaders(!showCategoryHeaders)} proficiencyLevel={proficiencyLevel} onUpdateProficiencyLevel={setProficiencyLevel} onAddPage={handleAddNewPage} onDeletePage={handleDeletePage} currentPageIndex={currentPageIndex}           onAddFavorites={(favorites) => {
            const nowTime = new Date().getTime();
            const newFavs = favorites.map((fav, i) => ({ id: `fav-${nowTime}-${i}`, type: 'button', word: fav.word || fav.label, icon: fav.icon, bgColor: '#FFF3E0' })); 
            
            const newRootItems = [...rootItems];
            const list = [...(newRootItems[currentPageIndex]?.items || [])]; 
            let insertIndex = 0; 
            for (let i = 0; i < list.length; i++) if (list[i].category === 'starter' || list[i].category === 'core') insertIndex = i + 1; else break; 
            list.splice(insertIndex, 0, ...newFavs); 
            
            newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: list };
            setRootItems(newRootItems); 
          }} progressData={progressData}/>}
      {isLocked && (
        <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px)) 20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, cursor: 'pointer', textAlign: 'center' }} onClick={() => { const newCount = lockTapCount + 1; setLockTapCount(newCount); setShowUnlockHint(true); if (newCount >= 3) { setIsLocked(false); localStorage.setItem('kiwi-child-mode', 'unlocked'); setLockTapCount(0); setShowUnlockHint(false); } setTimeout(() => { setLockTapCount(0); setShowUnlockHint(false); }, 3000); }}>
          <span style={{ fontSize: '12px', color: '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>🔒 Child Mode Active</span>{showUnlockHint ? <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{3 - lockTapCount} more taps to unlock</span> : <span style={{ opacity: 0.8 }}>Tap 3x here to unlock</span>}</span>
        </div>
      )}
      <EditModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleSaveEdit} onDelete={() => { if (editingItemIndex !== null) { handleDelete(editingItemIndex); setEditModalOpen(false); } }} onOpenEmojiPicker={handlePickerOpen} item={editingItemIndex !== null ? (currentPath.length === 0 ? (rootItems[currentPageIndex]?.items || []) : currentPath.reduce((acc, i) => acc[i].contents, (rootItems[currentPageIndex]?.items || [])))[editingItemIndex] : null} triggerPaywall={triggerPaywall}/>
      <PickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} userItems={rootItems[currentPageIndex]?.items || []} triggerPaywall={triggerPaywall} onSelect={(w, i, isImage) => { if (pickerCallback) pickerCallback(w, i, isImage); }}/>
      {showPhase1Selector && <Phase1TargetSelector rootItems={rootItems[currentPageIndex]?.items || []} onSelect={(id) => { setPhase1TargetId(id); setShowPhase1Selector(false); }}/>}
      {showAdvancementModal && <AdvancementModal currentPhase={currentPhase} onAdvance={handleAdvance} onWait={handleWait}/>}
      <A2HSModal />
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
      {showDashboard && <Suspense fallback={null}><Dashboard onClose={() => setShowDashboard(false)} progressData={progressData} currentPhase={currentPhase} currentLevel={currentLevel} rootItems={rootItems[currentPageIndex]?.items || []}/></Suspense>}
      {showCalibration && <TouchCalibration onComplete={() => setShowCalibration(false)}/>}
      {showOnboarding && (
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
            if (canRead === true) list.push({ id: 'keyboard-folder', type: 'folder', word: 'Keyboard', icon: '⌨️', contents: [ { id: 'type-word', type: 'button', word: 'Type a word', icon: '✏️' }, { id: 'abc', type: 'button', word: 'ABC', icon: '🔤' } ] });
            newRootItems[currentPageIndex] = { ...newRootItems[currentPageIndex], items: list };
            setRootItems(newRootItems);
          }
          setShowOnboarding(false);
        }} />
      )}
    </div>
  );
}

export default App;
