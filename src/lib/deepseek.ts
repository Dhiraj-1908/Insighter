export async function getDeepseekCompletion(
  prompt: string,
  options: {
    temperature?: number;
    max_tokens?: number;
  } = {}
) {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not set in environment variables");
  }

  console.log("Sending request to Deepseek:", { prompt, options });

  const response = await fetch("https://api-inference.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
      stream: false,
    }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Deepseek API error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Deepseek API error: ${response.status} - ${errorText}`);
  }

  try {
    const data = await response.json();
    console.log("Deepseek response data:", data);

    if (!data.choices?.[0]?.message?.content) {
      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response format from Deepseek API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error parsing Deepseek response:", error);
    throw new Error("Failed to parse Deepseek API response");
  }
}
