import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import syncManager from '../utils/syncManager';
import { getPendingSyncActions } from '../utils/db';

const AppContext = createContext(null);

const initialState = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  syncStatus: 'idle', // idle | syncing | synced | error
  pendingSyncCount: 0,
  lastSyncedCount: 0,
  showSyncToast: false,
  syncToastMessage: '',
  showUpdateBanner: false,
  swRegistration: null
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNC_STATUS':
      return { ...state, syncStatus: action.payload };
    case 'SET_PENDING_SYNC_COUNT':
      return { ...state, pendingSyncCount: action.payload };
    case 'SET_LAST_SYNCED_COUNT':
      return { ...state, lastSyncedCount: action.payload };
    case 'SHOW_SYNC_TOAST':
      return { ...state, showSyncToast: true, syncToastMessage: action.payload };
    case 'HIDE_SYNC_TOAST':
      return { ...state, showSyncToast: false, syncToastMessage: '' };
    case 'SET_SHOW_UPDATE_BANNER':
      return { ...state, showUpdateBanner: action.payload };
    case 'SET_SW_REGISTRATION':
      return { ...state, swRegistration: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updatePendingSyncCount = useCallback(async () => {
    try {
      const pending = await getPendingSyncActions();
      dispatch({ type: 'SET_PENDING_SYNC_COUNT', payload: pending.length });
    } catch (err) {
      console.error('Error getting pending sync count:', err);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = async () => {
      dispatch({ type: 'SET_ONLINE', payload: true });
      dispatch({
        type: 'SHOW_SYNC_TOAST',
        payload: 'You are back online!'
      });
      setTimeout(() => dispatch({ type: 'HIDE_SYNC_TOAST' }), 3000);

      // Trigger sync when coming back online
      await syncManager.sync();
      await updatePendingSyncCount();
    };

    const handleOffline = () => {
      dispatch({ type: 'SET_ONLINE', payload: false });
      dispatch({
        type: 'SHOW_SYNC_TOAST',
        payload: 'You are offline. Cached content is available.'
      });
      setTimeout(() => dispatch({ type: 'HIDE_SYNC_TOAST' }), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updatePendingSyncCount]);

  // Listen to sync events
  useEffect(() => {
    const unsubscribe = syncManager.addListener((event) => {
      switch (event.type) {
        case 'SYNC_START':
          dispatch({ type: 'SET_SYNC_STATUS', payload: 'syncing' });
          break;
        case 'SYNC_COMPLETE':
          dispatch({ type: 'SET_SYNC_STATUS', payload: 'synced' });
          dispatch({ type: 'SET_LAST_SYNCED_COUNT', payload: event.count });
          if (event.count > 0) {
            dispatch({
              type: 'SHOW_SYNC_TOAST',
              payload: `${event.count} action${event.count > 1 ? 's' : ''} synced successfully!`
            });
            setTimeout(() => dispatch({ type: 'HIDE_SYNC_TOAST' }), 3000);
          }
          updatePendingSyncCount();
          setTimeout(() => dispatch({ type: 'SET_SYNC_STATUS', payload: 'idle' }), 2000);
          break;
        case 'SYNC_ERROR':
          dispatch({ type: 'SET_SYNC_STATUS', payload: 'error' });
          break;
        case 'ACTION_SYNCED':
          updatePendingSyncCount();
          break;
        default:
          break;
      }
    });

    return unsubscribe;
  }, [updatePendingSyncCount]);

  // Initial pending sync count
  useEffect(() => {
    updatePendingSyncCount();
  }, [updatePendingSyncCount]);

  return (
    <AppContext.Provider value={{ state, dispatch, updatePendingSyncCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
