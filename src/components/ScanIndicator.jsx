import { useEffect, useState } from 'react';
import { getIconPosition } from '../utils/scanPatterns';
import './ScanIndicator.css';

/**
 * Visual indicator component for switch access scanning
 * 
 * Displays an animated border overlay on the currently scanned icon.
 * Follows the scan position with smooth transitions.
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentIndex - Index of currently scanned icon
 * @param {HTMLElement[]} props.icons - Array of icon elements
 * @param {boolean} props.isActive - Whether scanning is active
 */
export default function ScanIndicator({ currentIndex, icons, isActive }) {
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isActive || !icons || icons.length === 0 || currentIndex < 0 || currentIndex >= icons.length) {
            setIsVisible(false);
            return;
        }

        const currentIcon = icons[currentIndex];
        if (!currentIcon) {
            setIsVisible(false);
            return;
        }

        // Get icon position and update indicator
        const iconPos = getIconPosition(currentIcon);
        setPosition(iconPos);
        setIsVisible(true);

        // Update position on window resize
        const handleResize = () => {
            const updatedPos = getIconPosition(currentIcon);
            setPosition(updatedPos);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [currentIndex, icons, isActive]);

    if (!isVisible) return null;

    return (
        <div
            className={`scan-indicator ${isActive ? 'active' : ''}`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                height: `${position.height}px`
            }}
            aria-hidden="true"
        />
    );
}
