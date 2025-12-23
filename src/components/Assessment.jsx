import React, { useState } from 'react';

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

const Assessment = ({ onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const question = questions[currentQuestion];

    const handleAnswer = (isYes) => {
        if (isYes) {
            if (question.yesNext === null) {
                // Completed all questions - recommend normal mode (phase 0)
                setResult(0);
                setShowResult(true);
            } else {
                // Move to next question
                setCurrentQuestion(question.yesNext - 1);
            }
        } else {
            // No - recommend the phase for this question
            setResult(question.noResult);
            setShowResult(true);
        }
    };

    const handleContinue = (phase) => {
        onComplete(phase);
    };

    if (showResult) {
        const phaseInfo = phaseDescriptions[result];
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'linear-gradient(135deg, #FDF8F3, #F5F0EB)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                zIndex: 1000
            }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '20px',
                    animation: 'bounceIn 0.5s ease'
                }}>
                    🎉
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#2D3436',
                    textAlign: 'center',
                    marginBottom: '12px'
                }}>
                    Great! We found the right level
                </h1>

                <div style={{
                    background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)',
                    color: 'white',
                    padding: '20px 28px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 8px 24px rgba(78, 205, 196, 0.3)'
                }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                        {phaseInfo.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                        {phaseInfo.description}
                    </div>
                </div>

                <button
                    onClick={() => handleContinue(result)}
                    style={{
                        background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)',
                        color: 'white',
                        border: 'none',
                        padding: '18px 48px',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(78, 205, 196, 0.3)',
                        marginBottom: '16px'
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
                        color: '#636E72',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
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
            background: 'linear-gradient(135deg, #FDF8F3, #F5F0EB)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 1000
        }}>
            {/* Progress dots */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '32px',
                marginTop: '20px'
            }}>
                {questions.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: i === currentQuestion ? '24px' : '10px',
                            height: '10px',
                            borderRadius: '10px',
                            background: i <= currentQuestion
                                ? 'linear-gradient(135deg, #4ECDC4, #3DB8B0)'
                                : '#D1D5DB',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Question number */}
            <div style={{
                textAlign: 'center',
                color: '#636E72',
                fontSize: '0.85rem',
                marginBottom: '8px'
            }}>
                Question {currentQuestion + 1} of {questions.length}
            </div>

            {/* Emoji */}
            <div style={{
                fontSize: '5rem',
                textAlign: 'center',
                marginBottom: '24px'
            }}>
                {question.emoji}
            </div>

            {/* Question */}
            <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#2D3436',
                textAlign: 'center',
                marginBottom: '12px',
                lineHeight: 1.3,
                padding: '0 10px'
            }}>
                {question.question}
            </h2>

            {/* Hint */}
            <p style={{
                color: '#636E72',
                fontSize: '0.9rem',
                textAlign: 'center',
                marginBottom: '40px',
                padding: '0 20px'
            }}>
                {question.hint}
            </p>

            {/* Answer buttons */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: 'auto',
                marginBottom: '40px'
            }}>
                <button
                    onClick={() => handleAnswer(true)}
                    style={{
                        background: 'linear-gradient(135deg, #4ECDC4, #3DB8B0)',
                        color: 'white',
                        border: 'none',
                        padding: '20px',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(78, 205, 196, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    ✓ Yes
                </button>

                <button
                    onClick={() => handleAnswer(false)}
                    style={{
                        background: 'white',
                        color: '#2D3436',
                        border: '2px solid #E5E5EA',
                        padding: '20px',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    ✗ Not yet
                </button>
            </div>

            {/* Skip option */}
            <button
                onClick={() => onComplete(0)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#636E72',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}
            >
                Skip assessment
            </button>
        </div>
    );
};

export default Assessment;
