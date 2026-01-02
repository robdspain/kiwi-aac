import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        info: '#007AFF',
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30'
    };

    return (
        <div
            role="alert"
            aria-live="polite"
            style={{
                position: 'fixed',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: bgColors[type],
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                animation: 'fadeInUp 0.3s ease',
                maxWidth: '90%',
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '500'
            }}
        >
            {message}
        </div>
    );
};

// Toast container to manage multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </>
    );
};

// Hook to manage toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
};

export default Toast;
