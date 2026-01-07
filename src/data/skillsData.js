/**
 * Life Skills Framework (Simplified for Parents & Teachers)
 * Based on Dr. Gregory Hanley's research (Learning Path and Social Skills).
 */

export const SKILLS_PHASES = {
    1: {
        id: 1,
        title: "STEP 1: Simple Request",
        goal: "Ask for things using a simple request (like tapping 'My Way') instead of using difficult behavior.",
        emoji: "🌟",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#BBDEFB;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad1)" rx="40"/>
                <rect x="50" y="60" width="100" height="80" rx="10" fill="#FFFFFF" stroke="#007AFF" stroke-width="4"/>
                <circle cx="100" cy="100" r="25" fill="#4ECDC4"/>
                <path d="M85 100 L115 100 M100 85 L100 115" stroke="white" stroke-width="6" stroke-linecap="round"/>
                <path d="M40 160 Q60 140 80 150 T120 140" stroke="#FF9500" stroke-width="8" fill="none" stroke-linecap="round"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#007AFF">SIMPLE</text>
            </svg>
        `,
        implementation: [
            "Start when your child is motivated for something (a favorite toy or snack).",
            "Immediately show them how to ask using the tablet (tap 'My Way').",
            "Give them the item right away and celebrate!",
            "Stop the fun briefly and repeat to build the habit.",
            "Only reward the request, not the difficult behavior."
        ],
        taskAnalysis: [
            "Create a need to ask (pause play or withhold an item).",
            "Wait 3 seconds for them to initiate.",
            "Provide help (point or guide) if they don't ask.",
            "Immediately reward the request.",
            "Practice until they ask on their own."
        ]
    },
    2: {
        id: 2,
        title: "STEP 2: Polite Request",
        goal: "Use a polite, contextually appropriate request (e.g., “Excuse me, can I have my way, please?”).",
        emoji: "💬",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#F3E5F5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#E1BEE7;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad2)" rx="40"/>
                <path d="M40 100 Q40 60 100 60 T160 100 T100 140 T40 100" fill="white" stroke="#9C27B0" stroke-width="4"/>
                <circle cx="70" cy="100" r="5" fill="#9C27B0"/>
                <circle cx="100" cy="100" r="5" fill="#9C27B0"/>
                <circle cx="130" cy="100" r="5" fill="#9C27B0"/>
                <path d="M100 140 L80 170 L120 155 Z" fill="white" stroke="#9C27B0" stroke-width="2"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#9C27B0">POLITE</text>
            </svg>
        `,
        implementation: [
            "Only reward the improved, polite request.",
            "If they use the simple request, wait or model the polite version.",
            "Slowly stop giving help as they get better at the longer sentence.",
            "Provide the reward immediately once they ask politely."
        ],
        taskAnalysis: [
            "Wait for the polite request before giving the reward.",
            "If they don't say it, model the full sentence.",
            "Give the reward immediately upon the polite request.",
            "Repeat until the polite form is used every time."
        ]
    },
    3: {
        id: 3,
        title: "STEP 3: Learning to Wait",
        goal: "Stay calm when told 'No' or 'Wait' and respond with 'Okay'.",
        emoji: "🧘",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFF3E0;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFE0B2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad3)" rx="40"/>
                <circle cx="100" cy="100" r="50" fill="white" stroke="#FF9500" stroke-width="6"/>
                <path d="M100 65 L100 100 L130 100" stroke="#FF9500" stroke-width="8" stroke-linecap="round" fill="none"/>
                <path d="M70 160 L130 160" stroke="#FF9500" stroke-width="4" stroke-linecap="round"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#E65100">WAITING</text>
            </svg>
        `,
        implementation: [
            "When they ask for something, say 'Not right now' or 'Wait'.",
            "Immediately help them say or tap 'Okay'.",
            "As soon as they say 'Okay', give them the reward anyway!",
            "This teaches that saying 'Okay' leads to good things."
        ],
        taskAnalysis: [
            "Trigger a request, then give the 'Wait' signal.",
            "Wait for them to say 'Okay'.",
            "If they don't, help them say it immediately.",
            "Immediately reward the 'Okay' response."
        ]
    },
    4: {
        id: 4,
        title: "STEP 4: Giving Things Up",
        goal: "Calmly give up a favorite item (like the iPad) when asked by an adult.",
        emoji: "📥",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E8F5E9;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#C8E6C9;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad4)" rx="40"/>
                <rect x="60" y="70" width="80" height="60" rx="10" fill="white" stroke="#4CAF50" stroke-width="4"/>
                <path d="M80 140 L100 170 L120 140" fill="#4CAF50"/>
                <circle cx="100" cy="100" r="15" fill="#4CAF50" opacity="0.3"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#2E7D32">GIVING UP</text>
            </svg>
        `,
        implementation: [
            "Say, “Give me the tablet” (or toy).",
            "Help them hand it over immediately.",
            "Immediately give it back as the reward for letting go!",
            "Repeat until they hand it over on their own."
        ],
        taskAnalysis: [
            "Ask for the item.",
            "Ensure the child stops what they're doing and looks at you.",
            "Ensure they hand the item over calmly.",
            "Give the item back immediately as the reward."
        ]
    },
    5: {
        id: 5,
        title: "STEP 5: Moving Places",
        goal: "Move from one area to another (like from play to the table) when asked.",
        emoji: "🚶",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E0F2F1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#B2DFDB;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad5)" rx="40"/>
                <path d="M40 150 L160 150" stroke="#009688" stroke-width="4"/>
                <circle cx="60" cy="130" r="10" fill="#009688"/>
                <circle cx="100" cy="130" r="10" fill="#009688" opacity="0.5"/>
                <circle cx="140" cy="130" r="10" fill="#009688" opacity="0.2"/>
                <path d="M70 130 L90 130" stroke="#009688" stroke-width="2" stroke-dasharray="4,2"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#00695C">MOVING</text>
            </svg>
        `,
        implementation: [
            "Signal a transition (e.g., “Let’s go to the table.”).",
            "Help them stand up and walk to the new spot.",
            "Give them their favorite item once they arrive and sit down.",
            "Vary where you go (table, couch, outside)."
        ],
        taskAnalysis: [
            "Give the instruction to move.",
            "Help them stand and walk to the target spot.",
            "Ensure they sit or get ready for instruction.",
            "Immediately reward with their favorite item."
        ]
    },
    6: {
        id: 6,
        title: "STEP 6: Doing a Task",
        goal: "Complete 1 to 3 simple tasks before getting a reward.",
        emoji: "🧩",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFDE7;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFF9C4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad6)" rx="40"/>
                <rect x="50" y="70" width="40" height="40" rx="8" fill="#FBC02D" stroke="#F57F17" stroke-width="2"/>
                <rect x="110" y="70" width="40" height="40" rx="8" fill="white" stroke="#FBC02D" stroke-width="2"/>
                <path d="M95 90 L105 90" stroke="#F57F17" stroke-width="4" stroke-linecap="round"/>
                <text x="100" y="160" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#F57F17">1 TASK</text>
            </svg>
        `,
        implementation: [
            "Present a very short activity (e.g., throwing a ball, matching a color).",
            "Help them finish the task quickly.",
            "Immediately give the reward once the task is done.",
            "Gradually increase to 2 or 3 small steps."
        ],
        taskAnalysis: [
            "Ask them to do a simple task (e.g., 'Touch the cat').",
            "Ensure they complete it correctly.",
            "Repeat for 1-2 more steps if appropriate.",
            "Immediately reward completion."
        ]
    },
    7: {
        id: 7,
        title: "STEP 7: Doing Multiple Tasks",
        goal: "Complete tasks across different activities (like table work then circle time).",
        emoji: "📚",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FBE9E7;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFCCBC;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad7)" rx="40"/>
                <rect x="40" y="80" width="30" height="30" rx="5" fill="#FF5722"/>
                <circle cx="100" cy="95" r="15" fill="#FF5722"/>
                <rect x="140" y="80" width="30" height="30" rx="5" fill="#FF5722"/>
                <path d="M70 95 L85 95 M115 95 L140 95" stroke="#FF5722" stroke-width="2" stroke-dasharray="4,2"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#BF360C">TASKS</text>
            </svg>
        `,
        implementation: [
            "Link two different activities together (e.g., matching colors then walking to circle).",
            "Ensure they finish both parts before getting the reward.",
            "Slowly build up the chain of tasks.",
            "Always reward immediately after the last step."
        ],
        taskAnalysis: [
            "Finish Step A (e.g., academic task).",
            "Transition to Step B (e.g., group activity).",
            "Complete Step B tasks.",
            "Reward with the favorite item."
        ]
    },
    8: {
        id: 8,
        title: "STEP 8: More Working Time",
        goal: "Stay focused and complete longer sequences of work (10+ responses).",
        emoji: "📈",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad8" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E1F5FE;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#B3E5FC;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad8)" rx="40"/>
                <path d="M40 140 L60 110 L80 130 L100 90 L120 110 L140 70 L160 90" stroke="#0288D1" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="160" cy="90" r="8" fill="#0288D1"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#01579B">WORKING</text>
            </svg>
        `,
        implementation: [
            "Introduce longer sequences of tasks (e.g., a full classroom routine).",
            "Change up the tasks so they stay interested.",
            "Give the reward at unpredictable times (every 5 to 10 tasks).",
            "This builds endurance for school and therapy."
        ],
        taskAnalysis: [
            "Complete a sequence of matching or sorting.",
            "Move to a new activity (like calendar time).",
            "Answer several questions or follow directions.",
            "Provide the reward after the full sequence."
        ]
    },
    9: {
        id: 9,
        title: "STEP 9: Staying Flexible",
        goal: "Stay calm and keep working even when things get difficult or change.",
        emoji: "🛡️",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#EFEBE9;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#D7CCC8;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#grad9)" rx="40"/>
                <path d="M100 60 L150 90 L150 140 L100 170 L50 140 L50 90 Z" fill="white" stroke="#795548" stroke-width="4"/>
                <path d="M100 90 L100 125" stroke="#FF3B30" stroke-width="8" stroke-linecap="round"/>
                <circle cx="100" cy="145" r="5" fill="#FF3B30"/>
                <text x="100" y="45" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#3E2723">FLEXIBLE</text>
            </svg>
        `,
        implementation: [
            "Introduce common challenges (like making a mistake or a short delay).",
            "Help them accept corrections or wait for a bit longer.",
            "Reward them for staying calm despite the challenge.",
            "This is the ultimate goal for independence!"
        ],
        taskAnalysis: [
            "Respond to a task and encounter a mistake or delay.",
            "Help them accept the correction without frustration.",
            "Finish the rest of the sequence.",
            "Reward after completing the sequence calmly."
        ]
    }
};

export const LIFE_SKILLS = {
    1: {
        id: 1,
        title: "Responding to Name",
        goal: "When you call their name, they stop what they're doing and answer with 'Yes?'",
        emoji: "👂",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E8F5E9;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#C8E6C9;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL1)" rx="40"/>
                <path d="M60 100 Q60 70 100 70 T140 100" stroke="#2E7D32" stroke-width="6" fill="none"/>
                <circle cx="100" cy="110" r="20" fill="#2E7D32"/>
                <text x="100" y="160" font-family="Arial" font-size="16" font-weight="900" text-anchor="middle" fill="#1B5E20">"YES?"</text>
            </svg>
        `,
        procedure: [
            "Start during a routine your child enjoys (like play time).",
            "Call your child's name from a short distance away.",
            "Wait about 3 seconds for them to look at you.",
            "If they don't look, gently tap their shoulder or gesture to look.",
            "Help them say 'Yes' or tap the 'Yes' icon on the tablet.",
            "Immediately celebrate and give them a high five or their favorite toy!"
        ],
        prompting: "Use physical touch → Pointing → Verbal model → Short wait.",
        reinforcement: "Specific praise ('Thanks for answering!') and a quick turn with a favorite activity.",
        exchangeTip: "Use the 'Yes' icon (Communication Exchange Stage 5).",
        connection: "Practice during Step 2 or 3 of the learning path."
    },
    2: {
        id: 2,
        title: "Gaining Attention Nicely",
        goal: "Using 'Excuse me' to get an adult's attention when they are busy.",
        emoji: "🙋‍♂️",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFF3E0;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFE0B2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL2)" rx="40"/>
                <circle cx="130" cy="80" r="25" fill="#E65100" opacity="0.2"/>
                <path d="M50 150 L80 100 L110 150" stroke="#EF6C00" stroke-width="8" fill="none" stroke-linecap="round"/>
                <text x="100" y="50" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#E65100">EXCUSE ME</text>
            </svg>
        `,
        procedure: [
            "Pretend to be busy (looking at your phone or talking to someone).",
            "When your child tries to grab you or take something, gently block them.",
            "Point to the 'Excuse me' icon on the tablet.",
            "Once they tap it or say it, immediately stop what you're doing and listen.",
            "Respond to their request right away!"
        ],
        prompting: "Model words → Point to icon → Gentle hand-over-hand help → Fade help quickly.",
        reinforcement: "Your full, immediate attention and praise ('Thanks for asking nicely!').",
        exchangeTip: "Use the 'Excuse me' icon (Communication Exchange Stage 4-5).",
        connection: "Practice before making requests in Step 1 or 2."
    },
    3: {
        id: 3,
        title: "Accepting 'No' from Friends",
        goal: "Staying calm and saying 'Okay' when a friend or sibling says they can't play yet.",
        emoji: "🤝",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E3F2FD;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#BBDEFB;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL3)" rx="40"/>
                <circle cx="70" cy="100" r="20" fill="#1976D2"/>
                <circle cx="130" cy="100" r="20" fill="#42A5F5"/>
                <path d="M100 100 L100 130" stroke="#1976D2" stroke-width="4" stroke-dasharray="4,4"/>
                <text x="100" y="170" font-family="Arial" font-size="16" font-weight="900" text-anchor="middle" fill="#0D47A1">"OKAY"</text>
            </svg>
        `,
        procedure: [
            "Practice during play with another child or adult acting as a peer.",
            "The peer says 'No, I'm using it' when your child asks for a toy.",
            "Prompt your child to tap the 'Okay' icon or say 'Okay'.",
            "Immediately suggest a different fun thing to do or a new toy to pick.",
            "Celebrate how calm and flexible they are!"
        ],
        prompting: "Model the response → Tap icon → Gesture to another toy → Fade help.",
        reinforcement: "Big praise for staying calm and immediate access to a different fun activity.",
        exchangeTip: "Use the 'Okay' icon (Communication Exchange Stage 5).",
        connection: "Embedded in Step 9 or peer play."
    },
    4: {
        id: 4,
        title: "Saying 'Thank You'",
        goal: "Learning to say 'Thank you' after getting help or receiving an item.",
        emoji: "🙏",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FCE4EC;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#F8BBD0;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL4)" rx="40"/>
                <path d="M100 60 L80 140 L120 140 Z" fill="#C2185B"/>
                <path d="M70 80 Q100 50 130 80" stroke="#C2185B" stroke-width="6" fill="none"/>
                <text x="100" y="175" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#880E4F">THANK YOU</text>
            </svg>
        `,
        procedure: [
            "Wait for your child to request something or help them with a task.",
            "After you give the item or help, pause for 2-3 seconds.",
            "If they don't say it, point to the 'Thank You' icon or model the word.",
            "Smile and say 'You're welcome!' to complete the social loop."
        ],
        prompting: "Model words → Point to icon → Use a short wait time (delay).",
        reinforcement: "Warm praise, a high five, and a 'You're welcome!'.",
        exchangeTip: "Use the 'Thank you' icon (Communication Exchange Stage 5-6).",
        connection: "Practice after any successful request in Steps 3-5."
    },
    5: {
        id: 5,
        title: "Greeting Friends",
        goal: "Saying 'Hi' when they see friends or teachers.",
        emoji: "👋",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL5" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#F3E5F5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#E1BEE7;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL5)" rx="40"/>
                <path d="M100 140 Q130 140 130 110 T100 80 T70 110 T100 140" fill="white" stroke="#7B1FA2" stroke-width="4"/>
                <path d="M130 110 L160 80" stroke="#7B1FA2" stroke-width="8" stroke-linecap="round"/>
                <text x="100" y="55" font-family="Arial" font-size="18" font-weight="900" text-anchor="middle" fill="#4A148C">HI!</text>
            </svg>
        `,
        procedure: [
            "Practice when arriving at school or seeing a friend at the park.",
            "Use a gesture (wave) and point to the 'Hi' icon on the tablet.",
            "Encourage the peer to wave back or say 'Hi' in return.",
            "Help your child join in whatever the friend is doing."
        ],
        prompting: "Wave gesture → Tap 'Hi' icon → Use peer modeling.",
        reinforcement: "Natural peer interaction and joining in the fun.",
        exchangeTip: "Use the 'Hi' icon (Communication Exchange Stage 6).",
        connection: "Practice during transitions in Step 4 or 5."
    },
    6: {
        id: 6,
        title: "Offering & Sharing",
        goal: "Starting to share by offering a toy to a friend.",
        emoji: "🎁",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL6" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#E0F2F1;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#B2DFDB;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL6)" rx="40"/>
                <rect x="70" y="80" width="60" height="60" rx="5" fill="#009688"/>
                <path d="M70 110 L130 110 M100 80 L100 140" stroke="white" stroke-width="4"/>
                <path d="M130 110 L160 110" stroke="#00796B" stroke-width="6" stroke-linecap="round" stroke-dasharray="5,5"/>
                <text x="100" y="50" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#004D40">FOR YOU</text>
            </svg>
        `,
        procedure: [
            "Set up a turn-taking activity like blocks or a puzzle.",
            "Prompt your child to hand a piece to a peer.",
            "Help them say or tap 'Do you want this?' on the tablet.",
            "Let the peer accept it and say 'Thank you'.",
            "Praise your child for being a great friend!"
        ],
        prompting: "Gesture to item → Point to peer → Model phrase → Icon use.",
        reinforcement: "Seeing the friend happy and getting social praise.",
        exchangeTip: "Use the 'Do you want this?' icon (Communication Exchange Stage 6).",
        connection: "Practice during play in Step 6 or 7."
    },
    7: {
        id: 7,
        title: "Comforting Others",
        goal: "Showing kindness when a friend is sad or upset.",
        emoji: "❤️",
        image: `
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradL7" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFFDE7;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFF9C4;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="200" height="200" fill="url(#gradL7)" rx="40"/>
                <path d="M100 80 C80 50 50 70 100 120 C150 70 120 50 100 80" fill="#F44336"/>
                <path d="M60 140 L140 140" stroke="#FBC02D" stroke-width="8" stroke-linecap="round"/>
                <text x="100" y="175" font-family="Arial" font-size="14" font-weight="900" text-anchor="middle" fill="#F57F17">KINDNESS</text>
            </svg>
        `,
        procedure: [
            "Use puppets or model a 'sad' situation (crying or sighing).",
            "Prompt your child to say 'It's okay' or offer a hug/toy.",
            "Use icons like 'Are you okay?' or 'It's okay' on the tablet.",
            "The person being comforted should smile and look happy."
        ],
        prompting: "Model the behavior → Point to cues → Role-play with toys.",
        reinforcement: "Heartfelt praise ('That was so kind!') and social connection.",
        exchangeTip: "Use 'It's okay' icons (Communication Exchange Stage 6).",
        connection: "Embedded in Step 9 or natural opportunities."
    }
};

export const SKILLS_ASSESSMENT_QUESTIONS = [
    {
        id: 'fcr',
        question: "Can your child ask for things simply (like tapping 'My Way') instead of getting frustrated?",
        phasesIfNo: [1, 2]
    },
    {
        id: 'complex_fcr',
        question: "Does your child use full sentences or polite requests (e.g., 'Excuse me, can I have my way?')?",
        phasesIfNo: [2]
    },
    {
        id: 'toleration',
        question: "Can your child hear 'No' or 'Wait' without having a problem behavior?",
        phasesIfNo: [3]
    },
    {
        id: 'relinquish',
        question: "Does your child calmly give up favorite items (like an iPad) when asked?",
        phasesIfNo: [4]
    },
    {
        id: 'transition',
        question: "Can your child move between different areas (e.g., play to table) without resisting?",
        phasesIfNo: [5]
    },
    {
        id: 'cooperation',
        question: "Can your child complete multiple tasks in a row before getting a reward?",
        phasesIfNo: [6, 7, 8, 9]
    }
];
