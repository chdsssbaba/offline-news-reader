# Architecture Overview

How NewsWave is structured and how data flows through the app.

## High-Level Architecture

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI["React UI Layer"]
        CTX["AppContext<br/>(State Management)"]
        SW["Service Worker<br/>(Workbox)"]
        IDB["IndexedDB<br/>(Local Storage)"]
        CACHE["Cache API<br/>(HTTP Responses)"]
    end

    subgraph External["External Services"]
        API["GNews API"]
        CDN["Image CDNs"]
    end

    UI -->|reads state| CTX
    UI -->|user actions| CTX
    CTX -->|dispatch| UI
    UI -->|fetch articles| API
    SW -->|intercepts requests| API
    SW -->|caches responses| CACHE
    CACHE -->|serves offline| SW
    UI -->|store/read articles| IDB
    UI -->|bookmark actions| IDB
    SW -->|precache assets| CACHE
    UI -->|load images| CDN
    SW -->|cache images| CACHE
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant Hook as useNews Hook
    participant API as GNews API
    participant IDB as IndexedDB
    participant SW as Service Worker

    User->>UI: Opens app / selects category
    UI->>Hook: Trigger fetch
    
    alt Online
        Hook->>API: GET /top-headlines
        SW-->>API: Intercepts request
        API-->>SW: Response
        SW-->>Hook: Serve response (cache copy)
        Hook->>IDB: Cache articles
        Hook->>UI: Display articles
    else Offline
        Hook->>IDB: Load cached articles
        IDB-->>Hook: Cached data
        Hook->>UI: Display with "cached" banner
    end
```

## Component Tree

```mermaid
graph TD
    App["App"]
    App --> BR["BrowserRouter"]
    BR --> AP["AppProvider"]
    AP --> Header
    AP --> UB["UpdateBanner"]
    AP --> Routes
    AP --> Toast

    Routes --> HP["HomePage"]
    Routes --> BP["BookmarksPage"]
    Routes --> SP["SearchPage"]
    Routes --> OP["OfflinePage"]

    Header --> NS["NetworkStatus"]
    Header --> SS["SyncStatus"]
    Header --> IB["InstallButton"]

    HP --> CT["CategoryTabs"]
    HP --> AG["ArticleGrid"]
    AG --> AC["ArticleCard"]
    AC --> BM["BookmarkButton"]
    HP --> AD["ArticleDetail"]

    BP --> AG2["ArticleGrid"]
    SP --> SI["SearchInput"]
    SP --> AG3["ArticleGrid"]
```

## State Management

The app uses React Context (`AppContext`) as a centralized store:

| State Key | Type | Purpose |
|-----------|------|---------|
| `isOnline` | boolean | Current network status |
| `syncStatus` | string | `idle` / `syncing` / `synced` / `error` |
| `pendingSyncCount` | number | Queued offline actions count |
| `showSyncToast` | boolean | Controls toast visibility |
| `showUpdateBanner` | boolean | New SW version available |

## Storage Strategy

| Store | Engine | Data |
|-------|--------|------|
| Articles | IndexedDB | Cached news articles by category |
| Bookmarks | IndexedDB | User-saved articles with timestamps |
| Sync Queue | IndexedDB | Pending offline actions (bookmark add/remove) |
| Settings | IndexedDB | User preferences |
| HTTP Cache | Cache API | API responses, fonts, images (via Service Worker) |

## Key Design Decisions

1. **Offline-first** — The UI assumes no network. Data loads from cache first, then refreshes.
2. **Separation of concerns** — Service Worker handles caching; React handles UI state.
3. **Graceful degradation** — Demo data when API key is missing; cached data when offline.
4. **No framework lock-in for SW** — Workbox configuration in `vite.config.js` generates the service worker at build time.
