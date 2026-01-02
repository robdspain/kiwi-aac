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

                {/* Edit Panel */}                <div id="edit-panel" style={{ display: (isEditMode && !isTrainingMode) ? 'flex' : 'none' }}>
                    {/* Prominent Lock Button at top */}                    <button
                        onClick={handleLock}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        🔒 Lock App for Child
                    </button>

                    {/* Guided Access Help Button */}                    {isIOS && (
                        <button
                            onClick={() => setShowGuidedAccess(true)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(88, 86, 214, 0.1)',
                                color: '#5856D6',
                                border: '2px solid rgba(88, 86, 214, 0.3)',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            ℹ️ How to Use Guided Access
                        </button>
                    )}

                    {/* Tab Navigation */}                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '15px',
                        background: '#F2F2F7',
                        padding: '4px',
                        borderRadius: '10px'
                    }}>
                        {[ 
                            { id: 'basic', label: '⚡ Basic', icon: '⚡' },
                            { id: 'character', label: '✨ Character', icon: '✨' },
                            { id: 'advanced', label: '⚙️ Advanced', icon: '⚙️' },
                            { id: 'data', label: '📊 Data', icon: '📊' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? '#007AFF' : '#666',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Basic Tab */}                    {activeTab === 'basic' && (<>                        <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                            <button 
                                className="primary" 
                                style={{ flex: 1 }}
                                onClick={() => onOpenPicker((word, icon) => {
                                    onAddItem(word, icon, 'button');
                                })}
                            >
                                + Add Icon
                            </button>
                            <button className="primary" style={{ flex: 1, background: '#34C759' }} onClick={() => onAddItem('', '', 'folder')}>+ Add Folder</button>
                        </div>

                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>Communication Level</span>

                            {/* Stage Selector */}                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {Object.entries(STAGES).map(([stageNum, stage]) => {
                                    const stageInt = parseInt(stageNum);
                                    const isActive = Math.floor(currentLevel) === stageInt;
                                    return (
                                        <button
                                            key={stageNum}
                                            onClick={() => {
                                                // Find first level of this stage
                                                const firstLevel = LEVEL_ORDER.find(l => Math.floor(l) === stageInt);
                                                if (firstLevel && onSetLevel) onSetLevel(firstLevel);
                                            }}
                                            style={{
                                                padding: '8px 4px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px',
                                                background: isActive ? stage.color : '#E5E5EA',
                                                color: isActive ? 'white' : 'black',
                                                borderRadius: '10px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ fontSize: '18px' }}>{stage.icon}</span>
                                            <span>{stageInt}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sub-level Selector for current stage */}                            {currentLevel && (
                                <div style={{
                                    background: getStage(currentLevel).color + '15',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: `2px solid ${getStage(currentLevel).color}40`
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: getStage(currentLevel).color,
                                        marginBottom: '8px'
                                    }}>
                                        {getStage(currentLevel).icon} Stage {Math.floor(currentLevel)}: {getStage(currentLevel).name}
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
                                                        padding: '8px 12px',
                                                        fontSize: '11px',
                                                        background: isSelected ? getStage(currentLevel).color : 'white',
                                                        color: isSelected ? 'white' : '#333',
                                                        borderRadius: '8px',
                                                        border: isSelected ? 'none' : '1px solid #ddd',
                                                        cursor: 'pointer',
                                                        fontWeight: isSelected ? 600 : 400
                                                    }}
                                                    title={levelDef.description}
                                                >
                                                    {lvl} {levelDef.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                                {getLevel(currentLevel)?.description}
                            </p>

                            {/* Quick swap for Level 1 */}                            {currentPhase === 1 && (
                                <div style={{ marginTop: '10px', padding: '12px', background: 'linear-gradient(135deg, #FFF5E1, #FFE4B5)', borderRadius: '10px', border: '2px solid #FFA500' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#D2691E', display: 'block', marginBottom: '5px' }}>
                                        🎯 Choose Target Icon
                                    </label>
                                    <p style={{ fontSize: '11px', color: '#666', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                                        Select which item your child will practice requesting. This icon will appear on the screen during Level 1 training.
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                                        {rootItems.filter(i => {
                                            // Only show these 5 essential icons for Level 1
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
                                                        minWidth: '60px',
                                                        height: '60px',
                                                        padding: '8px',
                                                        borderRadius: '12px',
                                                        background: isSelected ? 'var(--primary)' : 'white',
                                                        border: isSelected ? '3px solid #007AFF' : '2px solid #DDD',
                                                        fontSize: '1.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                                        transition: 'all 0.2s',
                                                        boxShadow: isSelected ? '0 4px 8px rgba(0,122,255,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                                                    }}
                                                    title={item.word}
                                                >
                                                    <span>{typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? '🖼️' : item.icon}</span>
                                                    <span style={{ fontSize: '9px', fontWeight: '600', color: isSelected ? 'white' : '#666', overflow: 'hidden', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{item.word}</span>
                                                    {isSelected && <span style={{ fontSize: '10px', color: 'white', marginTop: '2px' }}>✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Context/Location Selector */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#333' }}>📍 Locations</span>
                                <button
                                    onClick={() => {
                                        const label = prompt("Location Name (e.g. Playground)");
                                        if (label) {
                                            onOpenPicker((w, icon) => {
                                                onAddContext(label, icon);
                                            }, true);
                                        }
                                    }}
                                    style={{
                                        padding: '4px 10px',
                                        background: contexts?.length >= 5 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {contexts?.length >= 5 ? '👑 + New' : '+ New'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {contexts && contexts.map(ctx => (
                                    <div key={ctx.id} style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => onSetContext(ctx.id)}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                background: currentContext === ctx.id ? 'var(--primary)' : '#E5E5EA',
                                                color: currentContext === ctx.id ? 'white' : 'black',
                                                borderRadius: '10px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>{ctx.icon}</span>
                                            <span>{ctx.label}</span>
                                        </button>
                                        {isEditMode && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newLabel = prompt("Rename location:", ctx.label);
                                                    if (newLabel) {
                                                        onRenameContext(ctx.id, newLabel, ctx.icon);
                                                    }
                                                }}
                                                style={{
                                                    position: 'absolute', top: '-5px', right: '-5px',
                                                    background: '#fff', borderRadius: '50%', width: '15px', height: '15px',
                                                    fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)', border: '1px solid #ddd'
                                                }}
                                            >
                                                ✎
                                            </div>
                                        )}
                                        {isEditMode && contexts.length > 1 && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteContext(ctx.id);
                                                }}
                                                style={{
                                                    position: 'absolute', bottom: '-5px', right: '-5px',
                                                    background: '#fff', borderRadius: '50%', width: '15px', height: '15px',
                                                    fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)', border: '1px solid #ddd', color: 'red'
                                                }}
                                            >
                                                ×
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                                {contexts?.length >= 5
                                    ? `📍 ${contexts?.length}/5 locations (Premium for unlimited)`
                                    : `📍 ${contexts?.length || 0}/5 free locations`}
                            </p>
                        </div>

                        {/* Grid Accessibility */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>📐 Grid Layout</span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {[ 
                                    { id: 'super-big', label: '🐘 2x2\nLarge', description: '4 items' },
                                    { id: 'big', label: '🦒 3x3\nMedium', description: '9 items' },
                                    { id: 'standard', label: '🐕 4x4\nStandard', description: '16 items' },
                                ].map(size => (
                                    <button
                                        key={size.id}
                                        onClick={() => onUpdateGridSize(size.id)}
                                        style={{
                                            padding: '12px 8px',
                                            fontSize: '13px',
                                            background: gridSize === size.id ? 'var(--primary)' : '#E5E5EA',
                                            color: gridSize === size.id ? 'white' : 'black',
                                            borderRadius: '10px',
                                            border: 'none',
                                            whiteSpace: 'pre-line',
                                            lineHeight: '1.3'
                                        }}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                            {gridSize === 'super-big' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                                    <input
                                        type="checkbox"
                                        checked={localStorage.getItem('kiwi-force-strip') === 'true'}
                                        onChange={(e) => {
                                            localStorage.setItem('kiwi-force-strip', e.target.checked);
                                            window.dispatchEvent(new Event('storage')); // Simple hack to force refresh
                                            location.reload(); // Safer for this complexity
                                        }}
                                    />
                                    <span style={{ fontSize: '11px', color: '#666' }}>Force sentence strip in Super Big mode</span>
                                </div>
                            )}
                        </div>


                        {/* Voice Settings */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>🗣️ Voice Settings</span>

                            <div>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Speed: {voiceSettings.rate}x</label>
                                <input
                                    type="range" min="0.5" max="1.5" step="0.1"
                                    value={voiceSettings.rate}
                                    onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        {/* Bell Sound Settings */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>🔔 Attention Bell Sound</span>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                <select
                                    value={bellSound}
                                    onChange={(e) => {
                                        onUpdateBellSound(e.target.value);
                                        playBellSound(e.target.value); // Preview the sound
                                    }}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: '1px solid #DDD',
                                        fontSize: '14px',
                                        background: '#F9F9F9'
                                    }}
                                >
                                    {BELL_SOUNDS.map(sound => (
                                        <option key={sound.id} value={sound.id}>
                                            {sound.name}
                                        </option>
                                    ))}
                                </select>
                                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                                    This sound is played when the child uses the bell to get attention in Level 2.
                                </p>
                            </div>
                        </div>

                        {currentPhase === 5 && (
                            <div className="input-row">
                                <button className="primary" style={{ flexGrow: 1, background: '#FF9500' }} onClick={() => {
                                    const synth = window.speechSynthesis;
                                    const u = new SpeechSynthesisUtterance("What do you want?");
                                    u.rate = 0.8;
                                    synth.speak(u);
                                }}>
                                    🗣️ Play Question Prompt
                                </button>
                            </div>
                        )}
                    </>)}

                    {/* Character Tab */}                    {activeTab === 'character' && (
                        <div style={{ padding: '5px' }}>
                            <CharacterBuilder
                                isTab={true}
                                triggerPaywall={triggerPaywall}
                                onSelect={(url, config) => {
                                    onAddItem(config.name || 'Me', url, 'button');
                                    alert(`${config.name || 'Character'} added to your library! You can find it in the Home screen.`);
                                    setActiveTab('basic');
                                }}
                            />
                        </div>
                    )}

                    {/* Advanced Tab */}                    {activeTab === 'advanced' && (<>                        <div className="input-row">
                            <button
                                style={{ flexGrow: 1, background: '#E5E5EA', color: '#007AFF' }}
                                onClick={() => {
                                    onToggleMenu(); // Close settings
                                    onRedoCalibration();
                                }}
                            >
                                👆 Redo Touch Calibration
                            </button>
                        </div>

                        {/* Color Theme Selector - Premium Feature */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#333' }}>🎨 Color Theme</span>
                                <span style={{ fontSize: '11px', color: '#999' }}>👑 Premium</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {COLOR_THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={async () => {
                                            if (theme.premium && colorTheme !== theme.id) {
                                                try {
                                                    const result = await Superwall.register({ event: 'colorThemes' });
                                                    if (result.result === 'userIsSubscribed' || result.result === 'noRuleMatch') {
                                                        onSetColorTheme(theme.id);
                                                    }
                                                } catch (error) {
                                                    console.error('Paywall error:', error);
                                                    onSetColorTheme(theme.id);
                                                }
                                            } else {
                                                onSetColorTheme(theme.id);
                                            }
                                        }}
                                        style={{
                                            padding: '10px 8px',
                                            borderRadius: '12px',
                                            border: colorTheme === theme.id ? '3px solid #007AFF' : '2px solid rgba(0,0,0,0.1)',
                                            background: `linear-gradient(135deg, ${theme.bg} 60%, ${theme.primary}40 100%)`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transform: colorTheme === theme.id ? 'scale(1.02)' : 'scale(1)',
                                            transition: 'all 0.2s',
                                            boxShadow: colorTheme === theme.id ? '0 4px 12px rgba(0,122,255,0.25)' : 'none'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.5rem' }}>{theme.icon}</span>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#333' }}>{theme.label}</span>
                                        {theme.premium && colorTheme !== theme.id && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-6px',
                                                fontSize: '12px'
                                            }}>👑</span>
                                        )}
                                        {colorTheme === theme.id && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-6px',
                                                background: '#007AFF',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Settings Collapsible */}                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#F2F2F7',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    color: '#666',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span>📂 Export/Import Data</span>
                                <span>{showAdvanced ? '▼' : '▶'}</span>
                            </button>

                            {showAdvanced && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button style={{ flex: 1, fontSize: '13px' }} onClick={() => {
                                        const data = localStorage.getItem('kians-words-ios');
                                        const blob = new Blob([data], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'kiwi-layout.json';
                                        a.click();
                                    }}>📂 Export Layout</button>
                                    <button style={{ flex: 1, fontSize: '13px' }} onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.json';
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
                                    }}>📤 Import Layout</button>
                                </div>
                            )}
                        </div>

                        {isIOS && (
                            <div className="input-row">
                                <button
                                    style={{ flexGrow: 1, background: '#E5E5EA', color: '#007AFF', fontSize: '0.9rem' }}
                                    onClick={() => setShowGuidedAccess(true)}
                                >
                                    📱 How to Lock Screen (iOS)
                                </button>
                            </div>
                        )}

                        <div className="input-row">
                            <button className="danger" style={{ flexGrow: 1 }} onClick={onReset}>
                                Reset All
                            </button>
                        </div>
                    </>)}

                    {/* Data Tab */}                    {activeTab === 'data' && (<>                        {/* Stats Overview */}                        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 600, color: '#333' }}>📊 Child&apos;s Progress</span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px' }}>{STAGES[Math.floor(currentLevel)]?.icon || '📱'}</div>
                                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Level {Math.floor(currentLevel)}</div>
                                </div>
                                <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007AFF' }}>{rootItems.length}</div>
                                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Icons</div>
                                </div>
                                <div style={{ background: '#F2F2F7', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#34C759' }}>
                                        {/* Simple total interaction count derived from progress data if available, else a placeholder */}                                        {Object.values(progressData || {}).reduce((acc, curr) => acc + (curr.totalUses || 0), 0) || 0}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Total Taps</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <button
                                style={{
                                    width: '100%',
                                    fontSize: '13px',
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: '600',
                                    padding: '12px',
                                    borderRadius: '12px'
                                }}
                                onClick={() => setShowFavoritesPicker(true)}
                            >
                                ⭐ Add More Favorites
                            </button>
                        </div>

                        <div className="input-row" style={{ marginTop: '10px' }}>
                            <button className="primary" style={{ flexGrow: 1, background: '#007AFF' }} onClick={onToggleDashboard}>
                                📊 View Progress Dashboard
                            </button>
                        </div>
                        <div className="input-row">
                            <button className="primary" style={{ flexGrow: 1, background: '#5856D6' }} onClick={onStartTraining}>
                                🧠 Training Mode
                            </button>
                        </div>
                        <div className="input-row">
                            <button style={{ flexGrow: 1, background: '#34C759', color: 'white' }} onClick={onToggleLock}>
                                🔒 Enable Child Mode
                            </button>
                        </div>
                    </>)}

                    {/* Compliance Section */}                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: '#f8f8f8',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <span style={{ fontWeight: 600, color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>Subscription & Legal</span>

                        <button
                            onClick={handleRestore}
                            disabled={isRestoring}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}
                        >
                            {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '5px' }}>
                            <a href="/privacy.html" target="_blank" style={{ fontSize: '12px', color: '#007AFF', textDecoration: 'none' }}>Privacy Policy</a>
                            <a href="/terms.html" target="_blank" style={{ fontSize: '12px', color: '#007AFF', textDecoration: 'none' }}>Terms of Use</a>
                        </div>

                        <p style={{ fontSize: '10px', color: '#999', textAlign: 'center', margin: 0 }}>
                            © 2024 Behavior School LLC. All rights reserved.
                        </p>
                    </div>

                </div>

                {/* Training Panel */}                <div id="training-panel" style={{ display: isTrainingMode ? 'flex' : 'none' }}>
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