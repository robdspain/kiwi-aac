import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AppItem = ({
  item,
  index,
  isBack = false,
  isEditMode = false,
  isTrainingMode = false,
  isSelected = false,
  isDimmed = false,
  onClick,
  onDelete,
  onEdit,
  onToggleTraining
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id || item.word, disabled: !isEditMode || isBack });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  const handleClick = (e) => {
    if (isBack) {
      onClick();
      return;
    }

    if (isTrainingMode) {
      onToggleTraining(index);
      return;
    }

    if (isEditMode) return; // Disable navigation while shaking
    onClick(item, index);
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
  if (isTrainingMode && !isBack) {
    if (isSelected) wrapperClass += ' selected';
    else if (isDimmed) wrapperClass += ' dimmed';
  }

  let iconClass = 'app-icon';
  if (isBack) iconClass += ' is-back';
  if (item.type === 'folder') iconClass += ' is-folder';

  const iconStyle = {
    background: item.bgColor || 'var(--icon-bg)'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={wrapperClass}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={isBack ? 'Go back' : `${item.word}${item.type === 'folder' ? ', folder' : ''}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e); }}
      {...attributes}
      {...listeners}
    >
      <div className={iconClass} style={iconStyle}>
        {item.type === 'folder' ? (
          <div className="folder-grid">
            {item.contents.slice(0, 4).map((subItem, i) => (
              <span key={i} className="mini-icon">
                {typeof subItem.icon === 'string' && (subItem.icon.startsWith('/') || subItem.icon.startsWith('data:') || subItem.icon.includes('.')) ? (
                  <img src={subItem.icon} alt={subItem.word} className="sub-icon-img" />
                ) : (
                  subItem.icon
                )}
              </span>
            ))}
          </div>
        ) : (
          typeof item.icon === 'string' && (item.icon.startsWith('/') || item.icon.startsWith('data:') || item.icon.includes('.')) ? (
            <img src={item.icon} alt={item.word} />
          ) : (
            item.icon
          )
        )}
      </div>

      {isEditMode && !isBack && !isTrainingMode && (
        <>
          <div className="del-badge" onClick={handleDelete} role="button" aria-label={`Delete ${item.word}`} tabIndex={0}></div>
          <div className="edit-badge" onClick={handleEdit} role="button" aria-label={`Edit ${item.word}`} tabIndex={0}>✎</div>
        </>
      )}

      <div className="app-label">{item.word}</div>
    </div>
  );
};

export default AppItem;
