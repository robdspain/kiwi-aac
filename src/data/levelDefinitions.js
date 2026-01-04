/**
 * Kiwi Learning Levels - Expanded 16-level progression system
 * Levels use decimal notation (e.g., 3.2) for granular tracking
 */

// Level definitions with advancement criteria
export const LEVELS = {
    1.1: {
        stage: 1,
        name: 'First Request',
        description: 'Guided hand-over-hand exchange of single icon',
        next: 1.2,
        threshold: 20,
        showStrip: false,
        gridMode: 'single' // Show only target item
    },
    1.2: {
        stage: 1,
        name: 'Independent Exchange',
        description: 'Independently reaching and touching to request',
        next: 2.1,
        threshold: 30,
        showStrip: false,
        gridMode: 'single'
    },
    2.1: {
        stage: 2,
        name: 'Travel',
        description: 'Moving further to give the icon to partner',
        next: 2.2,
        threshold: 20,
        showStrip: false,
        gridMode: 'single'
    },
    2.2: {
        stage: 2,
        name: 'Get Attention',
        description: 'Using bell/tap to get partner attention first',
        next: 3.1,
        threshold: 20,
        showStrip: false,
        gridMode: 'single'
    },
    3.1: {
        stage: 3,
        name: 'Two Icons',
        description: 'Choosing between 2 different items',
        next: 3.2,
        threshold: 20,
        accuracy: 90, // Require 90% accuracy
        showStrip: false,
        gridMode: 'two' // Show 2 items
    },
    3.2: {
        stage: 3,
        name: 'Multiple Icons',
        description: 'Choosing from 5 or more items',
        next: 3.3,
        threshold: 30,
        accuracy: 90,
        showStrip: false,
        gridMode: 'multiple' // Show 5+ items
    },
    3.3: {
        stage: 3,
        name: 'Category Navigation',
        description: 'Finding items inside folders',
        next: 4.1,
        threshold: 20,
        showStrip: false,
        gridMode: 'full' // Full grid with folders
    },
    4.1: {
        stage: 4,
        name: '"I want" + Item',
        description: 'Building two-word requests',
        next: 4.2,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        requireStarter: 'I want'
    },
    4.2: {
        stage: 4,
        name: 'Adding Attributes',
        description: 'Using colors, sizes, numbers in requests',
        next: 4.3,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        requireAttribute: true
    },
    4.3: {
        stage: 4,
        name: 'Extended Sentences',
        description: 'Building 4+ word requests',
        next: 4.4,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        minWords: 4
    },
    4.4: {
        stage: 4,
        name: 'Social Niceties',
        description: 'Adding "please" and "thank you"',
        next: 5.1,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        requireNicety: true // "please" or "thank you" must be included
    },
    5.1: {
        stage: 5,
        name: '"What do you want?"',
        description: 'Answering requests for wants',
        next: 5.2,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        questionPrompt: 'What do you want?'
    },
    5.2: {
        stage: 5,
        name: '"What do you see?"',
        description: 'Describing observations',
        next: 5.3,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        questionPrompt: 'What do you see?'
    },
    5.3: {
        stage: 5,
        name: '"What is it?"',
        description: 'Labeling items',
        next: 6.1,
        threshold: 20,
        showStrip: true,
        gridMode: 'full',
        questionPrompt: 'What is it?'
    },
    6.1: {
        stage: 6,
        name: '"I see"',
        description: 'Using "I see" to comment',
        next: 6.2,
        threshold: 15,
        showStrip: true,
        gridMode: 'full',
        focusStarter: 'I see'
    },
    6.2: {
        stage: 6,
        name: '"I feel"',
        description: 'Expressing emotions',
        next: 6.3,
        threshold: 15,
        showStrip: true,
        gridMode: 'full',
        focusStarter: 'I feel'
    },
    6.3: {
        stage: 6,
        name: '"I have" / "I like"',
        description: 'Commenting about possessions and preferences',
        next: 6.4,
        threshold: 15,
        showStrip: true,
        gridMode: 'full',
        focusStarter: ['I have', 'I like']
    },
    6.4: {
        stage: 6,
        name: 'Mixed Commenting',
        description: 'Spontaneous use of all sentence starters',
        next: null, // Final level
        threshold: 30,
        showStrip: true,
        gridMode: 'full'
    }
};

