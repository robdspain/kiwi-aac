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

    const gridClass =
        currentPhase === 1 ? 'phase-single-grid' :
            currentPhase === 3 ? 'phase-discrimination-grid' : '';

    return (
        <div id="grid-container" className={gridClass}>
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

