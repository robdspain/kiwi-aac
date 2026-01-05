import { useState, useEffect, useCallback, useRef } from 'react';
import { getNextScanIndex, validateScanSpeed } from '../utils/scanPatterns';

/**
 * Custom hook for switch access scanning functionality
 * 
 * Manages auto-scan state, timing, and keyboard input for switch access mode.
 * Provides sequential highlighting of icons with adjustable speed.
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether switch access is enabled
 * @param {number} options.scanSpeed - Time per icon in milliseconds (1000-3000)
 * @param {HTMLElement[]} options.icons - Array of icon elements to scan
 * @param {Function} options.onSelect - Callback when icon is selected
 * @param {boolean} options.audioFeedback - Whether to play beep on scan
 * @returns {Object} Scan state and controls
 */
export function useSwitchScan({
    enabled = false,
    scanSpeed = 1500,
    icons = [],
    onSelect,
    audioFeedback = false
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const intervalRef = useRef(null);
    const audioContextRef = useRef(null);

    // Validate and clamp scan speed
    const validatedSpeed = validateScanSpeed(scanSpeed);

    /**
     * Play audio beep for scan feedback
     */
    const playBeep = useCallback(() => {
        if (!audioFeedback) return;

        try {
            // Create or reuse audio context
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Configure beep sound
            oscillator.frequency.value = 800; // Hz
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1; // Volume (10%)

            // Play short beep
            const now = audioContext.currentTime;
            oscillator.start(now);
            oscillator.stop(now + 0.05); // 50ms beep
        } catch (error) {
            console.warn('Audio feedback failed:', error);
        }
    }, [audioFeedback]);

    /**
     * Advance to next icon in scan sequence
     */
    const advanceScan = useCallback(() => {
        setCurrentIndex(prevIndex => {
            const nextIndex = getNextScanIndex(prevIndex, icons.length, 'forward');
            playBeep();
            return nextIndex;
        });
    }, [icons.length, playBeep]);

    /**
     * Select the currently highlighted icon
     */
    const selectCurrent = useCallback(() => {
        if (currentIndex >= 0 && currentIndex < icons.length && onSelect) {
            onSelect(icons[currentIndex], currentIndex);
        }
    }, [currentIndex, icons, onSelect]);

    /**
     * Start scanning
     */
    const startScan = useCallback(() => {
        setIsScanning(true);
    }, []);

    /**
     * Pause scanning
     */
    const pauseScan = useCallback(() => {
        setIsScanning(false);
    }, []);

    /**
     * Reset scan to beginning
     */
    const resetScan = useCallback(() => {
        setCurrentIndex(0);
        setIsScanning(false);
    }, []);

    /**
     * Auto-advance scan at specified interval
     */
    useEffect(() => {
        if (!enabled || !isScanning || icons.length === 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Start scan interval
        intervalRef.current = setInterval(advanceScan, validatedSpeed);

        // Cleanup on unmount or when dependencies change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, isScanning, validatedSpeed, advanceScan, icons.length]);

    /**
     * Handle keyboard input for switch selection
     */
    useEffect(() => {
        if (!enabled) return;

        function handleKeyDown(event) {
            // Spacebar or Enter selects current icon
            if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                selectCurrent();
            }

            // Escape pauses scan
            if (event.code === 'Escape') {
                event.preventDefault();
                pauseScan();
            }

            // 'S' key starts/resumes scan
            if (event.code === 'KeyS' && !isScanning) {
                event.preventDefault();
                startScan();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, selectCurrent, pauseScan, startScan, isScanning]);

    /**
     * Auto-start scan when enabled
     */
    useEffect(() => {
        if (enabled && icons.length > 0) {
            startScan();
        } else {
            pauseScan();
        }
    }, [enabled, icons.length, startScan, pauseScan]);

    /**
     * Reset scan index when icons change
     */
    useEffect(() => {
        if (currentIndex >= icons.length) {
            setCurrentIndex(0);
        }
    }, [icons.length, currentIndex]);

    /**
     * Cleanup audio context on unmount
     */
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, []);

    return {
        currentIndex,
        isScanning,
        startScan,
        pauseScan,
        resetScan,
        selectCurrent,
        totalIcons: icons.length
    };
}
