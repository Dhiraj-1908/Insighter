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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f0f0e4] to-[#e2e2d6] bg-pattern">
      <div className="max-w-7xl mx-auto w-full flex flex-col min-h-screen">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-full flex justify-start p-4 pb-0">
                <InsighterLogo className="h-12 md:h-20 drop-shadow-md filter hover:brightness-110 transition-all duration-300" />
              </div>
              {/* Main content area */}
              <div className="flex-grow flex flex-col md:flex-row p-6 md:p-10 gap-10">
                {/* Weather Widget Section - Full width on mobile, half on desktop */}
                <div className="md:w-1/3 w-full flex">
                  <div className="rounded-3xl w-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl overflow-hidden ring-1 ring-black ring-opacity-5">
                    <WeatherWidgetSwitcher />
                  </div>
                </div>
                {/* Input Section - Full width on mobile, half on desktop */}
                <div className="md:w-2/3 w-full flex items-center">
                  <div className="w-full space-y-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                        What do you want to know?
                      </span>
                    </h1>
                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="relative flex items-center">
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask anything..."
                          rows={1}
                          className="w-full py-5 md:py-6 pl-3 pr-32 text-lg rounded-2xl shadow-xl focus:ring-2 focus:ring-gray-600 focus:outline-none border-0 bg-white text-gray-900 placeholder-gray-500 resize-none overflow-auto transition-shadow duration-300 hover:shadow-2xl"
                          style={{
                            minHeight: "70px",
                            maxHeight: "200px",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                          onInput={(e) => {
                            // Type cast the event target to HTMLTextAreaElement
                            const textarea = e.target as HTMLTextAreaElement;
                            textarea.style.height = "auto";
                            textarea.style.height =
                              Math.min(textarea.scrollHeight, 200) + "px";
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (e.shiftKey) {
                                // Allow Shift+Enter for new line
                                return;
                              } else {
                                // Submit on Enter (without Shift)
                                e.preventDefault();
                                handleSubmit();
                              }
                            }
                          }}
                        />
                        <button
                          type="submit"
                          className="absolute right-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-7 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:translate-y-[-2px] focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 focus:outline-none"
                        >
                          <span className="font-medium">Send</span>
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
              <div className="w-full p-6 md:p-10 pt-2">
                <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl ring-1 ring-black ring-opacity-5">
                  <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-800"
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
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                      Trending Now
                    </span>
                  </h2>
                  <div className="h-[250px] overflow-hidden rounded-xl shadow-inner ring-1 ring-black ring-opacity-5">
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
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-full flex justify-end p-3 md:p-4">
                <PrismaticLogo className="h-10 md:h-16 drop-shadow-md filter hover:brightness-110 transition-all duration-300" />
              </div>
              {/* Chat messages section */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 space-y-8">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`w-full mx-auto flex ${
                          message.role === "user"
                            ? "justify-stretch"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl shadow-lg p-5 md:p-6 ${
                            message.role === "user"
                              ? "bg-white text-black border-l-4 border-gray-800"
                              : "bg-white border-l-4 border-gray-300"
                          } ${
                            message.role === "user"
                              ? "max-w-[100%] sm:max-w-[80%]"
                              : "max-w-[100%] sm:max-w-[90%] md:max-w-[85%]"
                          } ring-1 ring-black ring-opacity-5 hover:shadow-xl transition-shadow duration-300`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-sm mb-3 ${
                                message.role === "user"
                                  ? "text-gray-800 font-bold"
                                  : "text-gray-500 font-medium"
                              }`}
                            >
                              {message.role === "user" ? "You" : "Assistant"}
                            </span>
                            <div className="text-base md:text-lg break-words leading-relaxed">
                              {message.role === "user" ? (
                                message.content
                              ) : (
                                <AIResponseFormatter
                                  content={message.content}
                                />
                              )}
                            </div>
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-5 pt-4 border-t border-gray-200">
                                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                                  Sources:
                                </span>
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
              {/* Improved input section at bottom */}
              <div className="border-t border-gray-200 p-4 pl-9 backdrop-blur-md">
                <form
                  onSubmit={handleSubmit}
                  className="max-w-3xl mx-auto flex gap-3 items-start"
                >
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask anything..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 text-lg resize-none shadow-md text-gray-900 transition-all  duration-300 hover:shadow-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                      rows={1}
                      style={{
                        overflow: "auto",
                        minHeight: "58px",
                        maxHeight: "200px",
                        lineHeight: "1.5",
                        transition: "height 0.2s ease-in-out",
                      }}
                      onInput={(e) => {
                        const textarea = e.target as HTMLTextAreaElement;
                        textarea.style.height = "auto";
                        const newHeight = Math.min(textarea.scrollHeight, 200);
                        textarea.style.height = newHeight + "px";

                        // Adjust button position when textarea grows
                        const form = textarea.closest("form");
                        if (form) {
                          const button = form.querySelector("button");
                          if (button && newHeight > 100) {
                            button.classList.add("self-start", "mt-2");
                          } else if (button) {
                            button.classList.remove("self-start", "mt-2");
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (e.shiftKey) {
                            // Allow Shift+Enter for new line
                            return;
                          } else {
                            // Submit on Enter (without Shift)
                            e.preventDefault();
                            handleSubmit();
                          }
                        }
                      }}
                    />
                    <div className="absolute right-4 bottom-4 text-xs text-gray-400 select-none">
                      {input.length > 0 && `${input.length} characters`}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="h-14 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:translate-y-[-2px] focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 focus:outline-none sticky top-0"
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
                    <span className="font-medium">Send</span>
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
