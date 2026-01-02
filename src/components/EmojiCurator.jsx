import { useState, useMemo, useRef, useEffect } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';
import { triggerHaptic } from '../utils/haptics';
import { CORE_VOCABULARY, TEMPLATES, CONTEXT_DEFINITIONS } from '../data/aacData';
import CharacterBuilder from './CharacterBuilder';
import AvatarRenderer from './AvatarRenderer';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import SplashScreen from './SplashScreen';

const TONE_NAMES = ["Pale", "Cream White", "Brown", "Dark Brown", "Black"];
const TONE_SUFFIX_REGEX = new RegExp(` (${TONE_NAMES.join('|')})\\)$`, 'i');
const TONE_PREFIX_REGEX = new RegExp(`^(${TONE_NAMES.join('|')}) `, 'i');
const MODIFIERS = { 'Pale': '\u{1F3FB}', 'Cream White': '\u{1F3FC}', 'Brown': '\u{1F3FD}', 'Dark Brown': '\u{1F3FE}', 'Black': '\u{1F3FF}' };
const CATEGORY_OVERRIDES = { 'Harp': 'Objects', 'Shovel': 'Objects', 'Face With Diagonal Mouth': 'Smileys & Emotion', 'Face with Diagonal Mouth': 'Smileys & Emotion', 'Face Exhaling': 'Smileys & Emotion', 'Face in Clouds': 'Smileys & Emotion', 'Heart on Fire': 'Smileys & Emotion', 'Mending Heart': 'Smileys & Emotion', 'Person with White Cane': 'People & Fantasy', 'New Emojis Person': 'People & Fantasy' };

const applyModifier = (baseEmoji, modifier) => {
  const zwjIndex = baseEmoji.indexOf('\u200D');
  if (zwjIndex !== -1) {
      const part1 = baseEmoji.substring(0, zwjIndex);
      const part2 = baseEmoji.substring(zwjIndex);
      let cleanPart1 = part1; if (cleanPart1.endsWith('\uFE0F')) cleanPart1 = cleanPart1.substring(0, cleanPart1.length - 1);
      return cleanPart1 + modifier + part2;
  } else {
      let cleanBase = baseEmoji; if (cleanBase.endsWith('\uFE0F')) cleanBase = cleanBase.substring(0, cleanBase.length - 1);
      return cleanBase + modifier;
  }
};

