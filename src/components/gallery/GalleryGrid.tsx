import type { Exhibit, MuseumWing } from '../../types/exhibit';

interface GalleryGridProps {
  exhibits: Exhibit[];
  wings: MuseumWing[];
  visitedExhibitIds: string[];
  favoriteExhibitIds: string[];
  onSelectExhibit: (exhibit: Exhibit) => void;
  onToggleFavorite: (exhibitId: string) => void;
  onExploreOutbound: (exhibit: Exhibit) => void;
}

export function GalleryGrid({
  exhibits,
  wings,
  visitedExhibitIds,
  favoriteExhibitIds,
  onSelectExhibit,
  onToggleFavorite,
  onExploreOutbound,
}: GalleryGridProps) {
  if (exhibits.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔭</div>
        <h3>No Exhibits Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
          Try clearing your search query or switching museum wing filters to uncover more artifacts.
        </p>
      </div>
    );
  }

  return (
    <div className="gallery-grid-container">
      <div className="gallery-grid">
        {exhibits.map((exhibit) => {
          const wing = wings.find((w) => w.id === exhibit.wingId);
          const isVisited = visitedExhibitIds.includes(exhibit.id);
          const isFavorited = favoriteExhibitIds.includes(exhibit.id);
          const accentColor = wing?.accentColor || 'var(--accent-cyan)';

          return (
            <article
              key={exhibit.id}
              className="gallery-card glass-panel"
              style={{ borderTop: `3px solid ${accentColor}` }}
              onClick={() => onSelectExhibit(exhibit)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectExhibit(exhibit);
              }}
            >
              {/* Card Header */}
              <div className="gallery-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="tag-badge" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                    {wing?.icon} {wing?.name}
                  </span>
                  {exhibit.year && (
                    <span className="gallery-card-year">
                      {exhibit.year}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isVisited && (
                    <span className="visited-pill" title="You have explored this exhibit">
                      ✓ Visited
                    </span>
                  )}
                  <button
                    type="button"
                    className={`fav-star-btn ${isFavorited ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(exhibit.id);
                    }}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorited ? '♥' : '♡'}
                  </button>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="gallery-card-title">{exhibit.title}</h3>
              <p className="gallery-card-tagline">"{exhibit.tagline}"</p>

              {/* Curator Note Excerpt */}
              <p className="gallery-card-notes">
                {exhibit.curatorNotes}
              </p>

              {/* Tags */}
              <div className="gallery-card-tags">
                {exhibit.tags.map((tag) => (
                  <span key={tag} className="tag-badge">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="gallery-card-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn-card-inspect"
                  onClick={() => onSelectExhibit(exhibit)}
                >
                  Curator Details
                </button>
                <button
                  type="button"
                  className="btn-card-explore"
                  onClick={() => onExploreOutbound(exhibit)}
                  title={`Open ${exhibit.title} in a new tab`}
                >
                  Explore Site ↗
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
