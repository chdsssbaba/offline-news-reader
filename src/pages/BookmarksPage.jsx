import { useState, useEffect, useCallback } from 'react';
import { getBookmarks } from '../utils/db';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const loadBookmarks = useCallback(async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Refresh bookmarks when detail modal closes (bookmark might have changed)
  const handleCloseDetail = useCallback(() => {
    setSelectedArticle(null);
    loadBookmarks();
  }, [loadBookmarks]);

  return (
    <main className="main-content" id="bookmarks-page">
      <div className="bookmarks-header">
        <div>
          <h1 className="page-title">Your Bookmarks</h1>
          <p className="page-subtitle">
            {bookmarks.length > 0
              ? `${bookmarks.length} saved article${bookmarks.length !== 1 ? 's' : ''}`
              : 'Save articles to read later, even offline'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-image" />
              <div className="skeleton-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line title long" />
                <div className="skeleton-line medium" />
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state" id="bookmarks-empty-state">
          <div className="empty-state-icon">🔖</div>
          <h2 className="empty-state-title">No bookmarks yet</h2>
          <p className="empty-state-description">
            Tap the star icon on any article to bookmark it. Your bookmarks are always available, even offline.
          </p>
        </div>
      ) : (
        <div className="articles-grid" id="bookmarks-grid">
          {bookmarks.map((article) => (
            <ArticleCard
              key={article.url}
              article={article}
              onOpenDetail={setSelectedArticle}
            />
          ))}
        </div>
      )}

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={handleCloseDetail}
        />
      )}
    </main>
  );
}
