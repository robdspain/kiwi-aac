import React from 'react';
import AppItem from './AppItem';
import VisualSchedule from './VisualSchedule';
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
                    return (
                        <AppItem
                            key={item.id || index}
                            item={item}
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

