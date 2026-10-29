import { useState, useEffect, useMemo, useCallback } from 'react';
import { STARTER_EXHIBITS } from './data/exhibits';
import { MUSEUM_WINGS } from './data/wings';
import { PRESET_TRAILS } from './data/presetTrails';
import type { Exhibit, MuseumWingId } from './types/exhibit';
import type { MuseumTrail } from './types/trail';
import type { VisitorState } from './types/visitor';
import {
  loadVisitorState,
  saveVisitorState,
  decodeTrailFromUrl,
} from './services/storageService';

// Components
import { Navbar } from './components/layout/Navbar';
import { AwsInfoModal } from './components/layout/AwsInfoModal';
import { ConstellationMap } from './components/map/ConstellationMap';
import { GalleryGrid } from './components/gallery/GalleryGrid';
import { WingFilterBar } from './components/gallery/WingFilterBar';
import { ExhibitDetailModal } from './components/exhibit/ExhibitDetailModal';
import { VisitorPassportModal } from './components/passport/VisitorPassportModal';
import { TrailModal } from './components/trails/TrailModal';
import { ActiveTrailBar } from './components/trails/ActiveTrailBar';

import './App.css';

export function App() {
  // Visitor State persisted in localStorage
  const [visitorState, setVisitorState] = useState<VisitorState>(() => loadVisitorState());

  // Discovery & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWingId, setSelectedWingId] = useState<MuseumWingId | 'all'>('all');
  const [viewMode, setViewMode] = useState<'constellation' | 'grid'>('constellation');

  // Modals & Selected Exhibit
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isTrailModalOpen, setIsTrailModalOpen] = useState(false);
  const [isAwsInfoOpen, setIsAwsInfoOpen] = useState(false);

  // Active Guided Trail State
  const [activeTrail, setActiveTrail] = useState<MuseumTrail | null>(() => decodeTrailFromUrl());
  const [activeTrailStopIndex, setActiveTrailStopIndex] = useState(0);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    const initialTrail = decodeTrailFromUrl();
    return initialTrail ? `🧭 Shared Trail Loaded: "${initialTrail.title}"` : null;
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Save to localStorage on visitorState update
  useEffect(() => {
    saveVisitorState(visitorState);
  }, [visitorState]);

  // Filtered Exhibits calculation
  const filteredExhibits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return STARTER_EXHIBITS.filter((exhibit) => {
      // Wing filter
      if (selectedWingId !== 'all' && exhibit.wingId !== selectedWingId) {
        return false;
      }

      // Search query filter
      if (query) {
        const matchesTitle = exhibit.title.toLowerCase().includes(query);
        const matchesTagline = exhibit.tagline.toLowerCase().includes(query);
        const matchesNotes = exhibit.curatorNotes.toLowerCase().includes(query);
        const matchesTags = exhibit.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthor = exhibit.author?.toLowerCase().includes(query);
        const matchesYear = exhibit.year?.toString().includes(query);

        return (
          matchesTitle ||
          matchesTagline ||
          matchesNotes ||
          matchesTags ||
          matchesAuthor ||
          matchesYear
        );
      }

      return true;
    });
  }, [searchQuery, selectedWingId]);

  // Wing counts for filter bar badges
  const wingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    STARTER_EXHIBITS.forEach((ex) => {
      counts[ex.wingId] = (counts[ex.wingId] || 0) + 1;
    });
    return counts;
  }, []);

  // Exhibit Selection Handler
  const handleSelectExhibit = useCallback((exhibit: Exhibit) => {
    setSelectedExhibit(exhibit);
    setIsDetailOpen(true);
  }, []);

  // Next/Previous sequential exhibit navigation
  const handleNextExhibit = useCallback(() => {
    if (!selectedExhibit) return;
    const currentIndex = filteredExhibits.findIndex((e) => e.id === selectedExhibit.id);
    if (currentIndex >= 0 && currentIndex < filteredExhibits.length - 1) {
      setSelectedExhibit(filteredExhibits[currentIndex + 1]);
    } else if (filteredExhibits.length > 0) {
      setSelectedExhibit(filteredExhibits[0]); // Wrap around
    }
  }, [selectedExhibit, filteredExhibits]);

  const handlePrevExhibit = useCallback(() => {
    if (!selectedExhibit) return;
    const currentIndex = filteredExhibits.findIndex((e) => e.id === selectedExhibit.id);
    if (currentIndex > 0) {
      setSelectedExhibit(filteredExhibits[currentIndex - 1]);
    } else if (filteredExhibits.length > 0) {
      setSelectedExhibit(filteredExhibits[filteredExhibits.length - 1]); // Wrap around
    }
  }, [selectedExhibit, filteredExhibits]);

  // Favorite toggle handler
  const handleToggleFavorite = useCallback((id: string) => {
    setVisitorState((prev) => {
      const exists = prev.favorites.includes(id);
      const newFavorites = exists
        ? prev.favorites.filter((favId) => favId !== id)
        : [...prev.favorites, id];
      return { ...prev, favorites: newFavorites };
    });
  }, []);

  // Visited toggle handler
  const handleToggleVisited = useCallback((id: string) => {
    setVisitorState((prev) => {
      const exists = prev.visitedExhibitIds.includes(id);
      const newVisited = exists
        ? prev.visitedExhibitIds.filter((visId) => visId !== id)
        : [...prev.visitedExhibitIds, id];
      return { ...prev, visitedExhibitIds: newVisited };
    });
  }, []);

  // Outbound link handler: opens in new tab and stamps passport
  const handleExploreOutbound = useCallback((exhibit: Exhibit) => {
    // Record visit in localStorage
    setVisitorState((prev) => {
      if (!prev.visitedExhibitIds.includes(exhibit.id)) {
        return {
          ...prev,
          visitedExhibitIds: [...prev.visitedExhibitIds, exhibit.id],
          lastVisitedAt: new Date().toISOString(),
        };
      }
      return prev;
    });

    // Launch external site
    window.open(exhibit.url, '_blank', 'noopener,noreferrer');
  }, []);

  // "Surprise Me" action: random teleport
  const handleSurpriseMe = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * STARTER_EXHIBITS.length);
    const randomExhibit = STARTER_EXHIBITS[randomIndex];
    setSelectedExhibit(randomExhibit);
    setIsDetailOpen(true);
    showToast(`🎲 Teleported to "${randomExhibit.title}"!`);
  }, [showToast]);

  // Trail management handlers
  const handleStartTrail = useCallback((trail: MuseumTrail) => {
    setActiveTrail(trail);
    setActiveTrailStopIndex(0);
    const firstStopId = trail.exhibitIds[0];
    const firstExhibit = STARTER_EXHIBITS.find((e) => e.id === firstStopId);
    if (firstExhibit) {
      setSelectedExhibit(firstExhibit);
    }
    showToast(`🧭 Started expedition: "${trail.title}"`);
  }, [showToast]);

  const handleNextTrailStop = useCallback(() => {
    if (!activeTrail) return;
    if (activeTrailStopIndex < activeTrail.exhibitIds.length - 1) {
      const nextIdx = activeTrailStopIndex + 1;
      setActiveTrailStopIndex(nextIdx);
      const nextStopId = activeTrail.exhibitIds[nextIdx];
      const nextExhibit = STARTER_EXHIBITS.find((e) => e.id === nextStopId);
      if (nextExhibit) setSelectedExhibit(nextExhibit);
    }
  }, [activeTrail, activeTrailStopIndex]);

  const handlePrevTrailStop = useCallback(() => {
    if (!activeTrail) return;
    if (activeTrailStopIndex > 0) {
      const prevIdx = activeTrailStopIndex - 1;
      setActiveTrailStopIndex(prevIdx);
      const prevStopId = activeTrail.exhibitIds[prevIdx];
      const prevExhibit = STARTER_EXHIBITS.find((e) => e.id === prevStopId);
      if (prevExhibit) setSelectedExhibit(prevExhibit);
    }
  }, [activeTrail, activeTrailStopIndex]);

  const handleExitTrail = useCallback(() => {
    setActiveTrail(null);
    setActiveTrailStopIndex(0);
    showToast('Exited guided trail.');
  }, [showToast]);

  const handleCreateCustomTrail = useCallback((trail: MuseumTrail) => {
    setVisitorState((prev) => ({
      ...prev,
      customTrails: [
        ...prev.customTrails,
        {
          id: trail.id,
          title: trail.title,
          exhibitIds: trail.exhibitIds,
          createdAt: trail.createdAt || new Date().toISOString(),
        },
      ],
    }));
    showToast(`✨ Custom trail "${trail.title}" saved!`);
  }, [showToast]);

  const handleDeleteCustomTrail = useCallback((id: string) => {
    setVisitorState((prev) => ({
      ...prev,
      customTrails: prev.customTrails.filter((t) => t.id !== id),
    }));
    showToast('Trail removed.');
  }, [showToast]);

  const handleResetPassport = useCallback(() => {
    setVisitorState({
      favorites: [],
      visitedExhibitIds: [],
      customTrails: [],
      preferences: {
        soundEnabled: true,
        reducedMotion: false,
        theme: 'dark',
      },
    });
    showToast('Passport history has been reset.');
  }, [showToast]);

  // Current active trail stop exhibit
  const currentTrailStopExhibit = useMemo(() => {
    if (!activeTrail) return undefined;
    const currentId = activeTrail.exhibitIds[activeTrailStopIndex];
    return STARTER_EXHIBITS.find((e) => e.id === currentId);
  }, [activeTrail, activeTrailStopIndex]);

  // Wing of current selected exhibit
  const selectedWing = useMemo(() => {
    if (!selectedExhibit) return undefined;
    return MUSEUM_WINGS.find((w) => w.id === selectedExhibit.wingId);
  }, [selectedExhibit]);

  // Custom trails formatted as MuseumTrail
  const customMuseumTrails = useMemo(() => {
    return visitorState.customTrails.map((t) => ({
      id: t.id,
      title: t.title,
      description: 'Custom visitor curated expedition.',
      curatorName: 'You (Visitor Curator)',
      exhibitIds: t.exhibitIds,
      estimatedMinutes: t.exhibitIds.length * 4,
      isStaffPick: false,
    }));
  }, [visitorState.customTrails]);

  return (
    <div className="museum-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification glass-panel" role="status">
          {toastMessage}
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSurpriseMe={handleSurpriseMe}
        onOpenTrails={() => setIsTrailModalOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenAwsInfo={() => setIsAwsInfoOpen(true)}
        visitedCount={visitorState.visitedExhibitIds.length}
        totalCount={STARTER_EXHIBITS.length}
        favoritesCount={visitorState.favorites.length}
      />

      {/* Wing Filter Bar */}
      <WingFilterBar
        wings={MUSEUM_WINGS}
        selectedWingId={selectedWingId}
        onSelectWing={setSelectedWingId}
        wingCounts={wingCounts}
        totalCount={STARTER_EXHIBITS.length}
        filteredCount={filteredExhibits.length}
      />

      {/* Main Interactive Stage */}
      <main className="museum-stage">
        {viewMode === 'constellation' ? (
          <ConstellationMap
            exhibits={filteredExhibits}
            allExhibits={STARTER_EXHIBITS}
            wings={MUSEUM_WINGS}
            selectedExhibitId={selectedExhibit?.id || null}
            onSelectExhibit={handleSelectExhibit}
            visitedExhibitIds={visitorState.visitedExhibitIds}
            favoriteExhibitIds={visitorState.favorites}
            activeTrail={activeTrail}
            activeTrailStopIndex={activeTrailStopIndex}
          />
        ) : (
          <div className="container" style={{ padding: '1.5rem' }}>
            <GalleryGrid
              exhibits={filteredExhibits}
              wings={MUSEUM_WINGS}
              visitedExhibitIds={visitorState.visitedExhibitIds}
              favoriteExhibitIds={visitorState.favorites}
              onSelectExhibit={handleSelectExhibit}
              onToggleFavorite={handleToggleFavorite}
              onExploreOutbound={handleExploreOutbound}
            />
          </div>
        )}
      </main>

      {/* Floating Active Trail HUD Bar */}
      {activeTrail && (
        <ActiveTrailBar
          trail={activeTrail}
          currentStopIndex={activeTrailStopIndex}
          currentExhibit={currentTrailStopExhibit}
          onNextStop={handleNextTrailStop}
          onPrevStop={handlePrevTrailStop}
          onInspectStop={() => {
            if (currentTrailStopExhibit) {
              setSelectedExhibit(currentTrailStopExhibit);
              setIsDetailOpen(true);
            }
          }}
          onExploreStopOutbound={() => {
            if (currentTrailStopExhibit) {
              handleExploreOutbound(currentTrailStopExhibit);
            }
          }}
          onExitTrail={handleExitTrail}
        />
      )}

      {/* Exhibit Detail Inspector Modal */}
      <ExhibitDetailModal
        exhibit={selectedExhibit}
        wing={selectedWing}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isVisited={selectedExhibit ? visitorState.visitedExhibitIds.includes(selectedExhibit.id) : false}
        isFavorited={selectedExhibit ? visitorState.favorites.includes(selectedExhibit.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onToggleVisited={handleToggleVisited}
        onExploreOutbound={handleExploreOutbound}
        onNextExhibit={handleNextExhibit}
        onPrevExhibit={handlePrevExhibit}
      />

      {/* Visitor Passport Modal */}
      <VisitorPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        allExhibits={STARTER_EXHIBITS}
        wings={MUSEUM_WINGS}
        visitedExhibitIds={visitorState.visitedExhibitIds}
        favoriteExhibitIds={visitorState.favorites}
        onSelectExhibit={(ex) => {
          setSelectedExhibit(ex);
          setIsPassportOpen(false);
          setIsDetailOpen(true);
        }}
        onRemoveFavorite={handleToggleFavorite}
        onResetPassport={handleResetPassport}
      />

      {/* Trails & Expedition Modal */}
      <TrailModal
        isOpen={isTrailModalOpen}
        onClose={() => setIsTrailModalOpen(false)}
        presetTrails={PRESET_TRAILS}
        customTrails={customMuseumTrails}
        allExhibits={STARTER_EXHIBITS}
        onStartTrail={handleStartTrail}
        onCreateCustomTrail={handleCreateCustomTrail}
        onDeleteCustomTrail={handleDeleteCustomTrail}
      />

      {/* AWS Cloud Architecture Modal */}
      <AwsInfoModal
        isOpen={isAwsInfoOpen}
        onClose={() => setIsAwsInfoOpen(false)}
      />
    </div>
  );
}

export default App;
