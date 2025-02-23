"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/card';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/tabs';
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

type NewsType = 'top' | 'all';

const NewsDashboard = () => {
  const [activeTab, setActiveTab] = useState<NewsType>('top');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const newsItems = Array.isArray(data.data) ? data.data : Object.values(data.data).flat();
      setNews(newsItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedCategory]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (news.length === 0) return;

    const transitionTimer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % news.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(transitionTimer);
  }, [news.length]);

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
      <div className="h-full flex items-center justify-center">
        <Card className="w-full border-red-200">
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
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="top" onValueChange={(value) => setActiveTab(value as NewsType)}>
          <TabsList>
            <TabsTrigger value="top">HEADLINES</TabsTrigger>
            <TabsTrigger value="all">All News</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge
            variant={selectedCategory === '' ? 'default' : 'secondary'}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedCategory('')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {isLoading ? (
          <Card className="animate-pulse h-full">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ) : news.length > 0 ? (
          <div 
            className={`transition-opacity duration-500 h-full ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Card className="h-full bg-white shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 flex-wrap">
                    
                  </div>
                  <a
                    href={news[currentCardIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-6 right-6 text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <h3 className="font-semibold text-xl text-gray-900 mb-4 line-clamp-2">
                  {news[currentCardIndex].title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {news[currentCardIndex].description}
                </p>
                
                <div className="flex items-center gap-8 mt-12 pt-9 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{news[currentCardIndex].source}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(news[currentCardIndex].published_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No news articles found
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDashboard;