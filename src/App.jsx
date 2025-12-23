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
import { playBellSound } from './utils/sounds';
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

const defaultData = [
  { id: 'starter-want', type: 'button', word: "I want", icon: "🙋", category: 'starter' },
  { id: 'starter-see', type: 'button', word: "I see", icon: "👀", category: 'starter' },
  { id: 'starter-feel', type: 'button', word: "I feel", icon: "😊", category: 'starter' },
  { id: 'mom', type: 'button', word: "Mom", icon: "👩‍🦱" },
  { id: 'dad', type: 'button', word: "Dad", icon: "👱‍♂️" },
  { id: 'more', type: 'button', word: "More", icon: "➕" },
  {
    id: 'food-folder', type: 'folder', word: "Foods", icon: "🍎", contents: [
      { id: 'banana', type: 'button', word: "Banana", icon: "🍌" },
      { id: 'apple', type: 'button', word: "Apple", icon: "🍎" },
      { id: 'cracker', type: 'button', word: "Cracker", icon: "🍘" },
      { id: 'water', type: 'button', word: "Water", icon: "💧" },
      { id: 'broccoli', type: 'button', word: "Broccoli", icon: "🥦" }
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
  }
];

function App() {
  const [rootItems, setRootItems] = useState(() => {
    const saved = localStorage.getItem('kians-words-ios');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(defaultData));
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

  const [isLocked, setIsLocked] = useState(false);
  const [lockTapCount, setLockTapCount] = useState(0);

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

  // --- Superwall Initialization ---
  useEffect(() => {
    if (window.Superwall) {
      // Configure Superwall with your API key
      window.Superwall.configure('pk_pdrADqfJ3XjhkUUMC92zI');
      console.log('Superwall configured successfully');
    } else {
      console.warn('Superwall SDK not loaded');
    }
  }, []);

  const triggerPaywall = (placementName, onContinue) => {
    if (window.Superwall) {
      // Register a placement - this will show a paywall if configured in dashboard
      window.Superwall.register(placementName, null, () => {
        // This callback runs when user should access the feature
        if (onContinue) onContinue();
      });
    } else {
      // Fallback: allow access if SDK not loaded
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

  // For training mode shuffle
  const [shuffledItems, setShuffledItems] = useState(null);

  const synth = window.speechSynthesis;

  useEffect(() => {
    localStorage.setItem('kians-words-ios', JSON.stringify(rootItems));
  }, [rootItems]);

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
    u.rate = 0.9;
    synth.speak(u);
  };

  const handleItemClick = (item, index) => {
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

    setProgressData(newProgress);
    localStorage.setItem('kians-progress', JSON.stringify(newProgress));

    // Reset prompted state for next trial
    setIsPrompted(false);

    setTimeout(() => {
      document.body.classList.remove('success-flash');
      setShowSuccess(false);
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

  const handleSaveEdit = (newWord, newIcon, newBgColor, newViewMode, newCustomAudio) => {
    if (editingItemIndex === null) return;

    const list = [...getCurrentList()];
    const item = list[editingItemIndex];
    const newItem = { ...item, word: newWord, icon: newIcon, bgColor: newBgColor, customAudio: newCustomAudio };
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
    // Show two items for discrimination (e.g. first two buttons)
    itemsToShow = rootItems.filter(i => i.type === 'button' && i.category !== 'starter').slice(0, 2);
  } else if (currentPhase > 0 && currentPhase < 6) {
    // Hide starters for phases before commenting
    itemsToShow = itemsToShow.filter(i => i.category !== 'starter');
  }

  return (
    <div id="main-area">
      {showStrip && (
        <SentenceStrip
          stripItems={stripItems}
          onClear={() => setStripItems([])}
          onPlay={() => speak(stripItems.map(i => i.word).join(" "))}
        />
      )}

      <div id="breadcrumbs">
        {getBreadcrumbs()}
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

      {currentPhase === 2 && !callActive && (
        <div className="call-overlay">
          <h2>Tap the bell to call your partner</h2>
          <button className="call-btn" onClick={() => {
            setCallActive(true);
            playBellSound();
          }}>🔔</button>
        </div>
      )}

      {callActive && (
        <div className="call-overlay" style={{ background: 'rgba(255,255,255,0.8)' }}>
          <h2 style={{ color: 'var(--primary)' }}>Partner is here!</h2>
          <button className="primary" onClick={() => setCallActive(false)}>Let's communicate!</button>
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
          onSetSkinTone={setSkinTone}
          onToggleMenu={() => {
            if (!isEditMode) {
              triggerPaywall('open_settings', () => setIsEditMode(true));
            } else {
              setIsEditMode(false);
            }
          }}
          onAddItem={handleAddItem}
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
          onToggleDashboard={setShowDashboard}
          isPrompted={isPrompted}
          onSetPrompted={setIsPrompted}
          onToggleLock={() => setIsLocked(true)}
        />
      )}

      {/* Unlock button when locked */}
      {isLocked && (
        <div
          style={{
            position: 'fixed', bottom: '10px', right: '10px',
            width: '50px', height: '50px', opacity: 0.3
          }}
          onClick={() => {
            const newCount = lockTapCount + 1;
            setLockTapCount(newCount);
            if (newCount >= 3) {
              setIsLocked(false);
              setLockTapCount(0);
            }
            setTimeout(() => setLockTapCount(0), 2000);
          }}
        />
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
        />
      )}

      {showOnboarding && (
        <Onboarding onComplete={(recommendedPhase) => {
          if (typeof recommendedPhase === 'number') {
            setCurrentPhase(recommendedPhase);
            localStorage.setItem('kians-phase', recommendedPhase.toString());
          }
          setShowOnboarding(false);
        }} />
      )}
    </div>
  );
}


export default App;
