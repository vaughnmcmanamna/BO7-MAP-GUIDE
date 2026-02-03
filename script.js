// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('mapguide-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem('mapguide-theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Initialize theme immediately
initTheme();

// =============================================================================
// CONFIGURATION
// =============================================================================

const mapGuideConfig = {
    games: [
        { id: 'bo7', name: 'Black Ops 7', year: 2025 }
    ],
    modes: ['Hardpoint', 'Search', 'Overload'],
    mapsByGame: {
        'bo7': ['Blackheart', 'Colossus', 'Den', 'Exposure', 'Scar']
    },
    // Define which maps are available per mode (if not listed, all maps are available)
    // Add map names to the array to ENABLE them for that mode
    modeMapAvailability: {
        'bo7': {
            'Hardpoint': ['Blackheart', 'Colossus', 'Den', 'Exposure', 'Scar'],
            'Search': ['Colossus', 'Den', 'Exposure', 'Scar'],  // No Blackheart
            'Overload': ['Blackheart', 'Colossus', 'Den', 'Exposure', 'Scar']
        }
    }
};

// Map Guide Data - Add strategic info here
const mapGuideData = {
    'bo7': {
        'Hardpoint': {
            'Blackheart': { info: 'Blackheart Hardpoint strategic information' },
            'Colossus': { info: 'Colossus Hardpoint strategic information' },
            'Den': { info: 'Den Hardpoint strategic information' },
            'Exposure': { info: 'Exposure Hardpoint strategic information' },
            'Scar': { info: 'Scar Hardpoint strategic information' }
        },
        'Search': {
            'Blackheart': { info: 'Blackheart Search strategic information' },
            'Colossus': { info: 'Colossus Search strategic information' },
            'Den': { info: 'Den Search strategic information' },
            'Exposure': { info: 'Exposure Search strategic information' },
            'Scar': { info: 'Scar Search strategic information' }
        },
        'Overload': {
            'Blackheart': { info: 'Blackheart Overload strategic information' },
            'Colossus': { info: 'Colossus Overload strategic information' },
            'Den': { info: 'Den Overload strategic information' },
            'Exposure': { info: 'Exposure Overload strategic information' },
            'Scar': { info: 'Scar Overload strategic information' }
        }
    }
};

// =============================================================================
// STATE
// =============================================================================

const mapGuideState = {
    selectedGame: null,
    selectedMode: null,
    selectedMap: null
};

// =============================================================================
// IMAGE HELPERS
// =============================================================================

// Per-map zoom levels (default is 1.15)
const mapZoomLevels = {
    'Colossus': 1.25
};

function getMapZoom(mapName) {
    return mapZoomLevels[mapName] || 1.15;
}

function getModeImage(mapName, mode) {
    // Returns the mode-specific image (shown by default)
    const game = mapGuideState.selectedGame;
    const gameUpper = game.toUpperCase();

    // Mode folder mapping (search and overload reuse hardpoint for now)
    const modeFolder = {
        'Hardpoint': 'hardpoint',
        'Search': 'hardpoint',      // Reuse hardpoint for now
        'Overload': 'hardpoint'     // Reuse hardpoint for now
    };

    const folder = modeFolder[mode];
    if (!folder) return null;

    return `images/${game}/${folder}/${mapName}_MiniMap_${gameUpper}.png`;
}

function getCalloutImage(mapName) {
    // Returns the generic callout image (shown when "Show Callouts" clicked)
    const game = mapGuideState.selectedGame;
    const gameUpper = game.toUpperCase();

    return `images/${game}/callouts/${mapName}_MiniMap_${gameUpper}.png`;
}

// =============================================================================
// CALLOUT TOGGLE
// =============================================================================

function toggleCallouts() {
    const img = document.getElementById('mapImage');
    const btn = document.getElementById('calloutBtn');

    if (img && btn) {
        const isShowingCallouts = img.dataset.showing === 'callouts';

        if (isShowingCallouts) {
            img.src = img.dataset.baseImage;
            img.dataset.showing = 'base';
            btn.classList.remove('active');
        } else {
            img.src = img.dataset.calloutImage;
            img.dataset.showing = 'callouts';
            btn.classList.add('active');
        }
    }
}

// =============================================================================
// SELECTOR RENDERING
// =============================================================================

function renderGameSelector() {
    const container = document.getElementById('gameSelector');
    if (!container) return;

    const tabs = mapGuideConfig.games.map(game => {
        const isActive = game.id === mapGuideState.selectedGame;
        return `
            <button class="selection-tab ${isActive ? 'active' : ''}"
                    onclick="selectGame('${game.id}')">
                ${game.name}
            </button>
        `;
    }).join('');

    container.innerHTML = tabs;

    const section = container.closest('.selector-section');
    if (section) section.classList.remove('disabled');
}

function renderModeSelector() {
    const container = document.getElementById('modeSelector');
    if (!container) return;

    const section = container.closest('.selector-section');
    const isEnabled = mapGuideState.selectedGame !== null;

    if (section) {
        if (isEnabled) {
            section.classList.remove('disabled');
        } else {
            section.classList.add('disabled');
        }
    }

    const tabs = mapGuideConfig.modes.map(mode => {
        const isActive = mode === mapGuideState.selectedMode;
        return `
            <button class="selection-tab ${isActive ? 'active' : ''}"
                    onclick="selectMode('${mode}')">
                ${mode}
            </button>
        `;
    }).join('');

    container.innerHTML = tabs;
}

