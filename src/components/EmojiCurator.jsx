import { useState, useMemo, useRef, useEffect } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';
import { triggerHaptic } from '../utils/haptics';
import { CORE_VOCABULARY, WORD_CLASSES, TEMPLATES, SKILLS, CONTEXT_DEFINITIONS } from '../data/aacData';
import CharacterBuilder from './CharacterBuilder';
import AvatarRenderer from './AvatarRenderer';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import SplashScreen from './SplashScreen';

const TONE_CATEGORIES = [
  "Tone: Pale",
  "Tone: Cream White",
  "Tone: Brown",
  "Tone: Dark Brown",
  "Tone: Black"
];

const TONE_NAMES = ["Pale", "Cream White", "Brown", "Dark Brown", "Black"];
// Regex to capture tone from suffix: "Name (Pale)" -> match "Pale"
// Note: Double backslashes for string literal to produce literal backslash for RegExp
const TONE_SUFFIX_REGEX = new RegExp(` ((${TONE_NAMES.join('|')}))\\)$`, 'i');
// Regex for prefix: "Pale Name" -> match "Pale"
const TONE_PREFIX_REGEX = new RegExp(`^(${TONE_NAMES.join('|')}) `, 'i');

const MODIFIERS = {
  'Pale': '\u{1F3FB}',
  'Cream White': '\u{1F3FC}',
  'Brown': '\u{1F3FD}',
  'Dark Brown': '\u{1F3FE}',
  'Black': '\u{1F3FF}'
};

// Map for manually moving items from "New Emojis" to better categories
const CATEGORY_OVERRIDES = {
    'Harp': 'Objects',
    'Shovel': 'Objects',
  'Face With Diagonal Mouth': 'Smileys & Emotion',
  'Face with Diagonal Mouth': 'Smileys & Emotion',
  'Face Exhaling': 'Smileys & Emotion',
  'Face in Clouds': 'Smileys & Emotion',
  'Heart on Fire': 'Smileys & Emotion',
  'Mending Heart': 'Smileys & Emotion',
  'Person with White Cane': 'People & Fantasy', 
  'New Emojis Person': 'People & Fantasy' 
};

const applyModifier = (baseEmoji, modifier) => {
  // Check for ZWJ
  const zwjIndex = baseEmoji.indexOf('\u200D');
  if (zwjIndex !== -1) {
      const part1 = baseEmoji.substring(0, zwjIndex);
      const part2 = baseEmoji.substring(zwjIndex);
      // Remove FE0F from end of part1 if present
      let cleanPart1 = part1;
      if (cleanPart1.endsWith('\uFE0F')) {
          cleanPart1 = cleanPart1.substring(0, cleanPart1.length - 1);
      }
      return cleanPart1 + modifier + part2;
  } else {
      let cleanBase = baseEmoji;
      if (cleanBase.endsWith('\uFE0F')) {
          cleanBase = cleanBase.substring(0, cleanBase.length - 1);
      }
      return cleanBase + modifier;
  }
};

// Process data once to group variations
const { categories, groupedEmojiData, allEmojisFlat } = (() => {
  if (!EMOJI_DATA) return { categories: [], groupedEmojiData: {}, allEmojisFlat: [] };

  console.log('Processing and grouping emojis...');
  
  // We exclude the Tone categories from being displayed as "Base" categories
  const baseCategoriesList = Object.keys(EMOJI_DATA).filter(c => !TONE_CATEGORIES.includes(c));
  
  // Index ALL emojis globally for lookup by string
  const globalEmojiMap = new Map(); // EmojiChar -> Item
  Object.keys(EMOJI_DATA).forEach(cat => {
      (EMOJI_DATA[cat] || []).forEach(item => {
          globalEmojiMap.set(item.emoji, item);
      });
  });

  const flatList = [];
  const baseMap = new Map(); // Name -> { item, category, index }
  const identifiedVariations = new Set(); // Emojis that are linked as variations

  // 1. First Pass: Create base items and identify variations
  baseCategoriesList.forEach(cat => {
    (EMOJI_DATA[cat] || []).forEach(item => {
      // Determine effective category (Manual override or default)
      let effectiveCategory = cat;
      if (cat === "New Emojis") {
          if (CATEGORY_OVERRIDES[item.name]) {
              effectiveCategory = CATEGORY_OVERRIDES[item.name];
          } else if (item.name === "New Emojis Person" || item.emoji === "🧑‍🦯" || item.emoji === "👨‍🦯" || item.emoji === "👩‍🦯") {
              effectiveCategory = 'People & Fantasy';
          }
      }

      const newItem = { ...item, category: effectiveCategory, variations: [] };
      flatList.push(newItem);
      baseMap.set(item.name.toLowerCase(), newItem);

      // Try to find variations by generating strings (Global Search)
      Object.keys(MODIFIERS).forEach(toneName => {
          const modChar = MODIFIERS[toneName];
          const generatedEmoji = applyModifier(item.emoji, modChar);
          
          if (globalEmojiMap.has(generatedEmoji)) {
              const foundItem = globalEmojiMap.get(generatedEmoji);
              if (!newItem.variations.find(v => v.emoji === foundItem.emoji)) {
                  newItem.variations.push({ ...foundItem, tone: toneName });
                  identifiedVariations.add(foundItem.emoji);
              }
          }
      });
    });
  });

  // 2. Second Pass: Fallback name-based grouping (and identifying more variations)
  TONE_CATEGORIES.forEach(cat => {
    (EMOJI_DATA[cat] || []).forEach(item => {
      let baseName = null;
      let tone = null;

      let match = item.name.match(TONE_SUFFIX_REGEX);
      if (match) {
        baseName = item.name.replace(TONE_SUFFIX_REGEX, '');
        tone = match[1];
      } else {
        match = item.name.match(TONE_PREFIX_REGEX);
        if (match) {
          baseName = item.name.replace(TONE_PREFIX_REGEX, '');
          tone = match[1];
        }
      }

      if (baseName && baseMap.has(baseName.toLowerCase())) {
        const baseItem = baseMap.get(baseName.toLowerCase());
        if (!baseItem.variations.find(v => v.emoji === item.emoji)) {
            baseItem.variations.push({ ...item, tone });
            identifiedVariations.add(item.emoji);
        }
      }
    });
  });

  // 3. Set Default Tone to Brown
  flatList.forEach(item => {
      if (item.variations.length > 0) {
          const brownVar = item.variations.find(v => v.tone === 'Brown');
          if (brownVar) {
              item.emoji = brownVar.emoji;
              item.variations = item.variations.filter(v => v.tone !== 'Brown');
          }
      }
  });

  // 4. Build Grouped Data (Filtering out variations)
  const groupedData = {};
  const allTargetCategories = new Set([...baseCategoriesList, ...Object.values(CATEGORY_OVERRIDES)]);
  
  allTargetCategories.forEach(cat => {
      const filtered = flatList.filter(i => i.category === cat && !identifiedVariations.has(i.emoji));
      if (filtered.length > 0) {
          groupedData[cat] = filtered;
      }
  });

  const finalCategories = ['Characters', 'My People', ...Object.keys(groupedData)];

  return { categories: finalCategories, groupedEmojiData: groupedData, allEmojisFlat: flatList };
})();

