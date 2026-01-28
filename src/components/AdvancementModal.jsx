import { useState } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge
} from '@ionic/react';
import { closeOutline, bookOutline, rocketOutline, checkmarkCircleOutline } from 'ionicons/icons';

const levelDetails = {
    // ... same content as before ...
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
    },
    6: {
        title: "Level 6: Commenting",
        summary: "The learner shares observations using 'I see', 'I feel', and 'I like'.",
        image: "/images/level_6.png",
        nextGoal: "Level 7: Asking Questions",
        nextSummary: "The learner will learn to ask 'What?', 'Where?', and 'Who?' to gain information.",
        instruction: `🎯 Goal: Child spontaneously comments on things in their world.

📱 Setup:
• Point out interesting things (birds, planes, fire trucks)
• Model: "I see a bird!" on the tablet
• Use the Feelings folder to express emotions

👣 Steps:
1. Spot something interesting with the child
2. Model a comment on the tablet
3. Wait for child to initiate their own comment
4. Respond enthusiastically with social attention
5. Practice during walks, reading, and play

💡 Tips:
• Comments aren't requests - they are for sharing!
• React with big emotions to child's comments
• Model "I feel" during natural emotional moments`,
        teachingPoints: [
            "Child notices something",
            "Child builds a comment",
            "Social attention given",
            "Conversation continues"
        ]
    },
    7: {
        title: "Level 7: Asking Questions",
        emoji: "🕵️",
        summary: "The learner asks questions to learn about the environment (Skills Complex FCR).",
        image: "/images/level_7.png",
        nextGoal: "Graduation!",
        nextSummary: "Congratulations! Your child is using complex communication and branching skills.",
        instruction: `🎯 Goal: Child asks "What?", "Where?", and "Who?" to gain information.

📱 Setup:
• Use the "Box of Wonders" with hidden items
• Hide favorite toys to prompt "Where?"
• Use photos of family to prompt "Who?"

👣 Steps:
1. Create curiosity or a "problem" (item is missing)
2. Model the question on the tablet
3. Child builds and speaks the question
4. Provide the answer/information immediately
5. Celebrate the quest for knowledge!

💡 Tips:
• This is the peak of early communication!
• Information is the reinforcer here
• Use novelty and mystery to drive curiosity`,
        teachingPoints: [
            "Curiosity is triggered",
            "Child builds a question",
            "Information is provided",
            "Child achieves goal"
        ]
    }
};

const AdvancementModal = ({ currentPhase, onAdvance, onWait }) => {
    const [showFullInstructions, setShowFullInstructions] = useState(false);
    const details = levelDetails[currentPhase];

    if (!details) return null;

    return (
        <IonModal
            isOpen={true}
            onDidDismiss={onWait}
            breakpoints={[0, 0.95]}
            initialBreakpoint={0.95}
        >
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent' }}>
                    <IonTitle style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>Achievement!</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onWait} style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '36px', height: '36px' }}>
                            <IonIcon icon={closeOutline} color="dark" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{
                '--background': 'transparent',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242,242,247,0.7))',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)'
            }}>
                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                    <div className="pulse-animation" style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 0.5rem 0', color: '#1D1D1F' }}>Milestone Reached!</h2>
                    <p style={{ color: '#86868B', fontSize: '1.1rem', fontWeight: 600, lineHeight: '1.4' }}>
                        Independent trials complete. <br />Ready for the next clinical stage?
                    </p>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.4)',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    margin: '1.25rem 0',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <IonBadge style={{ background: '#5856D6', padding: '8px 14px', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px' }}>
                            LIFE SKILLS
                        </IonBadge>
                        <IonBadge style={{ background: '#34C759', padding: '8px 14px', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px' }}>
                            PRESCHOOL READY
                        </IonBadge>
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1D1D1F', fontWeight: '900', fontSize: '1.25rem' }}>
                        {details.nextGoal}
                    </h3>
                    <p style={{ margin: 0, fontSize: '1.05rem', color: '#424245', fontWeight: 500, lineHeight: '1.5' }}>
                        {details.nextSummary}
                    </p>
                </div>

                <IonButton
                    expand="block"
                    onClick={onAdvance}
                    style={{
                        '--background': '#007AFF',
                        '--border-radius': '20px',
                        '--padding-top': '20px',
                        '--padding-bottom': '20px',
                        height: '70px',
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        boxShadow: '0 15px 35px rgba(0,122,255,0.3)',
                        marginBottom: '1rem'
                    }}
                >
                    Advance to Level {currentPhase + 1}
                </IonButton>

                <IonButton
                    expand="block"
                    fill="clear"
                    onClick={() => setShowFullInstructions(!showFullInstructions)}
                    style={{ color: '#007AFF', fontWeight: '700', fontSize: '0.95rem' }}
                >
                    <IonIcon icon={bookOutline} slot="start" />
                    {showFullInstructions ? "Hide" : "Show"} Teaching Instructions
                </IonButton>

                {showFullInstructions && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        background: 'var(--ion-color-light)',
                        border: '1px solid var(--ion-color-light-shade)'
                    }}>
                        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonIcon icon={bookOutline} color="primary" />
                            How to Teach {details.nextGoal}
                        </h4>

                        {details.image && (
                            <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                                <img
                                    src={details.image}
                                    alt={`Teaching illustration`}
                                    style={{
                                        maxWidth: '100%',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </div>
                        )}

                        <div style={{
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            color: 'var(--ion-color-dark)',
                            whiteSpace: 'pre-wrap',
                            marginBottom: '1.5rem'
                        }}>
                            {details.instruction}
                        </div>

                        <div style={{ borderTop: '1px solid var(--ion-color-light-shade)', paddingTop: '1.5rem' }}>
                            <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--ion-color-medium)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Teaching Steps
                            </h5>
                            <IonList lines="none" style={{ background: 'transparent' }}>
                                {details.teachingPoints.map((point, i) => (
                                    <IonItem key={i} style={{ '--background': 'transparent', '--padding-start': '0' }}>
                                        <div slot="start" style={{
                                            background: 'var(--ion-color-primary)',
                                            color: 'white',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>{i + 1}</div>
                                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem', fontWeight: '500' }}>
                                            {point}
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <IonButton fill="clear" color="danger" onClick={onWait} style={{ fontWeight: 'bold' }}>
                        Stay in Level {currentPhase} for now
                    </IonButton>
                </div>

                {/* Safe area padding */}
                <div style={{ height: '2rem' }} />
            </IonContent>
        </IonModal>
    );
};

export default AdvancementModal;
