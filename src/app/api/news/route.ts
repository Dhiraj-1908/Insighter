// app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'top';
    const category = searchParams.get('category');

    const apiParams = new URLSearchParams({
      api_token: 'GGPcs88iY1KpIEvrvWJRWRKO5YGKrS2wsgd8DdiK',
      language: 'en',
      limit: '10'
    });

    if (category) {
      apiParams.append('categories', category);
    }

    const response = await fetch(
      `https://api.thenewsapi.com/v1/news/${type}?${apiParams}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}