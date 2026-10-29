import { useEffect } from 'react';
import type { Exhibit, MuseumWing } from '../../types/exhibit';

interface ExhibitDetailModalProps {
  exhibit: Exhibit | null;
  wing: MuseumWing | undefined;
  isOpen: boolean;
  onClose: () => void;
  isVisited: boolean;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleVisited: (id: string) => void;
  onExploreOutbound: (exhibit: Exhibit) => void;
  onNextExhibit: () => void;
  onPrevExhibit: () => void;
  onAddToTrailDraft?: (id: string) => void;
  isAddedToTrailDraft?: boolean;
}

export function ExhibitDetailModal({
  exhibit,
  wing,
  isOpen,
  onClose,
  isVisited,
  isFavorited,
  onToggleFavorite,
  onToggleVisited,
  onExploreOutbound,
  onNextExhibit,
  onPrevExhibit,
  onAddToTrailDraft,
  isAddedToTrailDraft,
}: ExhibitDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNextExhibit();
      if (e.key === 'ArrowLeft') onPrevExhibit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNextExhibit, onPrevExhibit]);

  if (!isOpen || !exhibit) return null;

  const accentColor = wing?.accentColor || 'var(--accent-cyan)';
  let hostname = '';
  try {
    hostname = new URL(exhibit.url).hostname;
  } catch {
    hostname = exhibit.url;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exhibit-modal-title"
    >
      <div
        className="modal-container glass-panel exhibit-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `4px solid ${accentColor}` }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>{wing?.icon || '🏛️'}</span>
            <div>
              <span
                className="tag-badge"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}55`,
                  fontSize: '0.72rem',
                }}
              >
                {wing?.name}
              </span>
              {exhibit.year && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  circa {exhibit.year}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className={`fav-star-btn ${isFavorited ? 'active' : ''}`}
              onClick={() => onToggleFavorite(exhibit.id)}
              title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              {isFavorited ? '♥ Favorited' : '♡ Favorite'}
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close exhibit details"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 id="exhibit-modal-title" className="exhibit-modal-title">
            {exhibit.title}
          </h2>

          {exhibit.author && (
            <p className="exhibit-author">
              Crafted by <strong>{exhibit.author}</strong>
            </p>
          )}

          <div className="exhibit-tagline-quote">
            "{exhibit.tagline}"
          </div>

          {/* Curatorial Statement */}
          <div className="curator-section">
            <h4 className="curator-heading">
              <span>🏛️</span> Curator’s Statement &amp; Significance
            </h4>
            <p className="curator-text">{exhibit.curatorNotes}</p>
          </div>

          {/* Tags & Metadata Pills */}
          <div className="exhibit-meta-row">
            <div className="meta-item">
              <span className="meta-label">Interaction:</span>
              <span className="tag-badge" style={{ textTransform: 'capitalize' }}>
                {exhibit.interactionLevel}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Domain:</span>
              <span className="mono-code">{hostname}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Passport Status:</span>
              <button
                type="button"
                className={`passport-toggle-btn ${isVisited ? 'visited' : ''}`}
                onClick={() => onToggleVisited(exhibit.id)}
              >
                {isVisited ? '✓ Stamped in Passport' : '○ Mark as Visited'}
              </button>
            </div>
          </div>

          <div className="exhibit-tags-list">
            {exhibit.tags.map((tag) => (
              <span key={tag} className="tag-badge">
                #{tag}
              </span>
            ))}
          </div>

          {onAddToTrailDraft && (
            <div style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
                onClick={() => onAddToTrailDraft(exhibit.id)}
              >
                {isAddedToTrailDraft ? '✓ Added to Active Trail Draft' : '+ Add to Trail Draft'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with Primary Outbound Explore Button & Navigation */}
        <div className="modal-footer exhibit-modal-footer">
          <div className="modal-nav-arrows">
            <button
              type="button"
              className="btn-secondary"
              onClick={onPrevExhibit}
              title="Previous exhibit (Left Arrow)"
            >
              ← Previous
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onNextExhibit}
              title="Next exhibit (Right Arrow)"
            >
              Next →
            </button>
          </div>

          <button
            type="button"
            className="btn-primary btn-explore-outbound"
            onClick={() => onExploreOutbound(exhibit)}
            title="Launch exhibit website in new tab"
          >
            <span>Explore Website</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}
