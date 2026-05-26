import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import AIOutputRenderer from "./AIOutputRenderer";
import { Send, RefreshCw, Bot, User, Sparkles } from "lucide-react";

interface AIChatTutorProps {
  onSendMessage: (prompt: string, history: ChatMessage[]) => Promise<string>;
  loading: boolean;
}

const STARTER_PROMPTS = [
  "How do PID control loops prevent motor overshoot?",
  "What is the difference between I2C and SPI wiring protocols?",
  "Explain 2D LiDAR SLAM room mapping.",
];

export default function AIChatTutor({ onSendMessage, loading }: AIChatTutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello, fellow robotics engineer! I am your AI Robotics Advisor. Ask me anything about microcontrollers, closed-loop servo physics, capacitive encoders, H-bridge drivers, or write-up custom control loops!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const replyText = await onSendMessage(text, messages);

      const modelMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: `Error connecting to advisor: ${err.message || "Please secure your key parameters and retry."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Welcome back! I am your AI Robotics Advisor. What cyber-physical systems shall we investigate today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-[#050B18]/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between h-[450px] shadow-inner relative">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5 z-10">
        <span className="font-mono text-[9px] text-sky-400 uppercase tracking-wider font-bold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Interactive AI Robotics Tutor
        </span>
        <button
          onClick={clearChat}
          className="text-slate-500 hover:text-slate-300 font-mono text-[11px] flex items-center gap-0.5"
        >
          <RefreshCw className="w-2.5 h-2.5" /> Reset chat
        </button>
      </div>

      {/* Messages Scrolling Hub */}
      <div className="flex-1 overflow-y-auto px-1 space-y-4 mb-3.5 h-full scrollbar-thin scrollbar-thumb-slate-850">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 text-xs ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {/* Avatar block */}
            {m.role === "model" && (
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/35 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                m.role === "user"
                  ? "bg-sky-500 text-slate-950 font-semibold shadow-md shadow-sky-500/15"
                  : "bg-[#050B18]/90 border border-slate-800 text-slate-300"
              }`}
            >
              {m.role === "user" ? (
                <p className="font-sans text-xs">{m.text}</p>
              ) : (
                <AIOutputRenderer content={m.text} />
              )}
            </div>

            {m.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
            <div className="bg-[#050B18]/90 border border-slate-800 rounded-xl px-4 py-3 leading-relaxed flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="font-mono text-[10px] text-slate-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Prompt Chip links */}
      {messages.length === 1 && (
        <div className="mb-3 space-y-1.5">
          <span className="font-mono text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            RECOMMENDED LEARNING TOPICS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {STARTER_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="bg-slate-950 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-sky-400 p-1.5 rounded-lg border border-slate-800 hover:border-sky-500/30 font-mono transition-all text-left cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex items-center gap-2 relative z-10"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a robotics question..."
          className="flex-1 bg-slate-950 text-xs text-slate-300 placeholder-slate-500 font-mono py-2.5 px-3 rounded-lg border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
            inputValue.trim() && !loading
              ? "bg-sky-500 text-slate-950 hover:bg-sky-400 cursor-pointer"
              : "bg-slate-950 text-slate-500 border border-slate-800"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
