import { useRef, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useSwitchScan } from '../hooks/useSwitchScan';
import { getScannableIcons } from '../utils/scanPatterns';
import ScanIndicator from './ScanIndicator';

/**
 * Switch Access Mode Wrapper Component
 * 
 * Integrates switch access scanning with the AAC grid.
 * Manages scan state, visual indicators, and icon selection.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid content to wrap
 * @param {Function} props.onIconSelect - Callback when icon is selected via switch
 */
export default function SwitchAccessMode({ children, onIconSelect }) {
    const { currentProfile } = useProfile();
    const gridRef = useRef(null);
    const iconsRef = useRef([]);

    // Get switch access settings from profile
    const {
        switchAccessEnabled = false,
        scanSpeed = 1500,
        audioFeedback = false
    } = currentProfile?.accessProfile || {};

    /**
     * Handle icon selection
     */
    const handleSelect = (iconElement, index) => {
        if (!iconElement || !onIconSelect) return;

        // Trigger click event on the icon
        iconElement.click();

        // Call custom handler if provided
        if (onIconSelect) {
            onIconSelect(iconElement, index);
        }
    };

    /**
     * Update scannable icons when grid changes
     */
    useEffect(() => {
        if (!switchAccessEnabled || !gridRef.current) {
            iconsRef.current = [];
            return;
        }

        // Get all scannable icons from grid
        const icons = getScannableIcons(gridRef.current);
        iconsRef.current = icons;

        // Re-scan when grid content changes
        const observer = new MutationObserver(() => {
            const updatedIcons = getScannableIcons(gridRef.current);
            iconsRef.current = updatedIcons;
        });

        observer.observe(gridRef.current, {
            childList: true,
            subtree: true
        });

        return () => observer.disconnect();
    }, [switchAccessEnabled]);

    // Initialize switch scan hook
    const {
        currentIndex,
        isScanning
    } = useSwitchScan({
        enabled: switchAccessEnabled,
        scanSpeed,
        icons: iconsRef.current,
        onSelect: handleSelect,
        audioFeedback
    });

    return (
        <div ref={gridRef} className="switch-access-wrapper" style={{ height: '100%', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}

            {switchAccessEnabled && (
                <ScanIndicator
                    currentIndex={currentIndex}
                    icons={iconsRef.current}
                    isActive={isScanning}
                />
            )}

            {switchAccessEnabled && (
                <div
                    className="switch-access-status"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px' }}
                >
                    {isScanning ? `Scanning icon ${currentIndex + 1} of ${iconsRef.current.length}` : 'Scan paused'}
                </div>
            )}
        </div>
    );
}
