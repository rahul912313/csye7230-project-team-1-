"use client";

import { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
} from "@nextui-org/react";
import api from "@/lib/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Vehicle images for slideshow
const vehicleImages = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=400&fit=crop",
];

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your GoHaul assistant. I can help you with:\n\n• Booking vehicles\n• Pricing & payments\n• Finding vehicles near you\n• Cancellation policies\n• Vehicle recommendations\n\nWhat would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-4).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await api.post("/chatbot", {
        message: inputMessage,
        conversationHistory,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.reply,
        timestamp: response.data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble right now. Try asking about booking, pricing, or vehicle types!",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Quick action buttons
  const quickQuestions = [
    "How do I book a vehicle?",
    "What's your pricing?",
    "Show me sedans",
    "Can I cancel my booking?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      classNames={{
        base: "bg-gradient-to-br from-blue-50 to-purple-50",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        {/* Header with Slideshow */}
        <ModalHeader className="flex flex-col gap-0 p-0 overflow-hidden">
          {/* Image Slideshow */}
          <div className="relative w-full h-32 overflow-hidden">
            {vehicleImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={img}
                  alt={`Vehicle ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ))}
            
            {/* Header Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold drop-shadow-lg">GoHaul Assistant</h3>
                  <p className="text-sm text-white/90 drop-shadow">Ask me anything about vehicle rentals</p>
                </div>
              </div>
            </div>

            {/* Slideshow Indicators */}
            <div className="absolute top-3 right-3 flex gap-1">
              {vehicleImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="p-0">
          {/* Messages Area */}
          <div className="h-[400px] overflow-y-auto p-4 bg-white/50 backdrop-blur-sm">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      message.role === "assistant"
                        ? "bg-gradient-to-br from-blue-500 to-purple-500"
                        : "bg-gradient-to-br from-green-500 to-teal-500"
                    }`}
                  >
                    <span className="text-xl">
                      {message.role === "assistant" ? "🤖" : "👤"}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col max-w-[75%] ${
                      message.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-md ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="bg-white rounded-2xl px-5 py-3 shadow-md border border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 pb-3 bg-white/50">
              <p className="text-xs text-gray-600 mb-2 font-medium">💡 Quick questions:</p>
              <div className="flex gap-2 flex-wrap">
                {quickQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="flat"
                    className="bg-white hover:bg-blue-50 text-gray-700 text-xs"
                    onPress={() => {
                      setInputMessage(question);
                      setTimeout(handleSendMessage, 100);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Ask about vehicles, booking, pricing..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              classNames={{
                input: "text-gray-900",
                inputWrapper: "bg-gray-50 border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
              }}
              size="lg"
              startContent={<span className="text-gray-400">💬</span>}
            />
            <Button
              color="primary"
              onPress={handleSendMessage}
              isLoading={isLoading}
              isDisabled={!inputMessage.trim()}
              size="lg"
              className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 font-semibold min-w-[100px]"
            >
              {isLoading ? "..." : "Send"}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center w-full mt-2">
            Powered by AI • Always here to help 24/7
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
