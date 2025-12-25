export const BELL_SOUNDS = [
    { id: 'synthetic', name: 'Classic Chime (Default)' },
    { id: 'school', name: 'School Bell', path: '/sounds/bells/school-bell.mp3' },
    { id: 'transition', name: 'Transition Bell', path: '/sounds/bells/bell-transition.mp3' },
    { id: 'traditional', name: 'Traditional Bell', path: '/sounds/bells/bell-traditional.mp3' },
    { id: 'bike', name: 'Bike Bell', path: '/sounds/bells/bike-bell.mp3' },
    { id: 'notification', name: 'Notification Bell', path: '/sounds/bells/bell-notification.mp3' },
];

/**
 * Plays a bell sound. Defaults to high-quality synthetic bell if no ID is provided.
 */
export const playBellSound = (bellId = 'synthetic') => {
    const selectedBell = BELL_SOUNDS.find(b => b.id === bellId) || BELL_SOUNDS[0];

    if (selectedBell.id === 'synthetic') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;

        const fundamental = 523.25;
        const partials = [
            { ratio: 1.0, gain: 0.6, decay: 2.5 },
            { ratio: 2.0, gain: 0.2, decay: 2.0 },
            { ratio: 3.0, gain: 0.1, decay: 1.5 },
            { ratio: 4.2, gain: 0.05, decay: 1.0 },
            { ratio: 5.4, gain: 0.03, decay: 0.8 }
        ];

        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.setValueAtTime(0.4, now);

        partials.forEach(p => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(fundamental * p.ratio, now);
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.linearRampToValueAtTime(p.gain, now + 0.02);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + p.decay);
            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + p.decay + 0.1);
        });
    } else if (selectedBell.path) {
        const audio = new Audio(selectedBell.path);
        audio.play().catch(e => console.error("Error playing bell sound:", e));
    }
};