import React, { useState, useMemo, useRef, useEffect } from 'react';
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
const TONE_SUFFIX_REGEX = new RegExp(` \((${TONE_NAMES.join('|')})\)$`, 'i');
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
  'Person with White Cane': 'People & Fantasy', // Correct name?
  'New Emojis Person': 'People & Fantasy' // Catch-all for unlabeled people in New Emojis
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
      // Check overrides based on name (or partial name for "New Emojis Person")
      if (cat === "New Emojis") {
        if (CATEGORY_OVERRIDES[item.name]) {
          effectiveCategory = CATEGORY_OVERRIDES[item.name];
        } else if (item.name === "New Emojis Person" || item.emoji === "🧑‍🦯" || item.emoji === "👨‍🦯" || item.emoji === "👩‍🦯") {
          // "Person with White Cane" usually looks like this.
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
  // Re-build categories list including potential target categories from overrides
  const allTargetCategories = new Set([...baseCategoriesList, ...Object.values(CATEGORY_OVERRIDES)]);

  allTargetCategories.forEach(cat => {
    // Filter out items that were identified as variations of another base emoji
    // And check effectiveCategory
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
  try {
    const [activeCategory, setActiveCategory] = useState(categories[0] || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [pickerTarget, setPickerTarget] = useState(null); // { item, x, y } 

    const [selectedEmojis, setSelectedEmojis] = useState(() => {
      const initial = {};
      categories.forEach(category => {
        initial[category] = [];
      });

      // Pre-populate with existing icons
      Object.keys(CURRENT_ICONS).forEach(cat => {
        (CURRENT_ICONS[cat] || []).forEach(emoji => {
          // Find in flat list (which only contains base) OR search in variations?
          // Ideally check base items
          const foundBase = allEmojisFlat.find(e => e.emoji === emoji);
          if (foundBase) {
            if (!initial[foundBase.category]) initial[foundBase.category] = [];
            if (!initial[foundBase.category].includes(emoji)) {
              initial[foundBase.category].push(emoji);
            }
          } else {
            // Check if it's a variation
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

    // Check if an item (base emoji) is selected
    const isSelected = (cat, item) => {
      const list = selectedEmojis[cat] || [];
      return list.includes(item.emoji);
    };

    // Check if any variation of the item is selected
    const hasSelectedVariation = (cat, item) => {
      const list = selectedEmojis[cat] || [];
      if (!item.variations || item.variations.length === 0) return false;
      return item.variations.some(v => list.includes(v.emoji));
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
        // Try to find it (expensive but needed for arbitrary toggles)
        baseItem = allEmojisFlat.find(b =>
          b.emoji === targetEmoji ||
          b.variations.some(v => v.emoji === targetEmoji)
        );
      }

      setSelectedEmojis(prev => {
        const catList = prev[category] || [];

        let groupEmojis = [targetEmoji]; // Default if no group
        if (baseItem) {
          groupEmojis = [baseItem.emoji, ...baseItem.variations.map(v => v.emoji)];
        }

        // Is target currently selected?
        const isTargetSelected = catList.includes(targetEmoji);

        let newList = [...catList];

        if (isTargetSelected) {
          // Deselect target
          newList = newList.filter(e => e !== targetEmoji);
        } else {
          // Select target
          // FIRST, remove any other emojis from the same group
          newList = newList.filter(e => !groupEmojis.includes(e));
          // THEN add target
          newList.push(targetEmoji);
        }

        return { ...prev, [category]: newList };
      });
    };

    const exportSelected = () => {
      const output = {};
      Object.keys(selectedEmojis).forEach(category => {
        if (selectedEmojis[category] && selectedEmojis[category].length > 0) {
          // We need to find the name for each selected emoji (could be base or variation)
          output[category] = selectedEmojis[category].map(emojiChar => {
            // Search in base first
            const base = allEmojisFlat.find(e => e.emoji === emojiChar);
            if (base) return { w: base.name, i: base.emoji };

            // Search in variations
            // We have to iterate all base to find the variation
            let foundName = "Unknown";
            allEmojisFlat.some(b => {
              const v = b.variations.find(v => v.emoji === emojiChar);
              if (v) {
                foundName = v.name; // Or base name? Usually specific name is better.
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

    const filteredEmojis = useMemo(() => {
      if (searchQuery) {
        return allEmojisFlat.filter(item =>
          (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.emoji.includes(searchQuery)
        );
      }
      return groupedEmojiData[activeCategory] || [];
    }, [searchQuery, activeCategory]);

    const totalSelected = Object.values(selectedEmojis).reduce((sum, arr) => sum + (arr?.length || 0), 0);

    // Long Press Handling
    const longPressTimer = useRef(null);
    const isLongPress = useRef(false);

    const openPicker = (e, item) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPickerTarget({
        item,
        category: item.category || activeCategory,
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleStart = (e, item) => {
      isLongPress.current = false;
      // Don't trigger if no variations
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
      return <div style={{ padding: '50px', background: 'white' }}>No categories found in EMOJI_DATA. Check src/utils/emojiData.js</div>;
    }

    return (
      <div style={{
        padding: '0',
        width: '100vw',
        height: '100dvh',
        margin: '0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        background: '#f0f2f5',
        color: '#000',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        userSelect: 'none'
      }}>
        {/* Top Navigation Bar */}
        <div style={{
          padding: '15px 30px',
          background: '#1a1a1a',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '1.5rem' }}>🥝</span>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>LIBRARY BUILDER v3.2</h1>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ background: '#333', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>{totalSelected}</span> icons selected
            </div>
            <button
              onClick={exportSelected}
              style={{
                padding: '10px 25px',
                background: '#4ECDC4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              SAVE iconsData.json
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Category List */}
          <div style={{
            width: '280px',
            overflowY: 'auto',
            background: 'white',
            borderRight: '1px solid #ddd',
            padding: '20px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ padding: '0 15px 15px 15px' }}>
              <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 'bold', marginBottom: '10px' }}>CATEGORIES</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search all..."
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
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}>🔍</span>
              </div>
            </div>

            {!searchQuery && categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
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

          {/* Emoji Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <div style={{
              padding: '20px 30px',
              background: 'white',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
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
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Select All Base
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
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '20px'
              }}>
                {(filteredEmojis || []).map((item, idx) => {
                  const cat = item.category || activeCategory;
                  const isItemSel = isSelected(cat, item);
                  const isVarSel = hasSelectedVariation(cat, item);
                  const hasVariations = item.variations && item.variations.length > 0;

                  // Determine display emoji
                  let displayEmoji = item.emoji;
                  if (isVarSel) {
                    const found = item.variations.find(v => (selectedEmojis[cat] || []).includes(v.emoji));
                    if (found) displayEmoji = found.emoji;
                  }

                  return (
                    <button
                      key={`${item.emoji}-${idx}`}
                      onMouseDown={(e) => handleStart(e, item)}
                      onTouchStart={(e) => handleStart(e, item)}
                      onMouseUp={handleCleanup}
                      onMouseLeave={handleCleanup}
                      onTouchEnd={handleCleanup}
                      onClick={(e) => handleClick(e, cat, item)}
                      onContextMenu={(e) => handleContextMenu(e, item)}
                      style={{
                        padding: '20px 15px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'white',
                        boxShadow: (isItemSel || isVarSel)
                          ? '0 0 0 3px #4ECDC4, 0 4px 12px rgba(0,0,0,0.1)'
                          : '0 2px 6px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.2s',
                        position: 'relative',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <span style={{ fontSize: '3rem' }}>{displayEmoji}</span>
                      <span style={{
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        lineHeight: '1.2',
                        color: '#333',
                        fontWeight: (isItemSel || isVarSel) ? 'bold' : 'normal'
                      }}>
                        {item.name}
                      </span>

                      {/* Selection Badge */}
                      {(isItemSel || isVarSel) && (
                        <div style={{
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
                        }}>
                          {isVarSel ? '●' : '✓'}
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
                left: Math.max(20, Math.min(window.innerWidth - 300, pickerTarget.x - 150)),
                background: 'white',
                borderRadius: '16px',
                padding: '10px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
                display: 'flex',
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
                  background: isSelected(pickerTarget.category, pickerTarget.item) ? '#e6f7ff' : 'transparent',
                  border: isSelected(pickerTarget.category, pickerTarget.item) ? '2px solid #007AFF' : '1px solid transparent',
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
                    background: isSelected(pickerTarget.category, v) ? '#e6f7ff' : 'transparent',
                    border: isSelected(pickerTarget.category, v) ? '2px solid #007AFF' : '1px solid transparent',
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
