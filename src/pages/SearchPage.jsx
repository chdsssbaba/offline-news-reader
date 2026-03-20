import { useState, useCallback } from 'react';
import { useSearch } from '../hooks/useNews';
import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { results, loading, error, search } = useSearch();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    }
  }, [query, search]);

  return (
    <main className="main-content" id="search-page">
      <div className="page-header">
        <h1 className="page-title">Search News</h1>
        <p className="page-subtitle">Find articles on any topic from around the world</p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="search-container" id="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search for news topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search news"
            id="search-input"
          />
        </div>
      </form>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : error ? (
        <div className="error-state" id="search-error">
          <div className="error-state-icon">⚠️</div>
          <h2 className="error-state-title">Search Failed</h2>
          <p className="error-state-description">{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="articles-grid" id="search-results-grid">
          {results.map((article) => (
            <ArticleCard
              key={article.url}
              article={article}
              onOpenDetail={setSelectedArticle}
            />
          ))}
        </div>
      ) : query && !loading ? (
        <div className="empty-state" id="search-empty-state">
          <div className="empty-state-icon">🔎</div>
          <h2 className="empty-state-title">No results found</h2>
          <p className="empty-state-description">
            Try different keywords or broaden your search.
          </p>
        </div>
      ) : null}

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </main>
  );
}
