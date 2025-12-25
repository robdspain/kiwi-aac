export const BELL_SOUNDS = [
    { id: 'traditional', name: 'Classic Bell (Default)', path: '/sounds/bells/bell-traditional.mp3' },
    { id: 'school', name: 'School Bell', path: '/sounds/bells/school-bell.mp3' },
    { id: 'transition', name: 'Soft Chime', path: '/sounds/bells/bell-transition.mp3' },
    { id: 'notification', name: 'Notification', path: '/sounds/bells/bell-notification.mp3' },
];

/**
 * Plays a bell sound.
 */
export const playBellSound = (bellId = 'traditional') => {
    const selectedBell = BELL_SOUNDS.find(b => b.id === bellId) || BELL_SOUNDS[0];

    if (selectedBell.path) {
        const audio = new Audio(selectedBell.path);
        audio.play().catch(e => console.error("Error playing bell sound:", e));
    }
};