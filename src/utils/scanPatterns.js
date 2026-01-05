/**
 * Scan Pattern Utilities for Switch Access
 * 
 * Provides algorithms for sequential scanning through AAC grid icons.
 * Supports linear (left-to-right, top-to-bottom) scanning with wraparound.
 */

/**
 * Calculate the next index in a linear scan pattern
 * @param {number} currentIndex - Current scan position
 * @param {number} totalItems - Total number of items in grid
 * @param {string} direction - Scan direction ('forward' or 'reverse')
 * @returns {number} Next scan index
 */
export function getNextScanIndex(currentIndex, totalItems, direction = 'forward') {
  if (totalItems === 0) return 0;
  
  if (direction === 'forward') {
    return (currentIndex + 1) % totalItems;
  } else {
    return currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
  }
}

/**
 * Get icon element position for visual indicator
 * @param {HTMLElement} iconElement - Icon DOM element
 * @returns {Object} Position and dimensions {top, left, width, height}
 */
export function getIconPosition(iconElement) {
  if (!iconElement) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }
  
  const rect = iconElement.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

/**
 * Get all scannable icon elements from the grid
 * @param {HTMLElement} gridContainer - Grid container element
 * @returns {HTMLElement[]} Array of icon elements
 */
export function getScannableIcons(gridContainer) {
  if (!gridContainer) return [];
  
  // Select all icon buttons in the grid
  const icons = gridContainer.querySelectorAll('.icon-button, .grid-item, [data-scannable="true"]');
  return Array.from(icons).filter(icon => {
    // Filter out hidden or disabled icons
    const style = window.getComputedStyle(icon);
    return style.display !== 'none' && !icon.hasAttribute('disabled');
  });
}

/**
 * Calculate scan pattern based on grid layout
 * @param {number} rows - Number of rows in grid
 * @param {number} cols - Number of columns in grid
 * @param {string} pattern - Pattern type ('linear', 'row-column', 'reverse')
 * @returns {number[]} Array of indices in scan order
 */
export function calculateScanPattern(rows, cols, pattern = 'linear') {
  const totalItems = rows * cols;
  const indices = [];
  
  switch (pattern) {
    case 'linear':
      // Left-to-right, top-to-bottom
      for (let i = 0; i < totalItems; i++) {
        indices.push(i);
      }
      break;
      
    case 'reverse':
      // Right-to-left, bottom-to-top
      for (let i = totalItems - 1; i >= 0; i--) {
        indices.push(i);
      }
      break;
      
    case 'row-column':
      // Future: Scan rows first, then columns
      // For now, fallback to linear
      for (let i = 0; i < totalItems; i++) {
        indices.push(i);
      }
      break;
      
    default:
      // Default to linear
      for (let i = 0; i < totalItems; i++) {
        indices.push(i);
      }
  }
  
  return indices;
}

/**
 * Validate scan speed is within acceptable range
 * @param {number} speed - Scan speed in milliseconds
 * @returns {number} Validated speed (clamped to 1000-3000ms)
 */
export function validateScanSpeed(speed) {
  const MIN_SPEED = 1000; // 1 second
  const MAX_SPEED = 3000; // 3 seconds
  
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
}