// Current icons in the app (from PickerModal.jsx)
const CURRENT_ICONS = {
    'TV': ['🔴', '🐶', '🎵', '📚'],
    'Food': ['🍎', '🍌', '🧃', '🍪'],
    'Toys': ['⚽', '🧱', '🚗', '🫧'],
    'Feelings': ['😄', '😢', '😠']
};

const EmojiCurator = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerTarget, setPickerTarget] = useState(null); // { item, x, y }
  
  // Lazy Loading State
  const BATCH_SIZE = 100;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const gridRef = useRef(null);

  // AAC Features State
  const [emojiMetadata, setEmojiMetadata] = useState({}); // { char: { label, wordClass, backgroundColor } }
  const [blacklistedEmojis, setBlacklistedEmojis] = useState([]); // Array of excluded emoji chars
  const [customItems, setCustomItems] = useState([
    {
        id: 'avatar-mom',
        name: 'Mom',
        category: 'My People',
        type: 'avatar',
        recipe: {
            head: 'round',
            skin: '#F1C27D',
            hair: 'short',
            hairColor: '#2C222B', // Black
            eyeColor: '#333333',
            facialHair: 'none',
            eyes: 'happy',
            mouth: 'smile',
            accessory: 'none'
        },
        emoji: 'avatar-mom'
    },
    {
        id: 'avatar-dad',
        name: 'Dad',
        category: 'My People',
        type: 'avatar',
        recipe: {
            head: 'round',
            skin: '#F1C27D',
            hair: 'short',
            hairColor: '#A56B46', // Brown
            eyeColor: '#2e536f', // Blue
            facialHair: 'short_beard',
            eyes: 'happy',
            mouth: 'smile',
            accessory: 'none'
        },
        emoji: 'avatar-dad'
    },
    {
        id: 'avatar-ms-rachel',
        name: 'Ms Rachel',
        category: 'My People',
        type: 'avatar',
        recipe: {
            head: 'round',
            skin: '#F1C27D',
            hair: 'medium',
            hairColor: '#A56B46',
            eyeColor: '#333333',
            facialHair: 'none',
            eyes: 'happy',
            mouth: 'smile',
            accessory: 'none'
        },
        emoji: 'avatar-ms-rachel'
    },
    {
        id: 'char-elmo',
        name: 'Elmo',
        category: 'Characters',
        emoji: '🔴'
    },
    {
        id: 'char-simple-songs',
        name: 'Super Simple Songs',
        category: 'Characters',
        emoji: '🎵'
    },
    {
        id: 'char-spiderman',
        name: 'Spiderman',
        category: 'Characters',
        emoji: '🕷️'
    }
  ]); // [{ id, name, category, image: base64 }]
  const [showCoreOnly, setShowCoreOnly] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Item being edited
  const [showTemplates, setShowTemplates] = useState(false);
  const [sequenceMode, setSequenceMode] = useState(false);
  const [sequence, setSequence] = useState([]); // Array of items
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [showPhraseCreator, setShowPhraseCreator] = useState(false);
  const [showVisualSceneCreator, setShowVisualSceneCreator] = useState(false);
  const [showCharacterBuilder, setShowCharacterBuilder] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [searchQueryImage, setSearchQueryImage] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [tempMeta, setTempMeta] = useState({ label: '', wordClass: 'noun', backgroundColor: '#ffffff', skill: 'none' });
  const [activeContext, setActiveContext] = useState('Default'); // 'Default', 'School', etc.
  const [guideMode, setGuideMode] = useState(false);

  useEffect(() => {
    if (editingItem) {
        const existing = emojiMetadata[editingItem.emoji] || {};
        setTempMeta({
            label: existing.label || editingItem.name,
            wordClass: existing.wordClass || 'noun',
            backgroundColor: existing.backgroundColor || '#ffffff',
            skill: existing.skill || 'none'
        });
    }
  }, [editingItem]);

  // Responsive State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
      const handleResize = () => {
          const mobile = window.innerWidth < 850;
          setIsMobile(mobile);
          if (!mobile) setShowSidebar(true);
          else if (mobile && !showSidebar) setShowSidebar(false);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    if (gridRef.current) gridRef.current.scrollTop = 0;
  }, [activeCategory, searchQuery]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 500) {
      setVisibleCount(prev => prev + BATCH_SIZE);
    }
  };

  const [selectedEmojis, setSelectedEmojis] = useState(() => {
    const initial = {};
    categories.forEach(category => {
      initial[category] = [];
    });

    // Add Default People & Characters
    initial['My People'] = ['avatar-mom', 'avatar-dad', 'avatar-ms-rachel'];
    initial['Characters'] = ['🔴', '🎵', '🕷️'];
    
    Object.keys(CURRENT_ICONS).forEach(cat => {
        (CURRENT_ICONS[cat] || []).forEach(emoji => {
            const foundBase = allEmojisFlat.find(e => e.emoji === emoji);
            if (foundBase) {
                if (!initial[foundBase.category]) initial[foundBase.category] = [];
                if (!initial[foundBase.category].includes(emoji)) {
                  initial[foundBase.category].push(emoji);
                }
            } else {
                 const foundVarBase = allEmojisFlat.find(e => e.variations.some(v => v.emoji === emoji));
                 if (foundVarBase) {
                     if (!initial[foundVarBase.category]) initial[foundVarBase.category] = [];
                     if (!initial[foundVarBase.category].includes(emoji)) {
                         initial[foundVarBase.category].push(emoji);
                     }
                 }
            }
        });
    });
    
    return initial;
  });

  const filteredEmojis = useMemo(() => {
    let list = groupedEmojiData[activeCategory] || [];
    
    // Merge Custom Items for this category
    const relevantCustom = customItems.filter(i => i.category === activeCategory);
    list = [...relevantCustom, ...list];

    // Apply Context Filter (Priority)
    if (activeContext !== 'Default' && CONTEXT_DEFINITIONS[activeContext]) {
        const contextWords = CONTEXT_DEFINITIONS[activeContext];
        // Find context items in the current list
        const contextItems = list.filter(item => {
             const name = item.name.toLowerCase();
             return contextWords.some(w => name.includes(w.toLowerCase()));
        });
        // Move them to top
        const otherItems = list.filter(item => !contextItems.includes(item));
        list = [...contextItems, ...otherItems];
    }

    if (searchQuery) {
      const allWithCustom = [...customItems, ...allEmojisFlat];
      list = allWithCustom.filter(item => 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emoji.includes(searchQuery)
      );
    }

    // Apply Blacklist
    if (blacklistedEmojis.length > 0) {
        list = list.filter(item => !blacklistedEmojis.includes(item.emoji));
    }

    if (showCoreOnly) {
        list = list.filter(item => {
            const words = item.name.toLowerCase().split(/[ -]/); // Split by space or dash
            return words.some(w => CORE_VOCABULARY.includes(w)) || CORE_VOCABULARY.includes(item.name.toLowerCase());
        });
    }

    return list;
  }, [searchQuery, activeCategory, showCoreOnly]);

  // Long Press Handling
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const pickerRef = useRef(null);
  const previousFocus = useRef(null);

  // Accessibility: Focus Management for Picker
  useEffect(() => {
    if (pickerTarget) {
      previousFocus.current = document.activeElement;
      // Small timeout to allow render
      const timer = setTimeout(() => {
        const firstButton = pickerRef.current?.querySelector('button');
        firstButton?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setPickerTarget(null);
        }
        if (e.key === 'Tab') {
           const buttons = pickerRef.current?.querySelectorAll('button');
           if (!buttons || buttons.length === 0) return;
           const first = buttons[0];
           const last = buttons[buttons.length - 1];

           if (e.shiftKey) {
             if (document.activeElement === first) {
               e.preventDefault();
               last.focus();
             }
           } else {
             if (document.activeElement === last) {
               e.preventDefault();
               first.focus();
             }
           }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    } else {
      if (previousFocus.current) {
        previousFocus.current.focus();
        previousFocus.current = null;
      }
    }
  }, [pickerTarget]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const applyTemplate = (templateName) => {
      const words = TEMPLATES[templateName];
      if (!words) return;
      
      const newSelection = { ...selectedEmojis };
      let addedCount = 0;

      words.forEach(word => {
          // Find emoji by name (exact match preferred)
          let match = allEmojisFlat.find(e => e.name.toLowerCase() === word.toLowerCase());
          if (!match) {
             match = allEmojisFlat.find(e => e.name.toLowerCase().includes(word.toLowerCase()));
          }

          if (match) {
              if (!newSelection[match.category]) newSelection[match.category] = [];
              if (!newSelection[match.category].includes(match.emoji)) {
                  newSelection[match.category].push(match.emoji);
                  addedCount++;
              }
          }
      });
      
      setSelectedEmojis(newSelection);
      setShowTemplates(false);
      triggerHaptic('success');
      alert(`Added ${addedCount} icons from "${templateName}" template.`);
  };

  const handleSaveMetadata = (char, label, wordClass, backgroundColor, skill) => {
      setEmojiMetadata(prev => ({
          ...prev,
          [char]: { label, wordClass, backgroundColor, skill }
      }));
      setEditingItem(null);
  };

  const handleGetPhoto = async (source) => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source 
      });

      if (image && image.dataUrl) {
        const name = prompt("Enter name for this icon:", "My Photo");
        if (name) {
          const newItem = {
            id: `custom-${Date.now()}`,
            name,
            category: activeCategory,
            image: image.dataUrl,
            emoji: `custom-${Date.now()}`
          };
          setCustomItems(prev => [newItem, ...prev]);
          toggleEmoji(activeCategory, newItem.emoji, newItem);
          setShowImageSearch(false);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  try {
    // Helper to check if an emoji is selected
    const isSelected = (cat, emojiChar) => {
        const list = selectedEmojis[cat] || [];
        return list.includes(emojiChar);
    };

    // Helper to find WHICH emoji from a group is selected (if any)
    const getSelectedInGroup = (cat, item) => {
        const list = selectedEmojis[cat] || [];
        if (list.includes(item.emoji)) return item.emoji;
        const found = item.variations.find(v => list.includes(v.emoji));
        return found ? found.emoji : null;
    };

    const toggleEmoji = (category, targetEmoji, baseItem = null) => {
      if (!baseItem) {
          baseItem = allEmojisFlat.find(b => 
              b.emoji === targetEmoji || 
              b.variations.some(v => v.emoji === targetEmoji)
          );
      }

      // Auditory Feedback
      if (baseItem) {
          const varItem = baseItem.variations.find(v => v.emoji === targetEmoji);
          speak(varItem ? varItem.name : baseItem.name);
      }

      setSelectedEmojis(prev => {
        const catList = prev[category] || [];
        
        let groupEmojis = [targetEmoji];
        if (baseItem) {
            groupEmojis = [baseItem.emoji, ...baseItem.variations.map(v => v.emoji)];
        }
        
        const isTargetSelected = catList.includes(targetEmoji);
        let newList = [...catList];
        
        if (isTargetSelected) {
            newList = newList.filter(e => e !== targetEmoji);
        } else {
            newList = newList.filter(e => !groupEmojis.includes(e));
            newList.push(targetEmoji);
        }
        
        return { ...prev, [category]: newList };
      });
    };

    const exportSelected = () => {
      const output = {};
      let validationErrors = [];

      Object.keys(selectedEmojis).forEach(category => {
        if (selectedEmojis[category] && selectedEmojis[category].length > 0) {
          output[category] = selectedEmojis[category].map(emojiChar => {
              const custom = customItems.find(c => c.emoji === emojiChar);
              if (custom) {
                  if (custom.type === 'avatar') {
                      return { w: custom.name, type: 'custom_avatar', recipe: custom.recipe, i: '👤' };
                  }
                  return { w: custom.name, i: custom.image, isCustom: true };
              }

              const base = allEmojisFlat.find(e => e.emoji === emojiChar);
              let foundName = "Unknown";
              
              if (base) {
                  foundName = base.name;
              } else {
                  allEmojisFlat.some(b => {
                      const v = b.variations.find(v => v.emoji === emojiChar);
                      if (v) {
                          foundName = v.name; 
                          return true;
                      }
                      return false;
                  });
              }

              if (foundName === "Unknown") {
                validationErrors.push({ category, emoji: emojiChar, error: "Name not found" });
              }

              // Apply Metadata Overrides
              const meta = emojiMetadata[emojiChar] || {};
              const finalName = meta.label || foundName;
              const wordClass = meta.wordClass || 'noun'; // Default to noun? Or maybe try to guess? 'noun' is a safe fallback for AAC.
              const bgColor = meta.backgroundColor || '#ffffff';
              const skill = meta.skill || 'none';
              
              return { w: finalName, i: emojiChar, wc: wordClass, bg: bgColor, skill };
          });
        }
      });

      if (validationErrors.length > 0) {
        console.error("Export Validation Failed:", validationErrors);
        alert(`Export failed! Found ${validationErrors.length} items with missing names. Check console for details.`);
        return;
      }

      const jsonString = JSON.stringify(output, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iconsData.json';
      a.click();
    };

    const totalSelected = Object.values(selectedEmojis).reduce((sum, arr) => sum + (arr?.length || 0), 0);

    const openPicker = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPickerTarget({
            item,
            category: item.category || activeCategory,
            x: rect.left + rect.width / 2,
            y: rect.top
        });
        speak(item.name);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleStart = (e, item) => {
        isLongPress.current = false;
        if (!item.variations || item.variations.length === 0) return;

        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            openPicker(e, item);
        }, 500);
    };

    const handleCleanup = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleClick = (e, cat, item) => {
        if (!isLongPress.current && !pickerTarget) {
            // Smart Haptics Logic
            const isCore = CORE_VOCABULARY.includes(item.name.toLowerCase());
            const meta = emojiMetadata[item.emoji] || {};
            const isDenial = meta.skill === 'denial' || item.name.toLowerCase() === 'no' || item.name.toLowerCase() === 'stop';
            
            if (isDenial) {
                triggerHaptic('heavy');
            } else if (isCore) {
                triggerHaptic('medium');
            } else {
                triggerHaptic('light');
            }

            if (sequenceMode) {
                // Add to sequence
                setSequence(prev => [...prev, { ...item, id: Date.now() }]); // Unique ID for sequence
            } else {
                toggleEmoji(cat, item.emoji, item);
            }
        }
    };

    const handleContextMenu = (e, item) => {
        if (item.variations && item.variations.length > 0) {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            setPickerTarget({
                item,
                category: item.category || activeCategory,
                x: rect.left + rect.width / 2,
                y: rect.top
            });
        }
    };

    if (categories.length === 0) {
        return <div style={{padding: '50px', background: 'white'}}>No categories found in EMOJI_DATA. Check src/utils/emojiData.js</div>;
    }

        return (
          <div style={{
            padding: '0',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            width: '100vw',
            height: '100dvh',
            margin: '0',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            background: '#f0f2f5',
            color: '#000',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            userSelect: 'none',
            overflow: 'hidden'
          }}>
            {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            
            {/* Top Navigation Bar */}              <div className="emoji-curator-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {isMobile && (
                      <button 
                          onClick={() => setShowSidebar(!showSidebar)}
                          style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'white',
                              fontSize: '1.5rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '5px'
                          }}
                      >
                          ☰
                      </button>
                  )}
                  <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🥝</span>
                  {!isMobile && <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>LIBRARY BUILDER</h1>}
                </div>
        
                <div style={{ display: 'flex', gap: isMobile ? '10px' : '20px', alignItems: 'center' }}>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                      <input 
                          type="checkbox" 
                          checked={showCoreOnly} 
                          onChange={(e) => setShowCoreOnly(e.target.checked)}
                          style={{ accentColor: '#4ECDC4', width: '16px', height: '16px' }}
                      />
                      Core Only
                  </label>
        
                  <div style={{ position: 'relative' }}>
                      <button
                          onClick={() => setShowToolsMenu(!showToolsMenu)}
                          style={{
                              padding: isMobile ? '8px 12px' : '10px 15px',
                              background: '#333',
                              border: '1px solid #555',
                              borderRadius: '8px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: isMobile ? '0.8rem' : '0.9rem',
                              display: 'flex', alignItems: 'center', gap: '5px'
                          }}
                      >
                          Tools ▾
                      </button>
                      
                      {showToolsMenu && (
                          <div style={{
                              position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                              background: 'white', borderRadius: '12px', padding: '10px',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.2)', width: '200px',
                              display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2000
                          }}>
                              <button onClick={() => { setShowSmartImport(true); setShowToolsMenu(false); }} style={{ textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }}>📥 Bulk Import</button>
                              <button onClick={() => { setShowTemplates(true); setShowToolsMenu(false); }} style={{ textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }}>📋 Templates</button>
                              <button onClick={() => { setShowImageSearch(true); setShowToolsMenu(false); }} style={{ textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }}>📷 Add Custom</button>
                              <button onClick={() => { setSequenceMode(!sequenceMode); setShowToolsMenu(false); }} style={{ textAlign: 'left', padding: '10px', background: sequenceMode ? '#FFF3E0' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#333', fontWeight: sequenceMode ? 'bold' : 'normal' }}>
                                  {sequenceMode ? 'Finish Sequence' : '✨ Builder Mode'}
                              </button>
                              <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
                              <button onClick={() => {
                                  const id = Math.random().toString(36).substring(7);
                                  alert(`Board Link Copied: https://kiwiaac.app/share/${id}`);
                                  setShowToolsMenu(false);
                              }} style={{ textAlign: 'left', padding: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#007AFF', fontWeight: 'bold' }}>🔗 Share Board</button>
                          </div>
                      )}
                  </div>
        
                  <div style={{ background: '#333', padding: '8px 15px', borderRadius: '8px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                    <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>{totalSelected}</span> {isMobile ? '' : 'icons selected'}
                  </div>
                  <button
                    onClick={exportSelected}
                    style={{
                      padding: isMobile ? '8px 15px' : '10px 25px',
                      background: '#4ECDC4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}
                  >
                    {isMobile ? 'SAVE' : 'SAVE iconsData.json'}
                  </button>
                </div>
              </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          {/* Category List */}
          <div style={{
            width: '280px',
            height: '100%',
            overflowY: 'auto',
            background: 'white',
            borderRight: '1px solid #ddd',
            padding: '20px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            position: isMobile ? 'absolute' : 'relative',
            zIndex: 100,
            left: 0,
            top: 0,
            transform: showSidebar ? 'translateX(0)' : (isMobile ? 'translateX(-100%)' : 'translateX(0)'),
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isMobile && showSidebar ? '4px 0 15px rgba(0,0,0,0.1)' : 'none'
          }}>
            <div style={{ padding: '0 15px 15px 15px' }}>
              <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 'bold', marginBottom: '10px' }}>CATEGORIES</div>
              <div style={{ position: 'relative' }}>
                  <input 
                      type="text"
                      placeholder="Search all..."
                      aria-label="Search emojis"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                          width: '100%',
                          padding: '8px 30px 8px 30px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          fontSize: '0.85rem'
                      }}
                  />
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }} aria-hidden="true">🔍</span>
                  {searchQuery && (
                      <button
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search"
                          style={{
                              position: 'absolute',
                              right: '5px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              color: '#999',
                              fontSize: '1rem',
                              cursor: 'pointer',
                              padding: '0 5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}
                      >
                          ×
                      </button>
                  )}
              </div>
            </div>

            {!searchQuery && categories.map(category => (
              <button
                key={category}
                onClick={() => {
                    setActiveCategory(category);
                    if (isMobile) setShowSidebar(false);
                }}
                aria-label={`Select category ${category}`}
                aria-current={activeCategory === category ? 'page' : undefined}
                style={{
                  textAlign: 'left',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeCategory === category ? '#f0f7ff' : 'transparent',
                  color: activeCategory === category ? '#007AFF' : '#555',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: activeCategory === category ? '600' : 'normal',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{category}</span>
                {selectedEmojis[category]?.length > 0 && (
                  <span style={{ 
                    background: '#4ECDC4',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedEmojis[category].length}
                  </span>
                )}
              </button>
            ))}

            {blacklistedEmojis.length > 0 && (
                <div style={{ marginTop: 'auto', padding: '15px', borderTop: '1px solid #eee' }}>
                    <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 'bold', marginBottom: '5px' }}>HIDDEN ITEMS</div>
                    <button 
                        onClick={() => {
                            if (confirm(`Restore ${blacklistedEmojis.length} hidden items?`)) {
                                setBlacklistedEmojis([]);
                            }
                        }}
                        style={{
                            width: '100%', padding: '8px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#666'
                        }}
                    >
                        Restore All ({blacklistedEmojis.length})
                    </button>
                </div>
            )}
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobile && showSidebar && (
              <div 
                  onClick={() => setShowSidebar(false)}
                  style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      background: 'rgba(0,0,0,0.5)',
                      zIndex: 90,
                      backdropFilter: 'blur(2px)'
                  }}
              />
          )}

          {/* Emoji Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <div style={{ 
              padding: isMobile ? '15px' : '20px 30px', 
              background: 'white', 
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.1rem' }}>
                  {searchQuery ? `Search results for "${searchQuery}"` : activeCategory}
              </h2>
              
              {!searchQuery && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      const allInCat = (groupedEmojiData[activeCategory] || []).map(item => item.emoji);
                      setSelectedEmojis(prev => ({
                        ...prev,
                        [activeCategory]: allInCat
                      }));
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#f0f2f5',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Select All
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedEmojis(prev => ({
                        ...prev,
                        [activeCategory]: []
                      }));
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#f0f2f5',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Deselect
                  </button>
                </div>
              )}
            </div>

            <div 
              ref={gridRef}
              onScroll={handleScroll}
              style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '15px' : '30px', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div 
                role="grid"
                aria-label="Emoji Grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(85px, 1fr))' : 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: isMobile ? '10px' : '20px'
                }}
              >
                {(filteredEmojis || []).slice(0, visibleCount).map((item, idx) => {
                  const isChecked = !!selectedEmoji;
                  const displayEmoji = selectedEmoji || item.emoji;
                  const hasVariations = item.variations && item.variations.length > 0;
                  
                  // Guide Mode Logic
                  const isCore = CORE_VOCABULARY.includes(item.name.toLowerCase());
                  const isContextMatch = activeContext !== 'Default' && CONTEXT_DEFINITIONS[activeContext]?.some(w => item.name.toLowerCase().includes(w.toLowerCase()));
                  const isGuideTarget = guideMode && (isCore || isContextMatch);

                  return (
                    <button
                      key={`${item.emoji}-${idx}`}
                      role="gridcell"
                      className="emoji-btn"
                      aria-pressed={isChecked}
                      aria-label={`${item.name}${isChecked ? ', selected' : ''}`}
                      onMouseDown={(e) => handleStart(e, item)}
                      onTouchStart={(e) => handleStart(e, item)}
                      onMouseUp={handleCleanup}
                      onMouseLeave={handleCleanup}
                      onTouchEnd={handleCleanup}
                      onClick={(e) => handleClick(e, cat, item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                      style={{
                        padding: isMobile ? '10px 5px' : '20px 15px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'white',
                        boxShadow: isGuideTarget 
                          ? '0 0 15px #FFD700, 0 4px 12px rgba(0,0,0,0.1)'
                          : (isChecked
                            ? '0 0 0 3px #4ECDC4, 0 4px 12px rgba(0,0,0,0.1)' 
                            : '0 2px 6px rgba(0,0,0,0.05)'),
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isMobile ? '8px' : '12px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        WebkitTapHighlightColor: 'transparent',
                        animation: isGuideTarget ? 'pulse-glow 2s infinite' : 'none'
                      }}
                    >
                      {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: isMobile ? '2.5rem' : '3rem', height: isMobile ? '2.5rem' : '3rem', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : item.type === 'avatar' ? (
                          <div style={{ transform: isMobile ? 'scale(0.5)' : 'scale(0.8)' }}>
                              <AvatarRenderer recipe={item.recipe} size={150} />
                          </div>
                      ) : (
                          <span style={{ fontSize: isMobile ? '2.5rem' : '3rem' }} aria-hidden="true">{displayEmoji}</span>
                      )}
                      
                      <span style={{ 
                        fontSize: isMobile ? '0.7rem' : '0.8rem', 
                        textAlign: 'center', 
                        lineHeight: '1.2', 
                        color: '#333',
                        fontWeight: isChecked ? 'bold' : 'normal'
                      }}>
                        {item.name}
                      </span>
                      
                      {/* Selection Badge */}
                      {isChecked && (
                        <div 
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#4ECDC4',
                            color: 'white',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            border: '2px solid white'
                          }}
                        >
                          ✓
                        </div>
                      )}

                      {/* Edit Button (Visible if selected) */}
                      {isChecked && (
                          <div
                            role="button"
                            className="emoji-curator-edit-btn"
                            aria-label="Edit Metadata"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem({ ...item, emoji: displayEmoji });
                            }}
                          >
                              ✏️
                          </div>
                      )}

                      {/* Variation Indicator */}
                      {hasVariations && (
                          <div 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  openPicker(e.nativeEvent ? e : { currentTarget: e.target }, item);
                              }}
                              style={{ 
                                  position: 'absolute',
                                  bottom: '5px',
                                  right: '5px',
                                  width: '20px', 
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'flex-end',
                                  justifyContent: 'flex-end',
                                  cursor: 'pointer' 
                              }} 
                          >
                             <div style={{ 
                                width: '0',
                                height: '0',
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderBottom: '6px solid #aaa',
                                transform: 'rotate(135deg)',
                                pointerEvents: 'none'
                             }} />
                          </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sequence Builder Bar */}
        {sequenceMode && (
            <div style={{
                position: 'fixed', bottom: 0, left: 0, width: '100%',
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                borderTop: '1px solid #ddd', padding: '15px', zIndex: 5000,
                display: 'flex', flexDirection: 'column', gap: '10px',
                boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Visual Schedule Builder ({sequence.length} steps)</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setSequence([])} style={{ padding: '5px 10px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear</button>
                        <button 
                            onClick={() => {
                                const name = prompt("Name this schedule (e.g. Morning Routine):");
                                if (name) {
                                    const data = {
                                        name,
                                        steps: sequence.map(s => ({ 
                                            label: emojiMetadata[s.emoji]?.label || s.name, 
                                            emoji: s.emoji,
                                            // Include custom image if applicable
                                            image: s.image
                                        }))
                                    };
                                    const jsonString = JSON.stringify(data, null, 2);
                                    const blob = new Blob([jsonString], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `${name.replace(/\s+/g, '-')}-schedule.json`;
                                    a.click();
                                }
                            }}
                            style={{ padding: '5px 15px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Save Schedule
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {sequence.length === 0 && <div style={{ color: '#999', fontStyle: 'italic', padding: '10px' }}>Tap icons above to add steps...</div>}
                    {sequence.map((step, idx) => (
                        <div key={step.id} style={{
                            minWidth: '60px', height: '60px', background: 'white',
                            border: '1px solid #ddd', borderRadius: '8px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            position: 'relative'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{step.image ? '📷' : step.emoji}</span>
                            <span style={{ fontSize: '0.6rem', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '50px' }}>{step.name}</span>
                            <div style={{
                                position: 'absolute', top: -5, right: -5, background: '#333', color: 'white',
                                width: '15px', height: '15px', borderRadius: '50%', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>{idx + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Skin Tone Picker Overlay */}
        {pickerTarget && (
            <div 
                style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 10000,
                }}
                onClick={() => setPickerTarget(null)}
            >
                <div 
                    ref={pickerRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Choose skin tone"
                    style={{
                        position: 'absolute',
                        top: Math.max(20, pickerTarget.y - 80), // Show above
                        left: isMobile 
                            ? '50%' 
                            : Math.max(20, Math.min(window.innerWidth - 300, pickerTarget.x - 150)),
                        transform: isMobile ? 'translateX(-50%)' : 'none',
                        background: 'white',
                        borderRadius: '16px',
                        padding: '10px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '90vw',
                        gap: '8px',
                        animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Include Base Option */}
                    <button
                        onClick={() => {
                            toggleEmoji(pickerTarget.category, pickerTarget.item.emoji, pickerTarget.item);
                            setPickerTarget(null);
                        }}
                        style={{
                            fontSize: '2rem',
                            padding: '10px',
                            background: isSelected(pickerTarget.category, pickerTarget.item.emoji) ? '#e6f7ff' : 'transparent',
                            border: isSelected(pickerTarget.category, pickerTarget.item.emoji) ? '2px solid #007AFF' : '1px solid transparent',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        {pickerTarget.item.emoji}
                    </button>

                    {/* Variations */}
                    {pickerTarget.item.variations.map((v, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                toggleEmoji(pickerTarget.category, v.emoji, pickerTarget.item);
                                setPickerTarget(null);
                            }}
                            style={{
                                fontSize: '2rem',
                                padding: '10px',
                                background: isSelected(pickerTarget.category, v.emoji) ? '#e6f7ff' : 'transparent',
                                border: isSelected(pickerTarget.category, v.emoji) ? '2px solid #007AFF' : '1px solid transparent',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            {v.emoji}
                        </button>
                    ))}
                </div>
        {/* Visual Scene Creator Modal */}
        {showVisualSceneCreator && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10006,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '95%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <h3 style={{ marginTop: 0 }}>Create Visual Scene (JIT)</h3>
                    
                    {!sceneImage ? (
                        <div style={{ padding: '40px', border: '2px dashed #ddd', borderRadius: '12px', textAlign: 'center' }}>
                            <p>Upload a photo of your environment (e.g., Dinner Table)</p>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (re) => setSceneImage(re.target.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: '#666', fontSize: '0.8rem' }}>Tap on the photo to add hotspots for specific objects.</p>
                            <div 
                                style={{ position: 'relative', width: '100%', cursor: 'crosshair' }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                                    const label = prompt("Label for this hotspot (e.g. Carrots):");
                                    if (label) {
                                        setHotspots(prev => [...prev, { x, y, label }]);
                                    }
                                }}
                            >
                                <img src={sceneImage} alt="Scene" style={{ width: '100%', borderRadius: '12px' }} />
                                {hotspots.map((h, i) => (
                                    <div 
                                        key={i}
                                        style={{
                                            position: 'absolute', left: `${h.x}%`, top: `${h.y}%`,
                                            width: '20px', height: '20px', background: 'rgba(78, 205, 196, 0.8)',
                                            border: '2px solid white', borderRadius: '50%', transform: 'translate(-50%, -50%)'
                                        }}
                                        title={h.label}
                                    />
                                ))}
                            </div>
                            <div style={{ marginTop: '15px', maxHeight: '100px', overflowY: 'auto' }}>
                                {hotspots.map((h, i) => <span key={i} style={{ display: 'inline-block', margin: '2px', padding: '2px 8px', background: '#eee', borderRadius: '4px', fontSize: '0.7rem' }}>{h.label}</span>)}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button onClick={() => { setShowVisualSceneCreator(false); setSceneImage(null); setHotspots([]); }} style={{
                            flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}>Cancel</button>
                        <button 
                            disabled={!sceneImage}
                            onClick={() => {
                                const name = prompt("Enter name for this Scene:", "My Scene");
                                if (name) {
                                    const newItem = {
                                        id: `scene-${Date.now()}`,
                                        name,
                                        category: activeCategory,
                                        image: sceneImage,
                                        emoji: '🖼️',
                                        isScene: true,
                                        hotspots
                                    };
                                    setCustomItems(prev => [newItem, ...prev]);
                                    toggleEmoji(activeCategory, newItem.emoji, newItem);
                                    setShowVisualSceneCreator(false);
                                    setSceneImage(null);
                                    setHotspots([]);
                                }
                            }} 
                            style={{
                                flex: 1, padding: '12px', background: '#5856D6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                                opacity: sceneImage ? 1 : 0.5
                            }}
                        >
                            Save Scene
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Phrase Creator Modal */}
        {showPhraseCreator && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10005,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={() => setShowPhraseCreator(false)}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '90%', maxWidth: '400px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0 }}>Create Phrase Button (GLP)</h3>
                    <p style={{ color: '#666', fontSize: '0.8rem' }}>Combine words into a single 'script' button for Gestalt learners.</p>
                    
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phrase Text</label>
                    <input 
                        id="phrase-text"
                        placeholder="e.g. Let's go to the park"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }}
                    />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Storyboard Icons (Paste 1-3 emojis)</label>
                    <input 
                        id="phrase-icons"
                        placeholder="e.g. 🏃‍♂️🌳☀️"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setShowPhraseCreator(false)} style={{
                            flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}>Cancel</button>
                        <button onClick={() => {
                            const text = document.getElementById('phrase-text').value;
                            const icons = document.getElementById('phrase-icons').value;
                            if (text) {
                                const newItem = {
                                    id: `phrase-${Date.now()}`,
                                    name: text,
                                    category: activeCategory,
                                    emoji: icons || '💬',
                                    isPhrase: true
                                };
                                setCustomItems(prev => [newItem, ...prev]);
                                toggleEmoji(activeCategory, newItem.emoji, newItem);
                                setShowPhraseCreator(false);
                            }
                        }} style={{
                            flex: 1, padding: '12px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Create Script</button>
                    </div>
                </div>
            </div>
        )}

        {/* Smart Import Modal */}
        {showSmartImport && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10004,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={() => setShowSmartImport(false)}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '90%', maxWidth: '500px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0 }}>Smart Import (Zero-to-Hero)</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Paste a list of words (comma or newline separated) from a lesson plan or PDF. 
                        We'll automatically find the icons for you.
                    </p>
                    <textarea 
                        id="smart-import-text"
                        placeholder="apple, sit, more, playground, reading..."
                        style={{ width: '100%', height: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button onClick={() => setShowSmartImport(false)} style={{
                            flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}>Cancel</button>
                        <button onClick={() => {
                            const text = document.getElementById('smart-import-text').value;
                            if (text) {
                                const words = text.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                                let addedCount = 0;
                                const newSelection = { ...selectedEmojis };
                                
                                words.forEach(word => {
                                    let match = allEmojisFlat.find(e => e.name.toLowerCase() === word.toLowerCase());
                                    if (!match) match = allEmojisFlat.find(e => e.name.toLowerCase().includes(word.toLowerCase()));
                                    
                                    if (match) {
                                        if (!newSelection[match.category]) newSelection[match.category] = [];
                                        if (!newSelection[match.category].includes(match.emoji)) {
                                            newSelection[match.category].push(match.emoji);
                                            addedCount++;
                                        }
                                    }
                                });
                                
                                setSelectedEmojis(newSelection);
                                setShowSmartImport(false);
                                alert(`Successfully imported ${addedCount} icons from ${words.length} words.`);
                            }
                        }} style={{
                            flex: 1, padding: '12px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Import Words</button>
                    </div>
                </div>
            </div>
        )}

        {/* Character Builder Modal */}
        {showCharacterBuilder && (
            <CharacterBuilder 
                onClose={() => setShowCharacterBuilder(false)}
                onSave={(name, recipe) => {
                    const newItem = {
                        id: `avatar-${Date.now()}`,
                        name,
                        category: 'My People',
                        type: 'avatar',
                        recipe,
                        emoji: '👤' // Placeholder key
                    };
                    setCustomItems(prev => [newItem, ...prev]);
                    toggleEmoji('My People', newItem.emoji, newItem);
                    setShowCharacterBuilder(false);
                }}
            />
        )}

        {/* Custom Icon Modal */}
        {showImageSearch && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10003,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={() => setShowImageSearch(false)}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '90%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0 }}>Add Custom Icon</h3>
                    
                    <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>Add from Device</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button 
                                onClick={() => handleGetPhoto(CameraSource.Camera)}
                                style={{ padding: '15px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                                📸 Take Photo
                            </button>
                            <button 
                                onClick={() => handleGetPhoto(CameraSource.Photos)}
                                style={{ padding: '15px', background: '#34C759', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                            >
                                🖼️ Library
                            </button>
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => {
                                    setShowImageSearch(false);
                                    setShowVisualSceneCreator(true);
                                }}
                                style={{ flex: 1, padding: '10px', background: '#5856D6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Create JIT Scene
                            </button>
                            <button 
                                onClick={() => {
                                    setShowImageSearch(false);
                                    setShowCharacterBuilder(true);
                                }}
                                style={{ flex: 1, padding: '10px', background: '#FF9500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Create Avatar
                            </button>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Web Search (Mock)</p>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Search Unsplash..."
                                value={searchQueryImage}
                                onChange={(e) => setSearchQueryImage(e.target.value)}
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                            <button style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Go</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {searchQueryImage && [1,2,3].map(i => (
                                <img 
                                    key={i}
                                    src={`https://picsum.photos/seed/${searchQueryImage}${i}/200/200`}
                                    alt="Result"
                                    onClick={() => {
                                        const name = prompt("Enter name for this icon:", searchQueryImage);
                                        if (name) {
                                            const newItem = {
                                                id: `custom-${Date.now()}`,
                                                name,
                                                category: activeCategory,
                                                image: `https://picsum.photos/seed/${searchQueryImage}${i}/200/200`,
                                                emoji: `custom-${Date.now()}`
                                            };
                                            setCustomItems(prev => [newItem, ...prev]);
                                            toggleEmoji(activeCategory, newItem.emoji, newItem);
                                            setShowImageSearch(false);
                                        }
                                    }}
                                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={() => setShowImageSearch(false)} style={{
                        marginTop: '20px', padding: '10px', width: '100%',
                        background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                    }}>Cancel</button>
                </div>
            </div>
        )}

        {/* Templates Modal */}
        {showTemplates && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10001,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} onClick={() => setShowTemplates(false)}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '90%', maxWidth: '400px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ marginTop: 0 }}>Load Template</h3>
                    <p style={{ color: '#666' }}>Add a curated set of icons to your library.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {Object.keys(TEMPLATES).map(name => (
                            <button key={name} onClick={() => applyTemplate(name)} style={{
                                padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
                                background: '#f9f9f9', textAlign: 'left', cursor: 'pointer'
                            }}>
                                <strong>{name}</strong>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{TEMPLATES[name].length} icons</div>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowTemplates(false)} style={{
                        marginTop: '15px', padding: '10px', width: '100%',
                        background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                    }}>Cancel</button>
                </div>
            </div>
        )}

        {/* Edit Metadata Modal */}
        {editingItem && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', zIndex: 10002,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white', padding: '20px', borderRadius: '16px',
                    width: '90%', maxWidth: '350px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '2rem' }}>{editingItem.emoji}</span>
                        Edit Icon
                    </h3>
                    
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Display Label</label>
                    <input 
                        type="text" 
                        value={tempMeta.label}
                        onChange={(e) => setTempMeta({ ...tempMeta, label: e.target.value })}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }}
                    />

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Word Class (Fitzgerald Key)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        {WORD_CLASSES.map(wc => {
                            const isActive = tempMeta.wordClass === wc.id;
                            return (
                                <button 
                                    key={wc.id}
                                    onClick={() => setTempMeta({ ...tempMeta, wordClass: wc.id })}
                                    style={{
                                        padding: '5px 10px', borderRadius: '15px',
                                        background: wc.color, color: 'white',
                                        border: isActive ? '2px solid black' : '2px solid transparent',
                                        cursor: 'pointer', fontSize: '0.8rem',
                                        opacity: isActive ? 1 : 0.7,
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {wc.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Hidden select to store value easily for save */}
                    <select id="meta-wc" defaultValue={emojiMetadata[editingItem.emoji]?.wordClass || 'noun'} style={{ display: 'none' }}>
                         {WORD_CLASSES.map(wc => <option key={wc.id} value={wc.id}>{wc.label}</option>)}
                    </select>

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="color" 
                            value={tempMeta.backgroundColor}
                            onChange={(e) => setTempMeta({ ...tempMeta, backgroundColor: e.target.value })}
                            style={{ width: '50px', height: '50px', border: 'none', cursor: 'pointer', padding: 0, background: 'none' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: '#666' }}>{tempMeta.backgroundColor}</span>
                        <button 
                            onClick={() => setTempMeta({ ...tempMeta, backgroundColor: '#ffffff' })}
                            style={{ fontSize: '0.8rem', padding: '5px 10px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Reset
                        </button>
                    </div>

                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Skill Tagging (Roadmap)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                        {SKILLS.map(sk => {
                            const isActive = tempMeta.skill === sk.id;
                            return (
                                <button 
                                    key={sk.id}
                                    onClick={() => setTempMeta({ ...tempMeta, skill: sk.id })}
                                    style={{
                                        padding: '5px 10px', borderRadius: '15px',
                                        background: 'white', color: sk.color,
                                        border: `2px solid ${isActive ? sk.color : '#ddd'}`,
                                        cursor: 'pointer', fontSize: '0.8rem',
                                        opacity: isActive ? 1 : 0.7,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {sk.label}
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setEditingItem(null)} style={{
                            flex: 1, padding: '12px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer'
                        }}>Cancel</button>
                        <button onClick={() => {
                            handleSaveMetadata(editingItem.emoji, tempMeta.label, tempMeta.wordClass, tempMeta.backgroundColor, tempMeta.skill);
                        }} style={{
                            flex: 1, padding: '12px', background: '#4ECDC4', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                        }}>Save</button>
                    </div>

                    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <button 
                            onClick={() => {
                                if (confirm('Are you sure you want to exclude this item? It will be hidden from the grid.')) {
                                    setBlacklistedEmojis(prev => [...prev, editingItem.emoji]);
                                    setEditingItem(null);
                                    // Also deselect it if selected? Maybe safer.
                                    toggleEmoji(editingItem.category, editingItem.emoji); // Toggle effectively removes if selected
                                }
                            }}
                            style={{
                                width: '100%', padding: '10px', background: '#fff', 
                                border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem'
                            }}
                        >
                            🚫 Exclude from Library
                        </button>
                    </div>
                </div>
            </div>
        )}

                <style>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes pulse {                        0% { opacity: 1; }                        50% { opacity: 0.5; }                        100% { opacity: 1; }                    }                    @keyframes pulse-glow {                        0% { box-shadow: 0 0 5px #FFD700, 0 4px 12px rgba(0,0,0,0.1); }                        50% { box-shadow: 0 0 20px #FFD700, 0 4px 12px rgba(0,0,0,0.2); }                        100% { box-shadow: 0 0 5px #FFD700, 0 4px 12px rgba(0,0,0,0.1); }                    }                `}</style>
            </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('EmojiCurator Error:', err);
    return (
      <div style={{ padding: '50px', background: 'white', color: 'black', overflow: 'auto', height: '100vh' }}>
        <h1>Error loading Curator</h1>
        <pre>{err.toString()}</pre>
        <pre>{err.stack}</pre>
      </div>
    );
  }
};

export default EmojiCurator;
