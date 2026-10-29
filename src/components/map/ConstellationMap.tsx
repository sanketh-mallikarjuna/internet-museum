import { useState, useMemo, useRef, useEffect } from 'react';
import type { Exhibit, MuseumWing } from '../../types/exhibit';
import type { MuseumTrail } from '../../types/trail';

interface ConstellationMapProps {
  exhibits: Exhibit[];
  allExhibits: Exhibit[];
  wings: MuseumWing[];
  selectedExhibitId: string | null;
  onSelectExhibit: (exhibit: Exhibit) => void;
  visitedExhibitIds: string[];
  favoriteExhibitIds: string[];
  activeTrail: MuseumTrail | null;
  activeTrailStopIndex: number;
}

export function ConstellationMap({
  exhibits,
  allExhibits,
  wings,
  selectedExhibitId,
  onSelectExhibit,
  visitedExhibitIds,
  favoriteExhibitIds,
  activeTrail,
  activeTrailStopIndex,
}: ConstellationMapProps) {
  const [hoveredExhibit, setHoveredExhibit] = useState<Exhibit | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Map of exhibit id -> Exhibit for fast lookup
  const exhibitMap = useMemo(() => {
    const map = new Map<string, Exhibit>();
    allExhibits.forEach((e) => map.set(e.id, e));
    return map;
  }, [allExhibits]);

  // Center coordinate of each wing
  const wingCenters: Record<string, { x: number; y: number; name: string; color: string; icon: string }> = {
    'atrium': { x: 500, y: 360, name: 'Central Atrium', color: '#38bdf8', icon: '🏛️' },
    'generative': { x: 760, y: 190, name: 'Generative Wonders', color: '#a855f7', icon: '✨' },
    'curiosities': { x: 260, y: 220, name: 'Cabinet of Curiosities', color: '#ec4899', icon: '🔮' },
    'retro-web': { x: 260, y: 500, name: 'Archive of Retro Web', color: '#f59e0b', icon: '💾' },
    'interactive-fiction': { x: 740, y: 500, name: 'Playground of Play', color: '#10b981', icon: '🎮' },
  };

  // Generate constellation filaments (lines between nodes in the same wing)
  const constellationLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; color: string; key: string }[] = [];
    const exhibitsByWing: Record<string, Exhibit[]> = {};

    exhibits.forEach((ex) => {
      if (!ex.coords) return;
      if (!exhibitsByWing[ex.wingId]) exhibitsByWing[ex.wingId] = [];
      exhibitsByWing[ex.wingId].push(ex);
    });

    Object.entries(exhibitsByWing).forEach(([wingId, wingExhibits]) => {
      const wing = wings.find((w) => w.id === wingId);
      const color = wing?.accentColor || 'rgba(255,255,255,0.2)';
      
      // Connect sequential nodes and star-mesh within wing
      for (let i = 0; i < wingExhibits.length; i++) {
        for (let j = i + 1; j < wingExhibits.length; j++) {
          const a = wingExhibits[i].coords!;
          const b = wingExhibits[j].coords!;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          // Only connect nearby stars
          if (dist < 180) {
            lines.push({
              x1: a.x,
              y1: a.y,
              x2: b.x,
              y2: b.y,
              color,
              key: `${wingExhibits[i].id}-${wingExhibits[j].id}`,
            });
          }
        }
      }
    });

    return lines;
  }, [exhibits, wings]);

  // Trail path coordinates when a trail is active
  const trailPathPoints = useMemo(() => {
    if (!activeTrail) return null;
    const points: { x: number; y: number; id: string }[] = [];
    activeTrail.exhibitIds.forEach((id) => {
      const ex = exhibitMap.get(id);
      if (ex && ex.coords) {
        points.push({ x: ex.coords.x, y: ex.coords.y, id });
      }
    });
    return points;
  }, [activeTrail, exhibitMap]);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Center on selected exhibit when changed
  useEffect(() => {
    if (selectedExhibitId) {
      const ex = exhibitMap.get(selectedExhibitId);
      if (ex && ex.coords) {
        // Softly nudge pan if off center
        // Keep in reasonable bounds
      }
    }
  }, [selectedExhibitId, exhibitMap]);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="constellation-wrapper">
      {/* Map Control Toolbar */}
      <div className="map-controls glass-panel">
        <button
          type="button"
          className="map-control-btn"
          onClick={handleZoomIn}
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          className="map-control-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          −
        </button>
        <button
          type="button"
          className="map-control-btn"
          onClick={handleReset}
          title="Reset Constellation View"
          aria-label="Reset View"
          style={{ fontSize: '0.75rem' }}
        >
          Reset
        </button>
        <span className="map-zoom-indicator">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Constellation Legend */}
      <div className="map-legend glass-panel">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#38bdf8' }} />
          <span>Atrium</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#a855f7' }} />
          <span>Generative</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#ec4899' }} />
          <span>Curiosities</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }} />
          <span>Retro Web</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }} />
          <span>Fiction/Play</span>
        </div>
        <div className="legend-item" style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem' }}>🛂 Stamp = Visited</span>
        </div>
        <div className="legend-item">
          <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>♥ = Saved</span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        ref={svgRef}
        className="constellation-svg"
        viewBox="0 0 1000 700"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <defs>
          {/* Radial glow filters */}
          <radialGradient id="nebula-atrium" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-generative" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-curiosities" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-retro" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-fiction" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Node Glow Filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} transform-origin="500 350">
          {/* Ambient Cosmic Nebulae */}
          <circle cx={500} cy={360} r={180} fill="url(#nebula-atrium)" />
          <circle cx={760} cy={190} r={170} fill="url(#nebula-generative)" />
          <circle cx={260} cy={220} r={170} fill="url(#nebula-curiosities)" />
          <circle cx={260} cy={500} r={170} fill="url(#nebula-retro)" />
          <circle cx={740} cy={500} r={170} fill="url(#nebula-fiction)" />

          {/* Wing Landmark Labels */}
          {Object.entries(wingCenters).map(([key, center]) => (
            <g key={key} opacity="0.45" pointerEvents="none">
              <circle
                cx={center.x}
                cy={center.y}
                r="110"
                fill="none"
                stroke={center.color}
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <text
                x={center.x}
                y={center.y + 130}
                fill={center.color}
                fontSize="12"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                letterSpacing="2"
              >
                {center.icon} {center.name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Constellation Filaments */}
          {constellationLines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.color}
              strokeWidth="1.2"
              strokeOpacity="0.25"
              strokeDasharray="2 3"
            />
          ))}

          {/* Active Trail Connecting Path */}
          {trailPathPoints && trailPathPoints.length > 1 && (
            <g>
              <polyline
                points={trailPathPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                className="active-trail-polyline"
              />
              {/* Trail stop numbering badges */}
              {trailPathPoints.map((p) => (
                <circle
                  key={`trail-stop-${p.id}`}
                  cx={p.x}
                  cy={p.y - 18}
                  r="9"
                  fill="#fbbf24"
                  stroke="#0a0c14"
                  strokeWidth="2"
                />
              ))}
              {trailPathPoints.map((p, idx) => (
                <text
                  key={`trail-stop-text-${p.id}`}
                  x={p.x}
                  y={p.y - 15}
                  fill="#0a0c14"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {idx + 1}
                </text>
              ))}
            </g>
          )}

          {/* Interactive Exhibit Nodes */}
          {exhibits.map((exhibit) => {
            if (!exhibit.coords) return null;
            const isSelected = selectedExhibitId === exhibit.id;
            const isVisited = visitedExhibitIds.includes(exhibit.id);
            const isFavorited = favoriteExhibitIds.includes(exhibit.id);
            const wing = wings.find((w) => w.id === exhibit.wingId);
            const accentColor = wing?.accentColor || '#38bdf8';
            const isCurrentTrailStop =
              activeTrail && activeTrail.exhibitIds[activeTrailStopIndex] === exhibit.id;

            return (
              <g
                key={exhibit.id}
                className="constellation-node"
                transform={`translate(${exhibit.coords.x}, ${exhibit.coords.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectExhibit(exhibit);
                }}
                onMouseEnter={() => setHoveredExhibit(exhibit)}
                onMouseLeave={() => setHoveredExhibit(null)}
                tabIndex={0}
                role="button"
                aria-label={`Exhibit: ${exhibit.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectExhibit(exhibit);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Active Trail Stop / Selected Pulsing Halo */}
                {(isSelected || isCurrentTrailStop) && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={isCurrentTrailStop ? '#fbbf24' : accentColor}
                    strokeWidth="2"
                    className="node-pulse-ring"
                  />
                )}

                {/* Curator Pick Subtle Aura */}
                {exhibit.isCuratorPick && (
                  <circle
                    r="17"
                    fill={accentColor}
                    fillOpacity="0.15"
                  />
                )}

                {/* Main Node Body */}
                <circle
                  r={isSelected ? 13 : exhibit.isCuratorPick ? 10 : 8}
                  fill={isSelected ? '#ffffff' : accentColor}
                  stroke={accentColor}
                  strokeWidth="2"
                  filter="url(#glow)"
                />

                {/* Visited Passport Stamp Indicator Ring */}
                {isVisited && (
                  <circle
                    r="13"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                )}

                {/* Favorite Heart Marker */}
                {isFavorited && (
                  <g transform="translate(6, -10)">
                    <circle r="5" fill="#f59e0b" />
                    <text
                      y="3"
                      fill="#0a0c14"
                      fontSize="6"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ♥
                    </text>
                  </g>
                )}

                {/* Exhibit Title Label */}
                <text
                  y="22"
                  fill="var(--text-primary)"
                  fontSize="10"
                  fontFamily="var(--font-display)"
                  fontWeight={isSelected ? '700' : '500'}
                  textAnchor="middle"
                  className="node-title-text"
                >
                  {exhibit.title.length > 22
                    ? exhibit.title.substring(0, 20) + '…'
                    : exhibit.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card Tooltip */}
      {hoveredExhibit && hoveredExhibit.coords && (
        <div
          className="map-tooltip glass-panel"
          style={{
            left: `${((hoveredExhibit.coords.x * zoom + pan.x) / 1000) * 100}%`,
            top: `${((hoveredExhibit.coords.y * zoom + pan.y) / 700) * 100}%`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="tag-badge" style={{ fontSize: '0.7rem' }}>
              {wings.find((w) => w.id === hoveredExhibit.wingId)?.name}
            </span>
            {hoveredExhibit.year && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {hoveredExhibit.year}
              </span>
            )}
          </div>
          <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem', fontFamily: 'var(--font-display)' }}>
            {hoveredExhibit.title}
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
            {hoveredExhibit.tagline}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
            <span>Click to inspect</span>
            <span>{visitedExhibitIds.includes(hoveredExhibit.id) ? '✓ Visited' : 'Unvisited'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
