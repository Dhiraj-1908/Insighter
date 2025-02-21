import { NextResponse } from "next/server";
import { NewsResponse } from "./types";

export async function GET() {
  try {
    const response = await fetch(
      `https://api.mediastack.com/v1/news?access_key=${process.env.NEWS_API_KEY}&countries=in&limit=10&sort=published_desc`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news from external API");
    }

    const data: NewsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}