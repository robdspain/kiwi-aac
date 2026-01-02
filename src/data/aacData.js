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
    { id: 'noun', label: 'Noun (Yellow)', color: '#FFEB3B', textColor: '#2D3436' },
    { id: 'verb', label: 'Verb (Green)', color: '#2E7D32', textColor: '#FFFFFF' },
    { id: 'adj', label: 'Adjective (Blue)', color: '#1565C0', textColor: '#FFFFFF' },
    { id: 'social', label: 'Social (Pink)', color: '#C2185B', textColor: '#FFFFFF' },
    { id: 'misc', label: 'Misc (Orange)', color: '#E65100', textColor: '#FFFFFF' }
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

export const CONTEXT_DEFINITIONS = {
    "School": ["Teacher", "Friend", "Backpack", "Pencil", "Recess", "Bus", "Desk"],
    "Home": ["Mom", "Dad", "Bath", "Bed", "TV", "Toy"],
    "Park": ["Slide", "Swing", "Sand", "Run", "Jump", "Sun"],
    "Mealtime": ["Eat", "Drink", "Spoon", "Fork", "Plate", "Cup", "More", "All Done"]
};
