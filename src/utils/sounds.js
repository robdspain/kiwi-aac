/**
 * Plays a synthetic bell ringing sound using the Web Audio API.
 * This combines multiple sine waves (overtones) and a sharp decay
 * to simulate the metallic timbre of a small bell.
 */
export const playBellSound = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Frequencies for a "tinkling" bell sound (e.g., C6 and its overtones)
    // Higher frequencies and non-integer multiples create a metallic feel
    const frequencies = [1046.50, 1568.00, 2093.00, 2637.00];
    const duration = 1.5;

    frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Initial attack and decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(index === 0 ? 0.3 : 0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    });
};
