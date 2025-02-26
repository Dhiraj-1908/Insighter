import { openRouter, DEEPSEEK_MODEL } from "@/lib/openrouter";
import { searchInternet } from "@/lib/tavily";
import { Source } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Search the internet
    const searchResults = await searchInternet(lastMessage.content);
    const sources: Source[] =
      searchResults?.results?.map((result: any, index: number) => ({
        id: index.toString(),
        title: result.title,
        content: result.snippet || result.content,
        url: result.url,
        date: result.published_date || "N/A",
        domain: new URL(result.url).hostname,
        favicon: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(result.url)}&size=32`,
      })) || [];

    // Create a search context and sources list
    const searchContext = sources
      .map((source) => `Source ${source.id}: ${source.content}`)
      .join("\n\n");
    const sourcesList = sources
      .map((source) => `${source.id}. ${source.title} - ${source.url}`)
      .join("\n");

    const systemMessage = {
      role: "system",
      content: `You are an expert research assistant with real-time internet access.
       Follow these strict guidelines:
  Response Format
## means heading (bold) keep all the content after heading
please keep response in  structured format
clean bullet points 
   
    # Research Analysis
    
    ##  Summary 
    • Synthesize information from all sources in detail cover all the aspects of every source.
    • Perform comparative analysis of different perspectives
    • Highlight **key statistics** in **bold** and ⟨important dates⟩ in ⟨angle brackets⟩
    • Identify consensus points and contradictions between sources
    
    ## Critical Insights
    ▲ Top 3-5 most significant findings from analysis
    ▲ Notable trends or patterns observed
    ▲ Potential biases or limitations in sources
    
    ## Executive Conclusion
    ★ Data-driven final assessment with forward-looking perspective
    ★ Practical implications and real-world applications
    ★ Future considerations or unanswered questions
   
    ## give your detailed view in bullet points, on the query according to your intelligence keeping all the sources in frame
       the view should be as descriptive as it could be, should cover each and every aspect of all the sources and a concrete information 
       which help user to perceive correct image/information about the query. minimum of (200-250) words.

     Current search context: 
    "${searchContext}"
    
    Maintain strict adherence to:
    ✓ 100% factual accuracy with quantitative precision
    ✓ Clear differentiation between verified facts and interpretations
    ✓ Visual hierarchy using markdown elements (headers, bullets, bold)
    ✓ Academic tone with professional formatting`,
    };

    // Create the stream
    const stream = await openRouter.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [systemMessage, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    });

    // Create a text encoder for converting strings to Uint8Array
    const encoder = new TextEncoder();

    // Create a properly formatted stream that returns bytes
    const combinedStream = new ReadableStream({
      async start(controller) {
        // Send sources as SSE but properly encoded as bytes
        controller.enqueue(encoder.encode(`event: sources\ndata: ${JSON.stringify({ sources })}\n\n`));
        
        // Stream AI response as bytes
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(`data: ${content}\n\n`));
          }
        }
        controller.close();
      }
    });

    return new Response(combinedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during the request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}