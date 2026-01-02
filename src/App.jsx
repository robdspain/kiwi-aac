import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Grid from './components/Grid';
import SentenceStrip from './components/SentenceStrip';
import Controls from './components/Controls';
import PickerModal from './components/PickerModal';
import AdvancementModal from './components/AdvancementModal';
import EssentialSkillsMode from './components/EssentialSkillsMode';
import SplashScreen from './components/SplashScreen';
import LevelIntro from './components/LevelIntro';
import Phase1TargetSelector from './components/Phase1TargetSelector';
import A2HSModal from './components/A2HSModal';

// Lazy load heavy components - only downloaded when needed
const Dashboard = lazy(() => import('./components/Dashboard'));
const EditModal = lazy(() => import('./components/EditModal'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const TouchCalibration = lazy(() => import('./components/TouchCalibration'));
import { playBellSound } from './utils/sounds';
import { trackSentence } from './utils/AnalyticsService';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { InAppReview } from '@capacitor-community/in-app-review';
import {
  LEVELS,
  STAGES,
  LEVEL_ORDER,
  getLevel,
  getStage,
  getNextLevel,
  formatLevel,
  migratePhaseToLevel,
  isMaxLevel,
  getLevelInstructions
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const synth = window.speechSynthesis || null;

const SKIN_TONES = {
  default: '',
  light: '🏻',
  mediumLight: '🏼',
  medium: '🏽',
  mediumDark: '🏾',
  dark: '🏿'
};

const INITIAL_CONTEXTS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'school', label: 'School', icon: '🏫' },
  { id: 'grandparents', label: 'Grandparents', icon: '👵' },
  { id: 'store', label: 'Store', icon: '🛒' },
  { id: 'outside', label: 'Outside', icon: '🌳' },
];

// Free tier limit for location contexts (premium users get unlimited)
const FREE_CONTEXT_LIMIT = 5;

// Attributes Data for Phase 4+
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

// Default icons for Home context
const homeDefaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'starter-see', type: 'button', word: "I see", icon: "👀", category: 'starter' },
  { id: 'starter-feel', type: 'button', word: "I feel", icon: "😊", category: 'starter' },
  { id: 'starter-have', type: 'button', word: "I have", icon: "🤲", category: 'starter' },
  { id: 'starter-like', type: 'button', word: "I like", icon: "❤️", category: 'starter' },
  { id: 'nicety-please', type: 'button', word: "Please", icon: "🙏", category: 'nicety' },
  { id: 'nicety-thanks', type: 'button', word: "Thank you", icon: "😊", category: 'nicety' },
  { id: 'toy-generic', type: 'button', word: "Toy", icon: "🧸" },
  { id: 'snack-generic', type: 'button', word: "Snack", icon: "🥨" },
  { id: 'play-generic', type: 'button', word: "Play", icon: "🏃" },
  { 
    id: 'mom', 
    type: 'button', 
    word: "Mom", 
    icon: "👤", 
    characterConfig: {
        head: 'round',
        skin: '#8D5524',
        hair: 'curly',
        hairColor: '#2C222B',
        eyes: 'happy',
        mouth: 'smile',
        eyeColor: '#333333'
    }
  },
  { 
    id: 'dad', 
    type: 'button', 
    word: "Dad", 
    icon: "👤",
    characterConfig: {
        head: 'square',
        skin: '#E0AC69',
        hair: 'short',
        hairColor: '#4B2C20',
        facialHair: 'short_beard',
        eyes: 'happy',
        mouth: 'smile',
        eyeColor: '#2e536f'
    }
  },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'food-folder', type: 'folder', word: "Foods", icon: "🍎", contents: [
      { id: 'banana', type: 'button', word: "Banana", icon: "🍌" },
      { id: 'apple', type: 'button', word: "Apple", icon: "🍎" },
      { id: 'cracker', type: 'button', word: "Cracker", icon: "🍘" },
      { id: 'water', type: 'button', word: "Water", icon: "💧" },
      { id: 'broccoli', type: 'button', word: "Broccoli", icon: "🥦" },
      { id: 'strawberry', type: 'button', word: "Strawberry", icon: "🍓" },
      { id: 'pizza', type: 'button', word: "Pizza", icon: "🍕" },
      { id: 'chicken', type: 'button', word: "Chicken", icon: "🍗" },
      { id: 'juice', type: 'button', word: "Juice", icon: "🧃" },
      { id: 'milk', type: 'button', word: "Milk", icon: "🥛" },
      { id: 'cookie', type: 'button', word: "Cookie", icon: "🍪" },
      { id: 'yogurt', type: 'button', word: "Yogurt", icon: "🍦" },
      { id: 'carrot', type: 'button', word: "Carrot", icon: "🥕" },
      { id: 'grape', type: 'button', word: "Grape", icon: "🍇" },
      { id: 'real-apple', type: 'button', word: "Healthy Snack", icon: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop", bgColor: "#E3F2FD" },
      { id: 'custom-photo', type: 'button', word: "My Snack", icon: "📷", bgColor: "#E3F2FD" }
    ]
  },
  {
    id: 'toys-folder', type: 'folder', word: "Toys", icon: "⚽", contents: [
      { id: 'ball', type: 'button', word: "Ball", icon: "⚽" },
      { id: 'bubbles', type: 'button', word: "Bubbles", icon: "🫧" },
      { id: 'blocks', type: 'button', word: "Blocks", icon: "🧱" },
      { id: 'car', type: 'button', word: "Car", icon: "🚗" },
      { id: 'mouse', type: 'button', word: "Mouse", icon: "🐭" }
    ]
  },
  {
    id: 'tv-folder', type: 'folder', word: "TV", icon: "📺", contents: [
      { id: 'elmo', type: 'button', word: "Elmo", icon: "🔴" },
      { id: 'bluey', type: 'button', word: "Bluey", icon: "🐶" },
      { id: 'music', type: 'button', word: "Music", icon: "🎵" },
      { id: 'book', type: 'button', word: "Book", icon: "📚" }
    ]
  },
  {
    id: 'feelings-folder', type: 'folder', word: "Feelings", icon: "😄", contents: [
      { id: 'happy', type: 'button', word: "Happy", icon: "😄" },
      { id: 'sad', type: 'button', word: "Sad", icon: "😢" },
      { id: 'mad', type: 'button', word: "Mad", icon: "😠" }
    ]
  },
  // Include attributes by default but logic might hide it? No, just include it for new users.
  attributesFolder
];

