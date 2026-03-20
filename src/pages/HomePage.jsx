import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { CATEGORIES } from '../utils/api';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function HomePage() {
  const [category, setCategory] = useState('general');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { articles, loading, error, isFromCache, refetch } = useNews(category);

  return (
    <main className="main-content" id="home-page">
      <div className="page-header">
        <h1 className="page-title">Today's Headlines</h1>
        <p className="page-subtitle">Stay informed with the latest news from around the world</p>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs" role="tablist" aria-label="News categories" id="category-tabs">
        {CATEGORIES.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`category-tab ${category === id ? 'active' : ''}`}
            onClick={() => setCategory(id)}
            role="tab"
            aria-selected={category === id}
            id={`category-tab-${id}`}
          >
            <span className="category-tab-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Cache indicator */}
      {isFromCache && (
        <div className="cache-banner" id="cache-banner">
          📦 Showing cached articles. Connect to the internet for fresh content.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <div className="error-state" id="error-state">
          <div className="error-state-icon">⚠️</div>
          <h2 className="error-state-title">Oops!</h2>
          <p className="error-state-description">{error}</p>
          <button className="retry-btn" onClick={refetch} id="retry-btn">
            🔄 Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-state-icon">📭</div>
          <h2 className="empty-state-title">No articles found</h2>
          <p className="empty-state-description">
            No news available for this category right now. Try a different category or check back later.
          </p>
        </div>
      ) : (
        <div className="articles-grid" id="articles-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.url}
              article={article}
              onOpenDetail={setSelectedArticle}
            />
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </main>
  );
}
