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

export const CORE_WORDS_LAYOUT = [
    { word: "I", pos: { r: 0, c: 0 }, wc: "pronoun" },
    { word: "want", pos: { r: 0, c: 1 }, wc: "verb" },
    { word: "more", pos: { r: 0, c: 2 }, wc: "misc" },
    { word: "stop", pos: { r: 0, c: 3 }, wc: "verb" },
    { word: "you", pos: { r: 1, c: 0 }, wc: "pronoun" },
    { word: "go", pos: { r: 1, c: 1 }, wc: "verb" },
    { word: "yes", pos: { r: 1, c: 2 }, wc: "social" },
    { word: "no", pos: { r: 1, c: 3 }, wc: "social" },
    { word: "help", pos: { r: 2, c: 0 }, wc: "verb" },
    { word: "please", pos: { r: 2, c: 2 }, wc: "social" },
    { word: "thanks", pos: { r: 2, c: 3 }, wc: "social" }
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

export const CONTEXT_DEFINITIONS = {
    "School": ["Teacher", "Friend", "Backpack", "Pencil", "Recess", "Bus", "Desk"],
    "Home": ["Mom", "Dad", "Bath", "Bed", "TV", "Toy"],
    "Park": ["Slide", "Swing", "Sand", "Run", "Jump", "Sun"],
    "Mealtime": ["Eat", "Drink", "Spoon", "Fork", "Plate", "Cup", "More", "All Done"]
};