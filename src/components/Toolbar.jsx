import React from 'react';
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wand2,
  Save,
  Bookmark
} from 'lucide-react';

export default function Toolbar({
  zoom,
  onZoomChange,
  onFitWidth,
  overflowStatus,
  onAutoFit,
  onPrint,
  activeProfileTitle,
  onQuickSave,
  onOpenSaved
}) {
  return (
    <header className="toolbar">
      {/* Left: Fit to 1-Page Live Status & Active Profile */}
      <div className="toolbar-group">
        {/* Active Profile Pill */}
        {activeProfileTitle && (
          <button
            type="button"
            className="toolbar-btn profile-pill"
            onClick={onOpenSaved}
            title="Click to manage saved resume profiles"
          >
            <Bookmark size={13} color="#60a5fa" />
            <span className="profile-title-text">{activeProfileTitle}</span>
          </button>
        )}

        {/* Quick Save button */}
        <button
          type="button"
          className="toolbar-btn"
          onClick={onQuickSave}
          title="Save latest changes to active profile"
        >
          <Save size={13} />
          <span>Save</span>
        </button>

        {overflowStatus && overflowStatus.isOverflowing && (
          <button
            type="button"
            className="toolbar-btn"
            style={{ backgroundColor: '#b45309', borderColor: '#d97706', color: '#fff' }}
            onClick={onAutoFit}
            title="Automatically adjust font size & line spacing to fit 1 page exactly"
          >
            <Wand2 size={14} />
            Auto-Fit to 1 Page
          </button>
        )}
      </div>

      {/* Center: Zoom Controls */}
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => onZoomChange(Math.max(0.4, zoom - 0.1))}
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', minWidth: '46px', textAlign: 'center' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={onFitWidth}
          title="Reset / Fit Zoom"
        >
          <Maximize2 size={14} />
          Fit
        </button>
      </div>

      {/* Right: Print / Native Vector PDF Action */}
      <div className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn btn-primary"
          onClick={onPrint}
          title="Save as single-page vector PDF or print"
        >
          <Printer size={15} />
          <span>Save as PDF / Print</span>
        </button>
      </div>
    </header>
  );
}
