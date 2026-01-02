import { useState, useEffect } from 'react';
import GuidedAccessModal from './GuidedAccessModal';
import FavoritesPickerModal from './FavoritesPickerModal';
import CharacterBuilder from './CharacterBuilder';
import Superwall from '../plugins/superwall';
import { STAGES, LEVEL_ORDER, getLevel, getStage } from '../data/levelDefinitions';
import { BELL_SOUNDS, playBellSound } from '../utils/sounds';

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
    triggerPaywall,
    bellSound,
    onUpdateBellSound,
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

    // Detect iOS to show relevant help
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            const result = await Superwall.restore();
            if (result.result === 'restored') {
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
                    <div style={{ marginBottom: '20px' }}>
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
                                width: `calc(${100 / tabs.length}% - 4px)`,
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
                        <div style={{ background: '#F2F2F7', margin: '0 -24px', padding: '0 24px 24px', flex: 1 }}>
                            
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

                            <div className="ios-setting-group-header">Communication Level</div>
                            <div className="ios-setting-card" style={{ padding: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
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
                                                    height: '50px',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '2px',
                                                    background: isActive ? stage.color : '#E5E5EA',
                                                    color: isActive ? 'white' : 'black',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span style={{ fontSize: '18px' }}>{stage.icon}</span>
                                                <span style={{ fontWeight: 700 }}>Stage {stageInt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {currentLevel && (
                                    <div style={{
                                        background: getStage(currentLevel).color + '15',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: `1px solid ${getStage(currentLevel).color}40`
                                    }}>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: getStage(currentLevel).color, marginBottom: '8px', textTransform: 'uppercase' }}>
                                            {getStage(currentLevel).icon} {getStage(currentLevel).name}
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {LEVEL_ORDER.filter(l => Math.floor(l) === Math.floor(currentLevel)).map(lvl => {
                                                const levelDef = getLevel(lvl);
                                                const isSelected = currentLevel === lvl;
                                                return (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => onSetLevel && onSetLevel(lvl)}
                                                        style={{
                                                            minHeight: '36px',
                                                            padding: '0 12px',
                                                            fontSize: '11px',
                                                            background: isSelected ? getStage(currentLevel).color : 'white',
                                                            color: isSelected ? 'white' : '#333',
                                                            borderRadius: '8px',
                                                            border: isSelected ? 'none' : '1px solid #ddd',
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
                                    <div style={{ marginTop: '15px', padding: '12px', background: 'linear-gradient(135deg, #FFF5E1, #FFE4B5)', borderRadius: '10px', border: '1px solid #FFA500' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#D2691E', marginBottom: '8px', textTransform: 'uppercase' }}>
                                            🎯 Choose Target Icon
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
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
                                                            minWidth: '50px',
                                                            height: '50px',
                                                            padding: '4px',
                                                            borderRadius: '10px',
                                                            background: isSelected ? 'var(--primary)' : 'white',
                                                            border: isSelected ? '2px solid #007AFF' : '1px solid #DDD',
                                                            fontSize: '1.2rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.2s',
                                                            boxShadow: isSelected ? '0 2px 6px rgba(0,122,255,0.3)' : 'none'
                                                        }}
                                                    >
                                                        <span>{typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? '🖼️' : item.icon}</span>
                                                        <span style={{ fontSize: '8px', fontWeight: '700', color: isSelected ? 'white' : '#666', overflow: 'hidden', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.word}</span>
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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '20px' }}>{ctx.icon}</span>
                                            <span style={{ fontWeight: currentContext === ctx.id ? 700 : 400 }}>{ctx.label}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newLabel = prompt("Rename location:", ctx.label);
                                                    if (newLabel) onRenameContext(ctx.id, newLabel, ctx.icon);
                                                }}
                                                style={{ border: 'none', background: '#F2F2F7', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}
                                            >✎</button>
                                            {contexts.length > 1 && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteContext(ctx.id);
                                                    }}
                                                    style={{ border: 'none', background: '#FFE5E5', color: '#FF3B30', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}
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
                        <div style={{ background: '#F2F2F7', margin: '0 -24px', padding: '24px', flex: 1 }}>
                            <div className="ios-setting-group-header">Custom Avatars</div>
                            <div className="ios-setting-card" style={{ padding: '5px' }}>
                                <CharacterBuilder
                                    isTab={true}
                                    triggerPaywall={triggerPaywall}
                                    onSelect={(url, config) => {
                                        onAddItem(config.name || 'Me', url, 'button');
                                        alert(`${config.name || 'Character'} added to your library!`);
                                        setActiveTab('basic');
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Extra Settings Tab */}
                    {activeTab === 'advanced' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -24px', padding: '0 24px 24px', flex: 1 }}>
                            
                            <div className="ios-setting-group-header">Accessibility</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={onRedoCalibration}>
                                    <span>👆 Redo Touch Calibration</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                                <div className="ios-row" style={{ minHeight: 'auto', padding: '15px' }}>
                                    <div style={{ width: '100%' }}>
                                        <div className="ios-setting-group-header" style={{ margin: '0 0 10px 0' }}>Grid Layout</div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                            {[ 
                                                { id: 'super-big', label: '🐘 2x2' },
                                                { id: 'big', label: '🦒 3x3' },
                                                { id: 'standard', label: '🐕 4x4' },
                                            ].map(size => (
                                                <button
                                                    key={size.id}
                                                    onClick={() => onUpdateGridSize(size.id)}
                                                    style={{
                                                        height: '44px',
                                                        background: gridSize === size.id ? 'var(--primary)' : '#E5E5EA',
                                                        color: gridSize === size.id ? 'white' : 'black',
                                                        borderRadius: '10px',
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
                                <div className="ios-row" style={{ padding: '15px' }}>
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '14px' }}>🗣️ Speaking Speed</span>
                                            <span style={{ fontSize: '14px', fontWeight: 700 }}>{voiceSettings.rate}x</span>
                                        </div>
                                        <input
                                            type="range" min="0.5" max="1.5" step="0.1"
                                            value={voiceSettings.rate}
                                            onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                                            style={{ width: '100%', height: '44px' }}
                                        />
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
                                        style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 600, color: '#007AFF', textAlign: 'right' }}
                                    >
                                        {BELL_SOUNDS.map(sound => (
                                            <option key={sound.id} value={sound.id}>{sound.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Appearance</div>
                            <div className="ios-setting-card" style={{ padding: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {COLOR_THEMES.map(theme => (
                                        <div 
                                            key={theme.id}
                                            onClick={async () => {
                                                if (theme.premium && colorTheme !== theme.id) {
                                                    try {
                                                        const result = await Superwall.register({ event: 'colorThemes' });
                                                        if (result.result === 'userIsSubscribed' || result.result === 'noRuleMatch') onSetColorTheme(theme.id);
                                                    } catch { onSetColorTheme(theme.id); }
                                                } else onSetColorTheme(theme.id);
                                            }}
                                            style={{
                                                height: '60px',
                                                borderRadius: '12px',
                                                border: colorTheme === theme.id ? '2px solid #007AFF' : '1px solid #ddd',
                                                background: theme.bg,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ fontSize: '20px' }}>{theme.icon}</span>
                                            <span style={{ fontSize: '10px', fontWeight: 700 }}>{theme.label}</span>
                                            {theme.premium && <span style={{ position: 'absolute', top: 2, right: 2, fontSize: '10px' }}>👑</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="ios-setting-group-header">Advanced</div>
                            <div className="ios-setting-card">
                                <div className="ios-row" onClick={() => setShowAdvanced(!showAdvanced)}>
                                    <span>📂 Layout Export/Import</span>
                                    <span className="ios-chevron">{showAdvanced ? '▾' : '›'}</span>
                                </div>
                                {showAdvanced && (
                                    <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                        <button className="primary-button" style={{ flex: 1, padding: '10px', fontSize: '12px' }} onClick={() => {
                                            const data = localStorage.getItem('kians-words-ios');
                                            const blob = new Blob([data], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url; a.download = 'kiwi-layout.json'; a.click();
                                        }}>Export</button>
                                        <button className="primary-button" style={{ flex: 1, padding: '10px', fontSize: '12px', background: '#5856D6' }} onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file'; input.accept = '.json';
                                            input.onchange = (e) => {
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onload = (re) => {
                                                    try {
                                                        const json = JSON.parse(re.target.result);
                                                        localStorage.setItem('kians-words-ios', JSON.stringify(json));
                                                        window.location.reload();
                                                    } catch { alert("Invalid JSON"); }
                                                };
                                                reader.readAsText(file);
                                            };
                                            input.click();
                                        }}>Import</button>
                                    </div>
                                )}
                                <div className="ios-row" onClick={onReset}>
                                    <span style={{ color: '#FF3B30', fontWeight: 600 }}>Reset All Data</span>
                                    <span className="ios-chevron">›</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Tab */}
                    {activeTab === 'data' && (
                        <div style={{ background: '#F2F2F7', margin: '0 -24px', padding: '0 24px 24px', flex: 1 }}>
                            
                            <div className="ios-setting-group-header">Overview</div>
                            <div className="ios-setting-card" style={{ padding: '15px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '20px' }}>{STAGES[Math.floor(currentLevel)]?.icon || '📱'}</div>
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', fontWeight: 700 }}>Level {Math.floor(currentLevel)}</div>
                                    </div>
                                    <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007AFF' }}>{rootItems.length}</div>
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', fontWeight: 700 }}>Icons</div>
                                    </div>
                                    <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34C759' }}>
                                            {Object.values(progressData || {}).reduce((acc, curr) => acc + (curr.totalUses || 0), 0) || 0}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', fontWeight: 700 }}>Total Taps</div>
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
                            
                            <p style={{ fontSize: '10px', color: '#999', textAlign: 'center', marginTop: '10px' }}>
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
        </div>
    );
};

export default Controls;