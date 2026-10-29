import type { MuseumWing, MuseumWingId } from '../../types/exhibit';

interface WingFilterBarProps {
  wings: MuseumWing[];
  selectedWingId: MuseumWingId | 'all';
  onSelectWing: (wingId: MuseumWingId | 'all') => void;
  wingCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
}

export function WingFilterBar({
  wings,
  selectedWingId,
  onSelectWing,
  wingCounts,
  totalCount,
  filteredCount,
}: WingFilterBarProps) {
  return (
    <div className="filter-bar-wrapper">
      <div className="filter-scroll-container">
        {/* All Wings Filter */}
        <button
          type="button"
          className={`filter-chip ${selectedWingId === 'all' ? 'active' : ''}`}
          onClick={() => onSelectWing('all')}
        >
          <span className="filter-chip-icon">🌐</span>
          <span>All Exhibits</span>
          <span className="filter-chip-count">{totalCount}</span>
        </button>

        {/* Individual Wings */}
        {wings.map((wing) => {
          const isSelected = selectedWingId === wing.id;
          const count = wingCounts[wing.id] || 0;

          return (
            <button
              key={wing.id}
              type="button"
              className={`filter-chip ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? wing.accentColor : undefined,
                color: isSelected ? '#ffffff' : undefined,
              }}
              onClick={() => onSelectWing(isSelected ? 'all' : wing.id)}
            >
              <span className="filter-chip-icon">{wing.icon}</span>
              <span>{wing.name}</span>
              <span
                className="filter-chip-count"
                style={{
                  backgroundColor: isSelected ? wing.accentColor : undefined,
                  color: isSelected ? '#0a0c14' : undefined,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="filter-status-text">
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredCount}</strong> of{' '}
        {totalCount} exhibits
      </div>
    </div>
  );
}
