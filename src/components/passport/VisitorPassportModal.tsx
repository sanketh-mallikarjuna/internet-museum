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
        style={{
          boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.9), 0 0 35px -10px rgba(56, 189, 248, 0.2)',
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.8rem' }} aria-hidden="true">🛂</span>
            <div>
              <h3 id="passport-modal-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                Visitor Passport &amp; Curatorial Stamp Book
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official Digital Footprint • Verified In-Browser Ledger
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close passport">
            ✕
          </button>
        </div>

        {/* Exploration Meter */}
        <div className="passport-meter-card glass-panel" style={{ padding: '1.1rem 1.35rem', margin: '1rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Total Museum Exploration Index
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {visitedPercent}% ({visitedCount} of {totalCount} Exhibits)
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${visitedPercent}%`,
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.6)',
              }}
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
            ♥ Saved Bookmarks ({favoriteExhibits.length})
          </button>
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'visited' ? 'active' : ''}`}
            onClick={() => setActiveTab('visited')}
            role="tab"
            aria-selected={activeTab === 'visited'}
          >
            ✓ Visited Chronology ({visitedExhibits.length})
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
                    style={{
                      borderColor: isComplete ? wing.accentColor : 'var(--border-subtle)',
                      boxShadow: isComplete ? `0 0 20px -5px ${wing.accentColor}44` : undefined,
                      borderLeft: `4px solid ${wing.accentColor}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{wing.icon}</span>
                      <span
                        className="stamp-status-badge"
                        style={{
                          backgroundColor: isComplete ? `${wing.accentColor}25` : `${wing.accentColor}15`,
                          color: wing.accentColor,
                          border: `1px solid ${wing.accentColor}55`,
                        }}
                      >
                        {isComplete ? '★ Wing Mastered' : `${wingVisited.length} / ${wingExhibits.length} Explored`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', margin: '0 0 0.25rem', color: wing.accentColor, fontFamily: 'var(--font-display)' }}>
                      {wing.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.85rem', lineHeight: 1.4 }}>
                      {wing.tagline}
                    </p>

                    {/* Official Stamp Cells */}
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      {wingExhibits.map((ex) => {
                        const done = visitedExhibitIds.includes(ex.id);
                        return (
                          <div
                            key={ex.id}
                            title={`${ex.title}: ${done ? 'Stamped & Verified' : 'Unvisited'}`}
                            onClick={() => onSelectExhibit(ex)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: done ? `${wing.accentColor}22` : 'rgba(255,255,255,0.04)',
                              border: `1px dashed ${done ? wing.accentColor : 'var(--border-subtle)'}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              color: done ? wing.accentColor : 'var(--text-muted)',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'var(--transition-smooth)',
                            }}
                          >
                            {done ? '✓' : '·'}
                          </div>
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
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }} aria-hidden="true">♡</div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>No Saved Favorites Yet</h4>
                  <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
                    Click the heart icon on any exhibit card or constellation node to curate your personal gallery.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {favoriteExhibits.map((exhibit) => {
                    const wing = wings.find((w) => w.id === exhibit.wingId);
                    return (
                      <div
                        key={exhibit.id}
                        className="passport-item-row glass-panel"
                        onClick={() => onSelectExhibit(exhibit)}
                        style={{ cursor: 'pointer', padding: '0.85rem 1.15rem' }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span aria-hidden="true">{wing?.icon}</span>
                            <strong style={{ fontSize: '0.975rem', color: 'var(--text-primary)' }}>{exhibit.title}</strong>
                            {exhibit.year && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                ({exhibit.year})
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                            {exhibit.tagline}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="fav-star-btn active"
                            onClick={() => onRemoveFavorite(exhibit.id)}
                            title="Remove bookmark"
                            aria-label={`Remove ${exhibit.title} from favorites`}
                          >
                            ♥
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visited' && (
            <div>
              {visitedExhibits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }} aria-hidden="true">🧭</div>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Your Passport is Blank</h4>
                  <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
                    Explore websites or inspect artifacts to collect verified stamps in your travel log.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {visitedExhibits.map((exhibit) => {
                    const wing = wings.find((w) => w.id === exhibit.wingId);
                    return (
                      <div
                        key={exhibit.id}
                        className="passport-item-row glass-panel"
                        onClick={() => onSelectExhibit(exhibit)}
                        style={{ cursor: 'pointer', padding: '0.85rem 1.15rem' }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span aria-hidden="true">{wing?.icon}</span>
                            <strong style={{ fontSize: '0.975rem', color: 'var(--text-primary)' }}>{exhibit.title}</strong>
                            <span
                              className="visited-pill"
                              style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}
                            >
                              ✓ Stamped
                            </span>
                          </div>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                            {exhibit.tagline}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Safe Reset */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {!showResetConfirm ? (
              <button
                type="button"
                className="btn-text-danger"
                onClick={() => setShowResetConfirm(true)}
              >
                Clear Passport &amp; History
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#f87171' }}>Are you sure?</span>
                <button
                  type="button"
                  className="btn-danger-sm"
                  onClick={() => {
                    onResetPassport();
                    setShowResetConfirm(false);
                  }}
                >
                  Yes, Clear
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

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
}
