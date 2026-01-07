import { Suspense, lazy } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonText,
    IonFooter
} from '@ionic/react';
import { chevronBackOutline, settingsOutline } from 'ionicons/icons';
import Grid from './Grid';
import SentenceStrip from './SentenceStrip';
const SwitchAccessMode = lazy(() => import('./SwitchAccessMode'));
import { trackSentence } from '../utils/AnalyticsService';
import { DndContext, closestCenter } from '@dnd-kit/core';

const MainCommunicationPage = ({
    currentPath,
    currentContext,
    contexts,
    currentPhase,
    currentLevel,
    showStrip,
    stripItems,
    onClearStrip,
    onSpeakSentence,
    onDeleteItemFromStrip,
    itemsToShow,
    gridSize,
    isTrainingMode,
    trainingSelection,
    isEditMode,
    onItemClick,
    onBack,
    onDelete,
    onEdit,
    onAddItem,
    onOpenPicker,
    onToggleTraining,
    shuffledItems,
    scanIndex,
    isLayoutLocked,
    isColorCodingEnabled,
    isCategorizationEnabled,
    collapsedSections,
    showCategoryHeaders,
    rootItems,
    currentPageIndex,
    onSetPage,
    onToggleSection,
    onToggleMenu,
    showSuccess,
    callActive,
    isCommunicating,
    timerRemaining,
    bellCooldown,
    onBellClick,
    onTalkClick,
    isLocked,
    sensors,
    handleDragEnd,
    currentPageItems
}) => {

    const contextInfo = contexts.find(c => c.id === currentContext);

    // Header Title logic
    const headerTitle = currentPath.length === 0 ? "Home" : currentPath.reduce((acc, i, idx) => {
        if (idx === 0) return rootItems[i].word;
        let list = rootItems;
        for (let j = 0; j < idx; j++) list = list[currentPath[j]].contents;
        return list[i].word;
    }, "");

    return (
        <IonPage id="main-area">
            <IonHeader className="ion-no-border">
                {showStrip && (gridSize !== 'super-big' || localStorage.getItem('kiwi-force-strip') === 'true') && (
                    <SentenceStrip
                        stripItems={stripItems}
                        onClear={onClearStrip}
                        onPlay={() => {
                            const sentence = stripItems.map(i => i.word).join(" ");
                            trackSentence(sentence);
                            onSpeakSentence(stripItems);
                        }}
                        onDeleteItem={onDeleteItemFromStrip}
                        isGoalComplete={(() => {
                            if (!currentLevel || stripItems.length === 0) return false;
                            if (currentLevel === 4.1) return stripItems.length >= 2 && stripItems[0]?.word === "I want";
                            if (currentLevel === 4.2) return stripItems.length >= 3;
                            if (currentLevel >= 4.3) return stripItems.length >= 4;
                            return stripItems.length > 0;
                        })()}
                    />
                )}
                <IonToolbar>
                    {currentPath.length > 0 && (
                        <IonButtons slot="start">
                            <IonButton onClick={onBack}>
                                <IonIcon icon={chevronBackOutline} slot="start" />
                                {currentPath.length === 1 ? 'Home' : 'Back'}
                            </IonButton>
                        </IonButtons>
                    )}
                    <IonTitle>{headerTitle}</IonTitle>
                    <IonButtons slot="end">
                        {currentContext !== 'home' && (
                            <IonText color="primary" className="ion-padding-horizontal">
                                <small style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {contextInfo?.icon} {contextInfo?.label}
                                </small>
                            </IonText>
                        )}
                        {!isLocked && !isEditMode && !isTrainingMode && (
                            <IonButton onClick={onToggleMenu}>
                                <IonIcon icon={settingsOutline} slot="icon-only" />
                            </IonButton>
                        )}
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {showSuccess && (
                    <div className="success-overlay-container">
                        <div className="success-emoji-popup">
                            {currentPhase === 3 ? "🎯" : "🌟"}
                        </div>
                    </div>
                )}

                {currentPhase === 2 && !callActive && !isCommunicating && (
                    <div className="call-overlay">
                        <h2>{timerRemaining > 0 ? "Wait for partner..." : "I have something to say"}</h2>
                        <button
                            className={`call-btn ${bellCooldown ? 'cooldown' : ''}`}
                            disabled={bellCooldown}
                            onClick={onBellClick}
                        >
                            {timerRemaining > 0 ? (
                                <div className="timer-display">
                                    <div className="timer-circle" style={{ background: `conic-gradient(var(--primary) ${timerRemaining * 72}deg, #eee 0deg)` }}>
                                        <span className="timer-text">{timerRemaining}</span>
                                    </div>
                                </div>
                            ) : '🔔'}
                        </button>
                    </div>
                )}

                {callActive && (
                    <div className="call-active-overlay">
                        <button onClick={onTalkClick} className="talk-btn">
                            Let&apos;s talk!
                        </button>
                    </div>
                )}

                <div id="main-grid" role="main" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <Suspense fallback={<div style={{ flex: 1 }} />}>
                            <SwitchAccessMode onIconSelect={onItemClick}>
                                <Grid
                                    items={itemsToShow}
                                    currentPhase={currentPhase}
                                    gridSize={gridSize}
                                    isTrainingMode={isTrainingMode}
                                    trainingSelection={trainingSelection}
                                    isEditMode={isEditMode}
                                    onItemClick={onItemClick}
                                    onBack={onBack}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onAddItem={onAddItem}
                                    onOpenPicker={onOpenPicker}
                                    onToggleTraining={onToggleTraining}
                                    hasBack={currentPath.length > 0}
                                    trainingPanelVisible={!shuffledItems}
                                    folder={currentPath.length > 0 ? currentPath.reduce((acc, i) => acc[i].contents, (rootItems[currentPageIndex]?.items || [])) : null}
                                    scanIndex={scanIndex}
                                    isLayoutLocked={isLayoutLocked}
                                    isColorCodingEnabled={isColorCodingEnabled}
                                    isCategorizationEnabled={isCategorizationEnabled}
                                    collapsedSections={collapsedSections}
                                    showCategoryHeaders={showCategoryHeaders}
                                    pages={rootItems}
                                    currentPageIndex={currentPageIndex}
                                    onSetPage={onSetPage}
                                    onToggleSection={onToggleSection}
                                />
                            </SwitchAccessMode>
                        </Suspense>
                    </DndContext>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MainCommunicationPage;
