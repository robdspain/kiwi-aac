// AAC Lexicon - Automated POS Mapping for Fitzgerald Key
// Noun: Yellow, Verb: Green, Adjective: Blue, Social: Pink, Misc: Orange

export const AAC_LEXICON = {
    // --- NOUNS (Yellow) ---
    "apple": { type: "noun" }, "banana": { type: "noun" }, "orange": { type: "noun" }, "cookie": { type: "noun" }, "milk": { type: "noun" }, "water": { type: "noun" },
    "mom": { type: "noun" }, "dad": { type: "noun" }, "teacher": { type: "noun" }, "friend": { type: "noun" }, "baby": { type: "noun" }, "dog": { type: "noun" }, "cat": { type: "noun" },
    "home": { type: "noun" }, "school": { type: "noun" }, "park": { type: "noun" }, "bathroom": { type: "noun" }, "bed": { type: "noun" }, "car": { type: "noun" }, "bus": { type: "noun" },
    "toy": { type: "noun" }, "book": { type: "noun" }, "ball": { type: "noun" }, "pencil": { type: "noun" }, "paper": { type: "noun" }, "phone": { type: "noun" }, "ipad": { type: "noun" },

    // --- VERBS (Green) ---
    "want": { type: "verb", inflections: ["wanting", "wanted", "wants"] },
    "go": { type: "verb", inflections: ["going", "went", "goes"] },
    "stop": { type: "verb", inflections: ["stopping", "stopped", "stops"] },
    "eat": { type: "verb", inflections: ["eating", "ate", "eats"] },
    "drink": { type: "verb", inflections: ["drinking", "drank", "drinks"] },
    "play": { type: "verb", inflections: ["playing", "played", "plays"] },
    "sleep": { type: "verb", inflections: ["sleeping", "slept", "sleeps"] },
    "help": { type: "verb", inflections: ["helping", "helped", "helps"] },
    "see": { type: "verb", inflections: ["seeing", "saw", "sees"] },
    "look": { type: "verb", inflections: ["looking", "looked", "looks"] },
    "like": { type: "verb", inflections: ["liking", "liked", "likes"] },
    "have": { type: "verb", inflections: ["having", "had", "has"] },
    "get": { type: "verb", inflections: ["getting", "got", "gets"] },
    "put": { type: "verb", inflections: ["putting", "put", "puts"] },
    "read": { type: "verb", inflections: ["reading", "read", "reads"] },
    "write": { type: "verb", inflections: ["writing", "wrote", "writes"] },
    "run": { type: "verb", inflections: ["running", "ran", "runs"] },
    "jump": { type: "verb", inflections: ["jumping", "jumped", "jumps"] },
    "swim": { type: "verb", inflections: ["swimming", "swam", "swims"] },
    "walk": { type: "verb", inflections: ["walking", "walked", "walks"] },
    "wash": { type: "verb", inflections: ["washing", "washed", "washes"] },
    "clean": { type: "verb", inflections: ["cleaning", "cleaned", "cleans"] },
    "open": { type: "verb", inflections: ["opening", "opened", "opens"] },
    "close": { type: "verb", inflections: ["closing", "closed", "closes"] },
    "make": { type: "verb", inflections: ["making", "made", "makes"] },
    "listen": { type: "verb", inflections: ["listening", "listened", "listens"] },
    "hear": { type: "verb", inflections: ["hearing", "heard", "hears"] },
    "talk": { type: "verb", inflections: ["talking", "talked", "talks"] },

    // --- ADJECTIVES (Blue) ---
    "happy": { type: "adj" }, "sad": { type: "adj" }, "angry": { type: "adj" }, "mad": { type: "adj" }, "scared": { type: "adj" }, "tired": { type: "adj" }, "sick": { type: "adj" },
    "big": { type: "adj" }, "little": { type: "adj" }, "hot": { type: "adj" }, "cold": { type: "adj" }, "fast": { type: "adj" }, "slow": { type: "adj" }, "loud": { type: "adj" }, "quiet": { type: "adj" },
    "good": { type: "adj" }, "bad": { type: "adj" }, "red": { type: "adj" }, "blue": { type: "adj" }, "green": { type: "adj" }, "yellow": { type: "adj" }, "pink": { type: "adj" }, "purple": { type: "adj" },

    // --- SOCIAL/PRONOUNS (Pink) ---
    "i": { type: "pronoun" }, "me": { type: "pronoun" }, "my": { type: "pronoun" }, "you": { type: "pronoun" }, "your": { type: "pronoun" }, "he": { type: "pronoun" }, "she": { type: "pronoun" },
    "we": { type: "pronoun" }, "they": { type: "pronoun" }, "hello": { type: "social" }, "hi": { type: "social" }, "goodbye": { type: "social" }, "bye": { type: "social" },
    "please": { type: "social" }, "thanks": { type: "social" }, "yes": { type: "social" }, "no": { type: "social" }, "sorry": { type: "social" },

    // --- MISC/PREPOSITIONS (Orange) ---
    "in": { type: "misc" }, "on": { type: "misc" }, "up": { type: "misc" }, "down": { type: "misc" }, "out": { type: "misc" }, "off": { type: "misc" }, "with": { type: "misc" },
    "more": { type: "misc" }, "all done": { type: "misc" }, "finished": { type: "misc" }, "now": { type: "misc" }, "later": { type: "misc" }
};

export const getFitzgeraldColor = (pos) => {
    switch (pos) {
        case 'noun': return '#FFEB3B';
        case 'verb': return '#2E7D32';
        case 'adj': return '#1565C0';
        case 'social': return '#C2185B';
        case 'pronoun': return '#C2185B';
        case 'misc': return '#E65100';
        default: return '#ffffff';
    }
};

export const getFitzgeraldTextColor = (pos) => {
    return (pos === 'noun') ? '#2D3436' : '#FFFFFF';
};
