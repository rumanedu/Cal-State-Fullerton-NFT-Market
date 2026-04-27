import { useState } from 'react';
import { Map, Info, ChevronUp, ChevronDown, MousePointer2, RotateCcw, ZoomIn } from 'lucide-react';
import { useStore } from '../../store';
import { CAMPUS_BUILDINGS } from '../../data/buildings';
import './HUD.css';

export default function HUD() {
  const { selectedBuilding, filterCategory } = useStore();
  const [hintsOpen, setHintsOpen] = useState(false);

  const visibleCount = filterCategory === 'All'
    ? CAMPUS_BUILDINGS.length
    : CAMPUS_BUILDINGS.filter(b => b.category === filterCategory).length;

  return (
    <div className="hud">
      {/* Bottom-left: map stats */}
      <div className="hud-stats glass">
        <Map size={14} style={{ color: 'var(--csuf-orange)' }} />
        <span className="hud-stat-text">
          <strong>{visibleCount}</strong> buildings
          {filterCategory !== 'All' && <> · <span style={{ color: 'var(--csuf-orange)' }}>{filterCategory}</span></>}
        </span>
      </div>

      {/* Bottom-right: controls hint */}
      <div className="hud-controls">
        <button
          className="hud-controls-toggle glass"
          onClick={() => setHintsOpen(!hintsOpen)}
        >
          <Info size={13} />
          <span>Controls</span>
          {hintsOpen ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
        </button>
        {hintsOpen && (
          <div className="hud-hints glass">
            <div className="hint-row">
              <MousePointer2 size={12} />
              <span>Click marker to open NFT collection</span>
            </div>
            <div className="hint-row">
              <RotateCcw size={12} />
              <span>Drag to orbit camera</span>
            </div>
            <div className="hint-row">
              <ZoomIn size={12} />
              <span>Scroll to zoom in/out</span>
            </div>
            <div className="hint-row">
              <MousePointer2 size={12} />
              <span>Right-drag to pan</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected building indicator */}
      {selectedBuilding && (
        <div className="hud-selected glass" style={{ '--bc': selectedBuilding.color }}>
          <div className="hud-selected-dot" />
          <span className="hud-selected-text">
            Viewing <strong>{selectedBuilding.name}</strong> NFT Collection
          </span>
        </div>
      )}
    </div>
  );
}
