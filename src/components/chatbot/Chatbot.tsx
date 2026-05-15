"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const postendPoint =
    "https://nbttrereyf.execute-api.us-east-1.amazonaws.com/prod/api/chatbot";

  const toggleChat = () => {
    trackEvent(isOpen ? "chatbot_close" : "chatbot_open", {
      category: "engagement",
    });
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() === "") return;
    trackEvent("chatbot_message_submit", {
      category: "engagement",
      message_length: inputValue.trim().length,
    });

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsBotTyping(true);

    try {
      // Send POST request to backend
      const response = await fetch(postendPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from backend");
      }

      const data = await response.json();
      const botResponseText =
        data.response || "Sorry, I couldn't process your request.";

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      trackEvent("chatbot_response_success", {
        category: "engagement",
      });
    } catch (error) {
      console.error("Error fetching bot response:", error);
      trackEvent("chatbot_response_error", {
        category: "engagement",
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error connecting to the chatbot. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Auto-scroll to bottom when messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[onClick="toggleChat"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Icon */}
      <button
        onClick={(e) => { toggleChat();  e.stopPropagation()}}
        data-analytics-event="chatbot_toggle_click"
        data-analytics-category="engagement"
        aria-label="Toggle chatbot"
        className="bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 transition-all"
      >
        <Image
          src="/images/ai/chatbot.svg"
          width={62}
          height={62}
          alt="chatbot"
        />
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed  bottom-6 md:bottom-26 mt-8 right-0 w-80  h-[400px] md:h-[470px] bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-800 p-4 text-white font-medium flex items-center">
            <Image
              src="/images/ai/chatbot.svg"
              width={32}
              height={32}
              alt="chatbot"
              className="mr-2"
            />
            <span>Universal Perk Chatbot</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 px-4 py-6 overflow-y-auto bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 max-w-[80%] ${
                  message.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-700 text-gray-100"
                } rounded-lg p-3`}
              >
                {message.text}
              </div>
            ))}
            {isBotTyping && (
              <div className="mb-4 max-w-[80%] mr-auto bg-gray-700 rounded-lg p-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-gray-800 flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask anything here"
              className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
              disabled={isBotTyping}
            />
            <button
              type="submit"
              data-analytics-event="chatbot_submit_click"
              data-analytics-category="engagement"
              aria-label="Send chatbot message"
              className={` text-white rounded-r-lg px-4 py-2  cursor-pointer${
                isBotTyping ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isBotTyping}
            >
              <Image
                src={"/images//ai/send.svg"}
                width={39}
                height={39}
                alt="send icon"
              />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
