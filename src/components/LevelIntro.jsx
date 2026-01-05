import {
    getLevel,
    getStage,
    getLevelInstructions,
    LEVEL_ORDER
} from '../data/levelDefinitions';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonIcon,
    IonBadge,
    IonFooter
} from '@ionic/react';
import { bulbOutline, footstepsOutline } from 'ionicons/icons';

const LevelIntro = ({ level, onComplete, onChangeLevel }) => {
    // Get level definition and instructions
    const levelDef = getLevel(level);
    const stageDef = getStage(level);
    const instructions = getLevelInstructions(level);

    if (!levelDef || !instructions) {
        return null;
    }

    return (
        <IonModal isOpen={true} onDidDismiss={onComplete}>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle>Level {level} Introduction</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={onComplete} color="medium">Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding ion-text-center">
                <div style={{ padding: '1rem 0 1.5rem 0' }}>
                    <IonBadge
                        style={{
                            '--background': stageDef.color + '15',
                            '--color': stageDef.color,
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            border: `1px solid ${stageDef.color}40`
                        }}
                    >
                        {stageDef.icon} Stage {Math.floor(level)}: {stageDef.name}
                    </IonBadge>

                    <h1 style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: '800' }}>
                        {instructions.emoji} Level {level}
                    </h1>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--ion-color-medium)', fontWeight: '600' }}>
                        {instructions.title}
                    </h2>

                    <IonText color="dark">
                        <p style={{ fontSize: '1.15rem', leading: '1.5', margin: '1.5rem 0' }}>
                            {instructions.summary}
                        </p>
                    </IonText>
                </div>

                <div className="ios-setting-card" style={{ textAlign: 'left', overflow: 'hidden' }}>
                    <div style={{
                        padding: '1rem',
                        background: stageDef.color + '10',
                        borderBottom: `1px solid ${stageDef.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <IonIcon icon={footstepsOutline} style={{ color: stageDef.color }} />
                        <IonText style={{ color: stageDef.color, fontWeight: '800', fontSize: '1.1rem' }}>
                            Teaching Steps
                        </IonText>
                    </div>

                    <IonList lines="none">
                        {instructions.steps.map((step, i) => (
                            <IonItem key={i}>
                                <div slot="start" style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: stageDef.color,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>{i + 1}</div>
                                <IonLabel className="ion-text-wrap" style={{ fontSize: '1rem' }}>
                                    {step}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </div>

                {instructions.tips && (
                    <div className="ios-setting-card" style={{ textAlign: 'left', marginTop: '1.5rem', background: 'var(--ion-color-tertiary-tint)', border: '1px solid var(--ion-color-tertiary-shade)' }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IonIcon icon={bulbOutline} color="tertiary" />
                            <IonText color="tertiary">
                                <h4 style={{ margin: 0, fontWeight: '800' }}>Pro Tips</h4>
                            </IonText>
                        </div>
                        <IonList lines="none" style={{ background: 'transparent' }}>
                            {instructions.tips.map((tip, i) => (
                                <IonItem key={i} style={{ '--background': 'transparent' }}>
                                    <div slot="start" style={{ color: 'var(--ion-color-tertiary)', fontSize: '1.2rem' }}>•</div>
                                    <IonLabel className="ion-text-wrap" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                        {tip}
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                )}

                {/* Level Progress Visualizer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    margin: '2rem 0'
                }}>
                    {LEVEL_ORDER.filter(l => Math.floor(l) === Math.floor(level)).map(l => (
                        <div
                            key={l}
                            style={{
                                width: l === level ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: l === level ? stageDef.color : 'var(--ion-color-light-shade)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    ))}
                </div>
            </IonContent>

            <IonFooter className="ion-no-border">
                <IonToolbar className="ion-padding">
                    <IonButton
                        expand="block"
                        onClick={onComplete}
                        style={{
                            '--background': stageDef.color,
                            '--color': 'white',
                            height: '4rem',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Start Level {level}
                    </IonButton>

                    {onChangeLevel && (
                        <IonButton
                            fill="clear"
                            expand="block"
                            onClick={onChangeLevel}
                            color="medium"
                            style={{ fontWeight: '600', marginTop: '0.5rem' }}
                        >
                            Select Another Level
                        </IonButton>
                    )}
                </IonToolbar>
            </IonFooter>
        </IonModal>
    );
};

export default LevelIntro;
