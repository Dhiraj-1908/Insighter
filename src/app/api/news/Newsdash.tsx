"use client";
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/tabs';
import { Badge } from '@/app/components/badge';
import { ExternalLink, Clock, Globe } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  categories: string[];
}

interface NewsResponse {
  data: NewsItem[] | Record<string, NewsItem[]>;
  meta?: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
}

const categories = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'tech',
  'politics'
] as const;

type NewsType = 'top' | 'headlines' | 'all';

const NewsDashboard = () => {
  const [activeTab, setActiveTab] = useState<NewsType>('top');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        api_token: 'GGPcs88iY1KpIEvrvWJRWRKO5YGKrS2wsgd8DdiK',
        language: 'en',
        categories: selectedCategory || ''
      });

      const response = await fetch(`https://api.thenewsapi.com/v1/news/${activeTab}?${params}`);
      const data = await response.json() as NewsResponse;

      if (!response.ok) {
        throw new Error(data.meta?.found ? String(data.meta.found) : 'Failed to fetch news');
      }

      // Type guard to check if data.data is an array or record
      const newsItems = Array.isArray(data.data) 
        ? data.data 
        : Object.values(data.data).flat();

      // Validate and transform the data to ensure it matches NewsItem interface
      const validatedNews: NewsItem[] = newsItems.map(item => ({
        title: String(item.title || ''),
        description: String(item.description || ''),
        url: String(item.url || ''),
        source: String(item.source || ''),
        published_at: String(item.published_at || new Date().toISOString()),
        categories: Array.isArray(item.categories) ? item.categories.map(String) : []
      }));

      setNews(validatedNews);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedCategory]);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4 border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600">{error}</div>
          <button 
            onClick={fetchNews}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs defaultValue="top" className="w-full" onValueChange={(value) => setActiveTab(value as NewsType)}>
        <TabsList className="mb-4">
          <TabsTrigger value="top">Top Stories</TabsTrigger>
          <TabsTrigger value="headlines">Headlines</TabsTrigger>
          <TabsTrigger value="all">All News</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant={selectedCategory === '' ? 'default' : 'secondary'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, index) => (
              <Card key={index} className="bg-white shadow hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      {item.categories.map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Globe className="w-4 h-4" />
                      <span>{item.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default NewsDashboard;