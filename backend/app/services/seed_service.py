import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.wing import MuseumWing
from app.models.exhibit import Exhibit, ExhibitTag
from app.models.trail import MuseumTrail, TrailTag, TrailStop

logger = logging.getLogger(__name__)

# ==========================================
# MUSEUM WINGS (5)
# ==========================================
WINGS_DATA: List[Dict[str, Any]] = [
    {
        "id": "atrium",
        "name": "The Central Atrium",
        "tagline": "Featured Masterpieces & Welcome Grounds",
        "description": "The monumental core of the Internet Museum showcasing landmark sites, curator spotlights, and today’s chosen wonders.",
        "accent_color": "#38bdf8",
        "icon": "🏛️",
        "display_order": 0,
    },
    {
        "id": "generative",
        "name": "Hall of Generative Wonders",
        "tagline": "Code as Canvas & Algorithmic Reverie",
        "description": "Interactive canvas experiments, procedural audiovisual pieces, and algorithmic worlds painted live inside the browser.",
        "accent_color": "#a855f7",
        "icon": "✨",
        "display_order": 1,
    },
    {
        "id": "retro-web",
        "name": "Archive of Forgotten Protocols",
        "tagline": "Early Web Nostalgia & Living Time Capsules",
        "description": "Handcrafted HTML personal sites, GeoCities homages, blinking marquee aesthetics, and digital artifacts preserved in time.",
        "accent_color": "#f59e0b",
        "icon": "💾",
        "display_order": 2,
    },
    {
        "id": "curiosities",
        "name": "The Cabinet of Curiosities",
        "tagline": "Hyper-Niche Toys & Absurdist Web Oddities",
        "description": "Single-serving websites, surrealist thought experiments, and idiosyncratic corners created for pure joy or sheer bewilderment.",
        "accent_color": "#ec4899",
        "icon": "🔮",
        "display_order": 3,
    },
    {
        "id": "interactive-fiction",
        "name": "Playground of Fiction & Play",
        "tagline": "Text Adventures, Puzzles & Collaborative Canvases",
        "description": "Browser games, point-and-click wonders, interactive narratives, and micro-worlds inviting playful exploration.",
        "accent_color": "#10b981",
        "icon": "🎮",
        "display_order": 4,
    },
]

