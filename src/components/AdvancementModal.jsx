import React, { useState } from 'react';

const phaseDetails = {
    1: {
        title: "Phase I: Physical Exchange",
        summary: "The learner picks up a picture of a desired item and hands it to a communication partner.",
        nextGoal: "Phase II: Expanding Spontaneity",
        nextSummary: "Teach the learner to travel to their communication partner and their communication book. This builds persistence!",
        instruction: "Place the tablet a few feet away from you. When the child taps the icon, wait for them to look at you or move towards you before giving the reward."
    },
    2: {
        title: "Phase II: Expanding Spontaneity",
        summary: "The learner travels to the partner and persists in communication.",
        nextGoal: "Phase III: Discrimination",
        nextSummary: "The learner will learn to choose between two or more pictures to get exactly what they want.",
        instruction: "Introduce a second, non-preferred item (like a sock or a piece of paper). Use Level 3 to show both. Reward 'Apple' if they tap Apple, or give the 'Sock' if they tap Sock."
    },
    3: {
        title: "Phase III: Discrimination",
        summary: "The learner chooses from multiple pictures.",
        nextGoal: "Phase IV: Sentence Structure",
        nextSummary: "The learner will start using a 'Sentence Strip' to say 'I want [item]'.",
        instruction: "Show the child how to tap 'I want' first, then the item. The app will now enforce this order for sentences."
    },
    4: {
        title: "Phase IV: Sentence Structure",
        summary: "The learner constructs 'I want' sentences.",
        nextGoal: "Phase V: Responding",
        nextSummary: "The learner will learn to answer the question 'What do you want?'.",
        instruction: "In Level 5, tap 'Play Question Prompt'. Wait for the app to finish speaking before helping the child build their sentence."
    },
    5: {
        title: "Phase V: Responding",
        summary: "The learner answers 'What do you want?'.",
        nextGoal: "Phase VI: Commenting",
        nextSummary: "The learner will learn to comment on things they see, hear, or feel (e.g., 'I see a dog').",
        instruction: "Introduce new starters like 'I see'. Show the child how to comment on things around the room, even if they don't want the item right now."
    }
};

const AdvancementModal = ({ currentPhase, onAdvance, onWait }) => {
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const details = phaseDetails[currentPhase];

    if (!details) return null;

    return (
        <div id="picker-modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div id="picker-content" style={{
                height: 'auto',
                maxHeight: '90vh',
                margin: '20px',
                borderRadius: '25px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚀</div>
                <h1 style={{ margin: '0 0 10px 0' }}>Great Progress!</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                    The child has successfully completed 3 trials a day for 3 days in a row. They may be ready for the next level!
                </p>

                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    margin: '20px 0',
                    textAlign: 'left',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>Next: {details.nextGoal}</h3>
                    <p style={{ margin: 0, fontSize: '1rem' }}>{details.nextSummary}</p>
                </div>

                {showFullInstructions && (
                    <div style={{
                        background: '#E5E5EA',
                        padding: '15px',
                        borderRadius: '15px',
                        marginBottom: '20px',
                        textAlign: 'left',
                        fontSize: '0.9rem'
                    }}>
                        <strong>How to run the next phase:</strong>
                        <p style={{ margin: '5px 0 0 0' }}>{details.instruction}</p>
                        {/* Placeholder for illustration */}
                        <div style={{
                            width: '100%',
                            height: '100px',
                            background: '#CCC',
                            borderRadius: '10px',
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#666'
                        }}>
                            Illustration for {details.nextGoal}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="primary" onClick={onAdvance}>
                        Advance to Level {currentPhase + 1}
                    </button>
                    <button onClick={() => setShowFullInstructions(!showFullInstructions)}>
                        {showFullInstructions ? "Hide" : "Show"} Detailed Instructions
                    </button>
                    <button style={{ color: '#FF3B30' }} onClick={onWait}>
                        Stay in Level {currentPhase} for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancementModal;
