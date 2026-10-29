import { useState } from 'react';
import type { MuseumTrail } from '../../types/trail';
import type { Exhibit } from '../../types/exhibit';
import { encodeTrailToShareUrl } from '../../services/storageService';

interface TrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetTrails: MuseumTrail[];
  customTrails: MuseumTrail[];
  allExhibits: Exhibit[];
  onStartTrail: (trail: MuseumTrail) => void;
  onCreateCustomTrail: (trail: MuseumTrail) => void;
  onDeleteCustomTrail: (id: string) => void;
}

export function TrailModal({
  isOpen,
  onClose,
  presetTrails,
  customTrails,
  allExhibits,
  onStartTrail,
  onCreateCustomTrail,
  onDeleteCustomTrail,
}: TrailModalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [copiedTrailId, setCopiedTrailId] = useState<string | null>(null);

  // Trail builder state
  const [title, setTitle] = useState('');
  const [curatorName, setCuratorName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExhibitIds, setSelectedExhibitIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShareTrail = async (trail: MuseumTrail) => {
    try {
      const shareUrl = encodeTrailToShareUrl(trail);
      await navigator.clipboard.writeText(shareUrl);
      setCopiedTrailId(trail.id);
      setTimeout(() => setCopiedTrailId(null), 3000);
    } catch {
      // Fallback
      prompt('Copy this shareable trail link:', encodeTrailToShareUrl(trail));
    }
  };

  const handleToggleExhibitSelect = (id: string) => {
    setSelectedExhibitIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a title for your trail.');
      return;
    }
    if (selectedExhibitIds.length < 2) {
      setFormError('Please select at least 2 exhibits for your journey.');
      return;
    }

    const newTrail: MuseumTrail = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      curatorName: curatorName.trim() || 'Visitor Curator',
      description: description.trim() || 'A personal curated expedition across the web.',
      exhibitIds: selectedExhibitIds,
      estimatedMinutes: selectedExhibitIds.length * 4,
      tags: ['user-curated', 'custom-trail'],
      isStaffPick: false,
      createdAt: new Date().toISOString(),
    };

    onCreateCustomTrail(newTrail);
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedExhibitIds([]);
    setFormError(null);
    setActiveTab('browse');
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trail-modal-title"
    >
      <div
        className="modal-container glass-panel trail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🧭</span>
            <div>
              <h3 id="trail-modal-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Guided Museum Trails &amp; Custom Expeditions
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Hand-curated paths through web history • Shareable via URL
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close trails">
            ✕
          </button>
        </div>

        {/* Tab Controls */}
        <div className="passport-tabs" role="tablist" style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
            role="tab"
            aria-selected={activeTab === 'browse'}
          >
            🧭 Curated &amp; Custom Trails ({presetTrails.length + customTrails.length})
          </button>
          <button
            type="button"
            className={`passport-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
            role="tab"
            aria-selected={activeTab === 'create'}
          >
            ✨ Build Custom Trail
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'browse' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Staff Curated Trails */}
              <div>
                <div className="section-label">Official Staff Excursions</div>
                <div className="trails-list">
                  {presetTrails.map((trail) => (
                    <article key={trail.id} className="trail-card glass-panel">
                      <div className="trail-card-header">
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="tag-badge" style={{ color: '#fbbf24', borderColor: '#fbbf2444' }}>
                              ★ Staff Pick
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              ~{trail.estimatedMinutes} mins • {trail.exhibitIds.length} stops
                            </span>
                          </div>
                          <h4 className="trail-title">{trail.title}</h4>
                        </div>
                      </div>

                      <p className="trail-desc">{trail.description}</p>
                      <div className="trail-curator">Curated by {trail.curatorName}</div>

                      {/* Stops Preview */}
                      <div className="trail-stops-strip">
                        {trail.exhibitIds.map((id, idx) => {
                          const ex = allExhibits.find((e) => e.id === id);
                          return (
                            <span key={id} className="trail-stop-pill">
                              <span className="trail-stop-num">{idx + 1}</span>
                              <span>{ex?.title || id}</span>
                            </span>
                          );
                        })}
                      </div>

                      <div className="trail-card-footer">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            onStartTrail(trail);
                            onClose();
                          }}
                        >
                          Begin Journey →
                        </button>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => handleShareTrail(trail)}
                          title="Generate shareable URL"
                        >
                          {copiedTrailId === trail.id ? '✓ Link Copied!' : 'Share Trail 🔗'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* User Custom Trails */}
              <div>
                <div className="section-label">Your Custom Saved Trails</div>
                {customTrails.length === 0 ? (
                  <div className="empty-substate glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>
                      You haven't built any custom trails yet.
                    </p>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setActiveTab('create')}
                    >
                      + Create Your First Trail
                    </button>
                  </div>
                ) : (
                  <div className="trails-list">
                    {customTrails.map((trail) => (
                      <article key={trail.id} className="trail-card glass-panel">
                        <div className="trail-card-header">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span className="tag-badge" style={{ color: 'var(--accent-cyan)' }}>
                                👤 Custom Trail
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {trail.exhibitIds.length} stops
                              </span>
                            </div>
                            <h4 className="trail-title">{trail.title}</h4>
                          </div>
                          <button
                            type="button"
                            className="fav-star-btn active"
                            onClick={() => onDeleteCustomTrail(trail.id)}
                            title="Delete custom trail"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="trail-desc">{trail.description}</p>

                        <div className="trail-stops-strip">
                          {trail.exhibitIds.map((id, idx) => {
                            const ex = allExhibits.find((e) => e.id === id);
                            return (
                              <span key={id} className="trail-stop-pill">
                                <span className="trail-stop-num">{idx + 1}</span>
                                <span>{ex?.title || id}</span>
                              </span>
                            );
                          })}
                        </div>

                        <div className="trail-card-footer">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                              onStartTrail(trail);
                              onClose();
                            }}
                          >
                            Begin Journey →
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleShareTrail(trail)}
                            title="Share URL that reconstructs this trail on another browser"
                          >
                            {copiedTrailId === trail.id ? '✓ Link Copied!' : 'Share URL 🔗'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateSubmit} className="trail-builder-form">
              {formError && (
                <div className="form-error-banner" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  ⚠️ {formError}
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Trail Title *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Midnight Soundscapes & Weird Shaders"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Your Curator Name (Optional)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Cyber-Nomad or Your Name"
                  value={curatorName}
                  onChange={(e) => setCuratorName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  Curator Note / Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="What makes this collection of websites special?"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              {/* Exhibit Selection Checklist */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Select Exhibits for Trail ({selectedExhibitIds.length} selected) *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Minimum 2 exhibits
                  </span>
                </div>

                <div className="builder-exhibits-picker glass-panel" style={{ maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' }}>
                  {allExhibits.map((exhibit) => {
                    const isChecked = selectedExhibitIds.includes(exhibit.id);
                    return (
                      <label
                        key={exhibit.id}
                        className={`builder-picker-item ${isChecked ? 'selected' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleExhibitSelect(exhibit.id)}
                        />
                        <span style={{ flex: 1 }}>{exhibit.title}</span>
                        <span className="tag-badge" style={{ fontSize: '0.68rem' }}>
                          {exhibit.wingId}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveTab('browse')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save &amp; Create Trail
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ textAlign: 'right' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
