import { useApp } from '../context/AppContext';

export default function NetworkStatus() {
  const { state } = useApp();
  const { isOnline } = state;

  return (
    <div
      className={`network-indicator ${isOnline ? 'online' : 'offline'}`}
      role="status"
      aria-live="polite"
      id="network-status-indicator"
    >
      <span className={`network-dot ${isOnline ? 'online' : 'offline'}`} />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
