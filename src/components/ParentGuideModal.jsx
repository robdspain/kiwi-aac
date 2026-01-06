import { useState } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonGrid, IonRow, IonCol, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonText } from '@ionic/react';
import { bookOutline, chatbubblesOutline, constructOutline, settingsOutline } from 'ionicons/icons';

export default function ParentGuideModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('getting_started');

    const renderContent = () => {
        switch (activeTab) {
            case 'getting_started':
                return (
                    <div style={{ maxWidth: '40rem', margin: '0 auto', color: 'var(--text-primary)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥝</div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome to Kiwi Voice!</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                Your child&apos;s voice, amplified. Here is how to begin.
                            </p>
                        </div>

                        <div style={{ background: 'var(--card-bg)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--gray-border)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0 }}>Step 1: Make it Personal 📸</h3>
                            <p>Using real photos helps children connect symbols to their life. Add photos of family, favorite toys, and foods right away.</p>
                            <div style={{ background: '#F2F2F7', padding: '1rem', borderRadius: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                💡 <strong>Tip:</strong> Go to Edit Mode ✏️, tap a button, and choose &quot;Take Photo&quot;.
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--gray-border)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: 0 }}>Step 2: Use it Yourself (Modeling) 🗣️</h3>
                            <p>The best way to teach is to show. When you say &quot;time to <strong>eat</strong>&quot;, tap the <strong>Eat</strong> button.</p>
                            <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.6 }}>
                                <li>Don&apos;t force them to press it.</li>
                                <li>Just show them how <i>you</i> use it.</li>
                                <li>Keep it fun and pressure-free!</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'modeling':
                return (
                    <div style={{ maxWidth: '40rem', margin: '0 auto', color: 'var(--text-primary)' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>The Power of Modeling</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ background: '#E8F4FC', padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👀</div>
                                <h3 style={{ fontWeight: 700 }}>They Watch</h3>
                                <p style={{ fontSize: '0.9rem' }}>Children learn language by seeing and hearing it used in context.</p>
                            </div>
                            <div style={{ background: '#F0FDF4', padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧠</div>
                                <h3 style={{ fontWeight: 700 }}>They Learn</h3>
                                <p style={{ fontSize: '0.9rem' }}>Over time, they understand that symbols represent real words.</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--card-bg)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid var(--gray-border)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Try this today:</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🥣</span>
                                    <div>During <strong>Breakfast</strong>, model &quot;Eat&quot;, &quot;More&quot;, or &quot;Finished&quot;.</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📖</span>
                                    <div>During <strong>Story time</strong>, model &quot;Look&quot;, &quot;Turn&quot;, or specific characters.</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🚗</span>
                                    <div>Before <strong>Leaving</strong>, model &quot;Go&quot;, &quot;Car&quot;, or &quot;Outside&quot;.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'troubleshooting':
                return (
                    <div style={{ maxWidth: '40rem', margin: '0 auto', color: 'var(--text-primary)' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>Common Questions</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>My child hits the same button repeatedly.</h3>
                            <p style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-border)' }}>
                                This is called &quot;exploring&quot;! They are learning cause and effect. Acknowledge it (&quot;Yes, you said &apos;cookie&apos;!&quot;) but don&apos;t simply give the item if it&apos;s repetitive. You can also ignore behavior that is purely sensory seeking if needed.
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>They aren&apos;t interested in the device.</h3>
                            <p style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-border)' }}>
                                Start with high-motivation items (bubbles, candy, favorite show). If the device only means &quot;work&quot;, they will reject it. Make it the key to their favorite things!
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Should I force their hand?</h3>
                            <p style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-border)' }}>
                                <strong>No.</strong> Hand-over-hand prompting is generally discouraged. Instead, model it yourself or tap near the button to draw attention (gestural prompt).
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle style={{ fontSize: '1.2rem', fontWeight: 800 }}>Parent Guide</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onClose} style={{ fontWeight: 600 }}>Done</IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value)} scrollable>
                        <IonSegmentButton value="getting_started">
                            <IonLabel>Getting Started</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="modeling">
                            <IonLabel>Modeling</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="troubleshooting">
                            <IonLabel>Q&A</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'var(--bg-color)' }}>
                <div style={{ padding: '1rem 0' }}>
                    {renderContent()}
                </div>
            </IonContent>
        </IonModal>
    );
}
