import { useState } from 'react';

const levelDetails = {
    1: {
        title: "Level 1: Physical Exchange",
        summary: "The learner picks up a picture of a desired item and hands the tablet to a communication partner.",
        image: "/images/level_1.png",
        nextGoal: "Level 2: Getting Attention",
        nextSummary: "Teach the learner to travel to their communication partner with the tablet. This builds persistence!",
        instruction: `🎯 Goal: Child taps icon and hands tablet to adult to receive item.

📱 Setup: 
• Place tablet on table near child
• Have a preferred item (snack, toy) ready but out of reach

👣 Steps:
1. Wait for child to show interest in the item
2. Guide child to tap the icon on the tablet
3. Prompt child to pick up tablet and hand it to you
4. Say the word aloud and immediately give the item
5. Celebrate the success!

💡 Tips:
• Start with ONE highly motivating item
• Keep sessions short (5-10 exchanges)
• Gradually reduce physical prompts over time`,
        teachingPoints: [
            "Child sees desired item",
            "Child taps icon on tablet",
            "Child hands tablet to adult",
            "Adult says word and gives item"
        ]
    },
    2: {
        title: "Level 2: Getting Attention",
        summary: "The learner travels to the partner with the tablet and persists in communication.",
        image: "/images/level_2.png",
        nextGoal: "Level 3: Picture Selection",
        nextSummary: "The learner will learn to choose between two or more pictures to get exactly what they want.",
        instruction: `🎯 Goal: Child brings tablet across the room to get your attention.

📱 Setup:
• Place tablet a few feet away from you
• Gradually increase the distance over time
• Move to different locations (couch, kitchen, etc.)

👣 Steps:
1. Position yourself away from the tablet
2. Wait for child to pick up tablet
3. Child walks to you and hands you the tablet
4. Say the word, give immediate reinforcement
5. Increase distance as child succeeds

💡 Tips:
• Start close, then gradually move further
• Practice in different rooms
• Celebrate the effort of finding you!`,
        teachingPoints: [
            "Tablet placed away from adult",
            "Child picks up tablet",
            "Child walks to find adult",
            "Child hands tablet to adult"
        ]
    },
    3: {
        title: "Level 3: Picture Selection",
        summary: "The learner chooses the correct picture from multiple options.",
        image: "/images/level_3.png",
        nextGoal: "Level 4: Sentence Building",
        nextSummary: "The learner will start using sentences like 'I want [item]'.",
        instruction: `🎯 Goal: Child selects the correct picture from 2+ options.

📱 Setup:
• Show 2 items on the screen: one preferred, one not
• The non-preferred item could be a sock, napkin, or less-liked snack

👣 Steps:
1. Show both items on the tablet
2. Wait for child to tap one
3. If they tap the preferred item → give it immediately!
4. If they tap the non-preferred item → give THAT item instead
5. Child learns to choose carefully

💡 Tips:
• This teaches discrimination - choices matter!
• Start with very different items (cookie vs. sock)
• Gradually add more options as child succeeds
• Always honor what they tap to teach consequence`,
        teachingPoints: [
            "Multiple pictures displayed",
            "Child must choose one",
            "Correct choice = desired item",
            "Wrong choice = that item given"
        ]
    },
    4: {
        title: "Level 4: Sentence Building",
        summary: "The learner constructs 'I want' + item sentences.",
        image: "/images/level_4.png",
        nextGoal: "Level 5: Answering Questions",
        nextSummary: "The learner will learn to answer 'What do you want?'.",
        instruction: `🎯 Goal: Child builds sentences by tapping "I want" + item.

📱 Setup:
• The sentence strip appears at the top
• "I want" starter icon is available
• Item icons are in the grid below

👣 Steps:
1. Model: Tap "I want" then the item
2. Help child tap "I want" first
3. Then tap the desired item
4. The app speaks the full sentence
5. Give the item immediately

💡 Tips:
• The sentence strip shows the building sentence
• If child skips "I want", gently guide them
• Practice makes this automatic over time
• Add color words, size words as they progress`,
        teachingPoints: [
            "Tap 'I want' first",
            "Then tap the item",
            "Sentence appears in strip",
            "Full sentence is spoken"
        ]
    },
    5: {
        title: "Level 5: Answering Questions",
        summary: "The learner answers 'What do you want?'.",
        image: "/images/level_5.png",
        nextGoal: "Level 6: Commenting",
        nextSummary: "The learner will learn to comment on things they see, hear, or feel.",
        instruction: `🎯 Goal: Child responds on tablet when asked "What do you want?"

📱 Setup:
• Use the "Play Question Prompt" button
• Wait after asking the question
• Child uses tablet to answer

👣 Steps:
1. Tap "Play Question Prompt" in Adult Settings
2. The app asks "What do you want?"
3. Wait silently for 3-5 seconds
4. Child taps "I want" + item on tablet
5. Give the requested item

💡 Tips:
• Wait silently after the question (don't repeat)
• The pause teaches child to respond
• Gradually increase wait time
• Celebrate when they answer independently!`,
        teachingPoints: [
            "Adult/app asks question",
            "Child listens and waits",
            "Child builds response on tablet",
            "Adult honors the request"
        ]
    }
};

