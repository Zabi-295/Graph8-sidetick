import React, { useState, useRef, useEffect } from 'react';
import { Graph8Logo } from './Graph8Logo';
import { GripVertical } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  badgeCount?: number;
  isActive?: boolean;
  position?: { x: number; y: number } | null;
  onPositionChange?: (pos: { x: number; y: number } | null) => void;
  isRelative?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  badgeCount = 3,
  isActive = true,
  position = null,
  onPositionChange,
  isRelative = false
}) => {
  const [internalPos, setInternalPos] = useState<{ x: number; y: number } | null>(position);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentPos = position !== undefined ? position : internalPos;

  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
    isDown: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
    isDown: false
  });

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // left mouse button only
    e.stopPropagation();

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
      isDown: true
    };
    setIsDragging(true);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current.isDown) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (containerRef.current) {
      const el = containerRef.current;
      const width = el.offsetWidth || 180;
      const height = el.offsetHeight || 44;

      const minX = 8;
      const maxX = Math.max(minX, window.innerWidth - width - 8);
      const minY = 8;
      const maxY = Math.max(minY, window.innerHeight - height - 8);

      let newX = dragStartRef.current.initialLeft + deltaX;
      let newY = dragStartRef.current.initialTop + deltaY;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      const updated = { x: newX, y: newY };
      setInternalPos(updated);
      onPositionChange?.(updated);
    }
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current.isDown) return;
    dragStartRef.current.isDown = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Window-level safety listeners during drag
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMove = (e: PointerEvent) => {
      const deltaX = e.clientX - dragStartRef.current.startX;
      const deltaY = e.clientY - dragStartRef.current.startY;

      const el = containerRef.current;
      const width = el?.offsetWidth || 180;
      const height = el?.offsetHeight || 44;

      const minX = 8;
      const maxX = Math.max(minX, window.innerWidth - width - 8);
      const minY = 8;
      const maxY = Math.max(minY, window.innerHeight - height - 8);

      let newX = dragStartRef.current.initialLeft + deltaX;
      let newY = dragStartRef.current.initialTop + deltaY;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      const updated = { x: newX, y: newY };
      setInternalPos(updated);
      onPositionChange?.(updated);
    };

    const handleWindowUp = () => {
      dragStartRef.current.isDown = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handleWindowMove);
    window.addEventListener('pointerup', handleWindowUp);
    window.addEventListener('pointercancel', handleWindowUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowMove);
      window.removeEventListener('pointerup', handleWindowUp);
      window.removeEventListener('pointercancel', handleWindowUp);
    };
  }, [isDragging, onPositionChange]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalPos(null);
    onPositionChange?.(null);
  };

  return (
    <div
      ref={containerRef}
      style={
        !isRelative && currentPos
          ? {
              left: `${currentPos.x}px`,
              top: `${currentPos.y}px`,
              bottom: 'auto',
              right: 'auto',
              transform: 'none'
            }
          : undefined
      }
      className={`${
        isRelative
          ? 'relative z-30 select-none flex items-center'
          : 'fixed z-50 select-none flex items-center'
      } rounded-full bg-white/95 hover:bg-white border border-slate-200/90 hover:border-purple-300 shadow-pill-light hover:shadow-xl backdrop-blur-xl animate-fade-in ${
        isDragging
          ? 'transition-none pointer-events-auto shadow-2xl ring-2 ring-purple-400/50 scale-105'
          : 'transition-all duration-200'
      } ${!isRelative && !currentPos ? 'bottom-6 right-6' : ''}`}
    >
      {/* Subtle Brand Gradient Glow on Hover */}
      <div 
        className="absolute -inset-1 rounded-full opacity-0 hover:opacity-100 blur-md transition-opacity pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.25) 0%, rgba(155, 81, 224, 0.25) 50%, rgba(255, 42, 133, 0.25) 100%)'
        }}
      />

      {/* Dedicated Drag Dots Handle (Hold here to drag anywhere on screen) */}
      <div
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onDoubleClick={handleDoubleClick}
        className={`pl-2.5 pr-1 py-2 flex items-center justify-center select-none app-drag-region ${
          isDragging
            ? 'cursor-grabbing text-purple-600'
            : 'cursor-grab text-slate-300 hover:text-purple-600'
        }`}
        title="Hold and drag dots to move anywhere (Double-click to reset)"
      >
        <div className="p-1 rounded hover:bg-purple-50 transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {/* Main Clickable Area: Opens Sidekick Immediately on Click */}
      <button
        type="button"
        onClick={() => {
          onClick();
        }}
        className="group relative flex items-center gap-2 pl-0.5 pr-3.5 py-2 cursor-pointer outline-none focus:outline-none transition-transform active:scale-95 app-no-drag"
        title="Click to open Graph8 Sidekick (Ctrl+K)"
        aria-label="Open Graph8 Sidekick"
      >
        {/* Graph8 Logo */}
        <div className="relative flex items-center justify-center">
          <Graph8Logo size={23} />
          
          {/* Green active status dot */}
          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white" />
            </span>
          )}
        </div>

        {/* Brand label & hotkey pill */}
        <div className="flex items-center gap-1.5 pr-0.5">
          <span className="text-[12.5px] font-bold text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
            Sidekick
          </span>

          <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:text-purple-700 group-hover:bg-purple-50 border border-slate-200 transition-colors">
            Ctrl+K
          </span>
        </div>

        {/* Notification badge with brand gradient */}
        {badgeCount > 0 && (
          <div 
            className="relative -ml-0.5 flex items-center justify-center min-w-[19px] h-[19px] px-1 rounded-full text-[9.5px] font-bold text-white shadow-sm border border-white"
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)'
            }}
          >
            {badgeCount}
          </div>
        )}
      </button>
    </div>
  );
};
