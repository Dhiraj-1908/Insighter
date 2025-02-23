export interface NewsMetadata {
  found: number;
  returned: number;
  limit: number;
  page: number;
}

export interface NewsItem {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  locale: string;
  similar?: NewsItem[];
}

export interface NewsResponse {
  meta: NewsMetadata;
  data: NewsItem[];
}

export type NewsCategory = 'general' | 'business' | 'entertainment' | 'health' | 'science' | 'sports' | 'technology';
export type NewsType = 'headlines' | 'top' | 'all';
