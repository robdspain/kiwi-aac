/**
 * Life Skills Framework Integration
 * Maps Kiwi AAC Levels to Dr. Greg Hanley's Life Skills Training and social independence goals.
 */

export const LIFE_SKILLS_MAPPING = {
    1: {
        phase: 1,
        skill: "Simple Request",
        objective: "Ask for things using a simple request (like 'My Way') instead of using difficult behavior.",
        levels: [1.1, 1.2],
        clinicalNote: "Focus on immediate rewards and helping the child succeed every time."
    },
    2: {
        phase: 2,
        skill: "Polite Request",
        objective: "Use longer, polite sentences like “Excuse me, can I have my way, please?”",
        levels: [2.1, 2.2],
        clinicalNote: "Help them move from one word to full polite sentences."
    },
    3: {
        phase: 3,
        skill: "Learning to Wait",
        objective: "Stay calm when told 'No' or 'Wait' and respond with 'Okay'.",
        levels: [3.1, 3.2, 3.3],
        clinicalNote: "Reward the child immediately for staying calm and saying 'Okay'."
    },
    4: {
        phase: 4,
        skill: "Giving Things Up",
        objective: "Calmly give up a favorite item (like an iPad) when asked by an adult.",
        levels: [4.1, 4.2, 4.3, 4.4],
        clinicalNote: "Practice letting go of items and getting them back right away."
    },
    5: {
        phase: 5,
        skill: "Moving Places",
        objective: "Move from one area to another (like from play to the table) when asked.",
        levels: [5.1, 5.2, 5.3],
        clinicalNote: "Teach the child to transition smoothly between different activities."
    },
    6: {
        phase: 6,
        skill: "Doing a Task",
        objective: "Complete 1 to 3 simple tasks before getting a reward.",
        levels: [6.1, 6.2, 6.3, 6.4],
        clinicalNote: "Build the habit of doing a little bit of work before playtime."
    },
    7: {
        phase: 7,
        skill: "Doing Multiple Tasks",
        objective: "Complete tasks across different activities (like table work then circle time).",
        levels: [7.1, 7.2, 7.3],
        clinicalNote: "Increase independence by linking different tasks together."
    },
    8: {
        phase: 8,
        skill: "Extended Working",
        objective: "Stay focused and complete longer sequences of work.",
        levels: [8.1, 8.2, 8.3],
        clinicalNote: "Build endurance for school routines and longer activities."
    },
    9: {
        phase: 9,
        skill: "Staying Flexible",
        objective: "Stay calm and keep working even when things get difficult or change.",
        levels: [9.1, 9.2, 9.3],
        clinicalNote: "The ultimate goal: being able to handle challenges and changes calmly."
    }
};

export const ROLE_SUPPORT_TIPS = {
    parent: {
        title: "Home Support",
        tips: [
            "Keep the tablet within reach so your child can always 'talk'.",
            "Use the tablet yourself to show how it works (Aided Modeling).",
            "Honor every request at first - you are building trust and power."
        ]
    },
    teacher: {
        title: "Classroom Support",
        tips: [
            "Use the tablet during circle time and transitions.",
            "Have classmates model using the tablet during play.",
            "Use Visual Schedules to show what is happening next."
        ]
    },
    therapist: {
        title: "Clinical Support",
        tips: [
            "Use the data history for progress monitoring.",
            "Focus on motor planning stability across different settings.",
            "Implement Waiting/Tolerance practice 2-3x per session."
        ]
    }
};

export const getLifeSkillsMapping = (level) => {
    const stage = Math.floor(level);
    return LIFE_SKILLS_MAPPING[stage] || null;
};