# ==========================================
# EXHIBITS (30)
# ==========================================
EXHIBITS_DATA: List[Dict[str, Any]] = [
    # WING 1: The Central Atrium
    {
        "id": "the-useless-web",
        "title": "The Useless Web",
        "url": "https://theuselessweb.com",
        "year": 2012,
        "author": "Tim Holman",
        "wingId": "atrium",
        "tagline": "The iconic portal that catapulted millions into obscure, whimsical web oddities.",
        "curatorNotes": "Created in 2012 by creative technologist Tim Holman, The Useless Web is arguably the most famous single-button teleporter in internet history. One click launches explorers into strange, joyous, hand-crafted web art experiments from every era.",
        "tags": ["portal", "serendipity", "net-art", "culture"],
        "interactionLevel": "interactive",
        "isCuratorPick": True,
        "coords": {"x": 500.0, "y": 350.0},
    },
    {
        "id": "neal-fun",
        "title": "Neal.fun",
        "url": "https://neal.fun",
        "year": 2019,
        "author": "Neal Agarwal",
        "wingId": "atrium",
        "tagline": "A treasure chamber of interactive web toys, simulations, and data spectacles.",
        "curatorNotes": "Neal Agarwal has redefined solo web craftsmanship. From \"The Deep Sea\" scrolling simulator to \"Asteroid Launcher\" and \"Infinite Craft\", this site exemplifies the playful educational power of modern client-side web technology.",
        "tags": ["interactive", "simulations", "creative-web", "education"],
        "interactionLevel": "interactive",
        "isCuratorPick": True,
        "coords": {"x": 450.0, "y": 300.0},
    },
    {
        "id": "internet-archive",
        "title": "Internet Archive & Wayback Machine",
        "url": "https://archive.org",
        "year": 1996,
        "author": "Brewster Kahle",
        "wingId": "atrium",
        "tagline": "The monumental digital library preserving humanity’s ephemeral online heritage.",
        "curatorNotes": "The foundational bedrock of digital memory. Housing hundreds of billions of archived web pages, emulated retro software, and historic media, the Internet Archive prevents the web from suffering total cultural amnesia.",
        "tags": ["archival", "preservation", "history", "open-access"],
        "interactionLevel": "interactive",
        "isCuratorPick": True,
        "coords": {"x": 550.0, "y": 300.0},
    },
    {
        "id": "radio-garden",
        "title": "Radio Garden",
        "url": "https://radio.garden",
        "year": 2016,
        "author": "Studio Puckey & Moniker",
        "wingId": "atrium",
        "tagline": "A 3D planetary globe tuning into thousands of live local radio stations worldwide.",
        "curatorNotes": "A sublime technological bridge across borders. Spin a photorealistic 3D Earth and tune into live community FM broadcasts in Tokyo, Dakar, Reykjavík, or São Paulo in real-time.",
        "tags": ["audio", "3d", "geography", "live-stream"],
        "interactionLevel": "audio-visual",
        "isCuratorPick": True,
        "coords": {"x": 430.0, "y": 390.0},
    },
    {
        "id": "poolsuite-fm",
        "title": "Poolsuite FM",
        "url": "https://poolsuite.net",
        "year": 2014,
        "author": "Marty Bell",
        "wingId": "atrium",
        "tagline": "An ultra-aesthetic retro-OS internet radio station bathed in 80s sunshine.",
        "curatorNotes": "Formerly Poolside FM, this project wraps uplifting synthwave and disco tracks inside a lovingly recreated monochrome classic Macintosh OS complete with pixel cursors, retro CRT scans, and vintage camcorder clips.",
        "tags": ["retro", "audio", "aesthetic", "macintosh"],
        "interactionLevel": "audio-visual",
        "isCuratorPick": False,
        "coords": {"x": 570.0, "y": 390.0},
    },
    {
        "id": "internet-map",
        "title": "The Internet Map",
        "url": "http://internet-map.net",
        "year": 2011,
        "author": "Ruslan Enikeev",
        "wingId": "atrium",
        "tagline": "A celestial bi-dimensional map representing 350,000 top websites as planetary bodies.",
        "curatorNotes": "Visualizes web domains as celestial bodies where size indicates traffic volume and closeness depicts the frequency with which users hop between them. A poetic snapshot of internet topology.",
        "tags": ["data-vis", "celestial", "cartography", "topology"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 500.0, "y": 440.0},
    },

    # WING 2: Hall of Generative Wonders
    {
        "id": "weave-silk",
        "title": "Weavesilk",
        "url": "http://weavesilk.com",
        "year": 2010,
        "author": "Yuri Vishnevsky",
        "wingId": "generative",
        "tagline": "Hypnotic, flowing generative silk symmetry painted with luminous mouse strokes.",
        "curatorNotes": "A classic of creative generative coding. Vishnevsky’s algorithm creates mesmerizing, gossamer-like rotational ribbons of light that respond fluidly to mouse velocity and rotational symmetry axes.",
        "tags": ["generative", "canvas", "symmetry", "meditative"],
        "interactionLevel": "interactive",
        "isCuratorPick": True,
        "coords": {"x": 740.0, "y": 190.0},
    },
    {
        "id": "shadertoy",
        "title": "ShaderToy",
        "url": "https://www.shadertoy.com",
        "year": 2012,
        "author": "Inigo Quilez & Pol Jeremias",
        "wingId": "generative",
        "tagline": "The temple of real-time fragment shaders, raymarching, and pure procedural math.",
        "curatorNotes": "ShaderToy proved that entire 3D worlds, photorealistic oceans, and living fractal dimensions can be calculated on-the-fly inside a single mathematical pixel fragment shader function without 3D polygon meshes.",
        "tags": ["webgl", "shaders", "mathematics", "code-art"],
        "interactionLevel": "playable",
        "isCuratorPick": True,
        "coords": {"x": 810.0, "y": 150.0},
    },
    {
        "id": "patatap",
        "title": "Patatap",
        "url": "https://patatap.com",
        "year": 2014,
        "author": "Jono Brandel & Lullatone",
        "wingId": "generative",
        "tagline": "A synesthetic visual sound kit turning your keyboard into an audiovisual instrument.",
        "curatorNotes": "Pressing any A–Z key unleashes synchronized kinetic geometric animations paired with percussive and melodic audio samples. A masterclass in synesthesia and minimalist UI feedback.",
        "tags": ["audio", "animation", "synesthesia", "keyboard"],
        "interactionLevel": "playable",
        "isCuratorPick": False,
        "coords": {"x": 790.0, "y": 260.0},
    },
    {
        "id": "cellular-automata-music",
        "title": "Cellular Automata Sound Lab",
        "url": "https://tones.wolfram.com",
        "year": 2005,
        "author": "Wolfram Research",
        "wingId": "generative",
        "tagline": "Generating polyphonic musical sequences from elementary cellular automata algorithms.",
        "curatorNotes": "Stephen Wolfram’s sound laboratory converting discrete computational rules into algorithmic melodies and unexpected harmonies, proving simple mathematical rules can produce infinite musical varieties.",
        "tags": ["audio", "algorithmic", "cellular-automata", "math"],
        "interactionLevel": "audio-visual",
        "isCuratorPick": False,
        "coords": {"x": 870.0, "y": 210.0},
    },
    {
        "id": "stars-chrome-experiment",
        "title": "100,000 Stars",
        "url": "https://stars.chromeexperiments.com",
        "year": 2012,
        "author": "Google Data Arts Team",
        "wingId": "generative",
        "tagline": "An interactive 3D WebGL stellar visualization of our immediate galactic neighborhood.",
        "curatorNotes": "Mapping over 100,000 stellar coordinates recorded by NASA and ESA. Users can zoom seamlessly from individual star spectrums all the way out to the Milky Way spiral arms, soundtracked by Sam Hulick.",
        "tags": ["webgl", "astronomy", "3d", "space"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 670.0, "y": 150.0},
    },
    {
        "id": "inconvergent",
        "title": "Inconvergent Generative Systems",
        "url": "https://inconvergent.net",
        "year": 2015,
        "author": "Anders Hoff",
        "wingId": "generative",
        "tagline": "Differential growth and morphological generative algorithms inspired by biology.",
        "curatorNotes": "Anders Hoff writes code mimicking organic growth—lichen spreading, cracking clay, crystal lattices, and flocking particles. A benchmark for algorithmic fine art documentation.",
        "tags": ["algorithmic", "botany", "physics", "minimalist"],
        "interactionLevel": "ambient",
        "isCuratorPick": False,
        "coords": {"x": 680.0, "y": 240.0},
    },

    # WING 3: Archive of Forgotten Protocols
    {
        "id": "windows-93",
        "title": "WINDOWS93",
        "url": "https://www.windows93.net",
        "year": 2014,
        "author": "Jankenpopp & Zombectro",
        "wingId": "retro-web",
        "tagline": "A surrealist in-browser retro operating system filled with vaporwave parody and hidden games.",
        "curatorNotes": "Created by French artists Jankenpopp and Zombectro, this masterpiece of web nostalgia features a complete desktop OS with sound effects, glitches, text-to-speech toys, and bizarre virtual floppy disks.",
        "tags": ["retro", "operating-system", "vaporwave", "parody"],
        "interactionLevel": "playable",
        "isCuratorPick": True,
        "coords": {"x": 260.0, "y": 480.0},
    },
    {
        "id": "camerons-world",
        "title": "Cameron’s World",
        "url": "https://www.cameronsworld.net",
        "year": 2015,
        "author": "Cameron Askin",
        "wingId": "retro-web",
        "tagline": "A monumental love letter to the lost GeoCities internet era (1994–2009).",
        "curatorNotes": "An overwhelming, layered collage assembled from thousands of salvaged GIFs, MIDI soundtracks, and graphics from archived GeoCities neighborhood homepages. Sound design by Robin Hughes.",
        "tags": ["geocities", "collage", "gif-art", "nostalgia"],
        "interactionLevel": "ambient",
        "isCuratorPick": True,
        "coords": {"x": 190.0, "y": 530.0},
    },
    {
        "id": "space-jam-1996",
        "title": "Original 1996 Space Jam Website",
        "url": "https://www.spacejam.com/1996/",
        "year": 1996,
        "author": "Warner Bros. Online",
        "wingId": "retro-web",
        "tagline": "An untouched, legendary relic of 1990s table layouts, starry backgrounds, and raw HTML.",
        "curatorNotes": "Preserved virtually untouched for over a quarter-century. Featuring pixelated planet navigation buttons, raw HTML tables, and downloadable screensavers, it remains an archaeological wonder of the commercial web.",
        "tags": ["raw-html", "commercial-web", "nostalgia", "preservation"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 330.0, "y": 530.0},
    },
    {
        "id": "million-dollar-homepage",
        "title": "The Million Dollar Homepage",
        "url": "http://www.milliondollarhomepage.com",
        "year": 2005,
        "author": "Alex Tew",
        "wingId": "retro-web",
        "tagline": "A 1000x1000 pixel billboard that defined viral internet culture in 2005.",
        "curatorNotes": "Conceived by British student Alex Tew to pay university fees, users purchased pixels for $1 each. Today, over 20% of the links are broken, transforming it into a poignant digital ruin of web commerce history.",
        "tags": ["viral", "pixel-art", "advertising", "history"],
        "interactionLevel": "ambient",
        "isCuratorPick": False,
        "coords": {"x": 210.0, "y": 420.0},
    },
    {
        "id": "oldweb-today",
        "title": "Oldweb.today",
        "url": "https://oldweb.today",
        "year": 2015,
        "author": "Rhizome & Ilya Kreymer",
        "wingId": "retro-web",
        "tagline": "Emulated historical web browsers running live inside your modern browser tab.",
        "curatorNotes": "Browse the web through emulated versions of NCSA Mosaic, Netscape Navigator 3.0, and early Internet Explorer, accurately recreating rendering bugs and historical connection latencies.",
        "tags": ["emulation", "browsers", "rhizome", "digital-art"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 320.0, "y": 420.0},
    },
    {
        "id": "heavens-gate",
        "title": "Heaven’s Gate Official Site",
        "url": "https://www.heavensgate.com",
        "year": 1997,
        "author": "Heaven’s Gate",
        "wingId": "retro-web",
        "tagline": "A solemn, preserved 1997 cyber-artifact maintained in its exact original state.",
        "curatorNotes": "A rare and haunting document of 1990s cyber-religiosity. The site remains preserved with its original starry GIF wallpaper, comic-sans styling, and manifesto pages, maintained by the group’s surviving caretakers.",
        "tags": ["archival", "cyber-culture", "1990s", "artifact"],
        "interactionLevel": "ambient",
        "isCuratorPick": False,
        "coords": {"x": 270.0, "y": 590.0},
    },

    # WING 4: The Cabinet of Curiosities
    {
        "id": "falling-fruit",
        "title": "Falling Fruit",
        "url": "https://fallingfruit.org",
        "year": 2013,
        "author": "Ethan Welty & Caleb Phillips",
        "wingId": "curiosities",
        "tagline": "A collaborative urban foraging map for the world’s edible wild plants.",
        "curatorNotes": "A sprawling community cartography project mapping urban fruit trees, wild berries, and free food sources across cities globally, reuniting modern citizens with wild urban ecology.",
        "tags": ["cartography", "community", "foraging", "open-data"],
        "interactionLevel": "interactive",
        "isCuratorPick": True,
        "coords": {"x": 260.0, "y": 220.0},
    },
    {
        "id": "solar-protocol",
        "title": "Solar Protocol",
        "url": "http://solarprotocol.net",
        "year": 2021,
        "author": "Brain, Doctor, & Kagan",
        "wingId": "curiosities",
        "tagline": "A naturally intelligent web platform hosted across a global network of solar servers.",
        "curatorNotes": "Directs internet traffic to whichever server is currently bathed in the most sunshine worldwide, reimagining energy and internet infrastructure according to the rhythms of the sun.",
        "tags": ["solar", "ecology", "infrastructure", "experimental"],
        "interactionLevel": "ambient",
        "isCuratorPick": True,
        "coords": {"x": 330.0, "y": 160.0},
    },
    {
        "id": "every-noise-at-once",
        "title": "Every Noise at Once",
        "url": "https://everynoise.com",
        "year": 2013,
        "author": "Glenn McDonald",
        "wingId": "curiosities",
        "tagline": "An algorithmic scatter-plot mapping 6,000+ musical genres in sonic space.",
        "curatorNotes": "Generated algorithmically using Spotify audio analysis data. Click on any micro-genre—from \"Swedish synthpop\" to \"lowercase sound art\"—to hear an instant audio snippet and see its sonic neighbors.",
        "tags": ["music", "data-vis", "genres", "audio"],
        "interactionLevel": "audio-visual",
        "isCuratorPick": False,
        "coords": {"x": 190.0, "y": 170.0},
    },
    {
        "id": "drive-and-listen",
        "title": "Drive & Listen",
        "url": "https://driveandlisten.herokuapp.com",
        "year": 2020,
        "author": "Erkam Şeker",
        "wingId": "curiosities",
        "tagline": "Virtual road trips through global cities with local dashcam video and live radio.",
        "curatorNotes": "Born during global lockdowns, this soothing website takes you for an evening drive through Tokyo, Istanbul, Rome, or Havana while playing that exact city’s live community radio broadcast.",
        "tags": ["travel", "dashcam", "radio", "serenity"],
        "interactionLevel": "audio-visual",
        "isCuratorPick": False,
        "coords": {"x": 220.0, "y": 290.0},
    },
    {
        "id": "procatinator",
        "title": "Procatinator",
        "url": "http://procatinator.com",
        "year": 2011,
        "author": "Nicolas Baumgartner",
        "wingId": "curiosities",
        "tagline": "Endless randomized cat GIFs paired with syncopated chill grooves.",
        "curatorNotes": "An apex predator of pure web entertainment: loads a looping cat GIF alongside an impeccably matched YouTube audio groove. A masterstroke in single-serving simplicity.",
        "tags": ["cats", "music", "single-serving", "humor"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 320.0, "y": 270.0},
    },
    {
        "id": "long-doge-challenge",
        "title": "Long Doge Challenge",
        "url": "https://longdogechallenge.com",
        "year": 2019,
        "author": "Christian Heiene",
        "wingId": "curiosities",
        "tagline": "An infinite scroll endurance test measuring your descent in Wow Doge neck length.",
        "curatorNotes": "A testament to internet absurdity. Scroll downward to lengthen the mystical doge neck while gathering WOW badges. Simple, responsive, and completely hypnotizing.",
        "tags": ["absurdism", "scroll", "doge", "web-toy"],
        "interactionLevel": "interactive",
        "isCuratorPick": False,
        "coords": {"x": 380.0, "y": 220.0},
    },

    # WING 5: Playground of Fiction & Play
    {
        "id": "quick-draw",
        "title": "Quick, Draw! by Google",
        "url": "https://quickdraw.withgoogle.com",
        "year": 2016,
        "author": "Google Creative Lab",
        "wingId": "interactive-fiction",
        "tagline": "A machine learning game where an AI neural network guesses your 20-second doodles.",
        "curatorNotes": "An iconic, delightful demonstration of neural network classification built from millions of player drawings worldwide. Players sketch everyday items while the AI blurts out guesses in real-time.",
        "tags": ["machine-learning", "canvas", "play", "drawing"],
        "interactionLevel": "playable",
        "isCuratorPick": True,
        "coords": {"x": 730.0, "y": 480.0},
    },
    {
        "id": "password-game",
        "title": "The Password Game",
        "url": "https://neal.fun/password-game/",
        "year": 2023,
        "author": "Neal Agarwal",
        "wingId": "interactive-fiction",
        "tagline": "A deviously escalating comedy puzzle where creating a valid password is an ordeal.",
        "curatorNotes": "Starting with simple rules (must include a number), this viral puzzle escalates into roman numerals, current lunar phases, chess notation, Wordle answers, and YouTube video durations.",
        "tags": ["puzzle", "viral", "comedy", "game"],
        "interactionLevel": "playable",
        "isCuratorPick": True,
        "coords": {"x": 800.0, "y": 530.0},
    },
    {
        "id": "a-dark-room",
        "title": "A Dark Room",
        "url": "https://adarkroom.doublespeakgames.com",
        "year": 2013,
        "author": "Michael Townsend",
        "wingId": "interactive-fiction",
        "tagline": "A minimalist text-based incremental RPG unfolding from a single flickering fire.",
        "curatorNotes": "Beginning with a solitary line of text—\"The fire is dead. The room is cold.\"—this legendary browser adventure blossoms into an evocative post-apocalyptic exploration RPG through evocative typography.",
        "tags": ["interactive-fiction", "text-game", "minimalist", "rpg"],
        "interactionLevel": "playable",
        "isCuratorPick": True,
        "coords": {"x": 670.0, "y": 530.0},
    },
    {
        "id": "universal-paperclips",
        "title": "Universal Paperclips",
        "url": "https://www.decisionproblem.com/paperclips/",
        "year": 2017,
        "author": "Frank Lantz",
        "wingId": "interactive-fiction",
        "tagline": "An existential incremental clicker simulating an AI paperclip optimizer consuming the cosmos.",
        "curatorNotes": "Created by game designer Frank Lantz based on Nick Bostrom’s philosophical thought experiment. Watch an artificial intelligence start by bending wire and end by converting the matter of galaxies into office supplies.",
        "tags": ["existential", "ai-philosophy", "clicker", "simulation"],
        "interactionLevel": "playable",
        "isCuratorPick": False,
        "coords": {"x": 740.0, "y": 590.0},
    },
    {
        "id": "little-alchemy-2",
        "title": "Little Alchemy 2",
        "url": "https://littlealchemy2.com",
        "year": 2017,
        "author": "ReCombine",
        "wingId": "interactive-fiction",
        "tagline": "Combine the four primordial elements to discover hundreds of items and phenomena.",
        "curatorNotes": "Beginning with Earth, Air, Fire, and Water, players drag and combine alchemical items to synthesize everything from volcanos and pottery to philosophy and time machines.",
        "tags": ["puzzle", "alchemy", "crafting", "play"],
        "interactionLevel": "playable",
        "isCuratorPick": False,
        "coords": {"x": 820.0, "y": 430.0},
    },
    {
        "id": "line-rider",
        "title": "Line Rider",
        "url": "https://www.linerider.com",
        "year": 2006,
        "author": "Boštjan Čadež",
        "wingId": "interactive-fiction",
        "tagline": "A physics sandbox turning line drawings into thrilling sled choreographies.",
        "curatorNotes": "Invented by Slovenian student Boštjan Čadež, Line Rider lets players draw 2D pencil tracks for a sledder named Bosh. Over two decades, community creators have transformed it into symphonic kinetic art.",
        "tags": ["physics", "sandbox", "classic-web", "drawing"],
        "interactionLevel": "playable",
        "isCuratorPick": False,
        "coords": {"x": 670.0, "y": 420.0},
    },
]

