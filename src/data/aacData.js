// AAC Core Vocabulary and Templates

// High-frequency core words (Top 50-ish)
export const CORE_VOCABULARY = [
    "I", "you", "it", "that", "this", "my", "me", "we", "they",
    "want", "go", "stop", "like", "have", "get", "help", "play", "see", "look", "turn", "make",
    "more", "no", "yes", "not", "all", "some", "finished", "good", "bad",
    "here", "there", "in", "on", "out", "up", "down",
    "what", "where", "who", "when", "why",
    "now", "later", "today"
];

// Word Classes for Fitzgerald Key
export const WORD_CLASSES = [
    { id: 'noun', label: 'Noun (Yellow)', color: '#FFEB3B' },
    { id: 'verb', label: 'Verb (Green)', color: '#4CAF50' },
    { id: 'adj', label: 'Adjective (Blue)', color: '#2196F3' },
    { id: 'social', label: 'Social (Pink)', color: '#E91E63' },
    { id: 'misc', label: 'Misc (Orange)', color: '#FF9800' }
];

export const TEMPLATES = {
    "First 50 Words": [
        "I", "want", "more", "stop", "go", "help", "eat", "drink", "play", "sleep",
        "mom", "dad", "yes", "no", "hello", "goodbye", "toilet", "bath", "book", "car",
        "happy", "sad", "big", "little", "hot", "cold", "up", "down", "in", "out"
    ],
    "School Day": [
        "teacher", "friend", "school", "bus", "classroom", "desk", "pencil", "paper",
        "read", "write", "listen", "play", "lunch", "snack", "backpack", "homework",
        "help", "bathroom", "music", "art", "gym", "recess"
    ]
};

export const SKILLS = [
    { id: 'fcr', label: 'FCR (Functional Communication)', color: '#9C27B0' },
    { id: 'wait', label: 'Wait / Tolerance', color: '#FF5722' },
    { id: 'denial', label: 'Denial Acceptance', color: '#795548' },
    { id: 'none', label: 'None', color: '#ccc' }
];
