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
        <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }} aria-hidden="true">🔭</div>
        <h3>No Curated Exhibits Found</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0.5rem auto 1.5rem', fontSize: '0.925rem' }}>
          Try clearing your search query or switching museum wing filters to uncover more digital artifacts.
        </p>
      </div>
    );
  }

  const getInteractionMeta = (level: string) => {
    switch (level) {
      case 'playable':
        return { label: 'Playable Sandbox', icon: '🎮' };
      case 'audio-visual':
        return { label: 'Audiovisual Experience', icon: '🎵' };
      case 'ambient':
        return { label: 'Ambient Artifact', icon: '🌌' };
      default:
        return { label: 'Interactive', icon: '⚡' };
    }
  };

  return (
    <div className="gallery-grid-container">
      <div className="gallery-grid">
        {exhibits.map((exhibit) => {
          const wing = wings.find((w) => w.id === exhibit.wingId);
          const isVisited = visitedExhibitIds.includes(exhibit.id);
          const isFavorited = favoriteExhibitIds.includes(exhibit.id);
          const accentColor = wing?.accentColor || 'var(--accent-cyan)';
          const interaction = getInteractionMeta(exhibit.interactionLevel);

          return (
            <article
              key={exhibit.id}
              className="gallery-card glass-panel"
              style={{
                borderTop: `3px solid ${accentColor}`,
                ['--card-accent' as string]: accentColor,
              }}
              onClick={() => onSelectExhibit(exhibit)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectExhibit(exhibit);
              }}
            >
              {/* Card Curatorial Header */}
              <div className="gallery-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <span
                    className="tag-badge wing-badge"
                    style={{
                      color: accentColor,
                      borderColor: `${accentColor}44`,
                      background: `${accentColor}12`,
                    }}
                  >
                    <span aria-hidden="true">{wing?.icon}</span> {wing?.name}
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
                      ✓ Explored
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

              {/* Sub-meta: Curator Pick & Interaction Type */}
              <div className="gallery-card-submeta">
                <span className="interaction-badge" title={`Interaction style: ${interaction.label}`}>
                  <span aria-hidden="true">{interaction.icon}</span> {interaction.label}
                </span>
                {exhibit.isCuratorPick && (
                  <span className="curator-pick-pill" title="Official Curatorial Spotlight">
                    ★ Curator Spotlight
                  </span>
                )}
              </div>

              {/* Title & Curatorial Tagline */}
              <h3 className="gallery-card-title">{exhibit.title}</h3>
              <p className="gallery-card-tagline">
                <span className="tagline-quote-mark" aria-hidden="true">“</span>
                {exhibit.tagline}
                <span className="tagline-quote-mark" aria-hidden="true">”</span>
              </p>

              {/* Curator Note Excerpt */}
              <p className="gallery-card-notes">
                {exhibit.curatorNotes}
              </p>

              {/* Tags */}
              <div className="gallery-card-tags">
                {exhibit.tags.slice(0, 4).map((tag) => (
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
                  title="View exhibition plaque and curator notes"
                >
                  <span aria-hidden="true">🔎</span> Plaque Details
                </button>
                <button
                  type="button"
                  className="btn-card-explore"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
                    borderColor: `${accentColor}55`,
                    color: accentColor,
                  }}
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
