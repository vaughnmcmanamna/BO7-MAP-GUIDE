# COD Map Guide

## Project Purpose

A standalone interactive map guide for Call of Duty competitive players. This tool serves three purposes:

1. **Personal Reference** - Quick access to map callouts and objective locations while playing
2. **Community Tool** - Public resource for other COD players to learn maps
3. **Portfolio Piece** - Demonstrates frontend development and UI/UX skills

---

## Deployment

- **Platform**: GitHub Pages (static hosting)
- **URL**: TBD
- **No backend required** - Pure frontend application

---

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties (CSS variables), Flexbox, responsive design
- **Vanilla JavaScript** - No frameworks, ES6+
- **No build tools** - Direct browser execution

---

## Supported Games

Current:
- **Black Ops 6** (2024) - All ranked maps

Future:
- **Black Ops 7** (upcoming) - Structure ready to add when released

The architecture supports easy addition of new games via the `mapGuideConfig` object in `script.js`.

---

## Features

### Core Functionality
- Three-level selection: Game → Mode → Map
- Collapsible selector panel (expands map view when selection complete)
- Base map images (menu screen thumbnails)
- Callout overlay toggle (mode-specific callout images)
- Image lightbox for full-screen viewing
- Dark/light theme toggle with localStorage persistence

### Mode-Specific Content
Each game mode has custom callout images showing different information:

| Mode | Callout Image Content |
|------|----------------------|
| **Hardpoint** | Hill locations, rotations, spawns, timing |
| **Search and Destroy** | Bomb sites A/B, plant spots, common holds |
| **Control** | Zone locations, capture points, defensive positions |

---

## File Structure

```
map-guide/
├── index.html          # Main HTML file
├── styles.css          # All styles (dark theme default)
├── script.js           # All JavaScript logic
├── CLAUDE.md           # This file
└── images/
    ├── [Map]_MenuScreen_BO6.webp    # Base map images
    └── maps/
        ├── hardpoint/               # HP callout images
        │   ├── vault.webp
        │   ├── rewind.webp
        │   └── ...
        ├── snd/                     # SnD callout images
        │   └── ...
        └── control/                 # Control callout images
            └── ...
```

---

## Image Naming Convention

### Base Map Images
Located in `images/`
```
{MapName}_MenuScreen_{Game}.webp
```
Examples:
- `Vault_MenuScreen_BO6.webp`
- `RedCard_MenuScreen_BO6.webp`

### Callout Images
Located in `images/maps/{mode}/`
```
{mapname}.webp  (lowercase, no spaces)
```
Examples:
- `images/maps/hardpoint/vault.webp`
- `images/maps/snd/redcard.webp`
- `images/maps/control/protocol.webp`

---

## Adding New Content

### Adding a New Map

1. Add base image to `images/` folder
2. Add callout images to each mode folder in `images/maps/`
3. Update `mapGuideConfig.mapsByGame` in `script.js`
4. Update `getMapImage()` function with base image path
5. Update `getCalloutImage()` function filename mapping

### Adding a New Game

1. Add game to `mapGuideConfig.games` array
2. Add maps array to `mapGuideConfig.mapsByGame`
3. Add base images for all maps
4. Create callout images for all maps/modes
5. Update image helper functions

---

## Styling Guidelines

### Theme System
- Dark theme is default (`:root` variables)
- Light theme via `[data-theme="light"]` attribute
- All colors use CSS variables for consistency

### Key CSS Variables
```css
--bg-primary      /* Main background */
--bg-secondary    /* Secondary background */
--bg-card         /* Card/panel background */
--text-primary    /* Main text color */
--text-secondary  /* Muted text */
--border-color    /* Borders */
--accent-color    /* Primary accent (green) */
```

### Responsive Breakpoints
- Desktop: Default styles
- Tablet/Mobile: `@media (max-width: 1024px)`
- Small Mobile: `@media (max-width: 640px)`

---

## UI/UX Principles

1. **Progressive Disclosure** - Mode/Map selectors disabled until previous selection made
2. **Smooth Transitions** - All state changes animated (0.3-0.4s ease)
3. **Visual Feedback** - Hover states, active states, disabled states clearly indicated
4. **Mobile-First Responsiveness** - Stacked layout on smaller screens
5. **Minimal Clicks** - Get to map content in 3 clicks max

---

## Quality Standards

- Clean, readable code with comments for complex logic
- Consistent naming conventions (camelCase JS, kebab-case CSS)
- No external dependencies (fully self-contained)
- Fast load times (optimized webp images)
- Accessible (keyboard navigation, sufficient contrast)

---

## Portfolio Positioning

This project demonstrates:
- Frontend development fundamentals
- CSS architecture and theming
- JavaScript DOM manipulation and state management
- Responsive design implementation
- User-centered UI/UX design
- Clean code organization

---

## Instructions for Claude

When working on this project:

1. **Keep it simple** - No frameworks, no build tools, vanilla everything
2. **Maintain consistency** - Follow existing code patterns and naming conventions
3. **Test visually** - Changes should work in both dark and light themes
4. **Mobile matters** - Always consider responsive behavior
5. **Performance** - Keep the app fast and lightweight
6. **Self-contained** - No external API calls or dependencies

This is a static site that should work by simply opening `index.html` in a browser.
