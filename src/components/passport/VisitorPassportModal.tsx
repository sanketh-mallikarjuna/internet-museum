import { useState } from 'react';
import type { Exhibit, MuseumWing } from '../../types/exhibit';

interface VisitorPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allExhibits: Exhibit[];
  wings: MuseumWing[];
  visitedExhibitIds: string[];
  favoriteExhibitIds: string[];
  onSelectExhibit: (exhibit: Exhibit) => void;
  onRemoveFavorite: (id: string) => void;
  onResetPassport: () => void;
}

export function VisitorPassportModal({
  isOpen,
  onClose,
  allExhibits,
  wings,
  visitedExhibitIds,
  favoriteExhibitIds,
  onSelectExhibit,
  onRemoveFavorite,
  onResetPassport,
}: VisitorPassportModalProps) {
  const [activeTab, setActiveTab] = useState<'stamps' | 'favorites' | 'visited'>('stamps');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const totalCount = allExhibits.length;
  const visitedCount = visitedExhibitIds.length;
  const visitedPercent = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  const favoriteExhibits = allExhibits.filter((e) => favoriteExhibitIds.includes(e.id));
  const visitedExhibits = allExhibits.filter((e) => visitedExhibitIds.includes(e.id));

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="passport-modal-title"
    >
      <div
        className="modal-container glass-panel passport-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🛂</span>
            <div>
              <h3 id="passport-modal-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Visitor Passport &amp; Exploration Stamp Book
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Locally saved footprint • Stored in your browser
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close passport">
            ✕
          </button>
        </div>

        {/* Exploration Meter */}
        <div className="passport-meter-card glass-panel" style={{ padding: '1rem 1.25rem', margin: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total Museum Explored
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {visitedPercent}% ({visitedCount} of {totalCount})
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${visitedPercent}%` }}
              role="progressbar"
              aria-valuenow={visitedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="passport-tabs" role="tablist">
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'stamps' ? 'active' : ''}`}
            onClick={() => setActiveTab('stamps')}
            role="tab"
            aria-selected={activeTab === 'stamps'}
          >
            🏛️ Wing Stamps ({wings.length})
          </button>
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
            role="tab"
            aria-selected={activeTab === 'favorites'}
          >
            ♥ Favorites ({favoriteExhibits.length})
          </button>
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'visited' ? 'active' : ''}`}
            onClick={() => setActiveTab('visited')}
            role="tab"
            aria-selected={activeTab === 'visited'}
          >
            ✓ Visited Log ({visitedExhibits.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body passport-tab-content" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          {activeTab === 'stamps' && (
            <div className="passport-stamps-grid">
              {wings.map((wing) => {
                const wingExhibits = allExhibits.filter((e) => e.wingId === wing.id);
                const wingVisited = wingExhibits.filter((e) => visitedExhibitIds.includes(e.id));
                const isComplete = wingExhibits.length > 0 && wingVisited.length === wingExhibits.length;

                return (
                  <div
                    key={wing.id}
                    className="stamp-card glass-panel"
                    style={{ borderColor: isComplete ? wing.accentColor : undefined }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{wing.icon}</span>
                      <span
                        className="stamp-status-badge"
                        style={{
                          backgroundColor: `${wing.accentColor}22`,
                          color: wing.accentColor,
                          border: `1px solid ${wing.accentColor}55`,
                        }}
                      >
                        {wingVisited.length} / {wingExhibits.length} Stamps
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', margin: '0 0 0.25rem', color: wing.accentColor }}>
                      {wing.name}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>
                      {wing.tagline}
                    </p>

                    {/* Stamp dots */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {wingExhibits.map((ex) => {
                        const done = visitedExhibitIds.includes(ex.id);
                        return (
                          <span
                            key={ex.id}
                            title={`${ex.title}: ${done ? 'Stamped' : 'Unvisited'}`}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: done ? wing.accentColor : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${done ? wing.accentColor : 'var(--border-subtle)'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '9px',
                              color: '#0a0c14',
                              fontWeight: 'bold',
                            }}
                          >
                            {done ? '✓' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              {favoriteExhibits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>♡</div>
                  <p>You have not saved any exhibits to your favorites yet.</p>
                  <p style={{ fontSize: '0.8rem' }}>Click the heart icon on any exhibit card or node to bookmark it here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {favoriteExhibits.map((exhibit) => (
                    <div
                      key={exhibit.id}
                      className="passport-item-row glass-panel"
                      onClick={() => onSelectExhibit(exhibit)}
                      style={{ cursor: 'pointer', padding: '0.75rem 1rem' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{exhibit.title}</strong>
                          {exhibit.year && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({exhibit.year})</span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                          {exhibit.tagline}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn-card-inspect"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => onSelectExhibit(exhibit)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="fav-star-btn active"
                          onClick={() => onRemoveFavorite(exhibit.id)}
                          title="Remove from favorites"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visited' && (
            <div>
              {visitedExhibits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
                  <p>No exhibits visited yet in this browser session.</p>
                  <p style={{ fontSize: '0.8rem' }}>Click "Explore Website" on any exhibit to begin collecting your stamps!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {visitedExhibits.map((exhibit) => (
                    <div
                      key={exhibit.id}
                      className="passport-item-row glass-panel"
                      onClick={() => onSelectExhibit(exhibit)}
                      style={{ cursor: 'pointer', padding: '0.75rem 1rem' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#10b981', fontSize: '0.85rem' }}>✓</span>
                          <strong style={{ fontSize: '0.95rem' }}>{exhibit.title}</strong>
                          <span className="tag-badge" style={{ fontSize: '0.68rem' }}>
                            {wings.find((w) => w.id === exhibit.wingId)?.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                          {exhibit.tagline}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-card-inspect"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExhibit(exhibit);
                        }}
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Reset Controls */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {!showResetConfirm ? (
              <button
                type="button"
                className="btn-text-danger"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Passport History
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#f87171' }}>Confirm reset?</span>
                <button
                  type="button"
                  className="btn-danger-sm"
                  onClick={() => {
                    onResetPassport();
                    setShowResetConfirm(false);
                  }}
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button type="button" className="btn-primary" onClick={onClose}>
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
}