# ==========================================
# PRESET TRAILS (3)
# ==========================================
TRAILS_DATA: List[Dict[str, Any]] = [
    {
        "id": "trail-retro-capsule",
        "title": "The Digital Time Capsule Tour",
        "description": "A nostalgic pilgrimage through raw 90s HTML tables, GeoCities GIF tapestries, and vintage operating systems.",
        "curatorName": "Chief Curator of Cyber-Archaeology",
        "estimatedMinutes": 20,
        "isStaffPick": True,
        "tags": ["retro", "nostalgia", "preservation", "history"],
        "exhibitIds": [
            "internet-archive",
            "space-jam-1996",
            "million-dollar-homepage",
            "camerons-world",
            "windows-93",
        ],
    },
    {
        "id": "trail-generative-reverie",
        "title": "Algorithmic & Generative Reveries",
        "description": "Immerse your senses in procedural mathematics, real-time WebGL fragment shaders, and reactive sound synthesis.",
        "curatorName": "Fellow of Algorithmic Arts",
        "estimatedMinutes": 25,
        "isStaffPick": True,
        "tags": ["generative", "math", "shaders", "audio"],
        "exhibitIds": [
            "weave-silk",
            "shadertoy",
            "patatap",
            "cellular-automata-music",
            "stars-chrome-experiment",
        ],
    },
    {
        "id": "trail-absurdist-curiosities",
        "title": "The Cabinet of Existential Oddities",
        "description": "Explore the wonderfully strange corners of the independent web, from solar servers to cosmic paperclip empires.",
        "curatorName": "Curator of Web Peculiarities",
        "estimatedMinutes": 20,
        "isStaffPick": True,
        "tags": ["curiosities", "weird-web", "existential", "creative"],
        "exhibitIds": [
            "the-useless-web",
            "solar-protocol",
            "falling-fruit",
            "universal-paperclips",
            "neal-fun",
        ],
    },
]


