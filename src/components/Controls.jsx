import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import GuidedAccessModal from './GuidedAccessModal';
import FavoritesPickerModal from './FavoritesPickerModal';
import PronunciationEditor from './PronunciationEditor';
import MemojiPicker from './MemojiPicker';
import { STAGES, LEVEL_ORDER, getLevel, getStage } from '../data/levelDefinitions';
import { BELL_SOUNDS, playBellSound } from '../utils/sounds';
import { useProfile } from '../context/ProfileContext';

import BackupRestore from './BackupRestore';

const Controls = ({
    isEditMode,
    isTrainingMode,
    currentPhase,
    currentLevel,
    currentContext,
    contexts,
    onSetContext,
    onAddContext,
    onRenameContext,
    onDeleteContext,
    onToggleMenu,
    onAddItem,
    onSetLevel,
    onStartTraining,
    onReset,
    onShuffle,
    onStopTraining,
    onOpenPicker,
    onToggleDashboard,
    onRedoCalibration,
    onToggleLock,
    voiceSettings,
    onUpdateVoiceSettings,
    gridSize,
    onUpdateGridSize,
    phase1TargetId,
    onSetPhase1Target,
    rootItems,
    colorTheme,
    onSetColorTheme,
    bellSound,
    onUpdateBellSound,
    speechDelay,
    onUpdateSpeechDelay,
    autoSpeak,
    onUpdateAutoSpeak,
    isScanning,
    onToggleScanning,
    scanSpeed,
    onUpdateScanSpeed,
    isLayoutLocked,
    onToggleLayoutLock,
    isColorCodingEnabled,
    onToggleColorCoding,
    showCategoryHeaders,
    onToggleCategoryHeaders,
    proficiencyLevel,
    onUpdateProficiencyLevel,
    onAddPage,
    onDeletePage,
    currentPageIndex,
    onAddFavorites,
    progressData = {}
}) => {

    const COLOR_THEMES = [
        { id: 'default', label: 'Kiwi', icon: '🥝', primary: '#4ECDC4', bg: '#FDF8F3', premium: false },
        { id: 'ocean', label: 'Ocean', icon: '🌊', primary: '#0EA5E9', bg: '#E8F4FC', premium: true },
        { id: 'sunset', label: 'Sunset', icon: '🌅', primary: '#F97316', bg: '#FFF7ED', premium: true },
        { id: 'forest', label: 'Forest', icon: '🌲', primary: '#22C55E', bg: '#F0FDF4', premium: true },
        { id: 'berry', label: 'Berry', icon: '🍇', primary: '#A855F7', bg: '#FAF5FF', premium: true },
        { id: 'candy', label: 'Candy', icon: '🍬', primary: '#EC4899', bg: '#FDF2F8', premium: true },
    ];

    const [showGuidedAccess, setShowGuidedAccess] = useState(false);
    const [showFavoritesPicker, setShowFavoritesPicker] = useState(false);
    const [showPronunciationEditor, setShowPronunciationEditor] = useState(false);
    const [showBackupRestore, setShowBackupRestore] = useState(false);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [isRestoring, setIsRestoring] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const tabs = [
        { id: 'basic', label: '⚡ Basic' },
        { id: 'character', label: '✨ Avatar' },
        { id: 'advanced', label: '⚙️ Extra' },
        { id: 'data', label: '📊 Data' }
    ];
    const activeTabIndex = tabs.findIndex(t => t.id === activeTab);

    const { pronunciations } = useProfile();

    const testVoice = () => {
        const text = "Hello, I am ready to talk.";
        const words = text.split(/\s+/);
        const processedWords = words.map(w => {
            const cleanWord = w.toLowerCase().replace(/[.,!?;:]/g, '');
            return pronunciations[cleanWord] || w;
        });
        const processedText = processedWords.join(' ');
        
        const u = new SpeechSynthesisUtterance(processedText);
        u.rate = voiceSettings.rate;
        u.pitch = voiceSettings.pitch || 1;
        u.volume = voiceSettings.volume || 1;
        
        if (voiceSettings.voiceURI) {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.voiceURI === voiceSettings.voiceURI);
            if (selectedVoice) u.voice = selectedVoice;
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    };

    // Detect iOS to show relevant help
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const [selectedLang, setSelectedLang] = useState('en');

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setAvailableVoices(voices);
            
            // Default to first available language if 'en' not found
            if (voices.length > 0 && !voices.some(v => v.lang.startsWith('en'))) {
                setSelectedLang(voices[0].lang.split('-')[0]);
            }
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const VOICE_PRESETS = [
        { id: 'child', label: '👧 Child', pitch: 1.2, rate: 0.8 },
        { id: 'adult', label: '👩 Adult', pitch: 1.0, rate: 1.0 },
        { id: 'clear', label: '🗣️ Clear', pitch: 1.0, rate: 0.7 }
    ];

    const applyPreset = (preset) => {
        onUpdateVoiceSettings({
            ...voiceSettings,
            pitch: preset.pitch,
            rate: preset.rate
        });
    };

    const filteredVoices = availableVoices
        .filter(v => v.lang.startsWith(selectedLang))
        .sort((a, b) => {
            const aHigh = a.name.includes('Enhanced') || a.name.includes('Premium') || a.name.includes('Siri');
            const bHigh = b.name.includes('Enhanced') || b.name.includes('Premium') || b.name.includes('Siri');
            if (aHigh && !bHigh) return -1;
            if (!aHigh && bHigh) return 1;
            return a.name.localeCompare(b.name);
        });

    const languages = Array.from(new Set(availableVoices.map(v => v.lang.split('-')[0]))).sort();

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const { restorePurchases } = await import('../utils/paywall');
            const restored = await restorePurchases();
            if (restored) {
                alert("Purchases successfully restored!");
                window.location.reload();
            }
        } catch (error) {
            console.error('Restore failed:', error);
            alert("Restore failed. Please try again or contact support.");
        } finally {
            setIsRestoring(false);
        }
    };

    const handleCustomerCenter = async () => {
        try {
            const { showCustomerCenter } = await import('../utils/paywall');
            await showCustomerCenter();
        } catch (error) {
            console.error('Customer Center error:', error);
            alert("Unable to open Customer Center. Please try again.");
        }
    };

    const handleLock = () => {
        if (isIOS) {
            setShowGuidedAccess(true);
        } else {
            if (confirm("Lock controls for child use?")) {
                onToggleLock();
            }
        }
    };

    useEffect(() => {
        console.log('Controls - isEditMode:', isEditMode, 'isTrainingMode:', isTrainingMode);
    }, [isEditMode, isTrainingMode]);

    return (
        <div id="controls" className={isEditMode || isTrainingMode ? '' : 'collapsed'} onClick={(e) => {
            if (e.target.id === 'controls') onToggleMenu();
        }}>
            <div id="controls-content">
                <div className="drag-handle"></div>
                <div id="parent-header">
                    <span>Adult Settings</span>
                    <button id="close-settings" onClick={onToggleMenu}>✕</button>
                </div>

                {/* Edit Panel */}
                <div id="edit-panel" style={{ display: (isEditMode && !isTrainingMode) ? 'flex' : 'none', flexDirection: 'column' }}>
                    
                    {/* Action Section */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <button onClick={handleLock} className="apple-red-button">
                            🔒 Lock App for Child
                        </button>

                        {isIOS && (
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={() => setShowGuidedAccess(true)}>
                                    <span style={{ fontWeight: 600, color: '#5856D6' }}>ℹ️ How to Use Guided Access</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Segmented Tab Control */}
                    <div className="ios-segmented-control">
                        <div 
                            className="selection-pill" 
                            style={{ 
                                width: `calc(${100 / tabs.length}% - 0.25rem)`,
                                transform: `translateX(${activeTabIndex * 100}%)` 
                            }} 
                        />
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={activeTab === tab.id ? 'active' : ''}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Basic Tab */}
                    {activeTab === 'basic' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -1.5rem', padding: '0 1.5rem 1.5rem', flex: 1 }}>
                            
                            <div className="ios-setting-group-header">Library Building</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={() => onOpenPicker((word, icon) => onAddItem(word, icon, 'button'))}>
                                    <span>+ Add Icon</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={() => onAddItem('', '', 'folder')}>
                                    <span>+ Add Folder</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Board Pages</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={onAddPage}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>+ Add New Page</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" style={{ minHeight: 'auto', padding: '0.5rem 0.9375rem', background: '#F2F2F7' }}>
                                    <p style={{ fontSize: '0.625rem', color: '#8E8E93', margin: 0 }}>
                                        Current Page: {currentPageIndex + 1}
                                    </p>
                                </div>
                                {onDeletePage && (
                                    <div className="ios-row" onClick={() => onDeletePage(currentPageIndex)} style={{ opacity: currentPageIndex === 0 ? 0.5 : 1 }}>
                                        <span style={{ color: '#FF3B30', fontWeight: 600 }}>Delete Current Page</span>
                                        <span className="ios-chevron">🗑️</span>
                                    </div>
                                )}
                            </div>

                            <div className="ios-setting-group-header">Communication Level</div>
                            <div className="ios-setting-card" style={{ padding: '0.9375rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.9375rem' }}>
                                    {Object.entries(STAGES).map(([stageNum, stage]) => {
                                        const stageInt = parseInt(stageNum);
                                        const isActive = Math.floor(currentLevel) === stageInt;
                                        return (
                                            <button
                                                key={stageNum}
                                                onClick={() => {
                                                    const firstLevel = LEVEL_ORDER.find(l => Math.floor(l) === stageInt);
                                                    if (firstLevel && onSetLevel) onSetLevel(firstLevel);
                                                }}
                                                style={{
                                                    height: '3.125rem',
                                                    fontSize: '0.75rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.125rem',
                                                    background: isActive ? stage.color : '#E5E5EA',
                                                    color: isActive ? 'var(--primary-text)' : 'black',
                                                    borderRadius: '0.625rem',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.125rem' }}>{stage.icon}</span>
                                                <span style={{ fontWeight: 700 }}>Stage {stageInt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {currentLevel && (
                                    <div style={{
                                        background: getStage(currentLevel).color + '15',
                                        padding: '0.75rem',
                                        borderRadius: '0.625rem',
                                        border: `0.0625rem solid ${getStage(currentLevel).color}40`
                                    }}>
                                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: getStage(currentLevel).color, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            {getStage(currentLevel).icon} {getStage(currentLevel).name}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                                            {LEVEL_ORDER.filter(l => Math.floor(l) === Math.floor(currentLevel)).map(lvl => {
                                                const levelDef = getLevel(lvl);
                                                const isSelected = currentLevel === lvl;
                                                return (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => onSetLevel && onSetLevel(lvl)}
                                                        style={{
                                                            minHeight: '2.25rem',
                                                            padding: '0 0.75rem',
                                                            fontSize: '0.6875rem',
                                                            background: isSelected ? getStage(currentLevel).color : 'white',
                                                            color: isSelected ? 'var(--primary-text)' : '#333',
                                                            borderRadius: '0.5rem',
                                                            border: isSelected ? 'none' : '0.0625rem solid #ddd',
                                                            cursor: 'pointer',
                                                            fontWeight: isSelected ? 700 : 400
                                                        }}
                                                    >
                                                        {lvl} {levelDef.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Quick swap for Level 1 */}
                                {currentPhase === 1 && (
                                    <div style={{ marginTop: '0.9375rem', padding: '0.75rem', background: 'linear-gradient(135deg, #FFF5E1, #FFE4B5)', borderRadius: '0.625rem', border: '0.0625rem solid #FFA500' }}>
                                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#D2691E', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                            🎯 Choose Target Icon
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3125rem' }}>
                                            {rootItems.filter(i => {
                                                const allowedIds = ['snack-generic', 'play-generic', 'toy-generic', 'mom', 'dad'];
                                                return i.type === 'button' && allowedIds.includes(i.id);
                                            }).map(item => {
                                                const allowedIds = ['snack-generic', 'play-generic', 'toy-generic', 'mom', 'dad'];
                                                const firstAllowedItem = rootItems.find(i => i.type === 'button' && allowedIds.includes(i.id));
                                                const isSelected = phase1TargetId === item.id || (!phase1TargetId && firstAllowedItem?.id === item.id);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => onSetPhase1Target(item.id)}
                                                        style={{
                                                            minWidth: '3.125rem',
                                                            height: '3.125rem',
                                                            padding: '0.25rem',
                                                            borderRadius: '0.625rem',
                                                            background: isSelected ? 'var(--primary)' : 'white',
                                                            border: isSelected ? '0.125rem solid #007AFF' : '0.0625rem solid #DDD',
                                                            fontSize: '1.2rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.2s',
                                                            boxShadow: isSelected ? '0 0.125rem 0.375rem rgba(0,122,255,0.3)' : 'none'
                                                        }}
                                                    >
                                                        <span>{typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? '🖼️' : item.icon}</span>
                                                        <span style={{ fontSize: '0.5rem', fontWeight: '700', color: isSelected ? 'var(--primary-text)' : '#666', overflow: 'hidden', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.word}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ios-setting-group-header">Locations</div>
                            <div className="ios-setting-card">
                                {contexts && contexts.map(ctx => (
                                    <div key={ctx.id} className="ios-row" onClick={() => onSetContext(ctx.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.25rem' }}>{ctx.icon}</span>
                                            <span style={{ fontWeight: currentContext === ctx.id ? 700 : 400 }}>{ctx.label}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newLabel = prompt("Rename location:", ctx.label);
                                                    if (newLabel) onRenameContext(ctx.id, newLabel, ctx.icon);
                                                }}
                                                style={{ border: 'none', background: '#F2F2F7', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', minHeight: '2.75rem', minWidth: '2.75rem' }}
                                            >✎</button>
                                            {contexts.length > 1 && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteContext(ctx.id);
                                                    }}
                                                    style={{ border: 'none', background: '#FFE5E5', color: '#FF3B30', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', minHeight: '2.75rem', minWidth: '2.75rem' }}
                                                >×</button>
                                            )}
                                            {currentContext === ctx.id && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>}
                                        </div>
                                    </div>
                                ))}
                                <div className="ios-row" onClick={() => {
                                    const label = prompt("Location Name (e.g. Playground)");
                                    if (label) onOpenPicker((w, icon) => onAddContext(label, icon), true);
                                }}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>{contexts?.length >= 5 ? '👑 Add New Location' : '+ Add New Location'}</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Character Tab */}
                    {activeTab === 'character' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -1.5rem', padding: '1.5rem', flex: 1 }}>
                            <MemojiPicker
                                onSelect={(url, config) => {
                                    onAddItem(config.name || 'Character', url, 'button');
                                    alert(`${config.name || 'Character'} added to your library!`);
                                    setActiveTab('basic');
                                }}
                                onClose={() => setActiveTab('basic')}
                            />
                        </div>
                    )}

                    {/* Extra Settings Tab */}
                    {activeTab === 'advanced' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -1.5rem', padding: '0 1.5rem 1.5rem', flex: 1 }}>
                            
                            <div className="ios-setting-group-header">Accessibility</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={onToggleScanning}>
                                    <span>♿ Auto-Scanning (Switch Access)</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isScanning ? '#007AFF' : '#8E8E93' }}>
                                            {isScanning ? 'On' : 'Off'}
                                        </span>
                                        <div style={{ 
                                            width: '51px', 
                                            height: '31px', 
                                            background: isScanning ? '#007AFF' : '#E5E5EA', 
                                            borderRadius: '15.5px', 
                                            position: 'relative',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ 
                                                width: '27px', 
                                                height: '27px', 
                                                background: 'white', 
                                                borderRadius: '50%', 
                                                position: 'absolute', 
                                                top: '2px', 
                                                left: isScanning ? '22px' : '2px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                {isScanning && (
                                    <div className="ios-row" style={{ padding: '0.9375rem' }}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.875rem' }}>⏱️ Scan Speed</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{(scanSpeed / 1000).toFixed(1)}s</span>
                                            </div>
                                            <input
                                                type="range" min="500" max="5000" step="100"
                                                value={scanSpeed}
                                                onChange={(e) => onUpdateScanSpeed(parseInt(e.target.value, 10))}
                                                style={{ width: '100%', height: '2.75rem' }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="ios-row" onClick={onToggleLayoutLock}>
                                    <span>🔒 Lock Board Layout</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isLayoutLocked ? '#AF52DE' : '#8E8E93' }}>
                                            {isLayoutLocked ? 'Locked' : 'Unlocked'}
                                        </span>
                                        <div style={{ 
                                            width: '51px', 
                                            height: '31px', 
                                            background: isLayoutLocked ? '#AF52DE' : '#E5E5EA', 
                                            borderRadius: '15.5px', 
                                            position: 'relative',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ 
                                                width: '27px', 
                                                height: '27px', 
                                                background: 'white', 
                                                borderRadius: '50%', 
                                                position: 'absolute', 
                                                top: '2px', 
                                                left: isLayoutLocked ? '22px' : '2px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="ios-row" style={{ minHeight: 'auto', padding: '0.5rem 0.9375rem', background: '#F2F2F7' }}>
                                    <p style={{ fontSize: '0.625rem', color: '#8E8E93', margin: 0 }}>
                                        Prevents icons from being moved or deleted, ensuring consistent motor planning.
                                    </p>
                                </div>
                                <div className="ios-row" onClick={onToggleColorCoding}>
                                    <span>🎨 Color Coding (Fitzgerald Key)</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isColorCodingEnabled ? '#34C759' : '#8E8E93' }}>
                                            {isColorCodingEnabled ? 'On' : 'Off'}
                                        </span>
                                        <div style={{ 
                                            width: '51px', 
                                            height: '31px', 
                                            background: isColorCodingEnabled ? '#34C759' : '#E5E5EA', 
                                            borderRadius: '15.5px', 
                                            position: 'relative',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ 
                                                width: '27px', 
                                                height: '27px', 
                                                background: 'white', 
                                                borderRadius: '50%', 
                                                position: 'absolute', 
                                                top: '2px', 
                                                left: isColorCodingEnabled ? '22px' : '2px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="ios-row" onClick={onToggleCategoryHeaders}>
                                    <span>📂 Show Category Headers</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: showCategoryHeaders ? '#34C759' : '#8E8E93' }}>
                                            {showCategoryHeaders ? 'On' : 'Off'}
                                        </span>
                                        <div style={{ 
                                            width: '51px', 
                                            height: '31px', 
                                            background: showCategoryHeaders ? '#34C759' : '#E5E5EA', 
                                            borderRadius: '15.5px', 
                                            position: 'relative',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ 
                                                width: '27px', 
                                                height: '27px', 
                                                background: 'white', 
                                                borderRadius: '50%', 
                                                position: 'absolute', 
                                                top: '2px', 
                                                left: showCategoryHeaders ? '22px' : '2px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="ios-row" style={{ minHeight: 'auto', padding: '0.5rem 0.9375rem', background: '#F2F2F7' }}>
                                    <p style={{ fontSize: '0.625rem', color: '#8E8E93', margin: 0 }}>
                                        Organizes your board into labeled sections like 'Actions' or 'Describe'.
                                    </p>
                                </div>
                                <div className="ios-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.625rem', padding: '1rem' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>🎯 Vocabulary Level</span>
                                    <div className="ios-segmented-control" style={{ marginBottom: 0 }}>
                                        <div 
                                            className="selection-pill" 
                                            style={{ 
                                                width: 'calc(33.33% - 4px)',
                                                transform: proficiencyLevel === 'beginner' ? 'translateX(0)' : 
                                                           proficiencyLevel === 'intermediate' ? 'translateX(100%)' : 'translateX(200%)' 
                                            }} 
                                        />
                                        <button onClick={() => onUpdateProficiencyLevel('beginner')} style={{ minHeight: '2.75rem' }}>Beginner</button>
                                        <button onClick={() => onUpdateProficiencyLevel('intermediate')} style={{ minHeight: '2.75rem' }}>Intermediate</button>
                                        <button onClick={() => onUpdateProficiencyLevel('advanced')} style={{ minHeight: '2.75rem' }}>Advanced</button>
                                    </div>
                                    <p style={{ fontSize: '0.625rem', color: '#8E8E93', margin: 0 }}>
                                        {proficiencyLevel === 'beginner' ? 'Shows core words + 10 fringe icons. Others are grayed out.' : 
                                         proficiencyLevel === 'intermediate' ? 'Shows core words + 40 fringe icons.' : 'Shows all vocabulary icons.'}
                                    </p>
                                </div>
                                <div className="ios-row" onClick={onRedoCalibration}>
                                    <span>👆 Redo Touch Calibration</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" style={{ minHeight: 'auto', padding: '0.9375rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <div className="ios-setting-group-header" style={{ margin: '0 0 0.625rem 0' }}>Grid Layout</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                            {[ 
                                                { id: 'super-big', label: '🐘 2x2' },
                                                { id: 'big', label: '🦒 3x3' },
                                                { id: 'standard', label: '🐕 4x4' },
                                            ].map(size => (
                                                <button
                                                    key={size.id}
                                                    onClick={() => onUpdateGridSize(size.id)}
                                                    style={{
                                                        height: '2.75rem',
                                                        background: gridSize === size.id ? 'var(--primary)' : '#E5E5EA',
                                                        color: gridSize === size.id ? 'white' : 'black',
                                                        borderRadius: '0.625rem',
                                                        border: 'none',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    {size.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Speech & Sound</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" style={{ padding: '0.9375rem', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>🎭 Voice Presets</span>
                                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                        {VOICE_PRESETS.map(preset => (
                                            <button
                                                key={preset.id}
                                                onClick={() => applyPreset(preset)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    fontSize: '0.75rem',
                                                    background: (voiceSettings.pitch === preset.pitch && voiceSettings.rate === preset.rate) ? 'var(--primary)' : '#E5E5EA',
                                                    color: (voiceSettings.pitch === preset.pitch && voiceSettings.rate === preset.rate) ? 'var(--primary-text)' : 'black',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="ios-row" style={{ padding: '0.9375rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem' }}>🗣️ Speed (Rate)</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{voiceSettings.rate}x</span>
                                        </div>
                                        <input
                                            type="range" min="0.1" max="2.0" step="0.1"
                                            value={voiceSettings.rate}
                                            onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                                            style={{ width: '100%', height: '2.75rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="ios-row" style={{ padding: '0.9375rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem' }}>🎼 Pitch</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{voiceSettings.pitch || 1}x</span>
                                        </div>
                                        <input
                                            type="range" min="0.1" max="2.0" step="0.1"
                                            value={voiceSettings.pitch || 1}
                                            onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                                            style={{ width: '100%', height: '2.75rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="ios-row" style={{ padding: '0.9375rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem' }}>🔊 Volume</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{Math.round((voiceSettings.volume || 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={voiceSettings.volume || 1}
                                            onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, volume: parseFloat(e.target.value) })}
                                            style={{ width: '100%', height: '2.75rem' }}
                                        />
                                    </div>
                                </div>
                                <div className="ios-row">
                                    <span>🌐 Language</span>
                                    <select
                                        value={selectedLang}
                                        onChange={(e) => setSelectedLang(e.target.value)}
                                        style={{ border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#007AFF', textAlign: 'right' }}
                                    >
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>
                                                {lang === 'en' ? '🇺🇸 English' : 
                                                 lang === 'es' ? '🇪🇸 Spanish' : 
                                                 lang === 'fr' ? '🇫🇷 French' : 
                                                 lang === 'de' ? '🇩🇪 German' : 
                                                 lang === 'it' ? '🇮🇹 Italian' : 
                                                 lang === 'pt' ? '🇵🇹 Portuguese' :
                                                 lang.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ios-row">
                                    <span>🗣️ Voice</span>
                                    <select
                                        value={voiceSettings.voiceURI || ''}
                                        onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, voiceURI: e.target.value })}
                                        style={{ border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#007AFF', textAlign: 'right', maxWidth: '11.25rem' }}
                                    >
                                        <option value="">Default Natural</option>
                                        {Array.from(new Set(filteredVoices.map(v => v.lang))).sort().map(lang => (
                                            <optgroup key={lang} label={lang}>
                                                {filteredVoices.filter(v => v.lang === lang).map(v => (
                                                    <option key={v.voiceURI} value={v.voiceURI}>
                                                        {(v.name.includes('Enhanced') || v.name.includes('Premium') || v.name.includes('Siri')) ? '✨ ' : ''}
                                                        {v.name.replace(/System |Apple |Microsoft |\(Enhanced\)|Premium /g, '').trim()}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                {isIOS && (
                                    <div className="ios-row" style={{ minHeight: 'auto', padding: '0.5rem 0.9375rem' }}>
                                        <p style={{ fontSize: '0.625rem', color: '#8E8E93', margin: 0 }}>
                                            💡 Tip: Download "Enhanced" voices in iOS Settings → Accessibility → Spoken Content → Voices for better quality.
                                        </p>
                                    </div>
                                )}
                                <div className="ios-row" onClick={testVoice}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>▶️ Test Voice Preview</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={() => setShowPronunciationEditor(true)}>
                                    <span style={{ color: '#5856D6', fontWeight: 600 }}>📖 Pronunciation Editor</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={() => onUpdateAutoSpeak(!autoSpeak)}>
                                    <span>🗣️ Auto-Speak on Tap</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: autoSpeak ? '#34C759' : '#8E8E93' }}>
                                            {autoSpeak ? 'On' : 'Off'}
                                        </span>
                                        <div style={{ 
                                            width: '51px', 
                                            height: '31px', 
                                            background: autoSpeak ? '#34C759' : '#E5E5EA', 
                                            borderRadius: '15.5px', 
                                            position: 'relative',
                                            transition: 'background 0.2s'
                                        }}>
                                            <div style={{ 
                                                width: '27px', 
                                                height: '27px', 
                                                background: 'white', 
                                                borderRadius: '50%', 
                                                position: 'absolute', 
                                                top: '2px', 
                                                left: autoSpeak ? '22px' : '2px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                                            }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="ios-row" style={{ padding: '0.9375rem' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem' }}>⏱️ Repetition Delay</span>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{speechDelay}s</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="15" step="1"
                                            value={speechDelay}
                                            onChange={(e) => onUpdateSpeechDelay(parseInt(e.target.value, 10))}
                                            style={{ width: '100%', height: '2.75rem' }}
                                        />
                                        <p style={{ fontSize: '0.6875rem', color: '#888', margin: '0.3125rem 0 0 0' }}>
                                            Time before the same word can be spoken again.
                                        </p>
                                    </div>
                                </div>
                                <div className="ios-row">
                                    <span>🔔 Attention Bell</span>
                                    <select
                                        value={bellSound}
                                        onChange={(e) => {
                                            onUpdateBellSound(e.target.value);
                                            playBellSound(e.target.value);
                                        }}
                                        style={{ border: 'none', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#007AFF', textAlign: 'right' }}
                                    >
                                        {BELL_SOUNDS.map(sound => (
                                            <option key={sound.id} value={sound.id}>{sound.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Appearance</div>
                            <div className="ios-setting-card" style={{ padding: '0.9375rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                                    {COLOR_THEMES.map(theme => (
                                        <div 
                                            key={theme.id}
                                            onClick={async () => {
                                                if (theme.premium && colorTheme !== theme.id) {
                                                    try {
                                                        const { checkColorThemeAccess } = await import('../utils/paywall');
                                                        const hasAccess = await checkColorThemeAccess();
                                                        if (hasAccess) onSetColorTheme(theme.id);
                                                    } catch (error) {
                                                        console.error('Failed to check theme access:', error);
                                                        onSetColorTheme(theme.id); // Continue anyway
                                                    }
                                                } else onSetColorTheme(theme.id);
                                            }}
                                            style={{
                                                height: '3.75rem',
                                                borderRadius: '0.75rem',
                                                border: colorTheme === theme.id ? '0.125rem solid #007AFF' : '0.0625rem solid #ddd',
                                                background: theme.bg,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.25rem' }}>{theme.icon}</span>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 700 }}>{theme.label}</span>
                                            {theme.premium && <span style={{ position: 'absolute', top: 2, right: 2, fontSize: '0.625rem' }}>👑</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Advanced</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={() => setShowBackupRestore(true)}>
                                    <span>💾 Backup & Restore All Data</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={onReset}>
                                    <span style={{ color: '#FF3B30', fontWeight: 600 }}>Reset All Data</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Tab */}
                    {activeTab === 'data' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -1.5rem', padding: '0 1.5rem 1.5rem', flex: 1 }}>
                            
                            <div className="ios-setting-group-header">Overview</div>
                            <div className="ios-setting-card" style={{ padding: '0.9375rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                                    <div style={{ background: '#F2F2F7', padding: '0.625rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.25rem' }}>{STAGES[Math.floor(currentLevel)]?.icon || '📱'}</div>
                                        <div style={{ fontSize: '0.625rem', color: '#666', marginTop: '0.25rem', fontWeight: 700 }}>Level {Math.floor(currentLevel)}</div>
                                    </div>
                                    <div style={{ background: '#F2F2F7', padding: '0.625rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#007AFF' }}>{rootItems.length}</div>
                                        <div style={{ fontSize: '0.625rem', color: '#666', marginTop: '0.25rem', fontWeight: 700 }}>Icons</div>
                                    </div>
                                    <div style={{ background: '#F2F2F7', padding: '0.625rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#34C759' }}>
                                            {Object.values(progressData || {}).reduce((acc, curr) => acc + (curr.totalUses || 0), 0) || 0}
                                        </div>
                                        <div style={{ fontSize: '0.625rem', color: '#666', marginTop: '0.25rem', fontWeight: 700 }}>Total Taps</div>
                                    </div>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Actions</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={() => setShowFavoritesPicker(true)}>
                                    <span style={{ color: '#FF9500', fontWeight: 600 }}>⭐ Add More Favorites</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={onToggleDashboard}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>📊 View Progress Dashboard</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={onStartTraining}>
                                    <span style={{ color: '#5856D6', fontWeight: 600 }}>🧠 Training Mode</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Billing & Info</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={handleCustomerCenter}>
                                    <span style={{ color: '#007AFF', fontWeight: 600 }}>⚙️ Manage Subscription</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={handleRestore}>
                                    <span>{isRestoring ? 'Restoring...' : 'Restore Purchases'}</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={() => window.open('/privacy.html', '_blank')}>
                                    <span>Privacy Policy</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" onClick={() => window.open('/terms.html', '_blank')}>
                                    <span>Terms of Use</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>
                            
                            <p style={{ fontSize: '0.625rem', color: '#999', textAlign: 'center', marginTop: '0.625rem' }}>
                                © 2024 Behavior School LLC. All rights reserved.
                            </p>
                        </div>
                    )}

                </div>

                {/* Training Panel */}
                <div id="training-panel" style={{ display: isTrainingMode ? 'flex' : 'none' }}>
                    <h3 style={{ margin: 0, textAlign: 'center' }}>Select 2+ items</h3>
                    <div className="input-row">
                        <button className="primary" onClick={onShuffle}>🔀 Shuffle</button>
                        <button onClick={onStopTraining}>Done</button>
                    </div>
                </div>

            </div>

            {showGuidedAccess && (
                <GuidedAccessModal
                    onClose={() => {
                        setShowGuidedAccess(false);
                        onToggleLock(); // Lock the app after they see the instructions
                    }}
                />
            )}

            {showFavoritesPicker && (
                <FavoritesPickerModal
                    onClose={() => setShowFavoritesPicker(false)}
                    onAddFavorites={(favorites) => {
                        if (onAddFavorites) {
                            onAddFavorites(favorites);
                        }
                    }}
                    existingFavorites={[]} // We'll pass this from App
                />
            )}

            {showPronunciationEditor && (
                <PronunciationEditor
                    onClose={() => setShowPronunciationEditor(false)}
                />
            )}

            {showBackupRestore && (
                <BackupRestore
                    isOpen={showBackupRestore}
                    onClose={() => setShowBackupRestore(false)}
                />
            )}
        </div>
    );
};

export default Controls;