const AdvancementModal = ({ currentPhase, onAdvance, onWait }) => {
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const details = levelDetails[currentPhase];

    if (!details) return null;

    return (
        <div id="picker-modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <div id="picker-content" style={{
                height: 'auto',
                maxHeight: '90vh',
                margin: '1.25rem',
                borderRadius: '1.5rem',
                textAlign: 'center',
                overflowY: 'auto',
                background: 'var(--card-bg)',
                position: 'relative'
            }}>
                <button className="ios-close-button" onClick={onWait} aria-label="Close">✕</button>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚀</div>
                <h1 style={{ margin: '0 0 0.75rem 0', fontSize: '2rem', color: 'var(--text-primary)' }}>Great Progress!</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Your child has successfully completed 3 trials a day for 3 days in a row. They may be ready for the next level!
                </p>

                <div style={{
                    background: 'var(--gray-light)',
                    padding: '1.25rem',
                    borderRadius: '1rem',
                    margin: '1.25rem 0',
                    textAlign: 'left',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ margin: '0 0 0.3125rem 0', color: 'var(--primary-dark)' }}>Next: {details.nextGoal}</h3>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{details.nextSummary}</p>
                </div>

                {showFullInstructions && (
                    <div style={{
                        background: 'var(--bg-color)',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        marginBottom: '1.25rem',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        border: '1px solid var(--gray-border)'
                    }}>
                        <strong style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>
                            📖 How to Teach {details.nextGoal}
                        </strong>

                        {/* Instructional illustration */}
                        {details.image && (
                            <div style={{
                                margin: '0.9375rem 0',
                                textAlign: 'center'
                            }}>
                                <img
                                    src={details.image}
                                    alt={`Teaching illustration for ${details.nextGoal}`}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </div>
                        )}

                        <pre style={{
                            margin: '0.9375rem 0',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                            color: 'var(--text-primary)'
                        }}>
                            {details.instruction}
                        </pre>

                        {/* Visual teaching flow */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginTop: '0.9375rem',
                            justifyContent: 'center'
                        }}>
                            {details.teachingPoints.map((point, i) => (
                                <div key={i} style={{
                                    background: 'var(--card-bg)',
                                    padding: '0.75rem 0.875rem',
                                    borderRadius: '1.25rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    color: 'var(--primary-dark)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    border: '1px solid var(--gray-border)'
                                }}>
                                    <span style={{
                                        background: 'var(--primary-dark)',
                                        color: 'white',
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem'
                                    }}>{i + 1}</span>
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="primary-button" onClick={onAdvance} style={{ minHeight: '3.5rem' }}>
                        Advance to Level {currentPhase + 1}
                    </button>
                    <button className="secondary-button" onClick={() => setShowFullInstructions(!showFullInstructions)} style={{ minHeight: '3.25rem', background: 'var(--gray-light)', border: 'none', borderRadius: '0.75rem', fontWeight: '600' }}>
                        {showFullInstructions ? "Hide" : "📖 Show"} Teaching Instructions
                    </button>
                    <button style={{ color: 'var(--danger)', minHeight: '2.75rem', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={onWait}>
                        Stay in Level {currentPhase} for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancementModal;
