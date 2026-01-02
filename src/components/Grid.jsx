
import AppItem from './AppItem';
import VisualSchedule from './VisualSchedule';
import {
    SortableContext,
    rectSortingStrategy
} from '@dnd-kit/sortable';

const Grid = ({
    items = [],
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
    folder, // New prop: currently open folder object
    scanIndex = -1,
    isLayoutLocked = false,
    isColorCodingEnabled = true
}) => {
    // If we're inside a folder and it's in schedule mode, show the VisualSchedule view
    if (folder && folder.type === 'folder' && folder.viewMode === 'schedule') {
        return <VisualSchedule folder={folder} onBack={onBack} />;
    }

    // Logic for Large 2x2 Grid
    // Phase 1 & 2: Always 2x2
    // Phase 3: 2x2 if <= 4 items, otherwise standard shrink
    const useLargeGrid = (currentPhase === 1 || currentPhase === 2) || (currentPhase === 3 && items.length <= 4);

    const gridClass = `${useLargeGrid ? 'phase-large-grid' : ''} size-${gridSize}`;

    // Calculate grid dimensions based on gridSize
    const getGridDimensions = () => {
        if (useLargeGrid) return { rows: 2, cols: 2 };
        switch(gridSize) {
            case 'super-big': return { rows: 2, cols: 2 };
            case 'big': return { rows: 3, cols: 3 };
            case 'standard': return { rows: 4, cols: 4 };
            default: return { rows: 4, cols: 4 };
        }
    };

    const { rows, cols } = getGridDimensions();

    // Show empty state when no items to display
    if (items.length === 0) {
        return (
            <div id="grid-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '2.5rem',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🥝</div>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#333',
                    margin: '0 0 0.75rem 0'
                }}>
                    {hasBack ? 'This folder is empty' : 'Let\'s add some icons!'}
                </h2>
                <p style={{
                    fontSize: '1rem',
                    color: '#666',
                    maxWidth: '18.75rem',
                    lineHeight: '1.5',
                    margin: '0 0 1.5rem 0'
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
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: '#007AFF', // Solid primary color
                            color: 'white',
                            borderRadius: '1.875rem',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                            transition: 'transform 0.2s',
                            minHeight: '2.75rem'
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
        <div 
            id="grid-container" 
            className={gridClass}
            style={!useLargeGrid ? {
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '1rem',
                padding: '1.25rem'
            } : {}}
        >
            <SortableContext
                items={items.map(i => i.id || i.word)}
                strategy={rectSortingStrategy}
            >
                {items.map((item, index) => {
                    const isSelected = trainingSelection.includes(index);
                    const displayIcon = item.image || item.icon;
                    
                    // Support for fixed positioning if item has pos
                    const itemStyle = item.pos ? {
                        gridRowStart: item.pos.r + 1,
                        gridColumnStart: item.pos.c + 1
                    } : {};

                    return (
                        <AppItem
                            key={item.id || index}
                            item={{ ...item, icon: displayIcon }}
                            index={index}
                            isEditMode={isEditMode}
                            isTrainingMode={isTrainingMode}
                            isSelected={isSelected}
                            isDimmed={isTrainingMode && !trainingPanelVisible && !isSelected}
                            isScanned={scanIndex === index}
                            isLocked={isLayoutLocked || !!item.pos}
                            isRevealed={item.isRevealed !== false}
                            isColorCodingEnabled={isColorCodingEnabled}
                            style={itemStyle}
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

