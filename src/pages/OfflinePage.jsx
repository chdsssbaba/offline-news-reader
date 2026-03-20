import { Link } from 'react-router-dom';

export default function OfflinePage() {
  return (
    <main className="main-content" id="offline-page">
      <div className="offline-page">
        <div className="offline-page-icon">📡</div>
        <h1 className="offline-page-title">You're Offline</h1>
        <p className="offline-page-hint">
          This page isn't available offline. You can still browse your previously viewed articles
          and check your bookmarks.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="retry-btn" id="go-home-btn">
            🏠 Go Home
          </Link>
          <Link to="/bookmarks" className="retry-btn" id="go-bookmarks-btn" style={{ background: 'var(--gradient-warm)' }}>
            🔖 View Bookmarks
          </Link>
        </div>
      </div>
    </main>
  );
}
