import { useState, useEffect, useCallback } from 'react';
import { getTopHeadlines, searchNews } from '../utils/api';
import { cacheArticles, getCachedArticles } from '../utils/db';

export function useNews(category = 'general') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsFromCache(false);

    try {
      if (navigator.onLine) {
        const freshArticles = await getTopHeadlines(category, 10);
        if (freshArticles && freshArticles.length > 0) {
          setArticles(freshArticles);
          // Cache for offline use
          await cacheArticles(freshArticles, category);
        } else {
          // Try from cache if API returned empty
          const cached = await getCachedArticles(category);
          if (cached.length > 0) {
            setArticles(cached);
            setIsFromCache(true);
          } else {
            setArticles([]);
          }
        }
      } else {
        // Load from cache when offline
        const cached = await getCachedArticles(category);
        if (cached.length > 0) {
          setArticles(cached);
          setIsFromCache(true);
        } else {
          setError('No cached articles available. Connect to the internet to fetch news.');
        }
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      // Fallback to cache on error
      try {
        const cached = await getCachedArticles(category);
        if (cached.length > 0) {
          setArticles(cached);
          setIsFromCache(true);
        } else {
          setError('Failed to load articles. Please try again.');
        }
      } catch (cacheErr) {
        setError('Failed to load articles. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, isFromCache, refetch: fetchArticles };
}

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const articles = await searchNews(query, 10);
      setResults(articles);
      if (articles.length > 0) {
        await cacheArticles(articles, 'search');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
