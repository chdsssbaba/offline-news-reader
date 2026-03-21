import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  import('workbox-window').then(({ Workbox }) => {
    const wb = new Workbox('/sw.js');

    // Listen for service worker updates
    wb.addEventListener('waiting', () => {
      // Dispatch custom event so AppContext can show the update banner
      window.dispatchEvent(new CustomEvent('sw-update-available', { detail: { wb } }));
    });

    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    wb.register()
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration);
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });
}
