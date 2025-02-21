import axios from "axios";
import { TAVILY_API_KEY } from "./config";

export async function searchInternet(query: string) {
  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query: query,
        api_key: TAVILY_API_KEY,
        search_depth: "advanced",
        include_answer: true,
        max_results: 7,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Tavily search error:", error);
    return null;
  }
}
