// hooks/useNews.ts
import { useState, useEffect, useCallback } from 'react';

export type NewsType = 'headlines' | 'top' | 'all';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  categories: string[];
}

interface NewsResponse {
  data: NewsItem[] | Record<string, NewsItem[]>; // Allow object or array
  meta?: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}

interface UseNewsProps {
  type: NewsType;
  category?: string;
  page?: number;
}

export function useNews({ type, category, page = 1 }: UseNewsProps) {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type,
        page: page.toString()
      });

      if (category && category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || data.details || 'Failed to fetch news');
      }

      setNews(data);
    } catch (err) {
      console.error('News fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching news');
    } finally {
      setIsLoading(false);
    }
  }, [type, category, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    isLoading,
    error,
    refetch: fetchNews,
  };
}