import AppItem from './AppItem';
import VisualSchedule from './VisualSchedule';
import { AAC_LEXICON } from '../data/aacLexicon';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SortableContext,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { useProfile } from '../context/ProfileContext';
import { getPxFromMm } from '../utils/imageUtils';

const CATEGORY_METADATA = {
    'core': { label: 'Core Words', color: 'rgba(78, 205, 196, 0.1)', icon: '⭐' },
    'pronoun': { label: 'People', color: 'rgba(194, 24, 91, 0.05)', icon: '👤' },
    'verb': { label: 'Actions', color: 'rgba(46, 125, 50, 0.05)', icon: '🏃' },
    'noun': { label: 'Things', color: 'rgba(255, 235, 59, 0.1)', icon: '📦' },
    'adj': { label: 'Describe', color: 'rgba(21, 101, 192, 0.05)', icon: '🎨' },
    'social': { label: 'Social', color: 'rgba(194, 24, 91, 0.05)', icon: '👋' },
    'question': { label: 'Questions', color: 'rgba(106, 27, 154, 0.05)', icon: '❓' },
    'misc': { label: 'Other', color: 'rgba(230, 81, 0, 0.05)', icon: '✨' },
    'unknown': { label: 'Fringe', color: 'rgba(0, 0, 0, 0.02)', icon: '📂' }
};

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
    isColorCodingEnabled = true,
    isCategorizationEnabled = true,
    collapsedSections = [],
    showCategoryHeaders = true,
    onToggleSection,
    pages = [],
    currentPageIndex = 0,
    onSetPage
}) => {
    const { currentProfile } = useProfile();
    const accessProfile = currentProfile?.accessProfile || { targetSize: 10, spacing: 1.5 };

    // If we're inside a folder and it's in schedule mode, show the VisualSchedule view
    if (folder && folder.type === 'folder' && folder.viewMode === 'schedule') {
        return <VisualSchedule folder={folder} onBack={onBack} />;
    }

    // Logic for Large 2x2 Grid
    // Phase 1 & 2: Always 2x2
    // Phase 3: 2x2 if <= 4 items, otherwise standard shrink
    const useLargeGrid = (currentPhase === 1 || currentPhase === 2) || (currentPhase === 3 && items.length <= 4);

    // Determine if we should use categorized view
    // 1. Must be enabled via settings
    // 2. Must not have any items with fixed 'pos' (Motor Planning mode)
    // 3. Not in Training Mode (which handles its own sorting/layout)
    const hasFixedPositions = items.some(item => !!item.pos);
    const useCategorizedView = isCategorizationEnabled && !hasFixedPositions && !isTrainingMode && !useLargeGrid;

    const gridClass = `${useLargeGrid ? 'phase-large-grid' : ''} size-${gridSize}`;

    // Calculate grid dimensions based on targetSize (mm)
    const getGridDimensions = () => {
        if (useLargeGrid) return { rows: 2, cols: 2 };
        
        // Calculate based on Access Profile physical target size
        const targetPx = getPxFromMm(accessProfile.targetSize);
        const spacingPx = getPxFromMm(accessProfile.spacing);
        
        // Use container size if available, otherwise estimate
        const containerWidth = window.innerWidth - 40; // Approx padding
        const containerHeight = window.innerHeight - 200; // Approx headers/sentence strip
        
        const calculatedCols = Math.max(2, Math.floor(containerWidth / (targetPx + spacingPx)));
        const calculatedRows = Math.max(2, Math.floor(containerHeight / (targetPx + spacingPx)));

        // Legacy overrides if gridSize is explicitly set and not 'auto'
        if (gridSize !== 'auto') {
            switch(gridSize) {
                case 'super-big': return { rows: 2, cols: 2 };
                case 'big': return { rows: 3, cols: 3 };
                case 'standard': return { rows: 4, cols: 4 };
                case 'medium': return { rows: 5, cols: 5 };
                case 'dense': return { rows: 6, cols: 6 };
            }
        }

        return { rows: calculatedRows, cols: calculatedCols };
    };

    const { cols } = getGridDimensions();
    const targetPx = getPxFromMm(accessProfile.targetSize);
    const spacingPx = getPxFromMm(accessProfile.spacing);

    // Apply Field Size Limit
    const limit = accessProfile.fieldSize === 'unlimited' ? Infinity : parseInt(accessProfile.fieldSize, 10);
    const displayedItems = items.slice(0, limit);

    // Grouping Logic for Sections
    const groupedItems = displayedItems.reduce((acc, item, index) => {
        const lexiconEntry = item.word ? AAC_LEXICON[item.word.toLowerCase()] : null;
        const category = item.category || item.wc || lexiconEntry?.type || 'unknown';
        if (!acc[category]) acc[category] = [];
        acc[category].push({ ...item, originalIndex: index });
        return acc;
    }, {});

    // Ordered list of categories to display
    const categoryOrder = ['core', 'pronoun', 'verb', 'adj', 'noun', 'social', 'question', 'misc', 'unknown'];

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
                <img 
                    src="/images/logo.png" 
                    alt="Kiwi Voice Logo" 
                    style={{ 
                        width: '8rem', 
                        height: '8rem', 
                        marginBottom: '1.25rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
                    }} 
                />
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.75rem 0'
                }}>
                    {hasBack ? 'This folder is empty' : 'Let\'s add some icons!'}
                </h2>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
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
                        className="primary-button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '1.875rem',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            minHeight: '3.5rem',
                            justifyContent: 'center'
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

            if (useLargeGrid || !useCategorizedView) {
                return (
                    <div 
                        id="grid-container" 
                        className={`${gridClass} ${accessProfile.visualContrast === 'high' ? 'high-contrast' : ''}`}
                        style={!useLargeGrid ? {
                            display: 'grid',
                            gridTemplateColumns: `repeat(${cols}, ${targetPx}px)`,
                            justifyContent: 'center',
                            alignContent: 'start',
                            gap: `${spacingPx}px`,
                            padding: '1.25rem'
                        } : {}}
                    >
                        <SortableContext
                            items={displayedItems.map(i => i.id || i.word)}
                            strategy={rectSortingStrategy}
                        >
                            {displayedItems.map((item, index) => {                            const isSelected = trainingSelection.includes(index);
                            const displayIcon = item.image || item.icon;
                            
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
                                    targetPx={targetPx}
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
        }
    
            return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div 
                        id="grid-container" 
                        className={`${gridClass} ${accessProfile.visualContrast === 'high' ? 'high-contrast' : ''}`} 
                        style={{ display: 'block', padding: '1rem', flex: 1, overflowY: 'auto' }}
                    >
                        <AnimatePresence mode="popLayout">                        {categoryOrder.map(catId => {
                        const sectionItems = groupedItems[catId];
                        if (!sectionItems || sectionItems.length === 0) return null;
    
                        const meta = CATEGORY_METADATA[catId] || CATEGORY_METADATA['unknown'];
                        const isCollapsed = collapsedSections.includes(catId);
    
                                        return (
                                            <motion.div 
                                                key={catId} 
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                style={showCategoryHeaders ? { 
                                                    marginBottom: '1.5rem', 
                                                    background: meta.color, 
                                                    borderRadius: '1.25rem',
                                                    padding: '0.75rem',
                                                    border: `1px solid rgba(0,0,0,0.05)`
                                                } : { marginBottom: '1rem' }}
                                            >
                                                {showCategoryHeaders && (
                                                    <div 
                                                        onClick={() => onToggleSection && onToggleSection(catId)}
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '0.5rem', 
                                                            marginBottom: isCollapsed ? 0 : '0.75rem',
                                                            cursor: 'pointer',
                                                            padding: '0.25rem 0.5rem'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '1.25rem' }}>{meta.icon}</span>
                                                        <span style={{ fontWeight: 800, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', flex: 1 }}>{meta.label}</span>
                                                        <span style={{ opacity: 0.4 }}>{isCollapsed ? '➕' : '➖'}</span>
                                                    </div>
                                                )}
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: `repeat(${cols}, ${targetPx}px)`,
                                                justifyContent: 'center',
                                                gap: `${spacingPx}px`,
                                                paddingTop: '0.5rem'
                                            }}>
                                                <SortableContext
                                                    items={sectionItems.map(i => i.id || i.word)}
                                                    strategy={rectSortingStrategy}
                                                >
                                                    {sectionItems.map((item) => {
                                                        const index = item.originalIndex;
                                                        const isSelected = trainingSelection.includes(index);
                                                        const displayIcon = item.image || item.icon;
                                                        
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
                                                                targetPx={targetPx}
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
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>
                </div>
        {/* Pagination Dots */}
        {pages && pages.length > 1 && (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
                background: 'rgba(255,255,255,0.9)',
                borderTop: '1px solid rgba(0,0,0,0.05)'
            }}>
                {pages.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => onSetPage && onSetPage(index)}
                        style={{
                            width: currentPageIndex === index ? '2rem' : '0.75rem',
                            height: '0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: currentPageIndex === index ? 'var(--primary-dark, #1A535C)' : 'rgba(0,0,0,0.4)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: 0
                        }}
                        aria-label={`Go to ${page.name || `Page ${index + 1}`}`}
                    />
                ))}
            </div>
        )}
    </div>
    );
};

export default Grid;

