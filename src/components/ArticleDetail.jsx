import { useState, useEffect, useCallback } from 'react';
import { addBookmark, removeBookmark, isBookmarked } from '../utils/db';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/api';

export default function ArticleDetail({ article, onClose }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { updatePendingSyncCount } = useApp();

  useEffect(() => {
    isBookmarked(article.url).then(setBookmarked);
  }, [article.url]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBookmark = useCallback(async () => {
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
  }, [bookmarked, article, updatePendingSyncCount]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="article-detail-overlay"
      onClick={handleOverlayClick}
      id="article-detail-overlay"
    >
      <div className="article-detail" role="dialog" aria-modal="true" id="article-detail-modal">
        <div className="article-detail-image-wrap">
          {article.image ? (
            <img
              className="article-detail-image"
              src={article.image}
              alt={article.title}
            />
          ) : (
            <div className="article-card-image-placeholder" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              📰
            </div>
          )}
          <button
            className="article-detail-close"
            onClick={onClose}
            aria-label="Close article"
            id="article-detail-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="article-detail-body">
          <div className="article-detail-source">
            <span className="article-detail-source-name">
              {article.source?.name || 'Unknown Source'}
            </span>
            <span className="article-detail-date">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-detail-content">
            <p>{article.content || article.description}</p>
          </div>

          <div className="article-detail-actions">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="article-detail-link"
              id="read-full-article-link"
            >
              📖 Read Full Article
            </a>

            <button
              className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              id="article-detail-bookmark-btn"
              style={{ fontSize: '1.3rem' }}
            >
              {bookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
