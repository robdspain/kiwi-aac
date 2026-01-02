// AAC Lexicon - Automated POS Mapping for Fitzgerald Key
// Noun: Yellow, Verb: Green, Adjective: Blue, Social: Pink, Misc: Orange

export const AAC_LEXICON = {
    // --- NOUNS (Yellow) ---
    "apple": "noun", "banana": "noun", "orange": "noun", "cookie": "noun", "milk": "noun", "water": "noun",
    "mom": "noun", "dad": "noun", "teacher": "noun", "friend": "noun", "baby": "noun", "dog": "noun", "cat": "noun",
    "home": "noun", "school": "noun", "park": "noun", "bathroom": "noun", "bed": "noun", "car": "noun", "bus": "noun",
    "toy": "noun", "book": "noun", "ball": "noun", "pencil": "noun", "paper": "noun", "phone": "noun", "ipad": "noun",

    // --- VERBS (Green) ---
    "want": "verb", "go": "verb", "stop": "verb", "eat": "verb", "drink": "verb", "play": "verb", "sleep": "verb",
    "help": "verb", "see": "verb", "look": "verb", "like": "verb", "have": "verb", "get": "verb", "put": "verb",
    "read": "verb", "write": "verb", "run": "verb", "jump": "verb", "swim": "verb", "walk": "verb", "wash": "verb",
    "clean": "verb", "open": "verb", "close": "verb", "make": "verb", "listen": "verb", "hear": "verb", "talk": "verb",

    // --- ADJECTIVES (Blue) ---
    "happy": "adj", "sad": "adj", "angry": "adj", "mad": "adj", "scared": "adj", "tired": "adj", "sick": "adj",
    "big": "adj", "little": "adj", "hot": "adj", "cold": "adj", "fast": "adj", "slow": "adj", "loud": "adj", "quiet": "adj",
    "good": "adj", "bad": "adj", "red": "adj", "blue": "adj", "green": "adj", "yellow": "adj", "pink": "adj", "purple": "adj",

    // --- SOCIAL/PRONOUNS (Pink) ---
    "i": "social", "me": "social", "my": "social", "you": "social", "your": "social", "he": "social", "she": "social",
    "we": "social", "they": "social", "hello": "social", "hi": "social", "goodbye": "social", "bye": "social",
    "please": "social", "thanks": "social", "yes": "social", "no": "social", "sorry": "social",

    // --- MISC/PREPOSITIONS (Orange) ---
    "in": "misc", "on": "misc", "up": "misc", "down": "misc", "out": "misc", "off": "misc", "with": "misc",
    "more": "misc", "all done": "misc", "finished": "misc", "now": "misc", "later": "misc"
};

export const getFitzgeraldColor = (pos) => {
    switch (pos) {
        case 'noun': return '#FFEB3B';
        case 'verb': return '#2E7D32';
        case 'adj': return '#1565C0';
        case 'social': return '#C2185B';
        case 'misc': return '#E65100';
        default: return '#ffffff';
    }
};

export const getFitzgeraldTextColor = (pos) => {
    return (pos === 'noun') ? '#2D3436' : '#FFFFFF';
};