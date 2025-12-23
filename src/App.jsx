import React, { useState, useEffect, useRef } from 'react';
import Grid from './components/Grid';
import SentenceStrip from './components/SentenceStrip';
import Controls from './components/Controls';
import PickerModal from './components/PickerModal';
import AdvancementModal from './components/AdvancementModal';
import EssentialSkillsMode from './components/EssentialSkillsMode';
import Dashboard from './components/Dashboard';
import EditModal from './components/EditModal';
import Onboarding from './components/Onboarding';
import SplashScreen from './components/SplashScreen';
import { playBellSound } from './utils/sounds';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { InAppReview } from '@capacitor-community/in-app-review';
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
  { id: 'mom', type: 'button', word: "Mom", icon: "👩🏼‍🦱" },
  { id: 'dad', type: 'button', word: "Dad", icon: "👱‍♂️" },
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

  const [currentPhase, setCurrentPhase] = useState(() => {
    const saved = localStorage.getItem('kians-phase');
    return saved ? parseInt(saved) : 0; // 0 is normal mode
  });

  const [skinTone, setSkinTone] = useState(() => {
    return localStorage.getItem('kians-skin-tone') || 'default';
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('kiwi-onboarding-complete');
  });

  const [showSplash, setShowSplash] = useState(true);

  // Child Mode Lock (default to locked for child-safe mode)
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem('kiwi-child-mode');
    return saved !== 'unlocked'; // Default to locked (child mode)
  });
  const [lockTapCount, setLockTapCount] = useState(0);
  const [bellCooldown, setBellCooldown] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Literacy Mode Initialization ---
  useEffect(() => {
    const literacy = localStorage.getItem('kiwi-literacy');
    if (literacy) {
      try {
        const canRead = JSON.parse(literacy);
        if (canRead === true || canRead === 'partial') {
          document.body.classList.add('literacy-mode');
        }
      } catch (e) {
        console.error('Failed to parse literacy preference:', e);
      }
    }
  }, []);

  // --- Superwall Initialization ---
  useEffect(() => {
    // Superwall is now configured natively in iOS (AppDelegate.swift)
    // Web SDK fallback is available via the Capacitor plugin
    if (window.Superwall) {
      window.Superwall.configure('pk_pdrADqfJ3XjhkUUMC92zI');
      console.log('Superwall web SDK configured');
    }
    console.log('Superwall ready (native iOS + web fallback)');
  }, []);

  const triggerPaywall = async (placementName, onContinue) => {
    try {
      // Import the plugin dynamically to avoid errors on web
      const { default: Superwall } = await import('./plugins/superwall');
      const result = await Superwall.register({ event: placementName });
      console.log(`Paywall result for ${placementName}:`, result.result);

      // If user has access, run the callback
      if (result.result === 'userIsSubscribed' || result.result === 'noRuleMatch') {
        if (onContinue) onContinue();
      }
    } catch (error) {
      console.error('Failed to trigger paywall:', error);
      // Fallback: allow access if plugin fails
      if (onContinue) onContinue();
    }
  };


  useEffect(() => {
    localStorage.setItem('kians-skin-tone', skinTone);
  }, [skinTone]);

  // Ensure all items have IDs
  useEffect(() => {
    const ensureIds = (list) => {
      let changed = false;
      const newList = list.map(item => {
        if (!item.id) {
          item.id = item.word + '-' + Math.random().toString(36).substr(2, 9);
          changed = true;
        }
        if (item.type === 'folder' && item.contents) {
          const { list: newContents, changed: contentsChanged } = ensureIds(item.contents);
          if (contentsChanged) {
            item.contents = newContents;
            changed = true;
          }
        }
        return item;
      });
      return { list: newList, changed };
    };

    const { list, changed } = ensureIds(rootItems);
    if (changed) {
      setRootItems([...list]);
    }
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const list = [...getCurrentList()];
    const oldIndex = list.findIndex(i => (i.id || i.word) === active.id);
    const newIndex = list.findIndex(i => (i.id || i.word) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      updateCurrentList(arrayMove(list, oldIndex, newIndex));
    }
  };

  const applySkinTone = (item) => {
    if (!item.icon || typeof item.icon !== 'string') return item;

    // Icons that support skin tones (Human based)
    // 🙋 (I want), 👩 (Mom), 👨 (Dad), 🤝 (Help), Also maybe children if added
    const humanEmojis = ['🙋', '👩', '👨', '👋', '👍', '👎', '✋', '🙌', '🙍', '🙎', '🙇', '🤦', '🤷', '🧑', '👦', '👧'];

    // Check if icon is in our list or starts with one of them (simple check)
    // Actually, checking exact match or containment
    // Handshake 🤝 supports skin tone in newer standard but might require VS16 + combinations. 
    // Let's keep it simple.

    // Ideally we apply modifier to specific known base icons.
    if (skinTone === 'default') return item;

    const modifier = SKIN_TONES[skinTone];
    if (!modifier) return item;

    // Special handling for Handshake if needed, but mostly sticking to single chars
    if (humanEmojis.includes(item.icon)) {
      return { ...item, icon: item.icon + modifier };
    }

    // Help "🤝" is tricky, often default yellow. "💁" (tipping hand) is good for help? Or "🆘"? 
    // Let's stick to simple concatenation for now.
    // If it's "🤝", modifiers work in some fonts as 🤝🏻 (one hand color) or need 🫱🏻‍🫲🏾 complex sequences. 
    // Let's assume standard behavior.

    return item;
  };

  const getProcessedList = (list) => {
    return list.map(item => {
      const newItem = applySkinTone(item);
      if (item.type === 'folder' && item.contents) {
        // Deep copy contents? No, just shallow copy item and handle contents when entered?
        // `Grid` only needs immediate children icons.
        // But `AppItem` shows mini-icons for folder contents.
        // So we need to process contents too for folder view.
        newItem.contents = item.contents.map(sub => applySkinTone(sub));
      }
      return newItem;
    });
  };

  const [currentPath, setCurrentPath] = useState([]);
  const [stripItems, setStripItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [showStrip, setShowStrip] = useState(() => {
    const saved = localStorage.getItem('kians-show-strip');
    return saved === 'true';
  });
  const [trainingSelection, setTrainingSelection] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCallback, setPickerCallback] = useState(null);
  const [callActive, setCallActive] = useState(false); // For Phase II
  const [isCommunicating, setIsCommunicating] = useState(false); // For Phase II communication stage
  const [isPrompting, setIsPrompting] = useState(false); // For Phase V
  const [isPrompted, setIsPrompted] = useState(false); // New: Track if current trial is prompted or independent
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressData, setProgressData] = useState(() => {
    const saved = localStorage.getItem('kians-progress');
    return saved ? JSON.parse(saved) : {
      currentStreak: 0,
      successDates: [],
      lastSuccessTime: null,
      essentialStats: { fcr_attempts: 0, denial_presented: 0, tolerance_success: 0 }
    };
  });
  const [showAdvancementModal, setShowAdvancementModal] = useState(false);
  const [isEssentialMode, setIsEssentialMode] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(() => {
    const saved = localStorage.getItem('kiwi-voice-settings');
    return saved ? JSON.parse(saved) : { rate: 0.9, pitch: 1.0, voiceURI: null };
  });
  const [gridSize, setGridSize] = useState(() => {
    return localStorage.getItem('kiwi-grid-size') || 'auto';
  });

  // For training mode shuffle
  const [shuffledItems, setShuffledItems] = useState(null);

  const synth = window.speechSynthesis;

  useEffect(() => {
    localStorage.setItem('kiwi-voice-settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    localStorage.setItem('kiwi-grid-size', gridSize);
  }, [gridSize]);

  useEffect(() => {
    const key = getContextStorageKey(currentContext);
    localStorage.setItem(key, JSON.stringify(rootItems));
  }, [rootItems, currentContext]);

  // Save current context
  useEffect(() => {
    localStorage.setItem('kiwi-context', currentContext);
  }, [currentContext]);

  // Handle context switching
  const handleSetContext = (newContext) => {
    // Save current layout to current context before switching
    const currentKey = getContextStorageKey(currentContext);
    localStorage.setItem(currentKey, JSON.stringify(rootItems));

    // Load new context's layout
    const newKey = getContextStorageKey(newContext);
    const saved = localStorage.getItem(newKey);
    const newItems = saved ? JSON.parse(saved) : getDefaultDataForContext(newContext);

    setRootItems(newItems);
    setCurrentContext(newContext);
    setCurrentPath([]);
  };

  const handleAddContext = (label, icon) => {
    const id = 'ctx-' + Date.now();
    const newContext = { id, label, icon };
    setContexts([...contexts, newContext]);
    handleSetContext(id);
  };

  const handleRenameContext = (id, newLabel, newIcon) => {
    setContexts(contexts.map(ctx => 
      ctx.id === id ? { ...ctx, label: newLabel, icon: newIcon } : ctx
    ));
  };

  const handleDeleteContext = (id) => {
    if (contexts.length <= 1) {
      alert("You must have at least one location.");
      return;
    }
    if (confirm("Delete this location and all its icons?")) {
      const newContexts = contexts.filter(ctx => ctx.id !== id);
      setContexts(newContexts);
      
      // Remove data
      localStorage.removeItem(getContextStorageKey(id));
      
      // Switch if active
      if (currentContext === id) {
        handleSetContext(newContexts[0].id);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('kians-show-strip', showStrip);
  }, [showStrip]);

  useEffect(() => {
    localStorage.setItem('kians-phase', currentPhase);
    // Auto-enable/disable strip based on phase
    if (currentPhase >= 4) setShowStrip(true);
    else if (currentPhase > 0) setShowStrip(false);

    // Reset path when changing phase
    setCurrentPath([]);
  }, [currentPhase]);

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

    // Add new trial record
    newProgress.trials.push({
      date: today,
      timestamp: Date.now(),
      phase: currentPhase,
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

  const handleSetPhase = (newPhase) => {
    setCurrentPhase(newPhase);
    // Reset progress tracking for the new phase
    const resetProgress = {
      ...progressData,
      currentStreak: 0,
      successDates: [],
      lastSuccessTime: null
    };
    setProgressData(resetProgress);
    localStorage.setItem('kians-progress', JSON.stringify(resetProgress));
  };

  const handleAdvance = () => {
    handleSetPhase(currentPhase + 1);
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
    setPickerCallback(() => (w, i) => {
      setWord(w);
      setIcon(i);
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
  } else if (currentPhase === 1) {
    // Show only the first non-starter button for Phase 1
    const firstBtn = rootItems.find(i => i.type === 'button' && i.category !== 'starter');
    itemsToShow = firstBtn ? [firstBtn] : [];
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
      
      {showStrip && (gridSize !== 'super-big' || localStorage.getItem('kiwi-force-strip') === 'true') && (
        <SentenceStrip
          stripItems={stripItems}
          onClear={() => setStripItems([])}
          onPlay={() => speak(stripItems.map(i => i.word).join(" "))}
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
                playBellSound();
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
        <div className="call-overlay" style={{ background: 'rgba(255,255,255,0.8)' }}>
          <h2 style={{ color: 'var(--primary)' }}>Partner is here!</h2>
          <button className="primary" onClick={() => {
            setCallActive(false);
            setIsCommunicating(true);
          }}>Let's communicate!</button>
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

      {!isLocked && (
        <Controls
          isEditMode={isEditMode}
          isTrainingMode={isTrainingMode}
          currentPhase={currentPhase}
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
          isPrompted={isPrompted}
          onSetPrompted={setIsPrompted}
          onToggleLock={() => setIsLocked(true)}
          voiceSettings={voiceSettings}
          onUpdateVoiceSettings={setVoiceSettings}
          gridSize={gridSize}
          onUpdateGridSize={setGridSize}
          onAddFavorites={(favorites) => {
            // Add favorites to the root items
            const newFavs = favorites.map((fav, i) => ({
              id: `fav-${Date.now()}-${i}`,
              type: 'button',
              word: fav.word,
              icon: fav.icon,
              bgColor: '#FFF3E0', // Light orange highlight
              usageCount: 0 // Initialize usage tracking
            }));

            const list = [...rootItems];
            // Find index of last starter
            let insertIndex = 0;
            for (let i = 0; i < list.length; i++) {
              if (list[i].category === 'starter') insertIndex = i + 1;
              else break;
            }

            list.splice(insertIndex, 0, ...newFavs);
            setRootItems(list);
          }}
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
      />

      <PickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(w, i) => {
          if (pickerCallback) pickerCallback(w, i);
        }}
      />

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
        <Dashboard
          onClose={() => setShowDashboard(false)}
          progressData={progressData}
          currentPhase={currentPhase}
          rootItems={rootItems}
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
    </div>
  );
}


export default App;
