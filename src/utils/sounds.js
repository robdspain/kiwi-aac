/**
 * Plays a high-quality synthetic bell sound using the Web Audio API.
 * Uses additive synthesis with inharmonic partials and careful envelope shaping
 * to create a realistic, pleasing chime/bell tone.
 */
export const playBellSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Fundamental frequency for a pleasant chime (C5 approx)
    const fundamental = 523.25;

    // Partials definition: ratio relative to fundamental, relative gain, and decay duration
    // These ratios approximate a realistic bell structure
    const partials = [
        { ratio: 1.0, gain: 0.6, decay: 2.5 },   // Fundamental
        { ratio: 2.0, gain: 0.2, decay: 2.0 },   // Octave
        { ratio: 3.0, gain: 0.1, decay: 1.5 },   // Fifth above octave
        { ratio: 4.2, gain: 0.05, decay: 1.0 },  // Higher overtone
        { ratio: 5.4, gain: 0.03, decay: 0.8 }   // Sparkle
    ];

    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.4, now); // Master volume

    partials.forEach(p => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * p.ratio, now);

        // Envelope shaping
        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(p.gain, now + 0.02); // Quick soft attack
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + p.decay); // Natural exponential decay

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + p.decay + 0.1);
    });
};