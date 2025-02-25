"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message, Source } from "@/lib/types";
import { SourceBar } from "./components/SourceBar";
import WeatherWidgetSwitcher from "./api/widget/helper";
import AIResponseFormatter from "./api/chat/formatar";
import PrismaticLogo from "@/components/prismaticlogo";
import NewsDashboard from "./api/news/Newsdash";
import InsighterLogo from "@/components/prismaticlogo";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // Reset sources for new query
    setError(null);
    setSources([]);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    const assistantMessage: Message = {
      id: `temp-${Date.now()}`,
      content: "",
      role: "assistant",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("event: sources")) {
            try {
              const data = line.replace("event: sources\ndata: ", "");
              const parsedSources = JSON.parse(data).sources;
              setSources(parsedSources);

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, sources: parsedSources }
                    : msg
                )
              );
            } catch (e) {
              console.error("Error parsing sources:", e);
            }
          } else if (line.startsWith("data: ")) {
            const content = line.replace("data: ", "");
            assistantContent += content;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: assistantContent, isLoading: false }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: "An error occurred while generating the response.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#edede1]">
      <div className="max-w-7xl mx-auto w-full flex flex-col min-h-screen">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-full flex justify-start p-2 md:p-1 pb-0">
                <InsighterLogo className="h-10 md:h-20" />
              </div>
              {/* Main content area */}
              <div className="flex-grow flex flex-col md:flex-row p-4 md:p-8">
                {/* Mobile: Weather -> Input -> Trending */}
                {/* Desktop: Weather + Input side by side, Trending at bottom */}

                {/* Weather Widget Section - Full width on mobile, half on desktop */}
                <div className="md:w-1/2 w-full flex ">
                  <div className="rounded-3xl ">
                    <WeatherWidgetSwitcher />
                  </div>
                </div>

                {/* Input Section - Full width on mobile, half on desktop */}
                <div className="md:w-1/2 w-full flex items-center ">
                  <div className="w-full space-y-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                      What do you want to know?
                    </h1>
                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="relative">
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask anything..."
                          className="w-full py-4 md:py-5 px-6 text-lg rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-0 bg-white"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                        >
                          Send
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                          </svg>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Trending Section - Always at bottom */}
              <div className="w-full p-4 md:p-8 pt-0">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Trending Now
                  </h2>
                  <div className="h-[250px] overflow-hidden rounded-xl">
                    <NewsDashboard />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-full flex justify-end p-2 md:p-1 pb-0">
                <PrismaticLogo className="h-10 md:h-20" />
              </div>
              {/* Chat messages section */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 space-y-6">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full mx-auto"
                      >
                        <div
                          className={`bg-white rounded-2xl shadow-lg p-6 ${
                            message.role === "user"
                              ? "ml-auto max-w-[80%] bg-gray-800 text-black"
                              : "mr-auto max-w-[80%]"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-sm mb-2 ${
                                message.role === "user"
                                  ? "text-gray-900 font-bold"
                                  : "text-gray-500"
                              }`}
                            >
                              {message.role === "user" ? "You" : "Assistant"}
                            </span>
                            <div className="text-lg">
                              {message.role === "user" ? (
                                message.content
                              ) : (
                                <AIResponseFormatter
                                  content={message.content}
                                />
                              )}
                            </div>
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-4">
                                <SourceBar sources={message.sources} />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input section at bottom */}
              <div className="border-t p-6">
                <form
                  onSubmit={handleSubmit}
                  className="max-w-3xl mx-auto flex gap-3"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    )}
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
