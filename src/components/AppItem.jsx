
import { useRef, useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { AAC_LEXICON } from '../data/aacLexicon';
import { getMedia } from '../utils/db';
import { triggerHaptic } from '../utils/haptics';

// Simple global cache for media to avoid repeated DB reads
const mediaCache = new Map();

const AppItem = ({
  item,
  index,
  isBack = false,
  isEditMode = false,
  isTrainingMode = false,
  isSelected = false,
  isDimmed = false,
  isScanned = false,
  isLocked = false,
  isRevealed = true,
  isColorCodingEnabled = true,
  style: customStyle = {},
  onClick,
  onDelete,
  onEdit,
  onToggleTraining
}) => {
  const pointerStartPos = useRef(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [resolvedIcon, setResolvedIcon] = useState(item.icon);
  const [resolvedAudio, setResolvedAudio] = useState(item.customAudio);

  useEffect(() => {
    let didCancel = false;

    const resolveMedia = async () => {
      let icon = item.icon;
      let audio = item.customAudio;

      if (typeof item.icon === 'string' && item.icon.startsWith('db:')) {
        const mediaId = item.icon.split(':')[1];
        if (mediaCache.has(mediaId)) {
          icon = mediaCache.get(mediaId);
        } else {
          icon = await getMedia(mediaId);
          mediaCache.set(mediaId, icon);
        }
      }

      if (typeof item.customAudio === 'string' && item.customAudio.startsWith('db:')) {
        const mediaId = item.customAudio.split(':')[1];
        if (mediaCache.has(mediaId)) {
          audio = mediaCache.get(mediaId);
        } else {
          audio = await getMedia(mediaId);
          mediaCache.set(mediaId, audio);
        }
      }

      if (!didCancel) {
        setResolvedIcon(icon);
        setResolvedAudio(audio);
      }
    };

    resolveMedia();
    return () => { didCancel = true; };
  }, [item.icon, item.customAudio]);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id || item.word, disabled: !isEditMode || isBack || isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    ...customStyle
  };

  const handlePointerDown = (e) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
    setIsCancelling(false);
  };

  const handlePointerMove = (e) => {
    if (pointerStartPos.current) {
      const dx = Math.abs(e.clientX - pointerStartPos.current.x);
      const dy = Math.abs(e.clientY - pointerStartPos.current.y);
      if (dx > 10 || dy > 10) {
        setIsCancelling(true);
      } else {
        setIsCancelling(false);
      }
    }
  };

  const handleAction = (e) => {
    // If it was a pointer event, check for cancellation (movement threshold)
    if (e.clientX !== undefined && pointerStartPos.current) {
      const dx = Math.abs(e.clientX - pointerStartPos.current.x);
      const dy = Math.abs(e.clientY - pointerStartPos.current.y);
      if (dx > 10 || dy > 10) {
        pointerStartPos.current = null;
        setIsCancelling(false);
        return;
      }
    }
    pointerStartPos.current = null;
    setIsCancelling(false);

    if (!isRevealed && !isEditMode) return;

    if (isBack) {
      triggerHaptic('light');
      onClick();
      return;
    }

    if (isTrainingMode) {
      triggerHaptic('light');
      onToggleTraining(index);
      return;
    }

    if (isEditMode) return; 
    
    // Determine haptic style based on word class (16.3 Hierarchy)
    const lexiconEntry = item.word ? AAC_LEXICON[item.word.toLowerCase()] : null;
    const wc = item.wc || lexiconEntry?.type;
    
    let hapticStyle = 'light';
    if (item.type === 'folder') hapticStyle = 'medium';
    else if (wc === 'verb') hapticStyle = 'medium';
    else if (item.name?.toLowerCase() === 'no' || item.name?.toLowerCase() === 'stop') hapticStyle = 'heavy';

    triggerHaptic(hapticStyle);
    onClick({ ...item, customAudio: resolvedAudio }, index);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(index);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(index);
  };

  let wrapperClass = 'app-item';
  if (isEditMode && !isBack && !isTrainingMode) wrapperClass += ' is-editing';
  if (isScanned) wrapperClass += ' is-scanned';
  if (!isRevealed) wrapperClass += ' is-hidden';
  if (isTrainingMode && !isBack) {
    if (isSelected) wrapperClass += ' selected';
    else if (isDimmed) wrapperClass += ' dimmed';
  }

  let iconClass = 'app-icon';
  if (isBack) iconClass += ' is-back';
  if (item.type === 'folder') iconClass += ' is-folder';

  // Fitzgerald Key Logic
  const lexiconEntry = item.word ? AAC_LEXICON[item.word.toLowerCase()] : null;
  const effectiveWc = item.wc || lexiconEntry?.type;
  
  // Map pronoun to social for coloring if needed, or keep separate if we want specific colors
  const mappedWc = effectiveWc === 'pronoun' ? 'social' : effectiveWc; 

  const getBackgroundColor = () => {
    if (item.bgColor) return item.bgColor;
    if (!isColorCodingEnabled || !mappedWc) return 'var(--card-bg)';
    return `var(--fitz-${mappedWc})`;
  };

  const getTextColor = () => {
    if (!isColorCodingEnabled || !mappedWc || item.bgColor) return 'var(--text-primary)';
    return mappedWc === 'noun' ? 'var(--fitz-noun-text)' : 'white';
  };

  const iconStyle = {
    background: getBackgroundColor(),
    color: getTextColor()
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={wrapperClass}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handleAction}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      aria-label={isBack ? 'Go back' : `${item.word}${item.type === 'folder' ? ', folder' : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAction(); }}
      {...attributes}
      {...listeners}
    >
      <div className={iconClass} style={iconStyle}>
        {isCancelling && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 59, 48, 0.8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            zIndex: 10,
            borderRadius: 'inherit',
            backdropFilter: 'blur(4px)'
          }}>
            CANCEL
          </div>
        )}
        {item.type === 'folder' ? (
          <div className="folder-grid">
            {item.contents.slice(0, 4).map((subItem, i) => (
              <span key={i} className="mini-icon">
                {subItem.image ? (
                  <img src={subItem.image} alt={subItem.word} className="sub-icon-img" />
                ) : typeof subItem.icon === 'string' && (subItem.icon.startsWith('/') || subItem.icon.startsWith('data:') || subItem.icon.includes('.')) ? (
                  <img src={subItem.icon} alt={subItem.word} className="sub-icon-img" />
                ) : (
                  subItem.icon
                )}
              </span>
            ))}
          </div>
        ) : item.isPhrase ? (
          <div className="phrase-storyboard">
            {(item.phraseIcons || [item.icon]).map((ic, i) => (
              <span key={i} className="storyboard-icon">
                {typeof ic === 'string' && (ic.startsWith('/') || ic.startsWith('data:') || ic.includes('.')) ? (
                  <img src={ic} alt="" className="storyboard-img" />
                ) : (
                  ic
                )}
              </span>
            ))}
          </div>
        ) : (
          typeof resolvedIcon === 'string' && (resolvedIcon.startsWith('/') || resolvedIcon.startsWith('data:') || resolvedIcon.includes('.')) ? (
            <img src={resolvedIcon} alt={item.word} />
          ) : (
            resolvedIcon
          )
        )}
      </div>

      {!isRevealed && !isEditMode && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.5rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          zIndex: 5
        }}>
          UNLOCK SOON
        </div>
      )}

      {isLocked && isEditMode && !isBack && (
        <div style={{
          position: 'absolute',
          top: '-0.25rem',
          left: '-0.25rem',
          background: 'white',
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 5
        }}>
          🔒
        </div>
      )}

      {isEditMode && !isBack && !isTrainingMode && !isLocked && (
        <>
          <div className="del-badge" onClick={handleDelete} role="button" aria-label={`Delete ${item.word}`} tabIndex={0}></div>
          <div className="edit-badge" onClick={handleEdit} role="button" aria-label={`Edit ${item.word}`} tabIndex={0}>✎</div>
        </>
      )}

      <div className="app-label">{item.word}</div>
    </motion.div>
  );
};

export default AppItem;
