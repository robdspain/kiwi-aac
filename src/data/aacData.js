// AAC Core Vocabulary and Templates

// High-frequency core words (Top 100)
// High-frequency core words (Top 100+)
export const CORE_VOCABULARY = [
    "I", "you", "it", "that", "this", "my", "me", "we", "they", "he", "she",
    "want", "go", "stop", "like", "have", "get", "help", "play", "see", "look", "turn", "make",
    "eat", "drink", "sleep", "read", "write", "run", "jump", "walk", "wash", "open", "close",
    "listen", "hear", "talk", "sing", "dance", "draw", "find", "give", "take", "tell", "think", "know",
    "more", "no", "yes", "not", "all", "some", "finished", "good", "bad", "again",
    "happy", "sad", "angry", "scared", "tired", "sick", "big", "little", "hot", "cold", "fast", "slow",
    "here", "there", "in", "on", "out", "up", "down", "off", "over", "under", "with",
    "what", "where", "who", "when", "why", "how",
    "now", "later", "today", "tomorrow", "yesterday",
    "hello", "goodbye", "please", "thanks", "sorry", "excuse me", "wait",
    "mom", "mommy", "dad", "daddy", "baby", "hi", "bye-bye", "uh-oh", "night-night",
    "eye", "nose", "shoe", "shoes", "all gone", "all done"
];

export const CORE_WORDS_LAYOUT = [
    { word: "I", pos: { r: 0, c: 0 }, wc: "pronoun" },
    { word: "want", pos: { r: 0, c: 1 }, wc: "verb" },
    { word: "more", pos: { r: 0, c: 2 }, wc: "misc" },
    { word: "stop", pos: { r: 0, c: 3 }, wc: "verb" },
    { word: "you", pos: { r: 1, c: 0 }, wc: "pronoun" },
    { word: "go", pos: { r: 1, c: 1 }, wc: "verb" },
    { word: "yes", pos: { r: 1, c: 2 }, wc: "social" },
    { id: 'no', word: "no", pos: { r: 1, c: 3 }, wc: "social" },
    { word: "help", pos: { r: 2, c: 0 }, wc: "verb" },
    { word: "please", pos: { r: 2, c: 2 }, wc: "social" },
    { word: "thanks", pos: { r: 2, c: 3 }, wc: "social" }
];

export const TEMPLATES = {
    "First 100 Words": [
        "I", "you", "it", "that", "this", "my", "me", "we", "they", "he", "she",
        "want", "go", "stop", "like", "have", "get", "help", "play", "see", "look", "turn", "make",
        "eat", "drink", "sleep", "read", "write", "run", "jump", "walk", "wash", "open", "close",
        "listen", "hear", "talk", "sing", "dance", "draw", "find", "give", "take", "tell", "think", "know",
        "more", "no", "yes", "not", "all", "some", "finished", "good", "bad", "again",
        "happy", "sad", "angry", "scared", "tired", "sick", "big", "little", "hot", "cold", "fast", "slow",
        "here", "there", "in", "on", "out", "up", "down", "off", "over", "under", "with",
        "what", "where", "who", "when", "why", "how",
        "now", "later", "today", "hello", "goodbye", "please", "thanks", "sorry",
        "mom", "mommy", "dad", "daddy", "baby", "hi", "bye-bye", "uh-oh", "night-night",
        "eye", "nose", "shoe", "shoes", "all gone", "all done",
        "book", "toy", "ball", "apple", "cookie", "milk", "water", "car", "dog", "cat"
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