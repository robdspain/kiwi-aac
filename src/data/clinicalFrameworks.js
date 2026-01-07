/**
 * Clinical Frameworks Integration (Hanley SBT & PLS)
 * Maps Kiwi AAC Levels to Dr. Greg Hanley's Skill-Based Training (SBT) and Preschool Life Skills (PLS).
 */

export const SBT_MAPPING = {
    1: {
        skill: "FCR (Simple)",
        objective: "The child will use a simple Functional Communication Response to request reinforcers.",
        levels: [1.1, 1.2],
        clinicalNote: "Focus on immediate reinforcement and zero-error teaching."
    },
    2: {
        skill: "FCR Persistence & Travel",
        objective: "The child will travel to a communication partner to deliver a request.",
        levels: [2.1, 2.2],
        clinicalNote: "Build the 'search and find' component of communication."
    },
    3: {
        skill: "Simple Discrimination",
        objective: "The child will select between a preferred and non-preferred item with 90% accuracy.",
        levels: [3.1],
        clinicalNote: "Honor all selections to teach the consequence of choice."
    },
    4: {
        skill: "Complex Discrimination",
        objective: "The child will select from an array of 5+ items.",
        levels: [3.2, 3.3],
        clinicalNote: "Gradually increase field size to manage cognitive load."
    },
    5: {
        skill: "Chaining & Syntactic Expansion (Adjectives)",
        objective: "The child will expand requests using adjectives (I want + [color/size] + item).",
        levels: [4.1, 4.2, 4.3, 4.4],
        clinicalNote: "Dr. Hanley's SBT emphasizes expanding the FCR once simple FCR is mastered. Adjectives are the first step in creating a diverse communication repertoire."
    },
    6: {
        skill: "Intraverbals (Responding)",
        objective: "The child will respond to verbal prompts (What do you want?).",
        levels: [5.1, 5.2, 5.3],
        clinicalNote: "Fade prompts to ensure stimulus control by the question, not the item."
    },
    7: {
        skill: "Complex FCR & Branching",
        objective: "The child will use complex sentences and ask questions to learn about the environment.",
        levels: [6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3],
        clinicalNote: "Dr. Hanley's SBT emphasizes expanding the FCR repertoire once tolerance is established."
    }
};

export const PLS_MAPPING = {
    "Instruction Following": {
        description: "Following adult-led directives during communication setup.",
        levels: [1.1, 2.1, 3.1]
    },
    "Functional Communication": {
        description: "Standard FCR protocols (Simple, Multi-word, Complex).",
        levels: [1.2, 4.1]
    },
    "Social Skills": {
        description: "Greetings, niceties, and joint attention via commenting.",
        levels: [4.4, 6.1]
    },
    "Tolerance & Waiting": {
        description: "Accepting 'no' and waiting for reinforcers.",
        levels: ["All (Integrated via Denial Tolerance Mode)"]
    }
};

export const ROLE_SUPPORT_TIPS = {
    parent: {
        title: "Home Support",
        tips: [
            "Keep the device within reach at all times.",
            "Narrate your own actions using the app (Aided Language Input).",
            "Honor every request, even if it's messy - you are building trust."
        ]
    },
    teacher: {
        title: "Classroom Support",
        tips: [
            "Integrate the app into circle time and transitions.",
            "Assign a 'Communication Buddy' to model use during play.",
            "Use the Visual Schedules for classroom routines."
        ]
    },
    therapist: {
        title: "Clinical Support",
        tips: [
            "Use the data export for IEP progress monitoring.",
            "Focus on motor planning stability across sessions.",
            "Implement Denial Tolerance protocols 2-3x per session."
        ]
    }
};

export const getClinicalMapping = (level) => {
    const stage = Math.floor(level);
    return SBT_MAPPING[stage] || null;
};