// Stage metadata for UI display
export const STAGES = {
    1: {
        name: 'Exchange',
        icon: '🤝',
        color: '#2E7D32',
        description: 'Learning to request by exchanging a picture'
    },
    2: {
        name: 'Persistence',
        icon: '📣',
        color: '#1565C0',
        description: 'Getting attention and traveling to communicate'
    },
    3: {
        name: 'Discrimination',
        icon: '🎯',
        color: '#6A1B9A',
        description: 'Selecting the right picture from choices'
    },
    4: {
        name: 'Sentences',
        icon: '💬',
        color: '#E65100',
        description: 'Building multi-word requests with attributes'
    },
    5: {
        name: 'Responding',
        icon: '❓',
        color: '#C2185B',
        description: 'Answering questions about wants and observations'
    },
    6: {
        name: 'Commenting',
        icon: '💭',
        color: '#00838F',
        description: 'Making spontaneous comments about the world'
    }
};

// Ordered list of all levels for iteration
export const LEVEL_ORDER = [
    1.1, 1.2,
    2.1, 2.2,
    3.1, 3.2, 3.3,
    4.1, 4.2, 4.3, 4.4,
    5.1, 5.2, 5.3,
    6.1, 6.2, 6.3, 6.4
];

// Helper functions
export const getLevel = (level) => LEVELS[level] || LEVELS[1.1];
export const getStage = (level) => STAGES[Math.floor(level)] || STAGES[1];
export const getLevelIndex = (level) => LEVEL_ORDER.indexOf(level);
export const getNextLevel = (level) => LEVELS[level]?.next || null;
export const isMaxLevel = (level) => level === 6.4;

// Get sub-level within stage (e.g., 4.2 → 2)
export const getSubLevel = (level) => Math.round((level - Math.floor(level)) * 10);

// Get total sub-levels in a stage
export const getStageSubLevels = (stage) => {
    return LEVEL_ORDER.filter(l => Math.floor(l) === stage).length;
};

// Format level for display
export const formatLevel = (level) => {
    const levelDef = getLevel(level);
    const stage = getStage(level);
    const subLevel = getSubLevel(level);
    const totalSubs = getStageSubLevels(Math.floor(level));

    return {
        full: `Level ${level}`,
        short: `${stage.icon} ${level}`,
        stageName: stage.name,
        levelName: levelDef.name,
        progress: `Step ${subLevel} of ${totalSubs}`
    };
};

// Migration: Convert old integer phase to new decimal level
export const migratePhaseToLevel = (oldPhase) => {
    const mapping = {
        0: 1.1,  // Not started → First Request
        1: 1.2,  // Phase 1 → assume independent exchange
        2: 2.2,  // Phase 2 → Get Attention
        3: 3.2,  // Phase 3 → Multiple Icons
        4: 4.1,  // Phase 4 → I want + Item
        5: 5.1,  // Phase 5 → What do you want
        6: 6.1,  // Phase 6 → I see
    };
    return mapping[oldPhase] ?? 1.1;
};

