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
            background: 'var(--bg-color)',
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
                    background: 'var(--card-bg)',
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
                        background: stageDef.color + '15',
                        color: stageDef.color,
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        border: `1px solid ${stageDef.color}40`
                    }}>
                        {stageDef.icon} Stage {Math.floor(level)}: {stageDef.name}
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '1.8rem',
                        color: 'var(--text-primary)'
                    }}>
                        {instructions.emoji} Level {level}
                    </h1>
                    <h2 style={{
                        margin: '8px 0 0 0',
                        fontSize: '1.3rem',
                        color: 'var(--text-secondary)',
                        fontWeight: '600'
                    }}>
                        {instructions.title}
                    </h2>
                </div>

                {/* Summary */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    padding: '0 10px'
                }}>
                    {instructions.summary}
                </div>

                {/* Steps */}
                <div style={{
                    background: 'var(--gray-light)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid var(--gray-border)'
                }}>
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '12px',
                        color: stageDef.color,
                        fontSize: '1.1rem',
                        fontWeight: '800',
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
                                fontSize: '1rem',
                                lineHeight: 1.5,
                                color: 'var(--text-primary)'
                            }}>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Tips */}
                {instructions.tips && (
                    <div style={{
                        background: 'rgba(88, 86, 214, 0.1)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(88, 86, 214, 0.2)'
                    }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            color: '#5856D6',
                            fontSize: '1rem',
                            fontWeight: '800'
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
                                    fontSize: '0.9rem',
                                    color: 'var(--text-primary)',
                                    fontWeight: '500'
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
                                background: l === level ? stageDef.color : 'var(--gray-border)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                        onClick={onComplete}
                        className="primary-button"
                        style={{
                            padding: '18px',
                            background: stageDef.color,
                            color: 'white',
                            borderRadius: '16px',
                            fontSize: '1.2rem',
                            minHeight: '4rem'
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
                                border: '2px solid var(--gray-border)',
                                color: 'var(--text-secondary)',
                                borderRadius: '16px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                minHeight: '3.5rem'
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