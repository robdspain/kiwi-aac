import React, { useState } from 'react';

const Controls = ({
    isEditMode,
    isTrainingMode,
    currentPhase,
    showStrip,
    skinTone,
    currentContext,
    contexts,
    onSetContext,
    onAddContext,
    onRenameContext,
    onDeleteContext,
    onSetSkinTone,
    onToggleMenu,
    onAddItem,
    onToggleStrip,
    onSetPhase,
    onStartTraining,
    onReset,
    onShuffle,
    onStopTraining,
    onOpenPicker,
    onToggleEssentialMode,
    onToggleDashboard,
    isPrompted,
    onSetPrompted,
    onToggleLock,
    voiceSettings,
    onUpdateVoiceSettings,
    gridSize,
    onUpdateGridSize
}) => {

    const [newWord, setNewWord] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [newType, setNewType] = useState('button');
    const [availableVoices, setAvailableVoices] = useState([]);

    React.useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Filter for English voices or current locale to keep it clean
            setAvailableVoices(voices.filter(v => v.lang.startsWith('en')));
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const handleAdd = () => {
        if (!newWord || !newIcon) {
            alert("Missing info");
            return;
        }
        onAddItem(newWord, newIcon, newType);
        setNewWord('');
        setNewIcon('');
    };

    const phases = [
        { id: 0, label: "Normal Mode", icon: "📱" },
        { id: 1, label: "Level 1: Physical Exchange", icon: "🤝" },
        { id: 2, label: "Level 2: Getting Attention", icon: "🔔" },
        { id: 3, label: "Level 3: Picture Selection", icon: "🍱" },
        { id: 4, label: "Level 4: Sentence Building", icon: "🏗️" },
        { id: 5, label: "Level 5: Answering Questions", icon: "❓" },
        { id: 6, label: "Level 6: Commenting", icon: "💬" }
    ];

    return (
        <div id="controls" className={isEditMode || isTrainingMode ? '' : 'collapsed'}>
            <div className="drag-handle"></div>
            <div id="parent-header" onClick={onToggleMenu}>
                <span>Adult Settings</span>
                <span id="menu-arrow">{isEditMode || isTrainingMode ? 'Hide ▼' : 'Show ▲'}</span>
            </div>

            {/* Edit Panel */}
            <div id="edit-panel" style={{ display: (isEditMode && !isTrainingMode) ? 'flex' : 'none' }}>
                {/* Prominent Lock Button at top */}
                <button
                    onClick={onToggleLock}
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
                    🔒 Lock for Child Use
                </button>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <button className="primary" style={{ flex: 1 }} onClick={() => onAddItem('', '', 'button')}>+ Add Button</button>
                    <button className="primary" style={{ flex: 1, background: '#34C759' }} onClick={() => onAddItem('', '', 'folder')}>+ Add Folder</button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
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
                                } catch (err) { alert("Invalid JSON"); }
                            };
                            reader.readAsText(file);
                        };
                        input.click();
                    }}>📤 Import Layout</button>
                </div>

                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>Communication Level</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {phases.map(p => (
                            <button
                                key={p.id}
                                onClick={() => onSetPhase(p.id)}
                                style={{
                                    padding: '8px 4px',
                                    fontSize: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: currentPhase === p.id ? 'var(--primary)' : '#E5E5EA',
                                    color: currentPhase === p.id ? 'white' : 'black',
                                    borderRadius: '10px'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>{p.icon}</span>
                                <span>{p.id === 0 ? "Off" : p.id}</span>
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                        {phases.find(p => p.id === currentPhase)?.label}
                    </p>
                </div>

                {/* Context/Location Selector */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                            style={{ padding: '4px 10px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '12px' }}
                        >
                            + New
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
                        {isEditMode ? "Tap ✎ to rename or × to delete" : "Each location has its own set of icons"}
                    </p>
                </div>

                {/* Grid Accessibility */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>📐 Grid Layout</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {[
                            { id: 'auto', label: '📱 Auto' },
                            { id: 'super-big', label: '🐘 Super Big' },
                            { id: 'big', label: '🦒 Big' },
                            { id: 'standard', label: '🐕 Standard' },
                            { id: 'dense', label: '🐜 Dense' },
                        ].map(size => (
                            <button
                                key={size.id}
                                onClick={() => onUpdateGridSize(size.id)}
                                style={{
                                    padding: '10px',
                                    fontSize: '13px',
                                    background: gridSize === size.id ? 'var(--primary)' : '#E5E5EA',
                                    color: gridSize === size.id ? 'white' : 'black',
                                    borderRadius: '10px',
                                    border: 'none'
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

                {/* Trial Type Selector */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>Next Trial Mode</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => onSetPrompted(false)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                background: !isPrompted ? 'var(--primary)' : '#E5E5EA',
                                color: !isPrompted ? 'white' : 'black',
                                border: 'none',
                                fontWeight: !isPrompted ? 'bold' : 'normal'
                            }}
                        >
                            Independent
                        </button>
                        <button
                            onClick={() => onSetPrompted(true)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                background: isPrompted ? '#FF9500' : '#E5E5EA',
                                color: isPrompted ? 'white' : 'black',
                                border: 'none',
                                fontWeight: isPrompted ? 'bold' : 'normal'
                            }}
                        >
                            Prompted
                        </button>
                    </div>
                </div>

                {/* Skin Tone Selector */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>Skin Tone</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                        {[
                            { id: 'default', color: '#FFD700', label: 'Default' }, // Gold for standard emoji
                            { id: 'light', color: '#F7DECE', label: 'Light' },
                            { id: 'mediumLight', color: '#E0C8A9', label: 'Medium-Light' },
                            { id: 'medium', color: '#C29770', label: 'Medium' },
                            { id: 'mediumDark', color: '#976C43', label: 'Medium-Dark' },
                            { id: 'dark', color: '#5C3E2F', label: 'Dark' },
                        ].map(tone => (
                            <button
                                key={tone.id}
                                onClick={() => onSetSkinTone(tone.id)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: skinTone === tone.id ? '3px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
                                    background: tone.color,
                                    padding: 0,
                                    margin: 0,
                                    cursor: 'pointer'
                                }}
                                title={tone.label}
                                aria-label={tone.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Voice Settings */}
                <div style={{ background: 'white', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#333' }}>🗣️ Voice Settings</span>

                    <div>
                        <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Voice</label>
                        <select
                            value={voiceSettings.voiceURI || ''}
                            onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, voiceURI: e.target.value })}
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                        >
                            <option value="">Default System Voice</option>
                            {availableVoices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Speed: {voiceSettings.rate}x</label>
                            <input
                                type="range" min="0.5" max="1.5" step="0.1"
                                value={voiceSettings.rate}
                                onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: parseFloat(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Pitch: {voiceSettings.pitch}</label>
                            <input
                                type="range" min="0.5" max="1.5" step="0.1"
                                value={voiceSettings.pitch}
                                onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const synth = window.speechSynthesis;
                            if (synth.speaking) synth.cancel();
                            const u = new SpeechSynthesisUtterance("Hello, I am your new voice.");
                            u.rate = voiceSettings.rate;
                            u.pitch = voiceSettings.pitch;
                            if (voiceSettings.voiceURI) {
                                const v = synth.getVoices().find(v => v.voiceURI === voiceSettings.voiceURI);
                                if (v) u.voice = v;
                            }
                            synth.speak(u);
                        }}
                        style={{ padding: '8px', background: '#f0f0f0', borderRadius: '8px', border: 'none', fontSize: '12px', cursor: 'pointer' }}
                    >
                        ▶️ Preview Voice
                    </button>
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

                <div className="input-row" style={{ marginTop: '5px' }}>
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
                <div className="input-row">
                    <button className="danger" style={{ flexGrow: 1 }} onClick={onReset}>
                        Reset All
                    </button>
                </div>

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
    );
};

export default Controls;