// Default icons for School context
const schoolDefaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'starter-see', type: 'button', word: "I see", icon: "👀", category: 'starter' },
  { id: 'teacher', type: 'button', word: "Teacher", icon: "👩‍🏫" },
  { id: 'help', type: 'button', word: "Help", icon: "🙋‍" },
  { id: 'bathroom', type: 'button', word: "Bathroom", icon: "🚽" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'school-folder', type: 'folder', word: "School", icon: "🏫", contents: [
      { id: 'pencil', type: 'button', word: "Pencil", icon: "✏️" },
      { id: 'paper', type: 'button', word: "Paper", icon: "📄" },
      { id: 'computer', type: 'button', word: "Computer", icon: "💻" },
      { id: 'backpack', type: 'button', word: "Backpack", icon: "🎒" }
    ]
  },
  {
    id: 'friends-folder', type: 'folder', word: "Friends", icon: "👫", contents: [
      { id: 'friend1', type: 'button', word: "Friend", icon: "🧑" },
      { id: 'play', type: 'button', word: "Play", icon: "⚽" },
      { id: 'share', type: 'button', word: "Share", icon: "🤝" }
    ]
  }
];

// Default icons for Grandparents context
const grandparentsDefaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'grandma', type: 'button', word: "Grandma", icon: "👵" },
  { id: 'grandpa', type: 'button', word: "Grandpa", icon: "👴" },
  { id: 'hug', type: 'button', word: "Hug", icon: "🫲" },
  { id: 'cookie', type: 'button', word: "Cookie", icon: "🍪" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'treats-folder', type: 'folder', word: "Treats", icon: "🍬", contents: [
      { id: 'candy', type: 'button', word: "Candy", icon: "🍬" },
      { id: 'ice-cream', type: 'button', word: "Ice Cream", icon: "🍦" },
      { id: 'juice', type: 'button', word: "Juice", icon: "🧃" }
    ]
  }
];

// Default icons for Store context  
const storeDefaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'help', type: 'button', word: "Help", icon: "🙋‍" },
  { id: 'cart', type: 'button', word: "Cart", icon: "🛒" },
  { id: 'bathroom', type: 'button', word: "Bathroom", icon: "🚽" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'shopping-folder', type: 'folder', word: "Shopping", icon: "🛒", contents: [
      { id: 'snack', type: 'button', word: "Snack", icon: "🍿" },
      { id: 'drink', type: 'button', word: "Drink", icon: "🧃" },
      { id: 'toy', type: 'button', word: "Toy", icon: "🧸" }
    ]
  }
];

// Default icons for Outside context
const outsideDefaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'play', type: 'button', word: "Play", icon: "⚽" },
  { id: 'swing', type: 'button', word: "Swing", icon: "🧘" },
  { id: 'slide', type: 'button', word: "Slide", icon: "🚻" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'nature-folder', type: 'folder', word: "Nature", icon: "🌳", contents: [
      { id: 'tree', type: 'button', word: "Tree", icon: "🌳" },
      { id: 'flower', type: 'button', word: "Flower", icon: "🌸" },
      { id: 'bird', type: 'button', word: "Bird", icon: "🐦" },
      { id: 'bug', type: 'button', word: "Bug", icon: "🐛" }
    ]
  },
  {
    id: 'playground-folder', type: 'folder', word: "Playground", icon: "🎢", contents: [
      { id: 'sandbox', type: 'button', word: "Sandbox", icon: "🏖️" },
      { id: 'climb', type: 'button', word: "Climb", icon: "🧗" },
      { id: 'run', type: 'button', word: "Run", icon: "🏃" }
    ]
  }
];

// Get default data for a context
const getDefaultDataForContext = (contextId) => {
  switch (contextId) {
    case 'school': return JSON.parse(JSON.stringify(schoolDefaultData));
    case 'grandparents': return JSON.parse(JSON.stringify(grandparentsDefaultData));
    case 'store': return JSON.parse(JSON.stringify(storeDefaultData));
    case 'outside': return JSON.parse(JSON.stringify(outsideDefaultData));
    default: return JSON.parse(JSON.stringify(homeDefaultData));
  }
};

