import { useEffect, useMemo, useRef, useState } from 'react';

const ImageCropModal = ({
  isOpen,
  imageSrc,
  onCancel,
  onSave,
  outputSize = 512,
  title = 'Crop Photo'
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0, pointerId: null });
  const [cropSize, setCropSize] = useState(280);
  const [imageMeta, setImageMeta] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageMeta({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      if (!containerRef.current) return;
      setCropSize(containerRef.current.clientWidth);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isOpen]);

  const minScale = useMemo(() => {
    if (!imageMeta.w || !cropSize) return 1;
    return Math.max(cropSize / imageMeta.w, cropSize / imageMeta.h);
  }, [imageMeta, cropSize]);

  const maxScale = useMemo(() => Math.max(minScale * 3, minScale + 0.5), [minScale]);

  useEffect(() => {
    if (!imageMeta.w || !cropSize) return;
    const initialScale = minScale;
    const imgW = imageMeta.w * initialScale;
    const imgH = imageMeta.h * initialScale;
    setScale(initialScale);
    setOffset({ x: (cropSize - imgW) / 2, y: (cropSize - imgH) / 2 });
  }, [imageMeta, cropSize, minScale]);

  const clampOffset = (x, y, targetScale = scale) => {
    if (!imageMeta.w || !cropSize) return { x, y };
    const imgW = imageMeta.w * targetScale;
    const imgH = imageMeta.h * targetScale;
    const minX = cropSize - imgW;
    const minY = cropSize - imgH;
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y))
    };
  };

  const handlePointerDown = (e) => {
    if (!imageMeta.w) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      pointerId: e.pointerId
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const next = clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy);
    setOffset(next);
  };

  const handlePointerUp = (e) => {
    if (dragRef.current.pointerId === e.pointerId) {
      dragRef.current.active = false;
      dragRef.current.pointerId = null;
    }
  };

  const handleZoomChange = (e) => {
    const nextScale = parseFloat(e.target.value);
    const center = cropSize / 2;
    const currentScale = scale || minScale;
    const centerImgX = (center - offset.x) / currentScale;
    const centerImgY = (center - offset.y) / currentScale;
    const nextOffset = {
      x: center - centerImgX * nextScale,
      y: center - centerImgY * nextScale
    };
    setScale(nextScale);
    setOffset(clampOffset(nextOffset.x, nextOffset.y, nextScale));
  };

  const handleSave = () => {
    if (!imageRef.current || !imageMeta.w) return;
    const sourceX = Math.max(0, -offset.x) / scale;
    const sourceY = Math.max(0, -offset.y) / scale;
    const sourceSize = cropSize / scale;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onSave(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="ios-bottom-sheet-overlay" onClick={onCancel}>
      <div className="ios-bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '95vh' }}>
        <button className="ios-close-button" onClick={onCancel} aria-label="Close">✕</button>
        <div className="ios-sheet-header">
          <button className="ios-cancel-button" onClick={onCancel}>Cancel</button>
          <h2 className="ios-sheet-title">{title}</h2>
          <button className="ios-done-button" onClick={handleSave}>Use</button>
        </div>
        <div className="ios-sheet-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{
              width: 'min(70vw, 320px)',
              aspectRatio: '1 / 1',
              borderRadius: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              background: '#111',
              touchAction: 'none'
            }}
          >
            {imageSrc && imageMeta.w > 0 && (
              <img
                src={imageSrc}
                alt="Crop preview"
                style={{
                  position: 'absolute',
                  left: `${offset.x}px`,
                  top: `${offset.y}px`,
                  width: `${imageMeta.w * scale}px`,
                  height: `${imageMeta.h * scale}px`,
                  objectFit: 'cover',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(255,255,255,0.9)',
                borderRadius: '1.25rem',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
                pointerEvents: 'none'
              }}
            />
          </div>
          <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Zoom</label>
            <input
              type="range"
              min={minScale}
              max={maxScale}
              step="0.01"
              value={scale}
              onChange={handleZoomChange}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Drag to reposition. Adjust zoom to crop.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
