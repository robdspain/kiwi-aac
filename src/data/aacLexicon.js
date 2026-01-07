// AAC Lexicon - Automated POS Mapping for Fitzgerald Key with Emojis
// Noun: Yellow, Verb: Green, Adjective: Blue, Social: Pink, Misc: Orange

export const AAC_LEXICON = {
    // --- NOUNS (Yellow) ---
    "apple": { type: "noun", emoji: "🍎" }, "banana": { type: "noun", emoji: "🍌" }, "orange": { type: "noun", emoji: "🍊" }, "cookie": { type: "noun", emoji: "🍪" }, "milk": { type: "noun", emoji: "🥛" }, "water": { type: "noun", emoji: "💧" }, "juice": { type: "noun", emoji: "🧃" }, "pizza": { type: "noun", emoji: "🍕" }, "snack": { type: "noun", emoji: "🥨" },
    "mom": { type: "noun", emoji: "👩" }, "mommy": { type: "noun", emoji: "👩‍🍼" }, "dad": { type: "noun", emoji: "👨" }, "daddy": { type: "noun", emoji: "🧔" }, "teacher": { type: "noun", emoji: "👩‍🏫" }, "friend": { type: "noun", emoji: "🧑" }, "baby": { type: "noun", emoji: "👶" }, "dog": { type: "noun", emoji: "🐶" }, "cat": { type: "noun", emoji: "🐱" }, "grandma": { type: "noun", emoji: "👵" }, "grandpa": { type: "noun", emoji: "👴" },
    "home": { type: "noun", emoji: "🏠" }, "school": { type: "noun", emoji: "🏫" }, "park": { type: "noun", emoji: "🌳" }, "bathroom": { type: "noun", emoji: "🚽" }, "bed": { type: "noun", emoji: "🛏️" }, "car": { type: "noun", emoji: "🚗" }, "bus": { type: "noun", emoji: "🚌" }, "store": { type: "noun", emoji: "🛒" }, "playground": { type: "noun", emoji: "🛝" },
    "toy": { type: "noun", emoji: "🧸" }, "book": { type: "noun", emoji: "📖" }, "ball": { type: "noun", emoji: "⚽" }, "pencil": { type: "noun", emoji: "✏️" }, "paper": { type: "noun", emoji: "📄" }, "phone": { type: "noun", emoji: "📱" }, "ipad": { type: "noun", emoji: "📱" }, "shirt": { type: "noun", emoji: "👕" }, "shoe": { type: "noun", emoji: "👟" }, "shoes": { type: "noun", emoji: "👟" },
    "eye": { type: "noun", emoji: "👁️" }, "nose": { type: "noun", emoji: "👃" },

    // --- VERBS (Green) ---
    "i want": { type: "verb", emoji: "🙋", inflections: ["wanting", "wanted", "wants"] },
    "i see": { type: "verb", emoji: "👀", inflections: ["seeing", "saw", "sees"] },
    "i feel": { type: "verb", emoji: "😊", inflections: ["feeling", "felt", "feels"] },
    "i have": { type: "verb", emoji: "🤲", inflections: ["having", "had", "has"] },
    "i like": { type: "verb", emoji: "❤️", inflections: ["liking", "liked", "likes"] },
    "want": { type: "verb", emoji: "🙋", inflections: ["wanting", "wanted", "wants"] },
    "go": { type: "verb", emoji: "🚶", inflections: ["going", "went", "goes"] },
    "stop": { type: "verb", emoji: "🛑", inflections: ["stopping", "stopped", "stops"] },
    "eat": { type: "verb", emoji: "😋", inflections: ["eating", "ate", "eats"] },
    "drink": { type: "verb", emoji: "🥤", inflections: ["drinking", "drank", "drinks"] },
    "play": { type: "verb", emoji: "🏃", inflections: ["playing", "played", "plays"] },
    "sleep": { type: "verb", emoji: "😴", inflections: ["sleeping", "slept", "sleeps"] },
    "help": { type: "verb", emoji: "🙋", inflections: ["helping", "helped", "helps"] },
    "see": { type: "verb", emoji: "👀", inflections: ["seeing", "saw", "sees"] },
    "look": { type: "verb", emoji: "👀", inflections: ["looking", "looked", "looks"] },
    "like": { type: "verb", emoji: "❤️", inflections: ["liking", "liked", "likes"] },
    "have": { type: "verb", emoji: "🤲", inflections: ["having", "had", "has"] },
    "get": { type: "verb", emoji: "🤲", inflections: ["getting", "got", "gets"] },
    "put": { type: "verb", emoji: "📥", inflections: ["putting", "put", "puts"] },
    "read": { type: "verb", emoji: "📖", inflections: ["reading", "read", "reads"] },
    "write": { type: "verb", emoji: "✏️", inflections: ["writing", "wrote", "writes"] },
    "run": { type: "verb", emoji: "🏃", inflections: ["running", "ran", "runs"] },
    "jump": { type: "verb", emoji: "🦘", inflections: ["jumping", "jumped", "jumps"] },
    "swim": { type: "verb", emoji: "🏊", inflections: ["swimming", "swam", "swims"] },
    "walk": { type: "verb", emoji: "🚶", inflections: ["walking", "walked", "walks"] },
    "wash": { type: "verb", emoji: "🧼", inflections: ["washing", "washed", "washes"] },
    "clean": { type: "verb", emoji: "🧹", inflections: ["cleaning", "cleaned", "cleans"] },
    "open": { type: "verb", emoji: "🔓", inflections: ["opening", "opened", "opens"] },
    "close": { type: "verb", emoji: "🔒", inflections: ["closing", "closed", "closes"] },
    "make": { type: "verb", emoji: "🛠️", inflections: ["making", "made", "makes"] },
    "listen": { type: "verb", emoji: "👂", inflections: ["listening", "listened", "listens"] },
    "hear": { type: "verb", emoji: "👂", inflections: ["hearing", "heard", "hears"] },
    "talk": { type: "verb", emoji: "🗣️", inflections: ["talking", "talked", "talks"] },
    "sing": { type: "verb", emoji: "🎤", inflections: ["singing", "sang", "sings"] },
    "dance": { type: "verb", emoji: "💃", inflections: ["dancing", "danced", "dances"] },
    "draw": { type: "verb", emoji: "🎨", inflections: ["drawing", "drew", "draws"] },
    "find": { type: "verb", emoji: "🔍", inflections: ["finding", "found", "finds"] },
    "give": { type: "verb", emoji: "🎁", inflections: ["giving", "gave", "gives"] },
    "take": { type: "verb", emoji: "🤲", inflections: ["taking", "took", "takes"] },
    "tell": { type: "verb", emoji: "🗣️", inflections: ["telling", "told", "tells"] },
    "think": { type: "verb", emoji: "💭", inflections: ["thinking", "thought", "thinks"] },
    "know": { type: "verb", emoji: "🧠", inflections: ["knowing", "knew", "knows"] },

    // --- ADJECTIVES (Blue) ---
    "happy": { type: "adj", emoji: "😄" }, "sad": { type: "adj", emoji: "😢" }, "angry": { type: "adj", emoji: "😠" }, "mad": { type: "adj", emoji: "😠" }, "scared": { type: "adj", emoji: "😨" }, "tired": { type: "adj", emoji: "😴" }, "sick": { type: "adj", emoji: "🤒" },
    "big": { type: "adj", emoji: "🐘" }, "little": { type: "adj", emoji: "🐜" }, "hot": { type: "adj", emoji: "🔥" }, "cold": { type: "adj", emoji: "❄️" }, "fast": { type: "adj", emoji: "⚡" }, "slow": { type: "adj", emoji: "🐢" }, "loud": { type: "adj", emoji: "📢" }, "quiet": { type: "adj", emoji: "🤫" },
    "good": { type: "adj", emoji: "👍" }, "bad": { type: "adj", emoji: "👎" }, "red": { type: "adj", emoji: "🔴" }, "blue": { type: "adj", emoji: "🔵" }, "green": { type: "adj", emoji: "🟢" }, "yellow": { type: "adj", emoji: "🟡" }, "pink": { type: "adj", emoji: "💗" }, "purple": { type: "adj", emoji: "🟣" },
    "hard": { type: "adj", emoji: "🪨" }, "soft": { type: "adj", emoji: "☁️" }, "smooth": { type: "adj", emoji: "🧊" }, "bumpy": { type: "adj", emoji: "🐊" }, "same": { type: "adj", emoji: "👯" }, "different": { type: "adj", emoji: "🔀" }, "long": { type: "adj", emoji: "🦒" }, "short": { type: "adj", emoji: "🐛" },

    // --- SOCIAL/PRONOUNS (Pink) ---
    "i": { type: "pronoun", emoji: "👤" }, "me": { type: "pronoun", emoji: "👤" }, "my": { type: "pronoun", emoji: "👤" }, "you": { type: "pronoun", emoji: "👤" }, "your": { type: "pronoun", emoji: "👤" }, "he": { type: "pronoun", emoji: "👦" }, "she": { type: "pronoun", emoji: "👧" },
    "we": { type: "pronoun", emoji: "👥" }, "they": { type: "pronoun", emoji: "👥" }, "it": { type: "pronoun", emoji: "📦" }, "that": { type: "pronoun", emoji: "👉" }, "this": { type: "pronoun", emoji: "👈" },
    "hello": { type: "social", emoji: "👋" }, "hi": { type: "social", emoji: "👋" }, "goodbye": { type: "social", emoji: "👋" }, "bye": { type: "social", emoji: "👋" }, "bye-bye": { type: "social", emoji: "👋" }, "uh-oh": { type: "social", emoji: "😮" },
    "sleep": { type: "verb", emoji: "😴", inflections: ["sleeping", "slept", "sleeps"] }, "night-night": { type: "social", emoji: "😴" },

    // --- MISC/PREPOSITIONS (Orange) ---
    "in": { type: "misc", emoji: "📥" }, "on": { type: "misc", emoji: "🔛" }, "up": { type: "misc", emoji: "⬆️" }, "down": { type: "misc", emoji: "⬇️" }, "out": { type: "misc", emoji: "📤" }, "off": { type: "misc", emoji: "📴" }, "with": { type: "misc", emoji: "➕" }, "over": { type: "misc", emoji: "⤴️" }, "under": { type: "misc", emoji: "⤵️" },
    "more": { type: "misc", emoji: "➕" }, "all gone": { type: "misc", emoji: "🏁" }, "all done": { type: "misc", emoji: "🏁" }, "finished": { type: "misc", emoji: "🏁" }, "now": { type: "misc", emoji: "⏰" }, "later": { type: "misc", emoji: "⏳" }, "again": { type: "misc", emoji: "🔄" }, "all": { type: "misc", emoji: "🔢" }, "some": { type: "misc", emoji: "🤏" }, "not": { type: "misc", emoji: "🚫" },

    // --- QUESTIONS (Purple) ---
    "what": { type: "question", emoji: "❓" }, "where": { type: "question", emoji: "📍" }, "who": { type: "question", emoji: "👤" }, "when": { type: "question", emoji: "⏰" }, "why": { type: "question", emoji: "❓" }, "how": { type: "question", emoji: "⚙️" }
};

export const getFitzgeraldColor = (pos) => {
    switch (pos) {
        case 'noun': return '#FFEB3B';
        case 'verb': return '#1B5E20';
        case 'adj': return '#0D47A1';
        case 'social': return '#880E4F';
        case 'pronoun': return '#880E4F';
        case 'misc': return '#BF360C';
        case 'question': return '#4A148C';
        default: return '#ffffff';
    }
};

export const getFitzgeraldTextColor = (pos) => {
    return (pos === 'noun') ? '#2D3436' : '#FFFFFF';
};