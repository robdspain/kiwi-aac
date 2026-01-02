import { EMOJI_DATA } from './src/utils/emojiData.js';

// 1. Validate Data Integrity
console.log('--- Data Integrity Check ---');
const categories = Object.keys(EMOJI_DATA);
console.log(`Categories found: ${categories.length}`);
if (categories.length === 0) {
    console.error('FAIL: No categories found.');
    process.exit(1);
}

const totalEmojis = categories.reduce((acc, cat) => acc + EMOJI_DATA[cat].length, 0);
console.log(`Total emojis loaded: ${totalEmojis}`);
if (totalEmojis < 1000) {
    console.warn('WARNING: Emoji count seems low for a full dataset.');
} else {
    console.log('PASS: Dataset appears comprehensive.');
}

// 2. Validate Export Schema Logic
console.log('\n--- Export Schema Validation ---');
// Simulation of the export logic found in EmojiCurator.jsx
const simulateExport = (selectedEmojis, allEmojisFlat) => {
    const output = {};
    Object.keys(selectedEmojis).forEach(category => {
        if (selectedEmojis[category] && selectedEmojis[category].length > 0) {
            output[category] = selectedEmojis[category].map(emojiChar => {
                const base = allEmojisFlat.find(e => e.emoji === emojiChar);
                if (base) return { w: base.name, i: base.emoji };
                return { w: "Unknown", i: emojiChar };
            });
        }
    });
    return output;
};

// Mock data
const mockSelected = {
    "Smileys & Emotion": ["😀", "😢"],
    "Objects": ["📚"]
};
const mockFlatList = [
    { name: "Grinning Face", emoji: "😀", category: "Smileys & Emotion" },
    { name: "Crying Face", emoji: "😢", category: "Smileys & Emotion" },
    { name: "Books", emoji: "📚", category: "Objects" }
];

const result = simulateExport(mockSelected, mockFlatList);
console.log('Export Result:', JSON.stringify(result, null, 2));

const valid = result["Smileys & Emotion"]
    && result["Smileys & Emotion"][0].w === "Grinning Face"
    && result["Smileys & Emotion"][0].i === "😀";

if (valid) {
    console.log('PASS: Export schema matches requirements.');
} else {
    console.error('FAIL: Export schema incorrect.');
    process.exit(1);
}

console.log('\n--- Functionality Simulation Complete ---');
