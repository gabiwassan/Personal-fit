# Plan Tracker

A mobile-first training plan tracker Progressive Web App (PWA) built with Vite, React, TypeScript, and TailwindCSS.

## Features

- 📅 **Today View**: See your workout for today, log completion, minutes, RPE, mood, and notes
- 📋 **Plan View**: View your full training plan with filtering options
- 📊 **Stats View**: Real-time analytics with charts and insights
- ⚙️ **Settings**: Manage plan dates, export/import data, reset options
- 🔒 **100% Private**: All data stored locally (localStorage), works completely offline
- 📱 **PWA**: Installable on mobile devices, works offline
- 🎯 **Auto-generated plan**: From today to 2026-02-15 following a weekly template

## Tech Stack

- **Vite** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts
- **date-fns** - Date utilities
- **vite-plugin-pwa** - PWA support

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Deploy

The app is a static SPA. Deploy the `dist/` folder to any static hosting service:

### Netlify
```bash
npm run build
# Drag and drop the dist/ folder to Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Copy dist/ contents to your gh-pages branch
```

### Any static host
Just upload the contents of `dist/` to your web server.

## Training Plan

The app auto-generates a training plan following this weekly template:

- **Monday**: Asian Walk (3+3) - 30 min intervals
- **Tuesday**: Strength A (Push + Core) - 25 min
- **Wednesday**: Rest / Family
- **Thursday**: Walk or Easy Jog - 30 min
- **Friday**: Strength B (Pull + Shoulders) - 25 min
- **Saturday**: Long Continuous Walk - 50 min
- **Sunday**: Rest / Family

## Data Storage

All data is stored in `localStorage` under the key `plan-tracker:v1`. You can:

- Export your data as JSON
- Import data (replace or merge modes)
- Reset plan/logs independently
- Factory reset everything

## PWA Features

- Installable on mobile (Add to Home Screen)
- Works offline
- Fast loading with service worker caching
- Mobile-optimized UI

## Privacy

**All data stays on your device.** No backend, no database, no tracking, no analytics. Everything runs client-side in your browser.

## License

MIT
