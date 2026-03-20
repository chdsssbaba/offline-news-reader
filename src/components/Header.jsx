import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NetworkStatus from './NetworkStatus';
import SyncStatus from './SyncStatus';
import InstallButton from './InstallButton';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/search', label: 'Search' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="header" id="main-header">
        <div className="header-content">
          <Link to="/" className="header-logo" id="logo-link">
            <div className="header-logo-icon">⚡</div>
            NewsWave
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`header-nav-link ${isActive(to) ? 'active' : ''}`}
                id={`nav-${label.toLowerCase()}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <SyncStatus />
            <NetworkStatus />
            <InstallButton />
            <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              id="mobile-menu-open-btn"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        id="mobile-nav-overlay"
      />
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobile-nav">
        <button
          className="mobile-nav-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          id="mobile-menu-close-btn"
        >
          ✕
        </button>
        <div className="mobile-nav-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
              id={`mobile-nav-${label.toLowerCase()}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
