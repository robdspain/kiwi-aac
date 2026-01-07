import { useState, useEffect, useRef } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    IonBadge,
    IonFooter
} from '@ionic/react';
import {
    closeOutline,
    micOutline,
    stopOutline,
    carOutline,
    cubeOutline,
    restaurantOutline,
    waterOutline,
    trendingUpOutline,
    informationCircleOutline
} from 'ionicons/icons';
import { trackTalkSession } from '../utils/AnalyticsService';

const TalkSampler = ({ isOpen, onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [duration, setDuration] = useState(0); // seconds
    const [wordCount, setWordCount] = useState(0);
    const [currentContext, setCurrentContext] = useState('play');
    const [showResults, setShowResults] = useState(false);

    const recognitionRef = useRef(null);
    const timerRef = useRef(null);

    const contexts = [
        { id: 'play', label: 'Playtime', icon: cubeOutline, color: '#34C759', density: 'High' },
        { id: 'car', label: 'Car Ride', icon: carOutline, color: '#007AFF', density: 'Low' },
        { id: 'meal', label: 'Mealtime', icon: restaurantOutline, color: '#FF9500', density: 'High' },
        { id: 'bath', label: 'Bath/Bed', icon: waterOutline, color: '#5856D6', density: 'High' }
    ];

    useEffect(() => {
        if (isListening) {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            startListening();
        } else {
            clearInterval(timerRef.current);
            stopListening();
        }

        return () => {
            clearInterval(timerRef.current);
            stopListening();
        };
    }, [isListening]);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            let totalWords = 0;
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const transcript = event.results[i][0].transcript;
                    totalWords += transcript.trim().split(/\s+/).length;
                }
            }
            if (totalWords > 0) {
                setWordCount(prev => prev + totalWords);
            }
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleFinish = () => {
        setIsListening(false);
        const wpm = duration > 0 ? Math.round((wordCount / (duration / 60))) : 0;

        trackTalkSession({
            duration,
            wordCount,
            wpm,
            context: currentContext
        });

        setShowResults(true);
    };

    const getFeedback = (wpm) => {
        const contextData = contexts.find(c => c.id === currentContext);
        if (wpm > 100) return { title: "Linguistic Gold! 🌟", message: "You are providing a very rich environment. Keep these conversational turns going!" };
        if (wpm > 60) return { title: "Great Interaction! 👍", message: "This is a solid pace for language development. Try to add 1-2 more sentences per minute." };
        return { title: "Good Foundation 🌱", message: `In ${contextData.label}, try to describe more of what you see. Use "Sports Broadcasting" to narrate your actions.` };
    };

    const wpm = duration > 0 ? Math.round((wordCount / (duration / 60))) : 0;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.95]} initialBreakpoint={0.95}>
            <IonHeader className="ion-no-border">
                <IonToolbar style={{ '--background': 'transparent' }}>
                    <IonTitle style={{ fontWeight: '900' }}>Engagement Sampler</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} disabled={isListening}>
                            <IonIcon icon={closeOutline} color="dark" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{
                '--background': 'transparent',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(242,242,247,0.7))',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)'
            }}>
                {!showResults ? (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗣️</div>
                            <h2 style={{ fontWeight: '900', margin: '0' }}>Sample Your Talk</h2>
                            <p style={{ color: '#666', fontSize: '0.95rem', margin: '0.5rem 0' }}>
                                Clinical research shows that the density of words spoken to a child is a top predictor of language growth.
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <IonText color="medium">
                                <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Projected Context</p>
                            </IonText>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                {contexts.map(ctx => (
                                    <div
                                        key={ctx.id}
                                        onClick={() => !isListening && setCurrentContext(ctx.id)}
                                        style={{
                                            padding: '12px 8px',
                                            borderRadius: '16px',
                                            textAlign: 'center',
                                            background: currentContext === ctx.id ? ctx.color : 'white',
                                            color: currentContext === ctx.id ? 'white' : '#1D1D1F',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            boxShadow: currentContext === ctx.id ? `0 10px 20px ${ctx.color}33` : 'none',
                                            transition: 'all 0.3s ease',
                                            opacity: isListening && currentContext !== ctx.id ? 0.5 : 1
                                        }}
                                    >
                                        <IonIcon icon={ctx.icon} style={{ fontSize: '1.5rem', marginBottom: '4px' }} />
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800 }}>{ctx.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'white',
                            borderRadius: '32px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {isListening && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: '4px',
                                    background: '#34C759',
                                    animation: 'pulse-horizontal 2s infinite'
                                }} />
                            )}

                            <div style={{ fontSize: '4rem', fontWeight: 900, color: '#1D1D1F' }}>
                                {wordCount}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#86868B', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                                WORDS ESTIMATED
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700 }}>SESSION</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34C759' }}>{wpm}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#999', fontWeight: 700 }}>WPM</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            {!isListening ? (
                                <IonButton expand="block" onClick={() => setIsListening(true)} style={{
                                    '--background': '#34C759',
                                    '--border-radius': '24px',
                                    height: '70px',
                                    fontWeight: '900',
                                    fontSize: '1.25rem'
                                }}>
                                    <IonIcon icon={micOutline} slot="start" />
                                    START SAMPLING
                                </IonButton>
                            ) : (
                                <IonButton expand="block" onClick={handleFinish} style={{
                                    '--background': '#FF3B30',
                                    '--border-radius': '24px',
                                    height: '70px',
                                    fontWeight: '900',
                                    fontSize: '1.25rem'
                                }}>
                                    <IonIcon icon={stopOutline} slot="start" />
                                    STOP & ANALYZE
                                </IonButton>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✨</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1D1D1F' }}>{getFeedback(wpm).title}</h2>
                        <p style={{ fontSize: '1.1rem', color: '#424245', lineHeight: '1.5', margin: '1rem 0 2rem' }}>
                            {getFeedback(wpm).message}
                        </p>

                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            textAlign: 'left',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #F2F2F7', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: 700 }}>Context</span>
                                <span style={{ color: '#007AFF', fontWeight: 800 }}>{contexts.find(c => c.id === currentContext).label}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #F2F2F7', paddingBottom: '10px' }}>
                                <span style={{ fontWeight: 700 }}>Words Spoken</span>
                                <span style={{ fontWeight: 800 }}>{wordCount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700 }}>Density (WPM)</span>
                                <span style={{ fontWeight: 800, color: '#34C759' }}>{wpm}</span>
                            </div>
                        </div>

                        <IonButton expand="block" onClick={onClose} style={{
                            '--background': '#007AFF',
                            '--border-radius': '20px',
                            height: '60px',
                            fontWeight: '900'
                        }}>
                            Done
                        </IonButton>
                    </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(var(--ion-color-primary-rgb), 0.05)', borderRadius: '20px', border: '1px solid rgba(var(--ion-color-primary-rgb), 0.1)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800 }}>
                        <IonIcon icon={informationCircleOutline} color="primary" />
                        WHY SAMPLE?
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
                        Research by Hart & Risley (1995) proved that the <strong>quality and quantity</strong> of language exposure is the single biggest factor in child IQ and school success. Aim for 80-120 WPM during active play!
                    </p>
                </div>

                <div style={{ height: '3rem' }} />
            </IonContent>
            <style>{`
                @keyframes pulse-horizontal {
                    0% { transform: scaleX(0); opacity: 0; transform-origin: left; }
                    50% { transform: scaleX(1); opacity: 1; transform-origin: left; }
                    50.1% { transform: scaleX(1); opacity: 1; transform-origin: right; }
                    100% { transform: scaleX(0); opacity: 0; transform-origin: right; }
                }
            `}</style>
        </IonModal>
    );
};

export default TalkSampler;
