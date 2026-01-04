import { useState } from 'react';
import LevelIntro from './LevelIntro';

const questions = [
    {
        id: 1,
        question: "Has your child ever used pictures to communicate?",
        emoji: "🖼️",
        hint: "This includes pointing at pictures, handing cards, or using a device",
        yesNext: 2,
        noResult: 1
    },
    {
        id: 2,
        question: "Can your child get your attention to make a request?",
        emoji: "👋",
        hint: "They come find you, tap your arm, or call out",
        yesNext: 3,
        noResult: 2
    },
    {
        id: 3,
        question: "Can your child choose the correct picture from 2 or more options?",
        emoji: "🎯",
        hint: "When shown multiple pictures, they pick the one they want",
        yesNext: 4,
        noResult: 3
    },
    {
        id: 4,
        question: "Can your child combine pictures to make a request?",
        emoji: "🔗",
        hint: 'For example: "I want" + "cookie"',
        yesNext: 5,
        noResult: 4
    },
    {
        id: 5,
        question: 'Can your child respond when asked "What do you want?"',
        emoji: "💬",
        hint: "They answer the question instead of just reaching for items",
        yesNext: 6,
        noResult: 5
    },
    {
        id: 6,
        question: "Does your child make comments about things they see or hear?",
        emoji: "👀",
        hint: '"I see a dog", "I hear music"',
        yesNext: null, // End - recommend phase 0 (normal mode)
        noResult: 5
    }
];

const phaseDescriptions = {
    0: { name: "Free Communication", description: "Your child is ready to explore all communication features on the tablet!" },
    1: { name: "Level 1: Physical Exchange", description: "Tap a picture on the tablet and hand it to an adult to request items." },
    2: { name: "Level 2: Getting Attention", description: "Bring the tablet to an adult from across the room to make requests." },
    3: { name: "Level 3: Picture Selection", description: "Choose the right picture from multiple options on the tablet." },
    4: { name: "Level 4: Sentence Building", description: "Build sentences like 'I want cookie' using the tablet." },
    5: { name: "Level 5: Answering Questions", description: "Respond to 'What do you want?' using the tablet." }
};

// High-value reinforcers that kids typically love
const favoriteOptions = [
    { id: 'play', word: 'Play', icon: '🏃' },
    { id: 'my-turn', word: 'My Turn', icon: '🙋' },
    { id: 'snack', word: 'Snack', icon: '🥨' },
    { id: 'mom', word: 'Mom', icon: '👩' },
    { id: 'dad', word: 'Dad', icon: '👨' },
    { id: 'toy', word: 'Toy', icon: '🧸' },
];

