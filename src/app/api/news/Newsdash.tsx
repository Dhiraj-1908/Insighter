"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/app/components/card';
import { ExternalLink, Clock, Globe } from 'lucide-react';
import { NewsItem } from '@/app/api/news/types';
import { Badge } from '@/app/components/badge';

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data.data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const refreshInterval = setInterval(fetchNews, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === news.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [news.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="animate-pulse h-48">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="border-red-200 h-48">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-full">
              <p className="text-red-600 font-medium">Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {news[currentIndex] && (
          <motion.div
            key={news[currentIndex].title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 h-48">
              <CardContent className="p-6">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Breaking News
                    </Badge>
                    <a
                      href={news[currentIndex].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded-full"
                      aria-label="Open article in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <div className="flex-grow overflow-hidden">
                    <h3 className="font-semibold text-xl text-gray-900 leading-tight mb-2 line-clamp-2">
                      {news[currentIndex].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {news[currentIndex].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="font-medium">{news[currentIndex].source}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(news[currentIndex].published_at)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default NewsTicker;