function isMapAvailable(game, mode, mapName) {
    const availability = mapGuideConfig.modeMapAvailability?.[game]?.[mode];
    if (!availability) return true; // If not defined, all maps available
    return availability.includes(mapName);
}

function renderMapTabs() {
    const container = document.getElementById('mapTabs');
    if (!container) return;

    const section = container.closest('.selector-section');
    const isEnabled = mapGuideState.selectedGame !== null && mapGuideState.selectedMode !== null;

    if (section) {
        if (isEnabled) {
            section.classList.remove('disabled');
        } else {
            section.classList.add('disabled');
        }
    }

    // Always use the first game's maps for consistent layout
    const game = mapGuideState.selectedGame || mapGuideConfig.games[0].id;
    const mode = mapGuideState.selectedMode;
    const maps = mapGuideConfig.mapsByGame[game] || [];

    const tabs = maps.map(map => {
        const isActive = map === mapGuideState.selectedMap;
        const isAvailable = isEnabled && isMapAvailable(game, mode, map);
        return `
            <button class="selection-tab map-tab ${isActive ? 'active' : ''} ${!isAvailable && isEnabled ? 'unavailable' : ''}"
                    onclick="${isAvailable ? `selectMap('${map}')` : ''}"
                    ${!isAvailable ? 'disabled' : ''}>
                ${map}
            </button>
        `;
    }).join('');

    container.innerHTML = tabs;
}

// =============================================================================
// SELECTION HANDLERS
// =============================================================================

function selectGame(gameId) {
    mapGuideState.selectedGame = gameId;
    mapGuideState.selectedMode = null;
    mapGuideState.selectedMap = null;

    renderGameSelector();
    renderModeSelector();
    renderMapTabs();
    renderMapGuideContent();
    updateCollapseState();
}

function selectMode(mode) {
    mapGuideState.selectedMode = mode;
    mapGuideState.selectedMap = null;

    renderModeSelector();
    renderMapTabs();
    renderMapGuideContent();
    updateCollapseState();
}

function selectMap(mapName) {
    mapGuideState.selectedMap = mapName;

    renderMapTabs();
    renderMapGuideContent();
    updateCollapseState();
}

// =============================================================================
// COLLAPSE STATE
// =============================================================================

function updateCollapseState() {
    const selectors = document.getElementById('mapGuideSelectors');

    if (!selectors) return;

    if (mapGuideState.selectedMap) {
        selectors.classList.add('faded');
    } else {
        selectors.classList.remove('faded');
    }
}

// =============================================================================
// CONTENT RENDERING
// =============================================================================

function renderMapGuideContent() {
    const container = document.getElementById('mapGuideContent');
    if (!container) return;

    const { selectedGame, selectedMode, selectedMap } = mapGuideState;

    if (!selectedGame || !selectedMode || !selectedMap) {
        let message = 'Select a game to get started';
        if (selectedGame && !selectedMode) {
            message = 'Now select a mode';
        } else if (selectedGame && selectedMode && !selectedMap) {
            message = 'Finally, select a map';
        }

        container.innerHTML = `
            <div class="map-guide-placeholder">
                <div class="placeholder-icon">🗺️</div>
                <p class="placeholder-message">${message}</p>
            </div>
        `;
        return;
    }

    const mapData = mapGuideData[selectedGame]?.[selectedMode]?.[selectedMap];

    if (!mapData) {
        container.innerHTML = `
            <div class="map-guide-placeholder">
                <p class="placeholder-message">No data available for ${selectedMap} (${selectedMode})</p>
            </div>
        `;
        return;
    }

    const mapImage = getModeImage(selectedMap, selectedMode);
    const calloutImage = getCalloutImage(selectedMap);
    const zoomLevel = getMapZoom(selectedMap);

    // Preload callout image for instant toggle
    if (calloutImage) {
        const preload = new Image();
        preload.src = calloutImage;
    }

    container.innerHTML = `
        <div class="map-display-wrapper">
            <div class="map-toolbar">
                <div class="map-toolbar-info">
                    <span class="map-toolbar-name">${selectedMap}</span>
                    <span class="map-toolbar-mode">${selectedMode}</span>
                </div>
                <button class="callout-toggle-btn" id="calloutBtn" onclick="toggleCallouts()">
                    Callouts
                </button>
            </div>
            <div class="map-display-container">
                <div class="map-display" onclick="openLightbox(document.getElementById('mapImage').src, '${selectedMap}')">
                    ${mapImage ? `
                        <img id="mapImage"
                             src="${mapImage}"
                             alt="${selectedMap} Map"
                             data-base-image="${mapImage}"
                             data-callout-image="${calloutImage}"
                             data-showing="base"
                             style="--zoom: ${zoomLevel}" />
                    ` : `
                        <div style="padding: 4rem; text-align: center; color: var(--text-secondary);">
                            <p>Map image not available</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// =============================================================================
// LIGHTBOX
// =============================================================================

function openLightbox(imageSrc, altText) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightboxImg.alt = altText + ' Map';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// =============================================================================
// INITIALIZATION
// =============================================================================

function initMapGuide() {
    renderGameSelector();
    renderModeSelector();
    renderMapTabs();
    renderMapGuideContent();
    updateCollapseState();
}
