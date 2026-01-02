import {
    getLevel,
    getStage,
    getLevelInstructions,
    LEVEL_ORDER
} from '../data/levelDefinitions';

const LevelIntro = ({ level, onComplete, onChangeLevel }) => {
    // Get level definition and instructions
    const levelDef = getLevel(level);
    const stageDef = getStage(level);
    const instructions = getLevelInstructions(level);

    if (!levelDef || !instructions) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #FDF8F3, #F5F0EB)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1500
        }}>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <div
                className="no-scrollbar"
                style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>

                {/* Header with Stage Badge */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: stageDef.color + '20',
                        color: stageDef.color,
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '12px'
                    }}>
                        {stageDef.icon} Stage {Math.floor(level)}: {stageDef.name}
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '1.8rem',
                        color: '#2D3436'
                    }}>
                        {instructions.emoji} Level {level}
                    </h1>
                    <h2 style={{
                        margin: '8px 0 0 0',
                        fontSize: '1.3rem',
                        color: '#636E72',
                        fontWeight: '500'
                    }}>
                        {instructions.title}
                    </h2>
                </div>

                {/* Summary */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    color: '#555',
                    lineHeight: 1.5,
                    padding: '0 10px'
                }}>
                    {instructions.summary}
                </div>

                {/* Steps */}
                <div style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '12px',
                        color: stageDef.color,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        👣 Teaching Steps
                    </h3>
                    <ol style={{
                        margin: 0,
                        paddingLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {instructions.steps.map((step, i) => (
                            <li key={i} style={{
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                color: '#444'
                            }}>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Tips */}
                {instructions.tips && (
                    <div style={{
                        background: '#E3F2FD',
                        padding: '16px',
                        borderRadius: '12px'
                    }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            color: '#1565C0',
                            fontSize: '0.9rem'
                        }}>
                            💡 Tips
                        </h4>
                        <ul style={{
                            margin: 0,
                            paddingLeft: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                        }}>
                            {instructions.tips.map((tip, i) => (
                                <li key={i} style={{
                                    fontSize: '0.85rem',
                                    color: '#1565C0'
                                }}>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Progress indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '10px 0'
                }}>
                    {LEVEL_ORDER.filter(l => Math.floor(l) === Math.floor(level)).map(l => (
                        <div
                            key={l}
                            style={{
                                width: l === level ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: l === level ? stageDef.color : '#E5E5EA',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={onComplete}
                        style={{
                            padding: '18px',
                            background: `linear-gradient(135deg, ${stageDef.color}, ${stageDef.color}dd)`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: `0 8px 20px ${stageDef.color}40`
                        }}
                    >
                        Start Level {level}
                    </button>

                    {onChangeLevel && (
                        <button
                            onClick={onChangeLevel}
                            style={{
                                padding: '12px',
                                background: 'transparent',
                                border: '2px solid #E5E5EA',
                                color: '#636E72',
                                borderRadius: '16px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Select Another Level
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LevelIntro;