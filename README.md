# Interactive Mini-Game

A reaction-time game built with Angular 21, Signals, and Angular Material.

Click the highlighted cell before time runs out — first to 10 points wins!

## Features
- **10×10 Reactive Grid** — CSS Grid layout, responsive to screen size
- **Configurable Timer** — set reaction window in milliseconds (min 100ms)
- **Score Tracking** — derived via Angular `computed` signals
- **Result Dialog** — Angular Material dialog on game end
- **GitHub Pages Deployment** — one-command deploy via `angular-cli-ghpages`

## Tech Stack
- **Angular 21** (Standalone Components, Zoneless)
- **Angular Signals** for state management
- **Angular Material** for UI components (buttons, inputs, dialogs)
- **Control Flow** (`@if`, `@for`)
- **SCSS** for styling
- **Karma + Jasmine** for unit tests

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Install & Run

```bash
npm install
npm start
```

Open `http://localhost:4200`.

### Run Tests

```bash
ng test --watch=false
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Project Structure

```text
src/app/
  game/
    game-board/              # 10×10 grid component
    game-controls/           # Start/restart/end controls & time input
    game-result-dialog/      # Material dialog shown on game end
    score-board/             # Player vs Computer score display
    models/                  # Cell, GameStatus, constants
    game.component.ts        # Feature entry point
    game.service.ts          # Game state & loop (Signals + setTimeout)
  app.ts                     # Root component
  app.config.ts              # Application config
```
