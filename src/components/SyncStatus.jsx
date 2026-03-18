import { useApp } from '../context/AppContext';

export default function SyncStatus() {
  const { state } = useApp();
  const { syncStatus, pendingSyncCount } = state;

  if (pendingSyncCount === 0 && syncStatus === 'idle') return null;

  return (
    <div
      className={`sync-badge ${syncStatus === 'syncing' ? 'syncing' : pendingSyncCount > 0 ? 'pending' : 'synced'}`}
      id="sync-status-badge"
      role="status"
      aria-live="polite"
    >
      {syncStatus === 'syncing' ? (
        <>
          <span className="sync-spinner" />
          Syncing...
        </>
      ) : pendingSyncCount > 0 ? (
        <>
          ⏳ {pendingSyncCount} pending
        </>
      ) : syncStatus === 'synced' ? (
        <>✓ Synced</>
      ) : null}
    </div>
  );
}