const { categories, groupedEmojiData, allEmojisFlat } = (() => {
  if (!EMOJI_DATA) return { categories: [], groupedEmojiData: {}, allEmojisFlat: [] };
  const TONE_CATEGORIES = [ "Tone: Pale", "Tone: Cream White", "Tone: Brown", "Tone: Dark Brown", "Tone: Black" ];
  const baseCategoriesList = Object.keys(EMOJI_DATA).filter(c => !TONE_CATEGORIES.includes(c));
  const globalEmojiMap = new Map();
  Object.keys(EMOJI_DATA).forEach(cat => { (EMOJI_DATA[cat] || []).forEach(item => { globalEmojiMap.set(item.emoji, item); }); });
  const flatList = []; const baseMap = new Map(); const identifiedVariations = new Set();
  baseCategoriesList.forEach(cat => {
    (EMOJI_DATA[cat] || []).forEach(item => {
      let effectiveCategory = cat;
      if (cat === "New Emojis") {
          if (CATEGORY_OVERRIDES[item.name]) effectiveCategory = CATEGORY_OVERRIDES[item.name];
          else if (item.name === "New Emojis Person" || item.emoji === "🧑‍🦯" || item.emoji === "👨‍🦯" || item.emoji === "👩‍🦯") effectiveCategory = 'People & Fantasy';
      }
      const newItem = { ...item, category: effectiveCategory, variations: [] };
      flatList.push(newItem); baseMap.set(item.name.toLowerCase(), newItem);
      Object.keys(MODIFIERS).forEach(toneName => {
          const generatedEmoji = applyModifier(item.emoji, MODIFIERS[toneName]);
          if (globalEmojiMap.has(generatedEmoji)) {
              const foundItem = globalEmojiMap.get(generatedEmoji);
              if (!newItem.variations.find(v => v.emoji === foundItem.emoji)) { newItem.variations.push({ ...foundItem, tone: toneName }); identifiedVariations.add(foundItem.emoji); }
          }
      });
    });
  });
  TONE_CATEGORIES.forEach(cat => {
    (EMOJI_DATA[cat] || []).forEach(item => {
      let match = item.name.match(TONE_SUFFIX_REGEX);
      let baseName = match ? item.name.replace(TONE_SUFFIX_REGEX, '') : null;
      let tone = match ? match[1] : null;
      if (!match) { match = item.name.match(TONE_PREFIX_REGEX); if (match) { baseName = item.name.replace(TONE_PREFIX_REGEX, ''); tone = match[1]; } }
      if (baseName && baseMap.has(baseName.toLowerCase())) {
        const baseItem = baseMap.get(baseName.toLowerCase());
        if (!baseItem.variations.find(v => v.emoji === item.emoji)) { baseItem.variations.push({ ...item, tone }); identifiedVariations.add(item.emoji); }
      }
    });
  });
  flatList.forEach(item => {
      if (item.variations.length > 0) {
          const brownVar = item.variations.find(v => v.tone === 'Brown');
          if (brownVar) { item.emoji = brownVar.emoji; item.variations = item.variations.filter(v => v.tone !== 'Brown'); }
      }
  });
  const groupedData = {};
  const allTargetCategories = new Set([...baseCategoriesList, ...Object.values(CATEGORY_OVERRIDES)]);
  allTargetCategories.forEach(cat => {
      const filtered = flatList.filter(i => i.category === cat && !identifiedVariations.has(i.emoji));
      if (filtered.length > 0) groupedData[cat] = filtered;
  });
  return { categories: ['Characters', 'My People', ...Object.keys(groupedData)], groupedEmojiData: groupedData, allEmojisFlat: flatList };
})();

const CURRENT_ICONS = { 'TV': ['🔴', '🐶', '🎵', '📚'], 'Food': ['🍎', '🍌', '🧃', '🍪'], 'Toys': ['⚽', '🧱', '🚗', '🫧'], 'Feelings': ['😄', '😢', '😠'] };