function App() {
  const [contexts, setContexts] = useState(() => {
    const saved = localStorage.getItem('kiwi-contexts');
    return saved ? JSON.parse(saved) : INITIAL_CONTEXTS;
  });

  // Save contexts when changed
  useEffect(() => {
    localStorage.setItem('kiwi-contexts', JSON.stringify(contexts));
  }, [contexts]);

  // Current context/location
  const [currentContext, setCurrentContext] = useState(() => {
    return localStorage.getItem('kiwi-context') || 'home';
  });

  // Get storage key for current context
  const getContextStorageKey = (ctx) => `kiwi-words-${ctx}`;

  const [rootItems, setRootItems] = useState(() => {
    const key = getContextStorageKey(localStorage.getItem('kiwi-context') || 'home');
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : getDefaultDataForContext(localStorage.getItem('kiwi-context') || 'home');
  });

  // Level system with migration from old integer phases
  const [currentLevel, setCurrentLevel] = useState(() => {
    // First check for new level format
    const savedLevel = localStorage.getItem('kiwi-level');
    if (savedLevel !== null) {
      const parsed = parseFloat(savedLevel);
      if (!isNaN(parsed) && LEVELS[parsed]) {
        return parsed;
      }
    }

    // Migrate from old integer phase system
    const oldPhase = localStorage.getItem('kians-phase');
    if (oldPhase !== null) {
      const parsed = parseInt(oldPhase, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
        const migratedLevel = migratePhaseToLevel(parsed);
        // Save migrated level
        localStorage.setItem('kiwi-level', migratedLevel.toString());
        return migratedLevel;
      }
    }

    // Default to 1.1 (was 0 before, now start at first level)
    return 1.1;
  });

  // Derived: current stage (1-6) for backward compatibility
  const currentStage = Math.floor(currentLevel);
  // Alias for backward compatibility with components expecting currentPhase
  const currentPhase = currentStage;

  const [skinTone, setSkinTone] = useState(() => {
    return localStorage.getItem('kians-skin-tone') || 'default';
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('kiwi-onboarding-complete');
  });

  const [showSplash, setShowSplash] = useState(true); 
  const [showLevelIntro, setShowLevelIntro] = useState(false);

  const [showPhase1Selector, setShowPhase1Selector] = useState(false);
  const [phase1TargetId, setPhase1TargetId] = useState(() => localStorage.getItem('kiwi-phase1-target'));

  useEffect(() => {
    if (phase1TargetId) localStorage.setItem('kiwi-phase1-target', phase1TargetId);
  }, [phase1TargetId]);

  // --- RESTORED STATE & HELPERS ---
  const [currentPath, setCurrentPath] = useState([]);
  const [stripItems, setStripItems] = useState([]);
  const [showStrip, setShowStrip] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('kiwi-voice-settings');
      return saved ? JSON.parse(saved) : { rate: 1, pitch: 1, voiceURI: null };
    } catch (e) { return { rate: 1, pitch: 1, voiceURI: null }; }
  });

  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [trainingSelection, setTrainingSelection] = useState([]);
  const [shuffledItems, setShuffledItems] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState(null);

  const [isEssentialMode, setIsEssentialMode] = useState(false);
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
    } catch (e) { return { currentStreak: 0, successDates: [], lastSuccessTime: null, trials: [] }; }
  });

  const [isPrompted, setIsPrompted] = useState(false);

  const [callActive, setCallActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [bellCooldown, setBellCooldown] = useState(false);
  const [isCommunicating, setIsCommunicating] = useState(false);

  const [bellSound, setBellSound] = useState(() => {
    return localStorage.getItem('kiwi-bell-sound') || 'traditional';
  });

  useEffect(() => {
    localStorage.setItem('kiwi-bell-sound', bellSound);
  }, [bellSound]);

  const [gridSize, setGridSize] = useState(() => {
    const saved = localStorage.getItem('kiwi-grid-size');
    // Restrict to 3 sizes as requested (Large, Medium, Standard)
    const valid = ['super-big', 'big', 'standard'];
    return valid.includes(saved) ? saved : 'standard';
  });
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('kiwi-color-theme') || 'default');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const applySkinTone = (item) => {
    if (!item || !item.icon || skinTone === 'default') return item;
    return item; // Simplify for now to avoid complexity errors
  };

  const getProcessedList = (list) => {
    if (!list) return [];
    return list.map(item => applySkinTone(item));
  };

  const triggerPaywall = (feature, cb) => {
    if (cb) cb();
  };

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Implement reordering logic here if needed, or leave basic
      // For now, just logging to avoid crash if logic is missing
      console.log('Drag end', active, over);
    }
  };

  // --- RESTORED HANDLERS ---
  const handleSetContext = (id) => {
    setCurrentContext(id);
    localStorage.setItem('kiwi-context', id);
    setCurrentPath([]);
    const key = getContextStorageKey(id);
    const saved = localStorage.getItem(key);
    const items = saved ? JSON.parse(saved) : getDefaultDataForContext(id);
    setRootItems(items);
  };

  const handleAddContext = (label, icon) => {
    const newId = 'ctx-' + Date.now();
    const newContext = { id: newId, label, icon };
    const newContexts = [...contexts, newContext];
    setContexts(newContexts);
    // Switch to new context but wait for state update in next render usually, 
    // but here we need to manually trigger item load or wait.
    // handleSetContext relies on setRootItems which is fine.
    // But contexts state update is async. It's fine.
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
  // -------------------------
  // --------------------------------

  useEffect(() => {
    // Save new level format
    if (typeof currentLevel === 'number' && !isNaN(currentLevel)) {
      localStorage.setItem('kiwi-level', currentLevel.toString());
    }

    // Auto-enable/disable strip based on level definition
    const levelDef = getLevel(currentLevel);
    if (levelDef?.showStrip) setShowStrip(true);
    else setShowStrip(false);

    // Reset path when changing level
    setCurrentPath([]);
  }, [currentLevel]);

  const getCurrentList = () => {
    let list = rootItems;
    for (let idx of currentPath) {
      list = list[idx].contents;
    }
    // Apply skin tones here
    return getProcessedList(list);
  };

  // Need to use modified items for logic?
  // Logic works on `word`, so unmodified `rootItems` is fine for logic structure.
  // But display needs skin tones.
  // `getCurrentList` now returns skin-toned items.

  const getBreadcrumbs = () => {
    if (currentPath.length === 0) return "Home";
    let list = rootItems;
    let name = "Home";
    for (let i of currentPath) {
      name = list[i].word;
      list = list[i].contents;
    }
    return name;
  };

  const speak = (text, customAudio = null) => {
    if (customAudio) {
      const audio = new Audio(customAudio);
      audio.play();
      return;
    }
    if (!synth) return;

    if (synth.speaking) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);

    // Apply user settings
    u.rate = voiceSettings.rate;
    u.pitch = voiceSettings.pitch;

    if (voiceSettings.voiceURI) {
      const voices = synth.getVoices();
      const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
      if (selectedVoice) u.voice = selectedVoice;
    }

    synth.speak(u);
  };

  const handleItemClick = async (item, index) => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      // Ignore errors (e.g. on web if not supported)
    }

    // Track usage for favorites
    if (item.bgColor === '#FFF3E0') {
      const updatedItems = rootItems.map(i => {
        if (i.id === item.id) {
          return { ...i, usageCount: (i.usageCount || 0) + 1, lastUsed: Date.now() };
        }
        return i;
      });
      setRootItems(updatedItems);
    }

    if (item.type === 'folder') {
      setCurrentPath([...currentPath, index]);
    } else {
      if (currentPhase === 1 || currentPhase === 2) {
        // Simple click -> speak + feedback
        speak(item.word);
        triggerSuccess();
        return;
      }

      if (currentPhase === 4 && stripItems.length === 0) {
        // Enforce "I want"
        // Find "I want" in current list (which has skin tones applied)
        // or root list (no skin tones).
        // `item` has skin tone (passed from Grid).

        // We need to compare WORDS.
        if (item.word === "I want") {
          setStripItems([item]);
          speak(item.word);
        } else {
          // Find "I want" in root
          const iWantRoot = rootItems.find(i => i.word === "I want");
          // Apply skin tone for strip
          const iWant = iWantRoot ? applySkinTone(iWantRoot) : null;

          if (iWant) {
            setStripItems([iWant, item]);
            speak("I want " + item.word);
            triggerSuccess();
          }
        }
        return;
      }


      if (showStrip) {
        setStripItems([...stripItems, item]);
        speak(item.word);
        if (currentPhase >= 3) triggerSuccess();
      } else {
        speak(item.word);
        triggerSuccess();
      }
    }
  };

  const addAttributesFolder = () => {
    // Check if it already exists to avoid duplicates
    if (rootItems.find(i => i.word === "Describe")) return;

    const list = [...rootItems];
    list.push(attributesFolder);
    setRootItems(list);
    alert("🎉 Great Job! The 'Describe' folder has been added to help build longer sentences with colors, numbers, and sizes.");
  };

  const checkForAutoAdvancement = (progressData) => {
    const trials = progressData.trials || [];
    const levelDef = getLevel(currentLevel);

    if (!levelDef || !levelDef.next) return; // Already at max level

    // Get trials for current level
    const levelTrials = trials.filter(t => t.level === currentLevel);
    const independentTrials = levelTrials.filter(t => !t.isPrompted);

    // Check if advancement criteria are met
    let shouldAdvance = false;
    let advanceMessage = '';

    // Count threshold - need enough trials
    if (levelTrials.length >= levelDef.threshold) {
      // If accuracy is required, check it
      if (levelDef.accuracy) {
        const accuracy = (independentTrials.length / levelTrials.length) * 100;
        if (accuracy >= levelDef.accuracy) {
          shouldAdvance = true;
          advanceMessage = `🎉 Amazing! ${Math.round(accuracy)}% accuracy achieved!`;
        }
      } else {
        // No accuracy requirement, just need threshold
        shouldAdvance = true;
        advanceMessage = `🎉 ${levelDef.threshold} successful trials completed!`;
      }
    }

    if (shouldAdvance) {
      const advanceKey = `kiwi-auto-advance-${currentLevel}-shown`;
      if (!localStorage.getItem(advanceKey)) {
        localStorage.setItem(advanceKey, 'true');

        const nextLevelDef = getLevel(levelDef.next);
        const nextStage = getStage(levelDef.next);

        setTimeout(() => {
          const message = `${advanceMessage}\n\nReady to advance to Level ${levelDef.next}: ${nextLevelDef.name}?\n\n${nextLevelDef.description}`;
          if (confirm(message)) {
            setCurrentLevel(levelDef.next);
          }
        }, 500);
      }
    }
  };

  const triggerSuccess = () => {
    // Simple visual feedback for toddlers
    setShowSuccess(true);
    document.body.classList.add('success-flash');

    // Track progress
    const today = new Date().toISOString().split('T')[0];
    const newProgress = { ...progressData };

    // Initialize trials if not present
    if (!newProgress.trials) {
      newProgress.trials = [];
    }

    // Add new trial record with new level system
    newProgress.trials.push({
      date: today,
      timestamp: Date.now(),
      level: currentLevel, // New decimal level
      phase: currentPhase, // Keep for backward compatibility
      isPrompted: isPrompted
    });

    if (!isPrompted) {
      newProgress.currentStreak += 1;
    } else {
      // Prompted trial resets the independent streak
      newProgress.currentStreak = 0;
    }

    // Phase 4 Mastery Check: Unlock Attributes
    if (currentPhase === 4 && !isPrompted) {
      const p4Independent = newProgress.trials.filter(t => t.phase === 4 && !t.isPrompted).length;
      if (p4Independent === 5) {
        addAttributesFolder();
      }
    }

    // Auto-Advancement Logic
    checkForAutoAdvancement(newProgress);

    newProgress.lastSuccessTime = Date.now();

    if (newProgress.currentStreak >= 3) {
      // Check if we already have success dates for today
      if (!newProgress.successDates.includes(today)) {
        newProgress.successDates.push(today);
      }

      // Keep only last 3 days
      if (newProgress.successDates.length > 3) {
        newProgress.successDates = newProgress.successDates.slice(-3);
      }

      // Check for 3 days in a row
      if (newProgress.successDates.length === 3) {
        const dates = newProgress.successDates.map(d => new Date(d));
        let consecutive = true;
        for (let i = 1; i < dates.length; i++) {
          const diff = Math.round((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
          if (diff !== 1) consecutive = false;
        }

        if (consecutive && currentPhase < 6) {
          setShowAdvancementModal(true);
        }
      }
      // Reset streak after daily goal to avoid flood of modals, 
      // but only if they actually advanced or acknowledged. 
      // For now, reset to allow tracking new streaks.
      newProgress.currentStreak = 0;
    }

    // Check for Review Prompt (e.g. at 20 and 50 trials)
    const totalTrials = newProgress.trials.length;
    if (totalTrials === 20 || totalTrials === 50) {
      try {
        InAppReview.requestReview();
      } catch (error) {
        console.log('Review request skipped:', error);
      }
    }

    setProgressData(newProgress);
    localStorage.setItem('kians-progress', JSON.stringify(newProgress));

    // Reset prompted state for next trial
    setIsPrompted(false);

    setTimeout(() => {
      document.body.classList.remove('success-flash');
      setShowSuccess(false);
      if (currentPhase === 2) {
        setIsCommunicating(false);
      }
    }, 1200);
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleDelete = (index) => {
    if (confirm("Delete this app?")) {
      const newList = [...getCurrentList()];
      newList.splice(index, 1);
      updateCurrentList(newList);
    }
  };

  const handleEdit = (index) => {
    setEditingItemIndex(index);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (newWord, newIcon, newBgColor, newViewMode, newCustomAudio, newCharacterConfig) => {
    if (editingItemIndex === null) return;

    const list = [...getCurrentList()];
    const item = list[editingItemIndex];
    const newItem = {
      ...item,
      word: newWord,
      icon: newIcon,
      bgColor: newBgColor,
      customAudio: newCustomAudio,
      characterConfig: newCharacterConfig // Save configuration for re-editing
    };
    if (item.type === 'folder') {
      newItem.viewMode = newViewMode;
    }

    list[editingItemIndex] = newItem;
    updateCurrentList(list);
    setEditModalOpen(false);
    setEditingItemIndex(null);
  };

  const updateCurrentList = (newList) => {
    // Helper to update the nested structure
    if (currentPath.length === 0) {
      setRootItems(newList);
    } else {
      const newRoot = JSON.parse(JSON.stringify(rootItems));
      let target = newRoot;
      for (let i = 0; i < currentPath.length - 1; i++) {
        target = target[currentPath[i]].contents;
      }
      target[currentPath[currentPath.length - 1]].contents = newList;
      setRootItems(newRoot);
    }
  };

  const handleSetLevel = (newLevel) => {
    setCurrentLevel(newLevel);
    // Reset progress tracking for the new level
    const resetProgress = {
      ...progressData,
      currentStreak: 0,
      successDates: [],
      lastSuccessTime: null
    };
    setProgressData(resetProgress);
    localStorage.setItem('kians-progress', JSON.stringify(resetProgress));
  };

  // Backward compatibility alias
  const handleSetPhase = (newPhase) => {
    // Convert old phase to new level if called
    handleSetLevel(migratePhaseToLevel(newPhase));
  };

  const handleAdvance = () => {
    const nextLevel = getNextLevel(currentLevel);
    if (nextLevel) {
      handleSetLevel(nextLevel);
    }
    setShowAdvancementModal(false);
  };

  const handleWait = () => {
    setShowAdvancementModal(false);
    // Just reset the streak for today to retry criteria
    const resetProgress = {
      ...progressData,
      currentStreak: 0,
      successDates: [],
      lastSuccessTime: null
    };
    setProgressData(resetProgress);
    localStorage.setItem('kians-progress', JSON.stringify(resetProgress));
  };

  const handleLogEssentialEvent = (event) => {
    const newProgress = { ...progressData };
    if (!newProgress.essentialStats) {
      newProgress.essentialStats = { fcr_attempts: 0, denial_presented: 0, tolerance_success: 0 };
    }

    if (event === 'fcr_attempt') newProgress.essentialStats.fcr_attempts += 1;
    if (event === 'denial_presented') newProgress.essentialStats.denial_presented += 1;
    if (event === 'tolerance_success') newProgress.essentialStats.tolerance_success += 1;

    setProgressData(newProgress);
    localStorage.setItem('kians-progress', JSON.stringify(newProgress));
  };

  const handleAddItem = (word, icon, type) => {
    const list = [...getCurrentList()];
    const newItem = type === 'folder'
      ? { id: 'item-' + Date.now(), type: 'folder', word: word || 'New Folder', icon: icon || '📁', contents: [] }
      : { id: 'item-' + Date.now(), type: 'button', word: word || 'New Item', icon: icon || '⚪' };

    const newList = [...list, newItem];
    updateCurrentList(newList);

    // Auto-open edit modal for the new item
    setEditingItemIndex(newList.length - 1);
    setEditModalOpen(true);
  };

  const handleToggleTraining = (index) => {
    if (trainingSelection.includes(index)) {
      setTrainingSelection(trainingSelection.filter(i => i !== index));
    } else {
      setTrainingSelection([...trainingSelection, index]);
    }
  };

  const handleShuffle = () => {
    const list = getCurrentList();
    const selected = trainingSelection.map(i => ({ item: list[i], originalIndex: i }));
    // Shuffle
    selected.sort(() => Math.random() - 0.5);
    setShuffledItems(selected);
  };

  const handleStopTraining = () => {
    setIsTrainingMode(false);
    setShuffledItems(null);
    setTrainingSelection([]);
    setIsEditMode(false); // Close menu
  };

  const handlePickerOpen = (setWord, setIcon) => {
    setPickerCallback(() => (w, i, isImage) => {
      setWord(w);
      setIcon(i, isImage);
      setPickerOpen(false);
    });
    setPickerOpen(true);
  };

  // Determine what items to show in Grid
  let itemsToShow = getCurrentList();
  let isShuffled = false;
  if (isTrainingMode && shuffledItems) {
    itemsToShow = shuffledItems.map(obj => obj.item);
    isShuffled = true;
  } else if (currentPhase === 1 || currentPhase === 2) {
    // Show the selected target for Phase 1 & 2, or fallback to one of the 5 essential icons
    let target = null;
    if (phase1TargetId) {
      target = rootItems.find(i => i.id === phase1TargetId);
    }

    if (!target) {
      // Default to one of the 5 essential Level 1 icons
      const allowedIds = ['snack-generic', 'play-generic', 'toy-generic', 'mom', 'dad'];
      target = rootItems.find(i => i.type === 'button' && allowedIds.includes(i.id));
    }

    itemsToShow = target ? [target] : [];
  } else if (currentPhase === 3) {
    // Show up to 20 items for discrimination (Phase 3B)
    itemsToShow = rootItems.filter(i => i.type === 'button' && i.category !== 'starter').slice(0, 20);
  } else if (currentPhase > 0 && currentPhase < 6) {
    // Hide starters for phases before commenting
    itemsToShow = itemsToShow.filter(i => i.category !== 'starter');
  }

  return (
    <div id="main-area">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {showLevelIntro && (
        <Suspense fallback={null}>
          <LevelIntro
            level={currentLevel}
            onComplete={() => {
              localStorage.setItem(`kiwi-intro-seen-level-${currentLevel}`, 'true');
              setShowLevelIntro(false);
              if (currentStage <= 2 && !phase1TargetId) {
                setShowPhase1Selector(true);
              }
            }}
            onChangeLevel={() => {
              setShowLevelIntro(false);
              setIsEditMode(true); // Open settings to select level
            }}
          />
        </Suspense>
      )}

      {/* Dynamic Background Decorations (Shown only in Screenshot Mode via CSS) */}
      <div className="bg-decorations">
        <div className="decor-item" style={{ top: '10%', left: '5%', fontSize: '3rem' }}>🥝</div>
        <div className="decor-item" style={{ top: '60%', right: '10%', fontSize: '2rem' }}>🌟</div>
        <div className="decor-item" style={{ bottom: '15%', left: '15%', fontSize: '2.5rem' }}>✨</div>
      </div>

      {showStrip && (gridSize !== 'super-big' || localStorage.getItem('kiwi-force-strip') === 'true') && (
        <SentenceStrip
          stripItems={stripItems}
          onClear={() => setStripItems([])}
          onPlay={() => {
            const sentence = stripItems.map(i => i.word).join(" ");
            trackSentence(sentence);
            speak(sentence);
          }}
        />
      )}

      <div id="breadcrumbs">
        {getBreadcrumbs()}
        {currentContext !== 'home' && (
          <span className="phase-label-badge" style={{ background: '#5856D6' }}>
            {contexts.find(c => c.id === currentContext)?.icon} {contexts.find(c => c.id === currentContext)?.label}
          </span>
        )}
        {currentPhase > 0 && <span className="phase-label-badge">Level {currentPhase}</span>}
      </div>

      {showSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10rem', zIndex: 300, pointerEvents: 'none',
          animation: 'zoomIn 0.5s ease'
        }}>
          {currentPhase === 3 ? "🎯" : "🌟"}
        </div>
      )}

      {currentPhase === 2 && !callActive && !isCommunicating && (
        <div className="call-overlay">
          <h2>{timerRemaining > 0 ? "Wait for partner..." : "I have something to say"}</h2>
          <button
            className={`call-btn ${bellCooldown ? 'cooldown' : ''}`}
            disabled={bellCooldown}
            onClick={() => {
              if (!bellCooldown) {
                playBellSound(bellSound);
                setBellCooldown(true);
                setTimerRemaining(5);

                const interval = setInterval(() => {
                  setTimerRemaining(prev => {
                    if (prev <= 1) {
                      clearInterval(interval);
                      setCallActive(true);
                      setBellCooldown(false);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }
            }}
          >
            {timerRemaining > 0 ? (
              <div className="timer-display">
                <div className="timer-circle" style={{
                  background: `conic-gradient(var(--primary) ${timerRemaining * 72}deg, #eee 0deg)`
                }}>
                  <span className="timer-text">{timerRemaining}</span>
                </div>
              </div>
            ) : '🔔'}
          </button>
        </div>
      )}

      {callActive && (
        <div className="call-overlay" style={{
          background: 'rgba(255,255,255,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000
        }}>
          <button
            onClick={() => {
              setCallActive(false);
              setIsCommunicating(true);
            }}
            style={{
              background: '#FF3B30',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '40px 80px',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(255, 59, 48, 0.4)',
              transition: 'transform 0.2s ease',
            }}
          >Let's talk!</button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Grid
          items={itemsToShow}
          currentPhase={currentPhase}
          gridSize={gridSize}
          isTrainingMode={isTrainingMode}
          trainingSelection={trainingSelection}
          isEditMode={isEditMode}
          onItemClick={(item, index) => {
            if (isShuffled) {
              handleItemClick(item, index);
            } else {
              handleItemClick(item, index);
            }
          }}
          onBack={handleBack}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onAddItem={handleAddItem}
          onToggleTraining={handleToggleTraining}
          hasBack={currentPath.length > 0}
          trainingPanelVisible={!shuffledItems}
          folder={currentPath.length > 0 ? (() => {
            let f = rootItems;
            for (let i = 0; i < currentPath.length - 1; i++) f = f[currentPath[i]].contents;
            return f[currentPath[currentPath.length - 1]];
          })() : null}
        />
      </DndContext>

      {!isLocked && !isEditMode && !isTrainingMode && (
        <button
          id="settings-button"
          onClick={() => {
            console.log('Settings button clicked');
            setIsEditMode(true);
          }}
          aria-label="Open Settings"
        >
          ⚙️
        </button>
      )}

      {!isLocked && (
        <Controls
          isEditMode={isEditMode}
          isTrainingMode={isTrainingMode}
          currentPhase={currentPhase}
          currentLevel={currentLevel}
          isEssentialMode={isEssentialMode}
          showStrip={showStrip}
          skinTone={skinTone}
          currentContext={currentContext}
          contexts={contexts}
          onSetContext={handleSetContext}
          onSetSkinTone={setSkinTone}
          onToggleMenu={() => {
            if (!isEditMode) {
              triggerPaywall('open_settings', () => setIsEditMode(true));
            } else {
              setIsEditMode(false);
            }
          }}
          onAddItem={handleAddItem}
          onAddContext={handleAddContext}
          onRenameContext={handleRenameContext}
          onDeleteContext={handleDeleteContext}
          onToggleStrip={setShowStrip}
          onSetPhase={handleSetPhase}
          onSetLevel={handleSetLevel}
          onStartTraining={() => {
            setIsTrainingMode(true);
            setTrainingSelection([]);
          }}
          onReset={() => {
            if (confirm("Reset everything?")) {
              localStorage.clear();
              location.reload();
            }
          }}
          onShuffle={handleShuffle}
          onStopTraining={handleStopTraining}
          onOpenPicker={handlePickerOpen}
          onToggleEssentialMode={setIsEssentialMode}
          onToggleDashboard={() => {
            triggerPaywall('open_dashboard', () => setShowDashboard(true));
          }}
          onRedoCalibration={() => setShowCalibration(true)}
          isPrompted={isPrompted}
          onSetPrompted={setIsPrompted}
          onToggleLock={() => setIsLocked(true)}
          voiceSettings={voiceSettings}
          onUpdateVoiceSettings={setVoiceSettings}
          gridSize={gridSize}
          onUpdateGridSize={setGridSize}
          phase1TargetId={phase1TargetId}
          onSetPhase1Target={setPhase1TargetId}
          rootItems={rootItems}
          colorTheme={colorTheme}
          onSetColorTheme={setColorTheme}
          triggerPaywall={triggerPaywall}
          bellSound={bellSound}
          onUpdateBellSound={setBellSound}
          onAddFavorites={(favorites) => {
            const newFavs = favorites.map((fav, i) => ({
              id: `fav-${Date.now()}-${i}`,
              type: 'button',
              word: fav.word || fav.label,
              icon: fav.icon,
              bgColor: '#FFF3E0'
            }));
            const list = [...rootItems];
            let insertIndex = 0;
            for (let i = 0; i < list.length; i++) {
              if (list[i].category === 'starter') insertIndex = i + 1;
              else break;
            }
            list.splice(insertIndex, 0, ...newFavs);
            setRootItems(list);
          }}
          progressData={progressData}
        />
      )}

      {/* Child Mode Indicator & Unlock Area */}
      {isLocked && (
        <div
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px)) 20px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            cursor: 'pointer',
            textAlign: 'center'
          }}
          onClick={() => {
            const newCount = lockTapCount + 1;
            setLockTapCount(newCount);
            setShowUnlockHint(true);
            if (newCount >= 3) {
              setIsLocked(false);
              localStorage.setItem('kiwi-child-mode', 'unlocked');
              setLockTapCount(0);
              setShowUnlockHint(false);
            }
            setTimeout(() => {
              setLockTapCount(0);
              setShowUnlockHint(false);
            }, 3000);
          }}
        >
          <span style={{
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              🔒 Child Mode Active
            </span>
            {showUnlockHint ? (
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                {3 - lockTapCount} more taps to unlock controls
              </span>
            ) : (
              <span style={{ opacity: 0.8 }}>
                {/iPad|iPhone|iPod/.test(navigator.userAgent)
                  ? "Triple-click Side Button for Guided Access"
                  : "Tap 3x here to unlock controls"}
              </span>
            )}
          </span>
        </div>
      )}


      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        onDelete={() => {
          if (editingItemIndex !== null) {
            handleDelete(editingItemIndex);
            setEditModalOpen(false);
          }
        }}
        onOpenEmojiPicker={handlePickerOpen}
        item={editingItemIndex !== null ? getCurrentList()[editingItemIndex] : null}
        triggerPaywall={triggerPaywall}
      />

      <PickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        userItems={rootItems}
        triggerPaywall={triggerPaywall}
        onSelect={(w, i, isImage) => {
          if (pickerCallback) pickerCallback(w, i, isImage);
        }}
      />

      {showPhase1Selector && (
        <Phase1TargetSelector
          rootItems={rootItems}
          onSelect={(id) => {
            setPhase1TargetId(id);
            setShowPhase1Selector(false);
          }}
        />
      )}

      {showAdvancementModal && (
        <AdvancementModal
          currentPhase={currentPhase}
          onAdvance={handleAdvance}
          onWait={handleWait}
        />
      )}

      {isEssentialMode && (
        <EssentialSkillsMode
          onExit={() => setIsEssentialMode(false)}
          onLogEvent={handleLogEssentialEvent}
        />
      )}

      {showDashboard && (
        <Suspense fallback={null}>
          <Dashboard
            onClose={() => setShowDashboard(false)}
            progressData={progressData}
            currentPhase={currentPhase}
            currentLevel={currentLevel}
            rootItems={rootItems}
          />
        </Suspense>
      )}

      {showCalibration && (
        <TouchCalibration
          onComplete={() => setShowCalibration(false)}
        />
      )}

      {showOnboarding && (
        <Onboarding onComplete={(recommendedPhase, favorites, canRead) => {
          if (typeof recommendedPhase === 'number') {
            setCurrentPhase(recommendedPhase);
            localStorage.setItem('kians-phase', recommendedPhase.toString());
          }

          // Store literacy preference
          if (canRead !== null && canRead !== undefined) {
            localStorage.setItem('kiwi-literacy', JSON.stringify(canRead));
            // Apply literacy-friendly styles
            if (canRead === true || canRead === 'partial') {
              document.body.classList.add('literacy-mode');
            }
          }

          // Inject Favorites if provided
          if (favorites && Array.isArray(favorites) && favorites.length > 0) {
            const newFavs = favorites.map((fav, i) => ({
              id: `fav-${Date.now()}-${i}`,
              type: 'button',
              word: fav.word || fav.label, // Support both formats
              icon: fav.icon,
              bgColor: '#FFF3E0' // Light orange highlight
            }));

            // Insert after starters (index 3 usually) but before folders
            // Current default: [Want, See, Feel, Mom, Dad, More, Folders...]
            // We'll put them after "Feel" (index 2) so they are top row center/right.
            // Or if starters are hidden in early phases, they become #1.
            const list = [...rootItems];
            // Find index of last starter
            let insertIndex = 0;
            for (let i = 0; i < list.length; i++) {
              if (list[i].category === 'starter') insertIndex = i + 1;
              else break;
            }

            list.splice(insertIndex, 0, ...newFavs);

            // Add keyboard folder for readers
            if (canRead === true) {
              const keyboardFolder = {
                id: 'keyboard-folder',
                type: 'folder',
                word: 'Keyboard',
                icon: '⌨️',
                contents: [
                  { id: 'type-word', type: 'button', word: 'Type a word', icon: '✏️' },
                  { id: 'abc', type: 'button', word: 'ABC', icon: '🔤' }
                ]
              };
              list.push(keyboardFolder);
            }

            setRootItems(list);
            // LocalStorage sync happens via useEffect on rootItems change
          }

          setShowOnboarding(false);
        }} />
      )}
      <A2HSModal />
    </div>
  );
}


export default App;
