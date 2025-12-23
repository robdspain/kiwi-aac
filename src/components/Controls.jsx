import React, { useState } from 'react';

const Controls = ({
    isEditMode,
    isTrainingMode,
    currentPhase,
    showStrip,
    skinTone,
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
    onToggleLock
}) => {

    const [newWord, setNewWord] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [newType, setNewType] = useState('button');

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
                <span>Parent Settings</span>
                <span id="menu-arrow">{isEditMode || isTrainingMode ? 'Hide ▼' : 'Show ▲'}</span>
            </div>

            {/* Edit Panel */}
            <div id="edit-panel" style={{ display: (isEditMode && !isTrainingMode) ? 'flex' : 'none' }}>
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
                    <button style={{ flexGrow: 1, background: '#FF9500', color: 'white' }} onClick={onToggleLock}>
                        🔒 Lock Mode (Child Safe)
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
