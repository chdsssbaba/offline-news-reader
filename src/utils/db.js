import { openDB } from 'idb';

const DB_NAME = 'newswave-db';
const DB_VERSION = 1;

const STORES = {
  ARTICLES: 'articles',
  BOOKMARKS: 'bookmarks',
  SYNC_QUEUE: 'sync-queue',
  SETTINGS: 'settings'
};

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Articles store - cached news articles
      if (!db.objectStoreNames.contains(STORES.ARTICLES)) {
        const articleStore = db.createObjectStore(STORES.ARTICLES, { keyPath: 'url' });
        articleStore.createIndex('category', 'category');
        articleStore.createIndex('cachedAt', 'cachedAt');
      }

      // Bookmarks store - user bookmarked articles
      if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
        const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'url' });
        bookmarkStore.createIndex('bookmarkedAt', 'bookmarkedAt');
      }

      // Sync queue store - pending offline actions
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('status', 'status');
        syncStore.createIndex('createdAt', 'createdAt');
      }

      // Settings store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    }
  });
}

// ---- Article Operations ----
export async function cacheArticles(articles, category = 'general') {
  const db = await getDB();
  const tx = db.transaction(STORES.ARTICLES, 'readwrite');
  const store = tx.objectStore(STORES.ARTICLES);

  for (const article of articles) {
    await store.put({
      ...article,
      category,
      cachedAt: Date.now()
    });
  }

  await tx.done;
}

export async function getCachedArticles(category = null) {
  const db = await getDB();

  if (category) {
    return db.getAllFromIndex(STORES.ARTICLES, 'category', category);
  }

  return db.getAll(STORES.ARTICLES);
}

export async function getCachedArticle(url) {
  const db = await getDB();
  return db.get(STORES.ARTICLES, url);
}

// ---- Bookmark Operations ----
export async function addBookmark(article) {
  const db = await getDB();
  await db.put(STORES.BOOKMARKS, {
    ...article,
    bookmarkedAt: Date.now(),
    synced: navigator.onLine
  });

  // Add to sync queue if offline
  if (!navigator.onLine) {
    await addToSyncQueue({
      type: 'ADD_BOOKMARK',
      data: { url: article.url, title: article.title },
      status: 'pending'
    });
  }
}

export async function removeBookmark(url) {
  const db = await getDB();
  await db.delete(STORES.BOOKMARKS, url);

  if (!navigator.onLine) {
    await addToSyncQueue({
      type: 'REMOVE_BOOKMARK',
      data: { url },
      status: 'pending'
    });
  }
}

export async function getBookmarks() {
  const db = await getDB();
  const bookmarks = await db.getAll(STORES.BOOKMARKS);
  return bookmarks.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
}

export async function isBookmarked(url) {
  const db = await getDB();
  const bookmark = await db.get(STORES.BOOKMARKS, url);
  return !!bookmark;
}

// ---- Sync Queue Operations ----
export async function addToSyncQueue(action) {
  const db = await getDB();
  await db.add(STORES.SYNC_QUEUE, {
    ...action,
    createdAt: Date.now()
  });
}

export async function getPendingSyncActions() {
  const db = await getDB();
  return db.getAllFromIndex(STORES.SYNC_QUEUE, 'status', 'pending');
}

export async function updateSyncAction(id, status) {
  const db = await getDB();
  const action = await db.get(STORES.SYNC_QUEUE, id);
  if (action) {
    action.status = status;
    action.updatedAt = Date.now();
    await db.put(STORES.SYNC_QUEUE, action);
  }
}

export async function clearSyncedActions() {
  const db = await getDB();
  const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
  const store = tx.objectStore(STORES.SYNC_QUEUE);
  const index = store.index('status');
  
  let cursor = await index.openCursor('synced');
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  
  await tx.done;
}

export async function getAllSyncActions() {
  const db = await getDB();
  const actions = await db.getAll(STORES.SYNC_QUEUE);
  return actions.sort((a, b) => b.createdAt - a.createdAt);
}

// ---- Settings Operations ----
export async function saveSetting(key, value) {
  const db = await getDB();
  await db.put(STORES.SETTINGS, { key, value });
}

export async function getSetting(key) {
  const db = await getDB();
  const setting = await db.get(STORES.SETTINGS, key);
  return setting?.value;
}

export { STORES };
