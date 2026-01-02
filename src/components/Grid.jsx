
import AppItem from './AppItem';
import VisualSchedule from './VisualSchedule';
import AvatarRenderer from './AvatarRenderer';
import {
    SortableContext,
    rectSortingStrategy
} from '@dnd-kit/sortable';

const Grid = ({
    items,
    currentPhase = 0,
    gridSize = 'auto',
    isTrainingMode,
    trainingSelection,
    isEditMode,
    onItemClick,
    onBack,
    onDelete,
    onEdit,
    onAddItem,
    onToggleTraining,
    hasBack,
    trainingPanelVisible,
    folder // New prop: currently open folder object
}) => {
    // If we're inside a folder and it's in schedule mode, show the VisualSchedule view
    if (folder && folder.type === 'folder' && folder.viewMode === 'schedule') {
        return <VisualSchedule folder={folder} onBack={onBack} />;
    }

    // Logic for Large 2x2 Grid
    // Phase 1 & 2: Always 2x2
    // Phase 3: 2x2 if <= 4 items, otherwise standard shrink
    const useLargeGrid = (currentPhase === 1 || currentPhase === 2) || (currentPhase === 3 && items.length <= 4);

    const gridClass = useLargeGrid ? 'phase-large-grid' : '';

    const getGridStyle = () => {
        if (useLargeGrid) return {};

        let cols;
        switch (gridSize) {
            case 'super-big': cols = 2; break;
            case 'big': cols = 3; break;
            case 'standard': cols = 4; break;
            case 'dense': cols = 6; break;
            default: return {}; // Use CSS responsive defaults
        }
        return { gridTemplateColumns: `repeat(${cols}, 1fr)` };
    };

    // Show empty state when no items to display
    if (items.length === 0) {
        return (
            <div id="grid-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🥝</div>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#333',
                    margin: '0 0 12px 0'
                }}>
                    {hasBack ? 'This folder is empty' : 'Let\'s add some icons!'}
                </h2>
                <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    maxWidth: '300px',
                    lineHeight: '1.5',
                    margin: '0 0 24px 0'
                }}>
                    {hasBack
                        ? 'Go back and add items to this folder.'
                        : 'Tap the button below to add your first icon.'}
                </p>
                {!hasBack && (
                    <div
                        onClick={() => onAddItem('', '', 'button')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: '#007AFF', // Solid primary color
                            color: 'white',
                            borderRadius: '30px',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span>➕</span> Add First Button
                    </div>
                )}
            </div>
        );
    }

    return (
        <div id="grid-container" className={gridClass} style={getGridStyle()}>
            {hasBack && !isTrainingMode && (
                <AppItem
                    item={{ id: 'back-btn', word: 'Back', icon: '⬅️', type: 'button' }}
                    isBack={true}
                    onClick={onBack}
                />
            )}

            <SortableContext
                items={items.map(i => i.id || i.word)}
                strategy={rectSortingStrategy}
            >
                {items.map((item, index) => {
                    const isSelected = trainingSelection.includes(index);
                    const displayIcon = item.characterConfig ? (
                        <AvatarRenderer recipe={item.characterConfig} size={useLargeGrid ? 120 : 80} />
                    ) : item.icon;

                    return (
                        <AppItem
                            key={item.id || index}
                            item={{ ...item, icon: displayIcon }}
                            index={index}
                            isEditMode={isEditMode}
                            isTrainingMode={isTrainingMode}
                            isSelected={isSelected}
                            isDimmed={isTrainingMode && !trainingPanelVisible && !isSelected}
                            onClick={onItemClick}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onToggleTraining={onToggleTraining}
                        />
                    );
                })}
            </SortableContext>
        </div>
    );
};

export default Grid;