const EmojiCurator = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerTarget, setPickerTarget] = useState(null);
  const [visibleCount, setVisibleCount] = useState(100);
  const gridRef = useRef(null);
  const [emojiMetadata, setEmojiMetadata] = useState({});
  const blacklistedEmojis = useMemo(() => [], []);
  const [customItems, setCustomItems] = useState([
    { id: 'avatar-mom', name: 'Mom', category: 'My People', type: 'avatar', recipe: { head: 'round', skin: '#F1C27D', hair: 'short', hairColor: '#2C222B', eyeColor: '#333333', facialHair: 'none', eyes: 'happy', mouth: 'smile', accessory: 'none' }, emoji: 'avatar-mom' },
    { id: 'avatar-dad', name: 'Dad', category: 'My People', type: 'avatar', recipe: { head: 'round', skin: '#F1C27D', hair: 'short', hairColor: '#A56B46', eyeColor: '#2e536f', facialHair: 'short_beard', eyes: 'happy', mouth: 'smile', accessory: 'none' }, emoji: 'avatar-dad' },
    { id: 'avatar-ms-rachel', name: 'Ms Rachel', category: 'My People', type: 'avatar', recipe: { head: 'round', skin: '#F1C27D', hair: 'medium', hairColor: '#A56B46', eyeColor: '#333333', facialHair: 'none', eyes: 'happy', mouth: 'smile', accessory: 'none' }, emoji: 'avatar-ms-rachel' },
    { id: 'char-elmo', name: 'Elmo', category: 'Characters', emoji: '🔴' },
    { id: 'char-simple-songs', name: 'Super Simple Songs', category: 'Characters', emoji: '🎵' },
    { id: 'char-spiderman', name: 'Spiderman', category: 'Characters', emoji: '🕷️' }
  ]);
  const [showCoreOnly, setShowCoreOnly] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [sequenceMode, setSequenceMode] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [showPhraseCreator, setShowPhraseCreator] = useState(false);
  const [showVisualSceneCreator, setShowVisualSceneCreator] = useState(false);
  const [showCharacterBuilder, setShowCharacterBuilder] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [tempMeta, setTempMeta] = useState({ label: '', wordClass: 'noun', backgroundColor: '#ffffff', skill: 'none' });
  const [activeContext] = useState('Default');
  const [guideMode, setGuideMode] = useState(false);

  const openEditModal = (item, disp) => {
    const existing = emojiMetadata[disp] || {};
    setTempMeta({ 
        label: existing.label || item.name, 
        wordClass: existing.wordClass || 'noun', 
        backgroundColor: existing.backgroundColor || '#ffffff', 
        skill: existing.skill || 'none' 
    });
    setEditingItem({ ...item, emoji: disp });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
      const handleResize = () => { const mobile = window.innerWidth < 850; setIsMobile(mobile); if (!mobile) setShowSidebar(true); else if (mobile && !showSidebar) setShowSidebar(false); }; 
      window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  useEffect(() => { 
    if (visibleCount !== 100) setTimeout(() => setVisibleCount(100), 0);
    if (gridRef.current && gridRef.current.scrollTop !== 0) setTimeout(() => { if (gridRef.current) gridRef.current.scrollTop = 0; }, 0);
  }, [activeCategory, searchQuery, visibleCount]);

  const handleScroll = (e) => { const { scrollTop, clientHeight, scrollHeight } = e.currentTarget; if (scrollHeight - scrollTop - clientHeight < 500) setVisibleCount(prev => prev + 100); };

  const [selectedEmojis, setSelectedEmojis] = useState(() => {
    const initial = {}; categories.forEach(category => { initial[category] = []; });
    initial['My People'] = ['avatar-mom', 'avatar-dad', 'avatar-ms-rachel'];
    initial['Characters'] = ['🔴', '🎵', '🕷️'];
    Object.keys(CURRENT_ICONS).forEach(cat => {
        (CURRENT_ICONS[cat] || []).forEach(emoji => {
            const base = allEmojisFlat.find(e => e.emoji === emoji) || allEmojisFlat.find(e => e.variations.some(v => v.emoji === emoji));
            if (base) { if (!initial[base.category]) initial[base.category] = []; if (!initial[base.category].includes(emoji)) initial[base.category].push(emoji); }
        });
    });
    return initial;
  });

  const filteredEmojis = useMemo(() => {
    let list = groupedEmojiData[activeCategory] || [];
    list = [...customItems.filter(i => i.category === activeCategory), ...list];
    if (activeContext !== 'Default' && CONTEXT_DEFINITIONS[activeContext]) {
        const contextWords = CONTEXT_DEFINITIONS[activeContext];
        const contextItems = list.filter(item => contextWords.some(w => item.name.toLowerCase().includes(w.toLowerCase())));
        list = [...contextItems, ...list.filter(item => !contextItems.includes(item))];
    }
    if (searchQuery) {
      list = [...customItems, ...allEmojisFlat].filter(item => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || item.emoji.includes(searchQuery));
    }
    if (blacklistedEmojis.length > 0) list = list.filter(item => !blacklistedEmojis.includes(item.emoji));
    if (showCoreOnly) list = list.filter(item => item.name.toLowerCase().split(/[ -]/).some(w => CORE_VOCABULARY.includes(w)) || CORE_VOCABULARY.includes(item.name.toLowerCase()));
    return list;
  }, [searchQuery, activeCategory, showCoreOnly, customItems, activeContext, blacklistedEmojis]);

  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const pickerRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (pickerTarget) {
      previousFocus.current = document.activeElement; setTimeout(() => { pickerRef.current?.querySelector('button')?.focus(); }, 50);
      const handleKeyDown = (e) => { if (e.key === 'Escape') setPickerTarget(null); if (e.key === 'Tab') { const buttons = pickerRef.current?.querySelectorAll('button'); if (!buttons?.length) return; if (e.shiftKey) { if (document.activeElement === buttons[0]) { e.preventDefault(); buttons[buttons.length-1].focus(); } } else { if (document.activeElement === buttons[buttons.length-1]) { e.preventDefault(); buttons[0].focus(); } } } };
      window.addEventListener('keydown', handleKeyDown); return () => { window.removeEventListener('keydown', handleKeyDown); };
    } else { if (previousFocus.current) { previousFocus.current.focus(); previousFocus.current = null; } }
  }, [pickerTarget]);

  const speak = (text) => { if (!window.speechSynthesis) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1.0; window.speechSynthesis.speak(u); };

  const getSelectedInGroup = (cat, item) => { const list = selectedEmojis[cat] || []; if (list.includes(item.emoji)) return item.emoji; const found = item.variations.find(v => list.includes(v.emoji)); return found ? found.emoji : null; };

  const toggleEmoji = (category, targetEmoji, baseItem = null) => {
    const effectiveBase = baseItem || allEmojisFlat.find(b => b.emoji === targetEmoji || b.variations.some(v => v.emoji === targetEmoji));
    if (effectiveBase) { const varItem = effectiveBase.variations.find(v => v.emoji === targetEmoji); speak(varItem ? varItem.name : effectiveBase.name); }
    setSelectedEmojis(prev => {
      const catList = prev[category] || [];
      const groupEmojis = effectiveBase ? [effectiveBase.emoji, ...effectiveBase.variations.map(v => v.emoji)] : [targetEmoji];
      const isTargetSelected = catList.includes(targetEmoji);
      return { ...prev, [category]: isTargetSelected ? catList.filter(e => e !== targetEmoji) : [...catList.filter(e => !groupEmojis.includes(e)), targetEmoji] };
    });
  };

  const handleStart = (e, item) => {
      isLongPress.current = false; if (!item.variations?.length) return;
      longPressTimer.current = setTimeout(() => {
          isLongPress.current = true; const rect = e.currentTarget.getBoundingClientRect();
          setPickerTarget({ item, category: item.category || activeCategory, x: rect.left + rect.width / 2, y: rect.top });
          speak(item.name); if (navigator.vibrate) navigator.vibrate(50);
      }, 500);
  };

  const handleCleanup = () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } };

  const handleGetPhoto = async (source) => {
    try {
      const image = await Camera.getPhoto({ quality: 90, allowEditing: true, resultType: CameraResultType.DataUrl, source });
      if (image?.dataUrl) {
        const name = prompt("Enter name:");
        if (name) { const newItem = { id: `custom-${Date.now()}`, name, category: activeCategory, image: image.dataUrl, emoji: `custom-${Date.now()}` }; setCustomItems(prev => [newItem, ...prev]); toggleEmoji(activeCategory, newItem.emoji, newItem); setShowImageSearch(false); }
      }
    } catch (err) { console.error(err); } 
  };

  const handleSaveMetadata = (char, label, wordClass, backgroundColor, skill) => { setEmojiMetadata(prev => ({ ...prev, [char]: { label, wordClass, backgroundColor, skill } })); setEditingItem(null); };
  const applyTemplate = (templateName) => { const words = TEMPLATES[templateName]; if (!words) return; setSelectedEmojis(prev => { const next = { ...prev }; words.forEach(word => { const match = allEmojisFlat.find(e => e.name.toLowerCase() === word.toLowerCase()) || allEmojisFlat.find(e => e.name.toLowerCase().includes(word.toLowerCase())); if (match) { if (!next[match.category]) next[match.category] = []; if (!next[match.category].includes(match.emoji)) next[match.category].push(match.emoji); } }); return next; }); setShowTemplates(false); triggerHaptic('success'); };

  const totalSelected = Object.values(selectedEmojis).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div style={{ padding: '0', paddingTop: 'env(safe-area-inset-top)', width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column', background: '#f0f2f5', color: '#000', position: 'fixed', top: 0, left: 0, zIndex: 9999, userSelect: 'none', overflow: 'hidden' }}>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="emoji-curator-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isMobile && <button onClick={() => setShowSidebar(!showSidebar)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>}
          <span style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>🥝</span>{!isMobile && <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>LIBRARY BUILDER</h1>}
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '10px' : '20px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: isMobile ? '0.8rem' : '0.9rem' }}><input type="checkbox" checked={showCoreOnly} onChange={(e) => setShowCoreOnly(e.target.checked)}/>Core Only</label>
          <div style={{ position: 'relative' }}>
              <button onClick={() => setShowToolsMenu(!showToolsMenu)} style={{ padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Tools ▾</button>
              {showToolsMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', background: 'white', borderRadius: '12px', padding: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', width: '200px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 2000 }}>
                      <button onClick={() => { setShowSmartImport(true); setShowToolsMenu(false); }}>📥 Bulk Import</button>
                      <button onClick={() => { setShowTemplates(true); setShowToolsMenu(false); }}>📋 Templates</button>
                      <button onClick={() => { setShowImageSearch(true); setShowToolsMenu(false); }}>📷 Add Custom</button>
                      <button onClick={() => { setSequenceMode(!sequenceMode); setShowToolsMenu(false); }}>{sequenceMode ? 'Finish Sequence' : '✨ Builder Mode'}</button>
                      <button onClick={() => { setGuideMode(!guideMode); setShowToolsMenu(false); }}>{guideMode ? 'Stop Guide' : '🎯 Guide Mode'}</button>
                  </div>
              )}
          </div>
          <div style={{ background: '#333', padding: '8px 15px', borderRadius: '8px', fontSize: '0.9rem', color: 'white' }}><span style={{ color: '#4ECDC4', fontWeight: 'bold' }}>{totalSelected}</span> selected</div>
            <button
              onClick={exportSelected}
              style={{
                padding: isMobile ? '8px 15px' : '10px 25px',
                background: '#4ECDC4',
                color: '#2D3436',
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
        <div style={{ width: '280px', height: '100%', overflowY: 'auto', background: 'white', borderRight: '1px solid #ddd', padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '2px', position: isMobile ? 'absolute' : 'relative', zIndex: 100, left: 0, top: 0, transform: showSidebar ? 'translateX(0)' : (isMobile ? 'translateX(-100%)' : 'translateX(0)'), transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: isMobile && showSidebar ? '4px 0 15px rgba(0,0,0,0.1)' : 'none' }}>
          <div style={{ padding: '0 15px 15px 15px' }}>
            <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 'bold', marginBottom: '10px' }}>CATEGORIES</div>
            <div style={{ position: 'relative' }}><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '8px 30px', borderRadius: '6px', border: '1px solid #ddd' }} /><span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span></div>
          </div>
          {!searchQuery && categories.map(cat => ( <button key={cat} onClick={() => { setActiveCategory(cat); if (isMobile) setShowSidebar(false); }} style={{ textAlign: 'left', padding: '10px 15px', borderRadius: '6px', border: 'none', background: activeCategory === cat ? '#f0f7ff' : 'transparent', color: activeCategory === cat ? '#007AFF' : '#555', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{cat}</span>                {selectedEmojis[category]?.length > 0 && (
                  <span style={{ 
                    background: '#4ECDC4',
                    color: '#2D3436',
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
                )}</button> ))}
        </div>
        {isMobile && showSidebar && <div onClick={() => setShowSidebar(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(2px)' }}/>} 
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
          <div style={{ padding: isMobile ? '15px' : '20px 30px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.1rem' }}>{searchQuery ? `Search results for &quot;${searchQuery}&quot;` : activeCategory}</h2>
            {!searchQuery && <div style={{ display: 'flex', gap: '10px' }}><button onClick={() => { const all = (groupedEmojiData[activeCategory] || []).map(i => i.emoji); setSelectedEmojis(prev => ({ ...prev, [activeCategory]: all })); }} style={{ padding: '6px 12px', background: '#f0f2f5', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Select All</button></div>}
          </div>
          <div ref={gridRef} onScroll={handleScroll} style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '15px' : '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(85px, 1fr))' : 'repeat(auto-fill, minmax(130px, 1fr))', gap: isMobile ? '10px' : '20px' }}>
              {(filteredEmojis || []).slice(0, visibleCount).map((item, idx) => {
                const sel = getSelectedInGroup(activeCategory, item); const isChecked = !!sel; const disp = sel || item.emoji;
                const isTarg = guideMode && (CORE_VOCABULARY.includes(item.name.toLowerCase()));
                return (
                  <button key={`${item.emoji}-${idx}`} onMouseDown={(e) => handleStart(e, item)} onMouseUp={handleCleanup} onMouseLeave={handleCleanup} onClick={() => { if (!isLongPress.current && !pickerTarget) { if (sequenceMode) setSequence(prev => [...prev, { ...item, id: new Date().getTime() }]); else toggleEmoji(activeCategory, item.emoji, item); } }} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'white', boxShadow: isTarg ? '0 0 15px #FFD700' : '0 2px 6px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative' }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: '3rem', height: '3rem', objectFit: 'cover' }} /> : item.type === 'avatar' ? <div style={{ pointerEvents: 'none' }}><AvatarRenderer recipe={item.recipe} size={80} /></div> : <span style={{ fontSize: '2.5rem' }}>{disp}</span>}
                    <span style={{ fontSize: '0.8rem', color: '#333' }}>{item.name}</span>
                      {/* Selection Badge */}                      {isChecked && (
                        <div 
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#4ECDC4',
                            color: '#2D3436',
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
                    {isChecked && <div onClick={(e) => { e.stopPropagation(); openEditModal(item, disp); }} style={{ position: 'absolute', top: '5px', left: '5px', background: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>✏️</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {sequenceMode && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'white', borderTop: '1px solid #ddd', padding: '15px', zIndex: 5000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold' }}>Schedule Builder ({sequence.length} steps)</span><button onClick={() => setSequence([])}>Clear</button></div>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>{sequence.map((s, i) => <div key={i} style={{ minWidth: '60px', textAlign: 'center' }}><span>{s.emoji}</span><div style={{ fontSize: '0.6rem' }}>{s.name}</div></div>)}</div>
          </div>
      )}
      {pickerTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000 }} onClick={() => setPickerTarget(null)}>
              <div style={{ position: 'absolute', top: pickerTarget.y - 100, left: pickerTarget.x - 100, background: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', display: 'flex', gap: '10px' }} onClick={e => e.stopPropagation()}> 
                  <button onClick={() => { toggleEmoji(pickerTarget.category, pickerTarget.item.emoji, pickerTarget.item); setPickerTarget(null); }}>{pickerTarget.item.emoji}</button>
                  {pickerTarget.item.variations.map((v, i) => <button key={i} onClick={() => { toggleEmoji(pickerTarget.category, v.emoji, pickerTarget.item); setPickerTarget(null); }}>{v.emoji}</button>)}
              </div>
          </div>
      )}
      {showVisualSceneCreator && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10006, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px', width: '90%', maxWidth: '500px' }}> <h3>Visual Scene</h3> <input type="file" onChange={(e) => { const reader = new FileReader(); reader.onload = () => { }; reader.readAsDataURL(e.target.files[0]); }}/> <button onClick={() => setShowVisualSceneCreator(false)}>Cancel</button> </div> </div> )}
      {showPhraseCreator && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10005, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}> <h3>Create Phrase</h3> <input id="ph-txt" placeholder="Phrase..." /> <button onClick={() => { const t = document.getElementById('ph-txt').value; if (t) { setCustomItems(prev => [...prev, { id: `ph-${new Date().getTime()}`, name: t, category: activeCategory, emoji: '💬', isPhrase: true }]); setShowPhraseCreator(false); } }}>Create</button> </div> </div> )}
      {showSmartImport && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10004, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}> <h3>Smart Import</h3> <textarea id="sm-imp" placeholder="words..." /> <button onClick={() => { const t = document.getElementById('sm-imp').value; if (t) { const words = t.split(/[\n,]+/).map(s => s.trim()).filter(Boolean); words.forEach(w => { const m = allEmojisFlat.find(e => e.name.toLowerCase() === w.toLowerCase()) || allEmojisFlat.find(e => e.name.toLowerCase().includes(w.toLowerCase())); if (m) toggleEmoji(m.category, m.emoji, m); }); setShowSmartImport(false); } }}>Import</button> </div> </div> )}
      {showCharacterBuilder && <CharacterBuilder onClose={() => setShowCharacterBuilder(false)} onSave={(n, r) => { const i = { id: `av-${new Date().getTime()}`, name: n, category: 'My People', type: 'avatar', recipe: r, emoji: '👤' }; setCustomItems(prev => [i, ...prev]); toggleEmoji('My People', i.emoji, i); setShowCharacterBuilder(false); }} />} 
      {showImageSearch && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10003, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}>                   <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px', textAlign: 'center' }}><p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>Add from Device</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><button onClick={() => handleGetPhoto(CameraSource.Camera)} style={{ padding: '15px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>📸 Take Photo</button><button onClick={() => handleGetPhoto(CameraSource.Photos)} style={{ padding: '15px', background: '#34C759', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>🖼️ Library</button></div><div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}><button onClick={() => { setShowImageSearch(false); setShowVisualSceneCreator(true); }} style={{ flex: 1, padding: '10px', background: '#5856D6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Create JIT Scene</button><button onClick={() => { setShowImageSearch(false); setShowCharacterBuilder(true); }} style={{ flex: 1, padding: '10px', background: '#FF9500', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Create Avatar</button></div></div>
                  <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}><p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>Previously Imported Photos</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>{customItems.filter(i => i.image).map(item => ( <div key={item.id} onClick={() => { toggleEmoji(activeCategory, item.emoji, item); setShowImageSearch(false); }} style={{ cursor: 'pointer', textAlign: 'center' }}><img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px' }} /><div style={{ fontSize: '0.6rem', marginTop: '4px', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div></div> ))}</div>{customItems.filter(i => i.image).length === 0 && <p style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>No photos imported yet.</p>}</div>
                  <button onClick={() => setShowImageSearch(false)} style={{ marginTop: '20px', padding: '10px', width: '100%', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button> </div> </div> )}
      {showTemplates && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}> <h3>Templates</h3> {Object.keys(TEMPLATES).map(n => <button key={n} onClick={() => applyTemplate(n)}>{n}</button>)} <button onClick={() => setShowTemplates(false)}>Cancel</button> </div> </div> )}
      {editingItem && ( <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}> <h3>Edit {editingItem.emoji}</h3> <input value={tempMeta.label} onChange={e => setTempMeta({...tempMeta, label: e.target.value})} /> <button onClick={() => { handleSaveMetadata(editingItem.emoji, tempMeta.label, tempMeta.wordClass, tempMeta.backgroundColor, tempMeta.skill); }}>Save</button> <button onClick={() => setEditingItem(null)}>Cancel</button> </div> </div> )}
    </div>
  );
};

export default EmojiCurator;