// Detailed instructions for parents/teachers at each level
export const LEVEL_INSTRUCTIONS = {
    1.1: {
        title: 'First Request',
        emoji: '🤝',
        summary: 'Help your child make their first communication exchange.',
        steps: [
            'Place a highly motivating item (favorite snack or toy) in view but out of reach',
            'Show the matching icon on the screen',
            'Physically guide their hand to tap the icon (hand-over-hand)',
            'Immediately give them the item and celebrate!',
            'Repeat with the same item until they anticipate the exchange'
        ],
        tips: [
            'Use items they REALLY want - motivation is key',
            'Keep sessions short (5-10 minutes)',
            'Always follow through - every tap gets the item'
        ]
    },
    1.2: {
        title: 'Independent Exchange',
        emoji: '👆',
        summary: 'Your child taps the icon on their own without physical guidance.',
        steps: [
            'Set up the same way as before with desired item visible',
            'Wait and watch - give them time to initiate',
            'Fade your physical prompts gradually',
            'Celebrate when they tap independently!',
            'Practice with 3-5 different highly preferred items'
        ],
        tips: [
            'Be patient - some children need more time',
            'Use expectant waiting (look at them, raise eyebrows)',
            'If stuck for 5+ seconds, give a gentle gestural prompt'
        ]
    },
    2.1: {
        title: 'Travel',
        emoji: '🚶',
        summary: 'Your child learns to bring the device to you from a distance.',
        steps: [
            'Start with the device a few feet away from you',
            'Hold the desired item and wait',
            'Encourage them to get the device and tap',
            'Gradually increase the distance over time',
            'Practice in different rooms and settings'
        ],
        tips: [
            'Start with short distances and build up',
            'Make sure you are the one with the item, not near the device',
            'Celebrate the effort of traveling to communicate'
        ]
    },
    2.2: {
        title: 'Get Attention',
        emoji: '🔔',
        summary: 'Your child learns to get your attention before requesting.',
        steps: [
            'Pretend to be busy or looking away',
            'Wait for them to get your attention (tap you, ring bell)',
            'The app has a bell button they can use',
            'Only respond after they get your attention first',
            'Then let them complete the request'
        ],
        tips: [
            'Don\'t make eye contact until they initiate',
            'Practice with multiple communication partners',
            'This skill helps in real-world scenarios'
        ]
    },
    3.1: {
        title: 'Two Icons',
        emoji: '2️⃣',
        summary: 'Your child chooses between two different items.',
        steps: [
            'Display two icons on screen - one preferred, one not',
            'Have both real items available',
            'Let them tap their choice',
            'Give them EXACTLY what they tapped (even if wrong)',
            'This teaches the pictures have meaning!'
        ],
        tips: [
            'Start with very different items (food vs. non-food)',
            'Give what they select - this is how they learn!',
            'Gradually use more similar items as they improve'
        ]
    },
    3.2: {
        title: 'Multiple Icons',
        emoji: '🎯',
        summary: 'Your child selects from 5 or more options.',
        steps: [
            'Show a grid of 5-10 items including their desired one',
            'Ask "What do you want?"',
            'Give them what they select',
            'Add new vocabulary gradually',
            'Include some folders to organize options'
        ],
        tips: [
            'Rotate items to keep it interesting',
            'Add new vocabulary weekly',
            'Practice with different categories (food, toys, activities)'
        ]
    },
    3.3: {
        title: 'Category Navigation',
        emoji: '📁',
        summary: 'Your child finds items inside folders.',
        steps: [
            'Organize icons into category folders (Foods, Toys, etc.)',
            'Show them how to tap a folder to see contents',
            'Practice finding specific items in folders',
            'Use the back button to return home',
            'Add new items to appropriate folders'
        ],
        tips: [
            'Start with just 2-3 folders',
            'Put favorite items in different folders',
            'Model the navigation yourself first'
        ]
    },
    4.1: {
        title: '"I want" + Item',
        emoji: '💬',
        summary: 'Your child builds a two-word sentence.',
        steps: [
            'The sentence strip is now visible at the top',
            'Model: tap "I want", then tap the desired item',
            'The strip shows both words together',
            'Tap the play button to hear the full sentence',
            'Clear the strip and practice again'
        ],
        tips: [
            'Always model the full sequence first',
            'Say the sentence as they build it',
            'Celebrate two-word combos!'
        ]
    },
    4.2: {
        title: 'Adding Attributes',
        emoji: '🎨',
        summary: 'Your child adds describing words like colors and sizes.',
        steps: [
            'Show items that differ in color, size, or number',
            'Model: "I want" + "red" + "ball"',
            'Use the Describe folder to find attributes',
            'Practice with real objects of different colors/sizes',
            'Celebrate longer sentences!'
        ],
        tips: [
            'Start with colors - they are most visual',
            'Have pairs of items that only differ by color',
            'Make attribute selection meaningful (red vs blue cup)'
        ]
    },
    4.3: {
        title: 'Extended Sentences',
        emoji: '📝',
        summary: 'Your child builds sentences with 4 or more words.',
        steps: [
            'Encourage adding multiple attributes',
            'Model: "I want" + "big" + "red" + "ball"',
            'Practice combining different word types',
            'Use real scenarios requiring specific descriptions',
            'Celebrate elaborate requests!'
        ],
        tips: [
            'Create situations that need specific descriptions',
            'Ask clarifying questions to prompt more words',
            'Have similar items that need description to differentiate'
        ]
    },
    4.4: {
        title: 'Social Niceties',
        emoji: '🙏',
        summary: 'Your child adds "please" and "thank you" to requests.',
        steps: [
            'Find "Please" and "Thank you" icons',
            'Model adding "please" at the end of requests',
            'Practice: "I want cookie please"',
            'Encourage "thank you" after receiving items',
            'These can be with or without attributes'
        ],
        tips: [
            '"Please" makes requests more polite',
            'Model these in your own speech',
            'Celebrate social language!'
        ]
    },
    5.1: {
        title: 'Answering "What do you want?"',
        emoji: '❓',
        summary: 'Your child responds to questions about wants.',
        steps: [
            'Ask "What do you want?" before they initiate',
            'Wait for them to build their response',
            'Accept any appropriate answer',
            'Practice at natural times (snack, play)',
            'Vary the tone and timing of your question'
        ],
        tips: [
            'Ask during natural opportunities',
            'Give wait time before repeating',
            'Accept any reasonable response'
        ]
    },
    5.2: {
        title: 'Answering "What do you see?"',
        emoji: '👀',
        summary: 'Your child describes what they observe.',
        steps: [
            'Show interesting pictures or scenes',
            'Ask "What do you see?"',
            'Help them find "I see" and add an item',
            'Practice with books, videos, or window views',
            'Expand their observational vocabulary'
        ],
        tips: [
            'Use picture books as prompts',
            'Point to things in the environment',
            'Celebrate observation and description'
        ]
    },
    5.3: {
        title: 'Answering "What is it?"',
        emoji: '🏷️',
        summary: 'Your child labels items and pictures.',
        steps: [
            'Point to an item and ask "What is it?"',
            'Wait for them to find and tap the label',
            'Practice with flashcards or real objects',
            'Include new vocabulary gradually',
            'Test comprehension and expression'
        ],
        tips: [
            'Start with very familiar items',
            'Practice with both real objects and pictures',
            'Expand vocabulary across categories'
        ]
    },
    6.1: {
        title: 'Commenting with "I see"',
        emoji: '👁️',
        summary: 'Your child spontaneously comments on observations.',
        steps: [
            'Create opportunities to notice things',
            'Model: "I see a bird!"',
            'Encourage them to share observations',
            'Celebrate comments, not just requests',
            'Practice during walks, reading, play'
        ],
        tips: [
            'Commenting is different from requesting',
            'React enthusiastically to comments',
            'Create interesting things to see'
        ]
    },
    6.2: {
        title: 'Expressing Feelings with "I feel"',
        emoji: '😊',
        summary: 'Your child communicates emotions.',
        steps: [
            'Teach feeling words: happy, sad, mad, tired',
            'Model: "I feel happy!"',
            'Ask "How do you feel?" during emotional moments',
            'Validate their feelings when expressed',
            'Use pictures of faces to teach emotions'
        ],
        tips: [
            'Emotional vocabulary takes time',
            'Validate all feelings expressed',
            'Model your own feelings throughout the day'
        ]
    },
    6.3: {
        title: 'Commenting with "I have/I like"',
        emoji: '❤️',
        summary: 'Your child comments about possessions and preferences.',
        steps: [
            'Model: "I have a ball" while holding one',
            'Model: "I like pizza!"',
            'Ask "What do you have?" about their toys',
            'Ask "What do you like?" about preferences',
            'Practice with different categories'
        ],
        tips: [
            'These show personal expression beyond needs',
            'Great for social interaction practice',
            'Celebrate self-expression!'
        ]
    },
    6.4: {
        title: 'Mixed Commenting',
        emoji: '🎉',
        summary: 'Your child uses all sentence starters spontaneously!',
        steps: [
            'Encourage spontaneous communication',
            'Accept any appropriate sentence starter',
            'Practice in natural situations',
            'Generalize across settings and partners',
            'Celebrate this incredible achievement!'
        ],
        tips: [
            'This is the goal - spontaneous communication',
            'Continue expanding vocabulary',
            'You\'ve done amazing work together!'
        ]
    }
};

// Get instructions for a level
export const getLevelInstructions = (level) => LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS[1.1];
