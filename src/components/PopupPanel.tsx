import React, { useState, useRef, useEffect } from 'react';
import CloseIcon from '../icons/close-icon';
import { UI_CONSTANTS } from '../configs/constants';

export interface PopupPanelProps {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'right' | 'center';
}

function PopupPanel({ title, onClose, children, position = 'right' }: PopupPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 16 }); // Will be set to right position in useEffect
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Set initial position to right side
  useEffect(() => {
    const setRightPosition = () => {
      const panelWidth = UI_CONSTANTS.PANEL.WIDTH;
      const rightMargin = UI_CONSTANTS.PANEL.MARGIN;
      setPanelPosition({
        x: window.innerWidth - panelWidth - rightMargin,
        y: UI_CONSTANTS.PANEL.MARGIN
      });
    };

    setRightPosition();
    
    // Handle window resize
    const handleResize = () => {
      setRightPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse down on header (start dragging)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (position === 'center') return; // Don't allow dragging for center modal
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Handle mouse move (dragging)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Constrain to viewport bounds
    const maxX = window.innerWidth - (panelRef.current?.offsetWidth || UI_CONSTANTS.PANEL.WIDTH);
    const maxY = window.innerHeight - (panelRef.current?.offsetHeight || UI_CONSTANTS.PANEL.MIN_HEIGHT);

    setPanelPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Prevent text selection while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      return () => {
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  if (position === 'center') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[calc(100vh-2rem)] overflow-y-auto cursor-move"
      style={{
        left: `${panelPosition.x}px`,
        top: `${panelPosition.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Header - Drag Handle */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-lg font-semibold text-gray-900 select-none">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

export default PopupPanel; 