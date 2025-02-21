// hooks/useNews.ts
import { useState, useEffect } from 'react';
import { NewsItem, NewsCategory, NewsResponse } from './types';

export function useNews(category: NewsCategory, refreshInterval: number = 300000) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchNews() {
    try {
      const response = await fetch(`/api/news?category=${category}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data: NewsResponse = await response.json();
      setNews(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchNews();
    const interval = setInterval(fetchNews, refreshInterval);
    return () => clearInterval(interval);
  }, [category, refreshInterval]);

  return { news, isLoading, error };
}