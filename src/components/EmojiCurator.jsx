import { useState, useMemo, useRef, useEffect } from 'react';
import { EMOJI_DATA } from '../utils/emojiData';
import { triggerHaptic } from '../utils/haptics';
import { CORE_VOCABULARY, TEMPLATES, CONTEXT_DEFINITIONS } from '../data/aacData';
import { AAC_LEXICON, getFitzgeraldColor } from '../data/aacLexicon';
import { useProfile } from '../context/ProfileContext';
import MemojiPicker from './MemojiPicker';
import VisualSceneCreator from './VisualSceneCreator';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonList,
  IonItem,
  IonNote,
  IonSplitPane,
  IonMenu,
  IonToggle,
  IonInput,
  IonListHeader
} from '@ionic/react';
import {
  menuOutline,
  optionsOutline,
  shareOutline,
  saveOutline,
  bulbOutline,
  cameraOutline,
  sparklesOutline,
  analyticsOutline,
  closeOutline,
  checkmarkOutline,
  libraryOutline,
  bookOutline
} from 'ionicons/icons';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import SplashScreen from './SplashScreen';
import LZString from 'lz-string';
import { QRCodeCanvas } from 'qrcode.react';

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
  const TONE_CATEGORIES = ["Tone: Pale", "Tone: Cream White", "Tone: Brown", "Tone: Dark Brown", "Tone: Black"];
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
  const { pronunciations, addPronunciation } = useProfile();
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerTarget, setPickerTarget] = useState(null);
  const [visibleCount, setVisibleCount] = useState(100);
  const gridRef = useRef(null);
  const pointerStartPos = useRef(null);
  const [cancellingEmoji, setCancellingEmoji] = useState(null); // Tracks which emoji is showing cancel hint
  const blacklistedEmojis = useMemo(() => [], []);

  const handlePointerDown = (e) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    setCancellingEmoji(null);
  };

  const handlePointerMove = (e, emoji) => {
    if (pointerStartPos.current) {
      const dx = Math.abs(e.clientX - pointerStartPos.current.x);
      const dy = Math.abs(e.clientY - pointerStartPos.current.y);
      if (dx > 10 || dy > 10) {
        setCancellingEmoji(emoji);
      } else {
        setCancellingEmoji(null);
      }
    }
  };

  const handleEmojiAction = (category, item) => {
    setCancellingEmoji(null);
    if (showPhraseCreator) {
      if (phraseIcons.length < 3) {
        triggerHaptic('light');
        setPhraseIcons([...phraseIcons, item.emoji]);
      }
      return;
    }

    if (!isLongPress.current && !pickerTarget) {
      if (sequenceMode) {
        triggerHaptic('light');
        setSequence(prev => [...prev, { ...item, id: Date.now() }]);
      } else {
        // Haptic Hierarchy (16.3)
        let hapticStyle = 'light';
        if (item.isPhrase) hapticStyle = 'medium';
        else if (item.name?.toLowerCase() === 'no' || item.name?.toLowerCase() === 'stop') hapticStyle = 'heavy';

        triggerHaptic(hapticStyle);
        toggleEmoji(category, item.emoji, item);
      }
    }
  };
  const [customItems, setCustomItems] = useState([
    { id: 'memoji-mom', name: 'Mom', category: 'My People', image: '/images/memojis/15.png', emoji: 'memoji-mom' },
    { id: 'memoji-dad', name: 'Dad', category: 'My People', image: '/images/memojis/12.png', emoji: 'memoji-dad' },
    { id: 'memoji-ms-rachel', name: 'Ms Rachel', category: 'My People', image: '/images/memojis/10.png', emoji: 'memoji-ms-rachel' },
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
  const [phraseIcons, setPhraseIcons] = useState([]);
  const [showVisualSceneCreator, setShowVisualSceneCreator] = useState(false);
  const [showMemojiPicker, setShowMemojiPicker] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [tempMeta, setTempMeta] = useState({ label: '', wordClass: 'noun', backgroundColor: '#ffffff', skill: 'none' });
  const [activeContext] = useState('Default');

  const generateShareUrl = () => {
    const data = JSON.stringify({
      selected: selectedEmojis,
      meta: emojiMetadata,
      pronunciations: pronunciations
    });
    const compressed = LZString.compressToEncodedURIComponent(data);
    const url = `${window.location.origin}${window.location.pathname}?board=${compressed}`;
    setShareUrl(url);
    setShowShareModal(true);
  };
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
    const params = new URLSearchParams(window.location.search);
    const boardData = params.get('board');
    if (boardData) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(boardData);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.selected) return parsed.selected;
        }
      } catch (e) { console.error(e); }
    }

    const initial = {}; categories.forEach(category => { initial[category] = []; });
    initial['My People'] = ['memoji-mom', 'memoji-dad', 'memoji-ms-rachel'];
    initial['Characters'] = ['🔴', '🎵', '🕷️'];
    Object.keys(CURRENT_ICONS).forEach(cat => {
      (CURRENT_ICONS[cat] || []).forEach(emoji => {
        const base = allEmojisFlat.find(e => e.emoji === emoji) || allEmojisFlat.find(e => e.variations.some(v => v.emoji === emoji));
        if (base) { if (!initial[base.category]) initial[base.category] = []; if (!initial[base.category].includes(emoji)) initial[base.category].push(emoji); }
      });
    });
    return initial;
  });

  const [emojiMetadata, setEmojiMetadata] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const boardData = params.get('board');
    if (boardData) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(boardData);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.meta) return parsed.meta;
        }
      } catch (e) { console.error(e); }
    }
    return {};
  });

  // Deep Linking / Import Logic - URL Cleanup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const boardData = params.get('board');
    if (boardData) {
      // Import pronunciations if present
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(boardData);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          if (parsed.pronunciations) {
            Object.entries(parsed.pronunciations).forEach(([w, p]) => {
              addPronunciation(w, p);
            });
          }
        }
      } catch (e) { console.error(e); }

      // Decompression check already done in initializers, just notify and clean up
      setTimeout(() => alert("Board imported successfully! 🥝"), 100);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [addPronunciation]);


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
  }, [searchQuery, activeCategory, showCoreOnly, customItems, blacklistedEmojis, activeContext]);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  const pickerRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (pickerTarget) {
      previousFocus.current = document.activeElement; setTimeout(() => { pickerRef.current?.querySelector('button')?.focus(); }, 50);
      const handleKeyDown = (e) => { if (e.key === 'Escape') setPickerTarget(null); if (e.key === 'Tab') { const buttons = pickerRef.current?.querySelectorAll('button'); if (!buttons?.length) return; if (e.shiftKey) { if (document.activeElement === buttons[0]) { e.preventDefault(); buttons[buttons.length - 1].focus(); } } else { if (document.activeElement === buttons[buttons.length - 1]) { e.preventDefault(); buttons[0].focus(); } } } };
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
      const customPhotoCount = customItems.filter(item => {
        const isAvatar = item?.type === 'avatar' || item?.type === 'custom_avatar' || (typeof item?.emoji === 'string' && item.emoji.startsWith('av-'));
        return !isAvatar && typeof item.image === 'string' && item.image.startsWith('data:');
      }).length;
      try {
        const { checkCustomPhotoLimit } = await import('../utils/paywall');
        const hasAccess = await checkCustomPhotoLimit(customPhotoCount);
        if (!hasAccess) return;
      } catch (error) {
        console.error('Failed to check custom photo limit:', error);
      }

      const image = await Camera.getPhoto({ quality: 90, allowEditing: true, resultType: CameraResultType.DataUrl, source });
      if (image?.dataUrl) {
        const name = prompt("Enter name:");
        if (name) {
          setCustomItems(prev => {
            const timestamp = Date.now();
            const newItem = { id: `custom-${timestamp}`, name, category: activeCategory, image: image.dataUrl, emoji: `custom-${timestamp}` };
            return [newItem, ...prev];
          });
          setShowImageSearch(false);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveMetadata = (char, label, wordClass, backgroundColor, skill) => { setEmojiMetadata(prev => ({ ...prev, [char]: { label, wordClass, backgroundColor, skill } })); setEditingItem(null); };
  const applyTemplate = (templateName) => { const words = TEMPLATES[templateName]; if (!words) return; setSelectedEmojis(prev => { const next = { ...prev }; words.forEach(word => { const match = allEmojisFlat.find(e => e.name.toLowerCase() === word.toLowerCase()) || allEmojisFlat.find(e => e.name.toLowerCase().includes(word.toLowerCase())); if (match) { if (!next[match.category]) next[match.category] = []; if (!next[match.category].includes(match.emoji)) next[match.category].push(match.emoji); } }); return next; }); setShowTemplates(false); triggerHaptic('success'); };

  const totalSelected = Object.values(selectedEmojis).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  const exportSelected = () => {
    const output = {
      pronunciations: pronunciations,
      icons: {}
    };
    Object.keys(selectedEmojis).forEach(cat => {
      if (selectedEmojis[cat]?.length) {
        output.icons[cat] = selectedEmojis[cat].map(char => {
          const custom = customItems.find(c => c.emoji === char);
          if (custom) return custom.type === 'avatar' ? { w: custom.name, type: 'custom_avatar', recipe: custom.recipe, i: '👤' } : { w: custom.name, i: custom.image, isCustom: true };
          const base = allEmojisFlat.find(e => e.emoji === char) || allEmojisFlat.reduce((acc, b) => acc || b.variations.find(v => v.emoji === char), null);
          const meta = emojiMetadata[char] || {};
          return { w: meta.label || base?.name || "Unknown", i: char, wc: meta.wordClass || 'noun', bg: meta.backgroundColor || '#ffffff', skill: meta.skill || 'none' };
        });
      }
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' }));
    a.download = 'iconsData.json';
    a.click();
  };

  return (
    <IonPage style={{ userSelect: 'none' }}>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {isMobile && (
              <IonButton onClick={() => setShowSidebar(!showSidebar)}>
                <IonIcon icon={menuOutline} />
              </IonButton>
            )}
            <IonTitle>
              <span style={{ fontSize: '1.2rem', marginRight: '8px' }}> Kiwi </span>
              {!isMobile && "Library Builder"}
            </IonTitle>
          </IonButtons>

          <IonButtons slot="end">
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
              <IonLabel style={{ fontSize: '0.8rem', marginRight: '5px' }}>Core Only</IonLabel>
              <IonToggle
                checked={showCoreOnly}
                onIonChange={(e) => setShowCoreOnly(e.detail.checked)}
              />
            </div>

            <IonButton onClick={() => setShowToolsMenu(!showToolsMenu)}>
              Tools <IonIcon icon={optionsOutline} slot="end" />
            </IonButton>

            {showToolsMenu && (
              <IonModal
                isOpen={showToolsMenu}
                onDidDismiss={() => setShowToolsMenu(false)}
                className="tools-popover"
                style={{ '--width': '220px', '--height': 'auto', '--border-radius': '12px' }}
                breakpoints={[0, 1]}
                initialBreakpoint={1}
              >
                <IonContent className="ion-padding">
                  <IonList lines="none">
                    <IonItem button onClick={() => { setShowSmartImport(true); setShowToolsMenu(false); }}>
                      <IonIcon icon={checkmarkOutline} slot="start" />
                      <IonLabel>Bulk Import</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => { setShowPhraseCreator(true); setShowToolsMenu(false); }}>
                      <IonIcon icon={sparklesOutline} slot="start" />
                      <IonLabel>GLP Phrase Creator</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => { setShowTemplates(true); setShowToolsMenu(false); }}>
                      <IonIcon icon={bookOutline} slot="start" />
                      <IonLabel>Templates</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => { setShowImageSearch(true); setShowToolsMenu(false); }}>
                      <IonIcon icon={cameraOutline} slot="start" />
                      <IonLabel>Add Custom</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => { setSequenceMode(!sequenceMode); setShowToolsMenu(false); }}>
                      <IonIcon icon={sparklesOutline} slot="start" />
                      <IonLabel>{sequenceMode ? 'Finish Sequence' : 'Builder Mode'}</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => { setGuideMode(!guideMode); setShowToolsMenu(false); }}>
                      <IonIcon icon={analyticsOutline} slot="start" />
                      <IonLabel>{guideMode ? 'Stop Guide' : 'Guide Mode'}</IonLabel>
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonModal>
            )}

            <div className="ion-hide-sm-down" style={{
              background: 'var(--ion-color-light)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              margin: '0 10px'
            }}>
              <IonText color="primary" style={{ fontWeight: 'bold' }}>{totalSelected}</IonText> selected
            </div>

            <IonButton onClick={generateShareUrl}>
              <IonIcon icon={shareOutline} slot="icon-only" />
            </IonButton>

            <IonButton fill="solid" color="primary" onClick={exportSelected} style={{ fontWeight: 'bold' }}>
              {isMobile ? 'SAVE' : 'EXPORT'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSplitPane contentId="main" when="md">
          <IonMenu contentId="main" type="overlay" side="start">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Categories</IonTitle>
              </IonToolbar>
              <IonToolbar>
                <IonSearchbar
                  value={searchQuery}
                  onIonInput={(e) => setSearchQuery(e.detail.value)}
                  placeholder="Search icons..."
                />
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                {!searchQuery && categories.map(cat => (
                  <IonItem
                    key={cat}
                    button
                    onClick={() => { setActiveCategory(cat); if (isMobile) setShowSidebar(false); }}
                    color={activeCategory === cat ? 'primary' : ''}
                  >
                    <IonLabel>{cat}</IonLabel>
                    {selectedEmojis[cat]?.length > 0 && (
                      <IonNote slot="end" color="primary" style={{ fontWeight: 'bold' }}>
                        {selectedEmojis[cat].length}
                      </IonNote>
                    )}
                  </IonItem>
                ))}
              </IonList>
            </IonContent>
          </IonMenu>

          <div id="main" className="ion-page">
            <IonHeader>
              <IonToolbar>
                <IonTitle size="small">
                  {searchQuery ? `Results for "${searchQuery}"` : activeCategory}
                </IonTitle>
                {!searchQuery && (
                  <IonButtons slot="end">
                    <IonButton onClick={() => { const all = (groupedEmojiData[activeCategory] || []).map(i => i.emoji); setSelectedEmojis(prev => ({ ...prev, [activeCategory]: all })); }}>
                      Select All
                    </IonButton>
                  </IonButtons>
                )}
              </IonToolbar>
            </IonHeader>
            <IonContent ref={gridRef} onIonScroll={handleScroll} scrollEvents={true}>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(5.3125rem, 1fr))' : 'repeat(auto-fill, minmax(8.125rem, 1fr))', gap: isMobile ? '0.75rem' : '1.25rem' }}>
                {(filteredEmojis || []).slice(0, visibleCount).map((item, idx) => {
                  const sel = getSelectedInGroup(activeCategory, item); const isChecked = !!sel; const disp = sel || item.emoji;
                  const meta = emojiMetadata[disp] || {};
                  const bgColor = meta.backgroundColor || 'white';
                  const textColor = meta.wordClass ? (meta.wordClass === 'noun' ? '#2D3436' : '#FFFFFF') : '#333';
                  const isTarg = guideMode && (CORE_VOCABULARY.includes(item.name.toLowerCase()));
                  return (
                    <button
                      key={`${item.emoji}-${idx}`}
                      onPointerDown={(e) => handlePointerDown(e, item.emoji)}
                      onPointerMove={(e) => handlePointerMove(e, item.emoji)}
                      onMouseDown={(e) => handleStart(e, item)}
                      onMouseUp={handleCleanup}
                      onMouseLeave={handleCleanup}
                      onPointerUp={() => {
                        if (cancellingEmoji === item.emoji) {
                          setCancellingEmoji(null);
                          return;
                        }
                        handleEmojiAction(activeCategory, item);
                      }}
                      style={{
                        padding: '0.9375rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        background: bgColor,
                        boxShadow: isTarg ? '0 0 0.9375rem #FFD700' : '0 0.125rem 0.375rem rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                        position: 'relative',
                        transition: 'transform 0.1s active'
                      }}
                    >
                      {cancellingEmoji === item.emoji && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(255, 59, 48, 0.8)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          zIndex: 10,
                          borderRadius: 'inherit',
                          backdropFilter: 'blur(4px)'
                        }}>
                          CANCEL
                        </div>
                      )}
                      {item.isPhrase ? (
                        <div style={{ display: 'flex', gap: '0.125rem', background: '#fff', padding: '0.3125rem', borderRadius: '0.5rem', border: '0.0625rem solid #eee' }}>
                          {(item.phraseIcons || [item.emoji]).map((ic, i) => (
                            <span key={i} style={{ fontSize: (item.phraseIcons?.length || 1) > 1 ? '1.5rem' : '2.5rem' }}>{ic}</span>
                          ))}
                        </div>
                      ) : item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '3rem', height: '3rem', objectFit: item.image.includes('/images/memojis/') ? 'contain' : 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '2.5rem' }}>{disp}</span>
                      )}
                      <span style={{ fontSize: '0.8rem', color: textColor, fontWeight: (meta.wordClass || item.isPhrase) ? 'bold' : 'normal' }}>{meta.label || item.name}</span>

                      {isChecked && (
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
            </IonContent>
          </div>
        </IonSplitPane>
      </IonContent>

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

      {/* Bulk Import Modal */}
      <IonModal isOpen={showSmartImport} onDidDismiss={() => setShowSmartImport(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Bulk Import</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowSmartImport(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="medium">
            <p>Paste a comma-separated list of items to bulk select them.</p>
          </IonText>
          <div style={{ margin: '1rem 0' }}>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="e.g. apple, banana, car, ball"
              style={{
                width: '100%',
                height: '150px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--ion-color-light-shade)',
                fontSize: '1rem'
              }}
            />
          </div>
          <IonButton expand="block" onClick={handleBulkImport}>Import List</IonButton>
        </IonContent>
      </IonModal>

      {/* GLP Phrase Creator Modal */}
      <IonModal isOpen={showPhraseCreator} onDidDismiss={() => setShowPhraseCreator(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>GLP Phrase Creator</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => { setShowPhraseCreator(false); setPhraseIcons([]); setPhraseName(''); }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Phrase Name</IonLabel>
              <IonInput
                value={phraseName}
                onIonInput={(e) => setPhraseName(e.detail.value)}
                placeholder="e.g. I want to play"
              />
            </IonItem>
          </IonList>

          <div style={{ margin: '1.5rem 0' }}>
            <IonLabel style={{ fontWeight: 'bold' }}>Storyboard Icons (Max 3)</IonLabel>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              minHeight: '80px',
              background: 'var(--ion-color-light)',
              borderRadius: '12px',
              padding: '12px',
              marginTop: '8px',
              border: '2px dashed var(--ion-color-light-shade)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {phraseIcons.map((icon, i) => (
                <div key={i} onClick={() => setPhraseIcons(prev => prev.filter((_, idx) => idx !== i))} style={{
                  width: '60px',
                  height: '60px',
                  background: 'white',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  position: 'relative',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}>
                  {icon}
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'var(--ion-color-danger)',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontWeight: 'bold'
                  }}>✕</div>
                </div>
              ))}
              {phraseIcons.length === 0 && (
                <div style={{ color: 'var(--ion-color-medium)', fontSize: '0.9rem' }}>
                  Tap icons in the library grid to add...
                </div>
              )}
            </div>
          </div>

          <IonButton expand="block" size="large" onClick={savePhrase} disabled={!phraseName || phraseIcons.length === 0}>
            Save Phrase Group
          </IonButton>
        </IonContent>
      </IonModal>

      {/* Templates Modal */}
      <IonModal isOpen={showTemplates} onDidDismiss={() => setShowTemplates(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Templates</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowTemplates(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonListHeader>
              <IonLabel>Quick Starts</IonLabel>
            </IonListHeader>
            {Object.keys(TEMPLATES).map(name => (
              <IonItem button key={name} onClick={() => { applyTemplate(TEMPLATES[name]); setShowTemplates(false); }}>
                <IonLabel>{name}</IonLabel>
                <IonNote slot="end">Select items</IonNote>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonModal>

      {/* Image Search Modal (Legacy Custom Item Logic) */}
      <IonModal isOpen={showImageSearch} onDidDismiss={() => setShowImageSearch(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Custom</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowImageSearch(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Item Label</IonLabel>
              <IonInput
                value={customLabel}
                onIonInput={(e) => setCustomLabel(e.detail.value)}
                placeholder="e.g. My Favorite Toy"
              />
            </IonItem>
          </IonList>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1.5rem' }}>
            <IonButton fill="outline" onClick={() => handleGetPhoto(CameraSource.Camera)}>
              <IonIcon icon={cameraOutline} slot="start" />
              Camera
            </IonButton>
            <IonButton fill="outline" onClick={() => { setShowImageSearch(false); setShowMemojiPicker(true); }}>
              <IonIcon icon={sparklesOutline} slot="start" />
              Avatar
            </IonButton>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {customImage && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={customImage} alt="Preview" style={{ maxWidth: '150px', borderRadius: '12px' }} />
                <IonButton color="danger" size="small" style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => setCustomImage(null)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </div>
            )}
          </div>

          <IonButton expand="block" style={{ marginTop: '2rem' }} onClick={createCustomItem} disabled={!customLabel || !customImage}>
            Add to Library
          </IonButton>
        </IonContent>
      </IonModal>

      {showMemojiPicker && <MemojiPicker onSelect={(u) => { setCustomImage(u); setShowMemojiPicker(false); }} onClose={() => setShowMemojiPicker(false)} />}
      {showShareModal && (
        <IonModal isOpen={showShareModal} onDidDismiss={() => setShowShareModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Share Board</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowShareModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding ion-text-center">
            <IonText color="dark">
              <h2>Scan to Download</h2>
            </IonText>
            <div style={{ padding: '2rem', background: 'white', display: 'inline-block', borderRadius: '1rem', marginTop: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <QRCodeCanvas value={shareUrl} size={256} />
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: 'var(--ion-color-medium)' }}>
              Scan this QR code from another device with Kiwi installed to import this board configuration.
            </p>
          </IonContent>
        </IonModal>
      )}

      {showVisualSceneCreator && (
        <VisualSceneCreator
          onClose={() => setShowVisualSceneCreator(false)}
          onSave={(newScene) => {
            setCustomItems(prev => [newScene, ...prev]);
            toggleEmoji(activeCategory, newScene.id, newScene);
            setShowVisualSceneCreator(false);
          }}
        />
      )}
      )}

      {/* Global CSS for curator */}
      <style>{`
        .tools-popover {
          --box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .emoji-item {
          transition: transform 0.1s ease;
        }
        .emoji-item:active {
          transform: scale(0.95);
        }
      `}</style>

    </IonPage >
  );
};

export default EmojiCurator;