const Assessment = ({ onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [showNotSureOptions, setShowNotSureOptions] = useState(false);
    const [showFavoritesPicker, setShowFavoritesPicker] = useState(false);
    const [showLiteracyCheck, setShowLiteracyCheck] = useState(false);
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [canRead, setCanRead] = useState(null);
    const [showIntro, setShowIntro] = useState(false);
    const [history, setHistory] = useState([]);
    const [answers, setAnswers] = useState({});

    const question = questions[currentQuestion];

    const calculateResult = (finalAnswers) => {
        let recommendedPhase = 0; // Default to advanced/free mode if all Yes
        
        // Iterate through questions to find the first skill gap
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (finalAnswers[q.id] === false) {
                // If they can't do this skill yet, start at this level
                // Use the noResult from the question definition as the phase
                recommendedPhase = q.noResult;
                break;
            }
        }
        
        // If they answered Yes to everything, recommendedPhase stays 0
        setResult(recommendedPhase);
        setShowFavoritesPicker(true);
    };

    const handleAnswer = (isYes) => {
        // Save current question to history before moving
        setHistory([...history, currentQuestion]);
        
        // Record answer
        const newAnswers = { ...answers, [question.id]: isYes };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const handleFavoriteToggle = (favorite) => {
        if (selectedFavorites.find(f => f.id === favorite.id)) {
            setSelectedFavorites(selectedFavorites.filter(f => f.id !== favorite.id));
        } else {
            if (selectedFavorites.length < 3) {
                setSelectedFavorites([...selectedFavorites, favorite]);
            }
        }
    };

    const handleBack = () => {
        if (history.length > 0) {
            const previousQuestion = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentQuestion(previousQuestion);
        }
    };

    const handleContinue = (phase) => {
        // Pass phase, favorites, and literacy preference to parent
        onComplete(phase, selectedFavorites, canRead);
    };

    // Favorites Picker Screen
    if (showFavoritesPicker) {
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
                <div style={{
                    fontSize: '3rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    marginTop: '1.25rem'
                }}>
                    ⭐
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    What does your child LOVE?
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    padding: '0 1.25rem'
                }}>
                    Pick 1-3 favorites we&apos;ll add to the home screen
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                }}>
                    {favoriteOptions.map(fav => {
                        const isSelected = selectedFavorites.find(f => f.id === fav.id);
                        return (
                            <button
                                key={fav.id}
                                onClick={() => handleFavoriteToggle(fav)}
                                style={{
                                    background: isSelected
                                        ? 'var(--fitz-noun)'
                                        : 'var(--card-bg)',
                                    border: isSelected
                                        ? '0.1875rem solid var(--primary-dark)'
                                        : '0.125rem solid var(--gray-border)',
                                    borderRadius: '1rem',
                                    padding: '1rem 0.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isSelected
                                        ? '0 0.5rem 1.25rem rgba(255, 235, 59, 0.4)'
                                        : '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
                                    minHeight: '4.5rem'
                                }}
                            >
                                <span style={{ fontSize: '2.5rem' }}>{fav.icon}</span>
                                <span style={{
                                    fontSize: '0.85rem',
                                    fontWeight: isSelected ? '700' : '600',
                                    color: 'var(--text-primary)'
                                }}>
                                    {fav.word}
                                </span>
                                {isSelected && (
                                    <span style={{
                                        fontSize: '1.2rem',
                                        position: 'absolute',
                                        top: '0.25rem',
                                        right: '0.25rem'
                                    }}>
                                        ✓
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: '1rem'
                }}>
                    {selectedFavorites.length === 0 && '👆 Tap to select favorites'}
                    {selectedFavorites.length > 0 && selectedFavorites.length < 1 &&
                        `${selectedFavorites.length} selected - pick at least 1`}
                    {selectedFavorites.length >= 1 &&
                        `✨ ${selectedFavorites.length} selected - great choices!`}
                </div>

                <button
                    onClick={() => {
                        setShowFavoritesPicker(false);
                        setShowLiteracyCheck(true); // Show literacy check next
                    }}
                    disabled={selectedFavorites.length < 1}
                    className="primary-button"
                    style={{
                        marginBottom: '1rem',
                        minHeight: '3.5rem',
                        opacity: selectedFavorites.length < 1 ? 0.5 : 1
                    }}
                >
                    Continue →
                </button>

                <button
                    onClick={() => {
                        // Skip favorites picker
                        setShowFavoritesPicker(false);
                        setShowLiteracyCheck(true); // Show literacy check next
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        minHeight: '2.75rem'
                    }}
                >
                    Skip this step
                </button>
            </div>
        );
    }

    // Literacy Check Screen
    if (showLiteracyCheck) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--bg-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                zIndex: 1000
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1.25rem'
                }}>
                    📚
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: '0.75rem'
                }}>
                    Can your child read?
                </h1>

                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    textAlign: 'center',
                    marginBottom: '2.5rem',
                    padding: '0 1.25rem',
                    lineHeight: 1.5
                }}>
                    Even simple words like &quot;COOKIE&quot; or &quot;PLAY&quot;?<br />
                    We&apos;ll adjust the app to support their reading level.
                </p>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    width: '100%',
                    maxWidth: '21.25rem'
                }}>
                    <button
                        onClick={() => {
                            setCanRead(true);
                            setShowLiteracyCheck(false);
                            setShowResult(true);
                        }}
                        className="primary-button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.625rem',
                            minHeight: '4.5rem'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>✓</span>
                        <div style={{ textAlign: 'left' }}>
                            <div>Yes, they can read</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Bigger text, dyslexia-friendly font</div>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            setCanRead(false);
                            setShowLiteracyCheck(false);
                            setShowResult(true);
                        }}
                        style={{
                            background: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            border: '0.125rem solid var(--gray-border)',
                            padding: '1.25rem',
                            borderRadius: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.625rem',
                            minHeight: '4.5rem'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>✗</span>
                        <div style={{ textAlign: 'left' }}>
                            <div>No, not yet</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Focus on pictures and icons</div>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            setCanRead('partial');
                            setShowLiteracyCheck(false);
                            setShowResult(true);
                        }}
                        style={{
                            background: 'var(--gray-light)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--gray-border)',
                            padding: '1rem',
                            borderRadius: '1rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            minHeight: '3.5rem'
                        }}
                    >
                        <span style={{ fontSize: '1.3rem' }}>🤔</span>
                        <div>Emerging reader (some words)</div>
                    </button>
                </div>

                <button
                    onClick={() => {
                        setCanRead(null);
                        setShowLiteracyCheck(false);
                        setShowResult(true);
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginTop: '1.25rem',
                        minHeight: '2.75rem'
                    }}
                >
                    Skip this question
                </button>
            </div>
        );
    }

    if (showResult) {
        const phaseInfo = phaseDescriptions[result];
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--bg-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                zIndex: 1000
            }}>
                {showIntro && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
                        <LevelIntro 
                            phase={result} 
                            onComplete={() => setShowIntro(false)} 
                            onChangeLevel={() => {
                                setShowIntro(false);
                                setShowResult(false);
                                setCurrentQuestion(0);
                                setResult(null);
                                setHistory([]);
                                setAnswers({});
                            }}
                        />
                    </div>
                )}

                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1.25rem',
                    animation: 'bounceIn 0.5s ease'
                }}>
                    🎉
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    marginBottom: '0.75rem'
                }}>
                    Great! We found the right level
                </h1>

                <div style={{
                    background: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                    padding: '1.25rem 1.75rem',
                    borderRadius: '1.25rem',
                    textAlign: 'center',
                    marginBottom: '1.25rem',
                    boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {phaseInfo.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary-text)', marginBottom: '0.75rem' }}>
                        {phaseInfo.description}
                    </div>

                    {result > 0 && (
                        <button
                            onClick={() => setShowIntro(true)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '0.0625rem solid rgba(255,255,255,0.4)',
                                color: 'var(--primary-text)',
                                padding: '0.5rem 1rem',
                                borderRadius: '1.25rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                fontWeight: 600,
                                minHeight: '2.75rem'
                            }}
                        >
                            📖 Show me how
                        </button>
                    )}
                </div>

                <button
                    onClick={() => handleContinue(result)}
                    className="primary-button"
                    style={{
                        padding: '1.125rem 3rem',
                        marginBottom: '1rem',
                        minHeight: '3.5rem'
                    }}
                >
                    Start Learning! →
                </button>

                <button
                    onClick={() => {
                        setShowResult(false);
                        setCurrentQuestion(0);
                        setResult(null);
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        minHeight: '2.75rem'
                    }}
                >
                    Retake assessment
                </button>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            zIndex: 1000
        }}>
            {/* Back Button */}
            {history.length > 0 && (
                <button 
                    onClick={handleBack}
                    style={{
                        position: 'absolute',
                        top: '1.25rem',
                        left: '1.25rem',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '0.625rem',
                        zIndex: 10,
                        minWidth: '2.75rem',
                        minHeight: '2.75rem'
                    }}
                >
                    ←
                </button>
            )}

            {/* Progress dots */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
                marginTop: '1.25rem'
            }}>
                {questions.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: i === currentQuestion ? '1.5rem' : '0.625rem',
                            height: '0.625rem',
                            borderRadius: '0.625rem',
                            background: i <= currentQuestion
                                ? 'var(--primary-dark)'
                                : 'var(--gray-border)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Question number */}
            <div style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '0.5rem'
            }}>
                Question {currentQuestion + 1} of {questions.length}
            </div>

            {/* Emoji */}
            <div style={{
                fontSize: '5rem',
                textAlign: 'center',
                marginBottom: '1.5rem'
            }}>
                {question.emoji}
            </div>

            {/* Question */}
            <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textAlign: 'center',
                marginBottom: '0.75rem',
                lineHeight: 1.3,
                padding: '0 0.625rem'
            }}>
                {question.question}
            </h2>

            {/* Hint */}
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textAlign: 'center',
                marginBottom: '2.5rem',
                padding: '0 1.25rem'
            }}>
                {question.hint}
            </p>

            {/* Answer buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: 'auto',
                marginBottom: '1.5rem'
            }}>
                <button
                    onClick={() => handleAnswer(true)}
                    className="primary-button"
                    style={{
                        minHeight: '3.5rem'
                    }}
                >
                    ✓ Yes
                </button>

                <button
                    onClick={() => handleAnswer(false)}
                    style={{
                        background: 'var(--card-bg)',
                        color: 'var(--text-primary)',
                        border: '0.125rem solid var(--gray-border)',
                        padding: '1.125rem',
                        borderRadius: '1rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.625rem',
                        minHeight: '3.5rem'
                    }}
                >
                    ✗ Not yet
                </button>

                <button
                    onClick={() => setShowNotSureOptions(true)}
                    style={{
                        background: 'var(--gray-light)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--gray-border)',
                        padding: '0.875rem',
                        borderRadius: '1rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        minHeight: '2.75rem'
                    }}
                >
                    🤔 I&apos;m not sure
                </button>
            </div>

            {/* Not Sure Options Modal */}
            {showNotSureOptions && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100,
                    padding: '1.25rem'
                }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '1.5rem',
                        padding: '1.5rem',
                        maxWidth: '21.25rem',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                            No problem! 👍
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            You can test this skill together, or start at a beginner level.
                        </p>

                        <button
                            onClick={() => {
                                setShowNotSureOptions(false);
                                // Start at Level 1 (beginner) and let them discover naturally
                                onComplete(1);
                            }}
                            className="primary-button"
                            style={{
                                minHeight: '3.5rem'
                            }}
                        >
                            🚀 Start at Level 1
                        </button>

                        <button
                            onClick={() => {
                                setShowNotSureOptions(false);
                                // Skip this question and continue assessment
                                if (question.yesNext === null) {
                                    onComplete(0);
                                } else {
                                    setCurrentQuestion(question.yesNext - 1);
                                }
                            }}
                            style={{
                                background: 'var(--gray-light)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--gray-border)',
                                padding: '0.875rem',
                                borderRadius: '0.875rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                minHeight: '2.75rem'
                            }}
                        >
                            ⏭️ Skip this question
                        </button>

                        <button
                            onClick={() => setShowNotSureOptions(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                minHeight: '2.75rem'
                            }}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            )}

            {/* Skip option */}
            <button
                onClick={() => onComplete(0)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginBottom: '1.25rem',
                    minHeight: '2.75rem',
                    textDecoration: 'underline'
                }}
            >
                Skip assessment entirely
            </button>
        </div>
    );
};

export default Assessment;
