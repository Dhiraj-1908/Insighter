import { Source } from "./types";

export function processTavilySources(results: any[]): Source[] {
    return results.map((result, index) => ({
      id: `${Date.now()}-${index}`, // Unique timestamp-based ID
      title: result.title,
      url: result.url,
      content: result.content || result.snippet || '',
      date: result.published_date || "N/A",
      domain: new URL(result.url).hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=32`
    }));
  }