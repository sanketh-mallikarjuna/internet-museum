interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'constellation' | 'grid';
  onViewModeChange: (mode: 'constellation' | 'grid') => void;
  onSurpriseMe: () => void;
  onOpenTrails: () => void;
  onOpenPassport: () => void;
  onOpenAwsInfo: () => void;
  visitedCount: number;
  totalCount: number;
  favoritesCount: number;
  isLiveBackend?: boolean | null;
  isLoadingBackend?: boolean;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onSurpriseMe,
  onOpenTrails,
  onOpenPassport,
  onOpenAwsInfo,
  visitedCount,
  totalCount,
  favoritesCount,
  isLiveBackend,
  isLoadingBackend,
}: NavbarProps) {
  return (
    <header className="museum-navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => onSearchChange('')} style={{ cursor: 'pointer' }}>
          <div className="nav-brand-icon" aria-hidden="true">🏛️</div>
          <div className="nav-brand-text">
            <h2>Internet Museum</h2>
            <span className="nav-brand-subtitle">Living Archive of Web Curiosities</span>
          </div>
        </div>

        {/* Search */}
        <div className="nav-search-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search 30 curated exhibits, tags, years..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search exhibits"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions & View Controls */}
        <div className="nav-actions">
          {/* View Mode Toggle */}
          <div className="view-toggle-group" role="radiogroup" aria-label="Display View">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'constellation' ? 'active' : ''}`}
              onClick={() => onViewModeChange('constellation')}
              title="Constellation Map View"
              aria-checked={viewMode === 'constellation'}
              role="radio"
            >
              <span aria-hidden="true">🌌</span>
              <span className="btn-label-desktop">Map</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Gallery Grid View"
              aria-checked={viewMode === 'grid'}
              role="radio"
            >
              <span aria-hidden="true">📋</span>
              <span className="btn-label-desktop">Grid</span>
            </button>
          </div>

          {/* Surprise Me / Random */}
          <button
            type="button"
            className="nav-btn surprise-btn"
            onClick={onSurpriseMe}
            title="Teleport to a random exhibit"
          >
            <span aria-hidden="true">🎲</span>
            <span className="btn-label-desktop">Surprise Me</span>
          </button>

          {/* Trails Modal Button */}
          <button
            type="button"
            className="nav-btn"
            onClick={onOpenTrails}
            title="Curated and Custom Trails"
          >
            <span aria-hidden="true">🧭</span>
            <span className="btn-label-desktop">Trails</span>
          </button>

          {/* Visitor Passport Button */}
          <button
            type="button"
            className="nav-btn passport-btn"
            onClick={onOpenPassport}
            title="Visitor Passport & Bookmarks"
          >
            <span aria-hidden="true">🛂</span>
            <span className="btn-label-desktop">Passport</span>
            <span className="counter-badge" title={`${visitedCount} of ${totalCount} visited`}>
              {visitedCount}/{totalCount}
            </span>
            {favoritesCount > 0 && (
              <span className="heart-counter-badge" title={`${favoritesCount} favorites`}>
                ♥ {favoritesCount}
              </span>
            )}
          </button>

          {/* Backend API Connection Status */}
          <div
            className={`nav-status-badge ${isLoadingBackend ? 'loading' : isLiveBackend ? 'online' : 'fallback'}`}
            title={
              isLoadingBackend
                ? 'Connecting to FastAPI backend...'
                : isLiveBackend
                  ? 'Connected to live FastAPI & MySQL backend (http://127.0.0.1:8000)'
                  : 'Running in offline fallback mode with verified local museum archive'
            }
          >
            <span className="status-indicator-dot" aria-hidden="true" />
            <span className="status-label">
              {isLoadingBackend ? 'Connecting...' : isLiveBackend ? 'API Live' : 'Archive Mode'}
            </span>
          </div>

          {/* AWS Cloud Badge */}
          <button
            type="button"
            className="nav-btn aws-btn"
            onClick={onOpenAwsInfo}
            title="AWS Cloud Architecture Academic Specs"
          >
            <span aria-hidden="true">☁️</span>
            <span className="aws-tag">AWS Ready</span>
          </button>
        </div>
      </div>
    </header>
  );
}
