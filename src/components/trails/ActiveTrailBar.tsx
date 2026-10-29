import type { MuseumTrail } from '../../types/trail';
import type { Exhibit } from '../../types/exhibit';

interface ActiveTrailBarProps {
  trail: MuseumTrail;
  currentStopIndex: number;
  currentExhibit: Exhibit | undefined;
  onNextStop: () => void;
  onPrevStop: () => void;
  onInspectStop: () => void;
  onExploreStopOutbound: () => void;
  onExitTrail: () => void;
}

export function ActiveTrailBar({
  trail,
  currentStopIndex,
  currentExhibit,
  onNextStop,
  onPrevStop,
  onInspectStop,
  onExploreStopOutbound,
  onExitTrail,
}: ActiveTrailBarProps) {
  const totalStops = trail.exhibitIds.length;
  const isFirst = currentStopIndex === 0;
  const isLast = currentStopIndex === totalStops - 1;

  return (
    <div className="active-trail-bar-wrapper">
      <div className="active-trail-bar glass-panel">
        {/* Left: Trail & Stop Info */}
        <div className="trail-bar-info">
          <div className="trail-bar-badge">
            <span aria-hidden="true">🧭</span>
            <span>Active Trail: {trail.title}</span>
          </div>
          <div className="trail-bar-stop-details">
            <span className="trail-bar-counter">
              Stop {currentStopIndex + 1} of {totalStops}:
            </span>
            <strong className="trail-bar-stop-title">
              {currentExhibit ? currentExhibit.title : 'Loading stop...'}
            </strong>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="trail-bar-controls">
          <button
            type="button"
            className="btn-secondary-sm"
            onClick={onPrevStop}
            disabled={isFirst}
            title="Go to previous stop"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="btn-secondary-sm"
            onClick={onNextStop}
            disabled={isLast}
            title="Go to next stop"
          >
            Next →
          </button>
          <button
            type="button"
            className="btn-card-inspect"
            onClick={onInspectStop}
            title="Read curator notes for this stop"
          >
            Inspect Stop
          </button>
          <button
            type="button"
            className="btn-primary-sm"
            onClick={onExploreStopOutbound}
            title="Launch website in new tab"
          >
            Visit Site ↗
          </button>
          <button
            type="button"
            className="trail-exit-btn"
            onClick={onExitTrail}
            title="Exit guided trail"
            aria-label="Exit guided trail"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
