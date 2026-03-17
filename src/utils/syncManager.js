import {
  getPendingSyncActions,
  updateSyncAction,
  clearSyncedActions
} from './db';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.listeners = new Set();
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event) {
    this.listeners.forEach(cb => cb(event));
  }

  async sync() {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    this.notifyListeners({ type: 'SYNC_START' });

    try {
      const pendingActions = await getPendingSyncActions();

      if (pendingActions.length === 0) {
        this.notifyListeners({ type: 'SYNC_COMPLETE', count: 0 });
        this.isSyncing = false;
        return;
      }

      let syncedCount = 0;

      for (const action of pendingActions) {
        try {
          // Simulate server sync (in production, this would be a real API call)
          await this.processAction(action);
          await updateSyncAction(action.id, 'synced');
          syncedCount++;

          this.notifyListeners({
            type: 'ACTION_SYNCED',
            action,
            remaining: pendingActions.length - syncedCount
          });
        } catch (error) {
          console.error('Failed to sync action:', action, error);
          await updateSyncAction(action.id, 'failed');
          this.notifyListeners({ type: 'ACTION_FAILED', action, error });
        }
      }

      // Clean up synced actions
      await clearSyncedActions();

      this.notifyListeners({ type: 'SYNC_COMPLETE', count: syncedCount });
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyListeners({ type: 'SYNC_ERROR', error });
    } finally {
      this.isSyncing = false;
    }
  }

  async processAction(action) {
    // Simulate network delay for server processing
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (action.type) {
      case 'ADD_BOOKMARK':
        console.log(`[Sync] Bookmark added: ${action.data.title}`);
        break;
      case 'REMOVE_BOOKMARK':
        console.log(`[Sync] Bookmark removed: ${action.data.url}`);
        break;
      default:
        console.log(`[Sync] Unknown action type: ${action.type}`);
    }

    return true;
  }

  // Register for Background Sync if available
  async registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-bookmarks');
        console.log('[SyncManager] Background sync registered');
      } catch (error) {
        console.error('[SyncManager] Background sync registration failed:', error);
      }
    }
  }
}

// Singleton instance
const syncManager = new SyncManager();
export default syncManager;
