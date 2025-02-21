// types.ts
export interface NewsItem {
  author: string | null;
  title: string;
  description: string;
  url: string;
  source: string;
  image: string | null;
  category: string;
  language: string;
  country: string;
  published_at: string;
}

export interface NewsResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: NewsItem[];
}

export type NewsCategory = 'general' | 'business' | 'entertainment' | 'health' | 'science' | 'sports' | 'technology';