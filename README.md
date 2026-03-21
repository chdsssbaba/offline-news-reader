# NewsWave - Smart News Reader PWA

A resilient, installable Progressive Web App for reading news with full offline support. Built with React, Vite, and Workbox.

![NewsWave Screenshot](doc/screenshots/home-desktop.png)

## What It Does

- Browse top headlines across 8 news categories
- Bookmark articles to read later (works offline too)
- Search for news on any topic
- Install on your device like a native app
- Works offline — cached articles are always available
- Auto-syncs bookmarks when you come back online
- Shows real-time online/offline status

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + Vite 8 |
| PWA | vite-plugin-pwa + Workbox |
| Storage | IndexedDB (via `idb`) |
| Routing | React Router v7 |
| API | GNews API (free tier) |
| Styling | Vanilla CSS with glassmorphism |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-username/newswave-pwa.git
cd newswave-pwa

# Install dependencies
npm install

# Add your GNews API key (optional — demo data works without it)
cp .env.example .env
# Edit .env and add your key from https://gnews.io/register

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ArticleCard    # News article card with bookmark
│   ├── ArticleDetail  # Full article modal view
│   ├── Header         # Navigation bar with status indicators
│   ├── InstallButton  # PWA install prompt
│   ├── LoadingSkeleton # Shimmer loading states
│   ├── NetworkStatus  # Online/offline indicator
│   ├── SyncStatus     # Background sync badge
│   ├── Toast          # Notification toasts
│   └── UpdateBanner   # Service worker update prompt
├── context/           # React Context for global state
├── hooks/             # Custom hooks (useNews, useSearch)
├── pages/             # Route pages (Home, Bookmarks, Search, Offline)
├── styles/            # CSS with glassmorphism design system
└── utils/             # API client, IndexedDB, sync manager
```

## PWA Features

**Installable** — Add to home screen on mobile and desktop  
**Offline-first** — Previously viewed articles load without internet  
**Smart caching** — Cache-First for assets, Network-First for API  
**Background sync** — Offline bookmarks sync when reconnected  
**Update flow** — Users see a banner when a new version is available  

## Caching Strategy

- **Static assets** (JS, CSS, fonts, icons): Cache-First strategy
- **API responses** (news articles): Network-First with 5s timeout
- **Images**: Cache-First with 30-day expiration
- **Google Fonts**: Cache-First with 1-year expiration

## Documentation

See the [doc/](doc/) folder for detailed docs:

- [Architecture Overview](doc/ARCHITECTURE.md) — System design and data flow
- [PWA Setup Guide](doc/PWA_GUIDE.md) — Service worker and caching details
- [Offline Sync](doc/OFFLINE_SYNC.md) — How offline actions get synced

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GNEWS_API_KEY` | Your GNews API key | No (demo data used as fallback) |

## Responsive Design

The app adapts to all screen sizes:

- **Desktop** (1200px+): 3-column article grid
- **Tablet** (768px–1199px): 2-column grid
- **Mobile** (<768px): Single column with hamburger menu

## Lighthouse Score

The production build achieves 90+ on the Lighthouse PWA audit. See [doc/screenshots/](doc/screenshots/) for the audit report.
