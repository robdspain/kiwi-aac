
import { motion, AnimatePresence } from 'framer-motion';

const SentenceStrip = ({
    stripItems = [],
    onClear,
    onPlay,
    onDeleteItem,
    isGoalComplete = false  // New prop to indicate sentence meets level criteria
}) => {
    return (
        <div id="strip-container">
            <div id="sentence-strip">
                <div className="strip-wrapper" id="strip-content">
                    {stripItems.length === 0 ? (
                        <span className="strip-placeholder">
                            Tap icons to build a sentence
                        </span>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {stripItems.map((item, index) => (
                                <motion.div
                                    layout
                                    layoutId={`item-${item.id}-${index}`}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.3,
                                        y: -100,
                                        rotate: -10
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        rotate: 0,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.8
                                        }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        y: -20,
                                        rotate: 5,
                                        transition: {
                                            duration: 0.2
                                        }
                                    }}
                                    key={`${item.id}-${index}`}
                                    className="strip-item"
                                    onClick={() => onDeleteItem && onDeleteItem(index)}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="strip-icon-wrapper">
                                        {typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? (
                                            <img src={item.icon} alt={item.word} className="strip-img" />
                                        ) : (
                                            <span className="strip-emoji">{item.icon}</span>
                                        )}
                                    </div>
                                    <span className="strip-label">{item.word}</span>
                                    <div className="strip-item-remove">✕</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
                
                <div className="strip-actions">
                    <motion.button
                        className={`strip-action-btn speak-btn ${isGoalComplete ? 'goal-complete' : ''}`}
                        onClick={onPlay}
                        disabled={stripItems.length === 0}
                        aria-label="Speak sentence"
                        animate={isGoalComplete ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                                '0 0 0 0 rgba(52, 199, 89, 0)',
                                '0 0 0 8px rgba(52, 199, 89, 0.4)',
                                '0 0 0 0 rgba(52, 199, 89, 0)'
                            ]
                        } : {}}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5
                        }}
                    >
                        🗣️
                    </motion.button>
                    <button 
                        className="strip-action-btn clear-btn" 
                        onClick={onClear}
                        disabled={stripItems.length === 0}
                        aria-label="Clear sentence"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SentenceStrip;
