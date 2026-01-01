
import fs from 'fs';
import path from 'path';
import https from 'https';

const URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';
const OUTPUT_FILE = path.join('src', 'utils', 'emojiData.js');

const fetchEmojis = () => {
    return new Promise((resolve, reject) => {
        https.get(URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
            res.on('error', reject);
        });
    });
};

const formatCategoryName = (cat) => {
    // Map gemoji categories to our desired display names if needed
    // Gemoji categories are usually like "Smileys & Emotion"
    return cat;
};

const run = async () => {
    console.log('Fetching emoji data...');
    try {
        const emojis = await fetchEmojis();
        console.log(`Fetched ${emojis.length} emojis.`);

        const grouped = {};

        // Categories to exclude or handle specially
        const SKINTONES = [
            "Tone: Pale",
            "Tone: Cream White",
            "Tone: Brown",
            "Tone: Dark Brown",
            "Tone: Black"
        ];

        // Initialize desired order or specific categories if we want to enforce an order
        // For now, we'll let them be added as we find them, but we might want to sort them later.
        
        emojis.forEach(item => {
            // item structure: { emoji, description, category, tags, skin_tones? }
            // specific description usually becomes the name
            // e.g. "grinning face"
            
            if (!item.category) return;

            const cat = formatCategoryName(item.category);
            const name = item.description.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '); // Title Case
            
            if (!grouped[cat]) {
                grouped[cat] = [];
            }

            grouped[cat].push({
                name: name,
                emoji: item.emoji
            });
        });

        // Add empty tone categories as they are expected by the app logic
        SKINTONES.forEach(t => {
            grouped[t] = [];
        });

        const fileContent = `export const EMOJI_DATA = ${JSON.stringify(grouped, null, 2)};`;

        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`Successfully wrote emoji data to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error:', error);
    }
};

run();
