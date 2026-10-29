# Internet Museum — Project Specification (SPEC.md)

## 1. Product Overview

**Internet Museum** is an interactive, curated virtual museum celebrating the creative, unusual, fascinating, and forgotten corners of the World Wide Web. Rather than an ordinary link directory, it treats exceptional websites as museum exhibits—complete with curatorial notes, thematic gallery wings, interactive spatial discovery, visitor footprints, and shareable guided trails.

---

## 2. Target Audience & Core Value

- **Curious Web Explorers**: Users fatigued by homogenized social feeds seeking whimsical, artistic, weird, and inspiring web craftsmanship.
- **Digital Preservationists & Historians**: Enthusiasts looking for living digital artifacts, early web experiments, and retro cyber-culture.
- **Creative Technologists & Designers**: Creators seeking novel interactions, generative art, and unorthodox UI/UX paradigms.

---

## 3. Essential Features

### 3.1 Curated Exhibit Catalog
- Structured local dataset containing real, hand-curated websites with rich metadata:
  - `id`, `title`, `url`, `tagline`, `description` (curator's statement)
  - `wing` / `category` (e.g., Generative Art, Digital Artifacts, Obscure Tools, Play & Puzzles, Hyper-Niche)
  - `era` / `launchYear`
  - `tags` (e.g., `#audio`, `#canvas`, `#minimalist`, `#retro`, `#interactive`)
  - `curiosityRating` / `experienceType` (Passive, Interactive, Game, Audio-Visual)
  - `thumbnail` / preview visual asset references

### 3.2 Museum Navigation & Exploration Map
- Spatial or visual map layout organizing exhibits into thematic **Museum Wings**:
  - *The Atrium*: Featured exhibits, daily highlights, and museum intro.
  - *Hall of Generative Wonders*: Algorithmic art, procedural graphics, and audio-reactive spaces.
  - *Archive of Forgotten Protocols & Retro Web*: Nostalgic experiments, early web aesthetics, digital time capsules.
  - *The Cabinet of Curiosities*: Hyper-niche, bizarre single-serving sites and existential web toys.
  - *Playground of Interactive Fiction & Puzzles*: Browser games, riddles, and collaborative canvases.
- Multiple discovery modes: Map view, Gallery Grid view, and "Random Teleport" (shuffle).

### 3.3 Exhibit Inspector & Outbound Gate
- Dedicated exhibit detail drawer/modal with:
  - High-resolution preview / animated snapshot representation.
  - Curatorial writeup: *Why it matters*, historical context, creator attribution.
  - External launch button with clear security / outbound warning indicators.
  - Direct deep-linking support (`#exhibit-id`).

### 3.4 Search, Tagging & Faceted Filtering
- Instant client-side search across titles, descriptions, curator notes, tags, and launch years.
- Filter chips by wing/category, interactive intensity, and era.

### 3.5 Shareable User-Curated "Trails"
- Curate custom trails (e.g., *"30 Minutes of Mind-Bending Web Soundscapes"* or *"Strange Websites from 1999"*).
- Add/reorder exhibits to an active trail.
- Serialization of trails into URL query parameters or hash fragments for instant sharing with zero backend required.

### 3.6 Visitor Passport & Local Persistence
- **Favorites / Saved Exhibits**: Bookmark web wonders for future visits.
- **Visited Tracker ("Passport Stamps")**: Visual indicator on exhibits already explored.
- **Visitor History & Stats**: Percentage of the museum discovered.
- Complete privacy: All visitor state persisted locally via `localStorage`.

---

## 4. Architecture & Technical Foundation

```
museum-project/
├── index.html                   # HTML entry point with metadata & font imports
├── package.json                 # Core dependencies (React 19, TypeScript, Vite)
├── tsconfig.json                # TypeScript root configuration
├── vite.config.ts               # Vite bundler configuration
├── SPEC.md                      # Product specification and milestone roadmap
├── public/
│   ├── exhibits/                # Local thumbnails, icons, preview assets
│   └── museum-badge.svg         # Museum iconography
└── src/
    ├── main.tsx                 # Application mounting point
    ├── App.tsx                  # Root app layout & view router
    ├── index.css                # Design system: tokens, typography, glassmorphism, animations
    ├── types/
    │   ├── exhibit.ts           # Types for Exhibit, Category/Wing, Tag, Era
    │   ├── trail.ts             # Types for Curated Trails & URL encoding payload
    │   └── visitor.ts           # Types for Visitor Passport (favorites, visited)
    ├── data/
    │   ├── exhibits.ts          # Curated exhibits dataset
    │   ├── wings.ts             # Definitions & lore for museum wings
    │   └── presetTrails.ts      # Staff-recommended starter trails
    ├── context/
    │   └── VisitorContext.tsx   # React context for visitor state & persistence
    ├── hooks/
    │   ├── useExhibits.ts       # Filtering, search, and random exhibit logic
    │   ├── useVisitorState.ts   # LocalStorage synchronization hook
    │   └── useTrailSharing.ts   # URL encoder/decoder for trails
    └── components/
        ├── layout/              # Header, Museum Navigation Bar, Footer
        ├── map/                 # Museum Map & Wing Overview
        ├── gallery/             # Exhibit Card, Gallery Grid, Filters, Search Bar
        ├── exhibit/             # Exhibit Detail Modal & Outbound Launch Gate
        ├── trails/              # Trail Builder & Trail Viewer
        └── passport/            # Visitor Passport Drawer (stats, bookmarks)
```

### Key Technical Decisions
1. **Zero External Backend Requirement**:
   - The entire museum operates as a high-performance static client-side web application.
   - Trails are encoded directly into URL hashes (Base64 / URL-safe compressed format), enabling peer-to-peer link sharing without a database.
2. **Vanilla CSS Design System**:
   - Clean, modern CSS variables for dark museum ambiance: deep slate/obsidian canvases, neon brass & cyber-amethyst accents, frosted glass panels (`backdrop-filter`), and smooth fluid micro-transitions.
   - Semantic HTML and full keyboard accessibility.
3. **Data Integrity & Type Safety**:
   - Strict TypeScript definitions for exhibit metadata, ensuring verified URLs, tags, and category mappings.

---

## 5. Development Milestones

- [x] **Milestone 1: Project Foundation & Architecture Blueprint** (Current)
  - Initialize Vite + React + TypeScript workspace.
  - Define SPEC.md, core project directory layout, and baseline TypeScript types.
  - Create a polished temporary landing page confirming dev setup.
  - Verify build, type-check, and local execution.

- [ ] **Milestone 2: Data Schema & Curated Exhibit Collection**
  - Define comprehensive TypeScript schemas (`Exhibit`, `Wing`, `Tag`, `Trail`).
  - Curate initial 20+ genuine, active, creative, and historic web exhibits with metadata.
  - Implement data retrieval hooks with search and filtering logic.

- [ ] **Milestone 3: Interactive Floorplan & Wings Navigation**
  - Implement interactive Museum Map with visual wings.
  - Responsive gallery view with dynamic filtering and search.
  - Distinctive visual styling and micro-interactions.

- [ ] **Milestone 4: Exhibit Showcase Modal & Safe Outbound Experience**
  - High-impact modal view with curator commentary and tags.
  - Safe outbound link protocol and copy-link utilities.
  - Deep-link support for specific exhibits via URL hash.

- [ ] **Milestone 5: Visitor Passport (Local Persistence) & Shareable Trails**
  - LocalStorage visitor passport: bookmarking, stamp of visited exhibits, discovery percentage.
  - Trail builder: create custom journeys, order stops, and generate shareable URLs.
  - Preset staff curated tours.

- [ ] **Milestone 6: Visual Wow-Factor, Polish & Deployment Readiness**
  - Ambient museum audio or sound effects (opt-in).
  - Rich animations, keyboard shortcuts, performance audit, and production build readiness.
