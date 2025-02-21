// app/api/tavily/route.ts
import { searchInternet } from '@/lib/tavily';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchInternet(query);
    
    if (!results) {
      return NextResponse.json(
        { error: 'Failed to fetch search results' },
        { status: 500 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}