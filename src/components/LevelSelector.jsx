import React from 'react';

export const phaseDescriptions = {
    1: { 
        name: "Level 1: Physical Exchange", 
        description: "Tap a picture on the tablet and hand it to an adult to request items.", 
        icon: "🤝", 
        recommended: "Recommended Starting Point" 
    },
    2: { 
        name: "Level 2: Getting Attention", 
        description: "Bring the tablet to an adult from across the room to make requests.", 
        icon: "👋" 
    },
    3: { 
        name: "Level 3: Picture Selection", 
        description: "Choose the right picture from multiple options on the tablet.", 
        icon: "🎯" 
    },
    4: { 
        name: "Level 4: Sentence Building", 
        description: "Build sentences like 'I want cookie' using the tablet.", 
        icon: "🔗" 
    },
    5: { 
        name: "Level 5: Answering Questions", 
        description: "Respond to 'What do you want?' using the tablet.", 
        icon: "💬" 
    },
    6: { 
        name: "Level 6: Commenting", 
        description: "Share observations like 'I see a bird' using the tablet.", 
        icon: "👀" 
    },
    7: { 
        name: "Level 7: Asking Questions", 
        description: "Ask 'What?', 'Where?', and 'Who?' to learn about the world.", 
        icon: "🔎" 
    },
    0: { 
        name: "Free Communication", 
        description: "Access to all features without level restrictions.", 
        icon: "🚀", 
        recommended: "For Advanced Users" 
    }
};

const LevelSelector = ({ onSelect, onBack }) => {
    // Sort keys to show Levels 1-7 first, then 0 (Free Comm) at the end or specific order
    const sortedPhases = [1, 2, 3, 4, 5, 6, 7, 0];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            zIndex: 1000,
            overflowY: 'auto'
        }}>
            {/* Header */}
             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '0.5rem',
                        marginRight: '0.5rem'
                    }}
                >
                    ←
                </button>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: 0
                }}>
                    Choose a Starting Level
                </h1>
            </div>

            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                marginBottom: '2rem',
                padding: '0 0.5rem',
                lineHeight: 1.5
            }}>
                Select the level that best matches your child's current skills. You can always change this later in the settings menu.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', paddingBottom: '2rem' }}>
                {sortedPhases.map((phase) => {
                    const info = phaseDescriptions[phase];
                    return (
                        <button
                            key={phase}
                            onClick={() => onSelect(parseInt(phase))}
                            style={{
                                background: 'var(--card-bg)',
                                border: '0.125rem solid var(--gray-border)',
                                borderRadius: '1rem',
                                padding: '0.75rem 0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                minHeight: '8rem'
                            }}
                        >
                            <div style={{ fontSize: '2rem', lineHeight: 1 }}>{info.icon}</div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                                    {info.name.split(':')[0]}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {info.description}
                                </div>
                            </div>
                            {info.recommended && (
                                <div style={{
                                    marginTop: '0.25rem',
                                    background: 'var(--primary-light)',
                                    color: 'var(--primary-dark)',
                                    fontSize: '0.6rem',
                                    fontWeight: 800,
                                    padding: '0.125rem 0.5rem',
                                    borderRadius: '0.5rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {info.recommended.includes('Starting') ? 'Start' : 'Pro'}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LevelSelector;
