import { useState, useEffect, useCallback } from 'react';
import { addBookmark, removeBookmark, isBookmarked } from '../utils/db';
import { useApp } from '../context/AppContext';
import { formatDate, extractDomain } from '../utils/api';

export default function ArticleCard({ article, onOpenDetail }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { state, updatePendingSyncCount } = useApp();

  useEffect(() => {
    isBookmarked(article.url).then(setBookmarked);
  }, [article.url]);

  const handleBookmark = useCallback(async (e) => {
    e.stopPropagation();
    setAnimating(true);

    try {
      if (bookmarked) {
        await removeBookmark(article.url);
        setBookmarked(false);
      } else {
        await addBookmark(article);
        setBookmarked(true);
      }
      await updatePendingSyncCount();
    } catch (err) {
      console.error('Bookmark error:', err);
    }

    setTimeout(() => setAnimating(false), 300);
  }, [bookmarked, article, updatePendingSyncCount]);

  const isPendingSync = !state.isOnline && bookmarked;

  return (
    <article
      className="article-card glass-card"
      onClick={() => onOpenDetail(article)}
      id={`article-card-${encodeURIComponent(article.url).slice(0, 30)}`}
    >
      <div className="article-card-image-wrap">
        {article.image ? (
          <img
            className="article-card-image"
            src={article.image}
            alt={article.title}
            loading="lazy"
          />
        ) : (
          <div className="article-card-image-placeholder">📰</div>
        )}
      </div>

      <div className="article-card-body">
        <div className="article-card-source">
          <span className="article-card-source-name">
            {article.source?.name || extractDomain(article.url)}
          </span>
          <span className="article-card-date">
            {formatDate(article.publishedAt)}
          </span>
        </div>

        <h2 className="article-card-title">{article.title}</h2>

        <p className="article-card-description">
          {article.description}
        </p>

        <div className="article-card-footer">
          <span className="article-card-read">
            Read more →
          </span>
          <button
            className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${isPendingSync ? 'pending-sync' : ''} ${animating ? 'animating' : ''}`}
            onClick={handleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            title={isPendingSync ? 'Pending sync' : bookmarked ? 'Bookmarked' : 'Bookmark'}
            id={`bookmark-btn-${encodeURIComponent(article.url).slice(0, 20)}`}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>
    </article>
  );
}
