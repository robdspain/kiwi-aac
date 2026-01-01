import { useState, useMemo, useRef, useEffect } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';

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

  return { categories: Object.keys(groupedData), groupedEmojiData: groupedData, allEmojisFlat: flatList };
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

  const [selectedEmojis, setSelectedEmojis] = useState(() => {
    const initial = {};
    categories.forEach(category => {
      initial[category] = [];
    });
    
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
    if (searchQuery) {
      return allEmojisFlat.filter(item => 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emoji.includes(searchQuery)
      );
    }
    return groupedEmojiData[activeCategory] || [];
  }, [searchQuery, activeCategory]);

  // Long Press Handling
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
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
      Object.keys(selectedEmojis).forEach(category => {
        if (selectedEmojis[category] && selectedEmojis[category].length > 0) {
          output[category] = selectedEmojis[category].map(emojiChar => {
              const base = allEmojisFlat.find(e => e.emoji === emojiChar);
              if (base) return { w: base.name, i: base.emoji };
              
              let foundName = "Unknown";
              allEmojisFlat.some(b => {
                  const v = b.variations.find(v => v.emoji === emojiChar);
                  if (v) {
                      foundName = v.name; 
                      return true;
                  }
                  return false;
              });
              return { w: foundName, i: emojiChar };
          });
        }
      });

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
            toggleEmoji(cat, item.emoji, item);
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
        {/* Top Navigation Bar */}
        <div style={{ 
          padding: isMobile ? '10px 15px' : '15px 30px', 
          background: '#1a1a1a', 
          color: 'white',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
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
            {!isMobile && <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>LIBRARY BUILDER v3.2</h1>}
          </div>

          <div style={{ display: 'flex', gap: isMobile ? '10px' : '20px', alignItems: 'center' }}>
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
                          padding: '8px 10px 8px 30px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          fontSize: '0.85rem'
                      }}
                  />
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }} aria-hidden="true">🔍</span>
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

            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '15px' : '30px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <div 
                role="grid"
                aria-label="Emoji Grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(85px, 1fr))' : 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: isMobile ? '10px' : '20px'
                }}
              >
                {(filteredEmojis || []).map((item, idx) => {
                  const cat = item.category || activeCategory;
                  const selectedEmoji = getSelectedInGroup(cat, item);
                  const isChecked = !!selectedEmoji;
                  const displayEmoji = selectedEmoji || item.emoji;
                  const hasVariations = item.variations && item.variations.length > 0;
                  
                  return (
                    <button
                      key={`${item.emoji}-${idx}`}
                      role="gridcell"
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
                        boxShadow: isChecked
                          ? '0 0 0 3px #4ECDC4, 0 4px 12px rgba(0,0,0,0.1)' 
                          : '0 2px 6px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isMobile ? '8px' : '12px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <span style={{ fontSize: isMobile ? '2.5rem' : '3rem' }} aria-hidden="true">{displayEmoji}</span>
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
                <style>{`
                    @keyframes popIn {
                        from { opacity: 0; transform: scale(0.8); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
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
