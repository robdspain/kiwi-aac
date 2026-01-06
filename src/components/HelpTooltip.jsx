import { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { helpCircleOutline } from 'ionicons/icons';

export default function HelpTooltip({ text }) {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        }
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchend', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchend', handleClickOutside);
        };
    }, [isVisible]);

    return (
        <div
            ref={tooltipRef}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '0.5rem', zIndex: 10 }}
            onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
        >
            <IonIcon
                icon={helpCircleOutline}
                style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    opacity: 0.7
                }}
            />
            {isVisible && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '0.5rem',
                    background: '#333',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    width: '12rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    lineHeight: 1.4,
                    pointerEvents: 'none', // Allow clicks to pass through if needed, though usually we want to capture click to close
                }}>
                    {text}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderWidth: '6px',
                        borderStyle: 'solid',
                        borderColor: '#333 transparent transparent transparent'
                    }} />
                </div>
            )}
        </div>
    );
}