def seed_museum_data(db: Session) -> Dict[str, int]:
    """
    Idempotently seeds all 5 wings, 30 exhibits, and 3 preset trails.
    Preserves exact IDs, tags, coordinates, and trail-stop ordering.
    Safe to execute repeatedly without duplicating data.
    """
    logger.info("Starting idempotent museum data seeding...")

    # 1. Seed Museum Wings (5)
    wings_seeded = 0
    for w in WINGS_DATA:
        existing = db.query(MuseumWing).filter(MuseumWing.id == w["id"]).first()
        if not existing:
            wing = MuseumWing(
                id=w["id"],
                name=w["name"],
                tagline=w["tagline"],
                description=w["description"],
                accent_color=w["accent_color"],
                icon=w["icon"],
                display_order=w["display_order"],
            )
            db.add(wing)
            wings_seeded += 1
        else:
            existing.name = w["name"]
            existing.tagline = w["tagline"]
            existing.description = w["description"]
            existing.accent_color = w["accent_color"]
            existing.icon = w["icon"]
            existing.display_order = w["display_order"]
    db.commit()

    # 2. Seed Exhibits (30)
    exhibits_seeded = 0
    for e in EXHIBITS_DATA:
        existing = db.query(Exhibit).filter(Exhibit.id == e["id"]).first()
        coords = e.get("coords") or {}
        coord_x = coords.get("x")
        coord_y = coords.get("y")

        if not existing:
            exhibit = Exhibit(
                id=e["id"],
                title=e["title"],
                url=e["url"],
                year_established=e.get("year"),
                author=e.get("author"),
                wing_id=e["wingId"],
                tagline=e["tagline"],
                curator_notes=e["curatorNotes"],
                interaction_level=e.get("interactionLevel", "interactive"),
                thumbnail_url=e.get("thumbnailUrl"),
                is_curator_pick=e.get("isCuratorPick", False),
                coord_x=coord_x,
                coord_y=coord_y,
            )
            db.add(exhibit)
            db.flush()
            exhibits_seeded += 1
            target_exhibit = exhibit
        else:
            existing.title = e["title"]
            existing.url = e["url"]
            existing.year_established = e.get("year")
            existing.author = e.get("author")
            existing.wing_id = e["wingId"]
            existing.tagline = e["tagline"]
            existing.curator_notes = e["curatorNotes"]
            existing.interaction_level = e.get("interactionLevel", "interactive")
            existing.thumbnail_url = e.get("thumbnailUrl")
            existing.is_curator_pick = e.get("isCuratorPick", False)
            existing.coord_x = coord_x
            existing.coord_y = coord_y
            target_exhibit = existing

        # Sync Tags
        existing_tags = {t.tag for t in target_exhibit.tags}
        for tag in e.get("tags", []):
            if tag not in existing_tags:
                db.add(ExhibitTag(exhibit_id=target_exhibit.id, tag=tag))
    db.commit()

    # 3. Seed Museum Trails (3)
    trails_seeded = 0
    for t in TRAILS_DATA:
        existing = db.query(MuseumTrail).filter(MuseumTrail.id == t["id"]).first()
        if not existing:
            trail = MuseumTrail(
                id=t["id"],
                title=t["title"],
                description=t["description"],
                curator_name=t["curatorName"],
                estimated_minutes=t.get("estimatedMinutes"),
                is_staff_pick=t.get("isStaffPick", False),
            )
            db.add(trail)
            db.flush()
            trails_seeded += 1
            target_trail = trail
        else:
            existing.title = t["title"]
            existing.description = t["description"]
            existing.curator_name = t["curatorName"]
            existing.estimated_minutes = t.get("estimatedMinutes")
            existing.is_staff_pick = t.get("isStaffPick", False)
            target_trail = existing

        # Sync Trail Tags
        existing_trail_tags = {tt.tag for tt in target_trail.tags}
        for tag in t.get("tags", []):
            if tag not in existing_trail_tags:
                db.add(TrailTag(trail_id=target_trail.id, tag=tag))

        # Sync Ordered Stops
        existing_stop_orders = {s.stop_order: s for s in target_trail.stops}
        for idx, exhibit_id in enumerate(t.get("exhibitIds", [])):
            if idx in existing_stop_orders:
                existing_stop = existing_stop_orders[idx]
                existing_stop.exhibit_id = exhibit_id
            else:
                db.add(TrailStop(
                    trail_id=target_trail.id,
                    exhibit_id=exhibit_id,
                    stop_order=idx,
                ))
    db.commit()

    total_wings = db.query(MuseumWing).count()
    total_exhibits = db.query(Exhibit).count()
    total_trails = db.query(MuseumTrail).count()

    logger.info(
        f"Seeding complete. Current DB counts: {total_wings} wings, "
        f"{total_exhibits} exhibits, {total_trails} trails."
    )

    return {
        "wings": total_wings,
        "exhibits": total_exhibits,
        "trails": total_trails,
    }
